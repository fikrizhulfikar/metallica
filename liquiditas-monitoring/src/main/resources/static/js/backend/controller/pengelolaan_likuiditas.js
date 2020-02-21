function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;
    console.log("Current Date : ",current_full_date);

//    let saldo_operasi = $("#saldo-operasi").DataTable({
//        "ajax" : {
//            "url": baseUrl + "api_operator/rekap_invoice_belum/laporan_komposisi_saldo",
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
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RECEIPT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.OBLIGASI)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.DEPRESIASI)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.BENCANA)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.GLOBAL_BOND)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.DOKUMEN_LELANG)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.IMPREST)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.IMPREST_OPERASI_TERPUSAT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.IMPREST_VALAS)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.IMPOR)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.SUBSIDI)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.KMK)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.JML_OPERASI_IDR)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.JML_OPERASI_VALAS)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//        ],
//        "createdRow" : function (row, data, dataIndex){
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#FF773D",
//                });
//             };
//         },
//    });
//
//    let saldo_investasi = $("#saldo-investasi").DataTable({
//        "ajax" : {
//            "url": baseUrl + "api_operator/rekap_invoice_belum/laporan_komposisi_saldo",
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
//            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.IMPREST_INVESTASI_TERPUSAT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.SUKUK)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.DEPOSITO)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.PMN)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.ESCROW_IDR)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.ESCROW_VALAS)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.ADB_RBL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.JML_INVESTASI_IDR)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.JML_INVESTASI_VALAS)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//        ],
//        "createdRow" : function (row, data, dataIndex){
//
//        console.log(data)
//
//            if ((data["BANK"] === "TOTAL")){
//                $(row).css({
//                    "background-color": "#FF773D",
//                });
//             };
//         },
//    });
//
//    let keterangan = $("#keterangan").DataTable({
//            "ajax" : {
//                "url": baseUrl + "api_operator/rekap_invoice_belum/laporan_komposisi_saldo",
//                "data" : {
//                    "tanggal" : current_full_date,
//                },
//                "type" : "GET",
//                "dataType" : "json",
//            },
//            "sorting": false,
//            "searching" : false,
//            "paging": false,
//            "bInfo" : false,
//            "bLengthChange" : false,
//            "columns" : [
//                {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>';}},
//                {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.RP)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
//            ],
//        });


    let rincian_saldo = $("#rincian-saldo").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/rincian_saldo",
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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NO_REKENING+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.JENIS_REKENING+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.TIPE_REKENING+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.ORIGINAL_CURRENCY)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp '+ new Intl.NumberFormat().format(data.EQ_CURRENCY)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> '+ new Intl.NumberFormat().format(data.PERSEN)+' % </td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL")){
                $(row).css({
                    "background-color": "#FF773D",
                });
             };
         },
    });
}

$(document).ready(function () {
    tableMainDashboard();
    tableMainDashboard2();


    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function tableMainDashboard2(){
$.ajax({
   url: baseUrl + "api_operator/rekap_invoice_belum/laporan_komposisi_saldo",
   dataType: 'JSON',
   type: "GET",
   success: function (res) {
       var data = res.return;
       $("#tglcetak").html(data[0].TANGGAL);
       $.each(data, function (key, val) {
         var html = "<tr>" +
             "<td>" + val.BANK + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.RECEIPT,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.OBLIGASI,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.DEPRESIASI,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.BENCANA,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.GLOBAL_BOND,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.DOKUMEN_LELANG,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.IMPREST,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.IMPREST_OPERASI_TERPUSAT,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.IMPREST_VALAS,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.SUBSIDI,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.KMK,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.JML_INVESTASI_IDR,2,".",",") + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.JML_INVESTASI_VALAS,2,".",",") + "</td>" +
             "</tr>";
         $('#saldo-operasi tbody').append(html);

//           $('#saldo-operasi').dataTable( {
//               "createdRow": function( row, data, dataIndex){
//                   if( data["BANK"] === "TOTAL"){
//                   $(row).css({
//                       "background-color": "#F4D35E",
//                   });
//               }
//               }
//           });
       });
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
   url: baseUrl + "api_operator/rekap_invoice_belum/laporan_komposisi_saldo",
   dataType: 'JSON',
   type: "GET",
   success: function (res) {
       var data = res.return;
       $("#tglcetak").html(data[0].TANGGAL);
       $.each(data, function (key, val) {
         var html = "<tr>" +
              "<td>" + val.BANK + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.IMPREST_INVESTASI_TERPUSAT,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.SUKUK,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.DEPOSITO,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.PMN,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.ESCROW_IDR,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.ESCROW_VALAS,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.ADB_RBL,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.JML_INVESTASI_IDR,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.JML_INVESTASI_VALAS,2,".",",") + "</td>" +
              "<td align='right'>" + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
              "</tr>";
          $('#saldo-investasi tbody').append(html);
       });

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
   url: baseUrl + "api_operator/rekap_invoice_belum/laporan_komposisi_saldo",
   dataType: 'JSON',
   type: "GET",
   success: function (res) {
       var data = res.OUT_REKAP;
//       $("#tglcetak").html(data[0].TANGGAL);
       $.each(data, function (key, val) {
         var html = "<tr>" +
             "<td>" + val.URAIAN + "</td>" +
             "<td align='right'>" + accounting.formatNumber(val.RP,2,".",",") + "</td>" +
             "</tr>";
         $('#keterangan tbody').append(html);
       });

         hideLoadingCss()
     },
     error: function () {
         // hideLoadingCss("Gagal Ambil Data");
         hideLoadingCss();
         $('#keterangan tbody').empty();
         var html = "<tr>" +
             "<td colspan='5' align='center'> No Data </td>" +
             "</tr>";
         $('#keterangan tbody').append(html);
     }
    });
}



