<%@ page language="java" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
request.setAttribute("path", path);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="description" content="">
    <meta name="author" content="">

    <title>数据分析平台</title>

	<%@ include file="/anyrt/style.html"%>
	<link href="${path}/tp/webuploader.css" rel="stylesheet" />
	<%@ include file="/anyrt/js.jsp"%>
	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="<%=path%>/anyrt/js/html5shiv.min.js"></script>
      <script src="<%=path%>/anyrt/js/respond.min.js"></script>
    <![endif]-->
    
</head>
<body>
<div class="main">
           <input type="hidden" name="files" class="input-file" value="table6.xls:anyrt/file/201804/b5fe01ae-13ac-450b-97b6-b290e22513f5.xls"/>
           <input type="hidden" name="files" class="input-image"/>
</div>
	<script type="text/javascript">
	
	var FileUploader = function(inputObj, idx, type) {
		this.input = inputObj;
		this.idx = idx;
		this.type = type;
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

		        uploader = WebUploader.create({
		            pick: {
		                id: '#filePicker-' + wu.idx,
		                label: (wu.type=="file" ? '点击选择文件' : '点击选择图片')
		            },
		            chunked: false,
		            chunkSize: 512 * 1024,
		            server: '${path}/form/upload.htm',
		            disableGlobalDnd: true,
		            fileNumLimit: 300,
		        });

		        // 拖拽时不接受 js, txt 文件。
		        uploader.on( 'dndAccept', function( items ) {
		            var denied = false,
		                len = items.length,
		                i = 0,
		                // 修改js类型
		                unAllowed = 'text/plain;application/javascript ';

		            for ( ; i < len; i++ ) {
		                // 如果在列表里面
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
		                        return;
		                }
		            });

		            $li.appendTo( $queue );
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
			 			   url: "${path}/form/del_file.htm",
			 			   data: {imgPath:filePath},
			 			   dataType : "json",
			 			   success: function(suc){
			 			   },
			 			   error:function() {
			 			      layer.alert('文件删除失败!', {icon: 0});
			 			   }
				 		});
		            }
		            
		            var paths = "";
                	for(var fd in fileDesc) {
                		paths += fileName[fd];
                		paths += ":"
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
		                    	var paths = "";
		                    	for(var fd in fileDesc) {
		                    		paths += fileName[fd];
		                    		paths += ":"
		                    		paths += fileDesc[fd];
		                    		paths += ",";
		                    	}
		                    	wu.input.val(paths);
		                    } else {
		                        state = 'done';
		                        location.reload();
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
		        };
		        
		        uploader.on('uploadSuccess', function(file, response) {
		     	    console.log(response._raw);
		     	    var json = eval('(' + response._raw + ')');
		     	    fileDesc[file.id] = json.value[0];
		     	    fileName[file.id] = file.name;
		        });

		        uploader.onFileDequeued = function( file ) {
		            fileCount--;
		            fileSize -= file.size;

		            if ( !fileCount ) {
		                setState( 'pedding' );
		            }

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
		            if ( $(this).hasClass( 'disabled' ) ) {
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
		            alert( 'todo' );
		        } );

		        $upload.addClass( 'state-' + state );
		        updateTotalProgress();
		        
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
	
	   $(function() {
		  var allIdx = 0;
		  $(".input-file").each(function() {
			  allIdx ++;
			  var ful = new FileUploader($(this), allIdx, "file");
			  var files = $(this).val();
			  if(files == "") {
				  ful.init();
			  } else {
				  var arrs = files.split(",");
				  var fileNamex = {}, fileDescx = {};
				  for(var i = 0; i < arrs.length; i++) {
					  if(arrs[i] == "") {
						  continue;
					  }
					  var items = arrs[i].split(":");
					  var key = items[1].replace(new RegExp("/","gm"), "").replace(new RegExp("\\.","gm"), "");
					  fileNamex[key] = items[0];
					  fileDescx[key]= items[1];
				  }
				  ful.init(fileNamex, fileDescx);
			  }
		  });
		  
		  $(".input-image").each(function() {
			  allIdx ++;
			  
			  var ful = new FileUploader($(this), allIdx, "img");
			  var files = $(this).val();
			  if(files == "") {
				  ful.init();
			  } else {
				  var arrs = files.split(",");
				  var fileNamex = {}, fileDescx = {};
				  for(var i = 0; i < arrs.length; i++) {
					  if(arrs[i] == "") {
						  continue;
					  }
					  var items = arrs[i].split(":");
					  var key = items[1].replace(new RegExp("/","gm"), "").replace(new RegExp("\\.","gm"), "");
					  fileNamex[key] = items[0];
					  fileDescx[key]= items[1];
				  }
				  ful.init(fileNamex, fileDescx);
			  }
		  });
	   });
	</script>
</body>
</html>
