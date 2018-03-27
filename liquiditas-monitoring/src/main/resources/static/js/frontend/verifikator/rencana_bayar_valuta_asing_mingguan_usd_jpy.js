var objDiv = document.getElementById("div-table-main");
var hasScroll;

$(document).ready(function () {
    $('#search-rencana-bayar-usd-jpy').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    initData(sessionStorage.getItem("tempSearchUsdJpy"))
    $("#search-rencana-bayar-usd-jpy").val(sessionStorage.getItem("tempSearchUsdJpy"));
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
    var param = $("#search-rencana-bayar-usd-jpy").val();
    sessionStorage.setItem("tempSearchUsdJpy",param);
    var retrievedObject = sessionStorage.getItem("tempSearchUsdJpy")
    initData(retrievedObject)
}

function initData(pTgl) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rencana_bayar_valuta_asing_mingguan_usd_jpy",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTgl: pTgl

        },

        success: function (res) {
            console.log("ini pTgl",pTgl);
            hideLoadingCss()
            console.log("ini res",res);
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
                "<td   align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_JPY, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl' style='background: #a5bfff;'><b class='title-table-new'>PEMBELIAN,DERIVATIVE,DEPOSITO</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_MANDIRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BNI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BUKOPIN_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_MANDIRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BNI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BUKOPIN_JPY, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' align='center' style='border-bottom: 1px solid transparent !important;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl'  style='background: #a5bfff;'><b class='title-table-new'>RENCANA PEMBAYARAN</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_MANDIRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BNI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BUKOPIN_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_MANDIRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BNI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BUKOPIN_JPY, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' style='border-bottom: 1px solid transparent !important;border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl' style='background: #a5bfff;'><b class='title-table-new'>SALDO AKHIR</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_USD, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_JPY, 2, ".", ",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_JPY, 2, ".", ",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td class='td-tgl' style='border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td class='td-lbl' style='background: #a5bfff;'><b class='title-table-new'>KETERANGAN</b></td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MANDIRI_USD + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BRI_USD + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BNI_USD + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BUKOPIN_USD + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MANDIRI_JPY + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BRI_JPY + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BNI_JPY + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BUKOPIN_JPY + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td colspan='10' style='background: #dce0dc;height: 5px;'></td>" +
                "</tr>";

            $("#table-main").append(newHtml);

        });

        console.log(objDiv.scrollHeight);
        console.log(objDiv.clientHeight);
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
