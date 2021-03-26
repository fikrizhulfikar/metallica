package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class SupplyChainFinancingService {

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getListScf(
            Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir,
            String pBank, String pCurr, String pJenisPembayaran
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_scf_non_loan");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, OracleTypes.INTEGER)
                .addValue("p_length", pLength, OracleTypes.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, OracleTypes.VARCHAR)
                .addValue("p_bank", pBank, OracleTypes.VARCHAR)
                .addValue("p_currency", pCurr, OracleTypes.VARCHAR)
                .addValue("p_jenis_pembayaran", pJenisPembayaran, OracleTypes.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        return resultset;
    }

    public Map<String, Object> insScf(
        String pIdScf, String pKodeBank, String pTglTransaksi, String pJatuhTempo, String pVendor, String pJenisPembayaran,
        String pCurrency, String pNominal, String pSukuBunga, String pProvisi, String pUserId
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("ins_scf_non_loan");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScf)
                .addValue("p_bank", pKodeBank)
                .addValue("p_tgl_transaksi", pTglTransaksi)
                .addValue("p_tgl_jatuh_tempo", pJatuhTempo)
                .addValue("p_vendor", pVendor)
                .addValue("p_jenis_pembayaran", pJenisPembayaran)
                .addValue("p_currency", pCurrency)
                .addValue("p_nominal", pNominal)
                .addValue("p_suku_bunga", pSukuBunga)
                .addValue("p_provisi", pProvisi)
                .addValue("p_user_id", pUserId);
        Map<String, Object> out = simpleJdbcCall.execute(params);
        return out;
    }

    public Map<String, Object> deleteScf(String pIdScf){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("del_scf_non_loan");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScf)
                .addValue("out_msg", OracleTypes.VARCHAR);
        return simpleJdbcCall.execute(params);
    }

    public List<Map<String, Object>> getScfById(String pIdScf){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_scf_non_loan_byid");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScf);
        return simpleJdbcCall.executeFunction(ArrayList.class,params);
    }

    public Map<String, Object> uploadFileRekap(String pIdValas, String pJenisFile, BigDecimal pFileSize, String pFileName, String pUpdateBy) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("upload_file_scf");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdValas)
                .addValue("p_jenis_file", pJenisFile)
                .addValue("p_file_size", pFileSize)
                .addValue("p_nama_file", pFileName)
                .addValue("p_update_by", pUpdateBy);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data uploadFileRekap : {}", out);
        return out;
    }

    public Map<String, Object> getListFilesScf(String pIdScf) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY2")
                .withFunctionName("get_list_file_scf");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScf);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getFilesRekap : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListScfCollateral(
            Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir,
            String pBank, String pCurr, String pJenisPembayaran
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_scf");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, OracleTypes.INTEGER)
                .addValue("p_length", pLength, OracleTypes.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, OracleTypes.VARCHAR)
                .addValue("p_bank", pBank, OracleTypes.VARCHAR)
                .addValue("p_cur", pCurr, OracleTypes.VARCHAR)
                .addValue("p_jenis_pembayaran", pJenisPembayaran, OracleTypes.VARCHAR);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        return resultset;
    }

    public Map<String, Object> insScfCollateral(
            String pIdScfCol, String pKodeBank, String pTglTransaksi, String pJatuhTempo, String pVendor, String pJenisPembayaran,
            String pCurrency, String pOriCurr, String pKurs, String pFeeTransaksi, String pCashCollateral, String pPajak, String pJasaGiro, String pUserId
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("ins_scf");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScfCol)
                .addValue("p_kode_bank", pKodeBank)
                .addValue("p_tgl_transaksi", pTglTransaksi)
                .addValue("p_jatuh_tempo", pJatuhTempo)
                .addValue("p_vendor", pVendor)
                .addValue("p_jenis_pembayaran", pJenisPembayaran)
                .addValue("p_currency", pCurrency)
                .addValue("p_ori_currency", pOriCurr)
                .addValue("p_kurs", pKurs)
                .addValue("p_fee_transaksi", pFeeTransaksi)
                .addValue("p_cash_collateral", pCashCollateral)
                .addValue("p_pajak", pPajak)
                .addValue("p_rate_jasa_giro", pJasaGiro)
                .addValue("p_user_id", pUserId);
        Map<String, Object> out = simpleJdbcCall.execute(params);
        return out;
    }

    public List<Map<String, Object>> getScfCollateralById(String pIdScf){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_scf_byId");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScf);
        return simpleJdbcCall.executeFunction(ArrayList.class,params);
    }

    public Map<String, Object> deleteScfCollateral(String pIdScf){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("del_scf");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_scf", pIdScf)
                .addValue("out_msg", OracleTypes.VARCHAR);
        return simpleJdbcCall.execute(params);
    }
}
