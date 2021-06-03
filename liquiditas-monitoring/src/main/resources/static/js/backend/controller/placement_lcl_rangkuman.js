var tempTableSearch = "";
var placementDetailRangkuman;

var tanggal = new Date();
var tglAwal = new Date();
var tglAkhir = new Date();
var tanggal2 = new Date();
var time = tanggal.getHours();
var tempTableSearch = "";
var sesi = "";
const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);
let idForm = urlParams.get('p');
let xhttp = new XMLHttpRequest();
let jsonObj = null;
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200){
        jsonObj = JSON.parse(this.responseText);
        initPlacementLclRangkuman(jsonObj);
        imprestInvTerpusat(jsonObj);
        impres(jsonObj);
        imprestOpsTerpusat(jsonObj);
        impor(jsonObj);
    }
};
xhttp.open('GET',  `${baseUrl}api_operator/placement_lcl/rangkuman?pIdForm=${idForm}`, true);
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

function initPlacementLclRangkuman(obj){
    placementDetailRangkuman = $("#tb_detail_lcl_cashflow").DataTable({
        "scrollY": true,
        "scrollX": true,
        "data" : obj.OUT_CASHFLOW,
        "columns" : [
            {data : "TIPE"},
            {data : "MANDIRI", render : (data, type)=> {return new Intl.NumberFormat().format(data);}},
            {data : "BRI", render : (data, type)=> {return new Intl.NumberFormat().format(data);}},
            {data : "BNI", render : (data, type)=> {return new Intl.NumberFormat().format(data);}},
            {data : "BUKOPIN", render : (data, type)=> {return new Intl.NumberFormat().format(data);}},
            {data : "BANK_LAINNYA", render : (data, type)=> {return new Intl.NumberFormat().format(data);}},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold !important",
                });
            }
        }
    });
}
function imprestOpsTerpusat(obj){
    let columns = ['KETERANGAN', 'TANGGAL', 'MANDIRI', 'BNI', 'BRI', 'BUKOPIN'];
    let tbData = obj.OUT_IMPREST_OPERASI;
    let tableEl = document.getElementById('tb_lcl_imprest_ops_terpusat');
    let rowBefore = null;
    let rowSpanIndex = 0;
    let notDoIndex = 0;
    tbData.forEach(function (value, index) {
        let colspan = (value[columns[0]] === value[columns[1]]) ? 2 : 1;
        let tr = document.createElement('tr');
        tr.style.textAlign = 'center';
        tr.style.verticalAlign = 'middle';
        let lastColspan = 1;
        let rowSpan = 1;
        let currentRow = value[columns[0]];
        if (currentRow !== rowBefore){
            for (let j = index+1; j < tbData.length; j++){
                if (currentRow === tbData[j].KETERANGAN){
                    rowSpan++;
                }
            }
        }
        if (rowSpan > 1) {
            rowSpanIndex = index;
            notDoIndex = rowSpanIndex + rowSpan;
        }
        rowBefore = currentRow;
        columns.forEach(function (colName, colIndex) {
            let td = document.createElement('td');
            let data = document.createTextNode((typeof(value[colName]) === 'number') ? accounting.formatNumber(value[colName], 2, '.', ',') : value[colName]);
            td.appendChild(data);

            if (typeof(value[colName]) === 'number' && value[colName] < 0){
                td.style.color = 'red';
            }

            if (lastColspan === 2){
                lastColspan = 1;
                return;
            }
            if (colIndex === 0){
                td.colSpan = colspan;
                lastColspan = colspan;
                td.rowSpan = rowSpan;
                td.style.verticalAlign = 'middle';
            }
            if (colIndex === 0 && rowSpanIndex !== index && index < notDoIndex){
                return;
            }
            tr.append(td);
        });
        tableEl.appendChild(tr);
    });
    columns = [];
}
function impor(obj){
    let columns = ['KETERANGAN', 'TANGGAL', 'MANDIRI', 'BNI', 'BRI', 'BUKOPIN'];
    let tbData = obj.OUT_IMPOR;
    let tableEl = document.getElementById('tb_lcl_impor');
    let rowBefore = null;
    let rowSpanIndex = 0;
    let notDoIndex = 0;
    tbData.forEach(function (value, index) {
        let colspan = (value[columns[0]] === value[columns[1]]) ? 2 : 1;
        let tr = document.createElement('tr');
        tr.style.textAlign = 'center';
        tr.style.verticalAlign = 'middle';
        let lastColspan = 1;
        let rowSpan = 1;
        let currentRow = value[columns[0]];
        if (currentRow !== rowBefore){
            for (let j = index+1; j < tbData.length; j++){
                if (currentRow === tbData[j].KETERANGAN){
                    rowSpan++;
                }
            }
        }
        if (rowSpan > 1) {
            rowSpanIndex = index;
            notDoIndex = rowSpanIndex + rowSpan;
        }
        rowBefore = currentRow;
        columns.forEach(function (colName, colIndex) {
            let td = document.createElement('td');
            let data = document.createTextNode((typeof(value[colName]) === 'number') ? accounting.formatNumber(value[colName], 2, '.', ',') : value[colName]);
            td.appendChild(data);
            if (lastColspan === 2){
                lastColspan = 1;
                return;
            }
            if (colIndex === 0){
                td.colSpan = colspan;
                lastColspan = colspan;
                td.rowSpan = rowSpan;
                td.style.verticalAlign = 'middle';
            }
            if (colIndex === 0 && rowSpanIndex !== index && index < notDoIndex){
                return;
            }
            tr.append(td);
        });
        tableEl.appendChild(tr);
    });
    columns = [];
}
function imprestInvTerpusat(obj){
    let columns = ['KETERANGAN', 'TANGGAL', 'MANDIRI', 'BNI', 'BRI', 'BUKOPIN'];
    let tbData = obj.OUT_IMPREST_INVESTASI;
    let tableEl = document.getElementById('tb_lcl_imprest_inv_terpusat');
    let rowBefore = null;
    let rowSpanIndex = 0;
    let notDoIndex = 0;
    tbData.forEach(function (value, index) {
        let colspan = (value[columns[0]] === value[columns[1]]) ? 2 : 1;
        let tr = document.createElement('tr');
        tr.style.textAlign = 'center';
        tr.style.verticalAlign = 'middle';
        let lastColspan = 1;
        let rowSpan = 1;
        let currentRow = value[columns[0]];
        if (currentRow !== rowBefore){
            for (let j = index+1; j < tbData.length; j++){
                if (currentRow === tbData[j].KETERANGAN){
                    rowSpan++;
                }
            }
        }
        if (rowSpan > 1) {
            rowSpanIndex = index;
            notDoIndex = rowSpanIndex + rowSpan;
        }
        rowBefore = currentRow;
        columns.forEach(function (colName, colIndex) {
            let td = document.createElement('td');
            let data = document.createTextNode((typeof(value[colName]) === 'number') ? accounting.formatNumber(value[colName], 2, '.', ',') : value[colName]);
            td.appendChild(data);
            if (typeof(value[colName]) === 'number' && value[colName] < 0){
                td.style.color = 'red';
            }
            if (lastColspan === 2){
                lastColspan = 1;
                return;
            }
            if (colIndex === 0){
                td.colSpan = colspan;
                lastColspan = colspan;
                td.rowSpan = rowSpan;
                td.style.verticalAlign = 'middle';
            }
            if (colIndex === 0 && rowSpanIndex !== index && index < notDoIndex){
                return;
            }
            tr.append(td);
        });
        tableEl.appendChild(tr);
    });
    columns = [];
}
function impres(obj){
    let columns = ['KETERANGAN', 'TANGGAL', 'MANDIRI', 'BNI', 'BRI', 'BUKOPIN'];
    let tbData = obj.return;
    let tableEl = document.getElementById('tb_lcl_imprest');
    let rowBefore = null;
    let rowSpanIndex = 0;
    let notDoIndex = 0;
    tbData.forEach(function (value, index) {
        let colspan = (value[columns[0]] === value[columns[1]]) ? 2 : 1;
        let tr = document.createElement('tr');
        tr.style.textAlign = 'center';
        tr.style.verticalAlign = 'middle';
        let lastColspan = 1;
        let rowSpan = 1;
        let currentRow = value[columns[0]];
        if (currentRow !== rowBefore){
            for (let j = index+1; j < tbData.length; j++){
                if (currentRow === tbData[j].KETERANGAN){
                    rowSpan++;
                }
            }
        }
        if (rowSpan > 1) {
            rowSpanIndex = index;
            notDoIndex = rowSpanIndex + rowSpan;
        }
        rowBefore = currentRow;
        columns.forEach(function (colName, colIndex) {
            let td = document.createElement('td');
            let data = document.createTextNode((typeof(value[colName]) === 'number') ? accounting.formatNumber(value[colName], 2, '.', ',') : value[colName]);
            td.appendChild(data);
            if (typeof(value[colName]) === 'number' && value[colName] < 0){
                td.style.color = 'red';
            }
            if (lastColspan === 2){
                lastColspan = 1;
                return;
            }
            if (colIndex === 0){
                td.colSpan = colspan;
                lastColspan = colspan;
                td.rowSpan = rowSpan;
                td.style.verticalAlign = 'middle';
            }
            if (colIndex === 0 && rowSpanIndex !== index && index < notDoIndex){
                return;
            }
            tr.append(td);
        });
        tableEl.appendChild(tr);
    });
    columns = [];
}

