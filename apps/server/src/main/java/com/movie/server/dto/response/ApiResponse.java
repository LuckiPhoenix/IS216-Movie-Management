package com.movie.server.dto.response;

import java.time.LocalDateTime;

/**
 * Generic API response wrapper for all endpoints
 */
public class ApiResponse<T> {
    private LocalDateTime timestamp;
    private int statusCode;
    private String message;
    private T data;

    public ApiResponse() {}

    public ApiResponse(LocalDateTime timestamp, int statusCode, String message, T data) {
        this.timestamp = timestamp;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    // Getters & Setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
