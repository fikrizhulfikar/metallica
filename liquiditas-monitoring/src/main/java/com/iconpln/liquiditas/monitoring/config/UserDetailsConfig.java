package com.iconpln.liquiditas.monitoring.config;


import com.iconpln.liquiditas.core.domain.Role;
import com.iconpln.liquiditas.core.domain.User;
import com.iconpln.liquiditas.core.service.UserService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by israjhaliri on 8/25/17.
 */

@Service
public class UserDetailsConfig implements UserDetailsService{

    @Autowired UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user =  userService.loadByUsername(username);

        if(user == null || user.getUsername() == null){
            throw new UsernameNotFoundException(username);
        }
        else{
            Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
            if(user.getRoles().size() < 1){
                throw new UsernameNotFoundException(username);
            }
            AppUtils.getLogger(this).info("user get roles : {}",user.getRoles().toString());
            for (Role roles : user.getRoles()){
                grantedAuthorities.add(new SimpleGrantedAuthority(roles.getRole()));
            }

            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), grantedAuthorities);
        }
    }
}