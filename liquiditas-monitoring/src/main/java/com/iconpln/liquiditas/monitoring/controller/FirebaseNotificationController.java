package com.iconpln.liquiditas.monitoring.controller;

import com.google.auth.oauth2.GoogleCredentials;
import com.iconpln.liquiditas.monitoring.config.UserDetailWrapper;
import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService;
import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService.FirebaseNotification;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/notification")
public class FirebaseNotificationController {

    @Autowired
    private FirebaseNotificationService firebaseNotificationService;

    @Autowired
    private GoogleCredentials googleCredentials;

    @PostMapping(value = "/subscribe")
    public ResponseEntity<String> subscribe(Authentication authentication, @RequestParam("token") String token) {
        return new ResponseEntity<>(firebaseNotificationService.subscribe(token, getTopicsFromSession(authentication)), HttpStatus.OK);
    }

//    @GetMapping("/push")
//    public ResponseEntity<String> push(Authentication authentication) {
//        FirebaseNotification firebaseNotification = new FirebaseNotification(
//                "Ini title",
//                "Ini Body",
//                "Ini_Icon.png",
//                false,
//                ""
//        );
//        Set<String> topics = getTopicsFromSession(authentication);
//        firebaseNotificationService.send(firebaseNotification, topics);
//        return new ResponseEntity<>("", HttpStatus.OK);
//    }

    @GetMapping("/get")
    public ResponseEntity<Map<String, FirebaseNotification>> get(Authentication authentication) {
        Set<String> topics = getTopicsFromSession(authentication);
        Map<String, FirebaseNotification> map = new HashMap<>();
        for (String topic : topics) {
            map.putAll(firebaseNotificationService.find(topic));
        }
        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    private UserDetailWrapper getUserFromSession(Authentication authentication) {
        UserDetailWrapper user = (UserDetailWrapper) authentication.getPrincipal();
        return user;
    }

    private Set<String> getTopicsFromSession(Authentication authentication) {
        return getUserFromSession(authentication).getTopics();
    }

}
