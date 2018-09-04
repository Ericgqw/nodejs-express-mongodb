String.prototype.endWith=function(s){
   if(s==null||s==""||this.length==0||s.length>this.length)
      return false;
   if(this.substring(this.length-s.length)==s)
      return true;
   else
      return false;
   return true;
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "i+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var Form = function(context, isQuery, relative) {
    this.context = context;
    this.isQuery = isQuery;
    this.relative = relative;
}

Form.prototype = {
    init:function() {
        this.delFileUrl = this.context + "/form/del_file.htm";
        this.uploadUrl = this.context + "/form/upload.htm";
        this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initComponent();
        
        if(this.relative == "2") {
	       	 var width = $("#contentDiv").width() - 20;
	       	 var _argTab = $("#contentDiv").find("table");
	       	 var cWidth = parseInt(_argTab.attr("ow"));
	       	 var colgroup = _argTab.children("colgroup");
	       	 var pW = width/cWidth;
	       	 colgroup.find("col").each(function() {
	       	        var ow = parseInt($(this).attr("ow"));
	       	        var colW = Math.floor(ow * pW);
	       	        $(this).width(colW);
       	     });
    	 }
    },
    initPre:function() {
        this.init();
        this.asynCanvasUrl = this.context + "/form/pre/canvas.htm";
        this.fxUrl = this.context + "/form/pre/fx.htm";
    },
    initFormDetail:function(isAsyn) {
       var form = this;
       this.delFileUrl = this.context + "/form/del_file.htm";
       this.uploadUrl = this.context + "/form/upload.htm";
       this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
       this.asynCanvasUrl = this.context + "/form/canvas.htm";
       this.fxUrl = this.context + "/form/fx.htm";
       this.validateUrl = this.context + "/form/validate.htm";
    }
}

