/**
 * Created by adikoesoemah on 8/11/20.
 */
$(document).ready(function () {
    initDataTable();
    initDataTable2();
    var date = new Date();
    var newDate = date.toJSON().slice(0, 10).replace(new RegExp("-", 'g'), "/").split("/").reverse().join("/")
    $("#tglcetak").html(newDate);
    $("#tglcetak2").html(newDate);

    setInterval(function () {
         initDataTable();
         initDataTable2();
    }, 60000);
});

function initDataTable() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_giro_special_rate",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            // console.log("resonse : ",res);
//            $("#tglcetak").html(res.return[0].TANGGAL)
            var data = res.return;
            $('#table-giro-special-rate tbody').empty();
            $.each(data, function (key, val) {
                var str = val.BANK;
                var html = "<tr>" +
                    "<td>" + str + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.CURRENCY, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.NOMINAL_JASA_GIRO, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR_NOMINAL, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR_JASA_GIRO, 2, ".", ",") + "</td>" +
                    "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR_NOMINAL_JASA_GIRO, 2, ".", ",") + "</td>" +
                    "</tr>";
                $('#table-giro-special-rate tbody').append(html);
            });

//            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
//                "<td>TOTAL</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].BANK, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].CURR, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JASA_GIRO, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL_JASA_GIRO, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL2, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].JASA_GIRO2, 2, ".", ",") + "</td>" +
//                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL[0].NOMINAL_JASA_GIRO2, 2, ".", ",") + "</td>" +
//                "</tr>";
//
//            $('#table-giro-special-rate tbody').append(total1);

            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-giro-special-rate tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-giro-special-rate tbody').append(html);
        }
    });
}

function initDataTable2() {
    showLoadingCss()
    $.ajax({
        url: baseUrl + "api_dashboard/get_supply_chain_financing",
        dataType: 'JSON',
        type: "GET",
        success: function (res) {
            // console.log("resonse : ",res);
            $("#tglcetak").html(res.return[0].TANGGAL)
            var data = res.return;
            $('#table-supply-chain-financing tbody').empty();
            $.each(data, function (key, val) {
                if (val["CURRENCY"] === "EUR"){
                    var str = val.BANK;
                    var html = "<tr>" +
                        "<td style='border-bottom: 1px solid transparent !important;color:#d1e1ea;'>" + str + "</td>" +
                        "<td align='right'> " + val.CURRENCY + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.ORI_CURRENCY, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.PAJAK_PLN, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.NET_GAIN, 2, ".", ",") + "</td>" +
                        "</tr>";
                } else if (val["CURRENCY"] === "IDR"){
                    var str = val.BANK;
                    var html = "<tr>" +
                        "<td align='center' style='border-bottom: 1px solid transparent !important; font-weight: bold'>" + str + "</td>" +
                        "<td align='right'> " + val.CURRENCY + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.ORI_CURRENCY, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.PAJAK_PLN, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.NET_GAIN, 2, ".", ",") + "</td>" +
                        "</tr>";
                } else if (val["CURRENCY"] === "JPY"){
                    var str = val.BANK;
                    var html = "<tr>" +
                        "<td style='border-top: 1px solid transparent !important; border-bottom: 1px solid transparent !important; color:#d1e1ea;'>" + str + "</td>" +
                        "<td align='right'> " + val.CURRENCY + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.ORI_CURRENCY, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.PAJAK_PLN, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                        "<td align='right'> Rp " + accounting.formatNumber(val.NET_GAIN, 2, ".", ",") + "</td>" +
                        "</tr>";
                } else if (val["CURRENCY"] === "USD"){
                  var str = val.BANK;
                  var html = "<tr>" +
                      "<td style='border-top: 1px solid transparent !important; color:#d1e1ea;'>" + str + "</td>" +
                      "<td align='right'> " + val.CURRENCY + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.ORI_CURRENCY, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.EQ_IDR, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.JASA_GIRO, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.PAJAK_PLN, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                      "<td align='right'> Rp " + accounting.formatNumber(val.NET_GAIN, 2, ".", ",") + "</td>" +
                      "</tr>";
              }
                $('#table-supply-chain-financing tbody').append(html);
            });

            var total1 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td rowspan='4' align='center' style='vertical-align:middle'> TOTAL </td>" +
                "<td align='right'> " + res.OUT_TOTAL_SCF[0].CURRENCY + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].ORI_CURRENCY, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].EQ_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].PAJAK_PLN, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> " + accounting.formatNumber(res.OUT_TOTAL_SCF[0].NET_GAIN, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-supply-chain-financing tbody').append(total1);

            var total2 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> " + res.OUT_TOTAL_SCF[1].CURRENCY + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].ORI_CURRENCY, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].EQ_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].PAJAK_PLN, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> " + accounting.formatNumber(res.OUT_TOTAL_SCF[1].NET_GAIN, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-supply-chain-financing tbody').append(total2);

            var total3 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> " + res.OUT_TOTAL_SCF[2].CURRENCY + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].ORI_CURRENCY, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].EQ_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].PAJAK_PLN, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> " + accounting.formatNumber(res.OUT_TOTAL_SCF[2].NET_GAIN, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-supply-chain-financing tbody').append(total3);

            var total4 = "<tr style='background-color:#67a2d8;color: white'>" +
                "<td align='right'> " + res.OUT_TOTAL_SCF[3].CURRENCY + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].ORI_CURRENCY, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].EQ_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].FEE_TRANSAKSI_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].CASH_COLLATERAL_IDR, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].PAJAK_PLN, 2, ".", ",") + "</td>" +
                "<td align='right'> Rp " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].NET_JASA_GIRO, 2, ".", ",") + "</td>" +
                "<td align='right'> " + accounting.formatNumber(res.OUT_TOTAL_SCF[3].NET_GAIN, 2, ".", ",") + "</td>" +
                "</tr>";

            $('#table-supply-chain-financing tbody').append(total4);
            hideLoadingCss()
        },
        error: function () {
            hideLoadingCss("");
            $('#table-supply-chain-financing tbody').empty();
            var html = "<tr>" +
                "<td colspan='5' align='center'> No Data </td>" +
                "</tr>";
            $('#table-supply-chain-financing tbody').append(html);
        }
    });
}