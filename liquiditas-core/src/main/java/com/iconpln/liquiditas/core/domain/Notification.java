package com.iconpln.liquiditas.core.domain;

import java.util.Date;

public class Notification {

    private Long id;
    private String createBy;
    private Date createDate;
    private String title;
    private String message;
    private String additionalInfo;
    private String topic;

    private boolean isSeen;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public boolean isSeen() {
        return isSeen;
    }

    public void setSeen(boolean seen) {
        isSeen = seen;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private Long id;
        private String createBy;
        private Date createDate;
        private boolean isSeen;
        private String title;
        private String message;
        private String additionalInfo;
        private String topic;

        private Builder() {
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder additionalInfo(String additionalInfo) {
            this.additionalInfo = additionalInfo;
            return this;
        }

        public Builder topic(String topic) {
            this.topic = topic;
            return this;
        }

        public Notification build() {
            Notification notification = new Notification();
            notification.id = id;
            notification.createBy = createBy;
            notification.createDate = createDate;
            notification.title = title;
            notification.message = message;
            notification.additionalInfo = additionalInfo;
            notification.topic = topic;
            return notification;
        }

    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Notification{");
        sb.append("id=").append(id);
        sb.append(", createBy='").append(createBy).append('\'');
        sb.append(", createDate=").append(createDate);
        sb.append(", title='").append(title).append('\'');
        sb.append(", message='").append(message).append('\'');
        sb.append(", topic='").append(topic).append('\'');
        sb.append('}');
        return sb.toString();
    }

}
