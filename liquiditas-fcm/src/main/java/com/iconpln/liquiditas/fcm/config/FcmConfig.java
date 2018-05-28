package com.iconpln.liquiditas.fcm.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.messaging.FirebaseMessaging;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.util.Arrays;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriTemplateHandler;

/**
 * Firebase cloud messaging configuration.
 * @author Langkuy <contact@ardikars.com>
 */
@Configuration("fcmConfig")
public class FcmConfig {

    @Value("${fcm.account.service}")
    private String accoutService;

    @Value("${fcm.database.url}")
    private String databaseUrl;

    @PostConstruct
    @Bean("googleCredentials")
    public GoogleCredentials googleCredentials() throws IOException {
        BufferedInputStream fileInputStream = (BufferedInputStream) (FcmConfig.class
                .getClassLoader().getResourceAsStream(accoutService));

        GoogleCredentials googleCredentials = GoogleCredentials.fromStream(fileInputStream);
        GoogleCredentials scoped = googleCredentials.createScoped(
                Arrays.asList(
                        "https://www.googleapis.com/auth/firebase.database",
                        "https://www.googleapis.com/auth/userinfo.email"
                )
        );
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(googleCredentials)
                .setDatabaseUrl(databaseUrl)
                .build();
        FirebaseApp.initializeApp(options);
        return scoped;
    }

    @Bean("notificationReference")
    public DatabaseReference notificationReference() {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference databaseReference = database.getReference("/lmetalica/notifications");
        return databaseReference;
    }

    @Bean("firebaseMessaging")
    public FirebaseMessaging firebaseMessaging() {
        return FirebaseMessaging.getInstance();
    }

    @Bean("restTemplate")
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
        DefaultUriTemplateHandler uriTemplateHandler = new DefaultUriTemplateHandler();
        uriTemplateHandler.setBaseUrl(databaseUrl);
        restTemplate.setUriTemplateHandler(uriTemplateHandler);
        return restTemplate;
    }

}
