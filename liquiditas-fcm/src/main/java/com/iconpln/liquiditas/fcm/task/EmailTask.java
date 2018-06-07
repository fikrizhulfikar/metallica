package com.iconpln.liquiditas.fcm.task;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.fcm.service.EmailService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Import(ValasService.class)
public class EmailTask {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ValasService valasService;

    @Scheduled(cron = "0 0 7 * * *")
    public void send() {
        List<Map<String, Object>> mapList = valasService.getEmailJatuhTempo();
        List<String> emails = mapList.stream()
                .map(stringObjectMap -> stringObjectMap.get("email").toString())
                .collect(Collectors.toList());
        emails.stream().forEach(email -> {
            List<RekapPembayaran> rekapPembayarans = valasService.getRekapPembayaranByEmail(email);
            emailService.sendEmailWithAttachment(email, "Jatuh Tempo:", "Rekap Pembayaran", "REKAP_PEMBAYARAN.xls", rekapPembayarans);
        });
    }

}
