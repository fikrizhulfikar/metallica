package com.iconpln.liquiditas.fcm.config;

import com.iconpln.liquiditas.fcm.common.ConstantKeys;
import com.iconpln.liquiditas.fcm.config.security.WebAuthenticationProvider;
import com.iconpln.liquiditas.fcm.config.security.interceptor.AuthenticationSuccessHandler;
import com.iconpln.liquiditas.fcm.config.security.interceptor.TokenValidatorHandler;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * @author Langkuy <contact@ardikars.com>
 */
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private WebAuthenticationProvider webAuthenticationProvider;

    @Autowired
    private AuthenticationSuccessHandler authenticationSuccessHandler;

    @Autowired
    private TokenValidatorHandler tokenValidatorHandler;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .authenticationProvider(webAuthenticationProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors()
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().csrf().disable() // no need crsf token if session creation policy is stateless.
                .authorizeRequests()
                .antMatchers("/auth").anonymous()
                .antMatchers("/auth").permitAll()
                .antMatchers("/static/**").permitAll()
                .antMatchers("/webjars/**").permitAll()
                .antMatchers("/swagger-ui.html/**").permitAll()
                .antMatchers("/swagger-resources/**").permitAll()
                .antMatchers("/v2/api-docs/**").permitAll()
                .anyRequest().authenticated()
                .and().formLogin().loginProcessingUrl(ConstantKeys.LOGIN_ENDPOINT)
                .and().formLogin().usernameParameter(ConstantKeys.USERNAME_PARAMETER)
                .and().formLogin().passwordParameter(ConstantKeys.PASSWORD_PARAMETER)
                .and().formLogin().successHandler(authenticationSuccessHandler)
                .and().logout().and()
                .exceptionHandling().authenticationEntryPoint(new AuthenticationEntryPoint() {
                    @Override
                    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
                        PrintWriter out = httpServletResponse.getWriter();
                        out.write(e.getMessage());
                        out.close();
                    }
                })
                .and().addFilterAfter(tokenValidatorHandler, UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
    }

}
