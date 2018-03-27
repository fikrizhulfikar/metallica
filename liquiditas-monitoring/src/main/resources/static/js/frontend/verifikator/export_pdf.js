/**
 * Created by israjhaliri on 9/26/17.
 */
function createUIPdf(allData) {
    // console.log("alldata : ",allData);
//        imprst
    var columnImprst = [];
    columnImprst.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 3, 30, 0]
    });
    columnImprst.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 3, 65, 0]
    });

    columnImprst.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 3, 65, 0]
    });

    columnImprst.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 3, 65, 0]
    });

    columnImprst.push({
        text: "USD GLOBAL BOND",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 0, 65, 0]
    });

    var externalDataImprst = [];
    $.each(allData.dataImprstBond.return, function (index, v) {
        var helloooow = {
            BANK: v.ID_BANK,
            USD: accounting.formatNumber(v.NILAI_USD, 2, ".", ","),
            EUR: accounting.formatNumber(v.NILAI_EUR, 2, ".", ","),
            JPY: accounting.formatNumber(v.NILAI_JPY, 2, ".", ","),
            USD_BOND: accounting.formatNumber(v.NILAI_USD_GLOBAL, 2, ".", ",")
        }
        externalDataImprst.push(helloooow)
    });

    var footTotImprst = {
        BANK: "TOTAL",
        USD: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].TOTAL_USD, 2, ".", ","),
        EUR: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].TOTAL_EUR, 2, ".", ","),
        JPY: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].TOTAL_JPY, 2, ".", ","),
        USD_BOND: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].TOTAL_GLOBAL, 2, ".", ",")
    }
    externalDataImprst.push(footTotImprst)

    var footEqImprst = {
        BANK: "EQ IDR",
        USD: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].EQ_IDR_USD, 2, ".", ","),
        EUR: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].EQ_IDR_EUR, 2, ".", ","),
        JPY: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].EQ_IDR_JPY, 2, ".", ","),
        USD_BOND: accounting.formatNumber(allData.dataImprstBond.OUT_TOTAL[0].EQ_IDR_GLOBAL, 2, ".", ",")
    }
    externalDataImprst.push(footEqImprst)

    function buildTableBodyImprst(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["USD_BOND"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableImprst(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                alignment: "center",
                body: buildTableBodyImprst(data, columns)
            }
        };
    }

