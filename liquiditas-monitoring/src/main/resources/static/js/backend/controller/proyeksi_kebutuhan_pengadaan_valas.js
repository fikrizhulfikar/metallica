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

    console.log('Tes ' +datestring)

    let per_bank = $("#pembayaran-bank").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/proyeksi_kebutuhan_pengadaan_valas",
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
            {"data": null,"visible": false,"render": (data, type, row) => {return data.CURRENCY;}},

            {"data": null,"render": (data, type, row) => {return data.BANK;}},
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

            if ((data["CURRENCY"] === "TOTAL")){
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
//            console.log(array[20])

            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
            if (last !== group.CURRENCY){
                let count = 1;

                for (let j=i; j<array.length; j++){
                    let first = array[i].CURRENCY;
                    if (first !== array[j].CURRENCY) break;
                    count+= 1;
                }
                if ((group.CURRENCY === "TOTAL")){
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold; background-color: #F4D35E">'+group.CURRENCY+'</td></tr>'
                    );
                }else
                    $(rows).eq(i).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold;">'+group.CURRENCY+'</td></tr>'
                    );
//                console.log(array)
                last = group.CURRENCY;
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

$(document).ready(function () {
    tableMainDashboard();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});



