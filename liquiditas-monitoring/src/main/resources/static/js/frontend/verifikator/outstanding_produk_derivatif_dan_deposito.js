$(document).ready(function () {
    initDataTableImprstValas();

    setInterval(function () {
        initDataTableImprstValas();
    }, 60000);
});

function initDataTableImprstValas() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_outstanding_produk_derivatif",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var data = res.return;
            console.log("response : "+data);
            $("#tglcetak").html(data[0].TANGGAL);
            $('#table-derivatif-deposit tbody').empty();
            $.each(data, function (key, val) {
                var html = "<tr>" +
                    "<td>" + val.BANK + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.FORWARD,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.SWAP,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.CSO,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.DNDF,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.DEPOSITO,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-derivatif-deposit tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td>TOTAL</td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "<td align='right'> </td>" +
                "</tr>";
            $('#table-derivatif-deposit tbody').append(total1);

            var data2 = res.OUT_TOTAL;
            $.each(data2, function (key, val) {
                var html = "<tr>" +
                    "<td style='background-color:#67a2d8;color: white'>" + val.CURRENCY + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_FORWARD,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_SWAP,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_CSO,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_DNDF,2,".",",") + "</td>" +
                    "<td align='right' style='background-color:#67a2d8;color: white'>" + accounting.formatNumber(val.TOTAL_DEPOSITO,2,".",",") + "</td>" +
                    "</tr>";
                $('#table-derivatif-deposit tbody').append(html);
            });

            var dataDerivatifMandiri = [];
            $.each(res.OUT_PIE_FORWARD, function (index, value) {
                var dataDMandiri = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                var tes = JSON.stringify(coba);
                console.log("Tes : " + tes)
                dataDerivatifMandiri.push(dataDMandiri)
            });
//
            var dataPieEUR = [];
            $.each(res.OUT_PIE_EUR, function (index, value) {
                var dataPieTemp = {
                    label: value.ID_BANK,
                    value: value.NILAI == 0 ? null : value.NILAI
                };
                dataPieEUR.push(dataPieTemp)
            });

//            console.log("");

            chartDerivatifMandiri(dataDerivatifMandiri);
//            chartDerivatifBRI(dataDBRI);
//            chartDerivatifBNI(dataDBNI);
//            chartDerivatifBukopin(dataDBukopin);
//            chartDepositoMandiri(datadMandiri);
//            chartDepositoBRI(datadBRI);
//            chartDepositoBNI(datadBNI);
//            chartDepositoBukopin(datadBukopin);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data IMPRST VALAS");
            hideLoadingCss();
            $('#table-imprst-valas tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-imprst-valas tbody').append(html);
        }
    });
}

function chartDerivatifMandiri(data){
    let date = new Date();
//    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-mandiri-derivatif",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Mandiri - Derivatif",
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

function chartDerivatifBRI(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "BRI - Derivatif",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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

function chartDerivatifBNI(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "BNI - Derivatif",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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

function chartDerivatifBukopin(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Bukopin - Derivatif",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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

function chartDepositoMandiri(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Mandiri - Deposito",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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

function chartDepositoBRI(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "BRI - Deposito",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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

function chartDepositoBNI(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "BNI - Deposito",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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

function chartDepositoBukopin(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
//var tes = JSON.stringify(coba);
//console.log("Tes : " + tes)
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "stackedcolumn2dline",
            renderAt: "chart-container",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Bukopin - Deposito",
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
                              label : incDate(date, -2)
                          },
                          {
                              label : incDate(date, -1)
                          },
                          {
                              label : datestring
                          },
                          {
                              label : incDate(date, 1)
                          },
                          {
                              label : incDate(date, 2)
                          }
                      ]
                   }
               ],
               dataset : coba
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