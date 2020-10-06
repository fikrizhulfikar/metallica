/**
 * Created by adikoesoemah on 8/11/20.
 */
$(document).ready(function () {
    initDataTable();
    initDataTable2();
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
                    "<td align='right'> Rp " + accounting.formatNumber(val.BANK, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.CURR, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL_JASA_GIRO, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL2, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO2, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL_JASA_GIRO2, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-saldo-idr tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].BANK, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].CURR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL_JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL2, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JASA_GIRO2, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL_JASA_GIRO2, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-saldo-idr tbody').append(total1);
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

function initDataTable2() {
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
                    "<td align='right'> Rp " + accounting.formatNumber(val.BANK, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.CURR, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.ORI_CURR, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.FEE_TRANSAKSI, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.CASH_COLLATERAL, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PAJAK, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NET_JASA, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NET_GAIN, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-saldo-idr tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].BANK, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].CURR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].ORI_CURR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].FEE_TRANSAKSI, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].CASH_COLLATERAL, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].PAJAK, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NET_JASA, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NET_GAIN, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-saldo-idr tbody').append(total1);
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