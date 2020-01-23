/**
 * Created by israjhaliri on 1/22/18.
 */
$(document).ready(function () {
    initDataTable();
    setInterval(function () {
        initDataTable();
    }, 60000);

    var date = new Date();

    var year = date.getUTCFullYear();

    var date1 = new Date(date.setDate(date.getDate()));
    var month1 = date1.getUTCMonth() + 1;

    var date2 = new Date(date.setDate(date.getDate() + 1));
    var month2 = date2.getUTCMonth() + 1;

    var date3= new Date(date.setDate(date.getDate() + 1));
    var month3 = date3.getUTCMonth() + 1;

    var date4= new Date(date.setDate(date.getDate() + 1));
    var month4 = date4.getUTCMonth() + 1;

    var date5= new Date(date.setDate(date.getDate() + 1));
    var month5 = date5.getUTCMonth() + 1;

    var date6= new Date(date.setDate(date.getDate() + 1));
    var month6 = date6.getUTCMonth() + 1;

    var date7= new Date(date.setDate(date.getDate() + 1));
    var month7 = date7.getUTCMonth() + 1;

    $("#tgh1").html((date1.getUTCDate())+"/"+month1+"/"+year);
    $("#tgh2").html((date2.getUTCDate())+"/"+month2+"/"+year);
    $("#tgh3").html((date3.getUTCDate())+"/"+month3+"/"+year);
    $("#tgh4").html((date4.getUTCDate())+"/"+month4+"/"+year);
    $("#tgh5").html((date5.getUTCDate())+"/"+month5+"/"+year);
    $("#tgh6").html((date6.getUTCDate())+"/"+month6+"/"+year);
    $("#tgh7").html((date7.getUTCDate())+"/"+month7+"/"+year);
});

function initDataTable() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rekap_jenis_pembayaran",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            console.log("response : ", res);
            $("#tglcetak").html(res.return[0].TGL);
            if (res.OUT_TOTAL.length > -1) {
                $('#table-saldo-awal tbody').empty();
                var html = "<tr>" +
                    "<td>POTENSI PENDAPATAN PTL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_POTENSI, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>RECEIPT</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_RECEIPT, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>KMK</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_KMK, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>SUBSIDI</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_SUBSIDI, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>IMPREST OPERASI</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_OPERASI, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>IMPREST INVESTASI</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_INVESTASI, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>IMPREST</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_IMPREST, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>IMPREST IMPOR</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_IMPOR, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td>IMPREST VALAS</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_VALAS, 2, ".", ",") + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='center'>TOTAL</td>" +
                    "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AWAL, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-saldo-awal tbody').append(html);
            }

            $('#table-main tbody').empty();
            $.each(res.return, function (key, val) {
                var str = val.BANK;
                var html = "<tr>" +
                    "<td>" + val.NAMA_PEMBAYARAN + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN1, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN2, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN3, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN4, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN5, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN6, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.TAGIHAN7, 2, ".", ",") + "</td>" +
                    "<td style='font-weight:bold;' align='right'>" + accounting.formatNumber(val.TOTAL_TAGIHAN_PERJENIS, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-main tbody').append(html);
            });

            var html = "<tr>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;'  align='center'>TOTAL</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN1, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN2, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN3, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN4, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN5, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN6, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_TAGIHAN7, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_PERJENIS, 2, ".", ",") + "</td>" +
                "</tr>";
            $('#table-main tbody').append(html);

//            var html = '<thead>'+
//                        <tr>
//                            <th style="background: #a5bfff;vertical-align: middle !important;" rowspan="2">SALDOAKHIR'+
//                            </th>'+
//                            <th style="background: #a5bfff;vertical-align: middle !important;" rowspan="2"'+
//                                id="tot_tgh1">TAGIHAN 1'+
//                            </th>'+
//                            <th style="background: #a5bfff;vertical-align: middle !important;" rowspan="2"'+
//                                id="tot_tgh2">TAGIHAN 2'+
//                            </th>'+
//                            <th style="background: #a5bfff;vertical-align: middle !important;" rowspan="2"'+
//                                id="tot_tgh3">TAGIHAN 3'+
//                            </th>'+
//                            <th style="background: #a5bfff;vertical-align: middle !important;" rowspan="2"'+
//                                id="tot_tgh4">TAGIHAN 4
//                            </th>
//                            <th style="background: #a5bfff;vertical-align: middle !important;"  rowspan="2"
//                                id="tot_tgh5">TAGIHAN 5
//                            </th>
//                            <th style="background: #a5bfff;vertical-align: middle !important;"  rowspan="2"
//                                id="tot_tgh6">TAGIHAN 6
//                            </th>
//                            <th style="background: #a5bfff;vertical-align: middle !important;"  rowspan="2"
//                                id="tot_tgh7">TAGIHAN 7
//                            </th>
//                            <th style="background: #a5bfff;vertical-align: middle !important;"  rowspan="2">
//                                TOTAL
//                            </th>
//                        </tr>
//                        </thead>';

//            $('#table-saldo-akhir  tbody').empty();
            var html = "<tr>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;'  align='center'>SALDO AKHIR</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN1, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN2, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN3, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN4, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN5, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN6, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].SALDO_AKHIR_TAGIHAN7, 2, ".", ",") + "</td>" +
                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'></td>" +
                //                "<td style='font-weight:bold;background: #a5bfff;vertical-align: middle !important;' align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SALDO_AKHIR, 2, ".", ",") + "</td>" +
                "</tr>";
            $('#table-main tbody').append(html);

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-main tbody').empty();
            var html = "<tr>" +
                "<td colspan='8' align='center'> No Data </td>" +
                "</tr>";
            $('#table-main  tbody').append(html);

            $('#table-saldo-akhir tbody').empty();
            var html = "<tr>" +
                "<td colspan='8' align='center'> No Data </td>" +
                "</tr>";
            $('#table-saldo-akhir tbody').append(html);

        }
    });
}