$(document).ready(function () {
    initDataTablePlacement();
    tableMainDashboard();


    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function initDataTablePlacement(p_tgl_awal, p_sesi) {
//    showLoadingCss()
    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_belum/rekap_placement_lcl",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_sesi: $("#range_filter").val()
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
            nomor = key + 1;
                var html = "<tr>" +
                    "<td align='center'>" + nomor + "</td>" +
                    "<td align='center'>" + val.DISTRIBUSI + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.POSTPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.PREPAID,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NTL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                    "</tr>";
                $('#penerimaan-penjualan-distribusi').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" + "<td colspan=2 align='center'>TOTAL IDR</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_POSTPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_PREPAID,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_NTL,2,".",",") + "</td>" +
                                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JUMLAH_TOTAL,2,".",",") + "</td>" +
                                "</tr>";

            $('#penerimaan-penjualan-distribusi tbody').append(total1);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#penerimaan-penjualan-distribusi tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#penerimaan-penjualan-distribusi tbody').append(html);
        }
    });
}

function tableMainDashboard(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    var datestring = dateToString(date);
    $("#tgl1b").html(datestring);
    $("#tgl2b").html(incDate(date, 1));
    $("#tgl3b").html(incDate(date, 2));
    $("#tgl4b").html(incDate(date, 3));
    $("#tgl5b").html(incDate(date, 4));
    $("#tgl6b").html(incDate(date, 5));
//    $("#tgl7b").html(incDate(date, 6));

    let rupiah = $("#rupiah").DataTable({
            "ajax" : {
                "url": baseUrl + "/api_operator/rekap_invoice_belum/ins_rekap_placement_lcl",
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
                {"data": null,"visible": false,"render": (data, type, row) => {return data.KETERANGAN;}},
                {"data": null,"render": (data, type, row) => {return data.KETERANGAN;}},
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
    //            console.log(array[20])

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