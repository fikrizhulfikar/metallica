package com.iconpln.liquiditas.monitoring.controller;

import com.iconpln.liquiditas.monitoring.service.FirebaseNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/notification")
public class FirebaseNotificationController {

    @Autowired
    private FirebaseNotificationService firebaseNotificationService;

    @PostMapping("/push")
    public ResponseEntity<String> push() {
        firebaseNotificationService.send();
        return new ResponseEntity<>("", HttpStatus.OK);
    }

}
