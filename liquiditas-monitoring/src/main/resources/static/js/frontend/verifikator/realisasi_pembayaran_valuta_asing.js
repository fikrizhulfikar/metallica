var tempSearch = "";
$(document).ready(function () {
    setInterval(function () {
        search(tempSearch);
    }, 60000);
    search(tempSearch);

    var d = new Date();
    var n = d.getFullYear();

    for (var i = (n - 5); i < (n + 5); i++) {
        $("#year-search").append("<option value=\"" + i + "\">" + i + "</option>\n");
        $("#year-search").val(n);
    }
});

function search(val) {
    tempSearch = val;
    initDataTable(tempSearch)
}

function initDataTable(pYear) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_realisasi_pembayaran_valuta_asing",
        dataType: 'JSON',
        type: "GET",
        data: {
            pYear: pYear
        },
        success: function (res) {
            // console.log("response : ", res);
            if (res.return.length > 0) {
                $('#table-pembayaran-harian tbody').empty();
                $.each(res.return, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.NAMA_PEMBAYARAN + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.USD, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.JPY, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EUR, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.GBP, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.AUD, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.MYR, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.KRW, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR, 2, ".", ",") + "</td>" +
                        "</tr>";
                    $('#table-pembayaran-harian tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_USD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_JPY, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_EUR, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IDR, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_GBP, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_AUD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MYR, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_KRW, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_EQ_IDR, 2, ".", ",") + "</td>" +
                    "</tr>";

                var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                    "<td>EQ IDR</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_USD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_JPY, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_EUR, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-pembayaran-harian tbody').append(total1);
                // $('#table-pembayaran-harian tbody').append(total2);

                $("#date-harian").html(res.return[0].TITLE);
            }


            if (res.OUT_TABLE2.length > 0) {
                $('#table-pembayaran-rekap tbody').empty();
                $.each(res.OUT_TABLE2, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.NAMA_PEMBAYARAN + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.USD, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.JPY, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EUR, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.GBP, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.AUD, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.MYR, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.KRW, 2, ".", ",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR, 2, ".", ",") + "</td>" +
                        "</tr>";
                    $('#table-pembayaran-rekap tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_USD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_JPY, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_EUR, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_IDR, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_GBP, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_AUD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_MYR, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_KRW, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_EQ_IDR, 2, ".", ",") + "</td>" +
                    "</tr>";

                var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                    "<td>EQ IDR</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].EQ_IDR_USD, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].EQ_IDR_JPY, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].EQ_IDR_EUR, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-pembayaran-rekap tbody').append(total1);
                // $('#table-pembayaran-rekap tbody').append(total2);


                $("#date-rekap").html(res.OUT_TABLE2[0].TITLE);
            }

            if (res.OUT_PIE1.length > 1) {
                var dataPieHarian = [];
                $.each(res.OUT_PIE1, function (index, value) {
                    var dataPieTemp = {
                        label: value.NAMA_PEMBAYARAN,
                        value: value.NILAI == 0 ? null : value.NILAI
                    };
                    dataPieHarian.push(dataPieTemp)
                });
                creteChartharian(dataPieHarian, res.OUT_PIE1[0].TITLE);
            }

            if (res.OUT_PIE2.length > 1) {
                var dataPieRekap = [];
                $.each(res.OUT_PIE2, function (index, value) {
                    var dataPieTemp = {
                        label: value.NAMA_PEMBAYARAN,
                        value: value.NILAI == 0 ? null : value.NILAI
                    };
                    dataPieRekap.push(dataPieTemp)
                });
                creteChartRekap(dataPieRekap, res.OUT_PIE2[0].TITLE);
            }

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss();
            // hideLoadingCss("Gagal Ambil Data REALISASI PEMBAYARAN");
            $('#table-pembayaran-harian tbody').empty();
            var html = "<tr>" +
                "<td colspan='4' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pembayaran-harian  tbody').append(html);


            $('#table-pembayaran-rekap tbody').empty();
            var html = "<tr>" +
                "<td colspan='4' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pembayaran-rekap  tbody').append(html);

        }
    });
}


function creteChartharian(data, title) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-harian',
                width: '500',
                height: '650',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "PEMBAYARAN " + title + "",
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

function creteChartRekap(data, title) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-rekap',
                width: '500',
                height: '650',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "PEMBAYARAN " + title + "",
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