Form.prototype.initComponent = function() {
   var form = this;
   
   var isPosLetter = function(letter) {
   	  var reg = new RegExp("^[A-Za-z]{1,2}[0-9]+$");
   	  return reg.test(letter);
   }
   
   $("#icon-add").click(function() {
	    if (!$("#qryForm").valid()){
			return false;
		}
	    
	    var divs = $("#submitValidate").find("div");
	    for(var i = 0; i < divs.length; i++) {
	    	var _div = $(divs[0]);
	    	var fx = _div.attr("fx");
	    	var msg = _div.html();
	    	var param = {};
	    	param["formId"] = $("#formId").val();
	    	param["idx"] = _div.attr("idx");
	    	var fxArray = fx.split(",");
    		for(var j = 0; j < fxArray.length; j++) {
    			var name = fxArray[j];
    			if(name == "") {
    				continue;
    			}
    			if(isPosLetter(name)) {
    				continue;
    			}
    			var nameVal = null;
    			var _input = $("input[name="+name+"]");
    			if(_input.length > 0) {
    				if(_input.length == 1) {
    					nameVal = _input.val();
    				} else {
    					var nameVals = new Array();
    					_input.each(function() {
    						nameVals.push($(this).val());
    					});
    					nameVal = nameVals;
    				}
    			} else {
    				var _select = $("select[name="+name+"]");
    				if(_select.length > 0) {
    					if(_select.length == 1) {
    						nameVal = _select.val();
    					} else {
    						var nameVals = new Array();
    						_select.each(function() {
        						nameVals.push($(this).val());
        					});
        					nameVal = nameVals;
    					}
    				}
    			}
    			param[name] = nameVal;
    		}
    		
    		var flag = false;
    		$.ajax({
    		    type: "POST",
    		    url: form.validateUrl,
    		    data: param,
    		    async: false,
    		    dataType : "json",
    		    success: function(code) {
    		    	if(code == 1) {
    		    	    layer.open({
						  title: ['信息提示']
						  ,anim: 'up'
						  ,content: '表单不存在!'
						  ,btn: ['确认']
						});
    		    	} else if(code == 2) {
    		    		layer.open({
							  title: ['信息提示']
							  ,anim: 'up'
							  ,content: msg
							  ,btn: ['确认']
						 });
    		    	} else {
    		    		flag = true;
    		    	}
    		    }
        	});
    		
    		if(!flag) {
    			return false;
    		}
	    }
	    
		//remove hidden tr
	    $("#jform tr").each(function () {
	          var trObj = $(this);
	          if (trObj.is(":hidden")) {
	             trObj.remove();
	          }
	     });
	     
	     $("#qryForm").submit();
	});
    
     var allIdx = 0;
     $(".input-file").each(function() {
          allIdx ++;
          var nowUpload = $(this).attr("nowUpload") == "true";
          var ful = new FileUploader($(this), allIdx, "file", form.context, nowUpload);
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
     
	//init upload image    
    $(".input-image").each(function() {
          allIdx ++;
          var nowUpload = $(this).attr("nowUpload") == "true";
          var ful = new FileUploader($(this), allIdx, "img", form.context, nowUpload);
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
                  var item = arrs[i];
                  var key = item.replace(new RegExp("/","gm"), "").replace(new RegExp("\\.","gm"), "");
                  fileNamex[key] = "";
                  fileDescx[key]= item;
              }
              ful.init(fileNamex, fileDescx);
          }
      });
	
   //init date field
   $("input.form_time").each(function() {
	    $(this).attr("placeholder", "日期选择");
        var format = $(this).attr("data-date-format");
        format = format == null ? "yyyy-MM-dd" : format;
        if(format.indexOf("ii") != -1) {
            format = format.replace("ii", "mm");
        }
        var calendar = new lCalendar();
		calendar.init({
			'trigger': this,
			'format': format
		});
	 }).focus(function(){
        document.activeElement.blur();
     });
   
	//init selected 
   $("input.selectpicker").each(function() {
		var json = eval('(' + $(this).attr("data") + ')');
		var triggerObj = $(this)[0];
		new MobileSelect({
		    trigger: triggerObj,
		    wheels: [{data: json}],
		    callback:function(indexArr, data, trigger){
		    	var obj = data[0];
				$(trigger).val(obj.value);
                $(trigger).next().val(obj.id);
                $(trigger).trigger("change");
		    }
		});
	}).focus(function(){
        document.activeElement.blur();
    });
		
	//init input tree click event
    var idx = 0;
    $("input.input-tree").each(function() {
    	var treeObj = new TreeObj(idx);
    	treeObj.init($(this));
        
        var iconColor = $(this).attr("icon-color");
        if(iconColor != undefined && iconColor != "") {
            $(this).next().next().css("color", iconColor);
        }
        idx++;
    }).focus(function(){
        document.activeElement.blur();
    });
	
	//init select linkage
	$(".selectLinkage").change(function() {
	     form.linkage(this);
	});
    
    $("input").each(function() {
    	if($(this).attr("fxTarget") != undefined) {
    		var fxTarget = $(this).attr("fxTarget");
    		$(this).change(function() {
    			var targets = fxTarget.split(",");
    			for(var i = 0; i < targets.length; i++) {
    				var target = targets[i];
    				form.targetChange(target);
    			}
    		});
    	}
    });
	
	$("#qryForm").validation({tip:true});
}

