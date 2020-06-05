package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.CorpayService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;

import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
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
            data.put("data", corpayService.getColumn(WebUtils.getUsernameLogin()));
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
                          @RequestParam("no_giro") Integer no_giro
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
                    no_giro
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
            @RequestParam(value = "pNoGiro",defaultValue = "") String pNoGiro
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
                    pCustomerRefNumber, pConfirmationCode, pTglActBayar, pJamBayar, WebUtils.getUsernameLogin(), pOssId, pGroupId, pNoGiro);
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
            @RequestParam(value = "pGroupId", defaultValue = "Sukses") String pGroupId
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
            Map<String, Object> res = corpayService.updateLunas(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, WebUtils.getUsernameLogin(), pStatus, pOssId, pGroupId);
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
                        "",pNamaGroup,json.getString("NO_REK_HOUSE_BANK"), json.getString("INQ_CUSTOMER_NAME"), json.getString("INQ_ACCOUNT_NUMBER"),
                        json.getString("REF_KEY3"),json.getString("INT_ORDER"),json.getString("WBS_NUM"), json.getString("CASH_CODE"), json.getString("CONFIRMATION_CODE"),
                        json.getString("TGL_ACT_BAYAR")
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

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pCurr}/{pCaraBayar}/{pBank}/{pStatus}/{pStatusTracking}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
            @PathVariable String pCaraBayar,
            @PathVariable String pBank,
            @PathVariable String pStatus,
            @PathVariable String pStatusTracking,
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

            String title = "REKAP INVOICE";
            String namaFile = "rekap_invoice_belum.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = corpayService.getAllpembayaran(WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pCurr, pCaraBayar, pBank, pStatus, pStatusTracking);

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("KET",data.get("KET"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE",data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE",data.get("DOC_DATE"));
                paramDetail.put("DOC_DATE2",data.get("DOC_DATE2"));
                paramDetail.put("POST_DATE",data.get("POST_DATE"));
                paramDetail.put("POST_DATE2",data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE",data.get("ENTRY_DATE"));
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
                paramDetail.put("AMT_TC",data.get("AMT_TC"));
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
                paramDetail.put("BASE_DATE",data.get("BASE_DATE"));
                paramDetail.put("TERM_PMT",data.get("TERM_PMT"));
                paramDetail.put("DUE_ON",data.get("DUE_ON"));
                paramDetail.put("PMT_BLOCK",data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK",data.get("HOUSE_BANK"));
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
                paramDetail.put("AMT_WITH_BASE_LC",data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC",data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND",data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT",data.get("CORP_PMT"));
                paramDetail.put("TGL_VERIFIKASI_MAKER",data.get("TGL_VERIFIKASI_MAKER"));
                paramDetail.put("TGL_VERIFIKASI_CHECKER",data.get("TGL_VERIFIKASI_CHECKER"));
                paramDetail.put("TGL_VERIFIKASI_APPROVER",data.get("TGL_VERIFIKASI_APPROVER"));
                paramDetail.put("METODE_PEMBAYARAN",data.get("METODE_PEMBAYARAN"));
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
                paramDetail.put("APPROVE_TGL_RENCANA_BAYAR",data.get("APPROVE_TGL_RENCANA_BAYAR"));
                paramDetail.put("STATUS_TRACKING",data.get("STATUS_TRACKING"));
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

}
