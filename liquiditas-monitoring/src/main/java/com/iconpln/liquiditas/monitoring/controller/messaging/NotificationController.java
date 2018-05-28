package com.iconpln.liquiditas.monitoring.controller.messaging;


import com.iconpln.liquiditas.monitoring.config.UserDetailWrapper;
import com.iconpln.liquiditas.monitoring.service.NotificationService;
import com.iconpln.liquiditas.monitoring.service.NotificationService.FirebaseNotification;
import com.iconpln.liquiditas.monitoring.utils.SessionHandler;
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
    private SessionHandler sessionHandler;

    @Autowired
    private NotificationService notificationService;

    @PostMapping(value = "/subscribe")
    public ResponseEntity<String> subscribe(@RequestParam("token") String token, Authentication authentication) {
        String jwtToken = sessionHandler.getTokenFromSession();
        return notificationService.subscribe(token, getTopicsFromSession(authentication));
    }

    @GetMapping("/get")
    public ResponseEntity<Map<String, FirebaseNotification>> get(Authentication authentication) {
        Set<String> topics = getTopicsFromSession(authentication);
        String token = sessionHandler.getTokenFromSession();
        return notificationService.getNotification(topics);
    }

    private UserDetailWrapper getUserFromSession(Authentication authentication) {
        UserDetailWrapper user = (UserDetailWrapper) authentication.getPrincipal();
        return user;
    }

    private Set<String> getTopicsFromSession(Authentication authentication) {
        return getUserFromSession(authentication).getTopics();
    }

}
