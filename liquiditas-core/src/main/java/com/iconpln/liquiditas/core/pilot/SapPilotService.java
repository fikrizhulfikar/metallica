package com.iconpln.liquiditas.core.pilot;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

@Service
public class SapPilotService {
    @Autowired
    DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){
        return new JdbcTemplate(dataSource);
    }

    public Map<String, Object> insertIntoLogIntegrationSapPilot(String pJenisData, String pKontenData, String pHeader, String pItem, String pStatusJson, String pParam, String pUrl){
        Map<String, Object> insert = new HashMap<>();
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("ins_log_sap_clob_new");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_jenis_data",pJenisData, OracleTypes.VARCHAR)
                .addValue("p_konten_data", pKontenData, OracleTypes.CLOB)
                .addValue("p_status_json", pStatusJson, OracleTypes.VARCHAR)
                .addValue("p_param", pParam, OracleTypes.VARCHAR)
                .addValue("p_header", pHeader, OracleTypes.CLOB)
                .addValue("p_item", pItem, OracleTypes.CLOB)
                .addValue("p_url", pUrl, OracleTypes.VARCHAR);
        try {
            return simpleJdbcCall.execute(param);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
