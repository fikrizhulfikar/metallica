/**
 * Created by Mr.Diaz on 31/10/19.
 */
var table_imprest_unit;
var today = new Date();
var idValas = "";
var allData;
var tempVendor = "";
var tempBankPembayar = "";
var tempBankAccount = "";
var tempUnit = "";
var tempTableSearch = "";

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
    $('#periode_dropping').datepicker({dateFormat: 'dd/mm/yy'});
    search("load");
});

function search(state) {
        if ($("#periode_dropping").val() === "" && state !== "load") {
            alert("Mohon Isi Periode Terlebih Dahulu");
        }else if(state === "search"){
            let tgl = $('#periode_dropping').val();
            today = tgl;
            $('#tgl_imprest').html(tgl);
            initDataTable(today);
            periode_dropping = $("#periode_dropping").val();
        }
        else {
            initDataTable(today);
            periode_dropping = $("#periode_dropping").val();
        }
    }

function initDataTable() {
    showLoadingCss();
    // $('#table_imprest_unit tbody').empty();
    $('#table_imprest_unit').dataTable().fnDestroy();
    let rowNum = 1;

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
                {width: 100, targets: 5},
                {className: "datatables_action", "targets": []},
                {
                    "bSortable": true,
                    "aTargets": []
                },
                {
                    "sortable": false,
                    "aTargets": [0,1,2,3,4,5]
                },
                {
                    "aTargets": [0],
                    "mRender": function (data, type, full) {
                        return rowNum++;
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
                        return accounting.formatNumber(full.INVESTASI_NON_RUTIN, 2, ".", ",");
                    },
                    "createdCell": (cell) => {
                        $(cell).css("text-align", "right");
                    }
                },
                {
                    "data": null,
                    "aTargets": [4],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.INVESTASI_RUTIN, 2, ".", ",");
                    },
                    "createdCell": (cell) => {
                        $(cell).css("text-align", "right");
                    }
                },

                {
                    "data": null,
                    "aTargets": [5],
                    "mRender": function (data, type, full) {
                        return accounting.formatNumber(full.OPERASI, 2, ".", ",");
                    },
                    "createdCell": (cell) => {
                        $(cell).css("text-align", "right");
                    }
                },
            ],
            "ajax":
                {
                    "url":
                        baseUrl + "api_operator/kebutuhan_imprest_unit/get_imprest_unit",
                    "type":
                        "GET",
                    "dataType":
                        "json",
                    "data":
                        {
                            periode: today,
                        }
                    ,
                    "dataSrc":
                        function (res) {
                            hideLoadingCss()
                            getTotalTagihan();
                            localStorage.setItem("imprest_approval_status", (res.data.length <= 0) ? "" : res.data[0].STATUS_APPROVE);
                            return res.data;
                        }
                }
            ,
            "footerCallback":
                function (row, data, start, end, display) {
                    refreshFooter();
                    var api = this.api(), data;

                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\Rp,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };
                    var t_mandiri = 0;
                    var t_mandiri_inv = 0;
                    var t_mandiri_ops = 0;
                    var t_bukopin = 0;
                    var t_bukopin_inv = 0;
                    var t_bukopin_ops = 0;
                    var t_bni = 0;
                    var t_bni_inv = 0;
                    var t_bni_ops = 0;
                    var t_bri_inv = 0;
                    var t_bri = 0;
                    var t_bri_ops = 0;
                    api.column(3)
                        .data()
                        .reduce(function (a, b) {
                            var cur_index = api.column(3).data().indexOf(b);
                            if (api.column(3).data()[cur_index].NAMA_BANK === "MANDIRI") {
                                t_mandiri += intVal(a) + intVal(b.INVESTASI_NON_RUTIN);
                            }
                            if (api.column(3).data()[cur_index].NAMA_BANK === "BUKOPIN") {
                                t_bukopin += intVal(a) + intVal(b.INVESTASI_NON_RUTIN);
                            }
                            if (api.column(3).data()[cur_index].NAMA_BANK === "BNI") {
                                t_bni += intVal(a) + intVal(b.INVESTASI_NON_RUTIN);
                            }
                            if (api.column(3).data()[cur_index].NAMA_BANK === "BRI") {
                                t_bri += intVal(a) + intVal(b.INVESTASI_NON_RUTIN);
                            }
                        }, 0);
                    document.getElementById('t_mandiri_non').innerHTML = "<b>"+accounting.formatNumber(t_mandiri.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bukopin_non').innerHTML = "<b>"+accounting.formatNumber(t_bukopin.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bni_non').innerHTML = "<b>"+accounting.formatNumber(t_bni.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bri_non').innerHTML = "<b>"+accounting.formatNumber(t_bri.toString(), 2, '.', ',')+"</b>";
                    api.column(4)
                        .data()
                        .reduce(function (a, b) {
                            var cur_index = api.column(4).data().indexOf(b);
                            if (api.column(4).data()[cur_index].NAMA_BANK === "MANDIRI") {
                                t_mandiri_inv += intVal(a) + intVal(b.INVESTASI_RUTIN);
                            }
                            if (api.column(4).data()[cur_index].NAMA_BANK === "BUKOPIN") {
                                t_bukopin_inv += intVal(a) + intVal(b.INVESTASI_RUTIN);
                            }
                            if (api.column(4).data()[cur_index].NAMA_BANK === "BNI") {
                                t_bni_inv += intVal(a) + intVal(b.INVESTASI_RUTIN);
                            }
                            if (api.column(4).data()[cur_index].NAMA_BANK === "BRI") {
                                t_bri_inv += intVal(a) + intVal(b.INVESTASI_RUTIN);
                            }
                        }, 0);
                    document.getElementById('t_mandiri_inv').innerHTML = "<b>"+accounting.formatNumber(t_mandiri_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bukopin_inv').innerHTML = "<b>"+accounting.formatNumber(t_bukopin_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bni_inv').innerHTML = "<b>"+accounting.formatNumber(t_bni_inv.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bri_inv').innerHTML = "<b>"+accounting.formatNumber(t_bri_inv.toString(), 2, '.', ',')+"</b>";
                    api.column(5)
                        .data()
                        .reduce(function (a, b) {
                            var cur_index = api.column(5).data().indexOf(b);
                            if (api.column(5).data()[cur_index].NAMA_BANK === "MANDIRI") {
                                t_mandiri_ops += intVal(a) + intVal(b.OPERASI);
                            }
                            if (api.column(5).data()[cur_index].NAMA_BANK === "BUKOPIN") {
                                t_bukopin_ops += intVal(a) + intVal(b.OPERASI);
                            }
                            if (api.column(5).data()[cur_index].NAMA_BANK === "BNI") {
                                t_bni_ops += intVal(a) + intVal(b.OPERASI);
                            }
                            if (api.column(5).data()[cur_index].NAMA_BANK === "BRI") {
                                t_bri_ops += intVal(a) + intVal(b.OPERASI);
                            }
                        }, 0);
                    document.getElementById('t_mandiri_ops').innerHTML = "<b>"+accounting.formatNumber(t_mandiri_ops.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bukopin_ops').innerHTML = "<b>"+accounting.formatNumber(t_bukopin_ops.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bni_ops').innerHTML = "<b>"+accounting.formatNumber(t_bni_ops.toString(), 2, '.', ',')+"</b>";
                    document.getElementById('t_bri_ops').innerHTML = "<b>"+accounting.formatNumber(t_bri_ops.toString(), 2, '.', ',')+"</b>";

                    document.getElementById("tot_man_inv").innerText = accounting.formatNumber(parseFloat(t_mandiri_inv) + parseFloat(t_mandiri),2,'.',',') ;
                    document.getElementById("tot_man").innerText = accounting.formatNumber(parseFloat(t_mandiri_ops),2,'.',',') ;
                    document.getElementById("tot_bni_inv").innerText = accounting.formatNumber(parseFloat(t_bni_inv) + parseFloat(t_bni),2,'.',',') ;
                    document.getElementById("tot_bni").innerText = accounting.formatNumber(parseFloat(t_bni),2,'.',',') ;
                    document.getElementById("tot_bri_inv").innerText = accounting.formatNumber(parseFloat(t_bri_inv) + parseFloat(t_bri),2,'.',',') ;
                    document.getElementById("tot_bri").innerText = accounting.formatNumber(parseFloat(t_bri_ops),2,'.',',') ;
                    document.getElementById("tot_buk_inv").innerText = accounting.formatNumber(parseFloat(t_bukopin_inv) + parseFloat(t_bukopin),2,'.',',') ;
                    document.getElementById("tot_buk").innerText = accounting.formatNumber(parseFloat(t_bukopin_ops),2,'.',',') ;
                },
            "drawCallback" : (setting, json)=> {
                let node = document.getElementById("button_action");
                node.innerHTML = "";

                let cur_periode = document.getElementById("tgl_imprest").innerHTML;
                let darr = cur_periode.split("/");
                let now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                let periode = new Date(darr[2],darr[1]-1,darr[0]);

                let elements = document.getElementsByClassName('md-step');
                Array.prototype.forEach.call(elements,el => {
                    document.getElementById(el.id).classList.remove("active");
                });

                if (localStorage.getItem("imprest_approval_status") === "VERIFIKASI STAFF"){
                    document.getElementById("staff_pe").className += " active";
                }else if(localStorage.getItem("imprest_approval_status") === "VERIFIKASI MSB PE"){
                    document.getElementById("staff_pe").className += " active";
                    document.getElementById("msb_pe").className += " active";
                }else if(localStorage.getItem("imprest_approval_status") === "VERIFIKASI VP TOE") {
                    document.getElementById("staff_pe").className += " active";
                    document.getElementById("msb_pe").className += " active";
                    document.getElementById("vp_pe").className += " active";
                }

                if(!periode.getTime() < now.getTime()){
                    $('.dataTables_filter').each(function(){
                        let html;
                        if (localStorage.getItem("imprest_approval_status") === "INPUT DATA"){
                            if (newRoleUser[0] === "ROLE_ADMIN" || newRoleUser[0] === "ROLE_JA_CASH" || newRoleUser[0] === "ROLE_JA_IE"){
                                html = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_imprest_data(1)" title="Approve" ><i class="fas fa-check-square"></i></button>';
                                html += '<button class="btn btn-danger btn-sm" style="margin-left: 10px; width: 35px;" onclick="delete_periode_imprest()" type="button" title="Hapus Periode"><i class="fas fa-trash"></i></button>';
                            }
                        }else if(localStorage.getItem("imprest_approval_status") === "VERIFIKASI STAFF"){
                            if (newRoleUser[0] === "ROLE_MSB_PAYMENT_EXPENDITURE"){
                                html = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_imprest_data(2)" title="Approve" ><i class="fas fa-check-square"></i></button>';
                                html += '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_imprest_data(1)" title="Reverse"><i class="fas fa-backspace"></i></button>';
                            }
                        }else if(localStorage.getItem("imprest_approval_status") === "VERIFIKASI MSB PE"){
                            if (newRoleUser[0] === "ROLE_VP_OPERATION_EXPENDITURE"){
                                html = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_imprest_data(3)" title="Approve" ><i class="fas fa-check-square"></i></button>';
                                html += '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_imprest_data(2)" title="Reverse"><i class="fas fa-backspace"></i></button>';
                            }
                        }else{
                            if (newRoleUser[0] === "ROLE_ADMIN" || newRoleUser[0] === "ROLE_JA_CASH" || newRoleUser[0] === "ROLE_JA_IE"){
                                html = '<button class="btn btn-success btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="upload_xls()" title="Upload Excel" ><i class="fas fa-file-upload"></i></button>';
                            }
                        }
                        $(this).append(html);
                    })
                };
            }
        }
    );

    table_imprest_unit.on('search.dt', function () {
        var value = $('.dataTables_filter input').val();
        tempTableSearch = value;
    });

}

