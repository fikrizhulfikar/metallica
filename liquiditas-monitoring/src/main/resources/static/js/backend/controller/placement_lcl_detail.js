var tempTableSearch = "";
var placementDetailInvoice;
var placementDetailOperasi;
var placementDetailGiro;
var placementDetailDroppingUnit;
var lcl_today = null;
var tanggal = new Date();
var tglAwal = new Date();
var tglAkhir = new Date();
var tanggal2 = new Date();
var time = tanggal.getHours();
var tempTableSearch = "";
var sesi = "";

$(document).ready(function () {

});

const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);
let idForm = urlParams.get('p');
let xhttp = new XMLHttpRequest();
let jsonObj = null;
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200){
        jsonObj = JSON.parse(this.responseText);
        initPlacementLclDetail(jsonObj);
    }
};
xhttp.open('GET',  `${baseUrl}api_operator/placement_lcl/placement_lcl_detail?pIdForm=${idForm}`, true);
xhttp.send();

function dateToString(tanggal) {
    return tanggal.getDate() + "/" + (tanggal.getMonth() + 1) + "/" + tanggal.getFullYear();
}

function incDate(tanggal, days) {
    date = new Date(tanggal.getTime() + (86400000 * days));
    if (date.getMonth() >= "9"){
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    } else
        return date.getDate() + "/0" + (date.getMonth() + 1) + "/" + date.getFullYear()

}

function stringToDate(_date) {
    var formatLowerCase = 'dd/mm/yyyy';
    var formatItems = formatLowerCase.split('/');
    var dateItems = _date.split('/');
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function search(state) {
    var selObj = document.getElementById("sesi_filter");
    var ss = selObj.options[selObj.selectedIndex].text;

    if ($("#tanggal_awal1").val() === "" && ss === " " && state !== "load") {
        alert("Mohon Isi Tanggal Terlebih Dahulu");
    } else if(state === "search"){
        let tgl = $('#tanggal_awal1').val();
        tanggal = tgl;

        if (ss === "Sesi 1"){
            ss = 1;
        } else if (ss === "Sesi 2"){
            ss = 2;
        }

        sesi = ss;
        $('#tglcetak1').html(tgl);
        $('#sesicetak1').html(ss);
        $('#tglcetak2').html(tgl);
        $('#sesicetak2').html(ss);
        initDataTablePlacement(tanggal, sesi);
        initDataTablePlacement2(tanggal, sesi);
    } else {
        initDataTablePlacement(tanggal, sesi);
        initDataTablePlacement2(tanggal, sesi);
    }
}

function initPlacementLclDetail(obj){
    let invoiceMap = new Map();

    console.log('Invoice',invoiceMap.set('data', obj.return) );
    // console.log('drop',obj.OUT_DROPPING);
    // console.log('giro',obj.OUT_GIRO);
    // console.log('operasi',obj.OUT_OPERASI);

    // showLoadingCss();
    // $('#tb_detail_lcl_invoice tbody').empty();
    // $('#tb_detail_lcl_invoice').dataTable().fnDestroy();
    //
    placementDetailInvoice = $("#tb_detail_lcl_invoice").DataTable({
        "scrollY": true,
        "scrollX": true,
        "data" : obj.return,
        "columns" : [
            {data : 'ROW_NUMBER', className: 'dt-body-center'},
            {data : "JENIS_TAGIHAN", className: 'dt-body-center'},
            {data : "NAMA_CASH_CODE", className: 'dt-body-center'},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "VENDOR_NAME", className: 'dt-body-center'},
            {data : "CURRENCY", className: 'dt-body-center'},
            {data : "NOMINAL_DI_BAYAR", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',','.')} },
            {data : "NOMINAL_DI_BAYAR", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',','.')} },
            {data : "UNIT_PENERIMA", className: 'dt-body-center'},
            {data : "BANK_TUJUAN", className: 'dt-body-center'},
            {data : "BANK_PEMBAYAR", className: 'dt-body-center'},
            {data : "TGL_TAGIHAN_DITERIMA", className: 'dt-body-center', render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "TGL_TAGIHAN", className: 'dt-body-center', render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "NO_TAGIHAN", className: 'dt-body-center'},
            {data : "KETERANGAN", className: 'dt-body-center'},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
            // {data : "JENIS_TAGIHAN"},
        ]
    });
    placementDetailOperasi = $("#tb_detail_operasi_khusus").DataTable({
        "scrollY": true,
        "scrollX": true,
        "data" : obj.OUT_OPERASI,
        "columns" : [
            {data : 'ROW_NUMBER', className: 'dt-body-center'},
            {data : "DOCUMENT_DATE", className: 'dt-body-center'},
            {data : "POSTING_DATE", className: 'dt-body-center'},
            {data : "DOCUMENT_NUMBER", className: 'dt-body-center'},
            {data : "REFERENCE", className: 'dt-body-center'},
            {data : "COMPANY_CODE", className: 'dt-body-center'},
            {data : "BUSINESS_AREA", className: 'dt-body-center'},
            {data : "CURRENCY", className: 'dt-body-center'},
            {data : "DOC_HDR_TXT", className: 'dt-body-center'},
            {data : "TOTAL_TAGIHAN", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',','.')}},
            {data : "SUMBER_DANA", className: 'dt-body-center'}
        ]
    });
    placementDetailGiro = $("#id_detail_lcl_giro").DataTable({
        "scrollY": true,
        "scrollX": true,
        "data" : obj.OUT_GIRO,
        "columns" : [
            {data : 'ROW_NUMBER', className: 'dt-body-center'},
            {data : "BANK_CONTERPARTY", className: 'dt-body-center'},
            {data : "CURRENCY", className: 'dt-body-center'},
            {data : "PRODUK", className: 'dt-body-center'},
            {data : "NOMINAL", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data,2,',','.')}},
            {data : "INTEREST", className: 'dt-body-center'},
            {data : "TGL_PENEMPATAN", className: 'dt-body-center', render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "TGL_JATUH_TEMPO", className: 'dt-body-center', render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "JASA_GIRO", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2,',','.')}},
            {data : "PAJAK", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',', '.')}},
            {data : "NETT_JASA_GIRO", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',', '.')}},
            {data : "POKOK_JASA_GIRO", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',', '.')}},
            {data : "KETERANGAN", className: 'dt-body-center'}
        ]
    });
    placementDetailDroppingUnit = $("#tb_detail_lcl_dropping").DataTable({
        "scrollY": true,
        "scrollX": true,
        "data" : obj.OUT_DROPPING,
        "columns" : [
            {data : 'ROW_NUMBER', className: 'dt-body-center'},
            {data : 'BANK', className: 'dt-body-center'},
            {data : "ID_FORM", className: 'dt-body-center'},
            {data : "TANGGAL", className: 'dt-body-center', render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "DROPPING_OPERASI", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',','.');}},
            {data : "DROPPING_INVESTASI", className: 'dt-body-right', render : (data,type) => {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
}

function detailTagihan() {
    window.open(baseUrl + 'page_operator/placement_lcl/detail_tagihan');
}