Form.prototype.targetChange = function(target) {
	 var isPosLetter = function(letter) {
    	var reg = new RegExp("^[A-Za-z]{1,2}[0-9]+$");
    	return reg.test(letter);
    }
	 
	if(target == "") {
		return;
	}
	var param = {};
	param["formId"] = $("#formId").val();
	
	if(isPosLetter(target)) {
		var td = $("td[pos="+target+"]");
		var tds = new Array();
		td.each(function() {
			if($(this).parent().is(":hidden")) {
				return true;
			}
			tds.push($(this));
		});
		if(tds.length == 0) {
			return;
		}
		var fxs = td.attr("fx");
		if(fxs == undefined) {
			return;
		}
		var fxArray = fxs.split(",");
		param["_pos"] = target;
		for(var i = 0; i < fxArray.length; i++) {
			var name = fxArray[i];
			if(isPosLetter(name)) {
				continue;
			}
			
			var nameVal = null;
			var _input = $("input[name="+name+"]");
			if(_input.length > 0) {
				if(_input.length == 1) {
					nameVal = _input.val();
				} else {
					var nameVals = new Array();
					_input.each(function() {
						if($(this).parent().parent().is(":hidden")) {
							return true;
						}
						nameVals.push($(this).val());
					});
					nameVal = nameVals;
				}
			} else {
				var _select = $("select[name="+name+"]");
				if(_select.length > 0) {
					if(_select.length == 1) {
						nameVal = _select.val();
					} else {
						var nameVals = new Array();
						_select.each(function() {
							if($(this).parent().parent().is(":hidden")) {
    							return true;
    						}
    						nameVals.push($(this).val());
    					});
    					nameVal = nameVals;
					}
				}
			}
			
			param[name] = nameVal;
		}
		
		for(var i = 0; i < tds.length; i++) {
			var _td = $(tds[i]);
			var newParam = {};
			if(tds.length > 1) {
				for(var p in param) {
    				var obj = param[p];
    				if(obj instanceof Array) {
    					newParam[p] = obj[i];
    				} else {
    					newParam[p] = obj;
    				}
    			}
			} else {
				newParam = param;
			}
			
			$.ajax({
    		    type: "POST",
    		    url: form.fxUrl,
    		    data: newParam,
    		    async: false,
    		    dataType : "json",
    		    success: function(respMsg) {
    		    	_td.html(respMsg);
    		    }
        	});
		}
	} else {
		var targetInput = $("input[name="+target+"]");
		var targetInputs = new Array();
		targetInput.each(function() {
			if($(this).parent().parent().is(":hidden")) {
				return true;
			}
			targetInputs.push($(this));
		});
		
		if(targetInputs.length > 0) {
			param["_compName"] = target;
			var fxs = targetInput.attr("fx");
    		var fxArray = fxs.split(",");
    		for(var i = 0; i < fxArray.length; i++) {
    			var name = fxArray[i];
    			if(isPosLetter(name)) {
    				continue;
    			}
    			
    			var nameVal = null;
    			var _input = $("input[name="+name+"]");
    			if(_input.length > 0) {
    				if(_input.length == 1) {
    					nameVal = _input.val();
    				} else {
    					var nameVals = new Array();
    					_input.each(function() {
    						if($(this).parent().parent().is(":hidden")) {
    							return true;
    						}
    						nameVals.push($(this).val());
    					});
    					nameVal = nameVals;
    				}
    			} else {
    				var _select = $("select[name="+name+"]");
    				if(_select.length > 0) {
    					if(_select.length == 1) {
    						nameVal = _select.val();
    					} else {
    						var nameVals = new Array();
    						_select.each(function() {
    							if($(this).parent().parent().is(":hidden")) {
        							return true;
        						}
        						nameVals.push($(this).val());
        					});
        					nameVal = nameVals;
    					}
    				}
    			}
    			param[name] = nameVal;
    		}
    		
    		for(var i = 0; i < targetInputs.length; i++) {
    			var _targetInput = $(targetInputs[i]);
    			var newParam = {};
    			if(targetInputs.length > 1) {
    				for(var p in param) {
        				var obj = param[p];
        				if(obj instanceof Array) {
        					newParam[p] = obj[i];
        				} else {
        					newParam[p] = obj;
        				}
        			}
    			} else {
    				newParam = param;
    			}
    			
    			$.ajax({
        		    type: "POST",
        		    url: form.fxUrl,
        		    data: newParam,
        		    async: false,
        		    dataType : "json",
        		    success: function(respMsg) {
        		    	_targetInput.val(respMsg);
        		    }
            	});
    		}
		}
	}
}

