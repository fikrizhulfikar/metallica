/**
 * Created by Mr.Diaz on 31/10/19.
 */
var table_rekapitulasi;
var idValas = "";
var allData;
var tempVendor = "";
var tempBankPembayar = "";
var tempBankAccount = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;

$(document).ready(function () {
    getAllData();
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectMetodeBayar("cmb_cara_pembayaran","");
});


function getAllData() {
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_reject/get_rekap_invoice",
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
                dataRow.push(row["COMP_CODE"]);
                dataRow.push(row["DOC_NO"]);
                dataRow.push(row["FISC_YEAR"]);
                dataRow.push(row["DOC_TYPE"]);
                dataRow.push(row["DOC_DATE2"]);
                dataRow.push(row["POST_DATE2"]);
                dataRow.push(row["ENTRY_DATE2"]);
                //dataRow.push({text: row["NILAI_TAGIHAN"], alignment: "right"});
                dataRow.push(row["REFERENCE"]);
                dataRow.push(row["REV_WITH"]);
                dataRow.push(row["REV_YEAR"]);
                dataRow.push(row["DOC_HDR_TXT"]);
                dataRow.push(row["CURRENCY"]);
                dataRow.push(row["EXCH_RATE"]);
                dataRow.push(row["REFERENCE_KEY"]);
                dataRow.push(row["PMT_IND"]);
                dataRow.push(row["TRANS_TYPE"]);
                //dataRow.push({text: row["COUNT_DOWN"], alignment: "right"});
                dataRow.push(row["SPREAD_VAL"]);
                dataRow.push(row["LINE_ITEM"]);
                dataRow.push(row["OI_IND"]);
                dataRow.push(row["ACCT_TYPE"]);
                dataRow.push(row["SPEC_GL"]);
                dataRow.push(row["BUS_AREA"]);
                dataRow.push(row["TPBA"]);
                dataRow.push(row["AMT_LC"]);
                dataRow.push(row["AMT_TC"]);
                dataRow.push(row["AMT_WITH_BASE_TC"]);
                dataRow.push(row["AMT_WITH_TC"]);
                dataRow.push(row["ASSIGNMENT"]);
                dataRow.push(row["ITEM_TEXT"]);
                dataRow.push(row["COST_CTR"]);
                dataRow.push(row["GL_ACCT"]);
                dataRow.push(row["CUSTOMER"]);
                dataRow.push(row["VENDOR"]);
                dataRow.push(row["BASE_DATE"]);
                dataRow.push(row["TERM_PMT"]);
                dataRow.push(row["DUE_ON"]);
                dataRow.push(row["PMT_BLOCK"]);
                dataRow.push(row["HOUSE_BANK"]);
                dataRow.push(row["PRTNR_BANK_TYPE"]);
                dataRow.push(row["BANK_KEY"]);
                dataRow.push(row["BANK_ACCOUNT"]);
                dataRow.push(row["ACCOUNT_HOLDER"]);
                dataRow.push(row["PO_NUM"]);
                dataRow.push(row["PO_ITEM"]);
                dataRow.push(row["REF_KEY1"]);
                dataRow.push(row["REF_KEY2"]);
                dataRow.push(row["REF_KEY3"]);
                dataRow.push(row["INT_ORDER"]);
                dataRow.push(row["WBS_NUM"]);
                dataRow.push(row["CASH_CODE"]);
                dataRow.push(row["DR_CR_IND"]);
                dataRow.push(row["AMT_WITH_BASE_LC"]);
                dataRow.push(row["AMT_WITH_LC"]);
                dataRow.push(row["METODE_PEMBAYARAN"]);
                dataRow.push(row["TGL_RENCANA_BAYAR"]);
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
                        // {width: 100, targets: 35},
                        // {width: 100, targets: 36},
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
                        },
                        {
                            "sortable": false,
                            "aTargets": [0,35, 36]
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
                                return full.COMP_CODE;
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
                                return full.FISC_YEAR;
                            }

                        },

                        {
                            "aTargets": [4],
                            "mRender": function (data, type, full) {
                                return full.DOC_TYPE;
                            }

                        },
                        {
                            "aTargets": [5],
                            "mRender": function (data, type, full) {
                                return full.DOC_DATE2;
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
                                return full.ENTRY_DATE2;
                            }

                        },
                        {
                            "aTargets": [8],
                            "mRender": function (data, type, full) {
                                return full.REFERENCE;
                            }

                        },
                        {
                            "aTargets": [9],
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.TOTAL_TAGIHAN,2,".",",");
                                return full.REV_WITH;
                            }

                        },
                        {
                            "aTargets": [10],
                            "mRender": function (data, type, full) {
                                return full.REV_YEAR;
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
                                return full.CURRENCY;
                            }

                        },
                        {
                            "aTargets": [13],
                            "mRender": function (data, type, full) {
                                return full.EXCH_RATE;
                            }

                        },
                        {
                            "aTargets": [14],
                            "mRender": function (data, type, full) {
                                return full.REFERENCE_KEY;
                            }

                        },
                        {
                            "aTargets": [15],
                            "mRender": function (data, type, full) {
                                return full.PMT_IND;
                            }

                        },
                        {
                            "aTargets": [16],
                            "mRender": function (data, type, full) {
                                return full.TRANS_TYPE;
                            }

                        },
                        {
                            "aTargets": [17],
                            "mRender": function (data, type, full) {
                                return full.SPREAD_VAL;
                            }

                        },
