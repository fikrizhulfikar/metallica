package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.CashFlow;
import com.iconpln.liquiditas.core.domain.RencanaVsRealisasiIdr;
import com.iconpln.liquiditas.core.utils.AppUtils;

import java.sql.ResultSet;
import java.util.Date;

import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israjhaliri on 8/1/17.
 */
@Repository
public class DashboardService {

    @Autowired
    private PlsqlUtils plsqlUtils;

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    public Map<String, Object> getHedging(Integer pStart, Integer pLength) throws SQLException {

        AppUtils.getLogger(this).debug("data get_hedging search info = " + "start : {}, " + "length : {}, ", pStart, pLength);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_hedging");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_start", pStart)
                .addValue("p_length", pLength)
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_hedging : {}", out);
        return out;
    }

    public Map<String, Object> getDeposito(Integer pStart, Integer pLength) throws SQLException {

        AppUtils.getLogger(this).debug("data get_deposito search info = " + "start : {}, " + "length : {}, ", pStart, pLength);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_deposito");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_start", pStart)
                .addValue("p_length", pLength)
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_deposito : {}", out);
        return out;
    }

    public Map<String, Object> getRealisasiPembayaran(String pYear) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_layer5_tahun");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tahun", pYear)
                .addValue("out_pie1", OracleTypes.CURSOR)
                .addValue("out_pie2", OracleTypes.CURSOR)
                .addValue("out_table2", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_layer5 : {}", out);
        return out;
    }

    public Map<String, Object> getPembelianValas(String pYear) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_pembelian_valas_tahun");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_pie1", OracleTypes.CURSOR)
                .addValue("out_pie2", OracleTypes.CURSOR)
                .addValue("out_table2", OracleTypes.CURSOR)
                .addValue("p_tahun", pYear);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_pembelian_valas : {}", out);
        return out;
    }

    ////////////
    ///pTgl/////
    ///////////
    public Map<String, Object> getRencanaBayarValutaAsingMingguanUsdJpy(String pTglUsd) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_rencana_pembayaran1");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tanggal_akhir", pTglUsd);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("=======================================");
        AppUtils.getLogger(this).info("DATA GET RENCANA BAYAR 1 WITH TGL : {}, : {}", pTglUsd, out);
        AppUtils.getLogger(this).info("=======================================");
        return out;

    }

    public Map<String, Object> getRencanaBayarValutaAsingMingguanEurOthers(String pTgl) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_rencana_pembayaran2");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tanggal_akhir", pTgl);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("=======================================");
        AppUtils.getLogger(this).info("DATA GET RENCANA BAYAR 2 WITH TGL : {} , : {}", pTgl, out);
        AppUtils.getLogger(this).info("=======================================");
        return out;

    }

    public Map<String, Object> getRekening() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_layer1_2");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_usd", OracleTypes.CURSOR)
                .addValue("out_pie_eur", OracleTypes.CURSOR)
                .addValue("out_pie_jpy", OracleTypes.CURSOR)
                .addValue("out_pie_myr", OracleTypes.CURSOR)
                .addValue("out_pie_globalbond", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_layer1 : {}", out);
        return out;
    }

    public Map<String, Object> getDerivatifDeposito() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_derivatif_deposite");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_forward", OracleTypes.CURSOR)
                .addValue("out_pie_callspread", OracleTypes.CURSOR)
                .addValue("out_pie_deposito_usd", OracleTypes.CURSOR)
                .addValue("out_pie_deposito_idr", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_derivatif_deposite : {}", out);
        return out;
    }

    //    idr
    public Map<String, Object> getSaldoIdrImprest() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_saldo_idr1");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_terpusat", OracleTypes.CURSOR)
                .addValue("out_pie_operasi", OracleTypes.CURSOR)
                .addValue("out_pie_investasi", OracleTypes.CURSOR)
                .addValue("out_pie_impor", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getSaldoIdrImprest : {}", out);
        return out;
    }

    public Map<String, Object> getSaldoIdrSubsidiKmk() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_saldo_idr2");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_subsidi", OracleTypes.CURSOR)
                .addValue("out_pie_kmk", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getSaldoIdrSubsidiKmk : {}", out);
        return out;
    }

    public Map<String, Object> getSaldoIdrReceipt() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_saldo_idr3");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_receipt", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getSaldoIdrReceipt : {}", out);
        return out;
    }

    public Map<String, Object> getRencanaBayarImprestOperasiTerpusat(String tanggalAkhir) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_rencana_bayar_idr1");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tanggal_akhir", tanggalAkhir);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getRencanaBayarImprestOperasiTerpusat : {} ", tanggalAkhir, out);
        return out;
    }

    public Map<String, Object> getRencanaBayarImprestDanImport(String tanggalAkhir) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_rencana_bayar_idr2");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tanggal_akhir", tanggalAkhir);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getRencanaBayarImprestDanImport : {}", tanggalAkhir, out);
        return out;
    }

    public Map<String, Object> getRencanaBayarEquivalenRupiah(String tanggalAkhir) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_rencana_bayar_idr3");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tanggal_akhir", tanggalAkhir);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getRencanaBayarEquivalenRupiah : {}", tanggalAkhir, out);
        System.out.println("tanggalAkhir "+tanggalAkhir);
        return out;
    }

    public Map<String, Object> getRealisasiPlacement() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_dash_placement");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_pie_valas", OracleTypes.CURSOR)
                .addValue("out_pie_operasi", OracleTypes.CURSOR)
                .addValue("out_pie_investasi", OracleTypes.CURSOR)
                .addValue("out_pie_imprest", OracleTypes.CURSOR)
                .addValue("out_pie_impor", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getRencanaBayarEquivalenRupiah : {}", out);
        return out;
    }

    public Map<String, Object> getReportDetailPlacement(String jenis) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_report_detil_placement");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_jenis", jenis);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getReportDetailPlacement : {}", jenis, out);
        return out;
    }

    public Map<String, Object> getRekapJenisPembayaran() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_rekap_jenis_pembayaran");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getRekapJenisPembayaran : {}", out);
        return out;
    }

    public Map<String, Object> getRencanaVsRealisasiIdr() {
        List<RencanaVsRealisasiIdr> result = plsqlUtils.function("pkg_dashboard_idr",
                "get_rencana_vs_realisasi",
                "out_data",
                (resultSet, i) -> {
                    RencanaVsRealisasiIdr rencanaVsRealisasiIdr = new RencanaVsRealisasiIdr();
                    rencanaVsRealisasiIdr.setIdr(AppUtils.getInstance().formatDecimalCurrency(resultSet.getBigDecimal("IDR")));
                    rencanaVsRealisasiIdr.setEur(AppUtils.getInstance().formatDecimalCurrency(resultSet.getBigDecimal("EUR")));
                    rencanaVsRealisasiIdr.setJpy(AppUtils.getInstance().formatDecimalCurrency(resultSet.getBigDecimal("JPY")));
                    rencanaVsRealisasiIdr.setUsd(AppUtils.getInstance().formatDecimalCurrency(resultSet.getBigDecimal("USD")));
                    rencanaVsRealisasiIdr.setOther(AppUtils.getInstance().formatDecimalCurrency(resultSet.getBigDecimal("OTHER")));
                    rencanaVsRealisasiIdr.setJatuhTempo(resultSet.getDate("JATUH_TEMPO").getTime());
                    rencanaVsRealisasiIdr.setJenisPembayaran(resultSet.getString("JENIS_PEMBAYARAN"));
                    rencanaVsRealisasiIdr.setStatus(resultSet.getString("STATUS"));
                    rencanaVsRealisasiIdr.setStausValas(resultSet.getString("STATUS_VALAS"));
                    return rencanaVsRealisasiIdr;
                },
        new MapSqlParameterSource());
        Map<String, Object> out = new HashMap<>();
        out.put("return", result);
        out.put("tglcetak", new Date().getTime());
        AppUtils.getLogger(this).info("data getRencanaVsRealisasi : {}", out);
        return out;
    }

    public Map<String, Object> getRencanaVsRealisasiIdrByTgl(String tglPencarian) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_rencana_realisasi_by_date");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tanggal", tglPencarian);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        out.put("tglcetak", new Date());
        AppUtils.getLogger(this).info("data getRencanaVsRealisasiByTgl : {}", out);
        return out;
    }

    public Map<String, Object> getCashFlow() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("package_cashflow")
                .withFunctionName("get_rekap_cashflow");
        Map<String, Object> out = simpleJdbcCall.execute();
        out.put("tglcetak", new Date());
        AppUtils.getLogger(this).info("data cashFlow : {}", out);
        return out;
    }

    public Map<String, Object> insCashFlow(CashFlow cashFlow) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("package_cashflow")
                .withProcedureName("ins_cashflow");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("in_nourut", cashFlow.getNoUrut(), OracleTypes.NUMBER)
                .addValue("in_tanggal", cashFlow.getTanggal(), OracleTypes.VARCHAR)
                .addValue("in_nilai", cashFlow.getNilai(), OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data insCashFlow : {}", out);
        return out;
    }

}
