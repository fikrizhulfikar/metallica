/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    // initDataTable();
    $("#pVendorDate").datepicker({dateFormat : "yymmdd"});
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
            if (response.status === 404) {
                Swal.fire('Oops!',response.status_message,'info');
                // hideLoadingCss();
            } else if(response.status === 200 && response.description.return === 1){
                Swal.fire('Berhasil!',response.data_length + ' data berhasil ditarik dari SAP','success');
                // hideLoadingCss();
                tableMain.ajax.reload();
            }
            hideLoadingCss();
        }),
        error : (response => {
            Swal.fire("Gagal!","Terjadi kesalahan","error");
            hideLoadingCss();
        })
    });
}