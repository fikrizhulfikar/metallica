package com.iconpln.liquiditas.monitoring.utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class SessionHandler {

    /**
     * Session attribute name.
     */
    public enum SessionAttribute {
        TOKEN
    }

    public HttpServletRequest getHttpServletRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return attributes.getRequest();
    }

    public HttpSession getHttpSession() {
        return getHttpServletRequest().getSession(true);
    }

    public String getTokenFromSession() {
        return (String) getHttpSession().getAttribute(SessionAttribute.TOKEN.toString());
    }

    public void setUserToSession(String token) {
        getHttpSession().setAttribute(SessionAttribute.TOKEN.toString(), token);
    }

}