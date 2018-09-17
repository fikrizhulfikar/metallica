/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_rekapitulasi_reject;
var idValas = "";
var allData;
var tempVendor = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    $('#pTglTerimaInvoice').datepicker({dateFormat: 'dd/mm/yy', maxDate: new Date()});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#pVendor').select2({
        width: '100%'
    });
    $('#pJenisPemabayaran').select2({
        width: '100%'
    });
    $('#pUnitPenerima').select2({
        width: '100%'
    });
    $('#pBankTujuan').select2({
        width: '100%'
    });
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectJenisPembayaran("cmb_jenis_pemabayaran", "FILTER", "");
    search("load");
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

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val(), '', '');
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, status, statusTracking) {
    showLoadingCss();
    $('#table-rekapitulasi-reject tbody').empty();
    $('#table-rekapitulasi-reject').dataTable().fnDestroy();
    table_rekapitulasi_reject = $('#table-rekapitulasi-reject').DataTable({
            "serverSide": true,
            "oSearch": {"sSearch": tempTableSearch},
            "searching": true,
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "ajax": {
                "url": baseUrl + "api_operator/pembayaran/rekap_reject",
                "type": "GET",
                "dataType": "json",
                "data": {
                    pTglAwal: pTglAwal,
                    pTglAkhir: pTglAkhir,
                    pBank: pBank,
                    pCurrency: pCurrency,
                    pPembayaran: pPembayaran,
                    status : status,
                    statusTracking : statusTracking
                },
                "dataSrc": function (res) {
                    hideLoadingCss()
                    return res.data;
                }
            },
            "columns": [
                {"data": "ROW_NUMBER", "defaultContent": ""},
                {"data": "ID_VALAS", "defaultContent": ""},
                {"data": "ID_VENDOR", "defaultContent": ""},
                {"data": "ID_UNIT", "defaultContent": ""},
                {"data": "ID_JENIS_PEMBAYARAN", "defaultContent": ""},
                {"data": "CURRENCY", "defaultContent": ""},
                {"data": "TOTAL_TAGIHAN", "defaultContent": ""},
                {"data": "TGL_JATUH_TEMPO", "defaultContent": ""},
                {"data": "KODE_BANK_TUJUAN", "defaultContent": ""},
                {"data": "KODE_BANK_PEMBAYAR", "defaultContent": ""},
                {"data": "NO_TAGIHAN", "defaultContent": ""},
                {"data": "TGL_TAGIHAN", "defaultContent": ""},
                {"data": "NO_NOTDIN", "defaultContent": ""},
                {"data": "TGL_NOTDIN", "defaultContent": ""},
                {"data": "COUNTDOWN", "defaultContent": ""},
                {"data": "DESKRIPSI", "defaultContent": ""},
                {"data": "TIPE_TRANSAKSI", "defaultContent": ""},
                {"data": "TGL_TERIMA_INVOICE", "defaultContent": ""},
                {"data": "STATUS_TRACKING", "defaultContent": ""}
            ]
        }
    );
}
