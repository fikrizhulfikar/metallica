package com.iconpln.liquiditas.monitoring.config;

import com.iconpln.liquiditas.core.domain.User;
import com.iconpln.liquiditas.core.service.LMetallicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.FilterInvocation;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Component("valasAccessDecisionVoter")
public class ValasAccessDecisionVoter implements AccessDecisionVoter<FilterInvocation> {

    @Override
    public boolean supports(ConfigAttribute configAttribute) {
        return true;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return true;
    }

    @Override
    public int vote(Authentication authentication, FilterInvocation filterInvocation, Collection<ConfigAttribute> collection) {

        if (authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetailWrapper) {
                String url = filterInvocation.getRequestUrl();
                if (!url.startsWith("/page")) {
                    return ACCESS_GRANTED;
                }
                UserDetailWrapper wrapper = (UserDetailWrapper) authentication.getPrincipal();
                Set<String> grantedUris = wrapper.getGrantedUris();
                if (grantedUris.contains(url)) {
                    return ACCESS_GRANTED;
                } else {
                    return ACCESS_DENIED;
                }
            }
        }
        return ACCESS_GRANTED;

    }

}
