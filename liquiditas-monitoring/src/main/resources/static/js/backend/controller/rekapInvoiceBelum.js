/**
 * Created by Mr.Diaz on 31/10/19.
 */
var table_rekapitulasi;
var idValas = "";
var allData;
var tempVendor = "";
var tempBankPembayar = "";
var tempHouseBank = "";
var tempBankAccount = "";
var tempKodeBank = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var Invoice = "";
var fullArray = new Array();
var fullArrayGroup = new Array();
var invoiceCheckedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;
var row_selected;

$(document).ready(function () {
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectFilterBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectMetodeBayar("cmb_cara_pembayaran", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");

    $('#check_all').change(function() {
        if($(this).is(':checked')){
            checkAllColumn(true);
        } else {
            checkAllColumn(false);
        }
    });
});

$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        //alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_rekap_invoice",
        dataType: 'JSON',
        type: "GET",
        data: {
            pStatusValas: "0",
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pBank: $("#cmb_bank").val(),
            pCurr: $("#cmb_currecny").val(),
            pCaraBayar: $("#cmb_cara_pembayaran").val()
        },
        success: function (res) {
            // console.log('Bank :'+pBank);
            allData = res;
        },
        error: function (res) {
            // console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
        }
    });

    }

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_total_tagihan",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            currency: $("#cmb_currecny").val(),
            caraBayar: $("#cmb_cara_pembayaran").val(),
            bank: $("#cmb_bank").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_tagihan").html(res);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
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
    window.open(baseUrl + "api_operator/rekap_invoice_belum/xls/" + tglAwal.replaceAll("/","-") + "/" + tglAkhir.replaceAll("/","-") + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_cara_pembayaran").val() + "/" + $("#cmb_bank").val() + "/" +null+ "/" +null+ "/" +newRoleUser[0]);
}

function exportXlsAll() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/rekap_invoice_belum/xls_all_invoice");
}

