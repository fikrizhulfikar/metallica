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
    let dt = $('#tanggal_akhir').datepicker({
        dateFormat: 'dd/mm/yy',
        onSelect : (dateTo) => {
            srcTglAkhir = dateTo;
        },
        disabled:true
    });

    $(".select2").select2({
        width:"100%",
        theme : "bootstrap",
    });

    $('#tanggal_awal').datepicker({
        dateFormat: 'dd/mm/yy',
        onSelect : (dateFrom) => {
            srcTglAwal = dateFrom;
            $('#tanggal_akhir').attr("readonly", false);
            $('#tanggal_akhir').attr("required", true);
            dt.datepicker("option","minDate",dateFrom);
            dt.datepicker("option","disabled",false);
        }
    });
    $('#tanggal_akhir').attr("readonly", "readonly");
    search("load");
    setSelectFilterBank("cmb_bank", "FILTER", "ALL", "", "REKAP");
    // setSelectMetodeBayar("cmb_cara_pembayaran", "FILTER", "", "", "REKAP");
    // setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");

    $('#check_all').change(function() {
        if($(this).is(':checked')){
            checkAllColumn(true);
        } else {
            checkAllColumn(false);
        }
    });
});

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
    if (srcTglAwal !== "" && srcTglAwal !== null) {
        tglAwal = srcTglAwal
    }
    var tglAkhir = "null";
    if (srcTglAwal !== "" && srcTglAwal !== null) {
        tglAkhir = srcTglAkhir
    }
    window.open(baseUrl + "api_invoice_pilot/hrap_invoice/xls/invoice/" + tglAwal.replaceAll("/","-") + "/" + tglAkhir.replaceAll("/","-") + "/" + $("#cmb_currecny").val() + "/" + $("#cmb_cara_pembayaran").val() + "/" + $("#cmb_bank").val());
}

