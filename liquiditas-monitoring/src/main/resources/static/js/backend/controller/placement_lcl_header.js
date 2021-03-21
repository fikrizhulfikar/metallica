var tempTableSearch = "";
var kebutuhanPlacement;
var lcl_today = null;
var date = new Date();
var tglAwal = new Date();
var tglAkhir = new Date();
var tanggal = new Date();
var tempTableSearch = "";
var sesi = "";

$(document).ready(function () {
    $('#pTglBuat').datepicker({ dateFormat: 'dd/mm/yy' });
    $('#tanggal_awal1').datepicker({ dateFormat: 'dd/mm/yy'});
    $('#tanggal_akhir1').attr("disabled", "disabled");
    $('#tanggal_akhir1').datepicker({dateFormat: 'dd/mm/yy'});

    let dd = String(tanggal.getDate()).padStart(2,'0');
    let mm = String(tanggal.getMonth() + 1).padStart(2,'0');
    let yyyy = tanggal.getFullYear();

    tanggal = dd+'/'+mm+'/'+yyyy;

//    initDataTablePlacement();
    search("load");
});

$("#tanggal_awal1").change(function () {
    var tglAwalData = $('#tanggal_awal1').val();
    if (tglAwalData == "") {
        // alert("Tanggal awal belum di tentukan");
        $('#tanggal_akhir1').val("");
    } else {
        $('#tanggal_akhir1').attr('disabled', false);
        $('#tanggal_akhir1').datepicker({dateFormat: 'dd/mm/yy', minDate: tglAwalData});
    }
});

function dateToString(tanggal) {
    return tanggal.getDate() + "/" + (tanggal.getMonth() + 1) + "/" + tanggal.getFullYear();
}

function incDate(tanggal, days) {
    date = new Date(tanggal.getTime() + (86400000 * days));
    if (date.getMonth() >= "9"){
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    } else
        return date.getDate() + "/0" + (date.getMonth() + 1) + "/" + date.getFullYear()

}

