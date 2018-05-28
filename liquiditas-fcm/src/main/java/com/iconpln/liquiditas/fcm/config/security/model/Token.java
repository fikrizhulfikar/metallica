package com.iconpln.liquiditas.fcm.config.security.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.io.Serializable;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@JsonPropertyOrder({
        "key",
        "key_creation_time",
        "extended_information"
})
public class Token implements Serializable, org.springframework.security.core.token.Token {

    @JsonProperty("key")
    private String key;

    @JsonProperty("key_creation_time")
    private long keyCreationTime;

    @JsonProperty("extended_information")
    private String extendedInformation;

    private Token() {

    }

    @Override
    public String getKey() {
        return key;
    }

    @Override
    public long getKeyCreationTime() {
        return keyCreationTime;
    }

    @Override
    public String getExtendedInformation() {
        return extendedInformation;
    }

    public static Token build(String token, long creationTime, String extendedInformation) {
        Token instance = new Token();
        instance.key = token;
        instance.keyCreationTime = creationTime;
        instance.extendedInformation = extendedInformation;
        return instance;
    }

}
