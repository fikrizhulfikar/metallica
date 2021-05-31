/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var idDeviratif;
var table_derivatif_forward;
var allData;
var tempTableSearch= "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {

    $('#pTglNotaDinas').datepicker({ dateFormat: 'dd/mm/yy' });

    $('#pTglTagihan').datepicker({ dateFormat: 'dd/mm/yy' });
    $('#pTglDeal').datepicker({ dateFormat: 'dd/mm/yy' });
    $('#tanggal_awal').datepicker({ dateFormat: 'dd/mm/yy'});

    $('#tanggal_akhir').attr("disabled", "disabled");

    setSelectBank("cmb_bank","FILTER","","","DERIVATIF");
    setSelectCurr("cmb_currecny","FILTER","","DERIVATIF");
    search("load");
});

$("#tanggal_awal").change(function() {
    var tglAwalData = $('#tanggal_awal').val();
    if(tglAwalData == ""){
        $('#tanggal_akhir').val("");
        $('#tanggal_akhir').attr("disabled", "disabled");
    }else{
        $('#tanggal_akhir').val("");
        $('#tanggal_akhir').datepicker( "destroy" );
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({ dateFormat: 'dd/mm/yy' ,minDate:  tglAwalData});
    }
});

function openFormNew() {

    idDeviratif = "";

    $('#edit-derivatif-forward').find(".modal-title").html("Form New Data Derivatif Forward");

    $("#form_deposito_forward").find("input[type=text], textarea")
        .val("")
        .prop("readonly", false);
    $("#pTenor").prop("readonly", true);

    $("#pSpotRate, #pForwardRate, #pForwardPoint, #pKursJisdor1").mask('000,000,000,000,000.00',{reverse : true});

    setSelectCurr("pCurr","","","REKAP","DERIVATIF");
    setSelectBank("pBank","","PEMBAYAR","","DERIVATIF");
    //setSelectTenor("pTenor","","");
    //setSelectSumberDana("pSumberDana","");
    // setSelectPeruntukanDana("pPeruntukanDana","");
    //setSelectJenisPembayaran("pPeruntukanDana","","");
    $('#edit-derivatif-forward').modal({backdrop: 'static', keyboard: false});

}

$("#pTglDeal").change(function() {
    var tglDeal = $('#pTglDeal').val();
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
                var start = $("#pTglDeal").datepicker("getDate");
                var end = $("#pTglJatuhTempo").datepicker("getDate");
                var days = (end - start) / (1000 * 60 * 60 * 24);
                $("#pTenor").val(days);
            }
        });
    }
});

