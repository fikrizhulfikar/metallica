var tempTableSearch = "";
var kebutuhanPlacement;

$(document).ready(function () {
    initDataTablePlacement();
    initDataTablePlacement2();
    initDataTablePlacement3();
//    initDataTablePlacement4();

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val(), $("#cmb_status_tracking").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function initDataTablePlacement(p_tgl_awal, p_sesi) {
    showLoadingCss();
    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
//    $('#sesi_filter').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/rekap_placement_lcl",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_sesi: $("#sesi_filter").val()
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
            if (val["BANK"] === "TOTAL"){
                var html = "<tr>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPREST_KP,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPREST_OT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPREST_IT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SETTLEMENT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.PROYEKSI_VALAS,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.RECEIPT_PLACEMENT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.GIRO,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                    "</tr>";
            } else {
                var html = "<tr>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_KP,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_OT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_IT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SETTLEMENT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PROYEKSI_VALAS,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.RECEIPT_PLACEMENT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.GIRO,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                    "</tr>";
            }
                $('#table-rekap-placement-lcl').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-rekap-placement-lcl tbody').empty();
            var html = "<tr>" +
                "<td colspan='11' align='center'> No Data </td>" +
                "</tr>";
            $('#table-rekap-placement-lcl tbody').append(html);
        }
    });
}

function initDataTablePlacement2(_date, p_tgl_awal, p_sesi){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    var datestring = dateToString(date);
    $("#tgl1b").html(datestring);
    $("#tgl2b").html(incDate(date, 1));
    $("#tgl3b").html(incDate(date, 2));
    $("#tgl4b").html(incDate(date, 3));
    $("#tgl5b").html(incDate(date, 4));
    $("#tgl6b").html(incDate(date, 5));

    showLoadingCss();
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();

    kebutuhanPlacement = $("#kebutuhan-placement").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "bLengthChange": true,
        "scrollY": "100%",
        "scrollX": "100%",
        // "order": [3],
        "searching": true,
        bSortable: true,
        /*"scrollY": "300px",
        "scrollX": true,*/
        "scrollCollapse": true,
        "aoColumnDefs": [
            {width: 100, targets: 0},
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 100, targets: 7},
//            {width: 100, targets: 8},
            {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 6, 7, 8] },
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {
                    return full.TIPE_KEBUTUHAN;
                }

            },
            {
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.BANK;
                }

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D0,2,".",",");
                }

            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D1,2,".",",");
                }

            },

            {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D2,2,".",",");
                }

            },
            {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D3,2,".",",");
                }

            },
            {
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D4,2,".",",");
                }

            },
            {
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D5,2,".",",");
                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    var ret_value = " ";
                    if (full.TIPE_KEBUTUHAN == "IMPREST KANTOR PUSAT"){
                    ret_value =
                        '<div class="btn-group">' +
                        '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setA()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "IMPOR"){
                          ret_value =
                              '<div class="btn-group">' +
                              '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setB()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "IMPREST INVESTASI TERPUSAT"){
                          ret_value =
                              '<div class="btn-group">' +
                              '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setC()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "IMPREST OPERASI TERPUSAT"){
                          ret_value =
                              '<div class="btn-group">' +
                              '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setD()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "SETTLEMENT"){
                          ret_value =
                               '<div class="btn-group">' +
                               '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setE()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "PROYEKSI PENGADAAN VALAS"){
                          ret_value =
                               '<div class="btn-group">' +
                               '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setF()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "RECEIPT PLACEMENT"){
                          ret_value =
                               '<div class="btn-group">' +
                               '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setG()"><i class="fa fa-clone"></i></button>';
                    } else if (full.TIPE_KEBUTUHAN == "GIRO SPECIAL RATE"){
                          ret_value =
                               '<div class="btn-group">' +
                               '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setH()"><i class="fa fa-clone"></i></button>';
                    }
                    return ret_value;
                }
            }
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/rekap_invoice_belum/rekap_placement_lcl",
                "type":
                    "GET",
                "dataType":
                    "json",
                "data":
                    {
                        p_tgl_awal: p_tgl_awal,
                        p_sesi: p_sesi
                    }
                ,
                "dataSrc":
                function (res) {
                    hideLoadingCss()
                    getTotalTagihan();
                    return res.OUT_KEBUTUHAN_PLACEMENT;
                }
            }
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
//            console.log(array);
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.TIPE_KEBUTUHAN){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].TIPE_KEBUTUHAN;
//                    if (first !== array[j].TIPE_KEBUTUHAN) break;
//                    count+= 1;
//                }
//
//                $(rows).eq(i).before(
//                    '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                );
////                console.log(array)
//                last = group.TIPE_KEBUTUHAN;
//                }
//            });
//         }
    });

    kebutuhanPlacement.columns.adjust();
}

