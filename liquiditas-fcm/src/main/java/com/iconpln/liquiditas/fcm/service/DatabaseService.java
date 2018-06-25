package com.iconpln.liquiditas.fcm.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.common.base.Preconditions;
import com.google.firebase.database.DatabaseReference;
import com.iconpln.liquiditas.fcm.model.FirebaseNotification;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Service("databaseService")
public class DatabaseService {

    private GoogleCredentials googleCredentials;

    private DatabaseReference databaseReference;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    public DatabaseService(GoogleCredentials googleCredentials, DatabaseReference databaseReference) {
        this.googleCredentials = googleCredentials;
        this.databaseReference = databaseReference;
    }

    /**
     * Save notification to firebase realtime database.
     * @param notification notification.
     */
    public void saveNotificationByTopic(FirebaseNotification notification) {
        Preconditions.checkArgument(notification != null, "Notification must be not null.");
        Preconditions.checkArgument(notification.getTopic() != null, "Topic must be not null.");
        String key = databaseReference.push().getKey();
        notification = FirebaseNotification.builder()
                .key(key)
                .title(notification.getTitle())
                .topic(notification.getTopic())
                .createBy(notification.getCreateBy())
                .date(System.currentTimeMillis())
                .isSeen(false)
                .icon(notification.getIcon())
                .body(notification.getBody())
                .build();
        Map<String, Object> map = new HashMap<>();
        map.put(key, notification);
        databaseReference.updateChildrenAsync(map);
    }

    /**
     * Find notification by topic.
     * @param topic topic.
     * @param token token or refresh token.
     * @return returns notification with notificatoin key.
     */
    public Map<String, FirebaseNotification> findNotificationByTopic(String topic, String token) {
        Preconditions.checkArgument(topic != null, "Topic must be not null.");
        Preconditions.checkArgument(token != null, "Token must be not null.");
        String response = restTemplate.getForObject("/lmetalica/notifications.json?orderBy=\"topic\"&equalTo=\""+topic+"\"&access_token=" + token, String.class);
        JSONObject object = new JSONObject(response);
        Iterator<String> keys = object.keys();
        Map<String, FirebaseNotification> map = new HashMap<>();
        while (keys.hasNext()) {
            String key = keys.next();
            JSONObject jsonObject = object.getJSONObject(key);
            FirebaseNotification notification = FirebaseNotification.builder()
                    .title(jsonObject.getString("title"))
                    .body(jsonObject.getString("body"))
                    .icon(jsonObject.getString("icon"))
                    .isSeen(jsonObject.getBoolean("isSeen"))
                    .createBy(jsonObject.getString("createBy"))
                    .topic(jsonObject.getString("topic"))
                    .date(jsonObject.getLong("date"))
                    .key(key)
                    .build();
            map.put(key, notification);
        }
        return map;
    }

    public String read(String key) {
        databaseReference.child(key).child("isSeen").setValueAsync(true);
        return "OK!";
    }

}
