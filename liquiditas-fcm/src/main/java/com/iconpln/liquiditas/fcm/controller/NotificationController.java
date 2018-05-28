package com.iconpln.liquiditas.fcm.controller;

import com.iconpln.liquiditas.fcm.model.FirebaseNotification;
import com.iconpln.liquiditas.fcm.service.DatabaseService;
import com.iconpln.liquiditas.fcm.service.NotificationService;
import com.iconpln.liquiditas.fcm.service.TokenService;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Notification controller.
 * @author Langkuy <contact@ardikars.com>
 */
@RestController("notificationController")
@RequestMapping("/api/fcm/notification")
public class NotificationController {

    private NotificationService notificationService;
    private DatabaseService databaseService;
    private TokenService tokenService;

    @Autowired
    public NotificationController(NotificationService notificationService, DatabaseService databaseService, TokenService tokenService) {
        this.notificationService = notificationService;
        this.databaseService = databaseService;
        this.tokenService = tokenService;
    }

    @PostMapping(
            value = "/notify",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Void> notify(@RequestBody FirebaseNotification notification) {
        notificationService.sendMessageToTopic(notification, notification.getTopic());
        databaseService.saveNotificationByTopic(notification, notification.getTopic());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(
            value = "/get_notification",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public ResponseEntity<Map<String, FirebaseNotification>> findNotificationByTopic(@RequestParam("topics") List<String> topics) {
        String token = null;
        try {
            token = tokenService.refreshToken();
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        if (token == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Map<String, FirebaseNotification> result = new HashMap<>();
        for (String topic : topics) {
            Map<String, FirebaseNotification> notification = databaseService.findNotificationByTopic(topic, token);
            result.putAll(notification);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping(
            value = "/subscribe",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<String> subscribe(Map<String, Object> parameters) {
        String token = (String) parameters.get("token");
        List<String> topics = (List<String>) parameters.get("topics");
        return new ResponseEntity<>(notificationService.subscribe(token, topics), HttpStatus.OK);
    }

}
