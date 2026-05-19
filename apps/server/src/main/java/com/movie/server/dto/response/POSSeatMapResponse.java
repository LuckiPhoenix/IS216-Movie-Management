package com.movie.server.dto.response;

import java.util.List;

/**
 * ST-202: POS seat map response
 */
public class POSSeatMapResponse {
    private Long showtimeId;
    private Long roomId;
    private String roomName;
    private Integer totalRows;
    private Integer totalColumns;
    private List<SeatStatusResponse> seats;

    public POSSeatMapResponse() {}

    public POSSeatMapResponse(
            Long showtimeId,
            Long roomId,
            String roomName,
            Integer totalRows,
            Integer totalColumns,
            List<SeatStatusResponse> seats) {
        this.showtimeId = showtimeId;
        this.roomId = roomId;
        this.roomName = roomName;
        this.totalRows = totalRows;
        this.totalColumns = totalColumns;
        this.seats = seats;
    }

    // Getters & Setters
    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public Integer getTotalRows() { return totalRows; }
    public void setTotalRows(Integer totalRows) { this.totalRows = totalRows; }

    public Integer getTotalColumns() { return totalColumns; }
    public void setTotalColumns(Integer totalColumns) { this.totalColumns = totalColumns; }

    public List<SeatStatusResponse> getSeats() { return seats; }
    public void setSeats(List<SeatStatusResponse> seats) { this.seats = seats; }
}
