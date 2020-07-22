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
     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
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
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_rekap_bayar",
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
                dataRow.push(row["DOC_NO"]);
                dataRow.push(row["METODE_PEMBAYARAN"]);
                dataRow.push(row["VENDOR_NAME"]);
                dataRow.push(row["HOUSE_BANK"]);
                dataRow.push(row["NO_REK_HOUSE_BANK"]);
                dataRow.push(row["BANK_BENEF"]);
                dataRow.push(row["NO_REK_BENEF"]);
                //dataRow.push({text: row["NILAI_TAGIHAN"], alignment: "right"});
                dataRow.push(row["CURRENCY"]);
                dataRow.push(row["AMT_TC"]);
                dataRow.push(row["APPROVER"]);
                dataRow.push(row["COUNTER"]);
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
                    "searching": false,
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
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11] },
                        {
                            "bSortable": true,
                            "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]
                        },
                        {
                            "sortable": false,
                            "aTargets": [0,1, 2]
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
                                return full.DOC_NO;
                            }

                        },
                        {
                            "aTargets": [2],
                            "mRender": function (data, type, full) {
                                return full.METODE_PEMBAYARAN;
                            }

                        },
                        {
                            "aTargets": [3],
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }

                        },

                        {
                            "aTargets": [4],
                            "mRender": function (data, type, full) {
                                return full.HOUSE_BANK;
                            }

                        },
                        {
                            "aTargets": [5],
                            "mRender": function (data, type, full) {
                                return full.NO_REK_HOUSE_BANK;
                            }

                        },
                        {
                            "aTargets": [6],
                            "mRender": function (data, type, full) {
                                return full.BANK_BENEF;
                            }

                        },
                        {
                            "aTargets": [7],
                            "mRender": function (data, type, full) {
                                return full.NO_REK_BENEF;
                            }

                        },
                        {
                            "aTargets": [8],
                            "mRender": function (data, type, full) {
                                return full.CURRENCY;
                            }

                        },
                        {
                            "aTargets": [9],
                            "mRender": function (data, type, full) {
                                return full.AMT_TC;

                            }
                        },
                        {
                            "aTargets": [10],
                            "mRender": function (data, type, full) {
                                return full.APPROVER;
                            }

                        },
                        {
                            "aTargets": [11],
                            "mRender": function (data, type, full) {
                                return full.COUNTER;
                            }

                        },
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_operator/rekap_invoice_realisasi/get_rekap_bayar",
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
                            url: baseUrl + "api_operator/rekap_invoice_realisasi/get_column",
                            dataType: 'JSON',
                            type: "GET",
                            success: function (res) {
                                var response = res.data[0];
                                api.column(0).visible(true);
                                api.column(1).visible(true);
                                api.column(2).visible(true);
                                api.column(3).visible(true);
                                api.column(4).visible(true);
                                api.column(5).visible(true);
                                api.column(6).visible(true);
                                api.column(7).visible(true);
                                api.column(8).visible(true);
                                api.column(9).visible(true);
                                api.column(10).visible(true);
                                api.column(11).visible(true);
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
                var html = '<label style="margin-left: 250px; cursor:default; text-align: center;"><b>REKAPITULASI REALISASI PEMBAYARAN</b><br><b>TANGGAL :</b> <b id="start_date"></b> - <b id="finish_date"></b></label>';
                $(this).append(html);
            });

            /*$('.dataTables_filter').each(function () {
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
                // *//*button reject*//*
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
            });*/

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
    window.open(baseUrl + "api_operator/rekap_invoice_realisasi/xlsRekap/" + tglAwal + "/" + tglAkhir + "/" + "ALL" + "/" + null + "/" + "ALL" + "/" +null+ "/" +null);
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
            $("#start_date").html($("#tanggal_awal").val());
            $("#finish_date").html($("#tanggal_akhir").val());
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
            if (response.DOC_NO == 1) {
                $("#hc1").prop("checked", true);
            } else {
                $("#hc1").prop("checked", false);
            }
            if (response.METODE_PEMBAYARAN == 1) {
                $("#hc2").prop("checked", true);
            } else {
                $("#hc2").prop("checked", false);
            }
            if (response.VENDOR_NAME == 1) {
                $("#hc3").prop("checked", true);
            } else {
                $("#hc3").prop("checked", false);
            }
            if (response.HOUSE_BANK == 1) {
                $("#hc4").prop("checked", true);
            } else {
                $("#hc4").prop("checked", false);
            }
            if (response.NO_REK_HOUSE_BANK == 1) {
                $("#hc5").prop("checked", true);
            } else {
                $("#hc5").prop("checked", false);
            }
            if (response.BANK_BENEF == 1) {
                $("#hc6").prop("checked", true);
            } else {
                $("#hc6").prop("checked", false);
            }
            if (response.NO_REK_BENEF == 1) {
                $("#hc7").prop("checked", true);
            } else {
                $("#hc7").prop("checked", false);
            }
            if (response.CURRENCY == 1) {
                $("#hc8").prop("checked", true);
            } else {
                $("#hc8").prop("checked", false);
            }
            if (response.AMT_TC == 1) {
                $("#hc9").prop("checked", true);
            } else {
                $("#hc9").prop("checked", false);
            }
            if (response.APPROVER == 1) {
                $("#hc10").prop("checked", true);
            } else {
                $("#hc10").prop("checked", false);
            }
            if (response.COUNTER == 1) {
                $("#hc11").prop("checked", true);
            } else {
                $("#hc11").prop("checked", false);
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

    var data = {
        "nomor" : hc0 == true ? 1 : 0,
        "ket" : hc1 == true ? 1 : 0,
        "doc_no" : hc2 == true ? 1 : 0,
        "doc_date2" : hc3 == true ? 1 : 0,
        "rev_with" : hc4 == true ? 1 : 0,
        "rev_year" : hc5 == true ? 1 : 0,
        "post_date2" : hc6 == true ? 1 : 0,
        "base_date" : hc7 == true ? 1 : 0,
        "entry_date2" : hc8 == true ? 1 : 0,
        "doc_type" : hc9 == true ? 1 : 0,
        "fisc_year" : hc10 == true ? 1 : 0,
        "doc_hdr_txt" : hc11 == true ? 1 : 0,
    };
    // console.log("data save column", data);
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