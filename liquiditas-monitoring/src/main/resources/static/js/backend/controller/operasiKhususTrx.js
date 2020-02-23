/**
 * Created by israjhaliri on 8/23/17.
 */
var tableOperasiKhusus ;
var tblOperasiKhususDetail ;
var tableMain;
var isUpdate = "0";
var tempTableSearch = "";
var checkedArray = new Array();
var cbParentArray = new Array();
var OperasiKhusus = null;
var srcTglAwal = "";
var srcTglAkhir = "";
$(document).ready(function () {
    initDataTable();
    $('#tanggal_awal').datepicker({dateFormat: 'yymmdd'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#tanggal_akhir').datepicker({dateFormat: 'yymmdd'});
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");

});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'yymmdd', minDate: tglAwalData});
    }
});

function getbyId(id) {
    showLoadingCss()
    
    $.ajax({
        url: baseUrl + "api_master/bank/get_bank_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id
        },
        success: function (res) {
            hideLoadingCss()
            console.log("get by id : ", res);
            $("#pKodeBank").val(res[0].KODE_BANK);
            $("#pKodeBank").prop('disabled', true);
            $("#pNamaBank").val(res[0].NAMA_BANK);
            $("#pJenis").val(res[0].JENIS);
            $("#pFlag").val(res[0].FLAG_TAMPIL);
            isUpdate = "1"
        },
        error: function () {
            hideLoadingCss()
            alert("Gagal Melakukan Proses, Harap Hubungi Administrator")
        }
    });
}

function AddToTable() {
    var docno = $("#pDetailDocumentNumber").val();
    var drcrind = $("#pDetailDrCrInd").val();
    var busarea = $("#pDetailBusArea").val();
    var pmtpropid = $("#pDetailPmtProposalId").val();
    var glaccount = $("#pDetailGlAccount").val();
    var postdate = $("#pDetailPostDate").val();
    var compcode = $("#pDetailCompCode").val();
    var amt = $("#pDetailAmount").val();
    var curr = $("#pDetailCurrency").val();
    var fiscyear = $("#pDetailFiscYear").val();
    var ref = $("#pDetailReference").val();
    var remarks = $("#pDetailRemarks").val();
    var lineno = $("#pDetailLineNo").val();
    var exrate = $("#pDetailExchangeRate").val();
    var cash_code = $("#pDetailCashCode").val();
    var cost_ctr = $("#pDetailCostCtr").val();
    var sumber_dana = $("#pSumberDana").val();
    var flag = 0;
    let amount = 0;

    if (cost_ctr.length < 10 || cost_ctr.length > 10){
        Swal.fire("Maaf", "Cost Center harus 10 digit angka valid", "info");
        return;
    }

    (exrate === "undefined" || exrate === "-") ? amount = amount : amount = amt * exrate;
    console.log("Amt :",amt);
    console.log("Exrate :",exrate);
    console.log("Amount :",amount);
    if (drcrind === "" || glaccount === "" || amt === "" ||  cash_code === "") {
        Swal.fire("Maaf!","Mohon Lengkapi Data", "warning");
        return;
    } else {
        let rowNode = tblOperasiKhususDetail.row
            .add({
                "DOC_NO": docno,
                "PMT_PROPOSAL_ID" : pmtpropid,
                "COMP_CODE" : compcode,
                "CASH_CODE" : cash_code,
                "SUMBER_DANA" : sumber_dana,
                "FISC_YEAR" : fiscyear,
                "LINE_NO" : lineno,
                "DEBIT_CREDIT_IND" : drcrind,
                "GL_ACCOUNT" : glaccount,
                "AMOUNT" : amount,
                "CURRENCY" : curr,
                "COST_CTR" : cost_ctr,
                "BUSINESS_AREA" : busarea,
                "REMARKS" : remarks,
                "FLAG" : flag,
            })
            .draw(false)
            .node();
        $(rowNode)
            .css( 'color', 'black' )
            .animate( { color: '#ff590a' } );
    }
    $("#pDetailDrCrInd").val("");
    $("#pDetailGlAccount").val("");
    $("#pDetailAmount").val("");
    $("#pDetailRemarks").val("");
    $("#pSumberDana").val("");
}

