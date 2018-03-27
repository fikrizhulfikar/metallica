package com.iconpln.liquiditas.scheduler.service;

import com.iconpln.liquiditas.core.domain.SaldoRekening;
import com.iconpln.liquiditas.core.service.SaldoService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by israjhaliri on 1/3/18.
 */
@Service
public class BiService {

    @Autowired
    SaldoService saldoService;

    public List<SaldoRekening> getListSaldo() {
        List<SaldoRekening> saldoRekeningList = new ArrayList<>();

        ArrayList<Map<String, Object>> result = saldoService.getSaldoPerBank();
        result.forEach(o -> {
            SaldoRekening saldoRekening = new SaldoRekening();
            saldoRekening.setBankAccount(o.get("ACCOUNT").toString());
            saldoRekening.setCurrency(o.get("CURRENCY").toString());
            saldoRekening.setEndingAmount(o.get("SALDO").toString());
            saldoRekeningList.add(saldoRekening);
        });
        AppUtils.getLogger(this).debug("RESULT : {}", saldoRekeningList);
        return saldoRekeningList;
    }

}
