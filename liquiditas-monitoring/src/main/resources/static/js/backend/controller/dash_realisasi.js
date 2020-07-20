$(document).ready(function () {

    tableRealisasiPerVendor();
//    getAllData();
//    search("load");

    setSelectCashCode("cash_code", "FILTER", "", "REKAP");
    setSelectBankSaldo("bank_filter", "FILTER", "", "REKAP");

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

// Update Senin 17/2/2020

function tableRealisasiPerVendor(_date){
    let groupColumn = 0;
    let tb_realisasi_per_vendor = $("#dash_real_per_vendor").DataTable({
        "ajax" : {
            "url" : baseUrl + "api_operator/api_report/get_dashboard_real_vendor",
            "data" : {
                "ptanggal" : "20200208"
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
            {
                "visible" : false,
                "data" : "TANGGAL"},
            {
                "width": "10%",
                "data" : "JENIS_PEMBAYARAN",
                "render" : (data) => {
                    return data;
                },
            },
            {
                "data" : "VENDOR_NAME",
                "render" : (data) => {
                    return data;
                },
            },
            {
                "data" : "HOUSE_BANK",
                "createdCell" : (cell)=>{
                    $(cell).css({
                       "text-align" : "center"
                    })
                 }
            },
            {
                "data" : "CURRENCY",
                "createdCell" : (cell)=>{
                    $(cell).css({
                       "text-align" : "center"
                    })
                }
            },
            {
                "data" : "ORI_CURR",
//                "render" : (data) => {
//                    return '<td>'+ new Intl.NumberFormat().format(data) +'</td>'
//                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
            {
                "data" : "EQ_IDR",
                "render" : (data) => {
                    return '<td> Rp. '+ new Intl.NumberFormat().format(data) +'</td>'
                },
                "createdCell" : (cell)=>{
                    $(cell).css({
                        "text-align" : "right"
                    })
                }
            },
        ],
        "createdRow" : (row, data, dataIndex) => {
            if (data["NOURUT"] === 99){
                $(row).css({
                    "background-color" : "#F4D35E",
                    "color" : "black",
                    "text-align": "center",
                    "font-weight": "bold",
                });
//                $('td', row).eq(0).attr("colspan","3");
                $(row).addClass("stop");
            }
        },
        "drawCallback" : function (settings){
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last = null;
            let array = api.column(groupColumn, {page:'current'} ).data();

            api.column(groupColumn, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    let count = 1;
                    //looping ini digunakan untuk menghitung berapa banyak rowspan yang harus dilakukan
                    for (let j=i; i<array.length; j++){
                        let first = array[i];
                        if (first !== array[j]) break;
                        count += 1;
                    }
                    $(rows).eq( i ).before(
                        '<tr class="group"><td rowspan="'+count+'" style="vertical-align: middle;text-align: center; font-weight: bold">'+group+'</td></tr>'
                    );
                    last = group;
                }
            } );
        }
    });
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/rincian_saldo",
        dataType: 'JSON',
        type: "GET",
        data: {
            bank: $("#bank_filter").val(),
            cashCode: $("#cash_code").val()
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
            cashCode: $("#cash_code").val(),
        },
        success: function (res) {
                console.log(res);
//            $("#total_tagihan").html(new Intl.NumberFormat().format(res.data[0].EQ_CURRENCY));
//            $("#total_percent").html(res.data[0].TOTAL_PERSEN);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}

function tableMainDashboard(bank, cashCode){

    $('#rincian-saldo').dataTable().fnDestroy();

    let rincian_saldo = $("#rincian-saldo").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/rincian_saldo",
            "data" : {
                bank: bank,
                jenisRekening: jenisRekening,
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
            {"data": null,"render": (data, type, row) => {return '<td>'+data.NO+'</td>';}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.VENDOR_NAME+'</td>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.BANK+'</td>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render": (data, type, row) => {return '<td>'+data.CURRENCY+'</td>';},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","center");}},
            {"data": null,"render" : (data, type, row) => {return '<td> Rp.'+ new Intl.NumberFormat().format(data.EQ_CURRENCY)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data": null,"render" : (data, type, row) => {return '<td> '+ new Intl.NumberFormat().format(data.CASHCODE)+' % </td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
    });

//   $('.dataTables_length').each(function () {
//        var html = '<label style="margin-left: 200px; cursor:default">Total eq currency : Rp. <b id="total_tagihan"> 0</b></label>';
//        var html2 = '<label style="margin-left: 30px; cursor:default">Total % : <b id="total_percent">0</b> %</label>';
////        var html3 = '<input style="margin-left: 30px; type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for names.." title="Type in a name"/>';
//        $(this).append(html, html2);
//    });
}





