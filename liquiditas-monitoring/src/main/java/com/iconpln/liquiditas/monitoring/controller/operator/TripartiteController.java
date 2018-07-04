package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.monitoring.utils.NamedIdentifier;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/tripartite")
public class TripartiteController {

    @Autowired
    ValasService valasService;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/ins_data", method = RequestMethod.POST)
    public Map<String, Object> insData(
            @RequestParam(value = "pIdTripartite", defaultValue = "") String pIdTripartite,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pTglJatuhTempo", defaultValue = "") String pTglJatuhTempo,
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pVendor", defaultValue = "") String pVendor,
            @RequestParam(value = "pJenisPembayaran", defaultValue = "") String pJenisPembayaran,
            @RequestParam(value = "pNominalSblmPajak", defaultValue = "") String pNominalSblmPajak,
            @RequestParam(value = "pPajak", defaultValue = "") String pPajak,
            @RequestParam(value = "pNominalunderlying", defaultValue = "") String pNominalunderlying,
            @RequestParam(value = "pNominalTanpaUnderlying", defaultValue = "") String pNominalTanpaUnderlying,
            @RequestParam(value = "pKursJisdor", defaultValue = "") String pKursJisdor,
            @RequestParam(value = "pSpread", defaultValue = "") String pSpread,
            @RequestParam(value = "pNoInvoice", defaultValue = "") String pNoInvoice,
            @RequestParam(value = "pTglInvoice", defaultValue = "") String pTglInvoice,
            @RequestParam(value = "pStatusTripartite", defaultValue = "") String pStatusTripartite,
            @RequestParam(value = "pTipeTransaksi", defaultValue = "") String pTipeTransaksi,
            @RequestParam(value = "pTglTerimaInvoice", defaultValue = "") String pTglTerimaInvoice,
            @RequestParam(value = "pNoNotdin", defaultValue = "") String pNoNotdin,
            @RequestParam(value = "pTglNotdin", defaultValue = "") String pTglNotdin,
            @RequestParam(value = "pDeskripsi", defaultValue = "") String pDeskripsi
    ) {
        try {
            Notification notification = Notification.builder()
                    .topic(pJenisPembayaran)
                    .title(NamedIdentifier.TRIPARTITE.getName())
                    .build();
            if (pIdTripartite != null && !pIdTripartite.equals("")) {
                String jenisPembayaranSebelum = valasService.getIdPembayaranByIdTripartite(pIdTripartite);

                Map<String, Object> outSebelum = valasService.getNotificatonDetail(pJenisPembayaran, pVendor);
                Map<String, Object> outSesudah = valasService.getNotificatonDetail(pJenisPembayaran, pVendor);

                if (jenisPembayaranSebelum != null) {
                    notification.setMessage(""
                            + WebUtils.getUsernameLogin() + " telah melakukan Perubahan/Update Data pada aplikasi."
                            + " " + outSebelum.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "") + "-" + outSebelum.getOrDefault("OUT_NAMA_VENDOR", "") + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNominalSblmPajak + "-" + pNoInvoice + "."
                            + " Perubahan: " + outSesudah.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "") + "-" + outSesudah.getOrDefault("OUT_NAMA_VENDOR", "") + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNominalSblmPajak + "-" + pNoInvoice + "."
                    );
                }
            } else {
                Map<String, Object> out = valasService.getNotificatonDetail(pJenisPembayaran, pVendor);
                Object namaJenisPembayaran = out.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "");
                Object namaVendor = out.getOrDefault("OUT_NAMA_VENDOR", "");
                notification.setMessage(""
                        + WebUtils.getUsernameLogin() + " telah melakukan Input Data pada aplikasi. "
                        + namaJenisPembayaran + "-" + namaVendor + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNominalSblmPajak + "-" + pNoInvoice + "."
                );
            }
            Map<String, Object> res = valasService.insTripartite(pIdTripartite, pBank, pTglJatuhTempo, pCurr,
                            pVendor, pJenisPembayaran, pNominalSblmPajak, pPajak,
                            pNominalunderlying, pNominalTanpaUnderlying, pKursJisdor, pSpread,
                            pNoInvoice, pTglInvoice, pStatusTripartite, WebUtils.getUsernameLogin(), pTipeTransaksi,
                            pTglTerimaInvoice,pNoNotdin, pTglNotdin, pDeskripsi);
            Object obj = res.get("return");
            if (obj != null) {
                String result = (String) obj;
                if (pIdTripartite == null || pIdTripartite.equals("") || pIdTripartite.equals(" ")) {
                    pIdTripartite = result.split(";")[1];
                }
            }
            notification.setAdditionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" +pIdTripartite);
            notificationUtil.notifyMessage(notification);
            return valasService.insTripartite(pIdTripartite, pBank, pTglJatuhTempo, pCurr,
                    pVendor, pJenisPembayaran, pNominalSblmPajak, pPajak,
                    pNominalunderlying, pNominalTanpaUnderlying, pKursJisdor, pSpread,
                    pNoInvoice, pTglInvoice, pStatusTripartite, WebUtils.getUsernameLogin(), pTipeTransaksi,
                    pTglTerimaInvoice,pNoNotdin, pTglNotdin, pDeskripsi);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_data", method = RequestMethod.GET)
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
            @RequestParam(value = "pJenisPembayaran", defaultValue = "ALL") String pJenisPembayaran,
            @RequestParam(value = "pStatus", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListTripartite(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pJenisPembayaran, pStatus,WebUtils.getUsernameLogin(), parseColumn(sortIndex), sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/get_all_tripartite", method = RequestMethod.GET)
    public List getAll(
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pJenisPembayran", defaultValue = "ALL") String pJenisPembayaran
    ) {
        try {
            return valasService.getAllTripartite(WebUtils.getUsernameLogin(),pTglAwal,pTglAkhir,pBank,pJenisPembayaran);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/delete_data", method = RequestMethod.POST)
    public Map<String, Object> deleteData(
            @RequestParam(value = "pIdTripartite", defaultValue = "") String pIdTripartite
    ) {

        AppUtils.getLogger(this).debug("pIdTripartite : {} ", pIdTripartite);
        try {
            String idJenisPembayaran = valasService.getIdPembayaranByIdTripartite(pIdTripartite);
            Map<String, Object> res = valasService.getNotificatonDetail(idJenisPembayaran, null);

            Notification notification = Notification.builder()
                    .topic(idJenisPembayaran)
                    .title(NamedIdentifier.TRIPARTITE.getName())
                    .message(""
                            + WebUtils.getUsernameLogin() + " telah menghapus Data pada aplikasi dengan jenis pembayaran "
                            + " " + res.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", ""))
                    .build();
            notificationUtil.notifyMessage(notification);
            return valasService.deleteTripartite(pIdTripartite);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getRekapDataById(
            @RequestParam(value = "pIdTripartite", defaultValue = "") String pIdTripartite
    ) {
        AppUtils.getLogger(this).info("pIdTripartite edit data: {}", pIdTripartite);
        try {
            return valasService.getTripartitebyId(pIdTripartite);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pBank}/{pJenisPembayaran}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pBank,
            @PathVariable String pJenisPembayaran,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {

            String title = "TRIPARTITE";
            String namaFile = "tripartite.xls";

            String tglAwal = "";
            String tglAkhir = "";

            if(!pTglAwal.equals("null")){
                tglAwal = pTglAwal;
            }
            if(!pTglAkhir.equals("null")){
                tglAkhir = pTglAkhir;
            }

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = valasService.getAllTripartite(WebUtils.getUsernameLogin(),tglAwal,tglAkhir,pBank,pJenisPembayaran);

            AppUtils.getLogger(this).info("data report : {}", listData.toString());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("JENIS_PEMBAYARAN", data.get("JENIS_PEMBAYARAN"));
                paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                paramDetail.put("H2_JATUH_TEMPO", data.get("H2_JATUH_TEMPO"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                paramDetail.put("BANK_CONTERPARTY", data.get("BANK_CONTERPARTY"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("NOMINAL_SBLM_PAJAK", data.get("NOMINAL_SBLM_PAJAK"));
                paramDetail.put("PAJAK", data.get("PAJAK"));
                paramDetail.put("NOMINAL_STLH_PAJAK", data.get("NOMINAL_STLH_PAJAK"));
                paramDetail.put("NOMINAL_UNDERLYING", data.get("NOMINAL_UNDERLYING"));
                paramDetail.put("NOMINAL_TANPA_UNDERLYING", data.get("NOMINAL_TANPA_UNDERLYING"));
                paramDetail.put("KURS_JISDOR", data.get("KURS_JISDOR"));
                paramDetail.put("SPREAD", data.get("SPREAD"));
                paramDetail.put("KURS_TRANSAKSI", data.get("KURS_TRANSAKSI"));
                paramDetail.put("NOMINAL_PEMBAYARAN_IDR", data.get("NOMINAL_PEMBAYARAN_IDR"));

                paramDetail.put("TGL_INVOICE", data.get("TGL_INVOICE"));
                paramDetail.put("TGL_TERIMA_INVOICE", data.get("TGL_TERIMA_INVOICE"));
                paramDetail.put("NO_INVOICE", data.get("NO_INVOICE"));
                paramDetail.put("TGL_NOTDIN", data.get("TGL_NOTDIN"));
                paramDetail.put("NO_NOTDIN", data.get("NO_NOTDIN"));
                paramDetail.put("TGL_LUNAS", data.get("TGL_LUNAS"));
                paramDetail.put("COUNT_DOWN", data.get("COUNT_DOWN"));
                paramDetail.put("STATUS_TRIPARTITE", data.get("STATUS_TRIPARTITE"));
                paramDetail.put("TIPE_TRANSAKSI", data.get("TIPE_TRANSAKSI"));
                paramDetail.put("STATUS_TRACKING", data.get("STATUS_TRACKING"));
                paramDetail.put("DESKRIPSI", data.get("DESKRIPSI"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/tripartite.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/upload_files_tripartite", method = RequestMethod.POST)
    public Map uploadFileRekap(
            @RequestParam(value = "file") MultipartFile file,
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pJenisFile", defaultValue = "") String pJenisFile,
            @RequestParam(value = "pFileSize", defaultValue = "") String pFileSize
    ) {
        try {
            String pFileName = WebUtils.uploadFile(file, pIdValas, pJenisFile);
            if (!pFileName.equals("")) {
                return valasService.uploadFileTripartite(pIdValas, pJenisFile, new BigDecimal(pFileSize), pIdValas + pJenisFile + File.separator + pFileName, WebUtils.getUsernameLogin());
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_files_tripartite", method = RequestMethod.GET)
    public Map getFilesRekap(@RequestParam(value = "pIdValas", defaultValue = "") String pIdValas) {
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("data_pembayaran", valasService.getFilesTripartite(pIdValas));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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

    @RequestMapping(value = "/upload_xls", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        /*Map<String, Object> listFailed = Map<String, Object>*/
        return valasService.uploadXls(inputStream, WebUtils.getUsernameLogin(), "2", "");

//        return generateReport(response,listFailed,"result");
//        return listFailed;
    }

    @RequestMapping(value = "/download/{idUpload}", method = RequestMethod.GET)
    public String export(HttpServletResponse response,
                         @PathVariable String idUpload) throws SQLException {
        AppUtils.getLogger(this).info("DOWNLOAD {} ID UPLOAD : {}", "download tripartite", idUpload);

        return generateReport(response,valasService.getErrorData(idUpload, "2"), "download");
    }

    @RequestMapping(value = "/template", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response) throws SQLException {
        return generateReport(response,null, "template");

    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe) {
        try {
            AppUtils.getLogger(this).debug("Masuknih : {}", errorData);

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            System.out.println("value : "+value);
            String resource;
            System.out.println("resources : tripartite");

            response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_tripartite.xls\"");
            resource = "classpath:/templates/report/"+tipe+"_tripartite.xls";
            if(tipe.equals("download")){
                value.put("listFailed", errorData.get("return"));
            }

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

    public String parseColumn(int index) {
        switch (index) {
            case 1:
                return "JENIS_PEMBAYARAN";
            case 2:
                return "JATUH_TEMPO";
            case 3:
                return "H_MIN2_JATUH_TEMPO";
            case 4:
                return "VENDOR";
            case 5:
                return "BANK_COUNTERPARTY";
            case 6:
                return "CURRENCY";
            case 7:
                return "NOMINAL_SEBELUM_PAJAK";
            case 8:
                return "NOMINAL_SETELAH_PAJAK";
            case 9:
                return "NOMINAL_DENGAN_UNDERLYING";
            case 10:
                return "NOMINAL_TANPA_UNDERLYING";
            case 11:
                return "KURS_JISDOR";
            case 12:
                return "SPREAD";
            case 13:
                return "KURS_TRANSAKSI";
            case 14:
                return "NOMINAL_PEMBAYARAN_IDR";
            case 15:
                return "TGL_TERIMA_TAGIHAN";
            case 16:
                return "TGL_TAGIHAN";
            case 17:
                return "NO_TAGIHAN";
            case 18:
                return "TGL_NOTDIN";
            case 19:
                return "TGL_PEMBAYARAN";
            case 20:
                return "COUNTDOWN";
            case 21:
                return "TIPE_TRANSAKSI";
            case 22:
                return "STATUS_TAGIHAN";
            case 23:
                return "KETERANGAN";
            default:
                return "JENIS_PEMBAYARAN";
        }
    }

}
