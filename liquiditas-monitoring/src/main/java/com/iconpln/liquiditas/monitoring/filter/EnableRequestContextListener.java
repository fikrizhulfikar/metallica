package com.iconpln.liquiditas.monitoring.filter;

import javax.servlet.annotation.WebListener;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextListener;

@Component
@WebListener
public class EnableRequestContextListener extends RequestContextListener {

}
