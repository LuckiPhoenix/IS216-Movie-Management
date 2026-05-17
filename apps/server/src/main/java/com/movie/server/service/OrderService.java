package com.movie.server.service;

import com.movie.server.dto.request.OrderRequest;
import com.movie.server.dto.response.OrderResponse;
import com.movie.server.entity.Booking;
import com.movie.server.entity.Order;
import com.movie.server.entity.User;
import com.movie.server.exception.BadRequestException;
import com.movie.server.exception.ResourceNotFoundException;
import com.movie.server.repository.BookingRepository;
import com.movie.server.repository.OrderRepository;
import com.movie.server.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrderService {
    private static final String UNKNOWN_ACTOR = "UNKNOWN";

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public OrderService(
            OrderRepository orderRepository, UserRepository userRepository, BookingRepository bookingRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<OrderResponse> findAll() {
        return orderRepository.findByDeletedAtIsNull().stream().map(this::toResponse).toList();
    }

    public OrderResponse findById(Long id) {
        return toResponse(getActiveOrder(id));
    }

    public OrderResponse create(OrderRequest request) {
        validate(request);
        User user = getActiveUser(request.getUserId());
        Booking booking = request.getBookingId() == null ? null : getActiveBooking(request.getBookingId());
        LocalDateTime now = LocalDateTime.now();

        Order order = new Order();
        order.setUser(user);
        order.setBooking(booking);
        order.setStatus(request.getStatus());
        order.setTotalPrice(request.getTotalPrice());
        order.setCreatedAt(now);
        order.setCreatedBy(UNKNOWN_ACTOR);
        order.setUpdatedAt(now);
        order.setUpdatedBy(UNKNOWN_ACTOR);
        return toResponse(orderRepository.save(order));
    }

    public OrderResponse update(Long id, OrderRequest request) {
        validate(request);
        User user = getActiveUser(request.getUserId());
        Booking booking = request.getBookingId() == null ? null : getActiveBooking(request.getBookingId());

        Order order = getActiveOrder(id);
        order.setUser(user);
        order.setBooking(booking);
        order.setStatus(request.getStatus());
        order.setTotalPrice(request.getTotalPrice());
        order.setUpdatedAt(LocalDateTime.now());
        order.setUpdatedBy(UNKNOWN_ACTOR);
        return toResponse(orderRepository.save(order));
    }

    public void softDelete(Long id) {
        Order order = getActiveOrder(id);
        order.setDeletedAt(LocalDateTime.now());
        order.setDeletedBy(UNKNOWN_ACTOR);
        order.setUpdatedAt(LocalDateTime.now());
        order.setUpdatedBy(UNKNOWN_ACTOR);
        orderRepository.save(order);
    }

    private void validate(OrderRequest request) {
        if (request.getUserId() == null) {
            throw new BadRequestException("userId is required");
        }
        if (request.getStatus() == null) {
            throw new BadRequestException("status is required");
        }
        if (request.getTotalPrice() == null || request.getTotalPrice().doubleValue() < 0) {
            throw new BadRequestException("totalPrice must be greater than or equal to 0");
        }
    }

    private Order getActiveOrder(Long id) {
        return orderRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    private User getActiveUser(Long id) {
        return userRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    private Booking getActiveBooking(Long id) {
        return bookingRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getBooking() == null ? null : order.getBooking().getId(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getCreatedAt(),
                order.getCreatedBy(),
                order.getUpdatedAt(),
                order.getUpdatedBy(),
                order.getDeletedAt(),
                order.getDeletedBy());
    }
}
