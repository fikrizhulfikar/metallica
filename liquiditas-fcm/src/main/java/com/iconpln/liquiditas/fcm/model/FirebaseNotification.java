package com.iconpln.liquiditas.fcm.model;

import java.io.Serializable;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Value;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Value
@Builder
public class FirebaseNotification implements Serializable {

    private String title;
    private String body;
    private String icon;
    private Boolean isSeen;
    private String createBy;
    private String topic;
    private Long date;
    private String key;

    public FirebaseNotification() {
        this.title = null;
        this.body = null;
        this.icon = null;
        this.isSeen = false;
        this.createBy = null;
        this.topic = null;
        this.date = 0L;
        this.key = null;
    }

    public FirebaseNotification(String title, String body, String icon, Boolean isSeen, String createBy, String topic, Long date, String key) {
        this.title = title;
        this.body = body;
        this.icon = icon;
        this.isSeen = isSeen;
        this.createBy = createBy;
        this.topic = topic;
        this.date = date;
        this.key = key;
    }

}
