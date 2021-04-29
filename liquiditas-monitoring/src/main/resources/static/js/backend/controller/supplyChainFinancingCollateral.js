var table_scf;
var idGiro = "";
var idScf = "";
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
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#cmb_jenis_pembayaran').select2({
        width: '100%',
        theme : 'bootstrap'
    });
    setSelectBank("cmb_bank", "FILTER", "PEMBAYAR", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    selectFilterCashCode("cmb_jenis_pembayaran", "FILTER", "");
    search("load");
    $('#check_all').change(function() {
        if($(this).is(':checked')){
            checkColumn(true);
        } else {
            checkColumn(false);
        }
    });
});

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

 //USED
function openFormNew() {
    var date = new Date();
    date.setDate(date.getDate() + addedDays);

    $("#form_scf").find("input[type=number], input[type=text], select").val("");

    $('#pTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: date});
    $('#pTglTransaksi').datepicker({dateFormat: 'dd/mm/yy'});
    setSelectCurr("pCurrecny", "", "", "REKAP");
    setSelectBank("pbankCounterparty", "FILTER", "PEMBAYAR", "", "REKAP");
    selectFilterCashCode("pJenisPembayaran","","");

    $("#pJenisPembayaran, #pCurrecny, #pbankCounterparty, #pVendor").select2({
        width : "100%",
        theme : "bootstrap",
    });

    $("#pNominal, #pOriCurr, #pKurs").mask('000,000,000,000,000',{reverse : true});

    $("#pVendor").select2({
        width : "100%",
        theme : "bootstrap",
        placeholder: 'Cari vendor...',
        minimumInputLength: 3,
        ajax : {
            url : baseUrl + "/api_master/vendor/get_data_vendor_sap",
            dataType : "JSON",
            delay : 500,
            data : function (params) {
                return {
                    pNamaVendor : params.term
                };
            },
            processResults : function (data, page) {
                console.log(data);
                return {
                    results :$.map(data, function (items) {
                        return {
                            text : items.VALUE,
                            id : items.ID
                        };
                    })
                };
            },
            cache : true
        }
    });

    $('#pTglJatuhTempo').prop('disabled', false);

    $('#edit-scf-modal').modal({backdrop: 'static', keyboard: false});

}

$("#pTglTransaksi").change(function() {
    var tglDeal = $('#pTglTransaksi').val();
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
                var start = $("#pTglTransaksi").datepicker("getDate");
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
            url: baseUrl + "api_operator/supply_chain_financing/delete_scf_collateral_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdScfCollateral: id
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_scf.ajax.reload();
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

// uSED
function ins_data() {
    if (validateForm("#form_scf") > 0){
        alert("Silahkan Lengkapi Data Terlebih Dahulu!");
    }else{
        showLoadingCss();
        $.ajax({
            url: baseUrl + "/api_operator/supply_chain_financing/ins_scf_collateral",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdScfCol: $("#pIdScf").val(),
                pKodeBank: $("#pbankCounterparty").val(),
                pTglTransaksi: $("#pTglTransaksi").val(),
                pJatuhTempo: $("#pTglJatuhTempo").val(),
                pVendor: $("#pVendor").val(),
                pJenisPembayaran: $("#pJenisPembayaran").val(),
                pCurrency: $("#pCurrecny").val(),
                pOriCurr: $("#pOriCurr").val().toString().replace(/,/g,''),
                pKurs: $("#pKurs").val().toString().replace(/,/g,''),
                pFeeTransaksi: $("#pFeeTransaksi").val(),
                pCashCollateral: $("#pCashCollateral").val().toString().replace(/,/g,''),
                pPajak: $("#pPajak").val(),
                pJasaGiro: $("#pRateJasaGiro").val(),
                pPajakBank : $("#pPajakBank").val().replace(/,/g,''),
            },
            success: function (res) {
                if (res.return == 1) {
                    alert("Data Berhasil Disimpan");
                    $('#edit-scf-modal').modal('hide');
                    table_scf.ajax.reload();
                } else {
                    alert("Data Gagal Disimpan");
                }
                hideLoadingCss("");

            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
            }
        });
    }
}

// USED
function edit_data(id) {
    //showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/supply_chain_financing/get_scf_collateral_byId",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdScfCollateral: id
        },
        success: function (res) {
            $("#pNominal,#pOriCurr,#pPajakBank").unmask();
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "REKAP");
            setSelectBank("pbankCounterparty", "FILTER", "PEMBAYAR", res[0].BANK_CONTERPARTY, "REKAP");
            setSelectCashCode("pJenisPembayaran", res[0].KODE_JENIS_PEMBAYARAN);
            $("#pIdScf").val(res[0].ID_SCF);
            $("#pTglTransaksi").val(res[0].TGL_TRANSAKSI);
            $("#pTglJatuhTempo").val(res[0].JATUH_TEMPO);
            $("#pPajak").val(parseFloat(res[0].PAJAK).toString());
            $("#pPajakBank")
                .val(res[0].PAJAK_BANK)
                .mask('000,000,000,000,000.00',{reverse : true});
            $("#pRateJasaGiro").val(res[0].RATE_JASA_GIRO);
            $("#pCurrecny").val(res[0].CURRENCY);
            $("#pOriCurr")
                .val(res[0].ORI_CURRENCY*100)
                .mask('000,000,000,000,000.00',{reverse : true});
            $("#pKurs").val(res[0].KURS);
            $("#pFeeTransaksi").val(res[0].FEE_TRANSAKSI);
            $("#pCashCollateral").val(res[0].CASH_COLLATERAL);
            $("#pCurrecny, #pbankCounterparty, #pJenisPembayaran").select2({
                width : "100%",
                theme : "bootstrap"
            });
            $("#pVendor").select2({
                width : "100%",
                theme : "bootstrap",
                placeholder: 'Cari vendor...',
                minimumInputLength: 3,
                ajax : {
                    url : baseUrl + "/api_master/vendor/get_data_vendor_sap",
                    dataType : "JSON",
                    delay : 500,
                    data : function (params) {
                        return {
                            pNamaVendor : params.term
                        };
                    },
                    processResults : function (data, page) {
                        console.log(data);
                        return {
                            results :$.map(data, function (items) {
                                return {
                                    text : items.VALUE,
                                    id : items.ID
                                };
                            })
                        };
                    },
                    cache : true
                }
            }).val(res[0].VENDOR).trigger("change");
            setTimeout(function () {
               $('#edit-scf-modal').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

// USED
function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pembayaran").val());
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function show_modal(id) {
    idGiro = id;
    $('#edit-reverse-modal').modal({backdrop: 'static', keyboard: false});
}

// USED
function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pJenisPembayaran) {
    showLoadingCss();
    $('#table-scf tbody').empty();
    $('#table-scf').dataTable().fnDestroy();

    table_scf = $('#table-scf').DataTable({
            "serverSide": true,
            "oSearch": {"sSearch": tempTableSearch},
            "bLengthChange": true,
            "scrollY": "100%",
            "scrollX": "100%",
            "searching": false,
            "ordering": false,
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
                { className: "datatables_action", "targets": [11] },
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
                        return full.TGL_TRANSAKSI;
                    }

                },
                {
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return full.JATUH_TEMPO;
                    }

                },

                {
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return full.TENOR;
                    }

                },
                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return full.VENDOR;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return full.JENIS_PEMBAYARAN;
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.CURRENCY;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.ORI_CURRENCY, 2, ".", ",");
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.KURS, 2, ".", ",");
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.EQ_IDR, 2, ".", ",");
                    }

                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return full.FEE_TRANSAKSI;
                    }

                },
                {
                    "aTargets": [12],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_FEE_TRANSAKSI, 2, ".", ",");
                    }

                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        return full.CASH_COLLATERAL;
                    }

                },
                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_COLLATERAL, 2, ".", ",");
                    }

                },
                {
                    "aTargets": [15],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.RATE_JASA_GIRO,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [16],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.NOMINAL_JASA_GIRO,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [17],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.PAJAK,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [18],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.PAJAK_PLN,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [19],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.PAJAK_BANK,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [20],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.NET_JASA_GIRO,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [21],
                    "mRender": function (data, type, full) {
                        return accounting.format(full.NET_GAIN,2, ".", ",") ;
                    }

                },
                {
                    "aTargets": [22],
                    "mRender": function (data, type, full) {
                           var ret_value;
                         ret_value =
                             '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_SCF + '\')"><i class="fas fa-edit"></i></button>'+
                             '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-success" title="Upload/Lihat File" onclick="upload_file(\'' + full.ID_SCF + '\')"><i class="fas fa-upload"></i></button>'+
                             '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_SCF + '\')"><i class="fas fa-trash"></i></button>' ;
                         return ret_value;
                    }
                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/supply_chain_financing/get_scf_collateral_data",
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
                            pJenisPembayaran : pJenisPembayaran
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
    table_scf.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_length').each(function () {
        var html = '<label style="margin-left: 250px; cursor:default; text-align: center;"><b>SUPPLY CHAIN FINANCING COLLATERAL</b><br><b>TANGGAL :</b> <a id="start_date"></a><b> s.d </b><a id="finish_date"></a></label>';
        $(this).append(html);
    });

    table_scf.columns.adjust();
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

