function createUIPdf(allData) {

    console.log("alldata : ", allData);
    // SaldoIdrDataImprst
    var columnSaldoIdrDataImprst = [];

    columnSaldoIdrDataImprst.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 3, 30, 0]
    });

    columnSaldoIdrDataImprst.push({
        text: "IMPREST TERPUSAT",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 3, 65, 0]
    });

    columnSaldoIdrDataImprst.push({
        text: "IMPREST INVESTASI",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 3, 65, 0]
    });

    columnSaldoIdrDataImprst.push({
        text: "IMPREST OPERASI",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 3, 65, 0]
    });

    columnSaldoIdrDataImprst.push({
        text: "IMPOR",
        style: "tableHeader",
        alignment: "center",
        margin: [65, 0, 65, 0]
    });

    var externalSaldoIdrDataImprst = [];
    $.each(allData.dataSaldoIdrImprest.return, function (index, v) {
        var helloooow = {
            BANK: v.BANK,
            USD: accounting.formatNumber(v.IMPREST_TERPUSAT, 2, ".", ","),
            EUR: accounting.formatNumber(v.IMPREST_INVESTASI, 2, ".", ","),
            JPY: accounting.formatNumber(v.IMPREST_OPERASI, 2, ".", ","),
            USD_BOND: accounting.formatNumber(v.IMPOR, 2, ".", ",")
        }
        externalSaldoIdrDataImprst.push(helloooow)
    });

    var footTotalSaldoIdrImprest = {
        BANK: "TOTAL",
        USD: accounting.formatNumber(allData.dataSaldoIdrImprest.OUT_TOTAL[0].JML_IMPREST_TERPUSAT, 2, ".", ","),
        EUR: accounting.formatNumber(allData.dataSaldoIdrImprest.OUT_TOTAL[0].JML_IMPREST_INVESTASI, 2, ".", ","),
        JPY: accounting.formatNumber(allData.dataSaldoIdrImprest.OUT_TOTAL[0].JML_IMPREST_OPERASI, 2, ".", ","),
        USD_BOND: accounting.formatNumber(allData.dataSaldoIdrImprest.OUT_TOTAL[0].JML_IMPOR, 2, ".", ",")
    }
    externalSaldoIdrDataImprst.push(footTotalSaldoIdrImprest)

    function buildTableBodySaldoIdrImprest(data, columns) {
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

    function tableSaldoIdrImprest(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                alignment: "center",
                body: buildTableBodySaldoIdrImprest(data, columns)
            }
        };
    }

    // SaldoIdrSubsidiKmk
    var columnSubsidiKmk = [];
    columnSubsidiKmk.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 3, 30, 0],
    });

    columnSubsidiKmk.push({
        text: "SUBSIDI",
        style: "tableHeader",
        alignment: "center",
        margin: [157, 0, 157, 0]
    });

    columnSubsidiKmk.push({
        text: "KMK",
        style: "tableHeader",
        alignment: "center",
        margin: [157, 0, 157, 0]
    });

    var externalDataSubsidiKmk = []
    $.each(allData.dataSaldoIdrSubsidiKmk.return, function (index, v) {
        var helloooow = {
            BANK: v.BANK,
            SUBSIDI: accounting.formatNumber(v.SUBSIDI, 2, ".", ","),
            KMK: accounting.formatNumber(v.KMK, 2, ".", ",")
        }
        externalDataSubsidiKmk.push(helloooow)
    });

    var footTotSubsidiKmk = {
        BANK: "TOTAL",
        SUBSIDI: accounting.formatNumber(allData.dataSaldoIdrSubsidiKmk.OUT_TOTAL[0].JML_SUBSIDI, 2, ".", ","),
        KMK: accounting.formatNumber(allData.dataSaldoIdrSubsidiKmk.OUT_TOTAL[0].JML_KMK, 2, ".", ",")
    };

    externalDataSubsidiKmk.push(footTotSubsidiKmk);

    function buildTableDerivatifDeposito(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["SUBSIDI"], alignment: "right"});
            dataRow.push({text: row["KMK"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableSubsidiKmk(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableDerivatifDeposito(data, columns)
            }
        };
    }

    // SaldoIdrReceipt
    var columnReceipt = [];
    columnReceipt.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 0, 30, 0],
    });

    columnReceipt.push({
        text: "RECEIPT",
        style: "tableHeader",
        alignment: "center",
        margin: [324, 0, 324, 0]
    });

    var externalDataReceipt = []
    $.each(allData.dataSaldoIdrReceipt.return, function (index, v) {
        var helloooow = {
            BANK: v.BANK,
            RECEIPT: accounting.formatNumber(v.RECEIPT, 2, ".", ",")
        }
        externalDataReceipt.push(helloooow)
    });

    var footTotSubsidiKmk = {
        BANK: "TOTAL",
        RECEIPT: accounting.formatNumber(allData.dataSaldoIdrSubsidiKmk.OUT_TOTAL[0].JML_RECEIPT, 2, ".", ",")
    };

    externalDataReceipt.push(footTotSubsidiKmk);

    function buildTableReceipt(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["RECEIPT"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableReceipt(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableReceipt(data, columns)
            }
        };
    }

    // Saldo SUBSIDI KMK
    var columnReceipt = [];
    columnReceipt.push({
        text: "BANK",
        style: "tableHeader",
        alignment: "center",
        margin: [30, 3, 30, 0],
    });

    columnReceipt.push({
        text: "RECEIPT",
        style: "tableHeader",
        alignment: "center",
        margin: [324, 0, 324, 0]
    });

    var externalDataReceipt = []
    $.each(allData.dataSaldoIdrReceipt.return, function (index, v) {
        var helloooow = {
            BANK: v.BANK,
            RECEIPT: accounting.formatNumber(v.RECEIPT, 2, ".", ",")
        }
        externalDataReceipt.push(helloooow)
    });

    var footTotSubsidiKmk = {
        BANK: "TOTAL",
        RECEIPT: accounting.formatNumber(allData.dataSaldoIdrSubsidiKmk.OUT_TOTAL[0].JML_RECEIPT, 2, ".", ",")
    };

    externalDataReceipt.push(footTotSubsidiKmk);

    function buildTableReceipt(data, columns) {
        var body = [];

        body.push(columns);

        data.forEach(function (row) {
            var dataRow = [];
//                console.log(row);
            dataRow.push(row["BANK"]);
            dataRow.push({text: row["RECEIPT"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableReceipt(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableReceipt(data, columns)
            }
        };
    }

    //      RENCANA BAYAR TERPUSAT
    var columnRencanaOperasiTerpusat = [];
    columnRencanaOperasiTerpusat.push({
        text: "TANGGAL",
        style: "tableHeader",
        alignment: "center",
        margin: [0, 5, 0, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 5, 20, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "MANDIRI (OPERASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "BRI (OPERASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "BNI (OPERASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "BUKOPIN (OPERASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });
    columnRencanaOperasiTerpusat.push({
        text: "MANDIRI (INVESTASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "BRI (INVESTASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "BNI (INVESTASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaOperasiTerpusat.push({
        text: "BUKOPIN (INVESTASI)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    var externalDataRencanaBayarOperasiTerpusat = []
    $.each(allData.dataRencanaBayarImprestOperasiTerpusat.return, function (index, v) {
        var helloooow;
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AWAL",
            OPRS_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_OPRS, 2, ".", ","),
            OPRS_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_OPRS, 2, ".", ","),
            OPRS_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_OPRS, 2, ".", ","),
            OPRS_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_OPRS, 2, ".", ","),
            INVES_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_INVES, 2, ".", ","),
            INVES_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_INVES, 2, ".", ","),
            INVES_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_INVES, 2, ".", ","),
            INVES_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_INVES, 2, ".", ",")
        }
        externalDataRencanaBayarOperasiTerpusat.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "PINBUK,KMK,SUBSIDI",
            OPRS_MANDIRI: accounting.formatNumber(v.SUBSIDI_MANDIRI_OPRS, 2, ".", ","),
            OPRS_BRI: accounting.formatNumber(v.SUBSIDI_BRI_OPRS, 2, ".", ","),
            OPRS_BNI: accounting.formatNumber(v.SUBSIDI_BNI_OPRS, 2, ".", ","),
            OPRS_BUKOPIN: accounting.formatNumber(v.SUBSIDI_BUKOPIN_OPRS, 2, ".", ","),
            INVES_MANDIRI: accounting.formatNumber(v.SUBSIDI_MANDIRI_INVES, 2, ".", ","),
            INVES_BRI: accounting.formatNumber(v.SUBSIDI_BRI_INVES, 2, ".", ","),
            INVES_BNI: accounting.formatNumber(v.SUBSIDI_BNI_INVES, 2, ".", ","),
            INVES_BUKOPIN: accounting.formatNumber(v.SUBSIDI_BUKOPIN_INVES, 2, ".", ",")
        }
        externalDataRencanaBayarOperasiTerpusat.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "RENCANA PEMBAYARAN",
            OPRS_MANDIRI: accounting.formatNumber(v.RENCANA_BAYARMANDIRI_OPRS, 2, ".", ","),
            OPRS_BRI: accounting.formatNumber(v.RENCANA_BAYARBRI_OPRS, 2, ".", ","),
            OPRS_BNI: accounting.formatNumber(v.RENCANA_BAYARBNI_OPRS, 2, ".", ","),
            OPRS_BUKOPIN: accounting.formatNumber(v.RENCANA_BAYARBUKOPIN_OPRS, 2, ".", ","),
            INVES_MANDIRI: accounting.formatNumber(v.RENCANA_BAYARMANDIRI_INVES, 2, ".", ","),
            INVES_BRI: accounting.formatNumber(v.RENCANA_BAYARBRI_INVES, 2, ".", ","),
            INVES_BNI: accounting.formatNumber(v.RENCANA_BAYARBNI_INVES, 2, ".", ","),
            INVES_BUKOPIN: accounting.formatNumber(v.RENCANA_BAYARBUKOPIN_INVES, 2, ".", ",")
        }
        externalDataRencanaBayarOperasiTerpusat.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AKHIR",
            OPRS_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_OPRS, 2, ".", ","),
            OPRS_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_OPRS, 2, ".", ","),
            OPRS_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_OPRS, 2, ".", ","),
            OPRS_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_OPRS, 2, ".", ","),
            INVES_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_INVES, 2, ".", ","),
            INVES_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_INVES, 2, ".", ","),
            INVES_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_INVES, 2, ".", ","),
            INVES_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_INVES, 2, ".", ",")
        }
        externalDataRencanaBayarOperasiTerpusat.push(helloooow)
        var ket = "<b style=color:#ff0000;>KURANG</b>";
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "KETERANGAN",
            OPRS_MANDIRI: v.KETERANGAN_MANDIRI_OPRS == ket ? "Kurang" : "-",
            OPRS_BRI: v.KETERANGAN_BRI_OPRS == ket ? "Kurang" : "-",
            OPRS_BNI: v.KETERANGAN_BNI_OPRS == ket ? "Kurang" : "-",
            OPRS_BUKOPIN: v.KETERANGAN_BUKOPIN_OPRS == ket ? "Kurang" : "-",
            INVES_MANDIRI: v.KETERANGAN_MANDIRI_INVES == ket ? "Kurang" : "-",
            INVES_BRI: v.KETERANGAN_BRI_INVES == ket ? "Kurang" : "-",
            INVES_BNI: v.KETERANGAN_BNI_INVES == ket ? "Kurang" : "-",
            INVES_BUKOPIN: v.KETERANGAN_BUKOPIN_INVES == ket ? "Kurang" : "-"
        }
        externalDataRencanaBayarOperasiTerpusat.push(helloooow)
    });

    function buildTableBodyRencanaBayarOperasiTerpusat(data, columns) {
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
            dataRow.push({text: row["OPRS_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["OPRS_BRI"], alignment: "right"});
            dataRow.push({text: row["OPRS_BNI"], alignment: "right"});
            dataRow.push({text: row["OPRS_BUKOPIN"], alignment: "right"});
            dataRow.push({text: row["INVES_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["INVES_BRI"], alignment: "right"});
            dataRow.push({text: row["INVES_BNI"], alignment: "right"});
            dataRow.push({text: row["INVES_BUKOPIN"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaBayarOperasiTerpusat(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRencanaBayarOperasiTerpusat(data, columns)
            }
        };
    }

//      RENCANA BAYAR IMPREST DAN IMPOR
    var columnRencanaImprestImpor = [];
    columnRencanaImprestImpor.push({
        text: "TANGGAL",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 5, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 5, 20, 0]
    });

    columnRencanaImprestImpor.push({
        text: "MANDIRI (IMPREST)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "BRI (IMPREST)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "BNI (IMPREST)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "BUKOPIN (IMPREST)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });
    columnRencanaImprestImpor.push({
        text: "MANDIRI (IMPOR)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 0, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "BRI (IMPOR)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 5, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "BNI (IMPOR)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 5, 5, 0]
    });

    columnRencanaImprestImpor.push({
        text: "BUKOPIN (IMPOR)",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 5, 5, 0]
    });

    var externalDataRencanaBayarImprestImpor = []
    $.each(allData.dataRencanaBayarImprestDanImport.return, function (index, v) {
        var helloooow;
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AWAL",
            IMPREST_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_IMPRST, 2, ".", ","),
            IMPREST_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_IMPRST, 2, ".", ","),
            IMPREST_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_IMPRST, 2, ".", ","),
            IMPREST_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_IMPRST, 2, ".", ","),
            IMPOR_MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI_IMPOR, 2, ".", ","),
            IMPOR_BRI: accounting.formatNumber(v.SALDO_AWAL_BRI_IMPOR, 2, ".", ","),
            IMPOR_BNI: accounting.formatNumber(v.SALDO_AWAL_BNI_IMPOR, 2, ".", ","),
            IMPOR_BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN_IMPOR, 2, ".", ",")
        }
        externalDataRencanaBayarImprestImpor.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "PINBUK,KMK,SUBSIDI DAN DEPOSTIO",
            IMPREST_MANDIRI: accounting.formatNumber(v.SUBSIDI_MANDIRI_IMPRST, 2, ".", ","),
            IMPREST_BRI: accounting.formatNumber(v.SUBSIDI_BRI_IMPRST, 2, ".", ","),
            IMPREST_BNI: accounting.formatNumber(v.SUBSIDI_BNI_IMPRST, 2, ".", ","),
            IMPREST_BUKOPIN: accounting.formatNumber(v.SUBSIDI_BUKOPIN_IMPRST, 2, ".", ","),
            IMPOR_MANDIRI: accounting.formatNumber(v.SUBSIDI_MANDIRI_IMPOR, 2, ".", ","),
            IMPOR_BRI: accounting.formatNumber(v.SUBSIDI_BRI_IMPOR, 2, ".", ","),
            IMPOR_BNI: accounting.formatNumber(v.SUBSIDI_BNI_IMPOR, 2, ".", ","),
            IMPOR_BUKOPIN: accounting.formatNumber(v.SUBSIDI_BUKOPIN_IMPOR, 2, ".", ",")
        }
        externalDataRencanaBayarImprestImpor.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "RENCANA PEMBAYARAN",
            IMPREST_MANDIRI: accounting.formatNumber(v.RENCANA_BAYARMANDIRI_IMPRST, 2, ".", ","),
            IMPREST_BRI: accounting.formatNumber(v.RENCANA_BAYARBRI_IMPRST, 2, ".", ","),
            IMPREST_BNI: accounting.formatNumber(v.RENCANA_BAYARBNI_IMPRST, 2, ".", ","),
            IMPREST_BUKOPIN: accounting.formatNumber(v.RENCANA_BAYARBUKOPIN_IMPRST, 2, ".", ","),
            IMPOR_MANDIRI: accounting.formatNumber(v.RENCANA_BAYARMANDIRI_IMPOR, 2, ".", ","),
            IMPOR_BRI: accounting.formatNumber(v.RENCANA_BAYARBRI_IMPOR, 2, ".", ","),
            IMPOR_BNI: accounting.formatNumber(v.RENCANA_BAYARBNI_IMPOR, 2, ".", ","),
            IMPOR_BUKOPIN: accounting.formatNumber(v.RENCANA_BAYARBUKOPIN_IMPOR, 2, ".", ",")
        }
        externalDataRencanaBayarImprestImpor.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AKHIR",
            IMPREST_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_IMPRST, 2, ".", ","),
            IMPREST_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_IMPRST, 2, ".", ","),
            IMPREST_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_IMPRST, 2, ".", ","),
            IMPREST_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_IMPRST, 2, ".", ","),
            IMPOR_MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI_IMPOR, 2, ".", ","),
            IMPOR_BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI_IMPOR, 2, ".", ","),
            IMPOR_BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI_IMPOR, 2, ".", ","),
            IMPOR_BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN_IMPOR, 2, ".", ",")
        }
        externalDataRencanaBayarImprestImpor.push(helloooow)
        var ket = "<b style=color:red;>KURANG</b>";
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "KETERANGAN",
            IMPREST_MANDIRI: v.KETERANGAN_MANDIRI_IMPRST == ket ? "Kurang" : "-",
            IMPREST_BRI: v.KETERANGAN_BRI_IMPRST == ket ? "Kurang" : "-",
            IMPREST_BNI: v.KETERANGAN_BNI_IMPRST == ket ? "Kurang" : "-",
            IMPREST_BUKOPIN: v.KETERANGAN_BUKOPIN_IMPRST == ket ? "Kurang" : "-",
            IMPOR_MANDIRI: v.KETERANGAN_MANDIRI_IMPOR == ket ? "Kurang" : "-",
            IMPOR_BRI: v.KETERANGAN_BRI_IMPOR == ket ? "Kurang" : "-",
            IMPOR_BNI: v.KETERANGAN_BNI_IMPOR == ket ? "Kurang" : "-",
            IMPOR_BUKOPIN: v.KETERANGAN_BUKOPIN_IMPOR == ket ? "Kurang" : "-"
        }
        externalDataRencanaBayarImprestImpor.push(helloooow)
    });

    function buildTableBodyRencanaBayarImprestImpor(data, columns) {
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
            dataRow.push({text: row["IMPREST_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["IMPREST_BRI"], alignment: "right"});
            dataRow.push({text: row["IMPREST_BNI"], alignment: "right"});
            dataRow.push({text: row["IMPREST_BUKOPIN"], alignment: "right"});
            dataRow.push({text: row["IMPOR_MANDIRI"], alignment: "right"});
            dataRow.push({text: row["IMPOR_BRI"], alignment: "right"});
            dataRow.push({text: row["IMPOR_BNI"], alignment: "right"});
            dataRow.push({text: row["IMPOR_BUKOPIN"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaBayarImprestImpor(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBodyRencanaBayarImprestImpor(data, columns)
            }
        };
    }

    //      RENCANA BAYAR EQUIVALEN RUPIAH
    var columnRencanaBayarEquivalenRupiah = [];
    columnRencanaBayarEquivalenRupiah.push({
        text: "TANGGAL",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 12.5, 5, 12.5]
    });

    columnRencanaBayarEquivalenRupiah.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });

    columnRencanaBayarEquivalenRupiah.push({
        text: "MANDIRI",
        style: "tableHeader",
        alignment: "center",
        margin: [57, 12.5, 57, 12.5]
    });

    columnRencanaBayarEquivalenRupiah.push({
        text: "BRI",
        style: "tableHeader",
        alignment: "center",
        margin: [57, 12.5, 57, 12.5]
    });

    columnRencanaBayarEquivalenRupiah.push({
        text: "BNI",
        style: "tableHeader",
        alignment: "center",
        margin: [57, 12.5, 57, 12.5]
    });

    columnRencanaBayarEquivalenRupiah.push({
        text: "BUKOPIN",
        style: "tableHeader",
        alignment: "center",
        margin: [57, 12.5, 57, 12.5]
    });
    var externalDataRencanaBayarEquivalenRupiah = []
    $.each(allData.dataRencanaBayarEquivalenRupiah.return, function (index, v) {
        var helloooow;
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AWAL",
            MANDIRI: accounting.formatNumber(v.SALDO_AWAL_MANDIRI, 2, ".", ","),
            BRI: accounting.formatNumber(v.SALDO_AWAL_BRI, 2, ".", ","),
            BNI: accounting.formatNumber(v.SALDO_AWAL_BNI, 2, ".", ","),
            BUKOPIN: accounting.formatNumber(v.SALDO_AWAL_BUKOPIN, 2, ".", ",")
        }
        externalDataRencanaBayarEquivalenRupiah.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "PINBUK,KMK,SUBSIDI DAN DEPOSTIO",
            MANDIRI: accounting.formatNumber(v.PINBUK_MANDIRI, 2, ".", ","),
            BRI: accounting.formatNumber(v.PINBUK_BRI, 2, ".", ","),
            BNI: accounting.formatNumber(v.PINBUK_BNI, 2, ".", ","),
            BUKOPIN: accounting.formatNumber(v.PINBUK_BUKOPIN, 2, ".", ",")
        }
        externalDataRencanaBayarEquivalenRupiah.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "RENCANA PEMBAYARAN",
            MANDIRI: accounting.formatNumber(v.RENCANA_BAYAR_MANDIRI, 2, ".", ","),
            BRI: accounting.formatNumber(v.RENCANA_BAYAR_BRI, 2, ".", ","),
            BNI: accounting.formatNumber(v.RENCANA_BAYAR_BNI, 2, ".", ","),
            BUKOPIN: accounting.formatNumber(v.RENCANA_BAYAR_BUKOPIN, 2, ".", ",")
        }
        externalDataRencanaBayarEquivalenRupiah.push(helloooow)

        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "SALDO AKHIR",
            MANDIRI: accounting.formatNumber(v.SALDO_AKHIR_MANDIRI, 2, ".", ","),
            BRI: accounting.formatNumber(v.SALDO_AKHIR_BRI, 2, ".", ","),
            BNI: accounting.formatNumber(v.SALDO_AKHIR_BNI, 2, ".", ","),
            BUKOPIN: accounting.formatNumber(v.SALDO_AKHIR_BUKOPIN, 2, ".", ",")
        }
        externalDataRencanaBayarEquivalenRupiah.push(helloooow)
        var ket = "<b style=color:red;>KURANG</b>";
        helloooow = {
            TGL: v.TGL,
            KETERANGAN: "KETERANGAN",
            MANDIRI: v.KETERANGAN_MANDIRI == ket ? "Kurang" : "-",
            BRI: v.KETERANGAN_BRI == ket ? "Kurang" : "-",
            BNI: v.KETERANGAN_BNI == ket ? "Kurang" : "-",
            BUKOPIN: v.KETERANGAN_BUKOPIN == ket ? "Kurang" : "-"
        }
        externalDataRencanaBayarEquivalenRupiah.push(helloooow)
    });

    function buildTableRencanaBayarEquivalenRupiah(data, columns) {
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
            dataRow.push({text: row["MANDIRI"], alignment: "right"});
            dataRow.push({text: row["BRI"], alignment: "right"});
            dataRow.push({text: row["BNI"], alignment: "right"});
            dataRow.push({text: row["BUKOPIN"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaBayarEquivalenRupiah(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableRencanaBayarEquivalenRupiah(data, columns)
            }
        };
    }

    //      RENCANA VS REALISASI
    var columnTableTotalRencanaBayar = [];
    columnTableTotalRencanaBayar.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center",
        margin: [14, 12.5, 14, 12.5]
    });

    columnTableTotalRencanaBayar.push({
        text: "JATUH TEMPO",
        style: "tableHeader",
        alignment: "center",
        margin: [28, 12.5, 28, 12.5]
    });

    columnTableTotalRencanaBayar.push({
        text: "IDR",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableTotalRencanaBayar.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableTotalRencanaBayar.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableTotalRencanaBayar.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });
    columnTableTotalRencanaBayar.push({
        text: "OTHER",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });


    var columnTableBelumTerealisasi = [];
    columnTableBelumTerealisasi.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center",
        margin: [14, 12.5, 14, 12.5]
    });

    columnTableBelumTerealisasi.push({
        text: "JATUH TEMPO",
        style: "tableHeader",
        alignment: "center",
        margin: [28, 12.5, 28, 12.5]
    });

    columnTableBelumTerealisasi.push({
        text: "IDR",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableBelumTerealisasi.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableBelumTerealisasi.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableBelumTerealisasi.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });
    columnTableBelumTerealisasi.push({
        text: "OTHER",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });


    var columnTableSudahTerealisasi = [];
    columnTableSudahTerealisasi.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center",
        margin: [14, 12.5, 14, 12.5]
    });

    columnTableSudahTerealisasi.push({
        text: "JATUH TEMPO",
        style: "tableHeader",
        alignment: "center",
        margin: [28, 12.5, 28, 12.5]
    });

    columnTableSudahTerealisasi.push({
        text: "IDR",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableSudahTerealisasi.push({
        text: "USD",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableSudahTerealisasi.push({
        text: "JPY",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    columnTableSudahTerealisasi.push({
        text: "EUR",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });
    columnTableSudahTerealisasi.push({
        text: "OTHER",
        style: "tableHeader",
        alignment: "center",
        margin: [40, 12.5, 40, 12.5]
    });

    var externalDataTotalRencanaBayar = []
    var externalDataBelumTerealisasi = []
    var externalDataSudahTerealisasi = []

    $.each(allData.dataRencanaVsRealisasiIdr.return, function (index, v) {
        var date = new Date(v.JATUH_TEMPO);
        var dateExport = date.toLocaleDateString();
        var helloooow;

        if ((v.STATUS_VALAS != 'RENCANA' && v.STATUS_VALAS != 'REALISASI') || v.STATUS == 'total bro') {
            helloooow = {
                JENIS_PEMBAYARAN: v.JENIS_PEMBAYARAN,
                JATUH_TEMPO: dateExport,
                IDR: accounting.formatNumber(v.IDR, 2, ".", ","),
                USD: accounting.formatNumber(v.USD, 2, ".", ","),
                JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
                EUR: accounting.formatNumber(v.EUR, 2, ".", ","),
                OTHER: accounting.formatNumber(v.OTHER, 2, ".", ",")
            }
            externalDataTotalRencanaBayar.push(helloooow)
        }
        if (v.STATUS_VALAS == 'RENCANA') {
            helloooow = {
                JENIS_PEMBAYARAN: v.JENIS_PEMBAYARAN,
                JATUH_TEMPO: dateExport,
                IDR: accounting.formatNumber(v.IDR, 2, ".", ","),
                USD: accounting.formatNumber(v.USD, 2, ".", ","),
                JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
                EUR: accounting.formatNumber(v.EUR, 2, ".", ","),
                OTHER: accounting.formatNumber(v.OTHER, 2, ".", ",")
            }
            externalDataBelumTerealisasi.push(helloooow)
        }
        if (v.STATUS_VALAS == 'REALISASI') {
            helloooow = {
                JENIS_PEMBAYARAN: v.JENIS_PEMBAYARAN,
                JATUH_TEMPO: dateExport,
                IDR: accounting.formatNumber(v.IDR, 2, ".", ","),
                USD: accounting.formatNumber(v.USD, 2, ".", ","),
                JPY: accounting.formatNumber(v.JPY, 2, ".", ","),
                EUR: accounting.formatNumber(v.EUR, 2, ".", ","),
                OTHER: accounting.formatNumber(v.OTHER, 2, ".", ",")
            }
            externalDataSudahTerealisasi.push(helloooow)
        }
    });

    function buildTableTotalRencanaBayar(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row) {
            var dataRow = [];
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push({text: row["IDR"], alignment: "right"});
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            dataRow.push({text: row["OTHER"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function buildTableBelumTerealisasi(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row) {
            var dataRow = [];
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push({text: row["IDR"], alignment: "right"});
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            dataRow.push({text: row["OTHER"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function buildTableSudahTerealisasi(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row) {
            var dataRow = [];
            dataRow.push(row["JENIS_PEMBAYARAN"]);
            dataRow.push(row["JATUH_TEMPO"]);
            dataRow.push({text: row["IDR"], alignment: "right"});
            dataRow.push({text: row["USD"], alignment: "right"});
            dataRow.push({text: row["JPY"], alignment: "right"});
            dataRow.push({text: row["EUR"], alignment: "right"});
            dataRow.push({text: row["OTHER"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaBayar(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableTotalRencanaBayar(data, columns)
            }
        };
    }

    function tableBelumTerealisasi(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableBelumTerealisasi(data, columns)
            }
        };
    }

    function tableSudahTerealisasi(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableSudahTerealisasi(data, columns)
            }
        };
    }

    //      RENCANA PEMBAYARAN

    var date = new Date();
    var year = date.getUTCFullYear();

    var date1 = new Date(date.setDate(date.getDate()));
    var month1 = date1.getUTCMonth() + 1;

    var date2 = new Date(date.setDate(date.getDate() + 1));
    var month2 = date2.getUTCMonth() + 1;

    var date3 = new Date(date.setDate(date.getDate() + 1));
    var month3 = date3.getUTCMonth() + 1;

    var date4 = new Date(date.setDate(date.getDate() + 1));
    var month4 = date4.getUTCMonth() + 1;

    var date5 = new Date(date.setDate(date.getDate() + 1));
    var month5 = date5.getUTCMonth() + 1;

    var date6 = new Date(date.setDate(date.getDate() + 1));
    var month6 = date6.getUTCMonth() + 1;

    var date7 = new Date(date.setDate(date.getDate() + 1));
    var month7 = date7.getUTCMonth() + 1;

    var columnRencanaPembayaran = [];
    columnRencanaPembayaran.push({
        text: "KETERANGAN",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 12.5, 5, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date1.getUTCDate()) + "/" + month1 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date2.getUTCDate()) + "/" + month2 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date3.getUTCDate()) + "/" + month3 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date4.getUTCDate()) + "/" + month4 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date5.getUTCDate()) + "/" + month5 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date6.getUTCDate()) + "/" + month6 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: (date7.getUTCDate()) + "/" + month7 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnRencanaPembayaran.push({
        text: "TOTAL",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });

    function spasi(sp) {
        if (sp === 0 || sp === "0"){
            return ""
        }if (sp === 4 || sp === "4"){
            return ""
        }if (sp === 8 || sp === "8"){
            return ""
        }if (sp === 12 || sp === "12"){
            return ""
        }if (sp === 16 || sp === "16"){
            return ""
        }
    }

    var externalDataRencanaPembayaran = []
    $.each(allData.dataCashFlow.return, function (index, v) {
        var helloooow;
        helloooow = {
            KETERANGAN: spasi(v.SPASI) + v.KETERANGAN,
            TANGGAL1: accounting.formatNumber(v.TANGGAL1, 2, ".", ","),
            TANGGAL2: accounting.formatNumber(v.TANGGAL2, 2, ".", ","),
            TANGGAL3: accounting.formatNumber(v.TANGGAL3, 2, ".", ","),
            TANGGAL4: accounting.formatNumber(v.TANGGAL4, 2, ".", ","),
            TANGGAL5: accounting.formatNumber(v.TANGGAL5, 2, ".", ","),
            TANGGAL6: accounting.formatNumber(v.TANGGAL6, 2, ".", ","),
            TANGGAL7: accounting.formatNumber(v.TANGGAL7, 2, ".", ","),
            TOTAL: accounting.formatNumber(v.TOTAL, 2, ".", ","),
        }
        externalDataRencanaPembayaran.push(helloooow)
    });

    function buildTableRencanaPembayaran(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row, index) {
            var dataRow = [];
            // console.log("row : ", row);

            dataRow.push(row["KETERANGAN"]);
            dataRow.push({text: row["TANGGAL1"], alignment: "right"});
            dataRow.push({text: row["TANGGAL2"], alignment: "right"});
            dataRow.push({text: row["TANGGAL3"], alignment: "right"});
            dataRow.push({text: row["TANGGAL4"], alignment: "right"});
            dataRow.push({text: row["TANGGAL5"], alignment: "right"});
            dataRow.push({text: row["TANGGAL6"], alignment: "right"});
            dataRow.push({text: row["TANGGAL7"], alignment: "right"});
            dataRow.push({text: row["TOTAL"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableRencanaPembayaran(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableRencanaPembayaran(data, columns)
            }
        };
    }

    //    JENIS PEMBAYARAN

    var columnPosisiSaldo = [];
    columnPosisiSaldo.push({
        text: "SALDO AWAL",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 12.5, 5, 12.5]
    });

    columnPosisiSaldo.push({
        text: "TOTAL",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });

    var externalDataPosisiSaldo = [];
    var data1 = {
        SALDO_AWAL: "POTENSI PENDAPATAN PTL",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_POTENSI, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data1)

    var data2 = {
        SALDO_AWAL: "RECEIPT",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_RECEIPT, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data2)

    var data3 = {
        SALDO_AWAL: "KMK",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_KMK, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data3)

    var data4 = {
        SALDO_AWAL: "SUBSIDI",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_SUBSIDI, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data4)

    var data5 = {
        SALDO_AWAL: "IMPREST OPERASI",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_OPERASI, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data5)

    var data6 = {
        SALDO_AWAL: "IMPREST INVESTASI",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_INVESTASI, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data6)

    var data7 = {
        SALDO_AWAL: "IMPREST",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_IMPREST, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data7)

    var data8 = {
        SALDO_AWAL: "IMPREST IMPOR",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_IMPOR, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data8)

    var data9 = {
        SALDO_AWAL: "IMPREST VALAS",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_VALAS, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data9)

    var data10 = {
        SALDO_AWAL: "TOTAL",
        TOTAL: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].SALDO_AWAL, 2, ".", ","),
    }
    externalDataPosisiSaldo.push(data10)

    function buildTablePosisiSaldo(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row, index) {
            var dataRow = [];
            // console.log("row : ", row);

            dataRow.push(row["SALDO_AWAL"]);
            dataRow.push({text: row["TOTAL"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tablePosisiSaldo(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTablePosisiSaldo(data, columns)
            }
        };
    }

    var date = new Date();

    var year = date.getUTCFullYear();

    var date1 = new Date(date.setDate(date.getDate()));
    var month1 = date1.getUTCMonth() + 1;

    var date2 = new Date(date.setDate(date.getDate() + 1));
    var month2 = date2.getUTCMonth() + 1;

    var date3 = new Date(date.setDate(date.getDate() + 1));
    var month3 = date3.getUTCMonth() + 1;

    var date4 = new Date(date.setDate(date.getDate() + 1));
    var month4 = date4.getUTCMonth() + 1;

    var date5 = new Date(date.setDate(date.getDate() + 1));
    var month5 = date5.getUTCMonth() + 1;

    var date6 = new Date(date.setDate(date.getDate() + 1));
    var month6 = date6.getUTCMonth() + 1;

    var date7 = new Date(date.setDate(date.getDate() + 1));
    var month7 = date7.getUTCMonth() + 1;

    var columnJenisPembayaran = [];
    columnJenisPembayaran.push({
        text: "JENIS PEMBAYARAN",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 12.5, 5, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date1.getUTCDate()) + "/" + month1 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date2.getUTCDate()) + "/" + month2 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date3.getUTCDate()) + "/" + month3 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date4.getUTCDate()) + "/" + month4 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date5.getUTCDate()) + "/" + month5 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date6.getUTCDate()) + "/" + month6 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: (date7.getUTCDate()) + "/" + month7 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnJenisPembayaran.push({
        text: "TOTAL",
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });

    var externalDataJenisPembayaran = []
    $.each(allData.dataRekapJenisPembayaran.return, function (index, v) {
        var helloooow;
        helloooow = {
            NAMA_PEMBAYARAN: v.NAMA_PEMBAYARAN,
            TAGIHAN1: accounting.formatNumber(v.TAGIHAN1, 2, ".", ","),
            TAGIHAN2: accounting.formatNumber(v.TAGIHAN2, 2, ".", ","),
            TAGIHAN3: accounting.formatNumber(v.TAGIHAN3, 2, ".", ","),
            TAGIHAN4: accounting.formatNumber(v.TAGIHAN4, 2, ".", ","),
            TAGIHAN5: accounting.formatNumber(v.TAGIHAN5, 2, ".", ","),
            TAGIHAN6: accounting.formatNumber(v.TAGIHAN6, 2, ".", ","),
            TAGIHAN7: accounting.formatNumber(v.TAGIHAN7, 2, ".", ","),
            TOTAL_PERJENIS: accounting.formatNumber(v.TOTAL_TAGIHAN_PERJENIS, 2, ".", ","),
        }
        externalDataJenisPembayaran.push(helloooow)
    });

    var helloooow = {
        NAMA_PEMBAYARAN: "TOTAL",
        TAGIHAN1: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN1, 2, ".", ","),
        TAGIHAN2: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN2, 2, ".", ","),
        TAGIHAN3: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN3, 2, ".", ","),
        TAGIHAN4: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN4, 2, ".", ","),
        TAGIHAN5: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN5, 2, ".", ","),
        TAGIHAN6: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN6, 2, ".", ","),
        TAGIHAN7: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_TAGIHAN7, 2, ".", ","),
        TOTAL_PERJENIS: accounting.formatNumber(allData.dataRekapJenisPembayaran.OUT_TOTAL[0].TOTAL_PERJENIS, 2, ".", ","),
    }
    externalDataJenisPembayaran.push(helloooow)

    function buildTableJenisPembayaran(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row, index) {
            var dataRow = [];
            // console.log("row : ", row);

            dataRow.push(row["NAMA_PEMBAYARAN"]);
            dataRow.push({text: row["TAGIHAN1"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN2"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN3"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN4"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN5"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN6"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN7"], alignment: "right"});
            dataRow.push({text: row["TOTAL_PERJENIS"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableJenisPembayaran(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableJenisPembayaran(data, columns)
            }
        };
    }

    var columnTotalJenisPembayaran = [];
    columnTotalJenisPembayaran.push({
        text: "SALDO AKHIR",
        style: "tableHeader",
        alignment: "center",
        margin: [5, 12.5, 5, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date1.getUTCDate()) + "/" + month1 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date2.getUTCDate()) + "/" + month2 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date3.getUTCDate()) + "/" + month3 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date4.getUTCDate()) + "/" + month4 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date5.getUTCDate()) + "/" + month5 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date6.getUTCDate()) + "/" + month6 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });
    columnTotalJenisPembayaran.push({
        text: (date7.getUTCDate()) + "/" + month7 + "/" + year,
        style: "tableHeader",
        alignment: "center",
        margin: [20, 12.5, 20, 12.5]
    });

    var externalDataTotalJenisPembayaran = []
    $.each(allData.dataRekapJenisPembayaran.OUT_TOTAL, function (index, v) {
        var helloooow;
        helloooow = {
            NAMA_PEMBAYARAN: "TOTAL",
            TAGIHAN1: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN1, 2, ".", ","),
            TAGIHAN2: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN2, 2, ".", ","),
            TAGIHAN3: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN3, 2, ".", ","),
            TAGIHAN4: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN4, 2, ".", ","),
            TAGIHAN5: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN5, 2, ".", ","),
            TAGIHAN6: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN6, 2, ".", ","),
            TAGIHAN7: accounting.formatNumber(v.SALDO_AKHIR_TAGIHAN7, 2, ".", ","),
            SALDO: accounting.formatNumber(v.TOTAL_SALDO_AKHIR, 2, ".", ","),
        }
        externalDataTotalJenisPembayaran.push(helloooow)
    });

    function buildTableTotalJenisPembayaran(data, columns) {
        var body = [];

        body.push(columns);
        console.log(columns);

        data.forEach(function (row, index) {
            var dataRow = [];
            // console.log("row : ", row);
            dataRow.push(row["NAMA_PEMBAYARAN"]);
            dataRow.push({text: row["TAGIHAN1"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN2"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN3"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN4"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN5"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN6"], alignment: "right"});
            dataRow.push({text: row["TAGIHAN7"], alignment: "right"});
            body.push(dataRow);
        });

        return body;
    }

    function tableTotalJenisPembayaran(data, columns) {
        return {
            style: "tableExample",
            color: "#444",
            table: {
                headerRows: 1,
                body: buildTableTotalJenisPembayaran(data, columns)
            }
        };
    }

    // CREATE DOC
    var docDefinition = {
        pageOrientation: "landscape",
        content: [{
            text: "LAPORAN DASHBOARD IDR",
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
                text: "SALDO IMPREST, IMPREST TERPUSAT & IMPOR",
                style: "header",
                alignment: "center"
            },
            tableSaldoIdrImprest(externalSaldoIdrDataImprst, columnSaldoIdrDataImprst),
            {
                text: " ",
                style: "header",
                alignment: "center"
            },
            {
                text: "SALDO SUBSIDI DAN KMK",
                style: "header",
                alignment: "center"
            },
            tableSubsidiKmk(externalDataSubsidiKmk, columnSubsidiKmk),
            {
                text: " ",
                style: "header",
                alignment: "center"
            },
            {
                text: "RECEIPT",
                style: "header",
                alignment: "center"
            },
            tableReceipt(externalDataReceipt, columnReceipt),
            {
                text: " ",
                style: "header",
                alignment: "center",
            }, {

                text: " ",
                style: "header",
                alignment: "center",
            }, {

                text: "RENCANA BAYAR IMPREST OPERASI & INVESTASI TERPUSAT",
                style: "header",
                alignment: "center"
            },
            tableRencanaBayarOperasiTerpusat(externalDataRencanaBayarOperasiTerpusat, columnRencanaOperasiTerpusat),
            {
                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: "after"
            },
            {
                text: " ",
                style: "header",
                alignment: "center",
            },
            {

                text: "RENCANA BAYAR IMPREST DAN IMPOR",
                style: "header",
                alignment: "center"
            },
            tableRencanaBayarImprestImpor(externalDataRencanaBayarImprestImpor, columnRencanaImprestImpor),
            {
                text: " ",
                style: "header",
                alignment: "center"
            },
            {
                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: "after"
            },
            {
                text: "RENCANA BAYAR EQUIVALEN RUPIAH",
                style: "header",
                alignment: "center"
            },
            tableRencanaBayarEquivalenRupiah(externalDataRencanaBayarEquivalenRupiah, columnRencanaBayarEquivalenRupiah),
            {
                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'

            },
            {
                text: "RENCANA VS REALISASI",
                style: "header",
                alignment: "center",
            },
            {
                text: "TOTAL RENCANA PEMBAYARAN",
                style: "header",
                alignment: "center"
            },
            tableRencanaBayar(externalDataTotalRencanaBayar, columnTableTotalRencanaBayar),
            {
                text: " ",
                style: "header",
                alignment: "center"
            },
            {
                text: "PEMBAYARAN YANG BELUM TEREALISASI",
                style: "header",
                alignment: "center"
            },
            tableBelumTerealisasi(externalDataBelumTerealisasi, columnTableBelumTerealisasi),
            {
                text: " ",
                style: "header",
                alignment: "center"
            },
            {
                text: "PEMBAYARAN YANG SUDAH TEREALISASI",
                style: "header",
                alignment: "center"
            },
            tableSudahTerealisasi(externalDataSudahTerealisasi, columnTableSudahTerealisasi),
            {
                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {
                text: "JENIS PEMBAYARAN",
                style: "header",
                alignment: "center"
            },
            {
                text: "POSISI SALDO",
                style: "header",
                alignment: "left"
            },
            tableRencanaPembayaran(externalDataRencanaPembayaran, columnRencanaPembayaran),
            {
                text: " ",
                style: "header",
                alignment: "center",
                pageBreak: 'after'
            },
            {
                text: " ",
                style: "header",
                alignment: "center"
            }, {
                text: "TOTAL JENIS PEMBAYARAN",
                style: "header",
                alignment: "left"
            },
            tablePosisiSaldo(externalDataPosisiSaldo, columnPosisiSaldo),
            {
                text: " ",
                style: "header",
                alignment: "center"
            }, {

                text: "JENIS PEMBAYARAN",
                style: "header",
                alignment: "left"
            },
            tableJenisPembayaran(externalDataJenisPembayaran, columnJenisPembayaran),
            {
                text: " ",
                style: "header",
                alignment: "center"
            }, {

                text: "JENIS PEMBAYARAN",
                style: "header",
                alignment: "left"
            },
            tableTotalJenisPembayaran(externalDataTotalJenisPembayaran, columnTotalJenisPembayaran),
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
    pdfMake.createPdf(docDefinition).download('idr_dashboard.pdf');
}