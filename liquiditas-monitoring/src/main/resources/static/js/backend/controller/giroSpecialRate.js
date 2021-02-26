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

    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectJenisPembayaran("cmb_jenis_pemabayaran", "FILTER", "");
    setSelectJenisTagihan("pJenisTagihan");
    search("load");
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
    $("#form_penambah, #form_pengurang").find('input[type="number"], input[type="text"]').val("");
    $("#ex2-tabs-1, #ex2-tabs-2").removeClass("active show");
    $("#ex2-tabs-1").addClass("active show");
    $("#ex2-tab-1, #ex2-tab-2")
        .removeClass("active")
        .attr("data-toggle","tab")
        .css("cursor","pointer");
    $("#ex2-tab-1").addClass("active");
    var date = new Date();
    date.setDate(date.getDate() + addedDays);

    $('#pTglJatuhTempo, #pTglJatuhTempoPengurang').datepicker({dateFormat: 'dd/mm/yy', minDate: date});
    $('#pTglPenempatan').datepicker({dateFormat: 'dd/mm/yy'});
    setSelectCurr("pCurrecny, #pCurrecnyPengurang", "", "", "REKAP");
    setSelectBank2("pBankTujuan, #pBankTujuanPengurang", "", "GIRO_SPECIAL_RATE", "", "REKAP");
    $('#pTglJatuhTempo').prop('disabled', false);

    $("#pNominal, #pJasaGiro, #pNominalPengurang").mask('000,000,000,000,000.00',{reverse : true});

    $('#edit-rekap-modal').modal({backdrop: 'static', keyboard: false});

}

$("#pTglPenempatan").change(function() {
    var tglDeal = $('#pTglPenempatan').val();
    if(tglDeal === ""){
        $('#pTglJatuhTempo').val("");
        $('#pTglJatuhTempo').attr("disabled", "disabled");
    }else{
        $('#pTglJatuhTempo').val("");
        $('#pTglJatuhTempo').datepicker( "destroy" );
        $('#pTglJatuhTempo').attr("disabled", false);
        $("#pTglJatuhTempo").datepicker({
            minDate: tglDeal,
            maxDate: '+1Y+6M',
            dateFormat : 'dd/mm/yy',
            onSelect: function (dateStr) {
                var max = $(this).datepicker('getDate'); // Get selected date
                $('#datepicker').datepicker('option', 'maxDate', max || '+1Y+6M'); // Set other max, default to +18 months
                var start = $("#pTglPenempatan").datepicker("getDate");
                var end = $("#pTglJatuhTempo").datepicker("getDate");
                var days = (end - start) / (1000 * 60 * 60 * 24);
                //$("#pTenor").val(days);
            }
        });
    }
});

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/giro_special_rate/delete_giro",
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

