package com.iconpln.liquiditas.monitoring.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.messaging.FirebaseMessaging;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import javax.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class FirebaseConfiguration {

    @PostConstruct
    @Bean
    public GoogleCredentials googleCredentials() throws IOException {
        BufferedInputStream fileInputStream = (BufferedInputStream) (FirebaseConfiguration.class
                .getClassLoader().getResourceAsStream("firebaseAccountService.json"));

        GoogleCredentials googleCredentials = GoogleCredentials.fromStream(fileInputStream);
        GoogleCredentials scoped = googleCredentials.createScoped(
                Arrays.asList(
                    "https://www.googleapis.com/auth/firebase.database",
                    "https://www.googleapis.com/auth/userinfo.email"
                )
        );
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(googleCredentials)
                .setDatabaseUrl("https://fir-lmetalica.firebaseio.com")
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

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        return FirebaseMessaging.getInstance();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}
