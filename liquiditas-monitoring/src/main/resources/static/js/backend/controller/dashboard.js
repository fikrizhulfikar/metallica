$(document).ready(function () {
    tableMainDashboard();
    dataTable();
    tableRencanaImprestValas();
    tableRencanaImpres();
    tableRealisasiBankCurrency();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;
//        let current_month = date.getMonth()+1;
//        let current_full_date;
//        (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+"0"+date.getDate().toString() : current_full_date = _date;
//         let current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString();
//        console.log("Current Date : ",current_full_date);
    var datestring = dateToString(date);
        $("#tgl1a").html(datestring);
        $("#tgl2a").html(incDate(date, 1));
        $("#tgl3a").html(incDate(date, 2));
        $("#tgl4a").html(incDate(date, 3));
        $("#tgl5a").html(incDate(date, 4));

        $("#tgl1b").html(incDate(date, -5));
        $("#tgl2b").html(incDate(date, -4));
        $("#tgl3b").html(incDate(date, -3));
        $("#tgl4b").html(incDate(date, -2));
        $("#tgl5b").html(incDate(date, -1));

        for (let i=0; i<5; i++){
            let tgl = date.getDate()+i;
            let tgl2 = date.getDate()-5+i;
            let month = date.getMonth()+1;
//            $("#header-tanggal").append("<th style='vertical-align: middle;text-align: center'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</th>");
//            $("#header_tanggal_realisasi").append("<th style='vertical-align: middle; text-align: center'>"+tgl2+"/"+0+month+"/"+date.getFullYear()+"</th>");
        }

    let main_rencana = $("#main-rencana").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/saldo_awal",
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
            {"data": null,"render": (data, type, row) => { if (data.URAIAN === "Bank"){
                                                            return '<td >'+data.URAIAN+'<img src="/static/images/add.svg" height="12.5" width="12.5" onclick="showModal(location.href="http://google.com")"/></td>';
                                                            } else
                                                            return '<td >'+data.URAIAN+'</td>';
                }},
            {"data": "ISANAK","visible":false},
            {
                "data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    } else if (Intl.NumberFormat().format(data.RP_D0) === "0" ){
                        return "";
                    } else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {
                    // console.log("EL : ",rowata);
                    $(cell).css("text-align","right");
                    (rowata.URAIAN.trim() === "Jenis Rekening") ? $(cell).css("border-right","0px") : $(cell).css("border-right","1px");

                }},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D1) === "0" ){
                        return "";
                    }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D2) === "0" ){
                        return "";
                    }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D3) === "0" ){
                        return "";
                    }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D4) === "0" ){
                                                 return "";
                                             }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){
        // console.log("Data Index: ",dataIndex);
        // console.log("Cok1 : ",$(row));
        const regexHead = RegExp("([A-Z])\\..");
        const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

        if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"])) {
            $(row).css({
                "color": "white",
                "background-color": "#16a085",
                "cursor": "pointer",
            });
            $(row).addClass("grand-parent");
            $(row).addClass("parent");
            $(row).attr("onclick", "showParents(this)");

        }

        if (data["ISANAK"] === 0 && regexChild1.test(data["KODE"])){
            $(row).css({
                "background-color": "#f1c40f",
                "cursor": "pointer",
            });
            $(row).attr("onclick","showChild(this)");
            $(row).addClass("parent");
        };

        if (data["ISANAK"] === 1){
            $(row).addClass("child");
            $(row).hide();
        };

        if (data["URAIAN"] === null) {$(row).remove()};
    },
        "initComplete" : (settings, json) => {
            let parent = $(".grand-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });

    let main_realisasi = $("#main-realisasi").DataTable({
            "ajax" : {
                "url": baseUrl + "api_operator/api_report/saldo_realisasi",
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
                {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>'}},
                {"data": "KODE","visible":false},
                {
                    "data":null,"render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (data.URAIAN.trim() === "BANK"){
                            return '<td class="trigger">' + data.URAIAN + '</td>'
                        }else if (Intl.NumberFormat().format(data.RP_DMIN5) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN5)+'</td>'
                    },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {
                    "data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN4) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN4)+'</td>';
                    },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN3) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN3)+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN2) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN2)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"  ){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN1) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN1)+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            ],
            "createdRow" : function (row, data, dataIndex){
    //            console.log("Data : ",data["URAIAN"]);
                const regexHead = RegExp("([A-Z])\\..");
                // const regexChild2 = RegExp("([A-Z])\\...")
                const regexChild1 = RegExp("([A-Z])\\.[(0-9)]")

                if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"])) {
                    $(row).css({
                        "color": "white",
                        "background-color": "#a01629",
                        "cursor": "pointer",
                    });
                    $(row).addClass("grand-parent");
                    $(row).addClass("parent");
                    $(row).attr("onclick", "showParents(this)");

                }

                if(data["URAIAN"] === "Bank"){
                    $(row).attr("onclick", "showModal()");
                }

                if (data["ISANAK"] === 0 && regexChild1.test(data["KODE"])){
                    $(row).css({
                        "background-color": "#f1c40f",
                        "cursor": "pointer",

                    });
                    $(row).attr("onclick","showChild(this)");
                    $(row).addClass("parent");
                };

                if (data["ISANAK"] === 1){
                    $(row).addClass("child");
                    $(row).hide();
                };

                if (data["URAIAN"] === null) {$(row).remove()}
            },
           "initComplete" : (setting, json) => {
               let parent1 = $(".grand-parent").nextUntil(".grand-parent");
               parent1.hide();
           }
        });
}

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