function ins_data(type) {
    if (validateForm(type) > 0){
        alert("Harap Lengkapi Data");
    }else{
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/giro_special_rate/ins_data_giro",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdGiro: idGiro,
                pTglJatuhTempo: (type === 1) ? $("#pTglJatuhTempo").val() : $("#pTglJatuhTempoPengurang").val(),
                pTglPenempatan: (type === 1) ? $("#pTglPenempatan").val() : "",
                pCurr: (type === 1) ? $("#pCurrecny").val() : $("#pCurrecnyPengurang").val(),
                pBankTujuan: (type === 1) ? $("#pBankTujuan").val() : $("#pBankTujuanPengurang").val(),
                pPajak: (type === 1) ? $("#pPajak").val() : "",
                pInterest: (type === 1) ? $("#pInterest").val() : "",
                pNominal: (type === 1) ? $("#pNominal").val().replace(/,/g,"") : $("#pNominalPengurang").val().replace(/,/g,""),
                pProduk: (type === 1) ? $("#pProduk").val() : $("#pProdukPengurang").val(),
                pKeterangan : (type === 1) ? $("#pKeterangan").val() : $("#pKeteranganPengurang").val(),
                pJenis : (type === 1) ? "PENAMBAH" : "PENGURANG",
                pJasaGiro : (type === 1) ? $("#pJasaGiro").val().replace(/,/g,"") : ""
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
}

function edit_data(id, type) {
    showLoadingCss();
    $("#ex2-tabs-2, #ex2-tabs-1").removeClass("active show");
    $("#ex2-tab-2, #ex2-tab-1").removeAttr("data-toggle");
    $("#ex2-tab-2,#ex2-tab-1")
        .removeClass("active")
        .css('cursor','pointer');
    $.ajax({
        url: baseUrl + "api_operator/giro_special_rate/edit_giro",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdGiro: id
        },
        success: function (res) {
            hideLoadingCss("")
            setSelectCurr("pCurrecny, #pCurrecnyPengurang", "", res[0].CURRENCY, "REKAP");
            setSelectBank2("pBankTujuan, #pBankTujuanPengurang", "", "GIRO_SPECIAL_RATE", res[0].KODE_BANK, "REKAP");
            $("#pNominal, #pJasaGiro, #pNominalPengurang").unmask();
            if (type === 'PENAMBAH'){
                $("#pTglJatuhTempo").val(res[0].JATUH_TEMPO);
                $("#pTglPenempatan").val(res[0].TGL_PENEMPATAN);
                $("#pPajak").val(res[0].PAJAK);
                $("#pInterest").val(res[0].INTEREST);
                $("#pNominal").val(res[0].NOMINAL);
                $("#pProduk").val(res[0].PRODUK);
                $("#pJasaGiro").val(res[0].JASA_GIRO);
                $("#pKeterangan").val(res[0].KETERANGAN);

                $("#ex2-tabs-1")
                    .addClass("active show")
                    .attr("data-toggle","tab");
                $("#ex2-tab-2")
                    .css("cursor",'not-allowed');
                $("#ex2-tab-1")
                    .addClass("active");

            }else if (type === 'PENGURANG'){
                $("#pTglJatuhTempoPengurang").val(res[0].JATUH_TEMPO);
                $("#pProdukPengurang").val(res[0].PRODUK);
                $("#pNominalPengurang").val(res[0].NOMINAL);
                $("#pKeteranganPengurang").val(res[0].KETERANGAN);

                $("#ex2-tabs-2")
                    .addClass("active show")
                    .attr("data-toggle","tab");
                $("#ex2-tab-1")
                    .css("cursor",'not-allowed');
                $("#ex2-tab-2")
                    .addClass("active");
            }
            $("#pNominal, #pJasaGiro, #pNominalPengurang").mask('000,000,000,000,000.00',{reverse : true})

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
            bSortable: false,
            "scrollCollapse": true,
            "lengthMenu": [[10, 25, 50, 100, 200, 400, 600, 1000], [10, 25, 50, 100, 200, 400, 600, 1000]],
            "aoColumnDefs": [
                {width: 20, targets: 0},
                {width: 100, targets: 1},
                {width: 100, targets: 2},
                {width: 100, targets: 3},
                {width: 100, targets: 4},
                {width: 120, targets: 5},
                {width: 100, targets: 6},
                {width: 100, targets: 7},
                {width: 100, targets: 8},
                {width: 100, targets: 9},
                {width: 100, targets: 10},
                {width: 120, targets: 11},
                {width: 100, targets: 12},
                {width: 57, targets: 13},
                {width: "20%", "targets": 0},
                { className: "datatables_action", "targets": [11] },
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
                        return full.PRODUK;
                    }

                },

                {
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL,2,".",",");
                    }

                },
                {
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return (full.INTEREST !== "-") ? full.INTEREST + "%" : "-";
                    }

                },
                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return full.TGL_PENEMPATAN;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return full.JATUH_TEMPO;
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.JUMLAH_HARI;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.JASA_GIRO,2,".",",");
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.PAJAK,2,".",",");
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NET_JASA_GIRO, 2, ".",",");
                    }

                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.POKOK_JASA_GIRO, 2, ".",",");
                    }

                },
                {
                    "aTargets": [12],
                    "mRender": function (data, type, full) {
                        return full.KETERANGAN;
                    }
                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                           var ret_value;
                         ret_value =
                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_GIRO + '\',\'' + full.JENIS + '\')"><i class="fas fa-edit"></i></button>'+
                         '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_GIRO + '\')"><i class="fas fa-trash"></i></button>' ;
                         return ret_value;
                    }

                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/giro_special_rate/get_giro",
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
                },
        "createdRow" : function (row, data, dataIndex) {
           if(data.JENIS === "PENGURANG"){
               $(row).addClass('red-color');
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

function validateForm(form_type){
    let form = (form_type === 1) ? "#form_penambah" : "#form_pengurang";
    let empty=0;
    $(form)
        .find("select, input")
        .each(function(){
            if ($(this).prop("required") && $(this).val() === ""){
                empty++;
            }
        });
    return empty;
}