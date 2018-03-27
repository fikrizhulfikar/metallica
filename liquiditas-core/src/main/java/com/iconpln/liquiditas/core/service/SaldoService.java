package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.SaldoRekening;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by israjhaliri on 9/29/17.
 */
@Repository
public class SaldoService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public int insertSaldo(List<SaldoRekening> saldoRekeningList) {
        int resTemp = 0;

        for (SaldoRekening saldoRekening : saldoRekeningList) {
            SimpleJdbcCall simpleJdbcCallInsert = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_DASHBOARD_VALAS")
                    .withFunctionName("upd_rekening_valas");

            SqlParameterSource in = new MapSqlParameterSource()
                    .addValue("p_curr", saldoRekening.getCurrency())
                    .addValue("p_no_rek", saldoRekening.getBankAccount())
                    .addValue("p_nilai", saldoRekening.getEndingAmount());
            Map<String, Object> out = simpleJdbcCallInsert.execute(in);
            resTemp = Integer.valueOf(out.get("return").toString());
            AppUtils.getLogger(this).error("RESPONSE UPDATE SALDO FOR CURR : {}, NO REK : {}, NILAI : {} = {}", saldoRekening.getCurrency(), saldoRekening.getBankAccount(), saldoRekening.getEndingAmount(), resTemp);
        }
        return resTemp;

    }

    public int insertSaldoAwalIdr() {
        int resTemp = 0;

        SimpleJdbcCall simpleJdbcCallInsert = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_saldoawal_dashboard_idr");

        Map<String, Object> out = simpleJdbcCallInsert.execute();
        resTemp = Integer.valueOf(out.get("return").toString());
        AppUtils.getLogger(this).error("RESPONSE GET SALDO IDR : {}", resTemp);

        return resTemp;
    }

    public ArrayList getSaldoPerBank() {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dash_bi")
                .withFunctionName("get_saldo_perbank");

        SqlParameterSource in = new MapSqlParameterSource();
        Map<String, Object> out = simpleJdbcCall.execute(in);
        return (ArrayList) out.get("OUT_REKENING");
    }
}
