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
    // console.log("year : ",val);
    tempSearch = val;
    initDataTable(tempSearch)
}

function initDataTable(pYear) {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_dashboard/get_realisasi_pembelian_valuta_asing",
        dataType: 'JSON',
        type: "GET",
        data: {
            pYear: pYear
        },
        success: function (res) {
            console.log("res : ",res);
            if (res.return.length > 0) {
                $('#table-pembelian-harian tbody').empty();
                $.each(res.return, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.NAMA_BANK + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.USD,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.JPY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EUR,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-pembelian-harian tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_EUR,2,".",",") + "</td>" +
                    "</tr>";

                var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                    "<td>EQ IDR</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].EQ_IDR_EUR,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-pembelian-harian tbody').append(total1);
                $('#table-pembelian-harian tbody').append(total2);

                $("#date-harian").html(res.return[0].TITLE);
            }

            if (res.OUT_TABLE2.length > 0) {
                $('#table-pembelian-rekap tbody').empty();
                $.each(res.OUT_TABLE2, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.NAMA_BANK + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.USD,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.JPY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EUR,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-pembelian-rekap tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].TOTAL_EUR,2,".",",") + "</td>" +
                    "</tr>";

                var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                    "<td>EQ IDR</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].EQ_IDR_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].EQ_IDR_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL2[0].EQ_IDR_EUR,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-pembelian-rekap tbody').append(total1);
                $('#table-pembelian-rekap tbody').append(total2);

                $("#date-rekap").html(res.OUT_TABLE2[0].TITLE);
            }

            if (res.return.length > 0) {
                var dataPieHarianNamaBank = [];
                var dataPieHarianNamaUSD = [];
                var dataPieHarianNamaEUR = [];
                var dataPieHarianNamaJPY = [];
                $.each(res.return, function (index, value) {
                    var namaBank = {
                        label: value.NAMA_BANK,
                    };
                    dataPieHarianNamaBank.push(namaBank)

                    var valUsd = {
                        value: value.PERSEN_USD,
                    };
                    dataPieHarianNamaUSD.push(valUsd)

                    var valEur = {
                        value: value.PERSEN_EUR,
                    };
                    dataPieHarianNamaEUR.push(valEur)

                    var valJpy = {
                        value: value.PERSEN_JPY,
                    };
                    dataPieHarianNamaJPY.push(valJpy)
                });
                createBarharian(dataPieHarianNamaBank,dataPieHarianNamaUSD,dataPieHarianNamaEUR, dataPieHarianNamaJPY, res.return[0].TITLE);
            }

            if (res.OUT_TABLE2.length > 0) {
                var dataPieRekapNamaBank = [];
                var dataPieRekapNamaUSD = [];
                var dataPieRekapNamaEUR = [];
                var dataPieRekapNamaJPY = [];
                $.each(res.OUT_TABLE2, function (index, value) {
                    var namaBank = {
                        label: value.NAMA_BANK,
                    };
                    dataPieRekapNamaBank.push(namaBank)

                    var valUsd = {
                        value: value.PERSEN_USD,
                    };
                    dataPieRekapNamaUSD.push(valUsd)

                    var valEur = {
                        value: value.PERSEN_EUR,
                    };
                    dataPieRekapNamaEUR.push(valEur)

                    var valJpy = {
                        value: value.PERSEN_JPY,
                    };
                    dataPieRekapNamaJPY.push(valJpy)
                });
                createBarRekap(dataPieRekapNamaBank,dataPieRekapNamaUSD,dataPieRekapNamaEUR, dataPieRekapNamaJPY, res.OUT_TABLE2[0].TITLE);
            }

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data REALSASI PEMBELIAN");
            hideLoadingCss();
            $('#table-pembelian-harian tbody').empty();
            var html = "<tr>" +
                "<td colspan='4' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pembelian-harian  tbody').append(html);


            $('#table-pembelian-rekap tbody').empty();
            var html = "<tr>" +
                "<td colspan='4' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pembelian-rekap  tbody').append(html);

        }
    });
}

function createBarharian(dataPieHarianNamaBank,dataPieHarianNamaUSD,dataPieHarianNamaEUR, dataPieHarianNamaJPY, title) {
    // console.log("dataPieHarianNamaBank : ",dataPieHarianNamaBank);
    // console.log("dataPieHarianNamaUSD : ",dataPieHarianNamaUSD);
    // console.log("dataPieHarianNamaEUR : ",dataPieHarianNamaEUR);
    // console.log("dataPieHarianNamaJPY : ",dataPieHarianNamaJPY);

    FusionCharts.ready(function () {
        var salesChart = new FusionCharts({
            type: 'MSColumn2D',
            renderAt: 'chart-harian',
            width: '1010',
            height: '445',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "PEMBELIAN " + title + "",
                    "yaxismaxvalue": "100",
                    "decimals": "0",
                    "palettecolors": "#91e491,#f5926d,#c0a4fd",
                    "exportEnabled": "1",
                    "numberprefix": "",
                    "numbersuffix": " %",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "10",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineColor": "#cc3300",
                    "crossLineAlpha": "100",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": dataPieHarianNamaBank
                    }],
                "dataset": [
                    {
                        "seriesname": "USD",
                        "data": dataPieHarianNamaUSD
                    },
                    {
                        "seriesname": "JPY",
                        "data": dataPieHarianNamaEUR
                    },
                    {
                        "seriesname": "EUR",
                        "data": dataPieHarianNamaJPY
                    }
                ]
            }
        })
            .render();
    });
}

function createBarRekap(dataPieRekapNamaBank,dataPieRekapNamaUSD,dataPieRekapNamaEUR, dataPieRekapNamaJPY, title) {

    FusionCharts.ready(function () {
        var salesChart = new FusionCharts({
            type: 'MSColumn2D',
            renderAt: 'chart-rekap',
            width: '1010',
            height: '445',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "PEMBELIAN " + title + "",
                    "yaxismaxvalue": "100",
                    "palettecolors": "#91e491,#f5926d,#c0a4fd",
                    "exportEnabled": "1",
                    "decimals": "0",
                    "numberprefix": "",
                    "numbersuffix": " %",
                    "placevaluesinside": "1",
                    "rotatevalues": "0",
                    "divlinealpha": "10",
                    "plotfillalpha": "80",
                    "drawCrossLine": "1",
                    "crossLineColor": "#cc3300",
                    "crossLineAlpha": "100",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": dataPieRekapNamaBank
                    }],
                "dataset": [
                    {
                        "seriesname": "USD",
                        "data": dataPieRekapNamaUSD
                    },
                    {
                        "seriesname": "JPY",
                        "data": dataPieRekapNamaJPY
                    },
                    {
                        "seriesname": "EUR",
                        "data": dataPieRekapNamaEUR
                    }
                ]
            }
        })
            .render();
    });
}