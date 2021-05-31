/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var idDeviratif;
var table_derivatif_cso;
var allData;
var tempTableSearch= "";

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

    $("#edit-derivatif-cso")
        .find(".modal-title").html("Form New Data Derivatif CSO");
    $("#edit-derivatif-cso")
        .find("input[type=text], input[type=number], textarea").val("");
    $("#pNationalAmount, #pStrikePrice1, #pStrikePrice2, #pKursSettelment, #pJisdorSettlement, #pJisdorDealDate").mask('000,000,000,000,000.00',{reverse : true});
    setSelectCurr("pCurr", "", "", "DERIVATIF");
    setSelectBank("pBankCounterParty", "", "PEMBAYAR", "", "DERIVATIF");
    // setSelectTenor("pTenor", "", "");
    // setSelectSumberDana("pSumberDana", "");
    // setSelectJenisPembayaran("pPeruntukanDana", "", "");
    // setSelectKeterangan("pKeterangan", "", "", "CALLSPREAD");

    $('#edit-derivatif-cso').modal({backdrop: 'static', keyboard: false});

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

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/derivatif/delete_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdProduct: "3",
                pIdDerivatif: id,
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
            pIdProduct: "3",
            pIdDerivatif: id,
        },
        success: function (res) {
            hideLoadingCss("")
            idDeviratif = id

            $("#pNationalAmount, #pStrikePrice1, #pStrikePrice2, #pKursSettelment, #pJisdorSettlement, #pJisdorDealDate").unmask();

            $("#pDocumentNumber").val(res[0].DOC_NO);
            $("#pTglDeal").val(res[0].TGL_DEAL);
            $("#pTglJatuhTempo").val(res[0].TGL_JATUH_TEMPO);
            $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $("#pTenor").val(res[0].TENOR);
            $("#pNationalAmount").val(parseInt(res[0].NATIONAL_AMOUNT)*100);
            $("#pStrikePrice1").val(parseInt(res[0].STRIKE_PRICE1)*100);
            $("#pStrikePrice2").val(parseInt(res[0].STRIKE_PRICE2)*100);
            $("#pKursSettelment").val(parseInt(res[0].KURS_SETTLEMENT)*100);
            $("#pJisdorSettlement").val(parseInt(res[0].JISDOR_SETTLEMENT)*100);
            $("#pJisdorDealDate").val(parseInt(res[0].JISDOR_DEAL_DATE)*100);
            $("#pRatePremi").val(res[0].RATE_PREMI);
            $("#pKeterangan").val(res[0].KETERANGAN);

            $("#pNationalAmount, #pStrikePrice1, #pStrikePrice2, #pKursSettelment, #pJisdorSettlement, #pJisdorDealDate").mask('000,000,000,000,000.00',{reverse : true});

            setSelectKeterangan("pKeterangan", "", res[0].KETERANGAN, "CALLSPREAD");

            setSelectCurr("pCurr", "", res[0].CURRENCY, "DERIVATIF");
            setSelectBank("pBankCounterParty", "", "PEMBAYAR", res[0].KODE_BANK, "DERIVATIF");
            // setSelectTenor("pTenor", "", res[0].ID_TENOR);
            // setSelectSumberDana("pSumberDana", res[0].ID_SUMBER_DANA);
            // setSelectJenisPembayaran("pPeruntukanDana", "", res[0].ID_PERUNTUKAN_DANA);
            $("#pStatusDeviratif").val(res[0].STATUS_DERIVATIF);

            $("#edit-derivatif-cso").find(".modal-title").html("Form Edit Data Derivatif CSO");

            setTimeout(function () {
                $('#edit-derivatif-cso').modal({backdrop: 'static', keyboard: false});
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
        url: baseUrl + "api_operator/derivatif/ins_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdProduct: "3",
            pIdDeviratif: idDeviratif,
            pDocNo1 : $("#pDocumentNumber").val(),
            pTglDeal: $("#pTglDeal").val(),
            pBank: $("#pBankCounterParty").val(),
            pTglJatuhTempo: $("#pTglJatuhTempo").val(),
            pTenor: $("#pTenor").val(),
            pCurr: $("#pCurr").val(),
            pNationalAmount: $("#pNationalAmount").val().replace(/,/g,""),
            pStrikePrice: $("#pStrikePrice1").val().replace(/,/g,""),
            pStrikePrice2: $("#pStrikePrice2").val().replace(/,/g,""),
            pKursSettlement: $("#pKursSettelment").val().replace(/,/g,""),
            pKeterangan: $("#pKeterangan").val(),
            pRatePremi: $("#pRatePremi").val(),
            pStatusDeviratif: $("#pStatusDeviratif").val(),
            pJisdorSettlement : $("#pJisdorSettlement").val().replace(/,/g,""),
            pKursJisdor1 : $("#pJisdorDealDate").val().replace(/,/g,""),
        },
        success: function (res) {
            hideLoadingCss("");
            // console.log("ins log : ", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                //search("load");
                $('#edit-derivatif-cso').modal('hide');
                table_derivatif_cso.ajax.reload();
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
    if ($("#tanggal_akhir").val() == "" && state != "load"  && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_tenor").val())
        // getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/derivatif/get_all_derivatif",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdProduct: "3",
            pTglAwal :  $("#tanggal_awal").val(),
            pTglAkhir : $("#tanggal_akhir").val(),
            pBank : $("#cmb_bank").val(),
            pCurr : $("#cmb_currecny").val(),
            pTenor : $("#cmb_tenor").val()
        },
        success: function (res) {
            // console.log(res);
            allData = res;
        },
        error: function () {
            // console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function exportXls() {
    var tglAwal = "null";
    if(srcTglAwal != ""){
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if(srcTglAkhir != ""){
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/derivatif/xls/3/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/ALL");
}

function generatePDF() {
    // console.log("all data  : " + allData);
    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BANK COUNTERPARTY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "CURRENCY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL DEAL",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "JAM",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TANGGAL JATUH TEMPO",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TENOR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NOTIONAL AMOUNT (USD)",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "STRIKE PRICE 1",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "STRIKE PRICE 2",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SETTLEMENT RATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BIAYA PREMI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "BUNGA DEPOSITO UNTUK HEDGING",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NET BIAYA PREMI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NET BUY NOTIONAL AMOUNT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SUMBER",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PERUNTUKAN DANA",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "STATUS",
        style: "tableHeader",
        alignment: "center"
    });


    var externalDataRetrievedFromServer = []
    $.each(allData, function (index, v) {
        var helloooow = {
            NO: v.ROW_NUMBER,
            BANK_COUNTERPARTY: v.BANK_CONTERPARTY,
            CURRENCY: v.CURRENCY,
            TANGGAL_DEAL: v.TGL_DEAL,
            TANGGAL_JATUH_TEMPO: v.TGL_JATUH_TEMPO,
            JAM: v.JAM_DEAL,
            TENOR: v.TENOR,
            NOTIONAL_AMOUNT: accounting.formatNumber(v.NATIONAL_AMOUNT,2,".",","),
            STRIKE_PRICE_1: accounting.formatNumber(v.STRIKE_PRICE1,2,".",","),
            STRIKE_PRICE_2: accounting.formatNumber(v.STRIKE_PRICE2,2,".",","),
            SETTLEMENT_RATE: accounting.formatNumber(v.SETTLEMENT_RATE,2,".",","),
            BIAYA_PREMI: accounting.formatNumber(v.BIAYA_PREMI,2,".",","),
            BUNGA_DEPOSITO_UNTUK_HEDGING: accounting.formatNumber(v.BUNGA_DEPOSITE_HEDGING,2,".",","),
            NET_BIAYA_PREMI: accounting.formatNumber(v.NET_BIAYA_PREMI,2,".",","),
            NET_BUY_NATIONAL_AMOUNT: accounting.formatNumber(v.NET_BUY_NATIONAL_AMOUNT,2,".",","),
            SUMBER: v.SUMBER_DANA,
            PERUNTUKAN_DANA: v.PERUNTUKAN_DANA,
            KETERANGAN: v.KETERANGAN,
            STATUS: v.STATUS_DERIVATIF
        }
        externalDataRetrievedFromServer.push(helloooow)
    });

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            // console.log(row);
            dataRow.push(row["NO"]);
            dataRow.push(row["BANK_COUNTERPARTY"]);
            dataRow.push(row["CURRENCY"]);
            dataRow.push(row["TANGGAL_DEAL"]);
            dataRow.push(row["JAM"]);
            dataRow.push(row["TANGGAL_JATUH_TEMPO"]);
            dataRow.push(row["TENOR"]);
            dataRow.push({
                text: row["NOTIONAL_AMOUNT"],
                alignment: "right"
            });
            dataRow.push({
                text: row["STRIKE_PRICE_1"],
                alignment: "right"
            });
            dataRow.push({
                text: row["STRIKE_PRICE_2"],
                alignment: "right"
            });
            dataRow.push({
                text: row["SETTLEMENT_RATE"],
                alignment: "right"
            });
            dataRow.push({
                text: row["BIAYA_PREMI"],
                alignment: "right"
            });
            dataRow.push(row["BUNGA_DEPOSITO_UNTUK_HEDGING"]);
            dataRow.push({
                text: row["NET_BIAYA_PREMI"],
                alignment: "right"
            });
            dataRow.push({
                text: row["NET_BUY_NOTIONAL_AMOUNT"],
                alignment: "right"
            });
            dataRow.push(row["SUMBER"]);
            dataRow.push(row["PERUNTUKAN_DANA"]);
            dataRow.push(row["KETERANGAN"]);
            dataRow.push(row["STATUS"]);
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
            text: "DERIVATIF CALL SPREAD OPTION",
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
                fontSize: 7,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 7,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 5
            },
            tableHeader: {
                bold: true,
                fontSize: 6,
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

function upload_xls(pIdDerivatif){
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


    formData.append('pIdDerivatif', "3");
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
            // console.log("res",res);
            if (res.V_RETURN == 0) {
                alert("sukses");
//                location.reload();
                search("load");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_operator/derivatif/download/3/"+obj["ID_UPLOAD"];
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pTenor) {
    showLoadingCss();
    $('#table-derivatif-cso tbody').empty();
    $('#table-derivatif-cso').dataTable().fnDestroy();
    table_derivatif_cso = $('#table-derivatif-cso').DataTable({
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "300px",
        "scrollX": true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            {width: 130, targets: 2},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 60, targets: 7},
            {width: 80, targets: 8},
            {width: 100, targets: 9},
            {width: 100, targets: 10},
            {width: 100, targets: 11},
            {width: 100, targets: 12},
            {width: 100, targets: 13},
            {width: 150, targets: 14},
            {width: 90, targets: 15},
            {width: 200, targets: 16},
            {className: "datatables_action", "targets": [7, 8, 9, 10, 11, 12, 13, 14]},
            {
                "bSortable": false,
                "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18]
            }
            ,
            {
                "aTargets": [18],
                "mRender": function (data, type, full) {
                   if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                       return "-"
                   }else{
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
                    return accounting.formatNumber(full.NATIONAL_AMOUNT,2,".",",");
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
                "sClass": "datatables_action",
                "mRender": function (data, type, full) {
                    return full.RATE_PREMI;
                }
            },
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.JISDOR_DEAL_DATE,2,".",",");
                }
            },
            {
                "aTargets": [10],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.PREMI_IDR, 2, ".", ",");
                }
            },
            {
                "aTargets": [11],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.STRIKE_PRICE1,2,".",",");
                }
            },
            {
                "aTargets": [12],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.STRIKE_PRICE2,2,".",",");
                }
            },
            {
                "aTargets": [13],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.KURS_SETTLEMENT,2,".",",");
                }
            },
            {
                "aTargets": [14],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.JISDOR_SETTLEMENT,2,".",",");
                }
            },
            {
                "aTargets": [15],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.BEBAN_PENDAPATAN,2,".",",");
                }
            },
            {
                "aTargets": [16],
                "mRender": function (data, type, full) {
                    return accounting.formatNumber(full.NET_BEBAN_PENDAPATAN,2,".",",");
                }
            },
            {
                "aTargets": [17],
                "mRender": function (data, type, full) {
                    return full.STATUS;
                }

            }
        ],
        "ajax": {
            "url": baseUrl + "api_operator/derivatif/get_data",
            "type": "GET",
            "dataType": "json",
            "data": {
                pTglAwal: pTglAwal,
                pTglAkhir: pTglAkhir,
                pBank: pBank,
                pCurrency: pCurrency,
                pTenor: pTenor,
                pStatusDerivatif: "3"
            },
            "dataSrc": function (res) {
                hideLoadingCss("");
                return res.data;
            }
        },
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_derivatif_cso.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        // console.log(value); // <-- the value
        tempTableSearch = value;
    });

}