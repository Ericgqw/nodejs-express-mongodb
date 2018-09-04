var AnyRt = function(path) {
	this.PATH = path;
}

AnyRt.prototype = {
	getCellReference:function(pos) {
		var isIntNum = function(val){
		    var regPos = / ^\d+$/;
		    if(regPos.test(val)){
		        return true;
		    } else {
		        return false;
		    }
		}
		var length = pos.length;
		var loc = 0;
		for (; loc < length; loc++) {
			if (isIntNum(pos[loc])) {
				break;
			}
		}
		var locA = pos.substring(0, loc - 1);
		var locB = pos.substring(loc - 1);
		
		var idx = 0;
		var colIndex = 0;
		for (var k = locA.length - 1; k >= 0; k--) {
			// Character.getNumericValue() returns the values
			// 10-35 for the letter A-Z
			var shift = Math.pow(26, idx);
			colIndex += (locA.charCodeAt(k) - 64) * shift;
			idx++;
		}
		var rowIndex = parseInt(locB);
		return {rowNum:rowIndex - 1, colNum:colIndex - 1}
	}
}

AnyRt.prototype.getCellByRowColNum = function(rowNum, colNum) {
	var _grid = this.getGridObject();
	return this.getCellByRowColNumObj(rowNum, colNum, _grid);
}

AnyRt.prototype.getArgCellByRowColNum = function(rowNum, colNum) {
	var _grid = this.getArgGridObject();
	return this.getCellByRowColNumObj(rowNum, colNum, _grid);
}

AnyRt.prototype.getFormCellByRowColNum = function(rowNum, colNum) {
    var _grid = this.getFormGridObject();
	return this.getCellByRowColNumObj(rowNum, colNum, _grid);
}

AnyRt.prototype.getCellByRowColNumObj = function(rowNum, colNum, obj) {
	var tbody = obj.children("tbody");
    var trs = null;
    if(tbody.length > 0) {
        trs = tbody.children("tr");
    } else {
        trs = obj.children("tr");
    }
	if(rowNum >= trs.length) {
		return null;
	}
	var tr = trs[rowNum];
	var tds = $(tr).children("td");
	if(colNum >= tds.length) {
		return null;
	}
	return $(tds[colNum]);
}

//pos = A1
AnyRt.prototype.getCellByPos = function(pos) {
	var letter = this.getCellReference(pos);
	return this.getCellByRowColNum(letter.rowNum, letter.colNum);
}

//pos = A1
AnyRt.prototype.getArgCellByPos = function(pos) {
	var letter = this.getCellReference(pos);
	return this.getArgCellByRowColNum(letter.rowNum, letter.colNum);
}

AnyRt.prototype.getFormCellByPos = function(pos) {
    var letter = this.getCellReference(pos);
    return this.getFormCellByRowColNum(letter.rowNum, letter.colNum);
}

AnyRt.prototype.getGridObject = function() {
	return $("#tg");
}

AnyRt.prototype.getArgGridObject = function() {
	return $("#formId");
}

AnyRt.prototype.getFormGridObject = function() {
	return $("#jform");
}

//return trs
AnyRt.prototype.getRows = function() {
	var gridObject = this.getGridObject();
    var tbody = gridObject.children("tbody");
    if(tbody.length > 0) {
        return tbody.children("tr");
    } else {
        gridObject.children("tr");
    }
}

//return tds
AnyRt.prototype.getCols = function(row) {
	if(row == undefined || row == null) {
		return new Array();
	}
	if(row instanceof jQuery){ 
		return row.children("td");
	} else {
		return $(row).children("td");
	}
}

//return trs
AnyRt.prototype.getArgRows = function() {
	var gridObject = this.getArgGridObject();
    var tbody = gridObject.children("tbody");
    if(tbody.length > 0) {
        return tbody.children("tr");
    } else {
        gridObject.children("tr");
    }
}

//return tds
AnyRt.prototype.getArgCols = function(row) {
	if(row == undefined || row == null) {
		return new Array();
	}
	if(row instanceof jQuery) { 
		return row.children("td");
	} else {
		return $(row).children("td");
	}
}

//return trs
AnyRt.prototype.getFormRows = function() {
	var gridObject = this.getFormGridObject();
    var tbody = gridObject.children("tbody");
    if(tbody.length > 0) {
        return tbody.children("tr");
    } else {
        gridObject.children("tr");
    }
}

