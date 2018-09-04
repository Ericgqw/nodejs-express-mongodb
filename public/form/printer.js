function getPrintPage(C) {
    var A = getPrintPageObject(C);
    var B = JSON.stringify(A);
    return B
}
function getPrintPageObject(I) {
    var B = $("#jform");
    var D = new Array();
    var C = B.find("tr");
    if (C.length == 0) {
        return
    }
    for (var G = 0; G < C.length; G++) {
        if ($(C[G]).is(":hidden")) {
            continue
        }
        var  N ;
		if(($(C[G]).find("th")).length>0){
			N = ($(C[G]).find("th"));
		}
		if(($(C[G]).find("td")).length>0){
			N = ($(C[G]).find("td"));
		}
        var F = new Array();
        for (var E = 0; E < N.length; E++) {
            var M = $(N[E]);
            if (M.attr("printer") == "false") {
                continue
            }
            var K = M.attr("rowspan") ? M.attr("rowspan") : 1;//获取合并的行
            var H = M.attr("colspan") ? M.attr("colspan") : 1;//获取合并的列
            var L = M.attr("orn") ? M.attr("orn") : G;//获取
            var A = M.attr("ocn") ? M.attr("ocn") : E;
            var J = {
                "rp": K,
                "cp": H,
                "rn": L,
                "cn": A,
                "w": M.width(),
                "h": M.height(),
                "text": getCompText(M, I),
                "style": compUtils.getCompStyle(M)
            };
            F.push(J)
        }
        D.push(F)
    }
    var O = {"report": {"table": D}};
    return O
}
function getCompText(I, D) {
    var A = I.children();
    if (D) {
        return {"val": I.text(), "type": 0}
    }
    if (A.length == 0) {
        return {"val": I.text(), "type": 0}
    }
    if (A.length == 1) {
        if (A.is("input")) {
            return {"val": compUtils.getInputVal(A), "type": 0}
        }
        if (A.is("select")) {
            return {"val": compUtils.getSelectVal(A), "type": 0}
        }
        if (A.is("textarea")) {
            return {"val": compUtils.getTextAreaVal(A), "type": 0}
        }
        if (A.is("div")) {
            var C = compUtils.getDivImage(A);
            if (C != null) {
                return {"val": C, "type": 1}
            }
        }
    }
    if (A.length > 1) {
        var G = I.find("textarea[class=summernote]");
        if (G.length > 0) {
            return {"val": compUtils.getTextAreaVal($(G[0])), "type": 0}
        }
        var F = I.find("select");
        if (F.length > 0) {
            return {"val": compUtils.getSelectVal($(F[0])), "type": 0}
        }
        var E = I.find("input[type=radio]");
        if (E.length > 0) {
            return {"val": compUtils.getRadioVal(E), "type": 0}
        }
        var H = I.find("input[type=checkbox]");
        if (H.length > 0) {
            return {"val": compUtils.getCheckVal(H), "type": 0}
        }
        var B = I.find("input[type=text]");
        if (B.length > 0) {
            return {"val": compUtils.getTreeInputVal($(B[0])), "type": 0}
        }
    }
    return {"val": "", "type": 0}
}
String.prototype.startWith = function (B) {
    var A = new RegExp("^" + B);
    return A.test(this)
};
var compUtils = {
    getInputVal: function (A) {
        if (A.attr("type") == "text") {
            return this.getSafeValue(A.val())
        }
        if (A.attr("type") == "password") {
            return this.getSafeValue(A.val())
        }
        if (A.attr("type") == "radio") {
            if (A.attr("checked") == true) {
                return this.getSafeValue(A.val())
            }
            return ""
        }
        if (A.attr("type") == "checkbox") {
            if (A.attr("checked") == true) {
                return this.getSafeValue(A.val())
            }
            return ""
        }
    }, getTreeInputVal: function (A) {
        return this.getSafeValue($(A[0]).val())
    }, getSelectVal: function (A) {
        return this.getSafeValue($.trim(A.find("option:selected").text()))
    }, getTextAreaVal: function (A) {
        return this.getSafeValue(A.val())
    }, getRadioVal: function (B) {
        for (var C = 0; C < B.length; C++) {
            var D = $(B[C]);
            if (D.attr("checked") != "checked") {
                continue
            }
            var A = D.parent("div").next("span");
            if (A) {
                return this.getSafeValue(A.text())
            }
        }
        return ""
    }, getCheckVal: function (D) {
        var E = "";
        for (var B = 0; B < D.length; B++) {
            var C = $(D[B]);
            if (C.attr("checked") != "checked") {
                continue
            }
            var A = C.parent("div").next("span");
            if (A) {
                E += "," + this.getSafeValue(A.text())
            }
        }
        if (E == "") {
            return E
        }
        return E.substring(1)
    }, getDivImage: function (C) {
        var C = C.find("img");
        if (C.attr("src") != undefined) {
            var B = C.next().val();
            var A = null;
            $.ajax({
                type: "POST",
                url: "fileContent.htm",
                data: {filePath: B},
                async: false,
                dataType: "text",
                success: function (D) {
                    if (D != "") {
                        A = D
                    }
                }
            });
            return A
        }
        return null
    }, getCompStyle: function (K) {
        var G = {};
        var I = new Array();
        var J = K.attr("style");
        if (J == undefined) {
            return G
        }
        var A = J.split(";");
        if (A.length == 0) {
            return G
        }
        for (var H = 0; H < A.length; H++) {
            var B = A[H];
            if (B == "") {
                continue
            }
            var F = B.split(":");
            if (F.length != 2) {
                continue
            }
            var E = $.trim(F[0]);
            var D = $.trim(F[1]);
            if (E == "text-align" || E == "TEXT-ALIGN") {
                G.textAlign = D
            } else {
                if (E == "vertical-align" || E == "VERTICAL-ALIGN") {
                    G.verticalAlign = D
                } else {
                    if (E == "background" || E == "BACKGROUND") {
                        G.bg = D.substring(1)
                    } else {
                        if (E == "font-size" || E == "FONT-SIZE") {
                            G.fontSize = D
                        } else {
                            if (E == "font-weight" || E == "FONT-WEIGHT") {
                                G.fw = D
                            } else {
                                if (E == "text-decoration" || E == "TEXT-DECORATION") {
                                    G.underline = D
                                } else {
                                    if (E == "color" || E == "COLOR") {
                                        G.color = D.substring(1)
                                    } else {
                                        if (E == "font-style" || E == "FONT-STYLE") {
                                            G.italic = D
                                        } else {
                                            if (E == "border" || E == "BORDER") {
                                                var C = D.substr(1, 6);
                                                I.push({"index": 5, "color": C})
                                            } else {
                                                if (E == "border-top" || E == "BORDER-TOP") {
                                                    var C = D.substr(1, 6);
                                                    I.push({"index": 1, "color": C})
                                                } else {
                                                    if (E == "border-bottom" || E == "BORDER-BOTTOM") {
                                                        var C = D.substr(1, 6);
                                                        I.push({"index": 0, "color": C})
                                                    } else {
                                                        if (E == "border-left" || E == "BORDER-LEFT") {
                                                            var C = D.substr(1, 6);
                                                            I.push({"index": 2, "color": C})
                                                        } else {
                                                            if (E == "border-right" || E == "BORDER-RIGHT") {
                                                                var C = D.substr(1, 6);
                                                                I.push({"index": 3, "color": C})
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (I.length > 0) {
            G.border = I
        }
        return G
    }, getSafeValue: function (A) {
        return A
    }
}