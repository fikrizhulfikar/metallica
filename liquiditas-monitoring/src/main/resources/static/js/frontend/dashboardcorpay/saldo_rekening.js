$(document).ready(function () {
    initDataTableSaldoRek1();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    setInterval(function () {
        initDataTableSaldoRek1();
    }, 60000);
});

function initDataTableSaldoRek1() {
    showLoadingCss()
     $.ajax({
            url: baseUrl + "api_dashboard/get_saldo_curr",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {
                var data = res.return;
                //console.log("response : "+data);
                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-jenis-mata-uang tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td align='right'>" + "Rp " + accounting.formatNumber(val.SALDO_REAL,2,".",",") + "</td>" +
                        "<td align='right'>" + "Rp " + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-jenis-mata-uang tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_REAL,2,".",",") + "</td>" +
                    "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_EQ_IDR,2,".",",") + "</td>" +
                    "</tr>";

            $('#table-jenis-mata-uang tbody').append(total1);


            var dataPieSaldoCurr = [];
            $.each(res.OUT_PIE_CURR, function (index, value) {
                var dataPieTemp = {
                    label: value.CURRENCY,
                    value: value.PERSENTASE == 0 ? null : value.PERSENTASE
                };
                dataPieSaldoCurr.push(dataPieTemp)
            });

            console.log("");

            creteChartSaldoCurr(dataPieSaldoCurr);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data");
            hideLoadingCss();
            $('#table-jenis-mata-uang tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-jenis-mata-uang tbody').append(html);
        }
    });
     $.ajax({
            url: baseUrl + "api_dashboard/get_saldo_rek",
            dataType: 'JSON',
            type: "GET",
            success: function (res) {
                var data = res.return;
                //console.log("response : "+data);
                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-jenis-rekening tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.JENIS_REKENING + "</td>" +
                        "<td align='right'>" + "Rp " + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                        "<td align='right'>" + "Rp " + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "<td align='right'>" + "Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-jenis-rekening tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_VALAS,2,".",",") + "</td>" +
                    "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IDR,2,".",",") + "</td>" +
                    "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SALDO,2,".",",") + "</td>" +
                    "</tr>";

            $('#table-jenis-rekening tbody').append(total1);


            var dataPieSaldoRek = [];
            $.each(res.OUT_PIE_JENIS, function (index, value) {
                var dataPieTemp = {
                    label: value.JENIS_REKENING,
                    value: value.PERSENTASE == 0 ? null : value.PERSENTASE
                };
                dataPieSaldoRek.push(dataPieTemp)
            });

            console.log("");

            creteChartSaldoRek(dataPieSaldoRek);
            hideLoadingCss()
        },
        error: function () {
            // hideLoadingCss("Gagal Ambil Data");
            hideLoadingCss();
            $('#table-jenis-rekening tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-jenis-rekening tbody').append(html);
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
                          "<td align='right'>" + "Rp " + accounting.formatNumber(val.SALDO,2,".",",") + "</td>" +
                          "</tr>";
                      $('#table-jenis-bank tbody').append(html);
                  });

                  var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                      "<td>TOTAL</td>" +
                      "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SALDO,2,".",",") + "</td>" +
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
                              "<td align='right'>" + "Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                              "</tr>";
                          $('#table-komposisi-saldo tbody').append(html);
                      });

                      var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                          "<td>TOTAL</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL,2,".",",") + "</td>" +
                          "</tr>";

                  $('#table-komposisi-saldo tbody').append(total1);


                  var dataPieKompSaldo = [];
                  $.each(res.OUT_PIE_KOMPOSISI, function (index, value) {
                  console.log('PERSENTASE :'+value.PERSENTASE);
                  console.log('WARNA :'+value.WARNA);
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
              url: baseUrl + "api_dashboard/get_rekening_operasi",
              dataType: 'JSON',
              type: "GET",
              success: function (res) {
                  var data = res.return;
                  //console.log("response : "+data);
                  $("#tglcetak").html(data[0].TANGGAL);
                  $('#table-rekening-operasi tbody').empty();
                  $.each(data, function (key, val) {
                      var html = "<tr>" +
                          "<td>" + val.TIPE + "</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(val.RUPIAH,2,".",",") + "</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                          "</tr>";
                      $('#table-rekening-operasi tbody').append(html);
                  });

                  var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                      "<td>TOTAL EQ IDR</td>" +
                      "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_VALAS,2,".",",") + "</td>" +
                      "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_RUPIAH,2,".",",") + "</td>" +
                      "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_SELURUH,2,".",",") + "</td>" +
                      "</tr>";

              $('#table-rekening-operasi tbody').append(total1);


              var dataPieRekOperasi = [];
              $.each(res.OUT_PIE_OPERASI, function (index, value) {
                  var dataPieTemp = {
                      label: value.TIPE,
                      value: value.PERSENTASE == 0 ? null : value.PERSENTASE
                  };
                  dataPieRekOperasi.push(dataPieTemp)
              });

              console.log("");

              creteChartRekOperasi(dataPieRekOperasi);
              hideLoadingCss()
          },
          error: function () {
              // hideLoadingCss("Gagal Ambil Data");
              hideLoadingCss();
              $('#table-rekening-operasi tbody').empty();
              var html = "<tr>" +
                  "<td colspan='5' align='center'> No Data </td>" +
                  "</tr>";
              $('#table-rekening-operasi tbody').append(html);
          }
        });
     $.ajax({
                  url: baseUrl + "api_dashboard/get_rekening_investasi",
                  dataType: 'JSON',
                  type: "GET",
                  success: function (res) {
                      var data = res.return;
                     // console.log("response : "+data);
                      $("#tglcetak").html(data[0].TANGGAL);
                      $('#table-rekening-investasi tbody').empty();
                      $.each(data, function (key, val) {
                          var html = "<tr>" +
                              "<td>" + val.TIPE + "</td>" +
                              "<td align='right'>" + "Rp " + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                              "<td align='right'>" + "Rp " + accounting.formatNumber(val.RUPIAH,2,".",",") + "</td>" +
                              "<td align='right'>" + "Rp " + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                              "</tr>";
                          $('#table-rekening-investasi tbody').append(html);
                      });

                      var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                          "<td>TOTAL EQ IDR</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_VALAS,2,".",",") + "</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_SELURUH,2,".",",") + "</td>" +
                          "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_SELURUH,2,".",",") + "</td>" +
                          "</tr>";
                  $('#table-rekening-investasi tbody').append(total1);


                  var dataPieRekInvestasi = [];
                  $.each(res.OUT_PIE_INVESTASI, function (index, value) {
                      var dataPieTemp = {
                          label: value.TIPE,
                          value: value.PERSENTASE == 0 ? null : value.PERSENTASE
                      };
                      dataPieRekInvestasi.push(dataPieTemp)
                  });

                  console.log("");

                  creteChartRekInvestasi(dataPieRekInvestasi);
                  hideLoadingCss()
              },
              error: function () {
                  // hideLoadingCss("Gagal Ambil Data");
                  hideLoadingCss();
                  $('#table-rekening-investasi tbody').empty();
                  var html = "<tr>" +
                      "<td colspan='5' align='center'> No Data </td>" +
                      "</tr>";
                  $('#table-rekening-investasi tbody').append(html);
              }
            });
     $.ajax({
          url: baseUrl + "api_dashboard/get_total_deposito",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
              var data = res.return;
             // console.log("response : "+data);
              $("#tglcetak").html(data[0].TANGGAL);
              $('#table-total-deposito tbody').empty();
              $.each(data, function (key, val) {
                  var html = "<tr>" +
                      "<td>" + val.NAMA_BANK + "</td>" +
                      "<td align='right'>" + "$ " + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                      "<td align='right'>" + "Rp " + accounting.formatNumber(val.RUPIAH,2,".",",") + "</td>" +
                      "</tr>";
                  $('#table-total-deposito tbody').append(html);
              });

              var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                  "<td>TOTAL</td>" +
                  "<td align='right'>" + "$ " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_VALAS,2,".",",") + "</td>" +
                  "<td align='right'>" + "Rp " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_RUPIAH,2,".",",") + "</td>" +
                  "</tr>";
          $('#table-total-deposito tbody').append(total1);


          var dataPieTotDeposito = [];
          $.each(res.OUT_PIE_DEPOSITO, function (index, value) {
              var dataPieTemp = {
                  label: value.NAMA_BANK,
                  value: value.PERSENTASE == 0 ? null : value.PERSENTASE
              };
              dataPieTotDeposito.push(dataPieTemp)
          });

          console.log("");

          creteChartTotDeposito(dataPieTotDeposito);
          hideLoadingCss()
      },
      error: function () {
          // hideLoadingCss("Gagal Ambil Data");
          hideLoadingCss();
          $('#table-total-deposito tbody').empty();
          var html = "<tr>" +
              "<td colspan='5' align='center'> No Data </td>" +
              "</tr>";
          $('#table-total-deposito tbody').append(html);
      }
    });
     $.ajax({
              url: baseUrl + "api_dashboard/get_lindung_nilai",
              dataType: 'JSON',
              type: "GET",
              success: function (res) {
                  var data = res.return;
                 // console.log("response : "+data);
                  $("#tglcetak").html(data[0].TANGGAL);
                  $('#table-lindung-nilai tbody').empty();
                  $.each(data, function (key, val) {
                      var str = val.NAMA_BANK;
                      var html = "<tr>" +
                          "<td>" + str + "</td>" +
                          "<td align='right'>" + "$ " + accounting.formatNumber(val.FORWARD, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + "$ " + accounting.formatNumber(val.SWAP, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + "$ " + accounting.formatNumber(val.DNDF, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + "$ " + accounting.formatNumber(val.CALL_SPREAD_OPTION, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + "$ " + accounting.formatNumber(val.TOTAL_SAMPING, 2, ".", ",") + "</td>" +
                          "</tr>";
                          $('#table-lindung-nilai tbody').append(html);
                  });

                  var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                      "<td>TOTAL</td>" +
                      "<td align='right'>" + "$ " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_FORWARD,2,".",",") + "</td>" +
                      "<td align='right'>" + "$ " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SWAP,2,".",",") + "</td>" +
                      "<td align='right'>" + "$ " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_DNDF,2,".",",") + "</td>" +
                      "<td align='right'>" + "$ " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_CALL_SPREAD_OPTION,2,".",",") + "</td>" +
                      "<td align='right'>" + "$ " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SELURUH,2,".",",") + "</td>" +
                      "</tr>";
              $('#table-lindung-nilai tbody').append(total1);


              var dataPieLinNilai= [];
              $.each(res.OUT_PIE_LINDUNG, function (index, value) {
                  var dataPieTemp = {
                      label: value.NAMA_BANK,
                      value: value.PERSENTASE == 0 ? null : value.PERSENTASE
                  };
                  dataPieLinNilai.push(dataPieTemp)
              });

              creteChartLinNilai(dataPieLinNilai);
              hideLoadingCss()
          },
          error: function () {
              // hideLoadingCss("Gagal Ambil Data");
              hideLoadingCss();
              $('#table-lindung-nilai tbody').empty();
              var html = "<tr>" +
                  "<td colspan='5' align='center'> No Data </td>" +
                  "</tr>";
              $('#table-lindung-nilai tbody').append(html);
          }
        });
}

