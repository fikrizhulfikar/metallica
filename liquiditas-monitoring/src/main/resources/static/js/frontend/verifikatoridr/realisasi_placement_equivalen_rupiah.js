/**
 * Created by israjhaliri on 1/22/18.
 */
$(document).ready(function () {
    initDataTable();
    setInterval(function () {
         initDataTable();
    }, 60000);
});


function initDataTable() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_realisasi_placement",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            console.log("resonse : ", res);
            if (res.return.length > 0) {


                $("#tglcetak").html(res.return[0].TANGGAL)
                var data = res.return;
                $('#table-realisasi_placement tbody').empty();
                var bank = []
                var valas = []
                var imprst = []
                var investasi = []
                var operasi = []
                var impor = []
                $.each(data, function (key, value) {
                    if (value.JENIS == "valas") {
                        bank.push(value.NAMA_BANK);
                        var temp = {
                            label: value.NAMA_BANK,
                            value: value.PINBUK == 0 ? null : value.PINBUK
                        };
                        valas.push(temp);
                    }
                    if (value.JENIS == "imprest") {
                        var temp = {
                            label: value.NAMA_BANK,
                            value: value.PINBUK == 0 ? null : value.PINBUK
                        };
                        imprst.push(temp);
                    }
                    if (value.JENIS == "investasi") {
                        var temp = {
                            label: value.NAMA_BANK,
                            value: value.PINBUK == 0 ? null : value.PINBUK
                        };
                        investasi.push(temp);
                    }
                    if (value.JENIS == "operasi") {
                        var temp = {
                            label: value.NAMA_BANK,
                            value: value.PINBUK == 0 ? null : value.PINBUK
                        };
                        operasi.push(temp);
                    }
                    if (value.JENIS == "impor") {
                        var temp = {
                            label: value.NAMA_BANK,
                            value: value.PINBUK == 0 ? null : value.PINBUK
                        };
                        impor.push(temp);
                    }
                    var html = "";
                    html += "</tr>";
                    $('#table-realisasi_placement tbody').append(html);
                });

                for (var i = 0; i < bank.length; i++){
                    var html = "<tr>" +
                        "<td>" + bank[i] + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(valas[i].value, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(imprst[i].value , 2, ".", ",")+ "</td>" +
                        "<td align='right'>" + accounting.formatNumber(investasi[i].value, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(operasi[i].value, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(impor[i].value, 2, ".", ",") + "</td>" +
                        "</tr>";
                    $('#table-realisasi_placement tbody').append(html);
                }

                // var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                //     "<td>TOTAL</td>" +
                //     "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPREST_TERPUSAT, 2, ".", ",") + "</td>" +
                //     "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPREST_OPERASI, 2, ".", ",") + "</td>" +
                //     "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
                //     "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPOR, 2, ".", ",") + "</td>" +
                //     "</tr>";
                //
                // $('#table-realisasi_placement tbody').append(total1);

                creteChartImprestValas(valas);
                creteChartImprest(imprst)
                creteChartImprestInvestasiTerpusat(investasi)
                creteChartOperaasiTerpusat(operasi)
                creteChartImport(impor)

                hideLoadingCss()
            } else {
                hideLoadingCss("");
                $('#table-realisasi_placement tbody').empty();
                var html = "<tr>" +
                    "<td colspan='6' align='center'> No Data </td>" +
                    "</tr>";
                $('#table-realisasi_placement  tbody').append(html);
            }
        },
        error: function () {
            hideLoadingCss("");
            $('#table-realisasi_placement tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-realisasi_placement  tbody').append(html);

        }
    });
}

function creteChartImprestValas(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest-valas',
                width: '455',
                height: '485',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPREST VALAS",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartImprest(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest',
                width: '455',
                height: '485',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPREST",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartImprestInvestasiTerpusat(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest-investasi-terpusat',
                width: '455',
                height: '485',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPREST IMPREST INVESTASI TERPUSAT",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartOperaasiTerpusat(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest-operasi-terpusat',
                width: '455',
                height: '485',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMREST OPERASI TERPUSAT",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartImport(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-impor',
                width: '455',
                height: '485',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPORT",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}
