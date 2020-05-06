package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.core.service.RecaptchaService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.websocket.WebSocketAutoConfiguration;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.core.session.SessionRegistry;

/**
 * hal refactor
 */
@SpringBootApplication(scanBasePackages = { "com.iconpln.liquiditas" })
//@ComponentScan({"com.iconpln.liquiditas"})
@EnableAutoConfiguration(exclude = WebSocketAutoConfiguration.class)
@EnableScheduling
public class ApplicationMonitoring extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationMonitoring.class, args);
	}

	@Bean
	public RecaptchaService recaptchaService() {
		return new RecaptchaService();
	}
}