function tableRencanaImprestValas(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    for (let i=0; i<8; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header_tgl_imprest_valas").append("<td>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let tb_rencana_imprest_valas = $("#rencana_imprest_valas").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_recana_valas",
            "data" : {
                "ptanggal" : current_full_date
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "name" : "bank",
                "data" : "BANK",
                "createdCell" : (cell) => {$(cell).css("background-color","white")}
            },
            {"data" : "URAIAN"},
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D0 === null){
                            return "";}
                        else if (data.RP_D0 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D0 === null) {
                            return 0;
                        }else {
                            return data.RP_D0
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D1 === null){
                            return "";}
                        else if (data.RP_D1 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D1 === null) {
                            return 0;
                        }else {
                            return data.RP_D1
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D2 === null){
                            return "";
                        }else if (data.RP_D2 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D2 === null) {
                            return 0;
                        }else {
                            return data.RP_D2
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D3 === null){
                            return "";
                        }else if (data.RP_D3 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D3 === null) {
                            return 0;
                        }else {
                            return data.RP_D3
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return data.RP_D4
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return data.RP_D4
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D6 === null){
                            return "";
                        }else if (data.RP_D6 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D6 === null) {
                            return 0;
                        }else {
                            return data.RP_D6
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D7 === null){
                            return "";
                        }else if (data.RP_D7 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D7 === null) {
                            return 0;
                        }else {
                            return data.RP_D7
                        }
                    }
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ISANAK"] === 0){
                $(row).css({
                    "background-color" : "#bed0cb",
                })
            }

            if (data["URAIAN"] === "KETERANGAN"){
                $(row).css({
                    "background-color" : "#8688ca",
                    "color" : "white",
                })
            }
        },
    })
}

function tableRencanaImpres(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    for (let i=0; i<8; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header_tgl_rencana_imprest").append("<td>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let tb_rencana_imprest_valas = $("#dash_rencana_imprest").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/dashboard_rencana_imprest",
            "data" : {
                "ptanggal" : current_full_date
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "headerSort" : false,
                "data" : "BANK",
                "createdCell" : (cell) => {$(cell).css("background-color","white")},
            },
            {"data" : "URAIAN"},
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D0 === null){
                            return "";}
                        else if (data.RP_D0 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D0 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D0);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D1 === null){
                            return "";}
                        else if (data.RP_D1 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D1 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D1);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D2 === null){
                            return "";
                        }else if (data.RP_D2 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D2 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D2);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D3 === null){
                            return "";
                        }else if (data.RP_D3 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D3 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D3);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D4);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D4);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D6 === null){
                            return "";
                        }else if (data.RP_D6 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D6 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D6);
                        }
                    }
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D7 === null){
                            return "";
                        }else if (data.RP_D7 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D7 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D7);
                        }
                    }
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ISANAK"] === 0){
                $(row).css({
                    "background-color" : "#bed0cb",
                })
            }

            if (data["URAIAN"] === "KETERANGAN"){
                $(row).css({
                    "background-color" : "#8688ca",
                    "color" : "white",
                })
            }
        },
    })
}

function tableRealisasiBankCurrency(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    let tb_dash_real_bank_curr = $("#dash_real_bank_curr").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_curr",
            "data" : {
                "ptanggal" : "20200212"
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
            {"data" : "URAIAN"},
            {"data": "ORI_CURR_NOW"},
            {"data" : "EQ_IDR_NOW"},
            {
                "data" : "PERSEN_NOW",
                "render": (data) => {
                    return data.PERSEN_NOW + "%"
                },
                "createdCell" : (data) => {
                    (data.NOURUT_CURRENCY === 0) ? $(cell).css("background-color","#ffad33") : $(cell).css("background-color","#f7d39e");

                }
            },
            {"data": "ORI_CURR_WEEK"},
            {"data" : "EQ_IDR_WEEK"},
            {"data" : "PERSEN_WEEK"},
            {"data": "ORI_CURR_MONTH"},
            {"data" : "EQ_IDR_MONTH"},
            {"data" : "PERSEN_MONTH"},
            {"data": "ORI_CURR_YEAR"},
            {"data" : "EQ_IDR_YEAR"},
            {"data" : "PERSEN_YEAR"},
        ],
        "createdRow": (row, data, dataIndex) => {
            if (data["NOURUT_CURRENCY"] === 0){
                $(row).css({
                    "font-weight": "bold",
                    "background-color" : "#9bc3ff",
                })
            }
        }
    })
}

