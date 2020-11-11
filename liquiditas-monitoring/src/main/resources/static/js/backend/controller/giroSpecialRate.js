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
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val())
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

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency) {
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
                {width: "20%", "targets": 0},
                { className: "datatables_action", "targets": [11] },
                {
                    "bSortable": true,
                    "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14]
                },
                {
                    "sortable": false,
                    "aTargets": [0]
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
                           var ret_value;
                         ret_value =
                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                         '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                         return ret_value;
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
                            pCurrency
                        }
                    ,
                    "dataSrc":

                        function (res) {
                            hideLoadingCss()
                            getTotalTagihan();
                            return res.data;
                        }
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