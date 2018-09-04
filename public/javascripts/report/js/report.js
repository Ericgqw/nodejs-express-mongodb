var Report = function (context, compAsync) {
    this.context = context;
    this.asyncs = eval(compAsync)
};
Report.prototype = {
    getTargetLinkage: function (D, B, F) {
        var A = this;
        var E = function (H, G, I) {
            this.targetType = H;
            this.targetId = G;
            this.params = I
        };
        E.prototype.execute = function () {
            var L = this;
            var M = $("#rptId").val();
            var I = {};
            I["rptId"] = M;
            var H = this.targetId;
            var K = this.targetType;
            I["_linkageId"] = H;
            I["_type"] = K;
            for (var J in this.params) {
                I[J] = this.params[J]
            }
            var G = $("td[linkageId='" + H + "']");
            var N = G.attr("id");
            if (N != undefined) {
                I["_cellId"] = N
            }
            $.ajax({
                type: "POST",
                url: A.asynQueryUrl,
                data: I,
                dataType: "json",
                success: function (V) {
                    var T = V.type;
                    var P = V.msg;
                    if (P == null) {
                        return
                    }
                    if (T == 1) {
                        var W = "";
                        if (K == 1 || K == 2) {
                            W = "chart_" + H
                        } else {
                            W = "chart_" + G.attr("id")
                        }
                        if (W != "") {
                            var U = chart.getChartById(W);
                            U.resize(P)
                        }
                    } else {
                        if (T == 0) {
                            if (K == 0) {
                                G.empty().html(P)
                            } else {
                                if (K == 1 || K == 2) {
                                    $("#" + H).empty().html(P)
                                }
                            }
                        } else {
                            if (T == 2) {
                                if (K == 0) {
                                    var Q = G.find("div.pbox");
                                    var R = null;
                                    if (Q.length == 0) {
                                        R = G.children("div");
                                        R.empty().html(P)
                                    } else {
                                        var O = Q.find("div.pbox-header");
                                        if (O.length == 0) {
                                            var S = Q.find("div.simplebar-content").length == 0 ? Q : Q.find("div.simplebar-content");
                                            S.empty().html(P)
                                        } else {
                                            O.next().remove();
                                            O.parent().append(P)
                                        }
                                        R = Q
                                    }
                                    if (reportList) {
                                        reportList.areaResize(R)
                                    }
                                } else {
                                    $("#" + H).empty().html(P)
                                }
                            }
                        }
                    }
                }, error: function (O) {
                    if (O.status == 403) {
                        layer.alert("没有权限访问该页面")
                    } else {
                        if (O.status == 401) {
                            layer.alert("会话失效，请重新登录系统")
                        }
                    }
                }
            })
        };
        var C = new E(D, B, F);
        return C
    }, getPanelBox: function (D, E) {
        var B = this;
        var C = function (F, G) {
            this.boxId = F;
            this.params = G
        };
        C.prototype.execute = function () {
            var F = layer.load(2, {shade: [0.5, "#fff"]});
            $.ajax({
                type: "POST", url: B.asynQueryBoxUrl, data: this.params, dataType: "json", success: function (K) {
                    var G = K.type;
                    var I = K.msg;
                    if (G == 1) {
                        var J = "chart_" + D;
                        var H = chart.getChartById(J);
                        H.resize(I)
                    } else {
                        if (G == 2) {
                            $("#" + D).empty().html(I)
                        }
                    }
                    layer.close(F)
                }, error: function (G) {
                    layer.close(F);
                    if (G.status == 403) {
                        layer.alert("没有权限访问该页面")
                    } else {
                        if (G.status == 401) {
                            layer.alert("会话失效，请重新登录系统")
                        }
                    }
                }
            })
        };
        var A = new C(D, E);
        return A
    }, initCommon: function (A) {
        if (A) {
            this.initAsyncPage()
        } else {
            this.initPage()
        }
        this.initArg();
        if (report.loadMode != "1") {
            this.loadContent()
        }
        this.initPrinter()
    }, initReport: function (A) {
        this.isAsync = A;
        this.contentUrl = this.context + "/report/list.htm";
        this.asynQueryUrl = this.context + "/report/asynQuery.htm";
        this.asynQueryBoxUrl = this.context + "/report/asynQueryBox.htm";
        this.printerUrl = this.context + "/report/printer.htm";
        this.asynCompQuery = this.context + "/report/asynCompQuery.htm";
        this.preExportUrl = this.context + "/report/exportFile.htm";
        this.saveArgUrl = this.context + "/report/saveArg.htm";
        this.delArgUrl = this.context + "/report/delArg.htm";
        this.initCommon(A)
    }, initPreReport: function () {
        this.contentUrl = this.context + "/report/pre/list.htm";
        this.asynQueryUrl = this.context + "/report/pre/asynQuery.htm";
        this.asynQueryBoxUrl = this.context + "/report/pre/asynQueryBox.htm";
        this.printerUrl = this.context + "/report/pre/printer.htm";
        this.asynCompQuery = this.context + "/report/pre/asynCompQuery.htm";
        this.preExportUrl = this.context + "/report/pre/exportFile.htm";
        this.initCommon()
    }, initAppReport: function (B) {
        this.contentUrl = this.context + "/report/app/list.htm";
        this.asynQueryUrl = this.context + "/report/app/asynQuery.htm";
        this.asynQueryBoxUrl = this.context + "/report/app/asynQueryBox.htm";
        this.asynCompQuery = this.context + "/report/app/asynCompQuery.htm";
        this.initInterval();
        this.initArg();
        this.loadContent();
        if (B) {
            $("#previewer").previewer({show: true})
        } else {
            var A = parseInt($("#pageSize").val());
            if (A > 0) {
                try {
                    AppInterface.init(true)
                } catch (C) {
                }
            } else {
                try {
                    AppInterface.init(false)
                } catch (C) {
                }
            }
        }
    }, initAppPreReport: function (A) {
        this.contentUrl = this.context + "/report/app/pre/list.htm";
        this.asynQueryUrl = this.context + "/report/app/pre/asynQuery.htm";
        this.asynQueryBoxUrl = this.context + "/report/app/pre/asynQueryBox.htm";
        this.asynCompQuery = this.context + "/report/pre/asynCompQuery.htm";
        this.initPage();
        this.initArg();
        this.loadContent();
        if (A) {
            $("#previewer").previewer({show: true})
        }
    }, initFormReport: function () {
        var A = $("body").height() - $(".page-condition").height() - $(".page-menu").find("table").height() - 35;
        $("#table-content").height(A);
        this.contentUrl = this.context + "/form/list.htm";
        this.asynQueryUrl = this.context + "/report/asynQuery.htm";
        this.asynQueryBoxUrl = this.context + "/report/asynQueryBox.htm";
        this.printerUrl = this.context + "/report/printer.htm";
        this.asynCompQuery = this.context + "/report/asynCompQuery.htm";
        this.preExportUrl = this.context + "/report/exportFile.htm";
        this.saveArgUrl = this.context + "/report/saveArg.htm";
        this.delArgUrl = this.context + "/report/delArg.htm";
        this.initArg();
        if (report.loadMode != "1") {
            this.loadContentWithParam()
        }
        this.initPrinter()
    }, initAsynFormReport: function () {
        var A = $(".main-box").height() - $(".page-condition").height() - $(".page-heading").height() - $(".page-menu").height() - $(".footer").height();
        $("#table-content").height(A - 40);
        this.initFormReport()
    }
};
Report.prototype.initInterval = function () {
    var A = this;
    var B = parseInt($("#interval").val());
    if (B > 0) {
        var C = parseInt($("#timeType").val());
        if (C == 0) {
            B = B * 1000
        } else {
            if (C == 1) {
                B = B * 1000 * 60
            } else {
                if (C == 2) {
                    B = B * 1000 * 60 * 60
                }
            }
        }
        setInterval(function () {
            A.intervalLoadContentWithParam()
        }, B)
    }
};
Report.prototype.intervalLoadContentWithParam = function () {
    this.asynArg();
    this.loadContentWithParam()
};
Report.prototype.initPage = function () {
    var A = $("body").height() - $(".page-condition").height() - $(".page-menu").find("table").height() - 25;
    $("#table-content").height(A);
    this.initInterval()
};
Report.prototype.initAsyncPage = function () {
    var A = $(".main-box").height() - $(".page-condition").height() - $(".page-heading").height() - $(".page-menu").height() - 44;
    $("#table-content").height(A);
    this.initInterval()
};
Report.prototype.resetQueryForm = function () {
    var A = new Array();
    A.push("rptId");
    A.push("formId");
    A.push("_curPage");
    A.push("_pageSize");
    this.resetArgForm($("#reportQuery-form"), A)
};
Report.prototype.resetArgForm = function (B, A) {
    $(B).find("input, textarea,select").each(function () {
        var C = $(this);
        if (contains(C.attr("name"), A)) {
            return
        }
        if (C.is("input[type='hidden']")) {
            C.val("")
        } else {
            if (C.is("input[type='text']")) {
                C.val("")
            } else {
                if (C.is("input[type='password']")) {
                    C.val("")
                } else {
                    if (C.is("select")) {
                        C.selectpicker("val", "");
                        C.val("")
                    } else {
                        if (C.is("input[type='radio']")) {
                            C.attr("checked", false)
                        }
                    }
                }
            }
        }
    })
};
Report.prototype.initArg = function () {
    var A = this;
    $("#btn-query-submit").click(function () {
        A.loadContentWithParam()
    });
    $("#btn-query-reset").click(function () {
        A.resetArgForm($("#processDocQuery-form"))
    });
    $("input[type=radio]").iCheck({radioClass: "iradio_minimal-green"});
    $("input[type=checkbox]").iCheck({checkboxClass: "icheckbox_minimal-green"});
    $("input[type=radio]").on("ifChecked", function (B) {
        $(this).attr("checked", "checked");
        if ($(this).attr("tq") != undefined) {
            A.btnQueryWithParam()
        }
    }).on("ifUnchecked", function (B) {
        $(this).removeAttr("checked")
    });
    $("input[type=checkbox]").on("ifChecked", function (B) {
        $(this).attr("checked", "checked");
        if ($(this).attr("tq") != undefined) {
            A.btnQueryWithParam()
        }
    }).on("ifUnchecked", function (B) {
        $(this).removeAttr("checked");
        if ($(this).attr("tq") != undefined) {
            A.btnQueryWithParam()
        }
    });
    $(".form_time").each(function () {
        A.initDate($(this));
        if ($(this).val() != "" && $(this).hasClass("selectLinkage")) {
            A.linkageCond(this)
        }
        if ($(this).attr("tq") != undefined) {
            if (!$(this).hasClass("selectLinkage")) {
                $(this).change(function () {
                    A.btnQueryWithParam()
                })
            }
        }
    });
    $(".selectpicker").each(function () {
        var B = $(this).attr("multi");
        if (B == "1") {
            $(this).attr("title", "").selectpicker({iconBase: "icon iconfont", tickIcon: "icon-check red"})
        } else {
            $(this).attr("title", "").selectpicker()
        }
        if ($(this).val() != "" && $(this).hasClass("selectLinkage")) {
            A.linkageCond(this)
        }
        if ($(this).attr("tq") != undefined) {
            if (!$(this).hasClass("selectLinkage")) {
                $(this).change(function () {
                    A.btnQueryWithParam()
                })
            }
        }
    });
    $(".selectpicker").on("loaded.bs.select", function (E) {
        var C = $(this).attr("style");
        var D = $(this).attr("icon-color");
        var B = $(this).parent().children("button");
        B.attr("style", C);
        if (D != undefined && D != "") {
            B.find("span.caret").css("color", D)
        }
    });
    $("input.input-tree").each(function (B) {
        var D = new TreeObj(B);
        D.init($(this));
        var C = $(this).attr("icon-color");
        if (C != undefined && C != "") {
            $(this).next().next().css("color", C)
        }
        if ($(this).attr("tq") != undefined) {
            if (!$(this).hasClass("selectLinkage")) {
                $(this).change(function () {
                    A.btnQueryWithParam()
                })
            }
        }
    });
    $(".selectLinkage").change(function () {
        A.linkageCond(this);
        if ($(this).attr("tq") != undefined) {
            A.btnQueryWithParam()
        }
    });
    $("li.tl-add-query-arg").click(function () {
        var I = A.getArgObject();
        var J = new Array();
        var F = new Array();
        var G = null;
        for (var H in I) {
            if (H == "rptId") {
                continue
            }
            if (H == "_userName") {
                G = I[H];
                continue
            }
            J.push(H);
            var B = I[H];
            if (B instanceof Array) {
                var D = "";
                for (var E = 0; E < B.length; E++) {
                    D += B[E];
                    if (E < B.length - 1) {
                        D += ","
                    }
                }
                F.push(D)
            } else {
                F.push(B)
            }
        }
        var C = {rptId: $("#rptId").val(), key: J, val: F};
        if (G != null) {
            C["_userName"] = G
        }
        $.ajax({
            async: false, type: "POST", url: A.saveArgUrl, data: C, dataType: "json", success: function (K) {
                if (K == 0) {
                    layer.msg("查询条件保存成功")
                } else {
                    layer.alert("查询条件保存失败!")
                }
            }, error: function (K) {
                if (K.status == 403) {
                    layer.alert("没有权限访问该页面")
                } else {
                    if (K.status == 401) {
                        layer.alert("会话失效，请重新登录系统")
                    } else {
                        layer.alert("查询条件保存失败!")
                    }
                }
            }
        })
    });
    $("li.tl-del-query-arg").click(function () {
        var C = {rptId: $("#rptId").val()};
        var B = $("#reportQuery-form").find("input[name=_userName]").val();
        if (B != undefined) {
            C["_userName"] = B
        }
        $.ajax({
            async: false, type: "POST", url: A.delArgUrl, data: C, dataType: "json", success: function (D) {
                if (D == 0) {
                    layer.msg("清除查询条件成功")
                } else {
                    layer.alert("清除查询条件失败!")
                }
            }, error: function (D) {
                if (D.status == 403) {
                    layer.alert("没有权限访问该页面")
                } else {
                    if (D.status == 401) {
                        layer.alert("会话失效，请重新登录系统")
                    } else {
                        layer.alert("清除查询条件失败!")
                    }
                }
            }
        })
    })
};
Report.prototype.initDate = function (A) {
    if (A.attr("type") == "hidden") {
        return true
    }
    var F = A.attr("icon-color");
    if (F != undefined && F != "") {
        A.next().css("color", F)
    }
    var D = A.attr("range");
    var B = D != undefined && D == "1" ? true : false;
    var G = A.attr("data-date-format");
    var E = "date";
    if (G.indexOf("ss") != -1 || G.indexOf("HH") != -1 || G.indexOf("mm") != -1) {
        if (G.indexOf("dd") != -1) {
            E = "datetime"
        } else {
            E = "time"
        }
    } else {
        if (G.indexOf("dd") != -1) {
            E = "date"
        } else {
            if (G.indexOf("MM") != -1) {
                E = "month"
            } else {
                if (G.indexOf("yyyy") != -1) {
                    E = "year"
                }
            }
        }
    }
    var C = {elem: A[0], format: G, type: E, range: B};
    laydate.render(C);
    A.next().click(function (H) {
        $(this).prev().trigger("focus");
        H.stopPropagation()
    })
};
Report.prototype.linkageCond = function (H) {
    var F = this;
    var E = $(H);
    var B = E.attr("name");
    var K = E.val();
    var A = E.attr("linkageTarget");
    if (A == undefined) {
        return
    }
    var G = A.split(",");
    for (var I = 0; I < G.length; I++) {
        var L = G[I];
        var J = $("select[name='" + L + "']");
        if (J.length == 0) {
            J = $("input[name='" + L + "']")
        }
        if (J.length > 0) {
            if (K == undefined || K == "") {
                if (J.is("select")) {
                    J.empty();
                    J.selectpicker("refresh")
                } else {
                    J.val("")
                }
                var C = J.attr("linkageTarget");
                if (C != undefined && C != "") {
                    this.linkageCond(J)
                }
                return
            }
            var D = {rptId: $("#rptId").val(), _linkageTargetId: L};
            D[B] = K;
            $.ajax({
                async: false, type: "POST", url: F.asynCompQuery, data: D, dataType: "json", success: function (M) {
                    if (J.is("select")) {
                        J.empty().html(M);
                        J.attr("title", "").selectpicker("refresh")
                    } else {
                        J.val(M)
                    }
                    F.clearLinkTarget(J)
                }, error: function (M) {
                    if (M.status == 403) {
                        layer.alert("没有权限访问该页面")
                    } else {
                        if (M.status == 401) {
                            layer.alert("会话失效，请重新登录系统")
                        }
                    }
                }
            })
        }
    }
};
Report.prototype.clearLinkTarget = function (B) {
    var C = B.attr("linkageTarget");
    if (C != undefined && C != "") {
        var A = $("select[name='" + C + "']");
        if (A.length == 0) {
            A = $("input[name='" + linkageTarget + "']")
        }
        if (A.length > 0) {
            if (B.is("select")) {
                A.empty();
                A.selectpicker("refresh")
            } else {
                A.val("")
            }
            this.clearLinkTarget(A)
        }
    }
};
var __sto = setInterval;
window.setInterval = function (E, C, D) {
    var A = Array.prototype.slice.call(arguments, 2);
    var B = function () {
        E.apply(null, A)
    };
    __sto(B, C)
};
Report.prototype.loadContent = function () {
    var A = this;
    var B = this.getArgObject();
    $.ajax({
        type: "POST", url:"../../php/list.php", data: B, dataType: "html", success: function (C) {
            $("#table-content").empty().html(C);
            var F = A.asyncs;
            if (!F) {
                return
            }
            for (var E = 0; E < F.length; E++) {
                var D = F[E];
                setInterval(intervalLoad, D.exeInterval, D)
            }
        }, error: function (C) {
            if (C.status == 403) {
                layer.alert("没有权限访问该页面")
            } else {
                if (C.status == 401) {
                    layer.alert("会话失效，请重新登录系统")
                }
            }
        }
    })
};
Report.prototype.asynArg = function () {
    $(".form_time").each(function () {
        var A = $(this);
        var B = {rptId: $("#rptId").val(), _linkageTargetId: A.attr("name")};
        $.ajax({
            async: false,
            type: "POST",
            url: report.asynCompQuery,
            data: B,
            dataType: "json",
            success: function (C) {
                if (C != null && C != "") {
                    A.val(C)
                }
            },
            error: function (C) {
                if (C.status == 403) {
                    layer.alert("没有权限访问该页面")
                } else {
                    if (C.status == 401) {
                        layer.alert("会话失效，请重新登录系统")
                    }
                }
            }
        })
    })
};
var intervalLoad = function (D) {
    var C = D.targetId;
    var E = D.type;
    report.asynArg();
    var B = report.getArgObject();
    B["_linkageId"] = C;
    B["_type"] = E;
    var A = $("td[linkageId='" + C + "']");
    var F = A.attr("id");
    if (F != undefined) {
        B["_cellId"] = F
    }
    $.ajax({
        type: "POST", url: report.asynQueryUrl, data: B, dataType: "json", success: function (N) {
            var L = N.type;
            var H = N.msg;
            if (L == 1) {
                var O = "";
                if (E == 1 || E == 2) {
                    O = "chart_" + C
                } else {
                    O = "chart_" + A.attr("id")
                }
                if (O != "") {
                    var M = chart.getChartById(O);
                    M.resize(H)
                }
            } else {
                if (L == 0) {
                    if (E == 0) {
                        A.empty().html(H)
                    } else {
                        if (E == 1 || E == 2) {
                            $("#" + C).empty().html(H)
                        }
                    }
                } else {
                    if (L == 2) {
                        if (E == 0) {
                            var I = A.find("div.pbox");
                            var J = null;
                            if (I.length == 0) {
                                J = A.children("div");
                                J.empty().html(H)
                            } else {
                                var G = I.find("div.pbox-header");
                                if (G.length == 0) {
                                    var K = I.find("div.simplebar-content").length == 0 ? I : I.find("div.simplebar-content");
                                    K.empty().html(H)
                                } else {
                                    G.next().remove();
                                    G.parent().append(H)
                                }
                                J = I
                            }
                            if (reportList) {
                                reportList.areaResize(J)
                            }
                        } else {
                            $("#" + C).empty().html(H)
                        }
                    }
                }
            }
        }, error: function (G) {
            if (G.status == 403) {
                layer.alert("没有权限访问该页面")
            } else {
                if (G.status == 401) {
                    layer.alert("会话失效，请重新登录系统")
                }
            }
        }
    })
};
Report.prototype.getArgObject = function () {
    var A = new Object();
    $("#reportQuery-form").find("input").each(function () {
        if ($(this).attr("type") == "button") {
            return true
        }
        var D = $(this).attr("name");
        if ($(this).attr("type") == "checkbox") {
            if ($(this).attr("checked")) {
                var B = A[D];
                if (B == null || B == undefined) {
                    B = new Array();
                    A[D] = B
                }
                B.push($(this).val())
            }
            return true
        }
        if ($(this).attr("type") == "radio") {
            if ($(this).is(":checked")) {
                A[D] = $(this).val()
            }
            return true
        }
        var C = $(this).val();
        A[D] = C
    });
    $("#reportQuery-form").find("select").each(function () {
        var C = $(this).attr("name");
        var B = $(this).val();
        A[C] = B
    });
    return A
};
Report.prototype.btnQueryWithParam = function () {
    this.loadContentWithParam(true)
};
Report.prototype.loadContentWithParam = function (C) {
    var B = this.getArgObject();
    var A = 0;
    if (C) {
        A = layer.load(2, {shade: [0.5, "#fff"]})
    }
    $.ajax({
        type: "POST", url:"../../php/list.php", data: B, dataType: "html", success: function (D) {
            $("#table-content").empty().html(D);
            if (C) {
                layer.close(A)
            }
        }, error: function (D) {
            if (D.status == 403) {
                layer.alert("没有权限访问该页面")
            } else {
                if (D.status == 401) {
                    layer.alert("会话失效，请重新登录系统")
                }
            }
            if (C) {
                layer.close(A)
            }
        }
    })
};
Report.prototype.resetPrinterForm = function () {
    $("#scaleEnable").iCheck("uncheck");
    $("#printStart").val(1);
    $("#printEnd").val(1);
    $("#printer-setting").find("input[name=pageSelect]:eq(1)").iCheck("check")
};
Report.prototype.getPrintPage = function () {
    var C = $("#printer-form-input");
    C.empty();
    var G = this.getArgObject();
    $("canvas").each(function () {
        var H = $(this).parent().parent("div").attr("id");
        var I = chart.getChartById(H);
        if (I != undefined) {
            C.append("<input type='hidden' name='" + H + "' value='" + I.getDataUrl() + "'>")
        }
    });
    $("#printer-form").find(":input").each(function () {
        G[$(this).attr("name")] = $(this).val()
    });
    var D = 0;
    if ($("#scaleEnable").is(":checked")) {
        D = 1
    }
    var A = 1;
    var B = 1;
    var F = $("#printer-setting").find("input[name=pageSelect]:checked").val();
    if (F == 1) {
        A = 1;
        B = 1
    } else {
        if (F == 2) {
            A = $("#printStart").val();
            B = $("#printEnd").val()
        } else {
            A = 1;
            B = -1
        }
    }
    G["_scaleEnable"] = D;
    G["_printStart"] = A;
    G["_printEnd"] = B;
    var E;
    $.ajax({
        type: "POST", url: this.printerUrl, data: G, dataType: "text", async: false, success: function (H) {
            E = H
        }, error: function (H) {
            if (H.status == 403) {
                layer.alert("没有权限访问该页面")
            } else {
                if (H.status == 401) {
                    layer.alert("会话失效，请重新登录系统")
                }
            }
        }
    });
    return E
};
Report.prototype.initPrinter = function () {
    var C = this;
    var B = {mode: "printer"};
    swfobject.embedSWF(this.context + "/anyrt/printer/preview.swf", "printerPage", "0", "0", "10.0.0", B);
    $("#icon-printer").click(function () {
        C.resetPrinterForm();
        layer.open({
            type: 1,
            title: "打印设置",
            shadeClose: true,
            shade: false,
            area: ["500px", "350px"],
            content: $("#printer-setting"),
            btn: ["确定", "取消"],
            yes: function (F) {
                layer.close(F);
                var H = layer.load(2, {shade: [0.5, "#fff"]});
                try {
                    var G = C.getPrintPage();
                    var E = swfobject.getObjectById("printerPage");
                    if (E == null) {
                        layer.msg("请确认flash插件是否启用")
                    } else {
                        E.printPage(G)
                    }
                } catch (I) {
                    layer.msg("查询数据出现错误")
                }
                layer.close(H)
            },
            cancel: function () {
            }
        })
    });
    var D = $(document).height() - 40;
    var A = $(document).width() - 30;
    $("#icon-printView").click(function () {
        C.resetPrinterForm();
        layer.open({
            type: 1,
            title: "打印设置",
            shadeClose: true,
            shade: false,
            area: ["500px", "350px"],
            content: $("#printer-setting"),
            btn: ["确定", "取消"],
            yes: function (E) {
                layer.close(E);
                var F = layer.open({
                    type: 2,
                    title: "打印预览",
                    shadeClose: true,
                    shade: false,
                    shift: -1,
                    area: [A + "px", D + "px"],
                    content: C.context + "/anyrt/printer/printer.jsp"
                })
            },
            cancel: function () {
            }
        })
    });
    $("#icon-printer-pdf").click(function () {
        C.pdfPrinter()
    })
};
Report.prototype.reloadBox = function (B) {
    var C = {};
    $("#reportQuery-form").find(":input").each(function () {
        C[$(this).attr("name")] = $(this).val()
    });
    C["_boxId"] = B;
    var A = this.getPanelBox(B, C);
    A.execute()
};
Report.prototype.rptLinkage = function (F) {
    if (F == null || F == undefined) {
        return false
    }
    for (var D = 0; D < F.length; D++) {
        var C = F[D];
        var E = C.type;
        var A = C.targetId;
        var G = C.params;
        if (A == undefined || A == "") {
            continue
        }
        var B = this.getTargetLinkage(E, A, G);
        B.execute()
    }
    return true
};
Report.prototype.exportFile = function (A) {
    $("#exportQuery-form").attr("action", this.preExportUrl);
    $("#exportQuery-form").attr("target", "");
    $("#_pdfType").val("");
    this.exportQueryForm(A)
};
Report.prototype.exportQueryForm = function (B, C) {
    $("#fileType").val(B);
    var A = $("#export-form-input");
    A.empty();
    $("#reportQuery-form").find("input").each(function () {
        var D = $(this).clone();
        if (D.attr("type") != "button" && D.attr("type") != "submit") {
            D.appendTo(A)
        }
    });
    $("#reportQuery-form").find("select").each(function () {
        var D = $(this).attr("name");
        var E = $(this).val();
        if (E != null && E != "") {
            A.append("<input type='hidden' name='" + D + "' value='" + E + "'>")
        }
    });
    if (!C) {
        $("canvas").each(function () {
            var D = $(this).parent().parent("div").attr("id");
            var E = chart.getChartById(D);
            if (E != undefined) {
                A.append("<input type='hidden' name='" + D + "' value='" + E.getDataUrl() + "'>")
            }
        })
    }
    $("#exportQuery-form").submit()
};
Report.prototype.pdfPrinter = function () {
    $("#_pdfType").val(0);
    var A = navigator.userAgent.toLowerCase();
    var B = A.indexOf("chrome") > -1 && A.indexOf("safari") > -1 && A.indexOf("edge") == -1;
    if (B) {
        $("#exportQuery-form").attr("target", "printIframe");
        $("#printIframe-div").empty().append("<iframe id='printIframe' style='display:none;' name='printIframe'></iframe>");
        $("#printIframe").load(function () {
            var C = document.getElementById("printIframe").contentWindow;
            C.print()
        });
        this.exportQueryForm(1, false)
    } else {
        if (A.indexOf("edge") > -1) {
            $("#exportQuery-form").attr("action", this.context + "/report/go/printer.htm");
            $("#exportQuery-form").attr("target", "_blank");
            this.exportQueryForm(1, true)
        } else {
            $("#exportQuery-form").attr("target", "_blank");
            this.exportQueryForm(1, true)
        }
    }
};
Report.prototype.rptLinked = function (E) {
    var I = E.type;
    var H = E.target;
    var F = E.param;
    var A = this.context + "/" + E.url + ".rpt";
    var D = function () {
        if (F) {
            var N = 0;
            for (var O in F) {
                if (N == 0) {
                    A += "?"
                } else {
                    A += "&"
                }
                A += (O + "=" + F[O]);
                N++
            }
        }
        return A
    };
    if (I == 1) {
        A = E.url;
        if (H == "_blank") {
            location.href = A
        } else {
            if (H == "_win") {
                var J = $(document).width();
                var G = $(document).height();
                var C = E.width > J ? J : E.width;
                var L = E.height > G ? G : E.height;
                layer.open({
                    type: 2,
                    title: "报表",
                    zIndex: 1025,
                    shadeClose: true,
                    shade: false,
                    area: [C + "px", L + "px"],
                    content: D()
                })
            } else {
                self.location.href = A
            }
        }
        return
    }
    if (H == "_win") {
        var J = $(document).width();
        var G = $(document).height();
        var C = E.width > J ? J : E.width;
        var L = E.height > G ? G : E.height;
        layer.open({
            type: 2,
            title: "报表",
            zIndex: 1025,
            shadeClose: true,
            shade: false,
            area: [C + "px", L + "px"],
            content: D()
        })
    } else {
        if (H == "_blank" || !this.isAsync) {
            var B = $("<form>").attr("action", A).attr("method", "post").attr("target", H);
            $("body").append(B);
            if (F) {
                for (var K in F) {
                    var M = $("<input>").attr("type", "hidden").attr("name", K).attr("value", F[K]);
                    B.append(M)
                }
            }
            B.submit();
            B.remove()
        } else {
            loadPage(null, "/" + E.url + ".rpt", F)
        }
    }
}