/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_rekapitulasi;
var idValas = "";
var allData;
var tempVendor = "";
var tempTipeTransaksi = "";
var tempNilaiTagihan = "";
var tempCurrency = "";
var tempUnitAnggaran = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;
$(document).ready(function () {
    // $( '#pNilaiTagihan' ).mask('000.000.000.000.000', {reverse: true});
    // $( '#pSisaAnggaran' ).mask('000.000.000.000.000', {reverse: true});
    $('#pTglTerimaInvoice').datepicker({dateFormat: 'dd/mm/yy', maxDate: new Date()});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#pVendor').select2({
        width: '100%'
    });
    $('#pJenisPemabayaran').select2({
        width: '100%'
    });
    $('#pUnitPenerima').select2({
        width: '100%'
    });
    $('#pBankTujuan').select2({
        width: '100%'
    });

    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectJenisPembayaran("cmb_jenis_pemabayaran", "FILTER", "");
    setSelectStatus("cmb_status");
    setSelectStatusTracking("cmb_status_tracking");
    setSelectJenisTagihan("pJenisTagihan");
    setNominalSetelahPajak();
//    setSisaAnggaran();
    search("load");
    siap();
    inputKeterangan();
    $('#check_all').change(function() {
        if($(this).is(':checked')){
            checkColumn(true);
        } else {
            checkColumn(false);
        }
    });

});

function setNominalSetelahPajak() {
    $('#pPajak, #pNominalSebelumPajak').bind('keyup paste change', function () {
        var pPajak = $('#pPajak').val() || 0,
            pNominalSebelumPajak = $('#pNominalSebelumPajak').val() || 0;
        var pNominalSetelahPajak = pNominalSebelumPajak - (pPajak * pNominalSebelumPajak / 100);
        $('#pNominalSetelahPajak').val(pNominalSetelahPajak);
    });
}

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

function selectJenisPembayaran(value) {
    $("#pUnitPenerima").select2("val", "");
    $("#pVendor").select2("val", "");
    setSelectVendor("pVendor", value, tempVendor);
    setSelectUnit("pUnitPenerima", value, tempUnit);
}

function selectStatus(value) {
    if (value != 1) {
        $("#pTglJatuhTempo").prop('disabled', false);
    } else {
        $("#pTglJatuhTempo").prop('disabled', true);
        $("#pTglJatuhTempo").val("");
    }
}

function duplicate_data(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdValas: id,
        },
        success: function (res) {
            hideLoadingCss("")
            idValas = "";
            $("#pTglJatuhTempo").val("");
            $("#pNilaiTagihan").val("");
            $("#pNoTagihan").val("");
            $("#pTglTagihan").val("");
            $("#pNoNotaDinas").val("");
            $("#pTglNotaDinas").val("");
            $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
            $('#pTglTagihan').datepicker({dateFormat: 'dd/mm/yy'});
            $('#pTglNotaDinas').datepicker({dateFormat: 'dd/mm/yy'});

            tempVendor = res[0].ID_VENDOR;
            tempUnit = res[0].ID_UNIT;


            setSelectJenisPembayaran("pJenisPemabayaran", "", res[0].ID_JENIS_PEMBAYARAN);
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "REKAP");
            setSelectBank2("pBankTujuan", "", "TUJUAN", res[0].KODE_BANK_TUJUAN, "REKAP");
            setSelectBank("pBankPembayar", "", "PEMBAYAR", res[0].KODE_BANK_PEMBAYAR, "REKAP");
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $("#pNilaiTagihan").val(res[0].TOTAL_TAGIHAN);
            $("#pNoTagihan").val(res[0].NO_TAGIHAN);
            $("#pTglTagihan").val(res[0].TGL_TAGIHAN);
            $("#pNoNotaDinas").val(res[0].NO_NOTDIN);
            $("#pTglNotaDinas").val(res[0].TGL_NOTDIN);
            $("#pKeterangan").val(res[0].DESKRIPSI);
            $("#pStatus").val(res[0].STATUS_VALAS);
            $("#pTipeTransaksi").val(res[0].TIPE_TRANSAKSI);
            $("#pTglTerimaInvoice").val(res[0].TGL_TERIMA_INVOICE);
            $("#pNominalSebelumPajak").val(res[0].NOMINAL_SBLM_PAJAK);
            $("#pNominalUnderlying").val(res[0].NOMINAL_UNDERLYING);
            $("#pPajak").val(res[0].PAJAK);
            $("#pNominalTanpaUnderlying").val(res[0].NOMINAL_TANPA_UNDERLYING);
            $("#pKursJisdor").val(res[0].KURS_JISDOR);
            $("#pSpread").val(res[0].SPREAD);
            $("#pJenisTagihan").val(res[0].JENIS_TAGIHAN.toLowerCase());
            $('#pTglJatuhTempo').prop('disabled', false);
            if(newRoleUser[0].replace(" ", "")== "ROLE_OSS"){
                $('#pTglJatuhTempo').prop('disabled', true);
            }
            setTimeout(function () {
                $("#pVendor").select2({
                    width: "100%"
                });
                $("#pUnitPenerima").select2({
                    width: "100%"
                });

                $('#edit-rekap-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function openFormNew() {

    idValas = "";
    $("#pTglJatuhTempo").val("");
    $("#pNilaiTagihan").val("");
    $("#pNoTagihan").val("");
    $("#pTglTagihan").val("");
    $("#pNoNotaDinas").val("");
    $("#pTglNotaDinas").val("");
    $("#pTglTerimaInvoice").val("");
    $("#pKeterangan").val("");
    $("#pCurrecny").val("");
    $("#pBankPembayar").val("");
    $("#pTipeTransaksi").val("");
    $("#pNominalSebelumPajak").val("");
    $("#pNominalUnderlying").val("");
    $("#pPajak").val("");
    $("#pNominalTanpaUnderlying").val("");
    $("#pKursJisdor").val("");
    $("#pSpread").val("");
    $("#pBankTujuan").select2("val", "");
    $("#pJenisPemabayaran").select2("val", "");
    $("#pUnitPenerima").select2("val", "");
    $("#pVendor").select2("val", "");

    var date = new Date();
    if(newRoleUser[0].replace(" ", "")!= "ROLE_ADMIN"){
        date.setDate(date.getDate() + addedDays);
    }

    $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: date});

    $('#pTglTagihan').datepicker({dateFormat: 'dd/mm/yy'});
    $('#pTglNotaDinas').datepicker({dateFormat: 'dd/mm/yy'});
    setSelectJenisPembayaran("pJenisPemabayaran", "", "");
    setSelectCurr("pCurrecny", "", "", "REKAP");
    setSelectBank2("pBankTujuan", "", "TUJUAN", "", "REKAP");
    setSelectBank("pBankPembayar", "", "PEMBAYAR", "", "REKAP");

    $('#pTglJatuhTempo').prop('disabled', false);
    if(newRoleUser[0].replace(" ", "")== "ROLE_OSS"){
        $('#pTglJatuhTempo').prop('disabled', true);
    }

    $('#edit-rekap-modal').modal({backdrop: 'static', keyboard: false});

}

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/pembayaran/delete_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdValas: id
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
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

