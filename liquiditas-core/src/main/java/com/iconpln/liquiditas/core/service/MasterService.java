package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by israjhaliri on 8/1/17.
 */
@Repository
public class MasterService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public List<Map<String,Object>> getListBank(String pJenis,String pJenisBank, String pForm) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_bank");

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis", pJenis);
        params.put("p_jenis_bank", pJenisBank);
        params.put("p_form", pForm);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_list_bank : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListCurrency(String pJenis,String pForm) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_curr");

        AppUtils.getLogger(this).info("p_form : {}",pForm);
        AppUtils.getLogger(this).info("pJenis : {}",pJenis);

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis", pJenis);
        params.put("p_form", pForm);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_list_curr : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListVendor(String pJenisPembayaran) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_vendor");

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis_pembayaran", pJenisPembayaran);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class,params);

        AppUtils.getLogger(this).info("data get_list_vendor : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListJenisPembayaran(String pJenis,String pUserid) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_jenis_pembayaran");

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis", pJenis);
        params.put("p_user_id", pUserid);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_list_jenis_pembayaran : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListUnitPenerima(String pJenisPembayaran) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_unit_penerima");

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis_pembayaran", pJenisPembayaran);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class,params);

        AppUtils.getLogger(this).info("data get_list_unit_penerima : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListTenor(String pJenis) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_tenor");

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis", pJenis);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_list_tenor : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListSumberDana() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_sumber_dana");

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);

        AppUtils.getLogger(this).info("data get_list_sumber_dana : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListPeruntukanDana() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_peruntukan_dana");

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);

        AppUtils.getLogger(this).info("data get_list_peruntukan_dana : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListKursJidor() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_kurs_jisdor");

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);

        AppUtils.getLogger(this).info("data get_list_kurs_jisdor : {}",resultset);
        return resultset;
    }

    public List<Map<String,Object>> getListKeterangan(String pJenis, String pForm) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_list_keterangan");

        Map<String, Object> params = new HashMap<>();
        params.put("p_jenis", pJenis);
        params.put("p_form", pForm);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_list_keterangan : {}",resultset);
        return resultset;
    }

    public Map<String,Object> insCurr(String pCurr,String pFlag, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_curr");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_currency", pCurr)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_curr : {}", out);
        return out;
    }

    public List<Map<String, Object>> getCurrPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_currency_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_currency_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getCurrById(String pCurr) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_currency_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_currency", pCurr);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_currency_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insBank(String pKodeBank,String pNamaBank, String pJenis, String pFlag, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_bank");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_kode_bank", pKodeBank)
                .addValue("p_nama_bank", pNamaBank)
                .addValue("p_jenis", pJenis)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_curr : {}", out);
        return out;
    }

    public List<Map<String, Object>> getBankPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_bank_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_bank_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getBankById(String pKdBank) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_bank_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_kode_bank", pKdBank);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_bank_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insVendor(String pIdVendor,String pNamaVendor, String pJenisPembayaran, String pFlag, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_vendor");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_vendor", pIdVendor)
                .addValue("p_nama_vendor", pNamaVendor)
                .addValue("p_jenis_pembayaran", pJenisPembayaran)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_vendor : {}", out);
        return out;
    }

    public List<Map<String, Object>> getVendorPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_vendor_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_vendor_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getVendorById(String pIdVendor, String pJenis) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_vendor_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_vendor", pIdVendor);
        params.put("p_jenis_pembayaran", pJenis);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_vendor_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insJenisPembayaran(String pIdJenisPembayaran,String pNamaJenisPembayaran, String pFlag,String pGroup, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_jenis_pembayaran");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_jenis_pembayaran", pIdJenisPembayaran)
                .addValue("p_nama_jenis_pembayaran", pNamaJenisPembayaran)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_grup_user", pGroup)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_jenis_pembayaran : {}", out);
        return out;
    }

    public List<Map<String, Object>> getJenisPembayaranPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_jenis_pembayaran_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_jenis_pembayaran_pss : {}", resultset);
        return resultset;
    }

    public Map<String, Object> getJenisPembayaranById(String pId) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_jenis_pembayaran_by_id");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_jenis_pembayaran", pId)
                .addValue("out_group_user", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);

        AppUtils.getLogger(this).info("data get_jenis_pembayaran_by_id : {}", out);
        return out;
    }

    public Map<String,Object> insUnit(String pIdUnit,String pNamaUnit,String pIdJenisPembayaran, String pFlag, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_unit_penerima");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_unit", pIdUnit)
                .addValue("p_nama_unit", pNamaUnit)
                .addValue("p_jenis_pembayaran", pIdJenisPembayaran)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_unit_penerima : {}", out);
        return out;
    }

    public List<Map<String, Object>> getUnitPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_unit_penerima_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_unit_penerima_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getUnitById(String pId, String pJenis) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_unit_penerima_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_unit", pId);
        params.put("p_jenis_pembayaran", pJenis);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_unit_penerima_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insTenor(String pIdTenor,String pNamaTenor,String pFlag, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_tenor");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_tenor", pIdTenor)
                .addValue("p_nama_tenor", pNamaTenor)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_tenor : {}", out);
        return out;
    }

    public List<Map<String, Object>> getTenorPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_tenor_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_tenor_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getTenorById(String pId) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_tenor_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_tenor", pId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_tenor_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insSumberDana(String pIdSumberDana,String pNama,String pFlag, String pIsUpdate) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_sumber_dana");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_sumber_dana", pIdSumberDana)
                .addValue("p_nama", pNama)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_sumber_dana : {}", out);
        return out;
    }

    public List<Map<String, Object>> getSumberDanaPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_sumber_dana_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_sumber_dana_pss : {}", resultset);
        return resultset;
    }


    public List<Map<String, Object>> getSumberDanaById(String pId) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_sumber_dana_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_sumber_dana", pId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_sumber_dana_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insKeterangan(String pIdKeterangan,String pNama,String pFlag,String pJenis, String pIsUpdate) throws SQLException {

        AppUtils.getLogger(this).info("pJenis Keterangan : {}",pJenis);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_keterangan");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_keterangan", pIdKeterangan)
                .addValue("p_nama", pNama)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_jenis", pJenis)
                .addValue("p_is_update", pIsUpdate)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_keterangan : {}", out);
        return out;
    }

    public List<Map<String, Object>> getKeteranganPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_keterangan_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_keterangan_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getKetById(String pId) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_keterangan_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_keterangan", pId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_keterangan_by_id : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insUser(String pUsername,String pPassword,String pIdGroup,String pFlag) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_user");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_username", pUsername)
                .addValue("p_password", pPassword)
                .addValue("p_id_group", pIdGroup)
                .addValue("p_flag_tampil", pFlag)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_user : {}", out);
        return out;
    }

    public List<Map<String, Object>> getUserPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_user_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_user_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getUserById(String pId) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_user_by_id");

        Map<String, Object> params = new HashMap<>();
        params.put("p_username", pId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_user_by_id : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getRole(String pParent,String pIsMaster) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_cb_group_user");
        Map<String, Object> params = new HashMap<>();
        params.put("p_parent_group", pParent);
        params.put("p_is_master", pIsMaster);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class,params);

        AppUtils.getLogger(this).info("data get_cb_group_user : {}", resultset);
        return resultset;
    }

    public Map<String,Object> insBankValasTmp(String pKodeBank,String pNamaBank, String pJenis, String pFlag,String pIdSession) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_bank_valas_tmp");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_kode_bank", pKodeBank)
                .addValue("p_nama_bank", pNamaBank)
                .addValue("p_jenis", pJenis)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_id_session", pIdSession)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_bank_valas_tmp : {}", out);
        return out;
    }

    public Map<String,Object> insBankValas(String pKodeBank,String pNamaBank, String pJenis, String pFlag,String pIdSession) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("ins_master_bank_valas");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_kode_bank", pKodeBank)
                .addValue("p_nama_bank", pNamaBank)
                .addValue("p_jenis", pJenis)
                .addValue("p_flag_tampil", pFlag)
                .addValue("p_id_session", pIdSession)
                .addValue("out_message", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_master_bank_valas : {}", out);
        return out;
    }

    public List<Map<String, Object>> getBankValasPss(Integer pStart, Integer pLength, int pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pSortBy : {}, " +
                        "pSortDir : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pSortBy, pSortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_bank_valas_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_lenght", pLength);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_bank_valas_pss : {}", resultset);
        return resultset;
    }

    public Map<String, Object> getBankValasById(String pKodeBank,String pJenis) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_bank_valas_by_id");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_kode_bank", pKodeBank)
                .addValue("p_jenis", pJenis)
                .addValue("out_child", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);

        AppUtils.getLogger(this).info("data get_bank_valas_by_id : {}", out);
        return out;
    }

    public String getIdUpload (){
        AppUtils.getLogger(this).info("siapsiap");
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("generate_id_upload");

        Map<String, Object> out = simpleJdbcCall.execute();
        AppUtils.getLogger(this).info("data getIdUpload : {}", out.get("return"));
        String idUpload = out.get("return").toString();
        return idUpload;
    }

    public Map<String, Object> uploadXls(InputStream path, String user, String jenisFile) throws ParseException, SQLException{
        Map<String, Object> out = null;
        HSSFWorkbook workbook = null;
        Iterator<Row> rowIterator = null;
        HSSFRow row = null;
        HSSFCell cell = null;
        Map<String, Object> param = new HashMap<>();
        String idUpload = getIdUpload();
        int i = 0;
        List<Map<String,Object>> failedList =  new ArrayList<>();
        try {

            workbook = new HSSFWorkbook(path);
            HSSFSheet sheet = workbook.getSheetAt(0);
            rowIterator = sheet.iterator();
            Row row1 = sheet.getRow(1);
            List<String> list = new ArrayList<>();
            int x =0;
            while (rowIterator.hasNext()) {
                row = (HSSFRow) rowIterator.next();
                Row rrow = sheet.getRow(row.getRowNum());
                int totalCell = sheet.getRow(0).getLastCellNum();
                AppUtils.getLogger(this).info("totalCell: {}", totalCell);
                for (int cellNum = 0; cellNum < totalCell; cellNum++){

                    if(rrow.getCell(cellNum) == null){
                        list.add("-");
                    }
                    else if(rrow.getCell(cellNum).getCellType() == Cell.CELL_TYPE_NUMERIC){
                        if(HSSFDateUtil.isCellDateFormatted(rrow.getCell(cellNum))){
                            DateFormat format = new SimpleDateFormat("dd-MMMM-yyyy", Locale.ENGLISH);
                            AppUtils.getLogger(this).info("datatanggal {}: {}", rrow.getCell(cellNum).toString());
                            list.add(new SimpleDateFormat("dd/MM/yyyy HH:mm").format(format.parse(rrow.getCell(cellNum).toString())));

                        }
                        else {
                            if(jenisFile.equals("9")){
                                rrow.getCell(cellNum).setCellType(Cell.CELL_TYPE_STRING);
                            }
                            list.add(rrow.getCell(cellNum).toString());
                            AppUtils.getLogger(this).info("datanumeric {}: {}", rrow.getCell(cellNum).toString(), row.getCell(cellNum).getCellType());
                        }
                    }
                    else{
                        list.add(rrow.getCell(cellNum).toString());
                        AppUtils.getLogger(this).info("datastring {}: {}", rrow.getCell(cellNum).toString(), row.getCell(cellNum).getCellType());
                    }
                }
                AppUtils.getLogger(this).debug("nilaiX : {}", x);
                if (x > 0 /*||
                        !list.get(0).toLowerCase().equals("tanggal deal") && !list.get(0).isEmpty()*/){
                    SqlParameterSource inParent;
                    SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate()).withCatalogName("pkg_master");
                    if(jenisFile.equals("1")){
                        simpleJdbcCall.withFunctionName("ins_curr_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins currency" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_currency", list.get(0))
                                .addValue("p_flag_tampil", list.get(1))
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("2")){
                        simpleJdbcCall.withFunctionName("ins_bank_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins bank" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_kode_bank", list.get(0))
                                .addValue("p_nama_bank", list.get(1))
                                .addValue("p_jenis", list.get(2))
                                .addValue("p_flag_tampil", list.get(3))
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("3")){
                        simpleJdbcCall.withFunctionName("ins_vendor_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins vendor" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_id_vendor", list.get(0))
                                .addValue("p_nama_vendor", list.get(1))
                                .addValue("p_jenis_pembayaran", list.get(2))
                                .addValue("p_flag_tampil", list.get(3))
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("4")){
                        simpleJdbcCall.withFunctionName("ins_unit_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins unit" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_id_unit", list.get(0))
                                .addValue("p_nama_unit", list.get(1))
                                .addValue("p_jenis_pembayaran", list.get(2))
                                .addValue("p_flag_tampil", list.get(3))
                                .addValue("p_create_by", user)
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("5")){
                        simpleJdbcCall.withFunctionName("ins_tenor_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins tenor" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_id_tenor", list.get(0))
                                .addValue("p_nama_tenor", list.get(1))
                                .addValue("p_flag_tampil", list.get(2))
                                .addValue("p_create_by", user)
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("6")){
                        simpleJdbcCall.withFunctionName("ins_sumber_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins sumber" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_id_sumber", list.get(0))
                                .addValue("p_nama_sumber", list.get(1))
                                .addValue("p_flag_tampil", list.get(2))
                                .addValue("p_create_by", user)
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("7")){
                        simpleJdbcCall.withFunctionName("ins_keterangan_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins keterangan" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_id_keterangan", list.get(0))
                                .addValue("p_nama_keterangan", list.get(1))
                                .addValue("p_jenis", list.get(2))
                                .addValue("p_flag_tampil", list.get(3))
                                .addValue("p_create_by", user)
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("8")){
                        simpleJdbcCall.withFunctionName("ins_jenis_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins jenis" );
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_id_jenis", list.get(0))
                                .addValue("p_nama_pembayaran", list.get(1))
                                .addValue("p_grup_user", list.get(2))
                                .addValue("p_flag_tampil", list.get(3))
                                .addValue("p_create_by", user)
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }else if(jenisFile.equals("9")){
                        simpleJdbcCall.withFunctionName("ins_user_to_temp");
                        AppUtils.getLogger(this).debug("jenisFile : {}",jenisFile+" ins user password" + list.get(1));
                        inParent = new MapSqlParameterSource()
                                .addValue("p_nomor", x)
                                .addValue("p_id_upload", idUpload)
                                .addValue("p_usname", list.get(0))
                                .addValue("p_password", list.get(1))
                                .addValue("p_role", list.get(2))
                                .addValue("p_flag_tampil", list.get(3))
                                .addValue("p_create_by", user)
                                .addValue("out_message", OracleTypes.VARCHAR);
                    }
                    else{
                        inParent = null;
                    }
                    AppUtils.getLogger(this).info("data p_id_upload : {}", inParent.getValue("p_id_upload"));
//                    AppUtils.getLogger(this).info("data p_bank : {}", inParent.getValue("p_bank"));
//                    AppUtils.getLogger(this).info("data p_tipe_transaksi : {}", inParent.getValue("p_tipe_transaksi"));
                    out = simpleJdbcCall.execute(inParent);
                    AppUtils.getLogger(this).info("datatotemp : {}", out);

                }
                list.clear();
                x++;
            }

            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("pkg_master")
                    .withFunctionName("return_cursor");
            SqlParameterSource inParent = new MapSqlParameterSource()
                    .addValue("p_id_upload", idUpload)
                    .addValue("p_jenis_laporan", jenisFile);
            out = simpleJdbcCall.execute(inParent);

            AppUtils.getLogger(this).info("data ins tempt {} torekap id {}: {}", jenisFile, idUpload, out);
        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
        return out;
    }

    public Map<String, Object> getErrorData(String idUpload, String idJenis) throws SQLException {
        Map<String, Object> out = null;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_master")
                .withFunctionName("get_data_error");
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_upload", idUpload)
                .addValue("p_jenis_laporan", idJenis);

//        out = simpleJdbcCall.execute(inParent);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("errorData {}: {}", idUpload, out);
        return out;
    }
}
