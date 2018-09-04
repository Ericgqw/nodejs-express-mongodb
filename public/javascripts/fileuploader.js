
var FileUploader = function(inputObj, idx, type, path, nowUpload) {
    this.input = inputObj;
    this.idx = idx;
    this.type = type;
    this.PATH = path;
    this.nowUpload = nowUpload;
}

FileUploader.prototype = {
    init:function(fileNamex, fileDescx) {
        var wu = this;
         var html = '<div class="uploader">'
           + '<div class="queueList">'
           +  ' <div class="placeholder">'
           +  '     <div id="filePicker-' + this.idx + '" class="filePicker"></div>'
           +  ' </div>'
           +  '</div>'
           + '<div class="statusBar" style="display:none;">'
           + '  <div class="progress">'
           + '      <span class="text">0%</span>'
           + '       <span class="percentage"></span>'
           + '  </div><div class="info"></div>'
           + '   <div class="btns">'
           + '       <div id="filePicker2-' + this.idx + '" class="filePicker2"></div><div class="uploadBtn">开始上传</div>'
           + '   </div>'
           + '</div></div>';
       var $wrap = $(html);
       $wrap.insertAfter(wu.input);
       this.$wrap = $wrap;

        var $queue = $( '<ul class="filelist"></ul>' )
                .appendTo( $wrap.find( '.queueList' ) ),
            $statusBar = $wrap.find( '.statusBar' ),
            $info = $statusBar.find( '.info' ),
            $upload = $wrap.find( '.uploadBtn' ),
            $placeHolder = $wrap.find( '.placeholder' ),
            $progress = $statusBar.find( '.progress' ).hide(),
            fileCount = 0,
            fileSize = 0,
            canFileCount = 0,

            ratio = window.devicePixelRatio || 1,
            thumbnailWidth = 110 * ratio,
            thumbnailHeight = 110 * ratio,

            // pedding, ready, uploading, confirm, done.
            state = 'pedding',

            // file progress，key file id
            percentages = {},

            //file path
            fileDesc = fileDescx != undefined ? fileDescx : {},
            fileName = fileNamex != undefined ? fileNamex : {},
            uploader;
        
            if(wu.nowUpload) {
                $upload.hide();
            }

            uploader = WebUploader.create({
                pick: {
                    id: '#filePicker-' + wu.idx,
                    label: (wu.type=="file" ? '点击选择文件' : '点击选择图片')
                },
                chunked: false,
                chunkSize: 512 * 1024,
                server: wu.PATH + '/form/upload.htm',
                disableGlobalDnd: true,
                fileNumLimit: 300,
            });

            uploader.on( 'dndAccept', function( items ) {
                var denied = false,
                    len = items.length,
                    i = 0,
                    unAllowed = 'text/plain;application/javascript ';

                for ( ; i < len; i++ ) {
                    if ( ~unAllowed.indexOf( items[ i ].type ) ) {
                        denied = true;
                        break;
                    }
                }

                return !denied;
            });

            uploader.addButton({
                id: '#filePicker2-' + wu.idx,
                label: '继续添加'
            });

            uploader.on('ready', function() {
                window.uploader = uploader;
            });

            function addFile( file ) {
                var $li = $( '<li id="' + file.id + '" title="'+ file.name +'">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"><i class="icon iconfont icon-file" style="font-size:32px;"></i></p>'+
                        '<p class="progress"><span></span></p>' +
                        '</li>' ),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span>' +
                        '</div>').appendTo( $li ),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find( 'p.imgWrap' ),
                    $info = $('<p class="error"></p>'),

                    showError = function( code ) {
                        switch( code ) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;

                            case 'interrupt':
                                text = '上传暂停';
                                break;

                            default:
                                text = '上传失败，请重试';
                                break;
                        }

                        $info.text( text ).appendTo( $li );
                    };

                    $prgress.parent().hide();

                    if (file.getStatus() === 'invalid' ) {
                        showError( file.statusText );
                    } else {
                        if(wu.type == "img") {
                            uploader.makeThumb( file, function( error, src ) {
                                var img;
                                if ( error ) {
                                    $wrap.text( '不能预览' );
                                    return;
                                }
                                img = $('<img src="'+src+'">');
                                $wrap.empty().append( img );

                            }, thumbnailWidth, thumbnailHeight );
                        }
                        percentages[ file.id ] = [ file.size, 0 ];
                        file.rotation = 0;
                    }

                file.on('statuschange', function( cur, prev ) {
                    if ( prev === 'progress' ) {
                        $prgress.hide().width(0);
                    }
                    if ( cur === 'error' || cur === 'invalid' ) {
                        console.log( file.statusText );
                        showError( file.statusText );
                        percentages[ file.id ][ 1 ] = 1;
                    } else if ( cur === 'interrupt' ) {
                        showError( 'interrupt' );
                    } else if ( cur === 'queued' ) {
                        percentages[ file.id ][ 1 ] = 0;
                    } else if ( cur === 'progress' ) {
                        $info.remove();
                        $prgress.parent().show();
                        $prgress.css('display', 'block');
                    } else if ( cur === 'complete' ) {
                        $li.append( '<span class="success"></span>' );
                        $prgress.parent().hide();
                    }

                    $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
                });

                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });

                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });

                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;

                    switch ( index ) {
                        case 0:
                            uploader.removeFile( file );
                            canFileCount--;
                            return;
                    }
                });

                $li.appendTo( $queue );
                canFileCount++;
            }

            function addFileDesc(file) {
                var $li = $( '<li id="' + file.id + '" title="'+ file.name +'">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"><i class="icon iconfont icon-file" style="font-size:32px;"></i></p>'+
                        '<p class="progress"><span></span></p>' +
                        '</li>' ),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span>' +
                        '</div>').appendTo( $li ),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find( 'p.imgWrap' ),
                    $info = $('<p class="error"></p>');

                $prgress.parent().hide();

                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });

                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });

                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;

                    switch ( index ) {
                        case 0:
                            removeFile( file );
                            return;
                    }
                });

                $li.appendTo( $queue );
                $li.append( '<span class="success"></span>' );

                setState('ready');
                $statusBar.show();
                
                fileCount++;
            }
        
           function addImageDesc(file) {
                var $li = $( '<li id="' + file.id + '" title="'+ file.name +'">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"></p>'+
                        '<p class="progress"><span></span></p>' +
                        '</li>' ),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span>' +
                        '</div>').appendTo( $li ),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find( 'p.imgWrap' ),
                    $info = $('<p class="error"></p>');

                $prgress.parent().hide();
               
                var imgSrc = wu.PATH + "/" + file.src;
                var img = $('<img src="'+imgSrc+'">');
                $wrap.empty().append( img );

                $li.on( 'mouseenter', function() {
                    $btns.stop().animate({height: 30});
                });

                $li.on( 'mouseleave', function() {
                    $btns.stop().animate({height: 0});
                });

                $btns.on( 'click', 'span', function() {
                    var index = $(this).index(),
                        deg;

                    switch ( index ) {
                        case 0:
                            removeFile( file );
                            return;
                    }
                });

                $li.appendTo( $queue );
                $li.append( '<span class="success"></span>' );

                setState('ready');
                $statusBar.show();
               
                fileCount++;
            }

            function removeFile( file ) {
                var $li = $('#'+file.id);

                delete percentages[ file.id ];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
                var filePath = fileDesc[file.id];
                delete fileDesc[file.id];
                delete fileName[file.id];
                if(filePath) {
                    $.ajax({
                       type: "POST",
                       url: wu.PATH + "/form/del_file.htm",
                       data: {imgPath:filePath},
                       dataType : "json",
                       success: function(suc){
                       },
                       error:function() {
                          layer.alert('文件删除失败!', {icon: 0});
                       }
                    });
                }
                
                fileCount--;
                if ( !fileCount ) {
                    setState( 'pedding' );
                }

                if(wu.type == "img") {
                    updateImageInput();
                } else {
                    updateFileInput();
                }
            }
        
            function updateFileInput() {
                var paths = "";
                for(var fd in fileDesc) {
                    paths += fileName[fd];
                    paths += ":"
                    paths += fileDesc[fd];
                    paths += ",";
                }
                wu.input.val(paths);
            }
        
            function updateImageInput() {
                var paths = "";
                for(var fd in fileDesc) {
                    paths += fileDesc[fd];
                    paths += ",";
                }
                wu.input.val(paths);
            }

            function updateTotalProgress() {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children(),
                    percent;

                $.each( percentages, function( k, v ) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                } );

                percent = total ? loaded / total : 0;
                spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
                spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
                updateStatus();
            }

            function updateStatus() {
                var text = '', stats;

                if ( state === 'ready' ) {
                    text = '选中' + fileCount + '个文件，共' +
                            WebUploader.formatSize( fileSize ) + '。';
                } else if ( state === 'confirm' ) {
                    stats = uploader.getStats();
                    if ( stats.uploadFailNum ) {
                        text = '已成功上传' + stats.successNum+ '文件，'+
                            stats.uploadFailNum + '文件上传失败，<a class="retry" href="#">重新上传</a>失败文件'
                    }

                } else {
                    stats = uploader.getStats();
                    text = '共' + fileCount + '个（' +
                            WebUploader.formatSize( fileSize )  +
                            '），已上传' + stats.successNum + '个文件';

                    if ( stats.uploadFailNum ) {
                        text += '，失败' + stats.uploadFailNum + '张';
                    }
                }

                $info.html( text );
            }

            function setState( val ) {
                var file, stats;

                if ( val === state ) {
                    return;
                }

                $upload.removeClass( 'state-' + state );
                $upload.addClass( 'state-' + val );
                state = val;

                switch ( state ) {
                    case 'pedding':
                        $placeHolder.removeClass( 'element-invisible' );
                        $queue.hide();
                        $statusBar.addClass( 'element-invisible' );
                        uploader.refresh();
                        break;

                    case 'ready':
                        $placeHolder.addClass( 'element-invisible' );
                        $( '#filePicker2-' + wu.idx ).removeClass( 'element-invisible');
                        $queue.show();
                        $statusBar.removeClass('element-invisible');
                        uploader.refresh();
                        break;

                    case 'uploading':
                        $( '#filePicker2-' + wu.idx ).addClass( 'element-invisible' );
                        $progress.show();
                        $upload.text( '暂停上传' );
                        break;

                    case 'paused':
                        $progress.show();
                        $upload.text( '继续上传' );
                        break;

                    case 'confirm':
                        $progress.hide();
                        $upload.text( '开始上传' ).addClass( 'disabled' );

                        stats = uploader.getStats();
                        if ( stats.successNum && !stats.uploadFailNum ) {
                            setState( 'finish' );
                            return;
                        }
                        break;
                    case 'finish':
                        stats = uploader.getStats();
                        if (stats.successNum) {
                            $upload.removeClass("disabled");
                            $( '#filePicker2-' + wu.idx ).removeClass( 'element-invisible' );
                            
                            if(wu.type == "img") {
                                updateImageInput();
                            } else {
                                updateFileInput();
                            }
                        } else {
                            state = 'done';
                        }
                        break;
                }

                updateStatus();
            }

            uploader.onUploadProgress = function( file, percentage ) {
                var $li = $('#'+file.id),
                    $percent = $li.find('.progress span');

                $percent.css( 'width', percentage * 100 + '%' );
                percentages[ file.id ][ 1 ] = percentage;
                updateTotalProgress();
            };

            uploader.onFileQueued = function( file ) {
                fileCount++;
                fileSize += file.size;

                if ( fileCount === 1 ) {
                    $placeHolder.addClass( 'element-invisible' );
                    $statusBar.show();
                }

                addFile( file );
                setState( 'ready' );
                updateTotalProgress();
                
                if(wu.nowUpload) {
                    $upload.trigger("click");
                }
            };

            uploader.on('uploadSuccess', function(file, response) {
                var json = eval('(' + response._raw + ')');
                fileDesc[file.id] = json.value[0];
                fileName[file.id] = file.name;
            });

            uploader.onFileDequeued = function( file ) {
                fileSize -= file.size;

                removeFile( file );
                updateTotalProgress();
            };

            uploader.on( 'all', function( type ) {
                var stats;
                switch( type ) {
                    case 'uploadFinished':
                        setState( 'confirm' );
                        break;

                    case 'startUpload':
                        setState( 'uploading' );
                        break;

                    case 'stopUpload':
                        setState( 'paused' );
                        break;
                }
            });

            uploader.onError = function( code ) {
                if(code == "F_DUPLICATE") {
                    layer.msg("该文件已存在");
                }
            };

            $upload.on('click', function() {
                if ( $(this).hasClass( 'disabled' ) || canFileCount <= 0) {
                    return false;
                }

                if ( state === 'ready' ) {
                    uploader.upload();
                } else if ( state === 'paused' ) {
                    uploader.upload();
                } else if ( state === 'uploading' ) {
                    uploader.stop();
                }
            });

            $info.on( 'click', '.retry', function() {
                uploader.retry();
            } );

            $info.on( 'click', '.ignore', function() {
            } );

            $upload.addClass( 'state-' + state );
            updateTotalProgress();

            if(wu.type == "img") {
                if(!$.isEmptyObject(fileDesc)) {
                   for(var key in fileDesc) {
                        var file = {};
                        file.id = key;
                        file.name = fileName[key];
                        file.src = fileDesc[key];
                        addImageDesc(file);
                    }
                }
            } else {
              if(!$.isEmptyObject(fileName)) {
                 for(var key in fileName) {
                        var file = {};
                        file.id = key;
                        file.name = fileName[key];
                        addFileDesc(file);
                    }
                }
            }
            
        }
    }