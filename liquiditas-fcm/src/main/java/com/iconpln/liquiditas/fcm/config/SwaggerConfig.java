package com.iconpln.liquiditas.fcm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * Swagger api docs configuration.
 * @author Langkuy <contact@ardikars.com>
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.iconpln.liquiditas.fcm.controller"))
                .build()
                .apiInfo(metaData());
    }

    private ApiInfo metaData() {
        ApiInfo apiInfo = new ApiInfo(
                "Fcm Servvice",
                "Fcm service",
                "1.0",
                "Terms of service",
                new Contact("Admin", "https://iconpln.co.id", "admin@iconpln.co.id"),
                "-",
                "-");
        return apiInfo;
    }

}