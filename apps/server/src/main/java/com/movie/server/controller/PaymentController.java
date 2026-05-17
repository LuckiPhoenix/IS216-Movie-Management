package com.movie.server.controller;

import com.movie.server.dto.request.PaymentRequest;
import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.PaymentResponse;
import com.movie.server.dto.response.VnpayReturnResponse;
import com.movie.server.enums.PaymentStatus;
import com.movie.server.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> findAll(
            @RequestParam(required = false) Long orderId, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Payments fetched",
                        paymentService.findAll(orderId, getIpAddress(servletRequest))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> findById(@PathVariable Long id, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Payment fetched",
                        paymentService.findById(id, getIpAddress(servletRequest))));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> create(
            @RequestBody PaymentRequest request, HttpServletRequest servletRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                "Payment created",
                paymentService.create(request, getIpAddress(servletRequest))));
    }

    @GetMapping("/vnpay/return")
    public ResponseEntity<ApiResponse<VnpayReturnResponse>> handleVnpayReturn(@RequestParam Map<String, String> returnParams) {
        VnpayReturnResponse response = paymentService.processVnpayReturnDetailed(returnParams);
        HttpStatus status = HttpStatus.valueOf(paymentService.resolveVnpReturnHttpCode(
                response.getVnpResponseCode(), response.getVnpTransactionStatus()));
        return ResponseEntity.status(status).body(new ApiResponse<>(
                LocalDateTime.now(),
                status.value(),
                response.getVnpMessageVi(),
                response));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PaymentResponse>> updateStatus(
            @PathVariable Long id, @RequestParam PaymentStatus status) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        LocalDateTime.now(),
                        HttpStatus.OK.value(),
                        "Payment status updated",
                        paymentService.updateStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        paymentService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Payment marked as FAILED", null));
    }

    private String getIpAddress(HttpServletRequest request) {
        String forwarded = request.getHeader("X-FORWARDED-FOR");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
