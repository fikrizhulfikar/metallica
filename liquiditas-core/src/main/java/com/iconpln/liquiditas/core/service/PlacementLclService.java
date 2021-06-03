package com.iconpln.liquiditas.core.service;

import oracle.jdbc.OracleTypes;
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

@Repository
public class PlacementLclService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){ return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getPlacementlclHeader(int pStart, int pLength, String pTanggal, String pSearch){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_header_lcl");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_start", pStart, OracleTypes.INTEGER)
                .addValue("p_length", pLength, OracleTypes.INTEGER)
                .addValue("p_tanggal", pTanggal, OracleTypes.VARCHAR)
                .addValue("p_search", pSearch, OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public Map<String, Object> getPlacementlclDetail(String idForm){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_detail_tagihan_lcl");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_form", idForm, OracleTypes.VARCHAR)
                .addValue("out_operasi", OracleTypes.CURSOR)
                .addValue("out_giro", OracleTypes.CURSOR)
                .addValue("out_dropping", OracleTypes.CURSOR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        System.out.println("KKKK : "+out);
        return out;
    }

    public Map<String, Object> getPlacementlclSepuluh(String idForm){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_tagihan_terbesar");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_form", idForm, OracleTypes.VARCHAR)
                .addValue("out_h1", OracleTypes.CURSOR)
                .addValue("out_h2", OracleTypes.CURSOR);

        return simpleJdbcCall.execute(in);
    }

    public Map<String, Object> getPlacementlclRangkuman(String idForm){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_rangkuman_lcl");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_form", idForm, OracleTypes.VARCHAR)
                .addValue("out_cashflow", OracleTypes.CURSOR)
                .addValue("out_imprest_operasi", OracleTypes.CURSOR)
                .addValue("out_imprest_investasi", OracleTypes.CURSOR)
                .addValue("out_impor", OracleTypes.CURSOR);

        return simpleJdbcCall.execute(in);
    }

    public Map<String, Object> getPlacementlclLembarKerja(String idForm){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_lembar_kerja_lcl");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_form", idForm, OracleTypes.VARCHAR)
                .addValue("out_receipt", OracleTypes.CURSOR)
                .addValue("out_imprest_pusat", OracleTypes.CURSOR)
                .addValue("out_imprest_operasi", OracleTypes.CURSOR)
                .addValue("out_imprest_investasi", OracleTypes.CURSOR)
                .addValue("out_impor", OracleTypes.CURSOR)
                .addValue("out_optimasi_giro", OracleTypes.CURSOR)
                .addValue("out_pembelian_valas", OracleTypes.CURSOR)
                .addValue("out_rekap_saldo", OracleTypes.CURSOR)
                .addValue("out_scf", OracleTypes.CURSOR);

        return simpleJdbcCall.execute(in);
    }

    public Map<String, Object> insLclValas(String bank, String mandiri, String bri, String bni, String dki, String bca, String uob, String danamon, String bukopin, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_placement_beli_valas");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bca", bca, OracleTypes.VARCHAR)
                .addValue("p_uob", uob, OracleTypes.VARCHAR)
                .addValue("p_danamons", danamon, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_dki", dki, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLclReceipt(String bank, String mandiri, String bri, String bni, String bukopin, String danamon, String cimb, String uob, String maybank, String dki, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_receipt");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_danamons", danamon, OracleTypes.VARCHAR)
                .addValue("p_cimb", cimb, OracleTypes.VARCHAR)
                .addValue("p_uob", uob, OracleTypes.VARCHAR)
                .addValue("p_maybank", maybank, OracleTypes.VARCHAR)
                .addValue("p_dki", dki, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLclImprestOpsPusat(String bank, String mandiri, String bri, String bni, String bukopin, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_imprest_operasi");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLclImprestInvPusat(String bank, String mandiri, String bri, String bni, String bukopin, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_imprest_investasi");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLclImprestPusat(String bank, String mandiri, String bri, String bni, String bukopin, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_imprest");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLclImpor(String bank, String mandiri, String bri, String bni, String bukopin, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_impor");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLclScf(String bank, String mandiri, String bri, String bni, String bukopin, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_placement_scf");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> insLcOptimasiDana(String bank, String mandiri, String bri, String bni, String bukopin, String uob, String btn, String danamons, String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_optimasi_giro");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_mandiri", mandiri, OracleTypes.VARCHAR)
                .addValue("p_bri", bri, OracleTypes.VARCHAR)
                .addValue("p_bni", bni, OracleTypes.VARCHAR)
                .addValue("p_bukopin", bukopin, OracleTypes.VARCHAR)
                .addValue("p_uob", uob, OracleTypes.VARCHAR)
                .addValue("p_btn", btn, OracleTypes.VARCHAR)
                .addValue("p_danamons", danamons, OracleTypes.VARCHAR)
                .addValue("p_id_form", id_form, OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        return out;
    }

    public Map<String, Object> getNotaDinas(String id_form){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("cetak_nota_dinas");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_form", id_form, OracleTypes.CHAR);
        return simpleJdbcCall.execute(in);
    }

    public Map<String, Object> test(){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withProcedureName("create_form_lcl");

        return simpleJdbcCall.execute();
    }

    public Map<String, Object> updatePlacementLclHeader(String idForm, String userId, String status){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("upd_status_lcl");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_form", idForm, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_status", status, OracleTypes.VARCHAR)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        return out;
    }

    public Map<String, Object> reversePlacementLclHeader(String status, String idForm){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("reverse_status_lcl");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_status", status, OracleTypes.VARCHAR)
                .addValue("p_id_form", idForm, OracleTypes.VARCHAR)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        return out;
    }
}