function deletedb(idMetallica,idItem){
    Swal.fire({
        title : "Anda Yakin ?",
        text : "Anda yakin ingin menghapus data?",
        icon : "warning",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(result => {
        if (result.value == true){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/operasi_khusus_trx/delete_operasi_khusus_trx",
                type : "POST",
                data : {
                    pIdMetallica : idMetallica,
                    pItemId : idItem
                },
                success : (res) => {
                    console.log("get detail : ", res);
                    if (res.OUT_MSG === "DATA BERHASIL DI HAPUS" || res.return === 1){
                        hideLoadingCss();
                        Swal.fire("Berhasil!","Data Berhasil Dihapus","success");
                        tblOperasiKhususDetail.ajax.reload();
                    }else {
                        hideLoadingCss();
                        Swal.fire("Gagal!","Gagal Menghapus Data","danger");
                    }
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
                }
            })
        }
    })
}

function deleteHead (idMetallica){
    showLoadingCss();
    var del_confirm = confirm("Anda yakin ingin menghapus data ?");
    if(del_confirm){
        $.ajax({
            url : baseUrl + "api_operator/operasi_khusus_trx/delete_operasi_khusus_trx_head",
            dataType : "JSON",
            type : "POST",
            data : {
                pIdMetallica : idMetallica,
            },
            success : (result) => {
                console.log("Delete Result : ",result);
                hideLoadingCss("");
                // var result = res.return.split(";")[0];
                console.log("Result : "+result);
                if (result == 1 ) {
                    alert(result.OUT_MSG);
                    search("load");
                    $('#edit-modal').modal('hide');
                } else {
                    alert(result.OUT_MSG);
                }
            },
            error : () => {
                hideLoadingCss("Gagal Menghapus Data, Silahkan Hubungi Administrator");
            }
        });
    }else{
        hideLoadingCss("");
    }
    tableOperasiKhusus.ajax.reload();
}

function checkArray(e) {
    var isNew= true;
    if($(e).is(":checked")) {
        if(checkedArray.length == 0) {
            checkedArray.push($(e).data("value"));
        }else {
            for (x = 0; x < checkedArray.length; x++){
                var valArr = JSON.stringify(checkedArray[x]);
                var valCb = JSON.stringify($(e).data("value"));
                if(valArr == valCb){
                    isNew=false;
                    break;
                }
            }
            if(isNew == true){
                checkedArray.push($(e).data("value"));
            }
        }
    }
    else {
        var total = $("#table-rekapitulasi input[type=checkbox]:checked").map(function () {
            return $(this).data("value");
        }).get().length;
        if(total == 0){
            $("#cbparent").prop('checked', false);
        }
        for (x = 0; x < checkedArray.length; x++){
            var valArr = JSON.stringify(checkedArray[x]);
            var valCb = JSON.stringify($(e).data("value"));
            if(valArr == valCb){
                checkedArray.splice(x, 1);
            }
        }
    }
    console.log("Checked Array : ",checkedArray);
}

function update_datas() {
    var stateCrf = confirm("Anda Yakin Akan Merverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "/api_operator/operasi_khusus_trx/multi_upd_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray),
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG)
                    tableOperasiKhusus.ajax.reload();
                    checkedArray = new Array();
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

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/pembelian_valas_trx/xls/" + tglAwal + "/" + tglAkhir + "/" + $("#cmb_currecny").val());
}