//return tds
AnyRt.prototype.getFormCols = function(row) {
	if(row == undefined || row == null) {
		return new Array();
	}
	if(row instanceof jQuery) { 
		return row.children("td");
	} else {
		return $(row).children("td");
	}
}

AnyRt.prototype.getParams = function() {
    var jsonObj = new Object();
     
     $("#reportQuery-form").find("input").each(function(){
         if($(this).attr("type") == "button") {
             return true;
         }
         var paramName = $(this).attr("name");
         if($(this).attr("type") == "checkbox") {
        	 if($(this).attr("checked")) {
        		 var checkboxs = jsonObj[paramName];
        		 if(checkboxs == null || checkboxs == undefined) {
        			 checkboxs = new Array();
        			 jsonObj[paramName] = checkboxs;
        		 }
        		 checkboxs.push($(this).val());
        	 }
        	 return true;
         }
         
         if($(this).attr("type") == "radio") {
             if($(this).attr("checked")) {
                jsonObj[paramName] = $(this).val();
             }
             return true;
         }
         var value = $(this).val();
         jsonObj[paramName] = value;
     });
    
     $("#reportQuery-form").find("select").each(function(){
         var paramName = $(this).attr("name");
         var value = $(this).val();
         jsonObj[paramName] = value;
     });
     return jsonObj;
}

AnyRt.prototype.linkReport = function(rptId, target, param) {
	var rptParam = {};
	rptParam.type = 0;
	rptParam.target = target;
	rptParam.url = rptId;
	rptParam.param = param;
	report.rptLinked(rptParam);
}

AnyRt.prototype.linkWinReport = function(rptId, width, height, param) {
	var rptParam = {};
	rptParam.type = 0;
	rptParam.target = "_win";
	rptParam.url = rptId;
	rptParam.width = width;
	rptParam.height = height;
	rptParam.param = param;
	report.rptLinked(rptParam);
}

AnyRt.prototype.openReport = function(rptId, width, height, title, param, yesFun, cancelFun) {
	var winW = $(window).width();
	var winH = $(window).height();
	var width = width > winW ? winW : width;
	var height = height > winH ? winH : height;
	
	var url = this.PATH + "/" + rptId + ".rpt";
	var getParamUrl = function() {
		if(param) {
			var index = 0;
			for(var key in param) {
				if(index == 0) {
					url += "?";
				} else {
					url += "&";
				}
				url += (key + "=" + param[key]);
				index ++;
			}
		}
		return url;
	}
	
	var opt = {};
	opt.type = 2;
	opt.title = title;
	opt.zIndex = 1025;
	opt.shadeClose = true;
	opt.shade = false;
	opt.area = [width + 'px', height + 'px'];
    opt.content = getParamUrl();
	var btns = new Array();
	if(yesFun && (typeof yesFun == "function")) {
		btns.push("确定");
		opt.yes = function(index) {
			var rptWin = $("#layui-layer-iframe" + index)[0].contentWindow;
			yesFun(rptWin);
			layer.close(index);
		}
	}
	if(cancelFun && (typeof cancelFun == "function")) {
		btns.push("取消");
		opt.cancel = function(index) {
			var rptWin = $("#layui-layer-iframe" + index)[0].contentWindow;
			cancelFun(rptWin);
			layer.close(index);
		}
	}
	if(btns.length > 0) {
		opt.btn = btns;
	}
	
	layer.open(opt);
}

AnyRt.prototype.alert = function(text) {
	layer.alert(text);
}

AnyRt.prototype.msg = function(text, time) {
	if(time > 0) {
		layer.msg(text, {time:time});
	} else {
		layer.msg(text);
	}
}

//linkage chart
AnyRt.prototype.linkageChart = function(targetCell, chartId, params) {
	var art = this;
	var rptId = $("#rptId").val();
    var requestData = {};
    requestData["rptId"] = rptId;
    requestData["_type"] = 0;
    requestData["_linkageId"] = targetCell;
    for(var key in params) {
        requestData[key] = params[key];
    }
    
    $.ajax({
		 type: "POST",
		 url: art.PATH + "/report/asynQuery.htm",
		 data: requestData,
		 dataType : "json",
		 success: function(respMsg) {
		      var msg = respMsg.msg;
		      var chartObject = chart.getChartById(chartId);
              chartObject.resize(msg);
		  },
	      error:function(e) {
	    	  if(e.status == 403) {
		       	   layer.alert("没有权限访问该页面");
		       } else if(e.status == 401) {
		       	   layer.alert("会话失效，请重新登录系统");
		       }
	      }
	});
}

