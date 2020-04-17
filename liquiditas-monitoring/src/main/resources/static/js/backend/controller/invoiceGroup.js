/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
var tempTableSearch = "";
var groupCheckedArray = new Array();
var fullArrayGroup = new Array();
var cbParentArray = new Array();
var Valas = "";
var tableInvoiceGroup;
var tempVendor = "";
var tempBankPembayar = "";
var tempHouseBank = "";
var tempBankAccount = "";
var tempKodeBank = "";
var tempUnit = "";
var tableDetailGroupInvoice;
var srcTglAwal = "";
var srcTglAkhir = "";

$(document).ready(function () {
    initDataTable();
    $('#tanggal_awal').datepicker({dateFormat: "dd/mm/yy"});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    // setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");

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

function update_status(idGroup, statusTracking){
    Swal.fire({
        title : "Verifikasi?",
        text : "Apakah Anda yakin akan membverifikasi tagihan ini?",
        icon : "warning",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya",
    }).then(result => {
        if (result.value == true){
            showLoadingCss();
            $.ajax({
                url: baseUrl + "api_operator/invoice_group/update_status",
                dataType: 'JSON',
                type: "POST",
                data: {
                    pIdGroup: idGroup,
                    pStatusTracking: statusTracking,
                },
                success: (res) => {
                    hideLoadingCss("")
                    if (res.return == 1) {
                        Swal.fire("Berhasil!", "Tagihan Berhasil Diverifikasi", "success");
                        // alert(res.OUT_MSG);
                        tableInvoiceGroup.ajax.reload();
                    } else {
                        Swal.fire("Gagal", "Tagihan gagal diverifikasi","error");
                        // alert(res.OUT_MSG);
                    }
                },
                error: () => {
                    hideLoadingCss();
                    Swal.fire("Error","Gagal Melakukan Proses, Harap Hubungi Administrator","error");
                }
            });
        }
    });
}

function reverse_status(idGroup, statusTracking){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/invoice_group/update_reverse",
        dataType : "JSON",
        type : "POST",
        data : {
            pIdGroup : idGroup,
            pStatusTracking : statusTracking
        },
        success : (response) => {
            hideLoadingCss("");
            if (response.return == 1){
                alert(response.OUT_MSG);
                tablePembelianValas.ajax.reload();
            } else {
                alert(response.OUT_MSG);
            }
        },
        error : () => {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
        }
    });
}

