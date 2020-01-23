/**
 * Created by israjhaliri on 8/23/17.
 */
var tableMain;
var isUpdate = "0";
$(document).ready(function () {
    initDataTable();
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
    var kd = $("#pKodeBankDetail").val();
    var nama = $("#pNamaBankDetail").val();
    var flag = $("#pFlagDetail").val();
    if (kd == "" || nama == "") {
        alert("Mohon Lengkapi Data")
    } else {

        $("#table-main-detail tbody").find("tr").each(function (index) {
            var temphtml = $(this).find('td').toArray();
            if($(temphtml[0]).html() == "No Data"){
                $(this).remove()
            }
        });

        var sts = "";
        flag == 1 ? sts = 'TAMPIL' : sts = 'TIDAK TAMPIL'
        var html = "<tr>" +
            "<td>" + kd + "</td>" +
            "<td>" + nama + "</td>" +
            "<td>" + Bank.pJenis + "</td>" +
            "<td>" + sts + "</td>" +
            "<td align='center'> <a href='javascript: void(0)'  class='dele'><span class='fa fa-trash'></span></a></td>'";

        $("#table-main-detail tbody").append(html);
    }

    $("#pKodeBankDetail").val("");
    $("#pNamaBankDetail").val("");

    dele()


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


var Bank = "";
function getDetails(id, jenis) {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/bank/get_bank_valas_byid",
        dataType: 'JSON',
        type: "GET",
        data: {
            pKodeBank: id,
            pJenis: jenis
        },
        success: function (res) {
            $(".list-data").hide();
            $(".detail-data").show();
            hideLoadingCss()
            console.log("get detail : ", res);

            Bank = {
                pKdBank: res.return[0].KODE_BANK,
                pNamaBank: res.return[0].NAMA_BANK,
                pJenis: res.return[0].JENIS,
                pFLag: res.return[0].FLAG_TAMPIL,
                bankDetails: null
            }


            if(res.OUT_CHILD.length > 0){
                $("#table-main-detail tbody").empty()
                $.each(res.OUT_CHILD, function( index, val ) {

                    var lblFlag = "TAMPIL";
                    if(val.FLAG_TAMPIL == 0){
                        lblFlag = "TIDAK TAMPIL"
                    }

                    var html = "<tr>" +
                    "<td>"+val.KODE_BANK+"</td>"+
                    "<td>"+val.NAMA_BANK+"</td>"+
                    "<td>"+val.JENIS+"</td>"+
                    "<td>"+lblFlag+"</td>"+
                    "<td align='center'> <a href='javascript: void(0)'  class='dele'><span class='fa fa-trash'></span></a></td>'";

                    $("#table-main-detail tbody").append(html)
                });
            }
            // else{
            //     var html = "<tr>" +
            //     "<td align='center' colspan='5'>No Data</td>"+
            //     "</tr>";
            //
            //     $("#table-main-detail tbody").append(html)
            // }
            dele()


        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });


}

function submitChild() {
    dataList = []
    $("#table-main-detail tbody").find("tr").each(function (index) {
        var temphtml = $(this).find('td').toArray();
        var pStsflag = "";
        if($(temphtml[3]).html() == "TAMPIL"){
            pStsflag = 1
        }else{
            pStsflag = 0
        }
        var prm = {
            pKdBank: $(temphtml[0]).html(),
            pNamaBank: $(temphtml[1]).html(),
            pJenis: Bank.pJenis,
            pFLag: pStsflag
        };
        dataList.push(prm);
    });

    Bank.bankDetails = dataList;
    console.log("bank : ",Bank);
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/bank/ins_bank_valas",
        contentType : "application/json",
        dataType : 'json',
        type: "POST",
        data: JSON.stringify(Bank),
        success: function (res) {
            console.log("response : ", res);
            hideLoadingCss()
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

function submit() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_master/bank/ins_bank",
        dataType: 'JSON',
        type: "GET",
        data: {
            pKodeBank: $("#pKodeBank").val(),
            pNamaBank: $("#pNamaBank").val(),
            pJenis: $("#pJenis").val(),
            pFlag: $("#pFlag").val(),
            pIsUpdate: isUpdate
        },
        success: function (res) {
            console.log("response : ", res);
            hideLoadingCss()
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

                    var btnDet = ''
                    if (full.JENIS == "PENGIRIM" || full.JENIS == "PENERIMA") {
                        btnDet = '<button style="width: 15px !important;" class="btn btn-info" title="Tambah Child" onclick="getDetails(\'' + full.KODE_BANK + '\',\'' + full.JENIS + '\')"><i class="fa fa-search"></i></button>'
                    } else {
                        btnDet = ''
                    }

                    var ret_value =
                        '<div class="btn-group">' +
                        '<button style="width: 15px !important;" class="btn btn-primary" title="Edit Data" onclick="getbyId(\'' + full.KODE_BANK + '\')"><i class="fa fa-pencil"></i></button>' +
                        btnDet +
                        '</div>'
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
            "url": baseUrl + "api_master/bank/get_bank_pss",
            "type": "GET",
            "dataType": "json",
            "dataSrc": function (res) {
                hideLoadingCss()
                console.log("get log : ", res);
                return res.data;
            }
        },
        "columns": [
            {"data": "ROW_NUMBER", "defaultContent": ""},
            {"data": "KODE_BANK", "defaultContent": ""},
            {"data": "NAMA_BANK", "defaultContent": ""},
            {"data": "JENIS", "defaultContent": ""},
            {"data": "FLAG_TAMPIL", "defaultContent": ""}
        ],
        "drawCallback": function (settings) {
            $('th').removeClass('sorting_asc');
            $('th').addClass('th-middle');
        }
    })

}