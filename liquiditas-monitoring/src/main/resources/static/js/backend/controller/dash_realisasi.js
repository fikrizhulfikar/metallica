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
                "data" : "EQ_IDR",
                "render" : (data) => {
                    return '<td>'+ new Intl.NumberFormat().format(data) +'</td>'
                },
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

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});




