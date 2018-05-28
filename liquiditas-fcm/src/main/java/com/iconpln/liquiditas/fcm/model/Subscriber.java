package com.iconpln.liquiditas.fcm.model;

import java.io.Serializable;
import java.util.List;

/**
 * @author Langkuy <contact@ardikars.com>
 */
public class Subscriber implements Serializable {

    private String token;
    private List<String> topics;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("Subscriber{");
        sb.append("token='").append(token).append('\'');
        sb.append(", topics=").append(topics);
        sb.append('}');
        return sb.toString();
    }

}
