/**
 * Created by israjhaliri on 9/22/17.
 */

var timeHideLoading = 1600;
var timeSowFormEdit = 1000;

function hideLoading(msg) {
    setTimeout(function () {
        waitingDialog.hide()
//        console.log(msg);
        if (msg != "") {
            alert(msg);
        }
    }, timeHideLoading);
}

function showLoadingCss() {
    $("#loader-div").show();
    $("header").hide();
    $("footer").hide();
    $(".app-body").hide();
}

function hideLoadingCss(msg) {
    if (msg == "" || (typeof msg == "undefined")) {
        // alert(typeof msg !== "undefined");
    } else {
        alert(msg)
    }

    $("#loader-div").hide();
    $("header").show();
    $("footer").show();
    $(".app-body").show();

}

function setSelectBank(idHtml, jenis, jenisBank, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_master/bank/get_data_bank",
        dataType: 'JSON',
        type: "GET",
        data: {
            pJenis: jenis,
            pJenisBank: jenisBank,
            pForm: form
        },
        success: function (res) {
//            console.log("bank deposito : ", res);
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectBank2(idHtml, jenis, jenisBank, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_master/bank/get_data_bank",
        dataType: 'JSON',
        type: "GET",
        data: {
            pJenis: jenis,
            pJenisBank: jenisBank,
            pForm: form
        },
        success: function (res) {
//            console.log("bank deposito : ", res);
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").select2("val",idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectCurr(idHtml, jenis, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_master/curr/get_data_curr",
        dataType: 'JSON',
        type: "GET",
        async: false,
        data: {
            pJenis: jenis,
            pForm: form
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectTenor(idHtml, jenis, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/tenor/get_data_list_tenor",
        dataType: 'JSON',
        type: "GET",
        data: {
            pJenis: jenis
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectKeterangan(idHtml, jenis, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_master/keterangan/get_data_list_keterangan",
        dataType: 'JSON',
        type: "GET",
        data: {
            pJenis: jenis,
            pForm: form
        },
        success: function (res) {
//            console.log(idForSelected);
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectSumberDana(idHtml, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/sumber_dana/get_data_list_sumber_dana",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectPeruntukanDana(idHtml, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/peruntukan_dana/get_data_list_peruntukan_dana",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectJenisPembayaran(idHtml, jenis, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/jenis_pembayaran/get_data_list_pembayaran",
        dataType: 'JSON',
        type: "GET",
        async :false,
        data: {
            pJenis: jenis
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
//            console.log("jenis pemb : ", idForSelected);
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pJenisPemabayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectKursJidor(idHtml, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/kurs/get_data_list_kurs_jidor",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectUnit(idHtml, jenisPembyaran, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/unit/get_data_list_unit_penerima",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pJenis: jenisPembyaran
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectVendor(idHtml, jenisPembyaran, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/vendor/get_data_vendor",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pJenis: jenisPembyaran
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected);
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectRole(idHtml, parent) {
    $.ajax({
        url: baseUrl + "api_master/user/get_role",
        dataType: 'JSON',
        type: "GET",
        data: {
            pParent: parent
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID + '">' + val.VALUE + '</option>');
            });

        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectRoleCkBox(idHtml, parent, isMaster) {
    $.ajax({
        url: baseUrl + "api_master/user/get_role",
        dataType: 'JSON',
        type: "GET",
        data: {
            pParent: parent,
            pisMaster: isMaster,
        },
        success: function (res) {
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<label style="margin: 5px" class="checkbox-inline"><input name="' + val.ID + '" id="' + val.ID + '" type="checkbox" value="' + val.ID + '"/> ' + val.VALUE + ' </label>');
            });

        },
        error: function () {
            $("#" + idHtml + "").html('-');
        }
    });
}

function getDataNow() {
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    return newDate
}