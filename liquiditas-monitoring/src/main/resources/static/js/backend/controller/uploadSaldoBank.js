/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_rekapitulasi;
var idValas = "";
var allData;
var tempVendor = "";
var tempNilaiTagihan = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;


(function() {
    $('#date_from').datepicker({dateFormat: 'dd/mm/yy'});
    $('#date_to').attr("disabled", "disabled");
    setSelectFilterBank("cmb_bank", "FILTER", "", "", "REKAP");
})();

$("#date_from").change(function () {
    var tglAwalData = $('#date_from').val();
    if (tglAwalData == "") {
        //alert("Tanggal awal belum di tentukan");
        $('#date_to').val("");
    } else {
        $('#date_to').attr("disabled", false);
        $('#date_to').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});


function upload_server_xls() {
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    fileSize = $('input[type=file]#file-xls')[0].files[0].size / 1000;
    $("#file-xls").val('');

    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_master/upload_saldo_bank/upload_xls",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            console.log(res);
            if (res.return === "1") {
                alert("Sukses Mengunggah Saldo");
                // table_rekapitulasi.ajax.reload();
                // search("load");
            } else {
                alert("Terdapat kesalahan pada data");
                // window.location = "../api_operator/pembayaran/download/"+obj["ID_UPLOAD"];
                // search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function upload_server_psd(){
    let form2 = $('form')[0];
    let formdata2 = new FormData(form2);

    formdata2.append('file',$('input[type=file]#file-xls-psd')[0].files[0]);
    fileSize = $('input[type=file]#file-xls-psd')[0].files[0].size / 1000;
    $('#file-xls-psd').val('');

    showLoadingCss()
    $.ajax({
        url : baseUrl + "api_master/upload_saldo_bank/upload_psd",
        crossOrigin: true,
        data: formdata2,
        dataType : "JSON",
        type : "POST",
        enctype: "multipart/form-data",
        cache : false,
        contentType : false,
        processData: false,
        success : (res) => {
            hideLoadingCss("");
            console.log(res);
            if (res.return === "1") {
                alert("Sukses Mengunggah Nilai Pinjaman, Subsidi, dan Dropping");
                // table_rekapitulasi.ajax.reload();
                // search("load");
            } else {
                alert("Terdapat kesalahan pada data");
                // window.location = "../api_operator/pembayaran/download/"+obj["ID_UPLOAD"];
                // search("load");
            }
        },
        error : (err) => {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
        }
    })
}

function cetakExcelAllInvoice(){
    window.open(baseUrl + "api_master/upload_saldo_bank/cetak_all_invoice");
}

function cetakRencanaImprest(){
    window.open(baseUrl + "api_master/upload_saldo_bank/cetak_rencana_imprest");
}

function cetakRealisasiImprest(){
    window.open(baseUrl + "api_master/upload_saldo_bank/cetak_realisasi_imprest");
}

function cetakAllInvoicePilot(){
    let date_from = document.querySelector("#date_from").value;
    let date_to = document.querySelector("#date_to").value;
    console.log(date_from);
    console.log(date_to);
    window.open(baseUrl + "api_master/upload_saldo_bank/cetak_all_invoice_pilot/xls/" + date_from.replaceAll("/","-") + "/" + date_to.replaceAll("/","-") + "/" + $("#cmb_currency").val() + "/" + $("#cmb_cara_pembayaran").val() + "/" + $("#cmb_bank").val());
}