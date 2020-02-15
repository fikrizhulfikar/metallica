function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;
    console.log("Current Date : ",current_full_date);

    for (let i=0; i<5; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header-tanggal1").append("<td style='background-color: #F4D35E; width: 10.7%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
        $("#header-tanggal2").append("<td style='background-color: #F4D35E; width: 10.7%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],

//        "changeColor" : function (row, data, dataIndex){
////            console.log("Data : ",data["URAIAN"]);
//            const regexHead = RegExp("([A-Z])\\..");
//            // const regexChild2 = RegExp("([A-Z])\\...")
//            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]")
//            if (data["URAIAN"] === "Saldo Awal" || data["URAIAN"] === "Saldo Akhir")){
//                $(row).css({
//                    "color" : "white",
//                    "background-color": "#a01629",
//                    "cursor" : "pointer",
//                });
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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "changeColor" : function (row, data, dataIndex){
//            console.log("Data : ",data["URAIAN"]);
        const regexHead = RegExp("([A-Z])\\..");
//            const regexChild2 = RegExp("([A-Z])\\...")
        const regexChild1 = RegExp("([A-Z])\\.[(0-9)]")
            if ((data["URAIAN"] === "TOTAL")){
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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT_JENIS+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.JENIS+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';},"visible":false},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "changeColor" : function (data){
//        console.log("Data : ",data["URAIAN"]);
//        const regexHead = RegExp("([A-Z])\\..");
//        const regexChild2 = RegExp("([A-Z])\\...")
//        const regexChild1 = RegExp("([A-Z])\\.[(0-9)]")
            if (data["URAIAN"] === "TOTAL"){
                $(row).css({
                    "background-color": "#F4D35E",
                })
             }
         },
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

$(document).ready(function () {
    tableMainDashboard();

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});