function upload_xls(){
    $("#modal-upload-xls").modal("show");
}

function upload_server_xls() {
    $("#modal-upload-xls").modal("hide");
    showLoadingCss();
    var form = $('form')[0];
    var formData = new FormData(form);

    formData.append('file', $('input[type=file]#file-xls')[0].files[0]);
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
            console.log("Upload Excel : ",res)
            hideLoadingCss("");
            if (res.return == 1) {
                alert("Berhasil Upload Data");
                initDataTable(today);
            } else {
                var obj = res.return[0];
                alert("Terdapat kesalahan pada data. Download excel?");
                // window.location = "../api_operator/kebutuhan_imprest_unit/download/"+obj["ID_UPLOAD"];
                search("load");
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function delete_periode_imprest(){
    if ($('#periode_dropping').val() === ""){
        alert("Silahkan Pilih Periode");
        return;
    }
    let delConfirm = confirm("Apakah Anda yakin akan menghapus data periode "+$('#periode_dropping').val()+" ?");
    if (delConfirm){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/kebutuhan_imprest_unit/delete_periode",
            type : "POST",
            data : {
                periode : $('#periode_dropping').val()
            },
            dataType : "JSON",
            crossOrigin : true,
            success : (response) => {
                if (response.return === 1){
                    alert("Berhasil Menghapus Data");
                    table_imprest_unit.ajax.reload();
                    refreshFooter();
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

function update_imprest_data(status){
    var confirmation = confirm("Apakah Anda yakin akan menyetujui dropping periode "+document.getElementById("tgl_imprest").innerHTML+" ?");
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/kebutuhan_imprest_unit/upd_status_imprest",
            data : {
                tanggal : document.getElementById("tgl_imprest").innerHTML,
                status : status
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    alert("Data Berhasil Disetujui");
                    table_imprest_unit.ajax.reload();
                }else alert("Maaf, Terjadi Kesalahan");
                refreshFooter();
                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}

function reverse_imprest_data(status){
    var confirmation = confirm("Apakah Anda yakin akan mereverse dropping periode "+document.getElementById("tgl_imprest").innerHTML+" ?");
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/kebutuhan_imprest_unit/reverse_status_imprest",
            data : {
                tanggal : document.getElementById("tgl_imprest").innerHTML,
                status : status
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    alert("Data Berhasil Direverse");
                    table_imprest_unit.ajax.reload();
                    refreshFooter();
                }else alert("Maaf, Terjadi Kesalahan");

                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}

function refreshFooter(){
    document.getElementById('t_mandiri_non').innerHTML = "0,00";
    document.getElementById('t_bukopin_non').innerHTML = "0,00";
    document.getElementById('t_bni_non').innerHTML = "0,00";
    document.getElementById('t_bri_non').innerHTML = "0,00";
    document.getElementById('t_mandiri_inv').innerHTML = "0,00";
    document.getElementById('t_bukopin_inv').innerHTML = "0,00";
    document.getElementById('t_bni_inv').innerHTML = "0,00";
    document.getElementById('t_bri_inv').innerHTML = "0,00";
    document.getElementById('t_mandiri_ops').innerHTML = "0,00";
    document.getElementById('t_bukopin_ops').innerHTML = "0,00";
    document.getElementById('t_bni_ops').innerHTML = "0,00";
    document.getElementById('t_bri_ops').innerHTML = "0,00";
}