function search(state) {
        if ($("#tanggal_akhir").val() == "" && state != "load" && $("#tanggal_awal").val() != "") {
            alert("Mohon Lengkapi Tgl Akhir");
        } else {
            initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_cara_pembayaran").val(), $("#cmb_status_tracking").val())
            // getAllData();
            // if((srcTglAwal === null || srcTglAwal === "")){
            //     srcTglAwal = moment().format("DD/MM/YYYY");
            // }
            // if((srcTglAkhir === null || srcTglAkhir === "")){
            //     srcTglAkhir = moment().format("DD/MM/YYYY");
            // }
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
                        { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                        {
                            "bSortable": true,
                            "visible" : true,
                            "aTargets": []
                        },
                        {
                            "sortable": false,
                            "aTargets": []
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
                            "name" : "DOC_HDR_TXT",
                            "mRender": function (data, type, full) {
                                return full.DOC_HDR_TXT;
                            }

                        },
                        {
                            "aTargets": [12],
                            "name" : "CURRENCY",
                            "mRender": function (data, type, full) {
                                return full.CURRENCY;
                            }

                        },
                        {
                            "aTargets": [13],
                            "name" : "CURR_BAYAR",
                            "mRender": function (data, type, full) {
                                return full.CURR_BAYAR;
                            }

                        },
                        {
                            "aTargets": [14],
                            "name" : "EXCH_RATE",
                            "mRender": function (data, type, full) {
                                return full.EXCH_RATE;
                            }

                        },
                        {
                            "aTargets": [15],
                            "name" : "PMT_IND",
                            "mRender": function (data, type, full) {
                                return full.PMT_IND;
                            }
                        },
                        {
                            "aTargets": [16],
                            "name" : "TRANS_TYPE",
                            "mRender": function (data, type, full) {
                                return full.TRANS_TYPE;
                            }
                        },
                        {
                            "aTargets": [17],
                            "name" : "SPREAD_VAL",
                            "mRender": function (data, type, full) {
                                return full.SPREAD_VAL;
                            }
                        },
                        {
                            "aTargets": [18],
                            "name" : "LINE_ITEM",
                            "mRender": function (data, type, full) {
                                return full.LINE_ITEM;
                            }
                        },
                        {
                            "aTargets": [19],
                            "name" : "BUS_AREA",
                            "mRender": function (data, type, full) {
                                return full.BUS_AREA;
                            }
                        },
                        {
                            "aTargets": [20],
                            "name" : "AMT_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_LC,2,".",",");
                                // return full.AMT_LC;
                            }
                        },
                        {
                            "aTargets": [21],
                            "name" : "AMT_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_TC,2,".",",");
                                // return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [22],
                            "name" : "AMT_WITH_BASE_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_TC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [23],
                            "name" : "AMT_WITH_TC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_TC,2,".",",");
                            }
                        },

                        {
                            "aTargets": [24],
                            "name" : "AMOUNT",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT,2,".",",");
                            }

                        },
                        {
                            "aTargets": [25],
                            "name" : "AMOUNT_BAYAR",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMOUNT_BAYAR,2,".",",");
                            }
                        },
                        {
                            "aTargets": [26],
                            "name" : "ASSIGNMENT",
                            "mRender": function (data, type, full) {
                                return full.ASSIGNMENT;
                            }
                        },
                        {
                            "aTargets": [27],
                            "name" : "ITEM_TEXT",
                            "mRender": function (data, type, full) {
                                return full.ITEM_TEXT;
                            }
                        },
                        {
                            "aTargets": [28],
                            "name" : "CUSTOMER_NAME",
                            "mRender": function (data, type, full) {
                                return full.CUSTOMER;
                            }
                        },
                        {
                            "aTargets": [29],
                            "name" : "VENDOR_NAME",
                            "mRender": function (data, type, full) {
                                return full.VENDOR;
                            }
                        },
                        {
                            "aTargets": [30],
                            "name" : "PMT_BLOCK",
                            "mRender": function (data, type, full) {
                                return full.PMT_BLOCK;
                            }
                        },
                        {
                            "aTargets": [31],
                            "name" : "HOUSE_BANK",
                            "mRender": function (data, type, full) {
                                return full.BANK_BYR;
                            }
                        },
                        {
                            "aTargets": [32],
                            "name" : "NO_REK_HOUSE_BANK",
                            "mRender": function (data, type, full) {
                                return full.NO_REK_HOUSE_BANK;
                            }
                        },
                        {
                            "aTargets": [33],
                            "name" : "PRTNR_BANK_TYPE",
                            "mRender": function (data, type, full) {
                                return full.PRTNR_BANK_TYPE;
                            }
                        },
                        {
                            "aTargets": [34],
                            "name" : "BANK_KEY",
                            "mRender": function (data, type, full) {
                                return full.BANK_KEY;
                            }
                        },
                        {
                            "aTargets": [35],
                            "name" : "BANK_ACCOUNT",
                            "mRender": function (data, type, full) {
                                return full.BANK_ACCOUNT;
                            }
                        },
                        {
                            "aTargets": [36],
                            "name" : "ACCOUNT_HOLDER",
                            "mRender": function (data, type, full) {
                                return full.ACCOUNT_HOLDER;
                            }
                        },
                        {
                            "aTargets": [37],
                            "name" : "NAMA_BENEF",
                            "mRender": function (data, type, full) {
                                return full.NAMA_BENEF;
                            }
                        },
                        {
                            "aTargets": [38],
                            "name" : "NO_REK_BENEF",
                            "mRender": function (data, type, full) {
                                return full.NO_REK_BENEF;
                            }
                        },
                        {
                            "aTargets": [39],
                            "name" : "BANK_BENEF",
                            "mRender": function (data, type, full) {
                                return full.BANK_BENEF;
                            }
                        },
                        {
                            "aTargets": [40],
                            "name" : "CASH_CODE",
                            "mRender": function (data, type, full) {
                                return full.CASH_CODE;
                            }
                        },
                        {
                            "aTargets": [41],
                            "name" : "DR_CR_IND",
                            "mRender": function (data, type, full) {
                                return full.DR_CR_IND;
                            }
                        },
                        {
                            "aTargets": [42],
                            "name" : "PARTIAL_IND",
                            "mRender": function (data, type, full) {
                                return full.PARTIAL_IND;
                            }
                        },
                        {
                            "aTargets": [43],
                            "name" : "AMT_WITH_BASE_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_BASE_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [44],
                            "name" : "AMT_WITH_LC",
                            "mRender": function (data, type, full) {
                                return accounting.formatNumber(full.AMT_WITH_LC,2,".",",");
                            }
                        },
                        {
                            "aTargets": [45],
                            "name" : "TGL_TAGIHAN_DITERIMA",
                            "mRender": function (data, type, full) {
                                return full.TGL_TAGIHAN_DITERIMA;
                            }
                        },
                        {
                            "aTargets": [46],
                            "name" : "TGL_RENCANA_BAYAR",
                            "mRender": function (data, type, full) {
                                return full.TGL_RENCANA_BAYAR;
                            }
                        },
                        {
                            "aTargets": [47],
                            "name" : "SUMBER_DANA",
                            "mRender": function (data, type, full) {
                                return full.SUMBER_DANA;
                            }
                        },
                    ],
                    "ajax":
                        {
                            "url":
                                baseUrl + "api_invoice_pilot/hrap_invoice/get_list_invoice",
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
                                }
                            ,
                            "dataSrc":

                                function (res) {
                                    hideLoadingCss();
                                    console.log("cok : ",res);
                                    let totaltagihan = 0;
                                    let arr = res.data;
                                    arr.forEach(function (val, key) {
                                        if(val.AMOUNT){
                                            totaltagihan += parseFloat(val.AMOUNT);
                                        }
                                    });
                                    $("#total_tagihan").html(accounting.formatNumber(totaltagihan.toString(), 2, '.', ','));
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
                        },
                    "initComplete": function(settings, json) {
                        var api = this.api();

                        // $.ajax({
                        //     url: baseUrl + "api_operator/rekap_invoice_belum/get_column",
                        //     dataType: 'JSON',
                        //     type: "GET",
                        //     success: function (res) {
                        //         var response = res.data[0];
                        //         for (const prop in response){
                        //             api.column(`${prop}:name`).visible(false);
                        //         }
                        //     },
                        //     error: function () {
                        //         hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
                        //     }
                        // });
                    },
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

