package com.movie.server.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * ST-203: POS checkout response
 */
public class POSCheckoutResponse {
    private Long bookingId;
    private Long orderId;
    private Long paymentId;
    private String movieTitle;
    private String roomName;
    private LocalDateTime showtimeStart;
    private LocalDateTime showtimeEnd;
    private List<String> selectedSeats; // ["A1", "A2", etc.]
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal totalPrice;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime paidAt;
    private String ticketQrCode; // QR code string or URL for printing
    private String printJobId; // ID của lệnh in gửi tới printer

    public POSCheckoutResponse() {}

    // Getters & Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public LocalDateTime getShowtimeStart() { return showtimeStart; }
    public void setShowtimeStart(LocalDateTime showtimeStart) { this.showtimeStart = showtimeStart; }

    public LocalDateTime getShowtimeEnd() { return showtimeEnd; }
    public void setShowtimeEnd(LocalDateTime showtimeEnd) { this.showtimeEnd = showtimeEnd; }

    public List<String> getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(List<String> selectedSeats) { this.selectedSeats = selectedSeats; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public String getTicketQrCode() { return ticketQrCode; }
    public void setTicketQrCode(String ticketQrCode) { this.ticketQrCode = ticketQrCode; }

    public String getPrintJobId() { return printJobId; }
    public void setPrintJobId(String printJobId) { this.printJobId = printJobId; }
}