Form.prototype.resetImportFile = function() {
     var html = "<input class='addfileI' type='file' name='upload-excel-file' id='upload-excel-file'>";
     $("#excelDiv").append(html);
        
     $("#upload-excel-file").bind("change", function() {
         form.uploadImportFile();
	 });
}

Form.prototype.appendFormData = function(data) {
   if(data.length == 0) {
      return false;
   }
   var tableArray = $("#jform").find("tr:visible");
   for(var i = 0; i < data.length; i++) {
      var rowAay = data[i];
      var trObj = null;
      if(i < tableArray.length) {
    	  trObj = tableArray.eq(i);
      } else {
    	  var rowclass = tableArray.eq(tableArray.length - 1).attr("class");
    	  var trHidde = $("#jform").find("tr:hidden");
    	  trHidde.each(function() {
    		  if($(this).hasClass(rowclass)) {
    			  var cloneTr = $(this).clone().show();
    			  $(this).parent().append(cloneTr);
    			  trObj = cloneTr;
    		  }
    	  });
      }
      
	  for(var j = 0; j < rowAay.length; j++) {
         if(trObj == null) {
        	continue;
         }
		 var tdObj = trObj.find("td").eq(j);
		 if (tdObj.length == 0){
		    continue;
		 }
		 var children = tdObj.children();
		 if (children.length == 0){
		    continue;
		 }
		 
		 if(children.length == 1) {
		   if (children.is("input")){
		       if(children.attr('type') == 'radio' || children.attr('type') == 'checkbox') {
                  if(children.val() == rowAay[j].val) {
                       children.attr("checked", true);
				  }
				  continue;
			   }
			   if(children.attr("class") == "form_time form-control") {
			      var dateValue = rowAay[j].val;
			      if(dateValue.indexOf("CST") != -1) {
			         //Date parse UTC time - 14h
			         var dateTime = Date.parse(dateValue) - 14*60*60*1000;
			         var format = children.attr("data-date-format");
			         var inputDate = new Date(dateTime);
			         children.val(inputDate.format(format));
			         continue;
			      }
			   }
			   children.val(rowAay[j].val);
		   } else if(children.is("select")) {
               var options = children.children();
			   for(var t = 0; t < options.length; t++) {
                    var option = $(options[t]);
					if(option.attr("value") == rowAay[j].val) {
                         option.attr("selected", "selected");
					}
			   }
		   } else if (children.is("textarea")) {
		       children.val(rowAay[j].val);
		   }
		 } else {
		     //find summernote textarea
			 var textareas = tdObj.find("textarea[class=summernote]");
			 if(textareas.length > 0) {
			     $(textareas[0]).code(rowAay[j].val);
			     continue;
			 }
			 
			 //find select 
		     var selects = tdObj.find("select");
		     if(selects.length > 0) {
		        var selectObj = $(selects[0]);
		        var options = selectObj.find("option");
		        for(var t = 0; t < options.length; t++) {
		            if($(options[t]).text() == rowAay[j].val) {
		                selectObj.val($(options[t]).val());
		                selectObj.selectpicker('refresh');
		                break;
		            }
		        }
		        continue;
		     }
			 
		     //find input radio
		     var radios = tdObj.find("input[type=radio]");
		     if(radios.length > 0) {
		         for(var t = 0; t < radios.length; t++) {
		             var radioObj = $(radios[t]);
		             var spanObj = radioObj.parent("div").next("span");
		             if(!spanObj) {
		                 continue;
		             }
		             if(spanObj.text() == rowAay[j].val) {
		                 radioObj.iCheck('check'); 
		                 break;
		             }
		         }
		         continue;
		     }
		     
		     //find input checkbox
		     var checkboxs = tdObj.find("input[type=checkbox]");
		     if(checkboxs.length > 0) {
		          for(var t = 0; t < checkboxs.length; t++) {
		             var checkObj = $(checkboxs[t]);
		             var spanObj = checkObj.parent("div").next("span");
		             if(!spanObj) {
		                 continue;
		             }
		             if(spanObj.text() == rowAay[j].val) {
		                 checkObj.iCheck('check'); 
		             } else {
		                 checkObj.iCheck('uncheck'); 
		             }
		         }
		         continue;
		     }
		     
		     //find input tree.
		     var treeInputs = tdObj.find("input");
		     if(treeInputs.length > 0) {
		         var treeInputObject = $(treeInputs[0]);
		         if(treeInputObject.attr("class") == "input-tree form-control") {
		             var jsonString = treeInputObject.attr("data");
			         var jsonObj = JSON.parse(jsonString);
			         for(var t = 0; t < jsonObj.length; t++) {
			             var json = jsonObj[t];
			             if(json.name == rowAay[j].val) {
			                 treeInputObject.val(json.name);
			                 treeInputObject.next("input").val(json.saveCode);
			             }
			         }
		         }
		         continue;
		     }
		 }
	  }
  }
}

