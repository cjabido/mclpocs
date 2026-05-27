package com.mclpocs.mcpserver.records;

public class RecordNotFoundException extends RuntimeException {

    public RecordNotFoundException(String id) {
        super("Record not found: " + id);
    }
}
