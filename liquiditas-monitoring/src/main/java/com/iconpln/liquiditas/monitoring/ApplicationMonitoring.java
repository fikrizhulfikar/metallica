package com.iconpln.liquiditas.monitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.websocket.WebSocketAutoConfiguration;

/**
 * hal refactor
 */
@SpringBootApplication(scanBasePackages = { "com.iconpln.liquiditas" })
@EnableAutoConfiguration(exclude = WebSocketAutoConfiguration.class)
public class ApplicationMonitoring {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationMonitoring.class, args);
	}
}
