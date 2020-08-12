$(document).ready(function () {
    initDataTablePenjualanTenagaListrik();
    initDataTablePenjualanTenagaListrikBank();
    initDataTablePenjualanTenagaListrikDist();

    search1("load");
    search3("load");
    search4("load");
    setSelectUnit("unit_filter1", "FILTER", "", "REKAP");
//    setSelectRange("range_filter1", "FILTER", "", "REKAP");

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

var srcTglAwal = null;
var srcTglAkhir = null;

function initDataTablePenjualanTenagaListrik(p_tgl_awal, p_tgl_akhir, p_unit, p_range) {
//    showLoadingCss()
//    let groupColumn = 0;
//    let tb_penjualan_tenaga_listrik = $("#penerimaan-penjualan-jenis-layanan").DataTable({
//        "ajax" : {
//            "url" : baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik",
//            "data" : {
//                p_tgl_awal: $("#tanggal_awal1").val(),
//                p_tgl_akhir: $("#tanggal_akhir1").val(),
//                p_unit: $("#unit_filter1").val(),
//                p_range: $("#range_filter1").val()
//            },
//            "type" : "GET",
//            "dataType" : "JSON"
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
//            {
//                "visible" : false,
//                "data" : "TANGGAL"},
//            {
//                "width": "10%",
//                "data" : "nomor",
//                "render" : (data) => {
//                    return data;
//                },
//            },
//            {
//                "data" : "tanggal",
//                "render" : (data) => {
//                    return data;
//                },
//            },
//            {
//                "data" : "POSTPAID",
//                "render" : (data) => {
//                    return '<td>'+ new Intl.NumberFormat().format(data) +'</td>'
//                },
//                "createdCell" : (cell)=>{
//                    $(cell).css({
//                       "text-align" : "center"
//                    })
//                 }
//            },
//            {
//                "data" : "PREPAID",
//                "render" : (data) => {
//                    return '<td>'+ new Intl.NumberFormat().format(data) +'</td>'
//                },
//                "createdCell" : (cell)=>{
//                    $(cell).css({
//                       "text-align" : "center"
//                    })
//                }
//            },
//            {
//                "data" : "NTL",
//                "render" : (data) => {
//                    return '<td>'+ new Intl.NumberFormat().format(data) +'</td>'
//                },
//                "createdCell" : (cell)=>{
//                    $(cell).css({
//                        "text-align" : "right"
//                    })
//                }
//            },
//            {
//                "data" : "TOTAL",
//                "render" : (data) => {
//                    return '<td> Rp. '+ new Intl.NumberFormat().format(data) +'</td>'
//                },
//                "createdCell" : (cell)=>{
//                    $(cell).css({
//                        "text-align" : "right"
//                    })
//                }
//            },
//        ]
//    });
    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir1').attr("disabled", "disabled");

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_tgl_akhir: $("#tanggal_akhir1").val(),
            p_unit: $("#unit_filter1").val(),
            p_range: $("#range_filter1").val(),
        },
        success: function (res) {
            var data = res.return;
//            console.log("response : "+data);

            $('#penerimaan-penjualan-jenis-layanan tbody').empty();
            var nomor;

            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
            nomor = key + 1;
                var html = "<tr>" +
                    "<td align='center'>" + nomor + "</td>" +
                    "<td> </td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.POSTPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PREPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NTL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                    "</tr>";
                $('#penerimaan-penjualan-jenis-layanan tbody').append(html);

            });

            $('#penerimaan-penjualan-jenis-layanan').DataTable( {
                searching: false,
                paging: true
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" + "<td colspan=2 align='center'>TOTAL IDR</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_POSTPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_PREPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_NTL,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JUMLAH_TOTAL,2,".",",") + "</td>" +
                                "</tr>";

            $('#penerimaan-penjualan-jenis-layanan tbody').append(total1);
            hideLoadingCss()

        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#penerimaan-penjualan-jenis-layanan tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#penerimaan-penjualan-jenis-layanan tbody').append(html);
        }
    });
}

$("#tanggal_awal1").change(function () {
    var tglAwalData = $('#tanggal_awal1').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir1').val("");
    } else {
        $('#tanggal_akhir1').attr("disabled", false);
        $('#tanggal_akhir1').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function search1(state) {
    if ($("#tanggal_akhir1").val() == "" && state != "load" && $("#tanggal_awal1").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTablePenjualanTenagaListrik()
        srcTglAwal = $("#tanggal_awal1").val()
        srcTglAkhir = $("#tanggal_akhir1").val()
    }
}

function initDataTablePenjualanTenagaListrikBank(p_tgl_awal, p_tgl_akhir, p_bank) {
//    showLoadingCss()
    $('#tanggal_awal3').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir3').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik_bank",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal3").val(),
            p_tgl_akhir: $("#tanggal_akhir3").val(),
            p_bank: $("#bank_filter2").val()
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#penerimaan-penjualan-bank tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
            nomor = key + 1;
                var html = "<tr>" +
                    "<td align='center'>" + nomor + "</td>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.POSTPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PREPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NTL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                    "</tr>";
                $('#penerimaan-penjualan-bank').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" + "<td colspan=2 align='center'>TOTAL IDR</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_POSTPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_PREPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_NTL,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JUMLAH_TOTAL,2,".",",") + "</td>" +
                                "</tr>";

            $('#penerimaan-penjualan-bank tbody').append(total1);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#penerimaan-penjualan-bank tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#penerimaan-penjualan-bank tbody').append(html);
        }
    });
}

$("#tanggal_awal3").change(function () {
    var tglAwalData = $('#tanggal_awal3').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir3').val("");
    } else {
        $('#tanggal_akhir3').attr("disabled", false);
        $('#tanggal_akhir3').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function search3(state) {
    if ($("#tanggal_akhir3").val() == "" && state != "load" && $("#tanggal_awal3").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTablePenjualanTenagaListrikBank()
        srcTglAwal = $("#tanggal_awal3").val()
        srcTglAkhir = $("#tanggal_akhir3").val()
    }
}

function initDataTablePenjualanTenagaListrikDist(p_tgl_awal, p_tgl_akhir, p_unit) {
//    showLoadingCss()
    $('#tanggal_awal4').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir4').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum//penjualan_tenaga_listrik_dist",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal4").val(),
            p_tgl_akhir: $("#tanggal_akhir4").val(),
            p_bank: $("#unit_filter3").val()
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#penerimaan-penjualan-distribusi tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
            nomor = key + 1;
                var html = "<tr>" +
                    "<td align='center'>" + nomor + "</td>" +
                    "<td align='center'>" + val.DISTRIBUSI + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.POSTPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PREPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NTL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                    "</tr>";
                $('#penerimaan-penjualan-distribusi').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" + "<td colspan=2 align='center'>TOTAL IDR</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_POSTPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_PREPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_NTL,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JUMLAH_TOTAL,2,".",",") + "</td>" +
                                "</tr>";

            $('#penerimaan-penjualan-distribusi tbody').append(total1);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#penerimaan-penjualan-distribusi tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#penerimaan-penjualan-distribusi tbody').append(html);
        }
    });
}

$("#tanggal_awal4").change(function () {
    var tglAwalData = $('#tanggal_awal4').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir4').val("");
    } else {
        $('#tanggal_akhir4').attr("disabled", false);
        $('#tanggal_akhir4').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function search4(state) {
    if ($("#tanggal_akhir4").val() == "" && state != "load" && $("#tanggal_awal4").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTablePenjualanTenagaListrikDist()
        srcTglAwal = $("#tanggal_awal4").val()
        srcTglAkhir = $("#tanggal_akhir4").val()
    }
}