function siap() {
    var a = localStorage.getItem("real_no_tagihan_RD");
    if (a === null) {
        return null;
    } else {
        var c = a.split(",");
        var pilihan = '';
        for (var i = 0; i < c.length; i++) {
            pilihan += '<option value="' + c[i] + '" />';
        }

        if (c[0] == "null") {
            localStorage.removeItem("real_no_tagihan_RD");
            localStorage.removeItem("NT");

        } else {
            document.getElementById('data-no-tagihan').innerHTML = pilihan;

        }
    }
}

function inputKeterangan() {

    var ket = localStorage.getItem("real_ket");
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
            localStorage.removeItem("real_ket");
            localStorage.removeItem("KET");
        } else {
            document.getElementById("data-keterangan").innerHTML = option;
        }
    }
}

function ins_data() {
    var no_ta = $("#pNoTagihan").val().toString();
    var old_data = localStorage.getItem("real_no_tagihan_RD");
    var all_val = [];

    if (old_data == null) {
        localStorage.removeItem("real_no_tagihan_RD");
        localStorage.removeItem("NT");
        localStorage.setItem("NT", no_ta);
        all_val.push(no_ta);
        localStorage.setItem("real_no_tagihan_RD", all_val);

    }
    else {
        localStorage.setItem("NT", no_ta);

        all_val.push(old_data);
        all_val.push(no_ta);
        var c = old_data.split(",");
        for (var i = 0; i < c.length; i++) {
            if (no_ta !== c[i]) {
                localStorage.setItem("real_no_tagihan_RD", all_val);
            }
        }
    }

    var ket = $("#pKeterangan").val().toString();
    var all_ket = [];
    var ket_lama = localStorage.getItem("real_ket");

    if (ket_lama == null) {
        localStorage.removeItem("real_ket");
        localStorage.removeItem("KET");
        localStorage.setItem("KET", ket);

        all_ket.push(ket);
        localStorage.setItem("real_ket", all_ket);
    }
    else {
        localStorage.setItem("KET", ket);

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
        localStorage.setItem("real_ket", list_keterangan_lama);
    }

    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/ins_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idValas,
            pJenisPembayaran: $("#pJenisPemabayaran").val(),
            pTglJatuhTempo: $("#pTglJatuhTempo").val(),
            pVendor: $("#pVendor").val(),
            pCurr: $("#pCurrecny").val(),
            pNilaiTagihan: $("#pNilaiTagihan").val(),
            pBankTujuan: $("#pBankTujuan").val(),
            pBankPembayar: $("#pBankPembayar").val(),
            pUnitPenerima: $("#pUnitPenerima").val(),
            pNoTagihan: $("#pNoTagihan").val(),
            pTglTagihan: $("#pTglTagihan").val(),
            pNoNotdin: $("#pNoNotaDinas").val(),
            pTglNotdin: $("#pTglNotaDinas").val(),
            pStatusValas: $("#pStatus").val(),
            pKeterangan: $("#pKeterangan").val(),
            pTipeTransaksi: $("#pTipeTransaksi").val(),
            pTglTerimaInvoice: $("#pTglTerimaInvoice").val(),
            pNominalSblmPajak: $("#pNominalSebelumPajak").val(),
            pNominalUnderlying: $("#pNominalUnderlying").val(),
            pPajak: $("#pPajak").val(),
            pNominalTanpaUnderlying: $("#pNominalTanpaUnderlying").val(),
            pKursJisdor: $("#pKursJisdor").val(),
            pSpread: $("#pSpread").val(),
            pJenisTagihan: $("#pJenisTagihan").val()
        },
        success: function (res) {
            hideLoadingCss("")
            var result = res.return.split(";")[0];
            if (result == 1 || result == '1') {
                alert(res.OUT_MSG);
                search("load");
                $('#edit-rekap-modal').modal('hide');
                table_rekapitulasi.ajax.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function edit_data(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdValas: id
        },
        success: function (res) {
            hideLoadingCss("")
            idValas = id;
            $("#pTglJatuhTempo").val("");
            $("#pNilaiTagihan").val("");
            $("#pNoTagihan").val("");
            $("#pTglTagihan").val("");
            $("#pNoNotaDinas").val("");
            $("#pTglNotaDinas").val("");
            $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
            $('#pTglTagihan').datepicker({dateFormat: 'dd/mm/yy'});
            $('#pTglNotaDinas').datepicker({dateFormat: 'dd/mm/yy'});

            tempVendor = res[0].ID_VENDOR;
            tempUnit = res[0].ID_UNIT;

            setSelectJenisPembayaran("pJenisPemabayaran", "", res[0].ID_JENIS_PEMBAYARAN);
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "REKAP");
            setSelectBank2("pBankTujuan", "", "TUJUAN", res[0].KODE_BANK_TUJUAN, "REKAP");
            setSelectBank("pBankPembayar", "", "PEMBAYAR", res[0].KODE_BANK_PEMBAYAR, "REKAP");
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $("#pNilaiTagihan").val(res[0].TOTAL_TAGIHAN);
            $("#pNoTagihan").val(res[0].NO_TAGIHAN);
            $("#pTglTagihan").val(res[0].TGL_TAGIHAN);
            $("#pNoNotaDinas").val(res[0].NO_NOTDIN);
            $("#pTglNotaDinas").val(res[0].TGL_NOTDIN);
            $("#pKeterangan").val(res[0].DESKRIPSI);
            $("#pStatus").val(res[0].STATUS_VALAS);
            $("#pTipeTransaksi").val(res[0].TIPE_TRANSAKSI);
            $("#pTglTerimaInvoice").val(res[0].TGL_TERIMA_INVOICE);
            $("#pNominalSebelumPajak").val(res[0].NOMINAL_SBLM_PAJAK);
            $("#pNominalUnderlying").val(res[0].NOMINAL_UNDERLYING);
            $("#pPajak").val(res[0].PAJAK);
            $("#pNominalTanpaUnderlying").val(res[0].NOMINAL_TANPA_UNDERLYING);
            $("#pKursJisdor").val(res[0].KURS_JISDOR);
            $("#pSpread").val(res[0].SPREAD);
            $("#pJenisTagihan").val(res[0].JENIS_TAGIHAN.toLowerCase());
            if(newRoleUser[0].replace(" ", "")== "ROLE_OSS"){
                $('#pTglJatuhTempo').prop('disabled', true);
            }
            setTimeout(function () {
                $("#pVendor").select2({
                    width: "100%"
                });
                $("#pUnitPenerima").select2({
                    width: "100%"
                });
                $('#edit-rekap-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
            hideLoadingCss()

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function update_status() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/upd_status",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idValas,
            pStatusInvoice: $("#pStatusInvoice").val(),
            pDeskripsi: $("#pKeteranganStatus").val(),
        },
        success: function (res) {
            hideLoadingCss("")
            var result = res.return.split(";")[0];
            if (result == 1 || result == '1') {
                alert(res.OUT_MSG);
                table_rekapitulasi.ajax.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

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

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_all_pembayaran",
        dataType: 'JSON',
        type: "GET",
        data: {
            pStatusValas: "0",
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pCurr: $("#cmb_currecny").val(),
            pPembayaran: $("#cmb_jenis_pemabayaran").val()
        },
        success: function (res) {
            allData = res;
        },
        error: function (res) {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
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
    window.open(baseUrl + "api_operator/pembayaran/xls/0/" + tglAwal.replace(/\//g, "-") + "/" + tglAkhir.replace(/\//g, "-") + "/" + $("#cmb_bank").val() + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_jenis_pemabayaran").val());
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
        text: "TGL. TERIMA TAGIHAN",
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
        text: "TGL. PEMBAYARAN",
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
    column.push({
        text: "NOMINAL SBLM PAJAK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PAJAK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL STLH PAJAK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL UNDERLYING",
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
        text: "JENIS TAGIHAN",
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
            STATUS_TRACKING: v.STATUS_TRACKING,
            NOMINAL_SBLM_PAJAK : v.NOMINAL_SBLM_PAJAK,
            PAJAK : v.PAJAK,
            NOMINAL_STLH_PAJAK : v.NOMINAL_STLH_PAJAK,
            NOMINAL_UNDERLYING : v.NOMINAL_UNDERLYING,
            NOMINAL_TANPA_UNDERLYING : v.NOMINAL_TANPA_UNDERLYING,
            KURS_JISDOR : v.KURS_JISDOR,
            SPREAD : v.SPREAD,
            KURS_TRANSAKSI : v.KURS_TRANSAKSI,
            NOMINAL_PEMBAYARAN_IDR : v.NOMINAL_PEMBAYARAN_IDR,
            JENIS_TAGIHAN : v.JENIS_TAGIHAN,
            CREATE_DATE : v.CREATE_DATE,
            UPDATE_DATE : v.UPDATE_DATE,
            DESKRIPSI : v.DESKRIPSI,
            JENIS_TAGIHAN: v.JENIS_TAGIHAN,
        }
        externalDataRetrievedFromServer.push(helloooow)
    });


    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            dataRow.push(row["NO"]);
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push(row["VENDOR"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push({text: row["NILAI_TAGIHAN"], alignment: "right"});
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
            dataRow.push(row["NOMINAL_SBLM_PAJAK"]);
            dataRow.push(row["PAJAK"]);
            dataRow.push(row["NOMINAL_STLH_PAJAK"]);
            dataRow.push(row["NOMINAL_UNDERLYING"]);
            dataRow.push(row["NOMINAL_TANPA_UNDERLYING"]);
            dataRow.push(row["KURS_JISDOR"]);
            dataRow.push(row["SPREAD"]);
            dataRow.push(row["KURS_TRANSAKSI"]);
            dataRow.push(row["NOMINAL_PEMBAYARAN_IDR"]);
            dataRow.push(row["JENIS_TAGIHAN"]);
            dataRow.push(row["CREATE_DATE"]);
            dataRow.push(row["UPDATE_DATE"]);
            dataRow.push(row["DESKRIPSI"]);
            dataRow.push(row["JENIS_TAGIHAN"]);
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
            text: "REKAPITULASI DATA",
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

function show_modal(id) {
    idValas = id;
    $('#edit-reverse-modal').modal({backdrop: 'static', keyboard: false});
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, statusTracking) {
    showLoadingCss();
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();

    table_rekapitulasi = $('#table-rekapitulasi').DataTable({
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
                {width: 20, targets: 0},
                {width: 100, targets: 1},
                {width: 100, targets: 2},
                {width: 100, targets: 3},
                {width: 100, targets: 4},
                {width: 100, targets: 5},
                {width: 100, targets: 6},
                {width: 100, targets: 7},
                {width: 100, targets: 8},
                {width: 100, targets: 9},
                {width: 100, targets: 10},
                {width: 100, targets: 11},
                {width: 100, targets: 12},
                {width: 100, targets: 13},
                {width: 100, targets: 14},
                {width: 100, targets: 15},
                {width: 100, targets: 16},
                {width: 100, targets: 17},
                {width: 100, targets: 18},
                {width: 100, targets: 19},
                {width: 100, targets: 20},
                {width: 100, targets: 21},
                {width: 100, targets: 22},
                {width: 100, targets: 23},
                {width: 100, targets: 24},
                {width: 100, targets: 25},
                {width: 100, targets: 26},
                {width: 100, targets: 27},
                {width: 100, targets: 28},
                {width: 100, targets: 29},
                {width: 100, targets: 30},
                {width: 100, targets: 31},
                {width: "20%", "targets": 0},
                { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                {
                    "bSortable": true,
                    "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                },
                {
                    "sortable": false,
                    "aTargets": [0,28, 33]
                },
                {
                    "aTargets": [0],
                    "mRender": function (data, type, full) {
                        return full.ROW_NUMBER;
                    }

                },
                {
                    "aTargets": [1],
                    "mRender": function (data, type, full) {
                        return full.JENIS_TAGIHAN;
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return full.ID_VALAS;
                    }

                },
                {
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return full.ID_JENIS_PEMBAYARAN;
                    }

                },
                {
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return full.TGL_JATUH_TEMPO;
                    }

                },
                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return full.ID_VENDOR;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return full.CURRENCY;
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.TOTAL_TAGIHAN,2,".",",");
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return full.ID_UNIT;
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return full.KODE_BANK_TUJUAN;
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return full.KODE_BANK_PEMBAYAR;
                    }

                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return full.TGL_TERIMA_INVOICE;
                    }

                },
                {
                    "aTargets": [12],
                    "mRender": function (data, type, full) {
                        return full.TGL_TAGIHAN;
                    }

                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        return full.NO_TAGIHAN;
                    }

                },
                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                        return full.TGL_NOTDIN;
                    }

                },
                {
                    "aTargets": [15],
                    "mRender": function (data, type, full) {
                        return full.NO_NOTDIN;
                    }

                },
                {
                    "aTargets": [16],
                    "visible": false,
                    "mRender": function (data, type, full) {
                        //return full.TGL_LUNAS;
                        return "";
                    }
                },
                {
                    "aTargets": [17],
                    "mRender": function (data, type, full) {
                        return full.COUNT_DOWN;
                    }
                },
                {
                    "aTargets": [18],
                    "mRender": function (data, type, full) {
                        return full.STATUS_VALAS;
                    }
                },
                {
                    "aTargets": [19],
                    "mRender": function (data, type, full) {
                        return full.TIPE_TRANSAKSI;
                    }
                },
                {
                    "aTargets": [20],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_SBLM_PAJAK,2,".",",");
                    }
                },
                {
                    "aTargets": [21],
                    "mRender": function (data, type, full) {
                        return full.PAJAK + "%";
                    }
                },
                {
                    "aTargets": [22],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_STLH_PAJAK,2,".",",");
                    }
                },
                {
                    "aTargets": [23],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_UNDERLYING,2,".",",");
                    }
                },
                {
                    "aTargets": [24],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_TANPA_UNDERLYING,2,".",",");

                    }
                },
                {
                    "aTargets": [25],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.KURS_JISDOR,2,".",",");
                    }
                },
                {
                    "aTargets": [26],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.SPREAD,2,".",",");
                    }
                },
                {
                    "aTargets": [27],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.KURS_TRANSAKSI,2,".",",");
                    }
                },
                {
                    "aTargets": [28],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_PEMBAYARAN_IDR,2,".",",");
                    }
                },
                {
                    "aTargets": [29],
                    "mRender": function (data, type, full) {
                        return full.CREATE_DATE;
                    }
                },
                {
                    "aTargets": [30],
                    "mRender": function (data, type, full) {
                        return full.UPDATE_DATE;
                    }
                },

                {
                    "aTargets": [31],
                    "mRender": function (data, type, full) {
                        return full.STATUS_TRACKING;
                    }

                },
                {
                    "aTargets": [32],
                    "mRender": function (data, type, full) {
                        return full.DESKRIPSI;
                    }
                },
                {
                    "aTargets": [33],
                    "mRender": function (data, type, full) {
                        var ret_value;
                        /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                        /*    if(newRoleUser[0].includes("DIVKEU")){
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                    '</div>'
                            } */
                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else if(newRoleUser[0] == "ROLE_OSS" ){
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                            if(full.STATUS_TRACKING == "INPUT DATA"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                            }
                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>';
                        }else {

                            if (full.STATUS_TRACKING == "INPUT DATA") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_POWER_PURCHASE_LEASING" || newRoleUser[0] == "ROLE_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_OPERATION" || newRoleUser[0] == "PAYMENT" || newRoleUser[0] == "INVESTMENT_I" || newRoleUser[0] == "INVESTMENT_II" || newRoleUser[0] == "CENTRALIZED_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Staff" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +2+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +2+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                '</div>'

                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {
                                ret_value =
                                    '<div class="btn-group">';
                                if(full.UPDATE_BY =='payment' && newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 2 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN"){
                                    ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +6+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +6+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }'</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Investment" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER"){
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){

                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Operation" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Operation" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(full.EQ_IDR > "25000000000") {
                                    if (role == "ROLE_ADMIN" || role == "ROLE_EXECUTIVE_VICE_PRESIDENT" ) {

                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 6 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>';

                                    }
                                    if (newRoleUser[0] == "ROLE_DIVKEU") {
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>';
                                    }
                                }
                                else{
                                    if(role == "ROLE_ADMIN") {

                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                    }
                                    if(role.includes("KASIR")){
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                    }
                                    if(newRoleUser[0] == "ROLE_DIVKEU"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                    }
                                }
                                '</div>'
                            }

                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT") {

                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(full.EQ_IDR > "25000000000"){
                                    if(role == "ROLE_ADMIN"||role == "ROLE_EXECUTIVE_VICE_PRESIDENT") {
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +10+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 6 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                    }
                                }
                                else{
                                    if(role == "ROLE_ADMIN") {
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                    }
                                    if(role.includes("KASIR")){
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                    }
                                    if(newRoleUser[0] == "ROLE_DIVKEU"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                    }
                                }
                                '</div>'
                            }

                            else if (full.STATUS_TRACKING == "VERIFIED BY EVP") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(role.includes("KASIR")) {
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" id="option-lunas" class="btn-lunas btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' + full.ID_VALAS + '\',\'' + 7 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            /*else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR > "25000000000"){
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                var role = newRoleUser[0];
                                if(newRoleUser[0] == "ROLE_ADMIN" || role.includes("KADIV")){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +10+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +5+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                }

                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                                }
                                ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                    '</div>'
                            } */
                            else {
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                    '</div>'
                            }
                        }
                        return ret_value;
                    }

                },
                {
                    "aTargets": [34],
                    "mRender": function (data, type, full) {
                        var value = new Object();
                        var ret_value = ''

                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else {
                            if (full.STATUS_TRACKING == "INPUT DATA") {
                                value = '{"2":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';

                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {

                                if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    value = '{"3":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {

                                if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN" || newRoleUser[0] == "ROLE_ADMIN"){
                                    value = '{"6":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){

                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT" || newRoleUser[0] == "ROLE_ADMIN"){
                                    value = '{"8":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }

                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){

                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION" || newRoleUser[0] == "ROLE_ADMIN"){
                                    value = '{"5":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR > "25000000000"){
                                if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                    value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR > "25000000000"){
                                if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                    value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
                                var role = newRoleUser[0];

                                if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                    value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
                                var role = newRoleUser[0];

                                if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                    value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }else {
                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                }
                            }
                            else {
                                value = '{"0":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                            }
                        }

                        for (x=0; x<checkedArray.length;x++){
                            if(JSON.stringify(checkedArray[x]) === value){
                                return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox' checked>";
                            }
                        }
                        return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                    }
                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/pembayaran/rekap_belum",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            pTglAwal: pTglAwal,
                            pTglAkhir:
                            pTglAkhir,
                            pBank:
                            pBank,
                            pCurrency:
                            pCurrency,
                            pPembayaran:
                            pPembayaran,
                            status: $("#cmb_status").val(),
                            statusTracking: statusTracking
                        }
                    ,
                    "dataSrc":

                        function (res) {
                            hideLoadingCss()
                            getTotalTagihan();
                            return res.data;
                        }
                }
            ,
            "drawCallback":
                function (settings) {
                    // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                    // $(".table ").css({"width":"100%"});
                    table_rekapitulasi.columns.adjust();
                    var currentPageNumber = this.api().page.info().page;
                    for (x=0;x<cbParentArray.length;x++){
                        if(cbParentArray[x] == currentPageNumber){
                            $("#cbparent").prop('checked', true);
                            break;
                        }
                        else{
                            $("#cbparent").prop('checked', false);
                        }
                    }
                    $('th').addClass('th-middle');
                    $(".btn-update-status").hide();
                    $(".btn-edit-data").hide();
                    $(".btn-delete-data").hide();
                    $("#btn-add-rekap").hide();

                    $("#option-lunas").hide();
                    $("#option-input").hide();
                    $("#option-siap").hide();
                    if (newRoleUser.length > 0) {
                        for (var i = 0; i < newRoleUser.length; i++) {
                            if (newRoleUser[i] == "ROLE_KASIR_IDR" || newRoleUser[i] == "ROLE_KASIR") {
                                $(".btn-update-status").show();
                                $("#option-lunas").show();
                                $("#option-input").show();
                            } else if (newRoleUser[i] == "ROLE_ADMIN") {
                                $(".btn-update-status").show();
                                $(".btn-edit-data").show();
                                $(".btn-delete-data").show();
                                $("#btn-add-rekap").show();
                                $("#option-lunas").show();
                                $("#option-siap").show();
                                $("#option-input").show();
                            } else {
                                $(".btn-update-status").show();
                                $(".btn-edit-data").show();
                                $(".btn-delete-data").show();
                                $("#btn-add-rekap").show();
                                $("#option-siap").show();
                            }
                        }
                    }
                },
            "initComplete": function(settings, json) {
                var api = this.api();
                $.ajax({
                    url: baseUrl + "api_operator/pembayaran/get_column",
                    dataType: 'JSON',
                    type: "GET",
                    success: function (res) {
                        var response = res.data[0];
                        if (response.NOMOR == 1) {
                            api.column(0).visible(true);
                        } else {
                            api.column(0).visible(false);
                        }
                        if (response.JENIS_TAGIHAN == 1) {
                            api.column(1).visible(true);
                        } else {
                            api.column(1).visible(false);
                        }
                        if (response.JENIS_PEMBAYARAN == 1) {
                            api.column(2).visible(true);
                        } else {
                            api.column(2).visible(false);
                        }
                        if (response.JATUH_TEMPO == 1) {
                            api.column(3).visible(true);
                        } else {
                            api.column(3).visible(false);
                        }
                        if (response.VENDOR == 1) {
                            api.column(4).visible(true);
                        } else {
                            api.column(4).visible(false);
                        }
                        if (response.CURRENCY == 1) {
                            api.column(5).visible(true);
                        } else {
                            api.column(5).visible(false);
                        }
                        if (response.NILAI_TAGIHAN == 1) {
                            api.column(6).visible(true);
                        } else {
                            api.column(6).visible(false);
                        }
                        if (response.NAMA_KONTRAK == 1) {
                            api.column(7).visible(true);
                        } else {
                            api.column(7).visible(false);
                        }
                        if (response.BANK_TUJUAN == 1) {
                            api.column(8).visible(true);
                        } else {
                            api.column(8).visible(false);
                        }
                        if (response.BANK_PEMBAYAR == 1) {
                            api.column(9).visible(true);
                        } else {
                            api.column(9).visible(false);
                        }
                        if (response.TGL_TERIMA_TAGIHAN == 1) {
                            api.column(10).visible(true);
                        } else {
                            api.column(10).visible(false);
                        }
                        if (response.TGL_TAGIHAN == 1) {
                            api.column(11).visible(true);
                        } else {
                            api.column(11).visible(false);
                        }
                        if (response.NO_TAGIHAN == 1) {
                            api.column(12).visible(true);
                        } else {
                            api.column(12).visible(false);
                        }
                        if (response.TGL_NOTA_DINAS == 1) {
                            api.column(13).visible(true);
                        } else {
                            api.column(13).visible(false);
                        }
                        if (response.NO_NOTA_DINAS == 1) {
                            api.column(14).visible(true);
                        } else {
                            api.column(14).visible(false);
                        }
                        if (response.TGL_PEMBAYARAN == 1) {
                            api.column(15).visible(false);
                        } else {
                            api.column(15).visible(false);
                        }
                        if (response.COUNTDOWN == 1) {
                            api.column(16).visible(true);
                        } else {
                            api.column(16).visible(false);
                        }
                        if (response.STATUS == 1) {
                            api.column(17).visible(true);
                        } else {
                            api.column(17).visible(false);
                        }
                        if (response.TIPE_TRANSAKSI == 1) {
                            api.column(18).visible(true);
                        } else {
                            api.column(18).visible(false);
                        }
                        if (response.NOMINAL_SBLM_PAJAK == 1) {
                            api.column(19).visible(true);
                        } else {
                            api.column(19).visible(false);
                        }
                        if (response.PAJAK == 1) {
                            api.column(20).visible(true);
                        } else {
                            api.column(20).visible(false);
                        }
                        if (response.NOMINAL_STLH_PAJAK == 1) {
                            api.column(21).visible(true);
                        } else {
                            api.column(21).visible(false);
                        }
                        if (response.NOMINAL_UNDERLYING == 1) {
                            api.column(22).visible(true);
                        } else {
                            api.column(22).visible(false);
                        }
                        if (response.NOMINAL_TANPA_UNDERLYING == 1) {
                            api.column(23).visible(true);
                        } else {
                            api.column(23).visible(false);
                        }
                        if (response.KURS_JISDOR == 1) {
                            api.column(24).visible(true);
                        } else {
                            api.column(24).visible(false);
                        }
                        if (response.SPREAD == 1) {
                            api.column(25).visible(true);
                        } else {
                            api.column(25).visible(false);
                        }
                        if (response.KURS_TRANSAKSI == 1) {
                            api.column(26).visible(true);
                        } else {
                            api.column(26).visible(false);
                        }
                        if (response.NOMINAL_PEMBAYARAN_IDR == 1) {
                            api.column(27).visible(true);
                        } else {
                            api.column(27).visible(false);
                        }
                        if (response.CREATE_DATE_TAGIHAN == 1) {
                            api.column(28).visible(true);
                        } else {
                            api.column(28).visible(false);
                        }
                        if (response.UPDATE_DATE_TAGIHAN == 1) {
                            api.column(29).visible(true);
                        } else {
                            api.column(29).visible(false);
                        }

                        if (response.STATUS_TAGIHAN == 1) {
                            api.column(30).visible(true);
                        } else {
                            api.column(30).visible(false);
                        }
                        if (response.KETERANGAN == 1) {
                            api.column(31).visible(true);
                        } else {
                            api.column(31).visible(false);
                        }

                    },
                    error: function () {
                        hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                    }
                });
            }
        }
    );
    table_rekapitulasi.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_length').each(function () {
        var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
        $(this).append(html);
    });

    $('.dataTables_filter').each(function () {
        // var html = '';
        var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
            '<i class="fa fa-arrows-alt"></i></button>';
        /*button reject*/
//        html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
//            '            <i class="fa fa-ban"></i></button>';
        html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fa fa-pencil"></i></button>';
        if(newRoleUser[0] == "ROLE_OSS"){

            html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';

        }
        if(newRoleUser[0] == "ROLE_ADMIN"){
                    html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
                    html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';

                }
        $(this).append(html);
    });

    table_rekapitulasi.columns.adjust();
    initCbparent();
}

