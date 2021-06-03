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
var invoiceCheckedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;

$(document).ready(function () {
    // getAllData();
//     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectFilterBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    $('#check_all').change(function() {
        if($(this).is(':checked')){
            checkColumn(true);
        } else {
            checkColumn(false);
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
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: new Date(tglAwalData)});
    }
});

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_invoice_verifikasi_tgl",
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
            console.log('Bank :'+pBank);
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
            initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val())
            // getAllData()
            srcTglAwal = $("#tanggal_awal").val()
            srcTglAkhir = $("#tanggal_akhir").val()
        }
    }

    function buildTableBody(data, columns) {
            var body = [];

            body.push(columns);

            data.forEach(function (row) {
                var dataRow = [];
                dataRow.push(row["NO"]);
                dataRow.push(row["KET"]);
                dataRow.push(row["DOC_NO"]);
                dataRow.push(row["DOC_DATE2"]);
                dataRow.push(row["REV_WITH"]);
                dataRow.push(row["REV_YEAR"]);
                dataRow.push(row["POST_DATE2"]);
                dataRow.push(row["BASE_DATE"]);
                dataRow.push(row["ENTRY_DATE2"]);
                //dataRow.push({text: row["NILAI_TAGIHAN"], alignment: "right"});
                dataRow.push(row["DOC_TYPE"]);
                dataRow.push(row["FISC_YEAR"]);
                dataRow.push(row["DOC_HDR_TXT"]);
                dataRow.push(row["REFERENCE"]);
                dataRow.push(row["COMP_CODE"]);
                dataRow.push(row["BUS_AREA"]);
                dataRow.push(row["CURRENCY"]);
                dataRow.push(row["EXCH_RATE"]);
                dataRow.push(row["LINE_ITEM"]);
                //dataRow.push({text: row["COUNT_DOWN"], alignment: "right"});
                dataRow.push(row["DR_CR_IND"]);
                dataRow.push(row["SPEC_GL"]);
                dataRow.push(row["GL_ACCT"]);
                dataRow.push({text: row["AMT_TC"], alignment: "right"});
                dataRow.push({text: row["AMT_LC"], alignment: "right"});
                dataRow.push({text: row["AMT_WITH_BASE_TC"], alignment: "right"});
                dataRow.push({text: row["AMT_WITH_TC"], alignment: "right"});
                dataRow.push({text: row["AMT_WITH_BASE_LC"], alignment: "right"});
                dataRow.push({text: row["AMT_WITH_LC"], alignment: "right"});
                dataRow.push({text: row["AMOUNT"], alignment: "right"});
                dataRow.push(row["ACCT_TYPE"]);
                dataRow.push(row["ASSIGNMENT"]);
                dataRow.push(row["ITEM_TEXT"]);
                dataRow.push(row["CUSTOMER"]);
                dataRow.push(row["VENDOR"]);
                dataRow.push(row["TERM_PMT"]);
                dataRow.push(row["DUE_ON"]);
                dataRow.push(row["REFERENCE_KEY"]);
                dataRow.push(row["PMT_IND"]);
                dataRow.push(row["TRANS_TYPE"]);
                dataRow.push(row["SPREAD_VAL"]);
                dataRow.push(row["PMT_BLOCK"]);
                dataRow.push(row["HOUSE_BANK"]);
                dataRow.push(row["NO_REK_HOUSE_BANK"]);
                dataRow.push(row["PRTNR_BANK_TYPE"]);
                dataRow.push(row["BANK_KEY"]);
                dataRow.push(row["BANK_ACCOUNT"]);
                dataRow.push(row["ACCOUNT_HOLDER"]);
                dataRow.push(row["COST_CTR"]);
                dataRow.push(row["INT_ORDER"]);
                dataRow.push(row["WBS_NUM"]);
                dataRow.push(row["CASH_CODE"]);
                dataRow.push(row["PO_NUM"]);
                dataRow.push(row["PO_ITEM"]);
                dataRow.push(row["REF_KEY1"]);
                dataRow.push(row["REF_KEY2"]);
                dataRow.push(row["REF_KEY3"]);
                dataRow.push(row["OI_IND"]);
                dataRow.push(row["TPBA"]);
                dataRow.push(row["METODE_PEMBAYARAN"]);
                dataRow.push(row["TGL_RENCANA_BAYAR"]);
                dataRow.push(row["OSS_ID"]);
                dataRow.push(row["GROUP_ID"]);
                dataRow.push(row["BANK_BYR"]);
                dataRow.push(row["CURR_BAYAR"]);
                dataRow.push(row["AMOUNT_BAYAR"]);
                dataRow.push(row["BANK_BENEF"]);
                dataRow.push(row["NO_REK_BENEF"]);
                dataRow.push(row["NAMA_BENEF"]);
                dataRow.push(row["TGL_ACT_BAYAR"]);
                dataRow.push(row["SUMBER_DANA"]);
                dataRow.push(row["KETERANGAN"]);
                dataRow.push(row["STATUS_TRACKING"]);
                body.push(dataRow);
            });

            return body;
        }

        function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, statusTracking) {
            showLoadingCss();
            $('#table-rekapitulasi tbody').empty();
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
                    "lengthMenu": [[10, 25, 50, 100, 200, 400, 600,1000], [10, 25, 50, 100, 200, 400, 600, 1000]],
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
                        // {width: 100, targets: 35},
                        // {width: 100, targets: 36},
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "visible" : true,
                            "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70]
                        },
                        {
                            "sortable": false,
                            "aTargets": [0,71,72]
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
                            "name" : "DOC_NO",
                            "mRender": function (data, type, full) {
                                return full.DOC_NO;
                            }

                        },
                        {
                            "aTargets": [3],
                            "name" : "DOC_DATE",
                            "mRender": function (data, type, full) {
                                return full.DOC_DATE2;
                            }

                        },

                        {
                            "aTargets": [4],
                            "name" : "REV_WITH",
                            "mRender": function (data, type, full) {
                                return full.REV_WITH;
                            }

                        },
                        {
                            "aTargets": [5],
                            "name" : "REV_YEAR",
                            "mRender": function (data, type, full) {
                                return full.REV_YEAR;
                            }

                        },
                        {
                            "aTargets": [6],
                            "name" : "POST_DATE",
                            "mRender": function (data, type, full) {
                                return full.POST_DATE2;
                            }

                        },
                        {
                            "aTargets": [7],
                            "name" : "BASE_DATE",
                            "mRender": function (data, type, full) {
                                return full.BASE_DATE;
                            }

                        },
                        {
                            "aTargets": [8],
                            "name" : "ENTRY_DATE",
                            "mRender": function (data, type, full) {
                                return full.ENTRY_DATE2;
                            }

                        },
                        {
                            "aTargets": [9],
                            "name" : "DOC_TYPE",
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.TOTAL_TAGIHAN,2,".",",");
                                return full.DOC_TYPE;
                            }

                        },
                        {
                            "aTargets": [10],
                            "name" : "FISC_YEAR",
                            "mRender": function (data, type, full) {
                                return full.FISC_YEAR;
                            }

                        },
                        {
                            "aTargets": [11],
                            "name" : "DOC_HDR_TXT",
                            "mRender": function (data, type, full) {
                                return full.DOC_HDR_TXT;
                            }

                        },
                        {
                            "aTargets": [12],
                            "name" : "REFERENCE",
                            "mRender": function (data, type, full) {
                                return full.REFERENCE;
                            }

                        },
                        {
                            "aTargets": [13],
                            "name" : "COMP_CODE",
                            "mRender": function (data, type, full) {
                                return full.COMP_CODE;
                            }

                        },
                        {
                            "aTargets": [14],
                            "name" : "BUS_AREA",
                            "mRender": function (data, type, full) {
                                return full.BUS_AREA;
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
                            "name" : "EXCH_RATE",
                            "mRender": function (data, type, full) {
                                return full.EXCH_RATE;
                            }

                        },
                        {
                            "aTargets": [17],
                            "name" : "LINE_ITEM",
                            "mRender": function (data, type, full) {
                                return full.LINE_ITEM;
                            }

                        },
                        {
                            "aTargets": [18],
                            "name" : "DR_CR_IND",
                            "mRender": function (data, type, full) {
                                return full.DR_CR_IND;
                            }
                        },
                        {
                            "aTargets": [19],
                            "name" : "SPEC_GL",
                            "mRender": function (data, type, full) {
                                return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [20],
                            "name" : "GL_ACCT",
                            "mRender": function (data, type, full) {
                                return full.GL_ACCT;
                            }
                        },
                        {
                            "aTargets": [21],
                            "name" : "AMT_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [22],
                            "name" : "AMT_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [23],
                            "name" : "AMT_WITH_BASE_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [24],
                            "name" : "AMT_WITH_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [25],
                            "name" : "AMT_WITH_BASE_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [26],
                            "name" : "AMT_WITH_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [27],
                            "name" : "AMOUNT",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT,2,".",",");
                            }
                        },
                        {
                            "aTargets": [28],
                            "name" : "ACCT_TYPE",
                            "mRender": function (data, type, full) {
                              return full.ACCT_TYPE;
                            }
                        },
                        {
                            "aTargets": [29],
                            "name" : "ASSIGNMENT",
                            "mRender": function (data, type, full) {
                                return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [30],
                            "name" : "ITEM_TEXT",
                            "mRender": function (data, type, full) {
                                return full.ITEM_TEXT;
                            }
                        },
                        {
                            "aTargets": [31],
                            "name" : "CUSTOMER_NAME",
                            "mRender": function (data, type, full) {
                                return full.CUSTOMER;
                            }
                        },

                        {
                            "aTargets": [32],
                            "name" : "VENDOR_NAME",
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }

                        },
                         {
                            "aTargets": [33],
                             "name" : "TERM_PMT",
                            "mRender": function (data, type, full) {
                             return full.TERM_PMT;
                             }
                        },
                        {
                            "aTargets": [34],
                            "name" : "DUE_ON",
                            "mRender": function (data, type, full) {
                             return full.DUE_ON;
                             }
                        },
                        {
                             "aTargets": [35],
                            "name" : "REFERENCE_KEY",
                             "mRender": function (data, type, full) {
                               return full.REFERENCE_KEY;
                              }
                        },
                        {
                            "aTargets": [36],
                            "name" : "PMT_IND",
                            "mRender": function (data, type, full) {
                                return full.PMT_IND;
                            }
                        },
                        {
                            "aTargets": [37],
                            "name" : "TRANS_TYPE",
                            "mRender": function (data, type, full) {
                                return full.TRANS_TYPE;
                            }
                        },
                        {
                            "aTargets": [38],
                            "name" : "SPREAD_VAL",
                            "mRender": function (data, type, full) {
                                return full.SPREAD_VAL;
                            }
                        },
                        {
                            "aTargets": [39],
                            "name" : "PMT_BLOCK",
                            "mRender": function (data, type, full) {
                                return full.PMT_BLOCK;
                            }
                         },
                        {
                            "aTargets": [40],
                            "name" : "HOUSE_BANK",
                            "mRender": function (data, type, full) {
                                return full.BANK_BYR;
                            }
                         },
                         {
                             "aTargets": [41],
                             "name" : "NO_REK_HOUSE_BANK",
                             "mRender": function (data, type, full) {
                              return full.NO_REK_HOUSE_BANK;
                                }
                         },
                         {
                              "aTargets": [42],
                             "name" : "PRTNR_BANK_TYPE",
                              "mRender": function (data, type, full) {
                               return full.PRTNR_BANK_TYPE;
                                }
                         },
                         {
                             "aTargets": [43],
                             "name" : "BANK_KEY",
                             "mRender": function (data, type, full) {
                                  return full.BANK_KEY;
                             }
                         },
                        {
                            "aTargets": [44],
                            "name" : "BANK_ACCOUNT",
                            "mRender": function (data, type, full) {
                                return full.BANK_ACCOUNT;
                            }
                        },
                        {
                            "aTargets": [45],
                            "name" : "ACCOUNT_HOLDER",
                            "mRender": function (data, type, full) {
                                return full.ACCOUNT_HOLDER;
                            }
                         },
                        {
                                "aTargets": [46],
                                "name" : "COST_CTR",
                                "mRender": function (data, type, full) {
                                    return full.COST_CTR;
                                }
                        },
                         {
                                "aTargets": [47],
                                "name" : "INT_ORDER",
                                "mRender": function (data, type, full) {
                                     return full.INT_ORDER;
                                }
                         },
                         {
                                "aTargets": [48],
                                "name" : "WBS_NUM",
                                "mRender": function (data, type, full) {
                                    return full.WBS_NUM;
                                }
                         },
                         {
                                "aTargets": [49],
                                "name" : "CASH_CODE",
                                "mRender": function (data, type, full) {
                                    return full.CASH_CODE;
                                }
                          },
                         {
                                "aTargets": [50],
                                "name" : "PO_NUM",
                                "mRender": function (data, type, full) {
                                    return full.PO_NUM;
                                }
                         },
                         {
                                "aTargets": [51],
                                "name" : "PO_ITEM",
                                "mRender": function (data, type, full) {
                                    return full.PO_ITEM;
                                }
                         },
                         {
                                "aTargets": [52],
                                "name" : "REF_KEY1",
                                "mRender": function (data, type, full) {
                                    return full.REF_KEY1;
                                }
                        },
                        {
                                "aTargets": [53],
                                "name" : "REF_KEY2",
                                "mRender": function (data, type, full) {
                                    return full.REF_KEY2;
                                }
                         },
                         {
                                "aTargets": [54],
                                "name" : "REF_KEY3",
                                "mRender": function (data, type, full) {
                                    return full.REF_KEY3;
                            }
                         },
                         {
                                "aTargets": [55],
                                "name" : "OI_IND",
                                "mRender": function (data, type, full) {
                                    return full.OI_IND;
                                }
                        },
                        {
                            "aTargets": [56],
                            "name" : "TPBA",
                            "mRender": function (data, type, full) {
                             return full.TPBA;
                                  }
                         },
                         {
                             "aTargets": [57],
                             "name" : "METODE_PEMBAYARAN",
                              "mRender": function (data, type, full) {
                               return full.METODE_PEMBAYARAN;
                                 }
                         },
                         {
                              "aTargets": [58],
                             "name" : "TGL_RENCANA_BAYAR",
                              "mRender": function (data, type, full) {
                              return full.TGL_RENCANA_BAYAR;
                                  }
                         },
                          {
                               "aTargets": [59],
                              "name" : "OSS_ID",
                               "mRender": function (data, type, full) {
                               return full.OSS_ID;
                                   }
                          },
                          {
                             "aTargets": [60],
                              "name" : "GROUP_ID",
                             "mRender": function (data, type, full) {
                             return full.GROUP_ID;
                                 }
                        },
                          {
                             "aTargets": [61],
                              "name" : "CURR_BAYAR",
                             "mRender": function (data, type, full) {
                             return full.CURR_BAYAR;
                                 }
                        },
                        {
                             "aTargets": [62],
                            "name" : "AMOUNT_BAYAR",
                             "mRender": function (data, type, full) {
                             return full.AMOUNT_BAYAR;
                                 }
                        },
                        {
                             "aTargets": [63],
                            "name" : "BANK_BENEF",
                             "mRender": function (data, type, full) {
                             return full.BANK_BENEF;
                                 }
                        },
                        {
                             "aTargets": [64],
                            "name" : "NO_REK_BENEF",
                             "mRender": function (data, type, full) {
                             return full.NO_REK_BENEF;
                                 }
                        },
                        {
                             "aTargets": [65],
                            "name" : "NAMA_BENEF",
                             "mRender": function (data, type, full) {
                             return full.NAMA_BENEF;
                                 }
                        },
                         {
                              "aTargets": [66],
                             "name" : "SUMBER_DANA",
                              "mRender": function (data, type, full) {
                              return full.SUMBER_DANA;
                                    }
                         },
                         {
                              "aTargets": [67],
                             "name" : "KETERANGAN",
                              "mRender": function (data, type, full) {
                                return full.KETERANGAN;
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
                            "name" : "PARTIAL_IND",
                          "mRender": function (data, type, full) {
                          return full.PARTIAL_IND;
                                }
                         },
                         {
                              "aTargets": [70],
                             "name" : "STATUS_TRACKING",
                              "mRender": function (data, type, full) {
                              return full.STATUS_TRACKING;
                                    }
                         },
                        {
                            "aTargets": [71],
                            "mRender": function (data, type, full) {
                                let darr = full.TGL_RENCANA_BAYAR.split("/");
                                let now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                                let ren_byr = new Date(darr[2],darr[1]-1,darr[0]);
                                // if (ren_byr < now){
                                //     verif = '<button style="width: 15px !important;" class="btn btn-reverse-data btn-sm btn-danger" title="Reject" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                // }else{
                                    verif = '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-reverse-data btn-sm btn-success" title="Approve Tanggal" onclick="verifikasi_tanggal(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-check"></i></button>'+'<button style="width: 15px !important;" class= "btn btn-reverse-data btn-sm btn-danger" title="Reject" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.GROUP_ID+'\')"><i class="fa fa-arrow-left"></i></button>';
                                //}
                                var ret_value = "-";
                                var role = newRoleUser[0];
                                if(newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"){

                                ret_value =
                                '<div class="btn-group">' + verif + '</div>';
                                }
                                return ret_value;
                            }
                        },
                        {
                            "aTargets": [72],
                            "mRender": function (data, type, full) {
                                var value = new Object();
                                var full_value = new Object();
                                var ret_value = ''
                                if (newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT") {
                                    value = '{"pCompCode":"'+full.COMP_CODE+'", "pBusArea":"'+full.BUS_AREA+'","pLineItem":"'+full.LINE_ITEM+'","pAssignment":"'+full.ASSIGNMENT+'","pDocNo":"'+full.DOC_NO+'","oss_id":"'+full.OSS_ID+'","group_id":"'+full.GROUP_ID+'","pFiscYear":"'+full.FISC_YEAR+'","pKet":"'+full.KET+'","ok":"'+full.FLAG_TOMBOL+'"}';
                                }
//                                value = '{"pHouseBank":"'+full.HOUSE_BANK+'","pNoRekHouseBank" : "'+full.NO_REK_HOUSE_BANK+'", "pCompCode":"'+full.COMP_CODE+'", "pDueOn":"'+full.DUE_ON+'","pBusArea":"'+full.BUS_AREA+'","pAssignment":"'+full.ASSIGNMENT+'","pDocNo":"'+full.DOC_NO+'","pSumberDana":"'+full.SUMBER_DANA+'"}';
//                                full_value = '{"full":'+JSON.stringify(full)+'}';

                                for (x=0; x<invoiceCheckedArray.length;x++){
                                    if(JSON.stringify(invoiceCheckedArray[x]) === value){
                                        return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox' checked>";
                                    }
                                }
                                return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                            }
                        }
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_operator/rekap_invoice_belum/get_invoice_verifikasi_tgl",
                            "type":
                                "GET",
                            "dataType":
                                "json",
                            "data":
                                {
                                    pTglAwal: pTglAwal,
                                    pTglAkhir: pTglAkhir,
                                    pBank: pBank,
                                    pCurrency: pCurrency,
                                    pCaraBayar: pCaraBayar,
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
                            //getTotalTagihan();
                            // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                            // $(".table ").css({"width":"100%"});
                            table_rekapitulasi.columns.adjust();
                            var currentPageNumber = this.api().page.info().page;
                            for (x=0;x<cbParentArray.length;x++){
                                if(cbParentArray[x] === currentPageNumber){
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
                        if (newRoleUser[0] !== "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                            api.column(71).visible(false);
                            api.column(72).visible(false);
                        }
                    }
                }
            );
            table_rekapitulasi.on('search.dt', function () {
                var value = $('.dataTables_filter input').val();
                tempTableSearch = value;
            });

            $('.dataTables_length').each(function () {
               var html = '<label style="margin-left: 190px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
               $(this).append(html);
            });

            $('.dataTables_filter').each(function () {
                 var html = '';
                html = html + '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()"><i class="fa fa-arrows-alt"></i></button>';
                 if(newRoleUser[0] == "ROLE_VERIFIKATOR"){
                    html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                    html = html + '<button class="btn-edit-data btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fa fa-university"></i></button>';
                }
                 if(newRoleUser[0] == "ROLE_ADMIN"){
                var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
                    '<i class="fa fa-arrows-alt"></i></button>';
                /*button reject*/
                // html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
                //     '            <i class="fa fa-ban"></i></button>';
                // html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fas fa-edit"></i></button>';
                // html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-edit"></i></button>';
                // html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                // html = html + '<button class="btn-edit-data btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fa fa-university"></i></button>';
                // html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
                // html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
                }
               if(newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                   html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Verifikasi Tanggal" style="margin-left: 10px" type="button" onclick="verifikasi_tanggal_multiple()"><i class="fas fa-check-double"></i></button>';
                   html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
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

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_total_tagihan_approval_evp",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            currency: $("#cmb_currecny").val(),
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

function getBallance2(pBank, pSource, pBeneficiary){
    var stateCrf = confirm("Anda Data Yang Anda Masukan Sudah Benar?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/get_Ballance2",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pBank: $("#pBanks").val(),
                 pSource: $("#pSources").val(),
                 pBeneficiary: $("#pBeneficiarys").val(),
            },
            success: function (res) {
                showLoadingCss();
                var tes = JSON.stringify(res);
                console.log(res);


              if (res.responseMessage == 'Sukses') {
                    alert(res.responseMessage);
                    table_rekapitulasi.ajax.reload();
                    $("#pAccountNames").val(res.data.accountName);
                    $("#pAccountBalances").val(res.data.accountBalance);
                    $("#pRespons").val(tes);
                }
                else {
                   alert(res.responseMessage);
                   table_rekapitulasi.ajax.reload();
                   $("#pRespons").val(tes);
                }
            },
            error: function () {
                alert(res.responseMessage);
            }
        });
    }
}

function getInquiry(pMetodeBayar, pBank, pSource, pAccountNumber,  pBeneficiaryAccount, pDestinationBankCode){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Inquiry ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/inquiry",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pMetodeBayar: $("#pMetodePembayaran").val(),
                 pBank: $("#pHouseBank").val(),
                 pSource: $("#pNoRekPln").val(),
                 pAccountNumber: $("#pNoRekPln").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor").val(),
                 pDestinationBankCode: $("#pKodeBankPenerima").val(),
            },
            success: function (res) {
               showLoadingCss();
                var tes = JSON.stringify(res);
               // console.log(res);


//                if (res.return == 1) {
//                    alert(res.OUT_MSG);

               // }
//                else {
//                   console.log("DIAZZZ");
//                }
                if (res.responseMessage == 'Sukses') {
                   alert(res.responseMessage);
                   table_rekapitulasi.ajax.reload();
                   $("#pRespon2").val(tes);
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
                        table_rekapitulasi.ajax.reload();
                         $("#pRespons2").val(tes);
                 }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function getPaymentStatus(pBank, pRefNum){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Cek Payment Status ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/payment_status",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pBank: $("#pBankPayment").val(),
                 pRefNum: $("#pRefNum").val(),
            },
            success: function (res) {
               showLoadingCss();
                var tes = JSON.stringify(res);
                if (res.responseMessage == 'Sukses') {
                   alert(res.responseMessage);
                   table_rekapitulasi.ajax.reload();
                   $("#pResponPaymentStatus").val(tes);
                  }
                else {
                        alert(res.responseMessage);
                        table_rekapitulasi.ajax.reload();
                         $("#pResponPaymentStatus").val(tes);
                 }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}



function reverse_sap(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pIdGroupSap){
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
                 pGroupId: pIdGroupSap,
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
    console.log("Selected : ", invoiceCheckedArray)
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

function verifikasi_tanggal_multiple(){
    // let breakPoint;
    // invoiceCheckedArray.forEach((item, index) => {
    //     console.log(item);
    //     if (item.ok === "1"){
    //         alert("Silahkan Ubah Tanggal Rencana Bayar");
    //         throw breakPoint;
    //         return;
    //     }
    // });
    if (invoiceCheckedArray.length <= 0){
        alert("Maaf, Silahkan pilih data terlebih dahulu!");
    }else if(invoiceCheckedArray.length > 0){
        var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan - tagihan Ini ?");
        if (stateCrf){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/rekap_invoice_belum/verifikasi_tanggal_multiple",
                dataType : "JSON",
                type : "POST",
                data : {
                    pData : JSON.stringify(invoiceCheckedArray)
                },
                success : response => {
                    hideLoadingCss();
                    if (response.return === 1){
                        alert(response.OUT_MSG);
                        table_rekapitulasi.ajax.reload();
                    }else{
                        alert(response.OUT_MSG);
                    }
                    invoiceCheckedArray = new Array();
                },
                error : error => {
                    alert(error);
                    hideLoadingCss();
                }
            })
        }
    }else{alert("Maaf terjadi kesalahan");}
}

function verifikasi_tanggal(pCompCode, pDocNo, pFiscYear, pLineItem, pKet){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/verifikasi_tanggal",
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



function openGetBallance(){
     //$("#pNamaGroup").val("")
     //$('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
     $('#edit-modal3').modal({backdrop: 'static', keyboard: false});
 }

function openGetPaymentStatus(){
    //$("#pNamaGroup").val("")
    //$('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
    $('#status-payment').modal({backdrop: 'static', keyboard: false});
}

function checkArray(e) {
    var isNew= true;
    // console.log ("Checked : ",e);
    if($(e).is(":checked")) {
        if(invoiceCheckedArray.length == 0) {
            invoiceCheckedArray.push($(e).data("value"));
            // fullArray.push($(e).data("full").full);
        }else {
            for (x = 0; x < invoiceCheckedArray.length; x++){
                var valArr = JSON.stringify(invoiceCheckedArray[x]);
                var valCb = JSON.stringify($(e).data("value"));
                if(valArr == valCb){
                    isNew=false;
                    break;
                }
            }
            // test fikri
            // for(let i = 0; i < fullArray.length; i++){
            //     var fullVal = JSON.stringify(fullArray[i]);
            //     var valCb2 = JSON.stringify($(e).data("full").full);
            //     if (fullVal == valCb2){
            //         isNew = false;
            //         break;
            //     }
            // }
            if(isNew == true){
                invoiceCheckedArray.push($(e).data("value"));
                // fullArray.push($(e).data("full").full);
            }
        }
    }
    else {
        var total = $("#table-rekapitulasi input[type=checkbox]:checked").map(function () {
            return $(this).data("value");
        }).get().length;

        var total2 = $("#table-rekapitulasi input[type=checkbox]:checked").map(function () {
            return $(this).data("full");
        }).get().length;

        if(total == 0 || total2 == 0){
            $("#cbparent").prop('checked', false);
        }
        for (x = 0; x < invoiceCheckedArray.length; x++){
            var valArr = JSON.stringify(invoiceCheckedArray[x]);
            var valCb = JSON.stringify($(e).data("value"));
            if(valArr == valCb){
                invoiceCheckedArray.splice(x, 1);
            }
        }

        // for (x = 0; x < fullArray.length; x++){
        //     let fullVal = JSON.stringify(fullArray[x]);
        //     let valCb2 = JSON.stringify($(e).data("full").full);
        //     if(fullVal == valCb2){
        //         fullArray.splice(x, 1);
        //     }
        // }
    }
    console.log("Checked : ", invoiceCheckedArray);
    // console.log("Full Array : ", fullArray);
}

function checkGroup(){
    if (isSame(invoiceCheckedArray)){
        Swal.fire("Good!","Good To Group :)","success");
        // alert("Good To Group :)");
        create_group();
    } else {
        Swal.fire("Sorry!","No Way, Sorry :(","error");
        // alert("No Way, Sorry :(");
    }
    console.log(invoiceCheckedArray);
}

function isSame(data){
    if(data == null || data.length <= 0){
        return false;
    } else {
        let bank = data[0].pHouseBank;
        let hb_rekening = data[0].pNoRekHouseBank;
        let comp_code = data[0].pCompCode;
        let assign = data[0].pAssignment;
        let bus_area = data[0].pBusArea;
        let due_on = data[0].pDueOn;
        let sumber_dana = data[0].pSumberDana;

        for(let x = 0; x < data.length; x++){
            if(due_on != data[x].pDueOn || bank != data[x].pHouseBank || hb_rekening != data[x].pNoRekHouseBank || comp_code != data[x].pCompCode || assign != data[x].pAssignment || bus_area != data[x].pBusArea || sumber_dana != data[x].pSumberDana){
                return false;
            }
        }
        return true;
    }
}

function saveColumn() {
    var hc0 = $("#NOMOR").prop('checked')
    var hc1 = $("#KET").prop('checked')
    var hc2 = $("#DOC_NO").prop('checked')
    var hc3 = $("#DOC_DATE").prop('checked')
    var hc4 = $("#REV_WITH").prop('checked')
    var hc5 = $("#REV_YEAR").prop('checked')
    var hc6 = $("#POST_DATE").prop('checked')
    var hc7 = $("#BASE_DATE").prop('checked')
    var hc8 = $("#ENTRY_DATE").prop('checked')
    var hc9 = $("#DOC_TYPE").prop('checked')
    var hc10 = $("#FISC_YEAR").prop('checked')
    var hc11 = $("#DOC_HDR_TXT").prop('checked')
    var hc12 = $("#REFERENCE").prop('checked')
    var hc13 = $("#COMP_CODE").prop('checked')
    var hc14 = $("#BUS_AREA").prop('checked')
    var hc15 = $("#CURRENCY").prop('checked')
    var hc16 = $("#EXCH_RATE").prop('checked')
    var hc17 = $("#LINE_ITEM").prop('checked')
    var hc18 = $("#DR_CR_IND").prop('checked')
    var hc19 = $("#SPEC_GL").prop('checked')
    var hc20 = $("#GL_ACCT").prop('checked')
    var hc21 = $("#AMT_TC").prop('checked')
    var hc22 = $("#AMT_LC").prop('checked')
    var hc23 = $("#AMT_WITH_BASE_TC").prop('checked')
    var hc24 = $("#AMT_WITH_TC").prop('checked')
    var hc25 = $("#AMT_WITH_BASE_LC").prop('checked')
    var hc26 = $("#AMT_WITH_LC").prop('checked')
    var hc27 = $("#AMOUNT").prop('checked')
    var hc28 = $("#ACCT_TYPE").prop('checked')
    var hc29 = $("#ASSIGNMENT").prop('checked')
    var hc30 = $("#ITEM_TEXT").prop('checked')
    var hc31 = $("#CUSTOMER_NAME").prop('checked')
    var hc32 = $("#VENDOR_NAME").prop('checked')
    var hc33 = $("#TERM_PMT").prop('checked')
    var hc34 = $("#DUE_ON").prop('checked')
    var hc35 = $("#REFERENCE_KEY").prop('checked')
    var hc36 = $("#PMT_IND").prop('checked')
    var hc37 = $("#TRANS_TYPE").prop('checked')
    var hc38 = $("#SPREAD_VAL").prop('checked')
    var hc39 = $("#PMT_BLOCK").prop('checked')
    var hc40 = $("#HOUSE_BANK").prop('checked')
    var hc41 = $("#NO_REK_HOUSE_BANK").prop('checked')
    var hc42 = $("#PRTNR_BANK_TYPE").prop('checked')
    var hc43 = $("#BANK_KEY").prop('checked')
    var hc44 = $("#BANK_ACCOUNT").prop('checked')
    var hc45 = $("#ACCOUNT_HOLDER").prop('checked')
    var hc46 = $("#COST_CTR").prop('checked')
    var hc47 = $("#INT_ORDER").prop('checked')
    var hc48 = $("#WBS_NUM").prop('checked')
    var hc49 = $("#CASH_CODE").prop('checked')
    var hc50 = $("#PO_NUM").prop('checked')
    var hc51 = $("#PO_ITEM").prop('checked')
    var hc52 = $("#REF_KEY1").prop('checked')
    var hc53 = $("#REF_KEY2").prop('checked')
    var hc54 = $("#REF_KEY3").prop('checked')
    var hc55 = $("#OI_IND").prop('checked')
    var hc56 = $("#TPBA").prop('checked')
    var hc57 = $("#METODE_PEMBAYARAN").prop('checked')
    var hc58 = $("#TGL_RENCANA_BAYAR").prop('checked')
    var hc59 = $("#OSS_ID").prop('checked')
    var hc60 = $("#GROUP_ID").prop('checked')
    var hc61 = $("#CURR_BAYAR").prop('checked')
    var hc62 = $("#AMOUNT_BAYAR").prop('checked')
    var hc63 = $("#BANK_BENEF").prop('checked')
    var hc64 = $("#NO_REK_BENEF").prop('checked')
    var hc65 = $("#NAMA_BENEF").prop('checked')
    var hc66 = $("#SUMBER_DANA").prop('checked')
    var hc67 = $("#KETERANGAN").prop('checked')
    var hc68 = $("#TGL_TAGIHAN_DITERIMA").prop('checked')
    var hc69 = $("#PARTIAL_IND").prop('checked')
    var hc70 = $("#STATUS_TRACKING").prop('checked')

    var data = {
        "nomor" : hc0 === true ? 1 : 0,
        "ket" : hc1 === true ? 1 : 0,
        "doc_no" : hc2 === true ? 1 : 0,
        "doc_date2" : hc3 === true ? 1 : 0,
        "rev_with" : hc4 === true ? 1 : 0,
        "rev_with" : hc4 === true ? 1 : 0,
        "rev_year" : hc5 === true ? 1 : 0,
        "post_date2" : hc6 === true ? 1 : 0,
        "base_date" : hc7 === true ? 1 : 0,
        "entry_date2" : hc8 === true ? 1 : 0,
        "doc_type" : hc9 === true ? 1 : 0,
        "fisc_year" : hc10 === true ? 1 : 0,
        "doc_hdr_txt" : hc11 === true ? 1 : 0,
        "reference" : hc12 === true ? 1 : 0,
        "comp_code" : hc13 === true ? 1 : 0,
        "bus_area" : hc14 === true ? 1 : 0,
        "currency" : hc15 === true ? 1 : 0,
        "exch_rate" : hc16 === true ? 1 : 0,
        "line_item" : hc17 === true ? 1 : 0,
        "dr_cr_ind" : hc18 === true ? 1 : 0,
        "spec_gl" : hc19 === true ? 1 : 0,
        "gl_acct" : hc20 === true ? 1 : 0,
        "amt_tc" : hc21 === true ? 1 : 0,
        "amt_lc" : hc22 === true ? 1 : 0,
        "amt_with_tc" : hc23 === true ? 1 : 0,
        "amt_with_base_tc" : hc24 === true ? 1 : 0,
        "amt_with_base_lc" : hc25 === true ? 1 : 0,
        "amt_with_lc" : hc26 === true ? 1 : 0,
        "amount" : hc27 === true ? 1 : 0,
        "acct_type" : hc28 === true ? 1 : 0,
        "assignment" : hc29 === true ? 1 : 0,
        "item_text" : hc30 === true ? 1 : 0,
        "customer" : hc31 === true ? 1 : 0,
        "vendor" : hc32 === true ? 1 : 0,
        "term_pmt" : hc33 === true ? 1 : 0,
        "due_on" : hc34 === true ? 1 : 0,
        "reference_key" : hc35 === true ? 1 : 0,
        "pmt_ind" : hc36 === true ? 1 : 0,
        "spread_val" : hc37 === true ? 1 : 0,
        "pmt_block" : hc38 === true ? 1 : 0,
        "house_bank" : hc39 === true ? 1 : 0,
        "no_rek_house_bank" : hc40 === true ? 1 : 0,
        "prtnr_bank_type" : hc41 === true ? 1 : 0,
        "bank_key" : hc42 === true ? 1 : 0,
        "bank_account" : hc43 === true ? 1 : 0,
        "account_holder" : hc44 === true ? 1 : 0,
        "cost_ctr" : hc45 === true ? 1 : 0,
        "int_order" : hc46 === true ? 1 : 0,
        "wbs_num" : hc47 === true ? 1 : 0,
        "cash_code" : hc48 === true ? 1 : 0,
        "po_num" : hc49 === true ? 1 : 0,
        "po_item" : hc50 === true ? 1 : 0,
        "ref_key1" : hc51 === true ? 1 : 0,
        "ref_key2" : hc52 === true ? 1 : 0,
        "ref_key3" : hc53 === true ? 1 : 0,
        "oi_ind" : hc54 === true ? 1 : 0,
        "tpba" : hc55 === true ? 1 : 0,
        "metode_pembayaran" : hc56 === true ? 1 : 0,
        "tgl_rencana_bayar" : hc57 === true ? 1 : 0,
        "oss_id" : hc58 === true ? 1 : 0,
        "group_id" : hc59 === true ? 1 : 0,
        "curr_bayar" : hc60 === true ? 1 : 0,
        "amount_bayar" : hc61 === true ? 1 : 0,
        "trans_type" : hc62 === true ? 1 : 0,
        "bank_benef" : hc63 === true ? 1 : 0,
        "no_rek_benef" : hc64 === true ? 1 : 0,
        "nama_benef" : hc65 === true ? 1 : 0,
        "sumber_dana" : hc66 === true ? 1 : 0,
        "keterangan" : hc67 === true ? 1 : 0,
        "tgl_tagihan_diterima" : hc68 === true ? 1 : 0,
        "partial_ind" : hc69 === true ? 1 : 0,
        "status_tracking" : hc70 === true ? 1 : 0,
        "no_giro" : 0,
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
        "ref_num_bank" : 0,
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

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/rekap_invoice_belum/xls_verifikasi_tanggal/" + tglAwal.replace(/\//g,"-") + "/" + tglAkhir.replace(/\//g,"-") + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_bank").val() + "/" +null+ "/" +null);
}
