package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
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

    public Map<String, Object> getLampiranGroup(String pIdGroup) {
        Map<String, Object> out = new HashMap<>();
        try {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_CORPAY")
                    .withFunctionName("cetak_bukti_lampiran_grouping");
            SqlParameterSource param = new MapSqlParameterSource()
                    .addValue("p_group_id",pIdGroup)
                    .addValue("out_total", OracleTypes.CURSOR);
            out = simpleJdbcCall.execute(param);
        }catch (Exception e){
            e.printStackTrace();
        }
        AppUtils.getLogger(this).debug("get_lampiran_group : {}",out);
        return out;
    }

    public List<Map<String, Object>> getCetakSuratGrouping(String pIdGroup){
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_CORPAY")
                    .withFunctionName("cetak_surat_grouping"); //aksi samping
            SqlParameterSource param = new MapSqlParameterSource()
                    .addValue("p_id_group",pIdGroup);
            list = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        }catch (Exception e){
            e.printStackTrace();
        }
        AppUtils.getLogger(this).debug("get_cetak_surat_grouping : {}",list);
        return list;
    }

    public List<Map<String, Object>> getCetakBuktiKasGrouping(String pCompCode, String pDocNo, String pFiscalYear, String pKet){
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("PKG_CORPAY")
                    .withFunctionName("cetak_bukti_kas_grouping"); //item grouping satuan
            SqlParameterSource param = new MapSqlParameterSource()
                    .addValue("p_comp_code", pCompCode)
                    .addValue("p_doc_no", pDocNo)
                    .addValue("p_fisc_year", pFiscalYear)
                    .addValue("p_ket", pKet);
            list = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class,param);
        }catch (Exception e){
            e.printStackTrace();
        }
        AppUtils.getLogger(this).debug("get_cetak_bukti_kas_grouping : {}",list);
        return list;
    }
}
