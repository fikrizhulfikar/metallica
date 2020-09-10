/**
 * Created by israjhaliri on 9/22/17.
 */

var timeHideLoading = 1600;
var timeSowFormEdit = 1000;
var nilaiAnggaran = "";
// var sso_key = 'METALLICA_TEST'; //<= for server dev
var sso_key = 'METALLICA' // <= sso for server prod
// var sso_key = 'METALLICA_DEV'; //<= for localhost
var sso_url = 'http://10.1.86.13:8070/dms/auth'; // <= prod
// var sso_url = 'http://10.14.153.156:8070/dms/auth';// <= dev

function hideLoading(msg) {
    setTimeout(function () {
        waitingDialog.hide()
        if (msg != "") {
            alert(msg);
        }
    }, timeHideLoading);
}

function createReferenceNumber(){
    let reference = null;
    let date = new Date();
    var dd = date.getDate();
    if (dd<10){
        dd='0'+dd;
    }
    let mm = date.getMonth()+1;
    if (mm<10){
        mm='0'+mm;
    }
    let yyyy = date.getFullYear();
    let hh = date.getHours();
    let ii = date.getMinutes();
    let SS = date.getSeconds();
    let sss = date.getMilliseconds();
    let rand = Math.floor(100 + Math.random() * 900);
    reference = yyyy+mm+dd+hh+ii+SS+sss+rand;
    return reference;
}

function doSso(){
    $.ajax({
        url : sso_url+"/sso",
        type : "GET",
        beforeSend : (xhr) => {
            xhr.setRequestHeader("App-Source",sso_key);
        },success : (res) => {
            if (res.status === 200){
                window.location.replace(res.data.uri);
            }
        },error : (err) => {
            alert("Something Wrong, Try Again Later!");
        }
    })
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

function setSelectMetodeBayar(idHtml,idSelectElement,idForSelected){
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_metode_bayar",
        dataType: 'JSON',
        type: "GET",
        sync :true,

        success: function (res) {
            // console.log("Select Hasil : ",res);
            $("#" + idHtml + "").html('');
            if (idSelectElement !== ""){
                $("#" + idHtml + "").append('<option value="ALL">SEMUA METODE BAYAR</option>');
            }
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.ID_METODE + '">'+val.METODE_PEMBAYARAN+'</option>');
            });
//            // // console.log("jenis pemb : ", idForSelected);
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idSelectElement).trigger('change');
            } else {
                $('#pBankPembayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="ALL">SEMUA METODE BAYAR</option>');
        }
    });
}

function setSelectBank(idHtml, jenis, jenisBank, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_master/bank/get_data_bank",
        dataType: 'JSON',
        type: "GET",
        sync: true,
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

function setSelectStatus(idHtml) {
    $("#" + idHtml + "").append('<option value="0">PENDING</option>');
    $("#" + idHtml + "").append('<option value="2">WAITING</option>');
}

function setSelectStatusTracking(idHtml) {
    $("#" + idHtml + "").append('<option value="1">INPUT DATA</option>');
    $("#" + idHtml + "").append('<option value="2">VERIFIED BY STAFF</option>');
    $("#" + idHtml + "").append('<option value="3">VERIFIED BY MANAGER</option>');
    $("#" + idHtml + "").append('<option value="4">VERIFIED BY MANAGER PE</option>');
    $("#" + idHtml + "").append('<option value="5">APPROVE BY VP TREASURY OPERATION</option>');
    $("#" + idHtml + "").append('<option value="6">APPROVE BY VP TREASURY INVESTMENT</option>');
    $("#" + idHtml + "").append('<option value="7">APPROVE BY EVP</option>');
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
        sync: true,
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
            $("#" + idHtml + "").html('<option value="ALL">SELURUH MATA UANG</option>');
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
        success: function PLOIHPILIH(res) {
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

function setSelectPosAnggaran(idHtml, tipeTransaksi,  idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/pos_anggaran/get_pos_anggaran",
        dataType: 'JSON',
        type: "GET",
        sync :true,
        data: {
            //pPosAnggaran: posAnggaran,
            pTipeTransaksi: tipeTransaksi
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
                $.each(res, function (key, val) {
                        $("#" + idHtml + "").append('<option value="' + val.ID_ANGGARAN + '">' + val.POS_ANGGARAN + '</option>');

                });

//            console.log("jenis pemb : ", idForSelected);

            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pPosAnggaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="">Pilih Data</option>');
        }
    });
}

function setSelectUnitAnggaran(idHtml ,idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/unit_anggaran/get_unit",
        dataType: 'JSON',
        type: "GET",
        sync :true,


        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.KODE_UNIT_EBUDGET + '">'+val.COMPANY_CODE+' - '+ val.COMPANY_NAME + '</option>');
            });
