/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var idDeposito;
var idDetailDeposito = "";
var allData;
var table_deposito;
var table_deposito_header;
var tempTableSearch= "";
var cbParentArray = [];
var fullArray = [];

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    $('#tanggal_awal').datepicker({ dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");

    $("#pTglPenempatan").datepicker({ dateFormat: 'dd/mm/yy'});
    $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

    //setSelectBank("cmb_bank","FILTER","","","DEPOSITO");
    //setSelectCurr("cmb_currecny","FILTER","","DEPOSITO");
    //setSelectTenor("cmb_tenor","FILTER","");
    //setSelectKeterangan("cmb_ket","FILTER","","DEPOSITO");
    // search("load");

    initHeaderTable("");
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

function initHeaderTable(bank){
    showLoadingCss();
    $('#table_deposito_header').dataTable().fnDestroy();
    table_deposito_header = $("#table_deposito_header").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": true,
        "ordering": false,
        "scrollCollapse": true,
        "paging": true,
        "bLengthChange": true,
        "aoColumnDefs": [
            {width: 17, targets: 0, className: 'dt-body-center'},
            {width: 100, targets: 1,className: 'dt-body-center'},
            {width: 100, targets: 2,className: 'dt-body-center'},
            {width: 100, targets: 3,className: 'dt-body-center'},
            {width: 50, targets: 4,className: 'dt-body-center'},
            {className: "datatables_action", "targets": [0,1,2,3]},
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {
                    return full.ROW_NUMBER;
                },
            },
            {
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.NO_ACCOUNT;
                },

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.BANK_CONTERPARTY;
                },
            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return full.CURRENCY;
                },

            },
            {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    var ret_value = '<div class="btn-group">' +
                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Detail Data" onclick="detail_data(\'' + full.ID_DEPOSITO + '\',\'' + full.KODE_BANK + '\',\'' + full.BANK_CONTERPARTY + '\',\'' + full.NO_ACCOUNT + '\',\'' + full.CURRENCY + '\')"><i class="fa fa-info-circle"></i></button>';
                    if (newRoleUser[0] === "ROLE_ADMIN" ){
                        ret_value = ret_value +
                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data_header(\'' + full.ID_DEPOSITO + '\')"><i class="far fa-edit"></i></button>'+
                            '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_header_data(\'' + full.ID_DEPOSITO + '\')"><i class="fas fa-trash"></i></button>' +
                            '</div>';
                    }
                    return ret_value;
                },
            },
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/deposito/get_data_header",
                "type":
                    "GET",
                "dataType":
                    "json",
                "data":
                    {
                        pBank : bank
                    }
                ,
                "dataSrc":
                    function (res) {
                        hideLoadingCss();
                        return res.data;
                    }
            }
    });
}

function openFormNew() {
    $("#id_deposito_header").val("");
    $("#pBillyet").val("");
    setSelectBank("pBankCounterParty","","PEMBAYAR","","DEPOSITO");
    setSelectCurr("pCurrencyHeader","FILTER","","DEPOSITO");
    $('#edit-deposito-modal').modal({backdrop: 'static', keyboard: false});

}

$("#pTglJatuhTempo").datepicker({
    minDate: '0',
    maxDate: '+1Y+6M',
    dateFormat : 'dd/mm/yy',
    onSelect: function (dateStr) {
        var max = $(this).datepicker('getDate'); // Get selected date
        $('#datepicker').datepicker('option', 'maxDate', max || '+1Y+6M'); // Set other max, default to +18 months
        var start = $("#pTglPenempatan").datepicker("getDate");
        var end = $("#pTglJatuhTempo").datepicker("getDate");
        var days = (end - start) / (1000 * 60 * 60 * 24);
        $("#pTenor").val(days);
    }
});

