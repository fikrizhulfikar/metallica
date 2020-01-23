var objDiv = document.getElementById("div-table-main");
var hasScroll;
$(document).ready(function () {
    $('#search-rencana-imprest-import').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    initData(sessionStorage.getItem("tempSearchImprestImport"))
    $("#search-rencana-imprest-import").val(sessionStorage.getItem("tempSearchImprestImport"));
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
    var param = $("#search-rencana-imprest-import").val();
    sessionStorage.setItem("tempSearchImprestImport",param);
    var retrievedObject = sessionStorage.getItem("tempSearchImprestImport")
    initData(retrievedObject)
}

function initData(pTgl) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rencana_bayar_imprest_dan_import",
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
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_IMPRST,2,".",",") + "</td>" +
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN_IMPOR,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>PINBUK KMK SUBSIDI DAN DEPOSITO</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_MANDIRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BNI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BUKOPIN_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_MANDIRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BNI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BUKOPIN_IMPOR,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td align='center' style='border-bottom: 1px solid transparent !important;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>RENCANA PEMBAYARAN</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARMANDIRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBNI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBUKOPIN_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARMANDIRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBNI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBUKOPIN_IMPOR,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-bottom: 1px solid transparent !important;border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>SALDO AKHIR</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_IMPRST,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI_IMPOR,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN_IMPOR,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>KETERANGAN</b></td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MANDIRI_IMPRST + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BRI_IMPRST + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BNI_IMPRST + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BUKOPIN_IMPRST + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MANDIRI_IMPOR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BRI_IMPOR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BNI_IMPOR + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BUKOPIN_IMPOR + "</td>" +
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