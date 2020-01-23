package com.iconpln.liquiditas.fcm.config.security.model;

import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

/**
 * @author Langkuy <contact@ardikars.com>
 */
public class User extends org.springframework.security.core.userdetails.User {

    public User(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

}
