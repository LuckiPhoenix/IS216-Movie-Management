package com.movie.server.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * ST-202: Seat status in POS seat map
 */
public class SeatStatusResponse {
    private Long seatId;
    private String rowLabel;
    private Integer seatNumber;
    private String seatTierType; // Regular, VIP, Couple, etc.
    private BigDecimal seatPrice;
    private String status; // AVAILABLE, BOOKED, SELECTED
    private String hexColor;

    public SeatStatusResponse() {}

    public SeatStatusResponse(
            Long seatId,
            String rowLabel,
            Integer seatNumber,
            String seatTierType,
            BigDecimal seatPrice,
            String status,
            String hexColor) {
        this.seatId = seatId;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.seatTierType = seatTierType;
        this.seatPrice = seatPrice;
        this.status = status;
        this.hexColor = hexColor;
    }

    // Getters & Setters
    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatTierType() { return seatTierType; }
    public void setSeatTierType(String seatTierType) { this.seatTierType = seatTierType; }

    public BigDecimal getSeatPrice() { return seatPrice; }
    public void setSeatPrice(BigDecimal seatPrice) { this.seatPrice = seatPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getHexColor() { return hexColor; }
    public void setHexColor(String hexColor) { this.hexColor = hexColor; }
}
