var srcTglAwal = null;
var srcTglAkhir = null;

function tableMainDashboard(_date){

//    let groupColumn = 0;
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+"0"+date.getDate().toString() : current_full_date = _date;
    console.log("Current Date : ",current_full_date);

    for (let i=0; i<5; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header-tanggal1").append("<td style='background-color: #F4D35E; width: 10.7%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
        $("#header-tanggal2").append("<td style='background-color: #F4D35E; width: 13%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
        $("#header-tanggal3").append("<td style='background-color: #F4D35E; width: 10.7%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let per_bank = $("#pembayaran-bank").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/per_bank",
            "data" : {
                "tanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL" || data["NOURUT"] === "99")){
                $(row).css({
                    "background-color": "#F4D35E",
                });
             };
         },

         "drawCallback" : function (settings){
            let groupColumn = 0;
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var last = null;
            let array = api.column(groupColumn, {page:'current'}).data();

            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
            if (last !== group.BANK){
                let count = 1;

                for (let j=i; i<array.length; j++){
                    let first = array[i].BANK;
                    if (first !== array[j].BANK) break;
                    count+= 1;
                }
                $(rows).eq(i).before(
                    '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.BANK+'</td></tr>'
                );
                console.log(array)
                last = group.BANK;
                }
            });
         }
    });

    let j_pembayaran = $("#jenis-pembayaran").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/jenis_pembayaran",
            "data" : {
                "tanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){

            if ((data["URAIAN"] === "TOTAL" || data["NOURUT"] === "999")){
                $(row).css({
                    "background-color": "#F4D35E",
                });
             };
         },
    });

    let j_rekening = $("#jenis-rekening").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/jenis_rekening",
            "data" : {
                "tanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT_JENIS+'</td>';}},
            {
                "data": null,
                "visible" : false,
                "render": (data, type, row) => {
                    return data.JENIS;
                }
            },
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
//        console.log(data)
        "createdRow" : function (row, data, dataIndex){

            if ((data["JENIS"] === "TOTAL")){
                $(row).css({
                    "background-color": "#F4D35E",
//                    "colspan": "4",
                });
             };
         },

         "drawCallback" : function (settings){
            let groupColumn = 0;
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var last = null;
            let array = api.column(groupColumn, {page:'current'}).data();

            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
            if (last !== group.JENIS){
                let count = 1;

                for (let j=i; i<array.length; j++){
                    let first = array[i].JENIS;
                    if (first !== array[j].JENIS) break;
                    count+= 1;
                }
                $(rows).eq(i).before(
                    '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.JENIS+'</td></tr>'
                );
                console.log(array)
                last = group.JENIS;
                }
            });

         }
    });

    let per_vendor = $("#vendor").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/per_vendor",
            "data" : {
                "tanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "json",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT_TGL+'</td>'}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.TANGGAL+'</td>'}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.JENIS_PEMBAYARAN+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.VENDOR_NAME)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.HOUSE_BANK)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.CURRENCY)+'</td>'}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.EQ_IDR)+'</td>'}},
        ],
    });
}

// Update Senin 17/2/2020

