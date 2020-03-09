/**
 * Created by israjhaliri on 8/23/17.
 * Updated by zhulfikar on 2/1/19
 */
var tablePindahBuku;
var tableMain;
var isUpdate = "0";
var tempTableSearch = "";
var checkedArray = new Array();
var cbParentArray = new Array();
var PindahBuku = {};
var allData;
var tablePindahBuku;
var pindahBukuDetails;
var balance;
var srcTglAwal = null;
var srcTglAkhir = null;
var table_data_length;
var status_tracking;
var tblpindahBukuDetail = null;
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
            alert("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function getTotalTagihanPindahBuku() {
     $.ajax({
         url: baseUrl + "/api_operator/pindah_buku_trx/get_total_tagihan",
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

function multipleDelete() {
    if (checkedArray.length <= 0){
        Swal.fire("Maaf!", "Silahkan pilih data terlebih dahulu","warning");
    }else{
        Swal.fire({
            title : "Yakin?",
            text : "Anda Yakin Akan Menghapus Data Ini ?",
            icon : "question",
            showCancelButton : true,
            confirmButtonColor : "#3085d6",
            cancelButtonColor : "#d33",
            confirmButtonText : "Ya"
        }).then(result => {
            if (result.value){
                showLoadingCss()
                $.ajax({
                    url: baseUrl + "api_operator/pindah_buku_trx/multiple_delete_head",
                    dataType: 'JSON',
                    type: "POST",
                    data: {
                        pData: JSON.stringify(checkedArray)
                    },
                    success: function (res) {
                        hideLoadingCss("")
                        if (res.return == 1) {
                            Swal.fire("Sukses!", "Data berhasil dihapus","success");
                            // alert(res.OUT_MSG);
                            tablePindahBuku.ajax.reload();
                            checkedArray.length = 0;
                        } else {
                            Swal.fire("Gagal","Gagal menghapus data","error");
                            console.warn(res.OUT_MSG);
                        }
                    },
                    error: function () {
                        hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                    }
                });
            }
        });
    }
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
    var exrate = $("#pDetailExchangeRate").val().toString();
    let real_exrate = parseInt(exrate.replace(/,/g,""));
    var cash_code = $("#pDetailCashCode").val();
    var cost_ctr = $("#pDetailCostCtr").val();
    var sumber_dana = $("#pDetailSumberDana").val();
    var real_amount = $("#pDetailAmount").val().toString();
    let very_real_amount = parseInt(real_amount.replace(/,/g,""))
    var flag = 0;
    let amount = 0;


    (exrate !== "-") ? amount = very_real_amount * real_exrate : amount = very_real_amount;

    if (drcrind == "" || glaccount == "" || amt == "" || remarks == "" || cash_code == "") {
        Swal.fire("Maaf!","Mohon Lengkapi Data", "warning");
        return;
    } else {
        let rowNode = pindahBukuDetails.row
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
                "REAL_AMOUNT" : very_real_amount
            })
            .draw(false)
            .node();
        $(rowNode)
            .css( 'color', 'black' )
            .animate( { color: '#ff590a' } );
    }
    $("#pDetailAmount").val("");
    $("#pDetailRemarks").val("");
}

function deletedb(idMetallica,idItem,lineNo){
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
                url : baseUrl + "api_operator/pindah_buku_trx/delete_pindah_buku_item_trx",
                type : "POST",
                data : {
                    pIdMetallica : idMetallica,
                    pItemId : idItem,
                    pLineNo : lineNo
                },
                success : (res) => {
                    // console.log("get detail : ", res.data);
                    if (res.OUT_MSG === "DATA BERHASIL DI HAPUS" || res.return === 1){
                        hideLoadingCss();
                        Swal.fire("Berhasil!","Data Berhasil Dihapus","success");
                        pindahBukuDetails.ajax.reload();
                    }else {
                        hideLoadingCss();
                        Swal.fire("Gagal!","Gagal Menghapus Data","error");
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
            url : baseUrl + "api_operator/pindah_buku_trx/delete_pindah_buku_trx_head",
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
    tablePindahBuku.ajax.reload();
}

function dele() {
    $("#table-main-detail tbody").on('click','.btn-warning', function () {
        tblpindahBukuDetail
            .row($(this).parents('tr'))
            .remove()
            .draw(false);
    });
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
    Swal.fire({
        title : "Yakin?",
        text : "Anda yakin akan memverifikasi tagihan ini ?",
        icon : "question",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(result => {
        if (result.value){
            if(checkedArray.length === 0){
                Swal.fire("Maaf", "Silahkan Pilih Data Terlebih Dahulu", "warning");
            }else if (checkedArray.every(checkTrackingVerifikasi) === false){
                Swal.fire("Maaf!", "Tidak dapat melakukan verifikasi tagihan", "error");
            }else if (!checkedArray.every(isBalance)){
                Swal.fire("Maaf","Balance tidak sama dengan 0", "error");
            }else{
                showLoadingCss();
                $.ajax({
                    url: baseUrl + "api_operator/pindah_buku_trx/multi_upd_status",
                    dataType: 'JSON',
                    type: "POST",
                    data: {
                        pData: JSON.stringify(checkedArray),
                    },
                    success: function (res) {
                        hideLoadingCss("")
                        if (res.return === 1) {
                            console.warn(res.OUT_MSG);
                            Swal.fire("Berhasil", "Tagihan berhasil diverifikasi","success");
                            tablePindahBuku.ajax.reload();
                            checkedArray = new Array();
                        } else {
                            Swal.fire("Gagal", "Tagihan gagal diverifikasi", "error");
                            console.warn(res.OUT_MSG);
                        }
                    },
                    error: function () {
                        hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                    }
                });
            }
        }
    });
}

function checkTrackingVerifikasi(val){
    return val.statustracking < 4;
}

function isBalance(val){
    if(val.debit == 0 && val.kredit == 0){
        return false;
    }else return val.debit - val.kredit === 0;
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
    window.open(baseUrl + "api_operator/pindah_buku_trx/xls/" + tglAwal + "/" + tglAkhir + "/" + $("#cmb_currecny").val());
}


    function buildTableBody(data, columns) {
        var body = [];
        console.log("DIAZ GANTENG :"+data)
        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            dataRow.push(row["NO"]);
            dataRow.push(row["DOCUMENT_DATE"]);
            dataRow.push(row["POSTING_DATE"]);
            dataRow.push(row["DOCUMENT_NUMBER"]);
            dataRow.push(row["REFERENCE"]);
            //dataRow.push({text: row["NILAI_TAGIHAN"], alignment: "right"});
            dataRow.push(row["FISC_YEAR"]);
            dataRow.push(row["COMPANY_CODE"]);
            dataRow.push(row["BUSINESS_AREA"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push(row["EXCHANGE_RATE"]);
            dataRow.push({text: row["TOTAL_TAGIHAN"], alignment: "right"});
            dataRow.push(row["DOC_HDR_TXT"]);
            dataRow.push(row["STATUS_TRACKING"]);
            body.push(dataRow);
        });

        return body;
    }

function multi_upd_lunas() {
    Swal.fire({
        title : "Pelunasan",
        html : "<p>Anda yakin akan <b>melunasi</b> tagihan ini ?</p>",
        icon : "question",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(response => {
        if (response.value){
            if(checkedArray.length <=0){
                Swal.fire("Maaf!", "Silahkan pilih data terlebih dahulu","error")
            }else if(checkedArray.every(checkTracking) === false){
                Swal.fire("Maaf!", "Maaf tidak bisa melakukan pelunasan","error")
            }else{
                // alert("Good To Go!");
                showLoadingCss();
                $.ajax({
                    url: baseUrl + "/api_operator/pindah_buku_trx/multi_upd_lunas",
                    dataType: 'JSON',
                    type: "POST",
                    data: {
                        pData: JSON.stringify(checkedArray),
                    },
                    success: function (res) {
                        hideLoadingCss("")
                        if (res.return == 1) {
                            Swal.fire("Berhasil", "Berhasil melakukan pelunasan","success");
                            // console.warn(res.OUT_MSG)
                            tablePindahBuku.ajax.reload();
                            checkedArray.length = 0;
                        } else {
                            Swal.fire("Gagal", "Gagal melakukan pelunasan","error");
                            // console.warn(res.OUT_MSG);
                        }
                    },
                    error: function () {
                        hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                    }
                });
            }
        }
    });
}

function checkTracking(val){
    return val.statustracking == 4;
}

function isBalance(val){
    if(val.debit == 0 && val.kredit == 0){
        return false;
    }else return val.debit - val.kredit === 0;
}

function initDataTable(pTglAwal, pTglAkhir,  pCurrency, statusTracking) {
    showLoadingCss();
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();

    tablePindahBuku = $('#table-rekapitulasi').DataTable({
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
            {width: 120, targets: 1},
            {width: 120, targets: 2},
            {width: 110, targets: 3},
            {width: 150, targets: 4},
            {width: 150, targets: 5},
            {width: 110, targets: 6},
            {width: 110, targets: 7},
            {width: 150, targets: 8},
            {width: 100, targets: 9},
            {width: 130, targets: 10},
            {width: 130, targets: 11},
            {width: 100, targets: 12},
            // {width: 100, targets: 36},
            {width: "80%", "targets": 0},
            { className: "datatables_action", "targets": [9,2,10] },
            {
                "bSortable": true,
                "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10,11]
            },
            {
                "sortable": false,
                "aTargets": [0,14]
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
                    return moment(full.DOCUMENT_DATE.toString()).format("DD/MM/YYYY");
                }

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return moment(full.POSTING_DATE.toString()).format("DD/MM/YYYY");
                }

            },
                {
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return full.SUMBER_DANA;
                    }

                },
            {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return full.DOCUMENT_NUMBER;
                }

            },
            {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return full.REFERENCE;
                }

            },
            {
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return full.FISC_YEAR;
                }

            },
            {
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return full.COMPANY_CODE;
                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    return full.BUSINESS_AREA;
                }

            },
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {
                    return full.CURRENCY;
                }

            },
            {
                "aTargets": [10],
                "mRender": function (data, type, full) {
                    return Intl.NumberFormat().format(full.EXCHANGE_RATE);
                },
            },
            {
                "aTargets": [11],
                "mRender": function (data, type, full) {
                    return (isNaN(full.TOTAL_TAGIHAN)) ? "-" : Intl.NumberFormat().format(full.TOTAL_TAGIHAN);
                }

            },
            {
                "aTargets": [12],
                "mRender": function (data, type, full) {
                    return full.DOC_HDR_TXT;
                },
            },
            {
                "aTargets" : [13],
                "mRender": (data, type, full) => {
                    return full.STATUS_TRACKING;
                }
            },

                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                        var jenis = "PINDAH_BUKU";
                        console.log("Ini Full : "+full);
                        var ret_value;
                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else if(newRoleUser[0] === "ROLE_OSS" ){
                            ret_value =
                                '<div class="btn-group">' +
                                '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';

                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>';
                        }else {

                            if (full.STATUS_TRACKING === "INPUT DATA") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN" && full.TOTAL_TAGIHAN !== "-"){
                                    var full_value = full;
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; class="btn-update-data btn-sm btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_CASH" && full.TOTAL_TAGIHAN !== "-"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_IE" && full.TOTAL_TAGIHAN !== "-"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_FCL_SETTLEMENT" && full.TOTAL_TAGIHAN !== "-"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if (full.TOTAL_TAGIHAN === "-"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' +full.ID_METALLICA+'\')"><i class="fa fa-pencil"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                            }
                            else   if (full.STATUS_TRACKING === "VERIFIED BY MAKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] === "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+2+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] === "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+2+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                            }
                            else if (full.STATUS_TRACKING === "VERIFIED BY CHECKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                    '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class= "btn btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+

                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_FOREIGN_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class= "btn btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+

                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_BUSINESS_MANAGEMENT"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE_2"){
                                    ret_value = ret_value +
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button type="button" style="width: 15px !important; margin-right: 5px !important;"class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_KREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PRIMARY_ENERGY_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_KREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+3+'\',\'' +full.AMOUNT_DEBIT+'\',\'' +full.AMOUNT_CREDIT+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                            }

                            else if (full.STATUS_TRACKING === "VERIFIED BY APPROVER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                 if(newRoleUser[0] == "ROLE_VP_BUSINESS_MANAGEMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                 if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_PLH_EXECUTIVE_VICE_PRESIDENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_METALLICA+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Pelunasan" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                        '</div>';
                                }
                            }
                            else {
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.SUMBER_DANA+'\')"><i class="fa fa-info-circle"></i></button>'+
                                '</div>';
                            }
                        }
                        return ret_value;
                    }

                },
                {
                    "aTargets": [15],
                    "mRender": function (data, type, full) {
                        var value = new Object();
                        var data_full = new Object();
                        var ret_value = ''


                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else {
                            if (full.STATUS_TRACKING == "INPUT DATA") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","statustracking" : "'+1+'", "debit":"'+full.AMOUNT_DEBIT+'","kredit":"'+full.AMOUNT_CREDIT+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","statustracking" : "'+2+'", "debit":"'+full.AMOUNT_DEBIT+'","kredit":"'+full.AMOUNT_CREDIT+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                             else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","statustracking" : "'+3+'", "debit":"'+full.AMOUNT_DEBIT+'","kredit":"'+full.AMOUNT_CREDIT+'"}';
                                data_full = '{"full" : "'+JSON.stringify(full)+'"}';
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                value = '{"pIdMetallica":"'+full.ID_METALLICA+'","jenis" : "'+"PEMBELIAN_VALAS"+'","statustracking" : "'+4+'", "debit":"'+full.AMOUNT_DEBIT+'","kredit":"'+full.AMOUNT_CREDIT+'"}';
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
                        baseUrl + "api_operator/pindah_buku_trx/get_pindah_buku_trx",
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
                            getTotalTagihanPindahBuku();
                            return res.data;
                        }
                }
            ,
            "drawCallback":
                function (settings) {
                    // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                    // $(".table ").css({"width":"100%"});
                    tablePindahBuku.columns.adjust();
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
                                $(".btn").show();
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
    tablePindahBuku.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_length').each(function () {
        var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
        $(this).append(html);
    });

    $('.dataTables_filter').each(function () {
        // var html = '';
       var html = '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
       if(newRoleUser[0] == "ROLE_JA_CASH" || newRoleUser[0] == "ROLE_JA_IE" ) {
       html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
       }
       if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT" || newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"
           || newRoleUser[0] == "ROLE_VP_BUSINESS_MANAGEMENT" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"
           || newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY" || newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"
           || newRoleUser[0] == "ROLE_PLH_EXECUTIVE_VICE_PRESIDENT" || newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"
           || newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE") {
       html = html +'<button class="btn-edit-data btn-sm btn-primary" style="margin-left: 10px" type="button" title="Pelunasan" onclick="multi_upd_lunas()"><i class="fa fa-credit-card-alt"></i></button>';
       }
       $(this).append(html);
    });

    tablePindahBuku.columns.adjust();
    initCbparent();
}