function tbDashRealBank(){
    let tb_dash_real_bank = $("#dash_real_bank").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_bank",
            "data" : {
                "ptanggalawal" : "20200212",
                "ptanggalakhir" : "20200212"
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "columns" : [
            {"data": "BANK"},
            {"data": "CURRENCY"},
            {"data": "RP_DINAMIS"},
        ]
    })
}

function showChild(el){
    let child = $(el).nextUntil(".parent");
    (child.is(":visible")) ? child.hide() : child.show()
    // console.log(child);
}

function showParents(el){
    let parent = $(el).nextUntil(".grand-parent");
    (parent.is(":visible")) ? parent.hide() : parent.show();
    $("#main-realisasi, #main-rencana").find(".child").hide();
}

function showModal(){

}

function dataTable(){
$.ajax({
          url: baseUrl + "api_dashboard/get_rekening_vs_rencana",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_SALDO;
            var tes = JSON.stringify(data);
            var tes2 = JSON.stringify(data2);
//            console.log('Tes 1 :' +tes);
//            console.log('Tes 2 :' +tes2);
//            $("#tglcetak").html(data[0].TANGGAL);

            var dataPieRekRencana = [];
            $.each(data, function (index, value) {
                var dataPieTemp = {
                    minvalue: '0',
                    maxvalue: value.PERSENTASE,
                    code: value.WARNA,
                    dial: value.NILAI_PERSENTASE
                };
                dataPieRekRencana.push(dataPieTemp)
            });

            var dataPieRekRencana2 = [];
            $.each(data2, function (index, value) {
                var dataPieTemp2 = {
                    dial: value.NILAI_PERSENTASE
                };
                dataPieRekRencana2.push(dataPieTemp2)
            });

            creteChartRekRencana(dataPieRekRencana, dataPieRekRencana2);
            hideLoadingCss()
      },
      error: function () {
          // hideLoadingCss("Gagal Ambil Data");
          hideLoadingCss();
          $('#table-jenis-bank tbody').empty();
          var html = "<tr>" +
              "<td colspan='5' align='center'> No Data </td>" +
              "</tr>";
          $('#table-jenis-bank tbody').append(html);
      }
     });
$.ajax({
   url: baseUrl + "api_dashboard/get_komposisi_saldo",
   dataType: 'JSON',
   type: "GET",
   success: function (res) {
       var data = res.return;
       $("#tglcetak").html(data[0].TANGGAL);
       $.each(data, function (key, val) {
         var html = "<tr>" +
             "<td>" + val.JENIS_REKENING + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.TOTAL,".",",") + "</td>" +
             "</tr>";
         $('#table-komposisi-saldo tbody').append(html);
       });

         var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
             "<td>TOTAL</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL,".",",") + "</td>" +
             "</tr>";

       $('#table-komposisi-saldo tbody').append(total1);

       var dataPieKompSaldo = [];
         $.each(res.OUT_PIE_KOMPOSISI, function (index, value) {
//         console.log('PERSENTASE :'+value.PERSENTASE);
//         console.log('WARNA :'+value.WARNA);
             var dataPieTemp = {
                 minvalue: '0',
                 maxvalue: value.PERSENTASE,
                 code: value.WARNA
             };
             dataPieKompSaldo.push(dataPieTemp)
         });

         creteChartKompSaldo(dataPieKompSaldo);
         hideLoadingCss()
     },
     error: function () {
         // hideLoadingCss("Gagal Ambil Data");
         hideLoadingCss();
         $('#table-komposisi-saldo tbody').empty();
         var html = "<tr>" +
             "<td colspan='5' align='center'> No Data </td>" +
             "</tr>";
         $('#table-komposisi-saldo tbody').append(html);
     }
    });
