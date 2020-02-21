$(document).ready(function () {
    initDataTableSaldoRek1();
    tableRencanaImprestValas();
    tableRencanaImpres();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    setInterval(function () {
        initDataTableSaldoRek1();
    }, 60000);
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function initDataTableSaldoRek1() {
    showLoadingCss()
     $.ajax({
            url: baseUrl + "api_dashboard/get_rencana_pembayaran",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {
                var data = res.return;
                var tes = JSON.stringify(res);
                $('#table-rencana-pembayaran tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.CASH_CODE + " " + val.CASH_DESCRIPTION + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.H0,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.H1,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.H2,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.WEEKLY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.MONTHLY,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-rencana-pembayaran tbody').append(html);
                });

                    var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                        "<td>SUB TOTAL</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H0,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H1,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H2,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_WEEKLY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MONTHLY,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-rencana-pembayaran tbody').append(total1);

                    var total2 = "<tr style='background-color:#67a2d8;color: white'>" +
                        "<td>SUB TOTAL</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H0,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H1,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H2,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_WEEKLY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MONTHLY,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-rencana-pembayaran tbody').append(total2);

                    var total3 = "<tr style='background-color:#67a2d8;color: white'>" +
                        "<td>TOTAL</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H0,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H1,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H2,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_WEEKLY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MONTHLY,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-rencana-pembayaran tbody').append(total3);

        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data");
            hideLoadingCss();
            $('#table-rencana-pembayaran tbody').empty();
            var html = "<tr>" +
                "<td colspan='6' align='center'> No Data </td>" +
                "</tr>";
            $('#table-rencana-pembayaran tbody').append(html);
        }
    });
     $.ajax({
            url: baseUrl + "api_dashboard/get_rencana_investasi_operasi",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {
                var data = res.return;
                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-investasi-operasi tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.TGL_RENCANA_BAYAR + "</td>" +
                        "<td>" + val.JENIS + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.IDR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.USD,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EUR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.JPY,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.MYR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-investasi-operasi tbody').append(html);
                });

                var total = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td colspan='2' align='center'>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_SELURUH[0].TOTAL_SELURUH_IDR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_SELURUH[0].TOTAL_SELURUH_USD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_SELURUH[0].TOTAL_SELURUH_EUR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_SELURUH[0].TOTAL_SELURUH_JPY,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_SELURUH[0].TOTAL_SELURUH_MYR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_SELURUH[0].TOTAL_SELURUH_EQ_IDR,2,".",",") + "</td>" +
                    "</tr>";

                $('#table-investasi-operasi tbody').append(total);

            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data");
            hideLoadingCss();
            $('#table-investasi-operasi tbody').empty();
            var html = "<tr>" +
                "<td colspan='8' align='center'> No Data </td>" +
                "</tr>";
            $('#table-investasi-operasi tbody').append(html);
        }
      });
     $.ajax({
              url: baseUrl + "api_dashboard/get_saldo_bank",
              dataType: 'JSON',
              type: "GET",
              success: function (res) {
                  var data = res.return;
                  //console.log("response : "+data);
                  $("#tglcetak").html(data[0].TANGGAL);
                  $('#table-jenis-bank tbody').empty();
                  $.each(data, function (key, val) {
                      var html = "<tr>" +
                          "<td>" + val.BANK + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.SALDO,2,".",",") + "</td>" +
                          "</tr>";
                      $('#table-jenis-bank tbody').append(html);
                  });

                  var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                      "<td>TOTAL</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SALDO,2,".",",") + "</td>" +
                      "</tr>";

              $('#table-jenis-bank tbody').append(total1);


              var dataPieSaldoBank = [];
              $.each(res.OUT_PIE_BANK, function (index, value) {
                  var dataPieTemp = {
                      label: value.BANK,
                      value: value.PERSENTASE == 0 ? null : value.PERSENTASE
                  };
                  dataPieSaldoBank.push(dataPieTemp)
              });

              console.log("");

              creteChartSaldoBank(dataPieSaldoBank);
              hideLoadingCss()
          },
          error: function () {
              // hideLoadingCss("Gagal Ambil Data");
              hideLoadingCss();
              $('#table-jenis-bank tbody').empty();
              var html = "<tr>" +
                  "<td colspan='5' align='center'> No Data </td>" +
                  "</tr>";
              $('#table-jenis-bank tbody').append(html);
          }
            });
     $.ajax({
                  url: baseUrl + "api_dashboard/get_komposisi_saldo",
                  dataType: 'JSON',
                  type: "GET",
                  success: function (res) {
                      var data = res.return;
                      //console.log('DIAZ :'+res)
                      $("#tglcetak").html(data[0].TANGGAL);
                      $('#table-komposisi-saldo tbody').empty();
                      $.each(data, function (key, val) {
                          var html = "<tr>" +
                              "<td>" + val.JENIS_REKENING + "</td>" +
                              "<td align='right'>" + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                              "</tr>";
                          $('#table-komposisi-saldo tbody').append(html);
                      });

                      var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                          "<td>TOTAL</td>" +
                          "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL,2,".",",") + "</td>" +
                          "</tr>";

                  $('#table-komposisi-saldo tbody').append(total1);


                  var dataPieKompSaldo = [];
                  $.each(res.OUT_PIE_KOMPOSISI, function (index, value) {
//                  console.log('PERSENTASE :'+value.PERSENTASE);
                  //console.log('WARNA :'+value.WARNA);
                      var dataPieTemp = {
//                          minvalue: value.JENIS_REKENING,
//                          maxvalue: value.PERSENTASE == 0 ? null : value.PERSENTASE
                          minvalue: '0',
                          maxvalue: value.PERSENTASE,
                          code: value.WARNA
                      };
                      dataPieKompSaldo.push(dataPieTemp)
                  });

                  //console.log('Diaz Ganteng :'+res.OUT_PIE_KOMPOSISI);

                  creteChartKompSaldo(dataPieKompSaldo);
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
          url: baseUrl + "api_dashboard/get_rekening_vs_rencana",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_SALDO;
            var tes = JSON.stringify(data);
            //console.log('Diaz djancuk :'+tes);
            $("#tglcetak").html(data[0].TANGGAL);

            var dataPieRekRencana = [];
            $.each(data, function (index, value) {
                var dataPieTemp = {
                    minvalue: '0',
                    maxvalue: value.PERSENTASE,
                    code: value.WARNA,
                    dial: value.NILAI_PERSENTASE
                };
                dataPieRekRencana.push(dataPieTemp)
            });

            var dataPieRekRencana2 = [];
            $.each(data2, function (index, value) {
                var dataPieTemp2 = {
                    dial: value.NILAI_PERSENTASE
                };
                dataPieRekRencana2.push(dataPieTemp2)
            });

            creteChartRekRencana(dataPieRekRencana, dataPieRekRencana2);
            hideLoadingCss()
      },
      error: function () {
          // hideLoadingCss("Gagal Ambil Data");
          hideLoadingCss();
          $('#table-jenis-bank tbody').empty();
          var html = "<tr>" +
              "<td colspan='5' align='center'> No Data </td>" +
              "</tr>";
          $('#table-jenis-bank tbody').append(html);
      }
     });
     $.ajax({
           url: baseUrl + "api_dashboard/get_rencana_pembayaran",
           dataType: 'JSON',
           type: "GET",
           success: function (res) {
             var data = res.return;
             var data2 = res.OUT_BAR_CASHCODE;
 //            var tes = JSON.stringify(res.return);
             var tes2 = JSON.stringify(data2);
             console.log('CUKKK :'+tes2)
             $("#tglcetak").html(data[0].TANGGAL);

             var dataChartRenPembayaran = [];
             $.each(data2, function (index, value) {
                 var dataPieTemp = {
                     seriesname : value.CASH_DESCRIPTION,
                     data : [
                     {
                         value: value.HS
                     },
                     {
                         value: value.H1
                     },
                     {
                         value: value.H2
                     },
                     {
                         value: value.WEEKLY
                     },
                     {
                         value: value.MONTHLY
                     }
                     ]
                 };
                 dataChartRenPembayaran.push(dataPieTemp)
             });

             rencanaPembayaranBarLine(dataChartRenPembayaran);
             hideLoadingCss()
       },
       error: function () {
           // hideLoadingCss("Gagal Ambil Data");
           hideLoadingCss();
           $('#table-jenis-bank tbody').empty();
           var html = "<tr>" +
               "<td colspan='5' align='center'> No Data </td>" +
               "</tr>";
           $('#table-jenis-bank tbody').append(html);
       }
      });
}