function update_status(idMetallica, statusTracking, debit, kredit){
    Swal.fire({
        title : "Verifikasi?",
        text : "Apakah Anda yakin akan membverifikasi tagihan ini?",
        icon : "question",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya",
    }).then(result => {
        if (result.value == true){
            if (kredit !== debit || debit-kredit !== 0 || (debit == 0 && kredit == 0)){
                Swal.fire("Maaf!", "Balanca tidak seimbang", "error")
            }else{
                showLoadingCss();
                $.ajax({
                    url: baseUrl + "api_operator/pindah_buku_trx/update_status",
                    dataType: 'JSON',
                    type: "POST",
                    data: {
                        pIdMetallica: idMetallica,
                        pStatusTracking: statusTracking,
                    },
                    success: (res) => {
                        hideLoadingCss("")
                        if (res.return == 1) {
                            Swal.fire("Berhasil!", "Tagihan Berhasil Diverifikasi", "success");
                            // console.warn(res.return);
                            tablePindahBuku.ajax.reload();
                        } else {
                            Swal.fire("Gagal", "Tagihan gagal diverifikasi","error");
                            // console.warn(res.OUT_MSG);
                        }
                    },
                    error: () => {
                        hideLoadingCss();
                        Swal.fire("Error","Gagal Melakukan Proses, Harap Hubungi Administrator","error");
                    }
                });
            }
        }
    });
}

