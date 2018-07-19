package com.iconpln.liquiditas.core;

import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.core.service.NotificationService;
import java.util.Date;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

//    @Test
    public void save() {
        Notification notification = new Notification();
        notification.setId(10L);
        notification.setCreateBy("ADMIN");
        notification.setCreateDate(new Date().getTime());
        notification.setTitle("Notifikasi");
        notification.setTopic("P000029");
        notification.setMessage("Admin telah login.");
        System.out.println(notificationService.save(notification));
    }

    @Test
    public void findByTopics() {
        System.out.println("****************************");
        List<Notification> notifications = notificationService.findByTopics("admin","P00014,P00015");
        System.out.println(notifications);
        System.out.println("****************************");
    }


}
