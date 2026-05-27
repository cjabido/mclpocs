package com.mclpocs.mcpserver.config;

import com.mclpocs.mcpserver.records.RecordTools;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ToolConfig {

    @Bean
    ToolCallbackProvider recordToolCallbacks(RecordTools recordTools) {
        return MethodToolCallbackProvider.builder()
                .toolObjects(recordTools)
                .build();
    }
}