function updateLunas(idMetallica, jenis){
    // var stsConf = confirm("Anda Yakin Akan Melunasi Tagihan Ini ?");
    Swal.fire({
        title : "Pelunasan",
        text : "Apakah Anda yakin ingin melunasi tagihan ini ?",
        icon : "warning",
        showCancelButton: true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText: "Ya",
    }).then(result => {
        if(result.value){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/pindah_buku_trx/update_lunas",
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
                        tablePindahBuku.ajax.reload();
                    }else{
                        Swal.fire("Berhasil!",res.OUT_MSG, "success");
                    }
                },
                error : () => {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
                }
            });
        }
    })
}

function reverse_status(idMetallica, statusTracking){
    Swal.fire({
        title: "Reverse",
        icon: "question",
        html: "<p>Anda yakin akan <b>mereverse</b> tagihan ini ?</p>",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya",
    }).then(result => {
        if(result.value){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/pindah_buku_trx/update_reverse",
                dataType : "JSON",
                type : "POST",
                data : {
                    pIdMetallica : idMetallica,
                    pStatusTracking : statusTracking
                },
                success : (response) => {
                    hideLoadingCss("");
                    if (response.return == 1){
                        Swal.fire("Berhasil","Data berhasil di reverse", "info");
                        // alert(response.OUT_MSG);
                        tablePindahBuku.ajax.reload();
                    } else {
                        Swal.fire("Gagal", "Gagal mereverse data","error");
                        console.warn(response.OUT_MSG);
                    }
                },
                error : () => {
                    hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
                }
            });
        }
    });
}

