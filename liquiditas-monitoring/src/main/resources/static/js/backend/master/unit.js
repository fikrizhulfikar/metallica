/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    setSelectJenisPembayaran("pJenis", "", "");
    initDataTable();
});

function submit() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/unit/ins_unit",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdUnit: $("#pIdUnit").val(),
            pNamaUnit: $("#pNamaUnit").val(),
            pIdJenisPembayaran: $("#pJenis").val(),
            pFlag: $("#pFlag").val(),
            pIsUpdate: isUpdate
        },
        success: function (res) {
            console.log("response : ", res);
            hideLoadingCss("")
            if (res.return == 1) {
                alert(res.OUT_MESSAGE);
                location.reload();
            } else {
                alert(res.OUT_MESSAGE);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}


function clearForm() {
    isUpdate = "0"
    $("#pIdUnit").val("");
    $("#pNamaUnit").val("");
    $("#pIdUnit").prop('disabled', false);
    $('#pJenis').prop('disabled', false);
}


function getbyId(id,jenis) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/unit/get_unit_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id,
            pJenis : jenis
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("get by id : ", res);
            $("#pIdUnit").val(res[0].ID_UNIT);
            $("#pNamaUnit").val(res[0].NAMA_UNIT);
            $("#pJenis").val(res[0].ID_JENIS_PEMBAYARAN);
            $("#pFlag").val(res[0].FLAG_TAMPIL);
            $("#pIdUnit").prop('disabled', true);
            $('#pJenis').prop('disabled', 'disabled');
            isUpdate = "1"
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pTenor, pketerangan) {
    showLoadingCss()
    $('#table-main tbody').empty();
    $('#table-main').dataTable().fnDestroy();
    tableMain = $('#table-main').DataTable({
        "serverSide": true,
        "aoColumnDefs": [
            {
                "bSortable": false,
                "aTargets": [0, 1, 2, 3, 4]
            }
            ,
            {
                "aTargets": [5],
                "sClass": "datatables_action-center",
                "mRender": function (data, type, full) {

                    var ret_value =
                        '<button style="width: 15px !important;" class="btn btn-info" title="Edit Data" onclick="getbyId(\'' + full.ID_UNIT + '\',\'' + full.ID_JENIS_PEMBAYARAN + '\')"><i class="fa fa-pencil"></i></button>'
                    return ret_value;

                }

            },
            {
                "aTargets": 4,
                "mRender": function (data, type, full) {
                    if (full.FLAG_TAMPIL == 1) {
                        return "TAMPIL"
                    } else {
                        return "TIDAK TAMPIL"
                    }

                }

            }
        ],
        "ajax": {
            "url": baseUrl + "api_master/unit/get_unit_pss",
            "type": "GET",
            "dataType": "json",
            "dataSrc": function (res) {
                hideLoadingCss("")
                console.log("get log : ", res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "ID_UNIT", "defaultContent": ""},
            {"data": "NAMA_UNIT", "defaultContent": ""},
            {"data": "JENIS_PEMBAYARAN", "defaultContent": ""},
            {"data": "FLAG_TAMPIL", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })

}