function setSelectCashCode(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_cash_code",
        dataType: 'JSON',
        type: "GET",
        sync :true,


        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.CASH_CODE + '">'+val.CASH_CODE+'-'+val.CASH_DESCRIPTION+'</option>');
            });
//            // // console.log("jenis pemb : ", idForSelected);
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pBankPembayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function upload_file(pIdScf) {
    $("#modal-upload-file").modal("show");
    $("#temp_id_scf_file").val(pIdScf);

    getScfFiles(pIdScf);
}

function upload_server(jenisFile) {
    $("#modal-upload-file").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);
    let fileSize;

    if (jenisFile === "6") {
        formData.append('file', $('input[type=file]#file_pendukung')[0].files[0]);
        fileSize = $('input[type=file]#file_pendukung')[0].files[0].size / 1000;
        $("#file_pendukung").val('');
    } else if (jenisFile === "7") {
        formData.append('file', $('input[type=file]#file_lembar_verifikasi')[0].files[0]);
        fileSize = $('input[type=file]#file_lembar_verifikasi')[0].files[0].size / 1000;
        $("#file_lembar_verifikasi").val('');
    } else if (jenisFile === "8") {
        formData.append('file', $('input[type=file]#file_lainya')[0].files[0]);
        fileSize = $('input[type=file]#file_lainya')[0].files[0].size / 1000;
        $("#file_lainya").val('');
    }

    formData.append('pIdScf', $("#temp_id_scf_file").val());
    formData.append('pJenisFile', jenisFile);
    formData.append('pFileSize', fileSize);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/supply_chain_financing/upload_files_pembayaran",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.return == 1) {
                alert("Sukses upload file");
                getScfFiles($("#temp_id_scf_file").val());
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

