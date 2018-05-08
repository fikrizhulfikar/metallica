package com.iconpln.liquiditas.monitoring.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfiguration {

    @Bean
    public FirebaseOptions firebaseOptions() throws IOException {
        BufferedInputStream fileInputStream = (BufferedInputStream) FirebaseConfiguration.class
                .getClassLoader().getResourceAsStream("firebaseAccountService.json");
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(fileInputStream))
                .setDatabaseUrl("https://fir-lmetalica.firebaseio.com")
                .build();
        FirebaseApp.initializeApp(options);
        return options;
    }

}
