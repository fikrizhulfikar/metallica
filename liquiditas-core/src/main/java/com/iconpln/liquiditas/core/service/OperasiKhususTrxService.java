package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
//import sun.java2d.pipe.SpanShapeRenderer;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class OperasiKhususTrxService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlsqlUtils plsqlUtils;

    private JdbcTemplate getJdbcTemplate() {return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getListOperasiKhususTrx(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir,
                                                           String pCurrency, String pUserId, String sortBy,
                                                           String sortDir, String status, String statusTracking, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pCurrency, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_head_trx_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_currency", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", status, Types.VARCHAR)
                .addValue("p_status_tracking", statusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data operasi_khusus_trx_get : {}", resultset);
//        System.out.println("Pembelian Valas Metallica : "+resultset);
        return resultset;
    }

    public Map<String, Object> insOperasiKhusus(
            String pIdMetallica, String pDocDate, String pPostDate, String pDocNo, String pReference,
            String pCompCode, String pBusArea, String pCurrency, String pDocHdrTxt, String pUserId, String pExchangeRate,
            String pFiscalYear, String pSumberDana, String pTglRencanaBayar
    ) throws SQLException{
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_head_trx_ins");
        Map<String, Object> out;

        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_metallica",pIdMetallica)
                .addValue("p_doc_date",pDocDate)
                .addValue("p_post_date",pPostDate)
                .addValue("p_tgl_rencana_byr", pTglRencanaBayar)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_reference", pReference)
                .addValue("p_comp_code", pCompCode)
                .addValue("p_bus_area", pBusArea)
                .addValue("p_currency", pCurrency)
                .addValue("p_doc_hdr_txt",pDocHdrTxt)
                .addValue("p_user_id",pUserId)
                .addValue("p_exchange_rate", pExchangeRate)
                .addValue("p_fisc_year", pFiscalYear)
                .addValue("p_sumber_dana", pSumberDana);

        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data ins operasi_khusus_trx :{}",out);
        return out;
    }

    public List<Map<String, Object>> getHeadById(String pIdMetallica
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_head_trx_get_byid");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_metallica",pIdMetallica, Types.VARCHAR);


        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data pembelian_valas_trx_get : {}", resultset);
//        System.out.println("Pembelian Valas Metallica : "+resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDetails(
            Integer pStart, Integer pLength, String pSortBy, String pSortDir, String pUserId, String pIdMetallica
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_item_trx_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_sort_by", pSortBy, Types.VARCHAR)
                .addValue("p_sort_dir", pSortDir, Types.VARCHAR)
                .addValue("p_user_id",pUserId, Types.VARCHAR)
                .addValue("p_id_metallica",pIdMetallica, Types.VARCHAR);


        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data operasi_khusus_item_trx_get : {}", resultset);
//        System.out.println("Pembelian Valas Metallica : "+resultset);
        return resultset;
    }

    public Map<String, Object> insDetailOperasiKhususTrx(
            String pIdMetallica, String pPostDate, String pDocNo, String pAmount, String pBusArea, String pReference,
            String pCompCode, String pUserId, String pCurrency, String pDrCrInd, String pExchangeRate,
            String pFiscYear, String pGlAccount, String pLineNo, String pPmtProposalId, String pRemarks, String pFlag,
            String pCashCode, String pCostCtr, String pSumberDana, String pRealAmount
    )throws SQLException{
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_item_trx_ins");
        Map<String, Object> out;

        SqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_post_date", pPostDate)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_amount", pAmount)
                .addValue("p_bus_area", pBusArea)
                .addValue("p_reference", pReference)
                .addValue("p_comp_code", pCompCode)
                .addValue("p_user_id", pUserId)
                .addValue("p_currency", pCurrency)
                .addValue("p_debit_credit_ind", pDrCrInd)
                .addValue("p_exchange_rate", pExchangeRate)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_gl_account", pGlAccount)
                .addValue("p_line_no", pLineNo)
                .addValue("p_pmt_proposal_id", pPmtProposalId)
                .addValue("p_remarks", pRemarks)
                .addValue("p_flag", pFlag)
                .addValue("p_cash_code", pCashCode)
                .addValue("p_cost_ctr", pCostCtr)
                .addValue("p_sumber_dana", pSumberDana)
                .addValue("p_real_amount", pRealAmount)
                .addValue("out_msg", OracleTypes.CURSOR);

        out = simpleJdbcCall.execute(inParams);
        AppUtils.getLogger(this).info("get ins_operasi_khusus_trx : {}", out);
        return out;
    }

    public Map<String, Object> deleteOperasiKhususItemTrx(String pIdMetallica, String pItemId, String pLineNo){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_item_trx_del");

        SqlParameterSource inParam = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_id_operasi_item_trx", pItemId)
                .addValue("p_line_no", pLineNo)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(inParam);
        AppUtils.getLogger(this).info("msg delete_operasi_item : {}", out);
        return out;
    }

    public Map<String, Object> deleteOperasiKhususTrxHead(String pIdMetallica){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_head_trx_del");

        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica);

        Map<String, Object> result = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("msg delete_operasi_khusus_trx_head : {}", result);
        return result;
    }

    public List<Map<String, Object>> getDataOperasiKhususTrxById(String pIdMetallica){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_item_trx_get_byid");

        Map<String, Object> inParam = new HashMap<>();
        inParam.put("p_id_metallica", pIdMetallica);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, inParam);

        AppUtils.getLogger(this).info("data get_data_operasi_khusus_byId : {}", resultset);

        return resultset;
    }

    public Map<String, Object> updateStatus(String pIdMetallica, String pStatusTracking){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_trx_verifikasi");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data update_status : {}", out);
        return out;
    }

    public Map<String, Object> updateLunas(String pIdMetallica, String pJenis){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("trans_metallica_upd_lunas");
        Map<String, Object> out;
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_jenis", pJenis)
                .addValue("out_msg",OracleTypes.VARCHAR);

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("update data_lunas : {}", out);
        return out;
    }

    public Map<String, Object> updateReverse(String pIdMetallica, String pStatusTracking){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_trx_reverse");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> result = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("data operasi_khusus_trx_reverse : {}", result);
        return result;
    }

    public List<Map<String, Object>> getListOperasiKhususTrxVerified(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir,
                                                                      String pCurrency, String pUserId, String sortBy,
                                                                      String sortDir, String status, String statusTracking, String pSearch
    ) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pCurrency, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_head_verified_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_currency", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", status, Types.VARCHAR)
                .addValue("p_status_tracking", statusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data operasi_khusus_trx_verified_get : {}", resultset);
//        System.out.println("Pembelian Valas Metallica : "+resultset);
        return resultset;
    }

    public List<Map<String, Object>> getListOperasiKhususTrxLunas(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir,
                                                                   String pCurrency, String pUserId, String sortBy,
                                                                   String sortDir, String status, String statusTracking, String pSearch
    ) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pCurrency, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("operasi_head_lunas_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_currency", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", status, Types.VARCHAR)
                .addValue("p_status_tracking", statusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data pembelian_valas_trx_lunas_get : {}", resultset);
//        System.out.println("Pembelian Valas Metallica : "+resultset);
        return resultset;
    }

    public BigDecimal getTotalTagihan(String tglAwal,
                                      String tglAkhir,
                                      String currency,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_currency", currency, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_corpay")
                .withFunctionName("get_total_tagihan_operasi")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

    public List<Map<String, Object>> getAllpembayaran(String idUser, String pTglAwal, String pTglAkhir,  String pCurr) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_operasi_by_status");


        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_currency", pCurr);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status2 : {} and userid {}", resultset, idUser);
        return resultset;
    }
    public List<Map<String, Object>> getAllpembayaran2(String idUser, String pTglAwal, String pTglAkhir,  String pCurr) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_operasi_by_status2");


        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_currency", pCurr);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status2 : {} and userid {}", resultset, idUser);
        return resultset;
    }

    public List<Map<String, Object>> getAllpembayaran3(String idUser, String pTglAwal, String pTglAkhir,  String pCurr) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_operasi_by_status3");


        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_currency", pCurr);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status2 : {} and userid {}", resultset, idUser);
        return resultset;
    }

    public List<Map<String, Object>> getGlAccount(String pCurrency){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_gl_account");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_currency", pCurrency);

        AppUtils.getLogger(this).info("pCurrency data : {}",pCurrency);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getCashCode(){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_cash_code");

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);
        return out;
    }

//    public List<Map<String, Object>> getCompCode(){
//        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
//                .withCatalogName("PKG_CORPAY")
//                .withFunctionName("");
//        List<Map<String, Object>>
//    }

    public BigDecimal getTotalTagihanLunas(String tglAwal,
                                      String tglAkhir,
                                      String currency,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_currency", currency, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_corpay")
                .withFunctionName("get_total_operasi_lunas")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

    public List<Map<String, Object>> getCurrency(){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_currency");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("out", OracleTypes.CURSOR);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);

        return out;
    }
}