function getbyId(id) {
    showLoadingCss()
    
    $.ajax({
        url: baseUrl + "api_master/bank/get_bank_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id
        },
        success: function (res) {
            hideLoadingCss()
            console.log("get by id : ", res);
            $("#pKodeBank").val(res[0].KODE_BANK);
            $("#pKodeBank").prop('disabled', true);
            $("#pNamaBank").val(res[0].NAMA_BANK);
            $("#pJenis").val(res[0].JENIS);
            $("#pFlag").val(res[0].FLAG_TAMPIL);
            isUpdate = "1"
        },
        error: function () {
            hideLoadingCss()
            alert("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function AddToTable() {
    var docno = $("#pDocumentNumber").val();
    var drcrind = $("#pDrCrInd").val();
    var busarea = $("#pDetailBusArea").val();
    var pmtpropid = $("#pPmtProposalId").val();
    var glaccount = $("#pGlAccount").val();
    var postdate = $("#pPostDate").val();
    var compcode = $("#pDetailCompCode").val();
    var amt = $("#pAmount").val();
    var curr = $("#pDetailCurrency").val();
    var fiscyear = $("#pFiscYear").val();
    var ref = $("#pDetailReference").val();
    var remarks = $("#pRemarks").val();
    var lineno = $("#pLineNo").val();
    var exrate = $("#pExchangeRate").val();
    var flag = 0;
    if (compcode == "" || glaccount == "") {
        alert("Mohon Lengkapi Data")
    } else {

        $("#table-main-detail tbody").find("tr").each(function (index) {
            var temphtml = $(this).find('td').toArray();
            if($(temphtml[0]).html() == "No Data"){
                $(this).remove()
            }
        });

        var sts = "";
        // flag == 1 ? sts = 'TAMPIL' : sts = 'TIDAK TAMPIL'
        var html = "<tr>" +
            "<td>" + docno + "</td>" +
            "<td>" + pmtpropid + "</td>" +
            "<td>" + compcode + "</td>" +
            "<td>" + fiscyear + "</td>" +
            "<td>" + lineno + "</td>" +
            "<td>" + ref + "</td>" +
            "<td>" + drcrind + "</td>" +
            "<td>" + glaccount + "</td>" +
            "<td>" + amt + "</td>" +
            "<td>" + exrate + "</td>" +
            "<td>" + curr + "</td>" +
            "<td>" + postdate + "</td>" +
            "<td>" + busarea + "</td>" +
            "<td>" + remarks + "</td>" +
            "<td>" + flag + "</td>" +
            "<td align='center'> <a href='javascript: void(0)'  class='dele'><span class='fa fa-trash'></span></a></td>'";

        $("#table-main-detail tbody").append(html);
    }

    $("#pDrCrInd").val("");
    $("#pDetailBusArea").val("");
    $("#pGlAccount").val("");
    $("#pPostDate").val("");
    $("#pDetailCompCode").val("");
    $("#pAmount").val("");
    $("#pDetailCurrency").val("");
    $("#pDetailReference").val("");
    $("#pRemarks").val("");
    $("#pLineNo").val("");
    $("#pExchangeRate").val("");

    dele()
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

function updLunas(pStatus){
    var stateCrf = confirm("Anda Yakin Akan Melunasi Tagihan Ini?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/invoice_group/update_lunas",
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
                console.log(res);
                var tes = JSON.stringify(res);
                if (res.responseMessage == 'Sukses') {
                    var pStatus = res.data.responseMessage;
                    console.log('TEST : '+tes);
                   // $("#pRespon3").val(tes);
                     updLunas(pStatus);
                   tableInvoiceGroup.ajax.reload();
                   $("#pRespon3").val(tes);
                  }
                else {
                        alert(res.responseMessage);
                        table_rekapitulasi.ajax.reload();
                         $("#pRespons3").val(tes);
                 }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });
    }
}

function deletedb(idMetallica,idItem){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/pembelian_valas_trx/delete_pembelian_valas_item_trx",
        type : "POST",
        data : {
            pIdMetallica : idMetallica,
            pItemId : idItem
        },
        success : (res) => {
            console.log("get detail : ", res.data);
            alert("Data Berhasil Dihapus");
            hideLoadingCss();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator")
        }
    })
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

function detail_data(pCompCode, pNoDoc, pFiscYear, pLineItem) {
    showLoadingCss();
    $.ajax({
        url: baseUrl+"api_operator/invoice_group/edit_data",
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

            setSelectBankPembayar("pBankPembayaran2",res[0].NAMA_BANK);
            setSelectBankAccount("pNoRekPln2", tempBankPembayar);
            setSelectSaldo("pSaldo2", tempBankAccount);



            kirimToken(pCompCode, pNoDoc);
//            if($("#pStatusValidasi2").val() == "VALID"){
//                $("#btn-payment").show();
//            }else{
//                $("#btn-payment").hide();
//            }
            setTimeout(function(){ $('#detail-modal').modal({backdrop: 'static', keyboard: false}); }, timeSowFormEdit);
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
                console.log(res);
                if (res.return == 1) {

                  $("#pStatusValidasi2").val(res.OUT_MSG);
                } else {

                  $("#pStatusValidasi2").val(res.OUT_MSG);
                }
            },
            error: function () {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
            }
        });

}

function deleteHead (idMetallica){
    showLoadingCss();
    var del_confirm = confirm("Anda yakin ingin menghapus data ?");
    if(del_confirm){
        $.ajax({
            url : baseUrl + "api_operator/pembelian_valas_trx/delete_pembelian_valas_trx_head",
            dataType : "JSON",
            type : "POST",
            data : {
                pIdMetallica : idMetallica,
            },
            success : (result) => {
                console.log("Delete Result : ",result);
                hideLoadingCss("");
                // var result = res.return.split(";")[0];
                console.log("Result : "+result);
                if (result == 1 ) {
                    alert(result.OUT_MSG);
                    search("load");
                    $('#edit-modal').modal('hide');
                } else {
                    alert(result.OUT_MSG);
                }
            },
            error : () => {
                hideLoadingCss("Gagal Menghapus Data, Silahkan Hubungi Administrator");
            }
        });
    }else{
        hideLoadingCss("");
    }
    tableInvoiceGroup.ajax.reload();
}

