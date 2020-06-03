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
var tableDetailGroupInvoice;
var tableInvoiceGroupSiapBayar;
var tableDetailGroupInvoiceSiapBayar
var srcTglAwal = "";
var srcTglAkhir = "";

$(document).ready(function () {
    initDataTable();
    $('#tanggal_awal').datepicker({dateFormat: "dd/mm/yy"});
    $('#tanggal_akhir').attr("disabled", "disabled");
    search("load");
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

    tableInvoiceGroupSiapBayar = $('#table-rekapitulasi').DataTable({
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
                {width: 100, targets: 8},
                {width: 150, targets: 9},
                {width: 150, targets: 10},
                {width: 150, targets: 11},
                {width: 150, targets: 12},
                {width: 100, targets: 13},

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
                    "aTargets": [0, 13]
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
                        return full.METODE_PEMBAYARAN;
                    }

                },
                {
                    "aTargets": [7],
                    "mRender": function (data, type, full) {
                        return full.NO_GIRO;
                    }

                },
                {
                    "aTargets": [8],
                    "mRender": function (data, type, full) {
                        return full.NO_GIRO;
                    }

                },
                {
                    "aTargets": [9],
                    "mRender": function (data, type, full) {
                        return Intl.NumberFormat().format(full.TOTAL_TAGIHAN);
                    }

                },
                {
                    "aTargets": [10],
                    "mRender": function (data, type, full) {
                        return full.ASSIGNMENT;
                    }

                },
                {
                    "aTargets": [11],
                    "mRender": function (data, type, full) {
                        return full.SUMBER_DANA;
                    }

                },
                {
                    "aTargets": [12],
                    "mRender" : (data, type, full) => {
                        return full.TGL_SIAP_BAYAR;
                    }
                },
                {
                    "aTargets": [13],
                    "mRender": function (data, type, full) {
                        var jenis = "AP INVOICE";
                        // console.log("Ini Full : ", full);
                        var ret_value;

                        if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                            return "-"
                        }
                        else if(newRoleUser[0] == "ROLE_ADMIN" ){
                            ret_value = '<div class="btn-group"><button style="width: 15px !important;" class="btn btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                '</div>';
                        }else {
                            ret_value = '<div class="btn-group"><button style="width: 15px !important;" class="btn btn-edit-data btn-sm btn-success" title="Detail" onclick="getDetails(\'' +full.ID_GROUP+'\')"><i class="fa fa-info-circle"></i></button>'+
                                '</div>';
                        }
                        return ret_value;
                    }
                }

            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/invoice_group/get_invoice_group_siap_bayar_head",
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
                    tableInvoiceGroupSiapBayar.columns.adjust();
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
        // var html = '<button class="btn-dribbble btn-info btn-sm" style="margin-left: 10px" type="button" title="Sembunyikan Kolom" data-toggle="modal" onclick="showColumn()">' +
        //     '<i class="fa fa-arrows-alt"></i></button>';
        // /*button reject*/
        // html = html + '<button class="btn-reject btn-danger btn-sm" style="margin-left: 10px" type="button" title="Reject Data" data-toggle="modal" onclick="rejectData()">' +
        //     '            <i class="fa fa-ban"></i></button>';
        // html = html + '<button class="btn-edit-data btn-sm btn-info" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openMultipleEditForm()"><i class="fas fa-edit"></i></button>';
        // html = html + '<button class="btn-edit-data btn-sm btn-success" id="btn-verified" title="Edit Data" style="margin-left: 10px" type="button" onclick="openGetBallance()"><i class="fa fa-university"></i></button>';
        // if(newRoleUser[0] != "ROLE_OSS" && newRoleUser[0] != "ROLE_DIVKEU"){
        //     html = html + '<button class="btn-verified btn-warning btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Update Data" onclick="update_datas()"><i class="fa fa-arrows-alt"></i></button>' ;
        //
        // }
        // html = html + '<button class="btn-delete btn-danger btn-sm" id="btn-verified" style="margin-left: 10px" type="button" title="Delete Data" onclick="multipleDelete()"><i class="fa fa-close"></i></button>';
        // $(this).append(html);
    });

    tableInvoiceGroup.columns.adjust();
    initCbparent();
}