function search(state) {
        if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
            alert("Mohon Lengkapi Tgl Akhir");
        } else {
            initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_cara_pembayaran").val(), $("#cmb_status_tracking").val())
            // getAllData();
            srcTglAwal = $("#tanggal_awal").val()
            srcTglAkhir = $("#tanggal_akhir").val()
        }
    }

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, statusTracking) {
            showLoadingCss();
            $('#table-rekapitulasi').dataTable().fnDestroy();
            table_rekapitulasi = $('#table-rekapitulasi').DataTable({
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
                    "lengthMenu": [[10, 25, 50, 100, 200, 400, 600, 1000], [10, 25, 50, 100, 200, 400, 600, 1000]],
                    "aoColumnDefs": [
                        {width: 20, targets: 0},
                        {width: 100, targets: 1},
                        {width: 100, targets: 2},
                        {width: 100, targets: 3},
                        {width: 100, targets: 4},
                        {width: 100, targets: 5},
                        {width: 100, targets: 6},
                        {width: 100, targets: 7},
                        {width: 100, targets: 8},
                        {width: 100, targets: 9},
                        {width: 100, targets: 10},
                        {width: 100, targets: 11},
                        {width: 100, targets: 12},
                        {width: 100, targets: 13},
                        {width: 100, targets: 14},
                        {width: 100, targets: 15},
                        {width: 100, targets: 16},
                        {width: 100, targets: 17},
                        {width: 100, targets: 18},
                        {width: 100, targets: 19},
                        {width: 100, targets: 20},
                        {width: 100, targets: 21},
                        {width: 100, targets: 22},
                        {width: 100, targets: 23},
                        {width: 100, targets: 24},
                        {width: 100, targets: 25},
                        {width: 100, targets: 26},
                        {width: 100, targets: 27},
                        {width: 100, targets: 28},
                        {width: 100, targets: 29},
                        {width: 100, targets: 30},
                        {width: 100, targets: 31},
                        {width: 100, targets: 32},
                        {width: 100, targets: 33},
                        {width: 100, targets: 34},
                        {width: 100, targets: 35},
                        {width: 100, targets: 36},
                        {width: 100, targets: 37},
                        {width: 100, targets: 38},
                        {width: 100, targets: 39},
                        {width: 100, targets: 40},
                        {width: 100, targets: 41},
                        {width: 100, targets: 42},
                        {width: 100, targets: 43},
                        {width: 100, targets: 44},
                        {width: 100, targets: 45},
                        {width: 100, targets: 46},
                        {width: 100, targets: 47},
                        {width: 100, targets: 48},
                        {width: 100, targets: 49},
                        {width: 100, targets: 50},
                        {width: 100, targets: 51},
                        {width: 100, targets: 52},
                        {width: 100, targets: 53},
                        {width: 100, targets: 54},
                        {width: 100, targets: 55},
                        {width: 100, targets: 56},
                        {width: 100, targets: 57},
                        {width: 100, targets: 58},
                        {width: 100, targets: 59},
                        {width: 100, targets: 60},
                        {width: 100, targets: 61},
                        {width: 100, targets: 62},
                        {width: 100, targets: 63},
                        {width: 100, targets: 64},
                        {width: 100, targets: 65},
                        {width: 100, targets: 66},
                        {width: 100, targets: 67},
                        {width: 100, targets: 68},
                        {width: 100, targets: 69},
                        {width: 100, targets: 70},
                        {width: 100, targets: 71},
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "visible" : true,
                            "aTargets": [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72]
                        },
                        {
                            "sortable": false,
                            "aTargets": [73,74]
                        },
                        {
                            "aTargets": [0],
                            "name" : "NOMOR",
                            "mRender": function (data, type, full) {
                                return full.ROW_NUMBER;
                            }

                        },
                        {
                            "aTargets": [1],
                            "name" : "KET",
                            "mRender": function (data, type, full) {
                                return full.KET;
                            }

                        },
                        {
                            "aTargets": [2],
                            "name" : "COMP_CODE",
                            "mRender": function (data, type, full) {
                                return full.COMP_CODE;
                            }

                        },
                        {
                            "aTargets": [3],
                            "name" : "DOC_NO",
                            "mRender": function (data, type, full) {
                                return full.DOC_NO;
                            }

                        },

                        {
                            "aTargets": [4],
                            "name" : "GROUP_ID",
                            "mRender": function (data, type, full) {
                                return full.GROUP_ID;
                            }

                        },
                        {
                            "aTargets": [5],
                            "name" : "OSS_ID",
                            "mRender": function (data, type, full) {
                                return full.OSS_ID;
                            }

                        },
                        {
                            "aTargets": [6],
                            "name" : "FISC_YEAR",
                            "mRender": function (data, type, full) {
                                return full.FISC_YEAR;
                            }

                        },
                        {
                            "aTargets": [7],
                            "name" : "DOC_TYPE",
                            "mRender": function (data, type, full) {
                                return full.DOC_TYPE;
                            }

                        },
                        {
                            "aTargets": [8],
                            "name" : "DOC_DATE",
                            "mRender": function (data, type, full) {
                                return full.DOC_DATE2;
                            }

                        },
                        {
                            "aTargets": [9],
                            "name" : "POST_DATE",
                            "mRender": function (data, type, full) {
                                return full.POST_DATE;

                            }
                        },
                        {
                            "aTargets": [10],
                            "name" : "ENTRY_DATE",
                            "mRender": function (data, type, full) {
                                return full.ENTRY_DATE2;
                            }

                        },
                        {
                            "aTargets": [11],
                            "name" : "REFERENCE",
                            "mRender": function (data, type, full) {
                                return full.REFERENCE;
                            }

                        },
                        {
                            "aTargets": [12],
                            "name" : "REV_WITH",
                            "mRender": function (data, type, full) {
                                return full.REV_WITH;
                            }
                        },
                        {
                            "aTargets": [13],
                            "name" : "REV_YEAR",
                            "mRender": function (data, type, full) {
                                return full.REV_YEAR;
                            }

                        },
                        {
                            "aTargets": [14],
                            "name" : "DOC_HDR_TXT",
                            "mRender": function (data, type, full) {
                                return full.DOC_HDR_TXT;
                            }

                        },
                        {
                            "aTargets": [15],
                            "name" : "CURRENCY",
                            "mRender": function (data, type, full) {
                                return full.CURRENCY;
                            }

                        },
                        {
                            "aTargets": [16],
                            "name" : "CURR_BAYAR",
                            "mRender": function (data, type, full) {
                                return full.CURR_BAYAR;
                            }

                        },
                        {
                            "aTargets": [17],
                            "name" : "EXCH_RATE",
                            "mRender": function (data, type, full) {
                                return full.EXCH_RATE;
                            }

                        },
                        {
                            "aTargets": [18],
                            "name" : "REFERENCE_KEY",
                            "mRender": function (data, type, full) {
                                return full.REFERENCE_KEY;
                            }
                        },
                        {
                            "aTargets": [19],
                            "name" : "PMT_IND",
                            "mRender": function (data, type, full) {
                                return full.PMT_IND;
                            }
                        },
                        {
                            "aTargets": [20],
                            "name" : "TRANS_TYPE",
                            "mRender": function (data, type, full) {
                                return full.TRANS_TYPE;
                            }
                        },
                        {
                            "aTargets": [21],
                            "name" : "SPREAD_VAL",
                            "mRender": function (data, type, full) {
                                return full.SPREAD_VAL;
                            }
                        },
                        {
                            "aTargets": [22],
                            "name" : "LINE_ITEM",
                            "mRender": function (data, type, full) {
                                return full.LINE_ITEM;
                            }
                        },
                        {
                            "aTargets": [23],
                            "name" : "OI_IND",
                            "mRender": function (data, type, full) {
                                return full.OI_IND;
                            }
                        },
                        {
                            "aTargets": [24],
                            "name" : "ACCT_TYPE",
                            "mRender": function (data, type, full) {
                                return full.ACCT_TYPE;
                                //return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [25],
                            "name" : "SPEC_GL",
                            "mRender": function (data, type, full) {
                                return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [26],
                            "name" : "BUS_AREA",
                            "mRender": function (data, type, full) {
                                return full.BUS_AREA;
                            }
                        },
                        {
                            "aTargets": [27],
                            "name" : "TPBA",
                            "mRender": function (data, type, full) {
                                return full.TPBA;
                                //return full.AMT_WITH_TC;
                            }
                        },
                        {
                            "aTargets": [28],
                            "name" : "AMT_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                                // return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [29],
                            "name" : "AMT_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                                // return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [30],
                            "name" : "AMT_WITH_BASE_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [31],
                            "name" : "AMT_WITH_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                            }
                        },

                        {
                            "aTargets": [32],
                            "name" : "AMOUNT",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT,2,".",",");
                            }

                        },
                        {
                            "aTargets": [33],
                            "name" : "AMOUNT_BAYAR",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT_BAYAR,2,".",",");
                            }
                        },
                        {
                            "aTargets": [34],
                            "name" : "ASSIGNMENT",
                            "mRender": function (data, type, full) {
                                return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [35],
                            "name" : "ITEM_TEXT",
                            "mRender": function (data, type, full) {
                                return full.ITEM_TEXT;
                            }
                        },
                        {
                            "aTargets": [36],
                            "name" : "COST_CTR",
                            "mRender": function (data, type, full) {
                                return full.COST_CTR;
                            }
                        },
                        {
                            "aTargets": [37],
                            "name" : "GL_ACCT",
                            "mRender": function (data, type, full) {
                                return full.GL_ACCT;
                            }
                        },
                        {
                            "aTargets": [38],
                            "name" : "CUSTOMER_NAME",
                            "mRender": function (data, type, full) {
                                return full.CUSTOMER;
                            }
                        },
                        {
                            "aTargets": [39],
                            "name" : "VENDOR_NAME",
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }
                        },
                        {
                            "aTargets": [40],
                            "name" : "BASE_DATE",
                            "mRender": function (data, type, full) {
                                return full.BASE_DATE;
                            }
                        },
                        {
                            "aTargets": [41],
                            "name" : "TERM_PMT",
                            "mRender": function (data, type, full) {
                                return full.TERM_PMT;
                            }
                        },
                        {
                            "aTargets": [42],
                            "name" : "DUE_ON",
                            "mRender": function (data, type, full) {
                                return full.DUE_ON;
                            }
                        },
                        {
                            "aTargets": [43],
                            "name" : "PMT_BLOCK",
                            "mRender": function (data, type, full) {
                                return full.PMT_BLOCK;
                            }
                        },
                        {
                            "aTargets": [44],
                            "name" : "HOUSE_BANK",
                            "mRender": function (data, type, full) {
                                return full.BANK_BYR;
                            }
                        },
                        {
                            "aTargets": [45],
                            "name" : "NO_REK_HOUSE_BANK",
                            "mRender": function (data, type, full) {
                                return full.NO_REK_HOUSE_BANK;
                            }
                        },
                        {
                            "aTargets": [46],
                            "name" : "PRTNR_BANK_TYPE",
                            "mRender": function (data, type, full) {
                                return full.PRTNR_BANK_TYPE;
                            }
                        },
                        {
                            "aTargets": [47],
                            "name" : "BANK_KEY",
                            "mRender": function (data, type, full) {
                                return full.BANK_KEY;
                            }
                        },
                        {
                            "aTargets": [48],
                            "name" : "BANK_ACCOUNT",
                            "mRender": function (data, type, full) {
                                return full.BANK_ACCOUNT;
                            }
                        },
                        {
                            "aTargets": [49],
                            "name" : "ACCOUNT_HOLDER",
                            "mRender": function (data, type, full) {
                                return full.ACCOUNT_HOLDER;
                            }
                        },
                        {
                            "aTargets": [50],
                            "name" : "NAMA_BENEF",
                            "mRender": function (data, type, full) {
                                return full.NAMA_BENEF;
                            }
                        },
                        {
                            "aTargets": [51],
                            "name" : "NO_REK_BENEF",
                            "mRender": function (data, type, full) {
                                return full.NO_REK_BENEF;
                            }
                        },
                        {
                            "aTargets": [52],
                            "name" : "BANK_BENEF",
                            "mRender": function (data, type, full) {
                                return full.BANK_BENEF;
                            }
                        },
                        {
                            "aTargets": [53],
                            "name" : "PO_NUM",
                            "mRender": function (data, type, full) {
                                return full.PO_NUM;
                            }
                        },
                        {
                            "aTargets": [54],
                            "name" : "PO_ITEM",
                            "mRender": function (data, type, full) {
                                return full.PO_ITEM;
                            }
                        },
                        {
                            "aTargets": [55],
                            "name" : "REF_KEY1",
                            "mRender": function (data, type, full) {
                                return full.REF_KEY1;
                            }
                        },
                        {
                            "aTargets": [56],
                            "name" : "REF_KEY2",
                            "mRender": function (data, type, full) {
                                return full.REF_KEY2;
                            }
                        },
                        {
                            "aTargets": [57],
                            "name" : "REF_KEY3",
                            "mRender": function (data, type, full) {
                                return full.REF_KEY3;
                            }
                        },
                        {
                            "aTargets": [58],
                            "name" : "INT_ORDER",
                            "mRender": function (data, type, full) {
                                return full.INT_ORDER;
                            }
                        },
                        {
                            "aTargets": [59],
                            "name" : "WBS_NUM",
                            "mRender": function (data, type, full) {
                                return full.WBS_NUM;
                            }
                        },
                        {
                            "aTargets": [60],
                            "name" : "CASH_CODE",
                            "mRender": function (data, type, full) {
                                return full.CASH_CODE;
                            }
                        },
                        {
                            "aTargets": [61],
                            "name" : "DR_CR_IND",
                            "mRender": function (data, type, full) {
                                return full.DR_CR_IND;
                            }
                        },
                        {
                            "aTargets": [62],
                            "name" : "PARTIAL_IND",
                            "mRender": function (data, type, full) {
                                return full.PARTIAL_IND;
                            }
                        },
                        {
                            "aTargets": [63],
                            "name" : "AMT_WITH_BASE_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [64],
                            "name" : "AMT_WITH_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [65],
                            "name" : "METODE_PEMBAYARAN",
                            "mRender": function (data, type, full) {
                                return full.METODE_PEMBAYARAN;
                            }
                        },
                        {
                            "aTargets": [66],
                            "name" : "NO_GIRO",
                            "mRender": function (data, type, full) {
                                return full.NO_GIRO;
                            }
                        },
                        {
                            "aTargets": [67],
                            "name" : "REF_NUM_BANK",
                            "mRender": function (data, type, full) {
                                return full.REF_NUM_BANK;
                            }
                        },
                        {
                            "aTargets": [68],
                            "name" : "TGL_TAGIHAN_DITERIMA",
                            "mRender": function (data, type, full) {
                                return full.TGL_TAGIHAN_DITERIMA;
                            }
                        },
                        {
                            "aTargets": [69],
                            "name" : "TGL_RENCANA_BAYAR",
                            "mRender": function (data, type, full) {
                                return full.TGL_RENCANA_BAYAR;
                            }
                        },
                        {
                            "aTargets": [70],
                            "name" : "SUMBER_DANA",
                            "mRender": function (data, type, full) {
                                return full.SUMBER_DANA;
                            }
                        },
                        {
                            "aTargets": [71],
                            "name" : "KETERANGAN",
                            "mRender": function (data, type, full) {
                                return full.KETERANGAN;

                            }
                        },
                        {
                            "aTargets": [72],
                            "name" : "STATUS_TRACKING",
                            "mRender": function (data, type, full) {
                                return full.STATUS_TRACKING;

                            }
                        },

                        {
                            "aTargets": [73],
                            "mRender": function (data, type, full) {
                                var ret_value;
                                // // console.log("Ini Full :",full);
                                /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                                /*    if(newRoleUser[0].includes("DIVKEU")){
                                        ret_value =
                                            '<div class="btn-group">' +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="far fa-edit"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                            '</div>'
                                    } */
                                if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                                    return "-"
                                }
                                else if(newRoleUser[0] == "ROLE_OSS" ){
                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';

                                    ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                        '</div>';
                                }
                                else if(full.METODE_PEMBAYARAN == 'GIRO' || full.METODE_PEMBAYARAN == 'INTERNETBANKING'){
                                    if (full.STATUS_TRACKING == "VALIDASI DATA") {
                                        var role = newRoleUser[0];
                                        ret_value =
                                       '<div class="btn-group">';

                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                          ret_value = ret_value +
                                          '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                          '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-warning" title="Approve" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fas fa-check-circle"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_JA_CASH"){
                                           ret_value = ret_value +
                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-warning" title="Approve" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                           '<button style="width: 15px !important; margin-right: 5px;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                           '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_JA_IE"){
                                           ret_value = ret_value +
                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-warning" title="ApproveR" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                           '<button style="width: 15px !important; margin-right: 5px;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                            '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_CENTRALIZED_RECEIPT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-edit-data btn-sm btn-warning" title="Approve" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                        '</div>'
                                    }
                              else if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                '<div class="btn-group">';
                                 if(newRoleUser[0] == "ROLE_ADMIN"){
                                        ret_value = ret_value +
                                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                        '<button style="width: 15px !important; margin-right: 5px;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';

                                 }
                                 if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                      ret_value = ret_value +
                                      '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                      '<button style="width: 15px !important; margin-right: 5px;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                          '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                 }
                                 if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                      ret_value = ret_value +
                                      '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                      '<button style="width: 15px !important; margin-right: 5px;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                          '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                 }
                                 if(newRoleUser[0] == "ROLE_MSB_CENTRALIZED_RECEIPT"){
                                     ret_value = ret_value +
                                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                         '<button style="width: 15px !important; margin-right: 5px;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                 }
                                 '</div>'
                                 }
                                 else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                     var role = newRoleUser[0];
                                     ret_value =
                                      '<div class="btn-group">';
                                      if(newRoleUser[0] == "ROLE_ADMIN"){
                                      ret_value = ret_value +
                                      '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                      '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                      }
                                     if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                      ret_value = ret_value +
                                      '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                      '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                      }
                                      if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                          ret_value = ret_value +
                                              '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                              '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                      }
                                      if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                          ret_value = ret_value +
                                              '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                              '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                      }
                                      if(newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                          ret_value = ret_value +
                                              '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                              '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                      }

                                        '</div>'
                                        }

                                        else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                           var role = newRoleUser[0];
                                           ret_value =
                                           '<div class="btn-group">';
                                             if(newRoleUser[0] == "ROLE_ADMIN"){
                                                  ret_value = ret_value +
                                                      '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-ready" title="Siap Bayar (Giro)" onclick="updSiapBayarGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                      // '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                      '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                             }
                                             if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                                   ret_value = ret_value +
                                                       '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-ready" title="Siap Bayar (Giro)" onclick="updSiapBayarGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                       // '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                       '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                             }
                                             if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                                    ret_value = ret_value +
                                                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-ready" title="Siap Bayar (Giro)" onclick="updSiapBayarGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                        // '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                        '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                             }

                                            if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                                ret_value = ret_value +
                                                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-ready" title="Siap Bayar (Giro)" onclick="updSiapBayarGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                        // '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                        '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                            }
                                            if (newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-ready" title="Siap Bayar (Giro)" onclick="updSiapBayarGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                    // '<button style="width: 15px !important;" class="btn btn-sm btn-primary" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                            }
                                             '</div>'
                                            }
                                }
                                else {
                                    if (full.STATUS_TRACKING == "INPUT DATA") {
                                        var role = newRoleUser[0];
                                        ret_value =
                                            '<div class="btn-group">';
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                       '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                       '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                       '<button style="width: 15px !important;" class="btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_JA_CASH"){
                                             ret_value = ret_value +
                                                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                         '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                         if(newRoleUser[0] == "ROLE_JA_IE"){
                                             ret_value = ret_value +
                                                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                         '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                         }
                                        if(newRoleUser[0] == "ROLE_CENTRALIZED_RECEIPT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_FCL_SETTLEMENT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                        '</div>'

                                     }else if(full.STATUS_TRACKING == "VALIDASI DATA"){
                                        var role = newRoleUser[0];
                                        ret_value =
                                            '<div class="btn-group">';
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_JA_CASH"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_JA_IE"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_CENTRALIZED_RECEIPT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_FCL_SETTLEMENT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="far fa-edit"></i></button>'+
                                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\',\''+full.STATUS_TRACKING+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.METODE_PEMBAYARAN+'\')"><i class="fas fa-file-alt"></i></button>';
                                        }
                                        '</div>'
                                    }
                                     else   if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                            var role = newRoleUser[0];
                                            ret_value =
                                            '<div class="btn-group">';
                                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                                        ret_value = ret_value +
                                                       '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                       '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                }
                                                 if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                                        ret_value = ret_value +
                                                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                        '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                 }
                                                  if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                                         ret_value = ret_value +
                                                         '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                         '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                  }
                                            '</div>'
                                         }
                                        else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                                var role = newRoleUser[0];
                                                ret_value =
                                                '<div class="btn-group">';
                                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                                           ret_value = ret_value +
                                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                           '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                        }
                                                        if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                                           ret_value = ret_value +
                                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                           '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                        }
                                                        if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                                           ret_value = ret_value +
                                                           '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                           '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                        }
                                                        if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                                            ret_value = ret_value +
                                                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-check-circle"></i></button>'+
                                                            '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                        }
                                                 '</div>'
                                          }

                                          else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                               var role = newRoleUser[0];
                                               ret_value =
                                               '<div class="btn-group">';
                                                  if(newRoleUser[0] === "ROLE_ADMIN"){
                                                    ret_value = ret_value +
                                                    '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                    }
                                                  if(newRoleUser[0] === "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                                    ret_value = ret_value +

                                                    '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                  }
                                                  if(newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"){
                                                     ret_value = ret_value +
                                                      '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                      '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                  }
                                                  if(newRoleUser[0] === "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                                      ret_value = ret_value +
                                                          '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fas fa-money-check"></i></button>'+
                                                          '<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-success" title="Reverse" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                  }
                                                '</div>'
                                          }

                                    else {
                                        ret_value =
                                            '<div class="btn-group">' +
                                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\')"><i class="far fa-edit"></i></button>'+
                                            '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Approve" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.OSS_ID+'\',\''+full.GROUP_ID+'\', \''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fas fa-check-circle"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn btn-update-data btn-ms btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>';

                                            '</div>'
                                    }
                                }
                                return ret_value;
                            }

                        },
                        {
                            "aTargets": [74],
                            "mRender": function (data, type, full) {
                                var value = new Object();
                                let json_string = JSON.stringify(full);
                                var full_value = '{"full":'+json_string.replace(/'/g,"")+'}';
                                var ret_value = ''
                                    if (full.STATUS_TRACKING == "INPUT DATA") {
                                        value = '{"pDocNo":"'+full.DOC_NO+'","pCompCode" : "'+full.COMP_CODE+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'","customer_name":"'+full.INQ_CUSTOMER_NAME+'","account_number":"'+full.INQ_ACCOUNT_NUMBER+'","statustracking":"'+1+'","oss_id":"'+full.OSS_ID+'","group_id":"'+full.GROUP_ID+'","metode_pembayaran":"'+full.METODE_PEMBAYARAN+'","no_giro":"'+full.NO_GIRO+'"}';
                                        full_value = full_value;

                                    }
                                     if (full.STATUS_TRACKING == "VALIDASI DATA") {
                                        value = '{"pDocNo":"'+full.DOC_NO+'","pCompCode" : "'+full.COMP_CODE+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'","customer_name":"'+full.INQ_CUSTOMER_NAME+'","account_number":"'+full.INQ_ACCOUNT_NUMBER+'","statustracking":"'+1+'","oss_id":"'+full.OSS_ID+'","group_id":"'+full.GROUP_ID+'","metode_pembayaran":"'+full.METODE_PEMBAYARAN+'","no_giro":"'+full.NO_GIRO+'"}';
                                        full_value = full_value;
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                        value = '{"pDocNo":"'+full.DOC_NO+'","pCompCode" : "'+full.COMP_CODE+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'","customer_name":"'+full.INQ_CUSTOMER_NAME+'","account_number":"'+full.INQ_ACCOUNT_NUMBER+'","statustracking":"'+2+'","oss_id":"'+full.OSS_ID+'","group_id":"'+full.GROUP_ID+'","metode_pembayaran":"'+full.METODE_PEMBAYARAN+'","no_giro":"'+full.NO_GIRO+'"}';
                                        full_value = full_value;
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                        value = '{"pDocNo":"'+full.DOC_NO+'","pCompCode" : "'+full.COMP_CODE+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'","customer_name":"'+full.INQ_CUSTOMER_NAME+'","account_number":"'+full.INQ_ACCOUNT_NUMBER+'","statustracking":"'+3+'","oss_id":"'+full.OSS_ID+'","group_id":"'+full.GROUP_ID+'","metode_pembayaran":"'+full.METODE_PEMBAYARAN+'","no_giro":"'+full.NO_GIRO+'"}';
                                        full_value = full_value;
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                        value = '{"pDocNo":"'+full.DOC_NO+'","pCompCode" : "'+full.COMP_CODE+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'","customer_name":"'+full.INQ_CUSTOMER_NAME+'","account_number":"'+full.INQ_ACCOUNT_NUMBER+'","statustracking":"'+4+'","oss_id":"'+full.OSS_ID+'","group_id":"'+full.GROUP_ID+'","metode_pembayaran":"'+full.METODE_PEMBAYARAN+'","no_giro":"'+full.NO_GIRO+'"}';
                                        full_value = full_value;
                                    }


                                for (x=0; x<invoiceCheckedArray.length;x++){
                                    if(JSON.stringify(invoiceCheckedArray[x]) === value){
                                        return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' data-full='"+full_value+"' onchange='checkArray(this)' id='cbcheckbox' checked>";
                                    }
                                }
                                return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' data-full='"+full_value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                            }
                        }
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_operator/rekap_invoice_belum/get_rekap_invoice",
                            "type":
                                "GET",
                            "dataType":
                                "json",
                            "data":
                                {
                                    pTglAwal: pTglAwal,
                                    pTglAkhir:
                                    pTglAkhir,
                                    pBank:
                                    pBank,
                                    pCurrency:
                                    pCurrency,
                                    pCaraBayar:
                                    pCaraBayar,
                                    status: $("#cmb_status").val(),
                                    statusTracking: statusTracking
                                }
                            ,
                            "dataSrc":

                                function (res) {
                                    hideLoadingCss();
                                    getTotalTagihan();
                                    return res.data;
                                }
                        }
                    ,
                    "drawCallback":
                        function (settings) {
                            table_rekapitulasi.columns.adjust();
                            var currentPageNumber = this.api().page.info().page;
                            for (x=0;x<cbParentArray.length;x++){
                                if(cbParentArray[x] == currentPageNumber){
                                    $("#cbparent").prop('checked', true);
                                    break;
                                }
                                else{
                                    $("#cbparent").prop('checked', false);
                                }
                            }
                            $('th').addClass('th-middle');
                            $(".btn-update-status").hide();
                            $(".btn-edit-data").hide();
                            $(".btn-delete-data").hide();
                            $("#btn-add-rekap").hide();

                            $("#option-lunas").hide();
                            $("#option-input").hide();
                            $("#option-siap").hide();
                            if (newRoleUser.length > 0) {
                                for (var i = 0; i < newRoleUser.length; i++) {
                                    if (newRoleUser[i] == "ROLE_KASIR_IDR" || newRoleUser[i] == "ROLE_KASIR") {
                                        $(".btn-update-status").show();
                                        $("#option-lunas").show();
                                        $("#option-input").show();
                                    } else if (newRoleUser[i] == "ROLE_ADMIN") {
                                        $(".btn-update-status").show();
                                        $(".btn-edit-data").show();
                                        $(".btn-delete-data").show();
                                        $("#btn-add-rekap").show();
                                        $("#option-lunas").show();
                                        $("#option-siap").show();
                                        $("#option-input").show();
                                    } else {
                                        $(".btn-update-status").show();
                                        $(".btn-edit-data").show();
                                        $(".btn-delete-data").show();
                                        $("#btn-add-rekap").show();
                                        $("#option-siap").show();
                                    }
                                }
                            }
                        },
                    "initComplete": function(settings, json) {
                        var api = this.api();
                        $.ajax({
                            url: baseUrl + "api_operator/rekap_invoice_belum/get_column",
                            dataType: 'JSON',
                            type: "GET",
                            success: function (res) {
                                var response = res.data[0];
                                for (const prop in response){
                                    api.column(`${prop}:name`).visible(false);
                                }
                            },
                            error: function () {
                                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                            }
                        });
                    }
                }
            );
            table_rekapitulasi.on('search.dt', function () {
                var value = $('.dataTables_filter input').val();
                tempTableSearch = value;
            });

            $('.dataTables_length').each(function () {
                var html = '<label style="margin-left: 120px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
                $(this).append(html);
            });

            $('.dataTables_filter').each(function () {
                 var html = '<button class="btn btn-info btn-sm" style="margin-left: 10px" type="button" data-toggle="modal" title="Tampilkan Kolom" onclick="showColumn()"><i class="fas fa-columns"></i></button>';

                 if(newRoleUser[0] == "ROLE_VERIFIKATOR"){
                    // html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//                    html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fa fa-university"></i></button>';
                 }
                 if(newRoleUser[0] == "ROLE_ADMIN"){
                   // html = html + '<button class="btn btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
                   //      '<i class="fa fa-arrows-alt"></i></button>';
                    /*button reject*/
                    html = html + '<button class="btn btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="far fa-edit"></i></button>';
                    html = html + '<button class="btn btn-sm btn-primary" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-folder"></i></button>';
                    html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                    html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
                    html = html + '<button class="btn btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fas fa-trash"></i></button>';
                    html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Approve" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
                    html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
                    html = html + '<button class="btn btn-siapbayar btn-ready btn-sm" id="btn-siapbayar" style="margin-left: 5px" type="button" title="Siap Bayar" onclick="siap_bayar_multiple()"><i class="fas fa-money-check"></i></button>' ;
                 }
                 else if(newRoleUser[0] == "ROLE_JA_IE"){

                     html = html + '<button class="btn btn-sm btn-primary" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-folder"></i></button>';
                     html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                     html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
                     html = html + '<button class="btn btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="far fa-edit"></i></button>';
                     html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Approve" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
                     html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-bukti-kas" style="margin-left: 10px" type="button" title="Cetak Dokumen Pegantar" onclick="cetakBuktiKasMultiple()"><i class="fas fa-copy"></i></button>' ;
                     html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
                 }else if(newRoleUser[0] == "ROLE_JA_CASH"){

                     html = html + '<button class="btn btn-sm btn-primary" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-folder"></i></button>';
                     html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                     html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
                     html = html + '<button class="btn btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="far fa-edit"></i></button>';
                     html = html + '<button class="btn btn-verified btn-sm btn-warning" id="btn-verified" style="margin-left: 10px" type="button" title="Approve" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
                     html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-bukti-kas" style="margin-left: 10px" type="button" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasMultiple()"><i class="fas fa-copy"></i></button>' ;
                     html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
                 }
                else {
                    if (newRoleUser[0] !== "ROLE_OSS"){
                        html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                    }
                    if(
                        newRoleUser[0].includes("MSB") || newRoleUser[0].includes("VP")
                    ){
                        html = html + '<button class="btn btn-siapbayar btn-ready btn-sm" id="btn-siapbayar" style="margin-left: 5px" type="button" title="Siap Bayar" onclick="siap_bayar_multiple()"><i class="fas fa-money-check"></i></button>' ;
                        html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 5px" type="button" title="Approve" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
                        html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
                    }else if(newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                        html = html + '<button class="btn btn-siapbayar btn-ready btn-sm" id="btn-siapbayar" style="margin-left: 5px" type="button" title="Siap Bayar" onclick="siap_bayar_multiple()"><i class="fas fa-money-check"></i></button>' ;
                        html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 5px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
                        // html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
                        html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
                    }else {
                        html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 5px" type="button" title="Update Data" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
                        html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
                        html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-bukti-kas" style="margin-left: 10px" type="button" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasMultiple()"><i class="fas fa-copy"></i></button>' ;
                        html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
                    }
                }
                $(this).append(html);
            });

            table_rekapitulasi.columns.adjust();
            initCbparent();
        }

