/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain
$(document).ready(function () {
    setSelectRole("pIdGroup","ALL");
    initDataTable();
});

function clearForm() {
    $("#pUsername").val("");
    $("#pPassword").val("");
    $("#pUsername").prop('disabled', false);
}

function getbyId(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/user/get_user_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id
        },
        success: function (res) {
            hideLoadingCss("")
            console.log("get by id : ", res);
            $("#pUsername").val(res[0].USERNAME);
            $("#pUsername").prop('disabled', true);
            // $("#pPassword").val(res[0].PASSWORD);
            $("#pIdGroup").val(res[0].ID_GROUP);
            $("#pFlag").val(res[0].ENABLED);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}


function submit() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/user/ins_user",
        dataType: 'JSON',
        type: "GET",
        data: {
            pUsername: $("#pUsername").val(),
            pPassword: $("#pPassword").val(),
            pIdGroup: $("#pIdGroup").val(),
            pFlag: $("#pFlag").val()
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

function initDataTable(pTglAwal, pTglAkhir, pBank, pCurrency, pTenor, pketerangan) {
    showLoadingCss()
    $('#table-main tbody').empty();
    $('#table-main').dataTable().fnDestroy();
    tableMain = $('#table-main').DataTable({
        "serverSide": true,
        "aoColumnDefs": [
            {
                "bSortable": false,
                "aTargets": [0, 1, 2]
            }
            ,
            {
                "aTargets": [4],
                "sClass": "datatables_action-center",
                "mRender": function (data, type, full) {

                    var ret_value =
                        '<button style="width: 15px !important;" class="btn btn-info" title="Edit Data" onclick="getbyId(\'' + full.USERNAME + '\')"><i class="fa fa-pencil"></i></button>'
                    return ret_value;

                }

            },
            {
                "aTargets": 3,
                "mRender": function (data, type, full) {
                    if (full.ENABLED == 1) {
                        return "AKTIF"
                    } else {
                        return "TIDAK AKTIF"
                    }

                }

            }
        ],
        "ajax": {
            "url": baseUrl + "api_master/user/get_user_pss",
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
            {"data": "USERNAME", "defaultContent": ""},
            {"data": "ID_GROUP", "defaultContent": ""},
            {"data": "ENABLED", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })

}