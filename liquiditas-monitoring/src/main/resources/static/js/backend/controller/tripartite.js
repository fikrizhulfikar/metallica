/**
 * Created by israjhaliri on 8/23/17.
 */

var idTripartite;
var allData;
var table_trepartite;
var tempVendor;
var tempTableSearch = "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {

    siap();
    getAllData();

    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");

    console.log("new date ; ", new Date());

    $("#pTglInvoice").datepicker({dateFormat: 'dd/mm/yy'});
    $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $('#pTglJatuhTempoH2').datepicker({dateFormat: 'dd/mm/yy'});
    $('#pTglNotaDinas').datepicker({dateFormat: 'dd/mm/yy'});
    $('#pTglTerimaInvoice').datepicker({dateFormat: 'dd/mm/yy', maxDate: new Date()});

    $('#pJenisPemabayaran').select2({
        width: '100%'
    });
    $('#pVendor').select2({
        width: '100%'
    });

    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
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

function selectJenisPembayaran(value) {
    $("#pVendor").select2("val", "");
    setSelectVendor("pVendor", value, tempVendor);
}

function openFormNew() {

    idTripartite = "";

    $("#pTglJatuhTempo").val("");
    $("#pTglJatuhTempoH2").val("");
    $("#pNominalSebelumPajak").val("");
    $("#pPajak").val("");
    $("#pNominalDenganUnderlying").val("");
    $("#pNominalTanpaUnderlying").val("");
    $("#pSpread").val("");
    $("#pNoInvoice").val("");
    $("#pTglInvoice").val("");
    $("#pTglTerimaInvoice").val("");
    $("#pNoNotdin").val("");
    $("#pTglNotaDinas").val("");
    $("#pDeskripsi").val("");
    $("#pKursJisdor").val("");
    $("#pTipeTransaksi").val("");

    $("#pVendor").select2({
        width: "100%"
    });

    setSelectJenisPembayaran("pJenisPemabayaran", "TRIPARTITE", "")
    setSelectBank("pBankCounterparty", "", "PEMBAYAR", "", "TRIPARTITE");
    setSelectCurr("pCurrecny", "", "", "TRIPARTITE");
    if(newRoleUser[0]== "ROLE_OSS"){
        $('#pTglJatuhTempo').prop('disabled', true);
        $('#pTglJatuhTempoH2').prop('disabled', true);
    }
    $('#edit-tripartite-modal').modal({backdrop: 'static', keyboard: false});

}

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/tripartite/delete_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdTripartite: id
            },
            success: function (res) {
                hideLoadingCss("");
                console.log("delete log : ", res)
                if (res.return == 1) {
                    alert(res.OUT_MSG);
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
}

function duplicate_data(id) {
    console.log("duplicate data tripartite");
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/tripartite/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdTripartite: id
        },
        success: function (res) {
            hideLoadingCss("");
            console.log("data duplicate :", res);

            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $("#pTglJatuhTempoH2").val(res[0].H2_JATUH_TEMPO);
            $("#pNominalSebelumPajak").val(res[0].NOMINAL_SBLM_PAJAK);
            $("#pPajak").val(res[0].PAJAK);
            $("#pNominalDenganUnderlying").val(res[0].NOMINAL_UNDERLYING);
            $("#pNominalTanpaUnderlying").val(res[0].NOMINAL_TANPA_UNDERLYING);
            $("#pSpread").val(res[0].SPREAD);
            $("#pNoInvoice").val(res[0].NO_INVOICE);
            $("#pTglInvoice").val(res[0].TGL_TERIMA_INVOICE);
            $("#pKursJisdor").val(res[0].KURS_JISDOR);
            $("#pTglTerimaInvoice").val(res[0].TGL_INVOICE);
            $("#pNoNotdin").val(res[0].NO_NOTDIN);
            $("#pNoNotaDinas").val(res[0].TGL_NOTDIN);
            $("#pDeskripsi").val(res[0].DESKRIPSI);

            tempVendor = res[0].ID_VENDOR;

            setSelectJenisPembayaran("pJenisPemabayaran", "TRIPARTITE", res[0].ID_JENIS_PEMBAYARAN);
            setSelectBank("pBankCounterparty", "", "PEMBAYAR", res[0].ID_BANK_CONTERPARTY, "TRIPARTITE");
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "TRIPARTITE");
            $("#pTipeTransaksi").val(res[0].TIPE_TRANSAKSI);

            setTimeout(function () {
                $("#pVendor").select2({
                    width: "100%"
                });
                $('#edit-tripartite-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function edit_data(id) {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/tripartite/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdTripartite: id
        },
        success: function (res) {
            hideLoadingCss("");
            idTripartite = id;
            console.log("data edit_data :", res);

            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $("#pTglJatuhTempoH2").val(res[0].H2_JATUH_TEMPO);
            $("#pNominalSebelumPajak").val(res[0].NOMINAL_SBLM_PAJAK);
            $("#pPajak").val(res[0].PAJAK);
            $("#pNominalDenganUnderlying").val(res[0].NOMINAL_UNDERLYING);
            $("#pNominalTanpaUnderlying").val(res[0].NOMINAL_TANPA_UNDERLYING);
            $("#pSpread").val(res[0].SPREAD);
            $("#pNoInvoice").val(res[0].NO_INVOICE);
            $("#pTglInvoice").val(res[0].TGL_TERIMA_INVOICE);
            $("#pKursJisdor").val(res[0].KURS_JISDOR);
            $("#pTglTerimaInvoice").val(res[0].TGL_INVOICE);
            $("#pNoNotdin").val(res[0].NO_NOTDIN);
            $("#pNoNotaDinas").val(res[0].TGL_NOTDIN);
            $("#pDeskripsi").val(res[0].DESKRIPSI);

            tempVendor = res[0].ID_VENDOR;

            setSelectJenisPembayaran("pJenisPemabayaran", "TRIPARTITE", res[0].ID_JENIS_PEMBAYARAN);
            setSelectBank("pBankCounterparty", "", "PEMBAYAR", res[0].ID_BANK_CONTERPARTY, "TRIPARTITE");
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "TRIPARTITE");
            $("#pTipeTransaksi").val(res[0].TIPE_TRANSAKSI);

            setTimeout(function () {
                $("#pVendor").select2({
                    width: "100%"
                });
                $('#edit-tripartite-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function siap() {

    var old_data = localStorage.getItem("real_no_invoice");
    if (old_data === null) {
        return null;
    } else {
        var a = localStorage.getItem("real_no_invoice");
        var c = a.split(",");
        var pilihan = '';
        for (var i = 0; i < c.length; i++) {
            pilihan += '<option value="' + c[i] + '" />';
        }
        console.log(c[i]);
        if (c[0] == "null") {
            localStorage.removeItem("NI");
            localStorage.removeItem("real_no_invoice");
        } else {
            document.getElementById('data-no-invoice').innerHTML = pilihan;

        }
    }
}

function inputKeterangan() {

    var ket = localStorage.getItem("real_keterangan");
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
            localStorage.removeItem("real_keterangan");
            localStorage.removeItem("keterangan");
        } else {
            document.getElementById("list-keterangan").innerHTML = option;
        }
    }
}

function ins_data() {

    var no_invoice = $("#pNoInvoice").val().toString();
    var old_data = localStorage.getItem("real_no_invoice");
    var all_val = [];
    if (old_data == null) {
        localStorage.removeItem("NI");
        localStorage.removeItem("real_no_invoice");
        localStorage.setItem("NI", no_invoice);
        all_val.push(no_invoice);
        localStorage.setItem("real_no_invoice", all_val);
    } else {
        localStorage.setItem("NI", no_invoice);
        all_val.push(old_data);
        all_val.push(no_invoice);
        var c = old_data.split(",");
        for (var i = 0; i < c.length; i++) {
            if (no_invoice !== c[i]) {
                localStorage.setItem("real_no_invoice", all_val);
            }
        }
    }

    var ket = $("#pDeskripsi").val().toString();
    var all_ket = [];
    var ket_lama = localStorage.getItem("real_keterangan");

    if (ket_lama == null) {
        localStorage.removeItem("real_keterangan");
        localStorage.removeItem("keterangan");
        localStorage.setItem("keterangan", ket);

        all_ket.push(ket);
        localStorage.setItem("real_keterangan", all_ket);
    }
    else {
        localStorage.setItem("keterangan", ket);

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
        localStorage.setItem("real_keterangan", list_keterangan_lama);
    }

    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/tripartite/ins_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdTripartite: idTripartite,
            pBank: $("#pBankCounterparty").val(),
            pTglJatuhTempo: $("#pTglJatuhTempo").val(),
            pCurr: $("#pCurrecny").val(),
            pVendor: $("#pVendor").val(),
            pJenisPembayaran: $("#pJenisPemabayaran").val(),
            pNominalSblmPajak: $("#pNominalSebelumPajak").val(),
            pPajak: $("#pPajak").val(),
            pNominalunderlying: $("#pNominalDenganUnderlying").val(),
            pNominalTanpaUnderlying: $("#pNominalTanpaUnderlying").val(),
            pKursJisdor: $("#pKursJisdor").val(),
            pSpread: $("#pSpread").val(),
            pNoInvoice: $("#pNoInvoice").val(),
            pTglInvoice: $("#pTglTerimaInvoice").val(),
            pTglTerimaInvoice: $("#pTglInvoice").val(),
            pNoNotdin: $("#pNoNotdin").val(),
            pTglNotdin: $("#pTglNotaDinas").val(),
            pDeskripsi: $("#pDeskripsi").val()
        },
        success: function (res) {
            hideLoadingCss("");
            var result = res.return.split(";")[0];
            if (result == 1 || result == '1') {
                alert(res.OUT_MSG);
                // location.reload();
                search("load");
                $('#edit-tripartite-modal').modal('hide');
                window.location.reload(true);
            } else {
                alert(res.OUT_MSG);
            }
            $("#pVendor").select2("val", "");
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_jenis_pemabayaran").val());
        getAllData()
        srcTglAwal = $("#tanggal_awal").val();
        srcTglAkhir = $("#tanggal_akhir").val();
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/tripartite/get_all_tripartite",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pJenisPembayran: $("#cmb_jenis_pemabayaran").val(),
        },
        success: function (res) {
            console.log(res);
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
    window.open(baseUrl + "api_operator/tripartite/xls/" + tglAwal.replace(/\//g, "-") + "/" + tglAkhir.replace(/\//g, "-") + "/" + $("#cmb_bank").val() + "/" + $("#cmb_jenis_pemabayaran").val());
}

function generatePDF() {
    console.log("all data  : " + allData);
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
        text: "JATUH TEMPO ",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "H-2  JATUH TEMPO",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PENGEMBANG/ VENDOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK COUNTERPARTY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "CURRENCY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL SEBELUM PAJAK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PAJAK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL SETELAH PAJAK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL DENGAN UNDERLYING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL TANPA UNDERLYING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KURS JISDOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SPREAD",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KURS TRANSAKSI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL PEMBAYARAN IDR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL TERIMA TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMOR TAGIHAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TGL NOTA DINAS",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NO NOTA DINAS",
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
            JENIS_PEMBAYARAN: v.JENIS_PEMBAYARAN,
            JATUH_TEMPO: v.TGL_JATUH_TEMPO,
            H2JATUH_TEMPO: v.H2_JATUH_TEMPO,
            VENDOR: v.VENDOR,
            BANK_COUNTERPARTY: v.BANK_CONTERPARTY,
            CURRENCY: v.CURRENCY,
            NOMINAL_SEBELUM_PAJAK: accounting.formatNumber(v.NOMINAL_SBLM_PAJAK, 2, ".", ","),
            PAJAK: v.PAJAK,
            NOMINAL_SETELAH_PAJAK: accounting.formatNumber(v.NOMINAL_STLH_PAJAK, 2, ".", ","),
            NOMINAL_DENGAN_UNDERLYING: accounting.formatNumber(v.NOMINAL_UNDERLYING, 2, ".", ","),
            NOMINAL_TANPA_UNDERLYING: accounting.formatNumber(v.NOMINAL_TANPA_UNDERLYING, 2, ".", ","),
            KURS_JISDOR: accounting.formatNumber(v.KURS_JISDOR, 2, ".", ","),
            SPREAD: accounting.formatNumber(v.SPREAD, 2, ".", ","),
            KURS_TRANSAKSI: accounting.formatNumber(v.KURS_TRANSAKSI, 2, ".", ","),
            NOMINAL_PEMBAYARAN_IDR: accounting.formatNumber(v.NOMINAL_PEMBAYARAN_IDR, 2, ".", ","),

            TANGGAL_TERIMA_TAGIHAN: v.TGL_INVOICE,
            TANGGAL_TAGIHAN: v.TGL_TERIMA_INVOICE,
            NOMOR_TAGIHAN: v.NO_INVOICE,
            TGL_NOTA_DINAS: v.TGL_NOTDIN,
            NO_NOTA_DINAS: v.NO_NOTDIN,
            TGL_PEMBAYARAN: v.TGL_LUNAS,
            COUNTDOWN: v.COUNT_DOWN,
            TIPE_TRANSAKSI: v.TIPE_TRANSAKSI,
            STATUS_TAGIHAN: v.STATUS_TRACKING,
        }
        externalDataRetrievedFromServer.push(helloooow)
    });

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {

            console.log(row)
            var dataRow = [];
            dataRow.push(row["NO"]);
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push(row["H2JATUH_TEMPO"]);
            dataRow.push(row["VENDOR"]);
            dataRow.push(row["BANK_COUNTERPARTY"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push({text: row["NOMINAL_SEBELUM_PAJAK"], alignment: "right"});
            dataRow.push({text: row["PAJAK"], alignment: "right"});
            dataRow.push({text: row["NOMINAL_SETELAH_PAJAK"], alignment: "right"});
            dataRow.push({text: row["NOMINAL_DENGAN_UNDERLYING"], alignment: "right"});
            dataRow.push({text: row["NOMINAL_TANPA_UNDERLYING"], alignment: "right"});
            dataRow.push({text: row["KURS_JISDOR"], alignment: "right"});
            dataRow.push({text: row["SPREAD"], alignment: "right"});
            dataRow.push({text: row["KURS_TRANSAKSI"], alignment: "right"});
            dataRow.push({text: row["NOMINAL_PEMBAYARAN_IDR"], alignment: "right"});

            dataRow.push(row["TANGGAL_TERIMA_TAGIHAN"]);
            dataRow.push(row["TANGGAL_TAGIHAN"]);
            dataRow.push(row["NOMOR_TAGIHAN"]);
            dataRow.push(row["TGL_NOTA_DINAS"]);
            dataRow.push(row["NO_NOTA_DINAS"]);
            dataRow.push(row["TGL_PEMBAYARAN"]);
            dataRow.push({text: row["COUNTDOWN"], alignment: "right"});
            dataRow.push(row["TIPE_TRANSAKSI"]);
            dataRow.push(row["STATUS_TAGIHAN"]);
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
            text: "TRIPARTITE",
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
                fontSize: 5,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 5,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 3.5
            },
            tableHeader: {
                bold: true,
                fontSize: 4,
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

function initDataTable(pTglAwal, pTglAkhir, pBank, pJenisPembayaran) {
    showLoadingCss()
    $('#table-trepartite tbody').empty();
    $('#table-trepartite').dataTable().fnDestroy();
    table_trepartite = $('#table-trepartite').DataTable({
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        /*"dom": "<'row'<'small-12 columns'l><'toolbar'><'small-6 columns'f>r>"+
        "t"+
        "<'row'<'small-6 columns'i><'small-6 columns'p>>",*/
        // "dom" : "<'row'   fl<'toolbar'>>",
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "300px",
        "scrollX": true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 150, targets: 7},
            {width: 100, targets: 8},
            {width: 150, targets: 9},
            {width: 150, targets: 10},
            {width: 150, targets: 11},
            {width: 100, targets: 12},
            {width: 100, targets: 13},
            {width: 100, targets: 14},
            {width: 150, targets: 15},
            {width: 150, targets: 16},
            {width: 100, targets: 17},
            {width: 100, targets: 18},
            {width: 150, targets: 19},
            {width: 150, targets: 20},
            {width: 100, targets: 21},
            {width: 100, targets: 22},
            {width: 100, targets: 23},
            {width: 100, targets: 24},
            {width: 300, targets: 25},
            {width: 75, targets: 26},
            {width: 12, targets: 27},
            {className: "datatables_action", "targets": [7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 20, 22]},
            {
                "bSortable": true,
                "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27]
            },
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {
                    return full.ROW_NUMBER;
                }

            }, {
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.JENIS_PEMBAYARAN;
                }

            }, {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.TGL_JATUH_TEMPO;
                }

            }, {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return full.H2_JATUH_TEMPO;
                }

            }, {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return full.VENDOR;
                }

            }, {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return full.BANK_CONTERPARTY;
                }

            }, {
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return full.CURRENCY;
                }

            }, {
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.NOMINAL_SBLM_PAJAK, 2, ".", ",")
                }

            }, {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    return full.PAJAK + " %";
                }

            }, {
                "aTargets": [9],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.NOMINAL_STLH_PAJAK, 2, ".", ",")
                }

            }, {
                "aTargets": [10],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.NOMINAL_UNDERLYING, 2, ".", ",")
                }

            }, {
                "aTargets": [11],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.NOMINAL_TANPA_UNDERLYING, 2, ".", ",")
                }

            }, {
                "aTargets": [12],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.KURS_JISDOR, 2, ".", ",")
                }

            }, {
                "aTargets": [13],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.SPREAD, 2, ".", ",")
                }

            }, {
                "aTargets": [14],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.KURS_TRANSAKSI, 2, ".", ",")
                }

            }, {
                "aTargets": [15],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.NOMINAL_PEMBAYARAN_IDR, 2, ".", ",");
                }

            }, {
                "aTargets": [16],
                "mRender": function (data, type, full) {
                    return full.TGL_INVOICE;
                }

            }, {
                "aTargets": [17],
                "mRender": function (data, type, full) {
                    return full.TGL_TERIMA_INVOICE;
                }

            }, {
                "aTargets": [18],
                "mRender": function (data, type, full) {
                    return full.NO_INVOICE;
                }

            }, {
                "aTargets": [19],
                "mRender": function (data, type, full) {
                    return full.TGL_NOTDIN;
                }

            }, {
                "aTargets": [20],
                "mRender": function (data, type, full) {
                    return full.NO_NOTDIN;
                }

            }, {
                "aTargets": [21],
                "mRender": function (data, type, full) {
                    return full.TGL_LUNAS;
                }

            }, {
                "aTargets": [22],
                "mRender": function (data, type, full) {
                    return full.COUNT_DOWN;
                }

            }, {
                "aTargets": [23],
                "mRender": function (data, type, full) {
                    return full.TIPE_TRANSAKSI;
                }

            }, {
                "aTargets": [24],
                "mRender": function (data, type, full) {
                    return full.STATUS_TRACKING;
                }

            }, {
                "aTargets": [25],
                "mRender": function (data, type, full) {
                    return full.DESKRIPSI;
                }

            }, {
                "aTargets": [26],
                "mRender": function (data, type, full) {

                    var ret_value;

                    if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                        return "-"
                    }
                    else if(newRoleUser[0] == "ROLE_OSS"){
                        ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';
                        if (full.STATUS_TRACKING == "INPUT DATA") {
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>';
                        }
                        ret_value = ret_value +
                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                            '</div>'
                    }
                    else {
                        if (full.STATUS_TRACKING == "INPUT DATA") {
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified User" onclick="upd_status_tracking(\'' + full.ID_TRIPARTITE + '\',\'' + 2 + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else if (full.STATUS_TRACKING == "VERIFIED BY USER") {

                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';
                            if (newRoleUser[0] == "ROLE_DM_ENERGI" || newRoleUser[0] == "ROLE_DM_KEUKON_APLN" || newRoleUser[0] == "ROLE_DM_PENGUSAHAAN" || newRoleUser[0] == "ROLE_ADMIN") {
                                ret_value = ret_value + '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DM" onclick="upd_status_tracking(\'' + full.ID_TRIPARTITE + '\',\'' + 3 + '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_TRIPARTITE+'\',\'' +2+ '\')"><i class="fa fa-arrow-left"></i></button>';
                            }
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else if (full.STATUS_TRACKING == "VERIFIED BY DM" && full.UPDATE_BY == "dmkeukonap") {

                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';
                                if (newRoleUser[0] == "ROLE_MS_KEUKON" || newRoleUser[0] == "ROLE_ADMIN") {
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MS Keukon" onclick="upd_status_tracking(\'' + full.ID_TRIPARTITE + '\',\'' + 8 + '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_TRIPARTITE+'\',\'' +3+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>';
                                }
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else if (full.UPDATE_BY !== "dmkeukonap" && full.STATUS_TRACKING == "VERIFIED BY DM" || full.STATUS_TRACKING == "VERIFIED BY MS KEUKON") {

                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';

                            if(newRoleUser[0] == "ROLE_DM_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DM Pembelanjaan" onclick="upd_status_tracking(\'' + full.ID_TRIPARTITE + '\',\'' + 4 + '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_TRIPARTITE+'\',\'' +3+ '\')"><i class="fa fa-arrow-left"></i></button>';
                            }
                            if(newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>';
                            }
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else if (full.STATUS_TRACKING == "VERIFIED BY DM PEMBELANJAAN") {
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';
                            if(newRoleUser[0] == "ROLE_MS_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Approve MS" onclick="upd_status_tracking(\'' + full.ID_TRIPARTITE + '\',\'' + 5 + '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_TRIPARTITE+'\',\'' +4+ '\')"><i class="fa fa-arrow-left"></i></button>';
                            }
                            if(newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>';
                            }
                                ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else if (full.STATUS_TRACKING == "APPROVE BY MS") {

                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';
                            if(newRoleUser[0] == "ROLE_ADMIN" || role.includes("KADIV")){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' + full.ID_TRIPARTITE + '\',\'' + 10 + '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_TRIPARTITE+'\',\'' +5+ '\')"><i class="fa fa-arrow-left"></i></button>';
                            }
                            if(newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>';
                            }
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else if (full.STATUS_TRACKING == "APPROVE BY KADIV"){
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-clone"></i></button>';
                            var role = newRoleUser[0];
                            if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" id="option-lunas" class="btn-lunas btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_TRIPARTITE+'\',\'' +7+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_TRIPARTITE+'\',\'' +10+ '\')"><i class="fa fa-arrow-left"></i></button>';
                            }
                            if(newRoleUser[0] == "ROLE_ADMIN"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-pencil"></i></button>';
                            }
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>'
                        }
                        else {
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-close"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-success" title="Upload" onclick="upload_file(\'' + full.ID_TRIPARTITE + '\')"><i class="fa fa-upload"></i></button>' +
                                '</div>'
                        }
                    }

                    return ret_value;

                }

            }, {
                "aTargets": [27],
                "mRender": function (data, type, full) {
                    var ret_value =
                        '';

                    if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                        return ""
                    } else {
                        if (full.STATUS_TRACKING == "INPUT DATA") {
                            ret_value = '<input class="cb" type="checkbox" data-value=\'{"2" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';

                        }
                        else if (full.STATUS_TRACKING == "VERIFIED BY USER") {

                            if (newRoleUser[0] == "ROLE_DM_ENERGI" || newRoleUser[0] == "ROLE_DM_KEUKON_APLN" || newRoleUser[0] == "ROLE_DM_PENGUSAHAAN" || newRoleUser[0] == "ROLE_ADMIN") {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"3" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            } else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            }
                        }
                        else if (full.STATUS_TRACKING == "VERIFIED BY DM" && full.UPDATE_BY == "dmkeukonap" || full.UPDATE_BY == "dmkeukonslap") {

                            if (newRoleUser[0] == "ROLE_MS_KEUKON" || newRoleUser[0] == "ROLE_ADMIN") {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"8" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            } else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            }
                        }
                        else if (full.UPDATE_BY == "dmkeukonslap" && full.STATUS_TRACKING == "VERIFIED BY DM"
                            || full.UPDATE_BY !== "dmkeukonap" && full.STATUS_TRACKING == "VERIFIED BY DM"
                            || full.STATUS_TRACKING == "VERIFIED BY MS KEUKON") {
                            if (newRoleUser[0] == "ROLE_DM_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN") {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"4" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            } else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            }
                        }
                        else if (full.STATUS_TRACKING == "VERIFIED BY DM PEMBELANJAAN") {

                            if (newRoleUser[0] == "ROLE_MS_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN") {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"5" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            } else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            }
                        }
                        else if (full.STATUS_TRACKING == "APPROVE BY MS"){

                            if(newRoleUser[0] == "ROLE_ADMIN" || role.includes("KADIV")){
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"10" : "'+full.ID_TRIPARTITE+'"}\' id="cbcheckbox">';
                            }else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_TRIPARTITE+'"}\' id="cbcheckbox">';
                            }
                        }
                        else if (full.STATUS_TRACKING == "APPROVE BY KADIV") {
                            var role = newRoleUser[0];

                            if (role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN") {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"7" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            } else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox">';
                            }
                        }
                        else {
                            ret_value = '<input class="cb" type="checkbox" data-value=\'{"0" : "' + full.ID_TRIPARTITE + '"}\' id="cbcheckbox" enabled="false">';
                        }
                    }
                    return ret_value;
                }

            }
        ],
        "ajax": {
            "url": baseUrl + "api_operator/tripartite/get_data",
            "type": "GET",
            "dataType": "json",
            "data": {
                pTglAwal: pTglAwal,
                pTglAkhir: pTglAkhir,
                pBank: pBank,
                pJenisPembayaran: pJenisPembayaran
            },
            "dataSrc": function (res) {
                hideLoadingCss("")
                console.log("get log : ", res);
                return res.data;
            }
        },
        "drawCallback": function (settings) {
            // $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');

            $("#option-lunas").hide();
            $("#option-input").hide();
            $("#option-siap").hide();
            if (newRoleUser.length > 0) {
                for (var i = 0; i < newRoleUser.length; i++) {
                    if (newRoleUser[i] == "ROLE_KASIR" || newRoleUser[i] == "ROLE_KASIR_IDR" || newRoleUser[i] == "ROLE_KASIR_INVESTASI") {
                        $(".btn-update-status").show();
                        $("#option-lunas").show();
                        $("#option-input").show();
                    } else if (newRoleUser[i] == "ROLE_ADMIN") {
                        $("#option-lunas").show();
                        $("#option-siap").show();
                        $("#option-input").show();
                    } else {
                        $("#option-siap").show();
                    }
                }
            }
        }
    });
    // $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    table_trepartite.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });

    $('.dataTables_filter').each(function () {
        $(this).append('<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' +
            '<button class="btn btn-verified btn-danger btn-sm" id="btn-hapus" style="margin-left: 10px" type="button" onclick="delete_datas()"><i class="fa fa-close"></i></button>'+
            '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fa fa-pencil"></i></button>');
    });

    initCbparent();
}

