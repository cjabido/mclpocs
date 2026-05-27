package com.mclpocs.mcpserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SpringMcpServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringMcpServerApplication.class, args);
    }
}
