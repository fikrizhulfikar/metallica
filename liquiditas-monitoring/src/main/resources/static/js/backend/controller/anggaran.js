/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_anggaran;
var idValas = "";
var allData;
var tempVendor = "";
var tempUnit = "";
var tempTableSearch = "";


$(document).ready(function () {
    getAllData();
    setSelectUnitAnggaran("cmb_unitanggaran","");
    search("load");



});



function search(state) {
    if (state != "load") {
        alert("ERROR");
    } else {
        initDataTable($("#cmb_unitanggaran").val())
        getAllData()
    }
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/anggaran/get_all_anggaran",
        dataType: 'JSON',
        type: "GET",
        data : {
            pUnitAnggaran: $("#cmb_unitanggaran").val()
        },
        success: function (res) {
            console.log(res);
            allData = res;
        },
        error: function () {
            console.log("cannot get data for report");
        }
    });
}

function generatePDF() {
    console.log("all data  : "+allData);
    var column = [];
    column.push({
        text: "NO.",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TAHUN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "UNIT",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SUB POS ANGGARAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "PENETAPAN",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "TOTAL REALISASI",
        style: "tableHeader",
        alignment: "center"
    });
    column.push({
        text: "SISA ANGGARAN",
        style: "tableHeader",
        alignment: "center"
    });


    var externalDataRetrievedFromServer = []
    $.each(allData, function( index, v ) {

        var helloooow = {
            NO: v.ROW_NUMBER,
            TAHUN: v.TAHUN,
            UNIT_ANGGARAN: v.UNIT_ANGGARAN,
            SUB_POS_ANGGARAN: v.SUB_POS_ANGGARAN,
            PENETAPAN: accounting.formatNumber(v.PENETAPAN,2,".",","),
            TOTAL_REALISASI: accounting.formatNumber(v.TOTAL_REALISASI,2,".",","),
            SISA_ANGGARAN: accounting.formatNumber(v.SISA_ANGGARAN,2,".",",")
        }
        externalDataRetrievedFromServer.push(helloooow)
    });

    function buildTableBody(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function(row) {
            var dataRow = [];
            console.log(row);
            dataRow.push(row["NO"]);
            dataRow.push(row["TAHUN"]);
            dataRow.push(row["UNIT_ANGGARAN"]);
            dataRow.push(row["SUB_POS_ANGGARAN"]);
            dataRow.push({
                text: row["PENETAPAN"],
                alignment: "right"
            });
            dataRow.push({
                text: row["TOTAL_REALISASI"],
                alignment: "right"
            });
            dataRow.push({
                text: row["SISA_ANGGARAN"],
                alignment: "right"
            });
            dataRow.push({text:row["INTEREST"],alignment: "right"});
            dataRow.push(row["TANGGAL_PENEMPATAN"]);
            dataRow.push(row["TANGGAL_JATUH_TEMPO"]);
            dataRow.push(row["TENOR"]);
            dataRow.push(row["JUMLAH_HARI"]);
            dataRow.push(row["BUNGA"]);
            dataRow.push({
                text: row["POKOK_BUNGA"],
                alignment: "right"
            });

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
        content: [ {
            text: "DEPOSITO",
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

function initDataTable(pUnitAnggaran){
    console.log("pUnitAnggaran : ",pUnitAnggaran);
    showLoadingCss();
    $('#table-anggaran tbody').empty();
    $('#table-anggaran').dataTable().fnDestroy();
    table_anggaran = $('#table-anggaran').DataTable( {
        // "sDom": '<"H"ilr><"clear">t<"F"p>',
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "bLengthChange": true,
        "scrollY": "100%",
        "scrollX": "100%",
        // "order": [3],
        "searching": true,
        bSortable: true,
        /*"scrollY": "300px",
        "scrollX": true,*/
        "scrollCollapse": true,
        "aoColumnDefs": [
            {width: 50, targets: 0, },
            {width: 80, targets: 1 },
            {width: 175, targets: 2 },
            {width: 175, targets: 3 },
            {width: 175, targets: 4 },
            {width: 175, targets: 5 },
            {width: 175, targets: 6 },
            // {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [4,5,6] },
            {
                "bSortable": true,
                "aTargets": [0]
            }
            ,
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {
                    return full.ROW_NUMBER;
                }

            },
            {
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.TAHUN;
                }

            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.KODE_UNIT_EBUDGET;
                }

            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return full.SUB_POS_ANGGARAN;
                }

            },
            {
                "aTargets": [4],
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.PENETAPAN,2,".",",")

                }

            },
            {
                "aTargets": [5],
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.TOTAL_REALISASI,2,".",",")

                }

            },
            {
                "aTargets": [6],
                "mRender": function ( data, type, full ) {
                    return accounting.formatNumber(full.SISA_ANGGARAN,2,".",",")

                }

            }

        ],
        "ajax": {
            "url": baseUrl+"api_operator/anggaran/get_data",
            "type": "GET",
            "dataType" : "json",
            "data": {
                pUnitAnggaran : pUnitAnggaran
            },
            "dataSrc" : function(res){
                hideLoadingCss("")
                //console.log("get log : ",res);
                return res.data;
            }
        },
        // "columns": [
        //     {"data": "ROW_NUMBER", "defaultContent": ""},
        //     {"data": "TAHUN", "defaultContent": ""},
        //     {"data": "KODE_UNIT_EBUDGET", "defaultContent": ""},
        //     {"data": "SUB_POS_ANGGARAN", "defaultContent": ""},
        //     {"data": "PENETAPAN", "defaultContent": ""},
        //     {"data": "TOTAL_REALISASI", "defaultContent": ""},
        //     {"data": "SISA_ANGGARAN", "defaultContent": ""}
        //
        // ],
        "drawCallback": function( settings ) {
            $('th').removeClass('sorting_asc');
            $('th').removeClass('datatables_action');
            $('th').addClass('th-middle');
        }
    });

    table_anggaran.on('search.dt', function() {
        var value = $('.dataTables_filter input').val();
        console.log(value); // <-- the value
        tempTableSearch = value;
    });

    table_anggaran.columns.adjust();
};