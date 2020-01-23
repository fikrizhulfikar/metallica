package com.iconpln.liquiditas.monitoring.utils;

import com.iconpln.liquiditas.core.service.NotificationService;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.monitoring.config.WsMbConfig;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class NotificationUtil {

    private Logger logger = AppUtils.getLogger(this);

    @Autowired
    private ValasService valasService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService service;

    public void notifyMessage(Notification notification) {
        logger.debug("notifyMessage()");
        notification.setCreateDate(new Date().getTime());
        notification.setCreateBy(SecurityContextHolder.getContext().getAuthentication().getName());
        long id = service.save(notification);
        if (id != 0) {
            notification.setId(id);
            messagingTemplate.convertAndSend(WsMbConfig.TOPIC_PREFIX + "/" + notification.getTopic(), notification);
        }
    }

    public void editSeenById(String username, long id) {
        logger.debug("editSeenById : {} {}", username, id);
        service.editSeenById(username, id);
    }

    public void flagSeen(String username) {
        logger.debug("flagSeen : {} ", username);
        service.flagSeen(username);
    }

    public Map<String, Object> findByTopics(String username, String topics, int start, int length) {
        List<Notification> notifications = service.findByTopics(username, topics, start, length);
        Integer unseenNotification = service.countUnseenNotificationByTopics(username, topics).intValue();
        Map<String, Object> map = new HashMap<>();
        map.put("data", notifications);
        map.put("unseen", unseenNotification);
        return map;
    }

    public Map<String, String> getNotificationDetailByIdValas(String idValas) {
        Map<String, String> result = new HashMap<>();
        try {
            List<Map<String, Object>> res = valasService.getPembayaranbyId(idValas);
            Object jenisPembayaran = res.get(0).get("nama_jenis_pembayaran");
            Object vendor = res.get(0).get("nama_vendor");
            if (jenisPembayaran != null) {
                result.put("NAMA_JENIS_PEMBAYARAN", (String) jenisPembayaran);
            } else {
                result.put("NAMA_JENIS_PEMBAYARAN", "");
            }
            if (vendor != null) {
                result.put("NAMA_VENDOR", (String) vendor);
            } else {
                result.put("NAMA_VENDOR", "");
            }
        } catch (SQLException e) {
            result.put("NAMA_JENIS_PEMBAYARAN", "");
            result.put("NAMA_VENDOR", "");
        }
        return result;
    }

    public Map<String, String> getNotificationDetailByIdTripartite(String idTripartite) {
        Map<String, String> result = new HashMap<>();
        try {
            List<Map<String, Object>> res = valasService.getTripartitebyId(idTripartite);
            Object jenisPembayaran = res.get(0).get("jenis_pembayaran");
            Object vendor = res.get(0).get("vendor");
            if (jenisPembayaran != null) {
                result.put("NAMA_JENIS_PEMBAYARAN", (String) jenisPembayaran);
            } else {
                result.put("NAMA_JENIS_PEMBAYARAN", "");
            }
            if (vendor != null) {
                result.put("NAMA_VENDOR", (String) vendor);
            } else {
                result.put("NAMA_VENDOR", "");
            }
        } catch (SQLException e) {
            result.put("NAMA_JENIS_PEMBAYARAN", "");
            result.put("NAMA_VENDOR", "");
        }
        return result;
    }

}
