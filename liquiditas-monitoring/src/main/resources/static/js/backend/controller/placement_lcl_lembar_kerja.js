var tempTableSearch = "";
var placementDetailRangkuman,
    placementLclTfReceipt,
    placementLclTfOpsPusat,
    placementLclTfInvPusat,
    placementLclImprestPusat,
    placementLclTrfImpor,
    placementLclScf,
    placementLclLastTable,
    placementLclOptimasiDana;


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

$(document).ready(function () {
    initPlacementLclPembelianValas();
    initPlacementLclTfReceipt();
    initPlacementLclOpsPusat();
    initPlacementLclInvPusat();
    initPlacementLclImprestPusat();

    //  to be checked
    initPlacementLclTfRekImpor();
    initPlacementLclScf();
    initLclOptimasiDana();
    initPlacementLast();
});

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

function initPlacementLclPembelianValas(){
    $('#tb_lcl_receipt_pembelian_valas tbody').empty();
    $('#tb_lcl_receipt_pembelian_valas').dataTable().fnDestroy();
    placementDetailRangkuman = $("#tb_lcl_receipt_pembelian_valas").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.return;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%'},
            {data : "TANGGAL", render : (data, type)=> {return `${data.substring(6, 8)}/${data.substring(4, 6)}/${data.substring(0, 4)}`;}},
            {name : 'Mandiri',width : '10%', data : "MANDIRI", render : (data, type) => {
                return `<input type="number" class="form-control" value="${data}"/>`;
            }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                return `<input type="number" class="form-control" value="${data}"/>`;
            }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                return `<input type="number" class="form-control" value="${data}"/>`;
            }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                return `<input type="number"  class="form-control" value="${data}"/>`;
            }},
            {name : 'BCA',width : '10%', data : "BCA", render : (data, type)=> {
                return `<input type="number"  class="form-control" value="${data}"/>`;
            }},
            {name : 'DKI',width : '10%', data : "DKI", render : (data, type)=> {
                return `<input type="number"  class="form-control" value="${data}"/>`;
            }},
            {name : 'UOB',width : '10%', data : "UOB", render : (data, type)=> {
                return `<input type="number"  class="form-control" value="${data}"/>`;
            }},
            {name : 'DANAMON SYARIAH',width : '10%', data : "DANAMON_SYARIAH", render : (data, type)=> {
                return `<input type="number"  class="form-control" value="${data}"/>`;
            }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        "drawCallback" : function () {
            let api = this.api();
            let rowIndex = api.row(this).index();
            let rowBankName = '';
            api.rows({page : 'current'}).every(function (rowIdx, tableLoop, rowLoop) {
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 1 && colIdx - rowIdx !== 2){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclValas() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_receipt_pembelian_valas > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(5) input').val().replace(/,/g,'');
            map.bca = $(this).find('td:eq(6) input').val().replace(/,/g,'');
            map.bank_dki = $(this).find('td:eq(7) input').val().replace(/,/g,'');
            map.uob = $(this).find('td:eq(8) input').val().replace(/,/g,'');
            map.danamon = $(this).find('td:eq(9) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementDetailRangkuman.ajax.reload();
                placementLclLastTable.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_valas`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initPlacementLclTfReceipt(){
    $('#tb_lcl_tf_receipt tbody').empty();
    $('#tb_lcl_tf_receipt').dataTable().fnDestroy();
    placementLclTfReceipt = $("#tb_lcl_tf_receipt").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_RECEIPT;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {data : "TANGGAL",name : 'TGL', render : (data, type)=> {return `${data.substring(6, 8)}/${data.substring(4, 6)}/${data.substring(0, 4)}`;}},
            {name : 'Mandiri',width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
            {name : 'BCA',width : '10%', data : "CIMB_NIAGA", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
            {name : 'Danamon Syariah',width : '10%', data : "DANAMON_SYARIAH", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
            {name : 'Maybank',width : '10%', data : "MAYBANK", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
            {name : 'DANAMON SYARIAH',width : '10%', data : "UOB", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 1 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });

}

function saveLclReceipt() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_tf_receipt > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(5) input').val().replace(/,/g,'');
            map.cimb = $(this).find('td:eq(6) input').val().replace(/,/g,'');
            map.danamon = $(this).find('td:eq(7) input').val().replace(/,/g,'');
            map.maybank = $(this).find('td:eq(8) input').val().replace(/,/g,'');
            map.uob = $(this).find('td:eq(9) input').val().replace(/,/g,'');
            map.bank_dki = '0'; //$(this).find('td:eq(7) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementLclTfReceipt.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_receipt`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initPlacementLclOpsPusat(){
    $('#tb_lcl_ops_pusat tbody').empty();
    $('#tb_lcl_ops_pusat').dataTable().fnDestroy();
    placementLclTfOpsPusat = $("#tb_lcl_ops_pusat").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_IMPREST_OPERASI;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {name : 'Mandiri', width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 0 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclOpsPusat() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_ops_pusat > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(1) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementLclTfOpsPusat.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_imprest_ops_pusat`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initPlacementLclInvPusat(){
    $('#tb_lcl_inv_pusat tbody').empty();
    $('#tb_lcl_inv_pusat').dataTable().fnDestroy();
    placementLclTfInvPusat = $("#tb_lcl_inv_pusat").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_IMPREST_INVESTASI;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {name : 'Mandiri', width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 0 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclInvPusat() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_inv_pusat > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(1) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementLclTfInvPusat.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_imprest_inv_pusat`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initPlacementLclImprestPusat(){
    $('#tb_lcl_imprest_pusat tbody').empty();
    $('#tb_lcl_imprest_pusat').dataTable().fnDestroy();
    placementLclImprestPusat = $("#tb_lcl_imprest_pusat").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_IMPREST_PUSAT;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {name : 'Mandiri', width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 0 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclImprestPusat() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_imprest_pusat > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(1) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementLclImprestPusat.ajax.reload();
                placementLclLastTable.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_imprest_pusat`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initPlacementLclTfRekImpor(){
    $('#tb_lcl_trf_rek_impor tbody').empty();
    $('#tb_lcl_trf_rek_impor').dataTable().fnDestroy();
    placementLclTrfImpor = $("#tb_lcl_trf_rek_impor").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_IMPOR;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {name : 'Mandiri', width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 0 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclTfRekImpor() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_trf_rek_impor > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(1) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementLclTrfImpor.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_impor`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initPlacementLclScf(){
    $('#tb_lcl_scf tbody').empty();
    $('#tb_lcl_scf').dataTable().fnDestroy();
    placementLclScf = $("#tb_lcl_scf").DataTable({
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_SCF;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {name : 'Mandiri', width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type)=> {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type)=> {
                    return `<input type="number"  class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 0 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclScf() {
    let ok = confirm('Ingin Menyimpan Data ?');
    if (ok){
        let list = [];
        $('#tb_lcl_scf > tbody  > tr').each(function() {
            var cell = $(this).find('td');
            var map = {};
            map.bank = $(this).find('td:eq(0)').html();
            map.mandiri = $(this).find('td:eq(1) input').val().replace(/,/g,'');
            map.bri = $(this).find('td:eq(2) input').val().replace(/,/g,'');
            map.bni = $(this).find('td:eq(3) input').val().replace(/,/g,'');
            map.bukopin = $(this).find('td:eq(4) input').val().replace(/,/g,'');
            list.push(map)
        });
        console.log(list);

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            $.toast({
                text: 'Menyimpan Data ......',
                hideAfter: false
            });
            if (this.readyState === 4 && this.status === 200){
                alert('Data Berhasil Disimpan');
                placementLclScf.ajax.reload();
            }
        };

        xhr.open('POST',`${baseUrl}api_operator/placement_lcl/ins_lcl_scf`, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(`pIdForm=${idForm}&pData=${JSON.stringify(list)}`);
    }
}

function initLclOptimasiDana(){
    $('#tb_lcl_optimasi_dana tbody').empty();
    $('#tb_lcl_optimasi_dana').dataTable().fnDestroy();
    placementLclOptimasiDana = $("#tb_lcl_optimasi_dana").DataTable({
        "serverSide" : true,
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_OPTIMASI_GIRO;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {name : 'Mandiri', width : '10%', data : "MANDIRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BRI' ,width : '10%', data : "BRI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BNI',width : '10%', data : "BNI", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Bukopin',width : '10%', data : "BUKOPIN", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'UOB',width : '10%', data : "UOB", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'BTN',width : '10%', data : "BTN", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
            {name : 'Danamon Syariah',width : '10%', data : "DANAMON_SYARIAH", render : (data, type) => {
                    return `<input type="number" class="form-control" value="${data}"/>`;
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {
            let api = this.api();
            let cols = api.settings().init().columns;
            api.rows().every(function (rowIdx, loopT, loop) {
                let data = this.data().BANK;
                api.row(rowIdx).columns().every(function (colIdx, col, loop) {
                    if (colIdx > 0 && data === cols[colIdx].name){
                        let a = api.cell(rowIdx,colIdx)
                            .node();
                        $(a).find('input').attr('readonly', true);
                    }
                });
            });
        },
    });
}

function saveLclOptimasiDana() {
    
}

function initPlacementLast(){
    $('#tb_lcl_last tbody').empty();
    $('#tb_lcl_last').dataTable().fnDestroy();
    placementLclLastTable = $("#tb_lcl_last").DataTable({
        "serverSide" : true,
        "scrollY": true,
        "scrollX": true,
        'ordering' : false,
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "ajax" : {
            'url': `${baseUrl}api_operator/placement_lcl/lembar_kerja`,
            'data' : {pIdForm : idForm},
            'type' : 'GET',
            'dataType' : 'JSON',
            "dataSrc":
                function (res) {
                    return res.OUT_REKAP_SALDO;
                }
        },
        "columns" : [
            {data : "BANK", width : '2%', name : 'BANK'},
            {width : '10%', className: 'dt-body-right', data : "SALDO_AWAL", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
            {width : '10%', className: 'dt-body-right', data : "SALDO_VALAS", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
            {width : '10%', className: 'dt-body-right', data : "CASH_IN", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
            {width : '10%', className: 'dt-body-right', data : "CASH_OUT", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
            {width : '10%', className: 'dt-body-right', data : "SALDO_AKHIR", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
            {width : '10%', className: 'dt-body-right', data : "OPTIMASI_DANA", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
            {width : '10%', className: 'dt-body-right', data : "FREE_CASHFLOW", render : function (data, row) {
                    return accounting.formatNumber(data, 2, ',', '.');
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["TIPE"] === "TOTAL"){
                $(row).css({
                    "background-color": "#77d5d4",
                    "font-weight" : "bold",
                });
            }
        },
        'drawCallback' : function () {

        },
        'footerCallback' : function (row, data, start, end, display) {
            let api = this.api();
            api.columns({page : 'current'}).every(function (colIdx,row) {
                if(colIdx > 0){
                    let sum = this.data()
                        .reduce(function (a,b) {
                            let x = parseFloat(a) || 0;
                            let y = parseFloat(b) || 0;
                            return x + y;
                        }, 0);
                    console.log(sum);
                    $(api.column(4).footer()).html(sum.toString());
                }
            });
        }
    });
}

