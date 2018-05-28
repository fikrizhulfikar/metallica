package com.iconpln.liquiditas.fcm.config.security.interceptor;

import com.iconpln.liquiditas.fcm.common.ConstantKeys;
import com.iconpln.liquiditas.fcm.common.ConstantMessages;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.Date;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Component
public class TokenValidatorHandler extends UsernamePasswordAuthenticationFilter {

    @Value("${token.header}")
    private String tokenHeader;

    @Value("${token.secret.key}")
    private String secretKey;

    @Value("${token.issuer}")
    private String issuer;

    @Autowired
    public TokenValidatorHandler(AuthenticationManager authenticationManager) {
        super.setAuthenticationManager(authenticationManager);
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) req;
        HttpServletResponse httpResponse = (HttpServletResponse) res;
        String uri = httpRequest.getRequestURI();
        if (!uri.startsWith("/webjars")
                && !uri.equals("/swagger-ui.html")
                && !uri.startsWith("/swagger-resources")
                && !uri.equals("v2/api-docs")
                && !uri.startsWith(ConstantKeys.LOGIN_ENDPOINT)) {
            String token = httpRequest.getHeader(tokenHeader);
            if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(secretKey)
                        .parseClaimsJws(token)
                        .getBody();
                if (claims.getIssuer().equals(issuer)) {
                    Date issuedAt = claims.getIssuedAt();
                    Date expiration = claims.getExpiration();
                    Date now = new Date();
                    if (expiration.after(issuedAt) && expiration.after(now)) {
                        String username = claims.get(ConstantKeys.USERNAME, String.class);
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                username, null, Collections.emptyList()
                        );
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    } else {
                        httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
                        PrintWriter out = httpResponse.getWriter();
                        out.write(ConstantMessages.EXPIRED_TOKEN);
                        out.close();
                    }
                } else {
                    httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
                    PrintWriter out = httpResponse.getWriter();
                    out.write(ConstantMessages.INVALID_ISSUER);
                    out.close();
                }
            } catch (Exception e) {
                logger.error(e.getMessage());
            }
        }
        chain.doFilter(req, res);
    }

}
