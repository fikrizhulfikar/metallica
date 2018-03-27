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
        url: baseUrl + "api_dashboard/get_idr_subsidi_kmk",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            console.log("resonse : ",res);
            $("#tglcetak").html(res.return[0].TANGGAL);
            var data = res.return;
            $('#table-subsidi-kmk-idr tbody').empty();
            $.each(data, function (key, val) {
                var str = val.BANK;
                var html = "<tr>" +
                    "<td>" + str + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.SUBSIDI, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.KMK, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-subsidi-kmk-idr tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_SUBSIDI, 2, ".", ",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].JML_KMK, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-subsidi-kmk-idr tbody').append(total1);

            var dataPieSubsidi = [];
            $.each(res.OUT_PIE_SUBSIDI, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieSubsidi.push(temp)
            });
            creteChartSubsidi(dataPieSubsidi);

            var dataPieKmk = [];
            $.each(res.OUT_PIE_KMK, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.JUMLAH == 0 ? null : value.JUMLAH
                };
                dataPieKmk.push(temp)
            });
            creteChartKmk(dataPieKmk);

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data DERIVATIF AND DEPOSTIO");
            hideLoadingCss("");
            $('#table-subsidi-kmk-idr tbody').empty();
            var html = "<tr>" +
                "<td colspan='3' align='center'> No Data </td>" +
                "</tr>";
            $('#table-subsidi-kmk-idr tbody').append(html);

        }
    });
}

function creteChartSubsidi(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-subsidi',
                width: '455',
                height: '500',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "SUBSIDI",
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

function creteChartKmk(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-kmk',
                width: '455',
                height: '500',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "KMK",
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