function submitChild() {
    let table_data = pindahBukuDetails.data();
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
            pRealAmount : data.REAL_AMOUNT,
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

    PindahBuku.pindahBukuDetails = dataList;
    console.log("Valas : ",PindahBuku);
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
                url: baseUrl + "api_operator/pindah_buku_trx/ins_detail_pindah_buku_trx",
                contentType : "application/json",
                dataType : 'json',
                type: "POST",
                data: JSON.stringify(PindahBuku),
                success: function (res) {
                    console.log("response : ", res);
                    hideLoadingCss()
                    if (res.return == 1) {
                        Swal.fire("Sukses!", "Data berhasil ditambahkan!", "success")
                        // alert(res.OUT_MESSAGE);
                        pindahBukuDetails.ajax.reload();
                    } else {
                        Swal.fire("Gagal!", "Data gagal ditambahkan!", "error")
                        pindahBukuDetails.ajax.reload();
                    }
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
                }
            });
        }
    });
}

function submit() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/bank/ins_bank",
        dataType: 'JSON',
        type: "GET",
        data: {
            pKodeBank: $("#pKodeBank").val(),
            pNamaBank: $("#pNamaBank").val(),
            pJenis: $("#pJenis").val(),
            pFlag: $("#pFlag").val(),
            pIsUpdate: isUpdate
        },
        success: function (res) {
            console.log("response : ", res);
            hideLoadingCss()
            if (res.return == 1) {
                alert(res.OUT_MESSAGE);
                location.reload();
            } else {
                alert(res.OUT_MESSAGE);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function clearForm() {
    isUpdate = "0"
    $("#pKodeBank").val("");
    $("#pKodeBank").prop('disabled', false);
    $("#pNamaBank").val("");
}

function upload_xls(){
    $("#modal-upload-xls").modal("show");

    //getFilesRekap(pIdValas);
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

function getDetails(id, doc_no, bus_area, comp_code, ref, prop_pmt_id, post_date, fisc_year, curr, exc_rate, track, sumber_dana) {
    $(".list-data").hide();
    $(".detail-data").show();
    $("#filter").hide();
    $("#btn-add-rekap").hide();
    $(".fungsional-button").hide();

    console.log("Sumber Dana : ", sumber_dana);
    (track === "INPUT DATA" || newRoleUser[0] === "ROLE_ADMIN") ? $(".just-for-input-data").show() : $(".just-for-input-data").hide();

    showLoadingCss();
    pindahBukuDetails = $("#table-main-detail").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/pindah_buku_trx/detail_pindah_buku_trx",
            "data" : {
                "pIdMetallica": id,
            },
            "type": "GET",
            "dataType": "json",
        },
        "columns" : [
           {"data" : "DOC_NO"},
          {"data" : "PMT_PROPOSAL_ID"},
          {"data" : "COMP_CODE"},
          {"data" : "CASH_CODE"},
          {"data" : "SUMBER_DANA"},
          {"data" : "FISC_YEAR"},
          {"data" : "LINE_NO"},
          {"data" : "DEBIT_CREDIT_IND"},
          {"data" : "GL_ACCOUNT"},
         {
             "data" : null,
             "render" : function (data2, type, row ) {
                 let number2 = parseInt(data2.REAL_AMOUNT);
                 return Intl.NumberFormat().format(number2);
             }
         },
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
                 if(data.FLAG == 1 || track == "INPUT_DATA"){
                     return '<td align="center"> <button class="btn btn-sm btn-danger" onclick="deletedb(\'' +data.ID_METALLICA+'\',\'' +data.ID_PINDAHBUKU_ITEM_TRX+ '\',\'' +data.LINE_NO+'\')"><i class="fa fa-trash"></i></button></td>';
                 }else if(data.FLAG == 0){
                     return '<td align="center"> <button class="btn btn-sm btn-warning" onclick="dele()"><i class="trash fa fa-trash"></i></button></td>';
                 }
                  else {
                  return '-'
                  }
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

    $("#pDetailGlAccount, #pDetailDrCrInd, #pDetailCashCode").select2({
        width : "100%",
        theme : "bootstrap",
    });

    PindahBuku = {
        pIdMetallica: id,
        pDocumentNumber : doc_no,
        pindahBukuDetails: null //ini harus sama dengan nama variable di class nya
    }

    $(".list-data").hide();
    $(".detail-data").show();
    $("#filter").hide();
    $("#btn-add-rekap").hide();
    hideLoadingCss();

    $("#pDetailAmount").mask('000,000,000,000,000',{reverse : true});
    $("#pDetailExchangeRate").val(exc_rate);
    $("#pDetailDocumentNumber").val(doc_no);
    $("#pDetailPmtProposalId").val(prop_pmt_id);
    $("#pDetailPostDate").val(post_date);
    $("#pDetailReference").val(ref);
    $("#pDetailBusArea").val(bus_area);
    $("#pDetailFiscYear").val(fisc_year);
    $("#pDetailCurrency").val(curr);
    $("#pDetailCompCode").val(comp_code);
    $("#pDetailSumberDana").val(sumber_dana);

    if(curr !== "IDR"){
        $(".pExchangeRate").show();
    }else{
        $(".pExchangeRate").hide();
    }
    dele();
    setListGlAccount("pDetailGlAccount",curr);
    setListCashcode("pDetailCashCode");
}

function back(){
    Swal.fire({
        title : "Yakin ?",
        text : "Apakah anda yakin ingin kembali?",
        icon : "error",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(result => {
        if (result.value){
            $(".list-data").show();
            $(".detail-data").hide();
            $("#filter").show();
            $("#btn-add-rekap").show();
            $(".fungsional-button").show();
            tablePindahBuku.ajax.reload();
            pindahBukuDetails.destroy();
        }
    });
}

function setBalance(bal){
    balance = bal;
}

function getBalance(){
    return balance;
}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_currecny").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        var pageNumber = tablePindahBuku.page.info().page;
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
    setListCompCode("pHeadCompCode");
    $(".pExcRate").hide();
    $("#pHeadPostingDate").val("");
    $("#pHeadDocDate").val("");
    $("#pHeadDocNo").val("");
    $("#pHeadReference").val("");
    $("#pHeadBusArea").val("");
    $("#pHeadCurrency").val("");
    $("#pHeadDocHdrTxt").val("");
    $("#pHeadFiscalYear")
        .val("")
        .removeAttr("readonly");
    $("#pHeadCompCode").val("");
    $("#pHeadSumberDana").val("");

    $("#pHeadPostingDate, #pHeadDocDate,#pHeadCompCode, " +
        "#pHeadSumberDana, #pHeadBusArea, #pHeadCurrency").removeAttr("disabled")

    var date = new Date();
    $("#pHeadExchangeRate")
        .val("")
        .mask("000,000,000,000,000,000,000,000",{reverse:true})
        .removeAttr("disabled");
    $('#pHeadPostingDate').datepicker({dateFormat: 'yymmdd', minDate: date});
    $('#pHeadDocDate').datepicker({dateFormat: 'yymmdd'});
    $('#edit-modal').modal({backdrop: 'static', keyboard: false});

}

function edit_data (idMetallica){
    showLoadingCss();
    setListCurrency("pHeadCurrency");
    $.ajax({
        url : baseUrl + "api_operator/pindah_buku_trx/get_pindah_buku_head_byid",
        dataType : "JSON",
        type : "GET",
        data : {
            pIdMetallica : idMetallica,
        },
        success : (res) => {
            // console.log("data edit data : ",res);
            hideLoadingCss("");
            $("#pHeadDocDate").val(res.data[0].DOCUMENT_DATE).attr("disabled", true);
            $("#pHeadPostingDate").val(res.data[0].POSTING_DATE).attr("disabled", true);
            $("#pHeadDocNo").val(res.data[0].DOCUMENT_NUMBER).attr("readonly", "readonly");
            $("#pHeadReference").val(res.data[0].REFERENCE);
            $("#pHeadFiscYear").val(res.data[0].FISC_YEAR).attr("readonly", "readonly");
            $("#pHeadCompCode")
                .val(res.data[0].COMPANY_CODE)
                .attr("disabled", true)
                .append("<option value='"+res.data[0].COMPANY_CODE+"'>"+res.data[0].COMPANY_CODE+"</option>");

            $("#pHeadBusArea")
                .val(res.data[0].BUSINESS_AREA)
                .attr("disabled", true)
                .append("<option value='"+res.data[0].BUSINESS_AREA+"'>"+res.data[0].BUSINESS_AREA+"</option>");
            $("#pHeadCurrency")
                .val(res.data[0].CURRENCY)
                .attr("disabled",true)
                .append("<option value='"+res.data[0].CURRENCY+"'>"+res.data[0].CURRENCY+"</option>");
            $("#pHeadSumberDana")
                .val(res.data[0].SUMBER_DANA)
                .attr("disabled", true);

            $("#pHeadExchangeRate").val(res.data[0].EXCHANGE_RATE).attr("disabled", true);
            $("#pHeadDocHdrTxt").val(res.data[0].DOC_HDR_TXT);
            $("#pIdMetallica").val(res.data[0].ID_METALLICA);

            $("#pHeadCurrencyHidden").val(res.data[0].CURRENCY);
            $("#pHeadCompCodeHidden").val(res.data[0].COMPANY_CODE);
            $("#pHeadBusAreaHidden").val(res.data[0].BUSINESS_AREA);

            if (res.data[0].CURRENCY === "IDR") {
                $("#pHeadExchangeRate").val(1);
                $(".pExcRate").hide();
            }else{
                $(".pExcRate").show();
            }

            setTimeout(function(){ $('#edit-modal').modal({backdrop: 'static', keyboard: false}); }, 1000);
        },
        error : (error)=>{
            console.log("Error");
        }
    });
}

function ins_data() {
    showLoadingCss("");
    let idPinbuk = $("#pIdMetallica").val();
    (idPinbuk === undefined || idPinbuk === "") ? idPinbuk = null : idPinbuk = idPinbuk;
    console.log("id pinbuk : ", idPinbuk)
    let exch_rate = $("#pHeadExchangeRate").val().toString();
    $.ajax({
        url: baseUrl + "api_operator/pindah_buku_trx/ins_pindah_buku_trx",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdMetallica: idPinbuk,
            pDocNo: $("#pHeadDocNo").val(),
            pDocDate: $("#pHeadDocDate").val(),
            pCompCode: $("#pHeadCompCode").val(),
            pReference: $("#pHeadReference").val(),
            pCurrency: $("#pHeadCurrency").val(),
            pPostDate: $("#pHeadPostingDate").val(),
            pBusArea: $("#pHeadBusArea").val(),
            pDocHdrTxt: $("#pHeadDocHdrTxt").val(),
            pExchangeRate: parseInt(exch_rate.replace(/,/g,"")),
            pFiscYear: $("#pHeadFiscYear").val(),
            pSumberDana : $("#pHeadSumberDana").val(),
        },
        success: function (res) {
            // console.log("Result : "+res);
            if (res.RETURN == 1 || res.OUT_MSG === "DATA BERHASIL DISIMPAN") {
                Swal.fire("Sukses!", "Data berhasil disimpan", "success");
                // alert(res.OUT_MSG);
                $('#edit-modal').modal('hide');
                tablePindahBuku.ajax.reload();
            } else {
                Swal.fire("Gagal!", "Gagal menambahkan data", "error");
                console.warn(res.RETURN);
            }
            hideLoadingCss("");
        },
        error: function () {
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
            $("#"+htmlid+"").html('<option value="">Pilih Data</option>');
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
        url : baseUrl + "api_operator/pembelian_valas_trx/get_glaccount",
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
        url : baseUrl + "api_operator/pembelian_valas_trx/get_cashcode",
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

function setListBusinessArea(value){
    $.ajax({
        url : baseUrl + "api_operator/pembelian_valas_trx/get_business_area",
        type : "GET",
        dataType : "JSON",
        data : {
            pCompCode : value,
        },
        success : response => {
            console.log("Company Code : ",response);
            $("#pHeadBusArea").children().remove();
            $.each(response, (key,val) => {
                $("#pHeadBusArea").append('<option value="' + val.BUSINESS_AREA_CODE + '">'+val.BUSINESS_AREA_CODE+' - '+val.BUSINESS_AREA_DESC+'</option>')
            });
        },
        error : () => {
            $("#pHeadBusArea").html('<option value="">Pilih Data</option>');
            console.log("Error");
        }
    })
}

function setListCompCode(idhtml){
    $.ajax({
        url : baseUrl + "api_operator/pembelian_valas_trx/get_compcode",
        type : "GET",
        dataType : "JSON",
        success : response => {
            console.log("Company Code : ",response);
            $("#"+idhtml+"").html('<option value="">Pilih Data</option>');
            $.each(response, (key,val) => {
                $("#"+idhtml+"").append('<option value="' + val.COMPANY_CODE + '">'+val.COMPANY_CODE+' - '+val.COMPANY_NAME+'</option>')
            });
        },
        error : () => {
            $("#" + idhtml + "").html('<option value="">Pilih Data</option>');
            console.log("Error");
        }
    })
}

$("#pHeadCurrency").change(function () {
    if ($("#pHeadCurrency").val() != "IDR"){
        $(".pExcRate").show();
    } else {
        $(".pExcRate").hide();
    }
});

$("#pDetailCurrency").change(function () {
    if ($("#pDetailCurrency").val() != "IDR"){
        $(".pExchangeRate").show();
    } else {
        $(".pExchangeRate").hide();
    }
});

