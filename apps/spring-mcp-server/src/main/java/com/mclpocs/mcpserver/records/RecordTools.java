package com.mclpocs.mcpserver.records;

import java.util.List;
import java.util.Map;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class RecordTools {

    private final RecordApiClient recordApiClient;

    public RecordTools(RecordApiClient recordApiClient) {
        this.recordApiClient = recordApiClient;
    }

    @Tool(name = "list_records", description = "List all records from the shared experiment datastore.")
    public List<StoredRecord> listRecords() {
        return recordApiClient.listRecords();
    }

    @Tool(name = "get_record", description = "Get a record by id from the shared experiment datastore.")
    public StoredRecord getRecord(
            @ToolParam(description = "The record id.") String id
    ) {
        requireText(id, "id");
        return recordApiClient.getRecord(id);
    }

    @Tool(name = "create_record", description = "Create a new record in the shared experiment datastore.")
    public StoredRecord createRecord(
            @ToolParam(description = "Human-readable record name.") String name,
            @ToolParam(description = "Flexible JSON object for experiment data.", required = false) Map<String, Object> data
    ) {
        requireText(name, "name");
        return recordApiClient.createRecord(name, data);
    }

    @Tool(name = "update_record", description = "Update an existing record in the shared experiment datastore.")
    public StoredRecord updateRecord(
            @ToolParam(description = "The record id.") String id,
            @ToolParam(description = "Optional replacement record name.", required = false) String name,
            @ToolParam(description = "Optional replacement JSON data.", required = false) Map<String, Object> data
    ) {
        requireText(id, "id");
        return recordApiClient.updateRecord(id, name, data);
    }

    @Tool(name = "delete_record", description = "Delete a record by id from the shared experiment datastore.")
    public Map<String, Object> deleteRecord(
            @ToolParam(description = "The record id.") String id
    ) {
        requireText(id, "id");
        return recordApiClient.deleteRecord(id);
    }

    private void requireText(String value, String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
    }
}