//             $('.dataTables_filter').each(function () {
//                  var html = '<button class="btn btn-info btn-sm" style="margin-left: 10px" type="button" data-toggle="modal" title="Tampilkan Kolom" onclick="showColumn()"><i class="fas fa-columns"></i></button>';
//
//                  if(newRoleUser[0] == "ROLE_VERIFIKATOR"){
//                     // html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
// //                    html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fa fa-university"></i></button>';
//                  }
//                  if(newRoleUser[0] == "ROLE_ADMIN"){
//                    // html = html + '<button class="btn btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
//                    //      '<i class="fa fa-arrows-alt"></i></button>';
//                     /*button reject*/
//                     html = html + '<button class="btn btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="far fa-edit"></i></button>';
//                     html = html + '<button class="btn btn-sm btn-primary" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-folder"></i></button>';
//                     html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//                     html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
//                     html = html + '<button class="btn btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fas fa-trash"></i></button>';
//                     html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Approve" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
//                     html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
//                     html = html + '<button class="btn btn-siapbayar btn-ready btn-sm" id="btn-siapbayar" style="margin-left: 5px" type="button" title="Siap Bayar" onclick="siap_bayar_multiple()"><i class="fas fa-money-check"></i></button>' ;
//                     html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-xls-cms" style="margin-left: 10px" type="button" title="Cetak XLS CMS" onclick="exportXlsCms()"><i class="fas fa-print"></i></button>' ;
//                  }
//                  else if(newRoleUser[0] == "ROLE_JA_IE"){
//
//                      html = html + '<button class="btn btn-sm btn-primary" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-folder"></i></button>';
//                      html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//                      html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
//                      html = html + '<button class="btn btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="far fa-edit"></i></button>';
//                      html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Approve" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
//                      html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-bukti-kas" style="margin-left: 10px" type="button" title="Cetak Dokumen Pegantar" onclick="cetakBuktiKasMultiple()"><i class="fas fa-copy"></i></button>' ;
//                      html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
//                  }else if(newRoleUser[0] == "ROLE_JA_CASH"){
//
//                      html = html + '<button class="btn btn-sm btn-primary" id="btn-verified" title="Cek Group" style="margin-left: 10px" type="button" onclick="checkGroup()"><i class="fas fa-folder"></i></button>';
//                      html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//                      html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
//                      html = html + '<button class="btn btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="far fa-edit"></i></button>';
//                      html = html + '<button class="btn btn-verified btn-sm btn-warning" id="btn-verified" style="margin-left: 10px" type="button" title="Approve" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
//                      html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-bukti-kas" style="margin-left: 10px" type="button" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasMultiple()"><i class="fas fa-copy"></i></button>' ;
//                      html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
// //                     html = html + '<button class="btn btn-reverse-sap btn-default btn-sm" id="btn-restitusi" style="margin-left: 10px" type="button" title="Cetak Dok Restitusi" onclick="cetakRestitusi()"><i class="fas fa-people-carry"></i></button>';
//                      html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-xls-cms" style="margin-left: 10px" type="button" title="Cetak XLS CMS" onclick="exportXlsCms()"><i class="fas fa-print"></i></button>' ;
//                  }
//                 else {
//                     if (newRoleUser[0] !== "ROLE_OSS"){
//                         html = html + '<button class="btn btn-sm btn-success" id="btn-verified" title="Get Balance" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
//                     }
//                     if(
//                         newRoleUser[0].includes("MSB") || newRoleUser[0].includes("VP")
//                     ){
//                         html = html + '<button class="btn btn-siapbayar btn-ready btn-sm" id="btn-siapbayar" style="margin-left: 5px" type="button" title="Siap Bayar" onclick="siap_bayar_multiple()"><i class="fas fa-money-check"></i></button>' ;
//                         html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 5px" type="button" title="Approve" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
//                         html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
//                     }else if(newRoleUser[0] === "ROLE_EXECUTIVE_VICE_PRESIDENT"){
//                         html = html + '<button class="btn btn-siapbayar btn-ready btn-sm" id="btn-siapbayar" style="margin-left: 5px" type="button" title="Siap Bayar" onclick="siap_bayar_multiple()"><i class="fas fa-money-check"></i></button>' ;
//                         html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 5px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
//                         // html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
//                         html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
//                     }else {
//                         html = html + '<button class="btn btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 5px" type="button" title="Update Data" onclick="update_datas()"><i class="fas fa-check-circle"></i></button>' ;
//                         html = html + '<button class="btn btn-reverse-sap btn-danger btn-sm" id="btn-reverse-sap" style="margin-left: 10px" type="button" title="Reverse SAP" onclick="multipleReverseSap()"><i class="fas fa-arrow-left"></i></button>';
//                         html = html + '<button class="btn btn-verified btn-elementary btn-sm" id="btn-cetak-bukti-kas" style="margin-left: 10px" type="button" title="Cetak Dokumen Pengantar" onclick="cetakBuktiKasMultiple()"><i class="fas fa-copy"></i></button>' ;
//                         html = html + '<button class="btn btn-sm btn-danger" id="btn-verified" title="Payment Status" style="margin-left: 10px" type="button" onclick="openGetPaymentStatus()"><i class="fas fa-question"></i></button>';
//                     }
//                 }
//                 $(this).append(html);
//             });

            table_rekapitulasi.columns.adjust();

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