//Update Senin 17/2/2020

function creteChartRekRencana(data, data2) {
    var maxval1 = data[1].maxvalue + data[0].maxvalue;
    var maxval2 = data[2].maxvalue + data[1].maxvalue;
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-rencana-pembayaran1',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "bgColor": "#BBEAEA",
                        caption : "Rencana Pembayaran",
                        "numbersuffix": "%",
                        "lowerLimitDisplay": "0%",
                        "upperLimitDisplay": "100%",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "5",
                        "pivotBorderColor": "#000000",
                        "pivotBorderAlpha": "100",
                        "pivotFillColor": "#000000",
                        "pivotFillAlpha": "100",
                        "valueBelowPivot": "0",
                        showTickMarks: "0",
                        showTickValues: "1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: "0",
                              maxvalue: data[0].maxvalue,
                              code: data[0].code
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: data[1].code
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: "100",
                              code: data[2].code
                          },
                       ]
                     },
                    "dials": {
                         "dial": [{
                         "id": "fd_dial",
                         "bgcolor": "#F20F2F",
                         "value": data2[1].dial
                       }, {
                         "id": "clth_dial",
                         "bgcolor": "#F4D35E",
                         "value": data2[0].dial
                       }
                      ]
                    }
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartSaldoRek(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'stackedcolumn2d',
                renderAt: 'chart-saldo-rekening',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Saldo Rekening",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#BBEAEA",
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

function rencanaPembayaranBarLine(data){

var tes = JSON.stringify(data);
console.log('DZ :' +tes);
    const dataSource = {
        chart : {
            caption : "Rencana Pembayaran",
            showSum : "1",
            numberprefix : "Rp ",
            theme : "fusion",
            numDivLines : "5",
            divLineColor: "#6699cc",
            divLineAlpha: "60",
            divLineDashed: "0",
            bgColor: "#BBEAEA",
            showLegend: "0",
            crosslinecolor: "#ABD6D6"
        },
        categories : [
            {
                category : [
                    {
                        label : "Hari H"
                    },
                    {
                        label : "Hari 1"
                    },
                    {
                        label : "Hari 2"
                    },
                    {
                        label : "Weekly"
                    },
                    {
                        label : "Monthly"
                    }
                ]
            }
        ],
        dataset : data
    };

    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "column-rencana-pembayaran",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function tableRencanaImpres(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let groupColumn = 0;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    $("#header_tgl_rencana_imprest").append("<td style='text-align: center; background-color: #67a2d8'>URAIAN</td>");
    for (let i=0; i<8; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header_tgl_rencana_imprest").append("<td style='background-color: #67a2d8; vertical-align: middle'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let tb_rencana_imprest_valas = $("#dash_rencana_imprest").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_rencana_imprest",
            "data" : {
                "ptanggal" : current_full_date
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "visible" : false,
                "data" : "BANK",
                "createdCell" : (cell) => {$(cell).css("background-color","white")},
            },
            {"data" : "URAIAN"},
            {
                "width" : "12%",
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D0 === null){
                            return "";}
                        else if (data.RP_D0 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D0 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D0);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D1 === null){
                            return "";}
                        else if (data.RP_D1 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D1 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D1);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D2 === null){
                            return "";
                        }else if (data.RP_D2 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D2 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D2);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D3 === null){
                            return "";
                        }else if (data.RP_D3 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D3 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D3);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null){
                            return "";
                        }else if (data.RP_D4 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D4 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D4);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D5 === null){
                            return "";
                        }else if (data.RP_D5 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D5 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D5);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D6 === null){
                            return "";
                        }else if (data.RP_D6 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D6 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D6);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D7 === null){
                            return "";
                        }else if (data.RP_D7 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D7 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D7);
                        }
                    }
                },
                "createdCell" : (cell)=>{
                    $(cell).css("text-align","right");
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ISANAK"] === 0){
                $(row).css({
                    "background-color" : "#ebfffa",
                })
            }

            if (data["URAIAN"] === "KETERANGAN"){
                $(row).css({
                    "background-color" : "#8688ca",
                    "color" : "white",
                })
            }
        },
        "drawCallback" : function (settings){
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td rowspan="6" style="vertical-align: middle;text-align: center; font-weight: bold">'+group+'</td></tr>'
                    );

                    last = group;
                }
            } );
        }
    })
}

