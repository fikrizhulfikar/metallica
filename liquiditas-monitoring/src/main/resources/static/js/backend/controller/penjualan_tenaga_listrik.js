$(document).ready(function () {
    initDataTablePenjualanTenagaListrik();
    initDataTablePenjualanTenagaListrikBank();
    initDataTablePenjualanTenagaListrikDist();

    search1("load");
    search3("load");
    search4("load");

    $('#tanggal_awal1').datepicker({dateFormat: 'dd-mm-yy'});
    $('#tanggal_akhir1').attr("disabled", "disabled");
    $('#tanggal_awal3').datepicker({dateFormat: 'dd-mm-yy'});
    $('#tanggal_akhir3').attr("disabled", "disabled");
    $('#tanggal_awal4').datepicker({dateFormat: 'dd-mm-yy'});
    $('#tanggal_akhir4').attr("disabled", "disabled");

    setSelectUnit("unit_filter1", "FILTER", "", "REKAP");
    setSelectBank("bank_filter2", "FILTER", "", "REKAP");
//    setSelectUnit3("unit_filter3", "FILTER", "", "REKAP");
//    setSelectRange("range_filter1", "FILTER", "", "REKAP");

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

var srcTglAwal = null;
var srcTglAkhir = null;
var tempTableSearch = "";

$("#tanggal_awal1").change(function () {
    var tglAwalData = $('#tanggal_awal1').val();
    if (tglAwalData == "") {
        $('#tanggal_akhir1').val("");
    } else {
        $('#tanggal_akhir1').attr("disabled", false);
        $('#tanggal_akhir1').datepicker({dateFormat: 'dd-mm-yy', minDate: tglAwalData});
    }
});

//$("#tanggal_awal3").change(function () {
//    var tglAwalData = $('#tanggal_awal3').val();
//    if (tglAwalData == "") {
//        $('#tanggal_akhir').val("");
//    } else {
//        $('#tanggal_akhir3').attr("disabled", false);
//        $('#tanggal_akhir3').datepicker({dateFormat: 'dd-mm-yy', minDate: tglAwalData});
//    }
//});

$("#tanggal_awal4").change(function () {
    var tglAwalData = $('#tanggal_awal4').val();
    if (tglAwalData == "") {
        $('#tanggal_akhir4').val("");
    } else {
        $('#tanggal_akhir4').attr("disabled", false);
        $('#tanggal_akhir4').datepicker({dateFormat: 'dd-mm-yy', minDate: tglAwalData});
    }
});

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_tgl_akhir: $("#tanggal_akhir1").val(),
            p_unit: $("#unit_filter1").val()
        },
        success: function (res) {
            allData = res;
        },
        error: function (res) {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
        }
    });
}

function getAllData2() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik_bank",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_tgl_akhir: $("#tanggal_akhir1").val(),
            p_bank: $("#bank_filter2").val()
        },
        success: function (res) {
            allData = res;
        },
        error: function (res) {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
        }
    });
}

function search1(state) {
    if ($("#tanggal_akhir1").val() == "" && state != "load" && $("#tanggal_awal1").val() != "" && $("#unit_filter1").val() == "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal1").val(), $("#tanggal_akhir1").val(), $("#unit_filter1").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal1").val()
        srcTglAkhir = $("#tanggal_akhir1").val()
    }
}

