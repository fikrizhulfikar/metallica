var tempJenisSumber = "";

$(document).ready(function () {
    getPlacementAwal();
    getSumberDana();
    getListSumberDana();
    showLoadingCss();
});

function getSumberDana() {
    $.ajax({
        url: baseUrl + "api_operator/placement/get_sumber_placement",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            hideLoadingCss("")

             // console.log("sumber placement : ",res);

            $.each(res.return, function (key, val) {
                var str = val.BANK;
                var html = "<tr>" +
                    "<td align='left'>" + str + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.RECEIPT, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.KMK, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.SUBSIDI, 2, ".", ",") + "</td>" +
                    "<td align='right'>" + accounting.formatNumber(val.POTENSI, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-sumber-dana tbody').append(html);
            });
        },
        error: function () {
            hideLoadingCss("Gagal Sumber Dana")
        }
    });
}

function getListSumberDana(type) {
    $.ajax({
        url: baseUrl + "api_operator/placement/get_list_placement",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {

             // console.log("list placement : ",res);

            $.each(res.return, function (key, val) {
                if (val.JENIS == "valas" && val.NAMA_BANK == "MANDIRI") {
                    $('#total_valas_receipt_mandiri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_valas_subsidi_mandiri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_valas_kmk_mandiri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_valas_potensi_mandiri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "valas" && val.NAMA_BANK == "BNI") {
                    $('#total_valas_receipt_bni').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_valas_subsidi_bni').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_valas_kmk_bni').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_valas_potensi_bni').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "valas" && val.NAMA_BANK == "BRI") {
                    $('#total_valas_receipt_bri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_valas_subsidi_bri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_valas_kmk_bri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_valas_potensi_bri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "valas" && val.NAMA_BANK == "BUKOPIN") {
                    $('#total_valas_receipt_bukopin').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_valas_subsidi_bukopin').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_valas_kmk_bukopin').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_valas_potensi_bukopin').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }

                if (val.JENIS == "imprest" && val.NAMA_BANK == "MANDIRI") {
                    $('#total_imprest_receipt_mandiri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_imprest_subsidi_mandiri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_imprest_kmk_mandiri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_imprest_potensi_mandiri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "imprest" && val.NAMA_BANK == "BNI") {
                    $('#total_imprest_receipt_bni').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_imprest_subsidi_bni').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_imprest_kmk_bni').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_imprest_potensi_bni').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "imprest" && val.NAMA_BANK == "BRI") {
                    $('#total_imprest_receipt_bri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_imprest_subsidi_bri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_imprest_kmk_bri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_imprest_potensi_bri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "imprest" && val.NAMA_BANK == "BUKOPIN") {
                    $('#total_imprest_receipt_bukopin').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_imprest_subsidi_bukopin').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_imprest_kmk_bukopin').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_imprest_potensi_bukopin').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }

                if (val.JENIS == "investasi" && val.NAMA_BANK == "MANDIRI") {
                    $('#total_investasi_receipt_mandiri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_investasi_subsidi_mandiri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_investasi_kmk_mandiri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_investasi_potensi_mandiri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "investasi" && val.NAMA_BANK == "BNI") {
                    $('#total_investasi_receipt_bni').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_investasi_subsidi_bni').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_investasi_kmk_bni').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_investasi_potensi_bni').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "investasi" && val.NAMA_BANK == "BRI") {
                    $('#total_investasi_receipt_bri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_investasi_subsidi_bri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_investasi_kmk_bri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_investasi_potensi_bri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "investasi" && val.NAMA_BANK == "BUKOPIN") {
                    $('#total_investasi_receipt_bukopin').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_investasi_subsidi_bukopin').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_investasi_kmk_bukopin').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_investasi_potensi_bukopin').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }

                if (val.JENIS == "operasi" && val.NAMA_BANK == "MANDIRI") {
                    $('#total_operasi_receipt_mandiri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_operasi_subsidi_mandiri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_operasi_kmk_mandiri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_operasi_potensi_mandiri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "operasi" && val.NAMA_BANK == "BNI") {
                    $('#total_operasi_receipt_bni').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_operasi_subsidi_bni').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_operasi_kmk_bni').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_operasi_potensi_bni').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "operasi" && val.NAMA_BANK == "BRI") {
                    $('#total_operasi_receipt_bri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_operasi_subsidi_bri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_operasi_kmk_bri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_operasi_potensi_bri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "operasi" && val.NAMA_BANK == "BUKOPIN") {
                    $('#total_operasi_receipt_bukopin').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_operasi_subsidi_bukopin').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_operasi_kmk_bukopin').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_operasi_potensi_bukopin').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }

                if (val.JENIS == "impor" && val.NAMA_BANK == "MANDIRI") {
                    $('#total_impor_receipt_mandiri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_impor_subsidi_mandiri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_impor_kmk_mandiri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_impor_potensi_mandiri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "impor" && val.NAMA_BANK == "BNI") {
                    $('#total_impor_receipt_bni').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_impor_subsidi_bni').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_impor_kmk_bni').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_impor_potensi_bni').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "impor" && val.NAMA_BANK == "BRI") {
                    $('#total_impor_receipt_bri').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_impor_subsidi_bri').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_impor_kmk_bri').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_impor_potensi_bri').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
                if (val.JENIS == "impor" && val.NAMA_BANK == "BUKOPIN") {
                    $('#total_impor_receipt_bukopin').html(accounting.formatNumber(val.RECEIPT, 2, ".", ","));
                    $('#total_impor_subsidi_bukopin').html(accounting.formatNumber(val.SUBSIDI, 2, ".", ","));
                    $('#total_impor_kmk_bukopin').html(accounting.formatNumber(val.KMK, 2, ".", ","));
                    $('#total_impor_potensi_bukopin').html(accounting.formatNumber(val.POTENSI, 2, ".", ","));
                }
            });
        },
        error: function () {
            hideLoadingCss("Gagal Melakukan Proses,Harap Hubungi Administrator")
        }
    });
}

function getPlacementAwal() {
    $.ajax({
        url: baseUrl + "api_operator/placement/get_placement_awal",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            hideLoadingCss("")

            var valas = [];
            var imprest = [];
            var investasi = [];
            var operasi = [];
            var impor = [];
            $.each(res.return, function (index, value) {
                if (value.JENIS == "valas" && value.NAMA_BANK == "MANDIRI") {
                    temp = {
                        saldo_awal: {
                            mandiri: value.SALDO_AWAL
                        },
                        saldo_akhir: {
                            mandiri: value.SALDO_AKHIR,
                            tangal: value.TANGGAL
                        }
                    }
                    valas.push(temp)
                }

                if (value.JENIS == "imprest" && value.NAMA_BANK == "MANDIRI") {
                    temp = {
                        saldo_awal: {
                            mandiri: value.SALDO_AWAL,
                            tangal: value.TANGGAL
                        },
                        saldo_akhir: {
                            mandiri: value.SALDO_AKHIR,
                            tangal: value.TANGGAL
                        }
                    }
                    imprest.push(temp)
                }

                if (value.JENIS == "investasi" && value.NAMA_BANK == "MANDIRI") {
                    temp = {
                        saldo_awal: {
                            mandiri: value.SALDO_AWAL,
                            tangal: value.TANGGAL
                        },
                        saldo_akhir: {
                            mandiri: value.SALDO_AKHIR,
                            tangal: value.TANGGAL
                        }
                    }
                    investasi.push(temp)
                }

                if (value.JENIS == "operasi" && value.NAMA_BANK == "MANDIRI") {
                    temp = {
                        saldo_awal: {
                            mandiri: value.SALDO_AWAL,
                            tangal: value.TANGGAL
                        },
                        saldo_akhir: {
                            mandiri: value.SALDO_AKHIR,
                            tangal: value.TANGGAL
                        }
                    }
                    operasi.push(temp)
                }
                if (value.JENIS == "impor" && value.NAMA_BANK == "MANDIRI") {
                    temp = {
                        saldo_awal: {
                            mandiri: value.SALDO_AWAL,
                            tangal: value.TANGGAL
                        },
                        saldo_akhir: {
                            mandiri: value.SALDO_AKHIR,
                            tangal: value.TANGGAL
                        }
                    }
                    impor.push(temp)
                }
            });

            var investasi_bri_index = 0;
            var investasi_bni_index = 0;
            var investasi_bukopin_index = 0;
            var valas_bri_index = 0;
            var valas_bni_index = 0;
            var valas_bukopin_index = 0;
            var imprest_bri_index = 0;
            var imprest_bni_index = 0;
            var imprest_bukopin_index = 0;
            var operasi_bri_index = 0;
            var operasi_bni_index = 0;
            var operasi_bukopin_index = 0;
            var impor_bri_index = 0;
            var impor_bni_index = 0;
            var impor_bukopin_index = 0;
            $.each(res.return, function (index, value) {
                if (value.JENIS == "valas" && value.NAMA_BANK == "BNI") {
                    valas[valas_bni_index].saldo_awal.bni = value.SALDO_AWAL;
                    valas[valas_bni_index].saldo_akhir.bni = value.SALDO_AKHIR;
                    valas_bni_index++;
                }
                if (value.JENIS == "valas" && value.NAMA_BANK == "BRI") {
                    valas[valas_bri_index].saldo_awal.bri = value.SALDO_AWAL;
                    valas[valas_bri_index].saldo_akhir.bri = value.SALDO_AKHIR;
                    valas_bri_index++;
                }

                if (value.JENIS == "valas" && value.NAMA_BANK == "BUKOPIN") {
                    valas[valas_bukopin_index].saldo_awal.bukopin = value.SALDO_AWAL;
                    valas[valas_bukopin_index].saldo_akhir.bukopin = value.SALDO_AKHIR;
                    valas_bukopin_index++;
                }
                if (value.JENIS == "imprest" && value.NAMA_BANK == "BNI") {
                    imprest[imprest_bni_index].saldo_awal.bni = value.SALDO_AWAL;
                    imprest[imprest_bni_index].saldo_akhir.bni = value.SALDO_AKHIR;
                    imprest_bni_index++;
                }
                if (value.JENIS == "imprest" && value.NAMA_BANK == "BRI") {
                    imprest[imprest_bri_index].saldo_awal.bri = value.SALDO_AWAL;
                    imprest[imprest_bri_index].saldo_akhir.bri = value.SALDO_AKHIR;
                    imprest_bri_index++;
                }
                if (value.JENIS == "imprest" && value.NAMA_BANK == "BUKOPIN") {
                    imprest[imprest_bukopin_index].saldo_awal.bukopin = value.SALDO_AWAL;
                    imprest[imprest_bukopin_index].saldo_akhir.bukopin = value.SALDO_AKHIR;
                    imprest_bukopin_index++;
                }
                if (value.JENIS == "investasi" && value.NAMA_BANK == "BNI") {
                    investasi[investasi_bni_index].saldo_awal.bni = value.SALDO_AWAL;
                    investasi[investasi_bni_index].saldo_akhir.bni = value.SALDO_AKHIR;
                    investasi_bni_index++;
                }

                if (value.JENIS == "investasi" && value.NAMA_BANK == "BRI") {
                    investasi[investasi_bri_index].saldo_awal.bri = value.SALDO_AWAL;
                    investasi[investasi_bri_index].saldo_akhir.bri = value.SALDO_AKHIR;
                    investasi_bri_index++;
                }

                if (value.JENIS == "investasi" && value.NAMA_BANK == "BUKOPIN") {
                    investasi[investasi_bukopin_index].saldo_awal.bukopin = value.SALDO_AWAL;
                    investasi[investasi_bukopin_index].saldo_akhir.bukopin = value.SALDO_AKHIR;
                    // console.log("SALDO AKHIR: " + value.SALDO_AKHIR);
                    investasi_bukopin_index++;
                }

                if (value.JENIS == "operasi" && value.NAMA_BANK == "BNI") {
                    operasi[operasi_bni_index].saldo_awal.bni = value.SALDO_AWAL;
                    operasi[operasi_bni_index].saldo_akhir.bni = value.SALDO_AKHIR;
                    operasi_bni_index++;
                }
                if (value.JENIS == "operasi" && value.NAMA_BANK == "BRI") {
                    operasi[operasi_bri_index].saldo_awal.bri = value.SALDO_AWAL;
                    operasi[operasi_bri_index].saldo_akhir.bri = value.SALDO_AKHIR;
                    operasi_bri_index++;
                }
                if (value.JENIS == "operasi" && value.NAMA_BANK == "BUKOPIN") {
                    operasi[operasi_bukopin_index].saldo_awal.bukopin = value.SALDO_AWAL;
                    operasi[operasi_bukopin_index].saldo_akhir.bukopin = value.SALDO_AKHIR;
                    operasi_bukopin_index++;
                }
                if (value.JENIS == "impor" && value.NAMA_BANK == "BNI") {
                    impor[impor_bni_index].saldo_awal.bni = value.SALDO_AWAL;
                    impor[impor_bni_index].saldo_akhir.bni = value.SALDO_AKHIR;
                    impor_bni_index++;
                }
                if (value.JENIS == "impor" && value.NAMA_BANK == "BRI") {
                    impor[impor_bri_index].saldo_awal.bri = value.SALDO_AWAL;
                    impor[impor_bri_index].saldo_akhir.bri = value.SALDO_AKHIR;
                    impor_bri_index++;
                }
                if (value.JENIS == "impor" && value.NAMA_BANK == "BUKOPIN") {
                    impor[impor_bukopin_index].saldo_awal.bukopin = value.SALDO_AWAL;
                    impor[impor_bukopin_index].saldo_akhir.bukopin = value.SALDO_AKHIR;
                    impor_bukopin_index++;
                }
            });

            // console.log("valas : ", valas);
            // console.log("imprest : ", imprest);
            // console.log("investasi : ", investasi);
            // console.log("operasi : ", operasi);
            // console.log("impor : ", impor);

            if (valas.length > 0) {
                var html_saldo = "<tr id='saldo_awal_valas'>\n" +
                    "<td align='left' colspan=\"2\">SALDO AWAL</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(valas[0].saldo_awal.mandiri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(valas[0].saldo_awal.bri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(valas[0].saldo_awal.bni, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(valas[0].saldo_awal.bukopin, 2, ".", ",") + "</td>\n" +
                    "</tr>";

                $("#table-imprest-valas tbody #saldo_awal_valas").replaceWith(html_saldo);

                var html_saldo_akhir = "";
                for (var ivalas = 0; ivalas < valas.length; ivalas++) {
                    html_saldo_akhir += "<tr id='saldo_akhir_valas'>\n" +
                        "<td align='left' colspan=\"2\">SALDO " + valas[ivalas].saldo_akhir.tangal + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(valas[ivalas].saldo_akhir.mandiri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(valas[ivalas].saldo_akhir.bri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(valas[ivalas].saldo_akhir.bni, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(valas[ivalas].saldo_akhir.bukopin, 2, ".", ",") + "</td>\n" +
                        "</tr>";
                }
                $("#table-imprest-valas tbody #saldo_akhir_valas").replaceWith(html_saldo_akhir)
            }

            if (imprest.length > 0) {
                var html_saldo = "<tr id='saldo_awal_imprest'>\n" +
                    "<td align='left' colspan=\"2\">SALDO AWAL</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(imprest[0].saldo_awal.mandiri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(imprest[0].saldo_awal.bri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(imprest[0].saldo_awal.bni, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(imprest[0].saldo_awal.bukopin, 2, ".", ",") + "</td>\n" +
                    "</tr>";

                $("#table-imprest tbody #saldo_awal_imprest").replaceWith(html_saldo);

                var html_saldo_akhir = "";
                for (var iimprest = 0; iimprest < imprest.length; iimprest++) {
                    html_saldo_akhir += "<tr id='saldo_akhir_imprest'>\n" +
                        "<td align='left' colspan=\"2\">SALDO " + imprest[iimprest].saldo_akhir.tangal + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(imprest[iimprest].saldo_akhir.mandiri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(imprest[iimprest].saldo_akhir.bri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(imprest[iimprest].saldo_akhir.bni, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(imprest[iimprest].saldo_akhir.bukopin, 2, ".", ",") + "</td>\n" +
                        "</tr>";
                }
                $("#table-imprest tbody #saldo_akhir_imprest").replaceWith(html_saldo_akhir)
            }

            if (investasi.length > 0) {
                var html_saldo = "<tr id='saldo_awal_investasi'>\n" +
                    "<td align='left' colspan=\"2\">SALDO AWAL</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(investasi[0].saldo_awal.mandiri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(investasi[0].saldo_awal.bri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(investasi[0].saldo_awal.bni, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(investasi[0].saldo_awal.bukopin, 2, ".", ",") + "</td>\n" +
                    "</tr>";

                $("#table-investasi tbody #saldo_awal_investasi").replaceWith(html_saldo);

                var html_saldo_akhir = "";
                for (var iinvestasi = 0; iinvestasi < investasi.length; iinvestasi++) {
                    html_saldo_akhir += "<tr id='saldo_akhir_investasi'>\n" +
                        "<td align='left' colspan=\"2\">SALDO " + investasi[iinvestasi].saldo_akhir.tangal + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(investasi[iinvestasi].saldo_akhir.mandiri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(investasi[iinvestasi].saldo_akhir.bri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(investasi[iinvestasi].saldo_akhir.bni, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(investasi[iinvestasi].saldo_akhir.bukopin, 2, ".", ",") + "</td>\n" +
                        "</tr>";
                }
                $("#table-investasi tbody #saldo_akhir_ivestasi").replaceWith(html_saldo_akhir)
            }

            if (operasi.length > 0) {
                var html_saldo = "<tr id='saldo_awal_operasi'>\n" +
                    "<td align='left' colspan=\"2\">SALDO AWAL</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(operasi[0].saldo_awal.mandiri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(operasi[0].saldo_awal.bri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(operasi[0].saldo_awal.bni, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(operasi[0].saldo_awal.bukopin, 2, ".", ",") + "</td>\n" +
                    "</tr>";

                $("#table-operasi tbody #saldo_awal_operasi").replaceWith(html_saldo);

                var html_saldo_akhir = "";
                for (var ioperasi = 0; ioperasi < operasi.length; ioperasi++) {
                    html_saldo_akhir += "<tr id='saldo_akhir_operasi'>\n" +
                        "<td align='left' colspan=\"2\">SALDO " + operasi[ioperasi].saldo_akhir.tangal + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(operasi[ioperasi].saldo_akhir.mandiri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(operasi[ioperasi].saldo_akhir.bri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(operasi[ioperasi].saldo_akhir.bni, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(operasi[ioperasi].saldo_akhir.bukopin, 2, ".", ",") + "</td>\n" +
                        "</tr>";
                }
                $("#table-operasi tbody #saldo_akhir_operasi").replaceWith(html_saldo_akhir)
            }

            if (impor.length > 0) {
                var html_saldo = "<tr id='saldo_awal_impor'>\n" +
                    "<td align='left' colspan=\"2\">SALDO AWAL</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(impor[0].saldo_awal.mandiri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(impor[0].saldo_awal.bri, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(impor[0].saldo_awal.bni, 2, ".", ",") + "</td>\n" +
                    "<td align='right'>" + accounting.formatNumber(impor[0].saldo_awal.bukopin, 2, ".", ",") + "</td>\n" +
                    "</tr>";

                $("#table-impor tbody #saldo_awal_import").replaceWith(html_saldo);

                var html_saldo_akhir = "";
                for (var iimpor = 0; iimpor < impor.length; iimpor++) {
                    html_saldo_akhir += "<tr id='saldo_akhir_impor'>\n" +
                        "<td align='left' colspan=\"2\">SALDO " + impor[iimpor].saldo_akhir.tangal + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(impor[iimpor].saldo_akhir.mandiri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(impor[iimpor].saldo_akhir.bri, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(impor[iimpor].saldo_akhir.bni, 2, ".", ",") + "</td>\n" +
                        "<td align='right'>" + accounting.formatNumber(impor[iimpor].saldo_akhir.bukopin, 2, ".", ",") + "</td>\n" +
                        "</tr>";
                }
                $("#table-impor tbody #saldo_akhir_impor").replaceWith(html_saldo_akhir)
            }
        },
        error: function () {
            hideLoadingCss("Gagal Ambil Placement Awal")
        }
    });
}

var tempJenis;
var tempSumberDana;
function openSetDana(pJenis, pJenisSumber, pSumberDana) {
    tempJenisSumber = pJenisSumber;
    showLoadingCss();
    var tempData = [];
    $.ajax({
        url: baseUrl + "api_operator/placement/get_sumber_placement",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            hideLoadingCss("")

            tempJenis = pJenis;
            tempSumberDana = pSumberDana;
            // console.log("sumber dana : ", pSumberDana);
            // console.log("sumber placement for set dana : ", res);

            $.each(res.return, function (key, val) {
                // receipt
                if (pSumberDana == '1') {
                    var tmp = {
                        bank: val.BANK,
                        saldo: val.RECEIPT,
                    }
                    tempData.push(tmp)
                }
                // kmk
                if (pSumberDana == '2') {
                    var tmp = {
                        bank: val.BANK,
                        saldo: val.KMK
                    }
                    tempData.push(tmp)
                }
                // subsidi
                if (pSumberDana == '3') {
                    var tmp = {
                        bank: val.BANK,
                        saldo: val.SUBSIDI
                    }
                    tempData.push(tmp)
                }
                // potensi
                if (pSumberDana == '4') {
                    var tmp = {
                        bank: val.BANK,
                        saldo: val.POTENSI
                    }
                    tempData.push(tmp)
                }
            });

            if (tempData.length < 1) {
                alert("Gagal Ambil Saldo Awal");
            } else {
                $.ajax({
                    url: baseUrl + "api_operator/placement/get_detil_sumber_dana",
                    dataType: 'JSON',
                    type: "GET",
                    data: {
                        pJenis: pJenis,
                        pJenisSumberDana: pSumberDana
                    },
                    success: function (res) {
                        hideLoadingCss("")

                        // console.log("detil sumber dana : ", res);

                        $.each(res.return, function (index, val) {
//                        jika salah kode bank pengirim berarti urutanya tidak betul
//                            // console.log(val.KODE_BANK);
                            tempData[index].mandiri = val.NILAI_PLACEMENT;
                            tempData[index].kode_bank_mandiri = val.KODE_BANK;
                            tempData[index].kode_bank_tujuan_mandiri = val.KODE_BANK_TUJUAN;
                        });

                        $.each(res.OUT_BNI, function (index, val) {
                            tempData[index].bni = val.NILAI_PLACEMENT;
                            tempData[index].kode_bank_bni = val.KODE_BANK;
                            tempData[index].kode_bank_tujuan_bni = val.KODE_BANK_TUJUAN;
                        });

                        $.each(res.OUT_BRI, function (index, val) {
                            tempData[index].bri = val.NILAI_PLACEMENT;
                            tempData[index].kode_bank_bri = val.KODE_BANK;
                            tempData[index].kode_bank_tujuan_bri = val.KODE_BANK_TUJUAN;
                        });

                        $.each(res.OUT_BUKOPIN, function (index, val) {
                            tempData[index].bukopin = val.NILAI_PLACEMENT;
                            tempData[index].kode_bank_bukopin = val.KODE_BANK;
                            tempData[index].kode_bank_tujuan_bukopin = val.KODE_BANK_TUJUAN;
                        });


                        $('#table-set-dana tbody').empty();
                        for (var i = 0; i < tempData.length; i++) {
                            if(newRoleUser[0] == "ROLE_MS_PENDAPATAN" || newRoleUser[0] == "ROLE_DM_INSTANSI_VERTIKAL" || newRoleUser[0] == "ROLE_DM_RECEIPT" || newRoleUser[0] == "ROLE_DM_TERPUSAT"){
                                  var html = "<tr>" +
                                       "<td align='left'> "+tempData[i].bank+" </td>" +
                                       "<td align='right'>" + accounting.formatNumber(tempData[i].saldo, 2, ".", ",") + "</td>" +
                                       "<td align='center'><input disabled='disabled' class='inp-mandiri' type='number' value='"+tempData[i].mandiri+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-mandiri' type='text' value='"+tempData[i].kode_bank_mandiri+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-mandiri' type='text' value='"+tempData[i].kode_bank_tujuan_mandiri+"'></td>" +
                                       "<td align='center'><input disabled='disabled' class='inp-bri' type='number' value='"+tempData[i].bri+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-bri' type='text' value='"+tempData[i].kode_bank_bri+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-bri' type='text' value='"+tempData[i].kode_bank_tujuan_bri+"'></td>" +
                                       "<td align='center'><input disabled='disabled' class='inp-bni' type='number' value='"+tempData[i].bni+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-bni' type='text' value='"+tempData[i].kode_bank_bni+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-bni' type='text' value='"+tempData[i].kode_bank_tujuan_bni+"'></td>" +
                                       "<td align='center'><input disabled='disabled' class='inp-bukopin' type='number' value='"+tempData[i].bukopin+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-bukopin' type='text' value='"+tempData[i].kode_bank_bukopin+"'></td>" +
                                       "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-bukopin' type='text' value='"+tempData[i].kode_bank_tujuan_bukopin+"'></td>" +
                                       "</tr>";

                                   $('#table-set-dana tbody').append(html);
                            }else{

                                 if(tempData[i].saldo < 1){
                                     var html = "<tr>" +
                                         "<td align='left'> "+tempData[i].bank+" </td>" +
                                         "<td align='right'>" + accounting.formatNumber(tempData[i].saldo, 2, ".", ",") + "</td>" +
                                         "<td align='center'><input disabled='disabled' class='inp-mandiri' type='number' value='"+tempData[i].mandiri+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-mandiri' type='text' value='"+tempData[i].kode_bank_mandiri+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-mandiri' type='text' value='"+tempData[i].kode_bank_tujuan_mandiri+"'></td>" +
                                         "<td align='center'><input disabled='disabled' class='inp-bri' type='number' value='"+tempData[i].bri+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-bri' type='text' value='"+tempData[i].kode_bank_bri+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-bri' type='text' value='"+tempData[i].kode_bank_tujuan_bri+"'></td>" +
                                         "<td align='center'><input disabled='disabled' class='inp-bni' type='number' value='"+tempData[i].bni+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-bni' type='text' value='"+tempData[i].kode_bank_bni+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-bni' type='text' value='"+tempData[i].kode_bank_tujuan_bni+"'></td>" +
                                         "<td align='center'><input disabled='disabled' class='inp-bukopin' type='number' value='"+tempData[i].bukopin+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-bukopin' type='text' value='"+tempData[i].kode_bank_bukopin+"'></td>" +
                                         "<td style='display:none;' align='center'><input disabled='disabled' class='inp-kode-bank-tujuan-bukopin' type='text' value='"+tempData[i].kode_bank_tujuan_bukopin+"'></td>" +
                                         "</tr>";

                                     $('#table-set-dana tbody').append(html);
                                 }else{
                                    var html = "<tr>" +
                                        "<td align='left'> "+tempData[i].bank+" </td>" +
                                         "<td align='right'>" + accounting.formatNumber(tempData[i].saldo, 2, ".", ",") + "</td>" +
                                         "<td align='center'><input class='inp-mandiri' type='number' value='"+tempData[i].mandiri+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-mandiri' type='text' value='"+tempData[i].kode_bank_mandiri+"'></td>" +
                                         "<td style='display:none;' align='center'><input class='inp-kode-bank-tujuan-mandiri' type='text' value='"+tempData[i].kode_bank_tujuan_mandiri+"'></td>" +
                                         "<td align='center'><input class='inp-bri' type='number' value='"+tempData[i].bri+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-bri' type='text' value='"+tempData[i].kode_bank_bri+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-tujuan-bri' type='text' value='"+tempData[i].kode_bank_tujuan_bri+"'></td>" +
                                         "<td align='center'><input class='inp-bni' type='number' value='"+tempData[i].bni+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-bni' type='text' value='"+tempData[i].kode_bank_bni+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-tujuan-bni' type='text' value='"+tempData[i].kode_bank_tujuan_bni+"'></td>" +
                                         "<td align='center'><input class='inp-bukopin' type='number' value='"+tempData[i].bukopin+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-bukopin' type='text' value='"+tempData[i].kode_bank_bukopin+"'></td>" +
                                         "<td style='display:none;' align='center'><input   class='inp-kode-bank-tujuan-bukopin' type='text' value='"+tempData[i].kode_bank_tujuan_bukopin+"'></td>" +
                                        "</tr>";

                                    $('#table-set-dana tbody').append(html);
                                 }
                            }
                        }

                        $('#modal-sumber-dana').modal({backdrop: 'static', keyboard: false});

                    },
                    error: function () {
                        hideLoadingCss("Gagal Ambil Detil Dana")
                    }
                });
            }
        },
        error: function () {
            hideLoadingCss()
        }
    });
}

function recordSetDana() {
    $('#modal-sumber-dana').modal('hide');
    showLoadingCss();
    var d = new Date();
    var time = d.getTime();

    var mandiri = [];
    var bni = [];
    var bri = [];
    var bukopin = [];

    $('.inp-mandiri').each(function(index, value){
        var temp = {
            value : $(this).val(),
            kode_bank : null,
            kode_bank_tujuan : null
        }
        mandiri.push(temp)
    })
    $('.inp-bni').each(function(){
        var temp = {
            value : $(this).val(),
            kode_bank : null,
            kode_bank_tujuan : null
        }
        bni.push(temp);
    })
    $('.inp-bri').each(function(){
        var temp = {
            value : $(this).val(),
            kode_bank : null,
            kode_bank_tujuan : null
        }
        bri.push(temp);
    })
    $('.inp-bukopin').each(function(){
        var temp = {
            value : $(this).val(),
            kode_bank : null,
            kode_bank_tujuan : null
        }
        bukopin.push(temp);
    })


    for(var i_mandiri = 0; i_mandiri < mandiri.length; i_mandiri++){
        mandiri[i_mandiri].kode_bank = $('.inp-kode-bank-mandiri')[i_mandiri].value
        mandiri[i_mandiri].kode_bank_tujuan = $('.inp-kode-bank-tujuan-mandiri')[i_mandiri].value
    }

    for(var i_bni = 0; i_bni < bni.length; i_bni++){
        bni[i_bni].kode_bank = $('.inp-kode-bank-bni')[i_bni].value
        bni[i_bni].kode_bank_tujuan = $('.inp-kode-bank-tujuan-bni')[i_bni].value
    }

    for(var i_bri = 0; i_bri < bri.length; i_bri++){
        bri[i_bri].kode_bank = $('.inp-kode-bank-bri')[i_bri].value
        bri[i_bri].kode_bank_tujuan = $('.inp-kode-bank-tujuan-bri')[i_bri].value
    }

    for(var i_bukopin = 0; i_bukopin < bukopin.length; i_bukopin++){
        bukopin[i_bukopin].kode_bank = $('.inp-kode-bank-bukopin')[i_bukopin].value
        bukopin[i_bukopin].kode_bank_tujuan = $('.inp-kode-bank-tujuan-bukopin')[i_bukopin].value
    }

    // console.log(mandiri);
    // console.log(bni);
    // console.log(bri);
    // console.log(bukopin);

    total_mandiri = 0;
    total_bni = 0;
    total_bri = 0;
    total_bukopin = 0;

    for(var j_mandiri = 0; j_mandiri < mandiri.length; j_mandiri++){
        // console.log("run mandiri : ", j_mandiri, mandiri.length);
        insHistoryPlacement(mandiri[j_mandiri].value, mandiri[j_mandiri].kode_bank_tujuan, mandiri[j_mandiri].kode_bank,time)
        total_mandiri = total_mandiri + mandiri[j_mandiri].value;
        if(j_mandiri == mandiri.length-1){
            for(var j_bni = 0; j_bni < bni.length; j_bni++){

                // console.log("run bni");
                insHistoryPlacement(bni[j_bni].value, bni[j_bni].kode_bank_tujuan, bni[j_bni].kode_bank,time)
                total_bni = total_bni + bni[j_bni].value
                if(j_bni == bni.length-1){
                    for(var j_bri = 0; j_bri < bri.length; j_bri++){

                        // console.log("run bri");
                        insHistoryPlacement(bri[j_bri].value, bri[j_bri].kode_bank_tujuan, bri[j_bri].kode_bank,time)
                        total_bri = total_bri + bri[j_bri].value
                        if(j_bri == bri.length-1){
                            for(var j_bukopin = 0; j_bukopin < bukopin.length; j_bukopin++){

                                // console.log("run bukopin");
                                insHistoryPlacement(bukopin[j_bukopin].value, bukopin[j_bukopin].kode_bank_tujuan, bukopin[j_bukopin].kode_bank,time)
                                total_bukopin = total_bukopin + bukopin[j_bukopin].value
                                if(j_bukopin == bukopin.length-1){
                                    saveMain(time);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}


function insHistoryPlacement(pNilai, pBankTujuan, pBankSumberDana,time) {
    $.ajax({
        url: baseUrl + "api_operator/placement/ins_history_placement",
        dataType: 'JSON',
        type: "POST",
        data: {
            pBankTujuan : pBankTujuan,
            pJenis : tempJenis,
            pJenisSumberDana : tempSumberDana,
            pNilai : pNilai,
            pBankSumberDana : pBankSumberDana,
            sessionId : time,
        },
        success: function (res) {
            // console.log("ins "+pBankSumberDana+" history placement TMP: ",res);
        }
    });
}

function saveMain(time){
    $.ajax({
        url: baseUrl + "api_operator/placement/ins_history_placement_main",
        dataType: 'JSON',
        type: "POST",
        data: {
            pJenis : tempJenis,
            sessionId : time,
            pJenisSumber : tempJenisSumber
        },
        success: function (res) {
            // console.log("ins history placement MAIN: ",res);
            hideLoadingCss("Sukses set sumber dana");
            location.reload();
        },
        error: function () {
            hideLoadingCss("Gagal Set Simulasi Dana")
        }
    });
}

function exportXls(idJenis) {
    // console.log("export:"+idJenis);
    if(idJenis != "0"){
        window.open(baseUrl + "api_operator/placement/xls_detail?idJenis="+idJenis);
    }
    else {
        window.open(baseUrl + "api_operator/placement/xls");
    }

}

function deletePlacement() {
    showLoadingCss();
    $.ajax({
        url: baseUrl + "api_operator/placement/delete_placement",
        type: "POST",
        data: {

        },
        success: function (res) {
            // console.log("ins history placement MAIN: ",res);
            hideLoadingCss(res.message);
            location.reload();
        },
        error: function () {
            hideLoadingCss("Gagal reset data.");
        }
    });
}