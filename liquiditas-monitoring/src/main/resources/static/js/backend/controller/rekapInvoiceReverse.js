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
    // getAllData();
//     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectFilterBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectMetodeBayar("cmb_cara_pembayaran", "FILTER", "", "", "REKAP");
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
    window.open(baseUrl + "api_operator/rekap_invoice_reverse/xls_reverse");
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
                {width: "20%", "targets": 0},
                { className: "datatables_action", "targets": [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] },
                {
                    "bSortable": true,
                    "aTargets": [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
                },
                {
                    "sortable": false,
                    "aTargets": []
                },
                {
                    "aTargets": [0],
                    "mRender": function (data, type, full) {
                        return full.NOMOR;
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
                        return full.DOC_DATE;
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
                        return full.FISC_YEAR;
                    }

                },

                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return full.GROUP_ID;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return full.ID_PAYMENT_STATUS;
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.INV_STATUS;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.PMT_AMOUNT,2,".",",");
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return full.PMT_BUSINESS_AREA;
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return full.PMT_CASH_CODE;

                    }
                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return full.PMT_CURRENCY;
                    }

                },
                {
                    "aTargets": [12],
                    "mRender": function (data, type, full) {
                        return full.PMT_DATE;
                    }

                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        return full.PMT_EXCHANGE_RATE;
                    }
                },
                {
                    "aTargets": [14],
                    "mRender": function (data, type, full) {
                        return full.PMT_HOUSE_BANK;
                    }

                },
                {
                    "aTargets": [15],
                    "mRender": function (data, type, full) {
                        return full.PMT_PROPOSAL_ID;
                    }

                },
                {
                    "aTargets": [16],
                    "mRender": function (data, type, full) {
                        return full.PMT_RESIDUAL_IND;
                    }

                },
                {
                    "aTargets": [17],
                    "mRender": function (data, type, full) {
                        return full.PMT_SUMBER_DANA;
                    }

                },
                {
                    "aTargets": [18],
                    "mRender": function (data, type, full) {
                        return full.REMARKS;
                    }
                },
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/rekap_invoice_reverse/get_invoice_reverse",
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
    //             "initComplete": function(settings, json) {
    //                 var api = this.api();
    //                 $.ajax({
    //                     url: baseUrl + "api_operator/rekap_invoice_belum/get_column",
    //                     dataType: 'JSON',
    //                     type: "GET",
    // //                            success: function (res) {
    // //                                var response = res.data[0];
    // //                            },
    //                     success: function (res) {
    //                         var response = res.data[0];
    //                         if (response.NOMOR == 1) {
    //                             api.column(0).visible(true);
    //                         } else {
    //                             api.column(0).visible(false);
    //                         }
    //                         if (response.KET == 1) {
    //                             api.column(1).visible(true);
    //                         } else {
    //                             api.column(1).visible(false);
    //                         }
    //                         if (response.COMP_CODE == 1) {
    //                             api.column(2).visible(true);
    //                         } else {
    //                             api.column(2).visible(false);
    //                         }
    //                         if (response.DOC_NO == 1) {
    //                             api.column(3).visible(true);
    //                         } else {
    //                             api.column(3).visible(false);
    //                         }
    //                         if (response.GROUP_ID == 1) {
    //                             api.column(4).visible(true);
    //                         } else {
    //                             api.column(4).visible(false);
    //                         }
    //                         if (response.OSS_ID == 1) {
    //                             api.column(5).visible(true);
    //                         } else {
    //                             api.column(5).visible(false);
    //                         }
    //                         if (response.FISC_YEAR == 1) {
    //                             api.column(6).visible(true);
    //                         } else {
    //                             api.column(6).visible(false);
    //                         }
    //                         if (response.DOC_TYPE == 1) {
    //                             api.column(7).visible(true);
    //                         } else {
    //                             api.column(7).visible(false);
    //                         }
    //                         if (response.DOC_DATE == 1) {
    //                             api.column(8).visible(true);
    //                         } else {
    //                             api.column(8).visible(false);
    //                         }
    //                         if (response.POST_DATE == 1) {
    //                             api.column(9).visible(true);
    //                         } else {
    //                             api.column(9).visible(false);
    //                         }
    //
    //                         if (response.ENTRY_DATE == 1) {
    //                             api.column(10).visible(true);
    //                         } else {
    //                             api.column(10).visible(false);
    //                         }
    //
    //                         if (response.REFERENCE == 1) {
    //                             api.column(11).visible(true);
    //                         } else {
    //                             api.column(11).visible(false);
    //                         }
    //                         if (response.REV_WITH == 1) {
    //                             api.column(12).visible(true);
    //                         } else {
    //                             api.column(12).visible(false);
    //                         }
    //                         if (response.REV_YEAR == 1) {
    //                             api.column(13).visible(true);
    //                         } else {
    //                             api.column(13).visible(false);
    //                         }
    //                         if (response.DOC_HDR_TXT == 1) {
    //                             api.column(14).visible(true);
    //                         } else {
    //                             api.column(14).visible(false);
    //                         }
    //                         if (response.CURRENCY == 1) {
    //                             api.column(15).visible(true);
    //                         } else {
    //                             api.column(15).visible(false);
    //                         }
    //                         if (response.CURR_BAYAR == 1) {
    //                             api.column(16).visible(true);
    //                         } else {
    //                             api.column(16).visible(false);
    //                         }
    //                         if (response.EXCH_RATE == 1) {
    //                             api.column(17).visible(true);
    //                         } else {
    //                             api.column(17).visible(false);
    //                         }
    //                     },
    //                     error: function () {
    //                         hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
    //                     }
    //                 });
    //             }
        }
    );
    table_rekapitulasi.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    // $('.dataTables_filter').each(function () {
    //     var html = '<button class="btn btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" data-toggle="modal" title="Tampilkan Kolom" onclick="showColumn()"><i class="fa fa-arrows-alt"></i></button>';
    //     $(this).append(html);
    // });

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
            if(due_on !== data[x].TGL_RENCANA_BAYAR || bank !== data[x].BANK_BYR || hb_rekening !== data[x].NO_REK_HOUSE_BANK || assg !== assignment || sumber_dana !== data[x].SUMBER_DANA ||
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

$("#pMetodeBayarMultiple").change(function () {
    if ($("#pMetodeBayarMultiple").val() === "GIRO"){
        $("#pMultipleNoGiro").removeAttr("disabled");
    }else{
        $("#pMultipleNoGiro").attr("disabled","disabled");
        $("#pMultipleNoGiro").val("");
    }
});
