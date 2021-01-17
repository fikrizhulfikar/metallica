package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.SQLException;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Mr.Diaz on 8/1/17.
 */
@Repository
public class RealisasiInvoiceService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlsqlUtils plsqlUtils;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public List<Map<String, Object>> getListPembayaranLunas(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch) throws SQLException {

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
                .withFunctionName("realisasi_invoice_get");

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

        AppUtils.getLogger(this).info("data realisasi_invoice_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getListRekapPembayaranLunas(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch) throws SQLException {

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
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("realisasi_rekap_get");

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

        AppUtils.getLogger(this).info("data realisasi_rekap_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getListRekapCurrencyLunas(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch) throws SQLException {

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
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("currency_rekap_get");

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

        AppUtils.getLogger(this).info("data currency_rekap_get : {}", resultset);
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
            String pSumberDana, String pMetodePembayaran, String pNoRekHouseBank,String pInqCustomerName, String pInqAccountNumber, String pInqAccountStatus
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
                .addValue("p_no_rek_house_bank", pNoRekHouseBank)
                .addValue("p_inq_customer_name", pInqCustomerName)
                .addValue("p_inq_account_number", pInqAccountNumber)
                .addValue("p_inq_account_status", pInqAccountStatus)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data edit pembayaran : {}", out);
        return out;
    }

    public Map<String, Object> updateLunas(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pJenisTransaksi,
            String pUserId, String pStatus
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_upd_lunas");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_jenis_transaksi", pJenisTransaksi)
                .addValue("p_user_id", pUserId)
                .addValue("p_status", pStatus)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("update data lunas : {}", out);
        return out;
    }

    public Map<String, Object> updateStatus(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet, String pStatusTracking,
            String pCustomerName, String pAccountNumber
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
                .addValue("p_customer_name", pCustomerName)
                    .addValue("p_account_number", pAccountNumber)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data update status : {}", out);
        return out;
    }

    public Map<String, Object> reverseStatus(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet, String pStatusTracking
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_reverse_status");
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
        AppUtils.getLogger(this).info("data reverse status : {}", out);
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

    public Map<String, Object> insRejectLaporan(String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pKet
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_reject");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_ket", pKet)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data ins_rekap_data : {}", out);
        return out;
    }

    public String getBallance(String in_bank, String in_source, String in_beneficiary) {

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("in_bank", in_bank, Types.VARCHAR)
                .addValue("in_source", in_source, Types.VARCHAR)
                .addValue("in_beneficiary", in_beneficiary, Types.VARCHAR);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_INTEG_BANK_CORPAY")
                .withFunctionName("getBallance");

        return simpleJdbcCall.executeFunction(String.class, params);
    }

    //===FUNCTION BUAT GET BALLANCE===//
    public String get2(String pBank, String pSource, String pBeneficiary ) throws IOException {
        String signature = null;
        String token = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("sourceAccount",pSource);
        headerBody.put("beneficiaryAccount",pBeneficiary);
        JSONObject object = new JSONObject(headerBody);
        String body = object.toString();
        System.out.println(body);

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String timestamp = dateFormat.format(newdate.getTime());

        System.out.println(timestamp);
        signature =  createSignature("s3cr3tk3y", body, timestamp);
        token = getToken();
        return getBallance2(timestamp, signature, body, token);
    }

    public static String createSignature(String apikey, String body, String timestamp) {
        String hash = "";
        try {
            String key = apikey + timestamp;
            String signature = body;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            hash = Base64.encodeBase64String(sha256_HMAC.doFinal(signature.getBytes()));
            System.out.println("signature : " + hash);
        } catch (Exception e) {
            //log.warning(e.getMessage());
        }
        return hash;
    }

    public static String getToken(){
        String usernameColonPassword = "CORPAY:CORPAY@2019";
        String basicAuthPayload = "Basic " + Base64.encodeBase64String(usernameColonPassword.getBytes());
        String token = null;

        BufferedReader httpResponseReader = null;
        try {
            // Connect to the web server endpoint
            URL serverUrl = new URL("http://10.14.204.15:8181/gettoken");
            HttpURLConnection urlConnection = (HttpURLConnection) serverUrl.openConnection();

            // Set HTTP method as GET
            urlConnection.setRequestMethod("GET");

            // Include the HTTP Basic Authentication payload
            urlConnection.addRequestProperty("Authorization", basicAuthPayload);

            // Read response from web server, which will trigger HTTP Basic Authentication request to be sent.
            httpResponseReader =
                    new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String lineRead;
            String result = "";
            while((lineRead = httpResponseReader.readLine()) != null) {
//              System.out.println(lineRead);
                result = lineRead;
            }
            JSONObject data = new JSONObject(result);
            token = data.getJSONObject("data").getString("token");
            System.out.println(token);

        } catch (IOException | JSONException ioe) {
            ioe.printStackTrace();
        }
        return token;
    }

