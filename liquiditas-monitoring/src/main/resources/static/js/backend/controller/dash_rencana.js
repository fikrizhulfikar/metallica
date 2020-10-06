function tableMainDashboard(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    var datestring = dateToString(date);
    $("#tgl1").html(datestring);
    $("#tgl2").html(incDate(date, 1));
    $("#tgl3").html(incDate(date, 2));
    $("#tgl4").html(incDate(date, 3));
    $("#tgl5").html(incDate(date, 4));
    $("#tgl6").html(incDate(date, 5));
    $("#tgl7").html(incDate(date, 6));
    $("#tgl1b").html(datestring);
    $("#tgl2b").html(incDate(date, 1));
    $("#tgl3b").html(incDate(date, 2));
    $("#tgl4b").html(incDate(date, 3));
    $("#tgl5b").html(incDate(date, 4));
    $("#tgl6b").html(incDate(date, 5));
    $("#tgl7b").html(incDate(date, 6));
    $("#tgl1c").html(datestring);
    $("#tgl2c").html(incDate(date, 1));
    $("#tgl3c").html(incDate(date, 2));
    $("#tgl4c").html(incDate(date, 3));
    $("#tgl5c").html(incDate(date, 4));
    $("#tgl6c").html(incDate(date, 5));
    $("#tgl7c").html(incDate(date, 6));

    console.log('Tes ' +datestring)

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
            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
//            {"data": null,"render": (data, type, row) => {if (data.BANK === "TOTAL"){
//                                                            return '<td> TOTAL '+data.CURRENCY+'</td>';
//                                                            }else
//                                                            return '<td>'+data.CURRENCY+'</td>';
//                                                            }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                           },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
        ],

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL")){
                $(row).css({
                    "background-color": "#F4D35E",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","2");
             };
         },

         "drawCallback" : function (settings){
            let groupColumn = 0;
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var last = null;
            let array = api.column(groupColumn, {page:'current'}).data();
            console.log(array)

            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
            if (last !== group.BANK){
                let count = 1;

                for (let j=i; j<array.length; j++){
                    let first = array[i].BANK;
                    if (first !== array[j].BANK) break;
                    count+= 1;
                }
                if ((group.BANK === "TOTAL")){
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.BANK+'</td></tr>'
                    );
                }else
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.BANK+'</td></tr>'
                    );
//                console.log(array)
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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","left");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
                                                            return '<td> - </td>';
                                                            } else
                                                            return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                         },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
                                                            return '<td> - </td>';
                                                            } else
                                                            return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                         },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                           },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                           },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                           },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                           },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
                                                              return '<td> - </td>';
                                                              } else
                                                              return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                           },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                                return '<td> - </td>';
                                                                } else
                                                                return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                             },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){
            if ((data["URAIAN"] === "TOTAL")){
                $(row).css({
                    "background-color": "#F4D35E",
                    "font-weight": "bold",
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
            {"data": null,"visible" : false,"render": (data, type, row) => {return data.JENIS;}},
            {"data": null,"render": (data, type, row) => {return data.CURRENCY;}},
//            {"data": null,"render": (data, type, row) => {if (data.JENIS === "TOTAL"){
//                                                             return '<td> TOTAL '+data.CURRENCY+'</td>';
//                                                             }else
//                                                             return '<td>'+data.CURRENCY+'</td>';
//                                                             }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D0 == "0" || data.RP_D0 == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D1 == "0" || data.RP_D1 == null){
                                                            return '<td> - </td>';
                                                            } else
                                                            return '<td>'+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D2 == "0" || data.RP_D2 == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D3 == "0" || data.RP_D3 == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D4 == "0" || data.RP_D4 == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D5 == "0" || data.RP_D5 == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_D6 == "0" || data.RP_D6 == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.RP_TOTAL == "0" || data.RP_TOTAL == null){
                                                             return '<td> - </td>';
                                                             } else
                                                             return '<td>'+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                          },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
        ],
//        console.log(data)
        "createdRow" : function (row, data, dataIndex){

            if ((data["JENIS"] === "TOTAL")){
                $(row).css({
                    "background-color": "#F4D35E",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","2");
//                $('td:eq(0)', newRow).attr("JENIS", "TOTAL");
//                  $('td', row).eq(0).append('<td>new</td>')
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

                for (let j=i; j<array.length; j++){
                    let first = array[i].JENIS;
                    if (first !== array[j].JENIS) break;
                    count+= 1;
                }
                if ((group.JENIS === "TOTAL")){
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.JENIS+'</td></tr>'
                    );
                }else
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.JENIS+'</td></tr>'
                    );
//                console.log(array)
                last = group.JENIS;
            }
            });

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

// Update Senin 17/2/2020

function tableRencanaPerVendor(_date){
    let groupColumn = 0;
    let tb_realisasi_per_vendor = $("#dash_rencana_per_vendor").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_rencana_vendor",
            "data" : {
                "ptanggal" : "20200208"
            },
            "type" : "GET",
            "dataType" : "JSON"
//            console.log('Tes' + data)
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
                "width": "8%",
                "data" : "JENIS_PEMBAYARAN",
                "render" : (data) => {
                    return data;
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "left"
                    })
                }
            },
            {
                "width" : "26%",
                "data" : "VENDOR_NAME",
//                "render" : (data) => {
//                    return data.VENDOR_NAME;
//                },
            },
            {
                "data" : "HOUSE_BANK",
//                "render" : (data) => {
//                    return data.HOUSE_BANK;
//                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "center"
                    })
                }
            },
            {
                "data" : "CURRENCY",
//                "render" : (data) => {
//                    return data.CURRENCY;
//                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "center"
                    })
                }
            },
           {
                "data" : "ORI_CURR",
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR",
                "render" : (data) => {
                    return '<td> Rp. '+ new Intl.NumberFormat().format(data) + '</td>';
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            let cok = null;
            if (cok !== data.TANGGAL){
                let index = 0;
            }
            if (data["NOURUT"] === 999){
                $(row).css({
                    "background-color" : "#F4D35E",
                    "color" : "black",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","4");
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
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group+'</td></tr>'
                    );
                    last = group;
                }
            } );
        }
    });
}

$(document).ready(function () {
    tableMainDashboard();
    tableRencanaPerVendor();
//    var table = $('#pembayaran-bank').DataTable({
//       'rowsGroup': [0]
//    });

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});




