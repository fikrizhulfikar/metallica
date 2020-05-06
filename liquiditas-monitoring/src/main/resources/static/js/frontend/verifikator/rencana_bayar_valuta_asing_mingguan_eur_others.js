var objDiv = document.getElementById("div-table-main");
var hasScroll;
$(document).ready(function () {
    $('#search-rencana-bayar-eur-others').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    initData(sessionStorage.getItem("tempSearchEurOthers"))
    $("#search-rencana-bayar-eur-others").val(sessionStorage.getItem("tempSearchEurOthers"));
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
    var param = $("#search-rencana-bayar-eur-others").val();
    sessionStorage.setItem("tempSearchEurOthers",param);
    var retrievedObject = sessionStorage.getItem("tempSearchEurOthers")
    initData(retrievedObject)
}

function initData(pTgl) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rencana_bayar_valuta_asing_mingguan_eur_others",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTgl: pTgl
        },
        success: function (res) {
            hideLoadingCss();
            // console.log(res);
            createUI(res.return)
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data RENCANA BAYAR");
            hideLoadingCss();
            $("#table-main tbody").empty();
            var newHtml = "<tr>" +
                "<td colspan='10' align='center'> No Data</td>" +
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
                "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>SALDO AWAL</b></td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_GBP,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_AUD,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MYR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_KRW,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>PEMBELIAN,DERIVATIVE,DEPOSITO</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_MANDIRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BNI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_BUKOPIN_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_GBP,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_AUD,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_MYR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SETTLEMENT_HEDGING_KRW,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td align='center' style='border-bottom: 1px solid transparent !important;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>RENCANA PEMBAYARAN</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_MANDIRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BNI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_BUKOPIN_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_GBP,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_AUD,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_MYR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_PEMBAYARAN_KRW,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-bottom: 1px solid transparent !important;border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>SALDO AKHIR</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_EUR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_GBP,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_AUD,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MYR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_KRW,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>KETERANGAN</b></td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MANDIRI_EUR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BRI_EUR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BNI_EUR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BUKOPIN_EUR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_GBP + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_AUD + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MYR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_KRW + "</td>" +
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
            "<td colspan='10' align='center'> No Data</td>" +
            "</tr>";

        $("#table-main").append(newHtml);
        setTimeout('pageScroll()', 60000);
    }
}