function checkArray(e) {
    var isNew= true;
    if($(e).is(":checked")) {
        if(checkedArray.length == 0) {
            checkedArray.push($(e).data("value"));
        }else {
            for (x = 0; x < checkedArray.length; x++){
                var valArr = JSON.stringify(checkedArray[x]);
                var valCb = JSON.stringify($(e).data("value"));
                if(valArr == valCb){
                    isNew=false;
                    break;
                }
            }
            if(isNew == true){
                checkedArray.push($(e).data("value"));
            }
        }
    }
    else {
        var total = $("#table-rekapitulasi input[type=checkbox]:checked").map(function () {
            return $(this).data("value");
        }).get().length;
        if(total == 0){
            $("#cbparent").prop('checked', false);
        }
        for (x = 0; x < checkedArray.length; x++){
            var valArr = JSON.stringify(checkedArray[x]);
            var valCb = JSON.stringify($(e).data("value"));
            if(valArr == valCb){
                checkedArray.splice(x, 1);
            }
        }
    }
}

function upload_file(pIdValas) {
    $("#modal-upload-file").modal("show");
    $("#temp-id-valas-file").val(pIdValas);

    getFilesRekap(pIdValas);
}

function upd_status_tracking(idValas, pStatusInvoice, pIdJenisPembayaran, pCurrency, pTotalTagihan){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/pembayaran/upd_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdValas: idValas,
                pStatusInvoice:pStatusInvoice,
                pIdJenisPembayaran:pIdJenisPembayaran,
                pCurrency:pCurrency,
                pTotalTagihan:pTotalTagihan,
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
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

function reverse(idValas, statusInvoice, idJenisPembayaran, currency, totalTagihan) {
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
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
                pStatusInvoice: statusInvoice,
                pKeterangan: $("#pKeterangan").val(),
                pCurrency: currency,
                pIdJenisPembayaran: idJenisPembayaran,
                pTotalTagihan: totalTagihan
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    idValas = "";
                    table_rekapitulasi.ajax.reload();
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

function update_datas() {
    var stateCrf = confirm("Anda Yakin Akan Merverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/pembayaran/multi_upd_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray),
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG)
                    table_rekapitulasi.ajax.reload();
                    checkedArray = new Array();
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

function multipleDelete() {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/pembayaran/multi_del_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray)
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
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

function rejectData() {
    var stateCrf = confirm("Anda Yakin Akan Mereject Data Ini ?");
    if (stateCrf == true) {
        $.ajax({
            url: baseUrl + "api_operator/pembayaran/reject_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray)
            },
            success: function (res) {
                hideLoadingCss("")
                alert(res.return);
                table_rekapitulasi.ajax.reload();
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
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
            $.each(data.data_pembayaran.return, function (index, val) {
                if (val.JENIS_FILE == 1) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-tanda-terima-invoice"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-tanda-terima-invoice").replaceWith(html);
                    }else{
                        var html = '<a id="btn-download-tanda-terima-invoice">-</a>';
                        $("#btn-download-tanda-terima-invoice").replaceWith(html);
                    }
                }
                else{
                    var html = '<a id="btn-download-tanda-terima-invoice">-</a>';
                    $("#btn-download-tanda-terima-invoice").replaceWith(html);
                }

                if (val.JENIS_FILE == 2) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-lembar-verifikasi"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-lembar-verifikasi").replaceWith(html);
                    }else {
                        var html = '<a id="btn-download-lembar-verifikasi">-</a>';
                        $("#btn-download-lembar-verifikasi").replaceWith(html);
                    }
                }
                else {
                    var html = '<a id="btn-download-lembar-verifikasi">-</a>';
                    $("#btn-download-lembar-verifikasi").replaceWith(html);
                }

                if (val.JENIS_FILE == 3) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-file-tagihan"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-file-tagihan").replaceWith(html);
                    }else {
                        var html = '<a id="btn-download-file-tagihan">-</a>';
                        $("#btn-download-file-tagihan").replaceWith(html);
                    }
                }
                else {
                    var html = '<a id="btn-download-file-tagihan">-</a>';
                    $("#btn-download-file-tagihan").replaceWith(html);
                }

                if (val.JENIS_FILE == 4) {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn-download-nota-dinas-pembayaran"><i class="fa fa-download"> ' + val.NAMA_FILE + ' </i></a>';
                        $("#btn-download-nota-dinas-pembayaran").replaceWith(html);
                    }else {
                        var html = '<a target="_blank" id="btn-download-nota-dinas-pembayaran">-</a>';
                        $("#btn-download-nota-dinas-pembayaran").replaceWith(html);
                    }
                }
                else {
                    var html = '<a target="_blank" id="btn-download-nota-dinas-pembayaran">-</a>';
                    $("#btn-download-nota-dinas-pembayaran").replaceWith(html);
                }
            });
        },
        error: function () {
            console.log("Gagal mengambil data files rekap")
        }
    });
}

