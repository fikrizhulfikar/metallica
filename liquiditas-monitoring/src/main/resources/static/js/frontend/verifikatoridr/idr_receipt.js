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
        url: baseUrl + "api_dashboard/get_idr_receipt",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            // console.log("resonse : ",res);
            var data = res.return;
            $("#tglcetak").html(data[0].TANGGAL)
            $('#table-receipt-idr tbody').empty();
            $.each(data, function (key, val) {
                var str = val.BANK;
                var html = "<tr>" +
                    "<td>" + str + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.RECEIPT, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-receipt-idr tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_RECEIPT, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-receipt-idr tbody').append(total1);

            var dataPieReceipt = [];
            $.each(res.OUT_PIE_RECEIPT, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieReceipt.push(temp)
            });
            creteChartReceipt(dataPieReceipt);

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-receipt-idr tbody').empty();
            var html = "<tr>" +
                "<td colspan='2' align='center'> No Data </td>" +
                "</tr>";
            $('#table-receipt-idr  tbody').append(html);

        }
    });
}

function creteChartReceipt(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-receipt',
                width: '488',
                height: '645',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "RECEIPT",
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
