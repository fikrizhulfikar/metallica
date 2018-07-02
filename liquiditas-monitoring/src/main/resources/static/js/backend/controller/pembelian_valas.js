/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var idPembelianValas;
var allData;
var table_pembelian_valas;
var tempTableSearch= "";

var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    getAllData();

    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy',changeYear: true});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $("#pTglPosting").datepicker({dateFormat: 'dd/mm/yy',changeYear: true});

    setSelectBank("cmb_bank", "FILTER", "", "", "VALAS");
    setSelectCurr("cmb_currecny", "FILTER", "", "VALAS");
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
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData,changeYear: true});
    }
});


function openFormNew() {

    idPembelianValas = "";

    $("#pTglPosting").val("");
    $("#pPembelian").val("");
    $("#pKonversiIdr").val("");
    $("#pNo").val("");
    $("#pPayReq").val("");
    $("#pDokNo1").val("");
    $("#pDokNo2").val("");

    setSelectBank("pBankPengirim", "", "PENGIRIM", "", "VALAS");
    setSelectBank("pBankPenerima", "", "PENERIMA", "", "VALAS");
    setSelectCurr("pCurrecny", "", "", "VALAS");
    setSelectKursJidor("pKurs", "");
    $('#edit-pembelian-valas-modal').modal({backdrop: 'static', keyboard: false});

}

