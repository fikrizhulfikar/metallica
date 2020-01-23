package com.iconpln.liquiditas.scheduler;

import com.iconpln.liquiditas.core.domain.PembelianValas;
import com.iconpln.liquiditas.core.domain.SaldoRekening;
import com.iconpln.liquiditas.core.service.SaldoService;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.scheduler.service.BiService;
import com.iconpln.liquiditas.scheduler.service.FtpService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ServiceTests {

    @Autowired
    FtpService ftpService;

    @Autowired
    SaldoService saldoService;

    @Autowired
    ValasService valasService;

    @Autowired
    BiService biService;

    @Test
    public void contextLoads() {
        AppUtils.getLogger(this).debug("RUN SERVICE TESTS");
    }

    @Test
    public void setValasService() throws SQLException {
        Map<String, Object> param =  valasService.getPlacementAwal("");
        for (Map.Entry<String, Object> entry : param.entrySet()) {

        }
    }

    @Test
    public void prcessingFtpSaldoTests() throws Exception {
        List<SaldoRekening> saldoRekeningList = ftpService.processingFtpSaldo(";");
        Assert.assertNotEquals(0, saldoRekeningList.size());
    }

    @Test
    public void prcessingFtpValasTests() throws Exception {
        List<PembelianValas> pembelianValaseList = ftpService.processingFtpValas(";", AppUtils.getDateByFormat("dd-MM-yyyy"));
        Assert.assertNotEquals(0, pembelianValaseList.size());
    }

    @Test
    public void getSaldoFromBi() throws Exception {
        List<SaldoRekening> listSaldo = biService.getListSaldo();
        saldoService.insertSaldo(listSaldo);
    }
}
