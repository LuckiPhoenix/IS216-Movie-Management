package com.movie.server.controller;

import com.movie.server.dto.request.OrderRequest;
import com.movie.server.dto.request.PlaceOrderRequest;
import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.OrderResponse;
import com.movie.server.dto.response.PlaceOrderResponse;
import com.movie.server.exception.BadRequestException;
import com.movie.server.service.OrderService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> findAll() {
        return ResponseEntity.ok(
                new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Orders fetched", orderService.findAll()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> myOrders(Authentication auth) {
        if (auth == null) throw new BadRequestException("Chưa đăng nhập");
        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(), HttpStatus.OK.value(), "Orders fetched",
                orderService.findMyOrders(auth.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Order fetched", orderService.findById(id)));
    }

    @PostMapping("/place")
    public ResponseEntity<ApiResponse<PlaceOrderResponse>> placeOrder(
            @RequestBody PlaceOrderRequest request, Authentication auth) {
        if (auth == null) throw new BadRequestException("Chưa đăng nhập");
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                LocalDateTime.now(), HttpStatus.CREATED.value(), "Đặt hàng thành công",
                orderService.placeOrder(request, auth.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> create(@RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(LocalDateTime.now(), HttpStatus.CREATED.value(), "Order created", orderService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> update(@PathVariable Long id, @RequestBody OrderRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Order updated", orderService.update(id, request)));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id, Authentication auth) {
        if (auth == null) throw new BadRequestException("Chưa đăng nhập");
        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(), HttpStatus.OK.value(), "Đơn hàng đã được hủy",
                orderService.cancelOrder(id, auth.getName())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        orderService.softDelete(id);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Order deleted", null));
    }
}
