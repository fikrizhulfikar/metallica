package com.iconpln.liquiditas.fcm.service;

import com.google.auth.oauth2.GoogleCredentials;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 * Token service.
 * @author Langkuy <contact@ardikars.com>
 */
@Service("tokenService")
public class TokenService {

    @Autowired
    @Qualifier("googleCredentials")
    private GoogleCredentials googleCredentials;

    public String refreshToken() throws IOException {
        return googleCredentials.refreshAccessToken().getTokenValue();
    }

}
