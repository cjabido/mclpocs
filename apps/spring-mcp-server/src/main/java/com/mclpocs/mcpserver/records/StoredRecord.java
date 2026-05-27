package com.mclpocs.mcpserver.records;

import java.time.Instant;
import java.util.Map;

public record StoredRecord(
        String id,
        String name,
        Map<String, Object> data,
        Instant createdAt,
        Instant updatedAt
) {
}