function stringToDate(_date) {
    var formatLowerCase = 'dd/mm/yyyy';
    var formatItems = formatLowerCase.split('/');
    var dateItems = _date.split('/');
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function search(state) {
    if ($("#tanggal_akhir1").val() == "" && state != "load" && $("#tanggal_awal1").val() != "") {
        alert("Mohon Lengkapi Tgl Akhir");
    } else {
        initDataTablePlacement($("#tanggal_awal1").val(), $("#tanggal_akhir1").val())
        srcTglAwal = $("#tanggal_awal1").val()
        srcTglAkhir = $("#tanggal_akhir1").val()
    }
}

function stringToDate(_date) {
    var formatLowerCase = 'dd/mm/yyyy';
    var formatItems = formatLowerCase.split('/');
    var dateItems = _date.split('/');
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
}

function initDataTablePlacement(p_tgl_awal, p_tgl_akhir){

    showLoadingCss();
    $('#table-placement-lcl-header tbody').empty();
    $('#table-placement-lcl-header').dataTable().fnDestroy();

    placementHeader = $("#table-placement-lcl-header").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "bLengthChange": true,
        "paging": true,
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": false,
        "bSortable": true,
        "scrollCollapse": true,
        "bInfo": true,
        "aoColumnDefs": [
            {width: 20, targets: 0},
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            { className: "datatables_action", "targets": [] },
            {
                "sortable": false,
                "aTargets": [0,5]
            },
            {
                 "targets": [0,1,2,3,4,5],
                 "className": "dt-body-center",
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
                    return full.NAMA_FORM;
                }
            },
            {
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return full.TGL_DI_BUAT;
                }
            },
            {
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return full.TGL_JATUH_TEMPO;
                }
            },
            {
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return full.STATUS_APPROVE;
                }
            },
            {
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    var ret_value;
                    if (full.STATUS_APPROVE === "INPUT DATA"){
                        ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                    '<button style="width: 15px !important; margin: 2px;" id="detail" class="btn btn-sm btn-success" title="Detail" onclick="detail(\''+full.NAMA_FORM+'\',\''+full.STATUS_APPROVE+'\')"><i class="fa fa-info-circle"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="verifikasi" class="btn btn-sm btn-warning" title="Verifikasi" onclick="verif(1,\''+full.NAMA_FORM+'\')"><i class="fa fa-check-square"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="edit" class="btn btn-sm btn-info" title="Edit" onclick="editHead(\''+full.NAMA_FORM+'\')"><i class="fa fa-edit"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="delete" class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\''+full.NAMA_FORM+'\')"><i class="fa fa-trash"></i></button>' +
                                    '</div>'
                        return ret_value;
                    } else if (full.STATUS_APPROVE === "VERIFIKASI STAFF") {
                        ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                    '<button style="width: 15px !important; margin: 2px;" id="detail" class="btn btn-sm btn-success" title="Detail" onclick="detail(\''+full.NAMA_FORM+'\',\''+full.STATUS_APPROVE+'\')"><i class="fa fa-info-circle"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="verifikasi" class="btn btn-sm btn-warning" title="Verifikasi" onclick="verif(2,\''+full.NAMA_FORM+'\')"><i class="fa fa-check-square"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="reverse" class="btn btn-duplicate-data btn-sm btn-primary" title="Reverse" onclick="reverse(1,\''+full.NAMA_FORM+'\')"><i class="fa fa-backspace"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="delete" class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\''+full.NAMA_FORM+'\')"><i class="fa fa-trash"></i></button>' +
                                    '</div>'
                        return ret_value;
                    } else if (full.STATUS_APPROVE === "VERIFIKASI MSB LCL") {
                        ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                    '<button style="width: 15px !important; margin: 2px;" id="detail" class="btn btn-sm btn-success" title="Detail" onclick="detail(\''+full.NAMA_FORM+'\',\''+full.STATUS_APPROVE+'\')"><i class="fa fa-info-circle"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="verifikasi" class="btn btn-sm btn-warning" title="Verifikasi" onclick="verif(3,\''+full.NAMA_FORM+'\')"><i class="fa fa-check-square"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="reverse" class="btn btn-duplicate-data btn-sm btn-primary" title="Reverse" onclick="reverse(2,\''+full.NAMA_FORM+'\')"><i class="fa fa-backspace"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="delete" class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\''+full.NAMA_FORM+'\')"><i class="fa fa-trash"></i></button>' +
                                    '</div>'
                        return ret_value;
                    } else if (full.STATUS_APPROVE === "VERIFIKASI VP TLR") {
                        ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                    '<button style="width: 15px !important; margin: 2px;" id="detail" class="btn btn-sm btn-success" title="Detail" onclick="detail(\''+full.NAMA_FORM+'\',\''+full.STATUS_APPROVE+'\')"><i class="fa fa-info-circle"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="reverse" class="btn btn-duplicate-data btn-sm btn-primary" title="Reverse" onclick="reverse(3,\''+full.NAMA_FORM+'\')"><i class="fa fa-backspace"></i></button>' +
                                    '<button style="width: 15px !important; margin: 2px;" id="delete" class="btn btn-sm btn-danger" title="Hapus" onclick="deleteHead(\''+full.NAMA_FORM+'\')"><i class="fa fa-trash"></i></button>' +
                                    '</div>'
                        return ret_value;
                    }
                }
            }
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/rekap_invoice_belum/placement_lcl_header",
                "type":
                    "GET",
                "dataType":
                    "json",
                "data":
                    {
                        p_tgl_awal: p_tgl_awal,
                        p_tgl_akhir: p_tgl_akhir
                    }
                ,
                "dataSrc":
                function (res) {
                    hideLoadingCss();
                    localStorage.setItem("placement_lcl_approval_status", (res.data.length <= 0) ? "" : res.data[0].STATUS_APPROVE);
                    return res.data;
                }
            }
     });

     placementHeader.on('search.dt', function () {
         tempTableSearch = value;
     });


    placementHeader.columns.adjust();
}