function multi_upd_lunas() {
    var stateCrf = confirm("Anda Yakin Akan Merverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "/api_operator/operasi_khusus_trx/multi_upd_lunas",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray),
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG)
                    tableOperasiKhusus.ajax.reload();
                    checkedArray = new Array();
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

function multipleDelete() {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/operasi_khusus_trx/multiple_delete_head",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray)
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    tableOperasiKhusus.ajax.reload();
                    checkedArray.length = 0;
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

function dele() {
    $("#table-main-detail tbody").on('click','.btn-warning', function () {
        tblOperasiKhususDetail
            .row($(this).parents('tr'))
            .remove()
            .draw(false);
    });
}

function getTotalTagihanOperasi() {
    $.ajax({
        url: baseUrl + "/api_operator/operasi_khusus_trx/get_total_tagihan",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            currency: $("#cmb_currecny").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_tagihan").html(res);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/pembelian_valas_trx/get_pembelian_valas_trx",
        dataType: 'JSON',
        type: "GET",
        data: {
            pStatusValas: "0",
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pCurrency: $("#cmb_currecny").val(),
            pStatus: "",
            pStatusTracking: "",
        },
        success: function (res) {
            allData = res;
        },
        error: function (res) {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
        }
    });

}

function initDataTable(pTglAwal, pTglAkhir,  pCurrency, statusTracking) {
    showLoadingCss();
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();

    tableOperasiKhusus = $('#table-rekapitulasi').DataTable({
            "serverSide": true,
            "oSearch": {"sSearch": tempTableSearch},
            "bLengthChange": true,
            "scrollY": "100%",
            "scrollX": "100%",
            // "order": [3],
            "searching": true,
            bSortable: true,
            /*"scrollY": "300px",
            "scrollX": true,*/
            "scrollCollapse": true,
            "aoColumnDefs": [
            {width: 20, targets: 0},
            {width: 150, targets: 1},
            {width: 150, targets: 2},
            {width: 150, targets: 3},
            {width: 150, targets: 4},
            {width: 150, targets: 5},
            {width: 150, targets: 6},
            {width: 150, targets: 7},
            {width: 150, targets: 8},
            {width: 130, targets: 9},
            {width: 130, targets: 10},
            {width: 130, targets: 11},
            // {width: 100, targets: 35},
            // {width: 100, targets: 36},
            {width: "80%", "targets": 0},
            { className: "datatables_action", "targets": [9,2,10] },
            {
                "bSortable": true,
                "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10,11]
            },
            {
                "sortable": false,
                "aTargets": [0,11,12,13]
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
                    return full.DOCUMENT_DATE;
                }

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.POSTING_DATE;
                }

            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return full.DOCUMENT_NUMBER;
                }

            },
            {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return full.REFERENCE;
                }

            },
            {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return full.FISC_YEAR;
                }

            },
            {
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return full.COMPANY_CODE;
                }

            },
            {
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return full.BUSINESS_AREA;
                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    return full.CURRENCY;
                }

            },
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {
                    return (full.EXCHANGE_RATE !== "-") ? new Intl.NumberFormat().format(full.EXCHANGE_RATE) : "-";
                }

            },
            {
                "aTargets": [10],
                "mRender": function (data, type, full) {
                    return (full.TOTAL_TAGIHAN !== "-") ? new Intl.NumberFormat().format(full.TOTAL_TAGIHAN) : "-";
                }

            },
            {
                "aTargets": [11],
                "mRender": function (data, type, full) {
                    return full.DOC_HDR_TXT;
                }

            },
            {
                "aTargets" : [12],
                "mRender": (data, type, full) => {
                    return full.STATUS_TRACKING;
                }
            },

                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        var jenis = "OPERASI_KHUSUS";
                        console.log("Ini Full : "+full);
                        var ret_value;
                        /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                        /*    if(newRoleUser[0].includes("DIVKEU")){
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-pencil"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                    '</div>'
                            } */
                        if (newRoleUser[0] === "ROLE_MS_LIKUIDITAS" || newRoleUser[0] === "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else if(newRoleUser[0] === "ROLE_OSS" ){
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';

                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>';
                        }else {

                            if (full.STATUS_TRACKING === "INPUT DATA") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] === "ROLE_ADMIN" && full.TOTAL_TAGIHAN !== "-"){
                                    var full_value = full;
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_JA_CASH" && full.TOTAL_TAGIHAN !== "-"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_JA_IE" && full.TOTAL_TAGIHAN !== "-"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_FCL_SETTLEMENT" && full.TOTAL_TAGIHAN !== "-"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if (full.TOTAL_TAGIHAN === "-"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                            }
                            else   if (full.STATUS_TRACKING === "VERIFIED BY MAKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] === "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_CENTRALIZED_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                            }
                            else if (full.STATUS_TRACKING === "VERIFIED BY CHECKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] === "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_FOREIGN_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_VP_BUSINESS_MANAGEMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_INVESTMENT_EXPENDITURE_2"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_PRIMARY_ENERGY_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                            }

                            else if (full.STATUS_TRACKING === "VERIFIED BY APPROVER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] === "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }

                                if(newRoleUser[0] === "ROLE_VP_BUSINESS_MANAGEMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_PLH_EXECUTIVE_VICE_PRESIDENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                            }
                            else {
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DIAZ" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                    '</div>';
                            }
                        }
                        return ret_value;
                    }
                },
                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                        var value = new Object();
                        var data_full = new Object();
                        var ret_value = ''


                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else {
                            if (full.STATUS_TRACKING === "INPUT DATA") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","statustracking" : "'+1+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                            else if (full.STATUS_TRACKING === "VERIFIED BY MAKER") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","statustracking" : "'+2+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                            else if (full.STATUS_TRACKING === "VERIFIED BY CHECKER") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","statustracking" : "'+3+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                            else if (full.STATUS_TRACKING === "VERIFIED BY APPROVER") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","jenis" : "'+"OPERASI_KHUSUS"+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                            else {
                                value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';
                                // data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                        }

                        for (x=0; x<checkedArray.length;x++){
                            if(JSON.stringify(checkedArray[x]) === value){
                                return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox' checked>";
                            }
                        }
                        return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                    }
                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/operasi_khusus_trx/get_operasi_khusus_trx",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            pTglAwal: pTglAwal,
                            pTglAkhir: pTglAkhir,
                            pCurrency: pCurrency,
                            status: $("#cmb_status").val(),
                            statusTracking: statusTracking
                        }
                    ,
                    "dataSrc":
                        function (res) {
                            hideLoadingCss()
                            getTotalTagihanOperasi();
                            return res.data;
                        }
                }
            ,
            "drawCallback":
                function (settings) {
                    // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                    // $(".table ").css({"width":"100%"});
                    tableOperasiKhusus.columns.adjust();
                    var currentPageNumber = this.api().page.info().page;
                    for (x=0;x<cbParentArray.length;x++){
                        if(cbParentArray[x] == currentPageNumber){
                            $("#cbparent").prop('checked', true);
                            break;
                        }
                        else{
                            $("#cbparent").prop('checked', false);
                        }
                    }
                    $('th').addClass('th-middle');
                    $(".btn-update-status").hide();
                    $(".btn-edit-data").hide();
                    $(".btn-delete-data").hide();
                    $("#btn-add-rekap").hide();

                    $("#option-lunas").hide();
                    $("#option-input").hide();
                    $("#option-siap").hide();
                    if (newRoleUser.length > 0) {
                        for (var i = 0; i < newRoleUser.length; i++) {
                            if (newRoleUser[i] == "ROLE_KASIR_IDR" || newRoleUser[i] == "ROLE_KASIR") {
                                $(".btn-update-status").show();
                                $("#option-lunas").show();
                                $("#option-input").show();
                            } else if (newRoleUser[i] == "ROLE_ADMIN") {
                                $(".btn-update-status").show();
                                $(".btn-edit-data").show();
                                $(".btn-delete-data").show();
                                $("#btn-add-rekap").show();
                                $("#option-lunas").show();
                                $("#option-siap").show();
                                $("#option-input").show();
                            } else {
                                $(".btn-update-status").show();
                                $(".btn-edit-data").show();
                                $(".btn-delete-data").show();
                                $("#btn-add-rekap").show();
                                $("#option-siap").show();
                            }
                        }
                    }
                }
        }
    );
    tableOperasiKhusus.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_length').each(function () {
        var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
        $(this).append(html);
    });

    $('.dataTables_filter').each(function () {
//         var html = '';
//         console.log("ROLE : ",newRoleUser[0]);
        var html = '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
        if(newRoleUser[0] === "ROLE_JA_CASH") {
            html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
        }
        if(newRoleUser[0] === "ROLE_VP_LIQUIDITY_AND_RECEIPT" || newRoleUser[0] === "ROLE_VP_INVESTMENT_EXPENDITURE"
            || newRoleUser[0] === "ROLE_VP_BUSINESS_MANAGEMENT" || newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"
            || newRoleUser[0] === "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY" || newRoleUser[0] === "ROLE_VP_INVESTMENT_EXPENDITURE"
            || newRoleUser[0] === "ROLE_PLH_EXECUTIVE_VICE_PRESIDENT" || newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"
            || newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE") {
            html = html +'<button class="btn-edit-data btn-sm btn-primary" style="margin-left: 10px" type="button" title="Pelunasan" onclick="multi_upd_lunas()"><i class="fa fa-credit-card-alt"></i></button>';
        }
        if  (newRoleUser[0] === "ROLE_ADMIN"){
            html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
            html = html +'<button class="btn-edit-data btn-sm btn-primary" style="margin-left: 10px" type="button" title="Pelunasan" onclick="multi_upd_lunas()"><i class="fa fa-credit-card-alt"></i></button>';
        }
        $(this).append(html);
    });

    tableOperasiKhusus.columns.adjust();
    initCbparent();
}

