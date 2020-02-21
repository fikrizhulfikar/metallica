package com.iconpln.liquiditas.core.domain;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "sap")
@Configuration("sapProperties")
public class Sap {

    private String url_customer;
    private String depurl_old;
    private String url;
    private String username;
    private String password;

    public String getUrl_customer() {
        return url_customer;
    }
    public String getDepurl_old(){return depurl_old;}
    public String getUrl(){return url;}
    public String getUsername(){return username;}
    public String getPassword(){return password;}

    @Override
    public String toString() {
        return "Sap{" +
                "url_customer='" + url_customer + '\'' +
                ", depurl_old='" + depurl_old + '\'' +
                ", url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", password=" + password +
                '}';
    }
}