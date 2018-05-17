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
import javax.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfiguration {

    @PostConstruct
    public void init() throws IOException {
        BufferedInputStream fileInputStream = (BufferedInputStream) (FirebaseConfiguration.class
                .getClassLoader().getResourceAsStream("firebaseAccountService.json"));
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(fileInputStream))
                .setDatabaseUrl("https://fir-lmetalica.firebaseio.com")
                .build();
        FirebaseApp.initializeApp(options);

    }

    @Bean("notificationReference")
    public DatabaseReference notificationReference() {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference databaseReference = database.getReference("lmetalica/notifications");
        return databaseReference;
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        return FirebaseMessaging.getInstance();
    }

}
