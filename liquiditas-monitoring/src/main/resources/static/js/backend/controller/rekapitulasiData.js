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
var tempUnit = "";
var tempTableSearch = "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
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
    search("load");
    siap();
    inputKeterangan();
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
            console.log("data duplicate :", res);

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
    $("#pBankTujuan").select2("val", "");
    $("#pJenisPemabayaran").select2("val", "");
    $("#pUnitPenerima").select2("val", "");
    $("#pVendor").select2("val", "");

    $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
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
                console.log("delete log : ", res)
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.reload();
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
        console.log(c[i]);

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
        console.log(no_ta);

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
    console.log("id valas : ", idValas)
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
            pTglTerimaInvoice: $("#pTglTerimaInvoice").val()
        },
        success: function (res) {
            hideLoadingCss("")
            var result = res.return.split(";")[0];
            if (result == 1 || result == '1') {
                alert(res.OUT_MSG);
                search("load");
                $('#edit-rekap-modal').modal('hide');
                window.location.reload(true);
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
            idValas = id
            console.log("data cmb edit_data :", res);

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
//            console.log(allData)
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

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran) {
    console.log("USERLOGIN", newRoleUser[0]);
    showLoadingCss();
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();
    table_rekapitulasi = $('#table-rekapitulasi').DataTable({
            // "sDom": '<"H"ilr><"clear">t<"F"p>',
            "serverSide": true,
            "oSearch": {"sSearch": tempTableSearch},
            "searching": true,
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
                {width: 300, targets: 6},
                {width: 170, targets: 7},
                {width: 100, targets: 8},
                {width: 90, targets: 9},
                {width: 110, targets: 10},
                {width: 130, targets: 11},
                {width: 120, targets: 12},
                {width: 75, targets: 13},
                {width: 75, targets: 14},
                {width: 100, targets: 15},
                {width: 90, targets: 16},
                {width: 90, targets: 17},
                {width: 90, targets: 18},
                {width: 300, targets: 19},
                {width: 12, targets: 21},
                {className: "datatables_action", "targets": [5, 13, 11, 15]},
                {"width": "20%", "targets": 0},
                {
                    "bSortable": true,
                    "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
                },{
                    "aTargets":
                        [5],
                    "mRender":

                        function (data, type, full) {
                            return accounting.formatNumber(full.TOTAL_TAGIHAN, 2, ".", ",")
                        }

                },
                {
                    "aTargets": [20],
                    "mRender": function (data, type, full) {

                        var ret_value;
                            if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                                return "-"
                            }
                            else if(newRoleUser[0] == "ROLE_OSS"){
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

                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified User" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +2+ '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>'
                                }
                                else if (full.STATUS_TRACKING == "VERIFIED BY USER") {

                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                        if(newRoleUser[0] == "ROLE_DM_ENERGI" || newRoleUser[0] == "ROLE_DM_KEUKON_APLN" || newRoleUser[0] == "ROLE_DM_PENGUSAHAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                                ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DM" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +2+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                    if(newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                                    }
                                        ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>'
                                }
                                else if (full.STATUS_TRACKING == "VERIFIED BY DM" && full.UPDATE_BY == "dmkeukonap" || full.UPDATE_BY == "dmkeukonslap"){
                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                    if(newRoleUser[0] == "ROLE_MS_KEUKON" || newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MS Keukon" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +3+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                    }
                                    if(newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                                    }
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>'
                                }
                                else if (full.UPDATE_BY == "dmkeukonslap" && full.STATUS_TRACKING == "VERIFIED BY DM" || full.UPDATE_BY !== "dmkeukonap" && full.STATUS_TRACKING == "VERIFIED BY DM" || full.STATUS_TRACKING == "VERIFIED BY MS KEUKON"){
                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                    if(newRoleUser[0] == "ROLE_DM_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DM Pembelanjaan" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +3+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                    }
                                    else if(newRoleUser[0] == "ROLE_MS_KEUKON"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MS Keukon" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\')"><i class="fa fa-arrows-alt"></i></button>';

                                    }
                                    if(newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                                    }
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>'
                                }
                                else if (full.STATUS_TRACKING == "VERIFIED BY DM PEMBELANJAAN"){

                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                    if(newRoleUser[0] == "ROLE_MS_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Approve MS" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +4+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                    }
                                    if(newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                                    }
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>'
                                }
                                else if (full.STATUS_TRACKING == "APPROVE BY MS"){
                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                        var role = newRoleUser[0];
                                        if(newRoleUser[0] == "ROLE_ADMIN" || role.includes("KADIV")){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Approve KADIV" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +10+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
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
                                }else if (full.STATUS_TRACKING == "APPROVE BY KADIV"){
                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                    var role = newRoleUser[0];
                                    if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" id="option-lunas" class="btn-lunas btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +10+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                    }
                                    if(newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>';
                                    }
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>'
                                }
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
                    "aTargets": [21],
                    "mRender": function (data, type, full) {
                        var ret_value =
                            '';

                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return ""
                        } else {
                            if (full.STATUS_TRACKING == "INPUT DATA") {
                                ret_value ='<input class="cb" type="checkbox" data-value=\'{"2" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';

                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY USER") {

                                if(newRoleUser[0] == "ROLE_DM_ENERGI" || newRoleUser[0] == "ROLE_DM_KEUKON_APLN" || newRoleUser[0] == "ROLE_DM_PENGUSAHAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"3" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }else {
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY DM" && full.UPDATE_BY == "dmkeukonap" || full.UPDATE_BY == "dmkeukonslap" ){

                                if(newRoleUser[0] == "ROLE_MS_KEUKON" || newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"8" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }else {
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }
                            }
                            else if (full.UPDATE_BY == "dmkeukonslap" && full.STATUS_TRACKING == "VERIFIED BY DM"
                                || full.UPDATE_BY !== "dmkeukonap" && full.STATUS_TRACKING == "VERIFIED BY DM"
                                || full.STATUS_TRACKING == "VERIFIED BY MS KEUKON"){
                                if(newRoleUser[0] == "ROLE_DM_PEMBELANJAAN"|| newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"4" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }else {
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY DM PEMBELANJAAN"){

                                if(newRoleUser[0] == "ROLE_MS_PEMBELANJAAN" || newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"5" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }else {
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }
                            }
                            else if (full.STATUS_TRACKING == "APPROVE BY MS"){
                                console.log(newRoleUser[0]);
                                if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_KADIV"){
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"10" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }else {
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }
                            }
                            else if (full.STATUS_TRACKING == "APPROVE BY KADIV"){
                                var role = newRoleUser[0];

                                if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"7" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }else {
                                    ret_value = '<input class="cb" type="checkbox" data-value=\'{"x" : "'+full.ID_VALAS+'"}\' id="cbcheckbox">';
                                }
                            }
                            else {
                                ret_value = '<input class="cb" type="checkbox" data-value=\'{"0" : "'+full.ID_VALAS+'"}\' id="cbcheckbox" enabled="false">';
                            }
                        }
                        return ret_value;
                    }

                }
            ],
            "ajax":
                {
                    "url":
                    baseUrl + "api_operator/pembayaran/get_data_rekapitulasi",
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
                            pPembayaran
                        }
                    ,
                    "dataSrc":

                        function (res) {
                            hideLoadingCss()
                            console.log("get all data pss : ", res);
                            return res.data;
                        }
                }
            ,
            "columns":
                [
                    {"data": "ROW_NUMBER", "defaultContent": ""},
                    {"data": "ID_JENIS_PEMBAYARAN", "defaultContent": ""},
                    {"data": "TGL_JATUH_TEMPO", "defaultContent": ""},
                    {"data": "ID_VENDOR", "defaultContent": ""},
                    {"data": "CURRENCY", "defaultContent": ""},
                    {"data": "TOTAL_TAGIHAN", "defaultContent": ""},
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
            "drawCallback":

                function (settings) {

                    $('th').removeClass('sorting_asc');
                    $('th').removeClass('datatables_action');
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
                }
        }
    )
    ;

    table_rekapitulasi.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_filter').each(function () {
        var html = '';

        if(newRoleUser[0] != "ROLE_OSS"){
            html = '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' +
                '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fa fa-pencil"></i></button>';
        }
        html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
        $(this).append(html);
    });

    initCbparent();

  /*  $("#table-rekapitulasi").on('change',"input[type='checkbox']",function(e){
        if($(this).is(':checked')){
            $('#btn-verified').show();
        }
        else{
            $('#btn-verified').hide();
        }
    });*/
}

