var tempTableSearch = "";
var kebutuhanPlacement;
var lcl_today = null;
var tanggal = new Date();
var tanggal2 = new Date();
var time = tanggal.getHours();
var tempTableSearch = "";
var sesi = "";

$(document).ready(function () {
    let dd = String(tanggal.getDate()).padStart(2,'0');
    let mm = String(tanggal.getMonth() + 1).padStart(2,'0');
    let yyyy = tanggal.getFullYear();

    tanggal = dd+'/'+mm+'/'+yyyy;

    initDataTablePlacement();
    initDataTablePlacement2();

    if (time <= "14"){
        sesi = 1;
    } else if (time >= "14"){
        sesi = 2;
    }

    $("#tglcetak1").html(tanggal);
    $("#sesicetak1").html(sesi);
    $("#tglcetak2").html(tanggal);
    $("#sesicetak2").html(sesi);
    $("#tglApprove").html(tanggal);
    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
    search("load");


    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

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

function initDataTablePlacement() {
    let date = new Date();

    $("#tgl1a").html(tanggal);
    var dateString = tanggal;
    var dateArray = dateString.split("/");
    var newDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    var dateObject = new Date(newDate);

    $("#tgl2a").html(incDate(dateObject, 1));
    $("#tgl3a").html(incDate(dateObject, 2));
    $("#tgl4a").html(incDate(dateObject, 3));
    $("#tgl5a").html(incDate(dateObject, 4));
    $("#tgl6a").html(incDate(dateObject, 5));

    showLoadingCss();
    $('#operasi-pendanaan-valas tbody').empty();
    $('#operasi-pendanaan-valas').dataTable().fnDestroy();

    kebutuhanPlacement = $("#operasi-pendanaan-valas").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "bLengthChange": false,
        "paging": false,
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": false,
        "bSortable": false,
        "scrollCollapse": false,
        "bInfo": false,
        "aoColumnDefs": [
            {width: 100, targets: 0},
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 100, targets: 7},
            {width: 100, targets: 8},
//            {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9] },
            {
                "data":null,
                "aTargets": [0],
//                "visible" : false,
                "mRender": function (data, type, full) {
                    return full.CURRENCY;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#77D5D4");}
            },
            {
                "data":null,
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.KETERANGAN;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#5ef4d3");}
            },
            {
                "data":null,
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D0,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D1,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D2,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D3,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D4,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D5,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_TOTAL,2,".",",") + "</td";
                }

            },
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {
                    var ret_value = " ";
                    if (full.TIPE_KEBUTUHAN == "RECEIPT PLACEMENT" || full.TIPE_KEBUTUHAN == "GIRO SPECIAL RATE" ){
                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                    return ret_value;
                    } else {
                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                    return ret_value; }
                }
            }
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/rekap_invoice_belum/operasi_pendanaan_valas",
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
            },

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL")){
                $(row).css({
                    "background-color": "#5ef4d3",
                    "font-weight": "bold",
                });
             }
         }
     });

     kebutuhanPlacement.on('search.dt', function () {
         var value = $('.dataTables_filter2 input').val();
         tempTableSearch = value;
     });

    kebutuhanPlacement.columns.adjust();
}