function dele() {
    $(".dele").on('click', function () {
        $(this).parent().parent().remove();
        var ii = 0;
        $("#id-mat tr").each(function () {
            $(this).find('td:eq(0)').text(ii);
            ii++;
        });

        var rowCount = $('#table-main-detail tbody tr').length;
        if (rowCount < 1) {
            count = 0;
            var html = "<tr>" +
                "<td colspan='5' align='center'>No Data</td>" +
                "</tr>"

            $("#table-main-detail tbody").append(html);
        }
    });
}

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/pembelian_valas_trx/get_pembelian_valas_trx",
        dataType: 'JSON',
        type: "GET",
        data: {
            pStatusValas: "0",
            pTglAwal: $("#tanggal_awal").val(),
            pTglAkhir: $("#tanggal_akhir").val(),
            pCurrency: $("#cmb_currecny").val(),
            pStatus: "",
            pStatusTracking: "",
        },
        success: function (res) {
            allData = res;
        },
        error: function (res) {
            console.log("Gagal Melakukan Proses,Harap Hubungi Administrator : ", res)
        }
    });

}

function initDataTable(pTglAwal, pTglAkhir,  pBank) {
    showLoadingCss();
    $('#table-rekapitulasi tbody').empty();
    $('#table-rekapitulasi').dataTable().fnDestroy();

    tableInvoiceGroup = $('#table-rekapitulasi').DataTable({
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
                {width: 150, targets: 1},
                {width: 150, targets: 2},
                {width: 150, targets: 3},
                {width: 150, targets: 4},
                {width: 150, targets: 5},
                {width: 150, targets: 6},
                {width: 150, targets: 7},
                {width: 20, targets: 8},
                // {width: 100, targets: 35},
                // {width: 100, targets: 36},
                {width: "80%", "targets": 0},
                { className: "datatables_action", "targets": [1,2,3,4,5,6,7,8] },
                {
                    "bSortable": true,
                    "aTargets": [1, 2, 3, 4, 5,6,7,8]
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
                        return full.BANK_BYR2;
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return full.NO_REK_HOUSE_BANK;
                    }

                },
                {
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return full.COMP_CODE;
                    }

                },

                {
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return full.BUS_AREA;
                    }

                },
                {
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return full.TGL_RENCANA_BAYAR;
                    }

                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return Intl.NumberFormat().format(full.TOTAL_TAGIHAN);
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.ASSIGNMENT;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return full.SUMBER_DANA;
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        var jenis = "AP INVOICE";
                        console.log("Ini Full : ", full);
                        var ret_value;
                        /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                        /*    if(newRoleUser[0].includes("DIVKEU")){
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
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
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';

                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>';
                        }else {

                            if (full.STATUS_TRACKING == "INPUT DATA" || full.STATUS_TRACKING == "VALIDASI DATA") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                                        // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        // '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_CASH"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_GROUP + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_IE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_GROUP + '\')"><i class="fa fa-close"></i></button>'+
                                        '</div>';
                                }
                            }
                            else   if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_CENTRALIZED_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+'</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+'</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+'</div>';
                                }
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_FOREIGN_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+

                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_BUSINESS_MANAGEMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE_2"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PRIMARY_ENERGY_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-reverse-data btn-sm btn-default" title="Reverse Checker" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                            }

                            else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_VP_LIQUIDITY_AND_RECEIPT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_BUSINESS_MANAGEMENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_EXECUTIVE_VICE_PRESIDENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_PLH_EXECUTIVE_VICE_PRESIDENT"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-default" title="Reverse APPROVER" onclick="reverse_status(\'' +full.ID_GROUP+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                        '</div>';
                                }
                            }
                            else {
                                ret_value =
                                    '<div class="btn-group">' +
                                    // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="updateLunas(\'' +full.ID_METALLICA+'\',\''+jenis+'\')"><i class="fa fa-credit-card-alt"></i></button>'+
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                    // '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DIAZ" onclick="update_status(\'' +full.ID_METALLICA+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                    // '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-danger" title="Hapus" onclick="deleteHead(\'' + full.ID_METALLICA + '\')"><i class="fa fa-close"></i></button>'+
                                    '</div>';
                            }
                        }
                        return ret_value;
                    }

                }

            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/invoice_group/get_invoice_group_head",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            pTglAwal: pTglAwal,
                            pTglAkhir: pTglAkhir,
                            pBank: pBank,
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
                    tableInvoiceGroup.columns.adjust();
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
                url: baseUrl + "api_operator/invoice_group/get_column",
                dataType: 'JSON',
                type: "GET",
                success: function (res) {
                    var response = res.data[0];
                    if (response.ROW_NUMBER == 1) {
                        api.column(0).visible(true);
                    } else {
                        api.column(0).visible(false);
                    }
                    if (response.HOUSE_BANK == 1) {
                        api.column(1).visible(true);
                    } else {
                        api.column(1).visible(false);
                    }
                    if (response.NO_REK_HOUSE_BANK == 1) {
                        api.column(2).visible(true);
                    } else {
                        api.column(2).visible(false);
                    }
                    if (response.COMP_CODE == 1) {
                        api.column(3).visible(true);
                    } else {
                        api.column(3).visible(false);
                    }
                    if (response.BUS_AREA == 1) {
                        api.column(4).visible(true);
                    } else {
                        api.column(4).visible(false);
                    }
                    if (response.DUE_ON == 1) {
                        api.column(5).visible(true);
                    } else {
                        api.column(5).visible(false);
                    }
                    if (response.TOTAL_TAGIHAN == 1) {
                        api.column(6).visible(true);
                    } else {
                        api.column(6).visible(false);
                    }
                    if (response.ASSIGNMENT == 1) {
                        api.column(7).visible(true);
                    } else {
                        api.column(7).visible(false);
                    }
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                }
            });
        }
        },

    );

    tableInvoiceGroup.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

    $('.dataTables_length').each(function () {
        var html = '<label style="margin-left: 250px; cursor:default;">Total tagihan (Rp): <b id="total_tagihan">0</b></label>';
        $(this).append(html);
    });

    $('.dataTables_filter').each(function () {
        // var html = '';
        var html =  '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
        if (newRoleUser[0] == "ROLE_ADMIN" || newRoleUser[0] == "ROLE_JA_CASH" || newRoleUser[0] == "ROLE_JA_IE"){
            html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
        }
        if (newRoleUser[0] === "ROLE_VP_LIQUIDITY_AND_RECEIPT" || newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"
            || newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE" || newRoleUser[0] === "ROLE_PLH_EXECUTIVE_VICE_PRESIDENT"
            || newRoleUser[0] === "ROLE_VP_INVESTMENT_EXPENDITURE" || newRoleUser[0] === "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY"
            || newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT" || newRoleUser[0] === "ROLE_VP_BUSINESS_MANAGEMENT"){

        }
        $(this).append(html);
    });

    tableInvoiceGroup.columns.adjust();
    initCbparent();
}

function updateLunas(idGroup){
    var stsConf = confirm("Anda Yakin Akan Melunasi Tagihan Ini ?");
    if(stsConf == true){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/invoice_group/update_lunas",
            dataType : "JSON",
            type : "POST",
            data : {
                pIdGroup : idGroup,
                // pJenis : jenis
            },
            success : (res) => {
                hideLoadingCss("");

                if (res.return == 1){
                    alert(res.OUT_MSG);
                    search("load");
                    $("#detail-modal").modal("hide");
                    tableInvoiceGroup.ajax.reload();
                }else{
                    alert(res.OUT_MSG);
                }
            },
            error : () => {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
            }
        });
    }
}

function reverse_status(idMetallica, statusTracking){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/pembelian_valas_trx/update_reverse",
        dataType : "JSON",
        type : "POST",
        data : {
            pIdMetallica : idMetallica,
            pStatusTracking : statusTracking
        },
        success : (response) => {
            hideLoadingCss("");
            if (response.return == 1){
                alert(response.OUT_MSG);
                tableInvoiceGroup.ajax.reload();
            } else {
                alert(response.OUT_MSG);
            }
        },
        error : () => {
            hideLoadingCss("Gagal Melakukan Proses, Harap Hubungi Administrator");
        }
    });
}

function clearForm() {
    isUpdate = "0"
    $("#pKodeBank").val("");
    $("#pKodeBank").prop('disabled', false);
    $("#pNamaBank").val("");
}

function upload_xls(){
    $("#modal-upload-xls").modal("show");

    //getFilesRekap(pIdValas);
}

function upload_server_xls() {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    formData.append('pIdJenisFile', "2");
    console.log(formData);
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_master/upload_xls",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            console.log("res",res);
            if (res.V_RETURN == 0) {
                alert("sukses");
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_master/download/2/"+obj["ID_UPLOAD"];
            }
            initDataTable();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
        var dataRow = [];
        dataRow.push(row["NO"]);
        dataRow.push(row["HOUSE_BANK"]);
        dataRow.push(row["NO_REK_HOUSE_BANK"]);
        dataRow.push(row["COMP_CODE"]);
        dataRow.push(row["BUS_AREA"]);
        dataRow.push(row["DUE_ON"]);
        dataRow.push(row["TOTAL_TAGIHAN"]);
        dataRow.push(row["ASSIGNMENT"]);
        body.push(dataRow);
    });

    return body;
}

function checkArray(e) {
    var isNew= true;
    //console.log ("Checked : ",e);
    if($(e).is(":checked")) {
        if(fullArrayGroup.length == 0) {
            fullArrayGroup.push($(e).data("full").full);
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
            if(isNew == true){
                fullArrayGroup.push($(e).data("full").full);
            }
        }
    }
    else {
        var total = $("#table-main-detail input[type=checkbox]:checked").map(function () {
            return $(this).data("full");
        }).get().length;
        if(total == 0){
            $("#cbparent").prop('checked', false);
        }
        for (x = 0; x < fullArrayGroup.length; x++){
            let fullVal = JSON.stringify(fullArrayGroup[x]);
            let valCb2 = JSON.stringify($(e).data("full").full);
            if(fullVal == valCb2){
                fullArrayGroup.splice(x, 1);
            }
        }
    }
    console.log("Full Array : ", fullArrayGroup);
}

function getDetails(idGroup, pTglAwal, pTglAkhir,  pBank) {
    showLoadingCss()
    $(".list-data").hide();
    $(".detail-data").show();
    hideLoadingCss()
    tableDetailGroupInvoice = $('#table-main-detail').DataTable({
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
                        return full.HOUSE_BANK;
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
                        return full.TGL_RENCANA_BAYAR;
                    }
                },
                {
                    "aTargets": [60],
                    "mRender": function (data, type, full) {
                        return full.OSS_ID;
                    }
                },
                {
                    "aTargets": [61],
                    "mRender": function (data, type, full) {
                        return full.ID_GROUP;
                    }
                },
                {
                    "aTargets": [62],
                    "mRender": function (data, type, full) {
                        return full.BANK_BYR;
                    }
                },
                {
                    "aTargets": [63],
                    "mRender": function (data, type, full) {
                        return full.CURR_BAYAR;
                    }
                },
                {
                    "aTargets": [64],
                    "mRender": function (data, type, full) {
                        return full.AMOUNT_BAYAR;
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
                        return full.TGL_ACT_BAYAR;
                    }
                },
                {
                    "aTargets": [69],
                    "mRender": function (data, type, full) {
                        return full.SUMBER_DANA;
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
                {
                    "aTargets": [72],
                    "mRender": function (data, type, full) {
                        var ret_value;
                        /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                        /*    if(newRoleUser[0].includes("DIVKEU")){
                                ret_value =
                                    '<div class="btn-group">' +
                                    '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                                    '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
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
                                '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';

                            ret_value = ret_value +
                                '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                                '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                                '</div>';
                        }
                        else if(full.METODE_PEMBAYARAN == 'GIRO' || full.METODE_PEMBAYARAN == 'INTERNETBANKING'){
                            if (full.STATUS_TRACKING == "INPUT DATA" || full.STATUS_TRACKING == "VALIDASI DATA" ) {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_CASH"){
                                    ret_value ='-'
                                    //ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_IE"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-danger" title="Reject Data" onclick="reject_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-ban"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }

                            else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.ID_GROUP+'\')"><i class="fa fa-money"></i></button>';
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.ID_GROUP+'\')"><i class="fa fa-money"></i></button>';
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +

                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+full.OSS_ID+'\',\''+full.ID_GROUP+'\')"><i class="fa fa-money"></i></button>';
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }
                        }
                        else {
                            if (full.STATUS_TRACKING == "INPUT DATA" || full.STATUS_TRACKING == "VALIDASI DATA" ) {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '-';
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fa fa-arrows-alt"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_CASH"){
                                    ret_value = '-';
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_JA_IE"){
                                    ret_value = '-';
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'

                            }
                            else   if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                    ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }
                            else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = '-'
//                                     ret_value +
//                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
//                                        '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }

                            else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                                var role = newRoleUser[0];
                                ret_value =
                                    '<div class="btn-group">';
                                if(newRoleUser[0] == "ROLE_ADMIN"){
                                    ret_value = ret_value +
                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\')"><i class="fa fa-money"></i></button>';
                                        //'<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                                    ret_value = ret_value +

                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\')"><i class="fa fa-money"></i></button>';
                                        //'<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                                    ret_value = ret_value +

                                        '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\')"><i class="fa fa-money"></i></button>';
                                        //'<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                                }
                                '</div>'
                            }

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

                }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/invoice_group/get_detail",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            // pBank: pBank,
                            // pTglAwal : pTglAwal,
                            // pTglAkhir : pTglAkhir,
                            pIdGroup : idGroup
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
                    tableDetailGroupInvoice.columns.adjust();
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
                                                if (response.CUSTOMER == 1) {
                                                    api.column(32).visible(true);
                                                } else {
                                                    api.column(32).visible(false);
                                                }
                                                if (response.VENDOR == 1) {
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
                                                if (response.TGL_ACT_BAYAR == 1) {
                                                    api.column(68).visible(true);
                                                } else {
                                                    api.column(68).visible(false);
                                                }
                                                if (response.SUMBER_DANA == 1) {
                                                    api.column(69).visible(true);
                                                } else {
                                                    api.column(69).visible(false);
                                                }
                                                 if (response.PARTIAL_IND == 1) {
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
            $('.dataTables_filter').each(function () {
                             var html = '';
                             html =  '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" data-toggle="modal" title="Sembunyikan Kolom" onclick="showColumn()"><i class="fa fa-arrows-alt"></i></button>';
                            $(this).append(html);
                        });

}

function search(state) {
    if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(),$("#cmb_bank").val())
        getAllData()
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
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
            if (response.DOC_NO == 1) {
                $("#hc2").prop("checked", true);
            } else {
                $("#hc2").prop("checked", false);
            }
            if (response.DOC_DATE2 == 1) {
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
            if (response.POST_DATE2 == 1) {
                $("#hc6").prop("checked", true);
            } else {
                $("#hc6").prop("checked", false);
            }
            if (response.BASE_DATE == 1) {
                $("#hc7").prop("checked", true);
            } else {
                $("#hc7").prop("checked", false);
            }
            if (response.ENTRY_DATE2 == 1) {
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
            if (response.CUSTOMER == 1) {
                $("#hc32").prop("checked", true);
            } else {
                $("#hc32").prop("checked", false);
            }
            if (response.VENDOR == 1) {
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
                if (response.TGL_RENCANA_BAYAR == 1) {
                    $("#hc59").prop("checked", true);
                } else {
                    $("#hc59").prop("checked", false);
                }
                if (response.OSS_ID == 1) {
                    $("#hc60").prop("checked", true);
                } else {
                    $("#hc60").prop("checked", false);
                }
                if (response.GROUP_ID == 1) {
                    $("#hc61").prop("checked", true);
                } else {
                    $("#hc61").prop("checked", false);
                }
                if (response.BANK_BYR == 1) {
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
                 if (response.TGL_ACT_BAYAR == 1) {
                    $("#hc68").prop("checked", true);
                } else {
                    $("#hc68").prop("checked", false);
                }
                 if (response.SUMBER_DANA == 1) {
                    $("#hc69").prop("checked", true);
                } else {
                    $("#hc69").prop("checked", false);
                }
                 if (response.PARTIAL_IND == 1) {
                    $("#hc70").prop("checked", true);
                } else {
                    $("#hc70").prop("checked", false);
                }
                 if (response.KETERANGAN == 1) {
                    $("#hc71").prop("checked", true);
                } else {
                    $("#hc71").prop("checked", false);
                }
                 if (response.STATUS_TRACKING == 1) {
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
        "reference" : hc12 == true ? 1 : 0,
        "tgl_tagihan_diterima" : hc13 == true ? 1 : 0,
        "comp_code" : hc14 == true ? 1 : 0,
        "bus_area" : hc15 == true ? 1 : 0,
        "currency" : hc16 == true ? 1 : 0,
        "exch_rate" : hc17 == true ? 1 : 0,
        "line_item" : hc18 == true ? 1 : 0,
        "dr_cr_ind" : hc19 == true ? 1 : 0,
        "spec_gl" : hc20 == true ? 1 : 0,
        "gl_acct" : hc21 == true ? 1 : 0,
        "amt_tc" : hc22 == true ? 1 : 0,
        "amt_lc" : hc23 == true ? 1 : 0,
        "amt_with_base_tc" : hc24 == true ? 1 : 0,
        "amt_with_tc" : hc25 == true ? 1 : 0,
        "amt_with_base_lc" : hc26 == true ? 1 : 0,
        "amt_with_lc" : hc27 == true ? 1 : 0,
        "amount" : hc28 == true ? 1 : 0,
        "acct_type" : hc29 == true ? 1 : 0,
        "assignment" : hc30 == true ? 1 : 0,
        "item_text" : hc31 == true ? 1 : 0,
        "customer" : hc32 == true ? 1 : 0,
        "vendor" : hc33 == true ? 1 : 0,
        "term_pmt" : hc34 == true ? 1 : 0,
        "due_on" : hc35 == true ? 1 : 0,
        "reference_key" : hc36 == true ? 1 : 0,
        "pmt_ind" : hc37 == true ? 1 : 0,
        "trans_type" : hc38 == true ? 1 : 0,
        "spread_val" : hc39 == true ? 1 : 0,
        "pmt_block" : hc40 == true ? 1 : 0,
        "house_bank" : hc41 == true ? 1 : 0,
        "no_rek_house_bank" : hc42 == true ? 1 : 0,
        "prtnr_bank_type" : hc43 == true ? 1 : 0,
        "bank_key" : hc44 == true ? 1 : 0,
        "bank_account" : hc45 == true ? 1 : 0,
        "account_holder" : hc46 == true ? 1 : 0,
        "cost_ctr" : hc47 == true ? 1 : 0,
        "int_order" : hc48 == true ? 1 : 0,
        "wbs_num" : hc49 == true ? 1 : 0,
        "cash_code" : hc50 == true ? 1 : 0,
        "po_num" : hc51 == true ? 1 : 0,
        "po_item" : hc52 == true ? 1 : 0,
        "ref_key1" : hc53 == true ? 1 : 0,
        "ref_key2" : hc54 == true ? 1 : 0,
        "ref_key3" : hc55 == true ? 1 : 0,
        "oi_ind" : hc56 == true ? 1 : 0,
        "tpba" : hc57 == true ? 1 : 0,
        "metode_pembayaran" : hc58 == true ? 1 : 0,
        "tgl_rencana_bayar" : hc59 == true ? 1 : 0,
        "oss_id" : hc60 == true ? 1 : 0,
        "group_id" : hc61 == true ? 1 : 0,
        "bank_byr" : hc62 == true ? 1 : 0,
        "curr_bayar" : hc63 == true ? 1 : 0,
        "amount_bayar" : hc64 == true ? 1 : 0,
        "bank_benef" : hc65 == true ? 1 : 0,
        "no_rek_benef" : hc66 == true ? 1 : 0,
        "nama_benef" : hc67 == true ? 1 : 0,
        "tgl_act_bayar" : hc68 == true ? 1 : 0,
        "sumber_dana" : hc69 == true ? 1 : 0,
        "partial_ind" : hc70 == true ? 1 : 0,
        "keterangan" : hc71 == true ? 1 : 0,
        "status_tracking" : hc72 == true ? 1 : 0
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

function initCbparent() {
    $('#forcbparent').empty();
    $('#forcbparent').append("<input type=\"checkbox\" id='cbparent'> ");
    $("#cbparent").click(function(){
        var pageNumber = tableInvoiceGroup.page.info().page;
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

function openFormNew() {
    idValas = "";

    $("#pPostingDate").val("");
    $("#pDocDate").val("");
    $("#pDocNo").val("");
    $("#pReference").val("");
    $("#pCompCode").val("");
    $("#pBusArea").val("");
    $("#pCurrency").val("");
    $("#pDocHdrTxt").val("");

    // $("#pUnitAnggaran").select2("val", "");
    // $("#pSpread").val("");
    var date = new Date();
    // if(newRoleUser[0].replace(" ", "")!= "ROLE_ADMIN"){
    //     date = new Date(date.setDate(date.getDate() + addedDays));
    // }
    $('#pPostingDate').datepicker({dateFormat: 'dd/mm/yy', minDate: date});
    $('#pDocDate').datepicker({dateFormat: 'dd/mm/yy'});
     // setSelectJenisPembayaran("pJenisPemabayaran", "", "");
    // setSelectCurr("pCurrecny", "", "", "REKAP");
    // setSelectBank2("pBankTujuan", "", "TUJUAN", "", "REKAP");
    // setSelectBank("pBankPembayar", "", "PEMBAYAR", "", "REKAP");
    // setSelectPosAnggaran("pPosAnggaran","","");
    // setSelectUnitAnggaran("pUnitAnggaran","");

    // $('#pTglJatuhTempo').prop('disabled', false);
    // if(newRoleUser[0].replace(" ", "")== "ROLE_OSS"){
    //     $('#pTglJatuhTempo').prop('disabled', true);
    // }
    $('#edit-modal').modal({backdrop: 'static', keyboard: false});

}

function edit_data (idMetallica, docNo){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/invoice_group/edit_data_operasi_khusus_trx_head",
        dataType : "JSON",
        type : "GET",
        data : {
            pIdMetallica : idMetallica,
        },
        success : (res) => {
            console.log("data edit data : ",res);
            hideLoadingCss("");
            $("#pPostingDate").val("");
            $("#pDocDate").val("");
            $("#pDocNo").val("");
            $("#pReference").val("");
            $("#pCompCode").val("");
            $("#pBusArea").val("");
            $("#pCurrency").val("");
            $("#pDocHdrTxt").val("");
        }
    });
}

function ins_data() {
    showLoadingCss();
    console.log("id valas : ", idValas)
    $.ajax({
        url: baseUrl + "api_operator/pembelian_valas_trx/ins_pembelian_valas_trx",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdMetallica: idValas,
            pDocNo: $("#pDocNo").val(),
            pDocDate: $("#pDocDate").val(),
            pCompCode: $("#pCompCode").val(),
            pReference: $("#pReference").val(),
            pCurrency: $("#pCurrency").val(),
            pPostDate: $("#pPostingDate").val(),
            pBusArea: $("#pBusArea").val(),
            pDocHdrTxt: $("#pDocHdrTxt").val(),
        },
        success: function (res) {
            hideLoadingCss("");
            // var result = res.return.split(";")[0];
            console.log("Result : "+res);
            if (res == 1 ) {
                alert(res.OUT_MSG);
                search("load");
                $('#edit-modal').modal('hide');
            } else {
                alert(res.OUT_MSG);
            }
            tableInvoiceGroup.ajax.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function updLunasGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, ossId, groupId){
    var stateCrf = confirm("Anda Yakin Akan Melunasi Tagihan Ini?");
    if (stateCrf == true) {
        showLoadingCss();
        $.ajax({
            url: baseUrl + "api_operator/invoice_group/update_group_lunas_giro",
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

function group_payment(){
    if (fullArrayGroup.length <= 0){
        Swal.fire("Sorry", "Tidak dapat melakukan Pembayaran","error");
    }else{
        Swal.fire({
            title : "Anda Yakin ?",
            text : "Anda Yakin Akan Melakukan Pembayaran Tagihan Ini ?",
            icon : "warning",
            showCancelButton : true,
            confirmButtonColor : "#3085d6",
            cancelButtonColor : "#d33",
            confirmButtonText : "Ya"
        }).then(response => {
            if(response.value){
                showLoadingCss();
                $.ajax({
                    url : baseUrl + "api_operator/invoice_group/do_payment_group",
                    dataType : "JSON",
                    type : "POST",
                    data : {
                        pData : JSON.stringify(fullArrayGroup)
                    },
                    success : res => {
                        hideLoadingCss("");
                        if (res.return == 1){
                            Swal.fire(res.OUT_MSG.charAt(0).toUpperCase() + res.OUT_MSG.substring(1).toLowerCase(),'Berhasil Melakukan Payment','success');
                            tableDetailGroupInvoice.ajax.reload();
                            fullArrayGroup = new Array()
                        }else {
                            Swal.fire('Gagal',res.OUT_MSG,'error');
                        }
                    },
                    error : () => {
                        hideLoadingCss();
                        Swal.fire("Gagal Melakukan Proses, Harap Hubungi Administrator","", "error");
                        search("load");
                    }
                })
            }
        })
    }
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "api_operator/invoice_group/get_total_tagihan",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
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
    window.open(baseUrl + "api_operator/invoice_group/xls/" + tglAwal + "/" + tglAkhir + "/" + $("#cmb_bank").val() + "/" +null+ "/" +null);
}

function back(){
    $(".list-data").show();
    $(".detail-data").hide();
    tableInvoiceGroup.ajax.reload()
    tableDetailGroupInvoice.destroy();
}