function clearForm() {
    isUpdate = "0"
    $("#pKodeBank").val("");
    $("#pKodeBank").prop('disabled', false);
    $("#pNamaBank").val("");
}

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/operasi_khusus_trx/xls/" + tglAwal + "/" + tglAkhir + "/" + $("#cmb_currecny").val());
}

function upload_server_xls() {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    formData.append('pIdJenisFile', "2");
    console.log(formData);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_master/upload_xls",
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
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_master/download/2/"+obj["ID_UPLOAD"];
            }
            initDataTable();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
        var dataRow = [];
        dataRow.push(row["NO"]);
        dataRow.push(row["DOCUMENT_DATE"]);
        dataRow.push(row["POSTING_DATE"]);
        dataRow.push(row["DOCUMENT_NUMBER"]);
        dataRow.push(row["REFERENCE"]);
        dataRow.push(row["COMPANY_CODE"]);
        dataRow.push(row["BUSINESS_AREA"]);
        dataRow.push(row["CURRENCY"]);
        dataRow.push(row["DOC_HDR_TXT"]);
        body.push(dataRow);
    });

    return body;
}

var tracking = "";
function getDetails(id, doc_no, bus_area, comp_code, ref, prop_pmt_id, post_date, fisc_year, curr, exc_rate, track) {
    $(".list-data").hide();
    $(".detail-data").show();
    $("#filter").hide();
    $("#btn-add-rekap").hide();

    tracking = track;
    (track === "INPUT DATA" || newRoleUser[0] === "ROLE_ADMIN") ? $(".just-for-input-data").show() : $(".just-for-input-data").hide();
    // hideLoadingCss();
    showLoadingCss();
    tblOperasiKhususDetail = $("#table-main-detail").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/operasi_khusus_trx/detail_operasi_khusus_trx",
            "data" : {
                "pIdMetallica": id,
            },
            "type": "GET",
            "dataType": "json",
        },
        "columns" : [
            // {"data" : "DOC_NO"},
            // {"data" : "PMT_PROPOSAL_ID"},
            {"data" : "COMP_CODE"},
            {"data" : "CASH_CODE"},
            {"data" : "SUMBER_DANA"},
            // {"data" : "FISC_YEAR"},
            {"data" : "LINE_NO"},
            {"data" : "DEBIT_CREDIT_IND"},
            {"data" : "GL_ACCOUNT"},
            {
                "data" : null,
                "render" : function (data, type, row ) {
                    let number = parseInt(data.AMOUNT);
                    return Intl.NumberFormat().format(number);
                }
            },
            {"data" : "CURRENCY"},
            {"data" : "COST_CTR"},
            {"data" : "BUSINESS_AREA"},
            {"data" : "REMARKS"},
            {
                "data" : "FLAG",
                "visible" : false
            },
            {
                "data" : null,
                "render" : (data) => {
                    // console.log("Status Tracking : ", tracking);
                    // console.log("Flag : ", data.FLAG);
                    //
                    if(data.FLAG == 1 && newRoleUser[0] === "ROLE_JA_CASH"){
                        return '<td align="center"> <button class="btn btn-sm btn-danger" onclick="deletedb(\'' +data.ID_METALLICA+'\',\'' +data.ID_OPERASI_ITEM_TRX+ '\')"><i class="fa fa-trash"></i></button></td>';
                    }else if(data.FLAG === 0){
                        return '<td align="center"> <button class="btn btn-sm btn-warning" onclick="dele()"><i class="trash fa fa-trash"></i></button></td>';
                    }else return "=="

                }
            }
        ],
        "drawCallback" : function (settings) {
            let api = this.api();
            let rows = parseInt(api.rows().count())+1;
            $("#pDetailLineNo").val(rows.toString().padStart(3,"0"));
        },
        "footerCallback" : function (tfoot, data, start, end, display) {
            let api = this.api();
            //console.log("Data : ",data);
            let debit = 0;
            let credit = 0;
            let balance = 0;
            data.forEach(d => {
                if (d.DEBIT_CREDIT_IND === "C") credit = credit + parseInt(d.AMOUNT);
                if (d.DEBIT_CREDIT_IND === "D") debit = debit + parseInt(d.AMOUNT);
            });
            balance = debit-credit;
            console.log("Debit : ",debit);
            console.log("Credit : ", credit);
            console.log("Ballance : ",balance);

            $("#table-main-detail tfoot").find('td').eq(0).html("Debit : "+ new Intl.NumberFormat().format(debit));
            $("#table-main-detail tfoot").find('td').eq(1).html("Credit : "+ new Intl.NumberFormat().format(credit));
            $("#table-main-detail tfoot").find('td').eq(2).html("Balance : "+ new Intl.NumberFormat().format(balance));

            setBalance(balance);
        },
        "initComplete" : (data) => {
            // showToast('Successfully Load Table');
            hideLoadingCss();
        }
    });
    $("#pDetailGlAccount, #pSumberDana, #pDetailDrCrInd, #pDetailCashCode").select2({
        width : "100%",
    });

    OperasiKhusus = {
        pIdMetallica : id,
        pDocumentNumber : doc_no,
        operasiKhususDetails : null,
    }

    $("#pDetailExchangeRate").val((exc_rate === undefined || exc_rate === '-') ? 1 : exc_rate);
    $("#pDetailDocumentNumber").val(doc_no);
    $("#pDetailPmtProposalId").val(prop_pmt_id);
    $("#pDetailPostDate").val(post_date);
    $("#pDetailReference").val(ref);
    $("#pDetailBusArea").val(bus_area);
    $("#pDetailFiscYear").val(fisc_year);
    $("#pDetailCurrency").val(curr);
    $("#pDetailCompCode").val(comp_code);
    $("#pDetailExchangeRate, " +
        "#pDetailDocumentNumber, " +
        "#pDetailCurrency, " +
        "#pDetailPmtProposalId,#pDetailReference,#pDetailPostDate").attr("readonly","readonly");
    //$("#pDetailLineNo").val(comp_code);

    if(curr !== "IDR"){
        $(".pExchangeRate").show();
    }else{
        $(".pExchangeRate").hide();
    }
    dele();
    setListGlAccount("pDetailGlAccount",curr);
    setListCashcode("pDetailCashCode");
}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_currecny").val(), $("#cmb_status_tracking").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        var pageNumber = tableOperasiKhusus.page.info().page;
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

