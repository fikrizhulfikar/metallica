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
        url: baseUrl + "api_master/keterangan/ins_ket",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdKeterangan: $("#pIdKeterangan").val(),
            pNama: $("#pNama").val(),
            pFlag: $("#pFlag").val(),
            pJenis: $("#pJenis").val(),
            pIsUpdate: isUpdate
        },
        success: function (res) {
            // console.log("response : ", res);
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
    $("#pIdKeterangan").val("");
    $("#pIdKeterangan").prop('disabled', false);
    $("#pNama").val("");
}

function getbyId(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/keterangan/get_ket_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id
        },
        success: function (res) {
            hideLoadingCss("")
            // console.log("get by id : ", res);
            $("#pIdKeterangan").val(res[0].ID_KETERANGAN);
            $("#pIdKeterangan").prop('disabled', true);
            $("#pNama").val(res[0].NAMA);
            $("#pFlag").val(res[0].FLAG_TAMPIL);
            $("#pJenis").val(res[0].JENIS);
            isUpdate = "1"
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
    formData.append('pIdJenisFile', "7");
    // console.log(formData);
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
               location.reload();
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                window.location = "../api_master/download/7/"+obj["ID_UPLOAD"];
                search("load");
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
                "aTargets": [0, 1, 2, 3, 4, 5]
            }
            ,
            {
                "aTargets": [5],
                "sClass": "datatables_action-center",
                "mRender": function (data, type, full) {

                    var ret_value =
                        '<button style="width: 15px !important;" class="btn btn-info" title="Edit Data" onclick="getbyId(\'' + full.ID_KETERANGAN + '\')"><i class="fas fa-edit"></i></button>'
                    return ret_value;

                }

            },
            {
                "aTargets": 3,
                "mRender": function (data, type, full) {
                    if (full.JENIS == 1) {
                        return "CALL SPREAD OPTION"
                    } else {
                        return "DEPOSITO"
                    }

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
            "url": baseUrl + "api_master/keterangan/get_ket_pss",
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
            {"data": "ID_KETERANGAN", "defaultContent": ""},
            {"data": "NAMA", "defaultContent": ""},
            {"data": "FLAG_TAMPIL", "defaultContent": ""},
            {"data": "JENIS", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })

}