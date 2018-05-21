package com.iconpln.liquiditas.monitoring.controller;

import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService;
import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService.FirebaseNotification;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/notification")
public class FirebaseNotificationController {

    @Autowired
    private FirebaseNotificationService firebaseNotificationService;

    @PostMapping(value = "/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam("token") String token) {
        return new ResponseEntity<>(firebaseNotificationService.subscribe(token), HttpStatus.OK);
    }

    @GetMapping("/push")
    public ResponseEntity<String> push() {
        FirebaseNotification firebaseNotification = new FirebaseNotification();
        firebaseNotification.title = "Ini title";
        firebaseNotification.body = "Ini bocy";
        firebaseNotification.icon = "ini_icon.png" + UUID.randomUUID().toString();
        firebaseNotificationService.send(firebaseNotification);
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @GetMapping("/get")
    public ResponseEntity<FirebaseNotification> get() {
        return new ResponseEntity<>(firebaseNotificationService.findAll(), HttpStatus.OK);
    }

}
