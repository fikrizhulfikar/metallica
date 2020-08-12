/**
 * Created by adikoesoemah on 8/11/20.
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
        url: baseUrl + "api_dashboard/get_saldo_rekening_rupiah",
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
                    "<td align='right'> Rp " + accounting.formatNumber(val.RECEIPT, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_KP, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_OPERASI, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPOR, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-saldo-idr tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_RECEIPT, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_KP, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_OPERASI, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPOR, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-saldo-idr tbody').append(total1);

            var dataPieSaldo = [];
            $.each(res.OUT_PIE_IMPREST_KP, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieSaldo.push(temp)
            });
            creteChartSaldo(dataPieSaldo);

            var dataPieSaldo2 = [];
            $.each(res.OUT_PIE_RECEIPT, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieSaldo.push(temp)
            });
            creteChartSaldo(dataPieSaldo);

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-saldo-idr tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-saldo-idr tbody').append(html);
        }
    });
}

function creteChartSaldo(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-saldo_rekening_rupiah',
                width: '500',
                height: '500',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Saldo Rekening Rupiah",
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

