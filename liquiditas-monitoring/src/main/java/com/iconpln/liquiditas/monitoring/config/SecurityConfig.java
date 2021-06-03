package com.iconpln.liquiditas.monitoring.config;

import com.iconpln.liquiditas.core.service.RecaptchaService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.SessionHandler;
import com.iconpln.liquiditas.core.service.ActiveDirectory;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpRequest;
import org.springframework.security.access.AccessDecisionManager;
import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.vote.AuthenticatedVoter;
import org.springframework.security.access.vote.RoleVoter;
import org.springframework.security.access.vote.UnanimousBased;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.access.expression.WebExpressionVoter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.ui.Model;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.util.WebUtils;

/**
 * Created by israj on 9/30/2016.
 */

@Configuration
@EnableWebSecurity
@EnableWebMvc
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private SessionHandler sessionHandler;

    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private AccessDecisionManager accessDecisionManager;
    private ActiveDirectory ad = new ActiveDirectory();

    private SessionRegistry sessionRegistry;
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider() {
            @Override
            protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
                Object salt = null;
                if (getSaltSource() != null) {
                    salt = getSaltSource().getSalt(userDetails);
                }
// ================================================================================================================== start of LDAP LOGIN
//                String username = userDetails.getUsername();
//                List<String> Users = new ArrayList<String>(Arrays.asList(username.split("\\\\")));
//                String xuser = "pusat\\"+username;
//                String xpassword = authentication.getCredentials().toString();
//                username = ad.getLDAP(xuser,xpassword);
//                if(username.equals("0")){
//                    AppUtils.getLogger(this).info("User / Password tidak sesuai!", username);
//                    throw new BadCredentialsException(messages.getMessage(
//                            "AbstractUserDetailsAuthenticationProvider.badCredentials",
//                            "Bad credentials"));
//                }
// ================================================================================================================== end of LDAP LOGIN

// ================================================================================================================== login FROM DATABASE
//                if (authentication.getCredentials() == null) {
//                    logger.debug("Authentication failed: no credentials provided");
//
//                    throw new BadCredentialsException(messages.getMessage(
//                            "AbstractUserDetailsAuthenticationProvider.badCredentials",
//                            "Bad credentials"));
//                }
//                String presentedPassword = authentication.getCredentials().toString();
//                if (!getPasswordEncoder().isPasswordValid(userDetails.getPassword(),
//                        presentedPassword, salt)) {
//                    logger.debug("Authentication failed: password does not match stored value");
//
//                    throw new BadCredentialsException(messages.getMessage(
//                            "AbstractUserDetailsAuthenticationProvider.badCredentials",
//                            "Bad credentials"));
//                }
//=================================================================================================================== end of LOGIN FROM DATABASE
            }
        };

        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        auth.authenticationProvider(authenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/static/**","/redirect").permitAll()
                .and().authorizeRequests()
                .anyRequest().authenticated()
                .accessDecisionManager(accessDecisionManager)
                .and().formLogin().loginPage("/").permitAll()
                .and().formLogin().loginProcessingUrl("/auth")
                .successHandler(successHandler())
                .and().logout().and().csrf().disable()
                .sessionManagement()
                .maximumSessions(1)
                .expiredUrl("/")
                .and()
                .invalidSessionUrl("/");
    }

    private AuthenticationSuccessHandler successHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
//                AppUtils.getLogger(this).info("Google Response : {}",httpServletRequest.getParameter("g-recaptcha-response"));
//                String response = httpServletRequest.getParameter("g-recaptcha-response");
//                String ip = httpServletRequest.getRemoteAddr();
//
////                System.out.println("Google : "+httpServletRequest.getParameter("g-recaptcha-response"));
//                String result_recaptcha = recaptchaService.verifyRecaptcha(ip,response);
////                System.out.println("Google 2 : "+result_recaptcha);
//                if (result_recaptcha != "OK"){
//                    HttpSession session = httpServletRequest.getSession(false);
//                    System.out.println("Session Jan! : "+session);
//
//                    httpServletResponse.sendRedirect("/");
//                    session.invalidate();
//                }else if (result_recaptcha == "OK"){
////                    System.out.println("User Details : "+ authentication.getPrincipal());
////                    System.out.println("User Details : "+ sessionRegistry.getAllPrincipals());
//                    HttpSession session = httpServletRequest.getSession(false);
//                    System.out.println("Session Cok!: "+session);
                    httpServletResponse.sendRedirect("/page_operator/home");
                }
//            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}