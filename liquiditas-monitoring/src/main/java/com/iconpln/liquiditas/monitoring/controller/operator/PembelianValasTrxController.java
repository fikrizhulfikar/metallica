package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.Valas;
import com.iconpln.liquiditas.core.domain.ValasDetail;
import com.iconpln.liquiditas.core.service.PembelianValasTrxService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.commons.collections.map.HashedMap;
import org.apache.poi.ss.usermodel.Workbook;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;

@RestController
@RequestMapping("/api_operator/pembelian_valas_trx")
public class PembelianValasTrxController {

    @Autowired
    private PembelianValasTrxService pembelianValasTrxService;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NotificationUtil notificationUtil;

    @RequestMapping(value = "/get_pembelian_valas_trx", method = RequestMethod.GET)
    public Map listPembelianValasTrx(
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
            list = pembelianValasTrxService.getListPembelianValasTrx(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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
        System.out.println("Ini data List : "+ list);
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

    @RequestMapping(value = "/ins_pembelian_valas_trx", method = RequestMethod.POST)
    public Map<String, Object> insPembelianValasTrx(
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pDocDate", defaultValue = "") String pDocDate,
            @RequestParam(value = "pPostDate", defaultValue = "") String pPostDate,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pReference", defaultValue = "") String pReference,
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pDocHdrTxt", defaultValue = "") String pDocHdrTxt,
            @RequestParam(value = "pUserId", defaultValue = "") String pUserId,
            @RequestParam(value = "pExchangeRate", defaultValue = "") String pExchangeRate,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscalYear
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

            Map<String, Object> res  = pembelianValasTrxService.insPembelian(pIdMetallica, pDocDate, pPostDate, pDocNo, pReference, pCompCode, pBusArea, pCurrency, pDocHdrTxt, WebUtils.getUsernameLogin(), pExchangeRate, pFiscalYear);

            return res;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/detail_pembelian_valas_trx", method = RequestMethod.GET)
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
            list = pembelianValasTrxService.getDetails(((start / length) + 1), length,  sortBy, sortDir, WebUtils.getUsernameLogin(), pIdMetallica);
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

    @RequestMapping(value = "/ins_detail_pembelian_valas_trx", method = RequestMethod.POST)
    public Map<String, Object> insDetailPembelianValasTrx(@RequestBody Valas valas){
        System.out.println("Valas Detail : "+valas.getValasDetails());

        try {
            //String pSessionId = WebUtils.getUsernameLogin() + AppUtils.getDateTillSecondTrim();
            Map<String, Object> res = new HashedMap();
            for (ValasDetail v : valas.getValasDetails()){
                res = pembelianValasTrxService.insDetailPembelianValasTrx(valas.getpIdMetallica(),v.getpPostDate(), v.getpDocNo(), v.getpAmount(), v.getpBusArea(), v.getpReference(), v.getpCompCode(), v.getpCashCode() , v.getpSumberDana(), WebUtils.getUsernameLogin(), v.getpCurrency(), v.getpCostCtr(),v.getpDrCrInd(), v.getpExchangeRate(), v.getpFiscYear(), v.getpGlAccount(), v.getpLineNo(), v.getpPmtProposalId(), v.getpRemarks(), v.getpFlag(), v.getpRealAmount());
            }
            return res;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/delete_pembelian_valas_item_trx", method = RequestMethod.POST)
    public Map<String, Object> deletePembelianValasItemTrx(
            @RequestParam(value = "pIdMetallica", defaultValue = "") String pIdMetallica,
            @RequestParam(value = "pItemId", defaultValue = "") String pItemId,
            @RequestParam(value = "pLineNo", defaultValue = "") String pLineNo
    ) {

        AppUtils.getLogger(this).debug("pIdMetallica : {} ", pIdMetallica);
        AppUtils.getLogger(this).debug("pItemId : {}", pItemId);
        try {
            Map<String, Object> res = pembelianValasTrxService.deletePembelianValasTrx(pIdMetallica, pItemId, pLineNo);
//
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {
//                notificationUtil.notifyMessage(notification);
            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/delete_pembelian_valas_trx_head", method = RequestMethod.POST)
    public Map<String, Object> deletePembelianValasTrxHead(
            @RequestParam("pIdMetallica") String pIdMetallica
        ){
        AppUtils.getLogger(this).info("data pIdMetallica : {}",pIdMetallica);
        try{
            Map<String, Object> result = pembelianValasTrxService.deletePembelianValasTrxHead(pIdMetallica);
            if (((BigDecimal) result.get("return")).equals(BigDecimal.ONE)){

            }
            return result;
        }catch (Exception e){
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
            Map<String, Object> resutl = pembelianValasTrxService.updateStatus(pIdMetallica,pStatusTracking);
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
            Map<String, Object> result = pembelianValasTrxService.updateLunas(pIdMetallica, pJenis);
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
            Map<String, Object> result = pembelianValasTrxService.updateReverse(pIdMetallica,pStatusTracking);
            System.out.println(result);
            if(((BigDecimal) result.get("return")).equals(BigDecimal.ONE)){

            }
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_pembelian_valas_trx_verified", method = RequestMethod.GET)
    public Map listPembelianValasTrxVerified(
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
            list = pembelianValasTrxService.getListPembelianValasTrxVerified(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_pembelian_valas_trx_lunas", method = RequestMethod.GET)
    public Map listPembelianValasTrxLunas(
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
            list = pembelianValasTrxService.getListPembelianValasTrxLunas(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_valas_head_byid", method = RequestMethod.GET)
    public Map getValasHeadById(
            @RequestParam(value = "pIdMetallica") String pIdMetallica
    ){
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pembelianValasTrxService.getHeadById(pIdMetallica);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        AppUtils.getLogger(this).info("list data : {}", list.toString());
        return mapData;
    }

    @RequestMapping(value = "/get_glaccount", method = RequestMethod.GET)
    public List<Map<String, Object>> getGlAccount(@RequestParam(value = "pCurrency",defaultValue = "") String pCurrency){
        try{
            List<Map<String, Object>> result = pembelianValasTrxService.getGlAccount(pCurrency);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_cashcode", method = RequestMethod.GET)
    public List<Map<String, Object>> getCashCode(){
        try {
            List<Map<String, Object>> result = pembelianValasTrxService.getCashCode();
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_total_tagihan", method = RequestMethod.GET)
    public String getTotalTagihan(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "currency", defaultValue = "ALL") String currency,

                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  pembelianValasTrxService.getTotalTagihan(tglAwal, tglAkhir, currency, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @RequestMapping(value = "/get_total_tagihan_lunas", method = RequestMethod.GET)
    public String getTotalTagihanLunas(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "currency", defaultValue = "ALL") String currency,

                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  pembelianValasTrxService.getTotalTagihanLunas(tglAwal, tglAkhir, currency, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @PostMapping(path = "/multiple_delete_head")
    public Map<String,Object> multipleDeleteHead(@RequestParam(value = "pData") String data) throws SQLException,  JSONException {
        Map<String, Object> out = new HashMap<>();

        JSONArray jsonArray = new JSONArray(data);
        try {
            for (int index = 0; index < jsonArray.length(); index++){
                JSONObject object = jsonArray.getJSONObject(index);
                String id = object.getString("pIdMetallica");
                out = pembelianValasTrxService.deletePembelianValasTrxHead(id);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    @RequestMapping(value = "/multi_upd_status", method = RequestMethod.POST)
    public Map<String, Object> multiUpdStatus(
            @RequestParam(value = "pData", defaultValue = "") String pData
    ) throws JSONException {
        Map<String, Object> out = new HashMap<>();

        JSONArray jsonArray = new JSONArray(pData);
        try {
            for (int index = 0; index < jsonArray.length(); index++){
                JSONObject object = jsonArray.getJSONObject(index);
                String id = object.getString("pIdMetallica");
                String tracking = object.getString("statustracking");
                out = pembelianValasTrxService.updStatus(id, tracking);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    @RequestMapping(value = "/multi_upd_lunas", method = RequestMethod.POST)
    public Map<String, Object> multiUpdLunas(
            @RequestParam(value = "pData", defaultValue = "") String pData
    ) throws JSONException {
        Map<String, Object> out = new HashMap<>();

        JSONArray jsonArray = new JSONArray(pData);
        try {
            for (int index = 0; index < jsonArray.length(); index++){
                JSONObject object = jsonArray.getJSONObject(index);
                String id = object.getString("pIdMetallica");
                String jenis = object.getString("jenis");
                out = pembelianValasTrxService.updateLunas(id, jenis);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pCurr}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
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

            String title = "PEMBELIAN VALAS";
            String namaFile = "pembelian_valas.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = pembelianValasTrxService.getAllpembayaran(WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pCurr);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("DOCUMENT_DATE", data.get("DOCUMENT_DATE"));
                paramDetail.put("POSTING_DATE", data.get("POSTING_DATE"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("DOCUMENT_NUMBER", data.get("DOCUMENT_NUMBER"));
                paramDetail.put("REFERENCE", data.get("REFERENCE"));
                paramDetail.put("COMPANY_CODE", data.get("COMPANY_CODE"));
                paramDetail.put("BUSINESS_AREA", data.get("BUSINESS_AREA"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("EXCHANGE_RATE", data.get("EXCHANGE_RATE"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("PMT_PROPOSAL_ID", data.get("PMT_PROPOSAL_ID"));
                paramDetail.put("TOTAL_TAGIHAN", data.get("TOTAL_TAGIHAN"));
                paramDetail.put("STATUS_TRACKING", data.get("STATUS_TRACKING"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/pembelian_valas.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xlsverified/{pTglAwal}/{pTglAkhir}/{pCurr}", method = RequestMethod.GET)
    public String export2(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
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

            String title = "PEMBELIAN VALAS VERIFIED";
            String namaFile = "pembelian_valas_verified.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = pembelianValasTrxService.getAllpembayaran2(WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pCurr);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("DOCUMENT_DATE", data.get("DOCUMENT_DATE"));
                paramDetail.put("POSTING_DATE", data.get("POSTING_DATE"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("DOCUMENT_NUMBER", data.get("DOCUMENT_NUMBER"));
                paramDetail.put("REFERENCE", data.get("REFERENCE"));
                paramDetail.put("COMPANY_CODE", data.get("COMPANY_CODE"));
                paramDetail.put("BUSINESS_AREA", data.get("BUSINESS_AREA"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("EXCHANGE_RATE", data.get("EXCHANGE_RATE"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("PMT_PROPOSAL_ID", data.get("PMT_PROPOSAL_ID"));
                paramDetail.put("TOTAL_TAGIHAN", data.get("TOTAL_TAGIHAN"));
                paramDetail.put("STATUS_TRACKING", data.get("STATUS_TRACKING"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/pembelian_valas_verified.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xlslunas/{pTglAwal}/{pTglAkhir}/{pCurr}", method = RequestMethod.GET)
    public String export3(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
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

            String title = "PEMBELIAN VALAS LUNAS";
            String namaFile = "pembelian_valas_lunas.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = pembelianValasTrxService.getAllpembayaran3(WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pCurr);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("DOCUMENT_DATE", data.get("DOCUMENT_DATE"));
                paramDetail.put("POSTING_DATE", data.get("POSTING_DATE"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("DOCUMENT_NUMBER", data.get("DOCUMENT_NUMBER"));
                paramDetail.put("REFERENCE", data.get("REFERENCE"));
                paramDetail.put("COMPANY_CODE", data.get("COMPANY_CODE"));
                paramDetail.put("BUSINESS_AREA", data.get("BUSINESS_AREA"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("EXCHANGE_RATE", data.get("EXCHANGE_RATE"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("PMT_PROPOSAL_ID", data.get("PMT_PROPOSAL_ID"));
                paramDetail.put("TOTAL_TAGIHAN", data.get("TOTAL_TAGIHAN"));
                paramDetail.put("STATUS_TRACKING", data.get("STATUS_TRACKING"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/pembelian_valas_lunas.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/get_compcode", method = RequestMethod.GET)
    public List<Map<String, Object>> getCompCode() {
        try {
            List<Map<String, Object>> result = pembelianValasTrxService.getCompanyCode();
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_business_area", method = RequestMethod.GET)
    public List<Map<String, Object>> getBusinessArea(@RequestParam(value = "pCompCode") String pCompCode) {
        try {
            List<Map<String, Object>> result = pembelianValasTrxService.getBusinessArea(pCompCode);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