$.ajax({
          url: baseUrl + "api_dashboard/get_rencana_pembayaran",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_HARI;
            var data2_real = res.OUT_HARI_REAL;
            var data3 = res.OUT_MINGGU;
            var data3_real = res.OUT_MINGGU_REAL;
            var data4 = res.OUT_BULAN;
            var data4_real = res.OUT_BULAN_REAL;
            var data5 = res.OUT_TAHUN;
            var data5_real = res.OUT_TAHUN_REAL;

            var dataChartRenPembayaranHari = [];
            $.each(data2, function (index, value) {
                var dataPieTemp = {
                       seriesname : value.CASH_DESCRIPTION,
                       data : [
                       {
                           value: value.KE_1,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                       },
                       {
                           value: value.KE_2,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                       },
                       {
                           value: value.KE_3,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                       },
                       {
                           value: value.KE_4,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                       },
                       {
                           value: value.KE_5,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                       }
                   ]
                };
                dataChartRenPembayaranHari.push(dataPieTemp)
            });
            var dataseth1 = [];
            var datah1 = {dataset : dataChartRenPembayaranHari};
            dataseth1.push(datah1);

            var dataChartRealPembayaranHari = [];
            $.each(data2_real, function (index, value) {
                var dataPieTemp2 = {
                        seriesname : value.CASH_DESCRIPTION,
                        data : [
                        {
                           value: value.KE_5,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                        },
                        {
                           value: value.KE_4,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                        },
                        {
                           value: value.KE_3,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                        },
                        {
                           value: value.KE_2,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                        },
                        {
                           value: value.KE_1,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                        }
                    ]
                };
                dataChartRealPembayaranHari.push(dataPieTemp2)
            });
            var dataseth2 = [];
            var datah2 = {dataset : dataChartRealPembayaranHari};
            dataseth2.push(datah2);

            var dataChartRenPembayaranMinggu = [];
            $.each(data3, function (index, value) {
                var dataPieTemp = {
                       seriesname : value.CASH_DESCRIPTION,
                       data : [
                       {
                           value: value.KE_1,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                       },
                       {
                           value: value.KE_2,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                       },
                       {
                           value: value.KE_3,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                       },
                       {
                           value: value.KE_4,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                       },
                       {
                           value: value.KE_5,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                       }
                   ]
                };
                dataChartRenPembayaranMinggu.push(dataPieTemp)
            });
            var datasetm1 = [];
            var datam1 = {dataset : dataChartRenPembayaranMinggu};
            datasetm1.push(datam1);

            var dataChartRealPembayaranMinggu = [];
            $.each(data3_real, function (index, value) {
                var dataPieTemp2 = {
                        seriesname : value.CASH_DESCRIPTION,
                        data : [
                        {
                           value: value.KE_5,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                        },
                        {
                           value: value.KE_4,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                        },
                        {
                           value: value.KE_3,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                        },
                        {
                           value: value.KE_2,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                        },
                        {
                           value: value.KE_1,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                        }
                    ]
                };
                dataChartRealPembayaranMinggu.push(dataPieTemp2)
            });
            var datasetm2 = [];
            var datam2 = {dataset : dataChartRealPembayaranMinggu};
            datasetm2.push(datam2);

            var dataChartRenPembayaranBulan = [];
            $.each(data4, function (index, value) {
                var dataPieTemp = {
                       seriesname : value.CASH_DESCRIPTION,
                       data : [
                       {
                           value: value.KE_1,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                       },
                       {
                           value: value.KE_2,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                       },
                       {
                           value: value.KE_3,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                       },
                       {
                           value: value.KE_4,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                       },
                       {
                           value: value.KE_5,
                           toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                       }
                   ]
                };
                dataChartRenPembayaranBulan.push(dataPieTemp)
            });
            var datasetb1 = [];
            var datab1 = {dataset : dataChartRenPembayaranBulan};
            datasetb1.push(datab1);

            var dataChartRealPembayaranBulan = [];
            $.each(data4_real, function (index, value) {
                var dataPieTemp2 = {
                        seriesname : value.CASH_DESCRIPTION,
                        data : [
                        {
                           value: value.KE_5,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                        },
                        {
                           value: value.KE_4,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                        },
                        {
                           value: value.KE_3,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                        },
                        {
                           value: value.KE_2,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                        },
                        {
                           value: value.KE_1,
                           toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                        }
                    ]
                };
                dataChartRealPembayaranBulan.push(dataPieTemp2)
            });
            var datasetb2 = [];
            var datab2 = {dataset : dataChartRealPembayaranBulan};
            datasetb2.push(datab2);

            var dataChartRenPembayaranTahun = [];
                $.each(data5, function (index, value) {
                    var dataPieTemp = {
                        seriesname : value.CASH_DESCRIPTION,
                        data : [
                        {
                            value: value.KE_1,
                            toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                        },
                        {
                            value: value.KE_2,
                            toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                        },
                        {
                            value: value.KE_3,
                            toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                        },
                        {
                            value: value.KE_4,
                            toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                        },
                        {
                            value: value.KE_5,
                            toolText: "Rencana $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                        }
                        ]
                    };
                    dataChartRenPembayaranTahun.push(dataPieTemp)
                });
                var datasett1 = [];
                var datat1 = {dataset : dataChartRenPembayaranTahun};
                datasett1.push(datat1);

            var dataChartRealPembayaranTahun = [];
            $.each(data5_real, function (index, value) {
                var dataPieTemp2 = {
                    seriesname : value.CASH_DESCRIPTION,
                    data : [
                    {
                        value: value.KE_5,
                        toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_1)
                    },
                    {
                        value: value.KE_4,
                        toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_2)
                    },
                    {
                        value: value.KE_3,
                        toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_3)
                    },
                    {
                        value: value.KE_2,
                        toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_4)
                    },
                    {
                        value: value.KE_1,
                        toolText: "Realisasi $seriesname pada $label sebesar Rp " + Intl.NumberFormat().format(value.KE_5)
                    }
                    ]
                };
                dataChartRealPembayaranTahun.push(dataPieTemp2)
            });
            var datasett2 = [];
            var datat2 = {dataset : dataChartRealPembayaranTahun};
            datasett2.push(datat2);

            barRencanaPembayaranHari(dataseth1)
            barRencanaPembayaranMinggu(datasetm1)
            barRencanaPembayaranBulan(datasetb1)
            barRencanaPembayaranTahun(datasett1)

            barRealisasiPembayaranHari(dataseth2)
            barRealisasiPembayaranMinggu(datasetm2)
            barRealisasiPembayaranBulan(datasetb2)
            barRealisasiPembayaranTahun(datasett2)