    public String getBallance2(String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = "";
        BufferedReader httpResponseReader = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doGetBalance");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);

        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            request.setEntity(new StringEntity(body));
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }

        return result ;
    }
//===BATAS AKHIR GET BALLANCE===//
public String payment(String pMetodeBayar, String pBank, String pRefNum, String pSource, String pBeneficiaryAccount,
                      String pCurrency, String pAmount, String pRemark, String pBenefEmail,
                      String pBenefName, String pBenefAddr1, String pBenefAddr2, String pDestinationBank,
                      String pFeeType, String pCurrency2, String pRetrievalReff, String pDestinationBankCode ) throws IOException {
        String res = null;
    Date date = new Date();
    SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
    String refnum = format.format(date.getTime())+"101";

       if (pMetodeBayar.equals("INHOUSE")){
           res = doPayment( pBank, refnum, pSource, pBeneficiaryAccount, pCurrency,
                    pAmount, pRemark, pFeeType);
       }
       if (pMetodeBayar.equals("RTGS")){
            res = doPaymentRtgs (pBank, refnum, pSource, pBeneficiaryAccount,
                    pCurrency, pAmount, pRemark, pBenefEmail,
                    pBenefName, pBenefAddr1, pBenefAddr2, pDestinationBank,
                    pFeeType);
       }
       if (pMetodeBayar.equals("KLIRING")) {
           res = doPaymentKliring(pBank, refnum, pSource, pBeneficiaryAccount, pCurrency,
                   pAmount, pRemark, pBenefEmail, pBenefName,
                   pBenefAddr1, pBenefAddr2, pDestinationBank, pFeeType);
       }
    if (pMetodeBayar.equals("ONLINETRANSFER")) {
        res = doInterbankPayment ( pBank,  refnum,  pAmount,  pBeneficiaryAccount,
                pBenefName,  pDestinationBankCode,  pDestinationBank,
                 pRetrievalReff,  pSource,  pCurrency,  pCurrency2,
                 pRemark);
    }
    return res;
}


    //===FUNCTION UNTUK PAYMENT===//
    public static String doInquery (String pBank, String pSource, String pBeneficiaryAccount) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("sourceAccount",pSource);
        headerBody.put("beneficiaryAccount",pBeneficiaryAccount);
        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);

        return inquery(timestamp,signature_str, body, token_str);
    }



    public static String doPayment (String pBank, String pRefNum, String pSource,String pBeneficiaryAccount,
                                    String pCurrency, String pAmount, String pRemark, String pFeeType) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("referenceNumber",pRefNum);
        headerBody.put("sourceAccount", pSource);
        headerBody.put("beneficiaryAccount", pBeneficiaryAccount);
        headerBody.put("currency", pCurrency);
        headerBody.put("amount", pAmount);
        headerBody.put("remark", pRemark);
        headerBody.put("feeType", pFeeType);
        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return inhousePayment(timestamp, signature_str, body, token_str);
    }

    public static String doPaymentRtgs (String pBank, String pRefNum, String pSource, String pBeneficiaryAccount,
                                        String pCurrency, String pAmount, String pRemark, String pBenefEmail,
                                        String pBenefName, String pBenefAddr1, String pBenefAddr2, String pDestinationBank,
                                        String pFeeType) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("referenceNumber",pRefNum);
        headerBody.put("sourceAccount",pSource);
        headerBody.put("beneficiaryAccount",pBeneficiaryAccount);
        headerBody.put("currency",pCurrency);
        headerBody.put("amount",pAmount);
        headerBody.put("remark",pRemark);
        headerBody.put("beneficiaryEmailAddress",pBenefEmail);
        headerBody.put("beneficiaryName",pBenefName);
        headerBody.put("beneficiaryAddress1",pBenefAddr1);
        headerBody.put("beneficiaryAddress2",pBenefAddr2);
        headerBody.put("destinationBankCode",pDestinationBank);
        headerBody.put("feeType",pFeeType);


        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return inhousePaymentRtgs(timestamp, signature_str, body, token_str);
    }

    public static String doPaymentKliring (String pBank, String pRefNum, String pSource, String pBeneficiaryAccount, String pCurrency,
                                           String pAmount, String pRemark, String pBenefEmail, String pBenefName,
                                           String pBenefAddr1, String pBenefAddr2, String pDestinationBank, String pFeeType) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank", pBank);
        headerBody.put("referenceNumber", pRefNum);
        headerBody.put("sourceAccount", pSource);
        headerBody.put("beneficiaryAccount", pBeneficiaryAccount);
        headerBody.put("currency", pCurrency);
        headerBody.put("amount", pAmount);
        headerBody.put("remark",pRemark);
        headerBody.put("beneficiaryEmailAddress", pBenefEmail);
        headerBody.put("beneficiaryName", pBenefName);
        headerBody.put("beneficiaryAddress1",pBenefAddr1);
        headerBody.put("beneficiaryAddress2",pBenefAddr2);
        headerBody.put("destinationBankCode", pDestinationBank);
        headerBody.put("feeType", pFeeType);

        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return inhousePaymentKliring(timestamp, signature_str, body, token_str);
    }

    public static String inquery(String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doInquiry");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);

        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }

        return result;
    }

    public static String doInterbankPayment (String pBank, String pRefNum, String pAmount, String pBeneficiaryAccount,
                                             String pBenefName, String pDestinationBankCode, String pDestinationBank,
                                             String pRetrievalReff, String pSource, String pCurrency, String pCurrency2,
                                             String pRemark) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("customerReferenceNumber",pRefNum);
        headerBody.put("amount",pAmount);
        headerBody.put("destinationAccountNumber",pBeneficiaryAccount);
        headerBody.put("destinationAccountName",pBenefName);
        headerBody.put("destinationBankCode",pDestinationBankCode);
        headerBody.put("destinationBankName",pDestinationBank);
        headerBody.put("retrievalReffNumber",pRetrievalReff);
        headerBody.put("sourceAccountNumber",pSource);
        headerBody.put("debitCurrency",pCurrency);
        headerBody.put("creditCurrency",pCurrency2);
        headerBody.put("remark",pRemark);

        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return interbankPayment(timestamp, signature_str, body, token_str);
    }

    public static String inhousePayment (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPayment");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }

    public static String inhousePaymentRtgs (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPaymentRtgs");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }

    public static String inhousePaymentKliring (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPaymentKliring");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }

    public static String interbankPayment (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPaymentInterBank");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }
    //===BATAS AKHIR UNTUK PAYMENT===//

    public List<Map<String, Object>> getAllPembayaran(String idUser, String pTglAwal, String pTglAkhir,  String pCurr, String pStatusTracking, String pBank, String pCaraBayar, String pStatus){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_invoice_by_status3");
        Map<String, Object> param = new HashMap<>();
        param.put("p_tgl_awal", pTglAwal);
        param.put("p_tgl_akhir", pTglAkhir);
        param.put("p_bank", pBank);
        param.put("p_currency", pCurr);
        param.put("p_cara_bayar", pCaraBayar);
        param.put("p_user_id", idUser);
        param.put("p_status", pStatus);
        param.put("p_status_tracking", pStatusTracking);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        AppUtils.getLogger(this).debug("get all pembayaran debug : {}", result);

        return result;
    }

    public List<Map<String, Object>> getAllRekapPembayaran(String idUser, String pTglAwal, String pTglAkhir,  String pCurr, String pStatusTracking, String pBank, String pCaraBayar, String pStatus){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_all_rekap_pembayaran");
        Map<String, Object> param = new HashMap<>();
        param.put("p_tgl_awal", pTglAwal);
        param.put("p_tgl_akhir", pTglAkhir);
        param.put("p_bank", pBank);
        param.put("p_currency", pCurr);
        param.put("p_cara_bayar", pCaraBayar);
        param.put("p_user_id", idUser);
        param.put("p_status", pStatus);
        param.put("p_status_tracking", pStatusTracking);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        AppUtils.getLogger(this).debug("get_all_rekap_pembayaran debug : {}", result);

        return result;
    }

    public BigDecimal getTotalTagihan(String tglAwal,
                                      String tglAkhir,
                                      String currency,
                                      String caraBayar,
                                      String bank,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_currency", currency, OracleTypes.VARCHAR)
                .addValue("p_cara_bayar", caraBayar, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_corpay")
                .withFunctionName("get_total_tagihan_invoice3")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

}