//                        {
//                            "aTargets": [18],
//                            "visible": false,
//                            "mRender": function (data, type, full) {
//                                //return full.TGL_LUNAS;
//                                return "";
//                            }
//                        },
                        {
                            "aTargets": [18],
                            "mRender": function (data, type, full) {
                                return full.LINE_ITEM;
                            }
                        },
                        {
                            "aTargets": [19],
                            "mRender": function (data, type, full) {
                                return full.OI_IND;
                            }
                        },
                        {
                            "aTargets": [20],
                            "mRender": function (data, type, full) {
                                return full.ACCT_TYPE;
                            }
                        },
                        {
                            "aTargets": [21],
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.NOMINAL_SBLM_PAJAK,2,".",",");
                                return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [22],
                            "mRender": function (data, type, full) {
                                //return full.PAJAK + "%";
                                return full.BUS_AREA;
                            }
                        },
                        {
                            "aTargets": [23],
                            "mRender": function (data, type, full) {
                                //return accounting.formatNumber(full.NOMINAL_STLH_PAJAK,2,".",",");
                                return full.TPBA;
                            }
                        },
                        {
                            "aTargets": [24],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                                //return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [25],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                                //return full.AMT_TC;

                            }
                        },
                        {
                            "aTargets": [26],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                                //return full.AMT_WITH_BASE_TC;
                            }
                        },
                        {
                            "aTargets": [27],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                                //return full.AMT_WITH_TC;
                            }
                        },
                        {
                             "aTargets": [28],
                             "mRender": function (data, type, full) {
                              return accounting.formatNumber(full.AMOUNT,2,".",",");
                              //return full.AMOUNT;
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
                                return full.COST_CTR;
                            }
                        },

                        {
                            "aTargets": [32],
                            "mRender": function (data, type, full) {
                                return full.GL_ACCT;
                            }

                        },
                         {
                            "aTargets": [33],
                            "mRender": function (data, type, full) {
                             return full.CUSTOMER;
                             }
                        },
                        {
                            "aTargets": [34],
                            "mRender": function (data, type, full) {
                             return full.VENDOR;
                             }
                        },
                        {
                             "aTargets": [35],
                             "mRender": function (data, type, full) {
                               return full.BASE_DATE;
                              }
                        },
                        {
                              "aTargets": [36],
                              "mRender": function (data, type, full) {
                                return full.TERM_PMT;
                                }
                        },
                        {
                               "aTargets": [37],
                               "mRender": function (data, type, full) {
                                   return full.DUE_ON;
                                     }
                        },
                        {
                                "aTargets": [38],
                                "mRender": function (data, type, full) {
                                    return full.PMT_BLOCK;
                                        }
                        },
                        {
                                "aTargets": [39],
                                "mRender": function (data, type, full) {
                                     return full.HOUSE_BANK;
                                     }
                          },
                        {
                                 "aTargets": [40],
                                 "mRender": function (data, type, full) {
                                  return full.PRTNR_BANK_TYPE;
                                    }
                         },
                         {
                             "aTargets": [41],
                             "mRender": function (data, type, full) {
                              return full.BANK_KEY;
                                }
                         },
                         {
                              "aTargets": [42],
                              "mRender": function (data, type, full) {
                               return full.BANK_ACCOUNT;
                                }
                         },
                         {
                               "aTargets": [43],
                               "mRender": function (data, type, full) {
                                  return full.ACCOUNT_HOLDER;
                                    }
                         },
                        {
                                  "aTargets": [44],
                                  "mRender": function (data, type, full) {
                                    return full.PO_NUM;
                                     }
                        },
                        {
                                 "aTargets": [45],
                                 "mRender": function (data, type, full) {
                                     return full.PO_ITEM;
                                     }
                         },
                        {
                                 "aTargets": [46],
                                 "mRender": function (data, type, full) {
                                   return full.REF_KEY1;
                                      }
                        },
                         {
                                  "aTargets": [47],
                                  "mRender": function (data, type, full) {
                                     return full.REF_KEY2;
                                       }
                         },
                         {
                                   "aTargets": [48],
                                   "mRender": function (data, type, full) {
                                      return full.REF_KEY3;
                                         }
                         },
                         {
                                   "aTargets": [49],
                                   "mRender": function (data, type, full) {
                                      return full.INT_ORDER;
                                        }
                          },
                         {
                                    "aTargets": [50],
                                    "mRender": function (data, type, full) {
                                       return full.WBS_NUM;
                                         }
                         },
                         {
                                     "aTargets": [51],
                                     "mRender": function (data, type, full) {
                                         return full.CASH_CODE;
                                            }
                         },
                         {
                                       "aTargets": [52],
                                       "mRender": function (data, type, full) {
                                          return full.DR_CR_IND;
                                              }
                        },
                        {
                           "aTargets": [53],
                            "mRender": function (data, type, full) {
                            return full.AMT_WITH_BASE_LC;
                                }
                         },
                         {
                            "aTargets": [54],
                            "mRender": function (data, type, full) {
                             return full.AMT_WITH_LC;
                                }
                         },
                         {
                            "aTargets": [55],
                            "mRender": function (data, type, full) {
                            return full.METODE_PEMBAYARAN;
                                 }
                        },
                        {
                            "aTargets": [56],
                            "mRender": function (data, type, full) {
                             return full.TGL_RENCANA_BAYAR;
                                  }
                         },
                         {
                             "aTargets": [57],
                              "mRender": function (data, type, full) {
                               return full.SUMBER_DANA;
                                 }
                         },
                         {
                              "aTargets": [58],
                              "mRender": function (data, type, full) {
                              return full.KETERANGAN;
                                  }
                         },
                         {
                              "aTargets": [59],
                              "mRender": function (data, type, full) {
                              return full.STATUS_TRACKING;
                                    }
                         },
                        {
                            "aTargets": [60],
                            "mRender": function (data, type, full) {
                                var ret_value;
                                /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                                /*    if(newRoleUser[0].includes("DIVKEU")){
                                        ret_value =
                                            '<div class="btn-group">' +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' +
                                            '</div>'
                                    } */
                                if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                                    return "-"
                                }
                                else if(newRoleUser[0] == "ROLE_OSS" ){
                                    ret_value =
                                        '<div class="btn-group">' +
                                        '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';

                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                        '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' +
                                        '</div>';
                                }else {

                                    if (full.STATUS_TRACKING == "INPUT DATA") {
                                        var role = newRoleUser[0];
                                        ret_value =
                                            '<div class="btn-group">';
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +

                                                       '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\')"><i class="fas fa-edit"></i></button>'+
                                                       '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                       '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Reject" onclick="reverse_reject(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';

                                        }
                                        '</div>'

                                     }
                                     else   if (full.STATUS_TRACKING == "VERIFIKASI BY MAKER") {
                                            var role = newRoleUser[0];
                                            ret_value =
                                            '<div class="btn-group">';
                                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                                        ret_value = ret_value +
                                                       '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\')"><i class="fas fa-edit"></i></button>'+
                                                       '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified CHECKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                       '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Reject" onclick="reverse_reject(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                }
                                            '</div>'
                                         }
                                        else if (full.STATUS_TRACKING == "VERIFIKASI BY CHECKER") {
                                                var role = newRoleUser[0];
                                                ret_value =
                                                '<div class="btn-group">';
                                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                                           ret_value = ret_value +
                                                           '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\')"><i class="fas fa-edit"></i></button>'+
                                                           '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                           '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                                        }
                                                 '</div>'
                                          }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {
                                        ret_value =
                                            '<div class="btn-group">';
                                        if(full.UPDATE_BY =='payment' && newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_DIVKEU"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                            ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 2 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                            ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +3+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        '</div>'
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {
                                        ret_value =
                                            '<div class="btn-group">' ;
                                        if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN"){
                                            ret_value = ret_value +'<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +6+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +6+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_DIVKEU"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                        }'</div>'
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){
                                        ret_value =
                                            '<div class="btn-group">' ;
                                        if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Investment" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +8+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_DIVKEU"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                        }
                                        '</div>'
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER"){
                                        ret_value =
                                            '<div class="btn-group">' ;
                                        if(newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager PE" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +4+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 3 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_DIVKEU"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                        }
                                        '</div>'
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){

                                        ret_value =
                                            '<div class="btn-group">';
                                        if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Operation" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified VP Treasury Operation" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +5+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 4 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_DIVKEU"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                        }
                                        '</div>'
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION") {
                                        var role = newRoleUser[0];
                                        ret_value =
                                            '<div class="btn-group">' ;
                                        if(full.EQ_IDR > "25000000000") {
                                            if (role == "ROLE_ADMIN" || role == "ROLE_EXECUTIVE_VICE_PRESIDENT" ) {

                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 6 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrow-left"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>';

                                            }
                                            if (newRoleUser[0] == "ROLE_DIVKEU") {
                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>';
                                            }
                                        }
                                        else{
                                            if(role == "ROLE_ADMIN") {

                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                            }
                                            if(role.includes("KASIR")){
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                            }
                                            if(newRoleUser[0] == "ROLE_DIVKEU"){
                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                            }
                                        }
                                        '</div>'
                                    }

                                    else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT") {

                                        var role = newRoleUser[0];
                                        ret_value =
                                            '<div class="btn-group">' ;
                                        if(full.EQ_IDR > "25000000000"){
                                            if(role == "ROLE_ADMIN"||role == "ROLE_EXECUTIVE_VICE_PRESIDENT") {
                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +10+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 6 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                            }
                                        }
                                        else{
                                            if(role == "ROLE_ADMIN") {
                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                    '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                    '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                            }
                                            if(role.includes("KASIR")){
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Manager" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 9 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                            }
                                            if(newRoleUser[0] == "ROLE_DIVKEU"){
                                                ret_value = ret_value +
                                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                    '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                            }
                                        }
                                        '</div>'
                                    }

                                    else if (full.STATUS_TRACKING == "VERIFIED BY EVP") {
                                        var role = newRoleUser[0];
                                        ret_value =
                                            '<div class="btn-group">' ;
                                        if(role.includes("KASIR")) {
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" id="option-lunas" class="btn-lunas btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' + full.ID_VALAS + '\',\'' + 7 + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\',\'' + full.CURRENCY + '\',\'' + full.TOTAL_TAGIHAN + '\')"><i class="fa fa-arrows-alt"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>';
                                        }
                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +7+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' + full.ID_VALAS + '\',\'' + 10 + '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrow-left"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' ;
                                        }
                                        if(newRoleUser[0] == "ROLE_DIVKEU"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>'+
                                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' ;
                                        }
                                        '</div>'
                                    }
                                    /*else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR > "25000000000"){
                                        ret_value =
                                            '<div class="btn-group">' +
                                            '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                                        var role = newRoleUser[0];
                                        if(newRoleUser[0] == "ROLE_ADMIN" || role.includes("KADIV")){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified EVP" onclick="upd_status_tracking(\'' +full.ID_VALAS+'\',\'' +10+ '\',\''+full.ID_JENIS_PEMBAYARAN+'\',\''+full.CURRENCY+'\',\''+full.TOTAL_TAGIHAN+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                                '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title ="Reverse" onclick ="reverse(\'' +full.ID_VALAS+'\',\'' +5+ '\')"><i class="fa fa-arrow-left"></i></button>';
                                        }

                                        if(newRoleUser[0] == "ROLE_ADMIN"){
                                            ret_value = ret_value +
                                                '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>';
                                        }
                                        ret_value = ret_value +
                                            '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                            '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-trash"></i></button>' +
                                            '</div>'
                                    } */
                                    else {
                                        ret_value =
                                            '<div class="btn-group">' +
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\')"><i class="fas fa-edit"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DIAZ" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                            '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>';

                                            '</div>'
                                    }
                                }
                                return ret_value;
                            }

                        },
                        {
                            "aTargets": [61],
                            "mRender": function (data, type, full) {
                                var value = new Object();
                                var ret_value = ''

                                if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                                    return "-"
                                }
                                else {
                                    if (full.STATUS_TRACKING == "INPUT DATA") {
                                        value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';

                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {

                                        if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                                            value = '{"3":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {

                                        if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN" || newRoleUser[0] == "ROLE_ADMIN"){
                                            value = '{"6":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){

                                        if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT" || newRoleUser[0] == "ROLE_ADMIN"){
                                            value = '{"8":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }

                                    else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){

                                        if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION" || newRoleUser[0] == "ROLE_ADMIN"){
                                            value = '{"5":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR > "25000000000"){
                                        if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                            value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR > "25000000000"){
                                        if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                            value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
                                        var role = newRoleUser[0];

                                        if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                            value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
                                        var role = newRoleUser[0];

                                        if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                                            value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }else {
                                            value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                                        }
                                    }
                                    else {
                                        value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';
                                    }
                                }

                                for (x=0; x<checkedArray.length;x++){
                                    if(JSON.stringify(checkedArray[x]) === value){
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
                                baseUrl + "/api_operator/rekap_invoice_reject/get_rekap_invoice",
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
                            url: baseUrl + "/api_operator/rekap_invoice_reject/get_column",
                            dataType: 'JSON',
                            type: "GET",
                            success: function (res) {
                                var response = res.data[0];
                                if (response.NOMOR == 1) {
                                    api.column(0).visible(true);
                                } else {
                                    api.column(0).visible(false);
                                }
                                if (response.COMP_CODE == 1) {
                                    api.column(1).visible(true);
                                } else {
                                    api.column(1).visible(false);
                                }
                                if (response.DOC_NO == 1) {
                                    api.column(2).visible(true);
                                } else {
                                    api.column(2).visible(false);
                                }
                                if (response.FISC_YEAR == 1) {
                                    api.column(3).visible(true);
                                } else {
                                    api.column(3).visible(false);
                                }
                                if (response.DOC_TYPE == 1) {
                                    api.column(4).visible(true);
                                } else {
                                    api.column(4).visible(false);
                                }
                                if (response.DOC_DATE2 == 1) {
                                    api.column(5).visible(true);
                                } else {
                                    api.column(5).visible(false);
                                }
                                if (response.POST_DATE2 == 1) {
                                    api.column(6).visible(true);
                                } else {
                                    api.column(6).visible(false);
                                }
                                if (response.ENTRY_DATE2 == 1) {
                                    api.column(7).visible(true);
                                } else {
                                    api.column(7).visible(false);
                                }
                                if (response.REFERENCE == 1) {
                                    api.column(8).visible(true);
                                } else {
                                    api.column(8).visible(false);
                                }
                                if (response.REV_WITH == 1) {
                                    api.column(9).visible(true);
                                } else {
                                    api.column(9).visible(false);
                                }
                                if (response.REV_YEAR == 1) {
                                    api.column(10).visible(true);
                                } else {
                                    api.column(10).visible(false);
                                }
                                if (response.DOC_HDR_TXT == 1) {
                                    api.column(11).visible(true);
                                } else {
                                    api.column(11).visible(false);
                                }
                                if (response.CURRENCY == 1) {
                                    api.column(12).visible(true);
                                } else {
                                    api.column(12).visible(false);
                                }
                                if (response.EXCH_RATE == 1) {
                                    api.column(13).visible(true);
                                } else {
                                    api.column(13).visible(false);
                                }
                                if (response.REFERENCE_KEY == 1) {
                                    api.column(14).visible(true);
                                } else {
                                    api.column(14).visible(false);
                                }
                                if (response.PMT_IND == 1) {
                                    api.column(15).visible(true);
                                } else {
                                    api.column(15).visible(false);
                                }
                                if (response.TRANS_TYPE == 1) {
                                    api.column(16).visible(true);
                                } else {
                                    api.column(16).visible(false);
                                }
                                if (response.SPREAD_VAL == 1) {
                                    api.column(17).visible(true);
                                } else {
                                    api.column(17).visible(false);
                                }
                                if (response.LINE_ITEM == 1) {
                                    api.column(18).visible(false);
                                } else {
                                    api.column(18).visible(false);
                                }
                                if (response.OI_IND == 1) {
                                    api.column(19).visible(true);
                                } else {
                                    api.column(19).visible(false);
                                }
                                if (response.ACCT_TYPE == 1) {
                                    api.column(20).visible(true);
                                } else {
                                    api.column(20).visible(false);
                                }
                                if (response.SPEC_GL == 1) {
                                    api.column(21).visible(true);
                                } else {
                                    api.column(21).visible(false);
                                }
                                if (response.BUS_AREA == 1) {
                                    api.column(22).visible(true);
                                } else {
                                    api.column(22).visible(false);
                                }
                                if (response.TPBA == 1) {
                                    api.column(23).visible(true);
                                } else {
                                    api.column(23).visible(false);
                                }
                                if (response.AMT_LC == 1) {
                                    api.column(24).visible(true);
                                } else {
                                    api.column(24).visible(false);
                                }
                                if (response.AMT_TC == 1) {
                                    api.column(25).visible(true);
                                } else {
                                    api.column(25).visible(false);
                                }
                                if (response.AMT_WITH_BASE_TC == 1) {
                                    api.column(26).visible(true);
                                } else {
                                    api.column(26).visible(false);
                                }
                                if (response.AMT_WITH_TC == 1) {
                                    api.column(27).visible(true);
                                } else {
                                    api.column(27).visible(false);
                                }
                                 if (response.AMOUNT == 1) {
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
                                if (response.COST_CTR == 1) {
                                    api.column(31).visible(true);
                                } else {
                                    api.column(31).visible(false);
                                }
                                if (response.GL_ACCT == 1) {
                                    api.column(32).visible(true);
                                } else {
                                    api.column(32).visible(false);
                                }
                                if (response.CUSTOMER == 1) {
                                    api.column(33).visible(true);
                                } else {
                                    api.column(33).visible(false);
                                }

                                if (response.VENDOR == 1) {
                                    api.column(34).visible(true);
                                } else {
                                    api.column(34).visible(false);
                                }
                                if (response.BASE_DATE == 1) {
                                    api.column(35).visible(true);
                                } else {
                                    api.column(35).visible(false);
                                }
                                if (response.TERM_PMT == 1) {
                                    api.column(36).visible(true);
                                } else {
                                    api.column(36).visible(false);
                                }
                                if (response.DUE_ON == 1) {
                                    api.column(37).visible(true);
                                } else {
                                   api.column(37).visible(false);
                                }
                                if (response.PMT_BLOCK == 1) {
                                    api.column(38).visible(true);
                                } else {
                                    api.column(38).visible(false);
                                }
                                if (response.HOUSE_BANK == 1) {
                                    api.column(39).visible(true);
                                } else {
                                    api.column(39).visible(false);
                                }
                                if (response.PRTNR_BANK_TYPE == 1) {
                                    api.column(40).visible(true);
                                } else {
                                    api.column(40).visible(false);
                                }
                                 if (response.BANK_KEY == 1) {
                                     api.column(41).visible(true);
                                } else {
                                     api.column(41).visible(false);
                                }
                                if (response.BANK_ACCOUNT == 1) {
                                    api.column(42).visible(true);
                                } else {
                                    api.column(42).visible(false);
                                }
                                if (response.ACCOUNT_HOLDER == 1) {
                                    api.column(43).visible(true);
                                } else {
                                    api.column(43).visible(false);
                                }
                                if (response.PO_NUM == 1) {
                                     api.column(44).visible(true);
                                } else {
                                     api.column(44).visible(false);
                                }
                                if (response.PO_ITEM == 1) {
                                    api.column(45).visible(true);
                                } else {
                                    api.column(45).visible(false);
                                }
                                if (response.REF_KEY1 == 1) {
                                    api.column(46).visible(true);
                                } else {
                                    api.column(46).visible(false);
                                }
                                if (response.REF_KEY2 == 1) {
                                    api.column(47).visible(true);
                                } else {
                                    api.column(47).visible(false);
                                }
                                if (response.REF_KEY3 == 1) {
                                    api.column(48).visible(true);
                                } else {
                                    api.column(48).visible(false);
                                }
                                if (response.INT_ORDER == 1) {
                                    api.column(49).visible(true);
                                } else {
                                    api.column(49).visible(false);
                                }
                                if (response.WBS_NUM == 1) {
                                    api.column(50).visible(true);
                                } else {
                                    api.column(50).visible(false);
                                }
                                if (response.CASH_CODE == 1) {
                                    api.column(51).visible(true);
                                } else {
                                    api.column(51).visible(false);
                                }
                                if (response.DR_CR_IND == 1) {
                                    api.column(52).visible(true);
                                } else {
                                    api.column(52).visible(false);
                                }
                                 if (response.AMT_WITH_BASE_LC == 1) {
                                     api.column(53).visible(true);
                                } else {
                                    api.column(53).visible(false);
                                }
                                if (response.AMT_WITH_LC == 1) {
                                    api.column(54).visible(true);
                                } else {
                                    api.column(54).visible(false);
                                }
                                if (response.METODE_PEMBAYARAN == 1) {
                                    api.column(55).visible(true);
                                 } else {
                                    api.column(55).visible(false);
                                }
                                if (response.TGL_RENCANA_BAYAR == 1) {
                                    api.column(56).visible(true);
                                } else {
                                    api.column(56).visible(false);
                                }
                                if (response.SUMBER_DANA == 1) {
                                    api.column(57).visible(true);
                                } else {
                                    api.column(57).visible(false);
                                }
                                if (response.KETERANGAN == 1) {
                                    api.column(58).visible(true);
                                } else {
                                    api.column(58).visible(false);
                                }
                                 if (response.STATUS_TRACKING == 1) {
                                  api.column(59).visible(true);
                                } else {
                                  api.column(59).visible(false);
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
                var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
                $(this).append(html);
            });

            $('.dataTables_filter').each(function () {
                // var html = '';
                var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
                    '<i class="fa fa-arrows-alt"></i></button>';
                /*button reject*/
                html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
                    '            <i class="fa fa-ban"></i></button>';
                html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fas fa-edit"></i></button>';
                if(newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){
                    html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;

                }
                html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fas fa-trash"></i></button>';
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
    $("#pNoRekPln").select("val", "");
    setSelectBankAccount("pNoRekPln", tempBankPembayar);
}

function selectBankAccount(value) {
    tempBankAccount = value;
    $("#pSaldo").select("val", "");
    setSelectSaldo("pSaldo", tempBankAccount);
}

function edit_data(pCompCode, pNoDoc, pFiscYear, pLineItem) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"/api_operator/rekap_invoice_reject/edit_data",
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
            console.log("data edit_data :",res);
            $("#pKet").val(res[0].KET);
            $("#pCompanyCode").val(res[0].COMP_CODE);
            $("#pNoDoc").val(res[0].DOC_NO);
            $("#pFiscYear").val(res[0].FISC_YEAR);
            $("#pDocumentType").val(res[0].DOC_TYPE);
            $("#pDocumentDate").val(res[0].DOC_DATE2);
            $("#pPostDate").val(res[0].POST_DATE2);
            $("#pEntryDate").val(res[0].ENTRY_DATE2);
            $("#pReference").val(res[0].REFERENCE);
            $("#pReverseWith").val(res[0].REV_WITH);
            $("#pReverseYear").val(res[0].REV_YEAR);
            $("#pDocHdr").val(res[0].DOC_HDR_TXT);
            $("#pCurrency").val(res[0].CURRENCY);
            $("#pExchRate").val(res[0].EXCH_RATE);
            $("#pRefKey").val(res[0].REFERENCE_KEY);
            $("#pPaymentIndicator").val(res[0].PMT_IND);
            $("#pTransactionType").val(res[0].TRANS_TYPE);
            $("#pSpreadValue").val(res[0].SPREAD_VAL);
            $("#pAccountType").val(res[0].ACCT_TYPE);
            $("#pBusinessArea").val(res[0].BUS_AREA);
            $("#pTradingPartner").val(res[0].TPBA);
            $("#pAmountLc").val(res[0].AMT_LC);
            $("#pAmountTc").val(res[0].AMT_TC);
            $("#pAmountWhtBase").val(res[0].AMT_WITH_BASE_TC);
            $("#pAmountWht").val(res[0].AMT_WITH_TC);
            $("#pTotalTagihan").val(res[0].AMOUNT);
            $("#pAssignment").val(res[0].ASSIGNMENT);
            $("#pItemText").val(res[0].ITEM_TEXT);
            $("#pCostCtr").val(res[0].COST_CTR);
            $("#pGlAccount").val(res[0].GL_ACCT);
            $("#pNamaVendor").val(res[0].VENDOR);
            $("#pNamaCustomer").val(res[0].CUSTOMER);
            $("#pBaseline").val(res[0].BASE_DATE);
            $("#pTermOfPayment").val(res[0].TERM_PMT);
            $("#pTglDueOn").val(res[0].DUE_ON);
            $("#pLineItem").val(res[0].LINE_ITEM);
            $("#pPaymentBlock").val(res[0].PMT_BLOCK);
            $("#pHouseBank").val(res[0].HOUSE_BANK);
            $("#pPartnerBank").val(res[0].PRTNR_BANK_TYPE);
            $("#pNoRekVendor").val(res[0].BANK_ACCOUNT);
            $("#pBankPenerima").val(res[0].BANK_KEY);
            $("#pAccountHolder").val(res[0].ACCOUNT_HOLDER);
            $("#pPoNum").val(res[0].PO_NUM);
            $("#pRefKey1").val(res[0].REF_KEY1);
            $("#pRefKey2").val(res[0].REF_KEY2);
            $("#pRefKey3").val(res[0].REF_KEY3);
            $("#pIntOrder").val(res[0].INT_ORDER);
            $("#pWbsNum").val(res[0].WBS_NUM);
            $("#pCashCode").val(res[0].CASH_CODE);
            $("#pDebitCredit").val(res[0].DR_CR_IND);
            $("#pAmountWthBaseLc").val(res[0].AMT_WITH_BASE_LC);
            $("#pAmountWthLc").val(res[0].AMT_WITH_LC);
            $("#pMetodePembayaran").val(res[0].METODE_PEMBAYARAN);
            $("#pTglRencanaBayar").val(res[0].TGL_RENCANA_BAYAR);
            //$("#pNoGiro").val(res[0].NO_GIRO);
            $("#pKodeCashFlow").val(res[0].CASH_CODE);
            $("#pSumberDana").val(res[0].SUMBER_DANA);
            $("#pCompanyCode").val(res[0].COMP_CODE);
            //$("#pNoNotDin").val(res[0].NOTA_DINAS);
            $("#pBankPembayaran").val(res[0].HOUSE_BANK);
            //$("#pNoRekPln").val(res[0].HOUSE_BANK);
            //$("#pSaldo").val(res[0].HOUSE_BANK);
            $("#pNewKeterangan").val(res[0].KETERANGAN);
            $('#pDocumentDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

            setSelectBankPembayar("pBankPembayaran",res[0].NAMA_BANK);
            //tempBankPembayar = res[0].NAMA_BANK;
            setSelectBankAccount("pNoRekPln", tempBankPembayar);
            setSelectSaldo("pSaldo", tempBankAccount);
            //setSelectAccountName("pNoRekPln", "", tempBankPembayar);
//            $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
//            $("#pJam").val(res[0].JAM_DEAL);
//            $("#pNationalAmount").val(res[0].NATIONAL_AMOUNT);
//            $("#pDealRate").val(res[0].DEAL_RATE);
//            $("#pForwardPoint").val(res[0].FORWARD_POINT);
//            $("#pBungaDeposito").val(res[0].BUNGA_DEPOSITE_HEDGING);
//            $("#pKursJisdor1").val(res[0].KURS_JISDOR1);
//
//            setSelectCurr("pCurr","",res[0].CURRENCY,"DERIVATIF");
//            setSelectBank("pBank","","PEMBAYAR",res[0].ID_BANK_CONTERPARTY,"DERIVATIF");
//            setSelectTenor("pTenor","",res[0].ID_TENOR);
//            setSelectSumberDana("pSumberDana",res[0].ID_SUMBER_DANA);
//            setSelectJenisPembayaran("pPeruntukanDana","",res[0].ID_PERUNTUKAN_DANA);
//            $("#pStatusDeviratif").val(res[0].STATUS_DERIVATIF);

            setTimeout(function(){ $('#edit-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

    function inputKeterangan() {

        var ket = localStorage.getItem("real_ket");
        if (ket === null) {
            return null
        }
        else {
            var ket_split2 = ket.split(",");
            var option = '';
            for (var i = 0; i < ket_split2.length; i++) {
                option += '<option value="' + ket_split2[i] + '" />';
            }
            if (ket_split2[0] == "null") {
                localStorage.removeItem("real_ket");
                localStorage.removeItem("KET");
            } else {
                document.getElementById("data-keterangan").innerHTML = option;
            }
        }
     }
}

function setSelectBankPembayar(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_reject/get_bank_pembayar",
        dataType: 'JSON',
        type: "GET",
        sync :true,


        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.NAMA_BANK + '">'+val.NAMA_BANK+'</option>');
            });
//            console.log("jenis pemb : ", idForSelected);
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



function setSelectBankAccount(idHtml, bankPembayar, idForSelected) {
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_reject/get_bank_account",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pBankPembayar: bankPembayar
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.BANK_ACCOUNT + '">' + val.BANK_ACCOUNT + '-' + val.DESCRIPTION +'</option>');
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
            url: baseUrl + "/api_operator/rekap_invoice_reject/get_saldo",
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
        url: baseUrl + "/api_operator/rekap_invoice_reject/get_account_name",
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
    showLoadingCss()
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_reject/update_pembayaran",
        dataType: 'JSON',
        type: "POST",
        data: {
            pCompCode: $("#pCompanyCode").val(),
            pDocNo: $("#pNoDoc").val(),
            pFiscYear: $("#pFiscYear").val(),
            pLineItem: $("#pLineItem").val(),
            pKet: $("#pKet").val(),
            pBankPembayar: $("#pBankPembayaran").val(),
            pKeterangan: $("#pNewKeterangan").val(),
            pTglRencanaBayar: $("#pTglRencanaBayar").val(),
            pSumberDana: $("#pSumberDana").val(),
            pMetodePembayaran: $("#pMetodePembayaran").val(),
        },
        success: function (res) {
            //console.log("COBA DIAZ :",res);
                    hideLoadingCss("")
                    var result = res.return.split(";")[0];
                    //var result = res;
                    if (result == 1 || result == '1') {
                        alert(res.OUT_MSG);
                        search("load");
                        $('#edit-modal').modal('hide');
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

function update_status(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "/api_operator/rekap_invoice_reject/update_status",
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

function reverse_reject(pCompCode, pDocNo, pFiscYear, pLineItem, pKet){
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "/api_operator/rekap_invoice_reject/reverse_reject",
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

function create_group() {
    console.log("checkedArray", checkedArray);
    var stateCrf = confirm("Anda Yakin Akan Melakukan Grouping Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "/api_operator/rekap_invoice_reject/create_group",
            dataType: 'JSON',
            type: "POST",
            data: {
                pData: JSON.stringify(checkedArray),
                pNamaGroup: $("#pNamaGroup").val()
            },
            success: function (res) {
                hideLoadingCss("")
             if (res.return == 1) {
                    alert(res.OUT_MSG)
                    search("load");
                    $('#multiple-edit-modal').modal('hide');
                    table_rekapitulasi.ajax.reload();
                    checkedArray = new Array();
                } else {
                   alert(res.OUT_MSG);
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                search("load");
            }
        });
    }
}

function openMultipleEditForm(){
    $("#pNamaGroup").val("")
    $('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
}

function checkArray(e) {
    var isNew= true;
    if($(e).is(":checked")) {
        if(checkedArray.length == 0) {
            checkedArray.push($(e).data("value"));
        }else {
            for (x = 0; x < checkedArray.length; x++){
                var valArr = JSON.stringify(checkedArray[x]);
                var valCb = JSON.stringify($(e).data("value"));
                if(valArr == valCb){
                    isNew=false;
                    break;
                }
            }
            if(isNew == true){
                checkedArray.push($(e).data("value"));
            }
        }
    }
    else {
        var total = $("#table-rekapitulasi input[type=checkbox]:checked").map(function () {
            return $(this).data("value");
        }).get().length;
        if(total == 0){
            $("#cbparent").prop('checked', false);
        }
        for (x = 0; x < checkedArray.length; x++){
            var valArr = JSON.stringify(checkedArray[x]);
            var valCb = JSON.stringify($(e).data("value"));
            if(valArr == valCb){
                checkedArray.splice(x, 1);
            }
        }
    }
}