function initDataTablePlacement2(){
    let date = new Date();

    $("#tgl1b").html(tanggal);
    var dateString = tanggal;
    var dateArray = dateString.split("/");
    var newDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    var dateObject = new Date(newDate);

    $("#tgl2b").html(incDate(dateObject, 1));
    $("#tgl3b").html(incDate(dateObject, 2));
    $("#tgl4b").html(incDate(dateObject, 3));
    $("#tgl5b").html(incDate(dateObject, 4));
    $("#tgl6b").html(incDate(dateObject, 5));

    showLoadingCss();
    $('#operasi-pendanaan-idr tbody').empty();
    $('#operasi-pendanaan-idr').dataTable().fnDestroy();

    kebutuhanPlacement = $("#operasi-pendanaan-idr").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "bLengthChange": false,
        "paging": false,
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": false,
        "bSortable": false,
        "scrollCollapse": false,
        "bInfo": false,
        "aoColumnDefs": [
            {width: 100, targets: 0},
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 100, targets: 7},
            {width: 100, targets: 8},
//            {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9] },
            {
                "data":null,
                "aTargets": [0],
//                "visible" : false,
                "mRender": function (data, type, full) {
                    return full.JENIS;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#77D5D4");}
            },
            {
                "data":null,
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.KETERANGAN;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#5ef4d3");}
            },
            {
                "data":null,
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D0,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D1,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D2,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D3,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D4,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D5,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_TOTAL,2,".",",") + "</td";
                }

            },
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {
                    var ret_value = " ";
                    if (full.TIPE_KEBUTUHAN == "RECEIPT PLACEMENT" || full.TIPE_KEBUTUHAN == "GIRO SPECIAL RATE" ){
                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                    return ret_value;
                    } else {
                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                    return ret_value; }
                }
            }
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/rekap_invoice_belum/operasi_pendanaan_idr",
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
            },

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL")){
                $(row).css({
                    "background-color": "#5ef4d3",
                    "font-weight": "bold",
                });
             }
         }
     });

     kebutuhanPlacement.on('search.dt', function () {
         var value = $('.dataTables_filter2 input').val();
         tempTableSearch = value;
     });

    kebutuhanPlacement.columns.adjust();
}

function viewDoc(){
    alert("Mohon maaf fitur ini belum tersedia");
}

function generateExcel(){
    alert("Mohon maaf fitur ini belum tersedia");
}

