package com.movie.server.dto.request;

import com.movie.server.enums.PaymentMethod;
import com.movie.server.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentRequest {
    private Long bookingId;
    private Long orderId;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paidAt;
    private String bankCode;
    private String language;

    public PaymentRequest() {}

    public Long getBookingId() {
        return bookingId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public String getBankCode() {
        return bankCode;
    }

    public String getLanguage() {
        return language;
    }
}
