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
var jumlahidr = null;
var jumlahusd = null;
var jumlaheur = null;
var jumlahjpy = null;

$(document).ready(function () {
     $( '#pAccountBalance' ).mask('000.000.000.000.000', {reverse: true});
    $('#tanggal_awal').datepicker({dateFormat: 'dd-mm-yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
});


$("#tanggal_awal").change(function () {
    var tglAwalData = $('#tanggal_awal').val();
    if (tglAwalData == "") {
        $('#tanggal_akhir').val("");
    } else {
        $('#tanggal_akhir').attr("disabled", false);
        $('#tanggal_akhir').datepicker({dateFormat: 'dd-mm-yy', minDate: tglAwalData});
    }
});

function getAllData() {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_realisasi/get_rekap_currency",
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
            var data = res.data;
            var idr = [];
            var usd = [];
            var eur = [];
            var jpy = [];
                        $.each(data, function (key, val) {
                           //console.log("AMOUNT : "+val.AMT_TC+" CURRENCY : "+val.CURRENCY);
                           if ("IDR" == val.CURRENCY) {idr.push(Math.round(val.AMT_TC));}
                           if ("USD" == val.CURRENCY) {usd.push(Math.round(val.AMT_TC));}
                           if ("EUR" == val.CURRENCY) {eur.push(Math.round(val.AMT_TC));}
                           if ("JPY" == val.CURRENCY) {jpy.push(Math.round(val.AMT_TC));}

                        });
                        for (var i = 0, rp = 0; i < idr.length; rp += idr[i++]);
                        for (var i = 0, dolar = 0; i < usd.length; dolar += usd[i++]);
                        for (var i = 0, euro = 0; i < eur.length; euro += eur[i++]);
                        for (var i = 0, yen = 0; i < jpy.length; yen += jpy[i++]);
                        console.log("IDR : "+rp);
                        console.log("USD : "+dolar);
                        console.log("EUR : "+euro);
                        console.log("JPY : "+yen);
                        $("#total_per_idr").html(accounting.formatNumber(rp,2,".",","));
                        $("#total_per_usd").html(accounting.formatNumber(dolar,2,".",","));
                        $("#total_per_eur").html(accounting.formatNumber(euro,2,".",","));
                        $("#total_per_jpy").html(accounting.formatNumber(yen,2,".",","));
                        jumlahidr = accounting.formatNumber(rp,2,".",",")
                        jumlahusd = accounting.formatNumber(dolar,2,".",",")
                        jumlaheur = accounting.formatNumber(euro,2,".",",")
                        jumlahjpy = accounting.formatNumber(yen,2,".",",")
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
                    "searching": false,
                    bSortable: false,
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
                        {width: "20%", "targets": 0},
                        { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11] },
                        {
                            "bSortable": false,
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
                                return accounting.formatNumber(full.AMT_TC,2,".",",");

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
                }
            );
            table_rekapitulasi.on('search.dt', function () {
                var value = $('.dataTables_filter input').val();
                tempTableSearch = value;
            });

            $('.dataTables_length').each(function () {
                var html = '<label style="margin-left: 250px; cursor:default; text-align: center;"><b>REKAPITULASI REALISASI PEMBAYARAN</b><br><b>TANGGAL :</b> <a id="start_date"></a><b> s.d </b><a id="finish_date"></a><br><b>TOTAL IDR </b> <a id="total_per_idr"></a><b>, USD </b> <a id="total_per_usd"></a><b>, EUR </b> <a id="total_per_eur"></a><b>, JPY </b> <a id="total_per_jpy"></a></label>';
                $(this).append(html);
            });

            table_rekapitulasi.columns.adjust();
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
    window.open(baseUrl + "api_operator/rekap_invoice_realisasi/xlsRekap/" + tglAwal + "/" + tglAkhir + "/" + "ALL" + "/" + null + "/" + "ALL" + "/" +null+ "/" + null + "/" + jumlahidr + "/" + jumlahusd + "/" + jumlaheur + "/" + jumlahjpy);
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