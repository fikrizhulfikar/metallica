/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_rekapitulasi;
var idValas = "";
var allData;
var tempTableSearch = "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    getAllData();
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectJenisPembayaran("cmb_jenis_pemabayaran", "FILTER", "");
    search("load");
    inputKeterangan();
});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
        $('#tanggal_akhir').attr("disabled", "disabled");
    } else {
        $('#tanggal_akhir').val("");
        $('#tanggal_akhir').datepicker("destroy");
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function show_modal(id) {
    idValas = id;
    $('#pTglJatuhTempo').val("");
    $('#edit-reverse-modal').modal({backdrop: 'static', keyboard: false});
}

function show_modal_upd_ket(id) {
    idValas = id;
    $('#edit-ket-modal').modal({backdrop: 'static', keyboard: false});
}

function editKet() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/upd_ket",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idValas,
            pKeterangan: $("#pKeteranganNew").val(),
        },
        success: function (res) {
            hideLoadingCss("")
            if (res.return == 1) {
                alert("Sukses update keterangan");
                idValas = "";
                location.reload();
            } else {
                alert("Gagal update keterangan");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")

        }
    });
}


function inputKeterangan() {

    var ket = localStorage.getItem("real_ktr");
    if (ket === null) {
        return null
    }
    else {
        var ket_split2 = ket.split(",");
        var option = '';
        for (var i = 0; i < ket_split2.length; i++) {
            option += '<option value="' + ket_split2[i] + '" />';
        }
        if (ket_split2[0] == "null") {
            localStorage.removeItem("real_ktr");
            localStorage.removeItem("ktr");
        } else {
            document.getElementById("data-keterangan").innerHTML = option;
        }
    }
}

function reverse() {
    var ket = $("#pKeterangan").val().toString();
    var all_ket = [];
    var ket_lama = localStorage.getItem("real_ktr");

    if (ket_lama == null) {
        localStorage.removeItem("real_ktr");
        localStorage.removeItem("ktr");
        localStorage.setItem("ktr", ket);

        all_ket.push(ket);
        localStorage.setItem("real_ktr", all_ket);
    }
    else {
        localStorage.setItem("ktr", ket);

        var status = true;
        var list_keterangan_lama = ket_lama.split(",");
        for (var i = 0; i < list_keterangan_lama.length; i++) {
            if (ket === list_keterangan_lama[i]) {
                status = false
            }
        }
        if (status == true) {
            list_keterangan_lama.push(ket);
        }
        localStorage.setItem("real_ktr", list_keterangan_lama);
    }
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/upd_reverse",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idValas,
            pStatusInvoice : '10',
            pKeterangan: $("#pKeterangan").val(),
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_reverse :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                idValas = "";
                location.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")

        }
    });
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_all_pembayaran",
        dataType: 'JSON',
        type: "GET",
        data: {
            pStatusValas: "1",
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pCurr: $("#cmb_currecny").val(),
            pPembayaran: $("#cmb_jenis_pemabayaran").val()
        },
        success: function (res) {
            console.log("al data  : " + res);
            allData = res;
        },
        error: function () {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/pembayaran/xls/1/" + tglAwal.replace(/\//g, "-") + "/" + tglAkhir.replace(/\//g, "-") + "/" + $("#cmb_bank").val() + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_jenis_pemabayaran").val());
}

