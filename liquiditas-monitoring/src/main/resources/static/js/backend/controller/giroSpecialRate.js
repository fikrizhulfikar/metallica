var table_rekapitulasi;
var idGiro = "";
var allData;
var tempVendor = "";
var tempCurrency = "";
var tempUnit = "";
var tempTableSearch = "";
var fullArray = [];

var checkedArray = [];
var cbParentArray = [];
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

function selectStatus(value) {
    if (value != 1) {
        $("#pTglJatuhTempo").prop('disabled', false);
    } else {
        $("#pTglJatuhTempo").prop('disabled', true);
        $("#pTglJatuhTempo").val("");
    }
}

function openFormNew() {
    $("#id_giro_special_rate_plus").val("");
    $("#form_penambah, #form_pengurang").find('input[type="number"], input[type="text"], textarea').val("");
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
                    fullArray = [];
                    checkedArray = [];
                    ch
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
                pIdGiro: (type === 1) ? $("#id_giro_special_rate_plus").val() : (type === 2) ? $("#id_giro_special_rate_wd").val() : $("#id_giro_special_rate_ex").val(),
                pTglJatuhTempo: (type === 1) ? $("#pTglJatuhTempo").val() : (type === 2) ? "" : $("#pTglJatuhTempoPerpanjangan").val(),
                pTglPenempatan: (type === 1) ? $("#pTglPenempatan").val() : (type === 2) ? "" : $("#pTglPenempatanPerpanjangan").val(),
                pCurr: (type === 1) ? $("#pCurrecny").val() : (type === 2) ? $("#pCurrecnyWd").val() : $("#pCurrecnyPerpanjangan").val(),
                pBankTujuan: (type === 1) ? $("#pBankTujuan").val() : (type === 2) ? $("#pBankTujuanWd").val() : $("#pBankTujuanPerpanjangan").val(),
                pPajak: (type === 1) ? $("#pPajak").val() :(type === 2) ? $("#pPajakWd").val() : "",
                pInterest: (type === 1) ? $("#pInterest").val() : (type === 2) ? $("#pInterestWd").val() : $("#pInterestPerpanjangan").val(),
                pNominal: (type === 1) ? $("#pNominal").val().replace(/,/g,"") : (type === 2) ? $("#pNominalWd").val().replace(/,/g,"") : $("#pNominalPerpanjangan").val().replace(/,/g,""),
                pProduk: (type === 1) ? $("#pProduk").val() : (type === 2) ? $("#pProdukWd").val() : $("#pProdukPerpanjangan").val(),
                pKeterangan : (type === 1) ? $("#pKeterangan").val() : (type === 2) ? $("#pKeteranganPengurang").val() : $("#pKeteranganPerpanjangan").val(),
                pJenis : (type === 1) ? "PENEMPATAN" : (type === 2) ? "PENCAIRAN" : "PERPANJANGAN",
                pJasaGiro : (type === 1) ? $("#pJasaGiro").val().replace(/,/g,"") : (type === 2) ? $("#pJasaGirolWd").val() : ""
            },
            success: function (res) {
                hideLoadingCss("");
                var result = res.return.split(";")[0];
                if (result == 1 || result == '1') {
                    alert("Data Berhasil Disimpan");
                    search("load");
                    $('#edit-rekap-modal').modal('hide');
                    table_rekapitulasi.ajax.reload();
                    fullArray = [];
                    checkedArray = [];
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
            hideLoadingCss("");
            setSelectCurr("pCurrecny, #pCurrecnyPengurang", "", res[0].CURRENCY, "REKAP");
            setSelectBank2("pBankTujuan, #pBankTujuanPengurang", "", "GIRO_SPECIAL_RATE", res[0].KODE_BANK, "REKAP");
            $("#pNominal, #pJasaGiro, #pNominalPengurang").unmask();
            if (type === 'PENEMPATAN'){
                $("#id_giro_special_rate_plus").val(id);
                $("#pTglJatuhTempo")
                    .datepicker({dateFormat : 'dd/mm/yy', minDate : '0'})
                    .val(res[0].JATUH_TEMPO);

                $("#pTglPenempatan")
                    .datepicker({dateFormat : 'dd/mm/yy', minDate : '0'})
                    .val(res[0].TGL_PENEMPATAN);
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
                $("#id_giro_special_rate_min").val(id);
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
            "searching": true,
            'ordering' : false,
            "scrollCollapse": true,
            "lengthMenu": [[10, 25, 50, 100, 200, 400, 600, 1000], [10, 25, 50, 100, 200, 400, 600, 1000]],
            "aoColumnDefs": [
                {width: 20, targets: 0},
                {width: 100, targets: 1},
                {width: 100, targets: 2},
                {width: 100, targets: 3},
                {width: 100, targets: 4},
                {width: 120, targets: 5},
                {width: 130, targets: 6},
                {width: 100, targets: 7},
                {width: 100, targets: 8},
                {width: 100, targets: 9},
                {width: 100, targets: 10},
                {width: 120, targets: 11},
                {width: 170, targets: 12},
                {width: 90, targets: 13},
                {width: 60, targets: 14},
                {width: 60, targets: 15},
                {width: 60, targets: 16},
                {width: "20%", "targets": 0},
                { className: "datatables_action", "targets": [] },
                {"targets": [4, 9, 10, 11, 12], "className": 'dt-body-right'},
                {"targets": [0, 16], "className": 'dt-body-center'},
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
                        return full.ID_GIRO;
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return full.BANK;
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
                        return full.CURRENCY;
                    }

                },
                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL,2,".",",");
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return (full.INTEREST !== "-") ? full.INTEREST + "%" : "-";
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.TGL_PENEMPATAN;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return full.JATUH_TEMPO;
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return full.JUMLAH_HARI;
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.JASA_GIRO,2,".",",");
                    }

                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.PAJAK,2,".",",");
                    }

                },
                {
                    "aTargets": [12],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NET_JASA_GIRO, 2, ".",",");
                    }

                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.POKOK_JASA_GIRO, 2, ".",",");
                    }

                },
                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                        return full.KETERANGAN;
                    }
                },
                {
                    "aTargets": [15],
                    "mRender": function (data, type, full) {
                        return full.JENIS;
                    }
                },
                {
                    "aTargets": [16],
                    "mRender": function (data, type, full) {
                            var ret_value = '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_GIRO + '\')"><i class="fas fa-trash"></i></button>' ;;

                            if (full.JENIS === "PENEMPATAN"){
                                ret_value += '<button style="width: 15px !important; text-align: center;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_GIRO + '\',\'' + full.JENIS + '\')"><i class="fas fa-edit"></i></button>';
                            }
                         return ret_value;
                    }
                },
                {
                    "aTargets": [17],
                    "mRender": function (data, type, full) {
                        let json_string = JSON.stringify(full);
                        var full_value = '{"full":'+json_string.replace(/'/g,"")+'}';
                        if (full.JENIS === "PENCAIRAN" || full.JENIS === "PENGURANG"){
                            return "-";
                        }else{
                            return "<input class='cb' type='checkbox' data-full='"+full_value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                        }
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
            if(data.JENIS === "PENCAIRAN"){
                $(row).css('color', '#ea8d00');
            }
        }
        }
    );
    table_rekapitulasi.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_filter').each(function () {
        var html = '<button class="btn btn-info btn-sm" style="margin-left: 10px" type="button" data-toggle="modal" title="Pencairan" onclick="openFormWdGiro()"><i class="fas fa-hand-holding-usd"></i></button>';
        if(newRoleUser[0] == "ROLE_ADMIN"){
            html = html + '<button class="btn btn-sm btn-default" id="btn-verified" title="Perpanjangan" style="margin-left: 10px" type="button" onclick="openFormPerpanjanganGiro()"><i class="fas fa-calendar-day"></i></button>';
        }
        $(this).append(html);
    });
    initCbparent();
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
    let form = (form_type === 1) ? "#form_penambah" : (form_type === 2) ? "#form_wd" : "#form_ext";
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

