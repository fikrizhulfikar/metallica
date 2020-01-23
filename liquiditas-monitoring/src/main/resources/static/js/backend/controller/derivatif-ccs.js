/**
 * Created by elvandiano on 5/25/18.
 */

var idDeviratif;
var table_derivatif_ccs;
var allData;
var tempTableSearch = "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {

    getAllData();
    $('#pTglNotaDinas').datepicker({dateFormat: 'dd/mm/yy'});
    $('#pTglTagihan').datepicker({dateFormat: 'dd/mm/yy'});
    $('#pTglDeal').datepicker({dateFormat: 'dd/mm/yy'});

    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");

    $('#pPeruntukanDana').select2({
        width: '100%'
    });

    setSelectBank("cmb_bank", "FILTER", "", "", "DERIVATIF");
    setSelectTenor("cmb_tenor", "FILTER", "");
    search("load");
});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
        $('#tanggal_akhir').attr("disabled", "disabled");
    } else {
        $('#tanggal_akhir').val("");
        $('#tanggal_akhir').datepicker("destroy");
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function openFormNew() {

    idDeviratif = "";

    $("#pBankCounterParty").val("");
    $("#pTenor").val("");
    $("#pJatuhTempo").val("");
    $("#pJatuhTempo").datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $('#pStartDate').val("");
    $('#pStartDate').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $("#pEndDate").val("");
    $("#pEndDate").datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $("#pPayDate").val("");
    $("#pPayDate").datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $("#pNationalUsd").val("");
    $("#pLibor").val("");
    $("#pPlnReceivePrincipalUsd").val("");
    $("#pResetDate").val("");
    $("#pResetDate").datepicker({dateFormat: 'dd/mm/yy', minDate: new Date()});
    $("#pDiscountFactorUsd").val("");
    $("#pReceiveIdr").val("");
    $("#pDiscountFactorIdr").val("");
    $("#pSukuBungaIdr").val("");
    $("#pPlnPayPrincipal").val("");

    setSelectBank("pBankCounterParty", "", "PEMBAYAR", "", "DERIVATIF");
    setSelectTenor("pTenor", "", "");

    $('#edit-derivatif-ccs').modal({backdrop: 'static', keyboard: false});
}

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/derivatif/delete_data_ccs",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdCcs: id,
            },
            success: function (res) {
                hideLoadingCss("")
                console.log("delete log : ", res)
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    location.reload();
                } else {
                    alert(res.OUT_MSG);
                }

            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function edit_data(id) {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/derivatif/edit_data_ccs",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdCcs: id,
        },
        success: function (res) {
            hideLoadingCss("");
            idDeviratif = id;
            console.log("data Id", idDeviratif);
            console.log("data edit_data :", res);

            $("#pBankCounterParty").val(),
            $("#pTenor").val(),
            $("#pJatuhTempo").val(res[0].JATUH_TEMPO),
            $("#pJatuhTempo").datepicker({dateFormat: 'dd/mm/yy'}),
            $("#pStartDate").val(res[0].START_DATE),
            $("#pStartDate").datepicker({dateFormat: 'dd/mm/yy'}),
            $("#pEndDate").val(res[0].END_DATE),
            $("#pEndDate").datepicker({dateFormat: 'dd/mm/yy'}),
            $("#pPayDate").val(res[0].PAY_DATE),
            $("#pPayDate").datepicker({dateFormat: 'dd/mm/yy'}),
            $("#pNationalUsd").val(res[0].NOTIONAL_USD),
            $("#pLibor").val(res[0].LIBOR),
            $("#pPlnReceivePrincipalUsd").val(res[0].RECEIVE_PRINCIPAL),
            $("#pResetDate").val(res[0].RESET_DATE),
            $("#pDiscountFactorUsd").val(res[0].DISCOUNT_FACTOR_USD),
            $("#pSukuBungaIdr").val(res[0].SUKU_BUNGA_IDR),
            $("#pPlnPayPrincipal").val(res[0].PAY_PRINCIPAL),
            $("#pDiscountFactorIdr").val(res[0].DISCOUNT_FACTOR_IDR),

            setSelectBank("pBankCounterParty", "", "PEMBAYAR", res[0].ID_BANK_CONTERPARTY, "DERIVATIF");
            setSelectTenor("pTenor","",res[0].ID_TENOR);

            setTimeout(function () {
                $('#edit-derivatif-ccs').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function ins_data() {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "/api_operator/derivatif/ins_derivatif_ccs",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdCcs: idDeviratif,
            pBank: $("#pBankCounterParty").val(),
            pTenor: $("#pTenor").val(),
            pJatuhTempo: $("#pJatuhTempo").val(),
            pStartDate: $("#pStartDate").val(),
            pEndDate: $("#pEndDate").val(),
            pPayDate: $("#pPayDate").val(),
            pNotionalUsd: $("#pNationalUsd").val(),
            pLibor: $("#pLibor").val(),
            pReceiveUsd: $("#pPlnReceivePrincipalUsd").val(),
            pResetDate: $("#pResetDate").val(),
            pDiscountUsd: $("#pDiscountFactorUsd").val(),
            pSukuBungaIdr: $("#pSukuBungaIdr").val(),
            pPrincipal: $("#pPlnPayPrincipal").val(),
            pDiscountIdr: $("#pDiscountFactorIdr").val(),
        },
        success: function (res) {
            hideLoadingCss("");
            console.log("ins log : ", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                search("load");
                $('#edit-derivatif-ccs').modal('hide');
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_tenor").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/derivatif/get_all_derivatif_ccs",
        dataType: 'JSON',
        type: "GET",
        data: {
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pTenor: $("#cmb_tenor").val()
        },
        success: function (res) {
            allData = res;
            console.log("res get_all_derivatif_ccs ", allData);
        },
        error: function () {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/derivatif/xls-ccs/" + tglAwal.replace(/\//g, "-") + "/" + tglAkhir.replace(/\//g, "-") + "/" + $("#cmb_bank").val() + "/" + $("#cmb_tenor").val());
}

function generatePDF() {
    console.log("all data for pdf  : ", allData);
    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK CONTERPARTY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TENOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "JATUH TEMPO",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "START DATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "END DATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PAY DATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "JUMLAH HARI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NATIONAL (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "LIBOR 6M",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SUKU BUNGA USD (LIBOR 6M+2%)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PLN RECEIVE PRINCIPAL (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PLN RECEIVE COUPON (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TOTAL PENERIMAAN PLN (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "RESET DATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "DISCOUNT FACTOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PV (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NATIONAL (IDR)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SUKU BUNGA IDR (LIBOR 6M+2%)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PLN PAY PRINCIPAL (IDR)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PLN PAY COUPON (IDR)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TOTAL PEMBAYARAN PLN (IDR)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "DISCOUNT FACTOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PV (IDR)",
        style: "tableHeader",
        alignment: "center"
    });

    var externalDataRetrievedFromServer = []

    $.each(allData, function (index, v) {
        console.log("v", v);
        var helloooow = {
            NO: v.ROW_NUMBER,
            BANK_COUNTERPARTY: v.BANK_CONTERPARTY,
            TENOR: v.TENOR,
            JATUH_TEMPO: v.JATUH_TEMPO,
            START_DATE: v.START_DATE,
            END_DATE: v.END_DATE,
            PAY_DATE: v.PAY_DATE,
            JUMLAH_HARI: v.JUMLAH_HARI,
            NATIONAL_USD: v.NOTIONAL_USD,
            LIBOR_6M: v.LIBOR,
            SUKU_BUNGA_USD_LIBOR_6M2: v.SUKU_BUNGA,
            PLN_RECEIVE_PRINCIPAL_USD: v.RECEIVE_PRINCIPAL,
            PLN_RECEIVE_COUPON_USD: v.RECEIVE_COUPON,
            TOTAL_PENERIMAAN_PLN_USD: v.TOTAL_PENERIMAAN,
            RESET_DATE: v.RESET_DATE,
            DISCOUNT_FACTOR_USD: v.DISCOUNT_FACTOR_USD,
            PV_USD: v.PV_USD,
            NATIONAL_IDR: v.NOTIONAL_IDR,
            SUKU_BUNGA_IDR_LIBOR6M: v.SUKU_BUNGA_IDR,
            PLN_PAY_PRINCIPAL_IDR: v.PAY_PRINCIPAL,
            PLN_PAY_COUPON_IDR: v.PAY_COUPON,
            TOTAL_PEMBAYARAN_PLN_IDR: v.TOTAL_PEMBAYARAN,
            DISCOUNT_FACTOR_IDR: v.DISCOUNT_FACTOR_IDR,
            PV_IDR: v.PV_IDR,

            //         // NOTIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT,2,".",","),
            //         // LEG_1_FIXING_RATE: accounting.formatNumber(v.FIXING_RATE,2,".",","),
            //         // LEG_1_NATIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT1,2,".",","),
            //         // LEG_2_SWAP_POINT: accounting.formatNumber(v.SWAP_POINT,2,".",","),
            //         // LEG_2_SWAP_RATE: accounting.formatNumber(v.SWAP_RATE,2,".",","),
            //         // LEG_2_NATIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT2,2,".",","),
            //         // BIAYA_SWAP: accounting.formatNumber(v.BIAYA_SWAP,2,".",","),
            //         // BUNGA_DEPOSITO_UNTUK_HEDGING: accounting.formatNumber(v.BUNGA_DEPOSITE_HEDGING,2,".",","),
            //         // NET_BIAYA_SWAP: accounting.formatNumber(v.NET_BIAYA_SWAP,2,".",","),
            //         // SUMBER: v.SUMBER_DANA,
            //         // PERUNTUKAN_DANA: v.PERUNTUKAN_DANA,
            //         // STATUS: v.STATUS_DERIVATIF
        }
        externalDataRetrievedFromServer.push(helloooow)
    });
    console.log("hasil push hellow", externalDataRetrievedFromServer)

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            console.log(row);
            dataRow.push(row["NO"]);
            dataRow.push(row["BANK_COUNTERPARTY"]);
            dataRow.push(row["TENOR"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push(row["START_DATE"]);
            dataRow.push(row["END_DATE"]);
            dataRow.push(row["PAY_DATE"]);
            dataRow.push(row["JUMLAH_HARI"]);
            dataRow.push(row["NATIONAL_USD"]);
            dataRow.push(row["LIBOR_6M"]);
            dataRow.push(row["SUKU_BUNGA_USD_LIBOR_6M2"]);
            dataRow.push(row["PLN_RECEIVE_PRINCIPAL_USD"]);
            dataRow.push(row["PLN_RECEIVE_COUPON_USD"]);
            dataRow.push(row["TOTAL_PENERIMAAN_PLN_USD"]);
            dataRow.push(row["RESET_DATE"]);
            dataRow.push(row["DISCOUNT_FACTOR_USD"]);
            dataRow.push(row["PV_USD"]);
            dataRow.push(row["NATIONAL_IDR"]);
            dataRow.push(row["SUKU_BUNGA_IDR_LIBOR6M"]);
            dataRow.push(row["PLN_PAY_PRINCIPAL_IDR"]);
            dataRow.push(row["PLN_PAY_COUPON_IDR"]);
            dataRow.push(row["TOTAL_PEMBAYARAN_PLN_IDR"]);
            dataRow.push(row["DISCOUNT_FACTOR_IDR"]);
            dataRow.push(row["PV_IDR"]);
            //         // dataRow.push(row["TENOR"]);
            //         // dataRow.push({text:row["NOTIONAL_AMOUNT"],alignment: "right"});
            //         // dataRow.push({text:row["LEG_1_FIXING_RATE"],alignment: "right"});
            //         // dataRow.push({text:row["LEG_1_NATIONAL_AMOUNT"],alignment: "right"});
            //         // dataRow.push({text:row["LEG_2_SWAP_POINT"],alignment: "right"});
            //         // dataRow.push({text:row["LEG_2_SWAP_RATE"],alignment: "right"});
            //         // dataRow.push({text:row["LEG_2_NATIONAL_AMOUNT"],alignment: "right"});
            //         // dataRow.push({text:row["BIAYA_SWAP"],alignment: "right"});
            //         // dataRow.push({text:row["BUNGA_DEPOSITO_UNTUK_HEDGING"],alignment: "right"});
            //         // dataRow.push({text:row["NET_BIAYA_SWAP"],alignment: "right"});
            //         // dataRow.push(row["SUMBER"]);
            //         // dataRow.push(row["PERUNTUKAN_DANA"]);
            //         // dataRow.push(row["STATUS"]);
            body.push(dataRow);
        });

        return body;
    }

    function table(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBody(data, columns)
            }
        };
    }

    var docDefinition = {
        pageOrientation: "landscape",
        content: [{
            text: "DERIVATIF CCS",
            style: "header",
            alignment: "center"
        }, {
            text: "Tanggal Cetak : " + getDataNow(),
            style: "subheader"
        },
            table(externalDataRetrievedFromServer, column)
        ],
        styles: {
            header: {
                fontSize: 6,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 6,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 4
            },
            tableHeader: {
                bold: true,
                fontSize: 5,
                color: "black"
            }
        },
        defaultStyle: {
            alignment: "left",
            margin: [0, 0, 0, 0]
        }
    };
    pdfMake.createPdf(docDefinition).open();
}

