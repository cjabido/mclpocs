package com.mclpocs.mcpserver.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "records.api")
public record RecordsApiProperties(String baseUrl) {
}
