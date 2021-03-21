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
            {width: 50, targets: 3,className: 'dt-body-center'},
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
                    return full.BANK_CONTERPARTY;
                },
            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.NO_ACCOUNT;
                },

            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    var ret_value = '<div class="btn-group">' +
                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Detail Data" onclick="detail_data(\'' + full.ID_DEPOSITO + '\',\'' + full.KODE_BANK + '\',\'' + full.BANK_CONTERPARTY + '\',\'' + full.NO_ACCOUNT + '\')"><i class="fa fa-info-circle"></i></button>';
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

    idDeposito = "";
    $("#pNoBilyet").val("");
    setSelectBank("pBankCounterParty","","PEMBAYAR","","DEPOSITO");
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
            idDeposito = id
            $("#pBillyet").val(res[0].NO_ACCOUNT);
            setSelectBank("pBankCounterParty","","PEMBAYAR",res[0].KODE_BANK,"DEPOSITO");
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
                pBillyet : $("#pBillyet").val()
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

function detail_data(id, bank,bank_counterparty,  billyet){
    $("#deposito_detail").show();
    $("#header_deposito_row").hide();
    $("#btn_data_baru_header_deposito").hide();
    $("#judul_form").html(bank_counterparty +" | "+billyet);

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
            { width: 60, targets: 11 },
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
                    return full.JUMLAH_HARI;
                }
            },
            {
                "aTargets": 8,
                "mRender": function ( data, type, full ) {
                    return full.BUNGA_ACCRUAL;
                }
            },
            {
                "aTargets": 9,
                "mRender": function ( data, type, full ) {
                    return full.POKOK_BUNGA;
                }
            },
            {
                "aTargets": 10,
                "mRender": function ( data, type, full ) {
                    return full.KETERANGAN;
                }
            },
            {
                "aTargets": [11],
                "mRender": function ( data, type, full ) {
                    if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                        return "-"
                    }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_detail_data(\'' + full.ID_DETAIL + '\')"><i class="fas fa-edit"></i></button>' +
                            '<button style="width: 15px !important;" class="btn btn-sm btn-danger" title="Delete" onclick="delete_detail_data(\'' + full.ID_DETAIL + '\')"><i class="fas fa-trash"></i></button>' +
                            '</div>';
                        return ret_value;
                    }
                }

            },
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
                .attr('onclick', 'openFormNewDetail("'+id+'","'+bank+'","'+bank_counterparty+'","'+billyet+'")');
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
}

function openFormNewDetail(id, bank,bank_counterparty, billyet) {
    let d = new Date();
    $("#pDetailTglPenempatan").datepicker({minDate : 0, dateFormat : "dd/mm/yy"});
    $("#pDetailTglPenempatanPencairan, #pDetailTglJatuhTempoPencairan").val(("0" + d.getDate()).slice(-2)+"/"+(("0" + d.getMonth()).slice(-2))+"/"+d.getFullYear());
    $("#pDetailBankCounterParty,#pDetailBankCounterPartyPencairan").val(bank_counterparty);
    $("#pDetailCounter, #pDetailCounterPencairan").val(bank)
    $("#pDetailBillyet,#pDetailBillyetPencairan").val(billyet);
    idDeposito = id;

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
            pJenis : (type === 1) ? "INPUT" : "PENCAIRAN",
            pBank : (type === 1) ? $("input[type=hidden]#pDetailCounter").val() : $("input[type=hidden]#pDetailCounterPencairan").val(),
            pBillyet : (type === 1) ? $("#pDetailBillyet").val() : $("#pDetailBillyetPencairan").val(),
            pNominal : (type === 1) ? $("#pDetailNominal").val() : $("#pDetailNominalPencairan").val(),
            pInterest : (type === 1) ? $("#pDetailInterest").val() : "",
            pTglPenempatan : (type === 1) ? $("#pDetailTglPenempatan").val() : $("#pDetailTglPenempatanPencairan").val(),
            pTglJatuhTempo : (type === 1) ? $("#pDetailTglJatuhTempo").val() : $("#pDetailTglJatuhTempoPencairan").val(),
            pKeterangan : (type === 1) ? $("#pDetailKeterangan").val() : "",
        },
        success: function (res) {
            if (res.return == 1) {
                alert("DATA BERHASIL DISIMPAN");
                $('#modal_detail_deposito').modal('hide');
                table_deposito.ajax.reload();
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

function edit_detail_data(detail_id) {
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

                if (res[0].JENIS === "INPUT"){
                    $("input[type=hidden]#pDetailCounter").val(res[0].BANK_CONTERPARTY);
                    $("#pDetailInterest").val(res[0].INTEREST);
                    $("#pDetailTglPenempatan").val(("0"+tp.getDate()).slice(-2)+"/"+("0"+tp.getMonth()).slice(-2)+"/"+tp.getFullYear());
                    $("#pDetailTglJatuhTempo").val(("0"+jt.getDate()).slice(-2)+"/"+("0"+jt.getMonth()).slice(-2)+"/"+jt.getFullYear());
                    $("#pDetailKeterangan").val(res[0].KETERANGAN);
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
                }else{
                    $("#pDetailTglPenempatanPencairan").val(("0"+tp.getDate()).slice(-2)+"/"+("0"+tp.getMonth()).slice(-2)+"/"+tp.getFullYear());
                    $("#pDetailTglJatuhTempoPencairan").val(("0"+jt.getDate()).slice(-2)+"/"+("0"+jt.getMonth()).slice(-2)+"/"+jt.getFullYear());
                    $("#pDetailNominalPencairan").val(res[0].NOMINAL);
                    $("#pDetailBillyetPencairan").val(res[0].NO_ACCOUNT);
                    $("input[type=hidden]#pDetailCounterPencairan").val(res[0].BANK_CONTERPARTY);

                    $("#ex2-tabs-2")
                        .addClass("active show")
                        .attr("data-toggle","tab");
                    $("#ex2-tab-1")
                        .css("cursor",'not-allowed');
                    $("#ex2-tab-2")
                        .addClass("active");
                }
            }

            setTimeout(function () {
                $('#modal_detail_deposito').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
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
