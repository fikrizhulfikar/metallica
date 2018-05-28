package com.iconpln.liquiditas.fcm.service;

import com.google.common.base.Preconditions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.iconpln.liquiditas.fcm.model.FirebaseNotification;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Service("notificationService")
public class NotificationService {

    private final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private FirebaseMessaging firebaseMessaging;

    @Autowired
    public NotificationService(FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    /**
     * Subscribe to topic.
     * @param clientToken client token.
     * @param topics topics.
     * @return returns the number of successfully subcribed topics.
     */
    public String subscribeToTopic(String clientToken, Set<String> topics) {
        Preconditions.checkArgument(clientToken != null, "Token must be not null.");
        Preconditions.checkArgument(topics != null, "Topics must be not null.");
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
            if (response != null) {
                count.set(response.getSuccessCount());
            }
        });
        return count.get() + " tokens were subscribed successfully: " + topics.toString();
    }

    /**
     * Send message to topic.
     * @param notification message.
     * @param topic topic.
     */
    public void sendMessageToTopic(FirebaseNotification notification, String topic) {
        Preconditions.checkArgument(notification != null, "Notification must be not null.");
        Preconditions.checkArgument(topic != null, "Topic must be not null.");
        WebpushConfig webpushConfig = WebpushConfig.builder()
                .setNotification(new WebpushNotification(notification.getTitle(), notification.getBody(), notification.getIcon()))
                .build();
        Message message = Message.builder()
                .setWebpushConfig(webpushConfig)
                .setTopic(topic)
                .build();
        firebaseMessaging.sendAsync(message);
    }

    /**
     * Subscribe to topics
     * @param clientToken client token.
     * @param topics list of topic.
     * @return returns number of successfully subcribed token.
     */
    public String subscribe(String clientToken, List<String> topics) {
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

}
