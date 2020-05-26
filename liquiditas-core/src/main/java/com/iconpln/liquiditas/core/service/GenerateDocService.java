package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GenerateDocService {
    @Autowired
    DataSource dataSource;

    JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getCetakBuktiKasSingle(String pCompCode, String pDocumentNumbers, String pFiscalYear, String pLineItem, String pKet){
        List<Map<String, Object>> out = new ArrayList<>();
        try {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_CORPAY")
                    .withFunctionName("cetak_bukti_kas");
            SqlParameterSource param = new MapSqlParameterSource()
                    .addValue("p_comp_code",pCompCode)
                    .addValue("p_doc_no", pDocumentNumbers)
                    .addValue("p_fisc_year", pFiscalYear)
                    .addValue("p_line_item", pLineItem)
                    .addValue("p_ket",pKet);
            out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        }catch (Exception e){
            e.printStackTrace();
        }
        AppUtils.getLogger(this).debug("get_cetak_bukti_kas_single : {}",out);
        return out;
    }
}
