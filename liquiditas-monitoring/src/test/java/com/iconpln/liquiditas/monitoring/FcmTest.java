package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.monitoring.config.UserDetailWrapper;
import com.iconpln.liquiditas.monitoring.service.NotificationService;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FcmTest {

    private static final String token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJsb2NhbGhvc3QiLCJpYXQiOjE1Mjc0NzkzOTQsImV4cCI6MTUyNzU2NTc5NCwidXNlcm5hbWUiOiJhZG1pbiJ9.FHViUv8I-F8k2y0PkI2HLYClkjENF5QvPPEZgRYhogftIxNqbsn2P5PjYeWKt-tfkdsn3T4-nNer6BWaQtNj2Q";

    @Autowired
    private NotificationService notificationService;

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