function creteChartSaldoCurr(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-saldo-curr',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Saldo Currency",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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

function creteChartSaldoRek(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-saldo-rekening',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Saldo Rekening",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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

function creteChartSaldoBank(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'pie2d',
                renderAt: 'chart-saldo-bank',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Saldo Bank",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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

function creteChartKompSaldo(data) {
    //console.log('DZ :'+data);
    var tes = JSON.stringify(data);
    var maxval1 = data[1].maxvalue + data[0].maxvalue;
    var maxval2 = data[2].maxvalue + data[1].maxvalue;
    var label1 = (data[0].minvalue + data[0].maxvalue)/2;
    var label2 = (data[0].maxvalue + data[1].maxvalue)/2;
    var label3 = (data[1].maxvalue + data[2].maxvalue)/2;
    var label4 = (data[2].maxvalue + data[3].maxvalue)/2;
    //console.log('DIAZZ GANTENG :'+maxval1);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-komposisi-saldo',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "bgColor": "#77D5D4",
                        "caption": "\n\n\n\nKOMPOSISI SALDO",
                        "numbersuffix": "%",
                        "lowerLimitDisplay": "0%",
                        "upperLimitDisplay": "100%",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "0",
                        "pivotFillColor": "#77D5D4",
                        "pivotFillAlpha": "#77D5D4",
                        "pivotFillMix": "#77D5D4",
                        "valueBelowPivot": "0",
                        pivotFillAlpha:"0",
                        "majorTMNumber": "9",
                        "majorTMHeight": "10",
                        "minorTMHeight": "5",
                        showTickMarks: "1",
                        showTickValues: "1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "gaugeOuterRadius": "160",
                        "gaugeInnerRadius": "90",
                        "theme": "fint"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: '0',
                              maxvalue: data[0].maxvalue,
                              code: data[0].code,
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: data[3].code
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: maxval2,
                              code: data[2].code
                          },
                          {
                              minvalue: maxval2,
                              maxvalue: '100',
                              code: data[1].code
                          }
                       ]
                     }
                }
            }
        );
        fusioncharts.render();
    });
}

function creteChartRekOperasi(data) {
   // console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'column2d',
                renderAt: 'chart-rekening-operasi',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Rekening Operasi",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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

function creteChartRekInvestasi(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'column2d',
                renderAt: 'chart-rekening-investasi',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Rekening Investasi",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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

function creteChartTotDeposito(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'column2d',
                renderAt: 'chart-total-deposito',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Total Deposito",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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

function creteChartLinNilai(data) {
    //console.log(data);
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'column2d',
                renderAt: 'chart-lindung-nilai',
                width: '450',
                height: '400',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Lindung Nilai",
                        "numbersuffix": " %",
                        "exportEnabled": "1",
                        "bgColor": "#77D5D4",
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