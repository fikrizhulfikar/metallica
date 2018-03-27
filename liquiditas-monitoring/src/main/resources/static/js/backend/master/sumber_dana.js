/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    initDataTable();
});

function submit() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/sumber_dana/ins_sumber_dana",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdSumberDana: $("#pIdSumberDana").val(),
            pNama: $("#pNama").val(),
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
    $("#pIdSumberDana").val("");
    $("#pIdSumberDana").prop('disabled', false);
    $("#pNama").val("");
}



function getbyId(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/sumber_dana/get_sumber_dana_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("get by id : ", res);
            $("#pIdSumberDana").val(res[0].ID_SUMBER_DANA);
            $("#pNama").val(res[0].NAMA);
            $("#pFlag").val(res[0].FLAG_TAMPIL);
            $("#pIdSumberDana").prop('disabled', true);
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
                "aTargets": [4],
                "sClass": "datatables_action-center",
                "mRender": function (data, type, full) {

                    var ret_value =
                        '<button style="width: 15px !important;" class="btn btn-info" title="Edit Data" onclick="getbyId(\'' + full.ID_SUMBER_DANA + '\')"><i class="fa fa-pencil"></i></button>'
                    return ret_value;

                }

            },
            {
                "aTargets": 3,
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
            "url": baseUrl + "api_master/sumber_dana/get_sumber_dana_pss",
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
            {"data": "ID_SUMBER_DANA", "defaultContent": ""},
            {"data": "NAMA", "defaultContent": ""},
            {"data": "FLAG_TAMPIL", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })

}