/**
 * Created by israjhaliri on 1/22/18.
 */
$(document).ready(function () {
    initDataTable();
    setInterval(function () {
        initDataTable();
    }, 60000);
});

function initDataTable() {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_dashboard/idr_rencana_vs_realisasi",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var d = new Date(res.tglcetak);
            var datestring = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
            $("#tglcetak").html(datestring);
            if (res.return.length <= 0) {
                noDataView();
            } else {
                $('#table-main-rencana tbody').empty();
                $.each(res.return, function (key, val) {
                    var jatuh_tempo = new Date(res.tglcetak);
                    var jatuh_tempo_date = jatuh_tempo.getDate()  + "/" + (jatuh_tempo.getMonth()+1) + "/" + jatuh_tempo.getFullYear();
                    var html = '';
                    if (val.JENIS_PEMBAYARAN == 'total') {
                        html = '<tr>' +
                            '<td style="background-color:#67a2d8;color: white">' + "TOTAL" + '</td>' +
                            '<td style="background-color:#67a2d8;color: white" align=\"center\">' + jatuh_tempo_date + '</td>' +
                            '<td style="background-color:#67a2d8;color: white" align=\"right\">' + val.IDR + '</td>' +
                            '<td style="background-color:#67a2d8;color: white" align=\"right\">' + val.USD + '</td>' +
                            '<td style="background-color:#67a2d8;color: white" align=\"right\">' + val.JPY + '</td>' +
                            '<td style="background-color:#67a2d8;color: white" align=\"right\">' + val.EUR + '</td>' +
                            '<td style="background-color:#67a2d8;color: white" align=\"right\">' + val.OTHER + '</td>' +
                            '</tr>';
                    } else {
                        html = '<tr>' +
                            '<td>' +val.JENIS_PEMBAYARAN + '</td>' +
                            '<td align=\"center\">' + jatuh_tempo_date + '</td>' +
                            '<td align=\"right\">' + val.IDR + '</td>' +
                            '<td align=\"right\">' + val.USD + '</td>' +
                            '<td align=\"right\">' + val.JPY + '</td>' +
                            '<td align=\"right\">' + val.EUR + '</td>' +
                            '<td align=\"right\">' + val.OTHER + '</td>' +
                            '</tr>';
                    }
                    if (val.STATUS_VALAS == 'RENCANA') {
                        $('#table-main-rencana tbody').append(html);
                    } else {
                        $('#table-main-realisasi tbody').append(html);
                    }
                });
                hideLoadingCss()
            }
        },
        error: function () {
            noDataView();
        }
    });
}

function noDataView() {
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
