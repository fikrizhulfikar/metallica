var tempTableSearch = "";
$(document).ready(function () {
    initDataTablePlacement();
    initDataTablePlacement3();
//    tableMainDashboard();

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function initDataTablePlacement(p_tgl_awal, p_sesi) {
showLoadingCss();
    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
    $('#sesi_filter').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/rekap_placement_fcl",
        dataType: 'JSON',
        type: "GET",
        data: {
            p_tgl_awal: $("#tanggal_awal1").val(),
            p_sesi: $("#sesi_filter").val()
        },
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-rekap-placement-lcl tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
            if (val["BANK"] === "BUKOPIN"){
                var html = "<tr>" +
                    "<td align='center' style='background: #78d5d4; border-bottom: 1px solid transparent !important; font-weight: bold; color:#78d5d4'>" + val.TIPE + "</td>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.MANDIRI,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.BRI,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.BNI,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.BUKOPIN,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                    "</tr>";
            } else if (val["BANK"] === "BRI"){
               var html = "<tr>" +
                   "<td align='center' style='background: #78d5d4; border-top: 1px solid transparent !important; border-bottom: 1px solid transparent !important; font-weight: bold ; color:#78d5d4'>" + val.TIPE + "</td>" +
                   "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                   "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                   "<td align='right'> Rp " + accounting.formatNumber(val.MANDIRI,2,".",",") + "</td>" +
                   "<td align='right'> Rp " + accounting.formatNumber(val.BRI,2,".",",") + "</td>" +
                   "<td align='right'> Rp " + accounting.formatNumber(val.BNI,2,".",",") + "</td>" +
                   "<td align='right'> Rp " + accounting.formatNumber(val.BUKOPIN,2,".",",") + "</td>" +
                   "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                   "</tr>";
           } else if (val["BANK"] === "MANDIRI"){
                var html = "<tr>" +
                    "<td align='center' style='background: #78d5d4; border-bottom: 1px solid transparent !important; font-weight: bold'>" + val.TIPE + "</td>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.MANDIRI,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.BRI,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.BNI,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.BUKOPIN,2,".",",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                    "</tr>";
            } else if (val["BANK"] === "BNI"){
                 var html = "<tr>" +
                     "<td align='center' style='background: #78d5d4; border-top: 1px solid transparent !important; border-bottom: 1px solid transparent !important; font-weight: bold; color:#78d5d4'>" + val.TIPE + "</td>" +
                     "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                     "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                     "<td align='right'> Rp " + accounting.formatNumber(val.MANDIRI,2,".",",") + "</td>" +
                     "<td align='right'> Rp " + accounting.formatNumber(val.BRI,2,".",",") + "</td>" +
                     "<td align='right'> Rp " + accounting.formatNumber(val.BNI,2,".",",") + "</td>" +
                     "<td align='right'> Rp " + accounting.formatNumber(val.BUKOPIN,2,".",",") + "</td>" +
                     "<td align='right'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                     "</tr>";
             } else if (val["BANK"] === "TOTAL"){
                  var html = "<tr>" +
                      "<td align='center' style='background: #78d5d4; border-top: 1px solid transparent !important; font-weight: bold; color:#78d5d4'>" + val.TIPE + "</td>" +
                      "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                      "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SALDO_AWAL,2,".",",") + "</td>" +
                      "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.MANDIRI,2,".",",") + "</td>" +
                      "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.BRI,2,".",",") + "</td>" +
                      "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.BNI,2,".",",") + "</td>" +
                      "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.BUKOPIN,2,".",",") + "</td>" +
                      "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.SALDO_AKHIR,2,".",",") + "</td>" +
                      "</tr>";
              }
                $('#table-rekap-placement-lcl').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-rekap-placement-lcl tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-rekap-placement-lcl tbody').append(html);
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

function initDataTablePlacement3() {
    showLoadingCss();
//    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
//    $('#sesi_filter').attr("disabled", "disabled");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_pemindahan_buku_fcl",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);

            $('#table-pemindahbukuan tbody').empty();
            var nomor;
            $.each(data, function (key, val) {
            $("#tglcetak").html(data[0].TANGGAL);
//            nomor = key + 1;
            if (val["BANK"] === "TOTAL"){
                var html = "<tr>" +
                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='center' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "<td align='right' style='background: #5dbcd2'> </td>" +
                    "</tr>";
            } else {
                var html = "<tr>" +
                    "<td align='center'>" + val.BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'>" + val.KEPADA_BANK + "</td>" +
                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
                    "<td align='right'>" + val.NO_REKENING + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
                    "<td align='right'>" + val.NO_SAP + "</td>" +
                    "<td align='right'> " + val.KETERANGAN + "</td>" +
                    "</tr>";
            }
                $('#table-pemindahbukuan').append(html);
            });

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-pemindahbukuan tbody').empty();
            var html = "<tr>" +
                "<td colspan='11' align='center'> No Data </td>" +
                "</tr>";
            $('#table-pemindahbukuan tbody').append(html);
        }
    });

//    $.ajax({
//        url: baseUrl + "api_operator/rekap_invoice_belum/get_pengadaan_valas",
//        dataType: 'JSON',
//        type: "GET",
//        success: function (res) {
//            var data = res.return;
//            console.log("response : "+data);
//
//            $('#table-rekap-placement-lcl tbody').empty();
//            var nomor;
//            $.each(data, function (key, val) {
//            $("#tglcetak").html(data[0].TANGGAL);
////            nomor = key + 1;
//           if (val["BANK"] === "TOTAL"){
//                var html = "<tr>" +
//                    "<td align='center' style='background: #5dbcd2'>" + val.BANK + "</td>" +
//                    "<td align='right' style='background: #5dbcd2'> </td>" +
//                    "<td align='right' style='background: #5dbcd2'> </td>" +
//                    "<td align='right' style='background: #5dbcd2'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
//                    "<td align='center' style='background: #5dbcd2'> </td>" +
//                    "<td align='right' style='background: #5dbcd2'> </td>" +
//                    "<td align='right' style='background: #5dbcd2'> </td>" +
//                    "<td align='right' style='background: #5dbcd2'> </td>" +
//                    "<td align='right' style='background: #5dbcd2'> </td>" +
//                    "</tr>";
//            } else {
//                var html = "<tr>" +
//                    "<td align='center'>" + val.BANK + "</td>" +
//                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
//                    "<td align='right'>" + val.NO_REKENING + "</td>" +
//                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL,2,".",",") + "</td>" +
//                    "<td align='right'>" + val.BANK + "</td>" +
//                    "<td align='right'>" + val.NAMA_REKENING + "</td>" +
//                    "<td align='right'>" + val.NO_REKENING + "</td>" +
//                    "<td align='right'>" + val.NO_SAP + "</td>" +
//                    "<td align='right'> " + val.KETERANGAN + "</td>" +
//                    "</tr>";
//            }
//                $('#table-pengadaan-valas').append(html);
//            });
//
//            hideLoadingCss()
//        },
//        error: function () {
//            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
//            hideLoadingCss();
//            $('#table-pengadaan-valas tbody').empty();
//            var html = "<tr>" +
//                "<td colspan='9' align='center'> No Data </td>" +
//                "</tr>";
//            $('#table-pengadaan-valas tbody').append(html);
//        }
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

function openLihatDokumen(){
//    setSelectBank("pNewBankPembayar", "", "PEMBAYAR", "", "REKAP");
//    $("#pNewTglJatuhTempo").val("");
//    $("#pNewBankPembayar").val("")
//    $('#pNewTglJatuhTempo').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $('#set-d').modal({backdrop: 'static', keyboard: false});
}
