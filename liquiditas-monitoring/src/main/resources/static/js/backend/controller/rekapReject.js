/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_rekapitulasi_reject;
var idValas = "";
var allData;
var tempVendor = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
$(document).ready(function () {
    $('#pTglTerimaInvoice').datepicker({dateFormat: 'dd/mm/yy', maxDate: new Date()});
    $('#tanggal_awal').datepicker({dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir').attr("disabled", "disabled");
    $('#pVendor').select2({
        width: '100%'
    });
    $('#pJenisPemabayaran').select2({
        width: '100%'
    });
    $('#pUnitPenerima').select2({
        width: '100%'
    });
    $('#pBankTujuan').select2({
        width: '100%'
    });
    setSelectBank("cmb_bank", "FILTER", "", "", "REKAP");
    setSelectCurr("cmb_currecny", "FILTER", "", "REKAP");
    setSelectJenisPembayaran("cmb_jenis_pemabayaran", "FILTER", "");
    search("load");
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
        initDataTable($("#tanggal_awal").val(), $("#tanggal_akhir").val(), $("#cmb_bank").val(), $("#cmb_currecny").val(), $("#cmb_jenis_pemabayaran").val(), '', '');
        srcTglAwal = $("#tanggal_awal").val()
        srcTglAkhir = $("#tanggal_akhir").val()
    }
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, status, statusTracking) {
    showLoadingCss();
    $('#table-rekapitulasi-reject tbody').empty();
    $('#table-rekapitulasi-reject').dataTable().fnDestroy();
    table_rekapitulasi_reject = $('#table-rekapitulasi-reject').DataTable({
            "serverSide": true,
            "oSearch": {"sSearch": tempTableSearch},
            "searching": true,
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "columnDefs": [
                {
                    "targets": [30],
                    "data": "ID_VALAS",
                    "render" : function (data, type, row, meta) {
                        var ret_value =
                            '<div class="btn-group">' +
                            '<button class="btn-reverse-data btn-ms btn-success" title="Reject" onclick="reverse_reject(\'' + data + '\')"><i class="fa fa-arrow-left"></i></button>' +
                            '</div>'
                        return ret_value;
                    }
                },
                {
                    "aTargets": [6],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.TOTAL_TAGIHAN,2,".",",");
                    }

                },
                {
                    "aTargets": [22],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.KURS_JISDOR,2,".",",");
                    }

                },
                {
                    "aTargets": [24],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.KURS_TRANSAKSI,2,".",",");
                    }

                },
                {
                    "aTargets": [25],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_PEMBAYARAN_IDR,2,".",",");
                    }

                },
                {
                    "aTargets": [17],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_SBLM_PAJAK,2,".",",");
                    }

                },
                {
                    "aTargets": [19],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_STLH_PAJAK,2,".",",");
                    }

                },
                {
                    "aTargets": [21],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_TANPA_UNDERLYING,2,".",",");
                    }

                },
                {
                    "aTargets": [20],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.NOMINAL_UNDERLYING,2,".",",");
                    }

                },
                {
                    "aTargets": [18],
                    "mRender": function (data, type, full) {
                        return full.PAJAK + "%";
                    }

                },
                {
                    "aTargets": [23],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.SPREAD,2,".",",");
                    }

                }
            ],
            "ajax": {
                "url": baseUrl + "api_operator/pembayaran/rekap_reject",
                "type": "GET",
                "dataType": "json",
                "data": {
                    pTglAwal: pTglAwal,
                    pTglAkhir: pTglAkhir,
                    pBank: pBank,
                    pCurrency: pCurrency,
                    pPembayaran: pPembayaran,
                    status : status,
                    statusTracking : statusTracking
                },
                "dataSrc": function (res) {
                    console.log("rejected", res);
                    hideLoadingCss()
                    return res.data;
                }
            },
            "columns": [
                {"data": "ROW_NUMBER", "defaultContent": ""},
                {"data": "JENIS_TAGIHAN", "defaultContent": ""},
                {"data": "ID_JENIS_PEMBAYARAN", "defaultContent": ""},
                {"data": "TGL_JATUH_TEMPO", "defaultContent": ""},
                {"data": "ID_VENDOR", "defaultContent": ""},
                {"data": "CURRENCY", "defaultContent": ""},
                {"data": "TOTAL_TAGIHAN", "defaultContent": ""},
                {"data": "ID_UNIT", "defaultContent": ""},
                {"data": "KODE_BANK_TUJUAN", "defaultContent": ""},
                {"data": "KODE_BANK_PEMBAYAR", "defaultContent": ""},
                {"data": "TGL_TERIMA_INVOICE", "defaultContent": ""},
                {"data": "TGL_TAGIHAN", "defaultContent": ""},
                {"data": "NO_TAGIHAN", "defaultContent": ""},
                {"data": "TGL_NOTDIN", "defaultContent": ""},
                {"data": "NO_NOTDIN", "defaultContent": ""},
                {"data": "COUNT_DOWN", "defaultContent": ""},
                {"data": "STATUS_VALAS", "defaultContent": ""},
                {"data": "TIPE_TRANSAKSI", "defaultContent": ""},
                {"data": "NOMINAL_SBLM_PAJAK", "defaultContent": ""},
                {"data": "PAJAK", "defaultContent": ""},
                {"data": "NOMINAL_STLH_PAJAK", "defaultContent": ""},
                {"data": "NOMINAL_UNDERLYING", "defaultContent": ""},
                {"data": "NOMINAL_TANPA_UNDERLYING", "defaultContent": ""},
                {"data": "KURS_JISDOR", "defaultContent": ""},
                {"data": "SPREAD", "defaultContent": ""},
                {"data": "KURS_TRANSAKSI", "defaultContent": ""},
                {"data": "NOMINAL_PEMBAYARAN_IDR", "defaultContent": ""},
                {"data": "CREATE_DATE", "defaultContent": ""},
                {"data": "UPDATE_DATE", "defaultContent": ""},
                {"data": "STATUS_TRACKING", "defaultContent": ""},
                {"data": "DESKRIPSI", "defaultContent": "-"},
                {"data": "ID_VALAS", "defaultContent": ""}
            ]
        }
    );
}

function reverse_reject(idValas) {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/ins_reverse_reject",
        dataType: 'JSON',
        type: "POST",
        data: {
            idValas: idValas,
        },
        success: function (res) {
            hideLoadingCss("")
            alert(res.message);
            table_rekapitulasi_reject.ajax.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