function createNew() {

    var date = new Date();

    $("#pTglJatuhTempo").val("");
    $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: date});

    $('#edit-placement-lcl-header').modal({backdrop: 'static', keyboard: false});

}

function insData() {
    let idForm = $("#pIdForm").val();
    showLoadingCss();
    (idForm === undefined || idForm === "") ? idForm = null : idForm = idForm;

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/create_placement_lcl_header",
        dataType: 'JSON',
        type: "POST",
        data : {
            p_id_form : idForm,
            p_tgl_jatuh_tempo : $("#pTglJatuhTempo").val(),
        },
        success: function (res) {
            hideLoadingCss("");
            if(res.return == 1){
                Swal.fire("Sukses!", "Data berhasil disimpan", "success");
                $('#edit-placement-lcl-header').modal('hide');
                initDataTablePlacement($("#tanggal_awal1").val(), $("#tanggal_akhir1").val());
            }else{
                Swal.fire("Gagal!", "Gagal menambahkan data", "error");
                console.warn(res.RETURN);
            }
            hideLoadingCss("");
        },
        error: function (res) {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator");
        }
    });
}

function detail(idForm, status){
    $(".list-data").hide();
    $("#new-data").hide();
    $(".detail-data").show();
    $("#status").html(status);
    $("#nama-form").html(idForm);
//    showLoadingCss();
    $('#table-rekap-placement-lcl').dataTable().fnDestroy();

    rincian_saldo = $("#table-rekap-placement-lcl").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/detail_placement_lcl_head",
            "data" : {
                p_id_form: idForm
            },
            "type" : "GET",
            "dataType" : "json",
            "dataSrc":
                function (res) {
                    var data = res.return;
                    return data;
                }
        },
        "columns" : [
            {"data":null,"render" : (data, type, row) => {return '<td>'+data.BANK+'</td>'},"createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#77D5D4");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.SALDO_RECEIPT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.IMPREST_KANTOR_PUSAT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.IMPOR)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.IMPREST_OPERASI_TERPUSAT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.IMPREST_INVESTASI_TERPUSAT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.SETTLEMENT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.PROYEKSI_PENGADAAN_VALAS)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.RECEIPT_PLACEMENT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.GIRO_SPECIAL_RATE)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.SALDO_AKHIR_RECEIPT)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
    });

    let date = new Date();

    $("#tgl1b").html(tanggal);
    var dateString = tanggal;
    var dateArray = dateString.split("/");
    var newDate = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
    var dateObject = new Date(newDate);

    $("#tgl2b").html(incDate(dateObject, 1));
    $("#tgl3b").html(incDate(dateObject, 2));
    $("#tgl4b").html(incDate(dateObject, 3));
    $("#tgl5b").html(incDate(dateObject, 4));
    $("#tgl6b").html(incDate(dateObject, 5));

