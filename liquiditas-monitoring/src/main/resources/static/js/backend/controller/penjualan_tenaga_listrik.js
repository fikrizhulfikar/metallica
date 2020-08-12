$(document).ready(function () {
//    tableMainDashboard();
    tableMainDashboard2();
//    myFunction();
    getAllData();
    search("load");

    setSelectBankSaldo("bank_filter", "FILTER", "", "REKAP");
    setSelectJenisRekening("jenrek_filter", "FILTER", "", "REKAP");
    setSelectTipeRekening("tiperek_filter", "FILTER", "", "REKAP");

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

function tableMainDashboard(bank, jenisRekening, tipeRekening){

    $('#rincian-saldo').dataTable().fnDestroy();

    let rincian_saldo = $("#rincian-saldo").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/rincian_saldo",
            "data" : {
                bank: bank,
                jenisRekening: jenisRekening,
                tipeRekening: tipeRekening
            },
            "type" : "GET",
            "dataType" : "json",
            "dataSrc":
                function (res) {
                    getTotalTagihan();
                    return res.data;
                }
        },
        "sorting": false,
        "searching" : true,
        "paging": true,
        "bInfo" : false,
        "bLengthChange" : true,
        "columns" : [
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NO_REKENING+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<tr><td>'+data.BANK+'</td></tr>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
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
    });

   $('.dataTables_length').each(function () {
        var html = '<label style="margin-left: 200px; cursor:default">Total eq currency : Rp. <b id="total_tagihan"> 0</b></label>';
        var html2 = '<label style="margin-left: 30px; cursor:default">Total % : <b id="total_percent">0</b> %</label>';
//        var html3 = '<input style="margin-left: 30px; type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names.." title="Type in a name"/>';
        $(this).append(html, html2);
    });
}

//var allData;

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/rincian_saldo",
        dataType: 'JSON',
        type: "GET",
        data: {
            bank: $("#bank_filter").val(),
            jenisRekening: $("#jenrek_filter").val(),
            tipeRekening: $("#tiperek_filter").val()
        },
        success: function (res) {
            allData = res;
        },
        error: function (res) {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
        }
    });

}

function search(state) {
    if ($("#bank_filter").val() == "" && $("#jenrek_filter").val() == "" && $("#tiperek_filter").val() == "" && state != "load") {
        alert("Mohon Lengkapi filter yg ingin di cari");
    } else {
        tableMainDashboard($("#bank_filter").val(), $("#jenrek_filter").val(), $("#tiperek_filter").val())
        getAllData()
    }
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_belum/eq_curr",
        type: "GET",
        data: {
            bank: $("#bank_filter").val(),
            jenisRekening: $("#jenrek_filter").val(),
            tipeRekening: $("#tiperek_filter").val()
        },
        success: function (res) {
                console.log(res);
            $("#total_tagihan").html(new Intl.NumberFormat().format(res.data[0].EQ_CURRENCY));
            $("#total_percent").html(res.data[0].TOTAL_PERSEN);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}