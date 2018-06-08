package com.iconpln.liquiditas.fcm.config.security.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iconpln.liquiditas.fcm.common.ConstantKeys;
import com.iconpln.liquiditas.fcm.common.util.Logging;
import com.iconpln.liquiditas.fcm.config.security.model.Token;
import com.iconpln.liquiditas.fcm.config.security.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Component("authenticationSucessHandler")
public class AuthenticationSuccessHandler implements org.springframework.security.web.authentication.AuthenticationSuccessHandler {

    private final Logger logger = Logging.getInstance().getLogger(this);

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${token.issuer}")
    private String issuer;

    @Value("${token.expiration}")
    private Long expiration;

    @Value("${token.secret.key}")
    private String secretKey;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        User user = (User) authentication.getPrincipal();
        if (user == null) {
            httpServletResponse.sendError(HttpStatus.SC_UNAUTHORIZED);
            return;
        }
        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + expiration);
        String key = Jwts.builder()
                .setIssuer(issuer)
                .setIssuedAt(currentDate)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .claim(ConstantKeys.USERNAME, user.getUsername())
                .compact();
        Token token = Token.build(key, currentDate.getTime(), "");

        httpServletResponse.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        PrintWriter out = httpServletResponse.getWriter();
        objectMapper.writeValue(out, token);
        out.close();
        logger.info("Authentication success: " + authentication.getPrincipal() + " logged in successfully with issuer " + issuer + ".");
    }

}
