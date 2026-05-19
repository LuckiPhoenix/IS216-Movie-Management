package com.movie.server.dto.request;

import com.movie.server.enums.PaymentMethod;
import java.util.List;

/**
 * ST-203: POS Checkout request
 */
public class POSCheckoutRequest {
    private Long showtimeId; // ID của showtime
    private List<Long> selectedSeatIds; // Danh sách ID ghế được chọn
    private Long customerId; // ID khách hàng (có thể null nếu là khách vãng lai)
    private String customerName; // Tên khách (cho khách vãng lai)
    private String customerPhone; // Số điện thoại khách (cho khách vãng lai)
    private PaymentMethod paymentMethod; // Phương thức thanh toán: CASH, CARD
    private String cardNumber; // Số thẻ (nếu thanh toán bằng thẻ)
    private String notes; // Ghi chú

    public POSCheckoutRequest() {}

    public Long getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(Long showtimeId) {
        this.showtimeId = showtimeId;
    }

    public List<Long> getSelectedSeatIds() {
        return selectedSeatIds;
    }

    public void setSelectedSeatIds(List<Long> selectedSeatIds) {
        this.selectedSeatIds = selectedSeatIds;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
