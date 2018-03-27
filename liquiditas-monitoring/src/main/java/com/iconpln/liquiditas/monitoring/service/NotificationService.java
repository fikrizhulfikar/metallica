package com.iconpln.liquiditas.monitoring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/content")
    public void broadcastStatus(String info) {
        messagingTemplate.convertAndSend("/pusher/invoice/info", info);
    }
}