function seta(jenis){

    $('#set-a').modal({backdrop: 'static', keyboard: false});
    $('#table-imprest-pusat').dataTable().fnDestroy();

    let detail_placement = $("#table-imprest-pusat").DataTable({
            "ajax" : {
                "url": baseUrl + "api_operator/rekap_invoice_belum/detail_placement_imprest",
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
                {"data":null,"render" : (data, type, row) => {return "<td> Rp. " + accounting.formatNumber(data.SISA_SALDO,2,".",",") +"</td>";
                                                             },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            ],
        });

        $(document).ready(function() {
            if (jenis == "IMPREST KANTOR PUSAT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImprestPusat()">Set</button>');
            } else if (jenis == "IMPOR") {
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImpor()">Set</button>');
            } else if (jenis == "IMPREST OPERASI TERPUSAT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImprestOperasi()">Set</button>');
            } else if (jenis == "IMPREST INVESTASI TERPUSAT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImprestInvestasi()">Set</button>');
            } else if (jenis == "SETTLEMENT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateSettlement()">Set</button>');
            } else {
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updatePengadaanValas()">Set</button>');
            }
        });

        $("#close").click(function(){
            $('#set').remove();
        })
}

function setb(jenis){

    $('#set-b').modal({backdrop: 'static', keyboard: false});
    $('#table-receipt-placement').dataTable().fnDestroy();

    let detail_placement_2 = $("#table-receipt-placement").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/detail_placement_imprest",
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
            {"data":null,"render" : (data, tyoe, row) => {if (data.MEGA == "0" || data.MEGA == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data5' type='number' value='"+ data.MEGA +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data5' type='number' value='"+ data.MEGA +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.DKI == "0" || data.DKI == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data6' type='number' value='"+ data.DKI +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data6' type='number' value='"+ data.DKI +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.BCA == "0" || data.BCA == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data7' type='number' value='"+ data.BCA +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data7' type='number' value='"+ data.BCA +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.BII == "0" || data.BII == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data8' type='number' value='"+ data.BII +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data8' type='number' value='"+ data.BII +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.BRIS == "0" || data.BRIS == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data9' type='number' value='"+ data.BRIS +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data9' type='number' value='"+ data.BRIS +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.BTN == "0" || data.BTN == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data10' type='number' value='"+ data.BTN +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data10' type='number' value='"+ data.BTN +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.DANAMON_SYARIAH == "0" || data.DANAMON_SYARIAH == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data11' type='number' value='"+ data.DANAMON_SYARIAH +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data11' type='number' value='"+ data.DANAMON_SYARIAH +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.OCBC_NISP == "0" || data.OCBC_NISP == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data12' type='number' value='"+ data.OCBC_NISP +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data12' type='number' value='"+ data.OCBC_NISP +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.UOB == "0" || data.UOB == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data13' type='number' value='"+ data.UOB +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data13' type='number' value='"+ data.UOB +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.DBS == "0" || data.DBS == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data14' type='number' value='"+ data.DBS +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data14' type='number' value='"+ data.DBS +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CIMB_NIAGA == "0" || data.CIMB_NIAGA == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data15' type='number' value='"+ data.CIMB_NIAGA +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data15' type='number' value='"+ data.CIMB_NIAGA +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
    });

    $(document).ready(function() {
        if (jenis == "RECEIPT PLACEMENT"){
            $('#container2').append('<button type="button" class="btn btn-primary" onclick="updateReceiptPlacement()">Set</button>');
        } else {
            $('#container2').append('<button type="button" class="btn btn-primary" onclick="updateGiroSpecial()">Set</button>');
        }
    });

    $("#close").click(function(){
        $('#set').remove();
    })
}


function updateImprestPusat(){

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
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_imprest",
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

function updateImpor(){
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
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_impor",
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

function updateImprestOperasi(){
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
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_imprest_operasi",
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

function updateImprestInvestasi(){
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
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_imprest_invest",
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

function updateSettlement(){
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
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_Settelment",
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

function updatePengadaanValas(){
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
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_proyeksi_valas",
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

function updateReceiptPlacement(){
    var row = $("#table-receipt-placement").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-receipt-placement > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        map.data5 = cell.find('input#data5').val();
        map.data6 = cell.find('input#data6').val();
        map.data7 = cell.find('input#data7').val();
        map.data8 = cell.find('input#data8').val();
        map.data9 = cell.find('input#data9').val();
        map.data10 = cell.find('input#data10').val();
        map.data11 = cell.find('input#data11').val();
        map.data12 = cell.find('input#data12').val();
        map.data13 = cell.find('input#data13').val();
        map.data14 = cell.find('input#data14').val();
        map.data15 = cell.find('input#data15').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_receipt",
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

function updateGiroSpecial(){
    var row = $("#table-receipt-placement").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-receipt-placement > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        map.data5 = cell.find('input#data5').val();
        map.data6 = cell.find('input#data6').val();
        map.data7 = cell.find('input#data7').val();
        map.data8 = cell.find('input#data8').val();
        map.data9 = cell.find('input#data9').val();
        map.data10 = cell.find('input#data10').val();
        map.data11 = cell.find('input#data11').val();
        map.data12 = cell.find('input#data12').val();
        map.data13 = cell.find('input#data13').val();
        map.data14 = cell.find('input#data14').val();
        map.data15 = cell.find('input#data15').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_giro_special",
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

function update_lcl_data(status, tanggal, sesi){
    var confirmation = confirm("Apakah Anda yakin akan menyetujui placement LCL "+document.getElementById("tglcetak2").innerHTML+" ?");
    console.log("Ini data : " + status + sesi);
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/rekap_invoice_belum/verifikasi_placement_lcl",
            data : {
                p_status : status,
                p_tanggal : tanggal,
                p_sesi: sesi
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    alert("Data Berhasil Disetujui");
                    kebutuhanPlacement.ajax.reload();
                } else
                    alert("Maaf, Terjadi Kesalahan");
                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}

function reverse_lcl_data(status, tanggal, sesi){
    var confirmation = confirm("Apakah Anda yakin akan mereverse dropping periode "+document.getElementById("tglcetak2").innerHTML+" ?");
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/rekap_invoice_belum/reverse_placement_lcl",
            data : {
                p_status : status,
                p_tanggal : tanggal,
                p_sesi: sesi
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    alert("Data Berhasil Direverse");
                    kebutuhanPlacement.ajax.reload();
//                    refreshFooter();
                }else alert("Maaf, Terjadi Kesalahan");

                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}
