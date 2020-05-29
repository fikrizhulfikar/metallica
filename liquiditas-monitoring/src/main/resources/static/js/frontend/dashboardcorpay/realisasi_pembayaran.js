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

function initDataTableSaldoRek1() {
    showLoadingCss()

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
                        value: value.MONTHLY
                    },
                    {
                        value: value.WEEKLY
                    },
                    {
                        value: value.H2
                    },
                    {
                        value: value.H1
                    },
                    {
                        value: value.HS
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
            crosslinecolor: "#ABD6D6",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
        },
        categories : [
            {
                category : [
                    {
                        label : "Bulan H"
                    },
                    {
                        label : "Minggu H"
                    },
                    {
                        label : "Hari H -2"
                    },
                    {
                        label : "Hari H -1"
                    },
                    {
                        label : "Hari H"
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

function analisaPembayaranBarLine(coba, _date){
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

function tableRealisasiBankCurrency(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+"0"+date.getDate().toString() : current_full_date = _date;

    let tb_dash_real_bank_curr = $("#dash_real_bank_curr").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_curr",
            "data" : {
                "ptanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "searching" : false,
        "retrieve": true,
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
                    return data.PERSEN_NOW;
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
                    return data.PERSEN_WEEK;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "right"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca","text-align" : "rigth"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "right"});
                }
            },
            {"data": "ORI_CURR_MONTH", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {"data" : "EQ_IDR_MONTH", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {
                "data" : null,
                "render": (data) => {
                    return  data.PERSEN_MONTH;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "right"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca","text-align" : "rigth"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "right"});
                }
            },
            {"data": "ORI_CURR_YEAR", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {"data" : "EQ_IDR_YEAR", "render" : (data) => {return new Intl.NumberFormat().format(data)},"createdCell":(cell)=>{$(cell).css("text-align","right")}},
            {
                "data" : null,
                "render": (data) => {
                    return data.PERSEN_YEAR;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {
                    // console.log("row Data : ",rowData);
                    (rowData.NOURUT_CURRENCY === 0) ? $(cell).css({"background-color":"#ffad33","text-align" : "right"}) : (rowData.NOURUT_CURRENCY === 99) ? $(cell).css({"background-color":"#8688ca","text-align" : "rigth"}) : $(cell).css({"background-color":"#f7d39e","text-align" : "right"});
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
                    "text-align" : "right",
                })
            }
        }
    })
}

function tableRealisasiCashCode(_date){
    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+"0"+date.getDate().toString() : current_full_date = _date;

    let tb_realisasi_cashcode = $("#dash_real_cashcode").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_cashcode",
            "data" : {
                "ptanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "retrieve": true,
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
            {"data":"ORI_CURR_NOW","createdCell": (cell, cellData, rowData)=>{
                                                            if (rowData.ID_CASH_CODE === 999) {
                                                                $(cell).css({
                                                                    "text-align" :"right",
                                                                    "color": "#67a2d8"});
                                                            } else $(cell).css({
                                                                    "text-align" : "right"
                                                             });
                                                         }
                                                     },
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
            {"data":"ORI_CURR_WEEK","createdCell": (cell, cellData, rowData)=>{
                                                            if (rowData.ID_CASH_CODE === 999) {
                                                                $(cell).css({
                                                                    "text-align" :"right",
                                                                    "color": "#67a2d8"});
                                                            } else $(cell).css({
                                                                    "text-align" : "right"
                                                             });
                                                         }
                                                     },
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
            {"data":"ORI_CURR_MONTH","createdCell": (cell, cellData, rowData)=>{
                                                            if (rowData.ID_CASH_CODE === 999) {
                                                                $(cell).css({
                                                                    "text-align" :"right",
                                                                    "color": "#67a2d8"});
                                                            } else $(cell).css({
                                                                    "text-align" : "right"
                                                             });
                                                         }
                                                     },
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
            {"data":"ORI_CURR_YEAR","createdCell": (cell, cellData, rowData)=>{
                                                            if (rowData.ID_CASH_CODE === 999) {
                                                                $(cell).css({
                                                                    "text-align" :"right",
                                                                    "color": "#67a2d8"});
                                                            } else $(cell).css({
                                                                    "text-align" : "right"
                                                             });
                                                         }
                                                     },
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

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+"0"+date.getDate().toString() : current_full_date = _date;

    let tb_realisasi_pembayaran_jenis = $("#dash_real_jenis").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_jenis",
            "data" : {
                "ptanggal" : current_full_date,
            },
            "type" : "GET",
            "dataType" : "JSON"
        },
        "sorting": false,
        "retrieve": true,
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
                "createdCell" : (cell, cellData, rowData)=>{
                    if (rowData["JENIS"] === "TOTAL"){
                        $(cell).css({
                            "text-align" :"right",
                            "color": "#67a2d8"});
                    } else $(cell).css({
                            "text-align" : "right"
                     });
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
                        "text-align" : "right",
                    })
                }},
            {
                "data" : "ORI_CURR_WEEK",
                "render" : (data) => {
                    return new Intl.NumberFormat().format(data);
                },
                "createdCell" : (cell, cellData, rowData)=>{
                    if (rowData["JENIS"] === "TOTAL"){
                        $(cell).css({
                            "text-align" :"right",
                            "color": "#67a2d8"});
                    } else $(cell).css({
                            "text-align" : "right"
                     });
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
                "createdCell" : (cell, cellData, rowData)=>{
                    if (rowData["JENIS"] === "TOTAL"){
                        $(cell).css({
                            "text-align" :"right",
                            "color": "#67a2d8"});
                    } else $(cell).css({
                            "text-align" : "right"
                     });
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
                "createdCell" : (cell, cellData, rowData)=>{
                    if (rowData["JENIS"] === "TOTAL"){
                        $(cell).css({
                            "text-align" :"right",
                            "color": "#67a2d8"});
                    } else $(cell).css({
                            "text-align" : "right"
                     });
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
                    "font-weight" : "bold"
                });
            }
        }
    });
}