function delete_header_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl+"api_operator/deposito/delete_header_data",
            dataType: 'JSON',
            type: "POST",
            data : {
                pIdDeposito : id
            },
            success: function (res) {
                hideLoadingCss();
                if(res.return == 1){
                    alert(res.OUT_MSG);
                    table_deposito_header.ajax.reload();
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

function edit_data_header(id) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/deposito/edit_header_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pIdDeposito : id
        },
        success: function (res) {
            hideLoadingCss("");
            $("#id_deposito_header").val(id);
            $("#pBillyet").val(res[0].NO_ACCOUNT);
            setSelectBank("pBankCounterParty","","PEMBAYAR",res[0].KODE_BANK,"DEPOSITO");
            setSelectCurr("pCurrencyHeader","FILTER",res[0].CURRENCY,"DEPOSITO");
            setTimeout(function(){ $('#edit-deposito-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function ins_data() {
    if (validateFormHeader("#form_header_deposito") > 0){
        alert("Silahkan lengkapi data terlebih dahulu!");
    }else {
        showLoadingCss();
        $.ajax({
            url: baseUrl+"api_operator/deposito/ins_header_data",
            dataType: 'JSON',
            type: "POST",
            data : {
                pIdDeposito : idDeposito,
                pBank : $("#pBankCounterParty").val(),
                pBillyet : $("#pBillyet").val(),
                pCurrencyHeader : $("#pCurrencyHeader").val()
            },
            success: function (res) {
                hideLoadingCss();
                if(res.return === "1"){
                    alert("DATA BERHASIL DITAMBAHKAN");
                    table_deposito_header.ajax.reload();
                    $('#edit-deposito-modal').modal('hide');
                }else{
                    alert("GAGAL");
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
            }
        });
    }
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
                search("load");
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
        alignment: "cneter"
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

function detail_data(id, bank,bank_counterparty,  billyet, curr){
    $("#deposito_detail").show();
    $("#header_deposito_row").hide();
    $("#btn_data_baru_header_deposito").hide();
    $("#judul_form").html(`${bank_counterparty} | ${billyet} | ${curr}`);

    $('#table-deposito tbody').empty();
    $('#table-deposito').dataTable().fnDestroy();
    table_deposito = $('#table-deposito').DataTable( {
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "300px",
        "scrollX": true,
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
            { width: 100, targets: 11 },
            { width: 60, targets: 12 },
            { width: 40, targets: 13 },
            { className: "datatables_action", "targets": [3 ,4 , 5, 9, 10, 11] },
            {
                "bSortable": true,
                "aTargets": [0,1,2,3,4,5,6,7,8,9,10,11]
            },
            {
                "aTargets": 0,
                "mRender": function ( data, type, full ) {
                    return full.ROW_NUMBER;
                }
            },
            {
                "aTargets": 1,
                "mRender": function ( data, type, full ) {
                    return full.BANK_CONTERPARTY;
                }
            },
            {
                "aTargets": 2,
                "mRender": function ( data, type, full ) {
                    return full.NO_ACCOUNT;
                }

            }
            ,
            {
                "aTargets": 3,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.NOMINAL,2,".",",");
                }
            },
            {
                "aTargets": 4,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.INTEREST,2,".",",");
                }
            },
            {
                "aTargets": 5,
                "mRender": function ( data, type, full ) {
                    return full.TGL_PENEMPATAN;
                }
            },
            {
                "aTargets": 6,
                "mRender": function ( data, type, full ) {
                    return full.JATUH_TEMPO;
                }
            },
            {
                "aTargets": 7,
                "mRender": function ( data, type, full ) {
                    return full.TGL_PENCAIRAN;
                }
            },
            {
                "aTargets": 8,
                "mRender": function ( data, type, full ) {
                    return full.JUMLAH_HARI;
                }
            },
            {
                "aTargets": 9,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.BUNGA_ACCRUAL, 2, ".", ",") ;
                }
            },
            {
                "aTargets": 10,
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.POKOK_BUNGA, 2, ".", ",");
                }
            },
            {
                "aTargets": 11,
                "mRender": function ( data, type, full ) {
                    return full.KETERANGAN;
                }
            },
            {
                "aTargets": [12],
                "mRender": function ( data, type, full ) {
                    if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                        return "-"
                    }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_detail_data(\'' + full.ID_DETAIL + '\', \'' + full.BANK_CONTERPARTY + '\')"><i class="fas fa-edit"></i></button>' +
                            '<button style="width: 15px !important;" class="btn btn-sm btn-danger" title="Delete" onclick="delete_detail_data(\'' + full.ID_DETAIL + '\')"><i class="fas fa-trash"></i></button>' +
                            '</div>';
                        return ret_value;
                    }
                }
            },
            {
                "aTargets": [13],
                "mRender": function (data, type, full) {
                    let json_string = JSON.stringify(full);
                    var full_value = '{"full":'+json_string.replace(/'/g,"")+'}';
                    if (full.JENIS === "PENCAIRAN"){
                        return "-";
                    }else{
                        return "<input class='cb' type='checkbox' data-full='"+full_value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                    }
                }
            }
        ],
        "ajax": {
            "url": baseUrl+"api_operator/deposito/get_detail_data",
            "type": "GET",
            "dataType" : "json",
            "data": {
                pIdDeposito : billyet
            },
            "dataSrc" : function(res){
                hideLoadingCss("")
                return res.data;
            }
        },
        "drawCallback": function( settings ) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
            $("#btn_kembali")
                .removeAttr('onclick')
                .attr('onclick', 'backToHeader()');
            $("#btn_tambah_detail")
                .removeAttr('onclick')
                .attr('onclick', 'openFormNewDetail("'+id+'","'+bank+'","'+bank_counterparty+'","'+billyet+'","'+curr+'")');
            $("#btn_pencairan_detail")
                .removeAttr('onclick')
                .attr('onclick', 'openFormPencairan("'+id+'","'+bank+'","'+bank_counterparty+'","'+billyet+'","'+curr+'")');
        },
        "createdRow" : (row, data, dataIndex) => {
            if ( data["JENIS"] === "PENCAIRAN" ) {
                $(row).css({
                    "color": "#ff6767",
                    "font-weight" : "bold",
                });
            };
        }
    });

    table_deposito.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });
    initCbparent();
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

