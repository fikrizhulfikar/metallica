package com.iconpln.liquiditas.core.service;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import javax.sql.DataSource;
import java.text.SimpleDateFormat;
import java.util.*;

@Repository
public class CorpayJobPaymentService {
    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}
    private SimpleDateFormat df = new SimpleDateFormat("HH:mm");

    public List<Map<String, Object>> corpaySiapBayarList(Date date){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_siap_bayar_corpay");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_jam_bayar",df.format(date));
        return simpleJdbcCall.executeFunction(ArrayList.class,param);
    }

    public Map<String, Object> corpayLunas(
            String comp_code, String doc_no, String fiscal_year, String line_item, String jenis_transaksi,
            String user_id, String status, String oss_id, String group_id, String ref_num_bank

    ){
        Map<String, Object> out = new HashMap<>();
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("corpay_lunas_invoice");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_comp_code", comp_code)
                .addValue("p_doc_no", doc_no)
                .addValue("p_fisc_year", fiscal_year)
                .addValue("p_line_item",line_item)
                .addValue("p_jenis_transaksi",jenis_transaksi)
                .addValue("p_user_id", user_id)
                .addValue("p_status", status)
                .addValue("p_oss_id", oss_id)
                .addValue("p_group_id",group_id)
                .addValue("p_ref_num_bank",ref_num_bank)
                .addValue("out_msg", OracleTypes.VARCHAR);

        out =  simpleJdbcCall.execute(param);
        return out;

    }

    public Map<String, Object> corpayGagalLunas(
            String comp_code, String doc_no, String fiscal_year, String response_code, String response_message, String line_item, String jenis_transaksi,
            String user_id, String status, String oss_id, String group_id

    ){
        Map<String, Object> out = new HashMap<>();
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("corpay_gagal_lunas");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_comp_code", comp_code)
                .addValue("p_doc_no", doc_no)
                .addValue("p_fisc_year", fiscal_year)
                .addValue("p_line_item",line_item)
                .addValue("p_jenis_transaksi",jenis_transaksi)
                .addValue("p_response_code",response_code)
                .addValue("p_response_message",response_message)
                .addValue("p_user_id", user_id)
                .addValue("p_oss_id", oss_id)
                .addValue("p_group_id",group_id)
                .addValue("out_msg", OracleTypes.VARCHAR);

        out = simpleJdbcCall.execute(param);
        return out;
    }
}
