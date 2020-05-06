package com.iconpln.liquiditas.scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ConcurrentTaskScheduler;

@SpringBootApplication(scanBasePackages = { "com.iconpln.liquiditas" })
@EnableScheduling
public class ApplicationScheduler {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationScheduler.class, args);
	}

//	@Bean
//	public TaskScheduler taskScheduler() {
//		return new ConcurrentTaskScheduler(); //single threaded by default
//	}
}
