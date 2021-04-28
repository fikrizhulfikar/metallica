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
    setSelectMetodeBayar("cmb_cara_pembayaran", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectStatusTracking("cmb_status_tracking");

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
                        // {width: 100, targets: 35},
                        // {width: 100, targets: 36},
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "visible" : true,
                            "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]
                        },
                        {
                            "sortable": false,
                            "aTargets": [0,72]
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
                                return full.EXC_RATE;
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
                                return full.ACC_TYPE;
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
                            "name" : "TGL_TAGIHAN_DITERIMA",
                            "mRender": function (data, type, full) {
                                return full.TGL_TAGIHAN_DITERIMA;
                            }
                        },
                        {
                            "aTargets": [68],
                            "name" : "TGL_RENCANA_BAYAR",
                            "mRender": function (data, type, full) {
                                return full.TGL_RENCANA_BAYAR;
                            }
                        },
                        {
                            "aTargets": [69],
                            "name" : "SUMBER_DANA",
                            "mRender": function (data, type, full) {
                                return full.SUMBER_DANA;
                            }
                        },
                        {
                            "aTargets": [70],
                            "name" : "KETERANGAN",
                            "mRender": function (data, type, full) {
                                return full.KETERANGAN;

                            }
                        },
                        {
                            "aTargets": [71],
                            "name" : "STATUS_TRACKING",
                            "mRender": function (data, type, full) {
                                return full.STATUS_TRACKING;

                            }
                        },
                       {
                           "aTargets": [72],
                           "name" : "AKSI",
                           "mRender": function (data, type, full) {
                               var ret_value =
                                   '<div class="btn-group">' +
                                       '<button style="width: 15px !important;" class= "btn btn-pengantar btn-sm btn-elementary" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasSingle(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fas fa-file-alt"></i></button>'+
                                   '</div>';
                               return ret_value;
                           }
                       },
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_operator/rekap_invoice_sudah/get_rekap_invoice",
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
                                    return res.data;
                                }
                        }
                    ,
                    "drawCallback":
                        function (settings) {
                            getTotalTagihan();
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
                            url: baseUrl + "api_operator/rekap_invoice_sudah/get_column",
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
                        if(newRoleUser[0] === "ROLE_JA_CASH" || newRoleUser[0] === "ROLE_JA_IE" || newRoleUser[0] === "ROLE_ADMIN"){
                            api.column("AKSI:name").visible(true);
                        }else api.column("AKSI:name").visible(false);
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
//                /*button reject*/
//                html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
//                    '            <i class="fa fa-ban"></i></button>';
//                html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fas fa-edit"></i></button>';
//                html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//                if(newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){
//                    html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
//
//                }
//                html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
               $(this).append(html);
            });

            table_rekapitulasi.columns.adjust();
            initCbparent();
        }

function initCbparent() {
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
        url: baseUrl+"api_operator/rekap_invoice_sudah/edit_data",
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
        url: baseUrl+"api_operator/rekap_invoice_sudah/edit_data",
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

function edit_data2() {
        showLoadingCss();
        $.ajax({
            //url: baseUrl+"api_operator/rekap_invoice_sudah/edit_data",
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

function setSelectBankPembayar(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_sudah/get_bank_pembayar",
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
        url: baseUrl + "api_operator/rekap_invoice_sudah/get_bank_account",
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
            url: baseUrl + "api_operator/rekap_invoice_sudah/get_saldo",
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
        url: baseUrl + "api_operator/rekap_invoice_sudah/get_account_name",
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

function exportXls() {
    var tglAwal = "null";
    if (srcTglAwal != "") {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAkhir != "") {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_operator/rekap_invoice_sudah/xls/" + tglAwal.replace(/\//g,"-") + "/" + tglAkhir.replace(/\//g,"-") + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_cara_pembayaran").val() + "/" + $("#cmb_bank").val() + "/" +null+ "/" +null);
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "/api_operator/rekap_invoice_sudah/get_total_tagihan",
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
                console.log("Result : ",res);
                alert("Berhasil Mencetak Dokumen!");
                window.open(baseUrl+"generate_doc/cetak/downloadfile/laporan_"+doc_no+".docx","_blank");
            }

        },
        error : (err) => {
            console.log("Error : ",err.error);
        }
    })
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