function tableRencanaImprestValas(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let groupColumn = 0;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    $("#header_tgl_imprest_valas").append("<td style='text-align: center; background-color: #67a2d8'>URAIAN</td>");
    for (let i=0; i<8; i++){
        let tgl = date.getDate()+i;
        let month = date.getMonth()+1;
        $("#header_tgl_imprest_valas").append("<td style='background-color: #67a2d8; vertical-align: middle'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</td>");
    }

    let tb_rencana_imprest_valas = $("#rencana_imprest_valas").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_recana_valas",
            "data" : {
                "ptanggal" : current_full_date
            },
            "type" : "GET",
            "dataType" : "JSON",
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {
                "visible" : false,
                "data" : "BANK",
                "createdCell" : (cell) => {$(cell).css("background-color","white")}
            },
            {"data" : "URAIAN", "width" : "9%"},
            {
                "width" : "15%",
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D0 === null){
                            return "";
                        }
                        else if (data.RP_D0 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D0 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D0);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D1 === null){
                            return "";}
                        else if (data.RP_D1 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D1 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D1);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D2 === null){
                            return "";
                        }else if (data.RP_D2 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D2 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D2);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D3 === null){
                            return "";
                        }else if (data.RP_D3 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D3 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D3);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D4 === null) {
                            return "";
                        } else if (data.RP_D4 === -1) {
                            return "KURANG";
                        }
                    } else {
                        if (data.RP_D4 === null) {
                            return 0;
                        } else {
                            return new Intl.NumberFormat().format(data.RP_D4);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D5 === null){
                            return "";
                        }else if (data.RP_D5 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D5 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D5);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D6 === null){
                            return "";
                        }else if (data.RP_D6 === -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D6 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D6);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
            {
                "data" : null,
                "render" : (data) => {
                    if (data.URAIAN === "KETERANGAN") {
                        if (data.RP_D7 === null){
                            return "";
                        }else if (data.RP_D7 == -1){
                            return "KURANG";
                        }
                    }else {
                        if (data.RP_D7 === null) {
                            return 0;
                        }else {
                            return new Intl.NumberFormat().format(data.RP_D7);
                        }
                    }
                },
                "createdCell" : (cell) => {$(cell).css("text-align","right")}
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ISANAK"] === 0){
                $(row).css({
                    "background-color" : "#bed0cb",
                })
            }

            if (data["URAIAN"] === "KETERANGAN"){
                $(row).css({
                    "background-color" : "#8688ca",
                    "color" : "white",
                })
            }
        },
        "drawCallback" : function (settings){
            var api = this.api();
            var rows = api.rows({page:'current'}).nodes();
            var last = null;

            api.column(groupColumn, {page:'current'}).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td rowspan="12" style="vertical-align: middle;text-align: center; font-weight: bold">'+group+'</td></tr>'
                    );
                    last = group;
                }
            } );
        }
    })
}