function openFormNew() {
    setListCurrency("pHeadCurrency");
    $(".pExcRate").hide();

    $("#pPostingDate").val("");
    $("#pDocDate").val("");
    $("#pDocNo").val("");
    $("#pReference").val("");
    $("#pCompCode").val("");
    $("#pBusArea").val("");
    $("#pCurrency").val("");
    $("#pDocHdrTxt").val("");

    // $("#pUnitAnggaran").select2("val", "");
    // $("#pSpread").val("");
    var date = new Date();
    // if(newRoleUser[0].replace(" ", "")!= "ROLE_ADMIN"){
    //     date = new Date(date.setDate(date.getDate() + addedDays));
    // }
    $('#pHeadPostingDate').datepicker({dateFormat: 'yymmdd', minDate: date});
    $('#pHeadDocDate').datepicker({dateFormat: 'yymmdd'});
    $('#edit-modal').modal({backdrop: 'static', keyboard: false});

}

function edit_data (idMetallica){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/operasi_khusus_trx/get_operasi_head_byid",
        dataType : "JSON",
        type : "GET",
        data : {
            pIdMetallica : idMetallica,
        },
        success : (res) => {
            console.log("data edit data : ",res);
            hideLoadingCss("");
            $("#pHeadDocDate").val(res.data[0].DOCUMENT_DATE);
            $("#pHeadPostingDate").val(res.data[0].POSTING_DATE);
            $("#pHeadDocNo").val(res.data[0].DOCUMENT_NUMBER);
            $("#pHeadReference").val(res.data[0].REFERENCE);
            $("#pHeadFiscYear").val(res.data[0].FISC_YEAR);
            $("#pHeadCompCode").val(res.data[0].COMPANY_CODE);
            $("#pHeadBusArea").val(res.data[0].BUSINESS_AREA);
            $("#pHeadCurrency").val(res.data[0].CURRENCY);
            $("#pHeadExchangeRate").val(res.data[0].EXCHANGE_RATE);
            $("#pHeadDocHdrTxt").val(res.data[0].DOC_HDR_TXT);
            $("#pIdMetallica").val(res.data[0].ID_METALLICA);
            if (res.data[0].CURRENCY === "IDR") {
                $("#pHeadExchangeRate").val(1);
                $(".pExcRate").hide();
            }

            setTimeout(function(){ $('#edit-modal').modal({backdrop: 'static', keyboard: false}); }, 1000);
        },
        error : (error)=>{
            console.log("Error");
        }
    });
}