function delete_data(id) {
    var stateCrf = confirm("Anda Yakin Akan Menghapus Data Ini ?");
    if (stateCrf == true) {
        showLoadingCss()
        $.ajax({
            url: baseUrl + "api_operator/pembelian_valas/delete_data",
            dataType: 'JSON',
            type: "POST",
            data: {
                pIdPembelianValas: id
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
        url: baseUrl + "api_operator/pembelian_valas/edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdPembelianValas: id
        },
        success: function (res) {
            hideLoadingCss("");
            console.log("data edit_data :", res);
            idPembelianValas = id;

            $("#pTglPosting").val(res[0].TGL_POSTING);
            $("#pPembelian").val(res[0].PEMBELIAN);
            $("#pKonversiIdr").val(res[0].KONVERSI_IDR);
            $("#pNo").val(res[0].NO);
            $("#pPayReq").val(res[0].PAY);
            $("#pDokNo1").val(res[0].DOC1);
            $("#pDokNo2").val(res[0].DOC2);
            $("#pKurs").val(res[0].KURS);

            setSelectBank("pBankPengirim", "", "PENGIRIM", res[0].BANK_PENGIRIM, "VALAS");
            setSelectBank("pBankPenerima", "", "PENERIMA", res[0].BANK_PENERIMA, "VALAS");
            setSelectCurr("pCurrecny", "", res[0].CURRENCY, "VALAS");
            setTimeout(function () {
                $('#edit-pembelian-valas-modal').modal({backdrop: 'static', keyboard: false});
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
        url: baseUrl + "api_operator/pembelian_valas/ins_data",
        dataType: 'JSON',
        type: "POST",
        data: {
            PidBeliValas: idPembelianValas,
            pBankPengirim: $("#pBankPengirim").val(),
            pbankPenerima: $("#pBankPenerima").val(),
            pTglPosting: $("#pTglPosting").val(),
            pCurr: $("#pCurrecny").val(),
            pPembelian: $("#pPembelian").val(),
            pKurs: $("#pKurs").val(),
            pNo: $("#pNo").val(),
            pPay: $("#pPayReq").val(),
            pDoc1: $("#pDokNo1").val(),
            pDoc2: $("#pDokNo2").val()
        },
        success: function (res) {
            hideLoadingCss("");
            console.log("ins log : ", res);
            if (res.return == 1) {
                alert(res.OUT_MSG);
                // location.reload();
                search("load");
                $('#edit-pembelian-valas-modal').modal('hide');
            } else {
                alert(res.OUT_MSG);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load"  && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#no_dok1").val(), $("#no_dok2").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/pembelian_valas/get_all_pembelian_valas",
        dataType: 'JSON',
        type: "GET",
        data : {
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pCurr: $("#cmb_currecny").val(),
            pDok1: $("#no_dok1").val(),
            pDok2: $("#no_dok2").val(),
        },
        success: function (res) {
            console.log(res);
            allData = res;
        },
        error: function () {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator")
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

    var doc1 = "null";
    var doc2 = "null";

    if($("#no_dok1").val() != ""){
        doc1 = $("#no_dok1").val()
    }
    if($("#no_dok2").val() != ""){
        doc2 = $("#no_dok2").val()
    }
    window.open(baseUrl + "api_operator/pembelian_valas/xls/"+tglAwal.replace(/\//g,"-")+"/"+tglAkhir.replace(/\//g,"-")+"/"+$("#cmb_bank").val()+"/"+$("#cmb_currecny").val()+"/"+doc1+"/"+doc2);
}

function generatePDF() {
    console.log("all data  : " + allData);
    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "POSTING DATE",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NAMA BANK PENGIRIM",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KODE BANK PENGIRIM",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NAMA BANK PENERIMA",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KODE BANK PENERIMA",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PEMBELIAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "CURRENCY",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KURS",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "KONVERSI IDR",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "NO. SETTLEMENT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PAYREG",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "DOKUMEN 1",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "DOKUMEN 2",
        style: "tableHeader",
        alignment: "center"
    });
    var externalDataRetrievedFromServer = []
    $.each(allData, function (index, v) {
        var helloooow = {
            ROW: v.ROW_NUMBER,
            POSTING_DATE: v.TGL_POSTING,
            NAMA_BANK_PENGIRIM: v.NAMA_BANK_PENGIRIM,
            KODE_BANK_PENGIRIM: v.BANK_PENGIRIM,
            NAMA_BANK_PENERIMA: v.NAMA_BANK_PENERIMA,
            KODE_BANK_PENERIMA: v.BANK_PENERIMA,
            PEMBELIAN: accounting.formatNumber(v.PEMBELIAN,2,".",","),
            CURRENCY: v.CURRENCY,
            KURS: accounting.formatNumber(v.KURS,2,".",","),
            KONVERSI_IDR: accounting.formatNumber(v.KONVERSI_IDR,2,".",","),
            NO: v.NO,
            PAYREG: v.PAY,
            DOKUMEN_1: v.DOC1,
            DOKUMEN_2: v.DOC2
        }
        externalDataRetrievedFromServer.push(helloooow)
    });

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
            console.log(row);
            dataRow.push(row["ROW"]);
            dataRow.push(row["POSTING_DATE"]);
            dataRow.push(row["NAMA_BANK_PENGIRIM"]);
            dataRow.push(row["KODE_BANK_PENGIRIM"]);
            dataRow.push(row["NAMA_BANK_PENERIMA"]);
            dataRow.push(row["KODE_BANK_PENERIMA"]);
            dataRow.push({text:row["PEMBELIAN"],alignment: "right"});
            dataRow.push(row["CURRENCY"]);
            dataRow.push({text:row["KURS"],alignment: "right"});
            dataRow.push({text:row["KONVERSI_IDR"],alignment: "right"});
            dataRow.push(row["NO"]);
            dataRow.push({text:row["PAYREG"],alignment: "right"});
            dataRow.push({text:row["DOKUMEN_1"],alignment: "right"});
            dataRow.push({text:row["DOKUMEN_2"],alignment: "right"});
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
            text: "PEMBELIAN VALAS",
            style: "header",
            alignment: "center"
        }, {
            text: "Tanggal Cetak : "+getDataNow(),
            style: "subheader"
        },
            table(externalDataRetrievedFromServer, column)
        ],
        styles: {
            header: {
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 9,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 7
            },
            tableHeader: {
                bold: true,
                fontSize: 8,
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

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pDok1, pDok2) {
    console.log(pCurrency);
    console.log(pDok1);
    console.log(pDok2);
    showLoadingCss()
    $('#table-pembelian-valas tbody').empty();
    $('#table-pembelian-valas').dataTable().fnDestroy();
    table_pembelian_valas = $('#table-pembelian-valas').DataTable({
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "searching": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY":        "300px",
        "scrollX":        true,
        "scrollCollapse": true,
        "aoColumnDefs": [
            { width: 125, targets: 1 },
            { width: 200, targets: 2 },
            { width: 200, targets: 3 },
            { width: 200, targets: 4 },
            { width: 200, targets: 5 },
            { width: 125, targets: 6 },
            { width: 125, targets: 7 },
            { width: 125, targets: 8 },
            { width: 125, targets: 9 },
            { width: 125, targets: 10 },
            { width: 125, targets: 11 },
            { width: 125, targets: 12 },
            { width: 125, targets: 13 },
            { className: "datatables_action", "targets": [ 6 ,8,  9, 11, 12, 13] },
            {
                "bSortable": true,
                "aTargets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            }
            ,
            {
                "aTargets": [6],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.PEMBELIAN,2,".",",");
                }

            }
            ,
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    var param = (full.KURS == null) ? "-" : full.KURS;
                    return accounting.formatNumber(param,2,".",",");
                }

            }
            ,
            {
                "aTargets": [9],
                "mRender": function (data, type, full) {

                    return accounting.formatNumber(full.KONVERSI_IDR,2,".",",");
                }

            }
            ,
            {
                "aTargets": [11],
                "mRender": function (data, type, full) {

                   return full.PAY;
                }

            }
            ,
            {
                "aTargets": [14],
                "mRender": function (data, type, full) {
                   if(newRoleUser[0] == "ROLE_MS_LIKUIDITAS"){
                       return "-"
                   }else{
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button style="width: 15px !important;" class="btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_BELI_VALAS + '\')"><i class="fa fa-remove"></i></button>' +
                        '</div>'
                        return ret_value;
                    }

                }

            }
        ],
        "ajax": {
            "url": baseUrl + "api_operator/pembelian_valas/get_data",
            "type": "GET",
            "dataType": "json",
            "data": {
                pTglAwal: pTglAwal,
                pTglAkhir: pTglAkhir,
                pBank: pBank,
                pCurrency: pCurrency,
                pDok1 : pDok1,
                pDok2 : pDok2
            },
            "dataSrc": function (res) {
                hideLoadingCss("")
                console.log("get log : ", res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "TGL_POSTING", "defaultContent": ""},
            {"data": "NAMA_BANK_PENGIRIM", "defaultContent": ""},
            {"data": "BANK_PENGIRIM", "defaultContent": ""},
            {"data": "NAMA_BANK_PENERIMA", "defaultContent": ""},
            {"data": "BANK_PENERIMA", "defaultContent": ""},
            {"data": "PEMBELIAN", "defaultContent": ""},
            {"data": "CURRENCY", "defaultContent": ""},
            {"data": "KURS", "defaultContent": ""},
            {"data": "KONVERSI_IDR", "defaultContent": ""},
            {"data": "NO", "defaultContent": ""},
            {"data": "PAY", "defaultContent": ""},
            {"data": "DOC1", "defaultContent": ""},
            {"data": "DOC2", "defaultContent": ""}

        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_pembelian_valas.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });

}