//            var chart_hari = dataseth1.concat(dataseth2);
//            barRencanaRealisasiPembayaranHari(chart_hari)
//
//            var chart_minggu = datasetm1.concat(datasetm2);
//            barRencanaRealisasiPembayaranMinggu(chart_minggu)
//
//            var chart_bulan = datasetb1.concat(datasetb2);
//            barRencanaRealisasiPembayaranBulan(chart_bulan)
//
//            var chart_tahun = datasett1.concat(datasett2);
//            barRencanaRealisasiPembayaranTahun(chart_tahun)

//            barRencanaRealisasiPembayaranTahun(dataChartRealPembayaranTahun)
      }
 });
$.ajax({
       url: baseUrl + "api_dashboard/get_ana_realisasi_pembayaran",
       dataType: 'JSON',
       type: "GET",
       success: function (res) {
         var data = res.return;
         var data2 = res.OUT_LINE;
// KOLOM
         var dataChartAnaRealPembayaran = [];
         $.each(data, function (index, value) {
             var dataPieTemp = {
                 seriesname : value.CASH_DESCRIPTION,
                 data : [
                     {
                         value: value.H_MIN2
                     },
                     {
                         value: value.H_MIN1
                     },
                     {
                         value: value.H_0
                     },
                     {
                        value: value.H_1
                     },
                     {
                        value: value.H_2
                     }
                 ]
             };
             dataChartAnaRealPembayaran.push(dataPieTemp)
         });
// LINNNEEEEE
         var dataChartAnaRealPembayaran2 = [];
              $.each(data2, function (index, value) {
                  var dataPieTemp2 = {
                     seriesname : value.KETERANGAN,
                     renderas : "line",
                     data : [
                       {
                          value: value.H_MIN2
                       },
                       {
                          value: value.H_MIN1
                       },
                       {
                          value: value.H_0
                       },
                       {
                          value: value.H_1
                       },
                       {
                          value: value.H_2
                       }
                     ]
                  };
                  dataChartAnaRealPembayaran2.push(dataPieTemp2)
              });

        var coba = dataChartAnaRealPembayaran2.concat(dataChartAnaRealPembayaran)
        analisaPembayaranBarLine(coba);
        hideLoadingCss()
   }
  });
$.ajax({
                url: baseUrl + "api_dashboard/get_saldo_bank",
                dataType: 'JSON',
                type: "GET",
                success: function (res) {
                    var data = res.return;
                    //console.log("response : "+data);
                    $("#tglcetak").html(data[0].TANGGAL);
                    $('#table-jenis-bank tbody').empty();
                    $.each(data, function (key, val) {
                        var html = "<tr>" +
                            "<td>" + val.BANK + "</td>" +
                            "<td align='right'>" + "Rp " + accounting.formatNumber(val.SALDO,2,".",",") + "</td>" +
                            "</tr>";
                        $('#table-jenis-bank tbody').append(html);
                    });

                    var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                        "<td>TOTAL</td>" +
                        "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SALDO,2,".",",") + "</td>" +
                        "</tr>";

                $('#table-jenis-bank tbody').append(total1);
                hideLoadingCss()
            },
            error: function () {
                // hideLoadingCss("Gagal Ambil Data");
                hideLoadingCss();
                $('#table-jenis-bank tbody').empty();
                var html = "<tr>" +
                    "<td colspan='5' align='center'> No Data </td>" +
                    "</tr>";
                $('#table-jenis-bank tbody').append(html);
            }
              });
}

