String.prototype.endWith = function (A) {
    if (A == null || A == "" || this.length == 0 || A.length > this.length) {
        return false
    }
    if (this.substring(this.length - A.length) == A) {
        return true
    } else {
        return false
    }
    return true
};
Date.prototype.format = function (A) {
    var C = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "i+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(A)) {
        A = A.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (var B in C) {
        if (new RegExp("(" + B + ")").test(A)) {
            A = A.replace(RegExp.$1, (RegExp.$1.length == 1) ? (C[B]) : (("00" + C[B]).substr(("" + C[B]).length)))
        }
    }
    return A
};
var Form = function (A, B) {
    this.context = A;
    this.isQuery = B
};
Form.prototype = {
    init: function () {
        this.reportUrl = this.context + "/anyrt/printer/preview.swf";
        this.printerUrl = this.context + "/anyrt/printer/formPrinter.jsp";
        this.parseFileUrl = this.context + "/form/file_parse.htm";
        this.delFileUrl = this.context + "/form/del_file.htm";
        this.uploadUrl = this.context + "/form/upload.htm";
        this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initComponent();
        this.initPrinter(true);
        this.initPage()
    }, initAsyn: function () {
        this.reportUrl = this.context + "/anyrt/printer/preview.swf";
        this.printerUrl = this.context + "/anyrt/printer/formPrinter.jsp";
        this.parseFileUrl = this.context + "/form/file_parse.htm";
        this.delFileUrl = this.context + "/form/del_file.htm";
        this.uploadUrl = this.context + "/form/upload.htm";
        this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initComponent();
        this.initPrinter(true);
        var A = $(".main-box").height() - $(".page-menu").height() - $(".tool-info").height() - 40;
        $("#contentDiv").height(A - 45 - 4)
    }, initPre: function () {
        this.init();
        this.asynCanvasUrl = this.context + "/form/pre/canvas.htm";
        this.fxUrl = this.context + "/form/pre/fx.htm"
    }, initFormWin: function () {
        this.reportUrl = this.context + "/anyrt/printer/preview.swf";
        this.printerUrl = this.context + "/anyrt/printer/formPrinter.jsp";
        this.parseFileUrl = this.context + "/form/file_parse.htm";
        this.delFileUrl = this.context + "/form/del_file.htm";
        this.uploadUrl = this.context + "/form/upload.htm";
        this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initComponent();
        this.initPrinter(false);
        this.initPage()
    }, initFormDetail: function (C) {
        var B = this;
        this.reportUrl = this.context + "/anyrt/printer/preview.swf";
        this.printerUrl = this.context + "/anyrt/printer/formPrinter.jsp";
        this.parseFileUrl = this.context + "/form/file_parse.htm";
        this.delFileUrl = this.context + "/form/del_file.htm";
        this.uploadUrl = this.context + "/form/upload.htm";
        this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initPrinter(false);
        if (C) {
            var A = $(".main-box").height() - $(".page-menu").height() - $(".tool-info").height() - $(".success-full-page").height() - 31;
            $("#contentDiv").height(A - 45)
        } else {
            this.initPage()
        }
        $("#icon-export").click(function () {
            B.exportExcel()
        });
        $("#icon-bpm-image").click(function () {
            var F = $(window).width();
            var D = $(window).height();
            F = Math.max(100, F - 30);
            D = Math.max(50, D - 40);
            var E = layer.open({
                type: 2,
                title: "流程图",
                shadeClose: true,
                shade: false,
                shift: -1,
                area: [F + "px", D + "px"],
                content: B.context + "/wf/find_processDoc_image.htm?pdId=" + B.pdId
            })
        })
    }, initWfForm: function () {
        this.reportUrl = this.context + "/anyrt/printer/preview.swf";
        this.printerUrl = this.context + "/anyrt/printer/formPrinter.jsp";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initPrinter(false);
        var A = $("body").height() - $(".header-tool").height() - $(".tool-info").height() - $("#approver-form-div").height() - 15;
        $("#contentDiv").height(A)
    }, initModWfForm: function () {
        this.reportUrl = this.context + "/anyrt/printer/preview.swf";
        this.printerUrl = this.context + "/anyrt/printer/formPrinter.jsp";
        this.parseFileUrl = this.context + "/form/file_parse.htm";
        this.delFileUrl = this.context + "/form/del_file.htm";
        this.uploadUrl = this.context + "/form/upload.htm";
        this.asynCompQuery = this.context + "/form/asyn_comp_query.htm";
        this.asynCanvasUrl = this.context + "/form/canvas.htm";
        this.fxUrl = this.context + "/form/fx.htm";
        this.validateUrl = this.context + "/form/validate.htm";
        this.initComponent();
        this.initPrinter(false);
        this.initPage()
    }
};
Form.prototype.getPrintPage = function () {
    var B = this;
    var A = null;
    
    var D = getPrintPageObject(this.isQuery);
    if (A != null) {
        D.report.canvas = A
    }
    var C = JSON.stringify(D);
    return C
};
Form.prototype.initPage = function () {
    var A = $(document).height() - $(".page-menu").height() - 35;
    $("#contentDiv").height(A)
};
Form.prototype.initPrinter = function (A) {
    $("#icon-printer").click(function () {
        var B = form.getPrintPage();
        $("#exportData").val(B);
        $("#_pdfType").val("1");
        $("#formExportFile").attr("target", "_blank");
        $("#formExportFile").submit();
    })
};
Form.prototype.initDate = function (A) {
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
    if (A.attr("tq") != undefined) {
        if (!A.hasClass(".selectLinkage")) {
            A.change(function () {
                report.btnQueryWithParam()
            })
        }
    }
    laydate.render(C);
    A.next().click(function (H) {
        $(this).prev().trigger("focus");
        H.stopPropagation()
    })
};
Form.prototype.initComponent = function () {
    var D = this;
    var B = function (G) {
        var F = new RegExp("^[A-Za-z]{1,2}[0-9]+$");
        return F.test(G)
    };
    $("#icon-add").click(function () {
        if (!$("#qryForm").valid()) {
            return false
        }
        var Q = $("#submitValidate").find("div");
        for (var M = 0; M < Q.length; M++) {
            var K = $(Q[0]);
            var J = K.attr("fx");
            var G = K.html();
            var I = {};
            I["formId"] = $("#formId").val();
            I["idx"] = K.attr("idx");
            var N = J.split(",");
            for (var L = 0; L < N.length; L++) {
                var F = N[L];
                if (F == "") {
                    continue
                }
                if (B(F)) {
                    continue
                }
                var R = null;
                var T = $("input[name=" + F + "]");
                if (T.length > 0) {
                    if (T.length == 1) {
                        R = T.val()
                    } else {
                        var O = new Array();
                        T.each(function () {
                            O.push($(this).val())
                        });
                        R = O
                    }
                } else {
                    var H = $("select[name=" + F + "]");
                    if (H.length > 0) {
                        if (H.length == 1) {
                            R = H.val()
                        } else {
                            var O = new Array();
                            H.each(function () {
                                O.push($(this).val())
                            });
                            R = O
                        }
                    }
                }
                I[F] = R
            }
            var P = false;
            $.ajax({
                type: "POST", url: D.validateUrl, data: I, async: false, dataType: "json", success: function (U) {
                    if (U == 1) {
                        layer.alert("表单不存在!")
                    } else {
                        if (U == 2) {
                            layer.alert(G)
                        } else {
                            P = true
                        }
                    }
                }
            });
            if (!P) {
                return false
            }
        }
        $("#jform tr").each(function () {
            var U = $(this);
            if (U.is(":hidden")) {
                U.remove()
            }
        });
        var S = $("#formDiv").height();
        $("#formDiv").hide();
        $("#resultIfr").show();
        $("#resultIfr").height(S);
        D.loadIndex = layer.load(2, {shade: [0.5, "#fff"]});
        $("#qryForm").submit()
    });
    var C = 0;
    $(".input-file").each(function () {
        C++;
        var H = $(this).attr("nowUpload") == "true";
        var K = new FileUploader($(this), C, "file", D.context, H);
        var F = $(this).val();
        if (F == "") {
            K.init()
        } else {
            var L = F.split(",");
            var G = {}, N = {};
            for (var I = 0; I < L.length; I++) {
                if (L[I] == "") {
                    continue
                }
                var J = L[I].split(":");
                var M = J[1].replace(new RegExp("/", "gm"), "").replace(new RegExp("\\.", "gm"), "");
                G[M] = J[0];
                N[M] = J[1]
            }
            K.init(G, N)
        }
    });
    $(".input-image").each(function () {
        C++;
        var H = $(this).attr("nowUpload") == "true";
        var J = new FileUploader($(this), C, "img", D.context, H);
        var F = $(this).val();
        if (F == "") {
            J.init()
        } else {
            var K = F.split(",");
            var G = {}, M = {};
            for (var I = 0; I < K.length; I++) {
                if (K[I] == "") {
                    continue
                }
                var N = K[I];
                var L = N.replace(new RegExp("/", "gm"), "").replace(new RegExp("\\.", "gm"), "");
                G[L] = "";
                M[L] = N
            }
            J.init(G, M)
        }
    });
    $(".form_time").each(function () {
        D.initDate($(this))
    });
    $("input[type=radio]").iCheck({radioClass: "iradio_minimal-green"});
    $("input[type=checkbox]").iCheck({checkboxClass: "icheckbox_minimal-green"});
    $("input[type=radio]").on("ifChecked", function (F) {
        $(this).attr("checked", "checked")
    }).on("ifUnchecked", function (F) {
        $(this).removeAttr("checked")
    });
    $("input[type=checkbox]").on("ifChecked", function (F) {
        $(this).attr("checked", "checked")
    }).on("ifUnchecked", function (F) {
        $(this).removeAttr("checked")
    });
    $(".selectpicker").each(function () {
        var F = $(this).attr("multi");
        if (F == "1") {
            $(this).attr("title", "").selectpicker({iconBase: "fa", tickIcon: "fa-check red"}).selectpicker("refresh")
        } else {
            $(this).attr("title", "").selectpicker("refresh")
        }
    });
    $(".summernote").each(function () {
        var G = $(this).attr("width");
        var F = $(this).attr("height");
        $(this).summernote({
            height: F,
            width: G,
            tabsize: 2,
            toolbar: [["style", ["style"]], ["font", ["bold", "italic", "underline", "clear"]], ["color", ["color"]], ["fontname", ["fontname"]], ["fontsize", ["fontsize"]], ["para", ["ul", "ol", "paragraph"]], ["height", ["height"]], ["table", ["table"]], ["insert", ["link", "hr"]], ["view", ["fullscreen", "codeview"]], ["help", ["help"]]],
        })
    });
    var A = 0;
    $("input.input-tree").each(function () {
        var G = new TreeObj(A);
        G.init($(this));
        var F = $(this).attr("icon-color");
        if (F != undefined && F != "") {
            $(this).next().next().css("color", F)
        }
        A++
    });
    $("#icon-export").click(function () {
        D.exportExcel()
    });
    var E = $("#icon-upload").offset();
    $("#excelDiv").offset(E);
    $("#upload-excel-file").bind("change", function () {
        D.uploadImportFile()
    });
    $(".selectLinkage").change(function () {
        D.linkage(this)
    });
    $("#icon-approve").click(function () {
        $.ajax({
            type: "POST",
            data: {pdId: D.pdId},
            url: D.context + "/wf/find_actorId_org.htm",
            dataType: "json",
            success: function (F) {
                if (F > 0) {
                    layer.open({
                        type: 2,
                        title: "选择审核人",
                        shadeClose: true,
                        shift: -1,
                        area: ["500px", "400px"],
                        content: D.context + "/doc/go_select_approver.htm?orgId=" + F,
                        btn: ["确定", "取消"],
                        yes: function (G) {
                            var H = $("#layui-layer-iframe" + G)[0].contentWindow;
                            var I = H.getSelectNodes();
                            if (I.key) {
                                $("#qryForm").append("<input type='hidden' name='" + I.key + "' value='" + I.value + "'>").append("<input type='hidden' name='_submitProcess' value='1'>");
                                $("#icon-add").click()
                            }
                            layer.close(G)
                        },
                        cancel: function (G) {
                            layer.close(G)
                        }
                    })
                } else {
                    $("#qryForm").append("<input type='hidden' name='_submitProcess' value='1'>");
                    $("#icon-add").click()
                }
            }
        })
    });
    $("#icon-bpm-image").click(function () {
        var H = $(window).width();
        var F = $(window).height();
        H = Math.max(100, H - 30);
        F = Math.max(50, F - 40);
        var G = layer.open({
            type: 2,
            title: "流程图",
            shadeClose: true,
            shift: -1,
            shade: false,
            area: [H + "px", F + "px"],
            content: D.context + "/wf/find_processDoc_image.htm?pdId=" + D.pdId
        })
    });
    $("#form-list").click(function () {
        var F = "/form/" + $("#formId").val() + ".list";
        parent.loadPage(D.listName, D.listName, F)
    });
    $("input").each(function () {
        if ($(this).attr("fxTarget") != undefined) {
            var F = $(this).attr("fxTarget");
            $(this).change(function () {
                var G = F.split(",");
                for (var H = 0; H < G.length; H++) {
                    var I = G[H];
                    D.targetChange(I)
                }
            })
        }
    });
    $("#qryForm").validation({tip: true})
};
Form.prototype.targetChange = function (S) {
    var E = function (V) {
        var U = new RegExp("^[A-Za-z]{1,2}[0-9]+$");
        return U.test(V)
    };
    if (S == "") {
        return
    }
    var F = {};
    F["formId"] = $("#formId").val();
    if (E(S)) {
        var G = $("td[pos=" + S + "]");
        var M = new Array();
        G.each(function () {
            if ($(this).parent().is(":hidden")) {
                return true
            }
            M.push($(this))
        });
        if (M.length == 0) {
            return
        }
        var O = G.attr("fx");
        if (O == undefined) {
            return
        }
        var N = O.split(",");
        F["_pos"] = S;
        for (var L = 0; L < N.length; L++) {
            var T = N[L];
            if (E(T)) {
                continue
            }
            var Q = null;
            var B = $("input[name=" + T + "]");
            if (B.length > 0) {
                if (B.length == 1) {
                    Q = B.val()
                } else {
                    var K = new Array();
                    B.each(function () {
                        if ($(this).parent().parent().is(":hidden")) {
                            return true
                        }
                        K.push($(this).val())
                    });
                    Q = K
                }
            } else {
                var A = $("select[name=" + T + "]");
                if (A.length > 0) {
                    if (A.length == 1) {
                        Q = A.val()
                    } else {
                        var K = new Array();
                        A.each(function () {
                            if ($(this).parent().parent().is(":hidden")) {
                                return true
                            }
                            K.push($(this).val())
                        });
                        Q = K
                    }
                }
            }
            F[T] = Q
        }
        for (var L = 0; L < M.length; L++) {
            var R = $(M[L]);
            var D = {};
            if (M.length > 1) {
                for (var J in F) {
                    var I = F[J];
                    if (I instanceof Array) {
                        D[J] = I[L]
                    } else {
                        D[J] = I
                    }
                }
            } else {
                D = F
            }
            $.ajax({
                type: "POST", url: form.fxUrl, data: D, async: false, dataType: "json", success: function (U) {
                    R.html(U)
                }
            })
        }
    } else {
        var C = $("input[name=" + S + "]");
        var P = new Array();
        C.each(function () {
            if ($(this).parent().parent().is(":hidden")) {
                return true
            }
            P.push($(this))
        });
        if (P.length > 0) {
            F["_compName"] = S;
            var O = C.attr("fx");
            var N = O.split(",");
            for (var L = 0; L < N.length; L++) {
                var T = N[L];
                if (E(T)) {
                    continue
                }
                var Q = null;
                var B = $("input[name=" + T + "]");
                if (B.length > 0) {
                    if (B.length == 1) {
                        Q = B.val()
                    } else {
                        var K = new Array();
                        B.each(function () {
                            if ($(this).parent().parent().is(":hidden")) {
                                return true
                            }
                            K.push($(this).val())
                        });
                        Q = K
                    }
                } else {
                    var A = $("select[name=" + T + "]");
                    if (A.length > 0) {
                        if (A.length == 1) {
                            Q = A.val()
                        } else {
                            var K = new Array();
                            A.each(function () {
                                if ($(this).parent().parent().is(":hidden")) {
                                    return true
                                }
                                K.push($(this).val())
                            });
                            Q = K
                        }
                    }
                }
                F[T] = Q
            }
            for (var L = 0; L < P.length; L++) {
                var H = $(P[L]);
                var D = {};
                if (P.length > 1) {
                    for (var J in F) {
                        var I = F[J];
                        if (I instanceof Array) {
                            D[J] = I[L]
                        } else {
                            D[J] = I
                        }
                    }
                } else {
                    D = F
                }
                $.ajax({
                    type: "POST", url: form.fxUrl, data: D, async: false, dataType: "json", success: function (U) {
                        H.val(U)
                    }
                })
            }
        }
    }
};
Form.prototype.exportExcel = function () {
    var A = getPrintPage();
    $("#exportData").val(A);
    $("#_pdfType").val("");
    $("#formExportFile").attr("target", "");
	$("#formExportFile").submit()
};
Form.prototype.resetImportFile = function () {
    var A = "<input class='addfileI' type='file' name='upload-excel-file' id='upload-excel-file'>";
    $("#excelDiv").append(A);
    $("#upload-excel-file").bind("change", function () {
        form.uploadImportFile()
    })
};
Form.prototype.appendFormData = function (d) {
    if (d.length == 0) {
        return false
    }
    var O = $("#jform").find("tr:visible");
    for (var U = 0; U < d.length; U++) {
        var S = d[U];
        var K = null;
        if (U < O.length) {
            K = O.eq(U)
        } else {
            var L = O.eq(O.length - 1).attr("class");
            var V = $("#jform").find("tr:hidden");
            V.each(function () {
                if ($(this).hasClass(L)) {
                    var e = $(this).clone().show();
                    $(this).parent().append(e);
                    K = e
                }
            })
        }
        for (var T = 0; T < S.length; T++) {
            if (K == null) {
                continue
            }
            var F = K.find("td").eq(T);
            if (F.length == 0) {
                continue
            }
            var D = F.children();
            if (D.length == 0) {
                continue
            }
            if (D.length == 1) {
                if (D.is("input")) {
                    if (D.attr("type") == "radio" || D.attr("type") == "checkbox") {
                        if (D.val() == S[T].val) {
                            D.attr("checked", true)
                        }
                        continue
                    }
                    if (D.attr("class") == "form_time form-control") {
                        var Z = S[T].val;
                        if (Z.indexOf("CST") != -1) {
                            var I = Date.parse(Z) - 14 * 60 * 60 * 1000;
                            var W = D.attr("data-date-format");
                            var H = new Date(I);
                            D.val(H.format(W));
                            continue
                        }
                    }
                    D.val(S[T].val)
                } else {
                    if (D.is("select")) {
                        var C = D.children();
                        for (var Q = 0; Q < C.length; Q++) {
                            var R = $(C[Q]);
                            if (R.attr("value") == S[T].val) {
                                R.attr("selected", "selected")
                            }
                        }
                    } else {
                        if (D.is("textarea")) {
                            D.val(S[T].val)
                        }
                    }
                }
            } else {
                var N = F.find("textarea[class=summernote]");
                if (N.length > 0) {
                    $(N[0]).code(S[T].val);
                    continue
                }
                var b = F.find("select");
                if (b.length > 0) {
                    var E = $(b[0]);
                    var C = E.find("option");
                    for (var Q = 0; Q < C.length; Q++) {
                        if ($(C[Q]).text() == S[T].val) {
                            E.val($(C[Q]).val());
                            E.selectpicker("refresh");
                            break
                        }
                    }
                    continue
                }
                var B = F.find("input[type=radio]");
                if (B.length > 0) {
                    for (var Q = 0; Q < B.length; Q++) {
                        var A = $(B[Q]);
                        var J = A.parent("div").next("span");
                        if (!J) {
                            continue
                        }
                        if (J.text() == S[T].val) {
                            A.iCheck("check");
                            break
                        }
                    }
                    continue
                }
                var P = F.find("input[type=checkbox]");
                if (P.length > 0) {
                    for (var Q = 0; Q < P.length; Q++) {
                        var a = $(P[Q]);
                        var J = a.parent("div").next("span");
                        if (!J) {
                            continue
                        }
                        if (J.text() == S[T].val) {
                            a.iCheck("check")
                        } else {
                            a.iCheck("uncheck")
                        }
                    }
                    continue
                }
                var G = F.find("input");
                if (G.length > 0) {
                    var Y = $(G[0]);
                    if (Y.attr("class") == "input-tree form-control") {
                        var M = Y.attr("data");
                        var c = JSON.parse(M);
                        for (var Q = 0; Q < c.length; Q++) {
                            var X = c[Q];
                            if (X.name == S[T].val) {
                                Y.val(X.name);
                                Y.next("input").val(X.saveCode)
                            }
                        }
                    }
                    continue
                }
            }
        }
    }
};
Form.prototype.uploadImportFile = function () {
    var B = layer.load(2);
    var A = this;
    $.ajaxFileUpload({
        url: A.parseFileUrl,
        secureuri: false,
        fileElementName: "upload-excel-file",
        dataType: "json",
        success: function (D, C) {
            A.resetImportFile();
            if (D.code == 411) {
                layer.alert("文件最大不能超过" + D.error, {icon: 2});
                return false
            }
            A.appendFormData(D.value);
            layer.close(B)
        },
        error: function (D, C, E) {
            A.resetImportFile();
            layer.close(B);
            layer.alert("文件上传失败,请选择正确的文件上传!", {icon: 2})
        }
    })
};
Form.prototype.addRow = function (E) {
    var C = this;
    var B = $(E);
    var L = B.parent().parent();
    var M = L.next();
    var D = M.clone();
    var J = D.find("input[seq=1]");
    if (J.length > 0) {
        for (var I = 0; I < J.length; I++) {
            var H = $(J[I]);
            H.val(this.getSequences(H.attr("name")))
        }
    }
    D.show();
    var P = D.attr("class");
    var A = M.next();
    var N = M;
    while (A.hasClass(P)) {
        N = A;
        A = A.next()
    }
    var F = -1;
    M.children("td").each(function (R) {
        var Q = $.trim($(this).html());
        if (Q == "=SEQ()" || Q == "=seq()") {
            F = R;
            return false
        }
    });
    D.insertAfter(N);
    if (F != -1) {
        var K = L.parent().children("tr." + P);
        for (var I = 1; I < K.length; I++) {
            var G = $(K[I]).children("td");
            $(G[F]).empty().html(I)
        }
    }
    D.find("select").each(function () {
        $(this).addClass(" ").attr("title", "").selectpicker("refresh")
    });
    D.find("input").each(function () {
        if ($(this).attr("fxTarget") != undefined) {
            var Q = $(this).attr("fxTarget");
            $(this).change(function () {
                var R = Q.split(",");
                for (var S = 0; S < R.length; S++) {
                    var T = R[S];
                    C.targetChange(T)
                }
            })
        }
    });
    D.find(".form_time").each(function () {
        $(this).removeAttr("lay-key");
        C.initDate($(this))
    });
    var O = {view: {dblClickExpand: false}, data: {simpleData: {enable: true}}};
    D.find(".input-tree").each(function () {
        var R = new TreeObj(idx);
        R.init($(this));
        var Q = $(this).attr("icon-color");
        if (Q != undefined && Q != "") {
            $(this).next().next().css("color", Q)
        }
        idx++
    });
    D.find(".summernote").each(function () {
        var R = $(this).attr("width");
        var Q = $(this).attr("height");
        $(this).summernote({
            height: Q,
            width: R,
            tabsize: 2,
            toolbar: [["style", ["style"]], ["font", ["bold", "italic", "underline", "clear"]], ["color", ["color"]], ["fontname", ["fontname"]], ["fontsize", ["fontsize"]], ["para", ["ul", "ol", "paragraph"]], ["height", ["height"]], ["table", ["table"]], ["insert", ["link", "hr"]], ["view", ["fullscreen", "codeview"]], ["help", ["help"]]],
        })
    });
    return D
};
Form.prototype.getSequences = function (A) {
    var B = this;
    var C = "";
    $.ajax({
        type: "POST",
        async: false,
        url: B.context + "/form/sequence.htm",
        data: {formId: $("#formId").val(), name: A},
        dataType: "json",
        success: function (D) {
            C = D
        }
    });
    return C
};
Form.prototype.delRow = function (B) {
    var A = $(B);
    var F = A.parent().parent();
    var I = F.attr("class");
    var H = F.parent().children("tr." + I + ":hidden");
    F.remove();
    var C = -1;
    H.children("td").each(function (K) {
        var J = $.trim($(this).html());
        if (J == "=SEQ()" || J == "=seq()") {
            C = K;
            return false
        }
    });
    if (C != -1) {
        var G = H.parent().children("tr." + I);
        for (var E = 1; E < G.length; E++) {
            var D = $(G[E]).children("td");
            $(D[C]).empty().html(E)
        }
    }
};
Form.prototype.linkage = function (F) {
    var B = this;
    var E = $(F);
    var A = E.attr("name");
    var H = E.val();
    var I = E.attr("linkageTarget");
    var G = $("select[name='" + I + "']");
    if (G) {
        if (H == undefined || H == "") {
            G.empty();
            G.selectpicker("refresh");
            var C = G.attr("linkageTarget");
            if (C != undefined && C != "") {
                linkage(G)
            }
            return
        }
        var D = {formId: $("#formId").val(), linkageTargetId: I};
        D[A] = H;
        $.ajax({
            type: "POST", url: B.asynCompQuery, data: D, dataType: "text", success: function (J) {
                G.empty().html(J);
                G.selectpicker("refresh");
                B.clearLinkTarget(G)
            }
        })
    }
};
Form.prototype.clearLinkTarget = function (B) {
    var C = B.attr("linkageTarget");
    if (C != undefined && C != "") {
        var A = $("select[name='" + C + "']");
        if (A) {
            A.empty();
            clearLinkTarget(A)
        }
    }
}