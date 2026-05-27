package com.mclpocs.mcpserver.records;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class RecordApiClient {

    private final RestClient recordsRestClient;

    public RecordApiClient(RestClient recordsRestClient) {
        this.recordsRestClient = recordsRestClient;
    }

    public List<StoredRecord> listRecords() {
        StoredRecord[] records = recordsRestClient.get()
                .uri("/api/records")
                .retrieve()
                .body(StoredRecord[].class);

        return records == null ? List.of() : Arrays.asList(records);
    }

    public StoredRecord getRecord(String id) {
        return recordsRestClient.get()
                .uri("/api/records/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RecordNotFoundException(id);
                })
                .body(StoredRecord.class);
    }

    public StoredRecord createRecord(String name, Map<String, Object> data) {
        return recordsRestClient.post()
                .uri("/api/records")
                .body(new CreateRecordRequest(name, emptyIfNull(data)))
                .retrieve()
                .body(StoredRecord.class);
    }

    public StoredRecord updateRecord(String id, String name, Map<String, Object> data) {
        return recordsRestClient.put()
                .uri("/api/records/{id}", id)
                .body(new UpdateRecordRequest(name, data))
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RecordNotFoundException(id);
                })
                .body(StoredRecord.class);
    }

    public Map<String, Object> deleteRecord(String id) {
        recordsRestClient.delete()
                .uri("/api/records/{id}", id)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {
                    throw new RecordNotFoundException(id);
                })
                .toBodilessEntity();

        return Map.of("deleted", true, "id", id);
    }

    private Map<String, Object> emptyIfNull(Map<String, Object> data) {
        return data == null ? Map.of() : data;
    }
}
