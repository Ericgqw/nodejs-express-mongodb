var FormDataList = function (A) {
    this.context = A
};
FormDataList.prototype = {
    init: function () {
        this.initEvent()
    }
};
FormDataList.prototype.initEvent = function () {
    var A = this;
    $("#icon-add-form").click(function () {
        var C = $(window).width() - 30;
        var B = $(window).height() - 40;
        C = Math.max(100, C);
        B = Math.max(50, B);
        var D = $("#formId").val();
        layerIndex = layer.open({
            type: 2,
            title: "新增数据",
            shadeClose: true,
            shade: false,
            area: [C + "px", B + "px"],
            content: "Nbiao.html"
        })
    });
    $("#icon-edit-form").click(function () {
        var D = $(window).width() - 30;
        var B = $(window).height() - 40;
        D = Math.max(100, D);
        B = Math.max(50, B);
        var C = $("input[type=checkbox]:checked").val();
        if (!C) {
            layer.alert("请选择要更新的数据!", {icon: 0, shift: -1});
            return
        }
        var E = $("#formId").val();
        layerIndex = layer.open({
            type: 2,
            title: "更新数据",
            shadeClose: true,
            shade: false,
            area: [D + "px", B + "px"],
            content: A.context + "/form/modView.htm?formId=" + E + "&dataId=" + C
        })
    });
    $("#icon-query-form").click(function () {
        var D = $(window).width() - 30;
        var B = $(window).height() - 40;
        D = Math.max(100, D);
        B = Math.max(50, B);
        var C = $("input[type=checkbox]:checked").val();
        if (!C) {
            layer.alert("请选择要显示的数据!", {icon: 0, shift: -1});
            return
        }
        var E = $("#formId").val();
        layer.open({
            type: 2,
            title: "显示数据",
            shadeClose: true,
            shade: false,
            area: [D + "px", B + "px"],
            content: A.context + "/form/queryForm.htm?formId=" + E + "&dataId=" + C
        })
    });
    $("#icon-del-form").click(function () {
        var C = new Array();
        $("input[type=checkbox]:checked").each(function () {
            C.push($(this).val())
        });
        var B = $("#formId").val();
        if (C.length == 0) {
            layer.alert("请选择要删除的数据!", {icon: 0, shift: -1});
            return
        }
        layer.confirm("您确定要删除选中的数据吗?", {icon: 3, shift: -1, title: "提示"}, function (D) {
            $.ajax({
                type: "POST",
                url: A.context + "/form/delete.htm",
                data: {formId: B, dataId: C},
                dataType: "json",
                success: function (E) {
                    layer.close(D);
                    if (!E) {
                        layer.alert("数据删除出现错误!", {icon: 2})
                    } else {
                        report.loadContentWithParam()
                    }
                },
                error: function () {
                    layer.alert("数据删除出现错误!", {icon: 2})
                }
            })
        })
    });
    $("li.tl-excel-import-history").click(function () {
        var C = $(window).width();
        var B = $(window).height();
        C = Math.min(600, C);
        B = Math.min(400, B);
        var D = $("#formId").val();
        $.ajax({
            type: "POST",
            url: A.context + "/form/import_history.htm",
            data: {formId: D},
            dataType: "json",
            success: function (E) {
                if (E) {
                    layer.open({
                        type: 1,
                        title: "Excel导入历史记录",
                        shadeClose: true,
                        shade: false,
                        area: [C + "px", B + "px"],
                        content: $("#win-import-excel-record"),
                        success: function () {
                            var F = $("#win-import-excel-record").find("table");
                            F.find("tr:gt(1)").remove();
                            for (var G = 0; G < E.length; G++) {
                                var H = F.find("tr:eq(1)").clone().show();
                                F.append(H);
                                var I = E[G];
                                H.find("td:eq(0)").html(I.fileName);
                                H.find("td:eq(1)").html(I.importDate);
                                H.find("td:eq(2)").html(I.userName);
                                H.find("td:eq(3)").find("a").attr("rId", I.id);
                                H.find("a").click(function () {
                                    var J = $(this);
                                    var K = $(this).attr("rId");
                                    layer.confirm("您确定要删除该导入的数据吗?", {icon: 3, shift: -1, title: "提示"}, function (L) {
                                        $.ajax({
                                            type: "POST",
                                            url: A.context + "/form/importexcel/delete.htm",
                                            data: {formId: D, dataId: K},
                                            dataType: "json",
                                            success: function (M) {
                                                layer.close(L);
                                                if (!M) {
                                                    layer.alert("数据删除出现错误!", {icon: 2})
                                                } else {
                                                    J.parent().parent().remove();
                                                    report.loadContentWithParam()
                                                }
                                            },
                                            error: function () {
                                                layer.alert("数据删除出现错误!", {icon: 2})
                                            }
                                        })
                                    })
                                })
                            }
                        }
                    })
                }
            },
            error: function () {
                layer.alert("数据查询出现错误!", {icon: 2})
            }
        })
    })
}