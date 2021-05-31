var srcTglAwal = null;
var srcTglAkhir = null;

$(document).ready(function () {
    tableRealisasiPerVendor();
    tableMainDashboard();
    $('#tanggal_awal').datepicker({dateFormat: 'yymmdd'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#tanggal_akhir').datepicker({dateFormat: 'yymmdd'});

    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr('disabled', false);
        $('#tanggal_akhir').datepicker({dateFormat: 'yymmdd', minDate: tglAwalData});
    }
});

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/rincian_saldo",
        dataType: 'JSON',
        type: "GET",
        data: {
            bank: $("#bank_filter").val(),
            cashcode: $("#cashcode_filter").val(),
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
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        tableMainDashboard($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cashcode_filter").val(), $("#bank_filter").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_belum/eq_curr",
        type: "GET",
        data: {
            bank: $("#bank_filter").val(),
            cashcode: $("#cashcode_filter").val()
        },
        success: function (res) {
                console.log(res);
            $("#total_idr").html(new Intl.NumberFormat().format(res.data[0].EQ_CURRENCY));
            $("#total_usd").html(new Intl.NumberFormat().format(res.data[0].EQ_CURRENCY));
            $("#total_eur").html(new Intl.NumberFormat().format(res.data[0].EQ_CURRENCY));
            $("#total_jpy").html(new Intl.NumberFormat().format(res.data[0].EQ_CURRENCY));
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}

function tableMainDashboard(bank, jenisRekening, tipeRekening){

    $('#realisasi-pembayaran-cashcode').dataTable().fnDestroy();

    let rincian_saldo = $("#realisasi-pembayaran-cashcode").DataTable({
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
        "searching" : false,
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
        var html = '<label style="margin-left: 200px; cursor:default">Total IDR : Rp. <b id="total_idr"> 0</b></label>';
        var html2 = '<label style="margin-left: 100px; cursor:default">Total USD : Rp. <b id="total_usd"> 0</b></label>';
        var html3 = '<label style="margin-left: 100px; cursor:default">Total EUR : Rp. <b id="total_eur"> 0</b></label>';
        var html4 = '<label style="margin-left: 100px; cursor:default">Total JPY : Rp. <b id="total_jpy"> 0</b></label>';
        $(this).append(html, html2, html3, html4);
    });
}