Form.prototype.uploadImportFile = function() {
	 var ldIndex = layer.open({type: 2});
     var form = this;
     $.ajaxFileUpload({
		url:form.parseFileUrl,
		secureuri:false,
		fileElementName:'upload-excel-file',
		dataType: 'json',
		success: function(data, status){
		   form.resetImportFile();
		   if(data.code == 411) {
		       layer.open({
				  title: ['信息提示']
				  ,anim: 'up'
				  ,content: '文件最大不能超过' + data.error
				  ,btn: ['确认']
			   });
			   return false;
		   }
		   form.appendFormData(data.value);
		   layer.close(ldx);
		}, error: function (data, status, e) {
		   form.resetImportFile();
		   layer.close(ldx);
		   layer.open({
				  title: ['信息提示']
				  ,anim: 'up'
				  ,content: '文件上传失败,请选择正确的文件上传!'
				  ,btn: ['确认']
			});
		}
	});
}

// form add row
Form.prototype.addRow = function(tdObj) {
	var form = this;
	
    var jqueryObj = $(tdObj);
    var trObj = jqueryObj.parent().parent();
    var nextTr = trObj.next();
    var cloneTr = nextTr.clone();
    
    var seqInputs = cloneTr.find("input[seq=1]");
    if(seqInputs.length > 0) {
    	for(var i = 0; i < seqInputs.length; i++) {
    		var _seqInput = $(seqInputs[i]);
    		_seqInput.val(this.getSequences(_seqInput.attr("name")));
    	}
    }
    
    cloneTr.show();
    var rowStr = cloneTr.attr("class");
    var endTr = nextTr.next();
    var beforeEndTr = nextTr;
    while(endTr.hasClass(rowStr)) {
    	beforeEndTr = endTr;
    	endTr = endTr.next();
    }
    
    var seqNumCol = -1;
    nextTr.children("td").each(function(index) {
        var tdHtml = $.trim($(this).html());
        if(tdHtml == "=SEQ()" || tdHtml == "=seq()") {
            seqNumCol = index;
            return false;
        }
    })
    
    cloneTr.insertAfter(beforeEndTr);
    
     if(seqNumCol != -1) {
        var trs = trObj.parent().children("tr." + rowStr);
	    for(var i = 1; i < trs.length; i++) {
	        var tds = $(trs[i]).children("td");
	        $(tds[seqNumCol]).empty().html(i);
	    }
    }
    
    //refresh selected 
    cloneTr.find("select").each(function() {
	     $(this).addClass("selectpicker").attr("title", "").selectpicker('refresh');
	});
    
    //register fx event
    cloneTr.find("input").each(function() {
    	if($(this).attr("fxTarget") != undefined) {
    		var fxTarget = $(this).attr("fxTarget");
    		$(this).change(function() {
    			var targets = fxTarget.split(",");
    			for(var i = 0; i < targets.length; i++) {
    				var target = targets[i];
    				form.targetChange(target);
    			}
    		});
    	}
    });
    
    //refresh datetime
    cloneTr.find(".form_time").each(function() {
        $(this).removeAttr("lay-key");
        //form.initDate($(this));
    });
    
    //refresh input tree click event
    var setting = {
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {enable: true}
		}
    };
    
    cloneTr.find(".input-tree").each(function() {
        var treeObj = new TreeObj(idx);
    	treeObj.init($(this));
        
        var iconColor = $(this).attr("icon-color");
        if(iconColor != undefined && iconColor != "") {
            $(this).next().next().css("color", iconColor);
        }
        
        idx++;
    });
    
    //init rich textfield
    cloneTr.find('.summernote').each(function(){
	     var width = $(this).attr("width");
	     var height = $(this).attr("height");
	     $(this).summernote({
		      height: height,
			  width: width,
		      tabsize: 2,
			  toolbar: [
		         ['style', ['style']],
		         ['font', ['bold', 'italic', 'underline', 'clear']],
		         ['color', ['color']],
		         ['fontname', ['fontname']],
		         ['fontsize', ['fontsize']],
		         ['para', ['ul', 'ol', 'paragraph']],
		         ['height', ['height']],
		         ['table', ['table']],
		         ['insert', ['link', 'hr']],
		         ['view', ['fullscreen', 'codeview']],
		         ['help', ['help']]
		        ],
		  });
	});
    
    return cloneTr;
}

