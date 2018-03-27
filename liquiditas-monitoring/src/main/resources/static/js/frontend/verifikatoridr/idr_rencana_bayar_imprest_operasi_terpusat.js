var objDiv = document.getElementById("div-table-main");
var hasScroll;
$(document).ready(function () {

    $('#search-rencana-bayar-imprest-operasi-terpusat').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);
    initData(sessionStorage.getItem("tempSearchTerpusat"))
    $("#search-rencana-bayar-imprest-operasi-terpusat").val(sessionStorage.getItem("tempSearchTerpusat"));
});


function pageScroll() {
    if(hasScroll){
        objDiv.scrollTop = objDiv.scrollTop + 1;
        if (objDiv.scrollTop == (objDiv.scrollHeight - 690)) {
            setTimeout(function(){
                location.reload()
            }, 10000)
        }
    }else{
        setInterval(function () {
            location.reload();
        }, 60000);
    }
    setTimeout('pageScroll()', 150);

}

function search() {
    $("#table-main tbody").empty();
    var param = $("#search-rencana-bayar-imprest-operasi-terpusat").val();
    sessionStorage.setItem("tempSearchTerpusat",param);
    var retrievedObject = sessionStorage.getItem("tempSearchTerpusat")
    initData(retrievedObject)
}

function initData(pTgl) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rencana_bayar_imprest_operasi_terpusat",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTgl_akhir: pTgl
        },
        success: function (res) {
            hideLoadingCss()
            console.log(res);
            createUI(res.return)
        },
        error: function () {
            hideLoadingCss();
            // hideLoadingCss("Gagal Ambil Data RENCANA BAYAR");
            $("#table-main tbody").empty();
            var newHtml = "<tr>" +
                "<td colspan='11' align='center'> No Data</td>" +
                "</tr>";

            $("#table-main").append(newHtml);
            setTimeout('pageScroll()', 60000);
        }
    });

}

function createUI(data) {

    if (data.length > 0) {
        $("#table-main tbody").empty();
        $.each(data, function (key, val) {
            var newHtml = "<tr>" +
                "<td class='td-tgl' style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl'  style='background: #a5bfff;'><b class='title-table-new'>SALDO AWAL</b></td>" +
                "<td   align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_INVES, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl' style='background: #a5bfff;'><b class='title-table-new'>PINBUK, KMK, SUBSIDI</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_MANDIRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_BRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_BNI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_BUKOPIN_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_MANDIRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_BRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_BNI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.PINBUK_BUKOPIN_INVES, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' align='center' style='border-bottom: 1px solid transparent !important;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl'  style='background: #a5bfff;'><b class='title-table-new'>RENCANA PEMBAYARAN</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARMANDIRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBNI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBUKOPIN_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARMANDIRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBNI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBUKOPIN_INVES, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' style='border-bottom: 1px solid transparent !important;border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl' style='background: #a5bfff;'><b class='title-table-new'>SALDO AKHIR</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_OPRS, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_INVES, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_INVES, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' style='border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl' style='background: #a5bfff;'><b class='title-table-new'>KETERANGAN</b></td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_MANDIRI_OPRS + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_BRI_OPRS + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_BNI_OPRS + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_BUKOPIN_OPRS + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_MANDIRI_INVES + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_BRI_INVES + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_BNI_INVES + "</td>" +
                "<td style='background: #d1e1ea;' align='right'>" + val.KETERANGAN_BUKOPIN_INVES + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td colspan='10' style='background: #dce0dc;height: 5px;'></td>" +
                "</tr>";

            $("#table-main").append(newHtml);

        });

        hasScroll= objDiv.scrollHeight>objDiv.clientHeight;
        setTimeout('pageScroll()', 6000);

    } else {
        $("#table-main tbody").empty();
        var newHtml = "<tr>" +
            "<td colspan='11' align='center'> No Data</td>" +
            "</tr>";

        $("#table-main").append(newHtml);
        setTimeout('pageScroll()', 60000);
    }
}