function reverse(idTripartite, statusInvoice) {
    var ket = $("#pKeterangan").val();
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
            pIdValas: idTripartite,
            pStatusInvoice: statusInvoice,
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

function update_datas() {
    var id = $("#table-trepartite input[type=checkbox]:checked").map(function () {
        return $(this).data("value");
    }).get();
    var obj = new Object();
    obj = id;
    console.log("obj", obj);
    console.log("id", id.toString());
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/multi_upd_status",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(obj),
            // pStatusInvoice: statusInvoice,
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_status :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
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

function delete_datas() {
    var id = $("#table-trepartite input[type=checkbox]:checked").map(function () {
        return $(this).data("value");
    }).get();
    var obj = new Object();
    obj = id;
    console.log("id", id.toString());
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/multi_del_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(obj),
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_status :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
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

function upload_file(pIdValas) {
    $("#modal-upload-file").modal("show");
    $("#temp-id-valas-file").val(pIdValas);
    getFiles(pIdValas);
    console.log("this id > ", pIdValas);

}

function upd_status_tracking(idTripartite, pStatusinvoice) {
    showLoadingCss();
    console.log("idvalas :", idTripartite);
    console.log("satusinvoice :", pStatusinvoice);
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/upd_status",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idTripartite,
            pStatusInvoice: pStatusinvoice,
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_status :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
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

function getFiles(pIdValas) {
    $.ajax({
        url: baseUrl + "api_operator/tripartite/get_files_tripartite",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdValas: pIdValas
        },
        success: function (data) {
            console.log("get files tripartite  : ", data);
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
            $("#btn-download-nota-dinas-pembayaran").empty();
            $.each(data.data_pembayaran.return, function (index, val) {
                if (val.JENIS_FILE == null || val.JENIS_FILE == "") {
                    var html1 = '<a id="btn-download-tanda-terima-invoice">-</a>';
                    var html2 = '<a id="btn-download-lembar-verifikasi">-</a>';
                    var html3 = '<a id="btn-download-file-tagihan">-</a>';
                    var html4 = '<a id="btn-download-nota-dinas-pembayaran">-</a>';
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

    if (jenisFile == "1") {
        formData.append('file', $('input[type=file]#file-tanda-terima-invoice')[0].files[0]);
        fileSize = $('input[type=file]#file-tanda-terima-invoice')[0].files[0].size / 1000;
        $("#file-tanda-terima-invoice").val('');
    } else if (jenisFile == "2") {
        formData.append('file', $('input[type=file]#file-lembar-verifikasi')[0].files[0]);
        fileSize = $('input[type=file]#file-lembar-verifikasi')[0].files[0].size / 1000;
        $("#file-lembar-verifikasi").val('');
    } else if (jenisFile == "3") {
        formData.append('file', $('input[type=file]#file-tagihan')[0].files[0]);
        fileSize = $('input[type=file]#file-tagihan')[0].files[0].size / 1000;
        $("#file-tagihan").val('');
    } else {
        formData.append('file', $('input[type=file]#file-nota-dinas-pembayaran')[0].files[0]);
        fileSize = $('input[type=file]#file-nota-dinas-pembayaran')[0].files[0].size / 1000;
        $("#file-nota-dinas-pembayaran").val('');
    }

    formData.append('pIdValas', $("#temp-id-valas-file").val());
    formData.append('pJenisFile', jenisFile);
    formData.append('pFileSize', fileSize);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/tripartite/upload_files_tripartite",
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
                getFiles($("#temp-id-valas-file").val());
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

function show_modal(id) {
    idTripartite = id;
    $('#edit-reverse-modal').modal({backdrop: 'static', keyboard: false});
}

function update_status() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/upd_status",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idTripartite,
            pStatusInvoice: $("#pStatusInvoice").val(),
            pDeskripsi: $("#pKeteranganStatus").val(),
        },
        success: function (res) {
            hideLoadingCss("")
            var result = res.return.split(";")[0];
            if (result == 1 || result == '1') {
                alert(res.OUT_MSG);
                window.location.reload(true);
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function upload_xls(pIdValas) {
    $("#modal-upload-xls").modal("show");
}

function upload_server_xls(jenisFile) {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    fileSize = $('input[type=file]#file-xls')[0].files[0].size / 1000;
    $("#file-xls").val('');

    console.log(formData);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/tripartite/upload_xls",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            console.log("res", res);
            if (res.V_RETURN == 0) {
                alert("sukses");
//                location.reload();
                search("load");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_operator/tripartite/download/" + obj["ID_UPLOAD"];
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function  initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        $('input:checkbox').not(this).prop('checked', this.checked);
    });
}

function openMultipleEditForm(){
    setSelectBank("pNewBankCounterparty", "", "PEMBAYAR", "", "REKAP");
    $('#pNewTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
}

function multipleUpdate() {
    var id= $("#table-trepartite input[type=checkbox]:checked").map(function() {
        return $(this).data("value");
    }).get();
    var obj = new Object();
    obj = id;
    console.log("obj", obj);
    console.log("id bank pembayar ",$("#pNewBankCounterparty").val());
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/multiple_edit",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(obj),
            pTglJatuhTempo: $("#pNewTglJatuhTempo").val(),
            pBankPembayar: $("#pNewBankCounterparty").val()
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_status :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
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