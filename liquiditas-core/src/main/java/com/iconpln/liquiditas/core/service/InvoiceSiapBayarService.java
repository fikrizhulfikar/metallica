package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.simple.SimpleJdbcCallOperations;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class InvoiceSiapBayarService {
    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getListInvoiceSiapBayar(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch) throws SQLException {
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
                .withFunctionName("siapbayar_invoice_get");
        SqlParameterSource param = new MapSqlParameterSource()
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
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        AppUtils.getLogger(this).debug("rekap invoice siap bayar : {}",resultset);
        return resultset;
    }

    public List<Map<String, Object>> getInvoiceSiapBayarById(String pCompCode, String pDocNo, String pFiscYear, String pLineItem) throws SQLException{
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_get_data_by");

        Map<String, Object> params = new HashMap<>();
        params.put("p_comp_code", pCompCode);
        params.put("p_doc_no", pDocNo);
        params.put("p_fisc_year", pFiscYear);
        params.put("p_line_item", pLineItem);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_data_invoice_siap_bayar_by : {}", result);
        return result;
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

    public List<Map<String, Object>> getAllPembayaran(String idUser, String pTglAwal, String pTglAkhir,  String pCurr, String pStatusTracking, String pBank, String pCaraBayar, String pStatus){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_invoice_by_status4");
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
                .withFunctionName("get_total_tagihan_invoice4")
                .executeFunction(BigDecimal.class, in);
        return result;
    }
}