function upload_file(pIdValas) {
    $("#modal-upload-file").modal("show");
    $("#temp-id-valas-file").val(pIdValas);

    getFilesRekap(pIdValas);
}


function upd_status_tracking(idValas , pStatusinvoice){
    showLoadingCss();
    console.log("idvalas :",idValas);
    console.log("satusinvoice :",pStatusinvoice);
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/upd_status",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdValas: idValas,
            pStatusInvoice:pStatusinvoice,
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_status :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                table_rekapitulasi.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function reverse(idValas, statusInvoice) {
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
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_reverse :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                idValas = "";
                table_rekapitulasi.reload();
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
    var id= $("#table-rekapitulasi input[type=checkbox]:checked").map(function() {
        return $(this).data("value");
    }).get();
    var obj = new Object();
    obj = id;
    console.log("obj", obj);
    console.log("id",id.toString());
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
                alert(res.OUT_MSG)
                table_rekapitulasi.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function multipleDelete() {
    var id= $("#table-rekapitulasi input[type=checkbox]:checked").map(function() {
        return $(this).data("value");
    }).get();
    var obj = new Object();
    obj = id;
    console.log("obj", obj);
    console.log("id",id.toString());
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/multi_del_data",
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
                table_rekapitulasi.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
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

            $.each(data.data_pembayaran.return, function (index, val) {
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
                        var html = '<a target="_blank" id="btn-download-nota-dinas-pembayaran">-</a>';
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

    console.log(formData);
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
            console.log("res", res)
            if (res.V_RETURN == 0) {
                alert("sukses");
                table_rekapitulasi.reload();
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
        $('input:checkbox').not(this).prop('checked', this.checked);
    });
}

function openMultipleEditForm(){
    setSelectBank("pNewBankPembayar", "", "PEMBAYAR", "", "REKAP");
    $('#pNewTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
}

function multipleUpdate() {
    var id= $("#table-rekapitulasi input[type=checkbox]:checked").map(function() {
        return $(this).data("value");
    }).get();
    var obj = new Object();
    obj = id;
    console.log("obj", obj);
    console.log("id bank pembayar ",$("#pNewBankPembayar").val());
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/multiple_edit",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(obj),
            pTglJatuhTempo: $("#pNewTglJatuhTempo").val(),
            pBankPembayar: $("#pNewBankPembayar").val()
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("data upd_status :", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                table_rekapitulasi.reload();
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}