//    showLoadingCss();
    $('#kebutuhan-placement tbody').empty();
    $('#kebutuhan-placement').dataTable().fnDestroy();

    kebutuhanPlacement = $("#kebutuhan-placement").DataTable({
        "serverSide": true,
        "oSearch": {"sSearch": tempTableSearch},
        "bLengthChange": false,
        "paging": false,
        "scrollY": "100%",
        "scrollX": "100%",
        "searching": false,
        "bSortable": false,
        "scrollCollapse": false,
        "bInfo": false,
        "aoColumnDefs": [
            {width: 100, targets: 0},
            {width: 100, targets: 1},
            {width: 100, targets: 2},
            {width: 100, targets: 3},
            {width: 100, targets: 4},
            {width: 100, targets: 5},
            {width: 100, targets: 6},
            {width: 100, targets: 7},
            {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [1, 2, 3, 4, 5, 6, 7, 8] },
            {
                "data":null,
                "aTargets": [0],
//                "visible" : false,
                "mRender": function (data, type, full) {
                    return full.TIPE_KEBUTUHAN;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#77D5D4");}
            },
            {
                "data":null,
                "aTargets": [1],
                "mRender": function (data, type, full) {
                    return full.BANK;
                },
                "createdCell" : (cell, cellData, rowData, rowIndex, colIndex) => {$(cell).css("background-color","#5ef4d3");}
            },
            {
                "data":null,
                "aTargets": [2],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D0,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [3],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D1,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D2,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [5],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D3,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [6],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D4,2,".",",") + "</td";
                }

            },
            {
                "data":null,
                "aTargets": [7],
                "mRender": function (data, type, full) {
                    return "<td> Rp. " + accounting.formatNumber(full.RP_D5,2,".",",") + "</td";
                }

            },
            {
                "aTargets": [8],
                "mRender": function (data, type, full) {
                    var ret_value = " ";
                    if (status == "INPUT DATA") {
                        if (full.TIPE_KEBUTUHAN == "RECEIPT PLACEMENT" || full.TIPE_KEBUTUHAN == "GIRO SPECIAL RATE" ){
                        ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                    '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setB(\''+full.TIPE_KEBUTUHAN+'\',\''+full.ID_LCL+'\')"><i class="fa fa-clone"></i></button>';
                        return ret_value;
                        } else {
                        ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                    '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setA(\''+full.TIPE_KEBUTUHAN+'\',\''+full.ID_LCL+'\')"><i class="fa fa-clone"></i></button>';
                        return ret_value;
                        }
                    } else{
                        return ret_value;
                    }
                }
            }
        ],
        "ajax":
            {
                "url":
                    baseUrl + "api_operator/rekap_invoice_belum/detail_placement_lcl_head",
                "type": "GET",
                "dataType": "json",
                "data":
                    {
                        p_id_form: idForm
                    }
                ,
                "dataSrc":
                function (res) {
                    hideLoadingCss()
                    return res.OUT_KEBUTUHAN_LCL;
                }
            },

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL")){
                $(row).css({
                    "background-color": "#5ef4d3",
                    "font-weight": "bold",
                });
             }
         }
     });

     kebutuhanPlacement.on('search.dt', function () {
         var value = $('.dataTables_filter2 input').val();
         tempTableSearch = value;
     });

    rincian_saldo.columns.adjust();
    kebutuhanPlacement.columns.adjust();
}

function editHead(idForm){
    showLoadingCss();
    $.ajax({
        url : baseUrl + "api_operator/rekap_invoice_belum/get_placement_lcl_head_byid",
        dataType : "JSON",
        type : "GET",
        data : {
                p_id_form : idForm
        },
        success : (res) => {
            hideLoadingCss("");
            var tes = JSON.stringify(res);
            //console.log("Result : "+ tes);
            $("#pTglJatuhTempo").val(res.data[0].TGL_JATUH_TEMPO);
            $("#pIdForm").val(res.data[0].NAMA_FORM);
            $('#pTglJatuhTempo').datepicker({ dateFormat: 'dd/mm/yy' ,minDate: date});

            setTimeout(function(){ $('#edit-placement-lcl-header').modal({backdrop: 'static', keyboard: false}); }, 1000);
        },
        error : (error)=>{
            console.log("Error");
        }
    });
}

function verif(status, idForm){
    $("#nama-form").html(idForm);
    var confirmation = confirm("Apakah Anda yakin akan menyetujui placement "+document.getElementById("nama-form").innerHTML+" ?");
//    console.log("Ini data : " + status + sesi);
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/rekap_invoice_belum/verifikasi_placement_lcl_header",
            data : {
                p_status : status,
                p_id_form : idForm
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    Swal.fire("Sukses!", "Data berhasil disetujui", "success");
                    placementHeader.ajax.reload();
                } else
                    alert("Maaf, Terjadi Kesalahan");
                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}

