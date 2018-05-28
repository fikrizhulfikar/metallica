package com.iconpln.liquiditas.fcm.model;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Langkuy <contact@ardikars.com>
 */
public class FirebaseNotification implements Serializable {

    private String title;
    private String body;
    private String icon;
    private Boolean isSeen;
    private String createBy;
    private String topic;
    private Long date;

    public FirebaseNotification() {
        this.date = new Date().getTime();
    }

    public FirebaseNotification(String title, String body, String icon, Boolean isSeen, String createBy) {
        this.title = title;
        this.body = body;
        this.icon = icon;
        this.isSeen = isSeen;
        this.createBy = createBy;
        this.date = new Date().getTime();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean getIsSeen() {
        return isSeen;
    }

    public void setIsSeen(Boolean seen) {
        isSeen = seen;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("FirebaseNotification{");
        sb.append("title='").append(title).append('\'');
        sb.append(", body='").append(body).append('\'');
        sb.append(", icon='").append(icon).append('\'');
        sb.append(", isSeen=").append(isSeen);
        sb.append(", createBy='").append(createBy).append('\'');
        sb.append(", topic='").append(topic).append('\'');
        sb.append(", date=").append(date);
        sb.append('}');
        return sb.toString();
    }

}
