package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.alt.AltException;
import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.core.service.CorpayService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.xmldoc.DocGenerator;
import com.iconpln.liquiditas.monitoring.utils.NamedIdentifier;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import net.sf.jxls.transformer.XLSTransformer;
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

/**
 * Created by israj on 10/4/2016.
 * Updated by Diaz on 2018 s/d 2020.
 */
@RestController
@RequestMapping("/api_operator/rekap_invoice_belum")
public class CorpayController {

    @Autowired
    CorpayService corpayService;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private ResourceLoader resourceLoader;

    private SimpleDateFormat excelDateFormat = new SimpleDateFormat("dd/mm/yyyy");

    @RequestMapping(value = "/get_rekap_invoice", method = RequestMethod.GET)
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
            @RequestParam(value = "pCaraBayar", defaultValue = "ALL") String pCaraBayar,
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
            list = corpayService.getListPembayaranBelum(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_rekap_invoice_admin", method = RequestMethod.GET)
    public Map listRekapInvoiceAdmin(
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
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = corpayService.getListRekapInvoiceAdmin(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_invoice_lcl", method = RequestMethod.GET)
    public Map listRekapDataLcl(
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
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = corpayService.getListInvoiceLcl(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_invoice_lcl2", method = RequestMethod.GET)
    public Map listRekapDataLcl2(
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
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = corpayService.getListInvoiceLcl2(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getDataInvoiceBy(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pNoDoc", defaultValue = "") String pNoDoc,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem

    ) {
        AppUtils.getLogger(this).info("pId edit data: {}", pCompCode);
        AppUtils.getLogger(this).info("pId edit data: {}", pNoDoc);
        AppUtils.getLogger(this).info("pId edit data: {}", pFiscYear);
        AppUtils.getLogger(this).info("pId edit data: {}", pLineItem);

        try {
            return corpayService.getDataInvoiceBy(pCompCode, pNoDoc, pFiscYear, pLineItem );
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(path = "/insert_multiple_edit")
    public Map<String, Object> insertMultipleEditData(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pCashCode", defaultValue = "") String pCashCode,
            @RequestParam(value = "pMetodePembayaran", defaultValue = "") String pMetodePembayaran,
            @RequestParam(value = "pJamBayar", defaultValue = "") String pJamBayar
    ) throws JSONException {
        Map<String,Object> out = new HashMap<>();
        JSONArray jsonArray = new JSONArray(pData);
        try {
            for (int index = 0; index < jsonArray.length(); index++){
                JSONObject object = jsonArray.getJSONObject(index);
                System.out.println("Jancok! : "+object);
                out = corpayService.insertMultipleEdit(object.getString("pCompCode"),object.getString("pDocNo"),object.getString("pFiscYear"),object.getString("pLineItem"),object.getString("pKet"),pCashCode, pMetodePembayaran, pJamBayar, WebUtils.getUsernameLogin());
                System.out.println("BigDecimal : "+out);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    @RequestMapping(path = "/insert_multiple_edit_giro")
    public Map<String, Object> insertMultipleEditDataGiro(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pNoGiro", defaultValue = "") String pNoGiro,
            @RequestParam(value = "pMetodePembayaran", defaultValue = "") String pMetodePembayaran
    ) throws JSONException {
        Map<String,Object> out = new HashMap<>();

        JSONArray jsonArray = new JSONArray(pData);
        try {
            for (int index = 0; index < jsonArray.length(); index++){
                JSONObject object = jsonArray.getJSONObject(index);
                System.out.println("Jancok! : "+object);
                out = corpayService.insertEditAllGiro(object.getString("pCompCode"),object.getString("pDocNo"),object.getString("pFiscYear"),object.getString("pLineItem"),object.getString("pKet"),WebUtils.getUsernameLogin(),pNoGiro,pMetodePembayaran);
                System.out.println("BigDecimal : "+out);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
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

    @RequestMapping(value = "/get_column", method = RequestMethod.GET)
    public Map getColumn() {
        Map data = new HashMap();
        try {
            List<Map<String, Object>> columnList = corpayService.getColumn(WebUtils.getUsernameLogin());
            List<Map<String, Integer>> hiddenColList = new ArrayList<>();
            Map<String, Integer> hide = new HashMap<>();
            for (Map<String, Object> col : columnList){
                for (Map.Entry<String, Object> entry : col.entrySet()){
                    if (entry.getValue().toString().equals("0")){
                        hide.put(entry.getKey(), Integer.parseInt(entry.getValue().toString()));
                    }
                }
            }
            hiddenColList.add(hide);
            data.put("data", hiddenColList);
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/save_column", method = RequestMethod.POST)
    public Map saveColumn(@RequestParam("nomor") Integer nomor,
                          @RequestParam("ket") Integer ket,
                          @RequestParam("doc_no") Integer doc_no,
                          @RequestParam("doc_date2") Integer doc_date2,
                          @RequestParam("rev_with") Integer rev_with,
                          @RequestParam("rev_year") Integer rev_year,
                          @RequestParam("post_date2") Integer post_date2,
                          @RequestParam("base_date") Integer base_date,
                          @RequestParam("entry_date2") Integer entry_date2,
                          @RequestParam("doc_type") Integer doc_type,
                          @RequestParam("fisc_year") Integer fisc_year,
                          @RequestParam("doc_hdr_txt") Integer doc_hdr_txt,
                          @RequestParam("reference") Integer reference,
                          @RequestParam("tgl_tagihan_diterima") Integer tgl_tagihan_diterima,
                          @RequestParam("comp_code") Integer comp_code,
                          @RequestParam("bus_area") Integer bus_area,
                          @RequestParam("currency") Integer currency,
                          @RequestParam("exch_rate") Integer exch_rate,
                          @RequestParam("line_item") Integer line_item,
                          @RequestParam("dr_cr_ind") Integer dr_cr_ind,
                          @RequestParam("spec_gl") Integer spec_gl,
                          @RequestParam("gl_acct") Integer gl_acct,
                          @RequestParam("amt_tc") Integer amt_tc,
                          @RequestParam("amt_lc") Integer amt_lc,
                          @RequestParam("amt_with_base_tc") Integer amt_with_base_tc,
                          @RequestParam("amt_with_tc") Integer amt_with_tc,
                          @RequestParam("amt_with_base_lc") Integer amt_with_base_lc,
                          @RequestParam("amt_with_lc") Integer amt_with_lc,
                          @RequestParam("amount") Integer amount,
                          @RequestParam("acct_type") Integer acct_type,
                          @RequestParam("assignment") Integer assignment,
                          @RequestParam("item_text") Integer item_text,
                          @RequestParam("customer") Integer customer,
                          @RequestParam("vendor") Integer vendor,
                          @RequestParam("term_pmt") Integer term_pmt,
                          @RequestParam("due_on") Integer due_on,
                          @RequestParam("reference_key") Integer reference_key,
                          @RequestParam("pmt_ind") Integer pmt_ind,
                          @RequestParam("trans_type") Integer trans_type,
                          @RequestParam("spread_val") Integer spread_val,
                          @RequestParam("pmt_block") Integer pmt_block,
                          @RequestParam("house_bank") Integer house_bank,
                          @RequestParam("no_rek_house_bank") Integer no_rek_house_bank,
                          @RequestParam("prtnr_bank_type") Integer prtnr_bank_type,
                          @RequestParam("bank_key") Integer bank_key,
                          @RequestParam("bank_account") Integer bank_account,
                          @RequestParam("account_holder") Integer account_holder,
                          @RequestParam("cost_ctr") Integer cost_ctr,
                          @RequestParam("int_order") Integer int_order,
                          @RequestParam("wbs_num") Integer wbs_num,
                          @RequestParam("cash_code") Integer cash_code,
                          @RequestParam("po_num") Integer po_num,
                          @RequestParam("po_item") Integer po_item,
                          @RequestParam("ref_key1") Integer ref_key1,
                          @RequestParam("ref_key2") Integer ref_key2,
                          @RequestParam("ref_key3") Integer ref_key3,
                          @RequestParam("oi_ind") Integer oi_ind,
                          @RequestParam("tpba") Integer tpba,
                          @RequestParam("metode_pembayaran") Integer metode_pembayaran,
                          @RequestParam("tgl_rencana_bayar") Integer tgl_rencana_bayar,
                          @RequestParam("oss_id") Integer oss_id,
                          @RequestParam("group_id") Integer group_id,
                          @RequestParam("bank_byr") Integer bank_byr,
                          @RequestParam("curr_bayar") Integer curr_bayar,
                          @RequestParam("amount_bayar") Integer amount_bayar,
                          @RequestParam("bank_benef") Integer bank_benef,
                          @RequestParam("no_rek_benef") Integer no_rek_benef,
                          @RequestParam("nama_benef") Integer nama_benef,
                          @RequestParam("tgl_act_bayar") Integer tgl_act_bayar,
                          @RequestParam("sumber_dana") Integer sumber_dana,
                          @RequestParam("partial_ind") Integer partial_ind,
                          @RequestParam("keterangan") Integer keterangan,
                          @RequestParam("status_tracking") Integer status_tracking,
                          @RequestParam("corp_pmt") Integer corp_pmt,
                          @RequestParam("inq_customer_name") Integer inq_customer_name,
                          @RequestParam("inq_account_number") Integer inq_account_number,
                          @RequestParam("retrieval_ref_number") Integer retrieval_ref_number,
                          @RequestParam("customer_ref_number") Integer customer_ref_number,
                          @RequestParam("confirmation_code") Integer confirmation_code,
                          @RequestParam("verified_by") Integer verified_by,
                          @RequestParam("verified_on") Integer verified_on,
                          @RequestParam("no_giro") Integer no_giro,
                          @RequestParam("ref_num_bank") Integer ref_num_bank
    ) {
        Map data = new HashMap();
        try {
            String result = corpayService.saveColumn(WebUtils.getUsernameLogin(),
                    nomor,
                    ket,
                    comp_code,
                    doc_no,
                    fisc_year,
                    doc_type,
                    doc_date2,
                    post_date2,
                    entry_date2,
                    reference,
                    rev_with,
                    rev_year,
                    doc_hdr_txt,
                    currency,
                    exch_rate,
                    reference_key,
                    pmt_ind,
                    trans_type,
                    spread_val,
                    line_item,
                    oi_ind,
                    acct_type,
                    spec_gl,
                    bus_area,
                    tpba,
                    amt_lc,
                    amt_tc,
                    amt_with_base_tc,
                    amount,
                    amt_with_tc,
                    assignment,
                    item_text,
                    cost_ctr,
                    gl_acct,
                    customer,
                    vendor,
                    base_date,
                    term_pmt,
                    due_on,
                    pmt_block,
                    house_bank,
                    prtnr_bank_type,
                    bank_key,
                    bank_account,
                    account_holder,
                    po_num,
                    po_item,
                    ref_key1,
                    ref_key2,
                    ref_key3,
                    int_order,
                    wbs_num,
                    cash_code,
                    dr_cr_ind,
                    corp_pmt,
                    amt_with_base_lc,
                    amt_with_lc,
                    metode_pembayaran,
                    keterangan,
                    status_tracking,
                    no_rek_house_bank,
                    inq_customer_name,
                    inq_account_number,
                    retrieval_ref_number,
                    customer_ref_number,
                    confirmation_code,
                    tgl_act_bayar,
                    oss_id,
                    group_id,
                    sumber_dana,
                    tgl_rencana_bayar,
                    bank_byr,
                    curr_bayar,
                    partial_ind,
                    amount_bayar,
                    bank_benef,
                    no_rek_benef,
                    nama_benef,
                    verified_by,
                    verified_on,
                    tgl_tagihan_diterima,
                    no_giro,
                    ref_num_bank
            );
            data.put("data", result);
        } catch (Exception e) {
            data.put("data", "Gagal menyimpan");
            AppUtils.getLogger(this).debug("Error: {}", e.getMessage());
        }
        return data;
    }

    @RequestMapping(value = "/update_pembayaran", method = RequestMethod.POST)
    public Map<String, Object> updatePembayaran(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pBankPembayar", defaultValue = "") String pBankPembayar,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan,
            @RequestParam(value = "pTglRencanaBayar", defaultValue = "") String pTglRencanaBayar,
            @RequestParam(value = "pSumberDana", defaultValue = "") String pSumberDana,
            @RequestParam(value = "pMetodePembayaran", defaultValue = "") String pMetodePembayaran,
            @RequestParam(value = "pNoRekHouseBank", defaultValue = "") String pNoRekHouseBank,
            @RequestParam(value = "pInqCustomerName", defaultValue = "") String pInqCustomerName,
            @RequestParam(value = "pInqAccountNumber", defaultValue = "") String pInqAccountNumber,
            @RequestParam(value = "pInqAccountStatus", defaultValue = "") String pInqAccountStatus,
            @RequestParam(value = "pKodeBankPenerima", defaultValue = "") String pKodeBankPenerima,
            @RequestParam(value = "pRetrievalRefNumber", defaultValue = "") String pRetrievalRefNumber,
            @RequestParam(value = "pCustomerRefNumber", defaultValue = "") String pCustomerRefNumber,
            @RequestParam(value = "pConfirmationCode", defaultValue = "") String pConfirmationCode,
            @RequestParam(value = "pTglActBayar", defaultValue = "") String pTglActBayar,
            @RequestParam(value = "pJamBayar", defaultValue = "") String pJamBayar,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId,
            @RequestParam(value = "pNoGiro",defaultValue = "") String pNoGiro,
            @RequestParam(value = "pRefNum", defaultValue = "") String pRefNum,
            @RequestParam(value = "pExchRateDeals", defaultValue = "") String pExchRateDeals
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updatePembayaran(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pBankPembayar, pKeterangan, pTglRencanaBayar,pSumberDana,
                    pMetodePembayaran,pNoRekHouseBank,pInqCustomerName,pInqAccountNumber,pInqAccountStatus, pKodeBankPenerima, pRetrievalRefNumber,
                    pCustomerRefNumber, pConfirmationCode, pTglActBayar, pJamBayar, WebUtils.getUsernameLogin(), pOssId, pGroupId, pNoGiro, pRefNum, pExchRateDeals);
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_house_bank", method = RequestMethod.POST)
    public Map<String, Object> updatePembayaran(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pBankPembayar", defaultValue = "") String pBankPembayar,
            @RequestParam(value = "pNoRek", defaultValue = "") String pNoRek
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updateHouseBank(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pBankPembayar, pNoRek
                    );
//            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {
//
//            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_lunas", method = RequestMethod.POST)
    public Map<String, Object> updateLunas(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pJenisTransaksi", defaultValue = "") String pJenisTransaksi,
            @RequestParam(value = "pStatus", defaultValue = "Sukses") String pStatus,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "Sukses") String pGroupId,
            @RequestParam(value = "pRefNumBank", defaultValue = "-") String pRefNumBank
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updateLunas(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, WebUtils.getUsernameLogin(), pStatus, pOssId, pGroupId, pRefNumBank);
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/kirim_notif", method = RequestMethod.POST)
    public Map<String, Object> kirimNotif(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pUserId", defaultValue = "") String pUserId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.kirimNotif(pCompCode, pDocNo, WebUtils.getUsernameLogin());

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/validasi_notif", method = RequestMethod.POST)
    public Map<String, Object> validasiNotif(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pUserId", defaultValue = "") String pUserId,
            @RequestParam(value = "pToken", defaultValue = "") String pToken
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.validasiNotif(pCompCode, pDocNo, WebUtils.getUsernameLogin(),pToken);

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_lunas_giro", method = RequestMethod.POST)
    public Map<String, Object> updateLunasGiro(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pJenisTransaksi", defaultValue = "") String pJenisTransaksi,
            @RequestParam(value = "pOssId",defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updateLunasGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi,WebUtils.getUsernameLogin(), pOssId, pGroupId);

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_siap_bayar_giro", method = RequestMethod.POST)
    public Map<String, Object> updateSiapBayarGiro(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pJenisTransaksi", defaultValue = "") String pJenisTransaksi,
            @RequestParam(value = "pOssId",defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updateSiapBayarGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi,WebUtils.getUsernameLogin(), pOssId, pGroupId);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/update_siap_bayar_multiple")
    public Map<String, Object> updateSiapBayarMultiple(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String pCompCode = jsonObject.getString("pCompCode");
            String pDocNo = jsonObject.getString("pDocNo");
            String pFiscYear = jsonObject.getString("pFiscYear");
            String pLineItem = jsonObject.getString("pLineItem");
            String pJenisTransaksi = jsonObject.getString("pKet");
            String pOssId = jsonObject.getString("oss_id");
            String pGroupId = jsonObject.getString("group_id");
            out = corpayService.updateSiapBayarGiro(pCompCode,pDocNo,pFiscYear,pLineItem,pJenisTransaksi, WebUtils.getUsernameLogin(),pOssId,pGroupId);
        }
        return out;
    }

    @RequestMapping(value = "/update_status", method = RequestMethod.POST)
    public Map<String, Object> updateStatus(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking,
            @RequestParam(value = "pCustomerName", defaultValue = "") String pCustomerName,
            @RequestParam(value = "pAccountNumber", defaultValue = "") String pAccountNumber,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updateStatus(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking,
                    pCustomerName,pAccountNumber,WebUtils.getUsernameLogin(),pOssId,pGroupId);
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/update_status_giro", method = RequestMethod.POST)
    public Map<String, Object> updateStatusGiro(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.updateStatusGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking, pOssId, pGroupId,WebUtils.getUsernameLogin()
                    );

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/reverse_status", method = RequestMethod.POST)
    public Map<String, Object> reverseStatus(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.reverseStatus(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking, WebUtils.getUsernameLogin(), pOssId, pGroupId);
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/reverse_sap", method = RequestMethod.POST)
    public Map<String, Object> reverseSap(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId

    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = corpayService.reverseSap(pCompCode, pDocNo, pFiscYear, pLineItem, pKet,WebUtils.getUsernameLogin(), pOssId, pGroupId);

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/reverse_sap_multiple")
    public Map<String, Object> multipleReverseSap(@RequestParam(value = "pData") String pData) throws JSONException, SQLException{
        Map<String, Object> reverse = new HashMap<>();
        Map<String, Object> out = new HashMap<>();
        JSONArray jsonArray = new JSONArray(pData);
        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String comp_code = jsonObject.getString("pCompCode");
            String doc_no = jsonObject.getString("pDocNo");
            String fiscal_year = jsonObject.getString("pFiscYear");
            String line_item = jsonObject.getString("pLineItem");
            String ket = jsonObject.getString("pKet");
            String oss_id = jsonObject.getString("oss_id");
            String group_id = jsonObject.getString("group_id");
            reverse = corpayService.reverseSap(comp_code, doc_no, fiscal_year, line_item, ket, WebUtils.getUsernameLogin(), oss_id, group_id);
            out.put("reverse("+index+")",reverse);
        }
        return out;
    }

    @RequestMapping(value = "/get_bank_pembayar", method = RequestMethod.GET)
    public List<Map<String,Object>> getBankPembayar() {
        try {
            return corpayService.getBankPembayar();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_cash_code", method = RequestMethod.GET)
    public List<Map<String,Object>> getCashCode() {
        try {
            return corpayService.getCashCode();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_house_bank", method = RequestMethod.GET)
    public List<Map<String,Object>> getHouseBank(
            @RequestParam(value = "pAccount", defaultValue = "") String pAccount
    ) {
        try {
            return corpayService.getHouseBank(pAccount);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_kode_bank_pembayar", method = RequestMethod.GET)
    public List<Map<String,Object>> getKodeBankPembayar(
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency
    ) {
        try {
            return corpayService.getKodeBankPembayar(pCurrency);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_kode_bank_penerima", method = RequestMethod.GET)
    public List<Map<String,Object>> getKodeBankPenerima(
            @RequestParam(value = "pSingkatan", defaultValue = "") String pSingkatan
    ) {
        try {
            return corpayService.getKodeBankPenerima(pSingkatan);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_no_rekening", method = RequestMethod.GET)
    public List<Map<String,Object>> getNoRekening(
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank
    ) {
        try {
            return corpayService.getNoRekening(pCurrency, pKodeBank);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_nama_bank", method = RequestMethod.GET)
    public List<Map<String,Object>> getNamaBank(
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pKodeBank", defaultValue = "") String pKodeBank
    ) {
        try {
            return corpayService.getNamaBank(pCurrency, pKodeBank);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_metode_bayar", method = RequestMethod.GET)
    public List<Map<String,Object>> getMetodeBayar() {
        try {
            return corpayService.getMetodeBayar();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_bank_account", method = RequestMethod.GET)
    public List<Map<String,Object>> getBankAccount(@RequestParam(value = "pBankPembayar", defaultValue = "") String pBankPembayar) {

        try {
            return corpayService.getBankAccount(pBankPembayar);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_account_name", method = RequestMethod.GET)
    public List<Map<String,Object>> getAccountName(@RequestParam(value = "pBankAccount", defaultValue = "") String pBankAccount) {

        try {
            return corpayService.getAccountName(pBankAccount);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_saldo", method = RequestMethod.GET)
    public List<Map<String,Object>> getSaldo(@RequestParam(value = "pBankAccount", defaultValue = "") String pBankAccount) {

        try {
            return corpayService.getSaldo(pBankAccount);
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/ins_rekap_reject", method = RequestMethod.POST)
    public Map<String, Object> insRekapReject(
            @RequestParam(value = "p_comp_code", defaultValue = "") String pCompCode,
            @RequestParam(value ="p_doc_no", defaultValue = "") String pDocNo,
            @RequestParam(value ="p_fisc_year", defaultValue = "") String pFiscYear,
            @RequestParam(value ="p_line_item", defaultValue = "") String pLineItem,
            @RequestParam(value ="p_ket", defaultValue = "") String pKet) {
        try {
            return corpayService.insRejectLaporan(pCompCode, pDocNo, pFiscYear, pLineItem, pKet);
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/get_ballance", method = RequestMethod.POST)
    public String getBallance(
            @RequestParam("in_bank") String in_bank,
            @RequestParam("in_source") String in_source,
            @RequestParam("in_beneficiary") String in_beneficiary) {
        return corpayService.getBallance(in_bank, in_source, in_beneficiary);
    }

//    @RequestMapping(value = "/create_group", method = RequestMethod.POST)
//    public Map<String, Object> createGroup(
//            @RequestParam(value = "pData", defaultValue = "") String pData,
//            @RequestParam(value = "pNamaGroup", defaultValue = "") String pNamaGroup
//    ) throws JSONException {
//
//        Map<String, Object> out = null;
//        //pNamaGroup = (pNamaGroup.toString().equals("null") ? "" : pNamaGroup);
//        String jsonString = corpayService.getPerfectJsonString(pData);
//        String[] listData = jsonString.split(";");
//        JSONObject json ;
//
//        for (String item : listData) {
//            json = new JSONObject(item);
//            Iterator<?> keys = json.keys();
//            while (keys.hasNext()) {
//                String key = (String) keys.next();
//                String value = json.getString(key);
//
//               // if (!key.equals("pCompCode") && !key.equals("pDocNo") && !key.equals("pFiscYear") && !key.equals("pLineItem") && !key.equals("pKet")) {
//                    try {
//                        System.out.println("DIAZZZZZ:"+json.getString("pCompCode"));
//                        out = corpayService.createGroup(json.getString("pCompCode"), json.getString("pDocNo"), json.getString("pFiscYear"), json.getString("pLineItem"),json.getString("pKet"), pNamaGroup, WebUtils.getUsernameLogin());
//
//                        return out;
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                        out = null;
//                        break;
//                    }
//               // }
//                /*else {
//                    out.put("OUT_MSG", "DATA BERHASIL DIUBAH");
//                    out.put("return", "1");
//                }*/
//            }
//        }
//
//        AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
//        return out;
//
//    }

    @RequestMapping(value = "/get_Ballance2", method = RequestMethod.POST)
    public String getBallance2(
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value ="pSource", defaultValue = "") String pSource,
            @RequestParam(value ="pBeneficiary", defaultValue = "") String pBeneficiary) {
        try {
            String res = corpayService.get2(pBank, pSource, pBeneficiary);
            System.out.println("TEST");
            System.out.println(res);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/inquiry", method = RequestMethod.POST)
    public String inquiry(
            @RequestParam(value = "pMetodeBayar", defaultValue = "") String pMetodeBayar,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value ="pSource", defaultValue = "") String pSource,
            @RequestParam(value ="pAccountNumber", defaultValue = "") String pAccountNumber,
            @RequestParam(value ="pBeneficiaryAccount", defaultValue = "") String pBeneficiaryAccount,
            @RequestParam(value ="pDestinationBankCode", defaultValue = "") String pDestinationBankCode){
        try {
            String res = corpayService.doInquiry(pMetodeBayar, pBank, pSource, pAccountNumber,
                    pBeneficiaryAccount, pDestinationBankCode);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/payment_status", method = RequestMethod.POST)
    public String paymentStatus(
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value ="pRefNum", defaultValue = "")String pRefNum){
        try {
            String res = corpayService.doPaymentStatus(pBank, pRefNum);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/create_group", method = RequestMethod.POST)
    public Map<String, Object> createGroup(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pNamaGroup", defaultValue = "") String pNamaGroup
    ) throws SQLException, JSONException {

        Map<String, Object> out = null;
//        System.out.println("Fikri2 : "+pData);
        String jsonString = corpayService.getPerfectJsonString(pData);
        JSONArray jsonArray = new JSONArray(pData);
        System.out.println("JSON Array : "+jsonArray);
        String[] listData = jsonString.split(";");
        System.out.println("Jancok : "+listData.length);
        int i=0;

        try{
            for (int j = 0; j < jsonArray.length(); j++) {
                JSONObject json = jsonArray.getJSONObject(j);
                json.getString("COMP_CODE");
//                System.out.println("Loop : "+i++);
//                System.out.println("DIAZZZZZ:"+json.getString("COMP_CODE"));
                out = corpayService.insGroupTemp(
                        json.getString("KET"), json.getString("COMP_CODE"), json.getString("DOC_NO"),
                        json.getString("FISC_YEAR"),json.getString("DOC_TYPE"),json.getString("DOC_DATE"), json.getString("DOC_DATE2"), json.getString("POST_DATE"),
                        json.getString("POST_DATE2"),json.getString("ENTRY_DATE"),json.getString("ENTRY_DATE2"), json.getString("REFERENCE"), json.getString("REV_WITH"), json.getString("REV_YEAR"),json.getString("DOC_HDR_TXT"),json.getString("CURRENCY"), json.getString("EXCH_RATE"), json.getString("REFERENCE_KEY"),
                        json.getString("PMT_IND"),json.getString("TRANS_TYPE"),json.getString("SPREAD_VAL"), json.getString("LINE_ITEM"), json.getString("OI_IND"),
                        json.getString("ACCT_TYPE"),json.getString("SPEC_GL"),json.getString("BUS_AREA"), json.getString("TPBA"), json.getString("AMT_LC"), json.getString("AMT_TC"),json.getString("AMT_WITH_BASE_TC"),json.getString("AMT_WITH_TC"), json.getString("AMOUNT"), json.getString("ASSIGNMENT"),
                        json.getString("ITEM_TEXT"),json.getString("COST_CTR"),json.getString("GL_ACCT"), json.getString("CUSTOMER"), json.getString("CUSTOMER"),
                        json.getString("VENDOR"),json.getString("VENDOR"),json.getString("BASE_DATE"), json.getString("TERM_PMT"), json.getString("DUE_ON"),
                        json.getString("PMT_BLOCK"),json.getString("HOUSE_BANK"),json.getString("PRTNR_BANK_TYPE"), json.getString("BANK_KEY"), json.getString("BANK_ACCOUNT"),
                        json.getString("ACCOUNT_HOLDER"),json.getString("PO_NUM"),json.getString("PO_ITEM"), json.getString("REF_KEY1"), json.getString("REF_KEY2"),
                        json.getString("REF_KEY3"),json.getString("INT_ORDER"),json.getString("WBS_NUM"), json.getString("CASH_CODE"), json.getString("AMT_WITH_BASE_LC"),
                        json.getString("AMT_WITH_LC"),json.getString("DR_CR_IND"),json.getString("CORP_PMT"), "", "",
                        "",json.getString("METODE_PEMBAYARAN"),json.getString("TGL_RENCANA_BAYAR"), json.getString("SUMBER_DANA"), "",
                        "","", "", json.getString("KETERANGAN"), "",
                        json.getString("GROUP_ID"),pNamaGroup,json.getString("NO_REK_HOUSE_BANK"), json.getString("INQ_CUSTOMER_NAME"), json.getString("INQ_ACCOUNT_NUMBER"),
                        json.getString("REF_KEY3"),json.getString("INT_ORDER"),json.getString("WBS_NUM"), json.getString("CASH_CODE"), json.getString("CONFIRMATION_CODE"),
                        json.getString("TGL_ACT_BAYAR"), json.getString("REF_NUM_BANK")
                );
                if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {

                }
            }
            Map<String, Object> result = corpayService.createGroup(WebUtils.getUsernameLogin());
            AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
            return out;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/do_payment", method = RequestMethod.POST)
    public String inquiry(
            @RequestParam(value = "pMetodeBayar", defaultValue = "") String pMetodeBayar,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pRefNum", defaultValue = "") String pRefNum,
            @RequestParam(value ="pSource", defaultValue = "") String pSource,
            @RequestParam(value ="pBeneficiaryAccount", defaultValue = "") String pBeneficiaryAccount,
            @RequestParam(value = "pCurrency", defaultValue = "") String pCurrency,
            @RequestParam(value = "pAmount", defaultValue = "") String pAmount,
            @RequestParam(value = "pAmountBayar", defaultValue = "") String pAmountBayar,
            @RequestParam(value = "pRemark", defaultValue = "") String pRemark,
            @RequestParam(value = "pBenefEmail", defaultValue = "") String pBenefEmail,
            @RequestParam(value = "pBenefName", defaultValue = "") String pBenefName,
            @RequestParam(value = "pBenefAddr1", defaultValue = "") String pBenefAddr1,
            @RequestParam(value = "pBenefAddr2", defaultValue = "") String pBenefAddr2,
            @RequestParam(value = "pDestinationBank", defaultValue = "") String pDestinationBank,
            @RequestParam(value = "pFeeType", defaultValue = "") String pFeeType,
            @RequestParam(value = "pCurrency2", defaultValue = "") String pCurrency2,
            @RequestParam(value = "pRetrievalReff", defaultValue = "") String pRetrievalReff,
            @RequestParam(value = "pDestinationBankCode", defaultValue = "") String pDestinationBankCode,
            @RequestParam(value = "pConfirmationCode", defaultValue = "") String pConfirmationCode
            ){
        try {
            String res = corpayService.payment(pMetodeBayar,pBank,pRefNum, pSource, pBeneficiaryAccount,pCurrency,
                    pAmount, pAmountBayar, pRemark,pBenefEmail,pBenefName,pBenefAddr1,pBenefAddr2,pDestinationBank,pFeeType,
                    pCurrency2,pRetrievalReff,pDestinationBankCode, pConfirmationCode);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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
                String comp_code = object.getString("pCompCode");
                String doc_no = object.getString("pDocNo");
                String fisc_year = object.getString("pFiscYear");
                String line_item = object.getString("pLineItem");
                String ket = object.getString("pKet");
                String statustracking = object.getString("statustracking");
                String customer_name = object.getString("customer_name");
                String account_number = object.getString("account_number");
                String oss_id = object.getString("oss_id");
                String group_id = object.getString("group_id");
                if (object.getString("metode_pembayaran").equals("INTERNETBANKING") || object.getString("metode_pembayaran").equals("GIRO")){
                    out = corpayService.updateStatusGiro(comp_code, doc_no, fisc_year, line_item, ket, statustracking, oss_id, group_id, WebUtils.getUsernameLogin());
                }else {
                    out = corpayService.updateStatus(comp_code, doc_no, fisc_year, line_item, ket, statustracking, customer_name, account_number, WebUtils.getUsernameLogin(), oss_id, group_id);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return out;
    }

    @RequestMapping(value = "/verifikasi_tanggal", method = RequestMethod.POST)
    public Map<String, Object> verifikasiTgl(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "p_oss_id", defaultValue = "") String pOssId,
            @RequestParam(value = "p_group_id", defaultValue = "") String pGroupId
    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
        try {
            Map<String, Object> res = corpayService.verifikasiTgl(pCompCode, pDocNo, pFiscYear, pLineItem, pKet,WebUtils.getUsernameLogin(), pOssId, pGroupId);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_invoice_verifikasi_tgl", method = RequestMethod.GET)
    public Map getInvoiceVerifikasiTgl(
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
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = corpayService.getInvoiceVerifikasiTgl(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_invoice_verifikator", method = RequestMethod.GET)
    public Map getInvoiceVerifikator(
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
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = corpayService.getInvoiceVerifikator(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_invoice_admin", method = RequestMethod.GET)
    public Map getInvoiceAdmin(
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
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = corpayService.getInvoiceAdmin(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_total_tagihan", method = RequestMethod.GET)
    public String getTotalTagihan(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "currency", defaultValue = "ALL") String currency,
                                  @RequestParam(value = "caraBayar", defaultValue = "ALL") String caraBayar,
                                  @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  corpayService.getTotalTagihan(tglAwal, tglAkhir, currency, caraBayar, bank, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @RequestMapping(value = "/get_total_tagihan_rekap_invoice", method = RequestMethod.GET)
    public String getTotalTagihanRekapInvoiceAdmin(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "currency", defaultValue = "ALL") String currency,
                                  @RequestParam(value = "caraBayar", defaultValue = "ALL") String caraBayar,
                                  @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  corpayService.getTotalTagihanRekapInvoiceAdmin(tglAwal, tglAkhir, currency, caraBayar, bank, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @GetMapping(value = "/get_total_tagihan_approval_evp")
    public String getTotalTagihanApprovalEvp(
            @RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
            @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
            @RequestParam(value = "currency", defaultValue = "ALL") String currency,
            @RequestParam(value = "bank", defaultValue = "ALL") String bank,
            @RequestParam(value = "search", defaultValue = "") String search
    ){
        BigDecimal total_tagihan = corpayService.getTotalTagihanApprovalEvp(tglAwal, tglAkhir, currency, bank, WebUtils.getUsernameLogin(),search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(total_tagihan);
        return formatted;
    }

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pCurr}/{pCaraBayar}/{pBank}/{pStatus}/{pStatusTracking}/{pRole}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
            @PathVariable String pCaraBayar,
            @PathVariable String pBank,
            @PathVariable String pStatus,
            @PathVariable String pStatusTracking,
            @PathVariable String pRole,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";
            String title = "";
            String namaFile = "";

            if (!pTglAwal.equals("null")) {
                tglAwal = pTglAwal;
            }
            if (!pTglAkhir.equals("null")) {
                tglAkhir = pTglAkhir;
            }

            if (pRole.equals("ROLE_ADMIN")){
                title = "REKAP INVOICE";
                namaFile = "rekap_invoice.xls";
            }else{
                title = "REKAP INVOICE BELUM";
                namaFile = "rekap_invoice_belum.xls";
            }


            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = corpayService.getAllpembayaran(WebUtils.getUsernameLogin(), tglAwal.replace("-", "/"), tglAkhir.replace("-", "/"), pCurr, pCaraBayar, pBank, pStatus, pStatusTracking);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("KET",data.get("KET"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE",data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE",(!data.get("DOC_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("DOC_DATE").toString())) : "-");
                paramDetail.put("DOC_DATE2",data.get("DOC_DATE2"));
                paramDetail.put("DESKRIPSI_BANK", data.get("DESKRIPSI_BANK"));
                paramDetail.put("POST_DATE",(!data.get("POST_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("POST_DATE").toString())) : "-");
                paramDetail.put("POST_DATE2",data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE",(!data.get("ENTRY_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("ENTRY_DATE").toString())) : "-");
                paramDetail.put("ENTRY_DATE2",data.get("ENTRY_DATE2"));
                paramDetail.put("REFERENCE",data.get("REFERENCE"));
                paramDetail.put("REV_WITH",data.get("REV_WITH"));
                paramDetail.put("REV_YEAR",data.get("REV_YEAR"));
                paramDetail.put("DOC_HDR_TXT",data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY",data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE",data.get("EXCH_RATE"));
                paramDetail.put("REFERENCE_KEY",data.get("REFERENCE_KEY"));
                paramDetail.put("PMT_IND",data.get("PMT_IND"));
                paramDetail.put("TRANS_TYPE",data.get("TRANS_TYPE"));
                paramDetail.put("SPREAD_VAL",data.get("SPREAD_VAL"));
                paramDetail.put("LINE_ITEM",data.get("LINE_ITEM"));
                paramDetail.put("OI_IND",data.get("OI_IND"));
                paramDetail.put("ACCT_TYPE",data.get("ACCT_TYPE"));
                paramDetail.put("SPEC_GL",data.get("SPEC_GL"));
                paramDetail.put("BUS_AREA",data.get("BUS_AREA"));
                paramDetail.put("TPBA",data.get("TPBA"));
                paramDetail.put("AMT_LC",data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_TC",data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC",data.get("AMT_WITH_TC"));
                paramDetail.put("AMOUNT",data.get("AMOUNT"));
                paramDetail.put("ASSIGNMENT",data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT",data.get("ITEM_TEXT"));
                paramDetail.put("COST_CTR",data.get("COST_CTR"));
                paramDetail.put("GL_ACCT",data.get("GL_ACCT"));
                paramDetail.put("CUSTOMER",data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME",data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR",data.get("VENDOR"));
                paramDetail.put("VENDOR_NAME",data.get("VENDOR_NAME"));
                paramDetail.put("BASE_DATE",(!data.get("BASE_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("BASE_DATE").toString())) : "-");
                paramDetail.put("TERM_PMT",data.get("TERM_PMT"));
                paramDetail.put("DUE_ON",data.get("DUE_ON"));
                paramDetail.put("PMT_BLOCK",data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK",data.get("HOUSE_BANK"));
                paramDetail.put("NAMA_HOUSE_BANK", data.get("NAMA_BANK"));
                paramDetail.put("NO_GIRO", data.get("NO_GIRO"));
                paramDetail.put("PRTNR_BANK_TYPE",data.get("PRTNR_BANK_TYPE"));
                paramDetail.put("BANK_KEY",data.get("BANK_KEY"));
                paramDetail.put("BANK_ACCOUNT",data.get("BANK_ACCOUNT"));
                paramDetail.put("ACCOUNT_HOLDER",data.get("ACCOUNT_HOLDER"));
                paramDetail.put("PO_NUM",data.get("PO_NUM"));
                paramDetail.put("PO_ITEM",data.get("PO_ITEM"));
                paramDetail.put("REF_KEY1",data.get("REF_KEY1"));
                paramDetail.put("REF_KEY2",data.get("REF_KEY2"));
                paramDetail.put("REF_KEY3",data.get("REF_KEY3"));
                paramDetail.put("INT_ORDER",data.get("INT_ORDER"));
                paramDetail.put("WBS_NUM",data.get("WBS_NUM"));
                paramDetail.put("CASH_CODE",data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASHCODE",data.get("NAMA_CASHCODE"));
                paramDetail.put("AMT_WITH_BASE_LC",data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC",data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND",data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT",data.get("CORP_PMT"));
                paramDetail.put("TGL_VERIFIKASI_MAKER",data.get("TGL_VERIFIKASI_MAKER"));
                paramDetail.put("TGL_VERIFIKASI_CHECKER",data.get("TGL_VERIFIKASI_CHECKER"));
                paramDetail.put("TGL_VERIFIKASI_APPROVER",data.get("TGL_VERIFIKASI_APPROVER"));
                paramDetail.put("METODE_PEMBAYARAN",data.get("METODE_PEMBAYARAN"));
                paramDetail.put("TGL_TAGIHAN_DITERIMA",data.get("TGL_TAGIHAN_DITERIMA"));
                paramDetail.put("MAKER",data.get("MAKER"));
                paramDetail.put("CHECKER",data.get("CHECKER"));
                paramDetail.put("APPROVER",data.get("APPROVER"));
                paramDetail.put("COUNTER",data.get("COUNTER"));
                paramDetail.put("KETERANGAN",data.get("KETERANGAN"));
                paramDetail.put("FLAG_STATUS",data.get("FLAG_STATUS"));
                paramDetail.put("NO_REK_HOUSE_BANK",data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("INQ_CUSTOMER_NAME",data.get("INQ_CUSTOMER_NAME"));
                paramDetail.put("INQ_ACCOUNT_NUMBER",data.get("INQ_ACCOUNT_NUMBER"));
                paramDetail.put("INQ_ACCOUNT_STATUS",data.get("INQ_ACCOUNT_STATUS"));
                paramDetail.put("KODE_BANK_PENERIMA",data.get("KODE_BANK_PENERIMA"));
                paramDetail.put("RETRIEVAL_REF_NUMBER",data.get("RETRIEVAL_REF_NUMBER"));
                paramDetail.put("CUSTOMER_REF_NUMBER",data.get("CUSTOMER_REF_NUMBER"));
                paramDetail.put("CONFIRMATION_CODE",data.get("CONFIRMATION_CODE"));
                paramDetail.put("TGL_ACT_BAYAR",data.get("TGL_ACT_BAYAR"));
                paramDetail.put("OSS_ID",data.get("OSS_ID"));
                paramDetail.put("GROUP_ID",data.get("GROUP_ID"));
                paramDetail.put("SUMBER_DANA",data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BAYAR",data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("BANK_BYR",data.get("BANK_BYR"));
                paramDetail.put("CURR_BAYAR",data.get("CURR_BAYAR"));
                paramDetail.put("PARTIAL_IND",data.get("PARTIAL_IND"));
                paramDetail.put("AMOUNT_BAYAR",data.get("AMOUNT_BAYAR"));
                paramDetail.put("BANK_BENEF",data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF",data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF",data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY",data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON",data.get("VERIFIED_ON"));
                paramDetail.put("SPREAD_VALUE",data.get("SPREAD_VAL"));
                paramDetail.put("APPROVE_TGL_RENCANA_BAYAR",data.get("APPROVE_TGL_RENCANA_BAYAR"));
                paramDetail.put("STATUS_TRACKING",data.get("STATUS_TRACKING"));
                paramDetail.put("STATUS",data.get("STATUS"));
                paramDetail.put("POSISI", data.get("POSISI"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("JENIS_TRANSAKSI", data.get("JENIS"));
                paramDetail.put("REFERENCE_NUMBER_BANK", data.get("REF_NUM_BANK"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_invoice_belum.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls_all_invoice", method = RequestMethod.GET)
    public String export(HttpServletRequest request, HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";

            String title = "REKAP ALL INVOICE";
            String namaFile = "rekap_all_invoice.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = corpayService.getAllpembayaranOss();

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("KET",data.get("KET"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE",data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE",(!data.get("DOC_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("DOC_DATE").toString())) : "-");
                paramDetail.put("DOC_DATE2",data.get("DOC_DATE2"));
                paramDetail.put("DESKRIPSI_BANK", data.get("DESKRIPSI_BANK"));
                paramDetail.put("POST_DATE",(!data.get("POST_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("POST_DATE").toString())) : "-");
                paramDetail.put("POST_DATE2",data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE",(!data.get("ENTRY_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("ENTRY_DATE").toString())) : "-");
                paramDetail.put("ENTRY_DATE2",data.get("ENTRY_DATE2"));
                paramDetail.put("REFERENCE",data.get("REFERENCE"));
                paramDetail.put("REV_WITH",data.get("REV_WITH"));
                paramDetail.put("REV_YEAR",data.get("REV_YEAR"));
                paramDetail.put("DOC_HDR_TXT",data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY",data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE",data.get("EXCH_RATE"));
                paramDetail.put("REFERENCE_KEY",data.get("REFERENCE_KEY"));
                paramDetail.put("PMT_IND",data.get("PMT_IND"));
                paramDetail.put("TRANS_TYPE",data.get("TRANS_TYPE"));
                paramDetail.put("SPREAD_VAL",data.get("SPREAD_VAL"));
                paramDetail.put("LINE_ITEM",data.get("LINE_ITEM"));
                paramDetail.put("OI_IND",data.get("OI_IND"));
                paramDetail.put("ACCT_TYPE",data.get("ACCT_TYPE"));
                paramDetail.put("SPEC_GL",data.get("SPEC_GL"));
                paramDetail.put("BUS_AREA",data.get("BUS_AREA"));
                paramDetail.put("TPBA",data.get("TPBA"));
                paramDetail.put("AMT_LC",data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_TC",data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC",data.get("AMT_WITH_TC"));
                paramDetail.put("AMOUNT",data.get("AMOUNT"));
                paramDetail.put("ASSIGNMENT",data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT",data.get("ITEM_TEXT"));
                paramDetail.put("COST_CTR",data.get("COST_CTR"));
                paramDetail.put("GL_ACCT",data.get("GL_ACCT"));
                paramDetail.put("CUSTOMER",data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME",data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR",data.get("VENDOR"));
                paramDetail.put("VENDOR_NAME",data.get("VENDOR_NAME"));
                paramDetail.put("BASE_DATE",(!data.get("BASE_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("BASE_DATE").toString())) : "-");
                paramDetail.put("TERM_PMT",data.get("TERM_PMT"));
                paramDetail.put("DUE_ON",data.get("DUE_ON"));
                paramDetail.put("PMT_BLOCK",data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK",data.get("HOUSE_BANK"));
                paramDetail.put("NAMA_HOUSE_BANK", data.get("NAMA_BANK"));
                paramDetail.put("NO_GIRO", data.get("NO_GIRO"));
                paramDetail.put("PRTNR_BANK_TYPE",data.get("PRTNR_BANK_TYPE"));
                paramDetail.put("BANK_KEY",data.get("BANK_KEY"));
                paramDetail.put("BANK_ACCOUNT",data.get("BANK_ACCOUNT"));
                paramDetail.put("ACCOUNT_HOLDER",data.get("ACCOUNT_HOLDER"));
                paramDetail.put("PO_NUM",data.get("PO_NUM"));
                paramDetail.put("PO_ITEM",data.get("PO_ITEM"));
                paramDetail.put("REF_KEY1",data.get("REF_KEY1"));
                paramDetail.put("REF_KEY2",data.get("REF_KEY2"));
                paramDetail.put("REF_KEY3",data.get("REF_KEY3"));
                paramDetail.put("INT_ORDER",data.get("INT_ORDER"));
                paramDetail.put("WBS_NUM",data.get("WBS_NUM"));
                paramDetail.put("CASH_CODE",data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASHCODE",data.get("NAMA_CASHCODE"));
                paramDetail.put("AMT_WITH_BASE_LC",data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC",data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND",data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT",data.get("CORP_PMT"));
                paramDetail.put("TGL_VERIFIKASI_MAKER",data.get("TGL_VERIFIKASI_MAKER"));
                paramDetail.put("TGL_VERIFIKASI_CHECKER",data.get("TGL_VERIFIKASI_CHECKER"));
                paramDetail.put("TGL_VERIFIKASI_APPROVER",data.get("TGL_VERIFIKASI_APPROVER"));
                paramDetail.put("METODE_PEMBAYARAN",data.get("METODE_PEMBAYARAN"));
                paramDetail.put("TGL_TAGIHAN_DITERIMA",data.get("TGL_TAGIHAN_DITERIMA"));
                paramDetail.put("MAKER",data.get("MAKER"));
                paramDetail.put("CHECKER",data.get("CHECKER"));
                paramDetail.put("APPROVER",data.get("APPROVER"));
                paramDetail.put("COUNTER",data.get("COUNTER"));
                paramDetail.put("KETERANGAN",data.get("KETERANGAN"));
                paramDetail.put("FLAG_STATUS",data.get("FLAG_STATUS"));
                paramDetail.put("NO_REK_HOUSE_BANK",data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("INQ_CUSTOMER_NAME",data.get("INQ_CUSTOMER_NAME"));
                paramDetail.put("INQ_ACCOUNT_NUMBER",data.get("INQ_ACCOUNT_NUMBER"));
                paramDetail.put("INQ_ACCOUNT_STATUS",data.get("INQ_ACCOUNT_STATUS"));
                paramDetail.put("KODE_BANK_PENERIMA",data.get("KODE_BANK_PENERIMA"));
                paramDetail.put("RETRIEVAL_REF_NUMBER",data.get("RETRIEVAL_REF_NUMBER"));
                paramDetail.put("CUSTOMER_REF_NUMBER",data.get("CUSTOMER_REF_NUMBER"));
                paramDetail.put("CONFIRMATION_CODE",data.get("CONFIRMATION_CODE"));
                paramDetail.put("TGL_ACT_BAYAR",data.get("TGL_ACT_BAYAR"));
                paramDetail.put("OSS_ID",data.get("OSS_ID"));
                paramDetail.put("GROUP_ID",data.get("GROUP_ID"));
                paramDetail.put("SUMBER_DANA",data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BAYAR",data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("BANK_BYR",data.get("BANK_BYR"));
                paramDetail.put("CURR_BAYAR",data.get("CURR_BAYAR"));
                paramDetail.put("PARTIAL_IND",data.get("PARTIAL_IND"));
                paramDetail.put("AMOUNT_BAYAR",data.get("AMOUNT_BAYAR"));
                paramDetail.put("BANK_BENEF",data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF",data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF",data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY",data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON",data.get("VERIFIED_ON"));
                paramDetail.put("SPREAD_VALUE",data.get("SPREAD_VAL"));
                paramDetail.put("APPROVE_TGL_RENCANA_BAYAR",data.get("APPROVE_TGL_RENCANA_BAYAR"));
                paramDetail.put("STATUS_TRACKING",data.get("STATUS_TRACKING"));
                paramDetail.put("STATUS",data.get("STATUS"));
                paramDetail.put("POSISI", data.get("POSISI"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("JENIS_TRANSAKSI", data.get("JENIS"));
                paramDetail.put("REFERENCE_NUMBER_BANK", data.get("REF_NUM_BANK"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_all_invoice.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/xls_verifikasi_tanggal/{pTglAwal}/{pTglAkhir}/{pCurr}/{pBank}/{pStatus}/{pStatusTracking}", method = RequestMethod.GET)
    public String exportVerifikasiTanggal(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
            @PathVariable String pBank,
            @PathVariable String pStatus,
            @PathVariable String pStatusTracking,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";

            if (!pTglAwal.equals("null")) {
                tglAwal = pTglAwal;
            }
            if (!pTglAkhir.equals("null")) {
                tglAkhir = pTglAkhir;
            }

            String title = "REKAP INVOICE APPROVAL EVP";
            String namaFile = "rekap_invoice_approval_evp.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = corpayService.getVerifikasiTanggalByStatus(WebUtils.getUsernameLogin(), tglAwal.replace("-", "/"), tglAkhir.replace("-", "/"), pCurr, pBank, pStatus, pStatusTracking);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("KET",data.get("KET"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE",data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE",(!data.get("DOC_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("DOC_DATE").toString())) : "-");
                paramDetail.put("DOC_DATE2",data.get("DOC_DATE2"));
                paramDetail.put("DESKRIPSI_BANK", data.get("DESKRIPSI_BANK"));
                paramDetail.put("POST_DATE",(!data.get("POST_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("POST_DATE").toString())) : "-");
                paramDetail.put("POST_DATE2",data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE",(!data.get("ENTRY_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("ENTRY_DATE").toString())) : "-");
                paramDetail.put("ENTRY_DATE2",data.get("ENTRY_DATE2"));
                paramDetail.put("REFERENCE",data.get("REFERENCE"));
                paramDetail.put("REV_WITH",data.get("REV_WITH"));
                paramDetail.put("REV_YEAR",data.get("REV_YEAR"));
                paramDetail.put("DOC_HDR_TXT",data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY",data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE",data.get("EXCH_RATE"));
                paramDetail.put("REFERENCE_KEY",data.get("REFERENCE_KEY"));
                paramDetail.put("PMT_IND",data.get("PMT_IND"));
                paramDetail.put("TRANS_TYPE",data.get("TRANS_TYPE"));
                paramDetail.put("SPREAD_VAL",data.get("SPREAD_VAL"));
                paramDetail.put("LINE_ITEM",data.get("LINE_ITEM"));
                paramDetail.put("OI_IND",data.get("OI_IND"));
                paramDetail.put("ACCT_TYPE",data.get("ACCT_TYPE"));
                paramDetail.put("SPEC_GL",data.get("SPEC_GL"));
                paramDetail.put("BUS_AREA",data.get("BUS_AREA"));
                paramDetail.put("TPBA",data.get("TPBA"));
                paramDetail.put("AMT_LC",data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_TC",data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC",data.get("AMT_WITH_TC"));
                paramDetail.put("AMOUNT",data.get("AMOUNT"));
                paramDetail.put("ASSIGNMENT",data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT",data.get("ITEM_TEXT"));
                paramDetail.put("COST_CTR",data.get("COST_CTR"));
                paramDetail.put("GL_ACCT",data.get("GL_ACCT"));
                paramDetail.put("CUSTOMER",data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME",data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR",data.get("VENDOR"));
                paramDetail.put("VENDOR_NAME",data.get("VENDOR_NAME"));
                paramDetail.put("BASE_DATE",(!data.get("BASE_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("BASE_DATE").toString())) : "-");
                paramDetail.put("TERM_PMT",data.get("TERM_PMT"));
                paramDetail.put("DUE_ON",data.get("DUE_ON"));
                paramDetail.put("PMT_BLOCK",data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK",data.get("HOUSE_BANK"));
                paramDetail.put("NAMA_HOUSE_BANK", data.get("NAMA_BANK"));
                paramDetail.put("NO_GIRO", data.get("NO_GIRO"));
                paramDetail.put("PRTNR_BANK_TYPE",data.get("PRTNR_BANK_TYPE"));
                paramDetail.put("BANK_KEY",data.get("BANK_KEY"));
                paramDetail.put("BANK_ACCOUNT",data.get("BANK_ACCOUNT"));
                paramDetail.put("ACCOUNT_HOLDER",data.get("ACCOUNT_HOLDER"));
                paramDetail.put("PO_NUM",data.get("PO_NUM"));
                paramDetail.put("PO_ITEM",data.get("PO_ITEM"));
                paramDetail.put("PARTIAL_IND", data.get("PARTIAL_IND"));
                paramDetail.put("REF_KEY1",data.get("REF_KEY1"));
                paramDetail.put("REF_KEY2",data.get("REF_KEY2"));
                paramDetail.put("REF_KEY3",data.get("REF_KEY3"));
                paramDetail.put("INT_ORDER",data.get("INT_ORDER"));
                paramDetail.put("WBS_NUM",data.get("WBS_NUM"));
                paramDetail.put("CASH_CODE",data.get("CASH_CODE"));
                paramDetail.put("NAMA_CASHCODE",data.get("NAMA_CASHCODE"));
                paramDetail.put("AMT_WITH_BASE_LC",data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC",data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND",data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT",data.get("CORP_PMT"));
                paramDetail.put("TGL_VERIFIKASI_MAKER",data.get("TGL_VERIFIKASI_MAKER"));
                paramDetail.put("TGL_VERIFIKASI_CHECKER",data.get("TGL_VERIFIKASI_CHECKER"));
                paramDetail.put("TGL_VERIFIKASI_APPROVER",data.get("TGL_VERIFIKASI_APPROVER"));
                paramDetail.put("METODE_PEMBAYARAN",data.get("METODE_PEMBAYARAN"));
                paramDetail.put("TGL_TAGIHAN_DITERIMA",data.get("TGL_TAGIHAN_DITERIMA"));
                paramDetail.put("MAKER",data.get("MAKER"));
                paramDetail.put("CHECKER",data.get("CHECKER"));
                paramDetail.put("APPROVER",data.get("APPROVER"));
                paramDetail.put("COUNTER",data.get("COUNTER"));
                paramDetail.put("KETERANGAN",data.get("KETERANGAN"));
                paramDetail.put("FLAG_STATUS",data.get("FLAG_STATUS"));
                paramDetail.put("NO_REK_HOUSE_BANK",data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("INQ_CUSTOMER_NAME",data.get("INQ_CUSTOMER_NAME"));
                paramDetail.put("INQ_ACCOUNT_NUMBER",data.get("INQ_ACCOUNT_NUMBER"));
                paramDetail.put("INQ_ACCOUNT_STATUS",data.get("INQ_ACCOUNT_STATUS"));
                paramDetail.put("KODE_BANK_PENERIMA",data.get("KODE_BANK_PENERIMA"));
                paramDetail.put("RETRIEVAL_REF_NUMBER",data.get("RETRIEVAL_REF_NUMBER"));
                paramDetail.put("CUSTOMER_REF_NUMBER",data.get("CUSTOMER_REF_NUMBER"));
                paramDetail.put("CONFIRMATION_CODE",data.get("CONFIRMATION_CODE"));
                paramDetail.put("TGL_ACT_BAYAR",data.get("TGL_ACT_BAYAR"));
                paramDetail.put("OSS_ID",data.get("OSS_ID"));
                paramDetail.put("GROUP_ID",data.get("GROUP_ID"));
                paramDetail.put("SUMBER_DANA",data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BAYAR",data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("BANK_BYR",data.get("BANK_BYR"));
                paramDetail.put("CURR_BAYAR",data.get("CURR_BAYAR"));
                paramDetail.put("PARTIAL_IND",data.get("PARTIAL_IND"));
                paramDetail.put("AMOUNT_BAYAR",data.get("AMOUNT_BAYAR"));
                paramDetail.put("BANK_BENEF",data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF",data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF",data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY",data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON",data.get("VERIFIED_ON"));
                paramDetail.put("SPREAD_VALUE",data.get("SPREAD_VAL"));
                paramDetail.put("APPROVE_TGL_RENCANA_BAYAR",data.get("APPROVE_TGL_RENCANA_BAYAR"));
                paramDetail.put("STATUS_TRACKING",data.get("STATUS_TRACKING"));
                paramDetail.put("STATUS",data.get("STATUS"));
                paramDetail.put("POSISI", data.get("POSISI"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("JENIS_TRANSAKSI", data.get("JENIS"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/template_verifikasi_tanggal.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @PostMapping(path = "/verifikasi_tanggal_multiple")
    public Map<String, Object> verifikasiTanggalMultiple(
            @RequestParam("pData") String pData
    ) throws JSONException, SQLException {
        Map<String, Object> out = new HashMap<>();

        JSONArray jsonArray = new JSONArray(pData);

        for(int index = 0; index < jsonArray.length(); index++){
            JSONObject object = jsonArray.getJSONObject(index);
            String comp_code = object.getString("pCompCode");
            String doc_no = object.getString("pDocNo");
            String fiscal_year = object.getString("pFiscYear");
            String line_item = object.getString("pLineItem");
            String ket = object.getString("pKet");
            String oss_id = object.getString("oss_id");
            String group_id = object.getString("group_id");
            out = corpayService.verifikasiTgl(comp_code, doc_no, fiscal_year, line_item, ket, WebUtils.getUsernameLogin(), oss_id, group_id);
        }
        return out;
    }

    @RequestMapping(value = "/laporan_komposisi_saldo", method = RequestMethod.GET)
    public Map getDashboardPengelolaan() {
        try {
            return corpayService.getDashboardPengelolaan();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/rincian_saldo")
    public Map listDashboardPengelolaan2(
            @RequestParam(value = "bank", defaultValue = "ALL") String bank,
            @RequestParam(value = "jenisRekening", defaultValue = "ALL") String jenisRekening,
            @RequestParam(value = "tipeRekening", defaultValue = "ALL") String tipeRekening
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getDashboardPengelolaan2( bank, jenisRekening, tipeRekening);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(value = "/penjualan_tenaga_listrik", method = RequestMethod.GET)
    public Map<String, Object> getPenjualanTenagaListrik(
            @RequestParam(value = "p_tgl_awal", defaultValue = "") String p_tgl_awal,
            @RequestParam(value = "p_tgl_akhir", defaultValue = "") String p_tgl_akhir,
            @RequestParam(value = "p_unit", defaultValue = "ALL") String p_unit,
            @RequestParam(value = "p_range", defaultValue = "ALL") String p_range
    ){
        try {
            return corpayService.getPenjualanTenagaListrik(p_tgl_awal, p_tgl_akhir, p_unit, p_range);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/penjualan_tenaga_listrik_bank", method = RequestMethod.GET)
    public Map<String, Object> getPenjualanTenagaListrikBank(
            @RequestParam(value = "p_tgl_awal", defaultValue = "") String p_tgl_awal,
            @RequestParam(value = "p_tgl_akhir", defaultValue = "") String p_tgl_akhir,
            @RequestParam(value = "p_bank", defaultValue = "ALL") String p_bank
    ){
        try {
            return corpayService.getPenjualanTenagaListrikBank(p_tgl_awal, p_tgl_akhir, p_bank);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/penjualan_tenaga_listrik_dist", method = RequestMethod.GET)
    public Map<String, Object> getPenjualanTenagaListrikDist(
            @RequestParam(value = "p_tgl_awal", defaultValue = "") String p_tgl_awal,
            @RequestParam(value = "p_tgl_akhir", defaultValue = "") String p_tgl_akhir,
            @RequestParam(value = "p_unit", defaultValue = "ALL") String p_unit
    ){
        try {
            return corpayService.getPenjualanTenagaListrikDist(p_tgl_awal, p_tgl_akhir, p_unit);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/eq_curr")
    public Map eqCurr(
            @RequestParam(value = "bank", defaultValue = "ALL") String bank,
            @RequestParam(value = "jenisRekening", defaultValue = "ALL") String jenisRekening,
            @RequestParam(value = "tipeRekening", defaultValue = "ALL") String tipeRekening
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getEqCurr( bank, jenisRekening, tipeRekening);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(value = "/get_bank", method = RequestMethod.GET)
    public List<Map<String,Object>> getBank() {
        try {
            return corpayService.getBank();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_jenis_rekening", method = RequestMethod.GET)
    public List<Map<String,Object>> getJenisRekening() {
        try {
            return corpayService.getJenisRekening();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @RequestMapping(value = "/get_tipe_rekening", method = RequestMethod.GET)
    public List<Map<String,Object>> getTipeRekening() {
        try {
            return corpayService.getTipeRekening();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @GetMapping(path = "/detail_rekap_placement_lcl")
    public Map getDPlacementLCL(
            @RequestParam(value = "p_tgl_awal") String p_tgl_awal,
            @RequestParam(value = "p_sesi") String p_sesi,
            @RequestParam(value = "p_tipe") String p_tipe
            ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getDPlacementLCL(p_tgl_awal, p_sesi, p_tipe);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(value = "/doc_rekap_placement_lcl", method = RequestMethod.GET)
    public Map<String, Object> getDocPlacementLCL(
            @RequestParam(value = "p_tgl_awal", defaultValue = "") String p_tgl_awal,
            @RequestParam(value = "p_sesi", defaultValue = "ALL") String p_sesi
    ){
        try {
            return corpayService.getDocPlacementLCL(p_tgl_awal, p_sesi);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
//
//    @RequestMapping(value = "/get_pemindahan_buku", method = RequestMethod.GET)
//    public Map<String, Object> getPemindahBukuan(
//            @RequestParam(value = "p_tgl_awal", defaultValue = "") String tanggal,
//            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
//    ){
//        try {
//            return corpayService.getPemindahBukuan(tanggal, sesi);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

    @GetMapping(path = "/get_pemindahan_buku")
    public Map getPemindahBukuan(
            @RequestParam(value = "p_tanggal", defaultValue = "") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getPemindahBukuan(tanggal, sesi);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(value = "/get_settlement_valas", method = RequestMethod.GET)
    public Map<String, Object> getSettlementValas(
            @RequestParam(value = "p_tgl_awal", defaultValue = "") String p_tgl_awal,
            @RequestParam(value = "p_sesi", defaultValue = "ALL") String p_sesi
    ){
        try {
            return corpayService.getSettlementValas(p_tgl_awal, p_sesi);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_pemindahan_buku_fcl", method = RequestMethod.GET)
    public Map<String, Object> getPemindahBukuanFCL(
            @RequestParam(value = "p_tgl_awal", defaultValue = "") String p_tgl_awal,
            @RequestParam(value = "p_sesi", defaultValue = "ALL") String p_sesi
    ){
        try {
            return corpayService.getPemindahBukuanFCL(p_tgl_awal, p_sesi);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/placement_lcl")
    public Map listRekapPlacementLCL(
            @RequestParam(value = "p_tanggal", defaultValue = "ALL") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "ALL") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getRekapPlacementLCL( tanggal, sesi);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/kebutuhan_placement_lcl")
    public Map listKebutuhanPlacementLCL(
            @RequestParam(value = "p_tanggal", defaultValue = "") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getKebutuhanPlacementLCL(tanggal, sesi, WebUtils.getUsernameLogin());
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/detail_placement_imprest")
    public Map listDetailPlacementImprest(
            @RequestParam(value = "p_jenis", defaultValue = "ALL") String jenis
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getDetailPlacementImprest(jenis);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }


    @PostMapping(path = "/ins_rekap_placement_imprest")
    public Map<String, Object> listInsPlacementImprest(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementImprest(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_impor")
    public Map<String, Object> listInsPlacementImpor(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementImpor(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_imprest_operasi")
    public Map<String, Object> listInsPlacementImprestOperasi(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementImprestOperasi(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_imprest_invest")
    public Map<String, Object> listInsPlacementImprestInvest(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementImprestInvest(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_Settelment")
    public Map<String, Object> listInsPlacementSettlement(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementSettlement(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_proyeksi_valas")
    public Map<String, Object> listInsPlacementProyeksiValas(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementProyeksiValas(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_receipt")
    public Map<String, Object> listInsPlacementReceipt(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            String mega = jsonObject.getString("data5");
            String dki = jsonObject.getString("data6");
            String bca = jsonObject.getString("data7");
            String bii = jsonObject.getString("data8");
            String bris = jsonObject.getString("data9");
            String btn = jsonObject.getString("data10");
            String danamon = jsonObject.getString("data11");
            String ocbc = jsonObject.getString("data12");
            String uob = jsonObject.getString("data13");
            String dbs = jsonObject.getString("data14");
            String cimb = jsonObject.getString("data15");
            out = corpayService.getInsPlacementReceipt(bank, mandiri, bri, bni, bukopin, mega, dki, bca, bii, bris, btn, danamon, ocbc, uob, dbs, cimb);
        }
        return out;
    }

    @PostMapping(path = "/ins_rekap_placement_giro_special")
    public Map<String, Object> listInsPlacementGiroSpcial(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            String mega = jsonObject.getString("data5");
            String dki = jsonObject.getString("data6");
            String bca = jsonObject.getString("data7");
            String bii = jsonObject.getString("data8");
            String bris = jsonObject.getString("data9");
            String btn = jsonObject.getString("data10");
            String danamon = jsonObject.getString("data11");
            String ocbc = jsonObject.getString("data12");
            String uob = jsonObject.getString("data13");
            String dbs = jsonObject.getString("data14");
            String cimb = jsonObject.getString("data15");
            out = corpayService.getInsPlacementGiroSpcial(bank, mandiri, bri, bni, bukopin, mega, dki, bca, bii, bris, btn, danamon, ocbc, uob, dbs, cimb);
        }
        return out;
    }

    @RequestMapping(value = "/verifikasi_placement_lcl", method = RequestMethod.POST)
    public Map<String, Object> updateStatus(
            @RequestParam(value = "p_status", defaultValue = "") String status,
            @RequestParam(value = "p_tanggal", defaultValue = "") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
    ){
        AppUtils.getLogger(this).info("p_status : {}", status);

        try {
            Map<String, Object> resutl = corpayService.getVerifikasiPlacement(WebUtils.getUsernameLogin(), status , tanggal, sesi);

            return resutl;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/reverse_placement_lcl")
    public Map<String, Object> reversePlacementLCL(
            @RequestParam(value = "p_status", defaultValue = "") String status,
            @RequestParam(value = "p_tanggal", defaultValue = "") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
    ){
        Map<String, Object> reverse = new HashMap<>();
        try {
            reverse = corpayService.reversePlacementLCL(WebUtils.getUsernameLogin(), status , tanggal, sesi);
        } catch (Exception e){
            e.printStackTrace();
        }
        return reverse;
    }

    @GetMapping(path = "/placement_fcl")
    public Map listRekapPlacementFCL(
            @RequestParam(value = "p_tanggal", defaultValue = "ALL") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "ALL") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getRekapPlacementFCL(tanggal, sesi);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/kebutuhan_placement_fcl")
    public Map listKebutuhanPlacementFCL(
            @RequestParam(value = "p_tanggal", defaultValue = "ALL") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "ALL") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getKebutuhanPlacementFCL( tanggal, sesi, WebUtils.getUsernameLogin());
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/detail_placement_fcl")
    public Map listDetailPlacementFCL(
            @RequestParam(value = "p_jenis", defaultValue = "ALL") String jenis
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getDetailPlacementFCL(jenis);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @PostMapping(path = "/ins_jpy")
    public Map<String, Object> listInsPlacementJPY(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementJPY(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_eur")
    public Map<String, Object> listInsPlacementEUR(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementEUR(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @PostMapping(path = "/ins_usd")
    public Map<String, Object> listInsPlacementUSD(@RequestParam(value = "pData") String pData) throws JSONException, SQLException {
        JSONArray jsonArray = new JSONArray(pData);
        Map<String, Object> out = new HashMap<>();

        for (int index = 0; index < jsonArray.length(); index++){
            JSONObject jsonObject = jsonArray.getJSONObject(index);
            String bank = jsonObject.getString("data0");
            String mandiri = jsonObject.getString("data1");
            String bri = jsonObject.getString("data2");
            String bni = jsonObject.getString("data3");
            String bukopin = jsonObject.getString("data4");
            out = corpayService.getInsPlacementUSD(bank, mandiri, bri, bni, bukopin);
        }
        return out;
    }

    @GetMapping(path = "/operasi_pendanaan_valas")
    public Map listOperasiPendanaanValas(
            @RequestParam(value = "p_tanggal", defaultValue = "") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getOperasiPendanaanValas(tanggal, sesi, WebUtils.getUsernameLogin());
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/operasi_pendanaan_idr")
    public Map listOperasiPendanaanIdr(
            @RequestParam(value = "p_tanggal", defaultValue = "") String tanggal,
            @RequestParam(value = "p_sesi", defaultValue = "") String sesi
    ){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = corpayService.getOperasiPendanaanIdr(tanggal, sesi, WebUtils.getUsernameLogin());
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @RequestMapping(value = "/delete_data", method = RequestMethod.POST)
    public Map<String, Object> deletePlacementlclHeader(
            @RequestParam(value = "p_id_form", defaultValue = "") String idForm
    ){
        try {
            Map<String, Object> result = (Map<String, Object>) corpayService.delPlacementlclHeader(idForm);

            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/create_palcement_lcl_header", method = RequestMethod.POST)
    public Map<String, Object> createPlacementLclHeader(
            @RequestParam(value = "p_id_form", defaultValue = "") String idForm,
            @RequestParam(value = "p_tgl_jatuh_tempo", defaultValue = "") String tglJatuhTempo
    ){
        try {
            Map<String, Object> result = (Map<String, Object>) corpayService.createPlacementlclHeader(idForm, tglJatuhTempo, WebUtils.getUsernameLogin());

            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/verifikasi_placement_lcl_header", method = RequestMethod.POST)
    public Map<String, Object> updateStatus(
            @RequestParam(value = "p_id_form", defaultValue = "") String idForm,
            @RequestParam(value = "p_status", defaultValue = "") String status
    ){
        AppUtils.getLogger(this).info("p_status : {}", status);

        try {
            Map<String, Object> result = corpayService.updatePlacementlclHeader(WebUtils.getUsernameLogin(), idForm, status);

            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/create_restitusi", method = RequestMethod.POST)
    public Map<String, Object> createGroup(
            @RequestParam(value = "pData", defaultValue = "") String pData
            ) throws JSONException {
        ZonedDateTime dt = ZonedDateTime.now();
        String dateFormated = DateTimeFormatter.ofPattern("ddmmyyyy").format(dt);
        String filename = "uploadcorpay/temp/laporan_kas_pegawai_"+dateFormated;
        DocGenerator dg = new DocGenerator();
        Map<String, Object> out = null;
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> getArray = new ArrayList<>();
        JSONArray jsonArray = new JSONArray(pData);
        try{
            for (int j = 0; j < jsonArray.length(); j++) {
                JSONObject json = jsonArray.getJSONObject(j);
                out = corpayService.insRestitusiTemp(json.getString("group_id"));
                res.put(String.valueOf(j),out);
            }
            List<Map<String, String>> tableList = new ArrayList<>();
            if (res.size() == jsonArray.length()){
                getArray = corpayService.getCetakBuktiKasRestitusi();
                int no = 0;
                if (!getArray.isEmpty()){
                    for (Map<String, Object> p : getArray){
                        Map<String, String> row = new HashMap<>();
                        row.put("NO_URUT",String.valueOf(no+=1));
                        row.put("NAMA_VENDOR", p.get("NAMA_VENDOR").toString());
                        row.put("DOC_NO", p.get("DOCUMENT_NUMBER").toString());
                        row.put("CURR_BAYAR", p.get("CURR_BAYAR").toString());
                        row.put("AMOUNT_BAYAR", p.get("AMOUNT_BAYAR").toString());
                        row.put("ITEM_TEXT", p.get("ITEM_TEXT").toString());
                        row.put("ACCOUNT_NAME", p.get("ACCOUNT_NAME").toString());
                        row.put("ALAMAT_VENDOR", p.get("ALAMAT_VENDOR").toString());
                        row.put("BANK_BENEF", p.get("BANK_BENEF").toString());
                        row.put("NO_REK_BENEF", p.get("NO_REK_BENEF").toString());
                        row.put("ID_GROUP", p.get("ID_GROUP").toString());
                        row.put("ALAMAT_BANK_BENEF", p.get("ALAMAT_BANK_BENEF").toString());
                        row.put("EMAIL_VENDOR", p.get("EMAIL_VENDOR").toString());
                        tableList.add(row);
                    }
                }
                dg.addTableVariables(tableList);
                try {
                    dg.createDocFromTemplate("template_laporan_restitusi_giro", filename);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            AppUtils.getLogger(this).debug("statusInvoice : {} ", out);
            return out;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
