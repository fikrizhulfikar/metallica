var objDiv = document.getElementById("div-table-main");
var hasScroll;
$(document).ready(function () {
    $('#search-rencana-equivalen_rupiah').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    initData(sessionStorage.getItem("tempSearchEquivalenRupiah"))
    $("#search-rencana-equivalen_rupiah").val(sessionStorage.getItem("tempSearchEquivalenRupiah"));
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
    var param = $("#search-rencana-equivalen_rupiah").val();
    sessionStorage.setItem("tempSearchEquivalenRupiah",param);
    var retrievedObject = sessionStorage.getItem("tempSearchEquivalenRupiah")
    initData(retrievedObject)
}

function initData(pTgl) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_rencana_bayar_equivalen_rupiah",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTgl_akhir: pTgl
        },
        success: function (res) {
            hideLoadingCss()
            // console.log('TESTTT'+res);
            createUI(res.return)
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data RENCANA BAYAR");
            hideLoadingCss();
            // console.log('ERROR');
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
                "<td  align='right'>" + accounting.formatNumber(val.SALDO_AWAL_MANDIRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BNI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AWAL_BUKOPIN,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>PINBUK KMK SUBSIDI DAN DEPOSITO</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_MANDIRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BNI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.PINBUK_BUKOPIN,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td align='center' style='border-bottom: 1px solid transparent !important;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>RENCANA PEMBAYARAN</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARMANDIRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBNI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.RENCANA_BAYARBUKOPIN,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-bottom: 1px solid transparent !important;border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>SALDO AKHIR</b></td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_MANDIRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BRI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BNI,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(val.SALDO_AKHIR_BUKOPIN,2,".",",") + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-top: 1px solid transparent !important;color:#d1e1ea;'><b>" + val.TGL + "</b></td>" +
                "<td style='background: #a5bfff;'><b>KETERANGAN</b></td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_MANDIRI + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BRI + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BNI + "</td>" +
                "<td style='background: #a5bfff;' align='right'>" + val.KETERANGAN_BUKOPIN + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td colspan='10' style='background: #dce0dc;height: 5px;'></td>" +
                "</tr>";

            $("#table-main").append(newHtml);
        });

        // console.log(objDiv.scrollHeight);
        // console.log(objDiv.clientHeight);
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