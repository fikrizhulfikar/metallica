package com.iconpln.liquiditas.monitoring.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import java.util.concurrent.ExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FirebaseNotificationService {

    private final Logger logger = LoggerFactory.getLogger(FirebaseNotificationService.class);

    private String topic = "lmetalica_topic";

    public void send() {
        Message message = Message.builder()
                .putData("id", "ini nanti kata mas dias")
                .setTopic(topic)
                .build();
        String response = null;
        try {
            response = FirebaseMessaging.getInstance().sendAsync(message).get();
        } catch (InterruptedException e) {
            logger.info("Failed to sent message: " + e.getMessage());
        } catch (ExecutionException e) {
            e.printStackTrace();
            logger.info("Failed sent message: " + e.getMessage());
        }
    }

}
