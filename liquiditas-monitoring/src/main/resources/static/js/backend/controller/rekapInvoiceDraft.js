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
    getAllData();
//     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
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
        url: baseUrl + "api_operator/rekap_invoice_draft/get_total_tagihan",
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
    window.open(baseUrl + "api_operator/rekap_invoice_draft/xls/" + tglAwal + "/" + tglAkhir + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_cara_pembayaran").val() + "/" + $("#cmb_bank").val() + "/" +null+ "/" +null);
}

function search(state) {
        if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
            alert("Mohon Lengkapi Tgl Akhir");
        } else {
            initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val(), $("#cmb_status_tracking").val())
            getAllData();
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
//            $('#table-rekapitulasi tbody').empty();
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
                        // {width: 100, targets: 35},
                        // {width: 100, targets: 36},
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "aTargets": [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70]
                        },
                        {
                            "sortable": false,
                            "aTargets": [35, 36]
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
                                return full.KET;
                            }

                        },
                        {
                            "aTargets": [2],
                            "mRender": function (data, type, full) {
                                return full.DOC_NO;
                            }

                        },
                        {
                            "aTargets": [3],
                            "mRender": function (data, type, full) {
                                return full.DOC_DATE2;
                            }

                        },

                        {
                            "aTargets": [4],
                            "mRender": function (data, type, full) {
                                return full.REV_WITH;
                            }

                        },
                        {
                            "aTargets": [5],
                            "mRender": function (data, type, full) {
                                return full.REV_YEAR;
                            }

                        },
                        {
                            "aTargets": [6],
                            "mRender": function (data, type, full) {
                                return full.POST_DATE2;
                            }

                        },
                        {
                            "aTargets": [7],
                            "mRender": function (data, type, full) {
                                return full.BASE_DATE;
                            }

                        },
                        {
                            "aTargets": [8],
                            "mRender": function (data, type, full) {
                                return full.ENTRY_DATE2;
                            }

                        },
                        {
                            "aTargets": [9],
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.TOTAL_TAGIHAN,2,".",",");
                                return full.DOC_TYPE;
                            }

                        },
                        {
                            "aTargets": [10],
                            "mRender": function (data, type, full) {
                                return full.FISC_YEAR;
                            }

                        },
                        {
                            "aTargets": [11],
                            "mRender": function (data, type, full) {
                                return full.DOC_HDR_TXT;
                            }

                        },
                        {
                            "aTargets": [12],
                            "mRender": function (data, type, full) {
                                return full.REFERENCE;
                            }

                        },
                        {
                            "aTargets": [13],
                            "mRender": function (data, type, full) {
                                return full.TGL_TAGIHAN_DITERIMA;
                            }
                        },
                        {
                            "aTargets": [14],
                            "mRender": function (data, type, full) {
                                return full.COMP_CODE;
                            }

                        },
                        {
                            "aTargets": [15],
                            "mRender": function (data, type, full) {
                                return full.BUS_AREA;
                            }

                        },
                        {
                            "aTargets": [16],
                            "mRender": function (data, type, full) {
                                return full.CURRENCY;
                            }

                        },
                        {
                            "aTargets": [17],
                            "mRender": function (data, type, full) {
                                return full.EXCH_RATE;
                            }

                        },
                        {
                            "aTargets": [18],
                            "mRender": function (data, type, full) {
                                return full.LINE_ITEM;
                            }

                        },
                        {
                            "aTargets": [19],
                            "mRender": function (data, type, full) {
                                return full.DR_CR_IND;
                            }
                        },
                        {
                            "aTargets": [20],
                            "mRender": function (data, type, full) {
                                return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [21],
                            "mRender": function (data, type, full) {
                                return full.GL_ACCT;
                            }
                        },
                        {
                            "aTargets": [22],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                                //return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [23],
                            "mRender": function (data, type, full) {
                                //return full.PAJAK + "%";
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                                //return full.BUS_AREA;
                            }
                        },
                        {
                            "aTargets": [24],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                                //return full.TPBA;
                            }
                        },
                        {
                            "aTargets": [25],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                                //return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [26],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_LC,2,".",",");
                                //return full.AMT_TC;

                            }
                        },
                        {
                            "aTargets": [27],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_LC,2,".",",");
                                //return full.AMT_WITH_BASE_TC;
                            }
                        },
                        {
                            "aTargets": [28],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT,2,".",",");
                                //return full.AMT_WITH_TC;
                            }
                        },
                        {
                             "aTargets": [29],
                             "mRender": function (data, type, full) {
                              //return accounting.formatNumber(full.AMOUNT,2,".",",");
                              return full.ACCT_TYPE;
                              }
                        },
                        {
                            "aTargets": [30],
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.NOMINAL_PEMBAYARAN_IDR,2,".",",");
                                return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [31],
                            "mRender": function (data, type, full) {
                                return full.ITEM_TEXT;
                            }
                        },
                        {
                            "aTargets": [32],
                            "mRender": function (data, type, full) {
                                return full.CUSTOMER;
                            }
                        },

                        {
                            "aTargets": [33],
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }

                        },
                         {
                            "aTargets": [34],
                            "mRender": function (data, type, full) {
                             return full.TERM_PMT;
                             }
                        },
                        {
                            "aTargets": [35],
                            "mRender": function (data, type, full) {
                             return full.DUE_ON;
                             }
                        },
                        {
                             "aTargets": [36],
                             "mRender": function (data, type, full) {
                               return full.REFERENCE_KEY;
                              }
                        },
                        {
                              "aTargets": [37],
                              "mRender": function (data, type, full) {
                                return full.PMT_IND;
                                }
                        },
                        {
                               "aTargets": [38],
                               "mRender": function (data, type, full) {
                                   return full.TRANS_TYPE;
                                     }
                        },
                        {
                                "aTargets": [39],
                                "mRender": function (data, type, full) {
                                    return full.SPREAD_VAL;
                                        }
                        },
                        {
                                "aTargets": [40],
                                "mRender": function (data, type, full) {
                                     return full.PMT_BLOCK;
                                     }
                          },
                        {
                                 "aTargets": [41],
                                 "mRender": function (data, type, full) {
                                  return full.BANK_BYR;
                                    }
                         },
                         {
                             "aTargets": [42],
                             "mRender": function (data, type, full) {
                              return full.NO_REK_HOUSE_BANK;
                                }
                         },
                         {
                              "aTargets": [43],
                              "mRender": function (data, type, full) {
                               return full.PRTNR_BANK_TYPE;
                                }
                         },
                         {
                               "aTargets": [44],
                               "mRender": function (data, type, full) {
                                  return full.BANK_KEY;
                                    }
                         },
                        {
                                  "aTargets": [45],
                                  "mRender": function (data, type, full) {
                                    return full.BANK_ACCOUNT;
                                     }
                        },
                        {
                                 "aTargets": [46],
                                 "mRender": function (data, type, full) {
                                     return full.ACCOUNT_HOLDER;
                                     }
                         },
                        {
                                 "aTargets": [47],
                                 "mRender": function (data, type, full) {
                                   return full.COST_CTR;
                                      }
                        },
                         {
                                  "aTargets": [48],
                                  "mRender": function (data, type, full) {
                                     return full.INT_ORDER;
                                       }
                         },
                         {
                                   "aTargets": [49],
                                   "mRender": function (data, type, full) {
                                      return full.WBS_NUM;
                                         }
                         },
                         {
                                   "aTargets": [50],
                                   "mRender": function (data, type, full) {
                                      return full.CASH_CODE;
                                        }
                          },
                         {
                                    "aTargets": [51],
                                    "mRender": function (data, type, full) {
                                       return full.PO_NUM;
                                         }
                         },
                         {
                                     "aTargets": [52],
                                     "mRender": function (data, type, full) {
                                         return full.PO_ITEM;
                                            }
                         },
                         {
                                       "aTargets": [53],
                                       "mRender": function (data, type, full) {
                                          return full.REF_KEY1;
                                              }
                        },
                        {
                           "aTargets": [54],
                            "mRender": function (data, type, full) {
                            return full.REF_KEY2;
                                }
                         },
                         {
                            "aTargets": [55],
                            "mRender": function (data, type, full) {
                             return full.REF_KEY3;
                                }
                         },
                         {
                            "aTargets": [56],
                            "mRender": function (data, type, full) {
                            return full.OI_IND;
                                 }
                        },
                        {
                            "aTargets": [57],
                            "mRender": function (data, type, full) {
                             return full.TPBA;
                                  }
                         },
                         {
                             "aTargets": [58],
                              "mRender": function (data, type, full) {
                               return full.METODE_PEMBAYARAN;
                                 }
                         },
                        {
                            "aTargets": [59],
                            "mRender": function (data, type, full) {
                                return full.NO_GIRO;
                            }
                        },
                         {
                              "aTargets": [60],
                              "mRender": function (data, type, full) {
                              return full.TGL_RENCANA_BAYAR;
                                  }
                         },
                          {
                               "aTargets": [61],
                               "mRender": function (data, type, full) {
                               return full.OSS_ID;
                                   }
                          },
                          {
                             "aTargets": [62],
                             "mRender": function (data, type, full) {
                             return full.GROUP_ID;
                                 }
                        },
                         // {
                         //       "aTargets": [63],
                         //       "mRender": function (data, type, full) {
                         //       return full.BANK_BYR;
                         //           }
                         //  },
                          {
                             "aTargets": [63],
                             "mRender": function (data, type, full) {
                             return full.CURR_BAYAR;
                                 }
                        },
                        {
                             "aTargets": [64],
                             "mRender": function (data, type, full) {
                             return accounting.formatNumber(full.AMOUNT_BAYAR,2,".",",");
                                 }
                        },
                        {
                             "aTargets": [65],
                             "mRender": function (data, type, full) {
                             return full.BANK_BENEF;
                                 }
                        },
                        {
                             "aTargets": [66],
                             "mRender": function (data, type, full) {
                             return full.NO_REK_BENEF;
                                 }
                        },
                        {
                             "aTargets": [67],
                             "mRender": function (data, type, full) {
                             return full.NAMA_BENEF;
                                 }
                        },
                         {
                              "aTargets": [68],
                              "mRender": function (data, type, full) {
                              return full.SUMBER_DANA;
                                    }
                         },
                          {
                               "aTargets": [69],
                               "mRender": function (data, type, full) {
                               return full.PARTIAL_IND;
                                     }
                          },
                         {
                              "aTargets": [70],
                              "mRender": function (data, type, full) {
                                return full.KETERANGAN;
                              }
                          },
                         {
                              "aTargets": [71],
                              "mRender": function (data, type, full) {
                                return full.STATUS_TRACKING;

                              }
                         },
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_operator/rekap_invoice_draft/get_rekap_invoice_draft",
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
                                    hideLoadingCss()
                                    getTotalTagihan();
                                    return res.data;
                                }
                        }
                    ,
                    "drawCallback":
                        function (settings) {
                            // $(".dataTables_scrollHeadInner").css({"width":"100%"});
                            // $(".table ").css({"width":"100%"});
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
//                            success: function (res) {
//                                var response = res.data[0];
//                            },
                            success: function (res) {
                                var response = res.data[0];
                                if (response.NOMOR == 1) {
                                    api.column(0).visible(true);
                                } else {
                                    api.column(0).visible(false);
                                }
                                if (response.KET == 1) {
                                    api.column(1).visible(true);
                                } else {
                                    api.column(1).visible(false);
                                }
                                if (response.DOC_NO == 1) {
                                    api.column(2).visible(true);
                                } else {
                                    api.column(2).visible(false);
                                }
                                if (response.DOC_DATE == 1) {
                                    api.column(3).visible(true);
                                } else {
                                    api.column(3).visible(false);
                                }
                                if (response.REV_WITH == 1) {
                                    api.column(4).visible(true);
                                } else {
                                    api.column(4).visible(false);
                                }
                                if (response.REV_YEAR == 1) {
                                    api.column(5).visible(true);
                                } else {
                                    api.column(5).visible(false);
                                }
                                if (response.POST_DATE == 1) {
                                    api.column(6).visible(true);
                                } else {
                                    api.column(6).visible(false);
                                }
                                if (response.BASE_DATE == 1) {
                                    api.column(7).visible(true);
                                } else {
                                    api.column(7).visible(false);
                                }
                                if (response.ENTRY_DATE == 1) {
                                    api.column(8).visible(true);
                                } else {
                                    api.column(8).visible(false);
                                }
                                if (response.DOC_TYPE == 1) {
                                    api.column(9).visible(true);
                                } else {
                                    api.column(9).visible(false);
                                }
                                if (response.FISC_YEAR == 1) {
                                    api.column(10).visible(true);
                                } else {
                                    api.column(10).visible(false);
                                }
                                if (response.DOC_HDR_TXT == 1) {
                                    api.column(11).visible(true);
                                } else {
                                    api.column(11).visible(false);
                                }
                                if (response.REFERENCE == 1) {
                                    api.column(12).visible(true);
                                } else {
                                    api.column(12).visible(false);
                                }
                                if (response.TGL_TAGIHAN_DITERIMA == 1) {
                                    api.column(13).visible(true);
                                } else {
                                    api.column(13).visible(false);
                                }
                                if (response.COMP_CODE == 1) {
                                    api.column(14).visible(true);
                                } else {
                                    api.column(14).visible(false);
                                }
                                if (response.BUS_AREA == 1) {
                                    api.column(15).visible(true);
                                } else {
                                    api.column(15).visible(false);
                                }
                                if (response.CURRENCY == 1) {
                                    api.column(16).visible(true);
                                } else {
                                    api.column(16).visible(false);
                                }
                                if (response.EXCH_RATE == 1) {
                                    api.column(17).visible(true);
                                } else {
                                    api.column(17).visible(false);
                                }
                                if (response.LINE_ITEM == 1) {
                                    api.column(18).visible(false);
                                } else {
                                    api.column(18).visible(false);
                                }
                                if (response.DR_CR_IND == 1) {
                                    api.column(19).visible(true);
                                } else {
                                    api.column(19).visible(false);
                                }
                                if (response.SPEC_GL == 1) {
                                    api.column(20).visible(true);
                                } else {
                                    api.column(20).visible(false);
                                }
                                if (response.GL_ACCT == 1) {
                                    api.column(21).visible(true);
                                } else {
                                    api.column(21).visible(false);
                                }
                                if (response.AMT_TC == 1) {
                                    api.column(22).visible(true);
                                } else {
                                    api.column(22).visible(false);
                                }
                                if (response.AMT_LC == 1) {
                                    api.column(23).visible(true);
                                } else {
                                    api.column(23).visible(false);
                                }
                                if (response.AMT_WITH_BASE_TC == 1) {
                                    api.column(24).visible(true);
                                } else {
                                    api.column(24).visible(false);
                                }
                                if (response.AMT_WITH_TC == 1) {
                                    api.column(25).visible(true);
                                } else {
                                    api.column(25).visible(false);
                                }
                                if (response.AMT_WITH_BASE_LC == 1) {
                                    api.column(26).visible(true);
                                } else {
                                    api.column(26).visible(false);
                                }
                                if (response.AMT_WITH_LC == 1) {
                                    api.column(27).visible(true);
                                } else {
                                    api.column(27).visible(false);
                                }
                                if (response.AMOUNT == 1) {
                                    api.column(28).visible(true);
                                } else {
                                    api.column(28).visible(false);
                                }
                                if (response.ACCT_TYPE == 1) {
                                    api.column(29).visible(true);
                                } else {
                                    api.column(29).visible(false);
                                }
                                if (response.ASSIGNMENT == 1) {
                                    api.column(30).visible(true);
                                } else {
                                    api.column(30).visible(false);
                                }
                                if (response.ITEM_TEXT == 1) {
                                    api.column(31).visible(true);
                                } else {
                                    api.column(31).visible(false);
                                }
                                if (response.CUSTOMER_NAME == 1) {
                                    api.column(32).visible(true);
                                } else {
                                    api.column(32).visible(false);
                                }
                                if (response.VENDOR_NAME == 1) {
                                    api.column(33).visible(true);
                                } else {
                                    api.column(33).visible(false);
                                }
                                if (response.TERM_PMT == 1) {
                                    api.column(34).visible(true);
                                } else {
                                    api.column(34).visible(false);
                                }
                                if (response.DUE_ON == 1) {
                                    api.column(35).visible(true);
                                } else {
                                    api.column(35).visible(false);
                                }
                                if (response.REFERENCE_KEY == 1) {
                                    api.column(36).visible(true);
                                } else {
                                    api.column(36).visible(false);
                                }
                                if (response.PMT_IND == 1) {
                                    api.column(37).visible(true);
                                } else {
                                    api.column(37).visible(false);
                                }
                                if (response.TRANS_TYPE == 1) {
                                    api.column(38).visible(true);
                                } else {
                                    api.column(38).visible(false);
                                }
                                if (response.SPREAD_VAL == 1) {
                                    api.column(39).visible(true);
                                } else {
                                    api.column(39).visible(false);
                                }
                                if (response.PMT_BLOCK == 1) {
                                    api.column(40).visible(true);
                                } else {
                                    api.column(40).visible(false);
                                }
                                if (response.HOUSE_BANK == 1) {
                                    api.column(41).visible(true);
                                } else {
                                    api.column(41).visible(false);
                                }
                                if (response.NO_REK_HOUSE_BANK == 1) {
                                    api.column(42).visible(true);
                                } else {
                                    api.column(42).visible(false);
                                }
                                if (response.PRTNR_BANK_TYPE == 1) {
                                    api.column(43).visible(true);
                                } else {
                                    api.column(43).visible(false);
                                }
                                if (response.BANK_KEY == 1) {
                                    api.column(44).visible(true);
                                } else {
                                    api.column(44).visible(false);
                                }
                                if (response.BANK_ACCOUNT == 1) {
                                    api.column(45).visible(true);
                                } else {
                                    api.column(45).visible(false);
                                }
                                if (response.ACCOUNT_HOLDER == 1) {
                                    api.column(46).visible(true);
                                } else {
                                    api.column(46).visible(false);
                                }
                                if (response.COST_CTR == 1) {
                                    api.column(47).visible(true);
                                } else {
                                    api.column(47).visible(false);
                                }
                                if (response.INT_ORDER == 1) {
                                    api.column(48).visible(true);
                                } else {
                                    api.column(48).visible(false);
                                }
                                if (response.WBS_NUM == 1) {
                                    api.column(49).visible(true);
                                } else {
                                    api.column(49).visible(false);
                                }
                                if (response.CASH_CODE == 1) {
                                    api.column(50).visible(true);
                                } else {
                                    api.column(50).visible(false);
                                }
                                if (response.PO_NUM == 1) {
                                    api.column(51).visible(true);
                                } else {
                                    api.column(51).visible(false);
                                }
                                if (response.PO_ITEM == 1) {
                                    api.column(52).visible(true);
                                } else {
                                    api.column(52).visible(false);
                                }
                                if (response.REF_KEY1 == 1) {
                                    api.column(53).visible(true);
                                } else {
                                    api.column(53).visible(false);
                                }
                                if (response.REF_KEY2 == 1) {
                                    api.column(54).visible(true);
                                } else {
                                    api.column(54).visible(false);
                                }
                                if (response.REF_KEY3 == 1) {
                                    api.column(55).visible(true);
                                } else {
                                    api.column(55).visible(false);
                                }
                                if (response.OI_IND == 1) {
                                    api.column(56).visible(true);
                                } else {
                                    api.column(56).visible(false);
                                }
                                if (response.TPBA == 1) {
                                    api.column(57).visible(true);
                                } else {
                                    api.column(57).visible(false);
                                }
                                if (response.METODE_PEMBAYARAN == 1) {
                                    api.column(58).visible(true);
                                } else {
                                    api.column(58).visible(false);
                                }
                                if (response.TGL_RENCANA_BAYAR == 1) {
                                    api.column(59).visible(true);
                                } else {
                                    api.column(59).visible(false);
                                }
                                if (response.OSS_ID == 1) {
                                    api.column(60).visible(true);
                                } else {
                                    api.column(60).visible(false);
                                }
                                if (response.GROUP_ID == 1) {
                                    api.column(61).visible(true);
                                } else {
                                    api.column(61).visible(false);
                                }
                                if (response.BANK_BYR == 1) {
                                    api.column(62).visible(true);
                                } else {
                                    api.column(62).visible(false);
                                }
                                if (response.CURR_BAYAR == 1) {
                                    api.column(63).visible(true);
                                } else {
                                    api.column(63).visible(false);
                                }
                                if (response.AMOUNT_BAYAR == 1) {
                                    api.column(64).visible(true);
                                } else {
                                    api.column(64).visible(false);
                                }
                                if (response.BANK_BENEF == 1) {
                                    api.column(65).visible(true);
                                } else {
                                    api.column(65).visible(false);
                                }
                                if (response.NO_REK_BENEF == 1) {
                                    api.column(66).visible(true);
                                } else {
                                    api.column(66).visible(false);
                                }
                                if (response.NAMA_BENEF == 1) {
                                    api.column(67).visible(true);
                                } else {
                                    api.column(67).visible(false);
                                }
                                // if (response.TGL_ACT_BAYAR == 1) {
                                //     api.column(68).visible(true);
                                // } else {
                                //     api.column(68).visible(false);
                                // }
                                if (response.SUMBER_DANA == 1) {
                                    api.column(68).visible(true);
                                } else {
                                    api.column(68).visible(false);
                                }
                                 if (response.PARTIAL_IND == 1) {
                                    api.column(69).visible(true);
                                } else {
                                    api.column(69).visible(false);
                                }
                                if (response.KETERANGAN == 1) {
                                    api.column(70).visible(true);
                                } else {
                                    api.column(70).visible(false);
                                }
                                    if (response.STATUS_TRACKING == 1) {
                                    api.column(71).visible(true);
                                } else {
                                    api.column(71).visible(false);
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
                 var html = '<button class="btn btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" data-toggle="modal" title="Tampilkan Kolom" onclick="showColumn()"><i class="fa fa-arrows-alt"></i></button>';
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
            hideLoadingCss("")
            //getInquiry(pSource, pBank,  pBeneficiaryAccount);
            // // console.log("data edit_data :",res);

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
            hideLoadingCss("")
            //getInquiry(pSource, pBank,  pBeneficiaryAccount);
            // // console.log("data edit_data :",res);
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
            hideLoadingCss("")
            getInquiry(pSource, pBank,  pBeneficiaryAccount);
            // // console.log("data edit_data :",res);
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
            $("#pAmountBayar2").val(res[0].AMOUNT_BAYAR);
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
        url: baseUrl + "api_operator/rekap_invoice_draft/get_column",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var response = res.data[0];

            if (response.NOMOR == 1) {
                $("#hc0").prop("checked", true);
            } else {
                $("#hc0").prop("checked", false);
            }
            if (response.KET == 1) {
                $("#hc1").prop("checked", true);
            } else {
                $("#hc1").prop("checked", false);
            }
            if (response.DOC_NO == 1) {
                $("#hc2").prop("checked", true);
            } else {
                $("#hc2").prop("checked", false);
            }
            if (response.DOC_DATE == 1) {
                $("#hc3").prop("checked", true);
            } else {
                $("#hc3").prop("checked", false);
            }
            if (response.REV_WITH == 1) {
                $("#hc4").prop("checked", true);
            } else {
                $("#hc4").prop("checked", false);
            }
            if (response.REV_YEAR == 1) {
                $("#hc5").prop("checked", true);
            } else {
                $("#hc5").prop("checked", false);
            }
            if (response.POST_DATE == 1) {
                $("#hc6").prop("checked", true);
            } else {
                $("#hc6").prop("checked", false);
            }
            if (response.BASE_DATE == 1) {
                $("#hc7").prop("checked", true);
            } else {
                $("#hc7").prop("checked", false);
            }
            if (response.ENTRY_DATE == 1) {
                $("#hc8").prop("checked", true);
            } else {
                $("#hc8").prop("checked", false);
            }
            if (response.DOC_TYPE == 1) {
                $("#hc9").prop("checked", true);
            } else {
                $("#hc9").prop("checked", false);
            }
            if (response.FISC_YEAR == 1) {
                $("#hc10").prop("checked", true);
            } else {
                $("#hc10").prop("checked", false);
            }
            if (response.DOC_HDR_TXT == 1) {
                $("#hc11").prop("checked", true);
            } else {
                $("#hc11").prop("checked", false);
            }
            if (response.REFERENCE == 1) {
                $("#hc12").prop("checked", true);
            } else {
                $("#hc12").prop("checked", false);
            }
            if (response.TGL_TAGIHAN_DITERIMA == 1) {
                $("#hc13").prop("checked", true);
            } else {
                $("#hc13").prop("checked", false);
            }
            if (response.COMP_CODE == 1) {
                $("#hc14").prop("checked", true);
            } else {
                $("#hc14").prop("checked", false);
            }
            if (response.BUS_AREA == 1) {
                $("#hc15").prop("checked", true);
            } else {
                $("#hc15").prop("checked", false);
            }
            if (response.CURRENCY == 1) {
                $("#hc16").prop("checked", true);
            } else {
                $("#hc16").prop("checked", false);
            }
            if (response.EXCH_RATE == 1) {
                $("#hc17").prop("checked", true);
            } else {
                $("#hc17").prop("checked", false);
            }
            if (response.LINE_ITEM == 1) {
                $("#hc18").prop("checked", true);
            } else {
                $("#hc18").prop("checked", false);
            }
            if (response.DR_CR_IND == 1) {
                $("#hc19").prop("checked", true);
            } else {
                $("#hc19").prop("checked", false);
            }
            if (response.SPEC_GL == 1) {
                $("#hc20").prop("checked", true);
            } else {
                $("#hc20").prop("checked", false);
            }
            if (response.GL_ACCT == 1) {
                $("#hc21").prop("checked", true);
            } else {
                $("#hc21").prop("checked", false);
            }
            if (response.AMT_TC == 1) {
                $("#hc22").prop("checked", true);
            } else {
                $("#hc22").prop("checked", false);
            }
            if (response.AMT_LC == 1) {
                $("#hc23").prop("checked", true);
            } else {
                $("#hc23").prop("checked", false);
            }
            if (response.AMT_WITH_BASE_TC == 1) {
                $("#hc24").prop("checked", true);
            } else {
                $("#hc24").prop("checked", false);
            }
            if (response.AMT_WITH_TC == 1) {
                $("#hc25").prop("checked", true);
            } else {
                $("#hc25").prop("checked", false);
            }
             if (response.AMT_WITH_BASE_LC == 1) {
                $("#hc26").prop("checked", true);
            } else {
                $("#hc26").prop("checked", false);
            }
            if (response.AMT_WITH_LC == 1) {
                $("#hc27").prop("checked", true);
            } else {
                $("#hc27").prop("checked", false);
            }
            if (response.AMOUNT == 1) {
                $("#hc28").prop("checked", true);
            } else {
                $("#hc28").prop("checked", false);
            }
            if (response.ACCT_TYPE == 1) {
                $("#hc29").prop("checked", true);
            } else {
                $("#hc29").prop("checked", false);
            }
            if (response.ASSIGNMENT == 1) {
                $("#hc30").prop("checked", true);
            } else {
                $("#hc30").prop("checked", false);
            }
            if (response.ITEM_TEXT == 1) {
                $("#hc31").prop("checked", true);
            } else {
                $("#hc31").prop("checked", false);
            }
            if (response.CUSTOMER_NAME == 1) {
                $("#hc32").prop("checked", true);
            } else {
                $("#hc32").prop("checked", false);
            }
            if (response.VENDOR_NAME == 1) {
                $("#hc33").prop("checked", true);
            } else {
                $("#hc33").prop("checked", false);
            }
            if (response.TERM_PMT == 1) {
                $("#hc34").prop("checked", true);
            } else {
                $("#hc34").prop("checked", false);
            }
            if (response.DUE_ON == 1) {
                $("#hc35").prop("checked", true);
            } else {
                $("#hc35").prop("checked", false);
            }
            if (response.REFERENCE_KEY == 1) {
                $("#hc36").prop("checked", true);
            } else {
                $("#hc36").prop("checked", false);
            }
            if (response.PMT_IND == 1) {
                $("#hc37").prop("checked", true);
            } else {
                $("#hc37").prop("checked", false);
            }
             if (response.TRANS_TYPE == 1) {
                $("#hc38").prop("checked", true);
            } else {
                $("#hc38").prop("checked", false);
            }
             if (response.SPREAD_VAL == 1) {
                $("#hc39").prop("checked", true);
            } else {
                $("#hc39").prop("checked", false);
            }
             if (response.PMT_BLOCK == 1) {
                $("#hc40").prop("checked", true);
            } else {
                $("#hc40").prop("checked", false);
            }
             if (response.HOUSE_BANK == 1) {
                $("#hc41").prop("checked", true);
            } else {
                $("#hc41").prop("checked", false);
            }
             if (response.NO_REK_HOUSE_BANK == 1) {
                $("#hc42").prop("checked", true);
            } else {
                $("#hc42").prop("checked", false);
            }
             if (response.PRTNR_BANK_TYPE == 1) {
                $("#hc43").prop("checked", true);
            } else {
                $("#hc43").prop("checked", false);
            }
             if (response.BANK_KEY == 1) {
                $("#hc44").prop("checked", true);
            } else {
                $("#hc44").prop("checked", false);
            }
            if (response.BANK_ACCOUNT == 1) {
                 $("#hc45").prop("checked", true);
             } else {
                 $("#hc45").prop("checked", false);
             }
              if (response.ACCOUNT_HOLDER == 1) {
                  $("#hc46").prop("checked", true);
              } else {
                  $("#hc46").prop("checked", false);
              }
               if (response.COST_CTR == 1) {
                   $("#hc47").prop("checked", true);
               } else {
                   $("#hc47").prop("checked", false);
               }
                if (response.INT_ORDER == 1) {
                    $("#hc48").prop("checked", true);
                } else {
                    $("#hc48").prop("checked", false);
                }
                 if (response.WBS_NUM == 1) {
                     $("#hc49").prop("checked", true);
                 } else {
                     $("#hc49").prop("checked", false);
                 }
                  if (response.CASH_CODE == 1) {
                      $("#hc50").prop("checked", true);
                  } else {
                      $("#hc50").prop("checked", false);
                  }
               if (response.PO_NUM == 1) {
                    $("#hc51").prop("checked", true);
                } else {
                    $("#hc51").prop("checked", false);
                }
                if (response.PO_ITEM == 1) {
                      $("#hc52").prop("checked", true);
                  } else {
                      $("#hc52").prop("checked", false);
                  }
                if (response.REF_KEY1 == 1) {
                    $("#hc53").prop("checked", true);
                } else {
                    $("#hc53").prop("checked", false);
                }
                if (response.REF_KEY2 == 1) {
                    $("#hc54").prop("checked", true);
                } else {
                    $("#hc54").prop("checked", false);
                }
                if (response.REF_KEY3 == 1) {
                    $("#hc55").prop("checked", true);
                } else {
                    $("#hc55").prop("checked", false);
                }
                if (response.OI_IND == 1) {
                    $("#hc56").prop("checked", true);
                } else {
                    $("#hc56").prop("checked", false);
                }
                if (response.TPBA == 1) {
                    $("#hc57").prop("checked", true);
                } else {
                    $("#hc57").prop("checked", false);
                }
                if (response.METODE_PEMBAYARAN == 1) {
                    $("#hc58").prop("checked", true);
                } else {
                    $("#hc58").prop("checked", false);
                }
                if (response.NO_GIRO == 1) {
                    $("#hc59").prop("checked", true);
                } else {
                    $("#hc59").prop("checked", false);
                }
                if (response.TGL_RENCANA_BAYAR == 1) {
                    $("#hc60").prop("checked", true);
                } else {
                    $("#hc60").prop("checked", false);
                }
                if (response.OSS_ID == 1) {
                    $("#hc61").prop("checked", true);
                } else {
                    $("#hc61").prop("checked", false);
                }
                if (response.GROUP_ID == 1) {
                    $("#hc62").prop("checked", true);
                } else {
                    $("#hc62").prop("checked", false);
                }
                if (response.CURR_BAYAR == 1) {
                    $("#hc63").prop("checked", true);
                } else {
                    $("#hc63").prop("checked", false);
                }
                if (response.AMOUNT_BAYAR == 1) {
                    $("#hc64").prop("checked", true);
                } else {
                    $("#hc64").prop("checked", false);
                }
                if (response.BANK_BENEF == 1) {
                    $("#hc65").prop("checked", true);
                } else {
                    $("#hc65").prop("checked", false);
                }
                 if (response.NO_REK_BENEF == 1) {
                    $("#hc66").prop("checked", true);
                } else {
                    $("#hc66").prop("checked", false);
                }
                 if (response.NAMA_BENEF == 1) {
                    $("#hc67").prop("checked", true);
                } else {
                    $("#hc67").prop("checked", false);
                }
                 if (response.SUMBER_DANA == 1) {
                    $("#hc68").prop("checked", true);
                } else {
                    $("#hc68").prop("checked", false);
                }
                 if (response.PARTIAL_IND == 1) {
                    $("#hc69").prop("checked", true);
                } else {
                    $("#hc69").prop("checked", false);
                }
                 if (response.KETERANGAN == 1) {
                    $("#hc70").prop("checked", true);
                } else {
                    $("#hc70").prop("checked", false);
                }
                 if (response.STATUS_TRACKING == 1) {
                    $("#hc71").prop("checked", true);
                } else {
                    $("#hc71").prop("checked", false);
                }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}

function saveColumn() {
    var hc0 = $("#hc0").prop('checked');
    var hc1 = $("#hc1").prop('checked');
    var hc2 = $("#hc2").prop('checked');
    var hc3 = $("#hc3").prop('checked');
    var hc4 = $("#hc4").prop('checked');
    var hc5 = $("#hc5").prop('checked');
    var hc6 = $("#hc6").prop('checked');
    var hc7 = $("#hc7").prop('checked');
    var hc8 = $("#hc8").prop('checked');
    var hc9 = $("#hc9").prop('checked');
    var hc10 = $("#hc10").prop('checked');
    var hc11 = $("#hc11").prop('checked');
    var hc12 = $("#hc12").prop('checked');
    var hc13 = $("#hc13").prop('checked');
    var hc14 = $("#hc14").prop('checked');
    var hc15 = $("#hc15").prop('checked');
    var hc16 = $("#hc16").prop('checked');
    var hc17 = $("#hc17").prop('checked');
    var hc18 = $("#hc18").prop('checked');
    var hc19 = $("#hc19").prop('checked');
    var hc20 = $("#hc20").prop('checked');
    var hc21 = $("#hc21").prop('checked');
    var hc22 = $("#hc22").prop('checked');
    var hc23 = $("#hc23").prop('checked');
    var hc24 = $("#hc24").prop('checked');
    var hc25 = $("#hc25").prop('checked');
    var hc26 = $("#hc26").prop('checked');
    var hc27 = $("#hc27").prop('checked');
    var hc28 = $("#hc28").prop('checked');
    var hc29 = $("#hc29").prop('checked');
    var hc30 = $("#hc30").prop('checked');
    var hc31 = $("#hc31").prop('checked');
    var hc32 = $("#hc32").prop('checked');
    var hc33 = $("#hc33").prop('checked');
    var hc34 = $("#hc34").prop('checked');
    var hc35 = $("#hc35").prop('checked');
    var hc36 = $("#hc36").prop('checked');
    var hc37 = $("#hc37").prop('checked');
    var hc38 = $("#hc38").prop('checked');
    var hc39 = $("#hc39").prop('checked');
    var hc40 = $("#hc40").prop('checked');
    var hc41 = $("#hc41").prop('checked');
    var hc42 = $("#hc42").prop('checked');
    var hc43 = $("#hc43").prop('checked');
    var hc44 = $("#hc44").prop('checked');
    var hc45 = $("#hc45").prop('checked');
    var hc46 = $("#hc46").prop('checked');
    var hc47 = $("#hc47").prop('checked');
    var hc48 = $("#hc48").prop('checked');
    var hc49 = $("#hc49").prop('checked');
    var hc50 = $("#hc50").prop('checked');
    var hc51 = $("#hc51").prop('checked');
    var hc52 = $("#hc52").prop('checked');
    var hc53 = $("#hc53").prop('checked');
    var hc54 = $("#hc54").prop('checked');
    var hc55 = $("#hc55").prop('checked');
    var hc56 = $("#hc56").prop('checked');
    var hc57 = $("#hc57").prop('checked');
    var hc58 = $("#hc58").prop('checked');
    var hc59 = $("#hc59").prop('checked');
    var hc60 = $("#hc60").prop('checked');
    var hc61 = $("#hc61").prop('checked');
    var hc62 = $("#hc62").prop('checked');
    var hc63 = $("#hc63").prop('checked');
    var hc64 = $("#hc64").prop('checked');
    var hc65 = $("#hc65").prop('checked');
    var hc66 = $("#hc66").prop('checked');
    var hc67 = $("#hc67").prop('checked');
    var hc68 = $("#hc68").prop('checked');
    var hc69 = $("#hc69").prop('checked');
    var hc70 = $("#hc70").prop('checked');
    var hc71 = $("#hc71").prop('checked');

    var data = {
        "nomor" : hc0 === true ? 1 : 0,
        "ket" : hc1 === true ? 1 : 0,
        "doc_no" : hc2 === true ? 1 : 0,
        "doc_date2" : hc3 === true ? 1 : 0,
        "rev_with" : hc4 === true ? 1 : 0,
        "rev_year" : hc5 === true ? 1 : 0,
        "post_date2" : hc6 === true ? 1 : 0,
        "base_date" : hc7 === true ? 1 : 0,
        "entry_date2" : hc8 === true ? 1 : 0,
        "doc_type" : hc9 === true ? 1 : 0,
        "fisc_year" : hc10 === true ? 1 : 0,
        "doc_hdr_txt" : hc11 === true ? 1 : 0,
        "reference" : hc12 === true ? 1 : 0,
        "tgl_tagihan_diterima" : hc13 === true ? 1 : 0,
        "comp_code" : hc14 === true ? 1 : 0,
        "bus_area" : hc15 === true ? 1 : 0,
        "currency" : hc16 === true ? 1 : 0,
        "exch_rate" : hc17 === true ? 1 : 0,
        "line_item" : hc18 === true ? 1 : 0,
        "dr_cr_ind" : hc19 === true ? 1 : 0,
        "spec_gl" : hc20 === true ? 1 : 0,
        "gl_acct" : hc21 === true ? 1 : 0,
        "amt_tc" : hc22 === true ? 1 : 0,
        "amt_lc" : hc23 === true ? 1 : 0,
        "amt_with_base_tc" : hc24 === true ? 1 : 0,
        "amt_with_tc" : hc25 === true ? 1 : 0,
        "amt_with_base_lc" : hc26 === true ? 1 : 0,
        "amt_with_lc" : hc27 === true ? 1 : 0,
        "amount" : hc28 === true ? 1 : 0,
        "acct_type" : hc29 === true ? 1 : 0,
        "assignment" : hc30 === true ? 1 : 0,
        "item_text" : hc31 === true ? 1 : 0,
        "customer" : hc32 === true ? 1 : 0,
        "vendor" : hc33 === true ? 1 : 0,
        "term_pmt" : hc34 === true ? 1 : 0,
        "due_on" : hc35 === true ? 1 : 0,
        "reference_key" : hc36 === true ? 1 : 0,
        "pmt_ind" : hc37 === true ? 1 : 0,
        "trans_type" : hc38 === true ? 1 : 0,
        "spread_val" : hc39 === true ? 1 : 0,
        "pmt_block" : hc40 === true ? 1 : 0,
        "house_bank" : hc41 === true ? 1 : 0,
        "no_rek_house_bank" : hc42 === true ? 1 : 0,
        "prtnr_bank_type" : hc43 === true ? 1 : 0,
        "bank_key" : hc44 === true ? 1 : 0,
        "bank_account" : hc45 === true ? 1 : 0,
        "account_holder" : hc46 === true ? 1 : 0,
        "cost_ctr" : hc47 === true ? 1 : 0,
        "int_order" : hc48 === true ? 1 : 0,
        "wbs_num" : hc49 === true ? 1 : 0,
        "cash_code" : hc50 === true ? 1 : 0,
        "po_num" : hc51 === true ? 1 : 0,
        "po_item" : hc52 === true ? 1 : 0,
        "ref_key1" : hc53 === true ? 1 : 0,
        "ref_key2" : hc54 === true ? 1 : 0,
        "ref_key3" : hc55 === true ? 1 : 0,
        "oi_ind" : hc56 === true ? 1 : 0,
        "tpba" : hc57 === true ? 1 : 0,
        "metode_pembayaran" : hc58 === true ? 1 : 0,
        "no_giro" : hc59 === true ? 1 : 0,
        "tgl_rencana_bayar" : hc60 === true ? 1 : 0,
        "oss_id" : hc61 === true ? 1 : 0,
        "group_id" : hc62 === true ? 1 : 0,
        "bank_byr" : 0,
        "curr_bayar" : hc63 === true ? 1 : 0,
        "amount_bayar" : hc64 === true ? 1 : 0,
        "bank_benef" : hc65 === true ? 1 : 0,
        "no_rek_benef" : hc66 === true ? 1 : 0,
        "nama_benef" : hc67 === true ? 1 : 0,
        "sumber_dana" : hc68 === true ? 1 : 0,
        "partial_ind" : hc69 === true ? 1 : 0,
        "keterangan" : hc70 === true ? 1 : 0,
        "status_tracking" : hc71 === true ? 1 : 0,
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
    // // // console.log("data save column", data);
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
        //// // console.log(res[0].NO_REK_HOUSE_BANK)
            hideLoadingCss("")
            // // console.log("data edit_data :",res);
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
                $("#btn-payment").show();
            }else{
                $("#btn-payment").hide();
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
            //url: baseUrl+"api_operator/rekap_invoice_belum/edit_data",
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

function setSelectMetodeBayar(idHtml,idSelectElement){
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_metode_bayar",
        dataType: 'JSON',
        type: "GET",
        sync :true,


        success: function (res) {
            // // console.log("Select Hasil : ",res);
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.METODE_PEMBAYARAN + '">'+val.METODE_PEMBAYARAN+'</option>');
            });
//            // // console.log("jenis pemb : ", idForSelected);
            if (idSelectElement != "") {
                $("#" + idHtml + "").val(idSelectElement).trigger('change');
            } else {
                $('#pBankPembayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
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
//            // // console.log("jenis pemb : ", idForSelected);
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
//            // // console.log("jenis pemb : ", idForSelected);
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

    showLoadingCss()
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
                    hideLoadingCss("")
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

function update_status_giro(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking){
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
        showLoadingCss();
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
                showLoadingCss();
                var tes = JSON.stringify(res);
                // // console.log(res);

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
                 pBank: $("#pBankBayar").val(),
                 pSource: $("#pNoRekPln").val(),
                 pAccountNumber: $("#pNoRekPln").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor").val(),
                 pDestinationBankCode: $("#pKodeBankPenerima").val(),
            },
            success: function (res) {
               showLoadingCss();
                var tes = JSON.stringify(res);
               // // // console.log(res);


//                if (res.return == 1) {
//                    alert(res.OUT_MSG);

               // }
//                else {
//                   // // console.log("DIAZZZ");
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
        showLoadingCss();
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
                hideLoadingCss("")
                // // console.log(res);
                if (res.return == 1) {
                  $("#pStatusValidasi2").val(res.OUT_MSG);
                  if(res.OUT_MSG == "VALID"){
                        $("#btn-payment").show();
                  }
                } else {
                    $("#btn-payment").hide();
                  $("#pStatusValidasi2").val(res.OUT_MSG);
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });

}

function updLunas(pStatus){
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

function doPayment(pMetodeBayar, pBank, pRefNum, pSource, pBeneficiaryAccount, pCurrency,
                    pAmount, pRemark, pBenefEmail, pBenefName, pBenefAddr1, pBenefAddr2, pDestinationBank,
                    pFeeType){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Pembayaran ? (Pastikan Data Sudah Benar)");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_belum/do_payment",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pMetodeBayar: $("#pMetodePembayaran2").val(),
                 pBank: $("#pBankPembayarans2").val(),
                 pRefNum: $("#pRefKey4").val(),
                 pSource: $("#pNoRekPLN2").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor2").val(),
                 pCurrency: $("#pCurrBayar2").val(),
                 pAmount: $("#pTotalTagihan2").val(),
                 pAmountBayar: $("#pAmountBayar2").val(),
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
               showLoadingCss();
                // // console.log(res);
                var tes = JSON.stringify(res);
                if (res.responseMessage == 'Sukses') {
                    var pStatus = res.data.responseMessage;

                     updLunas(pStatus);
                     $("#pRespon3").val(tes);
                   table_rekapitulasi.ajax.reload();

                  }
                else {
                        alert(res.responseMessage);
                        table_rekapitulasi.ajax.reload();
                         $("#pRespons3").val(tes);
                 }
            },
            error: function () {
                hideLoadingCss("Sukses")
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

function insertMultipleEdit(){
    let cash_code = $("#pCashCodeMultiple").val()
    let jam_bayar = $("#pJamBayarMultiple").val()
    let metode_bayar = $("#pMetodeBayarMultiple").val()
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/insert_multiple_edit",
        dataType: 'JSON',
        type: "POST",
        data: {
            pData: JSON.stringify(invoiceCheckedArray),
            pCashCode: cash_code,
            pMetodePembayaran : metode_bayar,
            pJamBayar: jam_bayar,
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
    $("#pCashCodeMultiple").val("")
    $("#pJamBayarMultiple").val("")
    $("#pMetodeBayarMultiple").val("")
    $('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
    setSelectCashCode("pCashCodeMultiple","");
    setSelectMetodeBayar("pMetodeBayarMultiple","");
    //$('#edit-modal2').modal({backdrop: 'static', keyboard: false});
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
    // console.log("Full Array : ", fullArrayGroup);
    // console.log("invoice array : ",invoiceCheckedArray);
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
        } else Swal.fire("Maaf", "Tidak bisa melakukan Grouping","error");
    }
}

function isSame(data){
    if(data == null || data.length <= 0){
        return false;
    } else {
        let bank = data[0].BANK_BYR;
        let hb_rekening = data[0].NO_REK_HOUSE_BANK;
        // let comp_code = data[0].COMP_CODE;
        let assign = data[0].ASSIGNMENT;
        // let bus_area = data[0].BUS_AREA;
        let due_on = data[0].TGL_RENCANA_BAYAR;
        let sumber_dana = data[0].SUMBER_DANA;
        let inq_name = data[0].INQ_CUSTOMER_NAME;
        let no_giro = data[0].NO_GIRO;
        let curr_bayar = data[0].CURR_BAYAR;

    // || comp_code != data[x].COMP_CODE

        for(let x = 0; x < data.length; x++){
             if (data[x].METODE_PEMBAYARAN === "-"){
                 return 222;
             }
            if(due_on !== data[x].TGL_RENCANA_BAYAR || bank !== data[x].BANK_BYR || hb_rekening !== data[x].NO_REK_HOUSE_BANK || assign !== data[x].ASSIGNMENT || sumber_dana !== data[x].SUMBER_DANA ||
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
                        window.open(baseUrl+"generate_doc/cetak/downloadfile/laporan_"+item.pDocNo+".docx","_blank");
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

function cetakBuktiKasSingle(comp_code, doc_no, fiscal_year, line_item, ket){
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
            if (res.createdoc.status === 1){
                // console.log("Result : ",res);
                alert("Berhasil Membuat Dokumen. Click 'Ok' untuk mengunduh.");
                window.open(baseUrl+"generate_doc/cetak/downloadfile/laporan_"+doc_no+".docx","_blank");
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