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

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DepositoService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlsqlUtils plsqlUtils;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public List<Map<String, Object>> getListHeaderDeposito(Integer pStart, Integer pLength, String pBank, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pBank : {}, " +
                        "pSearch : {},",

                pStart, pLength, pBank, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_header_deposito");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_bank", pBank);
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_deposito_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getLisDetailDeposito(String pIdDeposito) throws SQLException {
       SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_detail_deposito");

        Map<String, Object> params = new HashMap<>();
        params.put("p_account", pIdDeposito);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_deposito_pss : {}", resultset);
        return resultset;
    }

    //    deposito
    public Map<String, Object> insHeaderDeposito(
            String pIdDeposito, String pBank, String pBillyet, String pCurrency, String pUserId
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("create_header_deposito");

        AppUtils.getLogger(this).info("pIdDeposito : {} ", pIdDeposito);
        AppUtils.getLogger(this).info("pBank : {} ", pBank);
        AppUtils.getLogger(this).info("pBillyet : {} ", pBillyet);

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_depo", pIdDeposito)
                .addValue("p_bank", pBank)
                .addValue("p_currency", pCurrency)
                .addValue("p_account", pBillyet)
                .addValue("p_user_id", pUserId)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_deposito : {}", out);
        return out;
    }

    public Map<String, Object> insDetailDeposito(
            String pIdDeposito, String pIdDetail, String pBank, String pJenis ,String pNoAccount,
            String pNominal, String pCurr, String pInterest, String pTglPenempatan, String pTglPencairan,
            String pTglJatuhTempo, String pKeterangan, String pBungaAccrual, String pPokokBunga, String pUserId
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_deposito_detail");

        AppUtils.getLogger(this).debug("pIdDeposito : {} ", pIdDeposito);
        AppUtils.getLogger(this).debug("pBank : {} ", pBank);
        AppUtils.getLogger(this).debug("pNoAccount : {} ", pNoAccount);
        AppUtils.getLogger(this).debug("pNominal : {} ", pNominal);
        AppUtils.getLogger(this).debug("pInterest : {} ", pInterest);
        AppUtils.getLogger(this).debug("pTglPenempatan : {} ", pTglPenempatan);
        AppUtils.getLogger(this).debug("pTglJatuhTempo : {} ", pTglJatuhTempo);
        AppUtils.getLogger(this).debug("pKeterangan : {} ", pKeterangan);

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_depo", pIdDeposito)
                .addValue("p_id_detail", pIdDetail)
                .addValue("p_bank", pBank)
                .addValue("p_jenis", pJenis)
                .addValue("p_account", pNoAccount)
                .addValue("p_currency", pCurr)
                .addValue("p_nominal", pNominal)
                .addValue("p_bunga_acc", pBungaAccrual)
                .addValue("p_pokok_bunga", pPokokBunga)
                .addValue("p_interest", pInterest)
                .addValue("p_tgl_penempatan", pTglPenempatan)
                .addValue("p_tgl_jatuh_tempo", pTglJatuhTempo)
                .addValue("p_tgl_pencairan", pTglPencairan)
                .addValue("p_keterangan", pKeterangan)
                .addValue("p_user_id", pUserId)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_deposito : {}", out);
        return out;
    }



    public List<Map<String, Object>> getAllDeposito(String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pTenor, String pKet) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTenor : {}", pTenor);
        AppUtils.getLogger(this).debug("PARAM SEARCH pKet : {}", pKet);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_deposito");

        Map<String, Object> params = new HashMap<>();
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurr);
        params.put("p_tenor", pTenor);
        params.put("p_keterangan", pKet);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_deposito : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDepositobyId(String pIdDeposito) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_header_deposito_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_depo", pIdDeposito);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_deposito_byid : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDetailDepositobyId(String pIdDeposito) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_detail_deposito_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_detail", pIdDeposito);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_deposito_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deleteDeposito(String pIdDeposito) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("del_deposito_header");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_depo", pIdDeposito)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_deposito : {}", out);
        return out;
    }

    public Map<String, Object> deleteDetailDeposito(String pIdDeposito) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("del_deposito_detail");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_detail", pIdDeposito)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_deposito : {}", out);
        return out;
    }
}