function ins_data() {
    let idOperasiKhusus = $("#pIdMetallica").val();
    showLoadingCss("");
    (idOperasiKhusus === undefined || idOperasiKhusus === "") ? idOperasiKhusus = null : idOperasiKhusus=idOperasiKhusus;
    // console.log("id valas : ", idValas)
    $.ajax({
        url: baseUrl + "api_operator/operasi_khusus_trx/ins_operasi_khusus_trx",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdMetallica: idOperasiKhusus,
            pDocNo: $("#pHeadDocNo").val(),
            pDocDate: $("#pHeadDocDate").val(),
            pCompCode: $("#pHeadCompCode").val(),
            pReference: $("#pHeadReference").val(),
            pCurrency: $("#pHeadCurrency").val(),
            pPostDate: $("#pHeadPostingDate").val(),
            pBusArea: $("#pHeadBusArea").val(),
            pDocHdrTxt: $("#pHeadDocHdrTxt").val(),
            pExchangeRate: $("#pHeadExchangeRate").val(),
            pFiscYear: $("#pHeadFiscYear").val(),
        },
        success: function (res) {
            hideLoadingCss("");
            // var result = res.return.split(";")[0];
            console.log("Result : "+res);
            if (res == 1 ) {
                alert(res.OUT_MSG);
                $('#edit-modal').modal('hide');
                tableOperasiKhusus.ajax.reload();
            } else {
                alert(res.OUT_MSG);
            }
            $('#edit-modal').modal('hide');
            tableOperasiKhusus.ajax.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function update_status(idMetallica, statusTracking){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/operasi_khusus_trx/update_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdMetallica: idMetallica,
                pStatusTracking: statusTracking,

            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    tableOperasiKhusus.ajax.reload();
                } else {
                    alert(res.OUT_MSG);
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
            }
        });
    }
}