function  initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        var pageNumber = table_rekapitulasi.page.info().page;
        if($(this).is(":checked")) {
            $('input:checkbox').not(this).prop('checked', this.checked).change();
            cbParentArray.push(pageNumber);
        }
        else {
            $('input:checkbox').not(this).prop('checked', this.checked).change();
            for (x = 0; x < cbParentArray.length; x++) {
                if (cbParentArray[x] == pageNumber) {
                    cbParentArray.splice(x, 1);
                }
            }
        }
    });
}

function selectBankPembayar(value) {
    tempBankPembayar = value;
//    $("#pNoRekPln").select("val", "");
    setSelectBankAccount("pNoRek", tempBankPembayar);
}

function selectKodeBankPembayar(value) {
    tempBankPembayar = value;
//    $("#pNoRekPln").select("val", "");
    setSelectNoRekening("pNoRekxx", tempBankPembayar,);
}

function selectHouseBank(value) {
    tempHouseBank = value;
//    $("#pNoRekPln").select("val", "");
//    setSelectBankAccount("pNoRekPln", tempBankPembayar);
}

function setSelectStatusTracking(idHtml) {
    $("#" + idHtml + "").append('<option value="INPUT DATA">INPUT DATA</option>');
    $("#" + idHtml + "").append('<option value="VERIFIED BY MAKER">VERIFIED BY MAKER</option>');
    $("#" + idHtml + "").append('<option value="VERIFIED BY CHECKER">VERIFIED BY CHECKER</option>');
    $("#" + idHtml + "").append('<option value="VERIFIED BY APPROVER">VERIFIED BY APPROVER</option>');
}

function selectBankAccount(value) {
    tempBankAccount = value;
    $("#pSaldo").select("val", "");
    setSelectHouseBank("pKodeBank", tempBankAccount);
}

