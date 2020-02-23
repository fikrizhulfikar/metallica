package com.iconpln.liquiditas.monitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.websocket.WebSocketAutoConfiguration;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * hal refactor
 */
@SpringBootApplication(scanBasePackages = { "com.iconpln.liquiditas" })
//@ComponentScan({"com.iconpln.liquiditas.core"})
@EnableAutoConfiguration(exclude = WebSocketAutoConfiguration.class)
@EnableScheduling
public class ApplicationMonitoring extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationMonitoring.class, args);
	}
}
