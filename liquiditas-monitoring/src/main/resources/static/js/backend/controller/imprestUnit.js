/**
 * Created by Mr.Diaz on 31/10/19.
 */
var table_imprest_unit;
var table_imprest_unit_header;
var today = new Date();
var idValas = "";
var allData;
var tempVendor = "";
var tempBankPembayar = "";
var tempBankAccount = "";
var tempUnit = "";
var tempTableSearch = "";
var idImprest = "";

var checkedArray = [];
var cbParentArray = [];
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;
var periode_dropping = null;

$(document).ready(function () {
    let dd = String(today.getDate()).padStart(2,'0');
    let mm = String(today.getMonth() + 1).padStart(2,'0');
    let yyyy = today.getFullYear();

    today = dd+'/'+mm+'/'+yyyy;
    $('#tgl_imprest').html(today)
    $('#periode_dropping').datepicker({
        dateFormat: 'dd/mm/yy',
        maxDate : '0'
    });

    $("#tglAwal").datepicker({dateFormat: 'dd/mm/yy'});
    $("#tglAKhir").prop("disabled",true);

    search("load");
});

$("#tglAwal").change(function () {
    var tglAwalData = $('#tglAwal').val();
    if (tglAwalData == "") {
        alert("Tanggal awal belum di tentukan");
        $('#tglAKhir').val("");
    } else {
        $('#tglAKhir')
            .attr("disabled", false)
            .val("")
            .datepicker("destroy")
            .datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function search(state) {
    if(state === "search"){
        let tgl = $('#periode_dropping').val();
        today = tgl;
        $('#tgl_imprest').html(tgl);
        initHeaderTable($("#tglAwal").val(), $("#tglAKhir").val());
        periode_dropping = $("#periode_dropping").val();
    }
    else {
        initHeaderTable($("#tglAwal").val(), $("#tglAKhir").val());
        periode_dropping = $("#periode_dropping").val();
    }
}

function initHeaderTable(tglAwal, tglAkhir){
    showLoadingCss();
    $('#table_imprest_unit_header').dataTable().fnDestroy();
    table_imprest_unit_header = $("#table_imprest_unit_header").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": true,
        "ordering": false,
        "scrollCollapse": true,
        "paging": true,
        "bLengthChange": true,
        "aoColumnDefs": [
            {width: 17, targets: 0, className: 'dt-body-center'},
            {width: 100, targets: 1,className: 'dt-body-center'},
            {width: 100, targets: 2,className: 'dt-body-center'},
            {width: 100, targets: 3,className: 'dt-body-center'},
            {width: 100, targets: 4,className: 'dt-body-center'},
            {width: 10, targets: 5,className: 'dt-body-center'},
            {className: "datatables_action", "targets": [0,1,2,3,4,5]},
            {
                "aTargets": [0],
                "mRender": function (data, type, full) {
                    return full.ROW_NUMBER;
                },
            },
            {
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.NAMA_FORM;
                },
            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.TGL_DI_BUAT;
                },

            },
            {
                "data": null,
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return full.TGL_JATUH_TEMPO;
                },
            },
            {
                "data": null,
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return full.STATUS_APPROVE;
                },
            },

            {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    var ret_value = '<div class="btn-group">' +
                        '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-success" title="Detail Data" onclick="detail_data(\'' + full.NAMA_FORM + '\',\'' + full.STATUS_APPROVE + '\',\'' + full.TGL_JATUH_TEMPO + '\')"><i class="fa fa-info-circle"></i></button>';
                    if (full.STATUS_APPROVE === "INPUT DATA"){
                        if(newRoleUser[0] === "ROLE_ADMIN" ){
                           ret_value = ret_value +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Verifikasi" onclick="update_status_imprest(\'' + full.NAMA_FORM + '\',1, \''+full.FLAGGING_VALIDASI+'\', \''+ full.TGL_JATUH_TEMPO+ '\')"><i class="fas fa-check-circle"></i></button>' +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-info" title="Edit Data" onclick="edit_data(\'' + full.NAMA_FORM + '\')"><i class="far fa-edit"></i></button>'+
                                '<button style="width: 15px !important;" class="btn btn-delete-data btn-sm btn-danger" title="Delete" onclick="delete_header_imprest(\'' + full.NAMA_FORM + '\')"><i class="fas fa-trash"></i></button>' +
                                '</div>';
                        }
                    }
                    if (full.STATUS_APPROVE === "VERIFIKASI STAFF"){
                        if(newRoleUser[0] === "ROLE_ADMIN" ){
                            ret_value = ret_value +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Verifikasi" onclick="update_status_imprest(\'' + full.NAMA_FORM + '\',2,\''+full.FLAGGING_VALIDASI+'\', \''+ full.TGL_JATUH_TEMPO+ '\')"><i class="fas fa-check-circle"></i></button>' +
                                '<button type="button" style="width: 15px !important;" class="btn btn btn-sm btn-elementary" title="Reverse Checker" onclick="reverse_imprest_data(\'' +full.NAMA_FORM+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                '</div>';
                        }
                        if(newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"){
                            ret_value = ret_value +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Verifikasi" onclick="update_status_imprest(\'' + full.NAMA_FORM + '\',2, \''+full.FLAGGING_VALIDASI+'\', \''+ full.TGL_JATUH_TEMPO+ '\')"><i class="fas fa-check-circle"></i></button>' +
                                '<button type="button" style="width: 15px !important;" class="btn btn btn-sm btn-elementary" title="Reverse Checker" onclick="reverse_imprest_data(\'' +full.NAMA_FORM+'\',\''+1+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                '</div>';
                        }
                    }
                    if (full.STATUS_APPROVE === "VERIFIKASI MSB PE"){
                        if(newRoleUser[0] === "ROLE_ADMIN" ){
                            ret_value = ret_value +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Verifikasi" onclick="update_status_imprest(\'' + full.NAMA_FORM + '\', 3, \''+full.FLAGGING_VALIDASI+'\', \''+ full.TGL_JATUH_TEMPO+ '\')"><i class="fas fa-check-circle"></i></button>' +
                                '<button type="button" style="width: 15px !important;" class="btn btn btn-sm btn-elementary" title="Reverse Checker" onclick="reverse_imprest_data(\'' +full.NAMA_FORM+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                '</div>';
                        }
                        if(newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"){
                            ret_value = ret_value +
                                '<button style="width: 15px !important; margin-right: 5px;" class="btn btn-sm btn-warning" title="Verifikasi" onclick="update_status_imprest(\'' + full.NAMA_FORM + '\', 3, \''+full.FLAGGING_VALIDASI+'\', \''+ full.TGL_JATUH_TEMPO+ '\')"><i class="fas fa-check-circle"></i></button>' +
                                '<button type="button" style="width: 15px !important;" class="btn btn btn-sm btn-elementary" title="Reverse Checker" onclick="reverse_imprest_data(\'' +full.NAMA_FORM+'\',\''+2+'\')"><i class="fa fa-arrow-left"></i></button>'+
                                '</div>';
                        }
                    }
                    //else if(status === "VERIFIKASI STAFF"){
                    //     if (newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"){
                    //         html = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_imprest_data(2)" title="Approve" ><i class="fas fa-check-square"></i></button>';
                    //         html += '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_imprest_data(1)" title="Reverse"><i class="fas fa-backspace"></i></button>';
                    //     }
                    // }else if(status === "VERIFIKASI MSB PE"){
                    //     if (newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"){
                    //         html = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_imprest_data(3)" title="Approve" ><i class="fas fa-check-square"></i></button>';
                    //         html += '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_imprest_data(2)" title="Reverse"><i class="fas fa-backspace"></i></button>';
                    //     }
                    // }else{
                    //     if (newRoleUser[0] === "ROLE_ADMIN" || newRoleUser[0] === "ROLE_JA_CASH" || newRoleUser[0] === "ROLE_JA_IE"){
                    //         html = '<button class="btn btn-success btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="upload_xls()" title="Upload Excel" ><i class="fas fa-file-upload"></i></button>';
                    //     }
                    // }
                    return ret_value;
                },
            },
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/kebutuhan_imprest_unit/get_imprest_header",
                "type":
                    "GET",
                "dataType":
                    "json",
                "data":
                    {
                        pTglAwal: tglAwal,
                        pTglAkhir: tglAkhir,
                        length : '10'
                    }
                ,
                "dataSrc":
                    function (res) {
                        hideLoadingCss();
                        return res.data;
                    }
            }
    });
}

function upload_xls(id, status, jt){
    $("#modal-upload-xls").modal("show");
    $('input[name=idForm]#idForm').val(id);
    $('input[name=status]#status').val(status);
    $('input[name=jt]#jt').val(jt);

}

function upload_server_xls() {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
    formData.append("idForm", $('input[name=idForm]#idForm').val());
    fileSize = $('input[type=file]#file-xls')[0].files[0].size / 1000;
    $("#file-xls").val('');
    $.ajax({
        crossOrigin: true,
        type: "POST",
        url: baseUrl + "api_operator/kebutuhan_imprest_unit/upload_xls_imprest",
        data: formData,
        enctype: 'multipart/form-data',
        cache: false,
//        for jquery 1.6
        contentType: false,
        processData: false,
        success: function (res) {
            hideLoadingCss("");
            if (res.return == 1) {
                alert("Berhasil Upload Data");
                detail_data($('input[name=idForm]#idForm').val(), $('input[name=status]#status').val(), $('input[name=jt]#jt').val());
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function delete_detail_imprest(id, status, jt){
    if(!table_imprest_unit.data().any()){
        alert("Detail Masih Kosong!");
    }else{
        let delConfirm = confirm("Apakah Anda yakin akan menghapus detail data "+id+" ?");
        if (delConfirm){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/kebutuhan_imprest_unit/delete_imprest",
                type : "POST",
                data : {
                    pIdForm : id
                },
                dataType : "JSON",
                crossOrigin : true,
                success : (response) => {
                    if (response.return === 1){
                        alert("Berhasil Menghapus Data");
                        detail_data(id, status, jt);
                    }else{
                        alert("Gagal Menhapus Data");
                    }
                    hideLoadingCss("");
                },
                error : (err) => {
                    hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
                }
            })
        }
    }
}

function delete_header_imprest(idForm){
    let delConfirm = confirm("Apakah Anda yakin akan menghapus data "+idForm+" ?");
    if (delConfirm){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/kebutuhan_imprest_unit/delete_header_imprest",
            type : "POST",
            data : {
                pIdForm : idForm
            },
            dataType : "JSON",
            crossOrigin : true,
            success : (response) => {
                if (response.return === 1){
                    alert("Berhasil Menghapus Data");
                    table_imprest_unit_header.ajax.reload();
                }else{
                    alert("Gagal Menhapus Data");
                }
                hideLoadingCss("");
            },
            error : (err) => {
                hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
            }
        })
    }
}

function update_status_imprest(id, status, flag, jt){
    let tempo = jt.split("/");
    if(flag === '0') {
        alert("Silahkan tambahkan detail terlebih dahulu untuk melakukan verifikasi!");
    }else if(new Date(tempo[2], tempo[1]-1, tempo[0]).getTime() <= new Date().getTime()){
        alert("Kebutuhan Imprest Melebihi Jatuh Tempo!");
    }else {
        var confirmation = confirm("Apakah Anda yakin akan menyetujui ?");
        if (confirmation){
            showLoadingCss();
            $.ajax({
                url : baseUrl + "api_operator/kebutuhan_imprest_unit/upd_status_imprest",
                data : {
                    pIdForm : id,
                    pStatus : status
                },
                type : "POST",
                success : function (res) {
                    if (res.return === 1){
                        alert("Data Berhasil Disetujui");
                        table_imprest_unit_header.ajax.reload();
                    }else alert("Maaf, Terjadi Kesalahan");
                    hideLoadingCss();
                },
                error : (err) => {
                    hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
                }
            })
        }
    }
}

function reverse_imprest_data(id, status){
    var confirmation = confirm("Apakah Anda yakin akan mereverse dropping ?");
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/kebutuhan_imprest_unit/reverse_status_imprest",
            data : {
                pIdForm : id,
                pStatus : status
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    alert("Data Berhasil Direverse");
                    table_imprest_unit_header.ajax.reload();
                }else alert("Maaf, Terjadi Kesalahan");

                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}

function openFormNew() {
    idImprest = "";
    $("#modal_new_data").modal({ keyboard: false});
    $("#pHeadTglJatuhTempo").datepicker({minDate:0, dateFormat : 'dd/mm/yy'});
}

function ins_header_data() {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/kebutuhan_imprest_unit//insert_header_imprest",
        dataType: 'JSON',
        type: "POST",
        data: {
            pIdImprestHeader: idImprest,
            pHeadTglJatuhTempo: $("#pHeadTglJatuhTempo").val(),
        },
        success: function (res) {
            if (res.return == 1) {
                alert("DATA BERHASIL DISIMPAN");
                $('#modal_new_data').modal('hide');
                table_imprest_unit_header.ajax.reload();
            } else {
                alert("GAGAL MENAMBAHKAN DATA");
            }
            hideLoadingCss("");
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function edit_data(id) {
    idImprest = id;
    $.ajax({
        url: baseUrl + "api_operator/kebutuhan_imprest_unit//edit_data",
        dataType: 'JSON',
        type: "GET",
        data: {
            pIdForm : id
        },
        success: function (res) {
            if (res.length > 0){
                $("#pHeadTglJatuhTempo")
                    .datepicker({dateFormat : "dd/mm/yy", minDate : 0})
                    .val(res[0].TGL_JATUH_TEMPO);
                setTimeout(function () {
                    $('#modal_new_data').modal({backdrop: 'static', keyboard: false});
                }, 2000);
            }else {
                alert("Data Tidak Ditemukan");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function detail_data(id, status, jatuh_tempo) {
    $("#header_imprest_row").hide();
    $("#imprest_detail").show();
    $("#btn-add-rekap").hide();
    document.getElementById("judul_form").innerHTML = id;
    $('#table_imprest_unit tbody').empty();
    $('#table_imprest_unit').dataTable().fnDestroy();

    table_imprest_unit = $('#table_imprest_unit').DataTable({
            "serverSide": true,
            "oSearch": {"sSearch": tempTableSearch},
            "scrollY": "100%",
            "scrollX": "100%",
            "searching": false,
            "bSortable": false,
            "scrollCollapse": true,
            "paging": false,
            "bInfo": false,
            "bLengthChange": false,
            "aoColumnDefs": [
                {width: 17, targets: 0},
                {width: 250, targets: 1},
                {width: 100, targets: 2},
                {width: 100, targets: 3},
                {width: 100, targets: 4},
                {className: "datatables_action", "targets": []},
                {
                    "bSortable": true,
                    "aTargets": []
                },
                {
                    "sortable": false,
                    "aTargets": [0,1,2,3,4]
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
                        return full.UNIT_PLN;
                    }

                },
                {
                    "aTargets": [2],
                    "mRender": function (data, type, full) {
                        return full.NAMA_BANK;
                    }

                },
                {
                    "data": null,
                    "aTargets": [3],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(parseFloat(full.INVESTASI).toString(), 2, ".", ",");
                    },
                    "createdCell": (cell) => {
                        $(cell).css("text-align", "right");
                    }
                },
                {
                    "data": null,
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(parseFloat(full.OPERASI).toString(), 2, ".", ",");
                    },
                    "createdCell": (cell) => {
                        $(cell).css("text-align", "right");
                    }
                },
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/kebutuhan_imprest_unit/get_detail_imprest_unit",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            pFormId: id,
                        }
                    ,
                    "dataSrc":
                        function (res) {
                            hideLoadingCss()
                            return res.data;
                        }
                }
            ,
            "footerCallback":
                function (row, data, start, end, display) {
                    var api = this.api(), data;
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\Rp,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };
                    var t_mandiri_inv = 0;
                    var t_mandiri_ops = 0;
                    var t_bukopin_inv = 0;
                    var t_bukopin_ops = 0;
                    var t_bni_inv = 0;
                    var t_bni_ops = 0;
                    var t_bri_inv = 0;
                    var t_bri_ops = 0;
                    api.column(3)
                        .data()
                        .reduce(function (a, b) {
                            var cur_index = api.column(3).data().indexOf(b);
                            if (api.column(3).data()[cur_index].NAMA_BANK === "MANDIRI") {
                                t_mandiri_inv += intVal(a) + intVal(b.INVESTASI);
                            }
                            if (api.column(3).data()[cur_index].NAMA_BANK === "BUKOPIN") {
                                t_bukopin_inv += intVal(a) + intVal(b.INVESTASI);
                            }
                            if (api.column(3).data()[cur_index].NAMA_BANK === "BNI") {
                                t_bni_inv += intVal(a) + intVal(b.INVESTASI);
                            }
                            if (api.column(3).data()[cur_index].NAMA_BANK === "BRI") {
                                t_bri_inv += intVal(a) + intVal(b.INVESTASI);
                            }
                        }, 0);
                    api.column(4)
                        .data()
                        .reduce(function (a, b) {
                            var cur_index = api.column(4).data().indexOf(b);
                            if (api.column(4).data()[cur_index].NAMA_BANK === "MANDIRI") {
                                t_mandiri_ops += intVal(a) + intVal(b.OPERASI);
                            }
                            if (api.column(4).data()[cur_index].NAMA_BANK === "BUKOPIN") {
                                t_bukopin_ops += intVal(a) + intVal(b.OPERASI);
                            }
                            if (api.column(4).data()[cur_index].NAMA_BANK === "BNI") {
                                t_bni_ops += intVal(a) + intVal(b.OPERASI);
                            }
                            if (api.column(4).data()[cur_index].NAMA_BANK === "BRI") {
                                t_bri_ops += intVal(a) + intVal(b.OPERASI);
                            }
                        }, 0);
                    document.getElementById('t_mandiri_inv').innerHTML = "<b>"+accounting.formatNumber(t_mandiri_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bukopin_inv').innerHTML = "<b>"+accounting.formatNumber(t_bukopin_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bni_inv').innerHTML = "<b>"+accounting.formatNumber(t_bni_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bri_inv').innerHTML = "<b>"+accounting.formatNumber(t_bri_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_mandiri_ops').innerHTML = "<b>"+accounting.formatNumber(t_mandiri_ops.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bukopin_ops').innerHTML = "<b>"+accounting.formatNumber(t_bukopin_ops.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bni_ops').innerHTML = "<b>"+accounting.formatNumber(t_bni_ops.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bri_ops').innerHTML = "<b>"+accounting.formatNumber(t_bri_ops.toString(), 2, '.', ',')+"</b>";
                },
            "drawCallback" : function (setting, json) {
                let node = document.getElementById("button_action");
                node.innerHTML = "";
                let api = this.api();
                let now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                let elements = document.getElementsByClassName('md-step');
                Array.prototype.forEach.call(elements,el => {
                    document.getElementById(el.id).classList.remove("active");
                });
                if (status === "VERIFIKASI STAFF"){
                    document.getElementById("staff_pe").className += " active";
                }else if(status === "VERIFIKASI MSB PE"){
                    document.getElementById("staff_pe").className += " active";
                    document.getElementById("msb_pe").className += " active";
                }else if(status === "VERIFIKASI VP TOE") {
                    document.getElementById("staff_pe").className += " active";
                    document.getElementById("msb_pe").className += " active";
                    document.getElementById("vp_pe").className += " active";
                }
                let arrStr = jatuh_tempo.split("/");
                let jt = new Date(arrStr[2], arrStr[1]-1, arrStr[0]);
                if(jt.getTime() > now.getTime()){
                    let html = '<button type="button" class="btn btn-default btn-sm" style="width: 35px;" title="Kembali Ke Header" onclick="backToHeader()"><i class="fas fa-arrow-circle-left"></i></button>';
                    if (status === "INPUT DATA"){
                        if (newRoleUser[0] === "ROLE_ADMIN" || newRoleUser[0] === "ROLE_JA_CASH" || newRoleUser[0] === "ROLE_JA_IE"){
                            if (!api.data().any() || api.rows().count() === 1){
                                html += '<button class="btn btn-success btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="upload_xls(\'' + id + '\',\''+status+'\',\''+ jatuh_tempo+'\')" title="Upload Excel" ><i class="fas fa-file-upload"></i></button>';
                            }
                            html += '<button class="btn btn-danger btn-sm" style="margin-left: 10px; width: 35px;" onclick="delete_detail_imprest(\'' + id + '\',\''+status+'\',\''+ jatuh_tempo+'\')" type="button" title="Hapus Periode"><i class="fas fa-trash"></i></button>';
                        }
                    }
                    $("#button_action").append(html);
                }
                else{
                    $("#button_action").append('<button type="button" class="btn btn-default btn-sm" style="width: 35px;" title="Kembali Ke Header" onclick="backToHeader()"><i class="fas fa-arrow-circle-left"></i></button>');
                }
            }
        }
    );
}

function backToHeader() {
    $("#imprest_detail").hide();
    $("#header_imprest_row").show();
    $("#btn-add-rekap").show();
    table_imprest_unit.destroy();
    table_imprest_unit_header.ajax.reload();
}
