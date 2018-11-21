$(document).ready(function () {
});

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

$('#table-tracking').on('click', '#btnDetail', function () {
    detailTracking($(this).attr('id_valas'));
});

function detailTracking(id) {
    $.ajax({
        url: baseUrl + "api_operator/tracking/get_detail_tracking",
        dataType: 'JSON',
        async: false,
        type: "GET",
        global: false,
        data: {
            pIdValas: id
        },
        success: function (res) {
            $("#table-tracking_ket tbody").empty();
            hideLoadingCss("")
            $.each(res.return, function (key, val) {
                var today = new Date(val.TGL);
                var dd = today.getDate();
                var mm = today.getMonth() + 1;

                var h = addZero(today.getHours());
                var m = addZero(today.getMinutes());
                var s = addZero(today.getSeconds());
                x = h + ":" + m + ":" + s;

                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var today = dd + '/' + mm + '/' + yyyy;

                if (key == 0) {
                    var newHtml = "<tr>" +
                        "<td>" + today + "</td>" +
                        "<td>" + val.NAMA + "</td>" +
                        "<td>" + val.OLEH + "</td>" +
                        "</tr>";
                }
                else {
                    var newHtml = "<tr>" +
                        "<td>" + today + " " + x + "</td>" +
                        "<td>" + val.NAMA + "</td>" +
                        "<td>" + val.OLEH + "</td>" +
                        "</tr>";
                }
                $("#table-tracking_ket tbody").append(newHtml);
                $("#all_table").show();
            });
            console.log("ini detail", res);
        },
        error: function (e, xhr) {
            console.log(e)
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
        }

    });

    $('#detail-tracking-modal').modal({backdrop: 'static', keyboard: false});
}

function processTracking() {

    var search = $("#search-no-tagihan").val().toString();
    if (search == "") {
        alert("Masukkan No Tagihan");

    } else {
        showLoadingCss();
        console.log("showLoading");
        $.ajax({
            async: true,
            type: "GET",
            global: false,
            dataType: 'JSON',
            url: baseUrl + "api_operator/tracking/get_data",
            data: {
                pSearch: search
            },
            success: function (res) {
                console.log("ini tracking", res);
                $("#table-tracking tbody").empty();
                $.each(res.return, function (key, val) {
                    var newHtml = "<tr>" +
                        "<td>" + val.NO_TAGIHAN + "</td>" +
                        "<td>" + val.NO_NOTDIN + "</td>" +
                        "<td>" + val.JENIS_PEMBAYARAN + "</td>" +
                        "<td>" + val.JATUH_TEMPO + "</td>" +
                        "<td>" + val.VENDOR + "</td>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td>" + accounting.formatNumber(val.TOTAL_TAGIHAN, 2, ".", ",") + "</td>" +
                        "<td>" + val.UNIT + "</td>" +
                        "<td align='center'><button class='btn-xs btn-primary' id='btnDetail' style='cursor: pointer; width: 80px; margin: 6px 0 8px 0' title='Detail' id_valas='" + val.ID_VALAS + "'><i class=\"fa fa-search\"></i></button></td>"
                    "</tr>";
                    $("#table-tracking tbody").append(newHtml);
                    $("#all_table").show();
                });
                hideLoadingCss();
            },
            error: function (error) {
                console.log("GAGAL", error)
                hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
            }
        });
    }
}