function updateLunas(idMetallica, jenis){
    var stsConf = confirm("Anda Yakin Akan Melunasi Tagihan Ini ?");
    if(stsConf == true){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/operasi_khusus_trx/update_lunas",
            dataType : "JSON",
            type : "POST",
            data : {
                pIdMetallica : idMetallica,
                pJenis : jenis
            },
            success : (res) => {
                hideLoadingCss("");

                if (res.return == 1){
                    alert(res.OUT_MSG);
                    search("load");
                    $("#detail-modal").modal("hide");
                    tableOperasiKhusus.ajax.reload();
                }else{
                    alert(res.OUT_MSG);
                }
            },
            error : () => {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
            }
        });
    }
}

function reverse_status(idMetallica, statusTracking){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/operasi_khusus_trx/update_reverse",
        dataType : "JSON",
        type : "POST",
        data : {
            pIdMetallica : idMetallica,
            pStatusTracking : statusTracking
        },
        success : (response) => {
            hideLoadingCss("");
            if (response.return == 1){
                alert(response.OUT_MSG);
                tableOperasiKhusus.ajax.reload();
            } else {
                alert(response.OUT_MSG);
            }
        },
        error : () => {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
        }
    });
}

function setListCurrency(htmlid){
    $.ajax({
        url : baseUrl + "api_operator/pindah_buku_trx/get_currency",
        type : "GET",
        dataType : "JSON",
        success : response => {
            $("#"+htmlid+"").html();
            $.each(response.data, (key,val) => {
                console.log(val);
                $("#"+htmlid+"").append('<option value="' + val.CURRENCY + '">'+val.CURRENCY+'</option>')
            });
        },
        error : () => {
            $("#" + htmlid + "").html('<option value="">Pilih Data</option>');
            console.log("Error");
        }
    })
}

function setListGlAccount(htmlid, currency){
    $.ajax({
        url : baseUrl + "api_operator/operasi_khusus_trx/get_glaccount",
        type : "GET",
        dataType : "JSON",
        data : {
            pCurrency : currency,
        },
        success : response => {
            $("#"+htmlid+"").html();
            $.each(response, (key,val) => {
                $("#"+htmlid+"").append('<option value="' + val.GL_ACCOUNT + '">'+val.GL_ACCOUNT+'-'+val.BANK_NAME+'</option>')
            });
            if (currency != "") {
                $("#" + htmlid + "").val(currency).trigger('change');
            } else {
                $('#pDetailGlAccount').val("null").trigger('change');
            }
        },
        error : () => {
            $("#" + htmlid + "").html('<option value="">Pilih Data</option>');
            console.log("Error");
        }
    })
}

