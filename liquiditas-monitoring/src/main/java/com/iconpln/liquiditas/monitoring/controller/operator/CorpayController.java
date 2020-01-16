package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.CorpayService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.*;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

/**
 * Created by israj on 10/4/2016.
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
                          @RequestParam("comp_code") Integer compCode,
                          @RequestParam("doc_no") Integer docNo,
                          @RequestParam("fisc_year") Integer fiscYear,
                          @RequestParam("doc_type") Integer docType,
                          @RequestParam("doc_date") Integer docDate,
                          @RequestParam("post_date") Integer postDate,
                          @RequestParam("entry_date") Integer entryDate,
                          @RequestParam("reference") Integer reference,
                          @RequestParam("rev_with") Integer revWith,
//                          @RequestParam("unit") Integer unit,
                          @RequestParam("rev_year") Integer revYear,
                          @RequestParam("doc_hdr_txt") Integer docHdrTxt,
                          @RequestParam("currency") Integer currency,
                          @RequestParam("exch_rate") Integer exchRate,
                          @RequestParam("reference_key") Integer referenceKey,
                          @RequestParam("pmt_ind") Integer pmtInd,
                          @RequestParam("trans_type") Integer transType,
                          @RequestParam("spread_val") Integer spreadVal,
                          @RequestParam("line_item") Integer lineItem,
                          @RequestParam("oi_ind") Integer oiInd,
                          @RequestParam("acct_type") Integer acctType,
                          @RequestParam("spec_gl") Integer specGl,
                          @RequestParam("bus_area") Integer busArea,
                          @RequestParam("tpba") Integer tpba,
                          @RequestParam("amt_lc") Integer amtLc,
                          @RequestParam("amt_tc") Integer amtTc,
                          @RequestParam("amt_with_base_tc") Integer amtWithBaseTc,
                          @RequestParam("amt_with_tc") Integer amtWithTc,
                          @RequestParam("assignment") Integer assignment,
                          @RequestParam("item_text") Integer itemText,
                          @RequestParam("cost_ctr") Integer costCtr,
                          @RequestParam("gl_acct") Integer glAcct,
                          @RequestParam("customer") Integer customer,
                          @RequestParam("vendor") Integer vendor,
                          @RequestParam("base_date") Integer baseDate,
                          @RequestParam("term_pmt") Integer termPmt,
                          @RequestParam("due_on") Integer dueOn,
                          @RequestParam("pmt_block") Integer pmtBlock,
                          @RequestParam("house_bank") Integer houseBank,
                          @RequestParam("prtnr_bank_type") Integer prtnrBankType,
                          @RequestParam("po_num") Integer poNum,
                          @RequestParam("po_item") Integer poItem,
                          @RequestParam("ref_key1") Integer refKey1,
                          @RequestParam("ref_key2") Integer refKey2,
                          @RequestParam("ref_key3") Integer refKey3,
                          @RequestParam("int_order") Integer intOrder,
                          @RequestParam("wbs_num") Integer wbsNum,
                          @RequestParam("cash_code") Integer cashCode,
                          @RequestParam("corp_pmt") Integer corpPmt
    ) {
        Map data = new HashMap();
        try {
            String result = corpayService.saveColumn(WebUtils.getUsernameLogin(),
                    nomor,
                    compCode,
                    docNo,
                    fiscYear,
                    docType,
                    docDate,
                    postDate,
                    entryDate,
                    reference,
                    revWith,
                    revYear,
                    docHdrTxt,
                    currency,
                    exchRate,
                    referenceKey,
                    pmtInd,
                    transType,
                    spreadVal,
                    lineItem,
                    oiInd,
                    acctType,
                    specGl,
                    busArea,
                    tpba,
                    amtLc,
                    amtTc,
                    amtWithBaseTc,
                    amtWithTc,
                    assignment,
                    itemText,
                    costCtr,
                    glAcct,
                    customer,
                    vendor,
                    baseDate,
                    termPmt,
                    dueOn,
                    pmtBlock,
                    houseBank,
                    prtnrBankType,
                    poNum,
                    poItem,
                    refKey1,
                    refKey2,
                    refKey3,
                    intOrder,
                    wbsNum,
                    cashCode,
                    corpPmt
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
            @RequestParam(value = "pTglActBayar", defaultValue = "") String pTglActBayar
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
                    pCustomerRefNumber, pConfirmationCode, pTglActBayar);
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
            @RequestParam(value = "pStatus", defaultValue = "Sukses") String pStatus
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
            Map<String, Object> res = corpayService.updateLunas(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, WebUtils.getUsernameLogin(), pStatus);
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
            @RequestParam(value = "pJenisTransaksi", defaultValue = "") String pJenisTransaksi
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
            Map<String, Object> res = corpayService.updateLunasGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pJenisTransaksi, WebUtils.getUsernameLogin());

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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
            @RequestParam(value = "pAccountNumber", defaultValue = "") String pAccountNumber
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
                    pCustomerName,pAccountNumber);
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
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking
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
            Map<String, Object> res = corpayService.updateStatusGiro(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking
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
            @RequestParam(value = "pStatusTracking", defaultValue = "") String pStatusTracking
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
            Map<String, Object> res = corpayService.reverseStatus(pCompCode, pDocNo, pFiscYear, pLineItem, pKet, pStatusTracking);
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
            @RequestParam(value = "pKet", defaultValue = "") String pKet
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
            Map<String, Object> res = corpayService.reverseSap(pCompCode, pDocNo, pFiscYear, pLineItem, pKet);

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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
//    ) {
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
//                        if (((BigDecimal) out.get("return")).equals(BigDecimal.ONE)) {
//
//                        }
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

    @RequestMapping(value = "/create_group", method = RequestMethod.POST)
    public Map<String, Object> createGroup(
            @RequestParam(value = "pData", defaultValue = "") String pData,
            @RequestParam(value = "pNamaGroup", defaultValue = "") String pNamaGroup
    ) throws SQLException, JSONException {

        Map<String, Object> out = null;
        //pNamaGroup = (pNamaGroup.toString().equals("null") ? "" : pNamaGroup);
        System.out.println("Fikri2 : "+pData);
        String jsonString = corpayService.getPerfectJsonString(pData);
        JSONArray jsonArray = new JSONArray(pData);
        System.out.println("JSON Array : "+jsonArray);
        String[] listData = jsonString.split(";");
        System.out.println("Jancok : "+listData.length);
        int i=0;

        try{
            for (int j = 0; j < jsonArray.length(); j++) {
                JSONObject json = jsonArray.getJSONObject(i);
                json.getString("COMP_CODE");
                System.out.println("Loop : "+i++);
                System.out.println("DIAZZZZZ:"+json.getString("COMP_CODE"));
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
                    pAmount,pRemark,pBenefEmail,pBenefName,pBenefAddr1,pBenefAddr2,pDestinationBank,pFeeType,
                    pCurrency2,pRetrievalReff,pDestinationBankCode, pConfirmationCode);
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

}
