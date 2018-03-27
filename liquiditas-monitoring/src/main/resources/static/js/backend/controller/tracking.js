$(document).ready(function () {
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function processTracking() {

    var  no_tagihan=  $("#search-no-tagihan").val().toString();

    if (no_tagihan == "") {
        alert("Masukkan No Tagihan");

    } else {
        $.ajax({
            async: false,
            type: "GET",
            global: false,
            dataType: 'JSON',
            url: baseUrl + "api_operator/tracking/get_data",
            data: {pNoTagihan: no_tagihan},

            success: function (res) {
                $("#table-tracking_ket tbody").empty();
                hideLoadingCss("")
                 console.log(res);

                if (res.OUT_TRACKING.length > 0) {
                    $.each(res.OUT_TRACKING, function (key, val) {
                        var today = new Date(val.TGL);
                        var dd = today.getDate();
                        var mm = today.getMonth()+1;

                            var h = addZero(today.getHours());
                            var m = addZero(today.getMinutes());
                            var s = addZero(today.getSeconds());
                            x = h + ":" + m + ":" + s;

                        var yyyy = today.getFullYear();
                        if(dd<10){
                            dd='0'+dd;
                        }
                        if(mm<10){
                            mm='0'+mm;
                        }
                        var today = dd+'/'+mm+'/'+yyyy;

                        if(key == 0){
                            var newHtml = "<tr>" +
                            "<td>" + today + "</td>" +
                            "<td>" + val.NAMA + "</td>" +
                            "<td>" + val.OLEH + "</td>" +
                            "</tr>";
                        }
                        else{
                            var newHtml = "<tr>" +
                            "<td>" + today + " " + x + "</td>" +
                            "<td>" + val.NAMA + "</td>" +
                            "<td>" + val.OLEH + "</td>" +
                            "</tr>";
                        }
                        $("#table-tracking_ket tbody").append(newHtml);
                        $("#all_table").show();
                    });

                } else {

                    $("#all_table").hide();
                    alert("No Tagihan Tidak Ditemukan");
                    /*  var newHtml = "<tr>" +
                          "<td colspan='2' align='center' > No Data </td>" +
                          "</tr>";
                      $("#table-tracking_ket tbody").append(newHtml);*/
                }

                $("#table-tracking tbody").empty();
                $.each(res.return, function (key, val) {
                    var newHtml = "<tr>" +
                        "<td>" + val.NO_TAGIHAN + "</td>" +
                        "<td>" + val.JENIS_PEMBAYARAN + "</td>" +
                        "<td>" + val.JATUH_TEMPO + "</td>" +
                        "<td>" + val.VENDOR + "</td>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td>" + accounting.formatNumber(val.TOTAL_TAGIHAN, 2, ".", ",") + "</td>" +
                        "<td>" + val.UNIT + "</td>" +
                        "</tr>";
                    $("#table-tracking tbody").append(newHtml);
                    $("#all_table").show();
                });
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
            }
        });
    }
}

/* function hanyaAngka(evt) {
     var charCode = (evt.which) ? evt.which : event.keyCode
     if (charCode > 31 && (charCode < 48 || charCode > 57))
         return false;
     return true;
 }*/