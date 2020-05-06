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
            $("#pUsername").val(res[0].USERNAME);
            $("#pUsername").prop('disabled', true);
            $("#pEmail").val(res[0].EMAIL);
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
            pEmail: $("#pEmail").val(),
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
    formData.append('pIdJenisFile', "9");
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
                window.location = "../api_master/download/9/"+obj["ID_UPLOAD"];
            }
            setSelectRole("pIdGroup","ALL");
            initDataTable();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function update_status(pIdGroup, pStatus) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/user/update_status",
        dataType: 'JSON',
        type: "POST",
        data: {
            p_id_group: pIdGroup,
            p_status : pStatus
        },
        success: function (res) {
            //console.log("COBA DIAZ :",res);
                    hideLoadingCss("")
                    //var result = res.return.split(";")[0];
                    //var result = res;
                    if (res.return == 1) {
                        alert(res.OUT_MESSAGE);
                        tableMain.ajax.reload();
                    } else {
                        alert(res.OUT_MSG);
                    }
                },
                error: function () {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
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
                "aTargets": [0, 1, 2, 3, 4,5,6,7]
            },
            {
                "aTargets": [8],
                "sClass": "datatables-action-center",
                "mRender": function (data, type, full) {
                    var ret_value =
                        '<button style="width: 15px !important;" class="btn btn-info" title="Edit Data" onclick="getbyId(\'' + full.USERNAME + '\')"><i class="fas fa-edit"></i></button>'+
                        '<button style="width: 15px !important;" class="btn btn-danger" title="Update" onclick="update_status(\'' + full.ID_GROUP2 + '\',\''+full.STATUS+'\')"><i class="fas fa-edit"></i></button>';
                    return ret_value;
                }

            },
            {
                "aTargets": 6,
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
            {"data": "EMAIL", "defaultContent": ""},
            {"data": "ID_GROUP2", "defaultContent": ""},
            {"data": "ID_GROUP", "defaultContent": ""},
            {"data": "JENIS", "defaultContent": ""},
            {"data": "ENABLED", "defaultContent": ""},
            {"data": "STATUS", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })



}