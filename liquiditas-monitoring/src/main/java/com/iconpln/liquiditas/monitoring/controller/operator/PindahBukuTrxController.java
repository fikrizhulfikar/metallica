package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.PindahBuku;
import com.iconpln.liquiditas.core.domain.Valas;
import com.iconpln.liquiditas.core.domain.ValasDetail;
import com.iconpln.liquiditas.core.service.PindahBukuTrxService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api_operator/pindah_buku_trx")
public class PindahBukuTrxController {

    @Autowired
    private PindahBukuTrxService pindahBukuTrxService;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NotificationUtil notificationUtil;

    @RequestMapping(value ="/get_pindah_buku_trx", method = RequestMethod.GET)
    public Map listPindahBukuTrx(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pindahBukuTrxService.getListPindahBukuTrx(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    private String parseColumn(int index) {
        switch (index) {
            case 1:
                return "DOCUMENT_DATE";
            case 2:
                return "POSTING_DATE";
            case 3:
                return "DOCUMENT_NUMBER";
            case 4:
                return "REFERENCE";
            case 5:
                return "COMPANY_CODE";
            case 6:
                return "BUSINESS_AREA";
            case 7:
                return "CURRENCY";
            case 8:
                return "DOC_HDR_TXT";
            case 9:
                return "CREATED_BY";
            case 10:
                return "UPDATE_BY";
            case 11:
                return "CREATED_DATE";
            case 12:
                return "UPDATE_DATE";
            default:
                return "UPDATE_DATE";
        }
    }

    @RequestMapping(value = "/ins_pindah_buku_trx", method = RequestMethod.POST)
    public Map<String, Object> insPindahBukuTrx(
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pDocDate", defaultValue = "") String pDocDate,
            @RequestParam(value = "pPostDate", defaultValue = "") String pPostDate,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pReference", defaultValue = "") String pReference,
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pDocHdrTxt", defaultValue = "") String pDocHdrTxt,
            @RequestParam(value = "pUserId", defaultValue = "") String pUserId
    ){
        AppUtils.getLogger(this).debug("pDocNo : {} ", pDocNo);
        AppUtils.getLogger(this).debug("pDocDate : {} ", pDocDate);
        AppUtils.getLogger(this).debug("pCompCode : {} ", pCompCode);
        AppUtils.getLogger(this).debug("pCurrency : {} ", pCurrency);
        AppUtils.getLogger(this).debug("pBusArea : {} ", pBusArea);
        AppUtils.getLogger(this).debug("pDocHdrText : {} ", pDocHdrTxt);
        AppUtils.getLogger(this).debug("pReference : {} ", pReference);
        AppUtils.getLogger(this).debug("pUserId : {}", pUserId);
        AppUtils.getLogger(this).debug("pPostDdate : {}", pPostDate);

        try {
            String messege = "";
            boolean isUpdate = false;

            Map<String, Object> res  = pindahBukuTrxService.insPindahBuku(pIdMetallica, pDocDate, pPostDate, pDocNo, pReference, pCompCode, pBusArea, pCurrency, pDocHdrTxt, WebUtils.getUsernameLogin());

            return res;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/detail_pindah_buku_trx", method = RequestMethod.GET)
    public Map getDetail(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pindahBukuTrxService.getDetails(((start / length) + 1), length,  sortBy, sortDir, WebUtils.getUsernameLogin(), pIdMetallica);
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

    @RequestMapping(value = "/ins_detail_pindah_buku_trx", method = RequestMethod.POST)
    public Map<String, Object> insDetailPindahBukuTrx(@RequestBody PindahBuku pindahBuku){
        System.out.println("Pindah Buku Detail : "+pindahBuku.getPindahBukuDetails());

        try {
            //String pSessionId = WebUtils.getUsernameLogin() + AppUtils.getDateTillSecondTrim();
            Map<String, Object> res = new HashedMap();
            for (ValasDetail v : pindahBuku.getPindahBukuDetails()){

                res = pindahBukuTrxService.insDetailPindahBukuTrx(pindahBuku.getpIdMetallica(),v.getpPostDate(), v.getpDocNo(), v.getpAmount(), v.getpBusArea(), v.getpReference(), v.getpCompCode(), WebUtils.getUsernameLogin(), v.getpCurrency(), v.getpDrCrInd(), v.getpExchangeRate(), v.getpFiscYear(), v.getpGlAccount(), v.getpLineNo(), v.getpPmtProposalId(), v.getpRemarks(), v.getpFlag());
            }
            return res;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/delete_pindah_buku_trx_head", method = RequestMethod.POST)
    public Map<String, Object> deletePindahBukuHeadTrx(
            @RequestParam("pIdMetallica") String pIdMetallica
    ){
        AppUtils.getLogger(this).info("data pIdMetallica : {}", pIdMetallica);
        try{
            Map<String, Object> result = pindahBukuTrxService.deletePindahBukuTrxHead(pIdMetallica);
            if(((BigDecimal) result.get("return")).equals(BigDecimal.ONE)){

            }
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/delete_pindah_buku_trx", method = RequestMethod.POST)
    public Map<String, Object> deletePindaBukuItemTrx(
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pItemId", defaultValue = "") String pItemId
    ) {

        AppUtils.getLogger(this).debug("pIdMetallica : {} ", pIdMetallica);
        AppUtils.getLogger(this).debug("pItemId : {}", pItemId);
        try {
//            String idJenisPembayaran = metallicaTrxService.getIdPembayaranByIdValas(pIdValas);
//            String message = "";
//            Map<String, String> data = notificationUtil.getNotificationDetailByIdValas(pIdValas);
//            message += WebUtils.getUsernameLogin() + " telah melakukan penghapusan Data pada aplikasi. ";
//            message += data.get("NAMA_JENIS_PEMBAYARAN") + "-" + data.get("NAMA_VENDOR") + ".";
//            WebUtils.deleteFile(pIdValas);
            Map<String, Object> res = pindahBukuTrxService.deletePindahBukuItemTrx(pIdMetallica, pItemId);
//            Notification notification =
//                    Notification.builder()
//                            .topic(idJenisPembayaran)
//                            .title(NamedIdentifier.REKAP_PEMBAYARAN.getName())
//                            .message(message)
//                            .additionalInfo(null)
//                            .build();
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {
//                notificationUtil.notifyMessage(notification);
            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_status", method = RequestMethod.POST)
    public Map<String, Object> updateStatus(
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking
    ){
        AppUtils.getLogger(this).info("pIdMetallica update_status : {}", pIdMetallica);
        AppUtils.getLogger(this).info("pStatusTracking : {}", pStatusTracking);

        try {
            Map<String, Object> resutl = pindahBukuTrxService.updateStatus(pIdMetallica,pStatusTracking);
            if(((BigDecimal) resutl.get("return")).equals(BigDecimal.ONE)){

            }

            return resutl;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_lunas", method = RequestMethod.POST)
    public Map<String, Object> updateLunas(
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis
    ){
        try {
            Map<String, Object> result = pindahBukuTrxService.updateLunas(pIdMetallica, pJenis);
            if (((BigDecimal) result.get("return")).equals(BigDecimal.ONE)){

            }
            return result;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_reverse", method = RequestMethod.POST)
    public Map<String, Object> updateReverse(
            @RequestParam(value = "pIdMetallica",defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking
    ){
        AppUtils.getLogger(this).info("param pIdMetallica : {}", pIdMetallica);
        AppUtils.getLogger(this).info("param pStatusTracking : {}", pStatusTracking);
        try {
            Map<String, Object> result = pindahBukuTrxService.updateReverse(pIdMetallica,pStatusTracking);
            System.out.println(result);
            if(((BigDecimal) result.get("return")).equals(BigDecimal.ONE)){

            }
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_pindah_buku_trx_verified", method = RequestMethod.GET)
    public Map listPindahBukuTrxVerified(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pindahBukuTrxService.getListPindahBukuTrxVerified(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_pindah_buku_trx_lunas", method = RequestMethod.GET)
    public Map listPindahBukuTrxLunas(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pindahBukuTrxService.getListPindahBukuTrxLunas(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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
}
