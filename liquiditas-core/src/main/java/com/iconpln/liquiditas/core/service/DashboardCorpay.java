package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by adikoesoemah on 22/1/20.
 */

@Repository
public class DashboardCorpay {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public Map<String, Object> getSaldoJenisMataUang()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_saldo_per_currency");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_curr", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_per_currency : {}", out);
        return out;
    }

    public Map<String, Object> getSaldoRekening()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_saldo_per_jenis_rek");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_jenis", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_per_jenis_rek : {}", out);
        return out;
    }

    public Map<String, Object> getSaldoBank()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_saldo_bank");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_bank", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_bank : {}", out);
        return out;
    }

    public Map<String, Object> getKompSaldo()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_komposisi_saldo");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_komposisi", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_komposisi_saldo : {}", out);
        return out;
    }

    public Map<String, Object> getRekOperasi()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_saldo_operasi");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total_bawah", OracleTypes.CURSOR)
                .addValue("out_total_samping", OracleTypes.CURSOR)
                .addValue("out_pie_operasi", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_operasi : {}", out);
        return out;
    }

    public Map<String, Object> getRekInves()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_saldo_investasi");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total_bawah", OracleTypes.CURSOR)
                .addValue("out_total_samping", OracleTypes.CURSOR)
                .addValue("out_pie_investasi", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_investasi : {}", out);
        return out;
    }

    public Map<String, Object> getTotDeposito()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_saldo_deposito");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_deposito", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_deposito : {}", out);
        return out;
    }

    public Map<String, Object> getLinNilai()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_lindung_nilai");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_total_samping", OracleTypes.CURSOR)
                .addValue("get_pie_lindung", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_lindung_nilai : {}", out);
        return out;
    }

    public Map<String, Object> getRenPembayaran()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_tagihan_cashcode");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_bar_cashcode", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_tagihan_cashcode : {}", out);
        return out;
    }

    public Map<String, Object> getRekRencana()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("comp_rekening_vs_rencana");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_saldo", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data comp_rekening_vs_rencana : {}", out);
        return out;
    }

    public Map<String, Object> getRenInvops()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_rencana_invops");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_total_seluruh", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_rencana_invops : {}", out);
        return out;
    }
    public Map<String, Object> getRenPembayaran2()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_tagihan_cashcode");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_bar_cashcode", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_tagihan_cashcode : {}", out);
        return out;
    }

    public Map<String, Object> getRealPembayaran2()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_realisasi_cashcode");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_bar_cashcode", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_realisasi_cashcode : {}", out);
        return out;
    }
}
