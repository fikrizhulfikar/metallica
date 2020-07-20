var srcTglAwal = null;
var srcTglAkhir = null;

$(document).ready(function () {
    initDataTableImprstValas();
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setInterval(function () {
        initDataTableImprstValas();
    }, 60000);
});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function search(state) {
        if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
            alert("Mohon Lengkapi Tgl Akhir");
        } else {
            initDataTableImprstValas()
            srcTglAwal = $("#tanggal_awal").val()
            srcTglAkhir = $("#tanggal_akhir").val()
        }
    }

function initDataTableImprstValas() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_realisasi_pembayaran_cashcode",
        dataType: 'JSON',
        type: "GET",
        data: {
                    pTglAwal: $("#tanggal_awal").val(),
                    pTglAkhir: $("#tanggal_akhir").val(),
                    pBank: $("#cmb_bank").val(),
                    pCashCode: $("#cmb_cashcode").val(),
                },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-imprst-valas tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
            nomor = key + 1;
            var vendor;
            if (val.VENDOR_NAME == null) {
            vendor = '-';
            } else {
            vendor = val.VENDOR_NAME;
            }
                var html = "<tr>" +
                    "<td>" + nomor + "</td>" +
                    "<td>" + vendor + "</td>" +
                    "<td>" + val.ID_BANK + "</td>" +
                    "<td>" + val.CURRENCY + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.ORI_CURR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                    "<td>" + val.CASH_CODE + "</td>" +
                    "</tr>";
                $('#table-imprst-valas tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL IDR</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_IDR[0].TOTAL_RP,2,".",",") + "</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_RP[0].EQ_IDR_RP,2,".",",") + "</td>" +
                                "<td></td>" +
                                "</tr>";

            var total2 = "<tr style='background-color:#67a2d8;color: white'>" +
                            "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL USD</td>" +
                                            "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_USD[0].TOTAL_USD,2,".",",") + "</td>" +
                                            "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_USD[0].EQ_IDR_USD,2,".",",") + "</td>" +
                                            "<td></td>" +
                                            "</tr>";
            var total3 = "<tr style='background-color:#67a2d8;color: white'>" +
                                        "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL EUR</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_EUR[0].TOTAL_EUR,2,".",",") + "</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_EUR[0].EQ_IDR_EUR,2,".",",") + "</td>" +
                                                        "<td></td>" +
                                                        "</tr>";
            var total4 = "<tr style='background-color:#67a2d8;color: white'>" +
                                        "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL JPY</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_JPY[0].TOTAL_JPY,2,".",",") + "</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_JPY[0].EQ_IDR_JPY,2,".",",") + "</td>" +
                                                        "<td></td>" +
                                                        "</tr>";
            $('#table-imprst-valas tbody').append(total1);
            $('#table-imprst-valas tbody').append(total2);
            $('#table-imprst-valas tbody').append(total3);
            $('#table-imprst-valas tbody').append(total4);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-imprst-valas tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-imprst-valas tbody').append(html);
        }
    });
}