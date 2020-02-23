package com.iconpln.liquiditas.core;

import com.iconpln.liquiditas.core.domain.PembelianValas;
import com.iconpln.liquiditas.core.domain.SaldoRekening;
//import com.iconpln.liquiditas.core.service.DashboardService;
import com.iconpln.liquiditas.core.service.MasterService;
import com.iconpln.liquiditas.core.service.PembelianValasService;
import com.iconpln.liquiditas.core.service.SaldoService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class RepositoryTests {

    @Test
    public void contextLoads() throws SQLException {
    }

    @Autowired
    PembelianValasService pembelianValasService;

//    @Autowired
//    DashboardService dashboardService;

    @Autowired
    SaldoService saldoService;

    @Autowired
    MasterService masterService;


    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }


//    @Test
//    public void getInsRencanaBayarUsdJpy() throws SQLException {
//         dashboardService.getRencanaBayarValutaAsingMingguanUsdJpy("");
//    }
//    @Test
//    public void getInsRencanaBayarEur() throws SQLException {
//         dashboardService.getRencanaBayarValutaAsingMingguanEurOthers("");
//    }

    @Test
    public void getTests() {


    }

    @Test
    public void insertTrValasTests() {
        List<PembelianValas> pembelianValaseList = new ArrayList();
        String date = AppUtils.getDateByFormat("dd-MM-yyyy");

        PembelianValas pembelianValas = new PembelianValas();
        pembelianValas.setIdBeliValas(null);
        pembelianValas.setCurrency("USD");
        pembelianValas.setTglPosting("01-09-2016");
        pembelianValas.setBankPengirim("BRI32");
        pembelianValas.setBankPenerima("BRI11");
        pembelianValas.setPembelian("500000000");
        pembelianValas.setKurs("1326400");
        pembelianValas.setKonversiIdr("66320000000");
        pembelianValas.setNoSettlement(510012);
        pembelianValas.setPayReq(32920);
        pembelianValas.setDoc1(100021150);
        pembelianValas.setDoc2(100021151);
        pembelianValas.setCreateDate(date);
        pembelianValas.setCreateBy("VALAS SCHEDULER");
        pembelianValas.setUpdateDate(null);
        pembelianValas.setUpdateBy(null);

        pembelianValaseList.add(pembelianValas);
        AppUtils.getLogger(this).info("TR VALAS LOG TEST : {}", pembelianValas.toString());
        int res = pembelianValasService.insertTrValas(pembelianValaseList, date);
        Assert.assertEquals(1, res);
    }


    @Test
    public void updateSaldoTests() {
        List<SaldoRekening> saldoRekeningList = new ArrayList();

        SaldoRekening saldoRekening;
        saldoRekening = new SaldoRekening();
        saldoRekening.setCompanyCode(null);
        saldoRekening.setSendingBank(null);
        saldoRekening.setStatementDate(null);
        saldoRekening.setBankAccount("0110921040");
        saldoRekening.setGlAccount(null);
        saldoRekening.setChartOfAccount(null);
        saldoRekening.setCurrency("USD");
        saldoRekening.setEndingAmount("1234568");
        saldoRekening.setHousebank(null);
        saldoRekening.setAccountId(null);
        saldoRekeningList.add(saldoRekening);

        saldoRekening = new SaldoRekening();
        saldoRekening.setCompanyCode(null);
        saldoRekening.setSendingBank(null);
        saldoRekening.setStatementDate(null);
        saldoRekening.setBankAccount("0017377707");
        saldoRekening.setGlAccount(null);
        saldoRekening.setChartOfAccount(null);
        saldoRekening.setCurrency("USD");
        saldoRekening.setEndingAmount("1234");
        saldoRekening.setHousebank(null);
        saldoRekening.setAccountId(null);
        saldoRekeningList.add(saldoRekening);

        AppUtils.getLogger(this).info("SALDO REKENING LOG TEST : {}", saldoRekeningList.toString());
        int res = saldoService.insertSaldo(saldoRekeningList);
        Assert.assertEquals(1, res);
    }

    @Test
    public void getDataTests() throws SQLException {

        for(int i=0; i < 10; i++){
            List<Map<String,Object>> listData = masterService.getListKursJidor();
            AppUtils.getLogger(this).info("GET DATA LOG TEST : {}", listData);
        }


    }




}
