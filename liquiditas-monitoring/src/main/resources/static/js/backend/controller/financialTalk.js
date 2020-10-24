/**
 * Created by israjhaliri on 8/23/17.
 */
/**
 * Created by israjhaliri on 8/22/17.
 */
var table_rekapitulasi;
var idValas = "";
var allData;
var tempVendor = "";
var tempNilaiTagihan = "";
var tempUnit = "";
var tempTableSearch = "";

var checkedArray = new Array();
var cbParentArray = new Array();
var srcTglAwal = null;
var srcTglAkhir = null;
var addedDays = 2;

$(document).ready(function () {
    getDataRencana();
    getDataRealisasi();
});

function getDataRencana(){
    $.ajax({
        crossOrigin: true,
        type: "GET",
        url: baseUrl + "api_operator/dashboard_evp/get_data_rencana",
        cache: false,
        dataType : 'json',
        contentType: false,
        processData: false,
        success : (res) => {
            if (res.OUT_SALDO_AWAL.length > 0){
                let saldo_awal = Intl.NumberFormat().format(res.OUT_SALDO_AWAL[0].RP);
                $("#saldo_awal_rencana").html(saldo_awal);
            }
            if (res.OUT_SALDO_AKHIR.length > 0){
                let saldo_akhir = Intl.NumberFormat().format(res.OUT_SALDO_AKHIR[0].RP);
                $("#saldo_akhir_rencana").html(saldo_akhir);
            }
            if (res.OUT_PENERIMAAN.length > 0){
                let arr = res.OUT_PENERIMAAN;
                arr.forEach(function (value, index) {
                    let build = '<tr>';
                    if (index === 0){
                        build = build + '<td><h6><b>'+value.URAIAN+'</b></h6></td>\n' +
                            '                                        <td><b>'+Intl.NumberFormat().format(value.RP)+'</b></td>\n' +
                            '                                    </tr>'
                    }else{
                        build = build + '<td><span><i class="'+value.ICON+'"></i></span>&nbsp;'+value.URAIAN+'</td>\n'+
                        '<td>'+Intl.NumberFormat().format(value.RP)+'</td></tr>';
                    }
                    $("#table_rencana_left").append(build);
                });
            }
            if (res.OUT_BIAYA.length > 0){
                let arr = res.OUT_BIAYA;
                arr.forEach(function (value, index) {
                    let build = '<tr>';
                    if (index === 0){
                        build = build + '<td><h6><b>'+value.URAIAN+'</b></h6></td>\n' +
                            '                                        <td><b>'+Intl.NumberFormat().format(value.RP)+'</b></td>\n' +
                            '                                    </tr>'
                    }else{
                        build = build + '<td><span><i class="'+value.ICON+'"></i></span>&nbsp;'+value.URAIAN+'</td>\n'+
                            '<td>'+Intl.NumberFormat().format(value.RP)+'</td></tr>';
                    }
                    $("#table_rencana_right").append(build);
                });
            }
            console.log("Result : ",res);
        },
        error : (err) => {
            console.log("Error : ",err);
        }
    })
}

function getDataRealisasi(){
    $.ajax({
        crossOrigin: true,
        type: "GET",
        url: baseUrl + "api_operator/dashboard_evp/get_data_realisasi",
        cache: false,
        dataType : 'json',
        contentType: false,
        processData: false,
        success : (res) => {
            if (res.OUT_SALDO_AWAL.length > 0){
                let saldo_awal = Intl.NumberFormat().format(res.OUT_SALDO_AWAL[0].RP);
                $("#saldo_awal_realisasi").html(saldo_awal);
            }
            if (res.OUT_SALDO_AKHIR.length > 0){
                let saldo_akhir = Intl.NumberFormat().format(res.OUT_SALDO_AKHIR[0].RP);
                $("#saldo_akhir_realisasi").html(saldo_akhir);
            }
            if (res.OUT_PENERIMAAN.length > 0){
                let arr = res.OUT_PENERIMAAN;
                arr.forEach(function (value, index) {
                    let build = '<tr>';
                    if (index === 0){
                        build = build + '<td><h6><b>'+value.URAIAN+'</b></h6></td>\n' +
                            '                                        <td><b>'+Intl.NumberFormat().format(value.RP)+'</b></td>\n' +
                            '                                    </tr>'
                    }else{
                        build = build + '<td><span><i class="'+value.ICON+'"></i></span>&nbsp;'+value.URAIAN+'</td>\n'+
                            '<td>'+Intl.NumberFormat().format(value.RP)+'</td></tr>';
                    }
                    $("#table_realisasi_left").append(build);
                });
            }
            if (res.OUT_BIAYA.length > 0){
                let arr = res.OUT_BIAYA;
                arr.forEach(function (value, index) {
                    let build = '<tr>';
                    if (index === 0){
                        build = build + '<td><h6><b>'+value.URAIAN+'</b></h6></td>\n' +
                            '                                        <td><b>'+Intl.NumberFormat().format(value.RP)+'</b></td>\n' +
                            '                                    </tr>'
                    }else{
                        build = build + '<td><span><i class="'+value.ICON+'"></i></span>&nbsp;'+value.URAIAN+'</td>\n'+
                            '<td>'+Intl.NumberFormat().format(value.RP)+'</td></tr>';
                    }
                    $("#table_realisasi_right").append(build);
                });
            }
            console.log("Result : ",res);
        },
        error : (err) => {
            console.log("Error : ",err);
        }
    })
}