function generatePDF() {

    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "JATUH TEMPO",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "VENDOR / PENGEMBANG / PEMASOK/ LOAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "CURRENCY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NILAI TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL EQ IDR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NAMA KONTRAK / LOAN UNIT/ PENERIMA PEMBANGKIT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK TUJUAN PEMBAYARAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK PEMBAYAR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TGL TERIMA TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TGL. TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NO. TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TGL. NOTA DINAS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NO. NOTA DINAS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TGL PEMBAYARAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "COUNTDOWN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "STATUS",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TIPE TRANSAKSI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "STATUS TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });

    var externalDataRetrievedFromServer = []
    $.each(allData, function (index, v) {
        var helloooow = {
            NO: v.ROW_NUMBER,
            JENIS_PEMBAYARAN: v.ID_JENIS_PEMBAYARAN,
            JATUH_TEMPO: v.TGL_JATUH_TEMPO,
            VENDOR: v.ID_VENDOR,
            CURRENCY: v.CURRENCY,
            NILAI_TAGIHAN: accounting.formatNumber(v.TOTAL_TAGIHAN, 2, ".", ","),
            NOMINAL_EQ_IDR: accounting.formatNumber(v.EQ_RUPIAH, 2, ".", ","),
            NAMA_KONTRAK: v.ID_UNIT,
            BANK_TUJUAN_PEMBAYARAN: v.KODE_BANK_TUJUAN,
            BANK_PEMBAYAR: v.KODE_BANK_PEMBAYAR,
            TGL_TERIMA_INVOICE: v.TGL_TERIMA_INVOICE,
            TGL_SURAT_TAGIHAN: v.TGL_TAGIHAN,
            NO_SURAT_TAGIHAN: v.NO_TAGIHAN,
            TGL_NOTA_DINAS: v.TGL_NOTDIN,
            NO_NOTA_DINAS: v.NO_NOTDIN,
            TGL_LUNAS: v.TGL_LUNAS,
            COUNT_DOWN: v.COUNT_DOWN,
            STATUS: v.STATUS_VALAS,
            TIPE_TRANSAKSI: v.TIPE_TRANSAKSI,
            STATUS_TRACKING: v.STATUS_TRACKING
        }
        externalDataRetrievedFromServer.push(helloooow)
    });

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            console.log(row);
            dataRow.push(row["NO"]);
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push(row["VENDOR"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push({text: row["NILAI_TAGIHAN"], alignment: "right"});
            dataRow.push({text: row["NOMINAL_EQ_IDR"], alignment: "right"});
            dataRow.push(row["NAMA_KONTRAK"]);
            dataRow.push(row["BANK_TUJUAN_PEMBAYARAN"]);
            dataRow.push(row["BANK_PEMBAYAR"]);
            dataRow.push(row["TGL_TERIMA_INVOICE"]);
            dataRow.push(row["TGL_SURAT_TAGIHAN"]);
            dataRow.push(row["NO_SURAT_TAGIHAN"]);
            dataRow.push(row["TGL_NOTA_DINAS"]);
            dataRow.push(row["NO_NOTA_DINAS"]);
            dataRow.push(row["TGL_LUNAS"]);
            dataRow.push({text: row["COUNT_DOWN"], alignment: "right"});
            dataRow.push(row["STATUS"]);
            dataRow.push(row["TIPE_TRANSAKSI"]);
            dataRow.push(row["STATUS_TRACKING"]);

            body.push(dataRow);
        });

        return body;
    }

    function table(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBody(data, columns)
            }
        };
    }

    var docDefinition = {
        pageOrientation: "landscape",
        content: [{
            text: "REALISASI PEMBAYARAN",
            style: "header",
            alignment: "center"
        }, {
            text: "Tanggal Cetak : " + getDataNow(),
            style: "subheader"
        },
            table(externalDataRetrievedFromServer, column)
        ],
        styles: {
            header: {
                fontSize: 5.5,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 4.5,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                fontSize: 5
            },
            tableHeader: {
                bold: true,
                fontSize: 5.5,
                color: "black"
            }
        },
        defaultStyle: {
            alignment: "left",
            margin: [0, 0, 0, 0]
        }
    };
    pdfMake.createPdf(docDefinition).open();
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran) {
    showLoadingCss()
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();
    table_rekapitulasi = $('#table-rekapitulasi').DataTable({
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "300px",
        "scrollX": true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            {width: 20, targets: 0},
            {width: 140, targets: 1},
            {width: 105, targets: 2},
            {width: 200, targets: 3},
            {width: 80, targets: 4},
            {width: 100, targets: 5},
            {width: 120, targets: 6},
            {width: 300, targets: 7},
            {width: 170, targets: 8},
            {width: 100, targets: 9},
            {width: 90, targets: 10},
            {width: 110, targets: 11},
            {width: 130, targets: 12},
            {width: 120, targets: 13},
            {width: 75, targets: 14},
            {width: 75, targets: 15},
            {width: 75, targets: 16},
            {width: 100, targets: 17},
            {width: 135, targets: 18},
            {width: 120, targets: 19},
            {width: 300, targets: 20},
            {className: "datatables_action", "targets": [12, 16, 6]},
            {
                "bSortable": true,
                "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            {
                "aTargets": [21],
                "mRender": function (data, type, full) {

                    if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS" || newRoleUser[0] == "ROLE_MS_PEMBELANJAAN" || newRoleUser[0] == "ROLE_MS_KEUKON" || newRoleUser[0] == "ROLE_DM_KEUKON_SLPMN" || newRoleUser[0] == "ROLE_DM_KEUKON_APLN" || newRoleUser[0] == "ROLE_MS_KEUKON") {
                        return '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-info" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                            '</div>';
                    } else {
                        return '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-update-status btn-sm btn-success" title="Edit" onclick="show_modal(\'' + full.ID_VALAS + '\')"><i class="fa fa-arrow-left"></i></button>' +
                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-info" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                            '</div>';
                    }
                }
            },
            {
                "aTargets": [5],
                "sClass": "datatables_action",
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.TOTAL_TAGIHAN, 2, ".", ",")
                }
            },
            {
                "aTargets": [6],
                "sClass": "datatables_action",
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.EQ_RUPIAH, 2, ".", ",")
                }
            },
            {
                "aTargets": [14],
                "sClass": "datatables_action",
                "mRender": function (data, type, full) {
                    return full.COUNT_DOWN;
                }
            },
            {
                "aTargets": [20],
                "mRender": function (data, type, full) {
                    return "<a href='javascript:' onclick='show_modal_upd_ket(\"" + full.ID_VALAS + "\")'>" + full.DESKRIPSI + "<a>";
                }
            }
        ],
        "ajax": {
            "url": baseUrl + "api_operator/pembayaran/get_data_realisasi",
            "type": "GET",
            "dataType": "json",
            "data": {
                pTglAwal: pTglAwal,
                pTglAkhir: pTglAkhir,
                pBank: pBank,
                pCurrency: pCurrency,
                pPembayaran: pPembayaran,
            },
            "dataSrc": function (res) {
                hideLoadingCss("")
                console.log("get log : ", res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "ID_JENIS_PEMBAYARAN", "defaultContent": ""},
            {"data": "TGL_JATUH_TEMPO", "defaultContent": ""},
            {"data": "ID_VENDOR", "defaultContent": ""},
            {"data": "CURRENCY", "defaultContent": ""},
            {"data": "TOTAL_TAGIHAN", "defaultContent": ""},
            {"data": "EQ_RUPIAH", "defaultContent": ""},
            {"data": "ID_UNIT", "defaultContent": ""},
            {"data": "KODE_BANK_TUJUAN", "defaultContent": ""},
            {"data": "KODE_BANK_PEMBAYAR", "defaultContent": ""},
            {"data": "TGL_TERIMA_INVOICE", "defaultContent": ""},
            {"data": "TGL_TAGIHAN", "defaultContent": ""},
            {"data": "NO_TAGIHAN", "defaultContent": ""},
            {"data": "TGL_NOTDIN", "defaultContent": ""},
            {"data": "NO_NOTDIN", "defaultContent": ""},
            {"data": "TGL_LUNAS", "defaultContent": ""},
            {"data": "COUNT_DOWN", "defaultContent": ""},
            {"data": "STATUS_VALAS", "defaultContent": ""},
            {"data": "TIPE_TRANSAKSI", "defaultContent": ""},
            {"data": "STATUS_TRACKING", "defaultContent": ""},
            {"data": "DESKRIPSI", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
            console.log("length : ", newRoleUser.length);
            console.log("length : ", newRoleUser[0]);
            $(".btn-update-status").hide();
            if (newRoleUser.length > 0) {
                for (var i = 0; i < newRoleUser.length; i++) {
                    if (newRoleUser[i] == "ROLE_KASIR" || newRoleUser[i] == "ROLE_KASIR_IDR" || newRoleUser[i] == "ROLE_KASIR_INVESTASI" || newRoleUser[i] == "ROLE_ADMIN") {
                        $(".btn-update-status").show();
                    }
                    else {
                        $("#file-bukti-pelaksanaan").hide();
                    }
                }
            }
        }
    });

    table_rekapitulasi.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });

}


