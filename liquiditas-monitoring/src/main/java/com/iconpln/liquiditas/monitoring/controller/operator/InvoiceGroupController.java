package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.InvoiceGroupService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api_operator/invoice_group")
public class InvoiceGroupController {
    @Autowired
    InvoiceGroupService invoiceGroupService;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/get_invoice_group_head", method = RequestMethod.GET)
    public Map ListInvoiceGroupHead(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = invoiceGroupService.getListInvoiceGroupHead(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, WebUtils.getUsernameLogin(), sortBy, sortDir, pSearch);
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

    @RequestMapping(value = "/get_column", method = RequestMethod.GET)
    public Map getColumn() {
        Map data = new HashMap();
        try {
            data.put("data", invoiceGroupService.getColumn(WebUtils.getUsernameLogin()));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String parseColumn(int index) {
        switch (index) {
            case 1:
                return "HOUSE_BANK";
            case 2:
                return "NO_REK_HOUSE_BANK";
            case 3:
                return "COMP_CODE";
            case 4:
                return "BUS_AREA";
            case 5:
                return "DUE_ON";
            case 6:
                return "TOTAL_TAGIHAN";
            case 7:
                return "ASSIGNMENT";
            default:
                return "UPDATE_DATE";
        }
    }

    @RequestMapping(value = "/get_detail", method = RequestMethod.GET)
    public Map getDetail(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pIdGroup", defaultValue = "") String pIdGroup,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = invoiceGroupService.getDetails(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank , pIdGroup, sortBy, sortDir, WebUtils.getUsernameLogin(),pSearch);
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

    @RequestMapping(value = "/do_payment_group", method = RequestMethod.POST)
    public String createGroup(
            @RequestParam(value = "pData", defaultValue = "") String pData
    ) throws SQLException {
        String out = null;
        //pNamaGroup = (pNamaGroup.toString().equals("null") ? "" : pNamaGroup);
        System.out.println("Fikri2 : "+pData);
        JSONArray jsonArray = new JSONArray(pData);

        int i=0;

        try{
            for (int j = 0; j < jsonArray.length(); j++) {
                JSONObject json = jsonArray.getJSONObject(i);
                out = invoiceGroupService.payment(
                        json.getString("METODE_PEMBAYARAN"),json.getString("HOUSE_BANK"), json.getString("CUSTOMER_REF_NUMBER"),
                        json.getString("NO_REK_HOUSE_BANK"), json.getString("INQ_ACCOUNT_NUMBER"),json.getString("CURRENCY"),
                        json.getString("CURRENCY"), "", "", json.getString("INQ_CUSTOMER_NAME"),
                        "","", json.getString("BANK_KEY"), "OUR","IDR",json.getString("RETRIEVAL_REF_NUMBER"),
                        ""
                );
            }
            AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
            return out;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }


}