//Update Senin 17/2/2020

function creteChartRekRencana(data, data2) {

    var maxval1 = data[1].maxvalue + data[0].maxvalue;
    var maxval2 = data[2].maxvalue + data[1].maxvalue;
    var label1 = (data[0].minvalue + data[0].maxvalue)/2;
    var label2 = (data[0].maxvalue + data[1].maxvalue)/2;
    var label3 = (data[1].maxvalue + data[2].maxvalue)/2;
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-rencana-pembayaran1',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption" : "Rencana Pembayaran",
                        "subcaption" : "PT. PLN (Persero) Divisi Treasury",
                        "bgColor": "#FFFFFF",
                        "numbersuffix": "%",
                        "lowerLimitDisplay": "0%",
                        "upperLimitDisplay": "100%",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "5",
                        "pivotBorderColor": "#000000",
                        "pivotBorderAlpha": "100",
                        "pivotFillColor": "#000000",
                        "pivotFillAlpha": "100",
                        "valueBelowPivot": "0",
                        "majorTMNumber": "9",
                        "minorTMNumber": "4",
                        "majorTMHeight": "10",
                        "minorTMHeight": "5",
                        showTickMarks: "1",
                        showTickValues: "1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "gaugeOuterRadius": "150",
                        "gaugeInnerRadius": "90",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: "0",
                              maxvalue: data[0].maxvalue,
                              code: "#998650"
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: "#7AC74F"
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: "100",
                              code: "#5ADBFF"
                          },
                       ]
                     },
                    "dials": {
                        "dial": [{
                         "id": "fd_dial",
                         "bgcolor": "#F20F2F",
                         "value": data2[1].dial
                       }, {
                         "id": "clth_dial",
                         "bgcolor": "#F4D35E",
                         "value": data2[0].dial
                       }
                      ]
                    }
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartKompSaldo(data) {
    var maxval1 = data[1].maxvalue + data[0].maxvalue;
    var maxval2 = data[2].maxvalue + data[1].maxvalue;
    var label1 = (data[0].minvalue + data[0].maxvalue)/2;
    var label2 = (data[0].maxvalue + data[1].maxvalue)/2;
    var label3 = (data[1].maxvalue + data[2].maxvalue)/2;
    var label4 = (data[2].maxvalue + data[3].maxvalue)/2;
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-komposisi-saldo',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption" : "\n\nKomposisi Saldo",
                        "subcaption" : "\n\n\nPT. PLN (Persero) Divisi Treasury",
                        "bgColor": "#FFFFFF",
                        "numbersuffix": "%",
                        "lowerLimitDisplay": "0%",
                        "upperLimitDisplay": "100%",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "8",
                        "valueBelowPivot": "0",
                        "majorTMNumber": "9",
                        "minorTMNumber": "4",
                        "majorTMHeight": "10",
                        "minorTMHeight": "5",
                        pivotFillAlpha:"0",
                        showTickMarks:"1",
                        showTickValues:"1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "gaugeOuterRadius": "150",
                        "gaugeInnerRadius": "90",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: '0',
                              maxvalue: data[0].maxvalue,
                              code: data[0].code,
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: data[3].code
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: maxval2,
                              code: data[2].code
                          },
                          {
                              minvalue: maxval2,
                              maxvalue: '100',
                              code: data[1].code
                          }
                       ]
                     }
                }
            });
        fusioncharts.render();
    });
}

function analisaPembayaranBarLine(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Analisa Performa Pembayaran",
                   subcaption : "PT. PLN (Persero) Divisi Treasury",
                   showSum : "1",
                   numberprefix : "Rp ",
                   theme : "fusion",
                   numDivLines : "5",
                   divLineColor: "#6699cc",
                   divLineAlpha: "60",
                   divLineDashed: "0",
                   showLegend: "0",
                   numberScaleValue : "1000, 1000, 1000, 1000",
                   numberScaleValue : "Rp, Jt, M, T"
               },
               categories : [
                   {
                       category : [
                           {
                               label : incDate(date, -2)
                           },
                           {
                               label : incDate(date, -1)
                           },
                           {
                               label : datestring
                           },
                           {
                               label : incDate(date, 1)
                           },
                           {
                               label : incDate(date, 2)
                           }
                       ]
                   }
               ],
               dataset : coba
           }
//            events:{
//              "rendered": function (eventObj, dataObj) {
//              var mydatasource = chart.getJSONData();
//              console.log(mydatasource)
//                }
//            }
        }).render();
    });
}

