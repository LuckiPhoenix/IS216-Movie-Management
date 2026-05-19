package com.movie.server.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ST-201: Quick showtime selector response - mỗi showtime item
 */
public class QuickShowtimeResponse {
    private Long showtimeId;
    private Long movieId;
    private String movieTitle;
    private Integer movieDurationMinutes;
    private String movieGenre;
    private Long roomId;
    private String roomName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal basePrice;
    private Long totalSeats;
    private Long bookedSeats;
    private Long availableSeats;

    public QuickShowtimeResponse() {}

    public QuickShowtimeResponse(
            Long showtimeId,
            Long movieId,
            String movieTitle,
            Integer movieDurationMinutes,
            String movieGenre,
            Long roomId,
            String roomName,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal basePrice,
            Long totalSeats,
            Long bookedSeats) {
        this.showtimeId = showtimeId;
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.movieDurationMinutes = movieDurationMinutes;
        this.movieGenre = movieGenre;
        this.roomId = roomId;
        this.roomName = roomName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.basePrice = basePrice;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.availableSeats = totalSeats - bookedSeats;
    }

    // Getters & Setters
    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public Integer getMovieDurationMinutes() { return movieDurationMinutes; }
    public void setMovieDurationMinutes(Integer movieDurationMinutes) { this.movieDurationMinutes = movieDurationMinutes; }

    public String getMovieGenre() { return movieGenre; }
    public void setMovieGenre(String movieGenre) { this.movieGenre = movieGenre; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public Long getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Long totalSeats) { this.totalSeats = totalSeats; }

    public Long getBookedSeats() { return bookedSeats; }
    public void setBookedSeats(Long bookedSeats) { this.bookedSeats = bookedSeats; }

    public Long getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Long availableSeats) { this.availableSeats = availableSeats; }
}
