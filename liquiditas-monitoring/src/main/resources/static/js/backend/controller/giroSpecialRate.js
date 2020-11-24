var table_rekapitulasi;
var idGiro = "";
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
    $("#pTglJatuhTempo").val("");
    $("#pTglPenempatan").val("");
    $("#pCurrecny").val("");
    $("#pPajak").val("");
    $("#pInterest").val("");
    $("#pNominal").val("");
    $("#pBankTujuan").select2("val", "");

    var date = new Date();
    date.setDate(date.getDate() + addedDays);

    $('#pTglJatuhTempo').datepicker({dateFormat: 'mm/dd/yy', minDate: date});
    $('#pTglPenempatan').datepicker({dateFormat: 'mm/dd/yy'});
    setSelectCurr("pCurrecny", "", "", "REKAP");
    setSelectBank2("pBankTujuan", "", "TUJUAN", "", "REKAP");
    $('#pTglJatuhTempo').prop('disabled', false);

    $('#edit-rekap-modal').modal({backdrop: 'static', keyboard: false});

}

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/pembayaran/delete_giro",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdGiro: id
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
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/ins_data_giro",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdGiro: idGiro,
            pTglJatuhTempo: $("#pTglJatuhTempo").val(),
            pTglPenempatan: $("#pTglPenempatan").val(),
            pCurr: $("#pCurrecny").val(),
            pBankTujuan: $("#pBankTujuan").val(),
            pPajak: $("#pPajak").val(),
            pInterest: $("#pInterest").val(),
            pNominal: $("#pNominal").val(),
            pProduk: $("#pProduk").val()
        },
        success: function (res) {
            hideLoadingCss("")
            var result = res.return.split(";")[0];
            if (result == 1 || result == '1') {
                alert("Data Berhasil Disimpan");
                search("load");
                $('#edit-rekap-modal').modal('hide');
                table_rekapitulasi.ajax.reload();
            } else {
                alert("Data Gagal Disimpan");
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
        url: baseUrl + "api_operator/pembayaran/edit_giro",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdGiro: id
        },
        success: function (res) {
            hideLoadingCss("")

            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "REKAP");
            setSelectBank("pBankTujuan", "", "PEMBAYAR", res[0].BANK, "REKAP");
            $("#pTglJatuhTempo").val(res[0].JATUH_TEMPO);
            $("#pTglPenempatan").val(res[0].TGL_PENEMPATAN);
            $("#pPajak").val(res[0].PAJAK);
            $("#pInterest").val(res[0].INTEREST);
            $("#pNominal").val(res[0].NOMINAL);
            $("#pProduk").val(res[0].PRODUK);

            setTimeout(function () {
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
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function show_modal(id) {
    idGiro = id;
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
                        return full.BANK;
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return full.CURRENCY;
                    }

                },
                {
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return full.PRODUK;
                    }

                },

                {
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return full.NOMINAL;
                    }

                },
                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return full.INTEREST;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return full.TGL_PENEMPATAN;
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.JATUH_TEMPO;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return full.JUMLAH_HARI;
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return full.JASA_GIRO;
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return full.PAJAK;
                    }

                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return full.PAJAK_NOMINAL;
                    }

                },
                {
                    "aTargets": [12],
                    "mRender": function (data, type, full) {
                        return full.NET_JASA_GIRO;
                    }

                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        return full.POKOK_JASA_GIRO;
                    }

                },
                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                           var ret_value;
                         ret_value =
                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_GIRO + '\')"><i class="fas fa-edit"></i></button>'+
                         '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_GIRO + '\')"><i class="fas fa-trash"></i></button>' ;
                         return ret_value;
                    }

                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/pembayaran/giro",
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