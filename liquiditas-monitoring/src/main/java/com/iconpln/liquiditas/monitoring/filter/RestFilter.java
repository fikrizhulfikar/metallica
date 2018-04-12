package com.iconpln.liquiditas.monitoring.filter;

import com.iconpln.liquiditas.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

/**
 * Created by israjhaliri on 8/31/17.
 */
@Component
@Order(0)
public class RestFilter implements Filter {

    @Autowired
    private UserService userService;

    @Override
    public void init(FilterConfig fc) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain fc) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;

        System.out.println("URI : " + httpRequest.getRequestURI());
        System.out.println("URI STATUS MATCH /  : " + httpRequest.getRequestURI().matches("/"));

        if (httpRequest.getRequestURI().matches("/") ||
                httpRequest.getRequestURI().startsWith("/static") ||
                httpRequest.getRequestURI().startsWith("/liquiditas") ||
                httpRequest.getRequestURI().startsWith("/push") ||
                httpRequest.getRequestURI().startsWith("/pusher")
            ) {

        } else {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentPrincipalName = authentication.getName();

            List<Map<String, Object>> menus = userService.loadMenu(currentPrincipalName);
            List<Map<String, Object>> menuDerivatif = new ArrayList<>();
            List<Map<String, Object>> menuMaster = new ArrayList<>();
            List<Map<String, Object>> menuPotensi = new ArrayList<>();

            if (menus == null) {
                httpResponse.sendRedirect("/");
            } else {
                HttpSession session = httpRequest.getSession();

                for (int i = 0; i< menus.size(); i++){
                    if(menus.get(i).get("IS_API").toString().equals("0")){
                        if(menus.get(i).get("root_id").equals("mnuTransaksiDerivatif")){
                            menuDerivatif.add(menus.get(i));
                        }
                        if(menus.get(i).get("root_id").equals("mnuTransaksiMaster") || menus.get(i).get("id").equals("mnuTransaksiMaster")){
                            menuMaster.add(menus.get(i));
                        }
                        if(menus.get(i).get("root_id").equals("mnuPotensi")){
                            menuPotensi.add(menus.get(i));
                        }
                    }
                }
                session.setAttribute("menus", menus);
                session.setAttribute("derivatif", menuDerivatif);
                session.setAttribute("master", menuMaster);
                session.setAttribute("potensi", menuPotensi);

                System.out.println("SERVLET SESSION MENU : " + session.getAttribute("menus"));

                Boolean hasAccess = false;

                for (Map menu : menus) {

                    if (menu.get("form_id").toString().contains("/*")) {
                        if (httpRequest.getRequestURI().toString().matches(menu.get("form_id").toString()) || httpRequest.getRequestURI().toString().contains(menu.get("form_id").toString().replace("/*", ""))) {
                            hasAccess = true;
                        }
                    } else {
                        if (httpRequest.getRequestURI().toString().matches(menu.get("form_id").toString())) {
                            hasAccess = true;
                        }
                    }
                }

                if (!hasAccess) {
//                    httpResponse.sendRedirect("/");
                }
            }
        }

        fc.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
    }

}
