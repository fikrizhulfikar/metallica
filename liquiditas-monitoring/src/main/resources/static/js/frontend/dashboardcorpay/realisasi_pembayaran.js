$(document).ready(function () {
    initDataTableSaldoRek1();
    tableRealisasiBankCurrency();
    tableRealisasiCashCode();
    tableRealisasiPembayaranJenis();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    setInterval(function () {
        initDataTableSaldoRek1();
        tableRealisasiBankCurrency();
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
//                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-jenis-mata-uang tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.CURRENCY + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.SALDO_REAL,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-jenis-mata-uang tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_REAL,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_EQ_IDR,2,".",",") + "</td>" +
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
//                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-jenis-rekening tbody').empty();
                $.each(data, function (key, val) {
                    var html = "<tr>" +
                        "<td>" + val.JENIS_REKENING + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.EQ_IDR,2,".",",") + "</td>" +
                        "<td align='right'>" + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-jenis-rekening tbody').append(html);
                });

                var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td>TOTAL</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_VALAS,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_IDR,2,".",",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SALDO,2,".",",") + "</td>" +
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
//                  $("#tglcetak").html(data[0].TANGGAL);
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
//              $("#tglcetak").html(data[0].TANGGAL);
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
//                  $("#tglcetak").html(data[0].TANGGAL);
                  $('#table-rekening-operasi tbody').empty();
                  $.each(data, function (key, val) {
                      var html = "<tr>" +
                          "<td>" + val.TIPE + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.RUPIAH,2,".",",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                          "</tr>";
                      $('#table-rekening-operasi tbody').append(html);
                  });

                  var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                      "<td>TOTAL EQ IDR</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_RUPIAH,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_VALAS,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_SELURUH,2,".",",") + "</td>" +
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
//                      $("#tglcetak").html(data[0].TANGGAL);
                      $('#table-rekening-investasi tbody').empty();
                      $.each(data, function (key, val) {
                          var html = "<tr>" +
                              "<td>" + val.TIPE + "</td>" +
                              "<td align='right'>" + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                              "<td align='right'>" + accounting.formatNumber(val.RUPIAH,2,".",",") + "</td>" +
                              "<td align='right'>" + accounting.formatNumber(val.TOTAL,2,".",",") + "</td>" +
                              "</tr>";
                          $('#table-rekening-investasi tbody').append(html);
                      });

                      var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                          "<td>TOTAL EQ IDR</td>" +
                          "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_VALAS,2,".",",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_SELURUH,2,".",",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL_BAWAH[0].TOTAL_SELURUH,2,".",",") + "</td>" +
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
//              $("#tglcetak").html(data[0].TANGGAL);
              $('#table-total-deposito tbody').empty();
              $.each(data, function (key, val) {
                  var html = "<tr>" +
                      "<td>" + val.NAMA_BANK + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(val.VALAS,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(val.RUPIAH,2,".",",") + "</td>" +
                      "</tr>";
                  $('#table-total-deposito tbody').append(html);
              });

              var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                  "<td>TOTAL EQ IDR</td>" +
                  "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_VALAS,2,".",",") + "</td>" +
                  "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_RUPIAH,2,".",",") + "</td>" +
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
//                  $("#tglcetak").html(data[0].TANGGAL);
                  $('#table-lindung-nilai tbody').empty();
                  $.each(data, function (key, val) {
                      var str = val.NAMA_BANK;
                      var html = "<tr>" +
                          "<td>" + str + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.FORWARD, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.SWAP, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.DNDF, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.CALL_SPREAD_OPTION, 2, ".", ",") + "</td>" +
                          "<td align='right'>" + accounting.formatNumber(val.TOTAL_SAMPING, 2, ".", ",") + "</td>" +
                          "</tr>";
                          $('#table-lindung-nilai tbody').append(html);
                  });

                  var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                      "<td>TOTAL EQ IDR</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_FORWARD,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SWAP,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_DNDF,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_CALL_SPREAD_OPTION,2,".",",") + "</td>" +
                      "<td align='right'>" + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_SELURUH,2,".",",") + "</td>" +
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

              console.log("");

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
     $.ajax({
          url: baseUrl + "api_dashboard/get_realisasi_pembayaran2",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_BAR_CASHCODE;
//            var tes = JSON.stringify(res.return);
            var tes2 = JSON.stringify(data2);
//            console.log('CUKKK :'+tes2)
            $("#tglcetak").html(data[0].TANGGAL);

            var dataChartRealPembayaran = [];
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
                dataChartRealPembayaran.push(dataPieTemp)
            });

            realisasiPembayaranBarLine(dataChartRealPembayaran);
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
        url: baseUrl + "api_dashboard/get_ana_realisasi_pembayaran",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
          var data = res.return;
          var data2 = res.OUT_LINE;
//          $("#tglcetak").html(data[0].TANGGAL);
 // KOLOM
 //           var coba = [];
          var dataChartAnaRealPembayaran = [];
          $.each(data, function (index, value) {
              var dataPieTemp = {
                  seriesname : value.CASH_DESCRIPTION,
                  data : [
                      {
                          value: value.H_MIN2
                      },
                      {
                          value: value.H_MIN1
                      },
                      {
                          value: value.H_0
                      },
                      {
                          value: value.H_1
                      },
                      {
                          value: value.H_2
                      }
                  ]
              };
              dataChartAnaRealPembayaran.push(dataPieTemp)
          });
 // LINNNEEEEE
          var dataChartAnaRealPembayaran2 = [];
               $.each(data2, function (index, value) {
                   var dataPieTemp2 = {
                      seriesname : value.KETERANGAN,
                      renderas : "line",
                      data : [
                        {
                            value: value.H_MIN2
                        },
                        {
                            value: value.H_MIN1
                        },
                        {
                            value: value.H_0
                        },
                        {
                            value: value.H_1
                        },
                        {
                            value: value.H_2
                        }
                      ]
                   };
                   dataChartAnaRealPembayaran2.push(dataPieTemp2)
               });
//            var tes = JSON.stringify(dataChartAnaRealPembayaran);
//            console.log("Tes : " + tes)
         var coba = dataChartAnaRealPembayaran2.concat(dataChartAnaRealPembayaran)
         analisaPembayaranBarLine(coba);
         hideLoadingCss()
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
    console.log('DIAZZ :'+tes);
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
                        "lowerLimitDisplay": " ",
                        "upperLimitDisplay": " ",
                        "lowerLimit": "0",
                        "upperLimit": "100",
                        "showValue": "0",
                        "showBorder":"0",
                        "pivotRadius": "10",
                        "pivotFillColor": "#77D5D4",
                        "pivotFillAlpha": "#77D5D4",
                        "pivotFillMix": "#77D5D4",
                        "valueBelowPivot": "0",
                        pivotFillAlpha:"1",
                        showTickMarks:"0",
                        showTickValues:"1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: data[0].minvalue,
                              maxvalue: data[0].maxvalue,
                              code: data[0].code
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: data[1].maxvalue,
                              code: data[1].code
                          },
                          {
                              minvalue: data[1].maxvalue,
                              maxvalue: data[2].maxvalue,
                              code: data[2].code
                          },
                          {
                              minvalue: data[2].maxvalue,
                              maxvalue: data[3].maxvalue,
                              code: data[3].code
                          }
                       ]
                     },
                    "dials": {
                          "dial": [
                          {
                              alpha:"1"
                          }
                      ]
                    }
                    //"data": data
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

