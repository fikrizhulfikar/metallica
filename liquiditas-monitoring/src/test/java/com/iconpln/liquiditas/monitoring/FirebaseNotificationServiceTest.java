package com.iconpln.liquiditas.monitoring;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;
import com.google.gson.JsonArray;
import com.iconpln.liquiditas.monitoring.config.FirebaseConfiguration;
import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService;
import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService.FirebaseNotification;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

@RunWith(SpringRunner.class)
@SpringBootTest
public class FirebaseNotificationServiceTest {

    @Autowired
    private FirebaseNotificationService firebaseNotificationService;
    @Autowired
    private FirebaseConfiguration firebaseConfiguration;

    @Autowired
    private GoogleCredentials googleCredentials;

    @Autowired
    private DatabaseReference databaseReference;

    @Test
    public void test() throws InterruptedException, JSONException {
        RestTemplate restTemplate = new RestTemplate();
        String token = null;
        try {
            token = googleCredentials.refreshAccessToken().getTokenValue();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String resStr = restTemplate.getForObject("https://fir-lmetalica.firebaseio.com/lmetalica/notifications.json?orderBy=\"topic\"&equalTo=\"P00004\"&access_token=" + token, String.class);

//        resStr = "[" + resStr + "]";

        ObjectMapper objectMapper = new ObjectMapper();

        JSONObject object = new JSONObject(resStr);

        List<FirebaseNotification> notifications = new ArrayList<>();

        object.keys().forEachRemaining(o -> {
            String key = o.toString();
            try {
                try {
                    FirebaseNotification notification = objectMapper.readValue(object.getString(key), new TypeReference<FirebaseNotification>() {});
                    notifications.add(notification);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        });
        System.out.println("MYS: " + notifications);

    }


}
