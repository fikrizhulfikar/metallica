$(document).ready(function () {
    tableMainDashboard();
    tableMainDashboard2();
    initDataTableImprstValas();
    initDataTableImprstValas2();

    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

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

function showChild(el){
    let child = $(el).nextUntil(".parent");
    (child.is(":visible")) ? child.hide() : child.show()
}

function showParents(el){
    let parent = $(el).nextUntil(".grand-parent");
    (parent.is(":visible")) ? parent.hide() : parent.show();
    $("#main-realisasi, #main-valas, #main-valas2, #main-valas3").find(".child").hide();
}

function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    var datestring = dateToString(date);
        $("#tgl1a").html(datestring);
        $("#tgl2a").html(incDate(date, 1));
        $("#tgl3a").html(incDate(date, 2));
        $("#tgl4a").html(incDate(date, 3));
        $("#tgl5a").html(incDate(date, 4));
        $("#tgl6a").html(incDate(date, 5));

        $("#tgl1b").html(datestring);
        $("#tgl2b").html(incDate(date, 1));
        $("#tgl3b").html(incDate(date, 2));
        $("#tgl4b").html(incDate(date, 3));
        $("#tgl5b").html(incDate(date, 4));
        $("#tgl6b").html(incDate(date, 5));

        $("#tgl1c").html(datestring);
        $("#tgl2c").html(incDate(date, 1));
        $("#tgl3c").html(incDate(date, 2));
        $("#tgl4c").html(incDate(date, 3));
        $("#tgl5c").html(incDate(date, 4));
        $("#tgl6c").html(incDate(date, 5));

        for (let i=0; i<5; i++){
            let tgl = date.getDate()+i;
            let tgl2 = date.getDate()-5+i;
            let month = date.getMonth()+1;
        }

    let main_valas = $("#main-valas").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_valas",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0" || data.BANK == " "){
                        return '<td > </td>';
                    } else
                        return '<td >'+data.BANK+'</td>';
                 },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td >'+data.KETERANGAN+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","left");}},
            {"data": "ISHEADER","visible":false},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp. '+data.TOTAL+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
        ],
        "createdRow" : function (row, data, dataIndex){
            const regexHead = RegExp("([A-Z])\\..");
            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

            if(data['KODE'] === null){
                $(row).css({
                    "color": "#FFFFFF",
                    "background-color": "#FFFFFF",
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                });
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "MANDIRI") {
                $(row).css({
                    "background-color": "#E9D758",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BRI") {
                $(row).css({
                    "background-color": "#FF8552",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BNI") {
                $(row).css({
                    "background-color": "#A1CDF1",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BUKOPIN") {
                $(row).css({
                    "background-color": "#16A085",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "TOTAL") {
                $(row).css({
                    "background-color": "#77D5D4",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data["ISHEADER"] === 0 && regexChild1.test(data["KODE"])){
                $(row).addClass("child");
                $(row).hide();
            }
        },
        "initComplete" : (settings, json) => {
            let parent = $(".grand-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });

    let main_valas2 = $("#main-valas2").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_valas2",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0" || data.BANK == " "){
                        return '<td > </td>';
                    } else
                        return '<td >'+data.BANK+'</td>';
                 },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td >'+data.KETERANGAN+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","left");}},
            {"data": "ISHEADER","visible":false},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp. '+data.TOTAL+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
        ],
        "createdRow" : function (row, data, dataIndex){
            const regexHead = RegExp("([A-Z])\\..");
            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

            if(data['KODE'] === null){
                $(row).css({
                    "color": "#FFFFFF",
                    "background-color": "#FFFFFF",
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                });
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "MANDIRI") {
                $(row).css({
                    "background-color": "#E9D758",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BRI") {
                $(row).css({
                    "background-color": "#FF8552",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BNI") {
                $(row).css({
                    "background-color": "#A1CDF1",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BUKOPIN") {
                $(row).css({
                    "background-color": "#16A085",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "TOTAL") {
                $(row).css({
                    "background-color": "#77D5D4",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data["ISHEADER"] === 0 && regexChild1.test(data["KODE"])){
                $(row).addClass("child");
                $(row).hide();
            }
        },
        "initComplete" : (settings, json) => {
            let parent = $(".grand-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });

    let main_valas3 = $("#main-valas3").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_valas3",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0" || data.BANK == " "){
                        return '<td > </td>';
                    } else
                        return '<td >'+data.BANK+'</td>';
                 },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td >'+data.KETERANGAN+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","left");}},
            {"data": "ISHEADER","visible":false},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp. '+data.TOTAL+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
        ],
        "createdRow" : function (row, data, dataIndex){
            const regexHead = RegExp("([A-Z])\\..");
            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

            if(data['KODE'] === null){
                $(row).css({
                    "color": "#FFFFFF",
                    "background-color": "#FFFFFF",
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                });
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "MANDIRI") {
                $(row).css({
                    "background-color": "#E9D758",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BRI") {
                $(row).css({
                    "background-color": "#FF8552",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BNI") {
                $(row).css({
                    "background-color": "#A1CDF1",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BUKOPIN") {
                $(row).css({
                    "background-color": "#16A085",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "TOTAL") {
                $(row).css({
                    "background-color": "#77D5D4",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data["ISHEADER"] === 0 && regexChild1.test(data["KODE"])){
                $(row).addClass("child");
                $(row).hide();
            }
        },
        "initComplete" : (settings, json) => {
            let parent = $(".grand-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });

//    let main_valas2 = $("#main-valas2").DataTable({
//    });
}

function tableMainDashboard2(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    let main_valas2 = $("#main-valas4").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_valas4",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0" || data.BANK == " "){
                        return '<td > </td>';
                    } else
                        return '<td >'+data.BANK+'</td>';
                 },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td >'+data.KETERANGAN+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","left");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){
            const regexHead = RegExp("([A-Z])\\..");
            const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

            if(data['KODE'] === null){
                $(row).css({
                    "color": "#FFFFFF",
                    "background-color": "#FFFFFF",
                    "-webkit-touch-callout": "none",
                    "-webkit-user-select": "none",
                    "-khtml-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select": "none",
                });
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "MANDIRI") {
                $(row).css({
                    "background-color": "#E9D758",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BRI") {
                $(row).css({
                    "background-color": "#FF8552",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BNI") {
                $(row).css({
                    "background-color": "#A1CDF1",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "BUKOPIN") {
                $(row).css({
                    "background-color": "#16A085",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data['ISHEADER'] === 1 && !regexChild1.test(data["KODE"]) && data['BANK'] === "TOTAL") {
                $(row).css({
                    "background-color": "#77D5D4",
                    "cursor": "pointer",
                });
                $(row).addClass("parent");
                $(row).attr("onclick", "showChild(this)");
            }

            if (data["ISHEADER"] === 0 && regexChild1.test(data["KODE"])){
                $(row).addClass("child");
                $(row).hide();
            }
        },
        "initComplete" : (settings, json) => {
            let parent = $(".grand-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });
}

function initDataTableImprstValas() {
    $.ajax({
        url: baseUrl + "api_dashboard/get_saldo_rekening_valuta_asing",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
//            console.log("response : "+data);
//            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-imprst-valas tbody').empty();
            $.each(data, function (key, val) {
                var html = "<tr>" +
                    "<td>" + val.ID_BANK + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_EUR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NILAI_MYR,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-imprst-valas tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_USD[0].TOTAL_USD,2,".",",") + "</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_JPY[0].TOTAL_JPY,2,".",",") + "</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_EUR[0].TOTAL_EUR,2,".",",") + "</td>" +
                                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_MYR[0].TOTAL_MYR,2,".",",") + "</td>" +
                                "</tr>";

            var total2 = "<tr style='background-color:#67a2d8; color: white'>" +
                "<td>EQ IDR</td>" +
                                "<td align='right'> Rp. " + accounting.formatNumber(res.EQ_IDR_USD[0].EQ_IDR_USD,2,".",",") + "</td>" +
                                "<td align='right'> Rp. " + accounting.formatNumber(res.EQ_IDR_JPY[0].EQ_IDR_JPY,2,".",",") + "</td>" +
                                "<td align='right'> Rp. " + accounting.formatNumber(res.EQ_IDR_EUR[0].EQ_IDR_EUR,2,".",",") + "</td>" +
                                "<td align='right'> Rp. " + accounting.formatNumber(res.EQ_IDR_MYR[0].EQ_IDR_MYR,2,".",",") + "</td>" +
                                "</tr>";
            $('#table-imprst-valas tbody').append(total1);
            $('#table-imprst-valas tbody').append(total2);


            var dataPieUSD = [];
            $.each(res.OUT_PIE_USD, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieUSD.push(dataPieTemp)
            });

            var dataPieEUR = [];
            $.each(res.OUT_PIE_EUR, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieEUR.push(dataPieTemp)
            });

            var dataPieJPY = [];
            $.each(res.OUT_PIE_JPY, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieJPY.push(dataPieTemp)
            });

            var dataPieMYR = [];
            $.each(res.OUT_PIE_MYR, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieMYR.push(dataPieTemp)
            });

//            console.log("");

            createChartUSDImprstValas(dataPieUSD);
            createChartJPYImprstValas(dataPieJPY);
            createChartEURImprstValas(dataPieEUR);
            createChartMYRImprstValas(dataPieMYR);
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

function initDataTableImprstValas2() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_outstanding_produk_derivatif",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
//            console.log("response : "+data);
            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-derivatif-deposit tbody').empty();
            $.each(data, function (key, val) {
                var html = "<tr>" +
                    "<td>" + val.BANK + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.FORWARD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.SWAP,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.CSO,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.DNDF,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.DEPOSITO,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-derivatif-deposit tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "</tr>";
            $('#table-derivatif-deposit tbody').append(total1);

            var data2 = res.OUT_TOTAL;
            $.each(data2, function (key, val) {
                var html = "<tr>" +
                    "<td style='background-color:#67a2d8;color: white'>" + val.CURRENCY + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_FORWARD,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_SWAP,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_CSO,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_DNDF,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_DEPOSITO,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-derivatif-deposit tbody').append(html);
            });

            var dataDerivatifMandiri = [];
            $.each(res.OUT_PIE_FORWARD, function (index, value) {
                var dataDMandiri = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                var tes = JSON.stringify(coba);
                console.log("Tes : " + tes)
                dataDerivatifMandiri.push(dataDMandiri)
            });

//            chartDerivatifMandiri(dataDerivatifMandiri);
//            chartDerivatifBRI(dataDBRI);
//            chartDerivatifBNI(dataDBNI);
//            chartDerivatifBukopin(dataDBukopin);
//            chartDepositoMandiri(datadMandiri);
//            chartDepositoBRI(datadBRI);
//            chartDepositoBNI(datadBNI);
//            chartDepositoBukopin(datadBukopin);
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

function createChartUSDImprstValas(data) {
//    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-USD-imprst-valas',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "USD",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#ffffff",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function createChartEURImprstValas(data) {
//    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-EUR-imprst-valas',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "EUR",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#ffffff",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function createChartJPYImprstValas(data) {
//    console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-JPY-imprst-valas',
                width: '635',
                height: '450',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "JPY",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#ffffff",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "12"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

 function createChartMYRImprstValas(data) {
//     console.log(data);
     FusionCharts.ready(function () {
         var fusioncharts = new FusionCharts({
                 type: 'pie2d',
                 renderAt: 'chart-MYR-imprst-valas',
                 width: '635',
                 height: '450',
                 dataFormat: 'json',
                 dataSource: {
                     "chart": {
                         "caption": "MYR",
                         "numbersuffix": " %",
                         "exportEnabled": "1",
                         "bgColor": "#ffffff",
                         "showLabels": "0",
                         "isSmartLineSlanted": "0",
                         "showBorder": "0",
                         "showLegend": "1",
                         "baseFontSize": "12"
                     },
                     "data": data
                 }
             }
         );
         fusioncharts.render();
     });
 }

