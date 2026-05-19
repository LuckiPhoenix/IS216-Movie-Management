package com.movie.server.dto.request;

import java.time.LocalDate;

/**
 * ST-201: Quick showtime selector request
 */
public class QuickShowtimeSelectorRequest {
    private LocalDate date; // Ngày xem phim (nếu null = hôm nay)
    private Long roomId; // Room ID (optional - nếu cần lọc theo phòng)

    public QuickShowtimeSelectorRequest() {}

    public QuickShowtimeSelectorRequest(LocalDate date, Long roomId) {
        this.date = date;
        this.roomId = roomId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }
}
