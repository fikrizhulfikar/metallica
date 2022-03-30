package com.iconpln.liquiditas.monitoring.controller.pilot;

import com.iconpln.liquiditas.core.pilot.InvoicePilotService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api_invoice_pilot/hrap_invoice")
public class InvoicePilotController {

    @Autowired
    InvoicePilotService pilotService;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping(path = "/get_list_invoice")
    public Map listInvoicePilot(
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
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pilotService.getListApHrPilot(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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
                return "COMP_CODE";
            case 2:
                return "DOC_NO";
            case 3:
                return "FISC_YEAR";
            case 4:
                return "DOC_TYPE";
            case 5:
                return "DOC_DATE2";
            case 6:
                return "POST_DATE2";
            case 7:
                return "ENTRY_DATE2";
            case 8:
                return "REFERENCE";
            case 9:
                return "REV_WITH";
            case 10:
                return "REV_YEAR";
            case 11:
                return "DOC_HDR_TXT";
            case 12:
                return "CURRENCY";
            case 13:
                return "EXCH_RATE";
            case 14:
                return "REFERENCE_KEY";
            case 15:
                return "PMT_ID";
            case 16:
                return "TRANS_TYPE";
            case 17:
                return "SPREAD_VAL";
            case 18:
                return "LINE_ITEM";
            case 19:
                return "OI_IND";
            case 20:
                return "ACCT_TYPE";
            case 21:
                return "SPEC_GL";
            case 22:
                return "BUS_AREA";
            case 23:
                return "TPBA";
            case 24:
                return "AMT_LC";
            case 25:
                return "AMT_MC";
            case 26:
                return "AMT_WITH_BASE_TC";
            case 27:
                return "AMT_WITH_TC";
            case 28:
                return "AMOUNT";
            case 29:
                return "ASSIGNMENT";
            case 30:
                return "ITEM_TEXT";
            case 31:
                return "COST_CTR";
            case 32:
                return "GL_ACCT";
            case 33:
                return "CUSTOMER";
            case 34:
                return "VENDOR";
            case 35:
                return "BASE_DATE";
            case 36:
                return "TERM_PMT";
            case 37:
                return "DUE_ON";
            case 38:
                return "PMT_BLOCK";
            case 39:
                return "HOUSE_BANK";
            case 40:
                return "PRTNR_BANK_TYPE";
            case 41:
                return "BANK_KEY";
            case 42:
                return "BANK_ACCOUNT";
            case 43:
                return "ACCOUNT_HOLDER";
            case 44:
                return "PO_NUM";
            case 45:
                return "PO_ITEM";
            case 46:
                return "REF_KEY1";
            case 47:
                return "REF_KEY2";
            case 48:
                return "REF_KEY3";
            case 49:
                return "INT_ORDER";
            case 50:
                return "WBS_NUM";
            case 51:
                return "CASH_CODE";
            case 52:
                return "DR_CR_IND";
            case 53:
                return "AMT_WITH_BASE_LC";
            case 54:
                return "AMT_WITH_LC";
            case 55:
                return "METODE_PEMBAYARAN";
            case 56:
                return "TGL_RENCANA_BAYAR";
            case 57:
                return "SUMBER_DANA";
            case 58:
                return "KETERANGAN";
            case 59:
                return "STATUS_TRACKING";
            default:
                return "UPDATE_DATE";
        }
    }

