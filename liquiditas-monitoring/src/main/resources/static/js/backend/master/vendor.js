/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    // initDataTable();
    $("#pCustomerDate").datepicker();
});

function getVendor(){
    showLoadingCss();
    let vendor_no = $("#pVendorNumber").val();
    let comp_code = $("#pCompCode").val();
    let date = $("#pVendorDate").val();

    $.ajax({
        url : baseUrl + "/api_master/integrasi_sap/get_vendor",
        dataType : "JSON",
        data : {
            pDate : date,
            pVendorNo : vendor_no,
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