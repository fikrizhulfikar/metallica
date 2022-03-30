package com.iconpln.liquiditas.core.pilot;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class InvoicePilotService {
    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){
        return new JdbcTemplate(dataSource);
    }

    public List<Map<String, Object>> getListApHrPilot(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pUserId, String sortBy, String sortDir, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("invoice_get");
        AppUtils.getLogger(this).info("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pUserId, sortBy, sortDir, pSearch);


        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getListInvoiceVendorPortal(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pUserId, String sortBy, String sortDir, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("vendor_portal_get");
        AppUtils.getLogger(this).info("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pUserId, sortBy, sortDir, pSearch);


        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getInvoiceNonVendorHead(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pCurrency, String pUserId, String sortBy, String sortDir, String pJenisDok, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("nonvendor_head_get");

        AppUtils.getLogger(this).info("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pJenisDok : {}" +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir,  pCurrency, pUserId, sortBy, sortDir, pJenisDok, pSearch);
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_currency", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_jenis_dok", pJenisDok, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_nonvendor_head_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getInvoiceNonVendorItem(Integer pStart, Integer pLength, String sortBy, String sortDir, String pUserId, String pDocNo, String pFiscYear, String pCompCode){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("nonvendor_item_get");

        AppUtils.getLogger(this).info("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pUserId : {}," +
                        "pDocNo : {}" +
                        "pCompCode : {}" +
                        "pFiscYear : {},",

                pStart, pLength,sortBy, sortDir, pUserId, pDocNo, pCompCode, pFiscYear );
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_doc_no", pDocNo, Types.VARCHAR)
                .addValue("p_comp_code", pCompCode, Types.VARCHAR)
                .addValue("p_fisc_year", pFiscYear, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_nonvendor_item_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getRealisasiInvoice(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pUserId, String sortBy, String sortDir, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("realisasi_get");

        AppUtils.getLogger(this).info("realisasi get = " +

                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, ",
                pTglAwal, pTglAkhir);
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_nonvendor_item_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getInvoiceOss(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pUserId, String sortBy, String sortDir, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("oss_get");

        AppUtils.getLogger(this).info("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pUserId, sortBy, sortDir, pSearch);
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_oss_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getListRekapAllInvoice(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pUserId, String sortBy, String sortDir, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("rekap_all_invoice_get");
        AppUtils.getLogger(this).info("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pUserId, sortBy, sortDir, pSearch);


        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getXlsInvoiceNonVendor(String pTglAwal, String pTglAkhir, String pUserId, String pDocNo, String pCompCode, String pFiscYear){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_nonvendor_item_xls");

        AppUtils.getLogger(this).info("data rekap search info = " +


                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pUserId : {}," +
                        "pDocNo : {}," +
                        "pCompCode : {}," +
                        "pFiscYear : {}," ,
              pTglAwal, pTglAkhir,pUserId, pDocNo, pCompCode, pFiscYear);
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_user_id", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_doc_no", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_comp_code", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_fisc_year ", pTglAwal, OracleTypes.VARCHAR);

        return (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
    }

    public ArrayList getHrApInvoicePilotXls(String date_from, String date_to, String curr, String mtd_byr, String house_bank, String usr_id){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_invoice_xls");
        AppUtils.getLogger(this).info("xls aphr = " +

                        "pTglAwal : {}, " +
                        "MtdByar : {}, " +
                        "Curr : {}, " +
                        "HOuseBank : {}, " +
                        "Userid : {}, " +
                        "pTglAkhir : {}, ",
                date_from, mtd_byr, curr, house_bank, usr_id, date_to);
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_currency", curr, OracleTypes.VARCHAR)
                .addValue("p_house_bank", mtd_byr, OracleTypes.VARCHAR)
                .addValue("p_metode_bayar", house_bank, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR)
                .addValue("out_data", OracleTypes.CURSOR);
        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public List<Map<String, Object>> getInvoiceOssXls(String date_from, String date_to, String bank, String curr, String usr_id){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_oss_xls");
        AppUtils.getLogger(this).info("xls oss = " +

                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, ",
                date_from, date_to);
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_cur", curr, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR);
        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public List<Map<String, Object>> getRealisasiInvoiceXls(String date_from, String date_to, String bank, String curr, String usr_id){
        AppUtils.getLogger(this).info("xls realisasi = " +

                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, ",
                date_from, date_to);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_realisasi_xls");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_cur", curr, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR);
        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public List<Map<String, Object>> getRekapAllInvoice(String date_from, String date_to, String bank, String curr, String usr_id){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_rekap_all_invoice_xls");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_cur", curr, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR);
        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public List<Map<String, Object>> getVendorPortalXls(String date_from, String date_to, String bank, String curr, String usr_id){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_vendor_portal_xls");
        AppUtils.getLogger(this).info("xls vip = " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, ",
                date_from, date_to);
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_cur", curr, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR)
                .addValue("out_data", OracleTypes.CURSOR);

        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public List<Map<String, Object>> getNonVendorHeadXls(String date_from, String date_to, String jenis_dok, String curr, String usr_id){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_nonvendor_head_xls");
        AppUtils.getLogger(this).info("xls vip = " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, ",
                date_from, date_to);
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_jenis_dok", jenis_dok, OracleTypes.VARCHAR)
                .addValue("p_currency", curr, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR)
                .addValue("out_data", OracleTypes.CURSOR);

        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public List<Map<String, Object>> getNonVendorItemXls(String date_from, String date_to, String doc_no, String comp_code, String fisc_year, String usr_id){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CENTRALIZED_PAYMENT")
                .withFunctionName("get_nonvendor_item_xls");
        AppUtils.getLogger(this).info("xls vip = " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, ",
                date_from, date_to);
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_tgl_awal", date_from, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", date_to, OracleTypes.VARCHAR)
                .addValue("p_fisc_year", fisc_year, OracleTypes.VARCHAR)
                .addValue("p_doc_no", doc_no, OracleTypes.VARCHAR)
                .addValue("p_user_id", usr_id, OracleTypes.VARCHAR)
                .addValue("p_comp_code", comp_code, OracleTypes.VARCHAR)
                .addValue("out_data", OracleTypes.CURSOR);

        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }
}