//linkage report c=A1
AnyRt.prototype.linkageReport = function(targetCell, params) {
	var art = this;
	var rptId = $("#rptId").val();
    var requestData = {};
    requestData["rptId"] = rptId;
    requestData["_type"] = 0;
    requestData["_linkageId"] = targetCell;
    for(var key in params) {
        requestData[key] = params[key];
    }
    
    $.ajax({
		 type: "POST",
		 url: art.PATH + "/report/asynQuery.htm",
		 data: requestData,
		 dataType : "json",
		 success: function(respMsg) {
		      var msg = respMsg.msg;
		      var targetObject = $("td[c='"+targetCell+"']");
		      if(targetObject.length > 0) {
		    	  targetObject.empty().html(data);
		      }
		  },
	      error:function(e) {
	    	  if(e.status == 403) {
		       	   layer.alert("没有权限访问该页面");
		       } else if(e.status == 401) {
		       	   layer.alert("会话失效，请重新登录系统");
		       }
	      }
	});
}

AnyRt.prototype.registerChartClick = function(chartId, func) {
	var chartObject = chart.getChartById(chartId);
	if(func && (typeof func == "function")) {
		chartObject.func = func;
	}
}

AnyRt.prototype.select = function(dsName, params) {
    var art = this;
    params = params != undefined ? params : {};
	var rptId = $("#rptId").val();
    params.rptId = rptId;
    params.dsName = dsName;
    
    var ret = {};
    $.ajax({
         type: "POST",
         url: art.PATH + "/report/data.htm",
         data: params,
         dataType : "json",
         async:false,
         success: function(msg){
            ret = msg;
         },
         error:function(e) {
             if(e.status == 403) {
                layer.alert("没有权限访问该页面");
             } else if(e.status == 401) {
                layer.alert("会话失效，请重新登录系统");
             }
         }
    });
    return ret;
}

AnyRt.prototype.formSelect = function(dsName, params) {
    var art = this;
    params = params != undefined ? params : {};
	var formId = $("#formId").val();
    params.formId = formId;
    params.dsName = dsName;
    
    var ret = {};
    $.ajax({
         type: "POST",
         url: art.PATH + "/form/data.htm",
         data: params,
         dataType : "json",
         async:false,
         success: function(msg){
            ret = msg;
         },
         error:function(e) {
             if(e.status == 403) {
                layer.alert("没有权限访问该页面");
             } else if(e.status == 401) {
                layer.alert("会话失效，请重新登录系统");
             }
         }
    });
    return ret;
}

AnyRt.prototype.selectSql = function(sourceName, sql, params) {
    var art = this;
	params = params != undefined ? params : {};
    params.sourceName = sourceName;
    params.sql = sql;
    
    var ret = {};
    $.ajax({
         type: "POST",
         url: art.PATH + "/comm/data.htm",
         data: params,
         dataType : "json",
         async:false,
         success: function(msg){
            ret = msg;
         },
         error:function(e) {
             if(e.status == 403) {
                layer.alert("没有权限访问该页面");
             } else if(e.status == 401) {
                layer.alert("会话失效，请重新登录系统");
             }
         }
    });
    return ret;
}

AnyRt.prototype.loadReportContent = function() {
    report.loadContentWithParam();
}

AnyRt.prototype.loadReportContentById = function(rptId) {
    var jsonObj = report.getArgObject();
    this.loadReportContentByParams(rptId, jsonObj);
}

AnyRt.prototype.loadReportContentByParams = function(rptId, param) {
    var art = this; 
    if(param == undefined) {
        param = {};
    }
    var jsonObj = param;
    jsonObj["rptId"] = rptId;
    var idx = layer.load(2, {shade: [0.5,'#fff']});
    $.ajax({
       type: "POST",
       url: art.PATH + "/report/list.htm",
       data:jsonObj,
       dataType: "html",
       success:function(result){ 
          $("#table-content").empty().html(result); 
          layer.close(idx);
       },
       error:function(e) {
    	   if(e.status == 403) {
	       		layer.alert("没有权限访问该页面");
	       	} else if(e.status == 401) {
	       		layer.alert("会话失效，请重新登录系统");
	       	}
            layer.close(idx);
       }
    });
}

