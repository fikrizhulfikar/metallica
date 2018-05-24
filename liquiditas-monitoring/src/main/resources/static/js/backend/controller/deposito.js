/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var idDeposito;
var allData;
var table_deposito;
var tempTableSearch= "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    getAllData();

    $('#tanggal_awal').datepicker({ dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");

    $("#pTglPenempatan").datepicker({ dateFormat: 'dd/mm/yy'});
    $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

    setSelectBank("cmb_bank","FILTER","","","DEPOSITO");
    setSelectCurr("cmb_currecny","FILTER","","DEPOSITO");
    setSelectTenor("cmb_tenor","FILTER","");
    setSelectKeterangan("cmb_ket","FILTER","","DEPOSITO");
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

    idDeposito = "";

    $("#pNoBilyet").val("");
    $("#pNominal").val("");
    $("#pInterest").val("");
    $("#pTglPenempatan").val("");
    $("#pTglPenempatan").datepicker({ dateFormat: 'dd/mm/yy'});
    $("#pTglJatuhTempo").val("");
    $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

    setSelectBank("pBankCounterParty","","PEMBAYAR","","DEPOSITO");
    setSelectCurr("pCurr",null,"","DEPOSITO");
    setSelectTenor("pTenor","","");
    setSelectKeterangan("pKeterangan","","","DEPOSITO");
    $('#edit-deposito-modal').modal({backdrop: 'static', keyboard: false});

}

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl+"api_operator/deposito/delete_data",
            dataType: 'JSON',
            type: "POST",
            data : {
                pIdDeposito : id
            },
            success: function (res) {
                hideLoadingCss()
                console.log("delete log : ",res)
                if(res.return == 1){
                    alert(res.OUT_MSG);
                    location.reload();
                }else{
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
        url: baseUrl+"api_operator/deposito/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pIdDeposito : id
        },
        success: function (res) {
            hideLoadingCss("")
            idDeposito = id
            console.log("data edit_data :",res);

            $("#pNoBilyet").val(res[0].NO_ACCOUNT);
            $("#pNominal").val(res[0].NOMINAL);
            $("#pInterest").val(res[0].INTEREST);
            $("#pTglPenempatan").val(res[0].TGL_PENEMPATAN);
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);

            setSelectBank("pBankCounterParty","","PEMBAYAR",res[0].ID_BANK_CONTERPARTY,"DEPOSITO");
            setSelectCurr("pCurr","",res[0].CURRENCY,"DEPOSITO");
            setSelectTenor("pTenor","",res[0].ID_TENOR);
            setSelectKeterangan("pKeterangan","",res[0].ID_KETERANGAN,"DEPOSITO");
            $("#pStatus").val(res[0].STATUS_DEPOSITO);
            setTimeout(function(){ $('#edit-deposito-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function ins_data() {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/deposito/ins_data",
        dataType: 'JSON',
        type: "POST",
        data : {
            pIdDeposito : idDeposito,
            pBank : $("#pBankCounterParty").val(),
            pCurr : $("#pCurr").val(),
            pNoAccount : $("#pNoBilyet").val(),
            pNominal : $("#pNominal").val(),
            pInterest : $("#pInterest").val(),
            pTglpenempatan : $("#pTglPenempatan").val(),
            pTenor : $("#pTenor").val(),
            pTglJatuhTempo : $("#pTglJatuhTempo").val(),
            pKeterangan : $("#pKeterangan").val(),
            pStatusDeposito : $("#pStatus").val()
        },
        success: function (res) {
            hideLoadingCss();

            console.log("ins log : ",res);
            if(res.return == 1){
                alert(res.OUT_MSG);
                // location.reload();
                search("load");
                $('#edit-deposito-modal').modal('hide');
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
    if($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "" ){
        alert("Mohon Lengkapi Tgl Akhir");
    }else if(state == "load"){
        initDataTable("","","","ALL","ALL","ALL");
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
    else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_tenor").val(), $("#cmb_ket").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/deposito/get_all_deposito",
        dataType: 'JSON',
        type: "GET",
        data : {
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pCurr: $("#cmb_currecny").val(),
            pTenor: $("#cmb_tenor").val(),
            pKet: $("#cmb_ket").val()
        },
        success: function (res) {
            console.log(res);
            allData = res;
        },
        error: function () {
            console.log("cannot get data for report");
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
    window.open(baseUrl + "api_operator/deposito/xls/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/"+$("#cmb_tenor").val()+"/"+$("#cmb_ket").val());
}

function upload_xls(){
    $("#modal-upload-xls").modal("show");
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
        url: baseUrl + "api_operator/deposito/upload_xls",
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
                window.location = "../api_operator/deposito/download/"+obj["ID_UPLOAD"];
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
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
        text: "NO. / ACCOUNT BILYET",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOMINAL",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "INTEREST",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL PENEMPATAN",
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
        alignment: "center",
        margin : [10, 0, 10, 0]
    });
    column.push({
        text: "JUMLAH HARI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BUNGA",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "POKOK & BUNGA",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "COUNTDOWN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KETERANGAN",
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
        var sts = ""
        if(v.STATUS_DEPOSITO == "1" || v.STATUS_DEPOSITO == 1){
            sts = "AKTIF"
        }else{
            sts = "TIDAK AKTIF"
        }
        var helloooow = {
            NO: v.ROW_NUMBER,
            BANK_COUNTERPARTY: v.BANK_CONTERPARTY,
            CURRENCY: v.CURRENCY,
            BILYET: v.NO_ACCOUNT,
            NOMINAL: accounting.formatNumber(v.NOMINAL,2,".",","),
            INTEREST: v.INTEREST+" %",
            TANGGAL_PENEMPATAN: v.TGL_PENEMPATAN,
            TANGGAL_JATUH_TEMPO: v.TGL_JATUH_TEMPO,
            TENOR: v.TENOR,
            JUMLAH_HARI: v.JUMLAH_HARI,
            BUNGA: v.BUNGA,
            POKOK_BUNGA: accounting.formatNumber(v.POKOK_BUNGA,2,".",","),
            COUNTDOWN: v.COUNT_DOWN,
            KETERANGAN: v.KETERANGAN,
            STATUS: sts
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
            dataRow.push(row["BILYET"]);
            dataRow.push({
                text: row["NOMINAL"],
                alignment: "right"
            });
            dataRow.push({text:row["INTEREST"],alignment: "right"});
            dataRow.push(row["TANGGAL_PENEMPATAN"]);
            dataRow.push(row["TANGGAL_JATUH_TEMPO"]);
            dataRow.push(row["TENOR"]);
            dataRow.push(row["JUMLAH_HARI"]);
            dataRow.push(row["BUNGA"]);
            dataRow.push({
                text: row["POKOK_BUNGA"],
                alignment: "right"
            });
            dataRow.push({text:row["COUNTDOWN"],alignment: "right"});
            dataRow.push(row["KETERANGAN"]);
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
            text: "DEPOSITO",
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
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 9,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 7
            },
            tableHeader: {
                bold: true,
                fontSize: 8,
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

function initDataTable(pTglAwal,pTglAkhir,pBank,pCurrency,pTenor,pketerangan){
    console.log("pTglAwal : ",pTglAwal);
    console.log("pTglAkhir : ",pTglAkhir);
    console.log("pBank : ",pBank);
    console.log("pCurrency : ",pCurrency);
    console.log("pTenor : ",pTenor);
    console.log("pketerangan : ",pketerangan);
    showLoadingCss();
    $('#table-deposito tbody').empty();
    $('#table-deposito').dataTable().fnDestroy();
    table_deposito = $('#table-deposito').DataTable( {
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY":        "300px",
        "scrollX":        true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            { width: 125, targets: 1 },
            { width: 125, targets: 2 },
            { width: 85, targets: 3 },
            { width: 115, targets: 4 },
            { width: 125, targets: 5 },
            { width: 80, targets: 6 },
            { width: 115, targets: 7 },
            { width: 115, targets: 8 },
            { width: 90, targets: 9 },
            { width: 90, targets: 10 },
            { width: 115, targets: 11 },
            { width: 105, targets: 12 },
            { width: 105, targets: 13 },
            { width: 85, targets: 14 },
            { className: "datatables_action", "targets": [3 ,4 , 5, 9, 10, 11, 12] },
            {
                "bSortable": false,
                "aTargets": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
            }
            ,
            {
                "aTargets": [15],
                "mRender": function ( data, type, full ) {
                   if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                       return "-"
                   }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_DEPOSITO + '\')"><i class="fa fa-pencil"></i></button>' +
                            '<button style="width: 15px !important;" class="btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_DEPOSITO + '\')"><i class="fa fa-remove"></i></button>' +
                            '</div>'
                        return ret_value;
                    }
                }

            },
            {
                "aTargets": 4,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.NOMINAL,2,".",",")

                }

            },
            {
                "aTargets": 5,
                "mRender": function ( data, type, full ) {
                    return full.INTEREST + " %"

                }

            }
            ,
            {
                "aTargets": 10,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.BUNGA,2,".",",")

                }

            },
            {
                "aTargets": 11,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.POKOK_BUNGA,2,".",",")

                }

            }
        ],
        "ajax": {
            "url": baseUrl+"api_operator/deposito/get_data",
            "type": "GET",
            "dataType" : "json",
            "data": {
                pTglAwal : pTglAwal,
                pTglAkhir : pTglAkhir,
                pBank : pBank,
                pCurrency : pCurrency,
                pTenor : pTenor,
                pKeterangan : pketerangan
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
            {"data": "NO_ACCOUNT", "defaultContent": ""},
            {"data": "NOMINAL", "defaultContent": ""},
            {"data": "INTEREST", "defaultContent": ""},
            {"data": "TGL_PENEMPATAN", "defaultContent": ""},
            {"data": "TGL_JATUH_TEMPO", "defaultContent": ""},
            {"data": "TENOR", "defaultContent": ""},
            {"data": "JUMLAH_HARI", "defaultContent": ""},
            {"data": "BUNGA", "defaultContent": ""},
            {"data": "POKOK_BUNGA", "defaultContent": ""},
            {"data": "COUNT_DOWN", "defaultContent": ""},
            {"data": "KETERANGAN", "defaultContent": ""},
            {"data": "STATUS_DEPOSITO", "defaultContent": ""}

        ],
        "drawCallback": function( settings ) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_deposito.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });

}