function reverse(status, idForm){
    $("#nama-form").html(idForm);
    var confirmation = confirm("Apakah Anda yakin akan reverse placement "+document.getElementById("nama-form").innerHTML+" ?");
    if (confirmation){
        showLoadingCss();
        $.ajax({
            url : baseUrl + "api_operator/rekap_invoice_belum/reverse_placement_lcl_head",
            data : {
                p_status : status,
                p_id_form : idForm
            },
            type : "POST",
            success : function (res) {
                if (res.return === 1){
                    Swal.fire("Sukses!", "Data berhasil di reverse", "success");
                    placementHeader.ajax.reload();
                }else alert("Maaf, Terjadi Kesalahan");

                hideLoadingCss();
            },
            error : (err) => {
                hideLoadingCss("Terjadi Kesalahan. Silahakn Hubungi Administrator!");
            }
        })
    }
}

function deleteHead(idForm){
    showLoadingCss();
    var del_confirm = confirm("Anda yakin ingin menghapus data ?");
    if(del_confirm){
        $.ajax({
            url : baseUrl + "api_operator/rekap_invoice_belum/delete_data",
            dataType : "JSON",
            type : "POST",
            data : {
                p_id_form : idForm
            },
            success : function (result) {
                console.log("Delete Result : ",result);
                hideLoadingCss("");
                console.log("Result : "+result);
                if (result.return == 1 ) {
                    Swal.fire("Sukses!", "Data berhasil dihapus", "success");
//                    $('#edit-placement-lcl-header').modal('hide');
                    initDataTablePlacement($("#tanggal_awal1").val(), $("#tanggal_akhir1").val());
                } else {
                    alert(result.OUT_MSG);
                }
            },
            error : function (result) {
                Swal.fire("Gagal!", "Gagal menambahkan data", "error");
//                var tes = JSON.stringify(result);
//                console.log("Result : "+ tes);
            }
        });
    }else{
        hideLoadingCss("");
    }
    placementHeader.ajax.reload();
}

function back(){
    Swal.fire({
        title : "Yakin ?",
        text : "Apakah anda yakin ingin kembali?",
        icon : "error",
        showCancelButton : true,
        confirmButtonColor : "#3085d6",
        cancelButtonColor : "#d33",
        confirmButtonText : "Ya"
    }).then(result => {
        if (result.value){
            $(".list-data").show();
            $(".detail-data").hide();
            $("#new-data").show();
            placementHeader.ajax.reload();
        }
    });
}

