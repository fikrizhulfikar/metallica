var tempTableSearch = "";
var h0bri,
    h0mdr,
    h0bni,
    h1bri,
    h1mdr,
    h1bni,
    h2bri,
    h2mdr,
    h2bni;

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
let idForm = sessionStorage.getItem("nota_id");
document.getElementById("id_nota").innerHTML = idForm;
let xhttp = new XMLHttpRequest();
let jsonObj = null;
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200){
        jsonObj = JSON.parse(this.responseText);
        let tableData = recreateJson(jsonObj);
        initH0(tableData);
        initH1(tableData);
        initH2(tableData);
    }
};
xhttp.open('GET',  `${baseUrl}api_operator/placement_lcl/placement_lcl_sepuluh?pIdForm=${idForm}&pBank=${$("#lcl_sepuluh_bank").val()}`, true);
xhttp.send();

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

function recreateJson(obj) {
    let bankMap;
    let dayMap = {};
    let bri,
        bni,
        mandiri;
    if (!jQuery.isEmptyObject(obj)){
        for (const [key, value] of Object.entries(obj)){
            bri = [];
            bni = [];
            mandiri = [];
            bankMap = {};
            if (value.length > 0){
                value.forEach(function (el) {
                    if (el.BANK_PEMBAYAR === 'BRI'){
                        bri.push(el);
                    }else if(el.BANK_PEMBAYAR === 'MANDIRI'){
                        mandiri.push(el);
                    }else {
                        bni.push(el);
                    }
                });
                bankMap.BRI = bri;
                bankMap.MANDIRI = mandiri;
                bankMap.BNI = bni;
                dayMap[key] = bankMap;
            }else {
                bankMap.BRI = [];
                bankMap.MANDIRI = [];
                bankMap.BNI = [];
                dayMap[key] = bankMap;
            }
        }
    }
    console.log(dayMap);
    return dayMap;
}

function initH0(tableData){
    $('#tb_detail_lcl_h0 tbody, #tb_detail_lcl_h1 tbody, #tb_detail_lcl_h2 tbody').empty();
    $('#tb_detail_lcl_h0').dataTable().fnDestroy();
    $('#tb_detail_lcl_h1').dataTable().fnDestroy();
    $('#tb_detail_lcl_h2').dataTable().fnDestroy();
    //
    h0bri = $("#tb_h0_bri").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.return.BRI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
    h0mdr = $("#tb_h0_mdr").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.return.MANDIRI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
    h0bni = $("#tb_h0_bni").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "ordering": false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.return.BNI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
}
function initH1(tableData){
    //
    h1bri = $("#tb_h1_bri").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.OUT_H1.BRI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
    h1mdr = $("#tb_h1_mdr").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.OUT_H1.MANDIRI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
    h1bni = $("#tb_h1_bni").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "ordering": false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.OUT_H1.BNI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
}
function initH2(tableData){
    h2bri = $("#tb_h2_bri").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.OUT_H2.BRI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
    h2mdr = $("#tb_h2_mdr").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.OUT_H2.MANDIRI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
    h2bni = $("#tb_h2_bni").DataTable({
        "scrollY": true,
        "scrollX": true,
        "paging":   false,
        "ordering": false,
        "order": [[3, 'desc']],
        "info":     false,
        "searching" : false,
        "data" : tableData.OUT_H2.BNI,
        "columns" : [
            {data : "VENDOR_NAME", className: 'dt-body-center', orderable: false},
            {data : "TGL_RENCANA_BAYAR", className: 'dt-body-center', orderable: false, render : (data, type) => {let d = new Date(data); return ("0" + d.getDate()).slice(-2)+"/"+(("0" + (d.getMonth()+1)).slice(-2))+"/"+d.getFullYear();}},
            {data : "CURR_BAYAR", className: 'dt-body-center', orderable: false},
            {data : "NOMINAL", className: 'dt-body-right', render : (data, type)=> {return accounting.formatNumber(data, 2, ',', '.');}},
        ]
    });
}

$("#lcl_sepuluh_bank").on("change", function () {
    const urlString = window.location.search;
    const urlParams = new URLSearchParams(urlString);
    let idForm = urlParams.get('p');
    let xhttp = new XMLHttpRequest();
    let jsonObj = null;
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200){
            jsonObj = JSON.parse(this.responseText);
            initPlacementLclSepuluh(jsonObj);
        }
    };
    xhttp.open('GET',  `${baseUrl}api_operator/placement_lcl/placement_lcl_sepuluh?pIdForm=${idForm}&pBank=${$("#lcl_sepuluh_bank").val()}`, true);
    xhttp.send();
});