Form.prototype.getSequences = function(name) {
	var form = this;
	 var sequenceName = "";
	 $.ajax({
        type: "POST",
        async: false,
        url: form.context + "/form/sequence.htm", 
        data:{formId:$("#formId").val(), name:name},
        dataType: "json",
        success:function(result){ 
        	sequenceName = result;
        }
     });
	 return sequenceName;
}

//form delete row
Form.prototype.delRow = function(tdObj) {
    var jqueryObj = $(tdObj);
    var curRow = jqueryObj.parent().parent();
    var rowStr = curRow.attr("class");
    var hiddenTr = curRow.parent().children("tr." + rowStr + ":hidden");
    curRow.remove();
    
    var seqNumCol = -1;
    hiddenTr.children("td").each(function(index) {
        var tdHtml = $.trim($(this).html());
        if(tdHtml == "=SEQ()" || tdHtml == "=seq()") {
            seqNumCol = index;
            return false;
        }
    });
    
    if(seqNumCol != -1) {
        var trs = hiddenTr.parent().children("tr." + rowStr);
	    for(var i = 1; i < trs.length; i++) {
	        var tds = $(trs[i]).children("td");
	        $(tds[seqNumCol]).empty().html(i);
	    }
    }
}

Form.prototype.linkage = function(compObject) {
   var form = this;
   var compJquery = $(compObject);
   var name = compJquery.attr("name");
   var value = compJquery.val();
   var linkageTarget = compJquery.attr("linkageTarget");
   var target = $("select[name='"+linkageTarget+"']");
   if(target) {
        if(value == undefined || value == "") {
            target.empty();
            target.selectpicker('refresh')
            var nextTargetId = target.attr("linkageTarget");
            if(nextTargetId != undefined && nextTargetId != "") {
                linkage(target);
            }
            return;
        }

        var requestData = {formId:$("#formId").val(), linkageTargetId:linkageTarget};
        requestData[name] = value;
           $.ajax({
			  type: "POST",
			  url: form.asynCompQuery,
			  data: requestData,
			  dataType : "text",
			  success: function(respMsg){
			      target.empty().html(respMsg);
			      target.selectpicker('refresh');
			      form.clearLinkTarget(target);
			  }
		});
     }
}

Form.prototype.clearLinkTarget = function(target) {
     var nextTargetId = target.attr("linkageTarget");
     if(nextTargetId != undefined && nextTargetId != "") {
          var nextTarget = $("select[name='"+nextTargetId+"']");
          if(nextTarget) {
              nextTarget.empty();
              clearLinkTarget(nextTarget);
          }
      }
}