function tableRealisasiPerVendor(_date){
    let groupColumn = 0;
    let tb_realisasi_per_vendor = $("#dash_real_per_vendor").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_vendor",
            "data" : {
                "ptanggal" : "20200208"
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "visible" : false,
                "data" : "TANGGAL"},
            {
                "width": "10%",
                "data" : "JENIS_PEMBAYARAN",
                "render" : (data) => {
                    return data;
                },
            },
            {
                "data" : "VENDOR_NAME",
                "render" : (data) => {
                    return data;
                },
            },
            {
                "data" : "HOUSE_BANK",
                "createdCell" : (cell)=>{
                    $(cell).css({
                       "text-align" : "center"
                    })
                 }
            },
            {
                "data" : "CURRENCY",
                "createdCell" : (cell)=>{
                    $(cell).css({
                       "text-align" : "center"
                    })
                }
            },
            {
                "data" : "ORI_CURR",
//                "render" : (data) => {
//                    return '<td>'+ new Intl.NumberFormat().format(data) +'</td>'
//                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR",
                "render" : (data) => {
                    return '<td> Rp. '+ new Intl.NumberFormat().format(data) +'</td>'
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["NOURUT"] === 99){
                $(row).css({
                    "background-color" : "#F4D35E",
                    "color" : "black",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","3");
                $(row).addClass("stop");
            }
        },
        "drawCallback" : function (settings){
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last = null;
            let array = api.column(groupColumn, {page:'current'} ).data();

            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    let count = 1;
                    //looping ini digunakan untuk menghitung berapa banyak rowspan yang harus dilakukan
                    for (let j=i; i<array.length; j++){
                        let first = array[i];
                        if (first !== array[j]) break;
                        count += 1;
                    }
                    $(rows).eq( i ).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group+'</td></tr>'
                    );
                    last = group;
                }
            } );
        }
    });
}

$(document).ready(function () {
//    tableMainDashboard();
    tableRealisasiPerVendor();
    initDataTableImprstValas();
        $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
        $('#tanggal_akhir').attr("disabled", "disabled");
        search("load");
        selectFilterBank("cmb_bank", "FILTER", "", "", "REKAP");
        selectFilterCashCode("cmb_cashcode", "FILTER", "", "", "REKAP");

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
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
        initDataTableImprstValas()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function initDataTableImprstValas() {
//    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_realisasi_pembayaran_cashcode",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pCashCode: $("#cmb_cashcode").val(),
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-imprst-valas tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
            nomor = key + 1;
            var vendor;
            if (val.VENDOR_NAME == null) {
            vendor = '-';
            } else {
            vendor = val.VENDOR_NAME;
            }
                var html = "<tr>" +
                    "<td>" + nomor + "</td>" +
                    "<td>" + vendor + "</td>" +
                    "<td>" + val.ID_BANK + "</td>" +
                    "<td>" + val.CURRENCY + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.ORI_CURR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                    "<td>" + val.CASH_CODE + "</td>" +
                    "</tr>";
                $('#table-imprst-valas tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL IDR</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_IDR[0].TOTAL_RP,2,".",",") + "</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_RP[0].EQ_IDR_RP,2,".",",") + "</td>" +
                                "<td></td>" +
                                "</tr>";

            var total2 = "<tr style='background-color:#67a2d8;color: white'>" +
                            "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL USD</td>" +
                                            "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_USD[0].TOTAL_USD,2,".",",") + "</td>" +
                                            "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_USD[0].EQ_IDR_USD,2,".",",") + "</td>" +
                                            "<td></td>" +
                                            "</tr>";
            var total3 = "<tr style='background-color:#67a2d8;color: white'>" +
                                        "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL EUR</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_EUR[0].TOTAL_EUR,2,".",",") + "</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_EUR[0].EQ_IDR_EUR,2,".",",") + "</td>" +
                                                        "<td></td>" +
                                                        "</tr>";
            var total4 = "<tr style='background-color:#67a2d8;color: white'>" +
                                        "<td></td>" + "<td></td>" + "<td></td>" + "<td>TOTAL JPY</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_JPY[0].TOTAL_JPY,2,".",",") + "</td>" +
                                                        "<td align='right'>" + accounting.formatNumber(res.EQ_IDR_JPY[0].EQ_IDR_JPY,2,".",",") + "</td>" +
                                                        "<td></td>" +
                                                        "</tr>";
            $('#table-imprst-valas tbody').append(total1);
            $('#table-imprst-valas tbody').append(total2);
            $('#table-imprst-valas tbody').append(total3);
            $('#table-imprst-valas tbody').append(total4);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-imprst-valas tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-imprst-valas tbody').append(html);
        }
    });
}




