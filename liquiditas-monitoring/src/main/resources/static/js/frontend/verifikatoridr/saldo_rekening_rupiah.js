$(document).ready(function () {
    initDataTable();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    setInterval(function () {
         initDataTable();
    }, 120000);
});

function initDataTable() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_saldo_rekening_rupiah",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            // console.log("resonse : ",res);
            var data = res.return;
            $("#tglcetak").html(res.return[0].TANGGAL)
            $('#table-imprst-idr tbody').empty();
            $.each(data, function (key, val) {
                var html = "<tr>" +
                    "<td>" + val.BANK + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.RECEIPT, 2, ".", ",") + "</td>" +
//                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_KP, 2, ".", ",") + "</td>" +
//                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_OPERASI, 2, ".", ",") + "</td>" +
//                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
//                    "<td align='right'> Rp " + accounting.formatNumber(val.IMPOR, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-saldo-idr tbody').append(html);
            });

//            var total6 = "<tr style='background-color:#67a2d8;color: white'>" +
//                "<td> TOTAL </td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_RECEIPT, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_KP, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_OPERASI, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPOR, 2, ".", ",") + "</td>" +
//                "</tr>";
//
//            $('#table-saldo-idr tbody').append(total6);

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_RECEIPT, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-receipt tbody').append(total1);

            var total2 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_KP, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-imprestkp tbody').append(total2);

            var total3 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_OPERASI, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-imprestop tbody').append(total3);

            var total4 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPREST_INVESTASI, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-imprestinv tbody').append(total4);

            var total5 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IMPOR, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-impor tbody').append(total5);

            var dataPieSaldo1 = [];
            $.each(res.OUT_PIE_RECEIPT, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieSaldo1.push(temp)
            });
            createChartTerpusat(dataPieSaldo1);

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-saldo-idr tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-saldo-idr tbody').append(html);
        }
    });
    $.ajax({
            url: baseUrl + "api_dashboard/get_saldo_rekening_rupiah2",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {
//             var data = res.return;
             var data2 = res.OUT_DATA;
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
             chartProyeksiPenerimaan(dataChartRenPembayaran);
            }
    });

    $.ajax({
            url: baseUrl + "api_dashboard/get_saldo_rekening_rupiah3",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {

            var dataGiroSpecial = [];
            $.each(data, function (index, value) {
                 var dataPieTemp = {
                     {
                     seriesname : value.AKUMULASI_NOMINAL,
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
                     },
                     {
                      seriesname : value.NOMINAL_BULAN_BERJALAN,
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
                      }
                 };
                 dataGiroSpecial.push(dataPieTemp)
            });
            chartGiroSpecial(dataGiroSpecial);

            var dataPieSaldo1 = [];
            $.each(res.OUT_JASA_GIRO, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieSaldo1.push(temp)
            });
            createChartJasaGiro(dataPieSaldo1);

            var dataPieSaldo2 = [];
            $.each(res.OUT_AKUMULAS_JASA_GIRO, function (index, value) {
                var temp = {
                    label: value.BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieSaldo2.push(temp)
            });
            createChartAkumulasiJasaGiro(dataPieSaldo2);
            }
    });
}

function createChartTerpusat(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-saldo-terpusat',
                width: '400',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Saldo Rekening Rupiah Terpusat",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "10"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function createChartJasaGiro(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-jasa-giro',
                width: '400',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Jasa Giro Optimasi Dana IDR",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "10"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function createChartAkumulasiJasaGiro(data) {
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-akumulasi-jasa-giro',
                width: '400',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Akumulasi Jasa Giro Optimasi Dana IDR",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
                        "showLabels": "0",
                        "isSmartLineSlanted": "0",
                        "showBorder": "0",
                        "showLegend": "1",
                        "baseFontSize": "10"
                    },
                    "data": data
                }
            }
        );
        fusioncharts.render();
    });
}

function chartProyeksiPenerimaan(data){
    let date = new Date();
//    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-proyeksi-penerimaan",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Proyeksi Penerimaan",
                   showSum : "1",
                   numberprefix : "Rp ",
                   theme : "fusion",
                   numDivLines : "5",
                   divLineColor: "#6699cc",
                   divLineAlpha: "60",
                   divLineDashed: "0",
                   bgColor: "#BBEAEA",
                   showLegend: "0",
                   crosslinecolor: "#ABD6D6",
                   numberScaleValue: "1000, 1000, 1000, 1000",
                   numberScaleUnit: "Rb, Jt, M, T"
               },
               categories : [
                   {
                       category : [
                          {
                              label : "USD"
                          },
                          {
                              label : "EUR"
                          },
                          {
                              label : "JPY"
                          }
                      ]
                   }
               ]
           },
            events:{
              "rendered": function (eventObj, dataObj) {
//              var mydatasource = chart.getJSONData();
//              console.log(mydatasource)
                }
            }
        }).render();
    });
}

function chartGiroSpecial(data){
    let date = new Date();
//    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-penempatan",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Nominal Penempatan Giro Special Rate (Optimasi Dana)",
                   showSum : "1",
                   numberprefix : "Rp ",
                   theme : "fusion",
                   numDivLines : "5",
                   divLineColor: "#6699cc",
                   divLineAlpha: "60",
                   divLineDashed: "0",
                   bgColor: "#BBEAEA",
                   showLegend: "0",
                   crosslinecolor: "#ABD6D6",
                   numberScaleValue: "1000, 1000, 1000, 1000",
                   numberScaleUnit: "Rb, Jt, M, T"
               },
               categories : [
                   {
                       category : [
                          {
                              label : "Mandiri"
                          },
                          {
                              label : "BRI"
                          },
                          {
                              label : "BNI"
                          },
                          {
                              label : "BUKOPIN"
                          },
                          {
                              label : "BTN"
                          },
                      ]
                   }
               ]
           },
            events:{
              "rendered": function (eventObj, dataObj) {
//              var mydatasource = chart.getJSONData();
//              console.log(mydatasource)
                }
            }
        }).render();
    });
}
