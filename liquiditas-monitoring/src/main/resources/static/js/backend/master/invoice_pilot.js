var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    initDataTable();
    $('#pDateFrom').datepicker({dateFormat : 'yymmdd'});
    $('#pDateTo').datepicker({dateFormat : 'yymmdd'});
    // $('#pFiscYear').datepicker({dateFormat : 'yy'});
});

function initDataTable() {
    showLoadingCss();
    $('#table-main tbody').empty();
    //$('#table-main').dataTable().fnDestroy();
    tableMain = $('#table-main').DataTable({
        "ajax": {
            "url": baseUrl + "api_master/general_bank/ap_invoice",
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
            {"data": "GROUP_ID"},
            {
                "data": null, //"NAMA_GROUP",
                "render" : function (data){
                    return "NULL";
                }
            },
            {
                "data": null,//"TGL_GROUP"
                "render" : function (data){
                    return "NULL";
                }
            },
            {
                "data": null, //"GROUP_BY"
                "render" : function (data){
                    return "NULL";
                }
            },
            {"data": "NO_REK_HOUSE_BANK"},
            {"data": "INQ_CUSTOMER_NAME"},
            {"data": "INQ_ACCOUNT_NUMBER"},
            {"data": "INQ_ACCOUNT_STATUS"},
            {"data": "KODE_BANK_PENERIMA"},
            {"data": "RETRIEVAL_REF_NUMBER"},
            {"data": "CUSTOMER_REF_NUMBER"},
            {"data": "CONFIRMATION_CODE"},
            {"data": "TGL_ACT_BAYAR"},
        ],
        "drawCallback": function (settings) {
//            $('th').removeClass('sorting_asc');
//            $('th').addClass('th-middle');
        }
    })
hideLoadingCss()
}

function getInvoicePilotOss(){
    if (validateForm("#form") !== 0){
        Swal.fire('Oops!',"Silahkan Lengkapi Isian",'info');
    }else{
        var stateCrf = confirm("Anda Yakin Akan Menarik Data Invoice ? (Pastikan Data Sudah Benar)");
        if (stateCrf == true) {
            showLoadingCss();
            $.ajax({
                url: `${baseUrl}api_master/integrasi_sap/get_invoice_oss_pilot`,
                dataType: 'JSON',
                type: "GET",
                data: {
                    pCompanyCode: $("#pCompanyCode").val(),
                    pBusArea: $("#pBusArea").val(),
                    pDocNo: $("#pDocNo").val(),
                    pFiscYear: $("#pFiscYear").val(),
                    pDateFrom: $("#pDateFrom").val(),
                    pDateTo: $("#pDateTo").val()
                },
                success: function (response) {
                    if (response.status === 404) {
                        Swal.fire('Oops!',response.status_message,'info');
                    } else if(response.status === 200 && response.description.return === 1){
                        Swal.fire('Berhasil!','Data berhasil ditarik dari SAP','success');
                        // hideLoadingCss();
                        tableMain.ajax.reload();
                    } else {
                        Swal.fire('Oops!',response.status_message,'info');
                    }
                    hideLoadingCss();
                },
                error: function (response) {
                    Swal.fire("Gagal!","Terjadi kesalahan","error");
                    hideLoadingCss()
                }
            });
        }
    }
}

function validateForm(form_name){
    let empty=0;
    $(form_name)
        .find("select, input, textarea")
        .each(function(){
            if (($(this).prop("required") && $(this).val() === "") || $(this).val() === null || $(this).attr("selectedIndex") === 0){
                empty++;
            }
        });
    return empty;
}