$("#pSpotRate, #pForwardRate").on("keyup", function(){
    let sum = parseInt($("#pForwardRate").val().replace(/,/g,"")) - parseInt($("#pSpotRate").val().replace(/,/g,""));
    $("#pForwardPoint").val((isNaN(sum) ? "0" : sum.toString()));
});

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/derivatif/delete_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdProduct: "1",
                pIdDerivatif: id,
            },
            success: function (res) {
                hideLoadingCss("")
                // console.log("delete log : ", res)
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_derivatif_forward.ajax.reload();
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

function edit_data(id) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/derivatif/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pIdProduct : "1",
            pIdDerivatif : id,
        },
        success: function (res) {
            hideLoadingCss("")
            idDeviratif = id;
            $('#edit-derivatif-forward').find(".modal-title").html("Form Edit Data Derivatif Forward");

            $("#form_deposito_forward").find("input[type=text], textarea")
                .val("")
                .prop("readonly", false);

            $("#pNationalAmount, #pSpotRate, #pForwardRate, #pForwardPoint, #pKursJisdor1").unmask();

            $("#pDocumentNumber").val(res[0].DOC_NO);
            $("#pTglDeal").val(res[0].TGL_DEAL);
            $('#pBank').val(res[0].BANK);
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $("#pTenor")
                .val(res[0].TENOR)
                .prop("readonly", true);
            $("#pCurr").val(res[0].CURRENCY);
            $("#pNationalAmount").val(parseInt(res[0].NATIONAL_AMOUNT)*100);
            $("#pSpotRate").val(parseInt(res[0].SPOT_RATE)*100);
            $("#pForwardRate").val(parseInt(res[0].FORWARD_RATE)*100);
            $("#pForwardPoint").val(parseInt(res[0].FORWARD_POINT)*100);
            $("#pKursJisdor1").val(parseInt(res[0].JISDOR)*100);
            $("#pKeterangan").val(res[0].KETERANGAN);

            $("#pNationalAmount, #pSpotRate, #pForwardRate, #pForwardPoint, #pKursJisdor1").mask('000,000,000,000,000.00',{reverse : true});
            $("#pDocumentNumber, #pBank, #pTenor, #pCurr, #pNationalAmount, #pForwardRate, #pForwardPoint, #pKursJisdor1").prop("readonly", true);

            setSelectCurr("pCurr","",res[0].CURRENCY,"DERIVATIF");
            setSelectBank("pBank","","PEMBAYAR",res[0].KODE_BANK,"DERIVATIF");

            setTimeout(function(){
                $('#edit-derivatif-forward').modal({backdrop: 'static', keyboard: false});
                }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function ins_data() {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/derivatif/ins_data",
        dataType: 'JSON',
        type: "POST",
        data : {
            pIdProduct : "1",
            pIdDeviratif : idDeviratif,
            pTglDeal : $("#pTglDeal").val(),
            pDocNo1 : $("#pDocumentNumber").val(),
            pBank : $("#pBank").val(),
            pTglJatuhTempo : $("#pTglJatuhTempo").val(),
            pTenor : $("#pTenor").val(),
            pCurr : $("#pCurr").val(),
            pNationalAmount : $("#pNationalAmount").val().replace(/,/g,""),
            pSpotRate : $("#pSpotRate").val().replace(/,/g,""),
            pForwardRate : $("#pForwardRate").val().replace(/,/g,""),
            pForwardPoint : $("#pForwardPoint").val().replace(/,/g,""),
            pKursJisdor1 : $("#pKursJisdor1").val().replace(/,/g,""),
            pKeterangan : $("#pKeterangan").val(),
        },
        success: function (res) {
            hideLoadingCss("")
            if(res.return == 1){
                alert(res.OUT_MSG);
                table_derivatif_forward.ajax.reload();
                $('#edit-derivatif-forward').modal('hide');
            }else{
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load"  && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_tenor").val())
        srcTglAwal = $("#tanggal_awal").val();
        srcTglAkhir = $("#tanggal_akhir").val();
    }
}

function exportXls() {
    var tglAwal = "null";
    if(srcTglAwal != ""){
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if(srcTglAkhir != ""){
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/derivatif/xls/1/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/ALL");
}

function initDataTable(pTglAwal,pTglAkhir,pBank,pCurrency,pTenor){
    showLoadingCss();
    $('#table-derivatif-forward tbody').empty();
    $('#table-derivatif-forward').dataTable().fnDestroy();
    table_derivatif_forward = $('#table-derivatif-forward').DataTable( {
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY":        "300px",
        "scrollX":        true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            { width: 125, targets: 1 },
            { width: 90, targets: 2 },
            { width: 130, targets: 3 },
            { width: 60, targets: 4 },
            { width: 135, targets: 5 },
            { width: 85, targets: 6 },
            { width: 130, targets: 7 },
            { width: 120, targets: 8 },
            { width: 105, targets: 9 },
            { width: 105, targets: 10 },
            { width: 105, targets: 11 },
            { width: 125, targets: 12 },
            { width: 125, targets: 13 },
            { width: 150, targets: 14 },
            { width: 115, targets: 15 },
            { width: 50, targets: 16 },

            { className: "datatables_action", "targets": [ 7 ,8, 9, 10, 11, 12, 13, 14, 15, 16] },
            {
                "bSortable": false,
                "aTargets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
            }
            ,
            {
                "aTargets": [ 16 ],
                "mRender": function ( data, type, full ) {
                   if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                       return "-"
                   }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_DERIVATIF + '\')"><i class="fas fa-edit"></i></button>' +
                            '<button style="width: 15px !important;" class="btn btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_DERIVATIF + '\')"><i class="fas fa-trash"></i></button>' +
                            '</div>'
                        return ret_value;
                   }
                }

            },
            {
                "aTargets": [ 0 ],
                "mRender": function ( data, type, full ) {

                    return full.ROW_NUMBER;

                }

            },
            {
                "aTargets": [ 1 ],
                "mRender": function ( data, type, full ) {

                    return full.DOC_NO;

                }

            },
            {
                "aTargets": [ 2 ],
                "mRender": function ( data, type, full ) {

                    return full.BANK;

                }

            },
            {
                "aTargets": [ 3 ],
                "mRender": function ( data, type, full ) {

                    return full.CURRENCY;

                }

            },
            {
                "aTargets": [ 4 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.NATIONAL_AMOUNT,2,".",",")

                }

            },
            {
                "aTargets": [ 5 ],
                "mRender": function ( data, type, full ) {

                    return full.TGL_DEAL;

                }

            },
            {
                "aTargets": [ 6 ],
                "mRender": function ( data, type, full ) {

                    return full.TGL_JATUH_TEMPO;

                }

            },
            {
                "aTargets": [ 7 ],
                "mRender": function ( data, type, full ) {

                    return full.TENOR;

                }

            },
            {
                "aTargets": [ 8 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.SPOT_RATE,2, ".", ",") ;

                }

            },
            {
                "aTargets": [ 9 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.FORWARD_POINT,2,".",",")

                }

            },
            {
                "aTargets": [ 10 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.FORWARD_RATE,2,".",",")

                }

            },
            {
                "aTargets": [ 11 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.JISDOR,2,".",",")

                }

            },
            {
                "aTargets": [ 12 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.BEBAN_PENDAPATAN,2,".",",")

                }

            },
            {
                "aTargets": [ 13 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.BEBAN_FORWARD_POINT,2,".",",")

                }

            },
            {
                "aTargets": [ 14 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.NET_BEBAN_PENDAPATAN,2,".",",")

                }

            },
            {
                "aTargets": [ 15 ],
                "mRender": function ( data, type, full ) {

                    return full.KETERANGAN;

                }

            }
        ],
        "ajax": {
            "url": baseUrl+"api_operator/derivatif/get_data",
            "type": "GET",
            "dataType" : "json",
            "data": {
                pTglAwal : pTglAwal,
                pTglAkhir : pTglAkhir,
                pBank : pBank,
                pCurrency : pCurrency,
                pTenor : pTenor,
                pStatusDerivatif : "1"
            },
            "dataSrc" : function(res){
                hideLoadingCss("");
                return res.data;
            }
        },
        "drawCallback": function( settings ) {

            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_derivatif_forward.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

}