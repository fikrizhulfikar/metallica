package com.iconpln.liquiditas.monitoring.utils;

import com.iconpln.liquiditas.core.service.NotificationService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.monitoring.config.WsMbConfig;
import java.util.Date;
import java.util.List;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class NotificationUtil {

    private Logger logger = AppUtils.getLogger(this);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService service;

    public void notifyMessage(Notification notification) {
        logger.debug("notifyMessage()");
        notification.setSeen(false);
        notification.setCreateDate(new Date());
        notification.setCreateBy(SecurityContextHolder.getContext().getAuthentication().getName());
        long id = service.save(notification);
        if (id != 0) {
            notification.setId(id);
            messagingTemplate.convertAndSend(WsMbConfig.TOPIC_PREFIX + "/" + notification.getTopic(), notification);
        }
    }

    public void editSeenById(long id) {
        logger.debug("editSeenById {}", id);
        service.editSeenById(id);
    }

    public List<Notification> findByTopics(String topics) {
        return service.findByTopics(topics);
    }

}
