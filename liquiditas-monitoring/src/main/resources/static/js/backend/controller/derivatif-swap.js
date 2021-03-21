/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var idDeviratif;
var table_derivatif_swap;
var allData;
var tempTableSearch= "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    $('#tanggal_awal').datepicker({ dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    setSelectBank("cmb_bank","FILTER","","","DERIVATIF");
    setSelectCurr("cmb_currecny","FILTER","","DERIVATIF");
    search("load");
});

$("#tanggal_awal").change(function() {
    var tglAwalData = $('#tanggal_awal').val();
    if(tglAwalData == ""){
        // alert("Tanggal awal belum di tentukan");
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
    $('#pTglDeal').datepicker({ dateFormat: 'dd/mm/yy' });
    $("#edit-derivatif-swap").find(".modal-title").html("Form New Data Derivatif Swap")
    $("#form_derivatif_swap").find("input[type=text], textarea, select")
        .val("")
        .prop("readonly", false);
    $("#pSwapPoint").prop("readonly", true);
    $("#pNationalAmount, #pKursBeli, #pSpotRate, #pForwardRate, #pKursJual").mask('000,000,000,000,000.00',{reverse : true});
    setSelectCurr("pCurr","","","DERIVATIF");
    setSelectBank("pBankCounterParty","","PEMBAYAR","","DERIVATIF");
    $('#edit-derivatif-swap').modal({backdrop: 'static', keyboard: false});
}

$("#pKursBeli, #pKursJual").on("keyup", function(){
    let sum = parseInt($("#pKursBeli").val().replace(/,/g,"")) - parseInt($("#pKursJual").val().replace(/,/g,""));
    $("#pSwapPoint").val((isNaN(sum) ? "0" : sum.toString()));
});

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

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/derivatif/delete_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdProduct: "2",
                pIdDerivatif: id,
            },
            success: function (res) {
                hideLoadingCss("")
                // console.log("delete log : ", res)
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_derivatif_swap.ajax.reload();
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
    showLoadingCss()
    $.ajax({
        url: baseUrl+"api_operator/derivatif/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pIdProduct : "2",
            pIdDerivatif : id,
        },
        success: function (res) {
            hideLoadingCss("");
            idDeviratif = id;

            $("#edit-derivatif-swap").find(".modal-title").html("Form Edit Data Derivatif Swap")
            $("#pNationalAmount, #pKursBeli, #pSpotRate, #pForwardRate, #pKursJual").unmask();

            $("#pDocNoLegOne").val(res[0].DOC_NO).prop('readonly' , true);
            $("#pDocNoLegTwo").val(res[0].DOC_NO2);
            // $('#pBankCounterParty').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $("#pTglDeal").val(res[0].TGL_DEAL);
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO).prop('readonly' , true);
            $("#pTenor").val(res[0].TENOR).prop('readonly' , true);
            $("#pCurr").val(res[0].CURRENCY).prop('readonly' , true);
            $("#pNationalAmount").val(parseInt(res[0].NATIONAL_AMOUNT)*100).prop('readonly' , true);
            $("#pSpotRate").val(parseInt(res[0].SPOT_RATE)*100).prop('readonly' , true);
            $("#pForwardRate").val(parseInt(res[0].FORWARD_RATE)*100).prop('readonly' , true);
            $("#pKursJual").val(parseInt(res[0].KURS_JUAL)*100).prop('readonly' , true);
            $("#pSwapPoint").val(parseInt(res[0].SWAP_POINT)*100);
            $("#pKursBeli").val(parseInt(res[0].KURS_BELI)*100);
            $("#pKeterangan").val(res[0].KETERANGAN);

            $("#pNationalAmount, #pSpotRate, #pForwardRate, #pKursJual, #pSwapPoint, #pKursBeli").mask('000,000,000,000,000.00',{reverse : true});

            setSelectCurr("pCurr","",res[0].CURRENCY,"DERIVATIF");
            setSelectBank("pBankCounterParty","","PEMBAYAR",res[0].KODE_BANK,"DERIVATIF");
            // setSelectTenor("pTenor","",res[0].ID_TENOR);
            // setSelectSumberDana("pSumberDana",res[0].ID_SUMBER_DANA);
            // setSelectJenisPembayaran("pPeruntukanDana","",res[0].ID_PERUNTUKAN_DANA);
            $("#pStatusDeviratif").val(res[0].STATUS_DERIVATIF);

            setTimeout(function(){ $('#edit-derivatif-swap').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
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
            pIdProduct : "2",
            pIdDeviratif : idDeviratif,
            pTglDeal : $("#pTglDeal").val(),
            pDocNo1 : $("#pDocNoLegOne").val(),
            pDocNo2 : $("#pDocNoLegTwo").val(),
            pBank : $("#pBankCounterParty").val(),
            pTglJatuhTempo : $("#pTglJatuhTempo").val(),
            pTenor : $("#pTenor").val(),
            pCurr : $("#pCurr").val(),
            pNationalAmount : $("#pNationalAmount").val().replace(/,/g,""),
            pSpotRate : $("#pSpotRate").val().replace(/,/g,""),
            pForwardRate : $("#pForwardRate").val().replace(/,/g,""),
            pKursJual : $("#pKursJual").val().replace(/,/g,""),
            pKursBeli : $("#pKursBeli").val().replace(/,/g,""),
            pSwapPoint : $("#pSwapPoint").val().replace(/,/g,""),
            pKeterangan : $("#pKeterangan").val()
        },
        success: function (res) {
            hideLoadingCss("");
            // console.log("ins log : ",res);
            if(res.return == 1){
                alert(res.OUT_MSG);
                search("load");
                $('#edit-derivatif-swap').modal('hide');
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
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/derivatif/get_all_derivatif",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdProduct : "2",
            pTglAwal :  $("#tanggal_awal").val(),
            pTglAkhir : $("#tanggal_akhir").val(),
            pBank : $("#cmb_bank").val(),
            pCurr : $("#cmb_currecny").val(),
            pTenor : $("#cmb_tenor").val()
        },
        success: function (res) {
            // console.log(res);
            allData = res;
        },
        error: function () {
            // console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
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
    window.open(baseUrl + "api_operator/derivatif/xls/2/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/ALL");
}

function generatePDF() {
    // console.log("all data  : "+allData);
    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "CURRENCY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL DEAL",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "JAM",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL JATUH TEMPO",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TENOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOTIONAL AMOUNT (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "LEG 1 FIXING RATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "LEG 1 NOTIONAL AMOUNT(IDR)",
        style: "tableHeader",
        alignment: "center"
    });
    // column.push({
    //     text: "LEG 1 KURS JIDOR",
    //     style: "tableHeader",
    //     alignment: "center"
    // });
    // column.push({
    //     text: "LEG 1 PENDAPATAN/(BEBAN)",
    //     style: "tableHeader",
    //     alignment: "center"
    // });
    column.push({
        text: "LEG 2 SWAP POINT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "LEG 2 SWAP RATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "LEG 2 NATIONAL AMOUNT (IDR)",
        style: "tableHeader",
        alignment: "center"
    });
    // column.push({
    //     text: "LEG 2 \nKURS \nJIDOR",
    //     style: "tableHeader",
    //     alignment: "center"
    // });
    // column.push({
    //     text: "LEG 2 PENDAPATAN/(BEBAN)",
    //     style: "tableHeader",
    //     alignment: "center"
    // });
    column.push({
        text: "BIAYA SWAP",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BUNGA DEPOSITO UNTUK HEDGING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NET BIAYA SWAP",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SUMBER",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PERUNTUKAN DANA",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "STATUS",
        style: "tableHeader",
        alignment: "center"
    });


    var externalDataRetrievedFromServer = []
    $.each(allData, function( index, v ) {
        var helloooow = {
            NO: v.ROW_NUMBER,
            BANK_COUNTERPARTY: v.BANK_CONTERPARTY,
            CURRENCY: v.CURRENCY,
            TANGGAL_DEAL: v.TGL_DEAL,
            TANGGAL_JATUH_TEMPO: v.TGL_JATUH_TEMPO,
            JAM: v.JAM_DEAL,
            TENOR: v.TENOR,
            NOTIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT,2,".",","),
            LEG_1_FIXING_RATE: accounting.formatNumber(v.FIXING_RATE,2,".",","),
            LEG_1_NATIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT1,2,".",","),
            // LEG_1_KURS_JIDOR: accounting.formatNumber(v.KURS_JISDOR1),
            // LEG_1_PENDAPATAN: accounting.formatNumber(v.PENDAPATAN1),
            LEG_2_SWAP_POINT: accounting.formatNumber(v.SWAP_POINT,2,".",","),
            LEG_2_SWAP_RATE: accounting.formatNumber(v.SWAP_RATE,2,".",","),
            LEG_2_NATIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT2,2,".",","),
            // LEG_2_KURS_JIDOR: accounting.formatNumber(v.NET_BUY_NATIONAL_AMOUNT),
            // LEG_2_PENDAPATAN: accounting.formatNumber(v.SUMBER_DANA),
            BIAYA_SWAP: accounting.formatNumber(v.BIAYA_SWAP,2,".",","),
            BUNGA_DEPOSITO_UNTUK_HEDGING: accounting.formatNumber(v.BUNGA_DEPOSITE_HEDGING,2,".",","),
            NET_BIAYA_SWAP: accounting.formatNumber(v.NET_BIAYA_SWAP,2,".",","),
            SUMBER: v.SUMBER_DANA,
            PERUNTUKAN_DANA: v.PERUNTUKAN_DANA,
            STATUS: v.STATUS_DERIVATIF
        }
        externalDataRetrievedFromServer.push(helloooow)
    });

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function(row) {
            var dataRow = [];
            // console.log(row);
            dataRow.push(row["NO"]);
            dataRow.push(row["BANK_COUNTERPARTY"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push(row["TANGGAL_DEAL"]);
            dataRow.push(row["JAM"]);
            dataRow.push(row["TANGGAL_JATUH_TEMPO"]);
            dataRow.push(row["TENOR"]);
            dataRow.push({text:row["NOTIONAL_AMOUNT"],alignment: "right"});
            dataRow.push({text:row["LEG_1_FIXING_RATE"],alignment: "right"});
            dataRow.push({text:row["LEG_1_NATIONAL_AMOUNT"],alignment: "right"});
            // dataRow.push({text:row["LEG_1_KURS_JIDOR"],alignment: "right"});
            // dataRow.push({text:row["LEG_1_PENDAPATAN"],alignment: "right"});
            dataRow.push({text:row["LEG_2_SWAP_POINT"],alignment: "right"});
            dataRow.push({text:row["LEG_2_SWAP_RATE"],alignment: "right"});
            dataRow.push({text:row["LEG_2_NATIONAL_AMOUNT"],alignment: "right"});
            // dataRow.push({text:row["LEG_2_KURS_JIDOR"],alignment: "right"});
            // dataRow.push({text:row["LEG_2_PENDAPATAN"],alignment: "right"});
            dataRow.push({text:row["BIAYA_SWAP"],alignment: "right"});
            dataRow.push({text:row["BUNGA_DEPOSITO_UNTUK_HEDGING"],alignment: "right"});
            dataRow.push({text:row["NET_BIAYA_SWAP"],alignment: "right"});
            dataRow.push(row["SUMBER"]);
            dataRow.push(row["PERUNTUKAN_DANA"]);
            dataRow.push(row["STATUS"]);
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
        content: [ {
            text: "DERIVATIF SWAP",
            style: "header",
            alignment: "center"
        }, {
            text: "Tanggal Cetak : "+getDataNow(),
            style: "subheader"
        },
            table(externalDataRetrievedFromServer, column)
        ],
        styles: {
            header: {
                fontSize: 6,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 6,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 4
            },
            tableHeader: {
                bold: true,
                fontSize: 5,
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

function upload_xls(pIdDerivatif){
    $("#modal-upload-xls").modal("show");
    $("#temp-xls").val(pIdDerivatif);

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


    formData.append('pIdDerivatif', $("#temp-xls").val());
    // console.log(formData);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/derivatif/upload_xls",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            // console.log("res",res);
            if (res.V_RETURN == 0) {
                alert("sukses");
//                location.reload();
                search("load");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_operator/derivatif/download/2/"+obj["ID_UPLOAD"];
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function initDataTable(pTglAwal,pTglAkhir,pBank,pCurrency,pTenor){
    showLoadingCss()
    $('#table-derivatif-swap tbody').empty();
    $('#table-derivatif-swap').dataTable().fnDestroy();
    table_derivatif_swap = $('#table-derivatif-swap').DataTable( {
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searsching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY":        "300px",
        "scrollX":        true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            { width: 20, targets: 0 },
            { width: 100, targets: 1 },
            { width: 150, targets: 2 },
            { width: 110, targets: 3 },
            { width: 100, targets: 4 },
            { width: 100, targets: 5 },
            { width: 100, targets: 6 },
            { width: 150, targets: 7 },
            { width: 110, targets: 8 },
            { width: 150, targets: 9 },
            { width: 100, targets: 10 },
            { width: 100, targets: 11 },
            { width: 130, targets: 12 },
            { width: 110, targets: 13 },
            { width: 150, targets: 14 },
            { width: 150, targets: 15 },
            { width: 150, targets: 16 },
            { width: 50, targets: 17 },
            {
                "bSortable": false,
                "aTargets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
            }
            ,
            {
                "aTargets": [ 17 ],
                "mRender": function ( data, type, full ) {
                   if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                       return "-"
                   }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_DERIVATIF + '\')"><i class="fas fa-edit"></i></button>' +
                            '<button style="width: 15px !important;" class="btn btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_DERIVATIF + '\')"><i class="fas fa-trash"></i></button>' +
                            '</div>';
                        return ret_value;
                    }

                }

            }
            ,
            {
                "aTargets": [ 0 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.ROW_NUMBER;

                }

            },
            {
                "aTargets": [ 1 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.DOC_NO;

                }

            },
            {
                "aTargets": [ 2 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.DOC_NO2;

                }

            },
            {
                "aTargets": [ 3 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.BANK;

                }

            },
            {
                "aTargets": [ 4 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.CURRENCY;

                }

            },
            {
                "aTargets": [ 5 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.NATIONAL_AMOUNT,2,".",",");

                }

            },
            {
                "aTargets": [ 6 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.TGL_DEAL;

                }

            },
            {
                "aTargets": [ 7 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.TGL_JATUH_TEMPO;

                }

            },
            {
                "aTargets": [ 8 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return full.TENOR;

                }

            },
            {
                "aTargets": [ 9 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.KURS_JUAL,2,".",",");

                }

            },
            {
                "aTargets": [ 10 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.SELL_NATIONAL_AMOUNT_USD,2,".",",");

                }

            },
            {
                "aTargets": [ 11 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.SWAP_POINT,2,".",",");

                }

            },
            {
                "aTargets": [ 12 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.KURS_BELI,2,".",",");

                }

            },
            {
                "aTargets": [ 13 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.BUY_NATIONAL_AMOUNT_USD,2,".",",");

                }

            },
            {
                "aTargets": [ 14 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.JISDOR,2,".",",");

                }

            },
            {
                "aTargets": [ 15 ],
                "sClass": "datatables_action",
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.BEBAN_PENDAPATAN,2,".",",");

                }

            },
            {
                "aTargets": [ 16 ],
                "sClass": "datatables_action",
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
                pStatusDerivatif : "2"
            },
            "dataSrc" : function(res){
                hideLoadingCss("")
                // console.log("get log : ",res);
                return res.data;
            }
        },
        "drawCallback": function( settings ) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_derivatif_swap.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        // console.log(value); // <-- the value
        tempTableSearch = value;
    });


}

