$(document).ready(function () {
    initDataTableSaldoRek();

    setInterval(function () {
        initDataTableSaldoRek();
    }, 60000);
});

function initDataTableSaldoRek() {
    showLoadingCss()
     $.ajax({
            url: baseUrl + "api_dashboard/get_saldo_curr",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {
                var data = res.return;
                console.log("response : "+data);
                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-jenis-mata-uang tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.SALDO_REAL,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.SALDO_REAL,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-jenis-mata-uang tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_REAL,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_REAL,2,".",",") + "</td>" +
                    "</tr>";

            $('#table-jenis-mata-uang tbody').append(total1);


            var dataPieUSD = [];
            $.each(res.OUT_PIE_USD, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieUSD.push(dataPieTemp)
            });

            console.log("");

            creteChartUSDImprstValas(dataPieUSD);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data");
            hideLoadingCss();
            $('#table-jenis-mata-uang tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-jenis-mata-uang tbody').append(html);
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



