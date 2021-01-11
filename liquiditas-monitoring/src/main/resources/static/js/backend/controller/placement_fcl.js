var tempTableSearch = "";
$(document).ready(function () {
    initDataTablePlacement();
//    initDataTablePlacement3();
    tableMainDashboard();
//    tableMainDashboard();
        var date = new Date();
        var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
        $("#tglcetak1").html(newDate);
        $("#tglcetak2").html(newDate);

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function dateToString(date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

function incDate(date, days) {
    date = new Date(date.getTime() + (86400000 * days));
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
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

function initDataTablePlacement(tanggal, sesi) {

    $('#table-rekap-placement-lcl').dataTable().fnDestroy();

    let rincian_saldo = $("#table-rekap-placement-lcl").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/placement_fcl",
            "data" : {
                p_tanggal: tanggal,
                p_sesi: sesi
            },
            "type" : "GET",
            "dataType" : "json",
            "dataSrc":
                function (res) {
                    return res.data;
                }
        },
        "sorting": false,
        "searching" : true,
        "paging": true,
        "bInfo" : false,
        "bLengthChange" : true,
        "columns" : [
            {"data":null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data":null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.SALDO_RECEIPT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.MANDIRI)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.BRI)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.BNI)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.BUKOPIN)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.SALDO_RECEIPT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
    });
}

function tableMainDashboard(_date, tanggal, sesi){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    var datestring = dateToString(date);
    $("#tgl1b").html(datestring);
    $("#tgl2b").html(incDate(date, 1));
    $("#tgl3b").html(incDate(date, 2));
    $("#tgl4b").html(incDate(date, 3));
    $("#tgl5b").html(incDate(date, 4));
    $("#tgl6b").html(incDate(date, 5));
//    $("#tgl7b").html(incDate(date, 6));

    let rupiah = $("#rupiah").DataTable({
        "serverSide": true,
        "bLengthChange": true,
        "paging": false,
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": false,
        "bSortable": false,
        "scrollCollapse": false,
        "aoColumnDefs": [
            {width: 100, targets: 0},
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 100, targets: 7},
//            {width: 100, targets: 8},
            {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 6, 7, 8] },
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {
                    return full.CURRENCY;
                }

            },
            {
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.BANK;
                }

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D0,2,".",",");
                }

            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D1,2,".",",");
                }

            },

            {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D2,2,".",",");
                }

            },
            {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D3,2,".",",");
                }

            },
            {
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D4,2,".",",");
                }

            },
            {
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.RP_D5,2,".",",");
                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    var ret_value = " ";
                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.CURRENCY+'\')"><i class="fa fa-clone"></i></button>';
                    return ret_value;
                }
            }
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/rekap_invoice_belum/kebutuhan_placement_fcl",
                "type":
                    "GET",
                "dataType":
                    "json",
                "data":
                    {
                        p_tanggal: tanggal,
                        p_sesi: sesi
                    }
                ,
                "dataSrc":
                function (res) {
                    hideLoadingCss()
                    return res.data;
                }
            }
        });

        rupiah.columns.adjust();
}

function seta(jenis){

    $('#set-a').modal({backdrop: 'static', keyboard: false});
    $('#table-imprest-pusat').dataTable().fnDestroy();

    let detail_placement = $("#table-imprest-pusat").DataTable({
            "ajax" : {
                "url": baseUrl + "api_operator/rekap_invoice_belum/detail_placement_fcl",
                "data" : {
                    p_jenis : jenis
                },
                "type" : "GET",
                "dataType" : "json",
                "dataSrc":
                    function (res) {
                        return res.data;
                    }
            },
            "sorting": false,
            "searching" : false,
            "paging": false,
            "bInfo" : false,
            "bLengthChange" : true,
            "columns" : [
                {"data":null,"render" : (data, type, row) => {return "<td> <span id='data0'>"+data.BANK+"</span></td>";}},
                {"data":null,"render" : (data, tyoe, row) => {return "<td> Rp. " + accounting.formatNumber(data.SISA_SALDO,2,".",",") +"</td>";
                                                             },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, tyoe, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, tyoe, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, tyoe, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, tyoe, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            ],
        });

        $(document).ready(function() {
            if (jenis == "JPY"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateJPY()">Set</button>');
            } else if (jenis == "EUR") {
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateEUR()">Set</button>');
            } else {
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateUSD()">Set</button>');
            }
        });

        $("#close").click(function(){
            $('#set').remove();
        })
}

function updateJPY(){

    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_jpy",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list)
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
                location.reload();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateEUR(){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_eur",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list)
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
                location.reload();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateUSD(){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_usd",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list)
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
                location.reload();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function openLihatDokumen(){
    $('#set-d').modal({backdrop: 'static', keyboard: false});
}
