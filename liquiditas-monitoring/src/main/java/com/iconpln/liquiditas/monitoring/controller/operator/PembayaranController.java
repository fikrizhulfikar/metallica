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
import org.apache.poi.ss.formula.NameIdentifier;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
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

    @RequestMapping(value = "/rekap_belum", method = RequestMethod.GET)
    public Map listRekapDataBelum(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListPembayaranBelum(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/rekap_sudah", method = RequestMethod.GET)
    public Map listRekapDataSudah(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListPembayaranSudah((start / length) + 1, length, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/rekap_reject", method = RequestMethod.GET)
    public Map listRekapReject(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getRejectPembayaran((start / length) + 1, length, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/ins_rekap_reject", method = RequestMethod.POST)
    public String insRekapReject(@RequestParam("id_valas") String idValas) {
        return valasService.insRejectLaporan(idValas, WebUtils.getUsernameLogin());
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

    @RequestMapping(value = "/get_all_pembayaran2", method = RequestMethod.GET)
    public List getAllpembayaran2(
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurr", defaultValue = "ALL") String pCurr,
            @RequestParam(value = "pPembayaran", defaultValue = "ALL") String pPembayaran
    ) {
        try {
            return valasService.getAllpembayaran2(WebUtils.getUsernameLogin(), pTglAwal, pTglAkhir, pBank, pCurr, pPembayaran);
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
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId
    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        try {
            String idJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
            String message = "";
            Map<String, String> data = notificationUtil.getNotificationDetailByIdValas(pIdValas);
            message += WebUtils.getUsernameLogin() + " telah melakukan penghapusan Data pada aplikasi. ";
            message += data.get("NAMA_JENIS_PEMBAYARAN") + "-" + data.get("NAMA_VENDOR") + ".";
            WebUtils.deleteFile(pIdValas);
            Map<String, Object> res = valasService.deletePembayaran(pIdValas, WebUtils.getUsernameLogin());
            Notification notification =
                    Notification.builder()
                            .topic(idJenisPembayaran)
                            .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                            .message(message)
                            .additionalInfo(null)
                            .build();
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {
                notificationUtil.notifyMessage(notification);
            }
            return res;
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
            @RequestParam(value = "pTglTerimaInvoice", defaultValue = "") String pTglTerimaInvoice,
            @RequestParam(value = "pNominalSblmPajak", defaultValue = "") String pNominalSblmPajak,
            @RequestParam(value = "pNominalUnderlying", defaultValue = "") String pNominalUnderlying,
            @RequestParam(value = "pPajak", defaultValue = "") String pPajak,
            @RequestParam(value = "pNominalTanpaUnderlying", defaultValue = "") String pNominalTanpaUnderlying,
            @RequestParam(value = "pKursJisdor", defaultValue = "") String pKursJisdor,
            @RequestParam(value = "pSpread", defaultValue = "") String pSpread,
            @RequestParam(value = "pJenisTagihan", defaultValue = "") String pJenisTagihan,
            @RequestParam(value = "pPosAnggaran", defaultValue = "") String pPosAnggaran,
            @RequestParam(value = "pSubPosAnggaran", defaultValue = "") String pSubPosAnggaran,
            @RequestParam(value = "pUnitAnggaran", defaultValue = "") String pUnitAnggaran,
            @RequestParam(value = "pJenisDokumen", defaultValue = "") String pJenisDokumen
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
        AppUtils.getLogger(this).debug("pNominalSblmPajak : {} ", pNominalSblmPajak);
        AppUtils.getLogger(this).debug("pNominalUnderlying : {} ", pNominalUnderlying);
        AppUtils.getLogger(this).debug("pPajak : {} ", pPajak);
        AppUtils.getLogger(this).debug("pNominalTanpaUnderlying : {} ", pNominalTanpaUnderlying);
        AppUtils.getLogger(this).debug("pKursJisdor : {} ", pKursJisdor);
        AppUtils.getLogger(this).debug("pSpread : {} ", pSpread);
        AppUtils.getLogger(this).debug("pPosAnggaran : {} ", pPosAnggaran);
        AppUtils.getLogger(this).debug("pSubPosAnggaran : {} ", pSubPosAnggaran);
        AppUtils.getLogger(this).debug("pUnitAnggaran : {} ", pUnitAnggaran);
        AppUtils.getLogger(this).debug("pJenisTransaksi : {}",pJenisDokumen);

        try {
            String message = "";
            boolean isUpdate = false;
            if (pIdValas != null && !pIdValas.equals("")) {
                Map<String, String> sebelum = notificationUtil.getNotificationDetailByIdValas(pIdValas);
                message += WebUtils.getUsernameLogin() + " telah melakukan Perubahan/Update Data pada aplikasi.";
                message += sebelum.get("NAMA_JENIS_PEMBAYARAN") + "-" + sebelum.get("NAMA_VENDOR") + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNilaiTagihan + "-" + pNoTagihan + ".";
                isUpdate = true;
            } else {
                Map<String, Object> out = valasService.getNotificatonDetail(pJenisPembayaran, pVendor);
                Object namaJenisPembayaran = out.getOrDefault("OUT_NAMA_JENIS_PEMBAYARAN", "");
                Object namaVendor = out.getOrDefault("OUT_NAMA_VENDOR", "");
                message += WebUtils.getUsernameLogin() + " telah melakukan Input Data pada aplikasi. ";
                message += namaJenisPembayaran + "-" + namaVendor + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNilaiTagihan + "-" + pNoTagihan + ".";
                isUpdate = false;
            }
            Map<String, Object> res = valasService.insPembayaran(pIdValas, pJenisPembayaran, pTglJatuhTempo, pVendor, pCurr, pNilaiTagihan,
                    pBankTujuan, pBankPembayar, pUnitPenerima, pNoTagihan, pTglTagihan, pNoNotdin, pTglNotdin, pStatusValas,
                    WebUtils.getUsernameLogin(), pKeterangan, pTipeTransaksi, pTglTerimaInvoice, pNominalSblmPajak, pNominalUnderlying,
                    pPajak, pNominalTanpaUnderlying, pKursJisdor, pSpread, pJenisTagihan, pPosAnggaran,pSubPosAnggaran,pUnitAnggaran,pJenisDokumen);
            if (isUpdate) {
                Map<String, String> sesudah = notificationUtil.getNotificationDetailByIdValas(pIdValas);
                message += "Perubahan: " + sesudah.get("NAMA_JENIS_PEMBAYARAN") + "-" + sesudah.get("NAMA_VENDOR") + "-" + pTglJatuhTempo + "-" + pCurr + "-" + pNilaiTagihan + "-" + pNoTagihan + ".";
            }
            Object obj = res.get("return");
            if (obj != null) {
                String result = (String) obj;
                if (pIdValas == null || pIdValas.equals("") || pIdValas.equals(" ")) {
                    pIdValas = result.split(";")[1];
                }
                if (result.split(";")[0].equals("1")) {
                    Notification notification =
                            Notification.builder()
                                    .topic(pJenisPembayaran)
                                    .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                                    .message(message)
                                    .additionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + pIdValas)
                                    .build();
                    notificationUtil.notifyMessage(notification);
                }
            }
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
            @RequestParam(value = "pIdJenisPembayaran", defaultValue = "") String pIdJenisPembayaran,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pTotalTagihan", defaultValue = "") String pTotalTagihan,
            @RequestParam(value = "pDeskripsi", defaultValue = "") String pDeskripsi
    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        try {
            Map<String, Object> res = valasService.updStatus(pIdValas, pStatusInvoice, pIdJenisPembayaran, pCurrency, pTotalTagihan, WebUtils.getUsernameLogin(),pDeskripsi);
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {
                notifyUpdateStatus(pIdValas);
            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/multi_upd_status", method = RequestMethod.POST)
    public Map<String, Object> multiUpdStatus(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pDeskripsi", defaultValue = "") String pDeskripsi

    ) throws JSONException {
        Map<String, Object> out = null;
        String jsonString = valasService.getPerfectJsonString(pData);
        String[] listData = jsonString.split(";");
        JSONObject json ;


        for (String item : listData) {
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);

                if (!key.equals("x") && !key.equals("jenisPembayaran") && !key.equals("total") && !key.equals("currency")) {
                    try {
                        out = valasService.updStatus(value, key, json.getString("jenisPembayaran"), json.getString("currency"), json.getString("total"), WebUtils.getUsernameLogin(),pDeskripsi);
                        if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {
                            notifyUpdateStatus(value);
                        }
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
    ) throws JSONException {
        Map<String, Object> out = null;
        String jsonString = valasService.getPerfectJsonString(pData);
        String[] listData = jsonString.split(";");
        JSONObject json;
        for (String item : listData) {
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);
                if (!key.equals("jenisPembayaran") && !key.equals("total") && !key.equals("currency")) {
                    try {
                        if (value.contains("TRIPARTITE")) {
                            Map<String, String> data = notificationUtil.getNotificationDetailByIdValas(value);
                            String idJenisPembayaran = valasService.getIdPembayaranByIdValas(value);
                            WebUtils.deleteFile(value);
                            String message = "";
                            message += WebUtils.getUsernameLogin() + " telah melakukan penghapusan Data pada aplikasi. ";
                            message += data.get("NAMA_JENIS_PEMBAYARAN") + "-" + data.get("NAMA_VENDOR") + ".";
                            Notification notification =
                                    Notification.builder()
                                            .topic(idJenisPembayaran)
                                            .title(NamedIdentifier.TRIPARTITE.getName())
                                            .message(message)
                                            .additionalInfo(null)
                                            .build();
                            out = valasService.deleteTripartite(value);
                            if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {
                                notificationUtil.notifyMessage(notification);
                            }
                        } else {
                            Map<String, String> data = notificationUtil.getNotificationDetailByIdValas(value);
                            String idJenisPembayaran = valasService.getIdPembayaranByIdValas(value);
                            WebUtils.deleteFile(value);
                            String message = "";
                            message += WebUtils.getUsernameLogin() + " telah melakukan penghapusan Data pada aplikasi. ";
                            message += data.get("NAMA_JENIS_PEMBAYARAN") + "-" + data.get("NAMA_VENDOR") + ".";
                            Notification notification =
                                    Notification.builder()
                                            .topic(idJenisPembayaran)
                                            .title(NamedIdentifier.TRIPARTITE.getName())
                                            .message(message)
                                            .additionalInfo(null)
                                            .build();
                            out = valasService.deletePembayaran(value, WebUtils.getUsernameLogin());
                            if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {
                                notificationUtil.notifyMessage(notification);
                            }
                        }
                        AppUtils.getLogger(this).debug("id deleted : {} ", value);
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
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
    ) throws JSONException {
        Map<String, Object> out = null;
        pBankPembayar = (pBankPembayar.toString().equals("null") ? "" : pBankPembayar);
        String jsonString = valasService.getPerfectJsonString(pData);
        String[] listData = jsonString.split(";");
        JSONObject json;
        for (String item : listData) {
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);
                AppUtils.getLogger(this).debug("  {}: {} ", key, value);
                if (!key.equals("x") && !key.equals("jenisPembayaran") && !key.equals("total") && !key.equals("currency")) {
                    try {
                        AppUtils.getLogger(this).debug("update {} : {} ", value, key);
                        String message = "";
                        if (!value.startsWith("TRIPARTITE")) {
                            Map<String, String> sebelum = notificationUtil.getNotificationDetailByIdValas(value);
                            message += WebUtils.getUsernameLogin() + " telah melakukan Perubahan/Update Data pada aplikasi.";
                            message += sebelum.get("NAMA_JENIS_PEMBAYARAN") + "-" + sebelum.get("NAMA_VENDOR") + "-" + pTglJatuhTempo + ".";

                            out = valasService.updateMultiplePembayaran(value, pTglJatuhTempo, pBankPembayar, WebUtils.getUsernameLogin());
                            Map<String, String> sesudah = notificationUtil.getNotificationDetailByIdValas(value);
                            message += "Perubahan: " + sesudah.get("NAMA_JENIS_PEMBAYARAN") + "-" + sesudah.get("NAMA_VENDOR") + "-" + pTglJatuhTempo + ".";

                            if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {
                                String idJenisPembayaran = valasService.getIdPembayaranByIdValas(value);
                                Notification notification =
                                        Notification.builder()
                                                .topic(idJenisPembayaran)
                                                .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                                                .message(message)
                                                .additionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + value)
                                                .build();
                                notificationUtil.notifyMessage(notification);
                            }
                        } else {
                            Map<String, String> sebelum = notificationUtil.getNotificationDetailByIdTripartite(value);
                            message += WebUtils.getUsernameLogin() + " telah melakukan Perubahan/Update Data pada aplikasi.";
                            message += sebelum.get("NAMA_JENIS_PEMBAYARAN") + "-" + sebelum.get("NAMA_VENDOR") + "-" + pTglJatuhTempo + ".";

                            out = valasService.updateMultiplePembayaran(value, pTglJatuhTempo, pBankPembayar, WebUtils.getUsernameLogin());
                            Map<String, String> sesudah = notificationUtil.getNotificationDetailByIdTripartite(value);
                            message += "Perubahan: " + sesudah.get("NAMA_JENIS_PEMBAYARAN") + "-" + sesudah.get("NAMA_VENDOR") + "-" + pTglJatuhTempo + ".";

                            if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {
                                String idJenisPembayaran = valasService.getIdPembayaranByIdTripartite(value);
                                Notification notification =
                                        Notification.builder()
                                                .topic(idJenisPembayaran)
                                                .title(NamedIdentifier.TRIPARTITE.getName())
                                                .message(message)
                                                .additionalInfo(NamedIdentifier.TRIPARTITE.getValue() + ";" + value)
                                                .build();
                                notificationUtil.notifyMessage(notification);
                            }
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
                }
            }
        }

        AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
        return out;

    }

    @RequestMapping(value = "/reject_data", method = RequestMethod.POST)
    public Map<String, Object> rejectData(
            @RequestParam(value = "pData", defaultValue = "") String pData
    ) throws JSONException {
        Map<String, Object> out = null;
        String jsonString = valasService.getPerfectJsonString(pData);
        String[] listData = jsonString.split(";");
        JSONObject json;
        for (String item : listData) {
            json = new JSONObject(item);
            AppUtils.getLogger(this).debug("jsonobject : {} ", json);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);
                if (!key.equals("jenisPembayaran") && !key.equals("total") && !key.equals("currency")) {
                    AppUtils.getLogger(this).debug("  {}: {} ", key, value);
                    try {
                        out = valasService.rejectPembayaran(value, WebUtils.getUsernameLogin());
                        AppUtils.getLogger(this).debug("id rejected : {} ", value);
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
                }

            }
        }
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
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan,
            @RequestParam(value = "pStatusInvoice", defaultValue = "") String pStatusInvoice,
            @RequestParam(value = "pIdJenisPembayaran", defaultValue = "") String pIdJenisPembayaran,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pTotalTagihan", defaultValue = "") String pTotalTagihan

    ) {

        AppUtils.getLogger(this).debug("idValas : {} ", pIdValas);
        AppUtils.getLogger(this).debug("pKeterangan : {} ", pKeterangan);
        AppUtils.getLogger(this).debug("pStatusInvoice : {} ", pStatusInvoice);
        try {
            Map<String, Object> result = valasService.updReverse(pIdValas, pStatusInvoice, WebUtils.getUsernameLogin(), pKeterangan, pCurrency, pIdJenisPembayaran, pTotalTagihan);
            if (((BigDecimal) result.get("return")).equals(BigDecimal.ONE)) {
                String idJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
                Notification notification =
                        Notification.builder()
                                .topic(idJenisPembayaran)
                                .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                                .message(WebUtils.getUsernameLogin() + " telah me-reverse status.")
                                .additionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + pIdValas)
                                .build();
                notificationUtil.notifyMessage(notification);
            }
            return result;
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
                paramDetail.put("OSS_ID", data.get("ID_VALAS"));
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
                paramDetail.put("UPDATE_DATE", data.get("UPDATE_DATE"));
                paramDetail.put("CREATE_DATE", data.get("CREATE_DATE"));
                paramDetail.put("KURS_TRANSAKSI", data.get("KURS_TRANSAKSI"));
                paramDetail.put("SPREAD", data.get("SPREAD"));
                paramDetail.put("NOMINAL_PEMBAYARAN_IDR", data.get("NOMINAL_PEMBAYARAN_IDR"));
                paramDetail.put("KURS_JISDOR", data.get("KURS_JISDOR"));
                paramDetail.put("NOMINAL_TANPA_UNDERLYING", data.get("NOMINAL_TANPA_UNDERLYING"));
                paramDetail.put("NOMINAL_UNDERLYING", data.get("NOMINAL_UNDERLYING"));
                paramDetail.put("NOMINAL_STLH_PAJAK", data.get("NOMINAL_STLH_PAJAK"));
                paramDetail.put("PAJAK", data.get("PAJAK"));
                paramDetail.put("NOMINAL_SBLM_PAJAK", data.get("NOMINAL_SBLM_PAJAK"));
                paramDetail.put("JENIS_TAGIHAN", data.get("JENIS_TAGIHAN"));
                paramDetail.put("TGL_LUNAS", data.get("TGL_LUNAS"));
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

    @RequestMapping(value = "/xls2/{pTglAwal}/{pTglAkhir}/{pBank}/{pCurr}/{pPembayaran}", method = RequestMethod.GET)
    public String export2(
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
            title = "REKAPITULASI DATA SUDAH DI VERIFIKASI";
            namaFile = "Rekap Sudah Diverifikasi.xls";


            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = valasService.getAllpembayaran2(WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pBank, pCurr, pPembayaran);

            AppUtils.getLogger(this).info("data rekap : {}, report : {}",listData.toString());
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
                paramDetail.put("UPDATE_DATE", data.get("UPDATE_DATE"));
                paramDetail.put("CREATE_DATE", data.get("CREATE_DATE"));
                paramDetail.put("KURS_TRANSAKSI", data.get("KURS_TRANSAKSI"));
                paramDetail.put("SPREAD", data.get("SPREAD"));
                paramDetail.put("NOMINAL_PEMBAYARAN_IDR", data.get("NOMINAL_PEMBAYARAN_IDR"));
                paramDetail.put("KURS_JISDOR", data.get("KURS_JISDOR"));
                paramDetail.put("NOMINAL_TANPA_UNDERLYING", data.get("NOMINAL_TANPA_UNDERLYING"));
                paramDetail.put("NOMINAL_UNDERLYING", data.get("NOMINAL_UNDERLYING"));
                paramDetail.put("NOMINAL_STLH_PAJAK", data.get("NOMINAL_STLH_PAJAK"));
                paramDetail.put("PAJAK", data.get("PAJAK"));
                paramDetail.put("NOMINAL_SBLM_PAJAK", data.get("NOMINAL_SBLM_PAJAK"));
                paramDetail.put("JENIS_TAGIHAN", data.get("JENIS_TAGIHAN"));
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
                String idJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
                try {
                    Map<String, Object> result = valasService.uploadFileRekap(pIdValas, pJenisFile, new BigDecimal(pFileSize), pIdValas + pJenisFile + File.separator + pFileName, WebUtils.getUsernameLogin());
                    Notification notification = Notification.builder()
                            .topic(idJenisPembayaran)
                            .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                            .message(WebUtils.getUsernameLogin() + " telah menambahkan data (xls).")
                            .additionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + pIdValas)
                            .build();
                    notificationUtil.notifyMessage(notification);
                    return result;
                } catch (Exception e) {
                    return null;
                }
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

        return generateReport(response, valasService.getErrorData(idUpload, "1"), "download");
    }

    @RequestMapping(value = "/template", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response) throws SQLException {
        return generateReport(response, null, "template");

    }

    @RequestMapping(value = "/get_total_tagihan", method = RequestMethod.GET)
    public String getTotalTagihan(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                  @RequestParam(value = "cur", defaultValue = "ALL") String cur,
                                  @RequestParam(value = "pembayaran", defaultValue = "ALL") String pembayaran,
                                  @RequestParam(value = "status", defaultValue = "ALL") String status,
                                  @RequestParam(value = "statusTracking", defaultValue = "ALL") String statusTracking,
                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  valasService.getTotalTagihan(tglAwal, tglAkhir, bank, cur, pembayaran, status, statusTracking, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @RequestMapping(value = "/get_total_tagihan2", method = RequestMethod.GET)
    public String getTotalTagihan2(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                  @RequestParam(value = "cur", defaultValue = "ALL") String cur,
                                  @RequestParam(value = "pembayaran", defaultValue = "ALL") String pembayaran,
                                  @RequestParam(value = "status", defaultValue = "ALL") String status,
                                  @RequestParam(value = "statusTracking", defaultValue = "ALL") String statusTracking,
                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  valasService.getTotalTagihan2(tglAwal, tglAkhir, bank, cur, pembayaran, status, statusTracking, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @RequestMapping(value = "/get_total_per_currency", method = RequestMethod.GET)
    public List<Map<String, Object>> getTotalPerCurrency(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                                         @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                                         @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                                         @RequestParam(value = "cur", defaultValue = "ALL") String cur,
                                                         @RequestParam(value = "pembayaran", defaultValue = "ALL") String pembayaran,
                                                         @RequestParam(value = "status", defaultValue = "ALL") String status,
                                                         @RequestParam(value = "statusTracking", defaultValue = "ALL") String statusTracking,
                                                         @RequestParam(value = "search", defaultValue = "") String search) {
        return valasService.getTotalPerCurrentcy(tglAwal, tglAkhir, bank, cur, pembayaran, status, statusTracking, WebUtils.getUsernameLogin(), search);
    }

    @RequestMapping(value = "/get_total_per_currency2", method = RequestMethod.GET)
    public List<Map<String, Object>> getTotalPerCurrency2(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                                         @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                                         @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                                         @RequestParam(value = "cur", defaultValue = "ALL") String cur,
                                                         @RequestParam(value = "pembayaran", defaultValue = "ALL") String pembayaran,
                                                         @RequestParam(value = "status", defaultValue = "ALL") String status,
                                                         @RequestParam(value = "statusTracking", defaultValue = "ALL") String statusTracking,
                                                         @RequestParam(value = "search", defaultValue = "") String search) {
        return valasService.getTotalPerCurrentcy2(tglAwal, tglAkhir, bank, cur, pembayaran, status, statusTracking, WebUtils.getUsernameLogin(), search);
    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe) {
        try {
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            String resource;
            response.setHeader("Content-Disposition", "attachment; filename=\"" + tipe + "_rekapitulasi.xls\"");
            resource = "classpath:/templates/report/" + tipe + "_rekapitulasi.xls";
            if (tipe.equals("download")) {
                value.put("listFailed", errorData.get("return"));
                System.out.println("error return :"+errorData.get("return"));
            }
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource(resource).getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, value);
            workbook.write(os);
            os.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/ins_reverse_reject", method = RequestMethod.POST)
    public Map<String, Object> insReverseReject(@RequestParam("idValas") String idValas) {
        String result = valasService.insReverseReject(idValas, WebUtils.getUsernameLogin());
        Map<String, Object> map = new HashMap<>();
        map.put("message", result);
        return map;
    }

    private String parseColumn(int index) {
        switch (index) {
            case 1:
                return "ID_VALAS";
            case 2:
                return "JENIS_TAGIHAN";
            case 3:
                return "JENIS_PEMBAYARAN";
            case 4:
                return "JATUH_TEMPO";
            case 5:
                return "VENDOR";
            case 6:
                return "CURRENCY";
            case 7:
                return "TAGIHAN";
            case 8:
                return "UNIT";
            case 9:
                return "BANK_TUJUAN";
            case 10:
                return "BANK_PEMBAYAR";
            case 11:
                return "TGL_TERIMA_INVOICE";
            case 12:
                return "TGL_TAGIHAN";
            case 13:
                return "NO_TAGIHAN";
            case 14:
                return "TGL_NOTDIN";
            case 15:
                return "NO_NOTDIN";
            case 16:
                return "TGL_LUNAS";
            case 17:
                return "COUNT_DOWN";
            case 18:
                return "STATUS_VALAS";
            case 19:
                return "TIPE_TRANSAKSI";
            case 20:
                return "NOMINAL_SBLM_PAJAK";
            case 21:
                return "PAJAK";
            case 22:
                return "NOMINAL_STLH_PAJAK";
            case 23:
                return "NOMINAL_UNDERLYING";
            case 24:
                return "NOMINAL_TANPA_UNDERLYING";
            case 25:
                return "KURS_JISDOR";
            case 26:
                return "SPREAD";
            case 27:
                return "KURS_TRANSAKSI";
            case 28:
                return "NOMINAL_PEMBAYARAN_IDR";
            case 29:
                return "CREATE_DATE";
            case 30:
                return "STATUS_TRACKING";
            case 31:
                return "DESKRIPSI";
            default:
                return "UPDATE_DATE";
        }
    }

    @RequestMapping(value = "/get_column", method = RequestMethod.GET)
    public Map getColumn() {
        Map data = new HashMap();
        try {
            data.put("data", valasService.getColumn(WebUtils.getUsernameLogin()));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/save_column", method = RequestMethod.POST)
    public Map saveColumn(@RequestParam("nomor") Integer nomor,
                          @RequestParam("jenis_tagihan") Integer jenisTagihan,
                          @RequestParam("jenis_pembayaran") Integer jenisPembayaran,
                          @RequestParam("unit_anggaran") Integer unitAnggaran,
                          @RequestParam("pos_anggaran") Integer posAnggaran,
                          @RequestParam("sub_pos_anggaran") Integer subPosAnggaran,
                          @RequestParam("jatuh_tempo") Integer jatuhTempo,
                          @RequestParam("vendor") Integer vendor,
                          @RequestParam("currency") Integer currency,
                          @RequestParam("nilai_tagihan") Integer nilaiTagihan,
//                          @RequestParam("unit") Integer unit,
                          @RequestParam("nama_kontrak") Integer namaKontrak,
                          @RequestParam("bank_tujuan") Integer bankTujuan,
                          @RequestParam("bank_pembayar") Integer bankPembayar,
                          @RequestParam("tgl_terima_tagihan") Integer tglTerimaTagihan,
                          @RequestParam("tgl_tagihan") Integer tglTagihan,
                          @RequestParam("no_tagihan") Integer noTagihan,
                          @RequestParam("tgl_nota_dinas") Integer tglNotaDinas,
                          @RequestParam("no_nota_dinas") Integer noNotaDinas,
                          @RequestParam("tgl_pembayaran") Integer tglPembayaran,
                          @RequestParam("countdown") Integer countdown,
                          @RequestParam("status") Integer status,
                          @RequestParam("tipe_transaksi") Integer tipeTransaksi,
                          @RequestParam("nominal_sblm_pajak") Integer nominalSblmPajak,
                          @RequestParam("pajak") Integer pajak,
                          @RequestParam("nominal_stlh_pajak") Integer nominalStlhPajak,
                          @RequestParam("nominal_underlying") Integer nominalUnderlying,
                          @RequestParam("nominal_tanpa_underlying") Integer nominalTanpaUnderlying,
                          @RequestParam("kurs_jidor") Integer kursJidor,
                          @RequestParam("spread") Integer spread,
                          @RequestParam("kurs_transaksi") Integer kursTransaksi,
                          @RequestParam("nominal_pembayaran_idr") Integer nominalPembayaranIdr,
                          @RequestParam("create_date") Integer createDate,
                          @RequestParam("update_date") Integer updateDate,
                          @RequestParam("status_tagihan") Integer statusTagihan,
                          @RequestParam("keterangan") Integer keterangan
    ) {
        Map data = new HashMap();
        try {
            String result = valasService.saveColumn(WebUtils.getUsernameLogin(),
                    nomor,
                    jenisPembayaran,
                    unitAnggaran,
                    posAnggaran,
                    subPosAnggaran,
                    jatuhTempo,
                    vendor,
                    currency,
                    nilaiTagihan,
                    namaKontrak,
                    bankTujuan,
                    bankPembayar,
                    tglTerimaTagihan,
                    tglTagihan,
                    noTagihan,
                    tglNotaDinas,
                    noNotaDinas,
                    tglPembayaran,
                    countdown,
                    status,
                    tipeTransaksi,
                    nominalSblmPajak,
                    pajak,
                    nominalStlhPajak,
                    nominalUnderlying,
                    nominalTanpaUnderlying,
                    kursJidor,
                    spread,
                    jenisTagihan,
                    kursTransaksi,
                    nominalPembayaranIdr,
                    createDate,
                    updateDate,
                    statusTagihan,
                    keterangan
            );
            data.put("data", result);
        } catch (Exception e) {
            data.put("data", "Gagal menyimpan");
            AppUtils.getLogger(this).debug("Error: {}", e.getMessage());
        }
        return data;
    }

    public void notifyUpdateStatus(String pIdValas) {
        String pJenisPembayaran = valasService.getIdPembayaranByIdValas(pIdValas);
        Notification notification = Notification.builder()
                .topic(pJenisPembayaran)
                .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
                .message(""
                        + WebUtils.getUsernameLogin() + " telah meng-update status.")
                .build();
        if (pIdValas.startsWith("TRIPARTITE")) {
            notification.setAdditionalInfo(NamedIdentifier.TRIPARTITE.getValue() + ";" + pIdValas);
        } else {
            notification.setAdditionalInfo(NamedIdentifier.REKAP_PEMBAYARAN.getValue() + ";" + pIdValas);
        }
        notificationUtil.notifyMessage(notification);
    }

    @PostMapping("/cleansing")
    public String cleansing(@RequestParam("id_valas") String idValas) {
        return valasService.cleansing(idValas, WebUtils.getUsernameLogin());
    }

    @PostMapping("/multi_cleansing")
    public Map<String, Object> multiCleansing(@RequestParam("data") String data) throws JSONException {
        Map<String, Object> out = new HashMap<>();
        String jsonString = valasService.getPerfectJsonString(data);
        String[] listData = jsonString.split(";");
        JSONObject json ;


        for (String item : listData) {
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);

                if (!key.equals("jenisPembayaran") && !key.equals("total") && !key.equals("currency")) {
                    try {
                        String response = valasService.cleansing(value, WebUtils.getUsernameLogin());
                        out.put("response", response);
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
                }
            }
        }

        AppUtils.getLogger(this).debug("multiCleansing : {} ", out);
        return out;
    }
}
