package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.CashFlow;
import com.iconpln.liquiditas.core.domain.RencanaVsRealisasiIdr;
import com.iconpln.liquiditas.core.utils.AppUtils;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.Types;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;

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
        AppUtils.getLogger(this).info("data listrencanavsrealisasibknxls : {}", result.get(0).toString());
        return out;
    }

    public Map<String, Object> getRencanaVsRealisasiIdrXls(String tglPencarian) throws SQLException {
        Map<String, Object> out;
        SqlParameterSource in;
        SimpleJdbcCall simpleJdbcCall;
        if(tglPencarian == ""){
            simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("pkg_dashboard_idr")
                    .withFunctionName("get_rencana_vs_realisasi");

            in = new MapSqlParameterSource()
                    .addValue("out_data", OracleTypes.CURSOR);

        }
        else {
            simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("pkg_dashboard_idr")
                    .withFunctionName("get_rencana_vs_realisasi");
            in = new MapSqlParameterSource()
                    .addValue("p_tanggal", tglPencarian);
        }
        out = simpleJdbcCall.execute(in);

        List<Map<String, Object>> ret = (List<Map<String, Object>>)out.get("return");
        DateFormat df = new SimpleDateFormat("dd-MM-yyyy");
        for(int x = 0; x<ret.size();x++){
            for(String key : ret.get(x).keySet()){
                if(key.equals("JATUH_TEMPO")){
                    ret.get(x).put(key, df.format(ret.get(x).get(key)));
                }
                else if(key.equals("IDR") || key.equals("USD") || key.equals("JPY") || key.equals("EUR") || key.equals("OTHER")){
                    ret.get(x).put(key, AppUtils.getInstance().formatDecimalCurrency((BigDecimal) ret.get(x).get(key)));
                }
            }
        }
        out.clear();
        out.put("return", ret);

        AppUtils.getLogger(this).info("data getRencanaVsRealisasiIdrXls {}: {}", tglPencarian, out);
        return out;
    }

    public Map<String, Object> getRencanaVsRealisasiIdrByTgl(String tglPencarian) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("p_tanggal", tglPencarian);
        List<RencanaVsRealisasiIdr> result = plsqlUtils.function("pkg_dashboard_idr",
                "get_rencana_realisasi_by_date",
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
                parameters);
        Map<String, Object> out = new HashMap<>();
        out.put("return", result);
        out.put("tglcetak", new Date().getTime());
        AppUtils.getLogger(this).info("data getRencanaVsRealisasiByTgl {} : {}", tglPencarian, out);
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

    public Map<String, Object> getCashFlowXls() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("package_cashflow")
                .withFunctionName("get_rekap_cashflow");
        Map<String, Object> out = simpleJdbcCall.execute();
        List<Map<String, Object>> ret = (List<Map<String, Object>>)out.get("return");
        for(int x = 0; x<ret.size();x++){
            for(String key : ret.get(x).keySet()){
                if(key.equals("TANGGAL1") || key.equals("TANGGAL2") || key.equals("TANGGAL3") || key.equals("TANGGAL4") || key.equals("TANGGAL5") || key.equals("TANGGAL6") || key.equals("TANGGAL7")){
                    ret.get(x).put(key, AppUtils.getInstance().formatDecimalCurrency((BigDecimal) ret.get(x).get(key)));
                }
            }
        }

        List newList = new ArrayList();
        Map<String, String> dates = new HashMap<>();
        for (int x=0; x<7; x++){
            dates.put("TANGGAL_"+(x+1), AppUtils.getDateByPlus(x));
        }
        newList.add(dates);
        out.put("dates", newList);
        out.put("return", ret);
        AppUtils.getLogger(this).info("data cashFlowXls : {}", out);
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

    public List<Map<String, Object>> getDashboard(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_header");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public List<Map<String, Object>> getDashboardBank(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_bank");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR)
                .addValue("out_tanggal", OracleTypes.CURSOR);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public List<Map<String, Object>> getDashboardPembayaran(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_cashcode");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public List<Map<String, Object>> getDashboardRekening(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_jenis");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public List<Map<String, Object>> getDashboardVendor(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_vendor");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public List<Map<String, Object>> getDashboardRealisasi(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_header_real");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDahsboardRealBank(String tanggal_awal, String tanggal_akhir){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_real_bank");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggalawal", tanggal_awal)
                .addValue("ptanggalakhir", tanggal_akhir);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
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

    public Map<String, Object> getRenPembayaran()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_tagihan_cashcode");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_bar_cashcode", OracleTypes.CURSOR)
                .addValue("out_hari", OracleTypes.CURSOR)
                .addValue("out_minggu", OracleTypes.CURSOR)
                .addValue("out_bulan", OracleTypes.CURSOR)
                .addValue("out_bar_cashcode_real", OracleTypes.CURSOR)
                .addValue("out_hari_real", OracleTypes.CURSOR)
                .addValue("out_minggu_real", OracleTypes.CURSOR)
                .addValue("out_bulan_real", OracleTypes.CURSOR)
                .addValue("out_tahun_real", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_tagihan_cashcode : {}", out);
        return out;
    }

    public Map<String, Object> getRealPembayaran()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_realisasi_cashcode");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_bar_cashcode", OracleTypes.CURSOR)
                .addValue("out_hari", OracleTypes.CURSOR)
                .addValue("out_minggu", OracleTypes.CURSOR)
                .addValue("out_bulan", OracleTypes.CURSOR)
                .addValue("out_tahun", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_realisasi_cashcode : {}", out);
        return out;
    }

    public Map<String, Object> getAnaRealPembayaran()throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get4a_rencana_vs_real");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_data", OracleTypes.CURSOR)
                .addValue("out_line", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get4a_rencana_vs_real : {}", out);
        return out;
    }

    //Update Senin, 17/2/2020

    public List<Map<String, Object>> getDashboardRencanaVendor( String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_vendor");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDashboardRealVendor( String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_real_vendor");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDahsboardRealBankCurr(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_real_bank_curr");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDashboardRealCashcode(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_real_cashcode");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDashboardRealJenis( String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_real_jenis");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDashboardRencanaImprest(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_imprest");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> getDashboardRencanaValas(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_dashboard_rencana_valas");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public Map<String, Object> getRealisasiPembayaranCashcode(String pTglAwal, String pTglAkhir, String pBank, String pCashCode) throws SQLException {

        AppUtils.getLogger(this).debug("data getRealisasiPembayaranCashcode search info = " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCashCode : {}, ",

                pTglAwal, pTglAkhir, pBank, pCashCode);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_CORPAY")
                .withFunctionName("get_cashcode_realisasi");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total_usd", OracleTypes.CURSOR)
                .addValue("out_total_eur", OracleTypes.CURSOR)
                .addValue("out_total_jpy", OracleTypes.CURSOR)
                .addValue("out_total_idr", OracleTypes.CURSOR)
                .addValue("eq_idr_usd", OracleTypes.CURSOR)
                .addValue("eq_idr_eur", OracleTypes.CURSOR)
                .addValue("eq_idr_jpy", OracleTypes.CURSOR)
                .addValue("eq_idr_rp", OracleTypes.CURSOR)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cash_code", pCashCode, Types.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_cashcode_realisasi : {}", out);
        return out;
    }

    public Map<String, Object> getSaldoRekeningValutaAsing() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_rekening_valas");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total_usd", OracleTypes.CURSOR)
                .addValue("out_total_eur", OracleTypes.CURSOR)
                .addValue("out_total_jpy", OracleTypes.CURSOR)
                .addValue("out_total_myr", OracleTypes.CURSOR)
                .addValue("eq_idr_usd", OracleTypes.CURSOR)
                .addValue("eq_idr_eur", OracleTypes.CURSOR)
                .addValue("eq_idr_jpy", OracleTypes.CURSOR)
                .addValue("eq_idr_myr", OracleTypes.CURSOR)
                .addValue("out_pie_usd", OracleTypes.CURSOR)
                .addValue("out_pie_eur", OracleTypes.CURSOR)
                .addValue("out_pie_jpy", OracleTypes.CURSOR)
                .addValue("out_pie_myr", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_rekening_valas : {}", out);
        return out;
    }

    public Map<String, Object> insPengadaanValas(String pData) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("ins_proyeksi_pengadaan_valas");
        SqlParameterSource in;
        Map<String, Object> out = null;
        System.out.println("pData: "+pData);
        JSONArray jsonArray = new JSONArray(pData);

        try {
            for (int index = 0; index < jsonArray.length(); index++){
                JSONObject obj = jsonArray.getJSONObject(index);
                System.out.println(obj);
                in = new MapSqlParameterSource()
                        .addValue("p_kode_currency", obj.get("kdcurrency"))
                        .addValue("p_kode_bank", obj.get("kdbank"))
                        .addValue("p_h0", obj.get("potensi_h0"))
                        .addValue("p_h1", obj.get("potensi_h1"))
                        .addValue("p_h2", obj.get("potensi_h2"))
                        .addValue("p_h3", obj.get("potensi_h3"))
                        .addValue("p_h4", obj.get("potensi_h4"))
                        .addValue("p_h5", obj.get("potensi_h5"))
                        .addValue("p_h6", obj.get("potensi_h6"));
                out = simpleJdbcCall.execute(in);
                AppUtils.getLogger(this).info("data ins_proyeksi_pengadaan_valas {}: {}", obj.get("kdbank"), out);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return out;
    }

    public List<Map<String, Object>> getProyeksiPengadaanKebutuhanValas(String tanggal){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_VALAS")
                .withFunctionName("get_proyeksi_pengadaan_valas");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("ptanggal", tanggal, OracleTypes.VARCHAR)
                .addValue("out_tanggal", OracleTypes.CURSOR);
        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, in);
        return out;
    }

    public Map<String, Object> getSaldoRekeningRupiah() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_DASHBOARD_IDR")
                .withFunctionName("get_saldo_rekidr");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_total", OracleTypes.CURSOR)
                .addValue("out_pie_imprest_kp", OracleTypes.CURSOR)
                .addValue("out_pie_receipt", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_saldo_rekidr : {}", out);
        return out;
    }
}
