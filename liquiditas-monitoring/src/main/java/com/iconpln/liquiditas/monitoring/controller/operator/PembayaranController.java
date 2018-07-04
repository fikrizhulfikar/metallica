package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NamedIdentifier;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/pembayaran")
public class PembayaranController {

    @Autowired
    ValasService valasService;

    @Autowired
    private NotificationUtil notificationUtil;

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
            String sortBy = parseColumn(sortIndex);
            list = valasService.getListRealisasi(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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
            String idJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
            Map<String, Object> res = valasService.getNotificatonDetail(idJenisPembayaran, null);

            Notification notification = Notification.builder()
                    .topic(idJenisPembayaran)
                    .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                    .message(""
                        + WebUtils.getUsernameLogin() + " telah menghapus Data pada aplikasi dengan jenis pembayaran "
                        + " " + res.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", ""))
                    .build();
            notificationUtil.notifyMessage(notification);
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
            Notification notification = Notification.builder()
                    .topic(pJenisPembayaran)
                    .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                    .build();
            if (pIdValas != null && !pIdValas.equals("")) {
                String jenisPembayaranSebelum = valasService.getIdPembayaranByIdValas(pIdValas);

                Map<String, Object> outSebelum = valasService.getNotificatonDetail(jenisPembayaranSebelum, pVendor);
                Map<String, Object> outSesudah = valasService.getNotificatonDetail(pJenisPembayaran, pVendor);

                if (jenisPembayaranSebelum != null) {
                    notification.setMessage(""
                            + WebUtils.getUsernameLogin() + " telah melakukan Perubahan/Update Data pada aplikasi."
                            + " " + outSebelum.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "") + "-" + outSebelum.getOrDefault("OUT_NAMA_VENDOR", "") + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNilaiTagihan + "-" + pNoTagihan + "."
                            + " Perubahan: " + outSesudah.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "") + "-" + outSesudah.getOrDefault("OUT_NAMA_VENDOR", "") + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNilaiTagihan + "-" + pNoTagihan + "."
                    );
                }
            } else {
                Map<String, Object> out = valasService.getNotificatonDetail(pJenisPembayaran, pVendor);
                Object namaJenisPembayaran = out.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "");
                Object namaVendor = out.getOrDefault("OUT_NAMA_VENDOR", "");
                notification.setMessage(""
                        + WebUtils.getUsernameLogin() + " telah melakukan Input Data pada aplikasi. "
                        + namaJenisPembayaran + "-" + namaVendor + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNilaiTagihan + "-" + pNoTagihan + "."
                );
            }
            Map<String, Object> res = valasService.insPembayaran(pIdValas, pJenisPembayaran, pTglJatuhTempo, pVendor, pCurr, pNilaiTagihan, pBankTujuan, pBankPembayar, pUnitPenerima, pNoTagihan, pTglTagihan, pNoNotdin, pTglNotdin, pStatusValas, WebUtils.getUsernameLogin(), pKeterangan, pTipeTransaksi, pTglTerimaInvoice);
            Object obj = res.get("return");
            if (obj != null) {
                String result = (String) obj;
                if (pIdValas == null || pIdValas.equals("") || pIdValas.equals(" ")) {
                    pIdValas = result.split(";")[1];
                }
            }
            notification.setAdditionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" +pIdValas);
            notificationUtil.notifyMessage(notification);
            return res;
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
            String pJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
            Notification notification = Notification.builder()
                    .topic(pJenisPembayaran)
                    .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                    .message(""
                            + WebUtils.getUsernameLogin()  + " telah meng-update status.")
                    .additionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + pIdValas)
                    .build();
            notificationUtil.notifyMessage(notification);
            return valasService.updStatus(pIdValas, pStatusInvoice, pDeskripsi, WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/multi_upd_status", method = RequestMethod.POST)
    public Map<String, Object> multiUpdStatus(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pDeskripsi", defaultValue = "") String pDeskripsi
    ) {
        Map<String, Object> out = null;
        AppUtils.getLogger(this).debug("pdata : {} ", pData);
        String noBracket = pData.replaceAll("\\[", "").replaceAll("\\]","");
        AppUtils.getLogger(this).debug("JSONValas : {} ", pData.replaceAll("\\[", "").replaceAll("\\]",""));
        String[] listData = noBracket.split(",");
        JSONObject json;
        for(String item : listData){
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while( keys.hasNext() ){
                String key = (String)keys.next();
                String value = json.getString(key);
                AppUtils.getLogger(this).debug("  {}: {} ", key, value);
                if(!key.equals("x")){
                    try {
                        out = valasService.updStatus(value, key, pDeskripsi, WebUtils.getUsernameLogin());
                        AppUtils.getLogger(this).debug("update {} : {} ", value, key);
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
                }
                /*else {
                    out.put("OUT_MSG", "DATA BERHASIL DIUBAH");
                    out.put("return", "1");
                }*/
            }
        }

        AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
        return out;

    }

    @RequestMapping(value = "/multi_del_data", method = RequestMethod.POST)
    public Map<String, Object> multiDelData(
            @RequestParam(value = "pData", defaultValue = "") String pData
    ) {
        Map<String, Object> out = null;
        String noBracket = pData.replaceAll("\\[", "").replaceAll("\\]", "");
        AppUtils.getLogger(this).debug("JSONValas : {} ", pData.replaceAll("\\[", "").replaceAll("\\]", ""));
        String[] listData = noBracket.split(",");
        JSONObject json;
        for (String item : listData) {
            json = new JSONObject(item);
            AppUtils.getLogger(this).debug("jsonobject : {} ", json);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);
                AppUtils.getLogger(this).debug("  {}: {} ", key, value);
                try {
                    if(value.contains("TRIPARTITE")){
                        out = valasService.deleteTripartite(value);
                    }
                    else {
                        out = valasService.deletePembayaran(value);
                    }
                    AppUtils.getLogger(this).debug("id deleted : {} ", value);
                } catch (Exception e) {
                    e.printStackTrace();
                    out = null;
                    break;
                }
            }
        }
        return out;
    }

    @RequestMapping(value = "/multiple_edit", method = RequestMethod.POST)
    public Map<String, Object> multipleEdit(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pTglJatuhTempo", defaultValue = "") String pTglJatuhTempo,
            @RequestParam(value = "pBankPembayar", defaultValue = "") String pBankPembayar
    ) {
        Map<String, Object> out = null;
        AppUtils.getLogger(this).debug("pdata : {} ", pData);
        AppUtils.getLogger(this).debug("pTglJatuhTempo : {} ", pTglJatuhTempo);
        pBankPembayar = (pBankPembayar.toString().equals("null") ? "" : pBankPembayar);
        AppUtils.getLogger(this).debug("pBankPembayar : {} ", pBankPembayar);
        String noBracket = pData.replaceAll("\\[", "").replaceAll("\\]","");
        AppUtils.getLogger(this).debug("JSONValas : {} ", pData.replaceAll("\\[", "").replaceAll("\\]",""));
        String[] listData = noBracket.split(",");
        JSONObject json;
        for(String item : listData){
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while( keys.hasNext() ){
                String key = (String)keys.next();
                String value = json.getString(key);
                AppUtils.getLogger(this).debug("  {}: {} ", key, value);
                if(!key.equals("x")){
                    try {
//                        out = valasService.updStatus(value, key, pDeskripsi, WebUtils.getUsernameLogin());
//                        out = valasService.insPembayaran(value, "", "", "", "", "", "", "", "", "", "", "", "", "", WebUtils.getUsernameLogin(), "", "", "");
                        out = valasService.updateMultiplePembayaran(value, pTglJatuhTempo, pBankPembayar, WebUtils.getUsernameLogin());
                        AppUtils.getLogger(this).debug("update {} : {} ", value, key);
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
                }
                /*else {
                    out.put("OUT_MSG", "DATA BERHASIL DIUBAH");
                    out.put("return", "1");
                }*/
            }
        }

        AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
        return out;

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
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        /*Map<String, Object> listFailed = Map<String, Object>*/
        return valasService.uploadXls(inputStream, WebUtils.getUsernameLogin(), "1", "");

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

    @RequestMapping(value = "/download/{idUpload}", method = RequestMethod.GET)
    public String export(HttpServletResponse response,
                         @PathVariable String idUpload) throws SQLException {
        AppUtils.getLogger(this).info("DOWNLOAD {} ID UPLOAD : {}", "download", idUpload);

            return generateReport(response,valasService.getErrorData(idUpload, "1"), "download");
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
            response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_rekapitulasi.xls\"");
            resource = "classpath:/templates/report/"+tipe+"_rekapitulasi.xls";
            if(tipe.equals("download")){
                value.put("listFailed", errorData.get("return"));
            }

            System.out.println("listFailed : "+ value);
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
                return "STATUS_VALAS";
            case 16:
                return "TIPE_TRANSAKSI";
            case 17:
                return "STATUS_TRACKING";
            case 18:
                return "DESKRIPSI";
            default:
                return "JENIS_PEMBAYARAN";
        }
    }

}