function upload_file(pIdValas) {
    $("#modal-upload-file").modal("show");
    $("#temp-id-valas-file").val(pIdValas);

    getFilesRekap(pIdValas);
}

function getFilesRekap(pIdValas) {
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_files_rekap",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdValas: pIdValas
        },

        success: function (data) {
            console.log("get files rekap  : ", data);
            var html = '<a id="btn-download-bukti-pelaksanaan">-</a>';
            var html1 = '<a id="btn-download-tanda-terima-invoice">-</a>';
            var html2 = '<a id="btn-download-lembar-verifikasi">-</a>';
            var html3 = '<a id="btn-download-file-tagihan">-</a>';
            var html4 = '<a id="btn-download-nota-dinas-pembayaran">-</a>';

            $("#btn-download-bukti-pelaksanaan").replaceWith(html);
            $("#btn-download-tanda-terima-invoice").replaceWith(html1);
            $("#btn-download-lembar-verifikasi").replaceWith(html2);
            $("#btn-download-file-tagihan").replaceWith(html3);
            $("#btn-download-nota-dinas-pembayaran").replaceWith(html4);
            $.each(data.data_pembayaran.return, function (index, val) {
                if (val.JENIS_FILE == null || val.JENIS_FILE == "") {
                    var html = '<a id="btn-download-bukti-pelaksanaan">-</a>';
                    var html1 = '<a id="btn-download-tanda-terima-invoice">-</a>';
                    var html2 = '<a id="btn-download-lembar-verifikasi">-</a>';
                    var html3 = '<a id="btn-download-file-tagihan">-</a>';
                    var html4 = '<a id="btn-download-nota-dinas-pembayaran">-</a>';
                    $("#btn-download-bukti-pelaksanaan").replaceWith(html);
                    $("#btn-download-tanda-terima-invoice").replaceWith(html1);
                    $("#btn-download-lembar-verifikasi").replaceWith(html2);
                    $("#btn-download-file-tagihan").replaceWith(html3);
                    $("#btn-download-nota-dinas-pembayaran").replaceWith(html4);
                }
                if (val.JENIS_FILE == 1) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-tanda-terima-invoice"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-tanda-terima-invoice").replaceWith(html);
                    } else {
                        var html = '<a id="btn-download-tanda-terima-invoice">-</a>';
                        $("#btn-download-tanda-terima-invoice").replaceWith(html);
                    }
                }

                if (val.JENIS_FILE == 2) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-lembar-verifikasi"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-lembar-verifikasi").replaceWith(html);
                    } else {
                        var html = '<a id="btn-download-lembar-verifikasi">-</a>';
                        $("#btn-download-lembar-verifikasi").replaceWith(html);
                    }
                }

                if (val.JENIS_FILE == 3) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-file-tagihan"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-file-tagihan").replaceWith(html);
                    } else {
                        var html = '<a id="btn-download-file-tagihan">-</a>';
                        $("#btn-download-file-tagihan").replaceWith(html);
                    }
                }

                if (val.JENIS_FILE == 4) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-nota-dinas-pembayaran"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-nota-dinas-pembayaran").replaceWith(html);
                    } else {
                        var html = '<a id="btn-download-nota-dinas-pembayaran">-</a>';
                        $("#btn-download-nota-dinas-pembayaran").replaceWith(html);
                    }
                }

                if (val.JENIS_FILE == 5) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-bukti-pelaksanaan"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-bukti-pelaksanaan").replaceWith(html);
                    } else {
                        var html = '<a id="btn-download-bukti-pelaksanaan">-</a>';
                        $("#btn-download-bukti-pelaksanaan").replaceWith(html);
                    }
                }
            });
        },
        error: function () {
            console.log("Gagal mengambil data files rekap")
        }
    });
}

function upload_server(jenisFile) {
    showLoadingCss();
    $("#modal-upload-file").modal("hide");
    var form = $('form')[0];
    var formData = new FormData(form);
    var jenisFile;

    formData.append('file', $('input[type=file]#file-bukti-pelaksanaan')[0].files[0]);
    fileSize = $('input[type=file]#file-bukti-pelaksanaan')[0].files[0].size / 1000;
    $("#file-bukti-pelaksanaan").val('');

    formData.append('pIdValas', $("#temp-id-valas-file").val());
    formData.append('pJenisFile', jenisFile);
    formData.append('pFileSize', fileSize);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/pembayaran/upload_files_pembayaran",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (data) {
            console.log("response upload file : ", data);
            if (data.return == 1) {
                alert("Sukses upload file");
                getFilesRekap($("#temp-id-valas-file").val());
            } else {
                alert("Gagal upload file");
            }
            hideLoadingCss();
            setTimeout(function () {
                $('#modal-upload-file').modal({backdrop: 'static', keyboard: false});
            }, 2000);

        },
        error: function () {
            hideLoadingCss("Gagal upload file");
            setTimeout(function () {
                $('#modal-upload-file').modal({backdrop: 'static', keyboard: false});
            }, 2000);
        }
    });
}