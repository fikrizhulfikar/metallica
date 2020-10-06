$(document).ready(function () {
    tableMainDashboard();
    dataTable();
    tableRencanaImprestValas();
    tableRencanaImpres();
    tableRealisasiBankCurrency();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function tableMainDashboard(_date){

    let date = new Date();
    let current_month = date.getMonth()+1;
    let current_full_date;
    let current_date = (date.getDate() < 10) ? "0"+ date.getDate().toString() : date.getDate();
    let curr_month = (date.getMonth() < 10) ? "0"+current_month.toString() : current_month;
    (_date === undefined) ? current_full_date = date.getFullYear().toString()+curr_month.toString()+current_date : current_full_date = _date;
//        let current_month = date.getMonth()+1;
//        let current_full_date;
//        (_date === undefined) ? current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+"0"+date.getDate().toString() : current_full_date = _date;
//         let current_full_date = date.getFullYear().toString()+"0"+current_month.toString()+date.getDate().toString();
//        console.log("Current Date : ",current_full_date);
    var datestring = dateToString(date);
        $("#tgl1a").html(datestring);
        $("#tgl2a").html(incDate(date, 1));
        $("#tgl3a").html(incDate(date, 2));
        $("#tgl4a").html(incDate(date, 3));
        $("#tgl5a").html(incDate(date, 4));

        $("#tgl1b").html(incDate(date, -5));
        $("#tgl2b").html(incDate(date, -4));
        $("#tgl3b").html(incDate(date, -3));
        $("#tgl4b").html(incDate(date, -2));
        $("#tgl5b").html(incDate(date, -1));

        for (let i=0; i<5; i++){
            let tgl = date.getDate()+i;
            let tgl2 = date.getDate()-5+i;
            let month = date.getMonth()+1;
//            $("#header-tanggal").append("<th style='vertical-align: middle;text-align: center'>"+tgl+"/"+0+month+"/"+date.getFullYear()+"</th>");
//            $("#header_tanggal_realisasi").append("<th style='vertical-align: middle; text-align: center'>"+tgl2+"/"+0+month+"/"+date.getFullYear()+"</th>");
        }

    let main_rencana = $("#main-rencana").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/api_report/saldo_awal",
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
            {"data": null,"render": (data, type, row) => { if (data.URAIAN === "Bank"){
                                                            return '<td >'+data.URAIAN+'<img src="/static/images/add.svg" height="12.5" width="12.5" onclick="showModal(location.href="http://google.com")"/></td>';
                                                            } else
                                                            return '<td >'+data.URAIAN+'</td>';
                }},
            {"data": "ISANAK","visible":false},
            {
                "data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    } else if (Intl.NumberFormat().format(data.RP_D0) === "0" ){
                        return "";
                    } else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D0)+'</td>';
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {
                    // console.log("EL : ",rowata);
                    $(cell).css("text-align","right");
                    (rowata.URAIAN.trim() === "Jenis Rekening") ? $(cell).css("border-right","0px") : $(cell).css("border-right","1px");

                }},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D1) === "0" ){
                        return "";
                    }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D1)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D2) === "0" ){
                        return "";
                    }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D2)+'</td>'
                },
                "createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D3) === "0" ){
                        return "";
                    }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D3)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,
                "render" : (data, tyoe, row) => {
                    if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                        return "";
                    }else if (Intl.NumberFormat().format(data.RP_D4) === "0" ){
                                                 return "";
                                             }else
                        return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_D4)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
        "createdRow" : function (row, data, dataIndex){
        // console.log("Data Index: ",dataIndex);
        // console.log("Cok1 : ",$(row));
        const regexHead = RegExp("([A-Z])\\..");
        const regexChild1 = RegExp("([A-Z])\\.[(0-9)]");

        if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"])) {
            $(row).css({
                "color": "white",
                "background-color": "#16a085",
                "cursor": "pointer",
            });
            $(row).addClass("grand-parent");
            $(row).addClass("parent");
            $(row).attr("onclick", "showParents(this)");

        }

        if (data["ISANAK"] === 0 && regexChild1.test(data["KODE"])){
            $(row).css({
                "background-color": "#f1c40f",
                "cursor": "pointer",
            });
            $(row).attr("onclick","showChild(this)");
            $(row).addClass("parent");
        };

        if (data["ISANAK"] === 1){
            $(row).addClass("child");
            $(row).hide();
        };

        if (data["URAIAN"] === null) {$(row).remove()};
    },
        "initComplete" : (settings, json) => {
            let parent = $(".grand-parent").nextUntil(".grand-parent");
            parent.hide();
        }
    });

    let main_realisasi = $("#main-realisasi").DataTable({
            "ajax" : {
                "url": baseUrl + "api_operator/api_report/saldo_realisasi",
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
                {"data": null,"render": (data, type, row) => {return '<td>'+data.URAIAN+'</td>'}},
                {"data": "KODE","visible":false},
                {
                    "data":null,"render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (data.URAIAN.trim() === "BANK"){
                            return '<td class="trigger">' + data.URAIAN + '</td>'
                        }else if (Intl.NumberFormat().format(data.RP_DMIN5) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN5)+'</td>'
                    },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {
                    "data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN4) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN4)+'</td>';
                    },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN3) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN3)+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN2) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN2)+'</td>'
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,
                    "render" : (data, tyoe, row) => {
                        if (data.URAIAN.trim() === "Jenis Rekening" || data.URAIAN.trim() === "Mata Uang" || data.URAIAN.trim() === "Bank"  ){
                            return "";
                        }else if (Intl.NumberFormat().format(data.RP_DMIN1) === "0" ){
                                                     return "";
                                                 }else
                            return '<td> Rp '+ new Intl.NumberFormat().format(data.RP_DMIN1)+'</td>';
                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            ],
            "createdRow" : function (row, data, dataIndex){
    //            console.log("Data : ",data["URAIAN"]);
                const regexHead = RegExp("([A-Z])\\..");
                // const regexChild2 = RegExp("([A-Z])\\...")
                const regexChild1 = RegExp("([A-Z])\\.[(0-9)]")

                if (data['ISANAK'] === 0 && !regexChild1.test(data["KODE"])) {
                    $(row).css({
                        "color": "white",
                        "background-color": "#a01629",
                        "cursor": "pointer",
                    });
                    $(row).addClass("grand-parent");
                    $(row).addClass("parent");
                    $(row).attr("onclick", "showParents(this)");

                }

                if(data["URAIAN"] === "Bank"){
                    $(row).attr("onclick", "showModal()");
                }

                if (data["ISANAK"] === 0 && regexChild1.test(data["KODE"])){
                    $(row).css({
                        "background-color": "#f1c40f",
                        "cursor": "pointer",

                    });
                    $(row).attr("onclick","showChild(this)");
                    $(row).addClass("parent");
                };

                if (data["ISANAK"] === 1){
                    $(row).addClass("child");
                    $(row).hide();
                };

                if (data["URAIAN"] === null) {$(row).remove()}
            },
           "initComplete" : (setting, json) => {
               let parent1 = $(".grand-parent").nextUntil(".grand-parent");
               parent1.hide();
           }
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