function checkArray(e) {
    var isNew = true;
    var isNew1 = true;
    //// console.log ("Checked : ",e);
    if($(e).is(":checked")) {
        if(fullArray.length == 0) {
            fullArray.push($(e).data("full").full);
        }else {
            // test fikri
            for(let i = 0; i < fullArray.length; i++){
                var fullVal = JSON.stringify(fullArray[i]);
                var valCb2 = JSON.stringify($(e).data("full").full);
                if (fullVal == valCb2){
                    isNew = false;
                    break;
                }
            }

            if(isNew == true){
                fullArray.push($(e).data("full").full);
            }
        }
    }
    else {
        var total1 = $("#table-deposito input[type=checkbox]:checked").map(function () {
            return $(this).data("full");
        }).get().length;

        if(total1 == 0){
            $("#cbparent").prop('checked', false);
        }

        for (x = 0; x < fullArray.length; x++){
            let fullVal = JSON.stringify(fullArray[x]);
            let valCb2 = JSON.stringify($(e).data("full").full);
            if(fullVal == valCb2){
                fullArray.splice(x, 1);
            }
        }
    }
    console.log("Full Array : ", fullArray);
}

function initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        var pageNumber =table_rekapitulasi .page.info().page;
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

function openFormPerpanjanganGiro(id, bank_counterparty, bank) {
    idDeposito = id;
    idDetailDeposito = "";
    if (fullArray.length <= 0){
        alert("Silahkan Pilih Data Terlebih Dahulu");
    }else if (fullArray.length > 1){
        alert("Anda hanya bisa memilih satu giro untuk diperpanjang");
    }else{
        let total = fullArray.reduce(function (a,b) {
            return a + parseInt(b.NOMINAL);
        },0);

        setSelectBank2("pBankTujuanDis", "", "GIRO_SPECIAL_RATE", fullArray[0].KODE_BANK, "REKAP");
        $("#pBankTujuanPerpanjangan").val(fullArray[0].KODE_BANK);
        $("#pProdukPerpanjangan, #pProdukDis").val(fullArray[0].PRODUK);
        $("#pNominalPerpanjangan").val(accounting.formatNumber(total, 2, ",", ".") );
        $("#pInterestPerpanjangan").val(accounting.formatNumber(fullArray[0].INTEREST, 2, ",", ".") );
        setSelectCurr("pCurrecnyDis", "FILTER", fullArray[0].CURRENCY, "REKAP");
        $("#pCurrecnyPerpanjangan").val(fullArray[0].CURRENCY);
        $("#pTglPenempatanPerpanjangan").datepicker({minDate : "-7", dateFormat : "dd/mm/yy"})
        $('#modal_perpanjangan_giro').modal({backdrop: 'static', keyboard: false});
    }
}

