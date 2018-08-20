package com.iconpln.liquiditas.monitoring.config;

import com.iconpln.liquiditas.core.domain.User;
import com.iconpln.liquiditas.core.service.LMetallicaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.access.method.P;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.FilterInvocation;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Set;

@Component("valasAccessDecisionVoter")
public class ValasAccessDecisionVoter implements AccessDecisionVoter<FilterInvocation> {

    private static final Logger LOGGER = LoggerFactory.getLogger(ValasAccessDecisionVoter.class);

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
                UserDetailWrapper wrapper = (UserDetailWrapper) authentication.getPrincipal();
                Set<String> grantedUris = wrapper.getGrantedUris();
                String url = filterInvocation.getRequestUrl();
                boolean isGranted = false;
                if (url.startsWith("/page") || url.startsWith("/api")) {
                    if (url.startsWith("/api")) {
                        for (String regex : grantedUris) {
                            regex = regex.replace("*", ".*");
                            if (url.matches(regex)) {
                                isGranted = true;
                                break;
                            }
                        }
                    } else if (url.startsWith("/page")){
                        if (grantedUris.contains(url)) {
                            isGranted = true;
                        }
                    } else {
                        isGranted = true;
                    }
                } else {
                    isGranted = true;
                }
                if (isGranted) {
                    LOGGER.info("Access granted for {}", url);
                    return ACCESS_GRANTED;
                } else {
                    LOGGER.info("Access denied for {}", url);
                    return ACCESS_DENIED;
                }
            }
        }
        return ACCESS_GRANTED;

    }

}
