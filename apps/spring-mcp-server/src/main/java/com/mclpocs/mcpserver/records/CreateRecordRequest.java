package com.mclpocs.mcpserver.records;

import java.util.Map;

public record CreateRecordRequest(String name, Map<String, Object> data) {
}
