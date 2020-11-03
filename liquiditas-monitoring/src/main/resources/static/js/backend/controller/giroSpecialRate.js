var table_rekapitulasi;
var idValas = "";
var allData;
var tempVendor = "";
var tempCurrency = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;
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
    setSelectStatus("cmb_status");
    setSelectStatusTracking("cmb_status_tracking");
    setSelectJenisTagihan("pJenisTagihan");
    setNominalSetelahPajak();
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

function selectCurrency(value) {
    $("#pSisaAnggaran").val("");
    tempCurrency=value;
    setSelectSisaAnggaran("pSisaAnggaran",tempCurrency, tempNilaiTagihan );
}

function openInsIdOss(){
     $('#ins-id-oss').modal({backdrop: 'static', keyboard: false});
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
            tempSubPosAnggaran = res[0].KODE_POS_ANGGARAN;


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

function ins_data() {
    var no_ta = $("#pNoTagihan").val().toString();
    var old_data = localStorage.getItem("real_no_tagihan_RD");
    var all_val = [];
    let jenis_dok = $("input[name='pJenisDokumen']:checked").val();

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
            pJenisTagihan: $("#pJenisTagihan").val(),
            pJenisDokumen: jenis_dok
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
            tempSubPosAnggaran = res[0].KODE_POS_ANGGARAN;
            tempUnit = res[0].ID_UNIT;

            setSelectJenisPembayaran("pJenisPemabayaran", "", res[0].ID_JENIS_PEMBAYARAN);
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "REKAP");
            setSelectBank2("pBankTujuan", "", "TUJUAN", res[0].KODE_BANK_TUJUAN, "REKAP");
            setSelectBank("pBankPembayar", "", "PEMBAYAR", res[0].KODE_BANK_PEMBAYAR, "REKAP");
            setSelectVendor("pLVNamaVendor","",res[0].NAMA_VENDOR);
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
            if(res[0].JENIS_TRANSAKSI === 'AP INVOICE'){
                $("#hrpayableradio").prop('checked',false)
                $("#apinvoiceradio").prop('checked',true)
            }else{
                $("#hrpayableradio").prop('checked',true)
                $("#apinvoiceradio").prop('checked',false)
            }
            $("#hrpayableradio").attr('disabled',true)
            $("#apinvoiceradio").attr('disabled',true)
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
            "searching": false,
            bSortable: true,
            "scrollCollapse": true,
            "lengthMenu": [[10, 25, 50, 100, 200, 400, 600, 1000], [10, 25, 50, 100, 200, 400, 600, 1000]],
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
                {width: 100, targets: 32},
                {width: "20%", "targets": 0},
                { className: "datatables_action", "targets": [11,25,26,27,28,29,31,32] },
                {
                    "bSortable": true,
                    "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
                },
                {
                    "sortable": false,
                    "aTargets": [0,25, 30, 34,33]
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
                        return full.ID_VALAS;
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return full.JENIS_TAGIHAN;
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
                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else if(newRoleUser[0] == "ROLE_OSS" || newRoleUser[0] == "ROLE_VERIFIKATOR" || newRoleUser[0] == "ROLE_OSS_DIVKEU"){
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                            if(full.STATUS_TRACKING == "INPUT DATA"){
                                ret_value = ret_value +
                                    '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>';
                            }
                            ret_value = ret_value +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>';
                        }else {

                            if (full.STATUS_TRACKING == "INPUT DATA") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_POWER_PURCHASE_LEASING" || newRoleUser[0] == "ROLE_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_OPERATION" || newRoleUser[0] == "PAYMENT" || newRoleUser[0] == "INVESTMENT_I" || newRoleUser[0] == "INVESTMENT_II" || newRoleUser[0] == "CENTRALIZED_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-edit-data btn-sm btn-warning" title="Verified Staff" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +2+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                '</div>'

                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {
                                ret_value =
                                    '<div class="btn-group">';
                                if(full.UPDATE_BY =='payment' && newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important; " class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    ret_value = ret_value +'<button style="width: 15px !important;" class="btn btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class= "btn btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 2 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    ret_value = ret_value +'<button style="width: 15px !important;" class="btn btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class= "btn btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN"){
                                    ret_value = ret_value +'<button style="width: 15px !important;" class="btn btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +6+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +6+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }'</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Investment" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER"){
                                ret_value =
                                    '<div class="btn-group">' ;
                                if(newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){

                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Operation" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Operation" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
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
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 6 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>';

                                    }
                                    if (newRoleUser[0] == "ROLE_DIVKEU") {
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>';
                                    }
                                }
                                else{
                                    if(role == "ROLE_ADMIN") {

                                        ret_value = ret_value +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                    }
                                    if(role.includes("KASIR")){
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                    }
                                    if(newRoleUser[0] == "ROLE_DIVKEU"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
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
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +10+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 6 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                    }
                                }
                                else{
                                    if(role == "ROLE_ADMIN") {
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                    }
                                    if(role.includes("KASIR")){
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                    }
                                    if(newRoleUser[0] == "ROLE_DIVKEU"){
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
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
                                        '<button style="width: 15px !important; margin-right: 5px" id="option-lunas" class="btn-lunas btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' + full.ID_VALAS + '\',\'' + 7 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                }
                                if(newRoleUser[0] == "ROLE_DIVKEU"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                }
                                '</div>'
                            }
                            else {
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important; margin-right: 5px" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' +
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
                        if (response.OSS_ID == 1) {
                            api.column(1).visible(true);
                        } else {
                            api.column(1).visible(false);
                        }
                        if (response.JENIS_TAGIHAN == 1) {
                            api.column(2).visible(true);
                        } else {
                            api.column(2).visible(false);
                        }
                        if (response.JENIS_PEMBAYARAN == 1) {
                            api.column(3).visible(true);
                        } else {
                            api.column(3).visible(false);
                        }
                        if (response.JATUH_TEMPO == 1) {
                            api.column(4).visible(true);
                        } else {
                            api.column(4).visible(false);
                        }
                        if (response.VENDOR == 1) {
                            api.column(5).visible(true);
                        } else {
                            api.column(5).visible(false);
                        }
                        if (response.CURRENCY == 1) {
                            api.column(6).visible(true);
                        } else {
                            api.column(6).visible(false);
                        }
                        if (response.NILAI_TAGIHAN == 1) {
                            api.column(7).visible(true);
                        } else {
                            api.column(7).visible(false);
                        }
                        if (response.NAMA_KONTRAK == 1) {
                            api.column(8).visible(true);
                        } else {
                            api.column(8).visible(false);
                        }
                        if (response.BANK_TUJUAN == 1) {
                            api.column(9).visible(true);
                        } else {
                            api.column(9).visible(false);
                        }
                        if (response.BANK_PEMBAYAR == 1) {
                            api.column(10).visible(true);
                        } else {
                            api.column(10).visible(false);
                        }
                        if (response.TGL_TERIMA_TAGIHAN == 1) {
                            api.column(11).visible(true);
                        } else {
                            api.column(11).visible(false);
                        }
                        if (response.TGL_TAGIHAN == 1) {
                            api.column(12).visible(true);
                        } else {
                            api.column(12).visible(false);
                        }
                        if (response.NO_TAGIHAN == 1) {
                            api.column(13).visible(true);
                        } else {
                            api.column(13).visible(false);
                        }
                        if (response.TGL_NOTA_DINAS == 1) {
                            api.column(14).visible(true);
                        } else {
                            api.column(14).visible(false);
                        }
                        if (response.NO_NOTA_DINAS == 1) {
                            api.column(15).visible(true);
                        } else {
                            api.column(15).visible(false);
                        }
                        if (response.TGL_PEMBAYARAN == 1) {
                            api.column(16).visible(false);
                        } else {
                            api.column(16).visible(false);
                        }
                        if (response.COUNTDOWN == 1) {
                            api.column(17).visible(true);
                        } else {
                            api.column(17).visible(false);
                        }
                        if (response.STATUS == 1) {
                            api.column(18).visible(true);
                        } else {
                            api.column(18).visible(false);
                        }
                        if (response.TIPE_TRANSAKSI == 1) {
                            api.column(19).visible(true);
                        } else {
                            api.column(19).visible(false);
                        }
                        if (response.NOMINAL_SBLM_PAJAK == 1) {
                            api.column(20).visible(true);
                        } else {
                            api.column(20).visible(false);
                        }
                        if (response.PAJAK == 1) {
                            api.column(21).visible(true);
                        } else {
                            api.column(21).visible(false);
                        }
                        if (response.NOMINAL_STLH_PAJAK == 1) {
                            api.column(22).visible(true);
                        } else {
                            api.column(22).visible(false);
                        }
                        if (response.NOMINAL_UNDERLYING == 1) {
                            api.column(23).visible(true);
                        } else {
                            api.column(23).visible(false);
                        }
                        if (response.NOMINAL_TANPA_UNDERLYING == 1) {
                            api.column(24).visible(true);
                        } else {
                            api.column(24).visible(false);
                        }
                        if (response.KURS_JISDOR == 1) {
                            api.column(25).visible(true);
                        } else {
                            api.column(25).visible(false);
                        }
                        if (response.SPREAD == 1) {
                            api.column(26).visible(true);
                        } else {
                            api.column(26).visible(false);
                        }
                        if (response.KURS_TRANSAKSI == 1) {
                            api.column(27).visible(true);
                        } else {
                            api.column(27).visible(false);
                        }
                        if (response.NOMINAL_PEMBAYARAN_IDR == 1) {
                            api.column(28).visible(true);
                        } else {
                            api.column(28).visible(false);
                        }
                        if (response.CREATE_DATE_TAGIHAN == 1) {
                            api.column(29).visible(true);
                        } else {
                            api.column(29).visible(false);
                        }
                        if (response.UPDATE_DATE_TAGIHAN == 1) {
                            api.column(30).visible(true);
                        } else {
                            api.column(30).visible(false);
                        }

                        if (response.STATUS_TAGIHAN == 1) {
                            api.column(31).visible(true);
                        } else {
                            api.column(31).visible(false);
                        }
                        if (response.KETERANGAN == 1) {
                            api.column(32).visible(true);
                        } else {
                            api.column(32).visible(false);
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
        var html = '<label style="margin-left: 250px; cursor:default; text-align: center;"><b>GIRO SPECIAL RATE</b><br><b>TANGGAL :</b> <a id="start_date"></a><b> s.d </b><a id="finish_date"></a></label>';
        $(this).append(html);
    });

    table_rekapitulasi.columns.adjust();
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

function showColumn() {
    $("#hide_column_modal").modal("show");
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_column",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var response = res.data[0];

            if (response.NOMOR == 1) {
                $("#hc0").prop("checked", true);
            } else {
                $("#hc0").prop("checked", false);
            }
            if (response.OSS_ID == 1) {
                $("#hc1").prop("checked", true);
            } else {
                $("#hc1").prop("checked", false);
            }
            if (response.JENIS_TAGIHAN == 1) {
                $("#hc2").prop("checked", true);
            } else {
                $("#hc2").prop("checked", false);
            }
            if (response.JENIS_PEMBAYARAN == 1) {
                $("#hc3").prop("checked", true);
            } else {
                $("#hc3").prop("checked", false);
            }
            if (response.JATUH_TEMPO == 1) {
                $("#hc4").prop("checked", true);
            } else {
                $("#hc4").prop("checked", false);
            }
            if (response.VENDOR == 1) {
                $("#hc5").prop("checked", true);
            } else {
                $("#hc5").prop("checked", false);
            }
            if (response.CURRENCY == 1) {
                $("#hc6").prop("checked", true);
            } else {
                $("#hc6").prop("checked", false);
            }
            if (response.NILAI_TAGIHAN == 1) {
                $("#hc7").prop("checked", true);
            } else {
                $("#hc7").prop("checked", false);
            }
            if (response.NAMA_KONTRAK == 1) {
                $("#hc8").prop("checked", true);
            } else {
                $("#hc8").prop("checked", false);
            }
            if (response.BANK_TUJUAN == 1) {
                $("#hc9").prop("checked", true);
            } else {
                $("#hc9").prop("checked", false);
            }
            if (response.BANK_PEMBAYAR == 1) {
                $("#hc10").prop("checked", true);
            } else {
                $("#hc10").prop("checked", false);
            }
            if (response.TGL_TERIMA_TAGIHAN == 1) {
                $("#hc11").prop("checked", true);
            } else {
                $("#hc11").prop("checked", false);
            }
            if (response.TGL_TAGIHAN == 1) {
                $("#hc12").prop("checked", true);
            } else {
                $("#hc12").prop("checked", false);
            }
            if (response.NO_TAGIHAN == 1) {
                $("#hc13").prop("checked", true);
            } else {
                $("#hc13").prop("checked", false);
            }
            if (response.TGL_NOTA_DINAS == 1) {
                $("#hc14").prop("checked", true);
            } else {
                $("#hc14").prop("checked", false);
            }
            if (response.NO_NOTA_DINAS == 1) {
                $("#hc15").prop("checked", true);
            } else {
                $("#hc15").prop("checked", false);
            }
            if (response.TGL_PEMBAYARAN == 1) {
                $("#hc16").prop("checked", true);
            } else {
                $("#hc16").prop("checked", false);
            }
            if (response.COUNTDOWN == 1) {
                $("#hc17").prop("checked", true);
            } else {
                $("#hc17").prop("checked", false);
            }
            if (response.STATUS == 1) {
                $("#hc18").prop("checked", true);
            } else {
                $("#hc18").prop("checked", false);
            }
            if (response.TIPE_TRANSAKSI == 1) {
                $("#hc19").prop("checked", true);
            } else {
                $("#hc19").prop("checked", false);
            }
            if (response.NOMINAL_SBLM_PAJAK == 1) {
                $("#hc20").prop("checked", true);
            } else {
                $("#hc20").prop("checked", false);
            }
            if (response.PAJAK == 1) {
                $("#hc21").prop("checked", true);
            } else {
                $("#hc21").prop("checked", false);
            }
            if (response.NOMINAL_STLH_PAJAK == 1) {
                $("#hc22").prop("checked", true);
            } else {
                $("#hc22").prop("checked", false);
            }
            if (response.NOMINAL_UNDERLYING == 1) {
                $("#hc23").prop("checked", true);
            } else {
                $("#hc23").prop("checked", false);
            }
            if (response.NOMINAL_TANPA_UNDERLYING == 1) {
                $("#hc24").prop("checked", true);
            } else {
                $("#hc24").prop("checked", false);
            }
            if (response.KURS_JISDOR == 1) {
                $("#hc25").prop("checked", true);
            } else {
                $("#hc25").prop("checked", false);
            }
            if (response.SPREAD == 1) {
                $("#hc26").prop("checked", true);
            } else {
                $("#hc26").prop("checked", false);
            }
            if (response.KURS_TRANSAKSI == 1) {
                $("#hc27").prop("checked", true);
            } else {
                $("#hc27").prop("checked", false);
            }
            if (response.NOMINAL_PEMBAYARAN_IDR == 1) {
                $("#hc28").prop("checked", true);
            } else {
                $("#hc28").prop("checked", false);
            }
            if (response.CREATE_DATE_TAGIHAN == 1) {
                $("#hc29").prop("checked", true);
            } else {
                $("#hc29").prop("checked", false);
            }
            if (response.UPDATE_DATE_TAGIHAN == 1) {
                $("#hc30").prop("checked", true);
            } else {
                $("#hc30").prop("checked", false);
            }
            if (response.STATUS_TAGIHAN == 1) {
                $("#hc31").prop("checked", true);
            } else {
                $("#hc31").prop("checked", false);
            }
            if (response.KETERANGAN == 1) {
                $("#hc32").prop("checked", true);
            } else {
                $("#hc32").prop("checked", false);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}

function saveColumn() {
    var hc0 = $("#hc0").prop('checked');
    var hc1 = $("#hc1").prop('checked');
    var hc2 = $("#hc2").prop('checked');
    var hc3 = $("#hc3").prop('checked');
    var hc4 = $("#hc4").prop('checked');
    var hc5 = $("#hc5").prop('checked');
    var hc6 = $("#hc6").prop('checked');
    var hc7 = $("#hc7").prop('checked');
    var hc8 = $("#hc8").prop('checked');
    var hc9 = $("#hc9").prop('checked');
    var hc10 = $("#hc10").prop('checked');
    var hc11 = $("#hc11").prop('checked');
    var hc12 = $("#hc12").prop('checked');
    var hc13 = $("#hc13").prop('checked');
    var hc14 = $("#hc14").prop('checked');
    var hc15 = $("#hc15").prop('checked');
    var hc16 = $("#hc16").prop('checked');
    var hc17 = $("#hc17").prop('checked');
    var hc18 = $("#hc18").prop('checked');
    var hc19 = $("#hc19").prop('checked');
    var hc20 = $("#hc20").prop('checked');
    var hc21 = $("#hc21").prop('checked');
    var hc22 = $("#hc22").prop('checked');
    var hc23 = $("#hc23").prop('checked');
    var hc24 = $("#hc24").prop('checked');
    var hc25 = $("#hc25").prop('checked');
    var hc26 = $("#hc26").prop('checked');
    var hc27 = $("#hc27").prop('checked');
    var hc28 = $("#hc28").prop('checked');
    var hc29 = $("#hc29").prop('checked');
    var hc30 = $("#hc30").prop('checked');
    var hc31 = $("#hc31").prop('checked');
    var hc32 = $("#hc32").prop('checked');

    var data = {
        "nomor" : hc0 == true ? 1 : 0,
        "jenis_tagihan" : hc2 == true ? 1 : 0,
        "jenis_pembayaran" : hc3 == true ? 1 : 0,
        "jatuh_tempo" : hc4 == true ? 1 : 0,
        "vendor" : hc5 == true ? 1 : 0,
        "currency" : hc6 == true ? 1 : 0,
        "nilai_tagihan" : hc7 == true ? 1 : 0,
        // "unit" : hc7 == true ? 1 : 0,
        "nama_kontrak" : hc8 == true ? 1 : 0,
        "bank_tujuan" : hc9 == true ? 1 : 0,
        "bank_pembayar" : hc10 == true ? 1 : 0,
        "tgl_terima_tagihan" : hc11 == true ? 1 : 0,
        "tgl_tagihan" : hc12 == true ? 1 : 0,
        "no_tagihan" : hc13 == true ? 1 : 0,
        "tgl_nota_dinas" : hc14 == true ? 1 : 0,
        "no_nota_dinas" : hc15 == true ? 1 : 0,
        "tgl_pembayaran" : hc16 == true ? 1 : 0,
        "countdown" : hc17 == true ? 1 : 0,
        "status" : hc18 == true ? 1 : 0,
        "tipe_transaksi" : hc19 == true ? 1 : 0,
        "nominal_sblm_pajak" : hc20 == true ? 1 : 0,
        "pajak" : hc21 == true ? 1 : 0,
        "nominal_stlh_pajak" : hc22 == true ? 1 : 0,
        "nominal_underlying" : hc23 == true ? 1 : 0,
        "nominal_tanpa_underlying" : hc24 == true ? 1 : 0,
        "kurs_jidor" : hc25 == true ? 1 : 0,
        "spread" : hc26 == true ? 1 : 0,
        "kurs_transaksi" : hc27 == true ? 1 : 0,
        "nominal_pembayaran_idr" : hc28 == true ? 1 : 0,
        "create_date" : hc29 == true ? 1 : 0,
        "update_date" : hc30 == true ? 1 : 0,
        "status_tagihan" : hc31 == true ? 1 : 0,
        "keterangan" : hc32 == true ? 1 : 0,
        "unit_anggaran" : 1,
        "pos_anggaran" : 1,
        "sub_pos_anggaran" : 1,
    };
    // console.log("data save column", data);
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/save_column",
        dataType: 'JSON',
        type: "POST",
        data: data,
        success: function (res) {
            alert(res.data);
            document.location.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_total_tagihan",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            currency: $("#cmb_currecny").val(),
            caraBayar: $("#cmb_cara_pembayaran").val(),
            bank: $("#cmb_bank").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_tagihan").html(res);
            $("#start_date").html($("#tanggal_awal").val());
            $("#finish_date").html($("#tanggal_akhir").val());
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}