function getScfFiles(pIdScf) {
    $("#btn_download_file_pendukung").replaceWith('<a href="" id="btn_download_file_pendukung">-</a>');
    $("#btn_download_file_verifikasi").replaceWith('<a href="" id="btn_download_file_verifikasi">-</a>');
    $("#btn_download_file_lainya").replaceWith('<a href="" id="btn_download_file_lainya">-</a>');
    $.ajax({
        url: baseUrl + "api_operator/supply_chain_financing/get_list_file_scf",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdScf: pIdScf
        },

        success: function (data) {
            $.each(data.file_scf.return, function (index, val) {
                if (val.JENIS_FILE == "6") {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn_download_file_pendukung"><i class="fas fa-file-download"></i> ' + val.NAMA_FILE.substr(val.NAMA_FILE.indexOf("\\")+1) + ' </a>';
                        $("#btn_download_file_pendukung").replaceWith(html);
                    }else{
                        var html = '<a id="btn_download_file_pendukung">-</a>';
                        $("#btn_download_file_pendukung").replaceWith(html);
                    }
                }else if (val.JENIS_FILE == "7") {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn_download_file_verifikasi"><i class="fas fa-file-download"></i> ' + val.NAMA_FILE.substr(val.NAMA_FILE.indexOf("\\")+1) + '</a>';
                        $("#btn_download_file_verifikasi").replaceWith(html);
                    }else {
                        var html = '<a id="btn_download_file_verifikasi">-</a>';
                        $("#btn_download_file_verifikasi").replaceWith(html);
                    }
                }else if (val.JENIS_FILE === "8") {
                    if (val.NAMA_FILE != "" || val.NAMA_FILE != null) {
                        var html = '<a target="_blank" href="/filePath/' + val.NAMA_FILE + '" id="btn_download_file_lainya"><i class="fas fa-file-download"></i> ' + val.NAMA_FILE.substr(val.NAMA_FILE.indexOf("\\")+1) + '</a>';
                        $("#btn_download_file_lainya").replaceWith(html);
                    }else {
                        var html = '<a id="btn_download_file_lainya">-</a>';
                        $("#btn_download_file_lainya").replaceWith(html);
                    }
                }
            });
        },
        error: function () {
            console.log("Gagal mengambil data files rekap")
        }
    });
}

function validateForm(form_name){
    let empty=0;
    $(form_name)
        .find("select, input, textarea")
        .each(function(){
            if (($(this).prop("required") && $(this).val() === "") || ($(this).prop("required") && $(this).val() === null)){
                empty++;
            }
        });
    return empty;
}