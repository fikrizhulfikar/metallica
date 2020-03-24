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
    getAllData();
//     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectMetodeBayar("cmb_cara_pembayaran","");
    setSelectStatusTracking("cmb_status_tracking");
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
            initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val(), $("#cmb_status_tracking").val())
            getAllData()
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
                        {width: 100, targets: 72},
                        // {width: 100, targets: 35},
                        // {width: 100, targets: 36},
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71]
                        },
                        {
                            "sortable": false,
                            "aTargets": [0]
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
                                return full.COMP_CODE;
                            }

                        },
                        {
                            "aTargets": [14],
                            "mRender": function (data, type, full) {
                                return full.BUS_AREA;
                            }

                        },
                        {
                            "aTargets": [15],
                            "mRender": function (data, type, full) {
                                return full.CURRENCY;
                            }

                        },
                        {
                            "aTargets": [16],
                            "mRender": function (data, type, full) {
                                return full.EXCH_RATE;
                            }

                        },
                        {
                            "aTargets": [17],
                            "mRender": function (data, type, full) {
                                return full.LINE_ITEM;
                            }

                        },
                        {
//                            "aTargets": [18],
//                            "visible": false,
//                            "mRender": function (data, type, full) {
//                                //return full.TGL_LUNAS;
//                                return "";
//                            }
//                        },

                            "aTargets": [18],
                            "mRender": function (data, type, full) {
                                return full.DR_CR_IND;
                            }
                        },
                        {
                            "aTargets": [19],
                            "mRender": function (data, type, full) {
                                return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [20],
                            "mRender": function (data, type, full) {
                                return full.GL_ACCT;
                            }
                        },
                        {
                            "aTargets": [21],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                                //return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [22],
                            "mRender": function (data, type, full) {
                                //return full.PAJAK + "%";
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                                //return full.BUS_AREA;
                            }
                        },
                        {
                            "aTargets": [23],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                                //return full.TPBA;
                            }
                        },
                        {
                            "aTargets": [24],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                                //return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [25],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_LC,2,".",",");
                                //return full.AMT_TC;

                            }
                        },
                        {
                            "aTargets": [26],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_LC,2,".",",");
                                //return full.AMT_WITH_BASE_TC;
                            }
                        },
                        {
                            "aTargets": [27],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT,2,".",",");
                                //return full.AMT_WITH_TC;
                            }
                        },
                        {
                             "aTargets": [28],
                             "mRender": function (data, type, full) {
                              //return accounting.formatNumber(full.AMOUNT,2,".",",");
                              return full.ACCT_TYPE;
                              }
                        },
                        {
                            "aTargets": [29],
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.NOMINAL_PEMBAYARAN_IDR,2,".",",");
                                return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [30],
                            "mRender": function (data, type, full) {
                                return full.ITEM_TEXT;
                            }
                        },
                        {
                            "aTargets": [31],
                            "mRender": function (data, type, full) {
                                return full.CUSTOMER;
                            }
                        },

                        {
                            "aTargets": [32],
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }

                        },
                         {
                            "aTargets": [33],
                            "mRender": function (data, type, full) {
                             return full.TERM_PMT;
                             }
                        },
                        {
                            "aTargets": [34],
                            "mRender": function (data, type, full) {
                             return full.DUE_ON;
                             }
                        },
                        {
                             "aTargets": [35],
                             "mRender": function (data, type, full) {
                               return full.REFERENCE_KEY;
                              }
                        },
                        {
                              "aTargets": [36],
                              "mRender": function (data, type, full) {
                                return full.PMT_IND;
                                }
                        },
                        {
                               "aTargets": [37],
                               "mRender": function (data, type, full) {
                                   return full.TRANS_TYPE;
                                     }
                        },
                        {
                                "aTargets": [38],
                                "mRender": function (data, type, full) {
                                    return full.SPREAD_VAL;
                                        }
                        },
                        {
                                "aTargets": [39],
                                "mRender": function (data, type, full) {
                                     return full.PMT_BLOCK;
                                     }
                          },
                        {
                                 "aTargets": [40],
                                 "mRender": function (data, type, full) {
                                  return full.HOUSE_BANK;
                                    }
                         },
                         {
                             "aTargets": [41],
                             "mRender": function (data, type, full) {
                              return full.NO_REK_HOUSE_BANK;
                                }
                         },
                         {
                              "aTargets": [42],
                              "mRender": function (data, type, full) {
                               return full.PRTNR_BANK_TYPE;
                                }
                         },
                         {
                               "aTargets": [43],
                               "mRender": function (data, type, full) {
                                  return full.BANK_KEY;
                                    }
                         },
                        {
                                  "aTargets": [44],
                                  "mRender": function (data, type, full) {
                                    return full.BANK_ACCOUNT;
                                     }
                        },
                        {
                                 "aTargets": [45],
                                 "mRender": function (data, type, full) {
                                     return full.ACCOUNT_HOLDER;
                                     }
                         },
                        {
                                 "aTargets": [46],
                                 "mRender": function (data, type, full) {
                                   return full.COST_CTR;
                                      }
                        },
                         {
                                  "aTargets": [47],
                                  "mRender": function (data, type, full) {
                                     return full.INT_ORDER;
                                       }
                         },
                         {
                                   "aTargets": [48],
                                   "mRender": function (data, type, full) {
                                      return full.WBS_NUM;
                                         }
                         },
                         {
                                   "aTargets": [49],
                                   "mRender": function (data, type, full) {
                                      return full.CASH_CODE;
                                        }
                          },
                         {
                                    "aTargets": [50],
                                    "mRender": function (data, type, full) {
                                       return full.PO_NUM;
                                         }
                         },
                         {
                                     "aTargets": [51],
                                     "mRender": function (data, type, full) {
                                         return full.PO_ITEM;
                                            }
                         },
                         {
                                       "aTargets": [52],
                                       "mRender": function (data, type, full) {
                                          return full.REF_KEY1;
                                              }
                        },
                        {
                           "aTargets": [53],
                            "mRender": function (data, type, full) {
                            return full.REF_KEY2;
                                }
                         },
                         {
                            "aTargets": [54],
                            "mRender": function (data, type, full) {
                             return full.REF_KEY3;
                                }
                         },
                         {
                            "aTargets": [55],
                            "mRender": function (data, type, full) {
                            return full.OI_IND;
                                 }
                        },
                        {
                            "aTargets": [56],
                            "mRender": function (data, type, full) {
                             return full.TPBA;
                                  }
                         },
                         {
                             "aTargets": [57],
                              "mRender": function (data, type, full) {
                               return full.METODE_PEMBAYARAN;
                                 }
                         },
                         {
                              "aTargets": [58],
                              "mRender": function (data, type, full) {
                              return full.TGL_RENCANA_BAYAR;
                                  }
                         },
                          {
                               "aTargets": [59],
                               "mRender": function (data, type, full) {
                               return full.OSS_ID;
                                   }
                          },
                          {
                             "aTargets": [60],
                             "mRender": function (data, type, full) {
                             return full.GROUP_ID;
                                 }
                        },
                         {
                               "aTargets": [61],
                               "mRender": function (data, type, full) {
                               return full.BANK_BYR;
                                   }
                          },
                          {
                             "aTargets": [62],
                             "mRender": function (data, type, full) {
                             return full.CURR_BAYAR;
                                 }
                        },
                        {
                             "aTargets": [63],
                             "mRender": function (data, type, full) {
                             return full.AMOUNT_BAYAR;
                                 }
                        },
                        {
                             "aTargets": [64],
                             "mRender": function (data, type, full) {
                             return full.BANK_BENEF;
                                 }
                        },
                        {
                             "aTargets": [65],
                             "mRender": function (data, type, full) {
                             return full.NO_REK_BENEF;
                                 }
                        },
                        {
                             "aTargets": [66],
                             "mRender": function (data, type, full) {
                             return full.NAMA_BENEF;
                                 }
                        },
                          {
                              "aTargets": [67],
                              "mRender": function (data, type, full) {
                              return full.TGL_ACT_BAYAR;
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
                                return full.KETERANGAN;
                              }
                          },
                         {
                            "aTargets": [70],
                            "mRender": function (data, type, full) {
                              return full.TGL_TAGIHAN_DITERIMA;
                            }
                        },
                        {
                          "aTargets": [71],
                          "mRender": function (data, type, full) {
                          return full.PARTIAL_IND;
                                }
                         },
                         {
                              "aTargets": [72],
                              "mRender": function (data, type, full) {
                              return full.STATUS_TRACKING;
                                    }
                         },
                        {
                            "aTargets": [73],
                            "mRender": function (data, type, full) {
                                var ret_value;
                                var role = newRoleUser[0];
                                if(newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                ret_value =
                                '<div class="btn-group">'+
                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Approve Tanggal" onclick="verifikasi_tanggal(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-check"></i></button>'+
                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-danger" title="Reject" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                '</div>';
                                }
                                return ret_value;
                            }

                        },
                        {
                            "aTargets": [74],
                            "mRender": function (data, type, full) {
                                var value = new Object();
                                var full_value = new Object();
                                var ret_value = ''
                                if (newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT") {
                                    value = '{"pHouseBank":"'+full.HOUSE_BANK+'","pNoRekHouseBank" : "'+full.NO_REK_HOUSE_BANK+'", "pCompCode":"'+full.COMP_CODE+'", "pDueOn":"'+full.DUE_ON+'","pBusArea":"'+full.BUS_AREA+'","pAssignment":"'+full.ASSIGNMENT+'","pDocNo":"'+full.DOC_NO+'","pSumberDana":"'+full.SUMBER_DANA+'"}';
                                    full_value = '{"full":'+JSON.stringify(full)+'}';
                                }
//                                value = '{"pHouseBank":"'+full.HOUSE_BANK+'","pNoRekHouseBank" : "'+full.NO_REK_HOUSE_BANK+'", "pCompCode":"'+full.COMP_CODE+'", "pDueOn":"'+full.DUE_ON+'","pBusArea":"'+full.BUS_AREA+'","pAssignment":"'+full.ASSIGNMENT+'","pDocNo":"'+full.DOC_NO+'","pSumberDana":"'+full.SUMBER_DANA+'"}';
//                                full_value = '{"full":'+JSON.stringify(full)+'}';

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
                                baseUrl + "api_operator/rekap_invoice_belum/get_invoice_verifikasi_tgl",
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
                                   // getTotalTagihan();
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
                                if (response.DOC_DATE2 == 1) {
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
                                if (response.POST_DATE2 == 1) {
                                    api.column(6).visible(true);
                                } else {
                                    api.column(6).visible(false);
                                }
                                if (response.BASE_DATE == 1) {
                                    api.column(7).visible(true);
                                } else {
                                    api.column(7).visible(false);
                                }
                                if (response.ENTRY_DATE2 == 1) {
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
                                if (response.COMP_CODE == 1) {
                                    api.column(13).visible(true);
                                } else {
                                    api.column(13).visible(false);
                                }
                                if (response.BUS_AREA == 1) {
                                    api.column(14).visible(true);
                                } else {
                                    api.column(14).visible(false);
                                }
                                if (response.CURRENCY == 1) {
                                    api.column(15).visible(true);
                                } else {
                                    api.column(15).visible(false);
                                }
                                if (response.EXCH_RATE == 1) {
                                    api.column(16).visible(true);
                                } else {
                                    api.column(16).visible(false);
                                }
                                if (response.LINE_ITEM == 1) {
                                    api.column(17).visible(true);
                                } else {
                                    api.column(17).visible(false);
                                }
                                if (response.DR_CR_IND == 1) {
                                    api.column(18).visible(false);
                                } else {
                                    api.column(18).visible(false);
                                }
                                if (response.SPEC_GL == 1) {
                                    api.column(19).visible(true);
                                } else {
                                    api.column(19).visible(false);
                                }
                                if (response.GL_ACCT == 1) {
                                    api.column(20).visible(true);
                                } else {
                                    api.column(20).visible(false);
                                }
                                if (response.AMT_TC == 1) {
                                    api.column(21).visible(true);
                                } else {
                                    api.column(21).visible(false);
                                }
                                if (response.AMT_LC == 1) {
                                    api.column(22).visible(true);
                                } else {
                                    api.column(22).visible(false);
                                }
                                if (response.AMT_WITH_BASE_TC == 1) {
                                    api.column(23).visible(true);
                                } else {
                                    api.column(23).visible(false);
                                }
                                if (response.AMT_WITH_TC == 1) {
                                    api.column(24).visible(true);
                                } else {
                                    api.column(24).visible(false);
                                }
                                if (response.AMT_WITH_BASE_LC == 1) {
                                    api.column(25).visible(true);
                                } else {
                                    api.column(25).visible(false);
                                }
                                if (response.AMT_WITH_LC == 1) {
                                    api.column(26).visible(true);
                                } else {
                                    api.column(26).visible(false);
                                }
                                if (response.AMOUNT == 1) {
                                    api.column(27).visible(true);
                                } else {
                                    api.column(27).visible(false);
                                }
                                 if (response.ACCT_TYPE == 1) {
                                      api.column(28).visible(true);
                                 } else {
                                      api.column(28).visible(false);
                                }
                                if (response.ASSIGNMENT == 1) {
                                    api.column(29).visible(true);
                                } else {
                                    api.column(29).visible(false);
                                }
                                if (response.ITEM_TEXT == 1) {
                                    api.column(30).visible(true);
                                } else {
                                    api.column(30).visible(false);
                                }
                                if (response.CUSTOMER == 1) {
                                    api.column(31).visible(true);
                                } else {
                                    api.column(31).visible(false);
                                }
                                if (response.VENDOR == 1) {
                                    api.column(32).visible(true);
                                } else {
                                    api.column(32).visible(false);
                                }
                                if (response.TERM_PMT == 1) {
                                    api.column(33).visible(true);
                                } else {
                                    api.column(33).visible(false);
                                }

                                if (response.DUE_ON == 1) {
                                    api.column(34).visible(true);
                                } else {
                                    api.column(34).visible(false);
                                }
                                if (response.REFERENCE_KEY == 1) {
                                    api.column(35).visible(true);
                                } else {
                                    api.column(35).visible(false);
                                }
                                if (response.PMT_IND == 1) {
                                    api.column(36).visible(true);
                                } else {
                                    api.column(36).visible(false);
                                }
                                if (response.TRANS_TYPE == 1) {
                                    api.column(37).visible(true);
                                } else {
                                   api.column(37).visible(false);
                                }
                                if (response.SPREAD_VAL == 1) {
                                    api.column(38).visible(true);
                                } else {
                                    api.column(38).visible(false);
                                }
                                if (response.PMT_BLOCK == 1) {
                                    api.column(39).visible(true);
                                } else {
                                    api.column(39).visible(false);
                                }
                                if (response.HOUSE_BANK == 1) {
                                    api.column(40).visible(true);
                                } else {
                                    api.column(40).visible(false);
                                }
                                 if (response.NO_REK_HOUSE_BANK == 1) {
                                     api.column(41).visible(true);
                                } else {
                                     api.column(41).visible(false);
                                }
                                if (response.PRTNR_BANK_TYPE == 1) {
                                    api.column(42).visible(true);
                                } else {
                                    api.column(42).visible(false);
                                }
                                if (response.BANK_KEY == 1) {
                                    api.column(43).visible(true);
                                } else {
                                    api.column(43).visible(false);
                                }
                                if (response.BANK_ACCOUNT == 1) {
                                     api.column(44).visible(true);
                                } else {
                                     api.column(44).visible(false);
                                }
                                if (response.ACCOUNT_HOLDER == 1) {
                                    api.column(45).visible(true);
                                } else {
                                    api.column(45).visible(false);
                                }
                                if (response.COST_CTR == 1) {
                                    api.column(46).visible(true);
                                } else {
                                    api.column(46).visible(false);
                                }
                                if (response.INT_ORDER == 1) {
                                    api.column(47).visible(true);
                                } else {
                                    api.column(47).visible(false);
                                }
                                if (response.WBS_NUM == 1) {
                                    api.column(48).visible(true);
                                } else {
                                    api.column(48).visible(false);
                                }
                                if (response.CASH_CODE == 1) {
                                    api.column(49).visible(true);
                                } else {
                                    api.column(49).visible(false);
                                }
                                if (response.PO_NUM == 1) {
                                    api.column(50).visible(true);
                                } else {
                                    api.column(50).visible(false);
                                }
                                if (response.PO_ITEM == 1) {
                                    api.column(51).visible(true);
                                } else {
                                    api.column(51).visible(false);
                                }
                                if (response.REF_KEY1 == 1) {
                                    api.column(52).visible(true);
                                } else {
                                    api.column(52).visible(false);
                                }
                                 if (response.REF_KEY2 == 1) {
                                     api.column(53).visible(true);
                                } else {
                                    api.column(53).visible(false);
                                }
                                if (response.REF_KEY3 == 1) {
                                    api.column(54).visible(true);
                                } else {
                                    api.column(54).visible(false);
                                }
                                if (response.OI_IND == 1) {
                                    api.column(55).visible(true);
                                 } else {
                                    api.column(55).visible(false);
                                }
                                if (response.TPBA == 1) {
                                    api.column(56).visible(true);
                                } else {
                                    api.column(56).visible(false);
                                }
                                if (response.METODE_PEMBAYARAN == 1) {
                                    api.column(57).visible(true);
                                } else {
                                    api.column(57).visible(false);
                                }
                                if (response.TGL_RENCANA_BAYAR == 1) {
                                    api.column(58).visible(true);
                                } else {
                                    api.column(58).visible(false);
                                }
                                if (response.OSS_ID == 1) {
                                    api.column(59).visible(true);
                                } else {
                                    api.column(59).visible(false);
                                }
                                if (response.GROUP_ID == 1) {
                                    api.column(60).visible(true);
                                } else {
                                    api.column(60).visible(false);
                                }
                                if (response.BANK_BYR == 1) {
                                    api.column(61).visible(true);
                                } else {
                                    api.column(61).visible(false);
                                }
                                if (response.CURR_BAYAR == 1) {
                                    api.column(62).visible(true);
                                } else {
                                    api.column(62).visible(false);
                                }
                                if (response.AMOUNT_BAYAR == 1) {
                                    api.column(63).visible(true);
                                } else {
                                    api.column(63).visible(false);
                                }
                                if (response.BANK_BENEF == 1) {
                                    api.column(64).visible(true);
                                } else {
                                    api.column(64).visible(false);
                                }
                                if (response.NO_REK_BENEF == 1) {
                                    api.column(65).visible(true);
                                } else {
                                    api.column(65).visible(false);
                                }
                                if (response.NAMA_BENEF == 1) {
                                    api.column(66).visible(true);
                                } else {
                                    api.column(66).visible(false);
                                }
                                 if (response.TGL_ACT_BAYAR == 1) {
                                   api.column(67).visible(true);
                                  } else {
                                   api.column(67).visible(false);
                                 }
                                 if (response.SUMBER_DANA == 1) {
                                  api.column(68).visible(true);
                                } else {
                                  api.column(68).visible(false);
                                }
                                if (response.KETERANGAN == 1) {
                                    api.column(69).visible(true);
                                 } else {
                                    api.column(69).visible(false);
                                }
                                if (response.TGL_TAGIHAN_DITERIMA == 1) {
                                    api.column(70).visible(true);
                                 } else {
                                    api.column(70).visible(false);
                                }
                                if (response.PARTIAL_IND == 1) {
                                     api.column(71).visible(true);
                                 } else {
                                     api.column(71).visible(false);
                                }
                                if (response.STATUS_TRACKING == 1) {
                                     api.column(72).visible(true);
                                 } else {
                                     api.column(72).visible(false);
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
//                var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
//                $(this).append(html);
            });

            $('.dataTables_filter').each(function () {
                 var html = '';
                 if(newRoleUser[0] == "ROLE_VERIFIKATOR"){
                html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                html = html + '<button class="btn-edit-data btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fa fa-university"></i></button>';
                }
                 if(newRoleUser[0] == "ROLE_ADMIN"){
                var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
                    '<i class="fa fa-arrows-alt"></i></button>';
                /*button reject*/
                html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
                    '            <i class="fa fa-ban"></i></button>';
                html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fa fa-pencil"></i></button>';
                html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fa fa-pencil"></i></button>';
                html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                html = html + '<button class="btn-edit-data btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fa fa-university"></i></button>';
                html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
                html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
                }
//                if(newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){
//
//
//                }
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



function reverse_sap(pCompCode, pDocNo, pFiscYear, pLineItem, pKet){
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
    //console.log ("Checked : ",e);
    if($(e).is(":checked")) {
        if(invoiceCheckedArray.length == 0) {
            invoiceCheckedArray.push($(e).data("value"));
            fullArray.push($(e).data("full").full);
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
            for(let i = 0; i < fullArray.length; i++){
                var fullVal = JSON.stringify(fullArray[i]);
                var valCb2 = JSON.stringify($(e).data("full").full);
                if (fullVal == valCb2){
                    isNew = false;
                    break;
                }
            }
            if(isNew == true){
                invoiceCheckedArray.push($(e).data("value"));
                fullArray.push($(e).data("full").full);
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

        for (x = 0; x < fullArray.length; x++){
            let fullVal = JSON.stringify(fullArray[x]);
            let valCb2 = JSON.stringify($(e).data("full").full);
            if(fullVal == valCb2){
                fullArray.splice(x, 1);
            }
        }
    }
    console.log("Checked : ", invoiceCheckedArray);
    console.log("Full Array : ", fullArray);
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

