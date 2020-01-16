package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
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
public class AnggaranService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public List<Map<String, Object>> getAllAnggaran(String pUnitAnggaran) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pUnitAnggaran : {}", pUnitAnggaran);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_all_anggaran");

        Map<String, Object> params = new HashMap<>();
        params.put("p_unit_anggaran", pUnitAnggaran);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_anggaran : {}", resultset);
        return resultset;
    }

//    public Map<String, Object> getAllAnggaran() throws SQLException {
//
//        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
//                .withCatalogName("PKG_MASTER")
//                .withFunctionName("get_all_anggaran");
//
//        SqlParameterSource in = new MapSqlParameterSource()
//                .addValue("out_anggaran", OracleTypes.CURSOR);
//        Map<String, Object> out = simpleJdbcCall.execute(in);
//        AppUtils.getLogger(this).info("data get_list_anggaran : {}", out);
//        return out;
//    }

    public List<Map<String, Object>> getListAnggaran(Integer pStart, Integer pLength, String pUnitAnggaran, String pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pUnitAnggaran : {}, " +
                        "pSearch : {},",

                pStart, pLength, pUnitAnggaran, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_anggaran");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_unit_anggaran", pUnitAnggaran);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir.toUpperCase());
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_anggaran : {}", resultset);
        return resultset;
    }

    public String getSisaAnggaran(String pNilaiAnggaran, String pCurrency, String pNilaiTagihan
            ) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_nilai_anggaran", pNilaiAnggaran, OracleTypes.VARCHAR)
                .addValue("p_currency", pCurrency, OracleTypes.VARCHAR)
                .addValue("p_nilai_tagihan", pNilaiTagihan, OracleTypes.VARCHAR);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("get_sisa_anggaran");
        return simpleJdbcCall.executeFunction(String.class, in);
    }

//    public List<Map<String, Object>> getSisaAnggaran(String pNilaiAnggaran, String pCurrency, String pNilaiTagihan) throws SQLException {
//
//        AppUtils.getLogger(this).debug("PARAM SEARCH pNilaiAnggaran : {}", pNilaiAnggaran);
//        AppUtils.getLogger(this).debug("PARAM SEARCH pNilaiAnggaran : {}", pCurrency);
//        AppUtils.getLogger(this).debug("PARAM SEARCH pNilaiAnggaran : {}", pNilaiTagihan);
//
//        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
//                .withCatalogName("PKG_MASTER")
//                .withFunctionName("get_sisa_anggaran");
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("pNilaiAnggaran", pNilaiAnggaran);
//        params.put("pCurrency", pCurrency);
//        params.put("pNilaiTagihan", pNilaiTagihan);
//        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
//
//        AppUtils.getLogger(this).info("data get_all_anggaran : {}", resultset);
//        return resultset;
//    }

}