//      derivatif and deposito
    var columnDerivatifDeposito = [];
    columnDerivatifDeposito.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 3, 30, 0],
    });

    columnDerivatifDeposito.push({
        text: "DERIVATIF HEDGING",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnDerivatifDeposito.push({
        text: "DERIVATIF SWAP",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnDerivatifDeposito.push({
        text: "DERIVATIF CALL SPREAD",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnDerivatifDeposito.push({
        text: "DEPOSITO USD",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnDerivatifDeposito.push({
        text: "DEPOSITO IDR",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    var externalDataDerivatifDeposito = []
    $.each(allData.dataDerivatifDeposito.return, function (index, v) {
        var helloooow = {
            BANK: v.NAMA_BANK,
            DERIVATIF_HEDGIN: accounting.formatNumber(v.FORWARD, 2, ".", ","),
            DERIVATIF_SWAP: accounting.formatNumber(v.SWAP, 2, ".", ","),
            DERIVATIF_CSO: accounting.formatNumber(v.CALL_SPREAD, 2, ".", ","),
            DEPOSITO_USD: accounting.formatNumber(v.DEPOSITO_USD, 2, ".", ","),
            DEPOSITO_IDR: accounting.formatNumber(v.DEPOSITO_IDR, 2, ".", ",")
        }
        externalDataDerivatifDeposito.push(helloooow)
    });

    var footTotDerivatifDeposito = {
        BANK: "TOTAL",
        DERIVATIF_HEDGIN: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].TOTAL_FORWARD, 2, ".", ","),
        DERIVATIF_SWAP: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].TOTAL_SWAP, 2, ".", ","),
        DERIVATIF_CSO: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].TOTAL_CALLSPREAD, 2, ".", ","),
        DEPOSITO_USD: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].TOTAL_DEPOSITO_USD, 2, ".", ","),
        DEPOSITO_IDR: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].TOTAL_DEPOSITO_IDR, 2, ".", ",")
    }
    externalDataDerivatifDeposito.push(footTotDerivatifDeposito);

    var footEqDerivatifDeposito = {
        BANK: "EQ IDR",
        DERIVATIF_HEDGIN: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].EQ_IDR_FORWARD, 2, ".", ","),
        DERIVATIF_SWAP: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].EQ_IDR_SWAP, 2, ".", ","),
        DERIVATIF_CSO: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].EQ_IDR_CALLSPREAD, 2, ".", ","),
        DEPOSITO_USD: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].EQ_IDR_DEPOSITO_USD, 2, ".", ","),
        DEPOSITO_IDR: accounting.formatNumber(allData.dataDerivatifDeposito.OUT_TOTAL[0].EQ_IDR_DEPOSITO_IDR, 2, ".", ",")
    }
    externalDataDerivatifDeposito.push(footEqDerivatifDeposito)

    function buildTableDerivatifDeposito(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["DERIVATIF_HEDGIN"], alignment: "right"});
            dataRow.push({text: row["DERIVATIF_SWAP"], alignment: "right"});
            dataRow.push({text: row["DERIVATIF_CSO"], alignment: "right"});
            dataRow.push({text: row["DEPOSITO_USD"], alignment: "right"});
            dataRow.push({text: row["DEPOSITO_IDR"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableDrivatifDeposito(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableDerivatifDeposito(data, columns)
            }
        };
    }

//      REALISASI PEMBAYARAN PER HARI
    var columnRealisasiBayarPerHari = [];
    columnRealisasiBayarPerHari.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnRealisasiBayarPerHari.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [90, 0, 90, 0]
    });

    columnRealisasiBayarPerHari.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [90, 0, 90, 0]
    });

    columnRealisasiBayarPerHari.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [90, 0, 90, 0]
    });

    var externalDataRealisasiBayarPerHari = []
    $.each(allData.dataRealisasiPembayaran.return, function (index, v) {
        var helloooow = {
            JENIS_PEMBAYARAN: v.NAMA_PEMBAYARAN,
            USD: accounting.formatNumber(v.USD, 2, ".", ","),
            JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
            EUR: accounting.formatNumber(v.EUR, 2, ".", ",")
        }
        externalDataRealisasiBayarPerHari.push(helloooow)
    });

    function buildTableBodyRealisasiBayarPerHari(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRealisasiBayarPerHari(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRealisasiBayarPerHari(data, columns)
            }
        };
    }

//      REALISASI PEMBAYARAN PER HARI REKAP
    var columnRealisasiBayarPerHariRekap = [];
    columnRealisasiBayarPerHariRekap.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnRealisasiBayarPerHariRekap.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [90, 0, 90, 0]
    });

    columnRealisasiBayarPerHariRekap.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [90, 0, 90, 0]
    });

    columnRealisasiBayarPerHariRekap.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [90, 0, 90, 0]
    });

    var externalDataRealisasiBayarPerHariRekap = []
    $.each(allData.dataRealisasiPembayaran.OUT_TABLE2, function (index, v) {
//            console.log(v);
        var helloooow = {
            JENIS_PEMBAYARAN: v.NAMA_PEMBAYARAN,
            USD: accounting.formatNumber(v.USD, 2, ".", ","),
            JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
            EUR: accounting.formatNumber(v.EUR, 2, ".", ",")
        }
        externalDataRealisasiBayarPerHariRekap.push(helloooow)
    });

    function buildTableBodyRealisasiBayarPerHariRekap(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRealisasiBayarPerHariRekap(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRealisasiBayarPerHariRekap(data, columns)
            }
        };
    }

