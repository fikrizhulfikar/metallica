package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.monitoring.service.NotificationService;
import com.iconpln.liquiditas.monitoring.utils.MailUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/pembayaran")
public class PembayaranController {

    @Autowired
    ValasService valasService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    MailUtils mailUtils;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/get_data_rekapitulasi", method = RequestMethod.GET)
    public Map listRekapData(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListPembayaran(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        AppUtils.getLogger(this).info("list data : {}", list.toString());
        if (list.size() < 1 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        final Thread outThread = new Thread() {
            @Override
            public void run() {
                notificationService.broadcastStatus("gggggggggggggggg");
            }

            ;
        };
        outThread.start();

        return mapData;
    }

    @RequestMapping(value = "/get_data_realisasi", method = RequestMethod.GET)
    public Map listRealisasi(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListRealisasi(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, WebUtils.getUsernameLogin(), pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        AppUtils.getLogger(this).info("list data : {}", list.toString());
        if (list.size() < 1 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/get_all_pembayaran", method = RequestMethod.GET)
    public List getAllpembayaran(
            @RequestParam(value = "pStatusValas", defaultValue = "ALL") String pStatusValas,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurr", defaultValue = "ALL") String pCurr,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran
    ) {
        try {
            return valasService.getAllpembayaran(pStatusValas, WebUtils.getUsernameLogin(), pTglAwal, pTglAkhir, pBank, pCurr, pPembayaran);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getRekapDataById(
            @RequestParam(value = "pIdValas", defaultValue = "") String pId
    ) {
        AppUtils.getLogger(this).info("pId edit data: {}", pId);
        try {
            return valasService.getPembayaranbyId(pId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/delete_data", method = RequestMethod.POST)
    public Map<String, Object> deleteData(
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas
    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        try {
            WebUtils.deleteFile(pIdValas);
            return valasService.deletePembayaran(pIdValas);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/ins_data", method = RequestMethod.POST)
    public Map<String, Object> insData(
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "") String pJenisPembayaran,
            @RequestParam(value = "pTglJatuhTempo", defaultValue = "") String pTglJatuhTempo,
            @RequestParam(value = "pVendor", defaultValue = "") String pVendor,
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pNilaiTagihan", defaultValue = "") String pNilaiTagihan,
            @RequestParam(value = "pBankTujuan", defaultValue = "") String pBankTujuan,
            @RequestParam(value = "pBankPembayar", defaultValue = "") String pBankPembayar,
            @RequestParam(value = "pUnitPenerima", defaultValue = "") String pUnitPenerima,
            @RequestParam(value = "pNoTagihan", defaultValue = "") String pNoTagihan,
            @RequestParam(value = "pTglTagihan", defaultValue = "") String pTglTagihan,
            @RequestParam(value = "pNoNotdin", defaultValue = "") String pNoNotdin,
            @RequestParam(value = "pTglNotdin", defaultValue = "") String pTglNotdin,
            @RequestParam(value = "pStatusValas", defaultValue = "") String pStatusValas,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan,
            @RequestParam(value = "pTipeTransaksi", defaultValue = "") String pTipeTransaksi,
            @RequestParam(value = "pTglTerimaInvoice", defaultValue = "") String pTglTerimaInvoice
    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        AppUtils.getLogger(this).debug("pJenisPembayaran : {} ", pJenisPembayaran);
        AppUtils.getLogger(this).debug("pTglJatuhTempo : {} ", pTglJatuhTempo);
        AppUtils.getLogger(this).debug("pCurr : {} ", pCurr);
        AppUtils.getLogger(this).debug("pVendor : {} ", pVendor);
        AppUtils.getLogger(this).debug("pNilaiTagihan : {} ", pNilaiTagihan);
        AppUtils.getLogger(this).debug("pBankTujuan : {} ", pBankTujuan);
        AppUtils.getLogger(this).debug("pBankPembayar : {} ", pBankPembayar);
        AppUtils.getLogger(this).debug("pUnitPenerima : {} ", pUnitPenerima);
        AppUtils.getLogger(this).debug("pNoTagihan : {} ", pNoTagihan);
        AppUtils.getLogger(this).debug("pTglTagihan : {} ", pTglTagihan);
        AppUtils.getLogger(this).debug("pNoNotdin : {} ", pNoNotdin);
        AppUtils.getLogger(this).debug("pTglNotdin : {} ", pTglNotdin);
        AppUtils.getLogger(this).debug("pNoTagihan : {} ", pNoTagihan);
        AppUtils.getLogger(this).debug("pStatusValas : {} ", pStatusValas);
        AppUtils.getLogger(this).debug("pKeterangan : {} ", pKeterangan);
        AppUtils.getLogger(this).debug("pTipeTransaksi : {} ", pTipeTransaksi);
        AppUtils.getLogger(this).debug("pTglTerimaInvoice : {} ", pTglTerimaInvoice);
        try {
//            mailUtils.sendEmail("diaz.setiawan@iconpln.co.id","Hello your connected to liquiditas apps","Liquiditas Test No reply");
            return valasService.insPembayaran(pIdValas, pJenisPembayaran, pTglJatuhTempo, pVendor, pCurr, pNilaiTagihan, pBankTujuan, pBankPembayar, pUnitPenerima, pNoTagihan, pTglTagihan, pNoNotdin, pTglNotdin, pStatusValas, WebUtils.getUsernameLogin(), pKeterangan, pTipeTransaksi, pTglTerimaInvoice);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upd_status", method = RequestMethod.POST)
    public Map<String, Object> updStatus(
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pStatusInvoice", defaultValue = "") String pStatusInvoice,
            @RequestParam(value = "pDeskripsi", defaultValue = "") String pDeskripsi
    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        try {
            return valasService.updStatus(pIdValas, pStatusInvoice, pDeskripsi, WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upd_ket", method = RequestMethod.POST)
    public Map<String, Object> updStatus(
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan
            ) {
        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        try {
            return valasService.updKetLunas(pIdValas, pKeterangan, WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upd_reverse", method = RequestMethod.POST)
    public Map<String, Object> updReverse(
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan
    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        AppUtils.getLogger(this).debug("pKeterangan : {} ", pKeterangan);
        try {
            return valasService.updReverse(pIdValas, WebUtils.getUsernameLogin(), pKeterangan);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/xls/{pStatusValas}/{pTglAwal}/{pTglAkhir}/{pBank}/{pCurr}/{pPembayaran}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pStatusValas,
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pBank,
            @PathVariable String pCurr,
            @PathVariable String pPembayaran,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {

            String tglAwal = "";
            String tglAkhir = "";

            if (!pTglAwal.equals("null")) {
                tglAwal = pTglAwal;
            }
            if (!pTglAkhir.equals("null")) {
                tglAkhir = pTglAkhir;
            }

            String title;
            String namaFile;
            if (Integer.valueOf(pStatusValas) > 0) {
                title = "REALISASI PEMBAYARAN";
                namaFile = "realisasi_pembayaran.xls";
            } else {
                title = "REKAPITULASI DATA";
                namaFile = "rekapitulasi_data.xls";
            }

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = valasService.getAllpembayaran(pStatusValas, WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pBank, pCurr, pPembayaran);

            AppUtils.getLogger(this).info("data rekap : {}, report : {}", pStatusValas, listData.toString());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("ID_JENIS_PEMBAYARAN", data.get("ID_JENIS_PEMBAYARAN"));
                paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                paramDetail.put("ID_VENDOR", data.get("ID_VENDOR"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("TOTAL_TAGIHAN", data.get("TOTAL_TAGIHAN"));
                paramDetail.put("EQ_RUPIAH", data.get("EQ_RUPIAH"));
                paramDetail.put("ID_UNIT", data.get("ID_UNIT"));
                paramDetail.put("KODE_BANK_TUJUAN", data.get("KODE_BANK_TUJUAN"));
                paramDetail.put("KODE_BANK_PEMBAYAR", data.get("KODE_BANK_PEMBAYAR"));
                paramDetail.put("NO_TAGIHAN", data.get("NO_TAGIHAN"));
                paramDetail.put("TGL_TAGIHAN", data.get("TGL_TAGIHAN"));
                paramDetail.put("NO_NOTDIN", data.get("NO_NOTDIN"));
                paramDetail.put("TGL_NOTDIN", data.get("TGL_NOTDIN"));
                paramDetail.put("COUNT_DOWN", data.get("COUNT_DOWN"));
                paramDetail.put("STATUS_VALAS", data.get("STATUS_VALAS"));
                paramDetail.put("TIPE_TRANSAKSI", data.get("TIPE_TRANSAKSI"));
                paramDetail.put("TGL_INVOICE", data.get("TGL_TERIMA_INVOICE"));
                paramDetail.put("STATUS_TRACKING", data.get("STATUS_TRACKING"));
                paramDetail.put("DESKRIPSI", data.get("DESKRIPSI"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/pembayaran.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/upload_files_pembayaran", method = RequestMethod.POST)
    public Map uploadFileRekap(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pJenisFile", defaultValue = "") String pJenisFile,
            @RequestParam(value = "pFileSize", defaultValue = "") String pFileSize
    ) {
        try {
            String pFileName = WebUtils.uploadFile(file, pIdValas, pJenisFile);
            if (!pFileName.equals("")) {
                return valasService.uploadFileRekap(pIdValas, pJenisFile, new BigDecimal(pFileSize), pIdValas + pJenisFile + File.separator + pFileName, WebUtils.getUsernameLogin());
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_files_rekap", method = RequestMethod.GET)
    public Map getFilesRekap(@RequestParam(value = "pIdValas", defaultValue = "") String pIdValas) {
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("data_pembayaran", valasService.getFilesRekap(pIdValas));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upload_xls", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pJenisFile", defaultValue = "") String pJenisFile,
            @RequestParam(value = "pFileSize", defaultValue = "") String pFileSize,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        /*Map<String, Object> listFailed = Map<String, Object>*/
        return valasService.uploadXls(inputStream, WebUtils.getUsernameLogin());

//        return generateReport(response,listFailed,"result");
//        return listFailed;
    }

    @RequestMapping(value = "/get_id_upload", method = RequestMethod.GET)
    public Map getIdUpload() {
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("data_pembayaran", valasService.getIdUpload());
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    /*@RequestMapping(value = "/xls_idr", method = RequestMethod.GET)
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
    }*/
    @RequestMapping(value = "/download_template", method = RequestMethod.GET)
    public String export(HttpServletResponse response) {
        return generateReport(response,null,"template");
    }
    public String generateReport(HttpServletResponse response, List<Map<String, Object>> listFailed, String type) {
        try {
            AppUtils.getLogger(this).debug("Masuknih : {}");
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();
            String resource;
            System.out.println("resources : "+type);
                response.setHeader("Content-Disposition", "attachment; filename=\"template-rekapitulasi.xls\"");
                resource = "classpath:/templates/report/template-rekapitulasi.xls";

            System.out.println("resources : "+ resource);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource(resource).getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, value);
            workbook.write(os);
            os.flush();
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    private String parseColumn(int index) {
        switch (index) {
            case 1:
                return "JENIS_PEMBAYARAN";
            case 2:
                return "JATUH_TEMPO";
            case 3:
                return "VENDOR";
            case 4:
                return "CURRENCY";
            case 5:
                return "TAGIHAN";
            case 6:
                return "UNIT";
            case 7:
                return "BANK_TUJUAN";
            case 8:
                return "BANK_PEMBAYAR";
            case 9:
                return "TGL_TAGIHAN";
            case 10:
                return "NO_TAGIHAN";
            case 11:
                return "TLG_NOTDIN";
            case 12:
                return "NO_NOTDIN";
            case 13:
                return "TGL_LUNAS";
            case 14:
                return "COUNT_DOWN";
            case 15:
                return "TLG_NOTDIN";
            case 16:
                return "STATUS_VALAS";
            case 17:
                return "TIPE_TRANSAKSI";
            case 18:
                return "STATUS_TRACKING";
            case 19:
                return "DESKRIPSI";
            default:
                return "JENIS_PEMBAYARAN";
        }
    }

}
