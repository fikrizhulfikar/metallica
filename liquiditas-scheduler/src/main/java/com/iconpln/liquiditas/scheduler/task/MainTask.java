package com.iconpln.liquiditas.scheduler.task;

import com.iconpln.liquiditas.core.domain.PembelianValas;
import com.iconpln.liquiditas.core.domain.SaldoRekening;
import com.iconpln.liquiditas.core.service.PembelianValasService;
import com.iconpln.liquiditas.core.service.SaldoService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.scheduler.service.BiService;
import com.iconpln.liquiditas.scheduler.service.FtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by israjhaliri on 9/29/17.
 */
@Component
public class MainTask {

    @Autowired
    FtpService ftpService;

    @Autowired
    PembelianValasService pembelianValasService;

    @Autowired
    SaldoService saldoService;

    @Autowired
    BiService biService;

    @Scheduled(cron = "0 0/30 4-7 * * *")
//    @Scheduled(fixedRate = 6000)
    public void runUpdateSaldo() {
        List<SaldoRekening> listSaldo = biService.getListSaldo();

        if (listSaldo.size() > 0) {
            saldoService.insertSaldo(listSaldo);
        } else {
            AppUtils.getLogger(this).info("NO DATA SALDO TO PROCESS FOR");
        }

    }

    @Scheduled(cron = "0 0/30 4-7 * * *")
//    @Scheduled(fixedRate = 6000)
    public void insertSaldoAwalIdr() {
        saldoService.insertSaldoAwalIdr();
    }

    @Scheduled(fixedRate = 600000)
//    @Scheduled(fixedRate = 6000)
    public void runTrValas() {
        String date = AppUtils.getDateByFormat("dd-MM-yyyy");
        List<PembelianValas> pembelianValasList = ftpService.processingFtpValas(";", date);

        if (pembelianValasList.size() > 0) {
            pembelianValasService.insertTrValas(pembelianValasList, date);
        } else {
            AppUtils.getLogger(this).info("NO DATA TR VALAS TO PROCESS FOR");
        }
    }

    @Scheduled(fixedRate = 30000)
    public void testScheduler(){
        System.out.println("Fikri Aulia Zhulfikar");
        AppUtils.getLogger(this).info("FIKRI AULIA ZHULFIKAR");
    }
}
