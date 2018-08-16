package com.iconpln.liquiditas.monitoring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.vote.AuthenticatedVoter;
import org.springframework.security.access.vote.RoleVoter;
import org.springframework.security.access.vote.UnanimousBased;
import org.springframework.security.web.access.expression.WebExpressionVoter;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class ValasBeans {

    @Bean("accessDecisionManager")
    public AccessDecisionManager accessDecisionManager(ValasAccessDecisionVoter valasAccessDecisionVoter) {
        List<AccessDecisionVoter<? extends Object>> decisionVoters
                = Arrays.asList(
                new WebExpressionVoter(),
                new RoleVoter(),
                new AuthenticatedVoter(),
                valasAccessDecisionVoter);
        return new UnanimousBased(decisionVoters);
    }

}
