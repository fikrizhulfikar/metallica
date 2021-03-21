/**
 * Created by elvandiano on 5/25/18.
 */

var idDeviratif;
var table_derivatif_dndf;
var allData;
var tempTableSearch = "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#pTglDeal').datepicker({dateFormat: 'dd/mm/yy', minDate : "0"});

    setSelectBank("cmb_bank", "FILTER", "", "", "DERIVATIF");
    setSelectCurr("cmb_currecny", "FILTER", "", "DERIVATIF");
    // setSelectTenor("cmb_tenor", "FILTER", "");
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

    $('#edit-derivatif-dndf').find(".modal-title").html("Form New Data Derivatif DNDF");

    $("#form-derivatif-dndf").find("input[type=text], input[type=number], textarea").val("");

    setSelectBank("pBankCounterParty", "", "PEMBAYAR", "", "DERIVATIF");
    setSelectCurr("pCurr", "", "", "DERIVATIF");
    $("#pNationalAmount, #pSpotRate, #pForwardPoint, #pJisdor").mask('000,000,000,000,000.00',{reverse : true});

    $('#edit-derivatif-dndf').modal({backdrop: 'static', keyboard: false});
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
                // console.log("delete log : ", res)
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
        url: baseUrl + "api_operator/derivatif/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdProduct: "4",
            pIdDerivatif: id,
        },
        success: function (res) {
            hideLoadingCss("");
            idDeviratif = id;
            $('#edit-derivatif-dndf').find(".modal-title").html("Form Edit Data Derivatif DNDF");
            $("#pNationalAmount, #pSpotRate, #pForwardPoint, #pJisdor").unmask();

            $("#pDocumentNumber").val(res[0].DOC_NO);
            $("#pTglDeal").val(res[0].TGL_DEAL);
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $("#pTenor").val(res[0].TENOR);
            $("#pNationalAmount").val(parseFloat(res[0].NATIONAL_AMOUNT)*100);
            $("#pSpotRate").val(parseFloat(res[0].SPOT_RATE)*100);
            $("#pForwardPoint").val(parseFloat(res[0].FORWARD_POINT)*100);
            $("#pJisdor").val(parseFloat(res[0].JISDOR)*100);
            $("#pKeterangan").val(res[0].KETERANGAN);

            setSelectBank("pBankCounterParty", "", "PEMBAYAR", res[0].KODE_BANK, "DERIVATIF");
            setSelectCurr("pCurr", "", res[0].CURRENCY, "DERIVATIF");

            $("#pNationalAmount, #pSpotRate, #pForwardPoint, #pJisdor").mask('000,000,000,000,000.00',{reverse : true});

            setTimeout(function () {
                $('#edit-derivatif-dndf').modal({backdrop: 'static', keyboard: false});
            }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

$("#pTglDeal").change(function() {
    var tglDeal = $('#pTglDeal').val();
    if(tglDeal === ""){
        $('#pTglJatuhTempo').val("");
        $('#pTglJatuhTempo').attr("disabled", "disabled");
    }else{
        $('#pTglJatuhTempo').val("");
        $('#pTglJatuhTempo').datepicker( "destroy" );
        $('#pTglJatuhTempo').attr("disabled", false);
        $("#pTglJatuhTempo").datepicker({
            minDate: tglDeal,
            maxDate: '+1Y+6M',
            dateFormat : 'dd/mm/yy',
            onSelect: function (dateStr) {
                var max = $(this).datepicker('getDate'); // Get selected date
                $('#datepicker').datepicker('option', 'maxDate', max || '+1Y+6M'); // Set other max, default to +18 months
                var start = $("#pTglDeal").datepicker("getDate");
                var end = $("#pTglJatuhTempo").datepicker("getDate");
                var days = (end - start) / (1000 * 60 * 60 * 24);
                $("#pTenor").val(days);
            }
        });
    }
});

function ins_data() {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "/api_operator/derivatif/ins_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdProduct: "4",
            pIdDeviratif: idDeviratif,
            pDocNo1 : $("#pDocumentNumber").val(),
            pTglDeal: $("#pTglDeal").val(),
            pBank: $("#pBankCounterParty").val(),
            pTglJatuhTempo: $("#pTglJatuhTempo").val(),
            pTenor: $("#pTenor").val(),
            pCurr: $("#pCurr").val(),
            pNationalAmount: $("#pNationalAmount").val().replace(/,/g,""),
            pSpotRate: $("#pSpotRate").val().replace(/,/g,""),
            pForwardPoint: $("#pForwardPoint").val().replace(/,/g,""),
            pKursJisdor1 : $("#pJisdor").val().replace(/,/g,""),
            pKeterangan: $("#pKeterangan").val(),
        },
        success: function (res) {
            hideLoadingCss("");
            // console.log("ins log : ", res);
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
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(),$("#cmb_currecny").val(), $("#cmb_tenor").val());
        //getAllData()
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
            // console.log("res get_all_derivatif_ccs ", allData);
        },
        error: function () {
            // console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
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
    window.open(baseUrl + "api_operator/derivatif/xls/4/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/ALL");
}

function generatePDF() {
    // console.log("all data for pdf  : ", allData);
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
        // console.log("v", v);
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
        };
        externalDataRetrievedFromServer.push(helloooow)
    });
    // console.log("hasil push hellow", externalDataRetrievedFromServer)

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            // console.log(row);
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
    // console.log(formData);
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

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pTenor) {
    //showLoadingCss();
    $('#table-derivatif-dndf tbody').empty();
    $('#table-derivatif-dndf').dataTable().fnDestroy();
    table_derivatif_dndf = $('#table-derivatif-dndf').DataTable({
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
            {width: 50, targets: 16},
            {className: "datatables_action", "targets": [8, 9, 10, 12, 13, 14, 15, 16]},
            {
                "bSortable": false,
                "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            }
            ,
            {
                "aTargets": [16],
                "mRender": function (data, type, full) {
                    if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS") {
                        return "-"
                    } else {
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_DERIVATIF + '\')"><i class="fas fa-edit"></i></button>' +
                            '<button style="width: 15px !important;" class="btn btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_DERIVATIF + '\')"><i class="fas fa-trash"></i></button>' +
                            '</div>';
                        return ret_value;
                    }
                }

            },
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {

                    return full.ROW_NUMBER;

                }

            },
            {
                "aTargets": [1],
                "sClass": "datatables_action",
                "mRender": function (data, type, full) {

                    return full.DOC_NO;

                }

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {

                    return full.BANK;

                }

            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {

                    return full.CURRENCY;

                }

            },
            {
                "aTargets": [4],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.NATIONAL_AMOUNT,2,".",",")

                }

            },
            {
                "aTargets": [5],
                "mRender": function (data, type, full) {

                    return full.TGL_DEAL;

                }

            },
            {
                "aTargets": [6],
                "mRender": function (data, type, full) {

                    return full.TGL_JATUH_TEMPO;

                }

            },
            {
                "aTargets": [7],
                "mRender": function (data, type, full) {

                    return full.TENOR;

                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.SPOT_RATE,2,".",",")

                }

            },
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.FORWARD_POINT,2,".",",")

                }

            },
            {
                "aTargets": [10],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.FORWARD_RATE,2,".",",")

                }

            },
            {
                "aTargets": [11],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.JISDOR,2,".",",")

                }

            },
            {
                "aTargets": [12],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.BEBAN_PENDAPATAN,2,".",",")

                }

            },
            {
                "aTargets": [13],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.BEBAN_FORWARD_POINT,2,".",",")

                }

            },
            {
                "aTargets": [14],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.NET_BEBAN_PENDAPATAN,2,".",",")

                }
            },
            {
                "aTargets": [15],
                "mRender": function (data, type, full) {

                    return full.KETERANGAN;

                }
            }
        ],
        "ajax": {
            "url": baseUrl + "api_operator/derivatif/get_data",
            "type": "GET",
            "dataType": "JSON",
            "data": {
                pTglAwal: pTglAwal,
                pTglAkhir: pTglAkhir,
                pBank: pBank,
                pCurrency: pCurrency,
                pTenor: pTenor,
                pStatusDerivatif: "4"
            },
            "dataSrc": function (res) {
                hideLoadingCss("")
                return res.data;
            }
        },
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_derivatif_dndf.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        // console.log("VALUE SEARCH", value); // <-- the value
        tempTableSearch = value;
    });
    // console.log("tblDCcs", table_derivatif_ccs)

}