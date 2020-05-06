$(document).ready(function () {
    initDataTable();
    setInterval(function () {
        initDataTable();
    }, 60000);
});

function initDataTable() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_derivatif_deposito",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            // console.log(res);
            var data = res.return;
            $('#table-produk-derivatif tbody').empty();
            $.each(data, function (key, val) {
                var str = val.NAMA_BANK;
                var html = "<tr>" +
                    "<td>" + str + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.FORWARD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.SWAP, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.CALL_SPREAD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.DEPOSITO_USD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.DEPOSITO_IDR, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-produk-derivatif tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_FORWARD, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SWAP, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_CALLSPREAD, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_DEPOSITO_USD, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_DEPOSITO_IDR, 2, ".", ",") + "</td>" +
                "</tr>";

            var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                "<td>EQ IDR</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_FORWARD, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_SWAP, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_CALLSPREAD, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_DEPOSITO_USD, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_DEPOSITO_IDR, 2, ".", ",") + "</td>" +
                "</tr>";
            $('#table-produk-derivatif tbody').append(total1);
            $('#table-produk-derivatif tbody').append(total2);


            var dataPieHedging = [];
            $.each(res.OUT_PIE_FORWARD, function (index, value) {
                var jml = value.BIAYA_HEDGING;
                var dataPieTemp = {
                    label: value.NAMA_BANK,
                    value: value.BIAYA_HEDGING == 0 ? null : value.BIAYA_HEDGING
                };
                dataPieHedging.push(dataPieTemp)
            });
            creteChartHedging(dataPieHedging);

            var dataPieSwap = [];
            $.each(res.OUT_PIE_SWAP, function (index, value) {

                var dataPieTemp = {
                    label: value.NAMA_BANK,
                    value: value.BIAYA_HEDGING == 0 ? null : value.BIAYA_HEDGING
                };
                dataPieSwap.push(dataPieTemp)
            });
            creteChartSwap(dataPieSwap);


            var dataPieCallSpread = [];
            $.each(res.OUT_PIE_CALLSPREAD, function (index, value) {

                var dataPieTemp = {
                    label: value.NAMA_BANK,
                    value: value.BIAYA_HEDGING == 0 ? null : value.BIAYA_HEDGING
                };
                dataPieCallSpread.push(dataPieTemp)
            });
            creteChartCallSpread(dataPieCallSpread);


            var dataPieUsd = [];
            $.each(res.OUT_PIE_DEPOSITO_USD, function (index, value) {

                var dataPieTemp = {
                    label: value.NAMA_BANK,
                    value: value.DEPOSITO_USD == 0 ? null : value.DEPOSITO_USD
                };
                dataPieUsd.push(dataPieTemp)
            });
            creteChartUsd(dataPieUsd);


            var dataPieIdr = [];
            $.each(res.OUT_PIE_DEPOSITO_IDR, function (index, value) {

                var dataPieTemp = {
                    label: value.NAMA_BANK,
                    value: value.DEPOSITO_IDR == 0 ? null : value.DEPOSITO_IDR
                };
                dataPieIdr.push(dataPieTemp)
            });
            creteChartIdr(dataPieIdr);

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data DERIVATIF AND DEPOSTIO");
            hideLoadingCss("");
            $('#table-produk-derivatif tbody').empty();
            var html = "<tr>" +
                "<td colspan='6' align='center'> No Data </td>" +
                "</tr>";
            $('#table-produk-derivatif  tbody').append(html);

        }
    });
}

function creteChartHedging(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-hedging',
                width: '455',
                height: '490',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "DERIVATIF  FORWARD",
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

function creteChartSwap(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-swap',
                width: '455',
                height: '490',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "DERIVATIF SWAP",
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

function creteChartCallSpread(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-call-spread',
                width: '455',
                height: '490',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "DERIVATIF CALL SPREAD",
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

function creteChartUsd(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-usd',
                width: '455',
                height: '490',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "DEPOSITO USD",
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

function creteChartIdr(data) {
    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-idr',
                width: '455',
                height: '490',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "DEPOSITO IDR",
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
