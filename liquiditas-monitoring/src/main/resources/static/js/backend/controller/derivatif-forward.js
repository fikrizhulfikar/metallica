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

    $('#pPeruntukanDana').select2({
        width: '100%'
    });

    setSelectBank("cmb_bank","FILTER","","","DERIVATIF");

    setSelectCurr("cmb_currecny","FILTER","","DERIVATIF");
    setSelectTenor("cmb_tenor","FILTER","");
    search("load");
    getAllData();
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

    $("#pTglDeal").val("");
    $("#pTglJatuhTempo").val("");
    $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
    $("#pJam").val("");
    $("#pNationalAmount").val("");
    $("#pDealRate").val("");
    $("#pForwardPoint").val("");
    $("#pBungaDeposito").val("");
    $("#pPeruntukanDana").select2("val","");

    setSelectCurr("pCurr","","","REKAP","DERIVATIF");
    setSelectBank("pBank","","PEMBAYAR","","DERIVATIF");
    setSelectTenor("pTenor","","");
    setSelectSumberDana("pSumberDana","");
    // setSelectPeruntukanDana("pPeruntukanDana","");
    setSelectJenisPembayaran("pPeruntukanDana","","");
    $('#edit-derivatif-forward').modal({backdrop: 'static', keyboard: false});

}

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
                console.log("delete log : ", res)
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    location.reload();
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
            idDeviratif = id
            console.log("data edit_data :",res);

            $("#pTglDeal").val(res[0].TGL_DEAL);
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $("#pJam").val(res[0].JAM_DEAL);
            $("#pNationalAmount").val(res[0].NATIONAL_AMOUNT);
            $("#pDealRate").val(res[0].DEAL_RATE);
            $("#pForwardPoint").val(res[0].FORWARD_POINT);
            $("#pBungaDeposito").val(res[0].BUNGA_DEPOSITE_HEDGING);
            $("#pKursJisdor1").val(res[0].KURS_JISDOR1);

            setSelectCurr("pCurr","",res[0].CURRENCY,"DERIVATIF");
            setSelectBank("pBank","","PEMBAYAR",res[0].ID_BANK_CONTERPARTY,"DERIVATIF");
            setSelectTenor("pTenor","",res[0].ID_TENOR);
            setSelectSumberDana("pSumberDana",res[0].ID_SUMBER_DANA);
            setSelectJenisPembayaran("pPeruntukanDana","",res[0].ID_PERUNTUKAN_DANA);
            $("#pStatusDeviratif").val(res[0].STATUS_DERIVATIF);

            setTimeout(function(){ $('#edit-derivatif-forward').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function ins_data() {
    showLoadingCss();
    console.log("idDeviratif : ",idDeviratif);
    console.log("p tgl deal tempo : ",$("#pTglDeal").val()+"T"+$("#pJam").val());
    console.log("peruntukan dana : ",$("#pPeruntukanDana").val());

    var newtgl = $("#pTglDeal").val();
    var resTgl = newtgl.split("/");
    var newJam = $("#pJam").val();
    var resJam = newJam.split(":");
    var datetime = resTgl[0]+resTgl[1]+resTgl[2]+resJam[0]+resJam[1];
    console.log(datetime);

    $.ajax({
        url: baseUrl+"api_operator/derivatif/ins_data",
        dataType: 'JSON',
        type: "POST",
        data : {
            pIdProduct : "1",
            pIdDeviratif : idDeviratif,
            pTglDeal : datetime,
            pBank : $("#pBank").val(),
            pTglJatuhTempo : $("#pTglJatuhTempo").val(),
            pTenor : $("#pTenor").val(),
            pCurr : $("#pCurr").val(),
            pNationalAmount : $("#pNationalAmount").val(),
            pDealRate : $("#pDealRate").val(),
            pForwardPoint : $("#pForwardPoint").val(),
            pKursJisdor1 : $("#pKursJisdor1").val(),
            pBungaDeposito : $("#pBungaDeposito").val(),
            pPeruntukanDana : $("#pPeruntukanDana").val(),
            pSumberDana : $("#pSumberDana").val(),
            pStatusDeviratif : $("#pStatusDeviratif").val()
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("ins log : ",res);
            if(res.return == 1){
                alert(res.OUT_MSG);
                //location.reload();
                search("load");
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
            pIdProduct : "1",
            pTglAwal :  $("#tanggal_awal").val(),
            pTglAkhir : $("#tanggal_akhir").val(),
            pBank : $("#cmb_bank").val(),
            pCurr : $("#cmb_currecny").val(),
            pTenor : $("#cmb_tenor").val()
        },
        success: function (res) {
            console.log(res);
            allData = res;
        },
        error: function () {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
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
    window.open(baseUrl + "api_operator/derivatif/xls/1/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/"+$("#cmb_tenor").val());
}

function generatePDF() {
    console.log("all data  : "+allData);
    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK COUNTERPARTY",
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
        text: "DEAL RATE (SPOT/TODAY)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "FORWARD POINT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "FORWARD RATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KURS JISDOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PENDAPATAN/(BEBAN)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BIAYA HEDGING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BUNGA DEPOSITO UNTUK HEDGING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NET BIAYA HEDGING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NET BUY NOTIONAL AMOUNT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SUMBER DANA",
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
            JAM: v.JAM_DEAL,
            TANGGAL_JATUH_TEMPO: v.TGL_JATUH_TEMPO,
            TENOR: v.TENOR,
            NOTIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT,2,".",","),
            DEAL_RATE: accounting.formatNumber(v.DEAL_RATE,2,".",","),
            FORWARD_POINT: accounting.formatNumber(v.FORWARD_POINT,2,".",","),
            FORWARD_RATE: accounting.formatNumber(v.FORWARD_RATE,2,".",","),
            KURS_JISDOR: accounting.formatNumber(v.KURS_JISDOR1,2,".",","),
            PENDAPATAN: accounting.formatNumber(v.PENDAPATAN1,2,".",","),
            BIAYA_HEDGING: accounting.formatNumber(v.BIAYA_HEDGING,2,".",","),
            BUNGA_DEPOSITO_UNTUK_HEDGING: accounting.formatNumber(v.BUNGA_DEPOSITE_HEDGING,2,".",","),
            NET_BIAYA_HEDGING: accounting.formatNumber(v.NET_BIAYA_HEDGING,2,".",","),
            NET_BUY_NATIONAL_AMOUNT: accounting.formatNumber(v.NET_BUY_NATIONAL_AMOUNT,2,".",","),
            SUMBER_DANA: v.SUMBER_DANA,
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
            console.log(row);
            dataRow.push(row["NO"]);
            dataRow.push(row["BANK_COUNTERPARTY"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push(row["TANGGAL_DEAL"]);
            dataRow.push(row["JAM"]);
            dataRow.push(row["TANGGAL_JATUH_TEMPO"]);
            dataRow.push(row["TENOR"]);
            dataRow.push({text:row["NOTIONAL_AMOUNT"],alignment: "right"});
            dataRow.push({text: row["DEAL_RATE"],alignment: "right"});
            dataRow.push({text:row["FORWARD_POINT"],alignment: "right"});
            dataRow.push({text:row["FORWARD_RATE"],alignment: "right"});
            dataRow.push({text:row["KURS_JISDOR"],alignment: "right"});
            dataRow.push({text:row["PENDAPATAN"],alignment: "right",noWrap: true });
            dataRow.push({text:row["BIAYA_HEDGING"],alignment: "right"});
            dataRow.push({text:row["BUNGA_DEPOSITO_UNTUK_HEDGING"],alignment: "right"});
            dataRow.push({text:row["NET_BIAYA_HEDGING"],alignment: "right"});
            dataRow.push({text:row["NET_BUY_NATIONAL_AMOUNT"],alignment: "right"});
            dataRow.push(row["SUMBER_DANA"]);
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
            text: "DERIVATIF FORWARD",
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
                fontSize: 7,
                bold: true,
                margin: [0, 0, 0, 5]
            },
            subheader: {
                fontSize: 6,
                margin: [0, 5, 0, 3]
            },
            tableExample: {
                fontSize: 5
            },
            tableHeader: {
                bold: true,
                fontSize: 6,
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
            { width: 160, targets: 16 },
            { width: 115, targets: 17 },
            { width: 205, targets: 18 },
            { width: 90, targets: 19 },
            { className: "datatables_action", "targets": [ 7 ,8, 9, 10, 11, 12, 13, 14, 15, 16] },
            {
                "bSortable": true,
                "aTargets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
            }
            ,
            {
                "aTargets": [ 20 ],
                "mRender": function ( data, type, full ) {
                   if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                       return "-"
                   }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_DERIVATIF + '\')"><i class="fa fa-pencil"></i></button>' +
                            '<button style="width: 15px !important;" class="btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_DERIVATIF + '\')"><i class="fa fa-remove"></i></button>' +
                            '</div>'
                        return ret_value;
                   }
                }

            },
            {
                "aTargets": [ 7 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.NATIONAL_AMOUNT,2,".",",")

                }

            },
            {
                "aTargets": [ 8 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.DEAL_RATE,2,".",",")

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

                    return accounting.formatNumber(full.KURS_JISDOR1,2,".",",")

                }

            },
            {
                "aTargets": [ 12 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.PENDAPATAN1,2,".",",")

                }

            },
            {
                "aTargets": [ 13 ],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.BIAYA_HEDGING,2,".",",")

                }

            },
            {
                "aTargets": [ 14],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.BUNGA_DEPOSITE_HEDGING,2,".",",")

                }

            },
            {
                "aTargets": [ 15],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.NET_BIAYA_HEDGING,2,".",",")

                }

            },
            {
                "aTargets": [ 16],
                "mRender": function ( data, type, full ) {

                    return accounting.formatNumber(full.NET_BUY_NATIONAL_AMOUNT,2,".",",")

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
                hideLoadingCss("")
                console.log("get log : ",res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "BANK_CONTERPARTY", "defaultContent": ""},
            {"data": "CURRENCY", "defaultContent": ""},
            {"data": "TGL_DEAL", "defaultContent": ""},
            {"data": "JAM_DEAL", "defaultContent": ""},
            {"data": "TGL_JATUH_TEMPO", "defaultContent": ""},
            {"data": "TENOR", "defaultContent": ""},
            {"data": "NATIONAL_AMOUNT", "defaultContent": ""},
            {"data": "DEAL_RATE", "defaultContent": ""},
            {"data": "FORWARD_POINT", "defaultContent": ""},
            {"data": "FORWARD_RATE", "defaultContent": ""},
            {"data": "KURS_JISDOR1", "defaultContent": ""},
            {"data": "PENDAPATAN1", "defaultContent": ""},
            {"data": "BIAYA_HEDGING", "defaultContent": ""},
            {"data": "BUNGA_DEPOSITE_HEDGING", "defaultContent": ""},
            {"data": "NET_BIAYA_HEDGING", "defaultContent": ""},
            {"data": "NET_BUY_NATIONAL_AMOUNT", "defaultContent": ""},
            {"data": "SUMBER_DANA", "defaultContent": ""},
            {"data": "PERUNTUKAN_DANA", "defaultContent": ""},
            {"data": "STATUS_DERIVATIF", "defaultContent": ""}
        ],
        "drawCallback": function( settings ) {

            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_derivatif_forward.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });

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
    console.log(formData);
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
            console.log("res",res);
            if (res.V_RETURN == 0) {
                alert("sukses");
//                location.reload();
                search("load");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_operator/derivatif/download/1/"+obj["ID_UPLOAD"];
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}