//            console.log("jenis pemb : ", idForSelected);
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pUnitAnggaran').val("null").trigger('change');
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
        sync :true,
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

function setSelectSubPosAnggaran(idHtml, posAnggaran, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/sub_pos_anggaran/get_sub_pos_anggaran",
        dataType: 'JSON',
        type: "GET",
        async : false,
        data: {
            pPosAnggaran: posAnggaran
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.KODE_POS_ANGGARAN + '">' + val.SUB_POS_ANGGARAN + '</option>');
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

function setSelectNilaiAnggaran(idHtml, subPosAnggaran, unitAnggaran) {
    if(subPosAnggaran!=""&&unitAnggaran!=""){
        $.ajax({
            url: baseUrl + "api_master/nilai_anggaran/get_nilai_anggaran",
            dataType: 'JSON',
            type: "GET",
            async : false,
            data: {
                pUnitAnggaran : unitAnggaran,
                pSubPosAnggaran: subPosAnggaran

            },
            success: function (res) {
                $("#" + idHtml + "").html('');

                $.each(res, function (key, val) {
                    var pNilaiAnggaran = val.SISA_ANGGARAN;
                    $("#" + idHtml + "").val(pNilaiAnggaran);

                    nilaiAnggaran = val.SISA_ANGGARAN;
                });

            },
            error: function () {
                $("#" + idHtml + "").html('-');
            }
        });
    }
}

function setSelectSisaAnggaran(idHtml, currency, nilaiTagihan) {
        $.ajax({
            url: baseUrl + "/api_operator/anggaran/get_sisa_anggaran",
            dataType: 'JSON',
            type: "GET",
            async : false,
            data: {
                pNilaiAnggaran : nilaiAnggaran,
                pCurrency: currency,
                pNilaiTagihan: nilaiTagihan

            },
            success: function (res) {
                $("#" + idHtml + "").html('');
                var pSisaAnggaran = res;
                $("#" + idHtml + "").val(pSisaAnggaran);
                console.log(res);

                // $.each(res, function (key, val) {
                //    //var pSisaAnggaran = val.SISA_ANGGARAN;
                //     console.log(val);
                //     $("#" + idHtml + "").val(pSisaAnggaran);
                // });

            },
            error: function () {
                $("#" + idHtml + "").html('-');
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


/**
 * Rekap data
 */
function showColumn() {
    $("#hide_column_modal").modal("show");
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_column",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            var response = res.data[0];

            if (response.NOMOR == 1) {
                $("#hc0").prop("checked", true);
            } else {
                $("#hc0").prop("checked", false);
            }
            if (response.JENIS_TAGIHAN == 1) {
                $("#hc1").prop("checked", true);
            } else {
                $("#hc1").prop("checked", false);
            }
            if (response.JENIS_PEMBAYARAN == 1) {
                $("#hc2").prop("checked", true);
            } else {
                $("#hc2").prop("checked", false);
            }
            if (response.UNIT_ANGGARAN == 1) {
                $("#hc3").prop("checked", true);
            } else {
                $("#hc3").prop("checked", false);
            }
            if (response.POS_ANGGARAN == 1) {
                $("#hc4").prop("checked", true);
            } else {
                $("#hc4").prop("checked", false);
            }
            if (response.SUB_POS_ANGGARAN == 1) {
                $("#hc5").prop("checked", true);
            } else {
                $("#hc5").prop("checked", false);
            }
            if (response.JATUH_TEMPO == 1) {
                $("#hc6").prop("checked", true);
            } else {
                $("#hc6").prop("checked", false);
            }
            if (response.VENDOR_NAME == 1) {
                $("#hc7").prop("checked", true);
            } else {
                $("#hc7").prop("checked", false);
            }
            if (response.CURRENCY == 1) {
                $("#hc8").prop("checked", true);
            } else {
                $("#hc8").prop("checked", false);
            }
            if (response.NILAI_TAGIHAN == 1) {
                $("#hc9").prop("checked", true);
            } else {
                $("#hc9").prop("checked", false);
            }
            if (response.NAMA_KONTRAK == 1) {
                $("#hc10").prop("checked", true);
            } else {
                $("#hc10").prop("checked", false);
            }
            if (response.BANK_TUJUAN == 1) {
                $("#hc11").prop("checked", true);
            } else {
                $("#hc11").prop("checked", false);
            }
            if (response.BANK_PEMBAYAR == 1) {
                $("#hc12").prop("checked", true);
            } else {
                $("#hc12").prop("checked", false);
            }
            if (response.TGL_TERIMA_TAGIHAN == 1) {
                $("#hc13").prop("checked", true);
            } else {
                $("#hc13").prop("checked", false);
            }
            if (response.TGL_TAGIHAN == 1) {
                $("#hc14").prop("checked", true);
            } else {
                $("#hc14").prop("checked", false);
            }
            if (response.NO_TAGIHAN == 1) {
                $("#hc15").prop("checked", true);
            } else {
                $("#hc15").prop("checked", false);
            }
            if (response.TGL_NOTA_DINAS == 1) {
                $("#hc16").prop("checked", true);
            } else {
                $("#hc16").prop("checked", false);
            }
            if (response.NO_NOTA_DINAS == 1) {
                $("#hc17").prop("checked", true);
            } else {
                $("#hc17").prop("checked", false);
            }
            if (response.TGL_PEMBAYARAN == 1) {
                $("#hc18").prop("checked", true);
            } else {
                $("#hc18").prop("checked", false);
            }
            if (response.COUNTDOWN == 1) {
                $("#hc19").prop("checked", true);
            } else {
                $("#hc19").prop("checked", false);
            }
            if (response.STATUS == 1) {
                $("#hc20").prop("checked", true);
            } else {
                $("#hc20").prop("checked", false);
            }
            if (response.TIPE_TRANSAKSI == 1) {
                $("#hc21").prop("checked", true);
            } else {
                $("#hc121").prop("checked", false);
            }
            if (response.NOMINAL_SBLM_PAJAK == 1) {
                $("#hc22").prop("checked", true);
            } else {
                $("#hc22").prop("checked", false);
            }
            if (response.PAJAK == 1) {
                $("#hc23").prop("checked", true);
            } else {
                $("#hc23").prop("checked", false);
            }
            if (response.NOMINAL_STLH_PAJAK == 1) {
                $("#hc24").prop("checked", true);
            } else {
                $("#hc24").prop("checked", false);
            }
            if (response.NOMINAL_UNDERLYING == 1) {
                $("#hc25").prop("checked", true);
            } else {
                $("#hc25").prop("checked", false);
            }
            if (response.NOMINAL_TANPA_UNDERLYING == 1) {
                $("#hc26").prop("checked", true);
            } else {
                $("#hc26").prop("checked", false);
            }
            if (response.KURS_JISDOR == 1) {
                $("#hc27").prop("checked", true);
            } else {
                $("#hc27").prop("checked", false);
            }
            if (response.SPREAD == 1) {
                $("#hc28").prop("checked", true);
            } else {
                $("#hc28").prop("checked", false);
            }
            if (response.KURS_TRANSAKSI == 1) {
                $("#hc29").prop("checked", true);
            } else {
                $("#hc29").prop("checked", false);
            }
            if (response.NOMINAL_PEMBAYARAN_IDR == 1) {
                $("#hc30").prop("checked", true);
            } else {
                $("#hc30").prop("checked", false);
            }
            if (response.CREATE_DATE_TAGIHAN == 1) {
                $("#hc31").prop("checked", true);
            } else {
                $("#hc31").prop("checked", false);
            }
            if (response.UPDATE_DATE_TAGIHAN == 1) {
                $("#hc32").prop("checked", true);
            } else {
                $("#hc32").prop("checked", false);
            }

            if (response.STATUS_TAGIHAN == 1) {
                $("#hc33").prop("checked", true);
            } else {
                $("#hc33").prop("checked", false);
            }
            /*if (response.STATUS == 1) {
                $("#hc20").prop("checked", true);
            } else {
                $("#hc20").prop("checked", false);
            }*/
            if (response.KETERANGAN == 1) {
                $("#hc34").prop("checked", true);
            } else {
                $("#hc34").prop("checked", false);
            }
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });

}

/**
 * Rekap data
 */
function saveColumn() {
    var hc0 = $("#hc0").prop('checked');
    var hc1 = $("#hc1").prop('checked');
    var hc2 = $("#hc2").prop('checked');
    var hc3 = $("#hc3").prop('checked');
    var hc4 = $("#hc4").prop('checked');
    var hc5 = $("#hc5").prop('checked');
    var hc6 = $("#hc6").prop('checked');
    var hc7 = $("#hc7").prop('checked');
    var hc8 = $("#hc8").prop('checked');
    var hc9 = $("#hc9").prop('checked');
    var hc10 = $("#hc10").prop('checked');
    var hc11 = $("#hc11").prop('checked');
    var hc12 = $("#hc12").prop('checked');
    var hc13 = $("#hc13").prop('checked');
    var hc14 = $("#hc14").prop('checked');
    var hc15 = $("#hc15").prop('checked');
    var hc16 = $("#hc16").prop('checked');
    var hc17 = $("#hc17").prop('checked');
    var hc18 = $("#hc18").prop('checked');
    var hc19 = $("#hc19").prop('checked');
    var hc20 = $("#hc20").prop('checked');
    var hc21 = $("#hc21").prop('checked');
    var hc22 = $("#hc22").prop('checked');
    var hc23 = $("#hc23").prop('checked');
    var hc24 = $("#hc24").prop('checked');
    var hc25 = $("#hc25").prop('checked');
    var hc26 = $("#hc26").prop('checked');
    var hc27 = $("#hc27").prop('checked');
    var hc28 = $("#hc28").prop('checked');
    var hc29 = $("#hc29").prop('checked');
    var hc30 = $("#hc30").prop('checked');
    var hc31 = $("#hc31").prop('checked');
    var hc32 = $("#hc32").prop('checked');
    var hc33 = $("#hc33").prop('checked');
    var hc34 = $("#hc34").prop('checked');

    var data = {
        "nomor" : hc0 == true ? 1 : 0,
        "jenis_tagihan" : hc1 == true ? 1 : 0,
        "jenis_pembayaran" : hc2 == true ? 1 : 0,
        "unit_anggaran" : hc3 == true ? 1 : 0,
        "pos_anggaran" : hc4 == true ? 1 : 0,
        "sub_pos_anggaran" : hc5 == true ? 1 : 0,
        "jatuh_tempo" : hc6 == true ? 1 : 0,
        "vendor" : hc7 == true ? 1 : 0,
        "currency" : hc8 == true ? 1 : 0,
        "nilai_tagihan" : hc9 == true ? 1 : 0,
        // "unit" : hc7 == true ? 1 : 0,
        "nama_kontrak" : hc10 == true ? 1 : 0,
        "bank_tujuan" : hc11 == true ? 1 : 0,
        "bank_pembayar" : hc12 == true ? 1 : 0,
        "tgl_terima_tagihan" : hc13 == true ? 1 : 0,
        "tgl_tagihan" : hc14 == true ? 1 : 0,
        "no_tagihan" : hc15 == true ? 1 : 0,
        "tgl_nota_dinas" : hc16 == true ? 1 : 0,
        "no_nota_dinas" : hc17 == true ? 1 : 0,
        "tgl_pembayaran" : hc18 == true ? 1 : 0,
        "countdown" : hc19 == true ? 1 : 0,
        "status" : hc20 == true ? 1 : 0,
        "tipe_transaksi" : hc21 == true ? 1 : 0,
        "nominal_sblm_pajak" : hc22 == true ? 1 : 0,
        "pajak" : hc23 == true ? 1 : 0,
        "nominal_stlh_pajak" : hc24 == true ? 1 : 0,
        "nominal_underlying" : hc25 == true ? 1 : 0,
        "nominal_tanpa_underlying" : hc26 == true ? 1 : 0,
        "kurs_jidor" : hc27 == true ? 1 : 0,
        "spread" : hc28 == true ? 1 : 0,
        "kurs_transaksi" : hc29 == true ? 1 : 0,
        "nominal_pembayaran_idr" : hc30 == true ? 1 : 0,
        "create_date" : hc31 == true ? 1 : 0,
        "update_date" : hc32 == true ? 1 : 0,
        "status_tagihan" : hc33 == true ? 1 : 0,
        "keterangan" : hc34 == true ? 1 : 0
    };
    // console.log("data save column", data);
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/save_column",
        dataType: 'JSON',
        type: "POST",
        data: data,
        success: function (res) {
            alert(res.data);
            document.location.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function getTotalTagihan() {
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_total_tagihan",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            bank: $("#cmb_bank").val(),
            cur: $("#cmb_currecny").val(),
            pembayaran: $("#cmb_jenis_pemabayaran").val(),
            status: $("#cmb_status").val(),
            statusTracking: $("#cmb_status_tracking").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_tagihan").html(res);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_total_per_currency",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            bank: $("#cmb_bank").val(),
            cur: $("#cmb_currecny").val(),
            pembayaran: $("#cmb_jenis_pemabayaran").val(),
            status: $("#cmb_status").val(),
            statusTracking: $("#cmb_status_tracking").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_per_currency").html('');
            var total_per_currency = $("#total_per_currency");
            res.forEach(function (value) {
                // console.log(value);
                var html = '<label class="form-control-label">' + '&nbsp;&nbsp;' +value.CURRENCY+' : <b>' + accounting.formatNumber(value.TOTAL, 2, ".", ",") + '</b></label>';
                total_per_currency.append(html);
            });
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function getTotalTagihan2() {
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_total_tagihan2",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            bank: $("#cmb_bank").val(),
            cur: $("#cmb_currecny").val(),
            pembayaran: $("#cmb_jenis_pemabayaran").val(),
            status: $("#cmb_status").val(),
            statusTracking: $("#cmb_status_tracking").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_tagihan").html(res);
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
    $.ajax({
        url: baseUrl + "api_operator/pembayaran/get_total_per_currency2",
        type: "GET",
        data: {
            tgl_awal: $("#tanggal_awal").val(),
            tgl_akhir: $("#tanggal_akhir").val(),
            bank: $("#cmb_bank").val(),
            cur: $("#cmb_currecny").val(),
            pembayaran: $("#cmb_jenis_pemabayaran").val(),
            status: $("#cmb_status").val(),
            statusTracking: $("#cmb_status_tracking").val(),
            search: tempTableSearch
        },
        success: function (res) {
            $("#total_per_currency").html('');
            var total_per_currency = $("#total_per_currency");
            res.forEach(function (value) {
                // console.log(value);
                var html = '<label class="form-control-label">' + '&nbsp;&nbsp;' +value.CURRENCY+' : <b>' + accounting.formatNumber(value.TOTAL, 2, ".", ",") + '</b></label>';
                total_per_currency.append(html);
            });
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function setSelectJenisTagihan(idHtml) {
    $("#" + idHtml + "").append('<option value="vanilla">Vanilla</option>');
    $("#" + idHtml + "").append('<option value="tripartite">Tripartite</option>');
    $("#" + idHtml + "").append('<option value="jisdor">Jisdor</option>');
}

function checkColumn(value) {
    $("#hc0").prop("checked", value);
    $("#hc1").prop("checked", value);
    $("#hc2").prop("checked", value);
    $("#hc3").prop("checked", value);
    $("#hc4").prop("checked", value);
    $("#hc5").prop("checked", value);
    $("#hc6").prop("checked", value);
    $("#hc7").prop("checked", value);
    $("#hc8").prop("checked", value);
    $("#hc9").prop("checked", value);
    $("#hc10").prop("checked", value);
    $("#hc11").prop("checked", value);
    $("#hc12").prop("checked", value);
    $("#hc13").prop("checked", value);
    $("#hc14").prop("checked", value);
    $("#hc15").prop("checked", value);
    $("#hc16").prop("checked", value);
    $("#hc17").prop("checked", value);
    $("#hc18").prop("checked", value);
    $("#hc19").prop("checked", value);
    $("#hc20").prop("checked", value);
    $("#hc21").prop("checked", value);
    $("#hc22").prop("checked", value);
    $("#hc23").prop("checked", value);
    $("#hc24").prop("checked", value);
    $("#hc25").prop("checked", value);
    $("#hc26").prop("checked", value);
    $("#hc27").prop("checked", value);
    $("#hc28").prop("checked", value);
    $("#hc29").prop("checked", value);
    $("#hc30").prop("checked", value);
    $("#hc31").prop("checked", value);
    $("#hc32").prop("checked", value);
    $("#hc33").prop("checked", value);
    $("#hc34").prop("checked", value);
    $("#hc35").prop("checked", value);
    $("#hc36").prop("checked", value);
    $("#hc37").prop("checked", value);
    $("#hc38").prop("checked", value);
    $("#hc39").prop("checked", value);
    $("#hc40").prop("checked", value);
    $("#hc41").prop("checked", value);
    $("#hc42").prop("checked", value);
    $("#hc43").prop("checked", value);
    $("#hc44").prop("checked", value);
    $("#hc45").prop("checked", value);
    $("#hc46").prop("checked", value);
    $("#hc47").prop("checked", value);
    $("#hc48").prop("checked", value);
    $("#hc49").prop("checked", value);
    $("#hc50").prop("checked", value);
    $("#hc51").prop("checked", value);
    $("#hc52").prop("checked", value);
    $("#hc53").prop("checked", value);
    $("#hc54").prop("checked", value);
    $("#hc55").prop("checked", value);
    $("#hc56").prop("checked", value);
    $("#hc57").prop("checked", value);
    $("#hc58").prop("checked", value);
    $("#hc59").prop("checked", value);
    $("#hc60").prop("checked", value);
    $("#hc61").prop("checked", value);
    $("#hc62").prop("checked", value);
    $("#hc63").prop("checked", value);
    $("#hc64").prop("checked", value);
    $("#hc65").prop("checked", value);
    $("#hc66").prop("checked", value);
    $("#hc67").prop("checked", value);
    $("#hc68").prop("checked", value);
    $("#hc69").prop("checked", value);
    $("#hc70").prop("checked", value);
    $("#hc71").prop("checked", value);
    $("#hc72").prop("checked", value);
    $("#hc73").prop("checked", value);
    $("#hc74").prop("checked", value);
    $("#hc75").prop("checked", value);
    $("#hc76").prop("checked", value);
    $("#hc77").prop("checked", value);
    $("#hc78").prop("checked", value);
    $("#hc79").prop("checked", value);
    $("#hc80").prop("checked", value);
    $("#hc81").prop("checked", value);
}

function setSelectJenisRekening(idHtml, jenis, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_jenis_rekening",
        dataType: 'JSON',
        type: "GET",
        sync: true,
        data: {
            pJenis: jenis,
            pForm: form
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.CATEGORY + '">' + val.CATEGORY + '</option>');
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

function setSelectTipeRekening(idHtml, jenis, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_tipe_rekening",
        dataType: 'JSON',
        type: "GET",
        sync: true,
        data: {
            pJenis: jenis,
            pForm: form
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.TIPE + '">' + val.TIPE + '</option>');
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

function setSelectBankSaldo(idHtml, jenis, idForSelected, form) {
    $.ajax({
        url: baseUrl + "api_operator/rekap_invoice_belum/get_bank",
        dataType: 'JSON',
        type: "GET",
        sync: true,
        data: {
            pJenis: jenis,
            pForm: form
        },
        success: function (res) {
            $("#" + idHtml + "").html('');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.BANK + '">' + val.BANK + '</option>');
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

function setSelectFilterBank(idHtml, jenis, idForSelected) {
    $.ajax({
        url: baseUrl + "api_master/filter/get_list_filter_bank",
        dataType: 'JSON',
        type: "GET",
        sync :true,
        success: function (res) {
            $("#" + idHtml + "").html('');
            $("#" + idHtml + "").append('<option value="ALL">SEMUA BANK</option>');
            $.each(res, function (key, val) {
                $("#" + idHtml + "").append('<option value="' + val.NAMA_BANK + '">' + val.NAMA_BANK + '</option>');
            });
//            console.log("jenis pemb : ", idForSelected);
            if (idForSelected != "") {
                $("#" + idHtml + "").val(idForSelected).trigger('change');
            } else {
                $('#pJenisPemabayaran').val("null").trigger('change');
            }
        },
        error: function () {
            $("#" + idHtml + "").html('<option value="ALL">SEMUA BANK</option>');
        }
    });
}