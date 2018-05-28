package com.iconpln.liquiditas.monitoring.service;

import java.io.Serializable;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationService {

    @Autowired
    private RestTemplate restTemplate;

    public ResponseEntity<String> subscribe(String jwtToken, String clientToken, Set<String> topics) {
        Map<String, Object> map = new HashMap<>();
        map.put("token", clientToken);
        map.put("topics", topics);
        HttpEntity httpEntity = new HttpEntity(map, createHeaders(MediaType.APPLICATION_JSON, jwtToken));
        ResponseEntity<String> responseEntity = restTemplate.exchange("/api/fcm/notification/subscribe",
                HttpMethod.POST,
                httpEntity,
                new ParameterizedTypeReference<String>() {});
        return responseEntity;
    }

    public void sendNotification(String title, String body, String icon, boolean isSeen, String createBy, String topic, Date date, String token) throws URISyntaxException {
        FirebaseNotification firebaseNotification = new FirebaseNotification();
        firebaseNotification.setTitle(title);
        firebaseNotification.setBody(body);
        firebaseNotification.setIcon(icon);
        firebaseNotification.setIsSeen(isSeen);
        firebaseNotification.setCreateBy(createBy);
        firebaseNotification.setTopic(topic);
        firebaseNotification.setDate(date.getTime());
        HttpEntity httpEntity = new HttpEntity(firebaseNotification, createHeaders(MediaType.APPLICATION_JSON, token));
        restTemplate.exchange( "/api/fcm/notification/notify", HttpMethod.POST, httpEntity, Void.class);
    }

    public ResponseEntity<Map<String, FirebaseNotification>> getNotification(Set<String> topics, String token) {
        HttpEntity httpEntity = new HttpEntity(createHeaders(MediaType.APPLICATION_FORM_URLENCODED, token));
        String query = String.join(",", topics);
        return restTemplate.exchange("/api/fcm/notification/get_notification?topics="+query,
                HttpMethod.GET,
                httpEntity,
                new ParameterizedTypeReference<Map<String, FirebaseNotification>>() {});
    }

    private HttpHeaders createHeaders(MediaType mediaType, String token){
        HttpHeaders headers = new HttpHeaders() {{
            set( "Authorization", token );
        }};
        headers.setContentType(mediaType);
        return headers;
    }

    public static class FirebaseNotification implements Serializable {

        private String title;
        private String body;
        private String icon;
        private Boolean isSeen;
        private String createBy;
        private String topic;
        private Long date;

        public FirebaseNotification() {
            this.date = new Date().getTime();
        }

        public FirebaseNotification(String title, String body, String icon, Boolean isSeen, String createBy) {
            this.title = title;
            this.body = body;
            this.icon = icon;
            this.isSeen = isSeen;
            this.createBy = createBy;
            this.date = new Date().getTime();
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public Boolean getIsSeen() {
            return isSeen;
        }

        public void setIsSeen(Boolean seen) {
            isSeen = seen;
        }

        public String getCreateBy() {
            return createBy;
        }

        public void setCreateBy(String createBy) {
            this.createBy = createBy;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public Long getDate() {
            return date;
        }

        public void setDate(Long date) {
            this.date = date;
        }

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("FirebaseNotification{");
            sb.append("title='").append(title).append('\'');
            sb.append(", body='").append(body).append('\'');
            sb.append(", icon='").append(icon).append('\'');
            sb.append(", isSeen=").append(isSeen);
            sb.append(", createBy='").append(createBy).append('\'');
            sb.append(", topic='").append(topic).append('\'');
            sb.append(", date=").append(date);
            sb.append('}');
            return sb.toString();
        }

    }

}
