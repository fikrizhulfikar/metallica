package com.iconpln.liquiditas.monitoring.controller.messaging;


import com.iconpln.liquiditas.monitoring.config.UserDetailWrapper;
import com.iconpln.liquiditas.monitoring.service.NotificationService;
import com.iconpln.liquiditas.monitoring.service.NotificationService.FirebaseNotification;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping(value = "/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam("jwt_token") String jwtToken, @RequestParam("token") String token, Authentication authentication) {
        return notificationService.subscribe(jwtToken, token, getTopicsFromSession(authentication));
    }

    @GetMapping("/get")
    public ResponseEntity<Map<String, FirebaseNotification>> get(String token, Authentication authentication) {
        Set<String> topics = getTopicsFromSession(authentication);
        return notificationService.getNotification(topics, token);
    }

    private UserDetailWrapper getUserFromSession(Authentication authentication) {
        UserDetailWrapper user = (UserDetailWrapper) authentication.getPrincipal();
        return user;
    }

    private Set<String> getTopicsFromSession(Authentication authentication) {
        return getUserFromSession(authentication).getTopics();
    }

}
