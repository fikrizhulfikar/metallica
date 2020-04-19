package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.InvoiceSiapBayarService;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api_operator/invoice_siap_bayar")
public class InvoiceSiapBayarController {

    @Autowired
    private InvoiceSiapBayarService invoiceSiapBayarService;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping(path = "/get_invoice_siap_bayar")
    public Map<String, Object> getListInvoiceSiapBayar(
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
            @RequestParam(value = "pCaraBayar", defaultValue = "ALL") String pCaraBayar,
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
            list = invoiceSiapBayarService.getListInvoiceSiapBayar(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);

        if (list.size() == 0 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null){
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        }else {
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
}
