package com.movie.server.dto.request;

/**
 * ST-202: Get POS seat map request
 */
public class GetSeatMapRequest {
    private Long showtimeId; // ID của showtime cần xem ghế

    public GetSeatMapRequest() {}

    public GetSeatMapRequest(Long showtimeId) {
        this.showtimeId = showtimeId;
    }

    public Long getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(Long showtimeId) {
        this.showtimeId = showtimeId;
    }
}