function initDataTablePlacement3() {
    showLoadingCss();
//    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
//    $('#sesi_filter').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_pemindahan_buku",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
            if (val["BANK"] === "TOTAL"){
                var html = "<tr>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='center' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "</tr>";
            } else {
                var html = "<tr>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'>" + val.KEPADA_BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right'>" + val.NO_SAP + "</td>" +
                    "<td align='right'> " + val.KETERANGAN + "</td>" +
                    "</tr>";
            }
                $('#table-pemindahbukuan').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-pemindahbukuan tbody').empty();
            var html = "<tr>" +
                "<td colspan='11' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pemindahbukuan tbody').append(html);
        }
    }),

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_settlement_valas",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
            if (val["BANK"] === "TOTAL"){
                var html = "<tr>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='center' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "</tr>";
            } else {
                var html = "<tr>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right'>" + val.KEPADA_BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_SAP + "</td>" +
                    "<td align='right'> " + val.KETERANGAN + "</td>" +
                    "</tr>";
            }
                $('#table-settlement-valas').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-settlement-valas tbody').empty();
            var html = "<tr>" +
                "<td colspan='9' align='center'> No Data </td>" +
                "</tr>";
            $('#table-settlement-valas tbody').append(html);
        }
    }),

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_pengadaan_valas",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
           if (val["BANK"] === "TOTAL"){
                var html = "<tr>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='center' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "</tr>";
            } else {
                var html = "<tr>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right'>" + val.BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_SAP + "</td>" +
                    "<td align='right'> " + val.KETERANGAN + "</td>" +
                    "</tr>";
            }
                $('#table-pengadaan-valas').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-pengadaan-valas tbody').empty();
            var html = "<tr>" +
                "<td colspan='9' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pengadaan-valas tbody').append(html);
        }
    }),

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/rekap_placement_lcl",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_sesi: $("#sesi_filter").val()
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
            if (val["BANK"] === "TOTAL"){
                var html = "<tr>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPREST_KP,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPREST_OT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.IMPREST_IT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SETTLEMENT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.PROYEKSI_VALAS,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.RECEIPT_PLACEMENT,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.GIRO,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                    "</tr>";
            } else {
                var html = "<tr>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_KP,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_OT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_IT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SETTLEMENT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PROYEKSI_VALAS,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.RECEIPT_PLACEMENT,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.GIRO,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                    "</tr>";
            }
                $('#table-rekap-placement-lcl').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-rekap-placement-lcl tbody').empty();
            var html = "<tr>" +
                "<td colspan='11' align='center'> No Data </td>" +
                "</tr>";
            $('#table-rekap-placement-lcl tbody').append(html);
        }
    });
}

