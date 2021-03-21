var tempTableSearch = "";
var kebutuhanPlacement;
var lcl_today = null;
var tanggal = new Date();
var tglAwal = new Date();
var tglAkhir = new Date();
var tanggal2 = new Date();
var time = tanggal.getHours();
var tempTableSearch = "";
var sesi = "";

$(document).ready(function () {
    let dd = String(tanggal.getDate()).padStart(2,'0');
    let mm = String(tanggal.getMonth() + 1).padStart(2,'0');
    let yyyy = tanggal.getFullYear();

    tglAwal = dd+'/'+mm+'/'+yyyy;

//    initDataTablePlacement();
    initDataTablePlacement2();

    if (time <= "14"){
        sesi = 1;
    } else if (time >= "14"){
        sesi = 2;
    }

    $("#tglcetak1").html(tanggal);
    $("#sesicetak1").html(sesi);
    $("#tglcetak2").html(tanggal);
    $("#sesicetak2").html(sesi);
    $("#tglApprove").html(tanggal);
    $('#tanggal_awal1').datepicker({dateFormat: 'dd/mm/yy'});
//    search("load");


    $("#dashboard-carousel").carousel({
        interval : 1000*5,
        pause : "hover",
    });
$("#dash_date").datepicker({dateFormat : "dd/mm/yy"});
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
    var selObj = document.getElementById("sesi_filter");
    var ss = selObj.options[selObj.selectedIndex].text;

    if ($("#tanggal_awal1").val() === "" && ss === " " && state !== "load") {
        alert("Mohon Isi Tanggal Terlebih Dahulu");
    } else if(state === "search"){
        let tgl = $('#tanggal_awal1').val();
        tanggal = tgl;

        if (ss === "Sesi 1"){
            ss = 1;
        } else if (ss === "Sesi 2"){
            ss = 2;
        }

        sesi = ss;
        $('#tglcetak1').html(tgl);
        $('#sesicetak1').html(ss);
        $('#tglcetak2').html(tgl);
        $('#sesicetak2').html(ss);
        initDataTablePlacement(tanggal, sesi);
        initDataTablePlacement2(tanggal, sesi);
    } else {
        initDataTablePlacement(tanggal, sesi);
        initDataTablePlacement2(tanggal, sesi);
    }
}

function initDataTablePlacement2(){

    showLoadingCss();
    $('#table-placement-lcl-header tbody').empty();
    $('#table-placement-lcl-header').dataTable().fnDestroy();

    kebutuhanPlacement = $("#table-placement-lcl-header").DataTable({
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
//            {width: 100, targets: 5},
//            {width: 100, targets: 6},
//            {width: 100, targets: 7},
//            {width: 100, targets: 8},
//            {width: "20%", "targets": 0},
            { className: "datatables_action", "targets": [1, 2, 3, 4, 5] },
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
                "aTargets": [4],
                "mRender": function (data, type, full) {
                    var ret_value = " ";
                    if (full.TIPE_KEBUTUHAN == "RECEIPT PLACEMENT" || full.TIPE_KEBUTUHAN == "GIRO SPECIAL RATE" ){
                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="setb(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
                    return ret_value;
                    }
//                    else {
//                    ret_value = '<div class="col-md-6 btn-group" align="center">' +
//                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
//                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
//                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
//                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
//                                '<button style="width: 15px !important;" id="detail" class="btn btn-duplicate-data btn-sm btn-primary" title="Set" onclick="seta(\''+full.TIPE_KEBUTUHAN+'\')"><i class="fa fa-clone"></i></button>';
//                    return ret_value; }
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
                        p_tgl_awal: tglAwal
                    }
                ,
                "dataSrc":
                function (res) {
                    hideLoadingCss()
                    localStorage.setItem("imprest_approval_status", (res.data.length <= 0) ? "" : res.data[0].STATUS_APPROVE);
                    localStorage.setItem("sesi", (res.data.length <= 0) ? "" : res.data[0].SESI);
                    localStorage.setItem("tanggal", (res.data.length <= 0) ? "" : res.data[0].TANGGAL);
                    return res.data;
                }
            },

         "createdRow" : function (row, data, dataIndex){

            if ((data["BANK"] === "TOTAL")){
                $(row).css({
                    "background-color": "#5ef4d3",
                    "font-weight": "bold",
                });
             }
         },

         "drawCallback" : function (setting, json) {
             let node = document.getElementById("button_action");
             node.innerHTML = "";

             let cur_periode = document.getElementById("tglcetak2").innerHTML;
             let darr = cur_periode.split("/");
             let now = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
             let periode = new Date(darr[2],darr[1]-1,darr[0]);

             let elements = document.getElementsByClassName('md-step');
             Array.prototype.forEach.call(elements,el => {
                 document.getElementById(el.id).classList.remove("active");
             });

             if (localStorage.getItem("imprest_approval_status") === "1"){
                 document.getElementById("staff_pe").className += " active";
             }else if(localStorage.getItem("imprest_approval_status") === "2"){
                 document.getElementById("staff_pe").className += " active";
                 document.getElementById("msb_pe").className += " active";
             }else if(localStorage.getItem("imprest_approval_status") === "3") {
                 document.getElementById("staff_pe").className += " active";
                 document.getElementById("msb_pe").className += " active";
                 document.getElementById("vp_pe").className += " active";
             }

             if(!periode.getTime() < now.getTime()){
                 $('.dataTables_filter2').each(function(){
//                     console.log("Ini data : " + data);
                     let html2;
                     if (localStorage.getItem("imprest_approval_status") === "0"){
                         if (newRoleUser[0] === "ROLE_ADMIN"){
                             html2 = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_lcl_data(1,'+localStorage.getItem("tanggal")+','+localStorage.getItem("sesi")+')" title="Approve"><i class="fas fa-check-square"></i></button>';
                         }
                     }else if(localStorage.getItem("imprest_approval_status") === "1"){
                         if (newRoleUser[0] === "ROLE_MSB_LOCAL_CURRENCY_LIQUIDITY" || newRoleUser[0] === "ROLE_ADMIN"){
                             html2 = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_lcl_data(2,'+localStorage.getItem("tanggal")+','+localStorage.getItem("sesi")+')" title="Approve"><i class="fas fa-check-square"></i></button>';
                             html2 += '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_lcl_data(1,'+localStorage.getItem("tanggal")+','+localStorage.getItem("sesi")+')" title="Reverse"><i class="fas fa-backspace"></i></button>';
                         }
                     }else if(localStorage.getItem("imprest_approval_status") === "2"){
                         if (newRoleUser[0] === "ROLE_VP_LIQUIDITY_AND_RECEIPT" || newRoleUser[0] === "ROLE_ADMIN"){
                             html2 = '<button class="btn btn-warning btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="update_lcl_data(3,'+localStorage.getItem("tanggal")+','+localStorage.getItem("sesi")+')" title="Approve"><i class="fas fa-check-square"></i></button>';
                             html2 += '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_lcl_data(2,'+localStorage.getItem("tanggal")+','+localStorage.getItem("sesi")+')" title="Reverse"><i class="fas fa-backspace"></i></button>';
                         }
                     }
                     else{
                         if (newRoleUser[0] === "ROLE_ADMIN"){
                             html2 = '<button class="btn btn-elementary btn-sm" style="margin-left: 10px; width: 35px;" type="button" onclick="reverse_lcl_data(3,'+localStorage.getItem("tanggal")+','+localStorage.getItem("sesi")+')" title="Reverse"><i class="fas fa-backspace"></i></button>';
                         }
                     }
                     $(this).append(html2);
                 })
             };
         }
     });

     kebutuhanPlacement.on('search.dt', function () {
         var value = $('.dataTables_filter2 input').val();
         tempTableSearch = value;
     });


    kebutuhanPlacement.columns.adjust();
}