package com.connexa.contacts.exception;

import java.time.LocalDateTime;

public class ApiError {
    private LocalDateTime timestamp = LocalDateTime.now();
    private int status;
    private String message;

    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