function updateLunas(idMetallica, jenis){
    var stsConf = confirm("Anda Yakin Akan Melunasi Tagihan Ini ?");
    if(stsConf == true){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/pembelian_valas_trx/update_lunas",
            dataType : "JSON",
            type : "POST",
            data : {
                pIdMetallica : idMetallica,
                pJenis : jenis
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

function getDetails(idGroup) {
    showLoadingCss()
    $(".list-data").hide();
    $(".detail-data").show();
    hideLoadingCss()
    tableDetailGroupInvoiceSiapBayar = $('#table-main-detail').DataTable({
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
                {width: 200, targets: 1},
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
                // {width: 100, targets: 71},
                { className: "datatables_action", "targets": [9,23,24,25,26,27,28,29] },
                {
                    "bSortable": true,
                    "aTargets": [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70]
                },
                {
                    "sortable": false,
                    "aTargets": [0,70]
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
                        return full.BANK_BYR;
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
                        return full.GROUP_ID;
                    }
                },
                // {
                //     "aTargets": [62],
                //     "mRender": function (data, type, full) {
                //         return full.BANK_BYR;
                //     }
                // },
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
                        return full.STATUS_TRACKING;
                    }
                },
                // {
                //     "aTargets": [72],
                //     "mRender": function (data, type, full) {
                //         var ret_value;
                //         /*alert('BOOOMB2'+full.STATUS_TRACKING);*/
                //         /*    if(newRoleUser[0].includes("DIVKEU")){
                //                 ret_value =
                //                     '<div class="btn-group">' +
                //                     '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>' +
                //                     '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.ID_VALAS + '\')"><i class="fas fa-edit"></i></button>' +
                //                     '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                //                     '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                //                     '</div>'
                //             } */
                //         if (newRoleUser[0] == "ROLE_MS_LIKUIDITAS" || newRoleUser[0] == "ROLE_DM_LIKUIDITAS") {
                //             return "-"
                //         }
                //         else if(newRoleUser[0] == "ROLE_OSS" ){
                //             ret_value =
                //                 '<div class="btn-group">' +
                //                 '<button style="width: 15px !important;" class="btn-duplicate-data btn-sm btn-primary" title="Duplicate Data" onclick="duplicate_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-clone"></i></button>';
                //
                //             ret_value = ret_value +
                //                 '<button style="width: 15px !important;" class="btn-update-data btn-sm btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>' +
                //                 '<button style="width: 15px !important;" class="btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_data(\'' + full.ID_VALAS + '\')"><i class="fa fa-close"></i></button>' +
                //                 '</div>';
                //         }
                //         else if(full.METODE_PEMBAYARAN == 'GIRO' || full.METODE_PEMBAYARAN == 'INTERNETBANKING'){
                //             if (full.STATUS_TRACKING == "INPUT DATA") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_JA_CASH"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_JA_IE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //             else if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-danger" title="Reject Data" onclick="reject_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-ban"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //             else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER (giro)" onclick="update_status_giro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //
                //             else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-money"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-money"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                //                     ret_value = ret_value +
                //
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Lunas (giro)" onclick="updLunasGiro(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-money"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //         }
                //         else {
                //             if (full.STATUS_TRACKING == "INPUT DATA") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fa fa-arrows-alt"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_JA_CASH"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_JA_IE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified MAKER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\',\''+full.INQ_CUSTOMER_NAME+'\',\''+full.INQ_ACCOUNT_NUMBER+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse SAP" onclick="reverse_sap(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //
                //             }
                //             else   if (full.STATUS_TRACKING == "VERIFIED BY MAKER") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_MSB_INVESTMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_checker(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\',\''+full.NO_REK_HOUSE_BANK+'\',\''+full.HOUSE_BANK+'\',\''+full.BANK_ACCOUNT+'\')"><i class="fas fa-edit"></i></button>'+
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified Checker" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse Checker" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //             else if (full.STATUS_TRACKING == "VERIFIED BY CHECKER") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_MSB_PAYMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified APPROVER" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //
                //             else if (full.STATUS_TRACKING == "VERIFIED BY APPROVER") {
                //                 var role = newRoleUser[0];
                //                 ret_value =
                //                     '<div class="btn-group">';
                //                 if(newRoleUser[0] == "ROLE_ADMIN"){
                //                     ret_value = ret_value +
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\')"><i class="fa fa-money"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_INVESTMENT_EXPENDITURE"){
                //                     ret_value = ret_value +
                //
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\')"><i class="fa fa-money"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 if(newRoleUser[0] == "ROLE_VP_OPERATION_EXPENDITURE"){
                //                     ret_value = ret_value +
                //
                //                         '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-success" title="Do Payment" onclick="detail_data(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\')"><i class="fa fa-money"></i></button>'+
                //                         '<button style="width: 15px !important;" class= "btn-reverse-data btn-sm btn-success" title="Reverse APPROVER" onclick="reverse_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+3+'\')"><i class="fa fa-arrow-left"></i></button>';
                //                 }
                //                 '</div>'
                //             }
                //
                //             else {
                //                 ret_value =
                //                     '<div class="btn-group">' +
                //                     '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.COMP_CODE + '\',\'' + full.DOC_NO + '\',\'' + full.FISC_YEAR + '\',\'' + full.LINE_ITEM + '\')"><i class="fas fa-edit"></i></button>'+
                //                     '<button style="width: 15px !important;" class="btn-edit-data btn-sm btn-warning" title="Verified DIAZ" onclick="update_status(\'' +full.COMP_CODE+'\',\'' +full.DOC_NO+ '\',\''+full.FISC_YEAR+'\',\''+full.LINE_ITEM+'\',\''+full.KET+'\',\''+1+'\')"><i class="fa fa-arrows-alt"></i></button>'+
                //                     '<button style="width: 15px !important;" class="btn-update-data btn-ms btn-success" title="Upload" onclick="upload_file(\'' + full.ID_VALAS + '\')"><i class="fa fa-upload"></i></button>';
                //
                //                 '</div>'
                //             }
                //         }
                //         return ret_value;
                //     }
                //
                // }
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/invoice_group/get_detail_group_siap_bayar",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            pTglAwal : "",
                            pTglAkhir : "",
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
                    tableDetailGroupInvoiceSiapBayar.columns.adjust();
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
                }
        }
    );


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
        url : baseUrl + "api_operator/operasi_khusus_trx/edit_data_operasi_khusus_trx_head",
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
    tableInvoiceGroupSiapBayar.ajax.reload()
    tableDetailGroupInvoiceSiapBayar.destroy();
}