function dateToString(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

function incDate(date, days) {
    date = new Date(date.getTime() + (86400000 * days));
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
}

function stringToDate(_date) {
    var formatLowerCase = 'dd/mm/yyyy';
    var formatItems = formatLowerCase.split('/');
    var dateItems = _date.split('/');
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function search(state) {
    if ($("#sesi").val() == "" && state != "load" && $("#tanggal_awal1").val() != "") {
        alert("Mohon isi filter");
    } else {
        initDataTable($("#tanggal_awal1").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val(), $("#cmb_status_tracking").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal1").val()
    }
}

function openLihatDokumen(){
    $('#set-i').modal({backdrop: 'static', keyboard: false});
}

function setA(){
    $('#set-a').modal({backdrop: 'static', keyboard: false});
}

function setB(){
    $('#set-b').modal({backdrop: 'static', keyboard: false});
}

function setC(){
    $('#set-c').modal({backdrop: 'static', keyboard: false});
}

function setD(){
    $('#set-d').modal({backdrop: 'static', keyboard: false});
}

function setE(){
    $('#set-e').modal({backdrop: 'static', keyboard: false});
}

function setF(){
    $('#set-f').modal({backdrop: 'static', keyboard: false});
}

function setG(){
    $('#set-g').modal({backdrop: 'static', keyboard: false});
}

function setH(){
    $('#set-h').modal({backdrop: 'static', keyboard: false});
}

function update_approve_staff_lcl(pSesi){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/approve_staff_lcl",
        dataType: 'JSON',
        type: "POST",
        data: {
//            pStaffLcl: pStaffLcl,
            pSesi: pSesi,
        },
        success: function (res) {
            hideLoadingCss("")
            if (res.return == 1) {
                alert(res.OUT_MSG);
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function update_approve_msb_lcl(pSesi){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/approve_msb_lcl",
        dataType: 'JSON',
        type: "POST",
        data: {
//            pStaffLcl: pStaffLcl,
            pSesi: pSesi,
        },
        success: function (res) {
            hideLoadingCss("")
            if (res.return == 1) {
                alert(res.OUT_MSG);
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function update_approve_vp_lcl(pSesi){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/approve_vp_lcl",
        dataType: 'JSON',
        type: "POST",
        data: {
//            pStaffLcl: pStaffLcl,
            pSesi: pSesi,
        },
        success: function (res) {
            hideLoadingCss("")
            if (res.return == 1) {
                alert(res.OUT_MSG);
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function initDataTablePlacement4(p_tgl_awal, p_sesi){

    let set_a = $("#table-imprest-pusat").DataTable({
               "ajax" : {
                   "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
                   "data" : {
                       p_tgl_awal : p_tgl_awal,
                       p_sesi : p_sesi
                   },
                   "type" : "GET",
                   "dataType" : "json",
               },
               "sorting": false,
               "searching" : false,
               "paging": false,
               "bInfo" : false,
               "bLengthChange" : false,
               "columns" : [
       //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
                   {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                     return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                     } else
                                                                     return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                     },
                                                                     "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                     }},
                   {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                     return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                     } else
                                                                     return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                  },
                                                                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                }},
                   {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                     return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                     } else
                                                                     return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                  },
                                                                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                }},
                   {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                     return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                     } else
                                                                     return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                  },
                                                                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                }},
                   {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                     return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                     } else
                                                                     return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                  },
                                                                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                }},
                   {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                     return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                     } else
                                                                     return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                  },
                                                                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                }},
               ],
       });

       let set_b = $("#table-impor").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 } else
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 },
                                                                 "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                 }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                 } else
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
           ],
       });

       let set_c = $("#table-imprest-operasi-terpusat").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 } else
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 },
                                                                 "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                 }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                 } else
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
           ],
       });

       let set_d = $("#table-imprest-investasi-terpusat").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 } else
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 },
                                                                 "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                 }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                 } else
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
           ],
       });

       let set_e = $("#table-settlement").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 } else
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 },
                                                                 "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                 }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                 } else
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
           ],
       });

       let set_f = $("#table-proteksi-pengadaan-valas").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 } else
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 },
                                                                 "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                 }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                 } else
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
           ],
       });

       let set_g = $("#table-receipt-placement").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 } else
                                                                 return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                 },
                                                                 "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                 }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
                {"data":null,"render" : (data, tyoe, row) => {if (data.MEGA == "0" || data.MEGA == null){
                                                                 return "<td><input style='text-align:right;' id='mega_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='mega_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
                {"data":null,"render" : (data, tyoe, row) => {if (data.DKI == "0" || data.DKI == null){
                                                                 return "<td><input style='text-align:right;' id='dki_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                 } else
                                                                 return "<td><input style='text-align:right;' id='dki_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BCA == "0" || data.BCA == null){
                                                                return "<td><input style='text-align:right;' id='bca_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='bca_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BII == "0" || data.BII == null){
                                                                return "<td><input style='text-align:right;' id='bii_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='bii_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BRIS == "0" || data.BRIS == null){
                                                                return "<td><input style='text-align:right;' id='bris_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='bris_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.BTN == "0" || data.BTN == null){
                                                                return "<td><input style='text-align:right;' id='btn_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='btn_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.DANAMON == "0" || data.DANAMON == null){
                                                                return "<td><input style='text-align:right;' id='danamon_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='danamon_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.OCBC == "0" || data.OCBC == null){
                                                                return "<td><input style='text-align:right;' id='ocbc_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='ocbc_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.UOB == "0" || data.UOB == null){
                                                               return "<td><input style='text-align:right;' id='uob_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='uob_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.DBS == "0" || data.DBS == null){
                                                               return "<td><input style='text-align:right;' id='dbs_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='dbs_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.CIMB == "0" || data.CIMB == null){
                                                               return "<td><input style='text-align:right;' id='cimb_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='cimb_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                 } else
                                                                 return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                              },
                                                            "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                            }},
           ],
       });

       let set_h = $("#table-giro-special-rate").DataTable({
           "ajax" : {
               "url": baseUrl + "api_operator/rekap_invoice_belum/detail_rekap_placement_lcl",
               "data" : {
                   p_tgl_awal : p_tgl_awal,
                   p_sesi : p_sesi
               },
               "type" : "GET",
               "dataType" : "json",
           },
           "sorting": false,
           "searching" : false,
           "paging": false,
           "bInfo" : false,
           "bLengthChange" : false,
           "columns" : [
   //            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
               {"data": null,"render": (data, type, row) => {if (data.BANK == null){
                                                                return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                } else
                                                                return "<td><input id='kdbank_potensi' type='text' value='"+data.BANK+"' disabled></td>";
                                                                },
                                                                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                                }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='mandiri_imprest_pusat' type='number' value='"+data.MANDIRI+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='bri_imprest_pusat' type='number' value='"+data.BRI+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='bni_imprest_pusat' type='number' value='"+data.BNI+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='bukopin_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.MEGA == "0" || data.MEGA == null){
                                                                return "<td><input style='text-align:right;' id='mega_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='mega_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
               {"data":null,"render" : (data, tyoe, row) => {if (data.DKI == "0" || data.DKI == null){
                                                                return "<td><input style='text-align:right;' id='dki_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                                } else
                                                                return "<td><input style='text-align:right;' id='dki_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BCA == "0" || data.BCA == null){
                                                               return "<td><input style='text-align:right;' id='bca_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='bca_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BII == "0" || data.BII == null){
                                                               return "<td><input style='text-align:right;' id='bii_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='bii_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BRIS == "0" || data.BRIS == null){
                                                               return "<td><input style='text-align:right;' id='bris_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='bris_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.BTN == "0" || data.BTN == null){
                                                               return "<td><input style='text-align:right;' id='btn_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='btn_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.DANAMON == "0" || data.DANAMON == null){
                                                               return "<td><input style='text-align:right;' id='danamon_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='danamon_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.OCBC == "0" || data.OCBC == null){
                                                               return "<td><input style='text-align:right;' id='ocbc_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                               } else
                                                               return "<td><input style='text-align:right;' id='ocbc_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                            },
                                                          "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                          }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.UOB == "0" || data.UOB == null){
                                                              return "<td><input style='text-align:right;' id='uob_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              } else
                                                              return "<td><input style='text-align:right;' id='uob_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
             {"data":null,"render" : (data, tyoe, row) => {if (data.DBS == "0" || data.DBS == null){
                                                              return "<td><input style='text-align:right;' id='dbs_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              } else
                                                              return "<td><input style='text-align:right;' id='dbs_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
             {"data":null,"render" : (data, tyoe, row) => {if (data.CIMB == "0" || data.CIMB == null){
                                                              return "<td><input style='text-align:right;' id='cimb_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                              } else
                                                              return "<td><input style='text-align:right;' id='cimb_imprest_pusat' type='number' value='"+data.BUKOPIN+"'></td>";
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
              {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>" + new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                                } else
                                                                return '<td>'+ "<input style='text-align:right;' id='kdcurrency_potensi' type='hidden' value='"+data.TOTAL+"' disabled>"+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                             },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
           ],
       });
}

function updateImprestPusat(){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#bank_imprest_pusat').val();
        if (i === undefined) { return true; }
//        map.tipe = cell.find('input#kdcurrency_potensi').val();
        map.bank = cell.find('input#bank_imprest_pusat').val();
        map.bmandiri = cell.find('input#mandiri_imprest_pusat').val();
        map.bbri = cell.find('input#bri_imprest_pusat').val();
        map.bbni = cell.find('input#bni_imprest_pusat').val();
        map.bbukopin = cell.find('input#bukopin_imprest_pusat').val();
        map.bmega = cell.find('input#mega_imprest_pusat').val();
        map.bdki = cell.find('input#dki_imprest_pusat').val();
        map.bbca = cell.find('input#bca_imprest_pusat').val();
        map.bbii = cell.find('input#bii_imprest_pusat').val();
        map.bbris = cell.find('input#bris_imprest_pusat').val();
        map.bbtn = cell.find('input#btn_imprest_pusat').val();
        map.bdanamon = cell.find('input#danamon_imprest_pusat').val();
        map.bocbc = cell.find('input#ocbc_imprest_pusat').val();
        map.buob = cell.find('input#uob_imprest_pusat').val();
        map.bdbs = cell.find('input#dbs_imprest_pusat').val();
        map.bcimb = cell.find('input#cimb_imprest_pusat').val();
        list.push(map)
    });

    console.log(list);


    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_belum/ins_rekap_placement_lcl",
        dataType: 'JSON',
        type: "POST",
        data : {
            /*pKodeBank: row.find('.kdbank_potensi').html(),
            pJumlah: row.find('input').val(),*/
            pData: JSON.stringify(list)
        },
        success: function (res) {
//            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
                location.reload();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

};