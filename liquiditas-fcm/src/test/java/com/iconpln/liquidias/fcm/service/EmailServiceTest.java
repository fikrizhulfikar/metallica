package com.iconpln.liquidias.fcm.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.fcm.Application;
import com.iconpln.liquiditas.fcm.model.FirebaseNotification;
import com.iconpln.liquiditas.fcm.service.DatabaseService;
import com.iconpln.liquiditas.fcm.service.EmailService;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {Application.class, ValasService.class, DatabaseService.class})
public class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ValasService valasService;

    @Autowired
    private DatabaseService databaseService;

    @Test
    public void test() throws IOException {
        List<Map<String, Object>> mapList = valasService.getEmailJatuhTempo();
        List<String> emails = mapList.stream()
                .filter(stringObjectMap -> stringObjectMap.get("email") != null)
                .map(stringObjectMap -> stringObjectMap.get("email").toString())
                .collect(Collectors.toList());
        emails.stream().forEach(email -> {
            List<RekapPembayaran> rekapPembayarans = valasService.getRekapPembayaranByEmail(email);
            emailService.sendEmailWithAttachment(email, "Jetuh Tempo:", "Rekap Pembayaran", "REKAP_PEMBAYARAN.xls", rekapPembayarans);
        });
    }

    @Test
    public void raad() {
//        FirebaseNotification notification = new FirebaseNotification();
//        notification.setBody("UPDATE NYA");
//        notification.setDate(new Date().getTime());
//        notification.setTopic("P00044");
//        notification.setCreateBy("admin");
//        notification.setIcon("ICON.ico");
//        notification.setTitle("UPDATE TITLE");
//        databaseService.saveNotificationByTopic(notification, "P00044");
    }

    @Test
    public void ins() {
//        FirebaseNotification notification = new FirebaseNotification();
//        notification.setBody("INS NYA");
//        notification.setDate(new Date().getTime());
//        notification.setTopic("P00044");
//        notification.setCreateBy("admin");
//        notification.setIcon("ICON.ico");
//        notification.setTitle("INS TITLE");
////        databaseService.saveNotificationByTopic(notification, "P00044");
//            databaseService.saveNotificationByTopic(notification, "P00045");

    }

}
