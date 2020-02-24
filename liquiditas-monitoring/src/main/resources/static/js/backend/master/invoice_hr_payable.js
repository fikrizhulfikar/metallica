/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    initDataTable();
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

function AddToTable() {
    var kd = $("#pKodeBankDetail").val();
    var nama = $("#pNamaBankDetail").val();
    var flag = $("#pFlagDetail").val();
    if (kd == "" || nama == "") {
        alert("Mohon Lengkapi Data")
    } else {

        $("#table-main-detail tbody").find("tr").each(function (index) {
            var temphtml = $(this).find('td').toArray();
            if($(temphtml[0]).html() == "No Data"){
                $(this).remove()
            }
        });

        var sts = "";
        flag == 1 ? sts = 'TAMPIL' : sts = 'TIDAK TAMPIL'
        var html = "<tr>" +
            "<td>" + kd + "</td>" +
            "<td>" + nama + "</td>" +
            "<td>" + Bank.pJenis + "</td>" +
            "<td>" + sts + "</td>" +
            "<td align='center'> <a href='javascript: void(0)'  class='dele'><span class='fa fa-trash'></span></a></td>'";

        $("#table-main-detail tbody").append(html);
    }

    $("#pKodeBankDetail").val("");
    $("#pNamaBankDetail").val("");

    dele()


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
                "<td colspan='5' align='center'>No Data</td>" +
                "</tr>"

            $("#table-main-detail tbody").append(html);
        }
    });
}


var Bank = "";
function getDetails(id, jenis) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/bank/get_bank_valas_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pKodeBank: id,
            pJenis: jenis
        },
        success: function (res) {
            $(".list-data").hide();
            $(".detail-data").show();
            hideLoadingCss()
            console.log("get detail : ", res);

            Bank = {
                pKdBank: res.return[0].KODE_BANK,
                pNamaBank: res.return[0].NAMA_BANK,
                pJenis: res.return[0].JENIS,
                pFLag: res.return[0].FLAG_TAMPIL,
                bankDetails: null
            }


            if(res.OUT_CHILD.length > 0){
                $("#table-main-detail tbody").empty()
                $.each(res.OUT_CHILD, function( index, val ) {

                    var lblFlag = "TAMPIL";
                    if(val.FLAG_TAMPIL == 0){
                        lblFlag = "TIDAK TAMPIL"
                    }

                    var html = "<tr>" +
                    "<td>"+val.KODE_BANK+"</td>"+
                    "<td>"+val.NAMA_BANK+"</td>"+
                    "<td>"+val.JENIS+"</td>"+
                    "<td>"+lblFlag+"</td>"+
                    "<td align='center'> <a href='javascript: void(0)'  class='dele'><span class='fa fa-trash'></span></a></td>'";

                    $("#table-main-detail tbody").append(html)
                });
            }
            // else{
            //     var html = "<tr>" +
            //     "<td align='center' colspan='5'>No Data</td>"+
            //     "</tr>";
            //
            //     $("#table-main-detail tbody").append(html)
            // }
            dele()


        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });


}

