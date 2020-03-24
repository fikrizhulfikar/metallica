/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    // initDataTable();
    $("#pCustomerDate").datepicker();
});

function getCustomer(){
    showLoadingCss();
    let cust_no = $("#pCustomerNumber").val();
    let comp_code = $("#pCompCode").val();
    let date = $("#pCustomerDate").val();

    $.ajax({
        url : baseUrl + "/api_master/integrasi_sap/get_customer",
        dataType : "JSON",
        data : {
            pDate : date,
            pCustomerNo : cust_no,
            pCompCode : comp_code,
        },
        success : (response => {
            hideLoadingCss();
            if (response.ERROR_CODE === 'undefined' || response.ERROR_CODE === null){
                Swal.fire("Berhasil!","Data berasil ditarik dari SAP","success");
            }else if(response.ERROR_CODE === 404){
                Swal.fire("Gagal!","Data tidak ditemukan","error");
            }
        }),
        error : (response => {
            Swal.fire("Gagal!","Terjadi kesalahan","error");
            // hideLoadingCss();
        })
    });
}