function barRencanaPembayaranHari(dataseth1){
    const dataSource = {
        chart : {
            caption : "Rencana Pembayaran Per Hari",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Hari ke 1"
                    },
                    {
                        label : "Hari ke 2"
                    },
                    {
                        label : "Hari ke 3"
                    },
                    {
                        label : "Hari ke 4"
                    },
                    {
                        label : "Hari ke 5"
                    }
                ]
            }
        ],
        dataset : dataseth1
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-rencana-pembayaran",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRencanaPembayaranMinggu(datasetm1){
    const dataSource = {
        chart : {
            caption : "Rencana Pembayaran Per Minggu",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Minggu ke 1"
                    },
                    {
                        label : "Minggu ke 2"
                    },
                    {
                        label : "Minggu ke 3"
                    },
                    {
                        label : "Minggu ke 4"
                    },
                    {
                        label : "Minggu ke 5"
                    }
                ]
            }
        ],
        dataset : datasetm1
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-rencana-pembayaran2",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRencanaPembayaranBulan(datasetb1){

//    console.log(chart_bulan)

    const dataSource = {
        chart : {
            caption : "Rencana Pembayaran Per Bulan",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Bulan ke 1"
                    },
                    {
                        label : "Bulan ke 2"
                    },
                    {
                        label : "Bulan ke 3"
                    },
                    {
                        label : "Bulan ke 4"
                    },
                    {
                        label : "Bulan ke 5"
                    }
                ]
            }
        ],
        dataset : datasetb1
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-rencana-pembayaran3",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRencanaPembayaranTahun(datasett1){

//    console.log(chart_bulan)

    const dataSource = {
        chart : {
            caption : "Rencana Pembayaran Per Tahun",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "2019"
                    },
                    {
                        label : "2020"
                    },
                    {
                        label : "2021"
                    },
                    {
                        label : "2022"
                    },
                    {
                        label : "2023"
                    }
                ]
            }
        ],
        dataset : datasett1
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-rencana-pembayaran4",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRealisasiPembayaranHari(dataseth2){
    const dataSource = {
        chart : {
            caption : "Realisasi Pembayaran Per Hari",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Hari H -4"
                    },
                    {
                        label : "Hari H -3"
                    },
                    {
                        label : "Hari H -2"
                    },
                    {
                        label : "Hari H -1"
                    },
                    {
                        label : "Hari H"
                    }
                ]
            }
        ],
        dataset : dataseth2
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-realisasi-pembayaran",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRealisasiPembayaranMinggu(datasetm2){
    const dataSource = {
        chart : {
            caption : "Realisasi Pembayaran Per Minggu",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Minggu H -4"
                    },
                    {
                        label : "Minggu H -3"
                    },
                    {
                        label : "Minggu H -2"
                    },
                    {
                        label : "Minggu H -1"
                    },
                    {
                        label : "Minggu H"
                    }
                ]
            }
        ],
        dataset : datasetm2
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-realisasi-pembayaran2",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRealisasiPembayaranBulan(datasetb2){

//    console.log(chart_bulan)

    const dataSource = {
        chart : {
            caption : "Realisasi Pembayaran Per Bulan",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Bulan H -4"
                    },
                    {
                        label : "Bulan H -3"
                    },
                    {
                        label : "Bulan H -2"
                    },
                    {
                        label : "Bulan H -1"
                    },
                    {
                        label : "Bulan H"
                    }
                ]
            }
        ],
        dataset : datasetb2
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-realisasi-pembayaran3",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function barRealisasiPembayaranTahun(datasett2){

//    console.log(chart_bulan)

    const dataSource = {
        chart : {
            caption : "Realisasi Pembayaran Per Tahun",
            subcaption : "PT. PLN (Persero) Divisi Treasury",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            showLegend: "0",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "2016"
                    },
                    {
                        label : "2017"
                    },
                    {
                        label : "2018"
                    },
                    {
                        label : "2019"
                    },
                    {
                        label : "2020"
                    }
                ]
            }
        ],
        dataset : datasett2
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "msstackedcolumn2d",
            renderAt: "column-realisasi-pembayaran4",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