function setListCashcode(htmlid){
    $.ajax({
        url : baseUrl + "api_operator/operasi_khusus_trx/get_cashcode",
        type : "GET",
        dataType : "JSON",
        success : response => {
            $("#"+htmlid+"").html();
            $.each(response, (key,val) => {
                $("#"+htmlid+"").append('<option value="' + val.CASH_CODE + '">'+val.CASH_CODE+' - '+val.CASH_DESCRIPTION+'</option>')
            });
        },
        error : () => {
            $("#" + htmlid + "").html('<option value="">Pilih Data</option>');
            console.log("Error");
        }
    })
}

function submitChild() {
    let table_data = tblOperasiKhususDetail.data();
    dataList = [];

    if (table_data.length <= 0){
        Swal.fire("Maaf!", "Tidak ada data/tidak ada data baru yang ditambahkan","error");
        return;
    }

    if (getBalance() != 0 || getBalance() < 0){
        Swal.fire("Maaf!", "Balance tidak seimbang", "error");
        return;
    }
    // console.log("Valas Detail : ",table_data);
    table_data.each((data) => {
        // console.log("Cok : ", data.LINE_NO);
        var prm = {
            pDocNo: $("#pDetailDocumentNumber").val(),
            pPmtProposalId: $("#pDetailPmtProposalId").val(),
            pCompCode: data.COMP_CODE,
            pCashCode : data.CASH_CODE,
            pSumberDana : data.SUMBER_DANA,
            pFiscYear: $("#pDetailFiscYear").val(),
            pLineNo : data.LINE_NO,
            pReference : $("#pDetailReference").val(),
            pDrCrInd : data.DEBIT_CREDIT_IND,
            pGlAccount : data.GL_ACCOUNT,
            pAmount : data.AMOUNT,
            pExchangeRate : $("#pDetailExchangeRate").val(),
            pCurrency : data.CURRENCY,
            pCostCtr : $("#pDetailCostCtr").val(),
            pPostDate : $("#pDetailPostDate").val(),
            pBusArea : data.BUSINESS_AREA,
            pRemarks : data.REMARKS,
            pFlag : data.FLAG,
        };
        dataList.push(prm);
    });

    OperasiKhusus.operasiKhususDetails = dataList;
    console.log("Operasi Khusus : ",OperasiKhusus);
    console.log("Detail list : ",dataList);

    Swal.fire({
        title : "Anda Yakin ?",
        text : "Yakin ingin menambahkan data ?",
        icon : "warning",
        showCancelButton: true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText: "Ya",
    }).then(result => {
        if (result.value){
            showLoadingCss()
            $.ajax({
                url: baseUrl + "api_operator/operasi_khusus_trx/ins_detail_operasi_khusus_trx",
                contentType : "application/json",
                dataType : 'json',
                type: "POST",
                data: JSON.stringify(OperasiKhusus),
                success: function (res) {
                    console.log("response : ", res);
                    hideLoadingCss()
                    if (res.return == 1 || res.OUT_MSG === "DATA BERHASIL DISIMPAN") {
                        Swal.fire("Sukses!", "Data berhasil ditambahkan!", "success")
                        // alert(res.OUT_MESSAGE);
                        tblOperasiKhususDetail.ajax.reload();
                    } else {
                        Swal.fire("Gagal!", "Data gagal ditambahkan!", "error")
                        // tblOperasiKhususDetail.ajax.reload();
                    }
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
                }
            });
        }
    });
}

function back(){
    showLoadingCss();
    $(".list-data").show();
    $(".detail-data").hide();
    $("#filter").show();
    $("#btn-add-rekap").show();
    tableOperasiKhusus.ajax.reload();
    tblOperasiKhususDetail.destroy();
    hideLoadingCss();
}

function setBalance(bal){
    balance = bal;
}

function getBalance(){
    return balance;
}

$("#pHeadCurrency").change(function () {
    if ($("#pHeadCurrency").val() != "IDR"){
        $(".pExcRate").show();
    } else {
        $(".pExcRate").hide();
    }
});