function submitChild() {
    dataList = []
    $("#table-main-detail tbody").find("tr").each(function (index) {
        var temphtml = $(this).find('td').toArray();
        var pStsflag = "";
        if($(temphtml[3]).html() == "TAMPIL"){
            pStsflag = 1
        }else{
            pStsflag = 0
        }
        var prm = {
            pKdBank: $(temphtml[0]).html(),
            pNamaBank: $(temphtml[1]).html(),
            pJenis: Bank.pJenis,
            pFLag: pStsflag
        };
        dataList.push(prm);
    });

    Bank.bankDetails = dataList;
    console.log("bank : ",Bank);
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/bank/ins_bank_valas",
        contentType : "application/json",
        dataType : 'json',
        type: "POST",
        data: JSON.stringify(Bank),
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

function initDataTable() {
    showLoadingCss();
    $('#table-main tbody').empty();
    //$('#table-main').dataTable().fnDestroy();
    tableMain = $('#table-main').DataTable({
        "ajax": {
            "url": baseUrl + "api_master/general_bank/invoice_hr_payable",
            "type": "GET",
            "dataType": "json",
        },
        "columns": [

            {"data": "COMP_CODE"},
            {"data": "DOC_NO"},
            {"data": "FISC_YEAR"},
            {"data": "DOC_TYPE"},
            {"data": "DOC_DATE"},
            {"data": "POST_DATE"},
            {"data": "ENTRY_DATE"},
            {"data": "REFERENCE"},
            {"data": "REV_WITH"},
            {"data": "REV_YEAR"},
            {"data": "DOC_HDR_TXT"},
            {"data": "CURRENCY"},
            {"data": "DOC_HDR_TXT"},
            {"data": "EXCH_RATE"},
            {"data": "REFERENCE_KEY"},
            {"data": "PMT_IND"},
            {"data": "TRANS_TYPE"},
            {"data": "SPREAD_VAL"},
            {"data": "LINE_ITEM"},
            {"data": "OI_IND"},
            {"data": "ACCT_TYPE"},
            {"data": "SPEC_GL"},
            {"data": "BUS_AREA"},
            {"data": "TPBA"},
            {"data": "AMT_LC"},
            {"data": "AMT_TC"},
            {"data": "AMT_WITH_BASE_TC"},
            {"data": "AMT_WITH_TC"},
            {"data": "ASSIGNMENT"},
            {"data": "ITEM_TEXT"},
            {"data": "COST_CTR"},
            {"data": "GL_ACCT"},
            {"data": "CUSTOMER"},
            {"data": "CUSTOMER_NAME"},
            {"data": "VENDOR"},
            {"data": "VENDOR_NAME"},
            {"data": "BASE_DATE"},
            {"data": "TERM_PMT"},
            {"data": "DUE_ON"},
            {"data": "PMT_BLOCK"},
            {"data": "HOUSE_BANK"},
            {"data": "HOUSE_BANK"},
            {"data": "BANK_KEY"},
            {"data": "BANK_ACCOUNT"},
            {"data": "ACCOUNT_HOLDER"},
            {"data": "PO_NUM"},
            {"data": "PO_ITEM"},
            {"data": "REF_KEY1"},
            {"data": "REF_KEY2"},
            {"data": "REF_KEY3"},
            {"data": "INT_ORDER"},
            {"data": "WBS_NUM"},
            {"data": "CASH_CODE"},
            {"data": "CORP_PMT"},
            {"data": "DR_CR_IND"},
            {"data": "AMT_WITH_BASE_LC"},
            {"data": "AMT_WITH_LC"},
            {"data": "M_DATA_DATE"},
            {"data": "TGL_VERIFIKASI_MAKER"},
            {"data": "TGL_VERIFIKASI_CHECKER"},
            {"data": "TGL_VERIFIKASI_APPROVER"},
            {"data": "METODE_PEMBAYARAN"},
            {"data": "TGL_RENCANA_BAYAR"},
            {"data": "SUMBER_DANA"},
            {"data": "KETERANGAN"},
            {"data": "FLAG_STATUS"},
            {"data": "ID_GROUP"},
            {"data": "NAMA_GROUP"},
            {"data": "TGL_GROUP"},
            {"data": "GROUP_BY"},
            {"data": "NO_REK_HOUSE_BANK"},
            {"data": "INQ_CUSTOMER_NAME"},
            {"data": "INQ_ACCOUNT_NUMBER"},
            {"data": "INQ_ACCOUNT_STATUS"},
            {"data": "KODE_BANK_PENERIMA"},
            {"data": "RETRIEVAL_REF_NUMBER"},
            {"data": "CUSTOMER_REF_NUMBER"},
            {"data": "CONFIRMATION_CODE"},
            {"data": "TGL_ACT_BAYAR"}
        ],
        "drawCallback": function (settings) {
//            $('th').removeClass('sorting_asc');
//            $('th').addClass('th-middle');
        }
    })
hideLoadingCss()
}

function getHrPayable(){
    var stateCrf = confirm("Anda Yakin Akan Menarik Data Ap Invoice ? (Pastikan Data Sudah Benar)");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_master/integrasi_sap/get_hr_payable",
            dataType: 'JSON',
            type: "POST",
            data: {
                pCompanyCode: $("#pCompanyCode").val(),
                pBusArea: $("#pBusArea").val(),
                pDocNo: $("#pDocNo").val(),
                pFiscYear: $("#pFiscYear").val(),
                pDateFrom: $("#pDateFrom").val(),
                pDateTo: $("#pDateTo").val()
            },
            success: function (res) {
                showLoadingCss();
                if (res.ERROR_CODE == 'undefined' || res.ERROR_CODE == null) {
                    alert('DATA BERHASIL DI TARIK');
                    // search("load");
                    // $('#edit-modal').modal('hide');
                    hideLoadingCss();
                    tableMain.ajax.reload();
                } else {
                    alert('DATA GAGAL DI TARIK');
                    hideLoadingCss()
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });

    }
}