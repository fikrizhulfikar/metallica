package com.iconpln.liquiditas.monitoring.controller.verifikator;

import com.iconpln.liquiditas.core.service.DashboardService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_dashboard")
public class DashboardController {

    @Autowired
    DashboardService dashboardService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/get_rekening", method = RequestMethod.GET)
    public Map getRekening() {
        try {
            return dashboardService.getRekening();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    @RequestMapping(value = "/get_idr_imprest", method = RequestMethod.GET)
    public Map getIdrImprst() {
        try {
            return dashboardService.getSaldoIdrImprest();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/get_idr_subsidi_kmk", method = RequestMethod.GET)
    public Map getIdrSubsidiKmk() {
        try {
            return dashboardService.getSaldoIdrSubsidiKmk();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/get_idr_receipt", method = RequestMethod.GET)
    public Map getIdrReceipt() {
        try {
            return dashboardService.getSaldoIdrReceipt();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    ////////////
    ///IDR//////
    ////////////
    @RequestMapping(value = "/get_rencana_bayar_imprest_operasi_terpusat", method = RequestMethod.GET)
    public Map getRencanaBayarImprest(@RequestParam(value = "pTgl_akhir", defaultValue = "") String tanggalAkhir) {
        try {
            return dashboardService.getRencanaBayarImprestOperasiTerpusat(tanggalAkhir);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    ////////////
    ///IDR//////
    ////////////
    @RequestMapping(value = "/get_rencana_bayar_imprest_dan_import", method = RequestMethod.GET)
    public Map getRencanaBayarImprestDanImport(@RequestParam(value = "pTgl_akhir", defaultValue = "") String tanggalAkhir) {
        try {
            return dashboardService.getRencanaBayarImprestDanImport(tanggalAkhir);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    ////////////
    ///IDR//////
    ////////////
    @RequestMapping(value = "/get_rencana_bayar_equivalen_rupiah", method = RequestMethod.GET)
    public Map getRencanaBayarEquivalenRupiah(@RequestParam(value = "pTgl_akhir", defaultValue = "") String tanggalAkhir) {
        try {
            Map map = dashboardService.getRencanaBayarEquivalenRupiah(tanggalAkhir);
            System.out.println("map" +map.toString());
            return dashboardService.getRencanaBayarEquivalenRupiah(tanggalAkhir);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }


    }

    @RequestMapping(value = "/get_realisasi_placement", method = RequestMethod.GET)
    public Map getRealisasiPlacement() {
        try {
            return dashboardService.getRealisasiPlacement();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_report_detail_placement", method = RequestMethod.GET)
    public Map getReportDetailPlacement(@RequestParam(value = "pJenis", defaultValue = "") String pJenis) {
        try {
            return dashboardService.getReportDetailPlacement(pJenis);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_derivatif_deposito", method = RequestMethod.GET)
    public Map getDerivatifDeposito() {
        try {
            return dashboardService.getDerivatifDeposito();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/get_realisasi_pembayaran_valuta_asing", method = RequestMethod.GET)
    public Map getAllRealisasiRekap(@RequestParam(value = "pYear", defaultValue = "") String pYear) {
        try {
            return dashboardService.getRealisasiPembayaran(pYear);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/get_realisasi_pembelian_valuta_asing", method = RequestMethod.GET)
    public Map getAllPembelianValasAktual(@RequestParam(value = "pYear", defaultValue = "") String pYear) {
        try {
            return dashboardService.getPembelianValas(pYear);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    ////////////
    ///valas////
    ////////////
    @RequestMapping(value = "/get_rencana_bayar_valuta_asing_mingguan_eur_others", method = RequestMethod.GET)
    public Map getRencanaBayarValutaAsingMingguanV2(@RequestParam(value = "pTgl", defaultValue = "") String pTgl) {

        try {
            return dashboardService.getRencanaBayarValutaAsingMingguanEurOthers(pTgl);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    ////////////
    ///valas////
    ////////////
    @RequestMapping(value = "/get_rencana_bayar_valuta_asing_mingguan_usd_jpy", method = RequestMethod.GET)
    public Map getRencanaBayarValutaAsingMingguanV1
    (@RequestParam(value = "pTgl", defaultValue = "") String pTgl) {

        try {
            return dashboardService.getRencanaBayarValutaAsingMingguanUsdJpy(pTgl);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    ////////////////
    ////////////////
    //GetAll_Valas//
    ////////////////
    ////////////////
    @RequestMapping(value = "/getall_data_dashboard", method = RequestMethod.GET)
    public Map getAllDashboard
    (@RequestParam(value = "pTglUsd", defaultValue = "") String pTglUsd,
     @RequestParam(value = "pTglEur", defaultValue = "") String pTglEur) {
        try {
            Map data = new HashMap();
            data.put("dataImprstBond", dashboardService.getRekening());
            data.put("dataDerivatifDeposito", dashboardService.getDerivatifDeposito());
            data.put("dataRealisasiPembayaran", dashboardService.getRealisasiPembayaran(String.valueOf(Calendar.getInstance().get(Calendar.YEAR))));
            data.put("dataPembelianValas", dashboardService.getPembelianValas(String.valueOf(Calendar.getInstance().get(Calendar.YEAR))));
            data.put("dataRencanaBayarUsdJpy", dashboardService.getRencanaBayarValutaAsingMingguanUsdJpy(pTglUsd));
            data.put("dataRencanaBayarEurOthers", dashboardService.getRencanaBayarValutaAsingMingguanEurOthers(pTglEur));

            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    ////////////////
    ///XLS_valas////
    ////////////////
    @RequestMapping(value = "/xls", method = RequestMethod.GET)
    public String export(HttpServletResponse response,
                         @RequestParam(value = "pTglUsd", defaultValue = "") String pTglUsd,
                         @RequestParam(value = "pTglEur", defaultValue = "") String pTglEur) {
        try {
            String title = "LAPORAN DASHBOARD";
            String namaFile = "dashboard.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listDataDetailImrspt = (List<Map<String, Object>>) dashboardService.getRekening().get("return");
            List<Map<String, Object>> listTotalImrspt = (List<Map<String, Object>>) dashboardService.getRekening().get("OUT_TOTAL");
//            List<Map<String, Object>> listDataDetailBond = (List<Map<String,Object>>) dashboardService.getRekening().get("OUT_GLOBAL_BOND");
//            List<Map<String, Object>> listTotalBond = (List<Map<String,Object>>) dashboardService.getRekening().get("OUT_TOTAL_GLOBAL_BOND");

            List<Map<String, Object>> listDataDerivatifDeposito = (List<Map<String, Object>>) dashboardService.getDerivatifDeposito().get("return");
            List<Map<String, Object>> listTotalDerivatifDeposito = (List<Map<String, Object>>) dashboardService.getDerivatifDeposito().get("OUT_TOTAL");


            List<Map<String, Object>> listDataBayarHari = (List<Map<String, Object>>) dashboardService.getRealisasiPembayaran(String.valueOf(Calendar.getInstance().get(Calendar.YEAR))).get("return");
            List<Map<String, Object>> listDataBayarRekap = (List<Map<String, Object>>) dashboardService.getRealisasiPembayaran(String.valueOf(Calendar.getInstance().get(Calendar.YEAR))).get("OUT_TABLE2");

            List<Map<String, Object>> listDataBelirHari = (List<Map<String, Object>>) dashboardService.getPembelianValas(String.valueOf(Calendar.getInstance().get(Calendar.YEAR))).get("return");
            List<Map<String, Object>> listDataBeliRekap = (List<Map<String, Object>>) dashboardService.getPembelianValas(String.valueOf(Calendar.getInstance().get(Calendar.YEAR))).get("OUT_TABLE2");


            List<Map<String, Object>> listDataBayaUsdJpy = (List<Map<String, Object>>) dashboardService.getRencanaBayarValutaAsingMingguanUsdJpy(pTglUsd).get("return");
            List<Map<String, Object>> listDataBayaEurOthers = (List<Map<String, Object>>) dashboardService.getRencanaBayarValutaAsingMingguanEurOthers(pTglEur).get("return");

            AppUtils.getLogger(this).info("LIST DATA DETAIL IMPRST : {}", listDataDetailImrspt.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL IMPRST : {}", listTotalImrspt.toString());
//            AppUtils.getLogger(this).info("LIST DATA DETAIL BOND : {}", listDataDetailBond.toString());
//            AppUtils.getLogger(this).info("LIST DATA TOTAL BOND : {}", listTotalBond.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL DERIVATIF DEPOSITO : {}", listDataDerivatifDeposito.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL DERIVATIF DEPOSITO : {}", listTotalDerivatifDeposito.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL BAYAR HARI : {}", listDataDerivatifDeposito.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL BAYAR REKAP : {}", listTotalDerivatifDeposito.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL BELI HARI : {}", listDataDerivatifDeposito.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL BELI REKAP : {}", listTotalDerivatifDeposito.toString());

            AppUtils.getLogger(this).info("LIST DATA DETAIL BAYAR USD JPY : {}", listDataBayaUsdJpy.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL BAYAR EUR OTHERS : {}", listDataBayaEurOthers.toString());

            Map param = new HashMap();
            Date myDate = new Date();
            param.put("TGL_CETAK", new SimpleDateFormat("dd-MM-yyyy").format(myDate));
            param.put("TITLE", title);
            param.put("DETAIL_IMPRST", listDataDetailImrspt);
            param.put("TOTAL_IMPRST", listTotalImrspt);
//            param.put("DETAIL_BOND", listDataDetailBond);
//            param.put("TOTAL_BOND", listTotalBond);

            param.put("DETAIL_DERIVATIF_DEPOSITO", listDataDerivatifDeposito);
            param.put("TOTAL_DERIVATIF_DEPOSITO", listTotalDerivatifDeposito);

            param.put("JUDUL_BAYAR_HARIAN", listDataBayarHari.get(0).get("TITLE"));
            param.put("DETAIL_BAYAR_HARIAN", listDataBayarHari);
            param.put("JUDUL_BAYAR_REKAP", listDataBayarRekap.get(0).get("TITLE"));
            param.put("DETAIL_BAYAR_REKAP", listDataBayarRekap);

            param.put("JUDUL_BELI_HARIAN", listDataBelirHari.get(0).get("TITLE"));
            param.put("DETAIL_BELI_HARIAN", listDataBelirHari);
            param.put("JUDUL_BELI_HARIAN", listDataBeliRekap.get(0).get("TITLE"));
            param.put("DETAIL_BELI_REKAP", listDataBeliRekap);

            param.put("DETAIL_BAYAR_USD_JPY", listDataBayaUsdJpy);
            param.put("DETAIL_BAYAR_EUR_OTHERS", listDataBayaEurOthers);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/dashboard.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //////////////
    //////////////
    //GetAll_IDR//
    //////////////
    //////////////

    @RequestMapping(value = "/getall_data_dashboard_idr", method = RequestMethod.GET)
    public Map getAllDashboardIdr
    (@RequestParam(value = "pTglTerpusat", defaultValue = "") String pTglTerpusat,
     @RequestParam(value = "pTglImport", defaultValue = "") String pTglImport,
     @RequestParam(value = "pTglRupiah", defaultValue = "") String pTglRupiah) {

        try {
            Map data = new HashMap();
            data.put("dataSaldoIdrImprest", dashboardService.getSaldoIdrImprest());
            data.put("dataSaldoIdrReceipt", dashboardService.getSaldoIdrReceipt());
            data.put("dataSaldoIdrSubsidiKmk", dashboardService.getSaldoIdrSubsidiKmk());
            data.put("dataRealisasiPlacement", dashboardService.getRealisasiPlacement());
            data.put("dataRencanaBayarImprestOperasiTerpusat", dashboardService.getRencanaBayarImprestOperasiTerpusat(pTglTerpusat));
            data.put("dataRencanaBayarImprestDanImport", dashboardService.getRencanaBayarImprestDanImport(pTglImport));
            data.put("dataRencanaBayarEquivalenRupiah", dashboardService.getRencanaBayarEquivalenRupiah(pTglRupiah));
            data.put("dataRekapJenisPembayaran", dashboardService.getRekapJenisPembayaran());
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //////////////
    //////////////
    //xls_IDR/////
    //////////////
    //////////////
    @RequestMapping(value = "/xls_idr", method = RequestMethod.GET)
    public String exportIdr(HttpServletResponse response,
                            @RequestParam(value = "pTglTerpusat", defaultValue = "") String pTglTerpusat,
                            @RequestParam(value = "pTglImport", defaultValue = "") String pTglImport,
                            @RequestParam(value = "pTglRupiah", defaultValue = "") String pTglRupiah)
    {
        try {

            String title = "LAPORAN DASHBOARD IDR";
            String namaFile = "dashboard_idr.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listDataSaldoIdrImprest = (List<Map<String, Object>>) dashboardService.getSaldoIdrImprest().get("return");
            List<Map<String, Object>> listTotalSaldoIdrImprest = (List<Map<String, Object>>) dashboardService.getSaldoIdrImprest().get("OUT_TOTAL");

            List<Map<String, Object>> listRealisasiPlacement = (List<Map<String, Object>>) dashboardService.getRealisasiPlacement().get("return");
            List<Map<String, Object>> listDataBankRealisasiPlacement = (List<Map<String, Object>>) dashboardService.getRealisasiPlacement().get("OUT_PIE_IMPREST");

            List<Map<String, Object>> listDataSaldoIdrSubsidiKmk = (List<Map<String, Object>>) dashboardService.getSaldoIdrSubsidiKmk().get("return");
            List<Map<String, Object>> listTotalSaldoIdrSubsidiKmk = (List<Map<String, Object>>) dashboardService.getSaldoIdrSubsidiKmk().get("OUT_TOTAL");

            List<Map<String, Object>> listDataSaldoIdrReceipt = (List<Map<String, Object>>) dashboardService.getSaldoIdrReceipt().get("return");
            List<Map<String, Object>> listTotalSaldoIdrReceipt = (List<Map<String, Object>>) dashboardService.getSaldoIdrReceipt().get("OUT_TOTAL");

            List<Map<String, Object>> listBayarImprestOperasiTerpusat = (List<Map<String, Object>>) dashboardService.getRencanaBayarImprestOperasiTerpusat(pTglTerpusat).get("return");

            List<Map<String, Object>> listBayarImprestImport = (List<Map<String, Object>>) dashboardService.getRencanaBayarImprestDanImport(pTglImport).get("return");

            List<Map<String, Object>> listBayarEquivalenRupiah = (List<Map<String, Object>>) dashboardService.getRencanaBayarEquivalenRupiah(pTglRupiah).get("return");

            List<Map<String, Object>> listJenisPembayaran = (List<Map<String, Object>>) dashboardService.getRekapJenisPembayaran().get("return");
            List<Map<String, Object>> listTotalJenisPembayaran = (List<Map<String, Object>>) dashboardService.getRekapJenisPembayaran().get("OUT_TOTAL");

            AppUtils.getLogger(this).info("LIST DATA DETAIL IMPRST : {}", listDataSaldoIdrImprest.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL IMPRST : {}", listTotalSaldoIdrImprest.toString());
            AppUtils.getLogger(this).info("LIST DATA REALISASI PLACEMENT : {}", listRealisasiPlacement.toString());
            //AppUtils.getLogger(this).info("LIST DATA BANK PLACEMENT : {}", listDataBankRealisasiPlacement.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL PINBUK, KMK, SUBSIDI : {}", listDataSaldoIdrSubsidiKmk.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL PINBUK, KMK, SUBSIDI : {}", listTotalSaldoIdrSubsidiKmk.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL RECEIPT : {}", listDataSaldoIdrReceipt.toString());
            AppUtils.getLogger(this).info("LIST DATA TOTAL RECEIPT : {}", listTotalSaldoIdrReceipt.toString());

            //AppUtils.getLogger(this).info("LIST DATA DETAIL BAYAR OPERASI DAN INVESTASI TERPUSAT : {}", listBayarImprestOperasiTerpusat.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL BAYAR IMPREST DAN IMPORT : {}", listBayarImprestImport.toString());
            AppUtils.getLogger(this).info("LIST DATA DETAIL BAYAR EQUIVALEN RUPIAH : {}", listBayarEquivalenRupiah.toString());

            AppUtils.getLogger(this).info("LIST DATA JENIS PEMBAYARAN : {}", listJenisPembayaran.toString());
            AppUtils.getLogger(this).info("LIST TOTAL JENIS PEMBAYARAN: {}", listTotalJenisPembayaran.toString());

            Map param = new HashMap();
            Date myDate = new Date();
            param.put("TGL_CETAK", new SimpleDateFormat("dd-MM-yyyy").format(myDate));
            param.put("TITLE", title);
            param.put("DETAIL_IMPRST", listDataSaldoIdrImprest);
            param.put("TOTAL_IMPRST", listTotalSaldoIdrImprest);
            param.put("DETAIL_PINBUK_KMK_SUBSIDI", listDataSaldoIdrSubsidiKmk);
            param.put("TOTAL_PINBUK_KMK_SUBSIDI", listTotalSaldoIdrSubsidiKmk);

            param.put("DETAIL_RECEIPT", listDataSaldoIdrReceipt);
            param.put("TOTAL_RECEIPT", listTotalSaldoIdrReceipt);
            //param.put("DETAIL_REALISASI_PLACEMENT", listDataRealisasiPlacement);
            param.put("DETAIL_BANK_REALISASI_PLACEMENT", listDataBankRealisasiPlacement);
            param.put("DETAIL_REALISASI_PLACEMENT", listRealisasiPlacement);
            param.put("DETAIL_BAYAR_TERPUSAT", listBayarImprestOperasiTerpusat);
            param.put("DETAIL_BAYAR_IMPREST_IMPORT", listBayarImprestImport);
            param.put("DETAIL_BAYAR_EQUIVALEN_RUPIAH", listBayarEquivalenRupiah);

            param.put("DATE1", AppUtils.getDateByPlus(0));
            param.put("DATE2", AppUtils.getDateByPlus(1));
            param.put("DATE3", AppUtils.getDateByPlus(2));
            param.put("DATE4", AppUtils.getDateByPlus(3));
            param.put("DATE5", AppUtils.getDateByPlus(4));
            param.put("DATE6", AppUtils.getDateByPlus(5));
            param.put("DATE7", AppUtils.getDateByPlus(6));
            param.put("DETAIL_JENIS_PEMBAYARAN", listJenisPembayaran);
            param.put("TOTAL_JENIS_PEMBAYARAN", listTotalJenisPembayaran);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/dashboard_idr.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    @RequestMapping(value = "/get_rekap_jenis_pembayaran", method = RequestMethod.GET)
    public Map getRekapJenisPembayaran() {
        try {
            return dashboardService.getRekapJenisPembayaran();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/idr_rencana_vs_realisasi", method = RequestMethod.GET)
    public Map getRencanaVsRealisasiIdr() {
        try {
            return dashboardService.getRencanaVsRealisasiIdr();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

}
