$(document).ready(function () {
    initDataTableImprstValas();

    setInterval(function () {
        initDataTableImprstValas();
    }, 60000);
});

function initDataTableImprstValas() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rekening",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);
            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-imprst-valas tbody').empty();
            $.each(data, function (key, val) {
                var html = "<tr>" +
                    "<td>" + val.ID_BANK + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_EUR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_MYR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_USD_GLOBAL,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-imprst-valas tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_USD,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_JPY,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MYR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_GLOBAL,2,".",",") + "</td>" +
                "</tr>";

            var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                "<td>EQ IDR</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_USD,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_JPY,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_MYR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_GLOBAL,2,".",",") + "</td>" +
                "</tr>";
            $('#table-imprst-valas tbody').append(total1);
            $('#table-imprst-valas tbody').append(total2);


            var dataPieUSD = [];
            $.each(res.OUT_PIE_USD, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieUSD.push(dataPieTemp)
            });

            var dataPieEUR = [];
            $.each(res.OUT_PIE_EUR, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieEUR.push(dataPieTemp)
            });

            var dataPieJPY = [];
            $.each(res.OUT_PIE_JPY, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieJPY.push(dataPieTemp)
            });

            // var dataPieJPY = [];
            // $.each(res.OUT_PIE_JPY, function (index, value) {
            //     var dataPieTemp = {
            //         label: value.ID_BANK,
            //         value: value.NILAI == 0 ? null : value.NILAI
            //     };
            //     dataPieJPY.push(dataPieTemp)
            // });

            var dataPieGlobalUSD = [];
            $.each(res.OUT_PIE_GLOBALBOND, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieGlobalUSD.push(dataPieTemp)
            });

            console.log("");

            creteChartUSDImprstValas(dataPieUSD);
            creteChartEURImprstValas(dataPieEUR);
            creteChartJPYImprstValas(dataPieJPY);
            // creteChartJPYImprstValas(dataPieJPY);
            creteChartUSDGlobalBond(dataPieGlobalUSD);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-imprst-valas tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-imprst-valas tbody').append(html);
        }
    });
}

function creteChartUSDImprstValas(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-USD-imprst-valas',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "USD IMPREST",
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

function creteChartEURImprstValas(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-EUR-imprst-valas',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "EUR IMPREST",
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

function creteChartJPYImprstValas(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-JPY-imprst-valas',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "JPY IMPREST",
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

// function creteChartMYRImprstValas(data) {
//     console.log(data);
//     FusionCharts.ready(function () {
//         var fusioncharts = new FusionCharts({
//                 type: 'pie2d',
//                 renderAt: 'chart-JPY-imprst-valas',
//                 width: '635',
//                 height: '450',
//                 dataFormat: 'json',
//                 dataSource: {
//                     "chart": {
//                         "caption": "JPY IMPREST",
//                         "numbersuffix": " %",
//                         "exportEnabled": "1",
//                         "bgColor": "#77D5D4",
//                         "showLabels": "0",
//                         "isSmartLineSlanted": "0",
//                         "showBorder": "0",
//                         "showLegend": "1",
//                         "baseFontSize": "12"
//                     },
//                     "data": data
//                 }
//             }
//         );
//         fusioncharts.render();
//     });
// }

function creteChartUSDGlobalBond(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-USD-global-bond',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "USD GLOBAL BOND",
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