function initDataTablePenjualanTenagaListrik(p_tgl_awal, p_tgl_akhir, p_unit, p_range) {

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
//            p_range: $("#range_filter1").val(),
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

//        table_rekapitulasi = $('#penerimaan-penjualan-jenis-layanan').DataTable({
//                    "serverSide": true,
//                    "oSearch": {"sSearch": tempTableSearch},
//                    "bLengthChange": true,
//                    "scrollY": "100%",
//                    "scrollX": "100%",
//                    "searching": false,
//                    bSortable: false,
//                    "scrollCollapse": true,
//                    "lengthMenu": [[10, 25, 50, 100, 200, 400, 600, 1000], [10, 25, 50, 100, 200, 400, 600, 1000]],
//                    "aoColumnDefs": [
//                        {width: 20, targets: 0},
//                        {width: 100, targets: 1},
//                        {width: 100, targets: 2},
//                        {width: 100, targets: 3},
//                        {width: 100, targets: 4},
//                        {width: 100, targets: 5},
//                        {width: "20%", "targets": 0},
//                        { className: "datatables_action", "targets": [1, 2, 3, 4, 5] },
//                        {
//                            "aTargets": [0],
//                            "mRender": function (data, type, full) {
//                                return full.NO;
//                            }
//
//                        },
//                        {
//                            "aTargets": [1],
//                            "mRender": function (data, type, full) {
//                                return full.TANGGAL;
//                            }
//
//                        },
//                        {
//                            "aTargets": [2],
//                            "mRender": function (data, type, full) {
//                                return accounting.formatNumber(full.POSTPAID,2,".",",");
//                            }
//
//                        },
//                        {
//                            "aTargets": [3],
//                            "mRender": function (data, type, full) {
//                                return accounting.formatNumber(full.PREPAID,2,".",",");
//                            }
//
//                        },
//
//                        {
//                            "aTargets": [4],
//                            "mRender": function (data, type, full) {
//                                return accounting.formatNumber(full.NTL,2,".",",");
//                            }
//
//                        },
//                        {
//                            "aTargets": [5],
//                            "mRender": function (data, type, full) {
//                                return accounting.formatNumber(full.TOTAL,2,".",",");
//                            }
//
//                        },
//                    ],
//                    "ajax":
//                        {
//                            "url":
//                                baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik",
//                            "type":
//                                "GET",
//                            "dataType":
//                                "json",
//                            "data":
//                                {
//                                    p_tgl_awal: p_tgl_awal,
//                                    p_tgl_akhir: p_tgl_akhir,
//                                    p_unit: p_unit,
//                                    p_range:p_range
//                                }
//                            ,
//                            "dataSrc":
//
//                                function (res) {
//                                    hideLoadingCss()
////                                    getTotalTagihan();
//                                    return res.data;
//                                }
//                        }
//                }
//            );
//
//            table_rekapitulasi.on('search.dt', function () {
//                var value = $('.dataTables_filter input').val();
//                tempTableSearch = value;
//            });
//
//            table_rekapitulasi.columns.adjust();

//    $('#penerimaan-penjualan-jenis-layanan').dataTable().fnDestroy();
//
//    let rincian_saldo = $("#penerimaan-penjualan-jenis-layanan").DataTable({
//        "ajax" : {
//            "url": baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik",
//            "data" : {
//                p_tgl_awal: p_tgl_awal,
//                p_tgl_akhir: p_tgl_akhir,
//                p_unit: p_unit,
//                p_range:p_range
//            },
//            "type" : "GET",
//            "dataType" : "json",
//            "dataSrc":
//                function (res) {
////                    getTotalTagihan();
//                    return res.data;
//                }
//        },
//        "sorting": false,
//        "searching" : true,
//        "paging": true,
//        "bInfo" : false,
//        "bLengthChange" : true,
//        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NO+'</td>';}},
//            {"data": null,"render": (data, type, row) => {return '<tr><td> </td></tr>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.POSTPAID)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.PREPAID)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.NTL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//        ],
//    });
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

//    $('#penerimaan-penjualan-bank').dataTable().fnDestroy();
//
//    let rincian_saldo = $("#penerimaan-penjualan-bank").DataTable({
//        "ajax" : {
//            "url": baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik_bank",
//            "data" : {
//                p_tgl_awal: p_tgl_awal,
//                p_tgl_akhir: p_tgl_akhir,
//                p_bank: p_bank
//            },
//            "type" : "GET",
//            "dataType" : "json",
//            "dataSrc":
//                function (res) {
////                    getTotalTagihan();
//                    return res.data;
//                }
//        },
//        "sorting": false,
//        "searching" : true,
//        "paging": true,
//        "bInfo" : false,
//        "bLengthChange" : true,
//        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NO+'</td>';}},
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.POSTPAID)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.PREPAID)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.NTL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//        ],
//    });
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
    if ($("#tanggal_akhir3").val() == "" && state != "load" && $("#tanggal_awal3").val() != "" && $("#bank_filter2").val() == "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTablePenjualanTenagaListrikBank($("#tanggal_awal3").val(), $("#tanggal_akhir3").val(), $("#bank_filter2").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal3").val()
        srcTglAkhir = $("#tanggal_akhir3").val()
    }
}

function initDataTablePenjualanTenagaListrikDist(p_tgl_awal, p_tgl_akhir, p_unit) {
//    showLoadingCss()
    $('#tanggal_awal4').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir4').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/penjualan_tenaga_listrik_dist",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal4").val(),
            p_tgl_akhir: $("#tanggal_akhir4").val(),
            p_bank: $("#unit_filter3").val()
        },
        success: function (res) {
            var data = res.return;
//            console.log("response : "+data);

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