function  initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        var pageNumber = table_deposito.page.info().page;
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

function openFormPencairan(id, bank,bank_counterparty, billyet, curr) {
    idDeposito = id;
    idDetailDeposito = "";
    if (fullArray.length <= 0){
        alert("Silahkan Pilih Data Terlebih Dahulu");
    }else{
        let total = fullArray.reduce(function (a,b) {
            return a + parseInt(b.NOMINAL);
        },0);
        let tot_accrual = fullArray.reduce(function (a,b) {
            return a + b.BUNGA_ACCRUAL;
        },0);
        let pokok_bunga = fullArray.reduce(function (a,b) {
            return a + b.POKOK_BUNGA;
        },0);

        $("#pDetailBankCounterPartyPencairan").val(bank_counterparty);
        $("#pDetailCounterPencairan").val(bank);
        $("#pDetailBillyetPencairan").val(billyet);
        $("#pDetailCurrencyPencairan").val(curr);
        $("#pPokokBunga").val(accounting.formatNumber(pokok_bunga, 2, ",", ".") );
        $("#pDetailBungaAccrual").val(accounting.formatNumber(tot_accrual, 2, ",", ".") );
        $("#pDetailNominalPencairan").val(accounting.formatNumber(total, 2, ",", "."));
        $("#pDetailTglPencairan").datepicker({dateFormat : "dd/mm/yy",minDate : "-7"});

        $("#modal_pecairan_deposito").modal({backdrop: false , keyboard: false})
    }
}