function upload_xls(pIdDerivatif) {
    $("#modal-upload-xls").modal("show");

    //getFilesRekap(pIdValas);
}

function upload_server_xls() {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    fileSize = $('input[type=file]#file-xls')[0].files[0].size / 1000;
    $("#file-xls").val('');


    formData.append('pIdDerivatif', "5");
    console.log(formData);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/derivatif/upload_xls",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            if (res.V_RETURN == 0) {
                alert("sukses");
//                location.reload();
                search("load");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_operator/derivatif/download/5/" + obj["ID_UPLOAD"];
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pTenor) {
    showLoadingCss();
    $('#table-derivatif-ccs tbody').empty();
    $('#table-derivatif-ccs').dataTable().fnDestroy();
    table_derivatif_ccs = $('#table-derivatif-ccs').DataTable({
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "300px",
        "scrollX": true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            {width: 110, targets: 1},
            {width: 90, targets: 2},
            {width: 90, targets: 3},
            {width: 90, targets: 4},
            {width: 90, targets: 5},
            {width: 90, targets: 6},
            {width: 90, targets: 7},
            {width: 100, targets: 8},
            {width: 100, targets: 9},
            {width: 140, targets: 10},
            {width: 130, targets: 11},
            {width: 130, targets: 12},
            {width: 130, targets: 13},
            {width: 100, targets: 14},
            {width: 100, targets: 15},
            {width: 130, targets: 17},
            {width: 130, targets: 18},
            {width: 120, targets: 19},
            {width: 140, targets: 20},
            {width: 140, targets: 21},
            {width: 120, targets: 22},
            {width: 130, targets: 23},
            {className: "datatables_action", "targets": [8, 9, 10, 12, 13, 14, 17, 18, 19, 20, 21, 22, 24]},
            {
                "bSortable": true,
                "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            }
            ,
            {
                "aTargets": [24],
                "mRender": function (data, type, full) {
                    if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS") {
                        return "-"
                    } else {
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_CCS + '\')"><i class="fa fa-pencil"></i></button>' +
                            '<button style="width: 15px !important;" class="btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_CCS + '\')"><i class="fa fa-remove"></i></button>' +
                            '</div>'
                        return ret_value;
                    }
                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.NOTIONAL_USD, 2, ".", ",")

                }

            }
            // {
            //     "aTargets": [8],
            //     "sClass": "datatables_action",
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.STRIKE_PRICE1,2,".",",")
            //
            //     }
            //
            // },
            // {
            //     "aTargets": [9],
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.STRIKE_PRICE2,2,".",",")
            //
            //     }
            //
            // },
            // {
            //     "aTargets": [10],
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.SETTLEMENT_RATE,2,".",",")
            //
            //     }
            //
            // },
            // {
            //     "aTargets": [11],
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.BIAYA_PREMI,2,".",",")
            //
            //     }
            //
            // },
            // {
            //     "aTargets": [12],
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.BUNGA_DEPOSITE_HEDGING,2,".",",")
            //
            //     }
            //
            // },
            // {
            //     "aTargets": [13],
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.NET_BIAYA_PREMI,2,".",",")
            //
            //     }
            //
            // },
            // {
            //     "aTargets": [14],
            //     "mRender": function (data, type, full) {
            //
            //         return accounting.formatNumber(full.NET_BUY_NATIONAL_AMOUNT,2,".",",")
            //
            //     }
            //
            // }
        ],
        "ajax": {

            "url": baseUrl + "api_operator/derivatif/get_derivatif_ccs_pss",
            "type": "GET",
            "dataType": "JSON",
            "data": {
                pTglAwal: pTglAwal,
                pTglAkhir: pTglAkhir,
                pBank: pBank,
                pTenor: pTenor,
            },
            "dataSrc": function (res) {
                hideLoadingCss("")
                console.log("get log dataSrc : ", res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "BANK_CONTERPARTY", "defaultContent": ""},
            {"data": "TENOR", "defaultContent": ""},
            {"data": "JATUH_TEMPO", "defaultContent": ""},
            {"data": "START_DATE", "defaultContent": ""},
            {"data": "END_DATE", "defaultContent": ""},
            {"data": "PAY_DATE", "defaultContent": ""},
            {"data": "JUMLAH_HARI", "defaultContent": ""},
            {"data": "NOTIONAL_USD", "defaultContent": ""},
            {"data": "LIBOR", "defaultContent": ""},
            {"data": "SUKU_BUNGA", "defaultContent": ""},
            {"data": "RECEIVE_PRINCIPAL", "defaultContent": ""},
            {"data": "RECEIVE_COUPON", "defaultContent": ""},
            {"data": "TOTAL_PENERIMAAN", "defaultContent": ""},
            {"data": "RESET_DATE", "defaultContent": ""},
            {"data": "DISCOUNT_FACTOR_USD", "defaultContent": ""},
            {"data": "PV_USD", "defaultContent": ""},
            {"data": "NOTIONAL_IDR", "defaultContent": ""},
            {"data": "SUKU_BUNGA_IDR", "defaultContent": ""},
            {"data": "PAY_PRINCIPAL", "defaultContent": ""},
            {"data": "PAY_COUPON", "defaultContent": ""},
            {"data": "TOTAL_PEMBAYARAN", "defaultContent": ""},
            {"data": "DISCOUNT_FACTOR_IDR", "defaultContent": ""},
            {"data": "PV_IDR", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_derivatif_ccs.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        console.log("VALUE SEARCH", value); // <-- the value
        tempTableSearch = value;
    });
    console.log("tblDCcs", table_derivatif_ccs)

}