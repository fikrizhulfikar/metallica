/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    // initDataTable();
    $("#pCustomerDate").datepicker({dateFormat : 'yymmdd'});
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
            if (response.status === 404) {
                Swal.fire('Oops!',response.status_message,'info');
                // hideLoadingCss();
            } else if(response.status === 200 && response.description.return === 1){
                Swal.fire('Berhasil!',response.data_length + ' data berhasil ditarik dari SAP','success');

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