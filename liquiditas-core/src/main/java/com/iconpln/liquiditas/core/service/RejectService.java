package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Mr.Diaz on 8/1/17.
 */
@Repository
public class RejectService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlsqlUtils plsqlUtils;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public List<Map<String, Object>> getListPembayaranBelum(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pCaraBayar : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_reject_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_cara_bayar", pCaraBayar, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", status, Types.VARCHAR)
                .addValue("p_status_tracking", statusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDataInvoiceBy(String pCompCode, String pDocNo, String pFiscYear, String pLineItem) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_get_data_by");

        Map<String, Object> params = new HashMap<>();
        params.put("p_comp_code", pCompCode);
        params.put("p_doc_no", pDocNo);
        params.put("p_fisc_year", pFiscYear);
        params.put("p_line_item", pLineItem);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_data_invoice_by : {}", resultset);
        return resultset;
    }

//    public List<Map<String, Object>> getDataInvoiceBy(String pCompCode, String pDocNo, String pFiscYear, String pLineItem) throws SQLException {
//
//        AppUtils.getLogger(this).debug("data rekap search info = " +
//                        "pCompCode : {}, " +
//                        "pDocNo : {}, " +
//                        "pFiscYear : {}, " +
//                        "pLineItem : {}, ",
//
//                pCompCode, pDocNo, pFiscYear, pLineItem);
//
//        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
//                .withCatalogName("PKG_CORPAY")
//                .withFunctionName("invoice_get_data_by");
//
//        SqlParameterSource params = new MapSqlParameterSource()
//                .addValue("p_comp_code", pCompCode, Types.VARCHAR)
//                .addValue("p_doc_no", pDocNo, Types.VARCHAR)
//                .addValue("p_fisc_year", pFiscYear, Types.VARCHAR)
//                .addValue("p_line_item", pLineItem, Types.VARCHAR);
//
//        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
//
//        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
//        return resultset;
//    }


    public List<Map<String, Object>> getColumn(String userId) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_get_column");
        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", userId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_derivatif_ccs_pss : {}", resultset);
        return resultset;
    }

    /**
     * Rekap pembayaran
     */
    public String saveColumn(
            String userId,
            int nomor,
            int compCode,
            int docNo,
            int fiscYear,
            int docType,
            int docDate,
            int postDate,
            int entryDate,
            int reference,
            int revWith,
            int revYear,
            int docHdrTxt,
            int currency,
            int exchRate,
            int referenceKey,
            int pmtInd,
            int transType,
            int spreadVal,
            int lineItem,
            int oiInd,
            int acctType,
            int specGl,
            int busArea,
            int tpba,
            int amtLc,
            int amtTc,
            int amtWithBaseTc,
            int amtWithTc,
            int assignment,
            int itemText,
            int costCtr,
            int glAcct,
            int customer,
            int vendor,
            int baseDate,
            int termPmt,
            int dueOn,
            int pmtBlock,
            int houseBank,
            int prtnrBankType,
            int poNum,
            int poItem,
            int refKey1,
            int refKey2,
            int refKey3,
            int intOrder,
            int wbsNum,
            int cashCode,
            int corpPmt) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_nomor", nomor, OracleTypes.NUMBER)
                .addValue("p_comp_code", compCode, OracleTypes.NUMBER)
                .addValue("p_doc_no", docNo, OracleTypes.NUMBER)
                .addValue("p_fisc_year", fiscYear, OracleTypes.NUMBER)
                .addValue("p_doc_type", docType, OracleTypes.NUMBER)
                .addValue("p_doc_date", docDate, OracleTypes.NUMBER)
                .addValue("p_post_date", postDate, OracleTypes.NUMBER)

                .addValue("p_entry_date", entryDate, OracleTypes.NUMBER)
                .addValue("p_reference", reference, OracleTypes.NUMBER)
                .addValue("p_rev_with", revWith, OracleTypes.NUMBER)
                .addValue("p_rev_year", revYear, OracleTypes.NUMBER)
                .addValue("p_doc_hdr_txt", docHdrTxt, OracleTypes.NUMBER)

                .addValue("p_currency", currency, OracleTypes.NUMBER)
                .addValue("p_exch_rate", exchRate, OracleTypes.NUMBER)
                .addValue("p_reference_key", referenceKey, OracleTypes.NUMBER)
                .addValue("p_pmt_ind", pmtInd, OracleTypes.NUMBER)
                .addValue("p_trans_type", transType, OracleTypes.NUMBER)

                .addValue("p_spread_val", spreadVal, OracleTypes.NUMBER)
                .addValue("p_line_item", lineItem, OracleTypes.NUMBER)
                .addValue("p_oi_ind", oiInd, OracleTypes.NUMBER)
                .addValue("p_acct_type", acctType, OracleTypes.NUMBER)
                .addValue("p_spec_gl", specGl, OracleTypes.NUMBER)
                .addValue("p_bus_area", busArea, OracleTypes.NUMBER)
                .addValue("p_tpba", tpba, OracleTypes.NUMBER)
                .addValue("p_amt_lc", amtLc, OracleTypes.NUMBER)
                .addValue("p_amt_tc", amtTc, OracleTypes.NUMBER)
                .addValue("p_amt_with_base_tc", amtWithBaseTc, OracleTypes.NUMBER)
                .addValue("p_amt_with_tc", amtWithTc, OracleTypes.NUMBER)
                .addValue("p_assignment", assignment, OracleTypes.NUMBER)
                .addValue("p_item_text", itemText, OracleTypes.NUMBER)
                .addValue("p_cost_ctr", costCtr, OracleTypes.NUMBER)
                .addValue("p_gl_acct", glAcct, OracleTypes.NUMBER)
                .addValue("p_customer", customer, OracleTypes.NUMBER)
                .addValue("p_vendor", vendor, OracleTypes.NUMBER)
                .addValue("p_base_date", baseDate, OracleTypes.NUMBER)
                .addValue("p_term_pmt", termPmt, OracleTypes.NUMBER)
                .addValue("p_due_on", dueOn, OracleTypes.NUMBER)
                .addValue("p_pmt_block", pmtBlock, OracleTypes.NUMBER)
                .addValue("p_house_bank", houseBank, OracleTypes.NUMBER)
                .addValue("p_prtnr_bank_type", prtnrBankType, OracleTypes.NUMBER)
                .addValue("p_po_num", poNum, OracleTypes.NUMBER)
                .addValue("p_po_item", poItem, OracleTypes.NUMBER)
                .addValue("p_ref_key1", refKey1, OracleTypes.NUMBER)
                .addValue("p_ref_key2", refKey2, OracleTypes.NUMBER)
                .addValue("p_ref_key3", refKey3, OracleTypes.NUMBER)
                .addValue("p_int_order", intOrder, OracleTypes.NUMBER)
                .addValue("p_wbs_num", wbsNum, OracleTypes.NUMBER)
                .addValue("p_cash_code", cashCode, OracleTypes.NUMBER)
                .addValue("p_corp_pmt", corpPmt, OracleTypes.NUMBER);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_save_column");
        return simpleJdbcCall.executeFunction(String.class, in);
    }

    public Map<String, Object> updatePembayaran(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet, String pBankPembayar, String pKeterangan, String pTglRencanaBayar,
            String pSumberDana, String pMetodePembayaran
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_edit");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_ket", pKet)
                .addValue("p_bank_pembayar", pBankPembayar)
                .addValue("p_keterangan", pKeterangan)
                .addValue("p_tgl_rencana_bayar", pTglRencanaBayar)
                .addValue("p_sumber_dana", pSumberDana)
                .addValue("p_metode_pembayaran", pMetodePembayaran)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data edit pembayaran : {}", out);
        return out;
    }

    public Map<String, Object> updateStatus(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet, String pStatusTracking
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_upd_status");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_ket", pKet)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data update status : {}", out);
        return out;
    }

    public Map<String, Object> reverseReject(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_reverse_reject");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_ket", pKet);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data reverse reject : {}", out);
        return out;
    }

    public List<Map<String,Object>> getBankPembayar() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_bank_pembayar");

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);

        AppUtils.getLogger(this).info("data get_bank_pembayar : {}",resultset);

        return resultset;
    }

    public List<Map<String,Object>> getMetodeBayar() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_metode_bayar");

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);

        AppUtils.getLogger(this).info("data get_metode_bayar : {}",resultset);

        return resultset;
    }

    public List<Map<String,Object>> getBankAccount(String pBankPembayar) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_bank_account");

        Map<String, Object> params = new HashMap<>();
        params.put("p_bank_pembayar", pBankPembayar);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_bank_account : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getAccountName(String pBankAccount) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_account_name");

        Map<String, Object> params = new HashMap<>();
        params.put("p_bank_account", pBankAccount);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_account_name : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getSaldo(String pBankAccount) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_saldo");

        Map<String, Object> params = new HashMap<>();
        params.put("p_bank_account", pBankAccount);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_saldo : {}",resultset);
        return resultset;
    }

    public Map<String, Object> createGroup(String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet, String pNamaGroup, String pUserId) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("create_group");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_ket", pKet)
                .addValue("p_nama_group", pNamaGroup)
                .addValue("p_user_id", pUserId)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data create_group : {}", out);
        return out;
    }

    public String getPerfectJsonString(String jsonString){
        jsonString = jsonString.replaceAll("\\[", "");
        jsonString = jsonString.replaceAll("\\]", "");
        jsonString = jsonString.replaceAll("},", "};");
        return jsonString;
    }


}
