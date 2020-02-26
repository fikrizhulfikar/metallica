function tableMainDashboard(_date){

//    let groupColumn = 0;
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;
//    console.log("Date : " + current_full_date);
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

//    for (let i=0; i<7; i++){
//        let tgl = date.getDate(incDate(date))+i;
//        let month = date.getMonth()+1;
//        $("#header-tanggal1").append("<td style='background-color: #F4D35E; width: 10.7%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
//        $("#header-tanggal2").append("<td style='background-color: #F4D35E; width: 13%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
//        $("#header-tanggal3").append("<td style='background-color: #F4D35E; width: 12%;'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
//    }

//    var row = document.getElementById("header-tanggal1");
//    var x = row.insertCell(-1);
//    x.innerHTML = "TOTAL";
//
//    var row = document.getElementById("header-tanggal2");
//    var x = row.insertCell(-1);
//    x.innerHTML = "TOTAL";
//
//    var row = document.getElementById("header-tanggal3");
//    var x = row.insertCell(-1);
//    x.innerHTML = "TOTAL";

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
            {"data": null,"visible": true,"render": (data, type, row) => {return data.BANK;}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else if (data.CURRENCY === "USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else if (data.CURRENCY === "EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else if (data.CURRENCY === "JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
        ],

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL EUR")){
                $(row).css({
                    "background-color": "#F4D35E",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","2");
             };
            if ((data["BANK"] === "TOTAL IDR")){
                 $(row).css({
                     "background-color": "#F4D35E",
                     "text-align": "center",
                     "font-weight": "bold",
                 });
 //                $('td', row).eq(0).attr("colspan","2");
              };
             if ((data["BANK"] === "TOTAL JPY")){
                  $(row).css({
                      "background-color": "#F4D35E",
                      "text-align": "center",
                      "font-weight": "bold",
                  });
  //                $('td', row).eq(0).attr("colspan","2");
               };
              if ((data["BANK"] === "TOTAL MYR")){
                   $(row).css({
                       "background-color": "#F4D35E",
                       "text-align": "center",
                       "font-weight": "bold",
                   });
   //                $('td', row).eq(0).attr("colspan","2");
                };
               if ((data["BANK"] === "TOTAL USD")){
                    $(row).css({
                        "background-color": "#F4D35E",
                        "text-align": "center",
                        "font-weight": "bold",
                    });
//                    $('td', row).eq(0).attr("colspan","2");
                 };
         },

//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last !== group.BANK){
//                let count = 1;
//
//                for (let j=i; i<array.length; j++){
//                    let first = array[i].BANK;
//                    if (first !== array[j].BANK) break;
//                    count+= 1;
//                }
//                $(rows).eq(i).before(
//                    '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.BANK+'</td></tr>'
//                );
//                console.log(array)
//                last = group.BANK;
//                }
//            });
//         }
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
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
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
            {
                "data": null,
                "visible" : true,
                "render": (data, type, row) => {
                    return data.JENIS;
                }
            },
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else if (data.CURRENCY === "USD"|| data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR" || data.CURRENCY === "TOTAL IDR"){
                                                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else if (data.CURRENCY === "USD" || data.CURRENCY === "TOTAL USD"){
                                                            return '<td> $ '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else if (data.CURRENCY === "EUR" || data.CURRENCY === "TOTAL EUR"){
                                                            return '<td> € '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else if (data.CURRENCY === "JPY" || data.CURRENCY === "TOTAL JPY"){
                                                            return '<td> ¥ '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                            } else
                                                            return '<td> RM '+ new Intl.NumberFormat().format(data.RP_TOTAL)+'</td>';
                                                         },
                                                         "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                         }},
        ],
//        console.log(data)
        "createdRow" : function (row, data, dataIndex){

            if ((data["JENIS"] === "TOTAL EUR")){
                $(row).css({
                    "background-color": "#F4D35E",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","2");
             };
            if ((data["JENIS"] === "TOTAL IDR")){
                 $(row).css({
                     "background-color": "#F4D35E",
                     "text-align": "center",
                     "font-weight": "bold",
                 });
 //                $('td', row).eq(0).attr("colspan","2");
              };
             if ((data["JENIS"] === "TOTAL JPY")){
                  $(row).css({
                      "background-color": "#F4D35E",
                      "text-align": "center",
                      "font-weight": "bold",
                  });
  //                $('td', row).eq(0).attr("colspan","2");
               };
              if ((data["JENIS"] === "TOTAL MYR")){
                   $(row).css({
                       "background-color": "#F4D35E",
                       "text-align": "center",
                       "font-weight": "bold",
                   });
   //                $('td', row).eq(0).attr("colspan","2");
                };
               if ((data["JENIS"] === "TOTAL USD")){
                    $(row).css({
                        "background-color": "#F4D35E",
                        "text-align": "center",
                        "font-weight": "bold",
                    });
//                    $('td', row).eq(0).attr("colspan","2");
                 };
         },

//         "drawCallback" : function (settings){
//            let groupColumn = 0;
//            var api = this.api();
//            var rows = api.rows({page:'current'}).nodes();
//            var last = null;
//            let array = api.column(groupColumn, {page:'current'}).data();
//
//            api.column(groupColumn, {page:'current'}).data().each(function (group, i){
//            if (last == group.JENIS){
//                let count = 1;
//
//                for (let j=i; i<array.length; j++){
//                    let first = array[i].JENIS;
//                    if (first !== array[j].JENIS) break;
//                    count+= 1;
//                }
//                $(rows).eq(i).before(
//                    '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group.JENIS+'</td></tr>'
//                );
//                console.log(array)
//                last = group.JENIS;
//            }
//            });
//
//         }
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
                        "text-align" : "right"
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
            if (data["NOURUT"] === 99){
                $(row).css({
                    "background-color" : "#F4D35E",
                    "color" : "black",
                    "text-align": "center",
                    "font-weight": "bold",
                });
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
    tableMainDashboard();
    tableRencanaPerVendor();

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});




