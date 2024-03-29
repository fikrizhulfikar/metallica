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
     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectFilterBank("cmb_bank", "FILTER", "", "", "REKAP");
    // setSelectMetodeBayar("cmb_cara_pembayaran", "FILTER", "", "", "REKAP");
    // setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
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
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});


    function search(state) {
        if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
            alert("Mohon Lengkapi Tgl Akhir");
        } else {
            initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_cara_pembayaran").val(), $("#cmb_status_tracking").val())
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
                dataRow.push(row["STATUS_INVOICE"]);
                dataRow.push(row["NO_REK_HOUSE_BANK"]);
                dataRow.push(row["TGL_LUNAS"]);
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
                            "aTargets": [0,35, 36, 74]
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
                                return full.COMP_CODE;
                            }

                        },
                        {
                            "aTargets": [3],
                            "mRender": function (data, type, full) {
                                return full.DOC_NO;
                            }

                        },

                        {
                            "aTargets": [4],
                            "mRender": function (data, type, full) {
                                return full.GROUP_ID;
                            }

                        },
                        {
                            "aTargets": [5],
                            "mRender": function (data, type, full) {
                                return full.OSS_ID;
                            }

                        },
                        {
                            "aTargets": [6],
                            "mRender": function (data, type, full) {
                                return full.FISC_YEAR;
                            }

                        },
                        {
                            "aTargets": [7],
                            "mRender": function (data, type, full) {
                                return full.DOC_TYPE;
                            }

                        },
                        {
                            "aTargets": [8],
                            "mRender": function (data, type, full) {
                                return full.DOC_DATE2;
                            }

                        },
                        {
                            "aTargets": [9],
                            "mRender": function (data, type, full) {
                                return full.POST_DATE;

                            }
                        },
                        {
                            "aTargets": [10],
                            "mRender": function (data, type, full) {
                                return full.ENTRY_DATE2;
                            }

                        },
                        {
                            "aTargets": [11],
                            "mRender": function (data, type, full) {
                                return full.REFERENCE;
                            }

                        },
                        {
                            "aTargets": [12],
                            "mRender": function (data, type, full) {
                                return full.REV_WITH;
                            }
                        },
                        {
                            "aTargets": [13],
                            "mRender": function (data, type, full) {
                                return full.REV_YEAR;
                            }

                        },
                        {
                            "aTargets": [14],
                            "mRender": function (data, type, full) {
                                return full.DOC_HDR_TXT;
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
                                return full.CURR_BAYAR;
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
                                return full.REFERENCE_KEY;
                            }
                        },
                        {
                            "aTargets": [19],
                            "mRender": function (data, type, full) {
                                return full.PMT_IND;
                            }
                        },
                        {
                            "aTargets": [20],
                            "mRender": function (data, type, full) {
                                return full.TRANS_TYPE;
                            }
                        },
                        {
                            "aTargets": [21],
                            "mRender": function (data, type, full) {
                                return full.SPREAD_VAL;
                                //return full.SPEC_GL;
                            }
                        },
                        {
                            "aTargets": [22],
                            "mRender": function (data, type, full) {
                                //return full.PAJAK + "%";
                                return full.LINE_ITEM;
                                //return full.BUS_AREA;
                            }
                        },
                        {
                            "aTargets": [23],
                            "mRender": function (data, type, full) {
                                return full.OI_IND;
                                //return full.TPBA;
                            }
                        },
                        {
                            "aTargets": [24],
                            "mRender": function (data, type, full) {
                                return full.ACCT_TYPE;
                                //return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [25],
                            "mRender": function (data, type, full) {
                                return full.SPEC_GL;
                                //return full.AMT_TC;

                            }
                        },
                        {
                            "aTargets": [26],
                            "mRender": function (data, type, full) {
                                return full.BUS_AREA;
                                //return full.AMT_WITH_BASE_TC;
                            }
                        },
                        {
                            "aTargets": [27],
                            "mRender": function (data, type, full) {
                                return full.TPBA;
                                //return full.AMT_WITH_TC;
                            }
                        },
                        {
                            "aTargets": [28],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                                // return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [29],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                                // return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [30],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [31],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                            }
                        },

                        {
                            "aTargets": [32],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT,2,".",",");
                            }

                        },
                        {
                            "aTargets": [33],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT_BAYAR,2,".",",");
                            }
                        },
                        {
                            "aTargets": [34],
                            "mRender": function (data, type, full) {
                                return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [35],
                            "mRender": function (data, type, full) {
                                return full.ITEM_TEXT;
                            }
                        },
                        {
                            "aTargets": [36],
                            "mRender": function (data, type, full) {
                                return full.COST_CTR;
                            }
                        },
                        {
                            "aTargets": [37],
                            "mRender": function (data, type, full) {
                                return full.GL_ACCT;
                            }
                        },
                        {
                            "aTargets": [38],
                            "mRender": function (data, type, full) {
                                return full.CUSTOMER;
                            }
                        },
                        {
                            "aTargets": [39],
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }
                        },
                        {
                            "aTargets": [40],
                            "mRender": function (data, type, full) {
                                return full.BASE_DATE;
                            }
                        },
                        {
                            "aTargets": [41],
                            "mRender": function (data, type, full) {
                                return full.TERM_PMT;
                            }
                        },
                        {
                            "aTargets": [42],
                            "mRender": function (data, type, full) {
                                return full.DUE_ON;
                            }
                        },
                        {
                            "aTargets": [43],
                            "mRender": function (data, type, full) {
                                return full.PMT_BLOCK;
                            }
                        },
                        {
                            "aTargets": [44],
                            "mRender": function (data, type, full) {
                                return full.BANK_BYR;
                            }
                        },
                        {
                            "aTargets": [45],
                            "mRender": function (data, type, full) {
                                return full.NO_REK_HOUSE_BANK;
                            }
                        },
                        {
                            "aTargets": [46],
                            "mRender": function (data, type, full) {
                                return full.PRTNR_BANK_TYPE;
                            }
                        },
                        {
                            "aTargets": [47],
                            "mRender": function (data, type, full) {
                                return full.BANK_KEY;
                            }
                        },
                        {
                            "aTargets": [48],
                            "mRender": function (data, type, full) {
                                return full.BANK_ACCOUNT;
                            }
                        },
                        {
                            "aTargets": [49],
                            "mRender": function (data, type, full) {
                                return full.ACCOUNT_HOLDER;
                            }
                        },
                        {
                            "aTargets": [50],
                            "mRender": function (data, type, full) {
                                return full.NAMA_BENEF;
                            }
                        },
                        {
                            "aTargets": [51],
                            "mRender": function (data, type, full) {
                                return full.NO_REK_BENEF;
                            }
                        },
                        {
                            "aTargets": [52],
                            "mRender": function (data, type, full) {
                                return full.BANK_BENEF;
                            }
                        },
                        {
                            "aTargets": [53],
                            "mRender": function (data, type, full) {
                                return full.PO_NUM;
                            }
                        },
                        {
                            "aTargets": [54],
                            "mRender": function (data, type, full) {
                                return full.PO_ITEM;
                            }
                        },
                        {
                            "aTargets": [55],
                            "mRender": function (data, type, full) {
                                return full.REF_KEY1;
                            }
                        },
                        {
                            "aTargets": [56],
                            "mRender": function (data, type, full) {
                                return full.REF_KEY2;
                            }
                        },
                        {
                            "aTargets": [57],
                            "mRender": function (data, type, full) {
                                return full.REF_KEY3;
                            }
                        },
                        {
                            "aTargets": [58],
                            "mRender": function (data, type, full) {
                                return full.INT_ORDER;
                            }
                        },
                        {
                            "aTargets": [59],
                            "mRender": function (data, type, full) {
                                return full.WBS_NUM;
                            }
                        },
                        {
                            "aTargets": [60],
                            "mRender": function (data, type, full) {
                                return full.CASH_CODE;
                            }
                        },
                        {
                            "aTargets": [61],
                            "mRender": function (data, type, full) {
                                return full.DR_CR_IND;
                            }
                        },
                        {
                            "aTargets": [62],
                            "mRender": function (data, type, full) {
                                return full.PARTIAL_IND;
                            }
                        },
                        {
                            "aTargets": [63],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [64],
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [65],
                            "mRender": function (data, type, full) {
                                return full.METODE_PEMBAYARAN;
                            }
                        },
                        {
                            "aTargets": [66],
                            "mRender": function (data, type, full) {
                                return full.NO_GIRO;
                            }
                        },
                        {
                            "aTargets": [67],
                            "mRender": function (data, type, full) {
                                return full.REF_NUM_BANK;
                            }
                        },
                        {
                            "aTargets": [68],
                            "mRender": function (data, type, full) {
                                return full.TGL_TAGIHAN_DITERIMA;
                            }
                        },
                        {
                            "aTargets": [69],
                            "mRender": function (data, type, full) {
                                return full.TGL_RENCANA_BAYAR;
                            }
                        },
                        {
                            "aTargets": [70],
                            "mRender": function (data, type, full) {
                                return full.SUMBER_DANA;
                            }
                        },
                        {
                            "aTargets": [71],
                            "mRender": function (data, type, full) {
                                return full.KETERANGAN;

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
                                return full.TGL_LUNAS;

                            }
                        },
                        {
                            "aTargets": [74],
                            "mRender": function (data, type, full) {
                                var ret_value;
                                if (full.METODE_PEMBAYARAN === 'GIRO' || full.METODE_PEMBAYARAN === 'INTERNETBANKING') {
                                    ret_value = '-';
                                }else{
                                    ret_value ='<button type="button" class="btn btn-sm btn-elementary" onclick="cetakStrukLunas(this,\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.KET+'\')"><i class="fas fa-receipt"></i></button>'
                                }
                                return ret_value;
                            }

                        },
                        // {
                        //     "aTargets": [63],
                        //     "mRender": function (data, type, full) {
                        //         var value = new Object();
                        //         var ret_value = ''
                        //
                        //         if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                        //             return "-"
                        //         }
                        //         else {
                        //             if (full.STATUS_TRACKING == "INPUT DATA") {
                        //                 value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';
                        //
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY STAFF OPERATION") {
                        //
                        //                 if(newRoleUser[0] == "ROLE_MANAGER_PRIMARY_ENERGY" || newRoleUser[0] == "ROLE_MANAGER_OPERATION" || newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_MANAGER_PAYMENT"){
                        //                     value = '{"3":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY STAFF INVESTMENT") {
                        //
                        //                 if(newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_APLN" || newRoleUser[0] == "ROLE_MANAGER_INVESTMENT_SLPMN" || newRoleUser[0] == "ROLE_ADMIN"){
                        //                     value = '{"6":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER IE"){
                        //
                        //                 if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_INVESTMENT" || newRoleUser[0] == "ROLE_ADMIN"){
                        //                     value = '{"8":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY MANAGER PE"){
                        //
                        //                 if(newRoleUser[0] == "ROLE_VICE_PRESIDENT_OPERATION" || newRoleUser[0] == "ROLE_ADMIN"){
                        //                     value = '{"5":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR > "25000000000"){
                        //                 if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                        //                     value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR > "25000000000"){
                        //                 if(newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                        //                     value = '{"10":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY OPERATION" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
                        //                 var role = newRoleUser[0];
                        //
                        //                 if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                        //                     value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else if (full.STATUS_TRACKING == "VERIFIED BY VP TREASURY INVESTMENT" && full.EQ_IDR <= "25000000000"  || full.STATUS_TRACKING == "VERIFIED BY EVP"){
                        //                 var role = newRoleUser[0];
                        //
                        //                 if(role.includes("KASIR") || newRoleUser[0] == "ROLE_ADMIN"){
                        //                     value = '{"7":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }else {
                        //                     value = '{"x":"'+full.ID_VALAS+'","jenisPembayaran" : "'+full.ID_JENIS_PEMBAYARAN+'", "currency":"'+full.CURRENCY+'", "total":"'+full.TOTAL_TAGIHAN+'"}';
                        //                 }
                        //             }
                        //             else {
                        //                 value = '{"pCompCode":"'+full.COMP_CODE+'","pDocNo" : "'+full.DOC_NO+'", "pFiscYear":"'+full.FISC_YEAR+'", "pLineItem":"'+full.LINE_ITEM+'","pKet":"'+full.KET+'"}';
                        //             }
                        //         }
                        //
                        //         for (x=0; x<checkedArray.length;x++){
                        //             if(JSON.stringify(checkedArray[x]) === value){
                        //                 return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox' checked>";
                        //             }
                        //         }
                        //         return ret_value= "<input class='cb' type='checkbox' data-value='"+value+"' onchange='checkArray(this)' id='cbcheckbox'>";
                        //     }
                        // }
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_operator/rekap_invoice_realisasi/get_rekap_lunas",
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
                                    let totalTagihan = 0;
                                    let arr = res.data;
                                    arr.forEach((val, key) => {
                                        if (val.AMOUNT){
                                            totalTagihan += parseFloat(val.AMOUNT);
                                        }
                                    });
                                    $("#total_tagihan").html(accounting.formatNumber(totalTagihan.toString(), 2, '.', ','));
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
                            url: baseUrl + "api_operator/rekap_invoice_realisasi/get_column",
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
                                if (response.COMP_CODE == 1) {
                                    api.column(2).visible(true);
                                } else {
                                    api.column(2).visible(false);
                                }
                                if (response.DOC_NO == 1) {
                                    api.column(3).visible(true);
                                } else {
                                    api.column(3).visible(false);
                                }
                                if (response.GROUP_ID == 1) {
                                    api.column(4).visible(true);
                                } else {
                                    api.column(4).visible(false);
                                }
                                if (response.OSS_ID == 1) {
                                    api.column(5).visible(true);
                                } else {
                                    api.column(5).visible(false);
                                }
                                if (response.FISC_YEAR == 1) {
                                    api.column(6).visible(true);
                                } else {
                                    api.column(6).visible(false);
                                }
                                if (response.DOC_TYPE == 1) {
                                    api.column(7).visible(true);
                                } else {
                                    api.column(7).visible(false);
                                }
                                if (response.DOC_DATE == 1) {
                                    api.column(8).visible(true);
                                } else {
                                    api.column(8).visible(false);
                                }
                                if (response.POST_DATE == 1) {
                                    api.column(9).visible(true);
                                } else {
                                    api.column(9).visible(false);
                                }

                                if (response.ENTRY_DATE == 1) {
                                    api.column(10).visible(true);
                                } else {
                                    api.column(10).visible(false);
                                }

                                if (response.REFERENCE == 1) {
                                    api.column(11).visible(true);
                                } else {
                                    api.column(11).visible(false);
                                }
                                if (response.REV_WITH == 1) {
                                    api.column(12).visible(true);
                                } else {
                                    api.column(12).visible(false);
                                }
                                if (response.REV_YEAR == 1) {
                                    api.column(13).visible(true);
                                } else {
                                    api.column(13).visible(false);
                                }
                                if (response.DOC_HDR_TXT == 1) {
                                    api.column(14).visible(true);
                                } else {
                                    api.column(14).visible(false);
                                }
                                if (response.CURRENCY == 1) {
                                    api.column(15).visible(true);
                                } else {
                                    api.column(15).visible(false);
                                }
                                if (response.CURR_BAYAR == 1) {
                                    api.column(16).visible(true);
                                } else {
                                    api.column(16).visible(false);
                                }
                                if (response.EXCH_RATE == 1) {
                                    api.column(17).visible(true);
                                } else {
                                    api.column(17).visible(false);
                                }
                                if (response.REFERENCE_KEY == 1) {
                                    api.column(18).visible(true);
                                } else {
                                    api.column(18).visible(false);
                                }
                                if (response.PMT_IND == 1) {
                                    api.column(19).visible(true);
                                } else {
                                    api.column(19).visible(false);
                                }
                                if (response.TRANS_TYPE == 1) {
                                    api.column(20).visible(true);
                                } else {
                                    api.column(20).visible(false);
                                }
                                if (response.SPREAD_VAL == 1) {
                                    api.column(21).visible(true);
                                } else {
                                    api.column(21).visible(false);
                                }
                                if (response.LINE_ITEM == 1) {
                                    api.column(22).visible(true);
                                } else {
                                    api.column(22).visible(false);
                                }
                                if (response.OI_IND == 1) {
                                    api.column(23).visible(true);
                                } else {
                                    api.column(23).visible(false);
                                }
                                if (response.ACCT_TYPE == 1) {
                                    api.column(24).visible(true);
                                } else {
                                    api.column(24).visible(false);
                                }
                                if (response.SPEC_GL == 1) {
                                    api.column(25).visible(true);
                                } else {
                                    api.column(25).visible(false);
                                }
                                if (response.BUS_AREA == 1) {
                                    api.column(26).visible(true);
                                } else {
                                    api.column(26).visible(false);
                                }
                                if (response.TPBA == 1) {
                                    api.column(27).visible(true);
                                } else {
                                    api.column(27).visible(false);
                                }
                                if (response.AMT_LC == 1) {
                                    api.column(28).visible(true);
                                } else {
                                    api.column(28).visible(false);
                                }
                                if (response.AMT_TC == 1) {
                                    api.column(29).visible(true);
                                } else {
                                    api.column(29).visible(false);
                                }
                                if (response.AMT_WITH_BASE_TC == 1) {
                                    api.column(30).visible(true);
                                } else {
                                    api.column(30).visible(false);
                                }
                                if (response.AMT_WITH_TC == 1) {
                                    api.column(31).visible(true);
                                } else {
                                    api.column(31).visible(false);
                                }
                                if (response.AMOUNT == 1) {
                                    api.column(32).visible(true);
                                } else {
                                    api.column(32).visible(false);
                                }
                                if (response.AMOUNT_BAYAR == 1) {
                                    api.column(33).visible(true);
                                } else {
                                    api.column(33).visible(false);
                                }
                                if (response.ASSIGNMENT == 1) {
                                    api.column(34).visible(true);
                                } else {
                                    api.column(34).visible(false);
                                }
                                if (response.ITEM_TEXT == 1) {
                                    api.column(35).visible(true);
                                } else {
                                    api.column(35).visible(false);
                                }

                                if (response.COST_CTR == 1) {
                                    api.column(36).visible(true);
                                } else {
                                    api.column(36).visible(false);
                                }
                                if (response.GL_ACCT == 1) {
                                    api.column(37).visible(true);
                                } else {
                                    api.column(37).visible(false);
                                }
                                if (response.CUSTOMER_NAME == 1) {
                                    api.column(38).visible(true);
                                } else {
                                    api.column(38).visible(false);
                                }
                                if (response.VENDOR_NAME == 1) {
                                    api.column(39).visible(true);
                                } else {
                                    api.column(39).visible(false);
                                }
                                if (response.BASE_DATE == 1) {
                                    api.column(40).visible(true);
                                } else {
                                    api.column(40).visible(false);
                                }
                                if (response.TERM_PMT == 1) {
                                    api.column(41).visible(true);
                                } else {
                                    api.column(41).visible(false);
                                }
                                if (response.DUE_ON == 1) {
                                    api.column(42).visible(true);
                                } else {
                                    api.column(42).visible(false);
                                }
                                if (response.PMT_BLOCK == 1) {
                                    api.column(43).visible(true);
                                } else {
                                    api.column(43).visible(false);
                                }
                                if (response.HOUSE_BANK == 1) {
                                    api.column(44).visible(true);
                                } else {
                                    api.column(44).visible(false);
                                }
                                if (response.NO_REK_HOUSE_BANK == 1) {
                                    api.column(45).visible(true);
                                } else {
                                    api.column(45).visible(false);
                                }
                                if (response.PRTNR_BANK_TYPE == 1) {
                                    api.column(46).visible(true);
                                } else {
                                    api.column(46).visible(false);
                                }
                                if (response.BANK_KEY == 1) {
                                    api.column(47).visible(true);
                                } else {
                                    api.column(47).visible(false);
                                }
                                if (response.BANK_ACCOUNT == 1) {
                                    api.column(48).visible(true);
                                } else {
                                    api.column(48).visible(false);
                                }
                                if (response.ACCOUNT_HOLDER == 1) {
                                    api.column(49).visible(true);
                                } else {
                                    api.column(49).visible(false);
                                }
                                if (response.NAMA_BENEF == 1) {
                                    api.column(50).visible(true);
                                } else {
                                    api.column(50).visible(false);
                                }
                                if (response.NO_REK_BENEF == 1) {
                                    api.column(51).visible(true);
                                } else {
                                    api.column(51).visible(false);
                                }
                                if (response.BANK_BENEF == 1) {
                                    api.column(52).visible(true);
                                } else {
                                    api.column(52).visible(false);
                                }
                                if (response.PO_NUM == 1) {
                                    api.column(53).visible(true);
                                } else {
                                    api.column(53).visible(false);
                                }
                                if (response.PO_ITEM == 1) {
                                    api.column(54).visible(true);
                                } else {
                                    api.column(54).visible(false);
                                }
                                if (response.REF_KEY1 == 1) {
                                    api.column(55).visible(true);
                                } else {
                                    api.column(55).visible(false);
                                }
                                if (response.REF_KEY2 == 1) {
                                    api.column(56).visible(true);
                                } else {
                                    api.column(56).visible(false);
                                }
                                if (response.REF_KEY3 == 1) {
                                    api.column(57).visible(true);
                                } else {
                                    api.column(57).visible(false);
                                }
                                if (response.INT_ORDER == 1) {
                                    api.column(58).visible(true);
                                } else {
                                    api.column(58).visible(false);
                                }
                                if (response.WBS_NUM == 1) {
                                    api.column(59).visible(true);
                                } else {
                                    api.column(59).visible(false);
                                }
                                if (response.CASH_CODE == 1) {
                                    api.column(60).visible(true);
                                } else {
                                    api.column(60).visible(false);
                                }
                                if (response.DR_CR_IND == 1) {
                                    api.column(61).visible(true);
                                } else {
                                    api.column(61).visible(false);
                                }
                                if (response.PARTIAL_IND == 1) {
                                    api.column(62).visible(true);
                                } else {
                                    api.column(62).visible(false);
                                }
                                if (response.AMT_WITH_BASE_LC == 1) {
                                    api.column(63).visible(true);
                                } else {
                                    api.column(63).visible(false);
                                }
                                if (response.AMT_WITH_LC == 1) {
                                    api.column(64).visible(true);
                                } else {
                                    api.column(64).visible(false);
                                }
                                if (response.METODE_PEMBAYARAN == 1) {
                                    api.column(65).visible(true);
                                } else {
                                    api.column(65).visible(false);
                                }
                                if (response.NO_GIRO == 1) {
                                    api.column(66).visible(true);
                                } else {
                                    api.column(66).visible(false);
                                }
                                if (response.REF_NUM_BANK == 1) {
                                    api.column(67).visible(true);
                                } else {
                                    api.column(67).visible(false);
                                }
                                if (response.TGL_TAGIHAN_DITERIMA == 1) {
                                    api.column(68).visible(true);
                                } else {
                                    api.column(68).visible(false);
                                }
                                if (response.TGL_RENCANA_BAYAR == 1) {
                                    api.column(69).visible(true);
                                } else {
                                    api.column(69).visible(false);
                                }
                                if (response.SUMBER_DANA == 1) {
                                    api.column(70).visible(true);
                                } else {
                                    api.column(70).visible(false);
                                }
                                if (response.KETERANGAN == 1) {
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
                var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
                $(this).append(html);
            });

            $('.dataTables_filter').each(function () {
                // var html = '';
                var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
                    '<i class="fa fa-arrows-alt"></i></button>';
                html = html + '<button class="btn btn-edit-data btn-sm btn-success" id="btn-balance" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
                // if (newRoleUser[0] === 'ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY'){
                //
                // }else if (newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){{
                //     html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
                // }else{
                //
                // }
                //
                // /*button reject*/
                // html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
                //     '            <i class="fa fa-ban"></i></button>';
                // html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fas fa-edit"></i></button>';
                //
                // if(newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){
                //
                //
                // }
                // html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fas fa-trash"></i></button>';
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

function setSelectStatusTracking(idHtml) {
    $("#" + idHtml + "").append('<option value="INPUT DATA">INPUT DATA</option>');
    $("#" + idHtml + "").append('<option value="VERIFIED BY MAKER">VERIFIED BY MAKER</option>');
    $("#" + idHtml + "").append('<option value="VERIFIED BY CHECKER">VERIFIED BY CHECKER</option>');
    $("#" + idHtml + "").append('<option value="VERIFIED BY APPROVER">VERIFIED BY APPROVER</option>');
}

function selectBankAccount(value) {
    tempBankAccount = value;
    $("#pSaldo").select("val", "");
    setSelectSaldo("pSaldo", tempBankAccount);
}

function edit_data(pCompCode, pNoDoc, pFiscYear, pLineItem,pSource, pBank,  pBeneficiaryAccount) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_realisasi/edit_data",
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
            $("#pCashCode").val(res[0].CASH_CODE);
            $("#pDebitCredit").val(res[0].DR_CR_IND);
            $("#pAmountWthBaseLc").val(res[0].AMT_WITH_BASE_LC);
            $("#pAmountWthLc").val(res[0].AMT_WITH_LC);
            $("#pBankPenerima").val(res[0].BANK_KEY);
            $("#pNoRekVendor").val(res[0].BANK_ACCOUNT);
            $("#pAccountHolder").val(res[0].ACCOUNT_HOLDER);
            //$("#pBankPembayaran").val(res[0].HOUSE_BANK);
            $("#pNoRekPln").val(res[0].NO_REK_HOUSE_BANK);
            $("#pMetodePembayaran").val(res[0].METODE_PEMBAYARAN);
            $("#pSumberDana").val(res[0].SUMBER_DANA);
            $("#pTglRencanaBayar").val(res[0].TGL_RENCANA_BAYAR);
            $("#pNewKeterangan").val(res[0].KETERANGAN);
            $("#pCustomerName").val(res[0].INQ_CUSTOMER_NAME);
            $("#pAccountNumber").val(res[0].INQ_ACCOUNT_NUMBER);
            $("#pAccountStatus").val(res[0].INQ_ACCOUNT_STATUS);

            $('#pDocumentDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

           setSelectBankPembayar("pHouseBank",res[0].NAMA_BANK);
           /// setSelectBankAccount("pNoRekPln", tempBankPembayar);
           // setSelectSaldo("pSaldo", tempBankAccount);


            setTimeout(function(){ $('#edit-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function cek_data(pCompCode, pNoDoc, pFiscYear, pLineItem, pSource, pBank,  pBeneficiaryAccount) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_realisasi/edit_data",
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
            console.log("data edit_data :",res);
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
            //$("#pNoGiro").val(res[0].NO_GIRO);
            //$("#pNoNotDin").val(res[0].NOTA_DINAS);
            $("#pBankPenerima2").val(res[0].BANK_KEY);
            $("#pNoRekVendor2").val(res[0].BANK_ACCOUNT);
            $("#pAccountHolder2").val(res[0].ACCOUNT_HOLDER);
            $("#pBankPembayarans2").val(res[0].HOUSE_BANK);
            $("#pNoRekPLN2").val(res[0].NO_REK_HOUSE_BANK);
            $("#pMetodePembayaran2").val(res[0].METODE_PEMBAYARAN);
            $("#pSumberDana2").val(res[0].SUMBER_DANA);
            $("#pTglRencanaBayar2").val(res[0].TGL_RENCANA_BAYAR);
            $("#pNewKeterangan2").val(res[0].KETERANGAN);
            $("#pKodeCashFlow").val(res[0].CASH_CODE);
            //$("#pNoRekPln").val(res[0].HOUSE_BANK);
            //$("#pSaldo").val(res[0].HOUSE_BANK);

            $('#pDocumentDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar2').datepicker({ dateFormat: 'dd/mm/yy'});
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

function detail_data(pCompCode, pNoDoc, pFiscYear, pLineItem) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/rekap_invoice_realisasi/edit_data",
        dataType: 'JSON',
        type: "GET",
        data : {
            pCompCode : pCompCode,
            pNoDoc : pNoDoc,
            pFiscYear : pFiscYear,
            pLineItem : pLineItem
        },
        success: function (res) {
        //console.log(res[0].NO_REK_HOUSE_BANK)
            hideLoadingCss("")
            console.log("data edit_data :",res);
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
            $("#pBaseline2").val(res[0].BASE_DATE);
            $("#pTermOfPayment2").val(res[0].TERM_PMT);
            $("#pTglDueOn2").val(res[0].DUE_ON);
            $("#pLineItem2").val(res[0].LINE_ITEM);
            $("#pPaymentBlock2").val(res[0].PMT_BLOCK);
            $("#pHouseBank2").val(res[0].HOUSE_BANK);
            $("#pPartnerBank2").val(res[0].PRTNR_BANK_TYPE);
            $("#pNoRekVendor2").val(res[0].BANK_ACCOUNT);
            $("#pBankPenerima2").val(res[0].BANK_KEY);
            $("#pAccountHolder2").val(res[0].ACCOUNT_HOLDER);
            $("#pBankPembayarans2").val(res[0].HOUSE_BANK);
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
            //$("#pNoGiro").val(res[0].NO_GIRO);
            $("#pKodeCashFlow2").val(res[0].CASH_CODE);
            $("#pSumberDana2").val(res[0].SUMBER_DANA);
            $("#pCustomerName2").val(res[0].INQ_CUSTOMER_NAME);
            $("#pAccountNumber2").val(res[0].INQ_ACCOUNT_NUMBER);
            $("#pAccountStatus2").val(res[0].INQ_ACCOUNT_STATUS);
            //$("#pNoNotDin2").val(res[0].NOTA_DINAS);

            //$("#pSaldo").val(res[0].HOUSE_BANK);
            $("#pNewKeterangan2").val(res[0].KETERANGAN);
            $('#pDocumentDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pEntryDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pTglRencanaBayar2').datepicker({ dateFormat: 'dd/mm/yy'});
            $('#pTglDueOn2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pPostDate2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});
            $('#pBaseline2').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: new Date()});

            setSelectBankPembayar("pBankPembayaran2",res[0].NAMA_BANK);
            setSelectBankAccount("pNoRekPln2", tempBankPembayar);
            setSelectSaldo("pSaldo2", tempBankAccount);




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
            //url: baseUrl+"api_operator/rekap_invoice_realisasi/edit_data",
            dataType: 'JSON',
            type: "GET",
            data : {
                pBank : '',
                pSource : '',
                pBeneficiary : ''
            },
            success: function (res)  {
                hideLoadingCss("")
                //console.log("data edit_data :",res);
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

//    function inputKeterangan() {
//
//        var ket = localStorage.getItem("real_ket");
//        if (ket === null) {
//            return null
//        }
//        else {
//            var ket_split2 = ket.split(",");
//            var option = '';
//            for (var i = 0; i < ket_split2.length; i++) {
//                option += '<option value="' + ket_split2[i] + '" />';
//            }
//            if (ket_split2[0] == "null") {
//                localStorage.removeItem("real_ket");
//                localStorage.removeItem("KET");
//            } else {
//                document.getElementById("data-keterangan").innerHTML = option;
//            }
//        }
//     }
//}

function setSelectBankPembayar(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_bank_pembayar",
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
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_bank_account",
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
            url: baseUrl + "api_operator/rekap_invoice_realisasi/get_saldo",
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
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_account_name",
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
        url: baseUrl + "api_operator/rekap_invoice_realisasi/update_pembayaran",
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
            pNoRekHouseBank : $("#pNoRekPln").val(),
            pInqCustomerName : $("#pCustomerName").val(),
            pInqAccountNumber : $("#pAccountNumber").val(),
            pInqAccountStatus : $("#pAccountStatus").val(),
        },
        success: function (res) {
            //console.log("COBA DIAZ :",res);
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
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
                }
            });
}

function update_status(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking, pCustomerName, pAccountNumber){
    var stateCrf = confirm("Anda Yakin Akan Memverifikasi Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_realisasi/update_status",
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

function getBallance2(pBank, pSource, pBeneficiary){
    var stateCrf = confirm("Anda Data Yang Anda Masukan Sudah Benar?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_realisasi/get_Ballance2",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pBank: $("#pBank").val(),
                 pSource: $("#pSource").val(),
                 pBeneficiary: $("#pBeneficiary").val(),
            },
            success: function (res) {
                showLoadingCss();
                var tes = JSON.stringify(res);
                console.log(res);

                 $("#pAccountName").val(res.data.accountName);
                 $("#pAccountBalance").val(res.data.accountBalance);

                $("#pRespon").val(tes);
//                if (res.return == 1) {
//                    alert(res.OUT_MSG);
                    alert(res.responseMessage);
                    table_rekapitulasi.ajax.reload();
               // }
//                else {
//                   console.log("DIAZZZ");
//                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function getInquiry(pSource, pBank,  pBeneficiaryAccount){
    var stateCrf = confirm("Anda Yakin Akan Melakukan Inquiry ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_realisasi/inquiry",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pSource: $("#pNoRekPln").val(),
                 pBank: $("#pHouseBank").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor").val(),
            },
            success: function (res) {
                hideLoadingCss("")
                var tes = JSON.stringify(res);
               // console.log(res);

                $("#pRespon2").val(tes);
                $("#pCustomerName").val(res.data.customerName);
                $("#pAccountNumber").val(res.data.accountNumber);
                $("#pAccountStatus").val(res.data.accountStatus);
//                if (res.return == 1) {
//                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
               // }
//                else {
//                   console.log("DIAZZZ");
//                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function updLunas(pStatus){
    var stateCrf = confirm("Anda Yakin Akan Melunasi Tagihan Ini?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_realisasi/update_lunas",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pCompCode: $("#pCompanyCode2").val(),
                 pDocNo: $("#pNoDoc2").val(),
                 pFiscYear: $("#pFiscYear2").val(),
                 pLineItem: $("#pLineItem2").val(),
                 pJenisTransaksi: $("#pKet2").val(),
                 pStatus: pStatus,
            },
            success: function (res) {
                hideLoadingCss("")

                if (res.return == 1) {
                  alert(res.OUT_MSG);
                  search("load");
                  $('#detail-modal').modal('hide');
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
            url: baseUrl + "api_operator/rekap_invoice_realisasi/do_payment",
            dataType: 'JSON',
            type: "POST",
            data: {
                 pMetodeBayar: $("#pMetodePembayaran2").val(),
                 pBank: $("#pHouseBank2").val(),
                 pRefNum: $("#pRefKey4").val(),
                 pSource: $("#pNoRekPLN2").val(),
                 pBeneficiaryAccount: $("#pNoRekVendor2").val(),
                 pCurrency: $("#pCurrency2").val(),
                 pAmount: $("#pTotalTagihan2").val(),
                 pRemark: 'UAT',
                 pBenefEmail: "",
                 pBenefName: $("#pCustomerName2").val(),
                 pBenefAddr1: "",
                 pBenefAddr2: "",
                 pDestinationBank: $("#pBankPembayarans2").val(),
                 pFeeType: "OUR",
                 pCurrency2 : $("#pCurrency2").val(),
                 pRetrievalReff : "" ,
                 pDestinationBankCode : "",

            },
            success: function (res) {
                hideLoadingCss("")
                var tes = JSON.stringify(res);
                console.log(res);
                var pStatus = res.data.responseMessage;
                updLunas(pStatus);
                $("#pRespon3").val(tes);
//                if (res.return == 1) {
//                    alert(res.OUT_MSG);
                    table_rekapitulasi.ajax.reload();
               // }
//                else {
//                   console.log("DIAZZZ");
//                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function reverse_status(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking){
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_realisasi/reverse_status",
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

function reject_data(pCompCode, pDocNo, pFiscYear, pLineItem, pKet){
    var stateCrf = confirm("Anda Yakin Akan Mereverse Tagihan Ini ?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/rekap_invoice_realisasi/ins_rekap_reject",
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
            url: baseUrl + "api_operator/rekap_invoice_realisasi/create_group",
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
    //$('#edit-modal2').modal({backdrop: 'static', keyboard: false});
}

function openGetBallance(){
    alert("Fitur ini untuk sementara belum dapat digunakan");
    //$("#pNamaGroup").val("")
    //$('#multiple-edit-modal').modal({backdrop: 'static', keyboard: false});
    // $('#edit-modal2').modal({backdrop: 'static', keyboard: false});
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

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/rekap_invoice_realisasi/xls/" + tglAwal.replace(/\//g,"-") + "/" + tglAkhir.replace(/\//g,"-") + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_cara_pembayaran").val() + "/" + $("#cmb_bank").val() + "/" +null+ "/" +null);
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_total_tagihan",
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

function showColumn() {
    $("#hide_column_modal").modal("show");
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_column",
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
            if (response.COMP_CODE == 1) {
                $("#hc2").prop("checked", true);
            } else {
                $("#hc2").prop("checked", false);
            }
            if (response.DOC_NO == 1) {
                $("#hc3").prop("checked", true);
            } else {
                $("#hc3").prop("checked", false);
            }
            if (response.GROUP_ID == 1) {
                $("#hc4").prop("checked", true);
            } else {
                $("#hc4").prop("checked", false);
            }
            if (response.OSS_ID == 1) {
                $("#hc5").prop("checked", true);
            } else {
                $("#hc5").prop("checked", false);
            }
            if (response.FISC_YEAR == 1) {
                $("#hc6").prop("checked", true);
            } else {
                $("#hc6").prop("checked", false);
            }
            if (response.DOC_TYPE == 1) {
                $("#hc7").prop("checked", true);
            } else {
                $("#hc7").prop("checked", false);
            }
            if (response.DOC_DATE == 1) {
                $("#hc8").prop("checked", true);
            } else {
                $("#hc8").prop("checked", false);
            }
            if (response.POST_DATE == 1) {
                $("#hc9").prop("checked", true);
            } else {
                $("#hc9").prop("checked", false);
            }

            if (response.ENTRY_DATE == 1) {
                $("#hc10").prop("checked", true);
            } else {
                $("#hc10").prop("checked", false);
            }

            if (response.REFERENCE == 1) {
                $("#hc11").prop("checked", true);
            } else {
                $("#hc11").prop("checked", false);
            }
            if (response.REV_WITH == 1) {
                $("#hc12").prop("checked", true);
            } else {
                $("#hc12").prop("checked", false);
            }
            if (response.REV_YEAR == 1) {
                $("#hc13").prop("checked", true);
            } else {
                $("#hc13").prop("checked", false);
            }
            if (response.DOC_HDR_TXT == 1) {
                $("#hc14").prop("checked", true);
            } else {
                $("#hc14").prop("checked", false);
            }
            if (response.CURRENCY == 1) {
                $("#hc15").prop("checked", true);
            } else {
                $("#hc15").prop("checked", false);
            }
            if (response.CURR_BAYAR == 1) {
                $("#hc16").prop("checked", true);
            } else {
                $("#hc16").prop("checked", false);
            }
            if (response.EXCH_RATE == 1) {
                $("#hc17").prop("checked", true);
            } else {
                $("#hc17").prop("checked", false);
            }
            if (response.REFERENCE_KEY == 1) {
                $("#hc18").prop("checked", true);
            } else {
                $("#hc18").prop("checked", false);
            }
            if (response.PMT_IND == 1) {
                $("#hc19").prop("checked", true);
            } else {
                $("#hc19").prop("checked", false);
            }
            if (response.TRANS_TYPE == 1) {
                $("#hc20").prop("checked", true);
            } else {
                $("#hc20").prop("checked", false);
            }
            if (response.SPREAD_VAL == 1) {
                $("#hc21").prop("checked", true);
            } else {
                $("#hc21").prop("checked", false);
            }
            if (response.LINE_ITEM == 1) {
                $("#hc22").prop("checked", true);
            } else {
                $("#hc22").prop("checked", false);
            }
            if (response.OI_IND == 1) {
                $("#hc23").prop("checked", true);
            } else {
                $("#hc23").prop("checked", false);
            }
            if (response.ACCT_TYPE == 1) {
                $("#hc24").prop("checked", true);
            } else {
                $("#hc24").prop("checked", false);
            }
            if (response.SPEC_GL == 1) {
                $("#hc25").prop("checked", true);
            } else {
                $("#hc25").prop("checked", false);
            }
            if (response.BUS_AREA == 1) {
                $("#hc26").prop("checked", true);
            } else {
                $("#hc26").prop("checked", false);
            }
            if (response.TPBA == 1) {
                $("#hc27").prop("checked", true);
            } else {
                $("#hc27").prop("checked", false);
            }
            if (response.AMT_LC == 1) {
                $("#hc28").prop("checked", true);
            } else {
                $("#hc28").prop("checked", false);
            }
            if (response.AMT_TC == 1) {
                $("#hc29").prop("checked", true);
            } else {
                $("#hc29").prop("checked", false);
            }
            if (response.AMT_WITH_BASE_TC == 1) {
                $("#hc30").prop("checked", true);
            } else {
                $("#hc30").prop("checked", false);
            }
            if (response.AMT_WITH_TC == 1) {
                $("#hc31").prop("checked", true);
            } else {
                $("#hc31").prop("checked", false);
            }
            if (response.AMOUNT == 1) {
                $("#hc32").prop("checked", true);
            } else {
                $("#hc32").prop("checked", false);
            }
            if (response.AMOUNT_BAYAR == 1) {
                $("#hc33").prop("checked", true);
            } else {
                $("#hc33").prop("checked", false);
            }
            if (response.ASSIGNMENT == 1) {
                $("#hc34").prop("checked", true);
            } else {
                $("#hc34").prop("checked", false);
            }
            if (response.ITEM_TEXT == 1) {
                $("#hc35").prop("checked", true);
            } else {
                $("#hc35").prop("checked", false);
            }

            if (response.COST_CTR == 1) {
                $("#hc36").prop("checked", true);
            } else {
                $("#hc36").prop("checked", false);
            }
            if (response.GL_ACCT == 1) {
                $("#hc37").prop("checked", true);
            } else {
                $("#hc37").prop("checked", false);
            }
            if (response.CUSTOMER_NAME == 1) {
                $("#hc38").prop("checked", true);
            } else {
                $("#hc38").prop("checked", false);
            }
            if (response.VENDOR_NAME == 1) {
                $("#hc39").prop("checked", true);
            } else {
                $("#hc39").prop("checked", false);
            }
            if (response.BASE_DATE == 1) {
                $("#hc40").prop("checked", true);
            } else {
                $("#hc40").prop("checked", false);
            }
            if (response.TERM_PMT == 1) {
                $("#hc41").prop("checked", true);
            } else {
                $("#hc41").prop("checked", false);
            }
            if (response.DUE_ON == 1) {
                $("#hc42").prop("checked", true);
            } else {
                $("#hc42").prop("checked", false);
            }
            if (response.PMT_BLOCK == 1) {
                $("#hc43").prop("checked", true);
            } else {
                $("#hc43").prop("checked", false);
            }
            if (response.HOUSE_BANK == 1) {
                $("#hc44").prop("checked", true);
            } else {
                $("#hc44").prop("checked", false);
            }
            if (response.NO_REK_HOUSE_BANK == 1) {
                $("#hc45").prop("checked", true);
            } else {
                $("#hc45").prop("checked", false);
            }
            if (response.PRTNR_BANK_TYPE == 1) {
                $("#hc46").prop("checked", true);
            } else {
                $("#hc46").prop("checked", false);
            }
            if (response.BANK_KEY == 1) {
                $("#hc47").prop("checked", true);
            } else {
                $("#hc47").prop("checked", false);
            }
            if (response.BANK_ACCOUNT == 1) {
                $("#hc48").prop("checked", true);
            } else {
                $("#hc48").prop("checked", false);
            }
            if (response.ACCOUNT_HOLDER == 1) {
                $("#hc49").prop("checked", true);
            } else {
                $("#hc49").prop("checked", false);
            }
            if (response.NAMA_BENEF == 1) {
                $("#hc50").prop("checked", true);
            } else {
                $("#hc50").prop("checked", false);
            }
            if (response.NO_REK_BENEF == 1) {
                $("#hc51").prop("checked", true);
            } else {
                $("#hc51").prop("checked", false);
            }
            if (response.BANK_BENEF == 1) {
                $("#hc52").prop("checked", true);
            } else {
                $("#hc52").prop("checked", false);
            }
            if (response.PO_NUM == 1) {
                $("#hc53").prop("checked", true);
            } else {
                $("#hc53").prop("checked", false);
            }
            if (response.PO_ITEM == 1) {
                $("#hc54").prop("checked", true);
            } else {
                $("#hc54").prop("checked", false);
            }
            if (response.REF_KEY1 == 1) {
                $("#hc55").prop("checked", true);
            } else {
                $("#hc55").prop("checked", false);
            }
            if (response.REF_KEY2 == 1) {
                $("#hc56").prop("checked", true);
            } else {
                $("#hc56").prop("checked", false);
            }
            if (response.REF_KEY3 == 1) {
                $("#hc57").prop("checked", true);
            } else {
                $("#hc57").prop("checked", false);
            }
            if (response.INT_ORDER == 1) {
                $("#hc58").prop("checked", true);
            } else {
                $("#hc58").prop("checked", false);
            }
            if (response.WBS_NUM == 1) {
                $("#hc59").prop("checked", true);
            } else {
                $("#hc59").prop("checked", false);
            }
            if (response.CASH_CODE == 1) {
                $("#hc60").prop("checked", true);
            } else {
                $("#hc60").prop("checked", false);
            }
            if (response.DR_CR_IND == 1) {
                $("#hc61").prop("checked", true);
            } else {
                $("#hc61").prop("checked", false);
            }
            if (response.PARTIAL_IND == 1) {
                $("#hc62").prop("checked", true);
            } else {
                $("#hc62").prop("checked", false);
            }
            if (response.AMT_WITH_BASE_LC == 1) {
                $("#hc63").prop("checked", true);
            } else {
                $("#hc63").prop("checked", false);
            }
            if (response.AMT_WITH_LC == 1) {
                $("#hc64").prop("checked", true);
            } else {
                $("#hc64").prop("checked", false);
            }
            if (response.METODE_PEMBAYARAN == 1) {
                $("#hc65").prop("checked", true);
            } else {
                $("#hc65").prop("checked", false);
            }
            if (response.NO_GIRO == 1) {
                $("#hc66").prop("checked", true);
            } else {
                $("#hc66").prop("checked", false);
            }
            if (response.TGL_TAGIHAN_DITERIMA == 1) {
                $("#hc67").prop("checked", true);
            } else {
                $("#hc67").prop("checked", false);
            }
            if (response.TGL_RENCANA_BAYAR == 1) {
                $("#hc68").prop("checked", true);
            } else {
                $("#hc68").prop("checked", false);
            }
            if (response.SUMBER_DANA == 1) {
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
            if (response.REF_NUM_BANK == 1) {
                $("#hc72").prop("checked", true);
            } else {
                $("#hc72").prop("checked", false);
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
    var hc72 = $("#hc72").prop('checked');

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

function cetakStrukLunas(button, comp_code, doc_no, fiscal_year, line_item, ket){
    $(button).find('i').remove();
    $(button).html($('<i/>',{class:'fas fa-circle-notch fa-spin'})).prop("disabled",true);
    $.ajax({
        url : baseUrl + "generate_doc/cetak/cetak_struk_corpay",
        dataType : "JSON",
        type : "POST",
        data : {
            pCompCode : comp_code,
            pDocNo : doc_no,
            pFiscalYear : fiscal_year,
            pLineItem : line_item,
            pKet : ket,
        },
        success : (res) => {
            if (res.createdoc.status === 1){
                // console.log("Result : ",res);
                alert("Berhasil Membuat Dokumen. Click 'Ok' untuk mengunduh.");
                window.open(baseUrl+"generate_doc/cetak/downloadfile/corpay_lunas_"+doc_no+".pdf","_blank");
            }
            $(button).find('i').remove();
            $(button).html($('<i/>',{class:'fas fa-receipt'})).prop("disabled",false);
        },
        error : (err) => {
            alert(err);
            $(button).find('i').remove();
            $(button).html($('<i/>',{class:'fas fa-receipt'})).prop("disabled",false);
        }
    })
}