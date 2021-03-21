$(document).ready(function () {
    tableMainDashboard();
    initDataTableImprstValas();
    initDataTableImprstValas2();
    initDataTableImprstValas3();

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
    $("#main-realisasi, #main-valas").find(".child").hide();
}

function tableMainDashboard(_date, tanggal, kode, bank){

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

        $("#tgl1d").html(datestring);
        $("#tgl2d").html(incDate(date, 1));
        $("#tgl3d").html(incDate(date, 2));
        $("#tgl4d").html(incDate(date, 3));
        $("#tgl5d").html(incDate(date, 4));
        $("#tgl6d").html(incDate(date, 5));

        $("#tgl1e").html(datestring);
        $("#tgl2e").html(incDate(date, 1));
        $("#tgl3e").html(incDate(date, 2));
        $("#tgl4e").html(incDate(date, 3));
        $("#tgl5e").html(incDate(date, 4));
        $("#tgl6e").html(incDate(date, 5));

        $("#tgl1f").html(datestring);
        $("#tgl2f").html(incDate(date, 1));
        $("#tgl3f").html(incDate(date, 2));
        $("#tgl4f").html(incDate(date, 3));
        $("#tgl5f").html(incDate(date, 4));
        $("#tgl6f").html(incDate(date, 5));

        $("#tgl1g").html(datestring);
        $("#tgl2g").html(incDate(date, 1));
        $("#tgl3g").html(incDate(date, 2));
        $("#tgl4g").html(incDate(date, 3));
        $("#tgl5g").html(incDate(date, 4));
        $("#tgl6g").html(incDate(date, 5));


        for (let i=0; i<5; i++){
            let tgl = date.getDate()+i;
            let tgl2 = date.getDate()-5+i;
            let month = date.getMonth()+1;
        }

    let rupiah = $("#main-rupiah").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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

    let rupiah2 = $("#main-rupiah2").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah2",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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

    let rupiah3 = $("#main-rupiah3").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah3",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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

    let rupiah4 = $("#main-rupiah4").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah4",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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

    let rupiah5 = $("#main-rupiah5").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah5",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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

    let rupiah6 = $("#main-rupiah6").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah6",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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

    let rupiah7 = $("#main-rupiah7").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/dash_rupiah7",
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
            {"data": null,"render": (data, type, row) => {if (data.ISHEADER == "0"){
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
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render": (data, type, row) => {return '<td > Rp '+Intl.NumberFormat().format(data.TOTAL)+'</td>';
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
        url: baseUrl + "api_dashboard/get_giro_special_rate",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
//            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-giro-special-rate tbody').empty();
            $.each(data, function (key, val) {
                var html = "<tr>" +
                    "<td>" + val.BANK + "</td>" +
                    "<td>" + val.CURRENCY + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.JASA_GIRO,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.NOMINAL_JASA_GIRO,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.EQ_IDR_NOMINAL,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.EQ_IDR_JASA_GIRO,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.EQ_IDR_NOMINAL_JASA_GIRO,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-giro-special-rate tbody').append(html);
            });

            var total1 = "<tr style='background-color:#77d5d4'>" +
                "<td colspan='2' style='text-align: center'>TOTAL</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_GIRO[0].NOMINAL,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_GIRO[0].JASA_GIRO,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_GIRO[0].NOMINAL_JASA_GIRO,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_GIRO[0].EQ_IDR_NOMINAL,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_GIRO[0].EQ_IDR_JASA_GIRO,2,".",",") + "</td>" +
                "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_GIRO[0].EQ_IDR_NOMINAL_JASA_GIRO,2,".",",") + "</td>" +
                "</tr>";

            $('#table-giro-special-rate tbody').append(total1);
        },

        error: function () {
            hideLoadingCss();
            $('#table-giro-special-rate tbody').empty();
            var html = "<tr>" +
                "<td colspan='8' align='center'> No Data </td>" +
                "</tr>";
            $('#table-giro-special-rate tbody').append(html);
        }
    });
}

function initDataTableImprstValas2() {
    $.ajax({
        url: baseUrl + "api_dashboard/get_supply_chain_financing",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
//            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-supply-chain-financing tbody').empty();
            $.each(data, function (key, val) {
//                if(val.BANK === "null"){
//                    var html = "<tr>" +
//                        "<td> </td>" +
//                        "<td>" + val.CURRENCY + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.ORI_CURRENCY,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.FEE_TRANSAKSI_IDR,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.CASH_COLLATERAL,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.JASA_GIRO,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.PAJAK_PLN,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.NET_JASA_GIRO,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.NET_GAIN,2,".",",") + "</td>" +
//                        "</tr>";
//                } else
                    var html = "<tr>" +
                        "<td>" + val.BANK + "</td>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.ORI_CURRENCY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.FEE_TRANSAKSI_IDR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.CASH_COLLATERAL,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.JASA_GIRO,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.PAJAK_PLN,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.NET_JASA_GIRO,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.NET_GAIN,2,".",",") + "</td>" +
                        "</tr>";

                $('#table-supply-chain-financing tbody').append(html);
            });

            var data2 = res.OUT_TOTAL_SCF;
//            var tes = JSON.stringify(data2);
//            console.log("Ini data : " + tes);
            $.each(data2, function (key, val) {
                var html = "<tr style='background-color:#77d5d4'>" +
                    "<td>TOTAL</td>" +
                    "<td >" + val.CURRENCY + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.ORI_CURRENCY,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.FEE_TRANSAKSI_IDR,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.CASH_COLLATERAL,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.JASA_GIRO,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.PAJAK_PLN,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.NET_JASA_GIRO,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.NET_GAIN,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-supply-chain-financing tbody').append(html);
            });
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

function initDataTableImprstValas3() {
    $.ajax({
        url: baseUrl + "api_dashboard/get_supply_chain_financing",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.OUT_DATA2;
//            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-supply-chain-financing tbody').empty();
            $.each(data, function (key, val) {
//                if(val.BANK === "null"){
//                    var html = "<tr>" +
//                        "<td> </td>" +
//                        "<td>" + val.CURRENCY + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.ORI_CURRENCY,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.FEE_TRANSAKSI_IDR,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.CASH_COLLATERAL,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.JASA_GIRO,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.PAJAK_PLN,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.NET_JASA_GIRO,2,".",",") + "</td>" +
//                        "<td align='right'>" + accounting.formatNumber(val.NET_GAIN,2,".",",") + "</td>" +
//                        "</tr>";
//                } else
                    var html = "<tr>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.BIAYA_BUNGA,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.PROVISI,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.BIAYA_PROVISI,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.ORI_CURRENCY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.TOTAL_BIAYA,2,".",",") + "</td>" +
                        "</tr>";

                $('#table-supply-chain-financing-non tbody').append(html);
            });

            var data2 = res.OUT_TOTAL_SCF2;
//            var tes = JSON.stringify(data2);
//            console.log("Ini data : " + tes);
            $.each(data2, function (key, val) {
                var html = "<tr style='background-color:#77d5d4'>" +
                    "<td >" + val.CURRENCY + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.BIAYA_BUNGA,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.PROVISI,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.BIAYA_PROVISI,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.ORI_CURRENCY,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                    "<td align='right' >" + accounting.formatNumber(val.TOTAL_BIAYA,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-supply-chain-financing-non tbody').append(html);
            });
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