//function barRencanaRealisasiPembayaranHari(chart_hari){
//    const dataSource = {
//        chart : {
//            caption : "Rencana & Realisasi Pembayaran Per Hari",
//            subcaption : "PT. PLN (Persero) Divisi Treasury",
//            showSum : "1",
//            numberprefix : "Rp ",
//            theme : "fusion",
//            numDivLines : "5",
//            divLineColor: "#6699cc",
//            divLineAlpha: "60",
//            divLineDashed: "0",
//            showLegend: "0",
//            numberScaleValue: "1000, 1000, 1000, 1000",
//            numberScaleUnit: "Rb, Jt, M, T"
//        },
//        categories : [
//            {
//                category : [
//                    {
//                        label : "Hari ke 1"
//                    },
//                    {
//                        label : "Hari ke 2"
//                    },
//                    {
//                        label : "Hari ke 3"
//                    },
//                    {
//                        label : "Hari ke 4"
//                    },
//                    {
//                        label : "Hari ke 5"
//                    }
//                ]
//            }
//        ],
//        dataset : chart_hari
//    };
//
//    FusionCharts.ready(function () {
//        let chart = new FusionCharts({
//            type: "msstackedcolumn2d",
//            renderAt: "column-rencana-pembayaran",
//            width: "100%",
//            height: "100%",
//            dataFormat: "json",
//            dataSource
//        }).render();
//    });
//}
//
//function barRencanaRealisasiPembayaranMinggu(chart_minggu){
//    const dataSource = {
//        chart : {
//            caption : "Rencana & Realisasi Pembayaran Per Minggu",
//            subcaption : "PT. PLN (Persero) Divisi Treasury",
//            showSum : "1",
//            numberprefix : "Rp ",
//            theme : "fusion",
//            numDivLines : "5",
//            divLineColor: "#6699cc",
//            divLineAlpha: "60",
//            divLineDashed: "0",
//            showLegend: "0",
//            numberScaleValue: "1000, 1000, 1000, 1000",
//            numberScaleUnit: "Rb, Jt, M, T"
//        },
//        categories : [
//            {
//                category : [
//                    {
//                        label : "Minggu ke 1"
//                    },
//                    {
//                        label : "Minggu ke 2"
//                    },
//                    {
//                        label : "Minggu ke 3"
//                    },
//                    {
//                        label : "Minggu ke 4"
//                    },
//                    {
//                        label : "Minggu ke 5"
//                    }
//                ]
//            }
//        ],
//        dataset : chart_minggu
//    };
//
//    FusionCharts.ready(function () {
//        let chart = new FusionCharts({
//            type: "msstackedcolumn2d",
//            renderAt: "column-rencana-pembayaran2",
//            width: "100%",
//            height: "100%",
//            dataFormat: "json",
//            dataSource
//        }).render();
//    });
//}
//
//function barRencanaRealisasiPembayaranBulan(chart_bulan){
//
////    console.log(chart_bulan)
//
//    const dataSource = {
//        chart : {
//            caption : "Rencana & Realisasi Pembayaran Per Bulan",
//            subcaption : "PT. PLN (Persero) Divisi Treasury",
//            showSum : "1",
//            numberprefix : "Rp ",
//            theme : "fusion",
//            numDivLines : "5",
//            divLineColor: "#6699cc",
//            divLineAlpha: "60",
//            divLineDashed: "0",
//            showLegend: "0",
//            numberScaleValue: "1000, 1000, 1000, 1000",
//            numberScaleUnit: "Rb, Jt, M, T"
//        },
//        categories : [
//            {
//                category : [
//                    {
//                        label : "Bulan ke 1"
//                    },
//                    {
//                        label : "Bulan ke 2"
//                    },
//                    {
//                        label : "Bulan ke 3"
//                    },
//                    {
//                        label : "Bulan ke 4"
//                    },
//                    {
//                        label : "Bulan ke 5"
//                    }
//                ]
//            }
//        ],
//        dataset : chart_bulan
//    };
//
//    FusionCharts.ready(function () {
//        let chart = new FusionCharts({
//            type: "msstackedcolumn2d",
//            renderAt: "column-rencana-pembayaran3",
//            width: "100%",
//            height: "100%",
//            dataFormat: "json",
//            dataSource
//        }).render();
//    });
//}
//
//function barRencanaRealisasiPembayaranTahun(chart_tahun){
//
////    console.log(chart_bulan)
//
//    const dataSource = {
//        chart : {
//            caption : "Rencana & Realisasi Pembayaran Per Bulan",
//            subcaption : "PT. PLN (Persero) Divisi Treasury",
//            showSum : "1",
//            numberprefix : "Rp ",
//            theme : "fusion",
//            numDivLines : "5",
//            divLineColor: "#6699cc",
//            divLineAlpha: "60",
//            divLineDashed: "0",
//            showLegend: "0",
//            numberScaleValue: "1000, 1000, 1000, 1000",
//            numberScaleUnit: "Rb, Jt, M, T"
//        },
//        categories : [
//            {
//                category : [
//                    {
//                        label : "2019"
//                    },
//                    {
//                        label : "2020"
//                    },
//                    {
//                        label : "2021"
//                    },
//                    {
//                        label : "2022"
//                    },
//                    {
//                        label : "2023"
//                    }
//                ]
//            }
//        ],
//        dataset : chart_tahun
//    };
//
//    FusionCharts.ready(function () {
//        let chart = new FusionCharts({
//            type: "msstackedcolumn2d",
//            renderAt: "column-rencana-pembayaran4",
//            width: "100%",
//            height: "100%",
//            dataFormat: "json",
//            dataSource
//        }).render();
//    });
//}