function showChild(el){
    let child = $(el).nextUntil(".parent");
    (child.is(":visible")) ? child.hide() : child.show()
    // console.log(child);
}

function showParents(el){
    let parent = $(el).nextUntil(".grand-parent");
    (parent.is(":visible")) ? parent.hide() : parent.show();
    $("#main-realisasi, #main-rencana").find(".child").hide();
}

function dataTable(){
$.ajax({
       url: baseUrl + "api_dashboard/get_ana_realisasi_pembayaran",
       dataType: 'JSON',
       type: "GET",
       success: function (res) {
         var data = res.return;
         var data2 = res.OUT_LINE;
// KOLOM
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

        var coba = dataChartAnaRealPembayaran2.concat(dataChartAnaRealPembayaran)
        chartMandiriDerivatif(coba);
        hideLoadingCss()
   }
  });

$.ajax({
       url: baseUrl + "api_dashboard/get_ana_realisasi_pembayaran",
       dataType: 'JSON',
       type: "GET",
       success: function (res) {
         var data = res.return;
         var data2 = res.OUT_LINE;
// KOLOM
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

        var coba = dataChartAnaRealPembayaran2.concat(dataChartAnaRealPembayaran)
        chartMandiriDeposito(coba);
        hideLoadingCss()
   }
  });

}

function chartMandiriDerivatif(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
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
                   caption : "Mandiri - Derivatif",
                   subcaption : "PT. PLN (Persero) Divisi Treasury",
                   showSum : "1",
                   numberprefix : "Rp ",
                   theme : "fusion",
                   numDivLines : "5",
                   divLineColor: "#6699cc",
                   divLineAlpha: "60",
                   divLineDashed: "0",
                   showLegend: "0",
                   numberScaleValue : "1000, 1000, 1000, 1000",
                   numberScaleValue : "Rp, Jt, M, T"
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
           }
//            events:{
//              "rendered": function (eventObj, dataObj) {
//              var mydatasource = chart.getJSONData();
//              console.log(mydatasource)
//                }
//            }
        }).render();
    });
}

function chartMandiriDeposito(coba, _date){
    let date = new Date();
    var datestring = dateToString(date);
    FusionCharts.ready(function () {
        let chart = new FusionCharts({
            type: "mscolumn2d",
            renderAt: "chart-container2",
            id: "chart",
            width: "100%",
            height: "100%",
            dataFormat: "json",
            dataSource: {
               chart : {
                   caption : "Mandiri - Deposito",
                   subcaption : "PT. PLN (Persero) Divisi Treasury",
                   showSum : "1",
                   numberprefix : "Rp ",
                   theme : "fusion",
                   numDivLines : "5",
                   divLineColor: "#6699cc",
                   divLineAlpha: "60",
                   divLineDashed: "0",
                   showLegend: "0",
                   numberScaleValue : "1000, 1000, 1000, 1000",
                   numberScaleValue : "Rp, Jt, M, T"
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
           }
//            events:{
//              "rendered": function (eventObj, dataObj) {
//              var mydatasource = chart.getJSONData();
//              console.log(mydatasource)
//                }
//            }
        }).render();
    });
}



