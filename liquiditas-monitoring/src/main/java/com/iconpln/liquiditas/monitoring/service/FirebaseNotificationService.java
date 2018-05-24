package com.iconpln.liquiditas.monitoring.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import java.io.IOException;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import javax.print.attribute.IntegerSyntax;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FirebaseNotificationService {

    private final Logger logger = LoggerFactory.getLogger(FirebaseNotificationService.class);

    @Autowired
    @Qualifier("notificationReference")
    private DatabaseReference notificationReference;

    @Autowired
    private FirebaseMessaging firebaseMessaging;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private GoogleCredentials googleCredentials;

    public String subscribe(String clientToken, Set<String> topics) {
        AtomicInteger count = new AtomicInteger();
        topics.stream().forEach(topic -> {
            TopicManagementResponse response = null;
            try {
                response = FirebaseMessaging.getInstance()
                        .subscribeToTopicAsync(Collections.singletonList(clientToken), topic).get();
            } catch (InterruptedException e) {
                count.set(-1);
            } catch (ExecutionException e) {
                count.set(-1);
            }
            count.set(response.getSuccessCount());
        });
        return count.get() + " tokens were subscribed successfully: " + topics.toString();
    }

    public void send(FirebaseNotification notification, Set<String> topics) {
        topics.stream().forEach(topic -> {
            /**
             * Notifications
             */
            WebpushConfig webpushConfig = WebpushConfig.builder()
                    .setNotification(new WebpushNotification(notification.getTitle(), notification.getBody(), notification.getIcon()))
                    .build();
            Message message = Message.builder()
                    .setWebpushConfig(webpushConfig)
                    .setTopic(topic)
                    .build();
            logger.info("Send notifications to topic: " + topic);

            try {
                firebaseMessaging.sendAsync(message).get();
                /**
                 * Save notification into firebase realtime database.
                 */

                String key = notificationReference.push().getKey();
                Map<String, Object> map = new HashMap<>();
                notification.setTopic(topic);
                map.put(key, notification);
                notificationReference.updateChildrenAsync(map);
            } catch (InterruptedException e) {
                logger.error(e.getMessage());
            } catch (ExecutionException e) {
                logger.error(e.getMessage());
            }
        });
    }

    public void send(FirebaseNotification notification, String topic) {
        /**
         * Notifications
         */
        WebpushConfig webpushConfig = WebpushConfig.builder()
                .setNotification(new WebpushNotification(notification.getTitle(), notification.getBody(), notification.getIcon()))
                .build();
        Message message = Message.builder()
                .setWebpushConfig(webpushConfig)
                .setTopic(topic)
                .build();
        logger.info("Send notifications to topic: " + topic);

        try {
            firebaseMessaging.sendAsync(message).get();
            /**
             * Save notification into firebase realtime database.
             */

            String key = notificationReference.push().getKey();
            Map<String, Object> map = new HashMap<>();
            notification.setTopic(topic);
            map.put(key, notification);
            notificationReference.updateChildrenAsync(map);
        } catch (InterruptedException e) {
            logger.error(e.getMessage());
        } catch (ExecutionException e) {
            logger.error(e.getMessage());
        }
    }

    public void send(String title, String topic) {
        String username = WebUtils.getUsernameLogin();
        FirebaseNotification firebaseNotification = new FirebaseNotification(title,
                "User \"" + username + "\" menambahkan data dengan jenis pembayaran " + topic + ".",
                "-",false, username);
        send(firebaseNotification, topic);
    }

    public void sendEdit(String title, String id, String topic) {
        String username = WebUtils.getUsernameLogin();
        FirebaseNotification firebaseNotification = new FirebaseNotification(title,
                "User \"" + username + "\" mengubah data dengan jenis pembayaran " + topic + " dan id "+id+".",
                "-",false, username);
        send(firebaseNotification, topic);
    }

    public Map<String, FirebaseNotification> find(String topic) {
        String token = null;
        try {
            token = googleCredentials.refreshAccessToken().getTokenValue();
        } catch (IOException e) {

        }
        String resStr = restTemplate.getForObject("https://fir-lmetalica.firebaseio.com/lmetalica/notifications.json?orderBy=\"topic\"&equalTo=\""+topic+"\"&access_token=" + token, String.class);
        JSONObject object = new JSONObject(resStr);
        Iterator<String> keys = object.keys();
        Map<String, FirebaseNotification> map = new HashMap<>();
        while (keys.hasNext()) {
            String key = keys.next();
            JSONObject jsonObject = object.getJSONObject(key);
            FirebaseNotification notification = new FirebaseNotification(
                    jsonObject.getString("title"),
                    jsonObject.getString("body"),
                    jsonObject.getString("icon"),
                    jsonObject.getBoolean("isSeen"),
                    jsonObject.getString("createBy")
            );
            map.put(key, notification);
        }
        return map;
    }

    public static class FirebaseNotification {

        public String title;
        public String body;
        public String icon;
        public Boolean isSeen;
        public String createBy;
        public String topic;
        public Date date;

        public FirebaseNotification(String title, String body, String icon, Boolean isSeen, String createBy) {
            this.title = title;
            this.body = body;
            this.icon = icon;
            this.isSeen = isSeen;
            this.createBy = createBy;
            this.date = new Date();
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public String getTitle() {
            return title;
        }

        public String getBody() {
            return body;
        }

        public String getIcon() {
            return icon;
        }

        public Boolean getSeen() {
            return isSeen;
        }

        public String getCreateBy() {
            return createBy;
        }

        public String getTopic() {
            return topic;
        }

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("FirebaseNotification{");
            sb.append("title='").append(title).append('\'');
            sb.append(", body='").append(body).append('\'');
            sb.append(", icon='").append(icon).append('\'');
            sb.append(", isSeen=").append(isSeen);
            sb.append(", createBy=").append(createBy);
            sb.append(", topic='").append(topic).append('\'');
            sb.append('}');
            return sb.toString();
        }
    }

}