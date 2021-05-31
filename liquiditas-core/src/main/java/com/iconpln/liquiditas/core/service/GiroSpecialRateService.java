package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class GiroSpecialRateService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getListGiro(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, ",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_giro");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_giro : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deleteGiro(String pIdGiro) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("del_giro");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_giro", pIdGiro)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_giro : {}", out);
        return out;
    }

    public List<Map<String, Object>> editGiroService(String pIdGiro) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("view_giro");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_giro", pIdGiro);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_giro_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> insPembayaranGiro(
            String pIdGiro, String pTglJatuhTempo, String pTglPenempatan,
            String pCurr, String pBankTujuan, String pajak, String pInterest,
            String pNominal, String pProduk, String pKeterangan, String pJenis, String pUserId, String pJasaGiro
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("ins_giro");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_user_id", pUserId)
                .addValue("p_id_giro", pIdGiro)
                .addValue("p_kode_currency", pCurr)
                .addValue("p_kode_bank", pBankTujuan)
                .addValue("p_produk", pProduk)
                .addValue("p_nominal", pNominal)
                .addValue("p_interest", pInterest)
                .addValue("p_tgl_penempatan", pTglPenempatan)
                .addValue("p_jatuh_tempo", pTglJatuhTempo)
                .addValue("p_pajak", pajak)
                .addValue("p_keterangan", pKeterangan)
                .addValue("p_jenis", pJenis)
                .addValue("p_jasa_giro", pJasaGiro);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data ins_rekap_giro : {}", out);
        return out;
    }

    public List<Map<String, Object>> getXlsGiroSpecialRate() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("xls_giro_special");

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class);
        AppUtils.getLogger(this).info("data get_all_giro : {}", resultset);
        return resultset;
    }
}