//      REALISASI PEMBELIAN PER HARI
    var columnRealisasiBeliPerHari = [];
    columnRealisasiBeliPerHari.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnRealisasiBeliPerHari.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [100, 0, 100, 0]
    });

    columnRealisasiBeliPerHari.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [100, 0, 100, 0]
    });

    columnRealisasiBeliPerHari.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [100, 0, 100, 0]
    });

    var externalDataRealisasiBeliPerHari = []
    $.each(allData.dataPembelianValas.return, function (index, v) {
//            console.log(v);
        var helloooow = {
            BANK: v.NAMA_BANK,
            USD: accounting.formatNumber(v.USD, 2, ".", ","),
            JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
            EUR: accounting.formatNumber(v.EUR, 2, ".", ",")
        }
        externalDataRealisasiBeliPerHari.push(helloooow)
    });

    function buildTableBodyRealisasiBeliPerHari(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRealisasiBeliPerHari(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRealisasiBeliPerHari(data, columns)
            }
        };
    }

//      REALISASI PEMBELIAN PER HARI REKAP
    var columnRealisasiBeliRekap = [];
    columnRealisasiBeliRekap.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0]
    });

    columnRealisasiBeliRekap.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [100, 0, 100, 0]
    });

    columnRealisasiBeliRekap.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [100, 0, 100, 0]
    });

    columnRealisasiBeliRekap.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [100, 0, 100, 0]
    });

    var externalDataRealisasiBeliRekap = []
    $.each(allData.dataPembelianValas.OUT_TABLE2, function (index, v) {
//            console.log(v);
        var helloooow = {
            BANK: v.NAMA_BANK,
            USD: accounting.formatNumber(v.USD, 2, ".", ","),
            JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
            EUR: accounting.formatNumber(v.EUR, 2, ".", ",")
        }
        externalDataRealisasiBeliRekap.push(helloooow)
    });

    function buildTableBodyRealisasiBeliRekap(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRealisasiBeliRekap(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRealisasiBeliRekap(data, columns)
            }
        };
    }

