/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var listChk = [];
var isUpdate = "0";
$(document).ready(function () {
    initDataTable();
});
function drawBox() {
    $("#pBesar").empty();
    setSelectRoleCkBox("pBesar", "USER_BESAR" ,"1");
    $("#pKecil").empty();
    setSelectRoleCkBox("pKecil", "USER_KECIL", "0");
    // $("#pPKK").empty();
    // setSelectRoleCkBox("pPKK", "USER_PKK", "0");
    $("#pDivKu").empty();
    setSelectRoleCkBox("pDivKu", "USER_DIVKU", "0");
    $("#pKasir").empty();
    setSelectRoleCkBox("pKasir", "USER_KASIR", "0");
}

function getChecked() {
    var param = [];
    $('#pBesar input:checked').each(function () {
        param.push($(this).attr('name'));
    });
    $('#pKecil input:checked').each(function () {
        param.push($(this).attr('name'));
    });
    // $('#pPKK input:checked').each(function () {
    //     param.push($(this).attr('name'));
    // });
    $('#pDivKu input:checked').each(function () {
        param.push($(this).attr('name'));
    });
    $('#pKasir input:checked').each(function () {
        param.push($(this).attr('name'));
    });
    return param.join(";");
}

function submit() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/jenis_pembayaran/ins_jenis_pembayaran",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdJenisPembayaran: $("#pIdJenisPembayaran").val(),
            pNamaJenisPembayaran: $("#pNamaJenisPembayaran").val(),
            pFlag: $("#pFlag").val(),
            pGroup: getChecked(),
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
    $('input[type=checkbox]').each(function () {
        console.log("running boy")
        listChk.push($(this).attr('id'));
    });
    isUpdate = "0"
    $("#pIdJenisPembayaran").val("");
    $("#pIdJenisPembayaran").prop('disabled', false);
    $("#pNamaJenisPembayaran").val("");
    for(var i = 0; i < listChk.length;i++){
        $( "#"+listChk[i]+"").prop( "checked", false );
    }
}

function getbyId(id) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/jenis_pembayaran/get_jenis_pembayaran_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pId: id
        },
        success: function (res) {

            $('input[type=checkbox]').each(function () {
                console.log("running boy")
                listChk.push($(this).attr('id'));
            });

            console.log("list chk : "+listChk);
            for(var i = 0; i < listChk.length;i++){
                $( "#"+listChk[i]+"").prop( "checked", false );
            }

            hideLoadingCss("")
            console.log("get by id : ", res);
            $("#pIdJenisPembayaran").val(res.return[0].ID_JENIS_PEMBAYARAN);
            $("#pIdJenisPembayaran").prop('disabled', true);
            $("#pNamaJenisPembayaran").val(res.return[0].NAMA_PEMBAYARAN);
            $("#pFlag").val(res.return[0].FLAG_TAMPIL);
            isUpdate = "1"
            for(var i = 0; i < res.OUT_GRUP_USER.length;i++){
                $( "#"+res.OUT_GRUP_USER[i].ID_GROUP+"").prop( "checked", true );
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
    formData.append('pIdJenisFile', "8");
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
                window.location = "../api_master/download/8/"+obj["ID_UPLOAD"];
            }
            initDataTable();
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
                "aTargets": [0, 1, 2, 3, 4]
            }
            ,
            {
                "aTargets": [4],
                "sClass": "datatables_action-center",
                "mRender": function (data, type, full) {

                    var ret_value =
                        '<button style="width: 15px !important;" class="btn btn-info" title="Edit Data" onclick="getbyId(\'' + full.ID_JENIS_PEMBAYARAN + '\')"><i class="fa fa-pencil"></i></button>'
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
            "url": baseUrl + "api_master/jenis_pembayaran/get_jenis_pembayaran_pss",
            "type": "GET",
            "dataType": "json",
            "dataSrc": function (res) {
                drawBox();
                hideLoadingCss("")
                console.log("get log : ", res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "ID_JENIS_PEMBAYARAN", "defaultContent": ""},
            {"data": "NAMA_PEMBAYARAN", "defaultContent": ""},
            {"data": "JENIS_PEMBAYARAN", "defaultContent": ""},
            {"data": "FLAG_TAMPIL", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })

}