$("#pTglPenempatanPerpanjangan").change(function() {
    var tglDeal = $('#pTglPenempatanPerpanjangan').val();
    if(tglDeal === ""){
        $('#pTglJatuhTempoPerpanjangan')
            .val("")
            .attr("disabled", "disabled");
    }else{
        $('#pTglJatuhTempoPerpanjangan')
            .val("")
            .datepicker( "destroy" )
            .attr("disabled", false)
            .datepicker({
            minDate: tglDeal,
            maxDate: '+1Y+6M',
            dateFormat : 'dd/mm/yy',
            onSelect: function (dateStr) {
                var max = $(this).datepicker('getDate'); // Get selected date
                $('#datepicker').datepicker('option', 'maxDate', max || '+1Y+6M'); // Set other max, default to +18 months
                var start = $("#pTglPenempatanPerpanjangan").datepicker("getDate");
                var end = $("#pTglJatuhTempoPerpanjangan").datepicker("getDate");
            }
        });
    }
});

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/giro_special_rate/xls_giro");
}

function openFormWdGiro() {
    idDeposito = '';
    idDetailDeposito = "";
    if (fullArray.length <= 0){
        alert("Silahkan Pilih Data Terlebih Dahulu");
    }else if (fullArray.length > 1){
        alert("Anda hanya bisa memilih satu giro untuk dicairkang");
    }else{
        let total = fullArray.reduce(function (a,b) {
            return a + parseInt(b.NOMINAL);
        },0);

        $("#pBankTujuanWdDis").val(fullArray[0].BANK);
        $("#pBankTujuanWd").val(fullArray[0].KODE_BANK);
        $("#pProdukWdDis").val(fullArray[0].PRODUK);
        $("#pProdukWd").val((fullArray[0].PRODUK === "GIRO OPTIMA") ? "OPTIMA" : "SPECIALRATE");
        $("#pCurrecnyWd").val(fullArray[0].CURRENCY);
        $("#pNominalWd").val(fullArray[0].NOMINAL);
        $("#pPajakWd").val(fullArray[0].PAJAK);
        $("#pInterestWd").val(fullArray[0].INTEREST);
        $("#pNetJasaGiroWd").val(fullArray[0].NET_JASA_GIRO);
        $("#pPokoJasaGiroWd").val(fullArray[0].POKOK_JASA_GIRO);
        $("#pJasaGirolWd").val(fullArray[0].JASA_GIRO);
        $("#pTglWd").datepicker({minDate : "-7", dateFormat : "dd/mm/yy"});

        $('#modal_pencairan_giro').modal({backdrop: 'static', keyboard: false});
    }

}