AnyRt.prototype.pdfPrinter = function(rptId) {
    $("#fileType").val(1);
    var exportFormInputObj = $("#export-form-input");
    exportFormInputObj.empty();
    $("#reportQuery-form").find("input").each(function(){
        var cloneObj = $(this).clone();
        if(cloneObj.attr("type") != "button" && 
            cloneObj.attr("type") !=  "submit") {
            if(cloneObj.attr("name") == "rptId") {
                cloneObj.val(rptId);
            }
            cloneObj.appendTo(exportFormInputObj);
        }
     });
     $("#reportQuery-form").find("select").each(function(){
         var name = $(this).attr("name");
         var value = $(this).val();
         if(value != null && value != "") {
        	 exportFormInputObj.append("<input type='hidden' name='"+name+"' value='"+value+"'>");
         }
     });
     $("canvas").each(function() {
        var objectId = $(this).parent().parent("div").attr("id");
        var chartObj = chart.getChartById(objectId);
        if(chartObj != undefined) {
            exportFormInputObj.append("<input type='hidden' name='"+objectId+"' value='"+chartObj.getDataUrl()+"'>");
        }
     });
       
    $("#exportQuery-form").submit();
}

AnyRt.prototype.pdfPrinterByParams = function(rptId, params) {
    params = params != undefined ? params : {};
    $("#fileType").val(1);
    var exportFormInputObj = $("#export-form-input");
    exportFormInputObj.empty();
    
    params.rptId = rptId;
    for(var key in params) {
        $("<input type='hidden' name='"+key+"' value='"+params[key]+"'>").appendTo(exportFormInputObj);
    }
    $("#exportQuery-form").submit();
}

AnyRt.prototype.formSubmit = function() {
    //remove hidden tr
    $("#jform tr").each(function () {
          var trObj = $(this);
          if (trObj.is(":hidden")) {
             trObj.remove();
          }
     });

     var formH = $("#formDiv").height();
     $("#formDiv").hide();
     $("#resultIfr").show();
     $("#resultIfr").height(formH);

     form.loadIndex = layer.load(2, {shade: [0.5,'#fff']});
     $("#qryForm").submit();
}

AnyRt.prototype.formAddRow = function(tdObj) {
    return form.addRow(tdObj.find("a"));
}

AnyRt.prototype.formExeSql = function(sourceName, sql, params) {
    var art = this;
	params = params != undefined ? params : {};
    params.sourceName = sourceName;
    var formId = $("#formId").val();
    params.formId = formId;
    params.sql = sql;
    
    var ret = true;
    $.ajax({
         type: "POST",
         url: art.PATH + "/form/exesql.htm",
         data: params,
         dataType : "json",
         async:false,
         success: function(result){
             if(result.code != 0) {
                 ret = false;
             }
         },
         error:function(e) {
             if(e.status == 403) {
                layer.alert("没有权限访问该页面");
             } else if(e.status == 401) {
                layer.alert("会话失效，请重新登录系统");
             }
         }
    });
    return ret;
}

AnyRt.prototype.changeArgDateFormat = function(dateInput, format) {
    var layKey = dateInput.attr("lay-key");
    $("#layui-laydate" + layKey).remove();
    var cloneDate = $("<input type='text'/>");
    cloneDate.attr("name", dateInput.attr("name"));
    cloneDate.attr("range", dateInput.attr("range"));
    cloneDate.attr("style", dateInput.attr("style"));
    cloneDate.attr("class", dateInput.attr("class"));
    cloneDate.attr("icon-color", dateInput.attr("icon-color"));
    if(dateInput.attr("tq")) {
        cloneDate.attr("tq", dateInput.attr("tq"));
    }
    
    cloneDate.attr("data-date-format", format);
    var cloneI = dateInput.next().clone();
    var tdObj = dateInput.parent();
    
    tdObj.empty().append(cloneDate).append(cloneI);
    report.initDate(cloneDate);
}

AnyRt.prototype.onRadioEvent = function(radioObjs, func) {
    radioObjs.iCheck('destroy');
    radioObjs.iCheck({
        radioClass: 'iradio_minimal-green'
    });
    radioObjs.on('ifChecked', function() {
        func($(this));
    });
}

AnyRt.prototype.onCheckEvent = function(checkObjs, func) {
    radioObjs.iCheck('destroy');
    radioObjs.iCheck({
        radioClass: 'iradio_minimal-green'
    });
    radioObjs.on('ifCheck', function() {
        func($(this));
    });
}