function setA(jenis, p_id_form){
    $('#set-a').modal({backdrop: 'static', keyboard: false});
    $('#table-imprest-pusat').dataTable().fnDestroy();

    let detail_placement = $("#table-imprest-pusat").DataTable({
            "ajax" : {
                "url": baseUrl + "api_operator/rekap_invoice_belum/detail_placement_imprest",
                "data" : {
                    p_jenis : jenis,
                    p_id_form : p_id_form
                },
                "type" : "GET",
                "dataType" : "json",
                "dataSrc":
                    function (res) {
                        return res.data;
                    }
            },
            "sorting": false,
            "searching" : false,
            "paging": false,
            "bInfo" : false,
            "bLengthChange" : true,
            "columns" : [
                {"data":null,"render" : (data, type, row) => {return "<td> <span id='data0'>"+data.BANK+"</span></td>";}},
                {"data":null,"render" : (data, type, row) => {return "<td> Rp. " + accounting.formatNumber(data.SISA_SALDO,2,".",",") +"</td>";
                                                             },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.BRI == "0" || data.BRI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.BNI == "0" || data.BNI == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                                return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                                } else
                                                                return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
                {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            ],
        });

        $(document).ready(function() {
            if (jenis == "IMPREST KANTOR PUSAT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImprestPusat(\''+p_id_form+'\')">Set</button>');
            } else if (jenis == "IMPOR") {
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImpor(\''+p_id_form+'\')">Set</button>');
            } else if (jenis == "IMPREST OPERASI TERPUSAT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImprestOperasi(\''+p_id_form+'\')">Set</button>');
            } else if (jenis == "IMPREST INVESTASI TERPUSAT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateImprestInvestasi(\''+p_id_form+'\')">Set</button>');
            } else if (jenis == "SETTLEMENT"){
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updateSettlement(\''+p_id_form+'\')">Set</button>');
            } else {
                $('#container').append('<button type="button" id="set" class="btn btn-primary" onclick="updatePengadaanValas(\''+p_id_form+'\')">Set</button>');
            }
        });

        $("#close").click(function(){
            $('#set').remove();
            rincian_saldo.ajax.reload();
            kebutuhanPlacement.ajax.reload();
        })
}

function setB(jenis, p_id_form){
    $('#set-b').modal({backdrop: 'static', keyboard: false});
    $('#table-receipt-placement').dataTable().fnDestroy();

    let detail_placement_2 = $("#table-receipt-placement").DataTable({
        "ajax" : {
            "url": baseUrl + "api_operator/rekap_invoice_belum/detail_placement_imprest",
            "data" : {
                p_jenis : jenis
            },
            "type" : "GET",
            "dataType" : "json",
            "dataSrc":
                function (res) {
                    return res.data;
                }
        },
        "sorting": false,
        "searching" : false,
        "paging": false,
        "bInfo" : false,
        "bLengthChange" : true,
        "columns" : [
            {"data":null,"render" : (data, type, row) => {return "<td> <span id='data0'>"+data.BANK+"</span></td>";}},
            {"data":null,"render" : (data, type, row) => {return "<td> Rp. " + accounting.formatNumber(data.SISA_SALDO,2,".",",") +"</td>";
                                                         },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.MANDIRI == "0" || data.MANDIRI == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data1' type='number' value='"+ data.MANDIRI +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BRI == "0" || data.BRI == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data2' type='number' value='"+ data.BRI +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BNI == "0" || data.BNI == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data3' type='number' value='"+ data.BNI +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BUKOPIN == "0" || data.BUKOPIN == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data4' type='number' value='"+ data.BUKOPIN +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.MEGA == "0" || data.MEGA == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data5' type='number' value='"+ data.MEGA +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data5' type='number' value='"+ data.MEGA +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.DKI == "0" || data.DKI == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data6' type='number' value='"+ data.DKI +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data6' type='number' value='"+ data.DKI +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BCA == "0" || data.BCA == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data7' type='number' value='"+ data.BCA +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data7' type='number' value='"+ data.BCA +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BII == "0" || data.BII == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data8' type='number' value='"+ data.BII +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data8' type='number' value='"+ data.BII +"'></td>";
                                                                },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BRIS == "0" || data.BRIS == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data9' type='number' value='"+ data.BRIS +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data9' type='number' value='"+ data.BRIS +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.BTN == "0" || data.BTN == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data10' type='number' value='"+ data.BTN +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data10' type='number' value='"+ data.BTN +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.DANAMON_SYARIAH == "0" || data.DANAMON_SYARIAH == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data11' type='number' value='"+ data.DANAMON_SYARIAH +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data11' type='number' value='"+ data.DANAMON_SYARIAH +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.OCBC_NISP == "0" || data.OCBC_NISP == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data12' type='number' value='"+ data.OCBC_NISP +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data12' type='number' value='"+ data.OCBC_NISP +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.UOB == "0" || data.UOB == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data13' type='number' value='"+ data.UOB +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data13' type='number' value='"+ data.UOB +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.DBS == "0" || data.DBS == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data14' type='number' value='"+ data.DBS +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data14' type='number' value='"+ data.DBS +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {if (data.CIMB_NIAGA == "0" || data.CIMB_NIAGA == null){
                                                            return "<td> Rp. <input style='text-align:right;' id='data15' type='number' value='"+ data.CIMB_NIAGA +"'></td>";
                                                            } else
                                                            return "<td> Rp. <input style='text-align:right;' id='data15' type='number' value='"+ data.CIMB_NIAGA +"'></td>";
                                                            },"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
            {"data":null,"render" : (data, type, row) => {return '<td> Rp. '+ new Intl.NumberFormat().format(data.TOTAL)+'</td>'},"createdCell" : (cell, cellData, rowata, rowIndex, colIndex) => {$(cell).css("text-align","right");}},
        ],
    });

    $(document).ready(function() {
        if (jenis == "RECEIPT PLACEMENT"){
            $('#container2').append('<button type="button" class="btn btn-primary" onclick="updateReceiptPlacement(\''+p_id_form+'\')">Set</button>');
        } else {
            $('#container2').append('<button type="button" class="btn btn-primary" onclick="updateGiroSpecial(\''+p_id_form+'\')">Set</button>');
        }
    });

    $("#close").click(function(){
        $('#set').remove();
        rincian_saldo.ajax.reload();
        kebutuhanPlacement.ajax.reload();
    })
}

function updateImprestPusat(p_id_form){

    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_imprest",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-a').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateImpor(p_id_form){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_impor",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-a').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateImprestOperasi(p_id_form){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_imprest_operasi",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-a').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateImprestInvestasi(p_id_form){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_imprest_invest",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-a').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateSettlement(p_id_form){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_Settelment",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-a').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updatePengadaanValas(p_id_form){
    var row = $("#table-imprest-pusat").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-imprest-pusat > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_proyeksi_valas",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-a').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateReceiptPlacement(p_id_form){
    var row = $("#table-receipt-placement").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-receipt-placement > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        map.data5 = cell.find('input#data5').val();
        map.data6 = cell.find('input#data6').val();
        map.data7 = cell.find('input#data7').val();
        map.data8 = cell.find('input#data8').val();
        map.data9 = cell.find('input#data9').val();
        map.data10 = cell.find('input#data10').val();
        map.data11 = cell.find('input#data11').val();
        map.data12 = cell.find('input#data12').val();
        map.data13 = cell.find('input#data13').val();
        map.data14 = cell.find('input#data14').val();
        map.data15 = cell.find('input#data15').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_receipt",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-b').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function updateGiroSpecial(p_id_form){
    var row = $("#table-receipt-placement").find('tr'),
        cells = row.find('td'),
        btnCell = $(this).parent();
    var list = [];

    $('#table-receipt-placement > tbody  > tr').each(function() {
        var cell = $(this).find('td');
        var map = {};
        var i = cell.find('input#data1').val();
        if (i === undefined) { return true; }
        map.data0 = cell.find('#data0').html();
        map.data1 = cell.find('input#data1').val();
        map.data2 = cell.find('input#data2').val();
        map.data3 = cell.find('input#data3').val();
        map.data4 = cell.find('input#data4').val();
        map.data5 = cell.find('input#data5').val();
        map.data6 = cell.find('input#data6').val();
        map.data7 = cell.find('input#data7').val();
        map.data8 = cell.find('input#data8').val();
        map.data9 = cell.find('input#data9').val();
        map.data10 = cell.find('input#data10').val();
        map.data11 = cell.find('input#data11').val();
        map.data12 = cell.find('input#data12').val();
        map.data13 = cell.find('input#data13').val();
        map.data14 = cell.find('input#data14').val();
        map.data15 = cell.find('input#data15').val();
        list.push(map)
    });

    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/ins_rekap_placement_giro_special",
        dataType: 'JSON',
        type: "POST",
        data : {
            pData: JSON.stringify(list),
            p_id_form : p_id_form
        },
        success: function (res) {
            console.log("res ins potensi : ",res);
            if(res.return == 1 || res.return == '1'){
                alert ("Data tersimpan");
//                $('#set-b').modal('hide');
                rincian_saldo.ajax.reload();
                kebutuhanPlacement.ajax.reload();
//                $('#set').remove();
            }else{
                alert ("Data gagal tersimpan");
            }

        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function generateExcel(){
    alert("Mohon maaf fitur ini belum tersedia");
}

