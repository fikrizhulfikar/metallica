package com.iconpln.liquiditas.fcm.model;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Value
@Builder
public class Subscriber implements Serializable {

    private String token;
    private List<String> topics;

    public Subscriber() {
        this.token = null;
        this.topics = null;
    }

    public Subscriber(String token, List<String> topics) {
        this.token = token;
        this.topics = topics;
    }

}
