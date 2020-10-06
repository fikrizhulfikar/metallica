$(document).ready(function () {
    tableMainDashboard();
    tableRencanaPerVendor();

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

    var datestring = dateToString(date);
    $("#tgl1a").html(datestring);
    $("#tgl2a").html(incDate(date, 1));
    $("#tgl3a").html(incDate(date, 2));
    $("#tgl4a").html(incDate(date, 3));
    $("#tgl5a").html(incDate(date, 4));
    $("#tgl6a").html(incDate(date, 5));
//    $("#tgl7a").html(incDate(date, 6));
    $("#tgl1b").html(datestring);
    $("#tgl2b").html(incDate(date, 1));
    $("#tgl3b").html(incDate(date, 2));
    $("#tgl4b").html(incDate(date, 3));
    $("#tgl5b").html(incDate(date, 4));
    $("#tgl6b").html(incDate(date, 5));
//    $("#tgl7b").html(incDate(date, 6));
    $("#tgl1c").html(datestring);
    $("#tgl2c").html(incDate(date, 1));
    $("#tgl3c").html(incDate(date, 2));
    $("#tgl4c").html(incDate(date, 3));
    $("#tgl5c").html(incDate(date, 4));
    $("#tgl6c").html(incDate(date, 5));
//    $("#tgl7c").html(incDate(date, 6));
    $("#tgl1d").html(datestring);
    $("#tgl2d").html(incDate(date, 1));
    $("#tgl3d").html(incDate(date, 2));
    $("#tgl4d").html(incDate(date, 3));
    $("#tgl5d").html(incDate(date, 4));
    $("#tgl6d").html(incDate(date, 5));
//    $("#tgl7c").html(incDate(date, 6));
    $("#tgl1e").html(datestring);
    $("#tgl2e").html(incDate(date, 1));
    $("#tgl3e").html(incDate(date, 2));
    $("#tgl4e").html(incDate(date, 3));
    $("#tgl5e").html(incDate(date, 4));
    $("#tgl6e").html(incDate(date, 5));
//    $("#tgl7c").html(incDate(date, 6));
    $("#tgl1f").html(datestring);
    $("#tgl2f").html(incDate(date, 1));
    $("#tgl3f").html(incDate(date, 2));
    $("#tgl4f").html(incDate(date, 3));
    $("#tgl5f").html(incDate(date, 4));
    $("#tgl6f").html(incDate(date, 5));
//    $("#tgl7c").html(incDate(date, 6));
    $("#tgl1g").html(datestring);
    $("#tgl2g").html(incDate(date, 1));
    $("#tgl3g").html(incDate(date, 2));
    $("#tgl4g").html(incDate(date, 3));
    $("#tgl5g").html(incDate(date, 4));
    $("#tgl6g").html(incDate(date, 5));
//    $("#tgl7c").html(incDate(date, 6));
    $("#tgl1h").html(datestring);
    $("#tgl2h").html(incDate(date, 1));
    $("#tgl3h").html(incDate(date, 2));
    $("#tgl4h").html(incDate(date, 3));
    $("#tgl5h").html(incDate(date, 4));
    $("#tgl6h").html(incDate(date, 5));
//    $("#tgl7c").html(incDate(date, 6));

//    let ren_pem_usd = $("#rencana-pembayaran-usd").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_eur = $("#rencana-pembayaran-eur").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_jpy = $("#rencana-pembayaran-jpy").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_myr = $("#rencana-pembayaran-myr").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_aud = $("#rencana-pembayaran-aud").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_gbp = $("#rencana-pembayaran-gbp").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_sgd = $("#rencana-pembayaran-sgd").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });
//    let ren_pem_thb = $("#rencana-pembayaran-thb").DataTable({
//        "ajax" : {
//            "url": baseUrl + " ",
//            "data" : {
//                "tanggal" : current_full_date,
//            },
//            "type" : "GET",
//            "dataType" : "json",
//        },
//        "sorting": false,
//        "searching" : false,
//        "paging": false,
//        "bInfo" : false,
//        "bLengthChange" : false,
//        "columns" : [
////            {"data": null,"render": (data, type, row) => {return '<td>'+data.NOURUT+'</td>';}},
//            {"data": null,"visible": false,"render": (data, type, row) => {return data.BANK;}},
//            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
////            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
////                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
////                                                            }else
////                                                            return '<td>'+data.CURRENCY+'</td>';
////                                                            }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
//                                                              return '<td> - </td>';
//                                                              } else
//                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
//                                                           },
//                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
//                                                         }},
//        ],
//
//         "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#F4D35E",
//                    "text-align": "center",
//                    "font-weight": "bold",
//                });
////                $('td', row).eq(0).attr("colspan","2");
//             };
//         },
//
//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
////            console.log(array[20])
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; j<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                if ((group.BANK === "TOTAL")){
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
//                    );
//                }else
//                    $(rows).eq(i).before(
//                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
//                    );
////                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
//    });

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