function edit_data(pCompCode, pNoDoc, pFiscYear, pLineItem,pSource, pBank,  pBeneficiaryAccount) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_belum/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pCompCode : pCompCode,
            pNoDoc : pNoDoc,
            pFiscYear : pFiscYear,
            pLineItem : pLineItem
        },
        success: function (res) {
            hideLoadingCss("");
            $("#pBankBayar").val(res[0].BANK_BYR2);
            $("#pKet").val(res[0].KET);
            $("#pCompanyCode").val(res[0].COMP_CODE);
            $("#pNoDoc").val(res[0].DOC_NO);
            $("#pFiscYear").val(res[0].FISC_YEAR);
            $("#pDocumentType").val(res[0].DOC_TYPE);
            $("#pDocumentDate").val(res[0].DOC_DATE2);
            $("#pPostDate").val(res[0].POST_DATE2);
            $("#pEntryDate").val(res[0].ENTRY_DATE2);
            $("#pReference").val(res[0].REFERENCE);
            $("#pOssId").val(res[0].OSS_ID);
            $("#pGroupId").val(res[0].GROUP_ID);
            $("#pReverseWith").val(res[0].REV_WITH);
            $("#pReverseYear").val(res[0].REV_YEAR);
            $("#pDocHdr").val(res[0].DOC_HDR_TXT);
            $("#pCurrency").val(res[0].CURRENCY);
            $("#pCurrBayar").val(res[0].CURR_BAYAR);
            $("#pExchRate").val(new Intl.NumberFormat().format(res[0].EXCH_RATE));
            $("#pRefKey").val(res[0].REFERENCE_KEY);
            $("#pPaymentIndicator").val(res[0].PMT_IND);
            $("#pTransactionType").val(res[0].TRANS_TYPE);
            $("#pSpreadValue").val(res[0].SPREAD_VAL);
            $("#pAccountType").val(res[0].ACCT_TYPE);
            $("#pBusinessArea").val(res[0].BUS_AREA);
            $("#pTradingPartner").val(res[0].TPBA);
            $("#pAmountLc").val(new Intl.NumberFormat().format(res[0].AMT_LC));
            $("#pAmountTc").val(new Intl.NumberFormat().format(res[0].AMT_TC));
            $("#pAmountWhtBase").val(new Intl.NumberFormat().format(res[0].AMT_WITH_BASE_TC));
            $("#pAmountWht").val(new Intl.NumberFormat().format(res[0].AMT_WITH_TC));
            $("#pTotalTagihan").val(new Intl.NumberFormat().format(res[0].AMOUNT));
            $("#pAssignment").val(res[0].ASSIGNMENT);
            $("#pAmountBayar").val(res[0].AMOUNT_BAYAR);
            $("#pItemText").val(res[0].ITEM_TEXT);
            $("#pCostCtr").val(res[0].COST_CTR);
            $("#pGlAccount").val(res[0].GL_ACCT);
            $("#pNamaVendor").val(res[0].VENDOR);
            $("#pNamaCustomer").val(res[0].CUSTOMER);
            $("#pLineItem").val(res[0].LINE_ITEM);
            $("#pBaseline").val(res[0].BASE_DATE);
            $("#pTermOfPayment").val(res[0].TERM_PMT);
            $("#pTglDueOn").val(res[0].DUE_ON);
            $("#pPaymentBlock").val(res[0].PMT_BLOCK);
            $("#pHouseBank").val(res[0].HOUSE_BANK);
            $("#pPartnerBank").val(res[0].PRTNR_BANK_TYPE);
            $("#pPoNum").val(res[0].PO_NUM);
            $("#pRefKey1").val(res[0].REF_KEY1);
            $("#pRefKey2").val(res[0].REF_KEY2);
            $("#pRefKey3").val(res[0].REF_KEY3);
            $("#pIntOrder").val(res[0].INT_ORDER);
            $("#pWbsNum").val(res[0].WBS_NUM);
            //$("#pCashCode").val(res[0].CASH_CODE);
            setSelectCashCode("pCashCode",res[0].CASH_CODE);
            $("#pDebitCredit").val(res[0].DR_CR_IND);
            $("#pAmountWthBaseLc").val(new Intl.NumberFormat().format(res[0].AMT_WITH_BASE_LC));
            $("#pAmountWthLc").val(new Intl.NumberFormat().format(res[0].AMT_WITH_LC));
            $("#pBankPenerima").val(res[0].BANK_BENEF);
            $("#pKodeBankPenerima").val(res[0].KODE_BANK_PENERIMA);
            $("#pNoRekVendor").val(res[0].NO_REK_BENEF);
            $("#pAccountHolder").val(res[0].NAMA_BENEF);
            setSelectBankPembayar("pHouseBank",res[0].HOUSE_BANK);
            setSelectKodeBankPembayar("pHouseBankxx",'');
            setSelectNoRekening("pNoRekxx",'');
            $("#pNoRekPln").val(res[0].NO_REK_HOUSE_BANK2);
            $("#pMetodePembayaran").val(res[0].METODE_PEMBAYARAN);
            $("#pSumberDana").val(res[0].SUMBER_DANA);
            $("#pTglRencanaBayar").val(res[0].TGL_RENCANA_BAYAR);
            $("#pNewKeterangan").val(res[0].KETERANGAN);
            $("#pCustomerName").val(res[0].INQ_CUSTOMER_NAME);
            $("#pAccountNumber").val(res[0].INQ_ACCOUNT_NUMBER);
            $("#pAccountStatus").val(res[0].INQ_ACCOUNT_STATUS);
            $("#pRetrieval").val(res[0].RETRIEVAL_REF_NUMBER);
            $("#pCusRefNum").val(res[0].CUSTOMER_REF_NUMBER);
            $("#pJamBayar").val(res[0].JAM_BAYAR);
            $("#pConfirmationCode").val(res[0].CONFIRMATION_CODE);
            $("#pNoGiro").val(res[0].NO_GIRO);
            setSelectBankAccount("pNoRekPln","", res[0].CURRENCY, res[0].BANK_BYR);
            $('#pDocumentDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pExchRateDeals3').val(res[0].KURS_YG_DITENTUKAN);
            $('#pExchRateDeals3').mask('000,000,000,000,000.00',{reverse : true});

            if(res[0].METODE_PEMBAYARAN === "GIRO" || res[0].METODE_PEMBAYARAN === "INTERNETBANKING"){
                $("#btn-inquiry").hide();
            }else{
                $("#btn-inquiry").show();
            }

            if(res[0].METODE_PEMBAYARAN === "GIRO"){
                $(".pNoGiro").show();
                $("#jamBayar").hide();
            }else if(res[0].METODE_PEMBAYARAN === "INTERNETBANKING"){
                $(".pNoGiro").hide();
                $("#jamBayar").hide();
            }else{
                $(".pNoGiro").hide();
            }
        setTimeout(function(){ $('#edit-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function edit_checker(pCompCode, pNoDoc, pFiscYear, pLineItem,pSource, pBank,  pBeneficiaryAccount) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_belum/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pCompCode : pCompCode,
            pNoDoc : pNoDoc,
            pFiscYear : pFiscYear,
            pLineItem : pLineItem
        },
        success: function (res) {
            hideLoadingCss("");;
            $("#pKet3").val(res[0].KET);
            $("#pCompanyCode3").val(res[0].COMP_CODE);
            $("#pNoDoc3").val(res[0].DOC_NO);
            $("#pFiscYear3").val(res[0].FISC_YEAR);
            $("#pDocumentType3").val(res[0].DOC_TYPE);
            $("#pDocumentDate3").val(res[0].DOC_DATE2);
            $("#pPostDate3").val(res[0].POST_DATE2);
            $("#pEntryDate3").val(res[0].ENTRY_DATE2);
            $("#pReference3").val(res[0].REFERENCE);
            $("#pReverseWith3").val(res[0].REV_WITH);
            $("#pReverseYear3").val(res[0].REV_YEAR);
            $("#pDocHdr3").val(res[0].DOC_HDR_TXT);
            $("#pCurrency3").val(res[0].CURRENCY);
            $("#pExchRate3").val(res[0].EXCH_RATE);
            $("#pRefKey8").val(res[0].REFERENCE_KEY);
            $("#pPaymentIndicator3").val(res[0].PMT_IND);
            $("#pTransactionType3").val(res[0].TRANS_TYPE);
            $("#pSpreadValue3").val(res[0].SPREAD_VAL);
            $("#pAccountType3").val(res[0].ACCT_TYPE);
            $("#pBusinessArea3").val(res[0].BUS_AREA);
            $("#pTradingPartner3").val(res[0].TPBA);
            $("#pAmountLc3").val(res[0].AMT_LC);
            $("#pAmountTc3").val(res[0].AMT_TC);
            $("#pAmountWhtBase3").val(res[0].AMT_WITH_BASE_TC);
            $("#pAmountWht3").val(res[0].AMT_WITH_TC);
            $("#pTotalTagihan3").val(res[0].AMOUNT);
            $("#pAssignment3").val(res[0].ASSIGNMENT);
            $("#pItemText3").val(res[0].ITEM_TEXT);
            $("#pCostCtr3").val(res[0].COST_CTR);
            $("#pGlAccount3").val(res[0].GL_ACCT);
            $("#pNamaVendor3").val(res[0].VENDOR);
            $("#pNamaCustomer3").val(res[0].CUSTOMER);
            $("#pLineItem3").val(res[0].LINE_ITEM);
            $("#pBaseline3").val(res[0].BASE_DATE);
            $("#pTermOfPayment3").val(res[0].TERM_PMT);
            $("#pTglDueOn3").val(res[0].DUE_ON);
            $("#pPaymentBlock3").val(res[0].PMT_BLOCK);
            $("#pHouseBank3").val(res[0].HOUSE_BANK);
            $("#pPartnerBank3").val(res[0].PRTNR_BANK_TYPE);
            $("#pPoNum3").val(res[0].PO_NUM);
            $("#pRefKey10").val(res[0].REF_KEY1);
            $("#pRefKey11").val(res[0].REF_KEY2);
            $("#pRefKey12").val(res[0].REF_KEY3);
            $("#pIntOrder3").val(res[0].INT_ORDER);
            $("#pWbsNum3").val(res[0].WBS_NUM);
            $("#pCashCode3").val(res[0].CASH_CODE);
            $("#pDebitCredit3").val(res[0].DR_CR_IND);
            $("#pAmountWthBaseLc3").val(res[0].AMT_WITH_BASE_LC);
            $("#pAmountWthLc3").val(res[0].AMT_WITH_LC);
            $("#pBankPenerima3").val(res[0].BANK_KEY);
            $("#pKodeBankPenerima3").val(res[0].KODE_BANK_PENERIMA);
            $("#pNoRekVendor3").val(res[0].BANK_ACCOUNT);
            $("#pAccountHolder3").val(res[0].ACCOUNT_HOLDER);
            $("#pHouseBank3").val(res[0].HOUSE_BANK);
            $("#pNoRekPln3").val(res[0].NO_REK_HOUSE_BANK);
            $("#pMetodePembayaran3").val(res[0].METODE_PEMBAYARAN);
            $("#pSumberDana3").val(res[0].SUMBER_DANA);
            $("#pTglRencanaBayar3").val(res[0].TGL_RENCANA_BAYAR);
            $("#pTglActBayar3").val(res[0].TGL_ACT_BAYAR);
            $("#pNewKeterangan3").val(res[0].KETERANGAN);
            $("#pCustomerName3").val(res[0].INQ_CUSTOMER_NAME);
            $("#pAccountNumber3").val(res[0].INQ_ACCOUNT_NUMBER);
            $("#pAccountStatus3").val(res[0].INQ_ACCOUNT_STATUS);
            $("#pRetrieval3").val(res[0].RETRIEVAL_REF_NUMBER);
            $("#pCusRefNum3").val(res[0].CUSTOMER_REF_NUMBER);
            $("#pConfirmationCode3").val(res[0].CONFIRMATION_CODE);

            $('#pDocumentDate3').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate3').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar3').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglActBayar3').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn3').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate3').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline3').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

           //setSelectBankPembayar("pHouseBank",res[0].NAMA_BANK);
           /// setSelectBankAccount("pNoRekPln", tempBankPembayar);
           // setSelectSaldo("pSaldo", tempBankAccount);


            setTimeout(function(){ $('#edit-checker').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function cek_data(pCompCode, pNoDoc, pFiscYear, pLineItem, pSource, pBank,  pBeneficiaryAccount) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_belum/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pCompCode : pCompCode,
            pNoDoc : pNoDoc,
            pFiscYear : pFiscYear,
            pLineItem : pLineItem
        },
        success: function (res) {
            hideLoadingCss("");
            getInquiry(pSource, pBank,  pBeneficiaryAccount);
            $("#pKet2").val(res[0].KET);
            $("#pCompanyCode2").val(res[0].COMP_CODE);
            $("#pNoDoc2").val(res[0].DOC_NO);
            $("#pFiscYear2").val(res[0].FISC_YEAR);
            $("#pDocumentType2").val(res[0].DOC_TYPE);
            $("#pDocumentDate2").val(res[0].DOC_DATE2);
            $("#pPostDate2").val(res[0].POST_DATE2);
            $("#pEntryDate2").val(res[0].ENTRY_DATE2);
            $("#pReference2").val(res[0].REFERENCE);
            $("#pReverseWith2").val(res[0].REV_WITH);
            $("#pReverseYear2").val(res[0].REV_YEAR);
            $("#pDocHdr2").val(res[0].DOC_HDR_TXT);
            $("#pCurrency2").val(res[0].CURRENCY);
            $("#pExchRate2").val(res[0].EXCH_RATE);
            $("#pRefKey4").val(res[0].REFERENCE_KEY);
            $("#pPaymentIndicator2").val(res[0].PMT_IND);
            $("#pTransactionType2").val(res[0].TRANS_TYPE);
            $("#pSpreadValue2").val(res[0].SPREAD_VAL);
            $("#pAccountType2").val(res[0].ACCT_TYPE);
            $("#pBusinessArea2").val(res[0].BUS_AREA);
            $("#pTradingPartner2").val(res[0].TPBA);
            $("#pAmountLc2").val(res[0].AMT_LC);
            $("#pAmountTc2").val(res[0].AMT_TC);
            $("#pAmountWhtBase2").val(res[0].AMT_WITH_BASE_TC);
            $("#pAmountWht2").val(res[0].AMT_WITH_TC);
            $("#pTotalTagihan2").val(res[0].AMOUNT);
            $("#pAssignment2").val(res[0].ASSIGNMENT);
            $("#pItemText2").val(res[0].ITEM_TEXT);
            $("#pCostCtr2").val(res[0].COST_CTR);
            $("#pGlAccount2").val(res[0].GL_ACCT);
            $("#pNamaVendor2").val(res[0].VENDOR);
            $("#pNamaCustomer2").val(res[0].CUSTOMER);
            $("#pLineItem2").val(res[0].LINE_ITEM);
            $("#pBaseline2").val(res[0].BASE_DATE);
            $("#pTermOfPayment2").val(res[0].TERM_PMT);
            $("#pTglDueOn2").val(res[0].DUE_ON);
            $("#pPaymentBlock2").val(res[0].PMT_BLOCK);
            $("#pHouseBank2").val(res[0].HOUSE_BANK);
            $("#pPartnerBank2").val(res[0].PRTNR_BANK_TYPE);
            $("#pPoNum2").val(res[0].PO_NUM);
            $("#pRefKey5").val(res[0].REF_KEY1);
            $("#pRefKey6").val(res[0].REF_KEY2);
            $("#pRefKey7").val(res[0].REF_KEY3);
            $("#pIntOrder2").val(res[0].INT_ORDER);
            $("#pWbsNum2").val(res[0].WBS_NUM);
            $("#pCashCode2").val(res[0].CASH_CODE);
            $("#pDebitCredit2").val(res[0].DR_CR_IND);
            $("#pAmountWthBaseLc2").val(res[0].AMT_WITH_BASE_LC);
            $("#pAmountWthLc2").val(res[0].AMT_WITH_LC);
            $("#pAmountBayar2").val(res[0].AMOUNT);
            //$("#pNoGiro").val(res[0].NO_GIRO);
            //$("#pNoNotDin").val(res[0].NOTA_DINAS);
            $("#pBankPenerima2").val(res[0].BANK_KEY);
            $("#pNoRekVendor2").val(res[0].BANK_ACCOUNT);
            $("#pAccountHolder2").val(res[0].ACCOUNT_HOLDER);
            $("#pBankPembayarans2").val(res[0].HOUSE_BANK);
            $("#pNoRekPLN2").val(res[0].NO_REK_HOUSE_BANK);
            $("#pMetodePembayaran2").val(res[0].METODE_PEMBAYARAN);
            $("#pTglRencanaBayar2").val(res[0].TGL_RENCANA_BAYAR);
            $("#pTglActBayar2").val(res[0].TGL_ACT_BAYAR);
            $("#pSumberDana2").val(res[0].SUMBER_DANA);
            $("#pNewKeterangan2").val(res[0].KETERANGAN);
            $("#pKodeCashFlow").val(res[0].CASH_CODE);
            //$("#pNoRekPln").val(res[0].HOUSE_BANK);
            //$("#pSaldo").val(res[0].HOUSE_BANK);

            $('#pDocumentDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar2').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglActBayar2').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

//            $("#pCustomerName").val(res.data.customerName);
//            $("#pAccountNumber").val(res.data.accountNumber);
//            $("#pAccountStatus").val(res.data.accountStatus);
//            $("#pRespon2").val(tes);

            setTimeout(function(){ $('#detail-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function showColumn() {
    $("#hide_column_modal").modal("show");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_column",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var response = res.data[0];
            $("#hide_column_modal").find(".checkbox-toggle").prop("checked",true);
            for(const col in response) {
                $("#hide_column_modal").find(`#${col}`).prop("checked",false);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function saveColumn() {
    var hc0 = $("#NOMOR").prop('checked');
    var hc1 = $("#KET").prop('checked');
    var hc2 = $("#COMP_CODE").prop('checked');
    var hc3 = $("#DOC_NO").prop('checked');
    var hc4 = $("#GROUP_ID").prop('checked');
    var hc5 = $("#OSS_ID").prop('checked');
    var hc6 = $("#FISC_YEAR").prop('checked');
    var hc7 = $("#DOC_TYPE").prop('checked');
    var hc8 = $("#DOC_DATE").prop('checked');
    var hc9 = $("#POST_DATE").prop('checked');
    var hc10 = $("#ENTRY_DATE").prop('checked');
    var hc11 = $("#REFERENCE").prop('checked');
    var hc12 = $("#REV_WITH").prop('checked');
    var hc13 = $("#REV_YEAR").prop('checked');
    var hc14 = $("#DOC_HDR_TXT").prop('checked');
    var hc15 = $("#CURRENCY").prop('checked');
    var hc16 = $("#CURR_BAYAR").prop('checked');
    var hc17 = $("#EXCH_RATE").prop('checked');
    var hc18 = $("#REFERENCE_KEY").prop('checked');
    var hc19 = $("#PMT_IND").prop('checked');
    var hc20 = $("#TRANS_TYPE").prop('checked');
    var hc21 = $("#SPREAD_VAL").prop('checked');
    var hc22 = $("#LINE_ITEM").prop('checked');
    var hc23 = $("#OI_IND").prop('checked');
    var hc24 = $("#ACCT_TYPE").prop('checked');
    var hc25 = $("#SPEC_GL").prop('checked');
    var hc26 = $("#BUS_AREA").prop('checked');
    var hc27 = $("#TPBA").prop('checked');
    var hc28 = $("#AMT_LC").prop('checked');
    var hc29 = $("#AMT_TC").prop('checked');
    var hc30 = $("#AMT_WITH_BASE_TC").prop('checked');
    var hc31 = $("#AMT_WITH_TC").prop('checked');
    var hc32 = $("#AMOUNT").prop('checked');
    var hc33 = $("#AMOUNT_BAYAR").prop('checked');
    var hc34 = $("#ASSIGNMENT").prop('checked');
    var hc35 = $("#ITEM_TEXT").prop('checked');
    var hc36 = $("#COST_CTR").prop('checked');
    var hc37 = $("#GL_ACCT").prop('checked');
    var hc38 = $("#CUSTOMER_NAME").prop('checked');
    var hc39 = $("#VENDOR_NAME").prop('checked');
    var hc40 = $("#BASE_DATE").prop('checked');
    var hc41 = $("#TERM_PMT").prop('checked');
    var hc42 = $("#DUE_ON").prop('checked');
    var hc43 = $("#PMT_BLOCK").prop('checked');
    var hc44 = $("#HOUSE_BANK").prop('checked');
    var hc45 = $("#NO_REK_HOUSE_BANK").prop('checked');
    var hc46 = $("#PRTNR_BANK_TYPE").prop('checked');
    var hc47 = $("#BANK_KEY").prop('checked');
    var hc48 = $("#BANK_ACCOUNT").prop('checked');
    var hc49 = $("#ACCOUNT_HOLDER").prop('checked');
    var hc50 = $("#NAMA_BENEF").prop('checked');
    var hc51 = $("#NO_REK_BENEF").prop('checked');
    var hc52 = $("#BANK_BENEF").prop('checked');
    var hc53 = $("#PO_NUM").prop('checked');
    var hc54 = $("#PO_ITEM").prop('checked');
    var hc55 = $("#REF_KEY1").prop('checked');
    var hc56 = $("#REF_KEY2").prop('checked');
    var hc57 = $("#REF_KEY3").prop('checked');
    var hc58 = $("#INT_ORDER").prop('checked');
    var hc59 = $("#WBS_NUM").prop('checked');
    var hc60 = $("#CASH_CODE").prop('checked');
    var hc61 = $("#DR_CR_IND").prop('checked');
    var hc62 = $("#PARTIAL_IND").prop('checked');
    var hc63 = $("#AMT_WITH_BASE_LC").prop('checked');
    var hc64 = $("#AMT_WITH_LC").prop('checked');
    var hc65 = $("#METODE_PEMBAYARAN").prop('checked');
    var hc66 = $("#NO_GIRO").prop('checked');
    var hc67 = $("#TGL_TAGIHAN_DITERIMA").prop('checked');
    var hc68 = $("#TGL_RENCANA_BAYAR").prop('checked');
    var hc69 = $("#SUMBER_DANA").prop('checked');
    var hc70 = $("#KETERANGAN").prop('checked');
    var hc71 = $("#STATUS_TRACKING").prop('checked');
    var hc72 = $("#REF_NUM_BANK").prop("checked");

    var data = {
        "nomor" : hc0 === true ? 1 : 0,
        "ket" : hc1 === true ? 1 : 0,
        "comp_code" : hc2 === true ? 1 : 0,
        "doc_no" : hc3 === true ? 1 : 0,
        "group_id" : hc4 === true ? 1 : 0,
        "oss_id" : hc5 === true ? 1 : 0,
        "fisc_year" : hc6 === true ? 1 : 0,
        "doc_type" : hc7 === true ? 1 : 0,
        "doc_date2" : hc8 === true ? 1 : 0,
        "post_date2" : hc9 === true ? 1 : 0,
        "entry_date2" : hc10 === true ? 1 : 0,
        "reference" : hc11 === true ? 1 : 0,
        "rev_with" : hc12 === true ? 1 : 0,
        "rev_year" : hc13 === true ? 1 : 0,
        "doc_hdr_txt" : hc14 === true ? 1 : 0,
        "currency" : hc15 === true ? 1 : 0,
        "curr_bayar" : hc16 === true ? 1 : 0,
        "exch_rate" : hc17 === true ? 1 : 0,
        "reference_key" : hc18 === true ? 1 : 0,
        "pmt_ind" : hc19 === true ? 1 : 0,
        "trans_type" : hc20 === true ? 1 : 0,
        "spread_val" : hc21 === true ? 1 : 0,
        "line_item" : hc22 === true ? 1 : 0,
        "oi_ind" : hc23 === true ? 1 : 0,
        "spec_gl" : hc24 === true ? 1 : 0,
        "acct_type" : hc25 === true ? 1 : 0,
        "bus_area" : hc26 === true ? 1 : 0,
        "tpba" : hc27 === true ? 1 : 0,
        "amt_lc" : hc28 === true ? 1 : 0,
        "amt_tc" : hc29 === true ? 1 : 0,
        "amt_with_base_tc" : hc30 === true ? 1 : 0,
        "amt_with_tc" : hc31 === true ? 1 : 0,
        "amount" : hc32 === true ? 1 : 0,
        "amount_bayar" : hc33 === true ? 1 : 0,
        "assignment" : hc34 === true ? 1 : 0,
        "item_text" : hc35 === true ? 1 : 0,
        "cost_ctr" : hc36 === true ? 1 : 0,
        "gl_acct" : hc37 === true ? 1 : 0,
        "customer" : hc38 === true ? 1 : 0,
        "vendor" : hc39 === true ? 1 : 0,
        "base_date" : hc40 === true ? 1 : 0,
        "term_pmt" : hc41 === true ? 1 : 0,
        "due_on" : hc42 === true ? 1 : 0,
        "pmt_block" : hc43 === true ? 1 : 0,
        "house_bank" : hc44 === true ? 1 : 0,
        "no_rek_house_bank" : hc45 === true ? 1 : 0,
        "prtnr_bank_type" : hc46 === true ? 1 : 0,
        "bank_key" : hc47 === true ? 1 : 0,
        "bank_account" : hc48 === true ? 1 : 0,
        "account_holder" : hc49 === true ? 1 : 0,
        "nama_benef" : hc50 === true ? 1 : 0,
        "no_rek_benef" : hc51 === true ? 1 : 0,
        "bank_benef" : hc52 === true ? 1 : 0,
        "po_num" : hc53 === true ? 1 : 0,
        "po_item" : hc54 === true ? 1 : 0,
        "ref_key1" : hc55 === true ? 1 : 0,
        "ref_key2" : hc56 === true ? 1 : 0,
        "ref_key3" : hc57 === true ? 1 : 0,
        "int_order" : hc58 === true ? 1 : 0,
        "wbs_num" : hc59 === true ? 1 : 0,
        "dr_cr_ind" : hc60 === true ? 1 : 0,
        "cash_code" : hc61 === true ? 1 : 0,
        "partial_ind" : hc62 === true ? 1 : 0,
        "amt_with_base_lc" : hc63 === true ? 1 : 0,
        "amt_with_lc" : hc64 === true ? 1 : 0,
        "metode_pembayaran" : hc65 === true ? 1 : 0,
        "no_giro" : hc66 === true ? 1 : 0,
        "tgl_tagihan_diterima" : hc67 === true ? 1 : 0,
        "tgl_rencana_bayar" : hc68 === true ? 1 : 0,
        "sumber_dana" : hc69 === true ? 1 : 0,
        "keterangan" : hc70 === true ? 1 : 0,
        "status_tracking" : hc71 === true ? 1 : 0,
        "ref_num_bank" : hc72 === true ? 1 : 0,

        "bank_byr" : 0,
        "tgl_act_bayar" : 0,
        "corp_pmt" : 0,
        "inq_customer_name" : 0,
        "inq_account_number" : 0,
        "retrieval_ref_number" : 0,
        "customer_ref_number" : 0,
        "confirmation_code" : 0,
        "verified_by" : 0,
        "verified_on" : 0,
    };

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/save_column",
        dataType: 'JSON',
        type: "POST",
        data: data,
        success: function (res) {
            alert(res.data);
            document.location.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function detail_data(pCompCode, pNoDoc, pFiscYear, pLineItem) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_belum/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pCompCode : pCompCode,
            pNoDoc : pNoDoc,
            pFiscYear : pFiscYear,
            pLineItem : pLineItem
        },
        success: function (res) {
            hideLoadingCss("");
            $("#pKet2").val(res[0].KET);
            $("#pCompanyCode2").val(res[0].COMP_CODE);
            $("#pNoDoc2").val(res[0].DOC_NO);
            $("#pFiscYear2").val(res[0].FISC_YEAR);
            $("#pDocumentType2").val(res[0].DOC_TYPE);
            $("#pDocumentDate2").val(res[0].DOC_DATE2);
            $("#pPostDate2").val(res[0].POST_DATE2);
            $("#pEntryDate2").val(res[0].ENTRY_DATE2);
            $("#pReference2").val(res[0].REFERENCE);
            $("#pOssId2").val(res[0].OSS_ID);
            $("#pGroupId2").val(res[0].GROUP_ID);
            $("#pReverseWith2").val(res[0].REV_WITH);
            $("#pReverseYear2").val(res[0].REV_YEAR);
            $("#pDocHdr2").val(res[0].DOC_HDR_TXT);
            $("#pCurrency2").val(res[0].CURRENCY);
            $("#pCurrBayar2").val(res[0].CURR_BAYAR);
            $("#pExchRate2").val(res[0].EXCH_RATE);
            $("#pRefKey4").val(res[0].REFERENCE_KEY);
            $("#pPaymentIndicator2").val(res[0].PMT_IND);
            $("#pTransactionType2").val(res[0].TRANS_TYPE);
            $("#pSpreadValue2").val(res[0].SPREAD_VAL);
            $("#pAccountType2").val(res[0].ACCT_TYPE);
            $("#pBusinessArea2").val(res[0].BUS_AREA);
            $("#pTradingPartner2").val(res[0].TPBA);
            $("#pAmountLc2").val(res[0].AMT_LC);
            $("#pAmountTc2").val(res[0].AMT_TC);
            $("#pAmountWhtBase2").val(res[0].AMT_WITH_BASE_TC);
            $("#pAmountWht2").val(res[0].AMT_WITH_TC);
            $("#pTotalTagihan2").val(res[0].AMOUNT);
            $("#pAssignment2").val(res[0].ASSIGNMENT);
            $("#pItemText2").val(res[0].ITEM_TEXT);
            $("#pCostCtr2").val(res[0].COST_CTR);
            $("#pGlAccount2").val(res[0].GL_ACCT);
            $("#pNamaVendor2").val(res[0].VENDOR);
            $("#pNamaCustomer2").val(res[0].CUSTOMER);
            $("#pBaseline2").val(res[0].BASE_DATE);
            $("#pTermOfPayment2").val(res[0].TERM_PMT);
            $("#pTglDueOn2").val(res[0].DUE_ON);
            $("#pLineItem2").val(res[0].LINE_ITEM);
            $("#pPaymentBlock2").val(res[0].PMT_BLOCK);
            $("#pHouseBank2").val(res[0].HOUSE_BANK);
            $("#pPartnerBank2").val(res[0].PRTNR_BANK_TYPE);
            $("#pNoRekVendor2").val(res[0].NO_REK_BENEF);
            $("#pBankPenerima2").val(res[0].BANK_BENEF);
            $("#pNamaBankPenerima2").val(res[0].BANK_BENEF);
            $("#pKodeBankPenerima2").val(res[0].KODE_BANK_PENERIMA);
            $("#pAccountHolder2").val(res[0].NAMA_BENEF);
            $("#pBankPembayarans2").val(res[0].BANK_BYR2);
            $("#pNoRekPLN2").val(res[0].NO_REK_HOUSE_BANK);
            $("#pPoNum2").val(res[0].PO_NUM);
            $("#pRefKey5").val(res[0].REF_KEY1);
            $("#pRefKey6").val(res[0].REF_KEY2);
            $("#pRefKey7").val(res[0].REF_KEY3);
            $("#pIntOrder2").val(res[0].INT_ORDER);
            $("#pWbsNum2").val(res[0].WBS_NUM);
            $("#pCashCode2").val(res[0].CASH_CODE);
            $("#pDebitCredit2").val(res[0].DR_CR_IND);
            $("#pAmountWthBaseLc2").val(res[0].AMT_WITH_BASE_LC);
            $("#pAmountWthLc2").val(res[0].AMT_WITH_LC);
            $("#pMetodePembayaran2").val(res[0].METODE_PEMBAYARAN);
            $("#pTglRencanaBayar2").val(res[0].TGL_RENCANA_BAYAR);
            $("#pJamBayar2").val(res[0].JAM_BAYAR)
            $("#pTglActBayar2").val(res[0].TGL_ACT_BAYAR);
            $("#pSumberDana2").val(res[0].SUMBER_DANA);
            //$("#pNoGiro").val(res[0].NO_GIRO);
            $("#pKodeCashFlow2").val(res[0].CASH_CODE);
            $("#pCustomerName2").val(res[0].INQ_CUSTOMER_NAME);
            $("#pAccountNumber2").val(res[0].INQ_ACCOUNT_NUMBER);
            $("#pAccountStatus2").val(res[0].INQ_ACCOUNT_STATUS);
            $("#pRetrieval2").val(res[0].RETRIEVAL_REF_NUMBER);
            $("#pCusRefNum2").val(res[0].CUSTOMER_REF_NUMBER);
            $("#pConfirmationCode2").val(res[0].CONFIRMATION_CODE);
            //$("#pNoNotDin2").val(res[0].NOTA_DINAS);

            //$("#pSaldo").val(res[0].HOUSE_BANK);
            $("#pNewKeterangan2").val(res[0].KETERANGAN);
            $('#pDocumentDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar2').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglActBayar2').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $("#pStatusValidasi2").val("");

            setSelectBankPembayar("pBankPembayaran2",res[0].NAMA_BANK);
            setSelectBankAccount("pNoRekPln2", tempBankPembayar);
            setSelectSaldo("pSaldo2", tempBankAccount);



            kirimToken(pCompCode, pNoDoc);
            if($("#pStatusValidasi2").val() == "VALID"){
                if ($("#pJamBayar2").val() === "IMMEDIATE PAYMENT"){
                    $("#btn_siap_corpay").hide();
                    $("#btn-payment").show();
                }else{
                    $("#btn_siap_corpay").show();
                    $("#btn-payment").hide();
                }
            }else{
                $("#btn-payment").hide();
                $("#btn_siap_corpay").hide();
            }
            setTimeout(function(){ $('#detail-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}
function edit_data2() {
        showLoadingCss();
        $.ajax({
            dataType: 'JSON',
            type: "GET",
            data : {
                pBank : '',
                pSource : '',
                pBeneficiary : ''
            },
            success: function (res)  {
                hideLoadingCss("")
                //// // console.log("data edit_data :",res);
                //$("#pKet").val(res[0].KET);
                //$("#pCompanyCode").val(res[0].COMP_CODE);
                //$("#pNoDoc").val(res[0].DOC_NO);
                setTimeout(function(){ $('#edit-modal2').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
}

function setSelectBankPembayar(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_bank_pembayar",
        dataType: 'JSON',
        type: "GET",
        sync :true,
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.NAMA_BANK + '">'+val.NAMA_BANK+'</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pBankPembayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectCashCode(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_cash_code",
        dataType: 'JSON',
        type: "GET",
        sync :true,
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.CASH_CODE + '">'+val.CASH_CODE+'-'+val.CASH_DESCRIPTION+'</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pBankPembayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectHouseBank(idHtml, pAccount, idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_house_bank",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pAccount: pAccount
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.HOUSE_BANK + '">' + val.HOUSE_BANK + '-' + val.NAMA_BANK +'</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectBankAccount(idHtml, idForSelected, currency, kodeBank) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_no_rekening",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pCurrency: currency,
            pKodeBank: kodeBank,
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            if(res.length <=0){
                $("#" + idHtml + "").append('<option value="">Pilih Data</option>');
            }

            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.BANK_ACCOUNT + '">' + val.BANK_ACCOUNT+'</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectKodeBankPembayar(idHtml, pCurrency, idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_kode_bank_pembayar",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pCurrency: $("#pCurrency").val(),
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.HOUSE_BANK + '">' + val.HOUSE_BANK + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectKodeBankPenerima(idHtml, pSingkatan, idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_kode_bank_penerima",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pSingkatan: $("#pSingkatan").val(),
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.KODE_BANK + '">' + val.KODE_BANK + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectNoRekening(idHtml, pKodeBank, idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_no_rekening",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pCurrency: $("#pCurrency").val(),
            pKodeBank: pKodeBank
        },
        success: function (res) {
            if (res.length <=0) return;
             $("#" + idHtml + "").html('');

             //// // console.log(pNoRekening);
             $("#" + idHtml + "").val(res[0].BANK_BYR);
             //// // console.log(res[0].BANK_ACCOUNT);

                         // $.each(res, function (key, val) {
                         //    //var pSisaAnggaran = val.SISA_ANGGARAN;
                         //     // // console.log(val);
                         //     $("#" + idHtml + "").val(pSisaAnggaran);
                         // });

                     },
                     error: function () {
                         $("#" + idHtml + "").html('-');
                     }
                 });
}

function setSelectNamaBank(idHtml, pCurrency, pKodeBank, idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_nama_bank",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pCurrency: pCurrency,
            pKodeBank: pKodeBank
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.NAMA_BANK + '">' + val.NAMA_BANK + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectSaldo(idHtml, bankAccount, idForSelected) {
    if(bankAccount!=""){
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/get_saldo",
            dataType: 'JSON',
            type: "GET",
            async : false,
            data: {
                pBankAccount: bankAccount

            },
            success: function (res) {
                $("#" + idHtml + "").html('');

                $.each(res, function (key, val) {
                    var pSaldo = val.RUPIAH;
                    $("#" + idHtml + "").val(pSaldo);

                    nilaiAnggaran = val.SISA_ANGGARAN;
                });

            },
            error: function () {
                $("#" + idHtml + "").html('-');
            }
        });
    }
}

function setSelectAccountName(idHtml, bankAccount, idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_account_name",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pBankAccount: bankAccount
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.DESCRIPTION + '">' + val.DESCRIPTION + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function update_pembayaran() {
    if ($("#pMetodePembayaran").val() === 'GIRO' && $('#pNoGiro').val() === ""){
        alert("Maaf, NO GIRO harus diisi untuk Jenis Pembayaran GIRO.");
    }

    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/update_pembayaran",
        dataType: 'JSON',
        type: "POST",
        data: {
            pCompCode: $("#pCompanyCode").val(),
            pDocNo: $("#pNoDoc").val(),
            pFiscYear: $("#pFiscYear").val(),
            pLineItem: $("#pLineItem").val(),
            pKet: $("#pKet").val(),
            pBankPembayar: $("#pBankPembayaran").val(),
            pKeterangan: $("#pRemarks").val(),
            pTglRencanaBayar: $("#pTglRencanaBayar").val(),
            pSumberDana: $("#pSumberDana").val(),
            pMetodePembayaran: $("#pMetodePembayaran").val(),
            pNoRekHouseBank : $("#pNoRekPln").val(),
            pInqCustomerName : $("#pCustomerName").val(),
            pInqAccountNumber : $("#pAccountNumber").val(),
            pInqAccountStatus : $("#pAccountStatus").val(),
            pKodeBankPenerima : $("#pKodeBankPenerima").val(),
            pRetrievalRefNumber : $("#pRetrieval").val(),
            pCustomerRefNumber : $("#pCusRefNum").val(),
            pConfirmationCode : $("#pConfirmationCode").val(),
            pTglActBayar : $("#pTglActBayar").val(),
            pJamBayar : $("#pJamBayar").val(),
            pOssId : $("#pOssId").val(),
            pGroupId : $("#pGroupId").val(),
            pNoGiro : ($("#pMetodePembayaran").val() === 'GIRO') ? $('#pNoGiro').val().trim() : "-",
            pRefNum : $("#pCusRefNum").val(),
            pExchRateDeals : $("#pExchRateDeals3").val() === "-" ? "" : $("#pExchRateDeals3").val().toString().replace(/,/g,"") ,
        },
        success: function (res) {
            //// // console.log("COBA DIAZ :",res);
                    hideLoadingCss("")
                    //var result = res.return.split(";")[0];
                    //var result = res;
                    if (res.return == 1) {
                        alert(res.OUT_MSG);
                        search("load");
                        $('#edit-modal').modal('hide');
                        table_rekapitulasi.ajax.reload();
                    } else {
                        alert(res.OUT_MSG);
                    }
                    invoiceCheckedArray = new Array();
                    fullArrayGroup = new Array();
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
                }
            });
}

function update_pembayaran2() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/update_pembayaran",
        dataType: 'JSON',
        type: "POST",
        data: {
            pCompCode: $("#pCompanyCode3").val(),
            pDocNo: $("#pNoDoc3").val(),
            pFiscYear: $("#pFiscYear3").val(),
            pLineItem: $("#pLineItem3").val(),
            pKet: $("#pKet3").val(),
            pBankPembayar: $("#pBankPembayaran3").val(),
            pKeterangan: $("#pNewKeterangan3").val(),
            pTglRencanaBayar: $("#pTglRencanaBayar3").val(),
            pSumberDana: $("#pSumberDana3").val(),
            pMetodePembayaran: $("#pMetodePembayaran3").val(),
            pNoRekHouseBank : $("#pNoRekPln3").val(),
            pInqCustomerName : $("#pCustomerName3").val(),
            pInqAccountNumber : $("#pAccountNumber3").val(),
            pInqAccountStatus : $("#pAccountStatus3").val(),
            pKodeBankPenerima : $("#pKodeBankPenerima3").val(),
            pRetrievalRefNumber : $("#pRetrieval3").val(),
            pCustomerRefNumber : $("#pCusRefNum3").val(),
            pConfirmationCode : $("#pConfirmationCode3").val(),
            pTglActBayar : $("#pTglActBayar3").val(),
        },
        success: function (res) {
            //// // console.log("COBA DIAZ :",res);
                    hideLoadingCss("");
                    //var result = res.return.split(";")[0];
                    //var result = res;
                    if (res.return == 1) {
                        alert(res.OUT_MSG);
                        search("load");
                        $('#edit-checker').modal('hide');
                        table_rekapitulasi.ajax.reload();
                    } else {
                        alert(res.OUT_MSG);
                    }
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
                }
            });
}

function update_status(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking, pCustomerName, pAccountNumber, pOssId, pGroupId, track){
    if (track === 'INPUT DATA'){
        alert("Silahkan Tentukan Metode Pembayaran Terlebih Dahulu");
    }else{
        let stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
        if (stateCrf === true) {
            showLoadingCss();
            $.ajax({
                url: baseUrl + "api_operator/rekap_invoice_belum/update_status",
                dataType: 'JSON',
                type: "POST",
                data: {
                    pCompCode: pCompCode,
                    pDocNo: pDocNo,
                    pFiscYear: pFiscYear,
                    pLineItem: pLineItem,
                    pKet: pKet,
                    pStatusTracking: pStatusTracking,
                    pCustomerName : pCustomerName,
                    pAccountNumber: pAccountNumber,
                    pOssId: pOssId,
                    pGroupId: pGroupId
                },
                success: function (res) {
                    hideLoadingCss("")
                    if (res.return == 1) {
                        alert(res.OUT_MSG);
                        table_rekapitulasi.ajax.reload();
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
}

function update_status_giro(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking, pOssId, pGroupId){
    if (pStatusTracking === 'INPUT DATA'){
        alert('Silahkan Tentukan Metode Pembayaran Terlebih Dahulu');
    }else{
        var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
        if (stateCrf === true) {
            showLoadingCss();
            $.ajax({
                url: baseUrl + "api_operator/rekap_invoice_belum/update_status_giro",
                dataType: 'JSON',
                type: "POST",
                data: {
                    pCompCode: pCompCode,
                    pDocNo: pDocNo,
                    pFiscYear: pFiscYear,
                    pLineItem: pLineItem,
                    pKet: pKet,
                    pStatusTracking: pStatusTracking,
                    pOssId : pOssId,
                    pGroupId : pGroupId
                },
                success: function (res) {
                    hideLoadingCss("")
                    if (res.return == 1) {
                        alert(res.OUT_MSG);
                        table_rekapitulasi.ajax.reload();
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
}

function getBallance2(pBank, pSource, pBeneficiary){
    var stateCrf = confirm("Anda Data Yang Anda Masukan Sudah Benar?");
    if (stateCrf == true) {
        $("#getBalanceBtn").attr("disabled",true);
        $("#getBalanceBtn").html("Memproses...");
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/get_Ballance2",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pBank: $("#pBanks").val(),
                 pSource: $("#pSources").val(),
                 pBeneficiary: $("#pSources").val(),
            },
            success: function (res) {
                var tes = JSON.stringify(res);
                console.log(res);

                if (res.responseMessage === 'Sukses') {
                    alert(res.responseMessage);
                    // table_rekapitulasi.ajax.reload();
                    $("#pAccountNames").val(res.data.accountName);
                    $("#pAccountBalances").val(accounting.formatNumber(res.data.accountBalance,2,".",","));
                    $("#pRespons").val(res.successMessage);
                }
                else {
                   alert(res.responseMessage);
                   // table_rekapitulasi.ajax.reload();
                   $("#pRespons").val(res.errorMessage);
                }
                $("#getBalanceBtn").attr("disabled",false);
                $("#getBalanceBtn").html("Submit");
            },
            error: function (err) {
                alert(err.responseMessage);
                $("#getBalanceBtn").attr("disabled", false);
                $("#getBalanceBtn").html("Submit");
            }
        });
    }
}

function getInquiry(pMetodeBayar, pBank, pSource, pAccountNumber,  pBeneficiaryAccount, pDestinationBankCode){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Inquiry ?");
    if (stateCrf == true) {
        $("#btn-inquiry").attr("disabled",true);
        $("#btn-inquiry").html("Memproses...");
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/inquiry",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pMetodeBayar: $("#pMetodePembayaran").val(),
                 pBank: $("#pBankBayar").val(), //house bank
                 pSource: $("#pNoRekPln").val(), //norek house bank
                 pAccountNumber: $("#pNoRekPln").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor").val(),
                 pDestinationBankCode: $("#pKodeBankPenerima").val(),
            },
            success: function (res) {
                var tes = JSON.stringify(res);
                if (res.responseMessage == 'Sukses') {
                    if (res.data.hasOwnProperty('customerReferenceNumber') === false || res.data.customerReferenceNumber === null || res.data.customerReferenceNumber === ""){
                        res.data.customerReferenceNumber = createReferenceNumber();
                    }
                   alert(res.responseMessage);
                   $("#pRespon2").val(res.responseMessage);
                   $("#pCustomerName").val(res.data.beneficiaryName);
                   //$("#pCustomerName").val(res.data.destinationAccountName);
                   $("#pAccountNumber").val(res.data.beneficiaryAccount);
                   //$("#pAccountNumber").val(res.data.destinationAccountNumber);
                   $("#pRetrieval").val(res.data.retrievalReffNum);
                   $("#pCusRefNum").val(res.data.customerReferenceNumber);
                   $("#pAccountStatus").val(res.data.accountStatus);
                   $("#pConfirmationCode").val(res.data.confirmationCode);
                  }
                else {
                    alert(res.responseMessage);
                    $("#pRespon2").val(res.errorMessage);
                 }
                $("#btn-inquiry").attr("disabled", false);
                $("#btn-inquiry").html("Inquiry");
            },
            error: function () {
                alert("Gagal Melakukan Proses,Harap Hubungi Administrator");
                $("#btn-inquiry").attr("disabled", false);
                $("#btn-inquiry").html("Inquiry");
            }
        });
    }
}

function getPaymentStatus(pBank, pRefNum){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Cek Payment Status ?");
    if (stateCrf == true) {
        $("#paymentStatusBtn").attr("disabled",true);
        $("#paymentStatusBtn").html("Memproses...");
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/payment_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pBank: $("#pBankPayment").val(),
                 pRefNum: $("#pRefNum").val(),
            },
            success: function (res) {
                var tes = JSON.stringify(res);
                if (res.responseMessage == 'Sukses') {
                   alert(res.responseMessage);
                   $("#pStatusPembayaran").val(res.responseMessage);
                   $("#pResponPaymentStatus").val(tes);
                }else {
                    alert(res.responseMessage);
                    $("#pStatusPembayaran").val(res.responseMessage);
                    $("#pResponPaymentStatus").val(tes);
                 }
                $("#paymentStatusBtn").attr("disabled",false);
                $("#paymentStatusBtn").html("Submit");
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
                $("#paymentStatusBtn").attr("disabled", false);
                $("#paymentStatusBtn").html("Submit");
            }
        });
    }
}

function kirimToken(pCompCode, pDocNo){
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/kirim_notif",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pCompCode: pCompCode,
                 pDocNo: pDocNo,
            },
            success: function (res) {
                hideLoadingCss("")

                if (res.return == 1) {
                  return 1;
                } else {
                  alert(res.OUT_MSG);
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });

}

function validasiToken(pCompCode, pDocNo, pToken){
        $("#validasiTokenBtn").attr("disabled", true);
        $("#validasiTokenBtn").html("Memvalidasi...");
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/validasi_notif",
            dataType: 'JSON',
            type: "POST",
            data: {
                pCompCode: $("#pCompanyCode2").val(),
                pDocNo: $("#pNoDoc2").val(),
                pToken:  $("#pKodeVerifikasi2").val(),
            },
            success: function (res) {
                // // console.log(res);
                if (res.return == 1) {
                  $("#pStatusValidasi2").val(res.OUT_MSG);
                  if(res.OUT_MSG == "VALID"){
                      if ($("#pJamBayar2").val() === "IMMEDIATE"){
                          $("#btn-payment").show();
                          $("#btn_siap_corpay").hide();
                      }else{
                          $("#btn-payment").hide();
                          $("#btn_siap_corpay").show();
                      }
                  }
                } else {
                    $("#btn-payment").hide();
                    $("#btn_siap_corpay").hide();
                  $("#pStatusValidasi2").val(res.OUT_MSG);
                }
                $("#validasiTokenBtn").attr("disabled", false);
                $("#validasiTokenBtn").html("Check Token");
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });

}

function updLunas(pStatus, pReferenceNumber){
    let reference = (pReferenceNumber === undefined) ? '-' : pReferenceNumber;
    var stateCrf = confirm("Anda Yakin Akan Melunasi Tagihan Ini?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/update_lunas",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pCompCode: $("#pCompanyCode2").val(),
                 pDocNo: $("#pNoDoc2").val(),
                 pFiscYear: $("#pFiscYear2").val(),
                 pLineItem: $("#pLineItem2").val(),
                 pJenisTransaksi: $("#pKet2").val(),
                 pStatus: pStatus,
                 pOssId: $("#pOssId2").val(),
                 pGroupId:$("#pGroupId2").val(),
                 pRefNumBank : reference,
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                  alert(res.OUT_MSG);
                  $('#detail-modal').modal('hide');
                  search("load");
                  table_rekapitulasi.ajax.reload();
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

function updLunasGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, ossId, groupId){
    var stateCrf = confirm("Anda Yakin Akan Melunasi Tagihan Ini?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/update_lunas_giro",
            dataType: 'JSON',
            type: "POST",
            data: {
                pCompCode: pCompCode,
                pDocNo: pDocNo,
                pFiscYear: pFiscYear,
                pLineItem: pLineItem,
                pJenisTransaksi: pJenisTransaksi,
                pOssId : ossId,
                pGroupId : groupId
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                  alert(res.OUT_MSG);
                  //search("load");
                  table_rekapitulasi.ajax.reload();
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

function updSiapBayarGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, ossId, groupId){
    var stateCrf = confirm("Anda Yakin menjadikan tagihan ini Siap Bayar?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/update_siap_bayar_giro",
            dataType: 'JSON',
            type: "POST",
            data: {
                pCompCode: pCompCode,
                pDocNo: pDocNo,
                pFiscYear: pFiscYear,
                pLineItem: pLineItem,
                pJenisTransaksi: pJenisTransaksi,
                pOssId : ossId,
                pGroupId : groupId
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    //search("load");
                    table_rekapitulasi.ajax.reload();
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

function siapBayarCorpay(){
    var stateCrf = confirm("Anda Yakin menjadikan tagihan ini Siap Bayar?");
    if (stateCrf == true) {
        $("#btn_siap_corpay").attr("disabled", true);
        $("#btn_siap_corpay").html("Memproses");
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/update_siap_bayar_giro",
            dataType: 'JSON',
            type: "POST",
            data: {
                pCompCode: $("#pCompanyCode2").val() ,
                pDocNo: $("#pNoDoc2").val(),
                pFiscYear: $("#pFiscYear2").val(),
                pLineItem: $("#pLineItem2").val(),
                pJenisTransaksi: $("#pKet2").val(),
                pOssId : $("#pOssId2").val(),
                pGroupId : $("#pGroupId2").val()
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    //search("load");
                    table_rekapitulasi.ajax.reload();
                } else {
                    alert(res.OUT_MSG);
                }
                $("#btn_siap_corpay").attr("disabled", false);
                $("#btn_siap_corpay").html("Siap Bayar");
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function doPayment(pMetodeBayar, pBank, pRefNum, pSource, pBeneficiaryAccount, pCurrency,
                    pAmount, pRemark, pBenefEmail, pBenefName, pBenefAddr1, pBenefAddr2, pDestinationBank,
                    pFeeType){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Pembayaran ? (Pastikan Data Sudah Benar)");
    if (stateCrf == true) {
        $("#btn-payment").prop("disabled", true);
        $("#btn-payment").html("Memproses...");
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/do_payment",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pMetodeBayar: $("#pMetodePembayaran2").val(),
                 pBank: $("#pBankPembayarans2").val(),
                 pRefNum: $("#pCusRefNum2").val(),
                 pSource: $("#pNoRekPLN2").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor2").val(),
                 pCurrency: $("#pCurrBayar2").val(),
                 pAmount: $("#pTotalTagihan2").val(),
                 pAmountBayar: $("#pTotalTagihan2").val(),
                 pRemark: 'UAT',
                 pBenefEmail: "",
                 pBenefName: $("#pCustomerName2").val(),
                 pBenefAddr1: "COBA COBA",
                 pBenefAddr2: "",
                 pDestinationBank: $("#pNamaBankPenerima2").val(),
                 pFeeType: "OUR",
                 pCurrency2 : $("#pCurrency2").val(),
                 pRetrievalReff : $("#pRetrieval2").val() ,
                 pDestinationBankCode : $("#pKodeBankPenerima2").val(),
                 pConfirmationCode : $("#pConfirmationCode2").val(),
            },
            success: function (res) {
                if (res.responseMessage === 'Sukses') {
                    var pStatus = res.responseMessage;
                    alert(res.responseMessage);
                    updLunas(pStatus, res.data.customerReferenceNumber);
                } else {
                    alert(res.responseMessage);
                    $("#pRespon3").val(res.errorMessage);
                }

                $("#btn-payment").prop("disabled", false);
                $("#btn-payment").html("Payment");
            },
            error: function (error) {
                alert("Gagal Melakukan Proses,Harap Hubungi Administrator");
                $("#btn-payment").prop("disabled", false);
                $("#btn-payment").html("Payment");
            }
        });
    }
}

function reverse_status(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking, pOssId, pGroupId){
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/reverse_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pCompCode: pCompCode,
                 pDocNo: pDocNo,
                 pFiscYear: pFiscYear,
                 pLineItem: pLineItem,
                 pKet: pKet,
                 pStatusTracking: pStatusTracking,
                 pOssId: pOssId,
                 pGroupId: pGroupId
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
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

function reverse_sap(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pOssId, pGroupId){
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/reverse_sap",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pCompCode: pCompCode,
                 pDocNo: pDocNo,
                 pFiscYear: pFiscYear,
                 pLineItem: pLineItem,
                 pKet: pKet,
                 pOssId: pOssId,
                 pGroupId: pGroupId
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
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

function multipleReverseSap(){
    let map = new Map();
    let success = 0;
    let fail = 0;
    if (invoiceCheckedArray.length <= 0){
        alert("Silahkan Pilih Data Terlebih Dahulu");
    }else{
        let confirmed = confirm("Apakah Anda yakin ingin reverse ke SAP tagihan-tagihan ini ?");
        if (confirmed){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/rekap_invoice_belum/reverse_sap_multiple",
                data : {
                    pData : JSON.stringify(invoiceCheckedArray),
                },
                dataType : "JSON",
                type : "POST",
                success : (res) => {
                    for(let value in res){
                        (res[value].return === 1) ? success += 1 : fail += 1 ;
                    }
                    alert(success+" data berhasil direverse ke SAP");
                    hideLoadingCss();
                    invoiceCheckedArray = new Array();
                    table_rekapitulasi.ajax.reload();
                },
                error : (err) => {
                    hideLoadingCss("Gagal! Terjadi Keasalahan. SIlahkan Hubungi Administrator");
                }
            })
        }
    }
}

function reject_data(pCompCode, pDocNo, pFiscYear, pLineItem, pKet){
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_reject",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pCompCode: pCompCode,
                 pDocNo: pDocNo,
                 pFiscYear: pFiscYear,
                 pLineItem: pLineItem,
                 pKet: pKet,
            },
            success: function (res) {
                hideLoadingCss("")
                if (res.return == 1) {
                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
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

function insertMultipleEditGiro(){
    let no_giro = $("#pMultipleNoGiro").val();
    let metode_bayar = $("#pMetodeBayarMultiple").val();
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/insert_multiple_edit_giro",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(invoiceCheckedArray),
            pNoGiro: metode_bayar === "GIRO" ? no_giro : "-",
            pMetodePembayaran : metode_bayar,
        },
        success: function (res) {
            hideLoadingCss("");
            if (res.return == 1) {
                // // console.log("Ini Res Cok! : ", res);
                Swal.fire(res.OUT_MSG.charAt(0).toUpperCase() + res.OUT_MSG.substring(1).toLowerCase(),'Berhasil Melakukan Edit Data','success');
                search("load");
                $('#multiple-edit-modal').modal('hide');
                table_rekapitulasi.ajax.reload();
                invoiceCheckedArray = new Array();
                fullArray = new Array();
            } else {
                Swal.fire('Gagal',res.OUT_MSG,'error');
            }
        },
        error: function () {
            hideLoadingCss();
            Swal.fire("Gagal Melakukan Proses, Harap Hubungi Administrator","", "error");
            search("load");
        }
    });

}

function create_group() {
    // // console.log("invoiceCheckedArray", invoiceCheckedArray);
    // // console.log("Full Array Group :", fullArray);
    // var stateCrf = confirm("Anda Yakin Akan Melakukan Grouping Tagihan Ini ?");
    Swal.fire({
        title: 'Anda Yakin ?',
        text: "Anda Yakin Akan Melakukan Grouping Tagihan Ini ?",
        icon: 'warning',
        html : '<p>Pastikan <b>Sumber Dana</b>, <b>Bank Pembayar</b>, <b>Rekening Bank Pembayar</b> <b>Tanggal Rencana Bayar</b>, <b>No Giro</b>,  <b>Currency Bayar</b>, dan <b>Assignment</b> sama</p>',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya'
    }).then(result => {
        if (result.value) {
            showLoadingCss();
            $.ajax({
                url: baseUrl + "api_operator/rekap_invoice_belum/create_group",
                dataType: 'JSON',
                type: "POST",
                data: {
                    pData: JSON.stringify(fullArrayGroup),
                    pNamaGroup: "COBA BIKIN GROUP NIH"//$("#pNamaGroup").val()
                },
                success: function (res) {
                    hideLoadingCss("");
                    if (res.return == 1) {
                        Swal.fire(res.OUT_MSG.charAt(0).toUpperCase() + res.OUT_MSG.substring(1).toLowerCase(),'Berhasil Membuat Group','success');
                        search("load");
                        $('#multiple-edit-modal').modal('hide');
                        table_rekapitulasi.ajax.reload();
                        invoiceCheckedArray = new Array();
                        fullArray = new Array();
                    } else {
                        Swal.fire('Gagal',res.OUT_MSG,'error');
                    }
                },
                error: function () {
                    hideLoadingCss();
                    Swal.fire("Gagal Melakukan Proses, Harap Hubungi Administrator","", "error");
                    search("load");
                }
            });
        }
    });
}


function openMultipleEditForm(){
    if (invoiceCheckedArray.length <= 0){
        alert("Silahkan Pilih Data Terlebih Dahulu");
    }else{
        $("#pCashCodeMultiple").val("")
        $("#pJamBayarMultiple").val("")
        $("#pMetodeBayarMultiple").val("")
        $('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
        // setSelectCashCode("pCashCodeMultiple","");
        setSelectMetodeBayar("pMetodeBayarMultiple","");
        //$('#edit-modal2').modal({backdrop: 'static', keyboard: false});
    }
}

function openGetBallance(){
     //$("#pNamaGroup").val("")
     $("#pBanks").val("")
     $("#pSources").val("")
     $("#pRespons").val("")
     $("#pAccountNames").val("")
     $("#pAccountBalances").val("")
     //$('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
     $('#edit-modal3').modal({backdrop: 'static', keyboard: false});

 }

function checkTrackingVerifikasi(val){
    return val.statustracking < 4;
}

function checkSiapBayarGiro(val){
    return val.statustracking >= 4;
}

function checkValidasiData(val){
    return val.metode_pembayaran !== "-";
}

function checkMetodeBayar(val){
    return (val.metode_pembayaran === 'INTERNETBANKING' || val.metode_pembayaran === 'GIRO') ;
}

function siap_bayar_multiple(){
    Swal.fire({
        title : "Yakin?",
        text : "Anda yakin akan menjadikan tagihan - tagihan ini siap bayar ?",
        icon : "question",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(result => {
        if (result.value){
            if (invoiceCheckedArray.length === 0){
                Swal.fire("Maaf","Silahkan Pilih Data Terlebih Dahulu", "warning");
            }else if(invoiceCheckedArray.every(checkSiapBayarGiro) === false){
                Swal.fire("Maaf", "Anda tidak dapat melunasi tagihan ini","warning");
            }else if(invoiceCheckedArray.every(checkMetodeBayar) === false){
                Swal.fire("Maaf", "Multiple Siap Bayar hanya bisa dilakukan untuk metode bayar GIRO dan INTERNET BANKING","warning");
            }else{
                showLoadingCss();
                $.ajax({
                    url : baseUrl + "/api_operator/rekap_invoice_belum/update_siap_bayar_multiple",
                    dataType : "JSON",
                    type : "POST",
                    data : {
                        pData : JSON.stringify(invoiceCheckedArray)
                    },
                    success: function (res) {
                        hideLoadingCss("")
                        if (res.return === 1) {
                            // console.warn(res.OUT_MSG);
                            Swal.fire("Berhasil", "Tagihan Siap Bayar","success");
                            table_rekapitulasi.ajax.reload();
                            fullArrayGroup = new Array();
                            invoiceCheckedArray = new Array();
                        } else {
                            Swal.fire("Gagal", res.OUT_MSG , "error");
                            // console.warn(res.OUT_MSG);
                        }
                    },
                    error: function () {
                        hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                    }
                });
            }
        }
    })
}

function update_datas() {
    Swal.fire({
        title : "Yakin?",
        text : "Anda yakin akan memverifikasi tagihan ini ?",
        icon : "question",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(result => {
        if (result.value){
            if(invoiceCheckedArray.length === 0){
                Swal.fire("Maaf", "Silahkan Pilih Data Terlebih Dahulu", "warning");
            }else if (invoiceCheckedArray.every(checkTrackingVerifikasi) === false){
                Swal.fire("Maaf!", "Tidak dapat melakukan verifikasi tagihan", "error");
            }else if(invoiceCheckedArray.every(checkValidasiData) === false){
                Swal.fire("Maaf!", "Silahkan Tentukan Metode Pembayaran Terlebih Dahulu","error");
            }else{
                showLoadingCss();
                $.ajax({
                    url: baseUrl + "/api_operator/rekap_invoice_belum/multi_upd_status",
                    dataType: 'JSON',
                    type: "POST",
                    data: {
                        pData: JSON.stringify(invoiceCheckedArray),
                    },
                    success: function (res) {
                        hideLoadingCss("")
                        if (res.return === 1) {
                            console.warn(res.OUT_MSG);
                            Swal.fire("Berhasil", "Tagihan berhasil diverifikasi","success");
                            table_rekapitulasi.ajax.reload();
                            fullArrayGroup = new Array();
                            invoiceCheckedArray = new Array();
                        } else {
                            Swal.fire("Gagal", res.OUT_MSG , "error");
                            console.warn(res.OUT_MSG);
                        }
                    },
                    error: function () {
                        hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                    }
                });
            }
        }
    });
}



function openGetPaymentStatus(){
    //$("#pNamaGroup").val("")
    //$('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
    $('#status-payment').modal({backdrop: 'static', keyboard: false});
}

function checkArray(e) {
    var isNew = true;
    var isNew1 = true;
    //// console.log ("Checked : ",e);
    if($(e).is(":checked")) {
        if(fullArrayGroup.length == 0 && invoiceCheckedArray.length == 0) {
            fullArrayGroup.push($(e).data("full").full);
            invoiceCheckedArray.push($(e).data("value"));
        }else {
            // test fikri
            for(let i = 0; i < fullArrayGroup.length; i++){
                var fullVal = JSON.stringify(fullArrayGroup[i]);
                var valCb2 = JSON.stringify($(e).data("full").full);
                if (fullVal == valCb2){
                    isNew = false;
                    break;
                }
            }
            for (let x = 0; x < invoiceCheckedArray.length; x++){
                var valArr = JSON.stringify(invoiceCheckedArray[x]);
                var valCb = JSON.stringify($(e).data("value"));
                if(valArr == valCb){
                    isNew1=false;
                    break;
                }
            }
            if(isNew == true){
                fullArrayGroup.push($(e).data("full").full);
            }
            if(isNew1 == true){
                invoiceCheckedArray.push($(e).data("value"));
            }
        }
    }
    else {
        var total1 = $("#table-main-detail input[type=checkbox]:checked").map(function () {
            return $(this).data("full");
        }).get().length;

        var total = $("#table-rekapitulasi input[type=checkbox]:checked").map(function () {
            return $(this).data("value");
        }).get().length;

        if(total == 0 || total1 == 0){
            $("#cbparent").prop('checked', false);
        }

        for (x = 0; x < fullArrayGroup.length; x++){
            let fullVal = JSON.stringify(fullArrayGroup[x]);
            let valCb2 = JSON.stringify($(e).data("full").full);
            if(fullVal == valCb2){
                fullArrayGroup.splice(x, 1);
            }
        }

        for (x = 0; x < invoiceCheckedArray.length; x++){
            var valArr = JSON.stringify(invoiceCheckedArray[x]);
            var valCb = JSON.stringify($(e).data("value"));
            if(valArr == valCb){
                invoiceCheckedArray.splice(x, 1);
            }
        }
    }
    // let groupToast = null;
    // if(isSame(fullArrayGroup)){
    //     // console.log("Sama : ",isSame(fullArrayGroup));
    //     $.toast({
    //         heading: 'Check Kesamaan Data',
    //         text: 'Data Oke!',
    //         icon: 'success',
    //         hideAfter: false,
    //         stack : 1
    //     });
    // }
    // if(isSame(fullArrayGroup) == 222){
    //     // console.log("Sama : ",isSame(fullArrayGroup));
    //     $.toast({
    //         heading: 'Perhatian',
    //         text: 'Data belum diInquiry',
    //         icon: 'warning',
    //         hideAfter: false,
    //         stack : 1
    //     });
    // }
    console.log("Full Array : ", fullArrayGroup);
    console.log("invoice array : ",invoiceCheckedArray);
}

function checkGroup(){
    if (fullArrayGroup.length <= 0){
        Swal.fire("Maaf!", "Silahkan Pilih Data Terlebih Dahulu", "error");
    }else{
        if (isSame(fullArrayGroup) === true){
            create_group();
        } else if(isSame(fullArrayGroup) === 222){
            Swal.fire({
                icon : "error",
                title : "Maaf!",
                html : '<p>Silahkan Tentukan Metode Pembayaran Terlebih Dahulu</p>',
            });
        } else {
            Swal.fire("Maaf", "Tidak bisa melakukan Grouping","error");
            // fullArrayGroup = new Array();
            // invoiceCheckedArray = new Array();
        }
    }
}

function isSame(data){
    if(data == null || data.length <= 0){
        return false;
    } else {
        let bank = data[0].BANK_BYR;
        let hb_rekening = data[0].NO_REK_HOUSE_BANK;
        // let comp_code = data[0].COMP_CODE;
        let assignment_depan = data[0].ASSIGNMENT_DEPAN;
        let assign_split =  data[0].ASSIGNMENT.toString().toLowerCase().split("-");
        let assignment = assign_split[0].toString();
        // let bus_area = data[0].BUS_AREA;
        let due_on = data[0].TGL_RENCANA_BAYAR;
        let sumber_dana = data[0].SUMBER_DANA;
        let inq_name = data[0].INQ_CUSTOMER_NAME;
        let no_giro = data[0].NO_GIRO;
        let curr_bayar = data[0].CURR_BAYAR;

    // || comp_code != data[x].COMP_CODE

        for(let x = 0; x < data.length; x++){
            let arr_split = data[x].ASSIGNMENT.toString().toLowerCase().split("-");
            let assg = arr_split[0].toString();
             if (data[x].METODE_PEMBAYARAN === "-"){
                 return 222;
             }
            if(due_on !== data[x].TGL_RENCANA_BAYAR || bank !== data[x].BANK_BYR || hb_rekening !== data[x].NO_REK_HOUSE_BANK || assignment_depan !== data[x].ASSIGNMENT_DEPAN || assg !== assignment || sumber_dana !== data[x].SUMBER_DANA ||
            inq_name !== data[x].INQ_CUSTOMER_NAME || no_giro !== data[x].NO_GIRO || curr_bayar !== data[x].CURR_BAYAR){
                return false;
            }
        }
        return true;
    }
}

function cetakBuktiKasMultiple(){
    if (invoiceCheckedArray.length <= 0){
        alert("SIlahkan Pilih data terlebih dahulu")
    }else if(invoiceCheckedArray.length > 5){
        alert("Data dipilih tidak boleh liebih dari 5")
    }else if(invoiceCheckedArray.every(checkValidasiData) === false){
        alert("Silahkan Tentukan Metode Pembayaran Terlebih Dahulu");
    } else{
        $.ajax({
            url : baseUrl + "generate_doc/cetak/bukti_kas_multiple",
            data : {
                pDocNumbers : JSON.stringify(invoiceCheckedArray)
            },
            dataType : "JSON",
            type : "POST",
            success : (res) => {
                if (res){
                    alert("Berhasil Mencetak Dokumen");
                    invoiceCheckedArray.forEach((item,index) => {
                        // console.log(item);
                        if (item.metode_pembayaran === "GIRO" || item.metode_pembayaran === "INTERNETBANKING"){
                            window.open(baseUrl+"generate_doc/cetak/downloadfile/laporan_"+item.pDocNo+".docx","_blank");
                        }else {
                            window.open(baseUrl+"generate_doc/cetak/downloadfile/laporan_corpay_"+item.pDocNo+".docx","_blank");
                        }

                    });
                    invoiceCheckedArray = new Array();
                }
                // console.log("Result : ",res);
            },
            error : (err) => {
                // console.log("Error : ",err.error);
            }
        })
    }
}

function cetakBuktiKasSingle(comp_code, doc_no, fiscal_year, line_item, ket, metode_bayar){
    let path_cetak = (metode_bayar === 'GIRO' || metode_bayar === 'INTERNETBANKING') ? "bukti_kas_single" : "cetak_lampiran_corpay_single";
    let file_name_dl = (metode_bayar === 'GIRO' || metode_bayar === 'INTERNETBANKING') ? "laporan_"+doc_no+".docx" : "laporan_corpay_"+doc_no+".docx";
    $.ajax({
        url : baseUrl + "generate_doc/cetak/"+path_cetak,
        data : {
            pDocNumbers : doc_no,
            pCompCode : comp_code,
            pFiscYear : fiscal_year,
            pLineItem : line_item,
            pKet : ket,
            pMetodeBayar : metode_bayar
        },
        dataType : "JSON",
        type : "POST",
        success : (res) => {
            if (res.createdoc.status === 1){
                // console.log("Result : ",res);
                alert("Berhasil Membuat Dokumen. Click 'Ok' untuk mengunduh.");
                window.open(baseUrl+"generate_doc/cetak/downloadfile/"+file_name_dl,"_blank");
            }
        },
        error : (err) => {
            // console.log("Error : ",err.error);
        }
    })
}

function downloadDokPengantar(laporan){
    $.ajax({
        url : baseUrl + "generate_doc/cetak/bukti_kas_single",
        data : {
            pDocNumbers : doc_no,
            pCompCode : comp_code,
            pFiscYear : fiscal_year,
            pLineItem : line_item,
            pKet : ket
        },
        dataType : "JSON",
        type : "POST",
        success : (res) => {
            // console.log("Result : ",res);
            alert("Berhasil Mencetak Dokumen");
        },
        error : (err) => {
            // console.log("Error : ",err.error);
        }
    })
}

$("#pMetodePembayaran").change( function(){
    // // console.log($("#pMetodePembayaran").val());
    if($("#pMetodePembayaran").val() == "GIRO" || $("#pMetodePembayaran").val() == "INTERNETBANKING"){
        $("#btn-inquiry").hide();
    }else{
        $("#btn-inquiry").show();
    }
});

$("#pStatusValidasi2").change( function(){
    // console.log($("#pMetodePembayaran").val());
    if($("#pStatusValidasi2").val() == "VALID"){
        $("#btn-payment").show();
    }else{
        $("#btn_siap_corpay").hide();
        $("#btn-payment").hide();
    }
});

$("#pMetodePembayaran").change( function(){
    // // console.log($("#pMetodePembayaran").val());
    if($("#pMetodePembayaran").val() === "GIRO"){
        $(".pNoGiro").show();
        $("#jamBayar").hide();
    }else if ($("#pMetodePembayaran").val() === "INTERNETBANKING"){
        $(".pNoGiro").hide();
        $("#pNoGiro").val('');
        $("#jamBayar").hide();
        $("#pJamBayar").val('');
    }else{
        $(".pNoGiro").hide();
        $("#pNoGiro").val('');
        $("#jamBayar").show();
    }
});

$("#pWaktuPembayaran").change( function(){
    // // console.log($("#pWaktuPembayaran").val());
    if($("#pWaktuPembayaran").val() == "ONSCHEDULE"){
        $("#pJamBayar").show();
    }else{
        $("#pJamBayar").hide();
    }
});

$("#pMetodeBayarMultiple").change(function () {
   if ($("#pMetodeBayarMultiple").val() === "GIRO"){
        $("#pMultipleNoGiro").removeAttr("disabled");
   }else{
       $("#pMultipleNoGiro").attr("disabled","disabled");
       $("#pMultipleNoGiro").val("");
   }
});
