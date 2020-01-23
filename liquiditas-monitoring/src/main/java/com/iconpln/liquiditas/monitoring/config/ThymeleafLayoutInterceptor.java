package com.iconpln.liquiditas.monitoring.config;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by israj on 10/3/2016.
 */
public class ThymeleafLayoutInterceptor extends HandlerInterceptorAdapter {

    private static final String DEFAULT_LAYOUT_VERIFIKATOR = "verifikator/shared/layout";
    private static final String DEFAULT_LAYOUT_VERIFIKATOR_IDR = "verifikatoridr/shared/layout";
    private static final String DEFAULT_LAYOUT_OPERATOR = "operator/shared/new-layout";
    private static final String DEFAULT_VIEW_ATTRIBUTE_NAME = "view";

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

        if (modelAndView == null || !modelAndView.hasView()) {
            return;
        }
        String originalViewName = modelAndView.getViewName();

        if (originalViewName.startsWith("redirect:")){
            return;
        }

        if (request.getRequestURI().startsWith("/page_operator")){
            modelAndView.setViewName(DEFAULT_LAYOUT_OPERATOR);
        } else if (request.getRequestURI().startsWith("/page_master")){
            modelAndView.setViewName(DEFAULT_LAYOUT_OPERATOR);
        } else if (request.getRequestURI().startsWith("/page_verifikator")){
            modelAndView.setViewName(DEFAULT_LAYOUT_VERIFIKATOR);
        } else if (request.getRequestURI().startsWith("/page_idrverifikator")){
            modelAndView.setViewName(DEFAULT_LAYOUT_VERIFIKATOR_IDR);
        } else if (request.getRequestURI().startsWith("/login")){}
        else{

        }
        modelAndView.addObject(DEFAULT_VIEW_ATTRIBUTE_NAME, originalViewName);
    }
}