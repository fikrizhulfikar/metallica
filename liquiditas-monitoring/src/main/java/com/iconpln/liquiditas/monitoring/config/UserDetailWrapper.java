package com.iconpln.liquiditas.monitoring.config;

import java.util.Collection;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class UserDetailWrapper extends User {

    private Set<String> topics;

    public UserDetailWrapper(String username, String password, Collection<? extends GrantedAuthority> authorities, Set<String> topics) {
        super(username, password, authorities);
        this.topics = topics;
    }

    public Set<String> getTopics() {
        return topics;
    }

}