function upload_server(jenisFile) {
    $("#modal-upload-file").modal("hide");
    showLoadingCss();
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
        url: baseUrl + "api_operator/pembayaran/upload_files_pembayaran",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (data) {
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

function upload_xls(){
    $("#modal-upload-xls").modal("show");
    //getFilesRekap(pIdValas);
}

function upload_server_xls() {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    fileSize = $('input[type=file]#file-xls')[0].files[0].size / 1000;
    $("#file-xls").val('');

    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/pembayaran/upload_xls",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            if (res.V_RETURN == 0) {
                alert("sukses");
                table_rekapitulasi.ajax.reload();
                search("load");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_operator/pembayaran/download/"+obj["ID_UPLOAD"];
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
        var pageNumber = table_rekapitulasi.page.info().page;
        if($(this).is(":checked")) {
            $('input:checkbox').not(this).prop('checked', this.checked).change();
            cbParentArray.push(pageNumber);
        }
        else {
            $('input:checkbox').not(this).prop('checked', this.checked).change();
            for (x = 0; x < cbParentArray.length; x++) {
                if (cbParentArray[x] == pageNumber) {
                    cbParentArray.splice(x, 1);
                }
            }
        }
    });
}

function openMultipleEditForm(){
    setSelectBank("pNewBankPembayar", "", "PEMBAYAR", "", "REKAP");
    $("#pNewTglJatuhTempo").val("");
    $("#pNewBankPembayar").val("")
    $('#pNewTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
}

function multipleUpdate() {
    console.log("checkedArray", checkedArray);
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/multiple_edit",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(checkedArray),
            pTglJatuhTempo: $("#pNewTglJatuhTempo").val(),
            pBankPembayar: $("#pNewBankPembayar").val()
        },
        success: function (res) {
            hideLoadingCss("")
            if (res.return == 1) {
                alert(res.OUT_MSG);
                search("load");
                $('#multiple-edit-modal').modal('hide');
                table_rekapitulasi.ajax.reload();
                checkedArray = new Array();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}