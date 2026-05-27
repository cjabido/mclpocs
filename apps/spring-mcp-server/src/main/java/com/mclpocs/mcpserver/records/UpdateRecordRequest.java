package com.mclpocs.mcpserver.records;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateRecordRequest(String name, Map<String, Object> data) {
}