    @GetMapping(path = "/get_list_vendor_portal")
    public Map listRekapVendorPortal(
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
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pilotService.getListInvoiceVendorPortal(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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

    @GetMapping(path = "/get_list_nonvendor_head")
    public Map listRekapNonvendorHead(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pJenisDok", defaultValue = "VALAS") String pJenisDok,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pilotService.getInvoiceNonVendorHead(((start / length) + 1), length, pTglAwal, pTglAkhir, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pJenisDok, pSearch);
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

    @GetMapping(path = "/get_list_nonvendor_item")
    public Map listRekapNonvendorHead(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pFiscalYear", defaultValue = "") String pFiscalYear
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pilotService.getInvoiceNonVendorItem(((start / length) + 1), length, sortBy, sortDir, WebUtils.getUsernameLogin(), pDocNo, pFiscalYear, pCompCode);
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

    @GetMapping(path = "/list_realisasi_invoice")
    public Map listRealisasiInvoice(
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
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pilotService.getRealisasiInvoice(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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

    @GetMapping(path = "/list_invoice_oss")
    public Map listInvoiceOss(
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
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = pilotService.getInvoiceOss(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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

    @GetMapping(path = "/list_rekap_all_invoice")
    public Map listAllRekapInvoice(
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
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            System.out.println("DIAZ GANTENGNYA KIMI :"+pTglAwal);
            list = pilotService.getListRekapAllInvoice(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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

    @RequestMapping(path = "/xls/invoice/{pDateFrom}/{pDateTo}/{pCurrency}/{pCarabayar}/{pHouseBank}")
    public String cetakHrApnvoicePilot(
            @PathVariable String pDateFrom,
            @PathVariable String pDateTo,
            @PathVariable String pCurrency,
            @PathVariable String pCarabayar,
            @PathVariable String pHouseBank,
            HttpServletRequest request, HttpServletResponse response){
        try {
            String title = "Rekap HR/AP Invoice";
            String fileName = "Rekap HRAP Invoice.xls";
            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposistion","attachment; filename=\""+fileName+"\"");

            String date_from = (pDateFrom.equals("null")) ? "" : pDateFrom.replace("-","/");
            String date_to = (pDateTo.equals("null")) ? "" : pDateTo.replace("-","/");

            List<Map<String, Object>> listData = pilotService.getHrApInvoicePilotXls(date_from, date_to, pCurrency, pCarabayar, pHouseBank, WebUtils.getUsernameLogin());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            param.put("TITLE", title);
            int no = 0;
            for(Map data : listData){
                Map paramDetail = new HashMap();
                paramDetail.put("NO", no++);
                paramDetail.put("KET", data.get("KET").toString().replace("_"," "));
                paramDetail.put("COMP_CODE", data.get("COMP_CODE"));
                paramDetail.put("DOC_NO", data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE", data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE", data.get("DOC_DATE"));
                paramDetail.put("DOC_DATE2", data.get("DOC_DATE2"));
                paramDetail.put("POST_DATE", data.get("POST_DATE"));
                paramDetail.put("POST_DATE2", data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE", data.get("ENTRY_DATE"));
                paramDetail.put("ENTRY_DATE2", data.get("ENTRY_DATE2"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE", data.get("EXCH_RATE"));
                paramDetail.put("PMT_IND", data.get("PMT_IND"));
                paramDetail.put("TRANS_TYPE", data.get("TRANS_TYPE"));
                paramDetail.put("SPREAD_VAL", data.get("SPREAD_VAL"));
                paramDetail.put("LINE_ITEM", data.get("LINE_ITEM"));
                paramDetail.put("BUS_AREA", data.get("BUS_AREA"));
                paramDetail.put("BUS_AREA_PAYMENT", data.get("BUS_AREA_PAYMENT"));
                paramDetail.put("AMT_LC", data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_TC", data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC", data.get("AMT_WITH_TC"));
                paramDetail.put("AMOUNT", data.get("AMOUNT"));
                paramDetail.put("ASSIGNMENT", data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT", data.get("ITEM_TEXT"));
                paramDetail.put("CUSTOMER", data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME", data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                paramDetail.put("ID_VENDOR_DASH", data.get("ID_VENDOR_DASH"));
                paramDetail.put("VENDOR_NAME", data.get("VENDOR_NAME"));
                paramDetail.put("PMT_BLOCK", data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK", data.get("HOUSE_BANK"));
                paramDetail.put("PRTNR_BANK_TYPE", data.get("PRTNR_BANK_TYPE"));
                paramDetail.put("BANK_KEY", data.get("BANK_KEY"));
                paramDetail.put("BANK_ACCOUNT", data.get("BANK_ACCOUNT"));
                paramDetail.put("ACCOUNT_HOLDER", data.get("ACCOUNT_HOLDER"));
                paramDetail.put("CASH_CODE", data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASH_CODE", data.get("NAMA_CASH_CODE"));
                paramDetail.put("AMT_WITH_BASE_LC", data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC", data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND", data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT", data.get("CORP_PMT"));
                paramDetail.put("MAKER", data.get("MAKER"));
                paramDetail.put("CHECKER", data.get("CHECKER"));
                paramDetail.put("APPROVER", data.get("APPROVER"));
                paramDetail.put("COUNTER", data.get("COUNTER"));
                paramDetail.put("NO_REK_HOUSE_BANK", data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("OSS_ID", data.get("OSS_ID"));
                paramDetail.put("GROUP_ID", data.get("GROUP_ID"));
                paramDetail.put("SUMBER_DANA", data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BAYAR", data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("BANK_BYR", data.get("BANK_BYR"));
                paramDetail.put("BANK_BYR2", data.get("BANK_BYR2"));
                paramDetail.put("CURR_BAYAR", data.get("CURR_BAYAR"));
                paramDetail.put("PARTIAL_IND", data.get("PARTIAL_IND"));
                paramDetail.put("AMOUNT_BAYAR", data.get("AMOUNT_BAYAR"));
                paramDetail.put("BANK_BENEF", data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF", data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF", data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY", data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON", data.get("VERIFIED_ON"));
                paramDetail.put("TGL_TAGIHAN_DITERIMA", data.get("TGL_TAGIHAN_DITERIMA"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("GROUP_ID_SAP", data.get("GROUP_ID_SAP"));
                paramDetail.put("EQ_IDR", data.get("EQ_IDR"));
                paramDetail.put("ASSIGNMENT_DEPAN", data.get("ASSIGNMENT_DEPAN"));
                paramDetail.put("HARI_KERJA", data.get("HARI_KERJA"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_hrap_invoice_pilot.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            System.out.println("List Data Excel All Pilot: "+listData);
            return null;
        } catch (IOException | InvalidFormatException e) {
            e.printStackTrace();
            return "Gagal melakukan export data"+ e.getMessage();
        }
    }

    @RequestMapping(value = "/xls/nonvip/{dateFrom}/{dateTo}/{docNo}/{pCompCode}/{pFiscYear}", method = RequestMethod.GET)
    public String exportBni(
            @PathVariable String docNo,
            @PathVariable String pCompCode,
            @PathVariable String pFiscYear,
            @PathVariable String dateFrom,
            @PathVariable String dateTo,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String title = "REKAP Invoice Non Vendor";
            String namaFile = "rekap_invoice_non_vendor_pilot.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = pilotService.getXlsInvoiceNonVendor(dateFrom, dateTo, WebUtils.getUsernameLogin(),docNo,pCompCode, pFiscYear);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("CODE",data.get("CODE"));
                paramDetail.put("REFNUMBER",data.get("REFNUMBER"));
                paramDetail.put("VALUEDATE",data.get("VALUEDATE"));
                paramDetail.put("CURRENCY",data.get("CURRENCY"));
                paramDetail.put("AMOUNT",data.get("AMOUNT"));
                paramDetail.put("ORDERINGPARTYNAME",data.get("ORDERINGPARTYNAME"));
                paramDetail.put("ORDERINGPARTYAC",data.get("ORDERINGPARTYAC"));
                paramDetail.put("SPAREFIELD1",data.get("SPAREFIELD1"));
                paramDetail.put("SPECIALRATECODE",data.get("SPECIALRATECODE"));
                paramDetail.put("RTGSFLAG",data.get("RTGSFLAG"));
                paramDetail.put("SPAREFIELD2",data.get("SPAREFIELD2"));
                paramDetail.put("SPAREFIELD3",data.get("SPAREFIELD3"));
                paramDetail.put("BENEFBANKCODE",data.get("BENEFBANKCODE"));
                paramDetail.put("BENEFBANKNAME",data.get("BENEFBANKNAME"));
                paramDetail.put("BENEFBANKADD1",data.get("BENEFBANKADD1"));
                paramDetail.put("BENEFBANKADD2",data.get("BENEFBANKADD2"));
                paramDetail.put("BENEFACNO",data.get("BENEFACNO"));
                paramDetail.put("BENEFNAME",data.get("BENEFNAME"));
                paramDetail.put("REMARK1",data.get("REMARK1"));
                paramDetail.put("REMARK2",data.get("REMARK2"));
                paramDetail.put("CHARGES",data.get("CHARGES"));
                paramDetail.put("EMAILBENEF",data.get("EMAILBENEF"));
                paramDetail.put("MOBILENO",data.get("MOBILENO"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_rekap_cms_bni.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls/oss/{pDateFrom}/{pDateTo}/{pBank}/{pCurrency}", method = RequestMethod.GET)
    public String exportInvoiceOssPilot(
            @PathVariable String pDateFrom,
            @PathVariable String pDateTo,
            @PathVariable String pBank,
            @PathVariable String pCurrency,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String title = "REKAP Invoice Oss Pilot";
            String namaFile = "rekap_invoice_oss_pilot.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = pilotService.getInvoiceOssXls(pDateFrom.replace("-","/"), pDateTo.replace("-","/"), pBank, pCurrency, WebUtils.getUsernameLogin());

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("NO", data.get("ROW_NUMBER"));
                paramDetail.put("COMP_CODE", data.get("COMP_CODE"));
                paramDetail.put("DOC_NO", data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("BUS_AREA", data.get("BUS_AREA"));
                paramDetail.put("DOC_TYPE", data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE", data.get("DOC_DATE"));
                paramDetail.put("POST_DATE", data.get("POST_DATE"));
                paramDetail.put("ENTRY_DATE", data.get("ENTRY_DATE"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE", data.get("EXCH_RATE"));
                paramDetail.put("TRANS_TYPE", data.get("TRANS_TYPE"));
                paramDetail.put("OSS_ID", data.get("OSS_ID"));
                paramDetail.put("SUMBER_DANA", data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BYR", data.get("TGL_RENCANA_BYR"));
                paramDetail.put("BANK_BYR", data.get("BANK_BYR"));
                paramDetail.put("CURR_BAYAR", data.get("CURR_BAYAR"));
                paramDetail.put("BANK_BENEF", data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF", data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF", data.get("NAMA_BENEF"));
                paramDetail.put("JENIS_BAYAR", data.get("JENIS_BAYAR"));
                paramDetail.put("JENIS_DOC", data.get("JENIS_DOC"));
                paramDetail.put("NAMA_UNIT", data.get("NAMA_UNIT"));
                paramDetail.put("TGL_TERIMA_INVOICE", data.get("TGL_TERIMA_INVOICE"));
                paramDetail.put("INPUT_BY", data.get("INPUT_BY"));
                paramDetail.put("LINE_NO", data.get("LINE_NO"));
                paramDetail.put("AMT_LC", data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_LC", data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC", data.get("AMT_WITH_LC"));
                paramDetail.put("AMT_WITH_BASE_TC", data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC", data.get("AMT_WITH_TC"));
                paramDetail.put("ASSIGNMENT", data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT", data.get("ITEM_TEXT"));
                paramDetail.put("CUSTOMER", data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME", data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_invoice_oss_pilot.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls/vip/{pDateFrom}/{pDateTo}/{pBank}/{pCurrency}", method = RequestMethod.GET)
    public String exportVendorPortalInvoice(
            @PathVariable String pDateFrom,
            @PathVariable String pDateTo,
            @PathVariable String pBank,
            @PathVariable String pCurrency,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String title = "Rekap Vendor Invoice Portal";
            String namaFile = "rekap_vendor_invoice_portal.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            String date_from = (pDateFrom.equals("null")) ? "" : pDateFrom.replace("-","/");
            String date_to = (pDateTo.equals("null")) ? "" : pDateTo.replace("-","/");

            List<Map<String, Object>> listData = pilotService.getVendorPortalXls(date_from, date_to,pBank,pCurrency,WebUtils.getUsernameLogin());

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data_vip : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("KET", data.get("KET"));
                paramDetail.put("SUBMISSION_ID", data.get("SUBMISSION_ID"));
                paramDetail.put("INVOICE_TYPE", data.get("INVOICE_TYPE"));
                paramDetail.put("TRANSACTION_TYPE", data.get("TRANSACTION_TYPE"));
                paramDetail.put("DOCUMENT_TYPE", data.get("DOCUMENT_TYPE"));
                paramDetail.put("PAYMENT_TYPE", data.get("PAYMENT_TYPE"));
                paramDetail.put("DUE_DATE", data.get("DUE_DATE"));
                paramDetail.put("VENDOR_NAME", data.get("VENDOR_NAME"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("CURR_BAYAR", data.get("CURR_BAYAR"));
                paramDetail.put("TOTAL_INVOICE_AMOUNT", Double.parseDouble(data.get("TOTAL_INVOICE_AMOUNT").toString()));
                paramDetail.put("BANK_ACCOUNT", data.get("BANK_ACCOUNT"));
                paramDetail.put("BANK_NAME", data.get("BANK_NAME"));
                paramDetail.put("BANK_BENEF", data.get("BANK_BENEF"));
                paramDetail.put("GROSS_INVOICE_AMOUNT", Double.parseDouble(data.get("GROSS_INVOICE_AMOUNT").toString()));
                paramDetail.put("TAX_CODE", data.get("TAX_CODE"));
                paramDetail.put("NET_INVOICE_AMOUNT", Double.parseDouble(data.get("NET_INVOICE_AMOUNT").toString()));
                paramDetail.put("EXCHANGE_RATE", Double.parseDouble(data.get("EXCHANGE_RATE").toString()));
                paramDetail.put("SPREAD", data.get("SPREAD"));
                paramDetail.put("BANK_PEMBAYAR", data.get("BANK_PEMBAYAR"));
                paramDetail.put("SOFT_COPY_UPLOAD_DATE", data.get("SOFT_COPY_UPLOAD_DATE"));
                paramDetail.put("INVOICE_DATE", data.get("INVOICE_DATE"));
                paramDetail.put("VENDOR_INVOICE_REF", data.get("VENDOR_INVOICE_REF"));
                paramDetail.put("SKKT_NO", data.get("SKKT_NO"));
                paramDetail.put("SKKT_DATE", data.get("SKKT_DATE"));
                paramDetail.put("WORK_DEFINITION", data.get("WORK_DEFINITION"));
                paramDetail.put("SUBMISSION_TRANSACTION_NAME", data.get("SUBMISSION_TRANSACTION_NAME"));
                paramDetail.put("WORK_COMPANY_CODE", data.get("WORK_COMPANY_CODE"));
                paramDetail.put("CASH_CODE", data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASH_CODE", data.get("NAMA_CASH_CODE"));
                paramDetail.put("HOUSE_BANK", data.get("HOUSE_BANK"));
                paramDetail.put("NAMA_HOUSE_BANK", data.get("NAMA_HOUSE_BANK"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_vendor_invoice_portal.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls/realisasi/{pDateFrom}/{pDateTo}/{pBank}/{pCurrency}", method = RequestMethod.GET)
    public String exportRealisasiInvoice(
            @PathVariable String pDateFrom,
            @PathVariable String pDateTo,
            @PathVariable String pBank,
            @PathVariable String pCurrency,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String title = "Rekap Realisasi Invoice";
            String namaFile = "rekap_realisasi_invoice_pilot.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            String date_from = (pDateFrom.equals("null")) ? "" : pDateFrom.replace("-","/");
            String date_to = (pDateTo.equals("null")) ? "" : pDateTo.replace("-","/");

            List<Map<String, Object>> listData = pilotService.getRealisasiInvoiceXls(date_from, date_to, pBank, pCurrency, WebUtils.getUsernameLogin());

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data_realisasi : "+listData.toString());

            param.put("TITLE", title);
            int no = 0;
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("NO", no++);
                paramDetail.put("COMP_CODE", data.get("COMP_CODE"));
                paramDetail.put("DOC_NO", data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR", data.get("FISC_YEAR"));
                paramDetail.put("OSS_ID", data.get("OSS_ID"));
                paramDetail.put("INV_STATUS", data.get("INV_STATUS"));
                paramDetail.put("PMT_DOC_NO", data.get("PMT_DOC_NO"));
                paramDetail.put("PMT_AMOUNT", Double.parseDouble(data.get("PMT_AMOUNT").toString().replace(",",".")));
                paramDetail.put("PMT_RESIDUAL_IND", data.get("PMT_RESIDUAL_IND"));
                paramDetail.put("PMT_CURRENCY", data.get("PMT_CURRENCY"));
                paramDetail.put("PMT_HOUSE_BANK", data.get("PMT_HOUSE_BANK"));
                paramDetail.put("PMT_DATE", data.get("PMT_DATE"));
                paramDetail.put("PMT_BUS_AREA", data.get("PMT_BUS_AREA"));
                paramDetail.put("PMT_CASH_CODE", data.get("PMT_CASH_CODE"));
                paramDetail.put("PMT_SUMBER_DANA", data.get("PMT_SUMBER_DANA"));
                paramDetail.put("GROUP_ID", data.get("GROUP_ID"));
                paramDetail.put("DOC_HDR_TXT", data.get("DOC_HDR_TXT"));
                paramDetail.put("ITEM_TEXT", data.get("ITEM_TEXT"));
                paramDetail.put("CUSTOMER", data.get("CUSTOMER"));
                paramDetail.put("NAMA_CUSTOMER", data.get("NAMA_CUSTOMER"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                paramDetail.put("NAMA_VENDOR", data.get("NAMA_VENDOR"));
                paramDetail.put("NO_REK_HOUSE_BANK", data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("BANK_BENEF", data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF", data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF", data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY", data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON", data.get("VERIFIED_ON"));
                paramDetail.put("EXCH_RATE", Double.parseDouble(data.get("EXCH_RATE").toString()));
                paramDetail.put("DOC_TYPE", data.get("DOC_TYPE"));
                paramDetail.put("TGL_RENCANA_BYR", data.get("TGL_RENCANA_BYR"));
                paramDetail.put("JENIS_DOK", data.get("JENIS_DOK"));
                paramDetail.put("ORI_CURRENCY", data.get("ORI_CURRENCY"));
//                paramDetail.put("ORI_AMOUNT", Double.parseDouble(data.get("ORI_AMOUNT").toString()));
                paramDetail.put("JENIS_TRANSAKSI", data.get("JENIS_TRANSAKSI"));
                paramDetail.put("TIPE_TRANSAKSI", data.get("TIPE_TRANSAKSI"));
                paramDetail.put("EQ_IDR", Double.parseDouble(data.get("EQ_IDR").toString()));
                paramDetail.put("CREATE_DATE", data.get("CREATE_DATE"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_realisasi_invoice_pilot.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls/rekapallinvoice/{pDateFrom}/{pDateTo}/{pBank}/{pCurrency}", method = RequestMethod.GET)
    public String exportRekapAllInvoice(
            @PathVariable String pDateFrom,
            @PathVariable String pDateTo,
            @PathVariable String pBank,
            @PathVariable String pCurrency,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            String title = "Rekap All Invoice";
            String namaFile = "rekap_all_invoice.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = pilotService.getRekapAllInvoice(pDateFrom, pDateTo,pBank,pCurrency,WebUtils.getUsernameLogin());

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data_allinvoice : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("JENIS_TRANSAKSI", data.get("JENIS_TRANSAKSI"));
                paramDetail.put("TIPE_TRANSAKSI", data.get("TIPE_TRANSAKSI"));
                paramDetail.put("CURRENCY_BAYAR", data.get("CURRENCY_BAYAR"));
                paramDetail.put("EXCHANGE_RATE", data.get("EXCHANGE_RATE"));
                paramDetail.put("AMOUNT_BAYAR", data.get("AMOUNT_BAYAR"));
                paramDetail.put("EQ_IDR", data.get("EQ_IDR"));
                paramDetail.put("VENDOR", data.get("VENDOR"));
                paramDetail.put("HOUSE_BANK", data.get("HOUSE_BANK"));
                paramDetail.put("NAMA_HOUSE_BANK", data.get("NAMA_HOUSE_BANK"));
                paramDetail.put("CASH_CODE", data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASHCODE", data.get("NAMA_CASHCODE"));
                paramDetail.put("TGL_RENCANA_BAYAR", data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("TGL_ENTRY", data.get("TGL_ENTRY"));
                paramDetail.put("SUMBER_DATA", data.get("SUMBER_DATA"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_rekap_all_invoice.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }
}