//      RENCANA BAYAR USD JPY
    var columnRencanaBayarUsdJpy = [];
    columnRencanaBayarUsdJpy.push({
        text: "TANGGAL",
        style: "tableHeader",
        alignment: "center",
        margin: [18, 0, 18, 0],
        margin: [0, 5, 0, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center",
        margin: [25, 0, 25, 0],
        margin: [0, 5, 0, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "MANDIRI (USD)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "BRI (USD)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "BNI (USD)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "BUKOPIN (USD)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "MANDIRI (JPY)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "BRI (JPY)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "BNI (JPY)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    columnRencanaBayarUsdJpy.push({
        text: "BUKOPIN (JPY)",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0]
    });

    var externalDataRencanaBayarUsdJpy = []
    $.each(allData.dataRencanaBayarUsdJpy.return, function (index, v) {
        var helloooow;
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AWAL",
            USD_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_USD, 2, ".", ","),
            USD_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_USD, 2, ".", ","),
            USD_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_USD, 2, ".", ","),
            USD_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_USD, 2, ".", ","),
            JPY_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_JPY, 2, ".", ","),
            JPY_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_JPY, 2, ".", ","),
            JPY_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_JPY, 2, ".", ","),
            JPY_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_JPY, 2, ".", ",")
        }
        externalDataRencanaBayarUsdJpy.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "PEMBELIAN, DERIVATIVE, DEPOSITO",
            USD_MANDIRI: accounting.formatNumber(v.SETTLEMENT_HEDGING_MANDIRI_USD, 2, ".", ","),
            USD_BRI: accounting.formatNumber(v.SETTLEMENT_HEDGING_BRI_USD, 2, ".", ","),
            USD_BNI: accounting.formatNumber(v.SETTLEMENT_HEDGING_BNI_USD, 2, ".", ","),
            USD_BUKOPIN: accounting.formatNumber(v.SETTLEMENT_HEDGING_BUKOPIN_USD, 2, ".", ","),
            JPY_MANDIRI: accounting.formatNumber(v.SETTLEMENT_HEDGING_MANDIRI_JPY, 2, ".", ","),
            JPY_BRI: accounting.formatNumber(v.SETTLEMENT_HEDGING_BRI_JPY, 2, ".", ","),
            JPY_BNI: accounting.formatNumber(v.SETTLEMENT_HEDGING_BNI_JPY, 2, ".", ","),
            JPY_BUKOPIN: accounting.formatNumber(v.SETTLEMENT_HEDGING_BUKOPIN_JPY, 2, ".", ",")
        }
        externalDataRencanaBayarUsdJpy.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "RENCANA PEMBAYARAN",
            USD_MANDIRI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_MANDIRI_USD, 2, ".", ","),
            USD_BRI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BRI_USD, 2, ".", ","),
            USD_BNI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BNI_USD, 2, ".", ","),
            USD_BUKOPIN: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BUKOPIN_USD, 2, ".", ","),
            JPY_MANDIRI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_MANDIRI_JPY, 2, ".", ","),
            JPY_BRI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BRI_JPY, 2, ".", ","),
            JPY_BNI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BNI_JPY, 2, ".", ","),
            JPY_BUKOPIN: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BUKOPIN_JPY, 2, ".", ",")
        }
        externalDataRencanaBayarUsdJpy.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AKHIR",
            USD_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_USD, 2, ".", ","),
            USD_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_USD, 2, ".", ","),
            USD_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_USD, 2, ".", ","),
            USD_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_USD, 2, ".", ","),
            JPY_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_JPY, 2, ".", ","),
            JPY_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_JPY, 2, ".", ","),
            JPY_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_JPY, 2, ".", ","),
            JPY_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_JPY, 2, ".", ",")
        }
        externalDataRencanaBayarUsdJpy.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "KETERANGAN",
            USD_MANDIRI: accounting.formatNumber(v.KETERANGAN_MANDIRI_USD_ALL, 2, ".", ","),
            USD_BRI: accounting.formatNumber(v.KETERANGAN_BRI_USD_ALL, 2, ".", ","),
            USD_BNI: accounting.formatNumber(v.KETERANGAN_BNI_USD_ALL, 2, ".", ","),
            USD_BUKOPIN: accounting.formatNumber(v.KETERANGAN_BUKOPIN_USD_ALL, 2, ".", ","),
            JPY_MANDIRI: accounting.formatNumber(v.KETERANGAN_MANDIRI_JPY_ALL, 2, ".", ","),
            JPY_BRI: accounting.formatNumber(v.KETERANGAN_BRI_JPY_ALL, 2, ".", ","),
            JPY_BNI: accounting.formatNumber(v.KETERANGAN_BNI_JPY_ALL, 2, ".", ","),
            JPY_BUKOPIN: accounting.formatNumber(v.KETERANGAN_BUKOPIN_JPY_ALL, 2, ".", ",")
        }
        externalDataRencanaBayarUsdJpy.push(helloooow)
    });

    function buildTableBodyRencanaBayarUsdJpy(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row, index) {
            var dataRow = [];
            // dataRow.push({text :row["TGL"],rowSpan:0 });
            if (index % 5 == 0) {
                dataRow.push({text: row["TGL"], rowSpan: 5, alignment: 'center', margin: [0, 35, 0, 0]});
            } else {
                dataRow.push({text: ""});
            }
            dataRow.push(row["KETERANGAN"]);
            dataRow.push({text: row["USD_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["USD_BRI"], alignment: "right"});
            dataRow.push({text: row["USD_BNI"], alignment: "right"});
            dataRow.push({text: row["USD_BUKOPIN"], alignment: "right"});
            dataRow.push({text: row["JPY_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["JPY_BRI"], alignment: "right"});
            dataRow.push({text: row["JPY_BNI"], alignment: "right"});
            dataRow.push({text: row["JPY_BUKOPIN"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaBayarUsdJpy(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRencanaBayarUsdJpy(data, columns)
            }
        };
    }


    //      RENCANA BAYAR EUR OTHERS
    var columnRencanaBayarEurOthers = [];
    columnRencanaBayarEurOthers.push({
        text: "TANGGAL",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0],
        margin: [0, 5, 0, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center",
        margin: [15, 0, 15, 0],
        margin: [0, 5, 0, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "MANDIRI (EUR)",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "BRI (EUR)",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "BNI (EUR)",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "BUKOPIN (EUR)",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "GBP",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "UDP",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    columnRencanaBayarEurOthers.push({
        text: "MYR",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 0, 20, 0]
    });

    var externalDataRencanaBayarEurOthers = []
    $.each(allData.dataRencanaBayarEurOthers.return, function (index, v) {
        var helloooow;
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AWAL",
            EUR_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_EUR, 2, ".", ","),
            EUR_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_EUR, 2, ".", ","),
            EUR_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_EUR, 2, ".", ","),
            EUR_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_EUR, 2, ".", ","),
            GBP: accounting.formatNumber(v.SALDO_AWAL_GBP, 2, ".", ","),
            UDP: accounting.formatNumber(v.SALDO_AWAL_AUD, 2, ".", ","),
            MYR: accounting.formatNumber(v.SALDO_AWAL_MYR, 2, ".", ",")
        }
        externalDataRencanaBayarEurOthers.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "	PEMBELIAN, DERIVATIVE, DEPOSITO",
            EUR_MANDIRI: accounting.formatNumber(v.SETTLEMENT_HEDGING_MANDIRI_EUR, 2, ".", ","),
            EUR_BRI: accounting.formatNumber(v.SETTLEMENT_HEDGING_BRI_EUR, 2, ".", ","),
            EUR_BNI: accounting.formatNumber(v.SETTLEMENT_HEDGING_BNI_EUR, 2, ".", ","),
            EUR_BUKOPIN: accounting.formatNumber(v.SETTLEMENT_HEDGING_BUKOPIN_EUR, 2, ".", ","),
            GBP: accounting.formatNumber(v.SETTLEMENT_HEDGING_GBP, 2, ".", ","),
            UDP: accounting.formatNumber(v.SETTLEMENT_HEDGING_AUD, 2, ".", ","),
            MYR: accounting.formatNumber(v.SETTLEMENT_HEDGING_MYR, 2, ".", ",")
        }
        externalDataRencanaBayarEurOthers.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "RENCANA PEMBAYARAN",
            EUR_MANDIRI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_MANDIRI_EUR, 2, ".", ","),
            EUR_BRI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BRI_EUR, 2, ".", ","),
            EUR_BNI: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BNI_EUR, 2, ".", ","),
            EUR_BUKOPIN: accounting.formatNumber(v.RENCANA_PEMBAYARAN_BUKOPIN_EUR, 2, ".", ","),
            GBP: accounting.formatNumber(v.RENCANA_PEMBAYARAN_GBP, 2, ".", ","),
            UDP: accounting.formatNumber(v.RENCANA_PEMBAYARAN_AUD, 2, ".", ","),
            MYR: accounting.formatNumber(v.RENCANA_PEMBAYARAN_MYR, 2, ".", ",")
        }
        externalDataRencanaBayarEurOthers.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AKHIR",
            EUR_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_EUR, 2, ".", ","),
            EUR_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_EUR, 2, ".", ","),
            EUR_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_EUR, 2, ".", ","),
            EUR_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_EUR, 2, ".", ","),
            GBP: accounting.formatNumber(v.SALDO_AKHIR_GBP, 2, ".", ","),
            UDP: accounting.formatNumber(v.SALDO_AKHIR_AUD, 2, ".", ","),
            MYR: accounting.formatNumber(v.SALDO_AKHIR_MYR, 2, ".", ",")
        }
        externalDataRencanaBayarEurOthers.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "KETERANGAN",
            EUR_MANDIRI: accounting.formatNumber(v.KETERANGAN_MANDIRI_EUR_ALL, 2, ".", ","),
            EUR_BRI: accounting.formatNumber(v.KETERANGAN_BRI_EUR_ALL, 2, ".", ","),
            EUR_BNI: accounting.formatNumber(v.KETERANGAN_BNI_EUR_ALL, 2, ".", ","),
            EUR_BUKOPIN: accounting.formatNumber(v.KETERANGAN_BUKOPIN_EUR_ALL, 2, ".", ","),
            GBP: accounting.formatNumber(v.KETERANGAN_GBP_ALL, 2, ".", ","),
            UDP: accounting.formatNumber(v.KETERANGAN_AUD_ALL, 2, ".", ","),
            MYR: accounting.formatNumber(v.KETERANGAN_MYR_ALL, 2, ".", ",")
        }
        externalDataRencanaBayarEurOthers.push(helloooow)

