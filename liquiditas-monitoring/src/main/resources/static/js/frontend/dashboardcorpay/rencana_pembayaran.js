$(document).ready(function () {
    initDataTableSaldoRek1();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);
//    tableRencanaImpres();
//    tableRencanaImprestValas();

    setInterval(function () {
        initDataTableSaldoRek1();
    }, 60000);
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
                        "<td align='right'> Rp. " + accounting.formatNumber(val.H0,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.H1,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.H2,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.WEEKLY,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(val.MONTHLY,2,".",",") + "</td>" +
                        "</tr>";
                    $('#table-rencana-pembayaran tbody').append(html);
                });

//                    var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
//                        "<td align='center'>SUB TOTAL</td>" +
//                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H0,2,".",",") + "</td>" +
//                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H1,2,".",",") + "</td>" +
//                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H2,2,".",",") + "</td>" +
//                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_WEEKLY,2,".",",") + "</td>" +
//                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MONTHLY,2,".",",") + "</td>" +
//                        "</tr>";
//                    $('#table-rencana-pembayaran tbody').append(total1);

                    var total3 = "<tr style='background-color:#67a2d8;color: white'>" +
                        "<td align='center'>TOTAL</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H0,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H1,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_H2,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_WEEKLY,2,".",",") + "</td>" +
                        "<td align='right'> Rp. " + accounting.formatNumber(res.OUT_TOTAL[0].TOTAL_MONTHLY,2,".",",") + "</td>" +
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
                var data2 = res.OUT_TOTAL_SELURUH;
                $("#tglcetak").html(data[0].TANGGAL);
                $('#table-investasi-operasi tbody').empty();
                $.each(data, function (key, val) {
                    if(accounting.formatNumber(val.IDR) === "0" || accounting.formatNumber(val.USD) === "0" || accounting.formatNumber(val.EUR) === "0" || accounting.formatNumber(val.JPY) === "0" || accounting.formatNumber(val.MYR) === "0" || accounting.formatNumber(val.EQ_IDR) === "0"){
                        var html = "<tr>" +
                            "<td>" + val.TGL_RENCANA_BAYAR + "</td>" +
                            "<td>" + val.JENIS + "</td>" +
                            "<td align='right'> </td>" +
                            "<td align='right'> </td>" +
                            "<td align='right'> </td>" +
                            "<td align='right'> </td>" +
                            "<td align='right'> </td>" +
                            "<td align='right'> </td>" +
                            "</tr>";

                            if(val["JENIS"] === "TOTAL"){
                              var html = "<tr style='background-color:#67a2d8; color: white'>" +
                                 "<td colspan='2' align='center'> SUB " + val.JENIS + "</td>" +
                                 "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
                                 "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
                                 "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
                                 "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
                                 "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
                                 "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
                                 "</tr>";
                             }
                    } else
                        var html = "<tr>" +
                           "<td>" + val.TGL_RENCANA_BAYAR + "</td>" +
                           "<td>" + val.JENIS + "</td>" +
                           "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
                           "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
                           "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
                           "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
                           "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
                           "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
                           "</tr>";

                           if (val["JENIS"] === "DEBT SERVICE"){
                                 var html = "<tr>" +
                                     "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'>" + val.TGL_RENCANA_BAYAR + "</td>" +
                                     "<td>" + val.JENIS + "</td>" +
                                     "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
                                     "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
                                     "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
                                     "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
                                     "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
                                     "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
                                     "</tr>";
                           } else if (val["JENIS"] === "INVESTASI"){
                                 var html = "<tr>" +
                                     "<td align='center' style='border-bottom: 1px solid transparent !important; font-weight: bold'>" + val.TGL_RENCANA_BAYAR + "</td>" +
                                     "<td>" + val.JENIS + "</td>" +
                                     "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
                                     "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
                                     "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
                                     "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
                                     "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
                                     "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
                                     "</tr>";
                           } else if (val["JENIS"] === "OPERASI"){
                                 var html = "<tr>" +
                                    "<td style='border-top: 1px solid transparent !important;color:#d1e1ea;'>" + val.TGL_RENCANA_BAYAR + "</td>" +
                                    "<td>" + val.JENIS + "</td>" +
                                    "<td align='right'> Rp. " + accounting.formatNumber(val.IDR,".",",") + "</td>" +
                                    "<td align='right'> $ " + accounting.formatNumber(val.USD,".",",") + "</td>" +
                                    "<td align='right'> € " + accounting.formatNumber(val.EUR,".",",") + "</td>" +
                                    "<td align='right'> ¥ " + accounting.formatNumber(val.JPY,".",",") + "</td>" +
                                    "<td align='right'> RM " + accounting.formatNumber(val.MYR,".",",") + "</td>" +
                                    "<td align='right'> Rp. " + accounting.formatNumber(val.EQ_IDR,".",",") + "</td>" +
                                    "</tr>";
                           }

                    $('#table-investasi-operasi tbody').append(html)

                });

                $.each(data2, function (key, val) {
                var total = "<tr style='background-color:#67a2d8;color: white'>" +
                    "<td colspan='2' align='center'>TOTAL</td>" +
                    "<td align='right'> Rp. " + accounting.formatNumber(val.TOTAL_SELURUH_IDR,".",",") + "</td>" +
                    "<td align='right'> $ " + accounting.formatNumber(val.TOTAL_SELURUH_USD,".",",") + "</td>" +
                    "<td align='right'> € " + accounting.formatNumber(val.TOTAL_SELURUH_EUR,".",",") + "</td>" +
                    "<td align='right'> ¥ " + accounting.formatNumber(val.TOTAL_SELURUH_JPY,".",",") + "</td>" +
                    "<td align='right'> RM " + accounting.formatNumber(val.TOTAL_SELURUH_MYR,".",",") + "</td>" +
                    "<td align='right'> Rp." + accounting.formatNumber(val.TOTAL_SELURUH_EQ_IDR,".",",") + "</td>" +
                    "</tr>";

                $('#table-investasi-operasi tbody').append(total);
                });
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
          url: baseUrl + "api_dashboard/get_rekening_vs_rencana",
          dataType: 'JSON',
          type: "GET",
          success: function (res) {
            var data = res.return;
            var data2 = res.OUT_SALDO;

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
//             var tes2 = JSON.stringify(data2);
//             console.log('CUKKK :'+tes2)
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
    var label1 = (data[0].minvalue + data[0].maxvalue)/2;
    var label2 = (data[0].maxvalue + data[1].maxvalue)/2;
    var label3 = (data[1].maxvalue + data[2].maxvalue)/2;
    FusionCharts.ready(function () {
        var fusioncharts = new FusionCharts({
                type: 'angulargauge',
                renderAt: 'chart-rencana-pembayaran1',
                width: '400',
                height: '300',
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption" : "Rencana Pembayaran",
                        "subcaption" : "PT. PLN (Persero) Divisi Treasury",
                        "bgColor": "#BBEAEA",
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
                        "majorTMNumber": "9",
                        "minorTMNumber": "4",
                        "majorTMHeight": "10",
                        "minorTMHeight": "5",
                        showTickMarks: "1",
                        showTickValues: "1",
                        "gaugeFillMix": "{dark-10},{light-10},{dark-10}",
                        "gaugeOuterRadius": "150",
                        "gaugeInnerRadius": "90",
                        "theme": "fusion"
                    },
                    "colorrange": {
                         "color": [
                           {
                              minvalue: "0",
                              maxvalue: data[0].maxvalue,
                              code: "#998650"
                           },
                          {
                              minvalue: data[0].maxvalue,
                              maxvalue: maxval1,
                              code: "#7AC74F"
                          },
                          {
                              minvalue: maxval1,
                              maxvalue: "100",
                              code: "#5ADBFF"
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

//var tes = JSON.stringify(data);
//console.log('DZ :' +tes);
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
            crosslinecolor: "#ABD6D6",
            numberScaleValue: "1000, 1000, 1000, 1000",
            numberScaleUnit: "Rb, Jt, M, T"
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

function tableRencanaImpres(_date){
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
    $("#tgl7b").html(incDate(date, 6));
    $("#tgl8b").html(incDate(date, 7));

    let tb_rencana_imprest_valas = $("#dash_rencana_imprest").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/dashboard_rencana_imprest",
            "data" : {
                "ptanggal" : current_full_date,
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D7)+'</td>';
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
                    "background-color" : "#67a2d8",
                    "color" : "white",
                })
            }
        },
        "drawCallback" : function (settings){
            let groupColumn = 0;
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
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;

    var datestring = dateToString(date);
        $("#tgl1a").html(datestring);
        $("#tgl2a").html(incDate(date, 1));
        $("#tgl3a").html(incDate(date, 2));
        $("#tgl4a").html(incDate(date, 3));
        $("#tgl5a").html(incDate(date, 4));
        $("#tgl6a").html(incDate(date, 5));
        $("#tgl7a").html(incDate(date, 6));
        $("#tgl8a").html(incDate(date, 7));

    let tb_rencana_imprest_valas = $("#rencana_imprest_valas").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/dashboard_recana_valas",
            "data" : {
                "ptanggal" : current_full_date,
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D5)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D6)+'</td>';
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
                            return '<td> Rp. '+ new Intl.NumberFormat().format(data.RP_D7)+'</td>';
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
                    "background-color" : "#67a2d8",
                    "color" : "white",
                })
            }
        },
        "drawCallback" : function (settings){
            let groupColumn = 0;
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

