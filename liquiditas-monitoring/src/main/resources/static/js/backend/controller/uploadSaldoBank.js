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