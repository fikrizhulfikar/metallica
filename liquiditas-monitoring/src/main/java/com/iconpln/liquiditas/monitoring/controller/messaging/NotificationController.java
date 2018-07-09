package com.iconpln.liquiditas.monitoring.controller.messaging;


import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.monitoring.config.UserDetailWrapper;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationUtil notificationUtil;

    private final Logger logger = AppUtils.getLogger(this);

    //Test
//    @GetMapping("/notify")
//    public ResponseEntity<String> notifyMessage() {
//        Notification notification = new Notification();
//        notification.setId(1L);
//        notification.setCreateBy("ADMIN");
//        notification.setCreateDate(new Date());
//        notification.setTitle("Notifikasi");
//        notification.setTopic("P00024");
//        notification.setMessage("Admin telah login.");
//        notificationUtil.notifyMessage(notification);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    @GetMapping("/get_notifications")
    public ResponseEntity<List<Notification>> findByTopics(Principal principal) {
        UserDetailWrapper wrapper = (UserDetailWrapper) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        String topics = wrapper.getTopics().stream()
                .map(topic -> topic.trim())
                .collect(Collectors.joining(","));
        return new ResponseEntity<>(notificationUtil.findByTopics(WebUtils.getUsernameLogin(), topics), HttpStatus.OK);
    }

    @PostMapping("/edit_seen_by_id/{id}")
    public ResponseEntity<String> read(@PathVariable("id") Long id) {
        notificationUtil.editSeenById(WebUtils.getUsernameLogin(), id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