//            helloooow = {
//                TGL: " ",
//                KETERANGAN: " ",
//                EUR_MANDIRI: " ",
//                EUR_BRI: " ",
//                EUR_BNI: " ",
//                EUR_BUKOPIN: " ",
//                GBP: " ",
//                UDP: " ",
//                MYR: " ",
//            }
//            externalDataRencanaBayarEurOthers.push(helloooow)
    });

    function buildTableBodyRencanaBayarEurOthers(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row, index) {
            var dataRow = [];
            // console.log("row : ", row);
            if (index % 5 == 0) {
                dataRow.push({text: row["TGL"], rowSpan: 5, alignment: 'center', margin: [0, 27.5, 0, 0]});
            } else {
                dataRow.push({text: ""});
            }

            dataRow.push(row["KETERANGAN"]);
            dataRow.push({text: row["EUR_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["EUR_BRI"], alignment: "right"});
            dataRow.push({text: row["EUR_BNI"], alignment: "right"});
            dataRow.push({text: row["EUR_BUKOPIN"], alignment: "right"});
            dataRow.push({text: row["GBP"], alignment: "right"});
            dataRow.push({text: row["UDP"], alignment: "right"});
            dataRow.push({text: row["MYR"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaBayarEurOthers(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRencanaBayarEurOthers(data, columns)
            }
        };
    }


//        CREATE DOC
    var docDefinition = {
        pageOrientation: "landscape",
        content: [{
            text: "LAPORAN DASHBOARD",
            style: "header",
            alignment: "center"
        }, {
            text: "Tanggal Cetak : " + getDataNow(),
            style: "subheader"
        },
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: "IMPREST VALAS",
                style: "header",
                alignment: "center"
            },
            tableImprst(externalDataImprst, columnImprst),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {
                text: "PRODUK DERIVATIF DAN DEPOSITO",
                style: "header",
                alignment: "center"
            },
            tableDrivatifDeposito(externalDataDerivatifDeposito, columnDerivatifDeposito),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {

                text: "PEMBAYARAN " + allData.dataRealisasiPembayaran.return[0].TITLE,
                style: "header",
                alignment: "center"
            },
            tableRealisasiBayarPerHari(externalDataRealisasiBayarPerHari, columnRealisasiBayarPerHari),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {

                text: "PEMBAYARAN " + allData.dataRealisasiPembayaran.OUT_TABLE2[0].TITLE,
                style: "header",
                alignment: "center"
            },
            tableRealisasiBayarPerHariRekap(externalDataRealisasiBayarPerHariRekap, columnRealisasiBayarPerHariRekap),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {

                text: "PEMBELIAN " + allData.dataPembelianValas.return[0].TITLE,
                style: "header",
                alignment: "center"
            },
            tableRealisasiBeliPerHari(externalDataRealisasiBeliPerHari, columnRealisasiBeliPerHari),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: " ",
                style: "header",
                alignment: "center",
            },
            {

                text: "PEMBELIAN " + allData.dataPembelianValas.OUT_TABLE2[0].TITLE,
                style: "header",
                alignment: "center"
            },
            tableRealisasiBeliRekap(externalDataRealisasiBeliRekap, columnRealisasiBeliRekap),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {

                text: "RENCANA PEMBAYARAN VALUTA ASING MINGGUAN - BANK (CURRENCY USD AND JPY)",
                style: "header",
                alignment: "center"
            },
            tableRencanaBayarUsdJpy(externalDataRencanaBayarUsdJpy, columnRencanaBayarUsdJpy),
            {

                text: " ",
                style: "header",
                alignment: "center"
            },
            {

                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {

                text: "RENCANA PEMBAYARAN VALUTA ASING MINGGUAN - BANK (CURRENCY EUR AND OTHERS)",
                style: "header",
                alignment: "center"
            },
            tableRencanaBayarEurOthers(externalDataRencanaBayarEurOthers, columnRencanaBayarEurOthers),
        ],
        styles: {
            header: {
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 4]
            },
            subheader: {
                fontSize: 9,
                margin: [0, 5, 0, 2]
            },
            tableExample: {
                fontSize: 7
            },
            tableHeader: {
                bold: true,
                fontSize: 8,
                color: "black"
            }
        },
        defaultStyle: {
            alignment: "left",
            margin: [0, 0, 0, 0]
        }
    };
    pdfMake.createPdf(docDefinition).download('valas_dashboard.pdf');
}