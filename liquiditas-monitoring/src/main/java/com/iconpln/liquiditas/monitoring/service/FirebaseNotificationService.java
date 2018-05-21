package com.iconpln.liquiditas.monitoring.service;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.google.gson.Gson;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiConsumer;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class FirebaseNotificationService {

    private final Logger logger = LoggerFactory.getLogger(FirebaseNotificationService.class);

    @Autowired
    @Qualifier("notificationReference")
    private DatabaseReference notificationReference;

    @Autowired
    private FirebaseMessaging firebaseMessaging;

    private String topic = "lmetalica_topic";

    public String subscribe(String clientToken) {
        try {
            TopicManagementResponse response = FirebaseMessaging.getInstance()
                    .subscribeToTopicAsync(Collections.singletonList(clientToken), topic).get();
            return response.getSuccessCount() + " tokens were subscribed successfully";
        }
        catch (InterruptedException | ExecutionException e) {
            return "subscribe: " + e;
        }
    }

    public void send(FirebaseNotification notification) {
        /**
         * Notifications
         */
        WebpushConfig webpushConfig = WebpushConfig.builder()
                .setNotification(new WebpushNotification(notification.title, notification.body, notification.icon))
                .build();
        Message message = Message.builder()
                .setWebpushConfig(webpushConfig)
                .setTopic(topic)
                .build();

        try {
            firebaseMessaging.sendAsync(message).get();
            /**
             * Save notification into firebase realtime database.
             */

            String key = notificationReference.push().getKey();
            Map<String, Object> map = new HashMap<>();
            map.put(key, notification);
            notificationReference.updateChildrenAsync(map);
        } catch (InterruptedException e) {
            logger.error(e.getMessage());
        } catch (ExecutionException e) {
            logger.error(e.getMessage());
        }
    }

    public FirebaseNotification findAll() {
            notificationReference.getParent().addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                String json = new Gson().toJson(dataSnapshot.getValue());
                String jsonKey = new Gson().toJson(dataSnapshot.getKey());
                WebpushConfig webpushConfig = WebpushConfig.builder()
                        .setNotification(new WebpushNotification("sd", dataSnapshot.getValue().toString(), "DSFS"))
                        .build();
                Message message = Message.builder()
                        .setWebpushConfig(webpushConfig)
                        .setTopic(topic)
                        .build();

                firebaseMessaging.sendAsync(message);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
            }
        });
        return null;
    }

    public static class FirebaseNotification {

        public String title;
        public String body;
        public String icon;
        public Boolean isSeen;

        public FirebaseNotification() {}

    }

}
