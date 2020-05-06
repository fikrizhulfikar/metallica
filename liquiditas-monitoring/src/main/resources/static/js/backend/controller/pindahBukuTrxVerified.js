/**
 * Created by israjhaliri on 8/23/17.
 */
var tablePindahBukuVerified;
var tbPindahBukuVerifiedDetail;
var tableMain;
var isUpdate = "0";
var tempTableSearch = "";
var checkedArray = new Array();
var cbParentArray = new Array();
var PindahBuku = "";
var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    initDataTable();
     $('#tanggal_awal').datepicker({dateFormat: 'yymmdd'});
            $('#tanggal_akhir').attr("disabled", "disabled");
            $('#tanggal_akhir').datepicker({dateFormat: 'yymmdd'});
            setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    // getAllData();
});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
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

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/pindah_buku_trx/xlsverified/" + tglAwal + "/" + tglAkhir + "/" + $("#cmb_currecny").val());
}


function deletedb(idMetallica, idItem){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/pindah_buku_trx/delete_pindah_buku_trx",
        type : "POST",
        data : {
            pIdMetallica : idMetallica,
            pItemId : idItem
        },
        success : (res) => {
            console.log("get detail : ", res.data);
            alert("Data Berhasil Dihapus");
            hideLoadingCss();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
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
    tablePindahBukuVerified.ajax.reload();
}

function dele() {
    $(".dele").on('click', function () {
        $(this).parent().parent().remove();
        var ii = 0;
        $("#id-mat tr").each(function () {
            $(this).find('td:eq(0)').text(ii);
            ii++;
        });

        var rowCount = $('#table-main-detail tbody tr').length;
        if (rowCount < 1) {
            count = 0;
            var html = "<tr>" +
                "<td colspan='15' align='center'>No Data</td>" +
                "</tr>"

            $("#table-main-detail tbody").append(html);
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

    tablePindahBukuVerified = $('#table-rekapitulasi').DataTable({
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
                {width: 140, targets: 9},
                {width: 130, targets: 10},
                {width: "80%", "targets": 0},
                { className: "datatables_action", "targets": [] },
                {
                    "bSortable": true,
                    "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10]
                },
                {
                    "sortable": false,
                    "aTargets": [0,11]
                },
                {
                    "targets": [0,1,2,3,5,6,7,11],
                    "className": "dt-body-center",
                },
                {
                    "targets": [8],
                    "className": "dt-body-right",
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
                        return moment(full.DOCUMENT_DATE).format("DD/MM/YYYY");
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return moment(full.POSTING_DATE).format("DD/MM/YYYY");
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
                        return full.COMPANY_CODE;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return full.BUSINESS_AREA;
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
                        return Intl.NumberFormat().format(full.TOTAL_TAGIHAN);
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return full.DOC_HDR_TXT;
                    }

                },
                {
                  "aTargets" : [10],
                  "mRender" : (data, type, full) => {
                      return full.STATUS_TRACKING;
                    }
                },

                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        var jenis = "PINDAH_BUKU";
                        console.log("Ini Full : "+full);
                        var ret_value;

                        if (newRoleUser[0] == "ROLE_ADMIN") {
                            ret_value =
                                '<div class="btn-group">' +
                                '<button type="button" style="width: 15px !important; margin-right: 5px !important; " class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\')"><i class="fa fa-info-circle"></i></button>';

                            ret_value = ret_value +
                                '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                                '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                '<button type="button" style="width: 15px !important; margin-right: 5px !important;" class="btn btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                '</div>';
                        }else{
                            ret_value = '<button type="button" style="width: 15px !important;" class="btn btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                                '</div>';
                        }
                        // else if(newRoleUser[0] == "ROLE_OSS" ){
                        //     ret_value =
                        //         '<div class="btn-group">' +
                        //         '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                        //
                        //     ret_value = ret_value +
                        //         '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                        //         '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                        //         '</div>';
                        // }else {
                        //     if (full.STATUS_TRACKING !== "INPUT DATA") {
                        //         var role = newRoleUser[0];
                        //         ret_value =
                        //             '<div class="btn-group">';
                        //         if(newRoleUser[0] == "ROLE_ADMIN"){
                        //             ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                        //                 '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_JA_CASH"){
                        //             ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                        //                 // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                        //                 // '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_JA_IE"){
                        //             ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                        //                 // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                        //                 // '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                        //                 '</div>';
                        //         }
                        //     }
                        //     else   if (full.STATUS_TRACKING !== "VERIFIED BY MAKER") {
                        //         var role = newRoleUser[0];
                        //         ret_value =
                        //             '<div class="btn-group">';
                        //         if(newRoleUser[0] == "ROLE_ADMIN"){
                        //             ret_value = ret_value +
                        //              '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //              '</div>';
                        //          }
                        //         if(newRoleUser[0] == "ROLE_JA_IE"){
                        //              ret_value = ret_value +
                        //                  '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                  '</div>';
                        //          }
                        //          if(newRoleUser[0] == "ROLE_JA_CASH"){
                        //               ret_value = ret_value +
                        //                   '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                   '</div>';
                        //          }
                        //     }
                        //     else if (full.STATUS_TRACKING !== "VERIFIED BY CHECKER") {
                        //         var role = newRoleUser[0];
                        //         ret_value =
                        //             '<div class="btn-group">';
                        //         if(newRoleUser[0] == "ROLE_ADMIN"){
                        //           ret_value = ret_value +
                        //              '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //              '</div>';
                        //          }
                        //         if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                        //            ret_value = ret_value +
                        //                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                        //           ret_value = ret_value +
                        //              '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //              '</div>';
                        //          }
                        //     }
                        //
                        //     else if (full.STATUS_TRACKING !== "VERIFIED BY APPROVER") {
                        //         var role = newRoleUser[0];
                        //         ret_value =
                        //             '<div class="btn-group">';
                        //        if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                        //          ret_value = ret_value +
                        //             '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //             '</div>';
                        //         }
                        //        if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                        //             ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_MSB_FOREIGN_CURRENCY_LIQUIDITY"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_VP_BUSINESS_MANAGEMENT"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_MSB_PRIMARY_ENERGY_EXPENDITURE"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //         if(newRoleUser[0] == "ROLE_MSB_OPERATION_EXPENDITURE"){
                        //              ret_value = ret_value +
                        //                 '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //                 '</div>';
                        //         }
                        //
                        //     }
                        //
                        //     else {
                        //         ret_value =
                        //             '<div class="btn-group">' +
                        //             '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                        //             '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_METALLICA+'\',\''+full.DOCUMENT_NUMBER+'\',\''+full.BUSINESS_AREA+'\',\''+full.COMPANY_CODE+'\',\''+full.REFERENCE+'\',\''+full.PMT_PROPOSAL_ID+'\',\''+full.POSTING_DATE+'\',\''+full.FISC_YEAR+'\',\''+full.CURRENCY+'\',\''+full.EXCHANGE_RATE+'\',\''+full.STATUS_TRACKING+'\')"><i class="fa fa-info-circle"></i></button>'+
                        //             '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DIAZ" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                        //             '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                        //         '</div>';
                        //     }
                        // }
                        return ret_value;
                    }
                }
//                {
//                    "aTargets": [12],
//                    "mRender": function (data, type, full) {
//                        var value = new Object();
//                        var ret_value = ''
//
//                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
//                            return "-"
//                        }
//                        else {
//                            if (full.STATUS_TRACKING == "INPUT DATA") {
//                                value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';
//
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {
//
//                                if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
//                                    value = '{"3":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {
//
//                                if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN" || newRoleUser[0] == "ROLE_ADMIN"){
//                                    value = '{"6":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){
//
//                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT" || newRoleUser[0] == "ROLE_ADMIN"){
//                                    value = '{"8":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//
//                            else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){
//
//                                if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION" || newRoleUser[0] == "ROLE_ADMIN"){
//                                    value = '{"5":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR > "25000000000"){
//                                if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
//                                    value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR > "25000000000"){
//                                if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
//                                    value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
//                                var role = newRoleUser[0];
//
//                                if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
//                                    value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
//                                var role = newRoleUser[0];
//
//                                if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
//                                    value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }else {
//                                    value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
//                                }
//                            }
//                            else {
//                                value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';
//                            }
//                        }
//
//                        for (x=0; x<checkedArray.length;x++){
//                            if(JSON.stringify(checkedArray[x]) === value){
//                                return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox' checked>";
//                            }
//                        }
//                        return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox'>";
//                    }
//                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/pindah_buku_trx/get_pindah_buku_trx_verified",
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
                            return res.data;
                        }
                }
            ,
            "drawCallback":
                function (settings) {
                    // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                    // $(".table ").css({"width":"100%"});
                    tablePindahBukuVerified.columns.adjust();
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
    tablePindahBukuVerified.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_length').each(function () {
//        var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
//        $(this).append(html);
    });

    $('.dataTables_filter').each(function () {
        // var html = '';
//        var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
//            '<i class="fa fa-arrows-alt"></i></button>';
//        /*button reject*/
//        html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
//            '            <i class="fa fa-ban"></i></button>';
//        html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fas fa-edit"></i></button>';
//        html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//        if(newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){
//            html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
//
//        }
//        html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
//        $(this).append(html);
    });

    tablePindahBukuVerified.columns.adjust();
    initCbparent();
}

function submitChild() {
    dataList = []
    $("#table-main-detail tbody").find("tr").each(function (index) {
        var temphtml = $(this).find('td').toArray();
        console.log(temphtml);
        var pStsflag = "";
        // if($(temphtml[3]).html() == "TAMPIL"){
        //     pStsflag = 1
        // }else{
        //     pStsflag = 0
        // }
        var prm = {
            pDocNo: $(temphtml[0]).html(),
            pPmtProposalId: $(temphtml[1]).html(),
            pCompCode: $(temphtml[2]).html(),
            pFiscYear: $(temphtml[3]).html(),
            pLineNo : $(temphtml[4]).html(),
            pReference : $(temphtml[5]).html(),
            pDrCrInd : $(temphtml[6]).html(),
            pGlAccount : $(temphtml[7]).html(),
            pAmount : $(temphtml[8]).html(),
            pExchangeRate : $(temphtml[9]).html(),
            pCurrency : $(temphtml[10]).html(),
            pPostDate : $(temphtml[11]).html(),
            pBusArea : $(temphtml[12]).html(),
            pRemarks : $(temphtml[13]).html(),
            pFlag : $(temphtml[14]).html(),
        };
        dataList.push(prm);
    });

    PindahBuku.pindahBukuDetails = dataList;
    console.log("Valas : ",PindahBuku);
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
                alert(res.OUT_MESSAGE);
                window.location.reload();

            } else {
                alert(res.OUT_MESSAGE);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
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

function getDetails(id, doc_no, bus_area, comp_code, ref, prop_pmt_id, post_date, fisc_year, curr, exc_rate, track) {
    $(".list-data").hide();
    $(".detail-data").show();
    $("#filter").hide();
    $("#btn-add-rekap").hide();

    (track === "INPUT DATA" || newRoleUser[0] === "ROLE_ADMIN") ? $(".just-for-input-data").show() : $(".just-for-input-data").hide();
    // hideLoadingCss();
    showLoadingCss();
    tbPindahBukuVerifiedDetail = $("#table-main-detail").DataTable({
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
           {"data" : "FISC_YEAR"},
           {"data" : "LINE_NO"},
           {"data" : "DEBIT_CREDIT_IND"},
           {"data" : "GL_ACCOUNT"},
           {
               "data" : null,
               "render" : function (data2, type, row ) {
                   let amount = parseInt(data2.REAL_AMOUNT);
                   return Intl.NumberFormat().format(amount);
               }
           },
           {
               "data" : null,
               "render" : function (data, type, row ) {
                   let amount = parseInt(data.AMOUNT);
                   return Intl.NumberFormat().format(amount);
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
//           {
//                "data" : null,
//                "render" : (data) => {
//                    if(data.FLAG == 1){
//                        return '<td align="center"> <button class="btn btn-sm btn-danger" onclick="deletedb(\'' +data.ID_METALLICA+'\',\'' +data.ID_VALAS_ITEM_TRX+ '\')"><i class="fa fa-trash"></i></button></td>';
//                    }else if(data.FLAG == 0){
//                        return '<td align="center"> <button class="btn btn-sm btn-warning" onclick="dele()"><i class="trash fa fa-trash"></i></button></td>';
//                    }
//
//                }
//            }
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
        theme : "bootstrap",
        width : "100%",
    });

    $("#pDetailExchangeRate").val(exc_rate);
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
        var pageNumber = tablePindahBukuVerified.page.info().page;
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
    idValas = "";

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
    if(newRoleUser[0].replace(" ", "")!= "ROLE_ADMIN"){
        date = new Date(date.setDate(date.getDate() + addedDays));
    }
    $('#pPostingDate').datepicker({dateFormat: 'dd/mm/yy', minDate: date});
    $('#pDocDate').datepicker({dateFormat: 'dd/mm/yy'});
     // setSelectJenisPembayaran("pJenisPemabayaran", "", "");
    // setSelectCurr("pCurrecny", "", "", "REKAP");
    // setSelectBank2("pBankTujuan", "", "TUJUAN", "", "REKAP");
    // setSelectBank("pBankPembayar", "", "PEMBAYAR", "", "REKAP");
    // setSelectPosAnggaran("pPosAnggaran","","");
    // setSelectUnitAnggaran("pUnitAnggaran","");

    // $('#pTglJatuhTempo').prop('disabled', false);
    // if(newRoleUser[0].replace(" ", "")== "ROLE_OSS"){
    //     $('#pTglJatuhTempo').prop('disabled', true);
    // }
    $('#edit-modal').modal({backdrop: 'static', keyboard: false});

}

function ins_data() {
    showLoadingCss();
    console.log("id valas : ", idValas)
    $.ajax({
        url: baseUrl + "api_operator/pindah_buku_trx/ins_pindah_buku_trx",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdMetallica: idValas,
            pDocNo: $("#pDocNo").val(),
            pDocDate: $("#pDocDate").val(),
            pCompCode: $("#pCompCode").val(),
            pReference: $("#pReference").val(),
            pCurrency: $("#pCurrency").val(),
            pPostDate: $("#pPostingDate").val(),
            pBusArea: $("#pBusArea").val(),
            pDocHdrTxt: $("#pDocHdrTxt").val(),
        },
        success: function (res) {
            hideLoadingCss("");
            // var result = res.return.split(";")[0];
            console.log("Result : "+res);
            if (res == 1 ) {
                alert(res.OUT_MSG);
                search("load");
                $('#edit-modal').modal('hide');
            } else {
                alert(res.OUT_MSG);
            }
            tablePindahBukuVerified.ajax.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
        }
    });
}

function update_status(idMetallica, statusTracking){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/pindah_buku_trx/update_status",
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
                    tablePindahBukuVerified.ajax.reload();
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
                    tablePindahBukuVerified.ajax.reload();
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

function back(){
    showLoadingCss();
    $(".list-data").show();
    $(".detail-data").hide();
    $("#filter").show();
    tablePindahBukuVerified.ajax.reload();
    tbPindahBukuVerifiedDetail.destroy();
    hideLoadingCss();
}

function reverse_status(idMetallica, statusTracking){
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
                alert(response.OUT_MSG);
                tablePindahBukuVerified.ajax.reload();
            } else {
                alert(response.OUT_MSG);
            }
        },
        error : () => {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
        }
    });
}

function setBalance(bal){
    balance = bal;
}