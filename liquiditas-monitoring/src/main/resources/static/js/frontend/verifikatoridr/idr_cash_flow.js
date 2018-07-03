/**
 * Created by israjhaliri on 1/22/18.
 */

$(document).ready(function () {
    initDataTable();
    setInterval(function () {
        initDataTable();
    }, 60000);
});

const no_urut = [20,21,22,23,24,71,72,73,74,81,82,83,86,87];

function initDataTable() {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_dashboard/idr_cash_flow",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var d = new Date(res.tglcetak);
            var datestring = dateToString(d);
            $("#tglcetak").html(datestring);
            $("#tgl1").html(datestring);
            $("#tgl2").html(incDate(d, 1));
            $("#tgl3").html(incDate(d, 2));
            $("#tgl4").html(incDate(d, 3));
            $("#tgl5").html(incDate(d, 4));
            $("#tgl6").html(incDate(d, 5));
            $("#tgl7").html(incDate(d, 6));

            if (res.return.length <= 0) {
                noDataView();
            } else {
                $('#table-main tbody').empty();
                $.each(res.return, function (key, val) {
                    var no = val.NOMOR;
                    if (no == null) {
                        no = "";
                    }
                    var canEdit = isCanEdit(val.NOURUT);
                    var warnaBgTable = val.WARNA;
                    var html = "";
                    if (canEdit == -1) {
                        html = '<tr>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="center">' + no + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'">'+ spasi(val.SPASI)+ val.KETERANGAN + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right"></td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL1, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL2, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL3, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL4, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL5, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL6, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL7, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TOTAL, 2, ".", ",") + '</td>'
                            '</tr>';
                    } else {
                        html = '<tr id="'+val.NOURUT+'">' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="center">' + no + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'">' + spasi(val.SPASI)+ val.KETERANGAN + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="center"><img src="/static/images/add.svg" height="12.5" width="12.5" onclick="showModal(\''+val.NOURUT+'\')"/></td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL1, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL2, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL3, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL4, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL5, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL6, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TANGGAL7, 2, ".", ",") + '</td>' +
                            '<td style="color: black" bgcolor="'+val.WARNA+'" align="right">' + accounting.formatNumber(val.TOTAL, 2, ".", ",") + '</td>'
                            '</tr>';
                    }
                    $('#table-main tbody').append(html);
                });
                hideLoadingCss()
            }
        },
        error: function () {
            noDataView();
        }
    });
}

function noDataView() {
    hideLoadingCss("");
    $('#table-main tbody').empty();
    var html = "<tr>" +
        "<td colspan='8' align='center'> No Data </td>" +
        "</tr>";
    $('#table-main  tbody').append(html);

}

function incDate(date, days) {
    date = new Date(date.getTime() + (86400000 * days));
    return date.getDate()  + "/" + (date.getMonth()+1) + "/" + date.getFullYear()
}

function isCanEdit(no) {
    return jQuery.inArray(no, no_urut);
}

function showModal(no_urut) {
    $("#modal-no-urut").val(no_urut);
    var tgl1 = document.getElementById("table-main").rows.namedItem(no_urut).cells[3].innerHTML;
    var tgl2 = document.getElementById("table-main").rows.namedItem(no_urut).cells[4].innerHTML;
    var tgl3 = document.getElementById("table-main").rows.namedItem(no_urut).cells[5].innerHTML;
    var tgl4 = document.getElementById("table-main").rows.namedItem(no_urut).cells[6].innerHTML;
    var tgl5 = document.getElementById("table-main").rows.namedItem(no_urut).cells[7].innerHTML;
    var tgl6 = document.getElementById("table-main").rows.namedItem(no_urut).cells[8].innerHTML;
    var tgl7 = document.getElementById("table-main").rows.namedItem(no_urut).cells[9].innerHTML;
    $("#modal-cash-flow").modal("show");
    var datestring = $("#tglcetak").html();
    var d = stringToDate(datestring);
    $("#id-modal-tgl1").html(datestring);
    $("#id-modal-tgl2").html(incDate(d, 1));
    $("#id-modal-tgl3").html(incDate(d, 2));
    $("#id-modal-tgl4").html(incDate(d, 3));
    $("#id-modal-tgl5").html(incDate(d, 4));
    $("#id-modal-tgl6").html(incDate(d, 5));
    $("#id-modal-tgl7").html(incDate(d, 6));
    $("#modal-tgl1").val(tgl1);
    $("#modal-tgl2").val(tgl2);
    $("#modal-tgl3").val(tgl3);
    $("#modal-tgl4").val(tgl4);
    $("#modal-tgl5").val(tgl5);
    $("#modal-tgl6").val(tgl6);
    $("#modal-tgl7").val(tgl7);
}


function stringToDate(_date) {
    var formatLowerCase= 'dd/mm/yyyy';
    var formatItems=formatLowerCase.split('/');
    var dateItems=_date.split('/');
    var monthIndex=formatItems.indexOf("mm");
    var dayIndex=formatItems.indexOf("dd");
    var yearIndex=formatItems.indexOf("yyyy");
    var month=parseInt(dateItems[monthIndex]);
    month-=1;
    var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

function dateToString(d) {
    return d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
}

function spasi(sp) {
    if (sp === 4 || sp === "4"){
      return '<a>&nbsp;&nbsp;&nbsp;&nbsp;</a>'
    }if (sp === 8 || sp === "8"){
      return '<a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>'
    }if (sp === 12 || sp === "12"){
      return '<a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>'
    }if (sp === 16 || sp === "16"){
      return '<a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>'
    }
}


function simpan() {
    var no_urut = Number.parseInt($("#modal-no-urut").val());
    var lbl_tgl1 = $("#id-modal-tgl1").html();
    var lbl_tgl2 = $("#id-modal-tgl2").html();
    var lbl_tgl3 = $("#id-modal-tgl3").html();
    var lbl_tgl4 = $("#id-modal-tgl4").html();
    var lbl_tgl5 = $("#id-modal-tgl5").html();
    var lbl_tgl6 = $("#id-modal-tgl6").html();
    var lbl_tgl7 = $("#id-modal-tgl7").html();
    var tgl1 = $("#modal-tgl1").val();
    var tgl2 = $("#modal-tgl2").val();
    var tgl3 = $("#modal-tgl3").val();
    var tgl4 = $("#modal-tgl4").val();
    var tgl5 = $("#modal-tgl5").val();
    var tgl6 = $("#modal-tgl6").val();
    var tgl7 = $("#modal-tgl7").val();
    var json = [
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl1,
            "nilai" : Number.parseFloat(tgl1)
        },
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl2,
            "nilai" : Number.parseFloat(tgl2)
        },
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl3,
            "nilai" : Number.parseFloat(tgl3)
        },
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl4,
            "nilai" : Number.parseFloat(tgl4)
        },
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl5,
            "nilai" : Number.parseFloat(tgl5)
        },
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl6,
            "nilai" : Number.parseFloat(tgl6)
        },
        {
            "noUrut" : no_urut,
            "tanggal" : lbl_tgl7,
            "nilai" : Number.parseFloat(tgl7)
        }
    ];
    console.log(json);
    $.ajax({
        url: baseUrl + "api_dashboard/ins_cash_flow_idr",
        dataType: 'JSON',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(json),
        success: function (d) {
            location.reload();
        },
        error: function (e) {
            alert(e);
        }
    })
}
