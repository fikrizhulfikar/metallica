package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FcmTest {

    private static final String token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJpYXQiOjE1Mjc0NzkzOTQsImV4cCI6MTUyNzU2NTc5NCwidXNlcm5hbWUiOiJhZG1pbiJ9.FHViUv8I-F8k2y0PkI2HLYClkjENF5QvPPEZgRYhogftIxNqbsn2P5PjYeWKt-tfkdsn3T4-nNer6BWaQtNj2Q";

    @Autowired
    private NotificationUtil notificationService;

    @Autowired
    private RestTemplate restTemplate;

    @Test
    public void notifyTest() {
//        try {
//            notificationService.sendNotification(
//                    "Inilah title-nya",
//                    "Hoaamm!!..",
//                    "Zzzz.png",
//                    false,
//                    "admin",
//                    "t01",
//                    new Date()
//            );
//        } catch (URISyntaxException e) {
//            e.printStackTrace();
//        }
    }

    @Test
    public void getNotificationTest() {
//        Set<String> topics = new HashSet<>();
//        topics.add("t01");
//        notificationService.getNotification(topics, token)
//                .getBody().forEach((s, firebaseNotification) -> {
//            System.out.println(firebaseNotification);
//        });
    }

    @Test
    public void login() {

    }
}