//Update Senin 17/2/2020

function realisasiPembayaranBarLine(data){
var tes = JSON.stringify(data);
    const dataSource = {
        chart : {
            caption : "Realisasi Pembayaran",
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
            renderAt: "column-realisasi-pembayaran",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource
        }).render();
    });
}

function analisaPembayaranBarLine(coba){
var tes = JSON.stringify(coba);
console.log("Tes : " + tes)
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
                   caption : "Analisasi Realisasi Pembayaran",
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
                               label : "Hari H-2"
                           },
                           {
                               label : "Hari H-1"
                           },
                           {
                               label : "Hari H"
                           },
                           {
                               label : "Hari H+1"
                           },
                           {
                               label : "Hari H+2"
                           }
                       ]
                   }
               ],
               dataset : coba
           },
            events:{
              "rendered": function (eventObj, dataObj) {
              var mydatasource = chart.getJSONData();
              console.log(mydatasource)
                }
            }
        }).render();
    });
}

function tableRealisasiBankCurrency(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString() : current_full_date = _date;

    let tb_dash_real_bank_curr = $("#dash_real_bank_curr").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_curr",
            "data" : {
                "ptanggal" : "20200212"
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {"data" : "URAIAN"},
            {
                "data": "ORI_CURR_NOW",
                "render" : (data) => {return new Intl.NumberFormat().format(data)},
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "right"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca", "text-align" : "right"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "right"});
                }
            },
            {"data" : "EQ_IDR_NOW", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {
                "data" : null,
                "render": (data) => {
                    return data.PERSEN_NOW + " %";
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "right"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca", "text-align" : "right"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "right"});
                }
            },
            {"data": "ORI_CURR_WEEK", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {"data" : "EQ_IDR_WEEK" , "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {
                "data" : null,
                "render": (data) => {
                    return data.PERSEN_WEEK + " %";
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "rigth"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca","text-align" : "rigth"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "rigth"});
                }
            },
            {"data": "ORI_CURR_MONTH", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {"data" : "EQ_IDR_MONTH", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {
                "data" : null,
                "render": (data) => {
                    return  data.PERSEN_MONTH + " %";
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "rigth"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca","text-align" : "rigth"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "right"});
                }
            },
            {"data": "ORI_CURR_YEAR", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {"data" : "EQ_IDR_YEAR", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {
                "data" : null,
                "render": (data) => {
                    return data.PERSEN_YEAR + " %";
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "rigth"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca","text-align" : "rigth"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "rigth"});
                }
            },
        ],
        "createdRow": (row, data, dataIndex) => {
            if (data["NOURUT_CURRENCY"] === 0){
                $(row).css({
                    "font-weight": "bold",
                    "background-color" : "#67a2d8",
                })
            }

            if (data["NOURUT_CURRENCY"] === 99){
                $(row).css({
                    "font-weight": "bold",
                    "background-color" : "#67a2d8",
                })
            }
        }
    })
}

function tableRealisasiCashCode(){
    let tb_realisasi_cashcode = $("#dash_real_cashcode").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_cashcode",
            "data" : {
                "ptanggal" : "20200213"
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns":[
            {
                "data":"URAIAN",
                "createdCell" : (cell,cellData, rowData) => {
                    if (cellData.startsWith(" ")){$(cell).css("padding-left","40px")}
                }
            },
            {"data":"ORI_CURR_NOW", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"EQ_IDR_NOW", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {
                "data":"PERSEN_NOW",
                "createdCell" : (cell,cellData, rowData) => {
                    if (rowData.ID_CASH_CODE === 999) {
                        $(cell).css({
                            "background-color":"#8688ca",
                            "text-align" : "right"
                        });
                    }else $(cell).css({
                        "background-color":"#f7d39e",
                        "text-align" : "right"
                    });
                }
            },
            {"data":"ORI_CURR_WEEK", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"EQ_IDR_WEEK", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"PERSEN_WEEK", "createdCell" : (cell,cellData, rowData) => {
                    if (rowData.ID_CASH_CODE === 999) {
                        $(cell).css({
                            "background-color":"#8688ca",
                            "text-align" : "right"
                        });
                    }else $(cell).css({
                        "background-color":"#f7d39e",
                        "text-align" : "right"
                    });
                }},
            {"data":"ORI_CURR_MONTH", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"EQ_IDR_MONTH", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"PERSEN_MONTH", "createdCell" : (cell,cellData, rowData) => {
                    if (rowData.ID_CASH_CODE === 999) {
                        $(cell).css({
                            "background-color":"#8688ca",
                            "text-align" : "right"
                        });
                    }else $(cell).css({
                        "background-color":"#f7d39e",
                        "text-align" : "right"
                    });
                }},
            {"data":"ORI_CURR_YEAR", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"EQ_IDR_YEAR", "render" : (data)=>{return Intl.NumberFormat().format(data)},"createdCell": (cell)=>{$(cell).css("text-align","right")}},
            {"data":"PERSEN_YEAR", "createdCell" : (cell,cellData, rowData) => {
                    if (rowData.ID_CASH_CODE === 999) {
                        $(cell).css({
                            "background-color":"#8688ca",
                            "text-align" : "right"
                        });
                    }else $(cell).css({
                        "background-color":"#67a2d8",
                        "text-align" : "right"
                    });
                }},
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["ID_CASH_CODE"] === 999){
                $(row).css({
                    "background-color" : "#67a2d8",
                    "color" : "black",
                    "font-weight" : "bold",
                })
            }
        }
    });
}

function tableRealisasiPembayaranJenis(_date){
    let tb_realisasi_pembayaran_jenis = $("#dash_real_jenis").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_jenis",
            "data" : {
                "ptanggal" : "20200213"
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : false,
        "columns" : [
            {"data" : "URAIAN"},
            {
                "data" : "ORI_CURR_NOW",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR_NOW",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {"data" : "PERSEN_NOW","createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }},
            {
                "data" : "ORI_CURR_WEEK",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR_WEEK",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {"data" : "PERSEN_WEEK","createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }},
            {
                "data" : "ORI_CURR_MONTH",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR_MONTH",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {"data" : "PERSEN_MONTH","createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }},
            {
                "data" : "ORI_CURR_YEAR",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR_YEAR",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "PERSEN_YEAR",
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["JENIS"] === data["URAIAN"]){
                $(row).css({
                   "background-color":"#ffad33",
                    "color" : "white",
                });
            }
            if (data["JENIS"] === "TOTAL"){
                $(row).css({
                    "background-color":"#67a2d8",
                    "color" : "black",
                });
            }
        }
    });
}
