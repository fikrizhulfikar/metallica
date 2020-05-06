function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;
    console.log("Current Date : ",current_full_date);

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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.JENIS_REKENING+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.TIPE_REKENING+'</td>';}},
            {"data":null,"render" : (data, tyoe, row) => {if (data.CURRENCY === "IDR"){
                                                              return '<td> Rp '+ new Intl.NumberFormat().format(data.ORIGINAL_CURRENCY)+'</td>';
                                                              } else if (data.CURRENCY === "USD"){
                                                              return '<td> $ '+ new Intl.NumberFormat().format(data.ORIGINAL_CURRENCY)+'</td>';
                                                              } else if (data.CURRENCY === "EUR"){
                                                              return '<td> € '+ new Intl.NumberFormat().format(data.ORIGINAL_CURRENCY)+'</td>';
                                                              } else if (data.CURRENCY === "JPY"){
                                                              return '<td> ¥ '+ new Intl.NumberFormat().format(data.ORIGINAL_CURRENCY)+'</td>';
                                                              } else
                                                              return '<td> RM '+ new Intl.NumberFormat().format(data.ORIGINAL_CURRENCY)+'</td>';
                                                           },
                                                           "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");
                                                           }},
            {"data":null,"render" : (data, tyoe, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.EQ_CURRENCY)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
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
    myFunction();


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
             "<td align='right'> Rp. " + accounting.formatNumber(val.RECEIPT,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.OBLIGASI,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.DEPRESIASI,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.BENCANA,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.GLOBAL_BOND,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.DOKUMEN_LELANG,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST_OPERASI_TERPUSAT,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST_VALAS,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.SUBSIDI,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.KMK,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.JML_OPERASI_IDR,2,".",",") + "</td>" +
             "<td align='right'> Rp. " + accounting.formatNumber(val.JML_OPERASI_VALAS,2,".",",") + "</td>" +
             "</tr>";

             if(val["BANK"] === "TOTAL"){
                   var html = "<tr style='background-color: #FF773D; font-weight: bold'>" +
                        "<td>" + val.BANK + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.RECEIPT,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.OBLIGASI,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.DEPRESIASI,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.BENCANA,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.GLOBAL_BOND,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.DOKUMEN_LELANG,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST_OPERASI_TERPUSAT,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST_VALAS,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.IMPOR,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.SUBSIDI,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.KMK,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.JML_OPERASI_IDR,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.JML_OPERASI_VALAS,2,".",",") + "</td>" +
                        "</tr>";

               }
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
              "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST_INVESTASI_TERPUSAT,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.SUKUK,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.DEPOSITO,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.PMN,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.ESCROW_IDR,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.ESCROW_VALAS,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.ADB_RBL,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.JML_INVESTASI_IDR,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.JML_INVESTASI_VALAS,2,".",",") + "</td>" +
              "<td align='right'> Rp. " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
              "</tr>";

              if(val["BANK"] === "TOTAL"){
                  var html = "<tr style='background-color: #FF773D; font-weight: bold'>" +
                    "<td>" + val.BANK + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.IMPREST_INVESTASI_TERPUSAT,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.SUKUK,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.DEPOSITO,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.PMN,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.ESCROW_IDR,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.ESCROW_VALAS,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.ADB_RBL,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.JML_INVESTASI_IDR,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.JML_INVESTASI_VALAS,2,".",",") + "</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                    "</tr>";

              }
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
             "<td style='background-color: #FF773D; font-weight: bold;'>" + val.URAIAN + "</td>" +
             "<td align='right' style='background-color: #FF773D; font-weight: bold;'> Rp. " + accounting.formatNumber(val.RP,2,".",",") + "</td>" +
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

function myFunction() {
  const filter = document.querySelector('#myInput').value.toUpperCase();
  const trs = document.querySelectorAll('#rincian-saldo tr:not(.header)');
  trs.forEach(tr => tr.style.display = [...tr.children].find(tbody => tbody.innerHTML.toUpperCase().includes(filter)) ? '' : 'none');
}



