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
        url: baseUrl + "api_dashboard/get_idr_imprest",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            // console.log("resonse : ",res);
            $("#tglcetak").html(res.return[0].TANGGAL)
            var data = res.return;
            $('#table-imprst-idr tbody').empty();
            $.each(data, function (key, val) {
                var str = val.BANK;
                var html = "<tr>" +
                    "<td>" + str + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.IMPREST_TERPUSAT, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.IMPREST_OPERASI, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.IMPOR, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-imprst-idr tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPREST_TERPUSAT, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPREST_OPERASI, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_IMPOR, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-imprst-idr tbody').append(total1);

            var dataPieTerpusat = [];
            $.each(res.OUT_PIE_TERPUSAT, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieTerpusat.push(temp)
            });
            creteChartTerpusat(dataPieTerpusat);

            var dataPieOperasi = [];
            $.each(res.OUT_PIE_OPERASI, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieOperasi.push(temp)
            });
            creteChartOperasi(dataPieOperasi);

            var dataPieInvestasi = [];
            $.each(res.OUT_PIE_INVESTASI, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieInvestasi.push(temp)
            });
            creteChartInvestasi(dataPieInvestasi);

            var dataPieImpor = [];
            $.each(res.OUT_PIE_IMPOR, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieImpor.push(temp)
            });
            creteChartImport(dataPieImpor);

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-imprst-idr tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-imprst-idr  tbody').append(html);

        }
    });
}

function creteChartTerpusat(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest-terpusat',
                width: '455',
                height: '435',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPREST TERPUSAT",
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

function creteChartOperasi(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest-operasi',
                width: '455',
                height: '435',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPREST OPERASI",
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

function creteChartInvestasi(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-imprest-investasi',
                width: '455',
                height: '435',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPREST INVESTASI",
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
                height: '435',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "IMPOR",
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