function openFormNewDetail(id, bank,bank_counterparty, billyet, curr) {
    let d = new Date();
    $("#form_input").find("input, select, textarea").val("");
    $("#pDetailTglPenempatan").datepicker({minDate : 0, dateFormat : "dd/mm/yy"});
    $("#pDetailTglPenempatanPencairan, #pDetailTglJatuhTempoPencairan").val(("0" + d.getDate()).slice(-2)+"/"+(("0" + d.getMonth()).slice(-2))+"/"+d.getFullYear());
    $("#pDetailBankCounterParty,#pDetailBankCounterPartyPencairan").val(bank_counterparty);
    $("#pDetailCounter, #pDetailCounterPencairan").val(bank);
    $("#pDetailCurrency, #pDetailCurrencyPencairan").val(curr);
    $("#pDetailBillyet,#pDetailBillyetPencairan").val(billyet);
    idDeposito = id;
    idDetailDeposito = "";

    $('#modal_detail_deposito').modal({backdrop: 'static', keyboard: false});
}

function backToHeader(){
    $("#deposito_detail").hide();
    $("#header_deposito_row").show();
    $("#btn_data_baru_header_deposito").show();
    table_deposito.destroy();
    table_deposito_header.ajax.reload();
}

$("#pDetailTglPenempatan").change(function () {
    var tglAwalData = $('#pDetailTglPenempatan').val();
    if (tglAwalData == "") {
        alert("Tanggal awal belum di tentukan");
        $('#pDetailTglJatuhTempo').val("");
    } else {
        $('#pDetailTglJatuhTempo')
            .attr("disabled", false)
            .val("")
            .datepicker("destroy")
            .datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function ins_detail_data(type) {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/deposito/ins_detail_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdDeposito: idDeposito,
            pIdDetail: idDetailDeposito,
            pJenis : (type === 1) ? "PENEMPATAN" : "PENCAIRAN",
            pBank : (type === 1) ? $("input[type=hidden]#pDetailCounter").val() : $("input[type=hidden]#pDetailCounterPencairan").val(),
            pBillyet : (type === 1) ? $("#pDetailBillyet").val() : $("#pDetailBillyetPencairan").val(),
            pNominal : (type === 1) ? $("#pDetailNominal").val() : $("#pDetailNominalPencairan").val().replace(/,/g,""),
            pInterest : (type === 1) ? $("#pDetailInterest").val().replace(/,/g,"") : "",
            pCurr : (type === 1) ? $("#pDetailCurrency").val() : $("#pDetailCurrencyPencairan").val(),
            pBungaAccrual : (type === 1) ? "" : $("#pDetailBungaAccrual").val().replace(/,/g,""),
            pPokokBunga : (type === 1) ? "" : $("#pPokokBunga").val().replace(/,/g,""),
            pTglPenempatan : (type === 1) ? $("#pDetailTglPenempatan").val() : "",
            pTglJatuhTempo : (type === 1) ? $("#pDetailTglJatuhTempo").val() : "",
            pTglPencairan : (type === 1) ? "" : $("#pDetailTglPencairan").val(),
            pKeterangan : (type === 1) ? "PENEMPATAN" : "PENCAIRAN",
        },
        success: function (res) {
            if (res.return == 1) {
                alert("DATA BERHASIL DISIMPAN");
                (type ===1 ) ? $('#modal_detail_deposito').modal('hide') : $('#modal_pecairan_deposito').modal('hide');
                table_deposito.ajax.reload();
                fullArray = [];
            } else {
                alert("GAGAL MENAMBAHKAN DATA");
            }
            hideLoadingCss("");
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function edit_detail_data(detail_id, bank) {
    showLoadingCss();
    $("#ex2-tabs-2, #ex2-tabs-1").removeClass("active show");
    $("#ex2-tab-2, #ex2-tab-1").removeAttr("data-toggle");
    $("#ex2-tab-2,#ex2-tab-1")
        .removeClass("active")
        .css('cursor','pointer');
    $.ajax({
        url: baseUrl+"api_operator/deposito/edit_detail_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pIdDetailDeposito : detail_id
        },
        success: function (res) {
            hideLoadingCss("");
            idDetailDeposito = detail_id;
            if (res.length > 0){
                let tp = new Date(res[0].TGL_PENEMPATAN);
                let jt = new Date(res[0].JATUH_TEMPO);
                let tc = new Date(res[0].TGL_PENCAIRAN);

                if (res[0].JENIS === "PENEMPATAN"){
                    $("input[type=hidden]#pDetailCounter").val(res[0].BANK_CONTERPARTY);
                    $("#pDetailInterest").val(res[0].INTEREST);
                    $("#pDetailBankCounterParty").val(bank);
                    $("#pDetailCurrency").val(res[0].CURRENCY);
                    $("#pDetailTglPenempatan")
                        .val(("0"+tp.getDate()).slice(-2)+"/"+("0"+(tp.getMonth()+1)).slice(-2)+"/"+tp.getFullYear())
                        .datepicker({dateFormat : "dd/mm/yy", minDate : "0"});
                    $("#pDetailTglJatuhTempo")
                        .val(("0"+jt.getDate()).slice(-2)+"/"+("0"+(jt.getMonth()+1)).slice(-2)+"/"+jt.getFullYear())
                        .datepicker({dateFormat : "dd/mm/yy", minDate : "0"});
                    // $("#pDetailKeterangan").val(res[0].KETERANGAN);
                    $("#pDetailNominal").val(res[0].NOMINAL);
                    $("#pDetailBillyet")
                        .attr("readonly","readonly")
                        .val(res[0].NO_ACCOUNT);

                    $("#ex2-tabs-1")
                        .addClass("active show")
                        .attr("data-toggle","tab");
                    $("#ex2-tab-2")
                        .css("cursor",'not-allowed');
                    $("#ex2-tab-1")
                        .addClass("active");

                    setTimeout(function () {
                        $('#modal_detail_deposito').modal({backdrop: 'static', keyboard: false});
                    }, timeSowFormEdit);
                }else{
                    $("#pDetailBankCounterPartyPencairan").val(bank);
                    $("input[type=hidden]#pDetailCounterPencairan").val(res[0].BANK_CONTERPARTY);
                    $("#pDetailCurrencyPencairan").val(res[0].CURRENCY);
                    $("#pDetailBungaAccrual").val( res[0].BUNGA_ACCRUAL);
                    $("#pDetailBillyetPencairan").val(res[0].NO_ACCOUNT);
                    $("#pDetailNominalPencairan").val(res[0].NOMINAL);
                    $("#pPokokBunga").val(res[0].POKOK_BUNGA);
                    $("#pDetailTglPencairan")
                        .val(("0"+tc.getDate()).slice(-2)+"/"+("0"+(tc.getMonth()+1)).slice(-2)+"/"+tc.getFullYear())
                        .datepicker({minDate : "-7", dateFormat : "dd/mm/yy"});
                    setTimeout(function () {
                        $('#modal_pecairan_deposito').modal({backdrop: false, keyboard: false});
                    }, timeSowFormEdit);
                }
            }
            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function delete_detail_data(id_detail) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl+"api_operator/deposito/delete_detail_data",
            dataType: 'JSON',
            type: "POST",
            data : {
                pIdDetailDeposito : id_detail
            },
            success: function (res) {
                hideLoadingCss();
                if(res.return === 1){
                    alert(res.OUT_MSG);
                    table_deposito.ajax.reload();
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

function validateFormHeader(form_name){
    let empty=0;
    $(form_name)
        .find("select, input")
        .each(function(){
            if (($(this).prop("required") && $(this).val() === "") || $(this).val() === null || $(this).attr("selectedIndex") === 0){
                empty++;
            }
        });
    return empty;
}
