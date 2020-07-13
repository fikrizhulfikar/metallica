$(document).ready(function () {
    initDataTableSaldoRek();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
    $("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function initDataTableSaldoRek() {
//     $.ajax({
//            url: baseUrl + "api_dashboard/get_rencana_investasi_operasi",
//            dataType: 'JSON',
//            type: "GET",
//            success: function (res) {
//                var data = res.return;
//                var data2 = res.OUT_TOTAL_SELURUH;
//                $("#tglcetak").html(data[0].TANGGAL);
//                $('#table-investasi-operasi tbody').empty();
//                $.each(data, function (key, val) {
//                    if(accounting.formatNumber(val.IDR) === "0" || accounting.formatNumber(val.USD) === "0" || accounting.formatNumber(val.EUR) === "0" || accounting.formatNumber(val.JPY) === "0" || accounting.formatNumber(val.MYR) === "0" || accounting.formatNumber(val.EQ_IDR) === "0"){
//                        var html = "<tr>" +
//                            "<td>" + val.TGL_RENCANA_BAYAR + "</td>" +
//                            "<td>" + val.JENIS + "</td>" +
//                            "<td align='right'> </td>" +
//                            "<td align='right'> </td>" +
//                            "<td align='right'> </td>" +
//                            "<td align='right'> </td>" +
//                            "<td align='right'> </td>" +
//                            "<td align='right'> </td>" +
//                            "</tr>";
//
//                            if(val["JENIS"] === "TOTAL"){
//                              var html = "<tr style='background-color:#67a2d8; color: white'>" +
//                                 "<td colspan='2' align='center'> SUB " + val.JENIS + "</td>" +
//                                 "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
//                                 "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
//                                 "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
//                                 "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
//                                 "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
//                                 "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
//                                 "</tr>";
//                             }
//                    } else
//                        var html = "<tr>" +
//                           "<td>" + val.TGL_RENCANA_BAYAR + "</td>" +
//                           "<td>" + val.JENIS + "</td>" +
//                           "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
//                           "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
//                           "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
//                           "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
//                           "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
//                           "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
//                           "</tr>";
//
//                           if (val["JENIS"] === "DEBT SERVICE"){
//                                 var html = "<tr>" +
//                                     "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'>" + val.TGL_RENCANA_BAYAR + "</td>" +
//                                     "<td>" + val.JENIS + "</td>" +
//                                     "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
//                                     "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
//                                     "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
//                                     "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
//                                     "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
//                                     "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
//                                     "</tr>";
//                           } else if (val["JENIS"] === "INVESTASI"){
//                                 var html = "<tr>" +
//                                     "<td align='center' style='border-bottom: 1px solid transparent !important; font-weight: bold'>" + val.TGL_RENCANA_BAYAR + "</td>" +
//                                     "<td>" + val.JENIS + "</td>" +
//                                     "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
//                                     "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
//                                     "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
//                                     "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
//                                     "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
//                                     "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
//                                     "</tr>";
//                           } else if (val["JENIS"] === "OPERASI"){
//                                 var html = "<tr>" +
//                                    "<td style='border-top: 1px solid transparent !important;color:#d1e1ea;'>" + val.TGL_RENCANA_BAYAR + "</td>" +
//                                    "<td>" + val.JENIS + "</td>" +
//                                    "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
//                                    "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
//                                    "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
//                                    "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
//                                    "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
//                                    "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
//                                    "</tr>";
//                           }
//
//                    $('#table-investasi-operasi tbody').append(html)
//
//                });
//
//                $.each(data2, function (key, val) {
//                var total = "<tr style='background-color:#67a2d8;color: white'>" +
//                    "<td colspan='2' align='center'>TOTAL</td>" +
//                    "<td align='right'> Rp. " + accounting.formatNumber(val.TOTAL_SELURUH_IDR,".",",") + "</td>" +
//                    "<td align='right'> $ " + accounting.formatNumber(val.TOTAL_SELURUH_USD,".",",") + "</td>" +
//                    "<td align='right'> € " + accounting.formatNumber(val.TOTAL_SELURUH_EUR,".",",") + "</td>" +
//                    "<td align='right'> ¥ " + accounting.formatNumber(val.TOTAL_SELURUH_JPY,".",",") + "</td>" +
//                    "<td align='right'> RM " + accounting.formatNumber(val.TOTAL_SELURUH_MYR,".",",") + "</td>" +
//                    "<td align='right'> Rp." + accounting.formatNumber(val.TOTAL_SELURUH_EQ_IDR,".",",") + "</td>" +
//                    "</tr>";
//
//                $('#table-investasi-operasi tbody').append(total);
//                });
//             hideLoadingCss()
//        },
//
//        error: function () {
//            // hideLoadingCss("Gagal Ambil Data");
//            hideLoadingCss();
//            $('#table-investasi-operasi tbody').empty();
//            var html = "<tr>" +
//                "<td colspan='8' align='center'> No Data </td>" +
//                "</tr>";
//            $('#table-investasi-operasi tbody').append(html);
//        }
//      });
}