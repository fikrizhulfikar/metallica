package com.iconpln.liquiditas.fcm.config.security.service;

import com.iconpln.liquiditas.core.service.UserService;
import com.iconpln.liquiditas.fcm.common.util.Logging;
import com.iconpln.liquiditas.fcm.config.security.model.User;
import java.util.Collections;
import java.util.Optional;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Service;

@Import({UserService.class})
@Service("authenticationService")
public class AuthenticationService {

    private final Logger logger = Logging.getInstance().getLogger(this);

    @Autowired
    private UserService userService;

    public Optional<User> findByUsername(String username) {
        com.iconpln.liquiditas.core.domain.User userDb = userService.loadByUsername(username);
        if (userDb == null || userDb.getUsername() == null || userDb.getId() == 0) {
            logger.warn("Waring: " + username + " is not found.");
            return Optional.empty();
        }
        User user = new User(
                userDb.getUsername(),
                userDb.getPassword(),
                true,
                true,
                true,
                true,
                Collections.emptyList()
        );
        return Optional.of(user);
    }

}
