package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.core.service.RecaptchaService;
import org.apache.catalina.connector.Connector;
import org.apache.coyote.http2.Http2Protocol;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.websocket.WebSocketAutoConfiguration;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
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

	@Bean
	public EmbeddedServletContainerCustomizer tomcatCustomizer() {
		return new EmbeddedServletContainerCustomizer() {

			@Override
			public void customize(ConfigurableEmbeddedServletContainer container) {
				if (container instanceof TomcatEmbeddedServletContainerFactory) {
					((TomcatEmbeddedServletContainerFactory) container)
							.addConnectorCustomizers(new TomcatConnectorCustomizer() {
								@Override
								public void customize(Connector connector) {
									connector.addUpgradeProtocol(new Http2Protocol());
								}
							});
				}
			}

		};
	}
}
