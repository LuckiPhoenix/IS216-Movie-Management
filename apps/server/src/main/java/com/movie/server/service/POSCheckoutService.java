package com.movie.server.service;

import com.movie.server.dto.request.POSCheckoutRequest;
import com.movie.server.dto.response.POSCheckoutResponse;
import com.movie.server.entity.Booking;
import com.movie.server.entity.Order;
import com.movie.server.entity.Payment;
import com.movie.server.entity.Seat;
import com.movie.server.entity.Showtime;
import com.movie.server.entity.Ticket;
import com.movie.server.entity.User;
import com.movie.server.enums.BookingStatus;
import com.movie.server.enums.OrderStatus;
import com.movie.server.enums.PaymentStatus;
import com.movie.server.enums.TicketStatus;
import com.movie.server.exception.BadRequestException;
import com.movie.server.exception.ResourceNotFoundException;
import com.movie.server.repository.BookingRepository;
import com.movie.server.repository.OrderRepository;
import com.movie.server.repository.PaymentRepository;
import com.movie.server.repository.SeatRepository;
import com.movie.server.repository.ShowtimeRepository;
import com.movie.server.repository.TicketRepository;
import com.movie.server.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class POSCheckoutService {

    private static final String STAFF_ACTOR = "STAFF";
    private static final BigDecimal TAX_RATE = new BigDecimal("0.10"); // 10% VAT

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final POSSeatService posSeatService;
    private final PrinterService printerService; // Service để gửi lệnh in

    public POSCheckoutService(
            ShowtimeRepository showtimeRepository,
            SeatRepository seatRepository,
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            POSSeatService posSeatService,
            PrinterService printerService) {
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.posSeatService = posSeatService;
        this.printerService = printerService;
    }

    /**
     * ST-203: Xử lý checkout - tạo booking, tính tiền, xử lý thanh toán, in vé
     */
    @Transactional
    public POSCheckoutResponse checkout(POSCheckoutRequest request) {
        // Validate request
        validateCheckoutRequest(request);

        // Lấy showtime
        Showtime showtime = showtimeRepository.findByIdAndDeletedAtIsNull(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));

        // Kiểm tra xung đột ghế
        posSeatService.validateSeatsAvailable(showtime.getId(), request.getSelectedSeatIds());

        // Lấy thông tin ghế
        List<Seat> selectedSeats = new ArrayList<>();
        for (Long seatId : request.getSelectedSeatIds()) {
            Seat seat = seatRepository.findByIdAndDeletedAtIsNull(seatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId));
            selectedSeats.add(seat);
        }

        // Tính tổng tiền
        BigDecimal subtotal = calculateSubtotal(showtime, selectedSeats);
        BigDecimal tax = subtotal.multiply(TAX_RATE);
        BigDecimal totalPrice = subtotal.add(tax);

        // Lấy hoặc tạo user cho khách hàng
        User customer = getOrCreateCustomer(request);

        // Tạo Booking
        Booking booking = createBooking(showtime, customer, totalPrice);

        // Tạo Tickets cho mỗi ghế
        List<Ticket> tickets = createTickets(booking, showtime, selectedSeats, showtime.getBasePrice());

        // Tạo Order
        Order order = createOrder(customer, booking, totalPrice);

        // Xử lý thanh toán
        Payment payment = processPayment(request, booking, order, totalPrice);

        // Nếu thanh toán thành công, gửi lệnh in vé
        String printJobId = null;
        String ticketQrCode = null;
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            ticketQrCode = generateTicketQRCode(booking);
            printJobId = triggerPrinting(booking, showtime, selectedSeats, ticketQrCode);
        }

        return buildCheckoutResponse(booking, order, payment, showtime, selectedSeats, 
                                     subtotal, tax, ticketQrCode, printJobId);
    }

    /**
     * Validate request trước khi xử lý
     */
    private void validateCheckoutRequest(POSCheckoutRequest request) {
        if (request.getShowtimeId() == null) {
            throw new BadRequestException("Showtime ID is required");
        }
        if (request.getSelectedSeatIds() == null || request.getSelectedSeatIds().isEmpty()) {
            throw new BadRequestException("At least one seat must be selected");
        }
        if (request.getPaymentMethod() == null) {
            throw new BadRequestException("Payment method is required");
        }
        if (request.getPaymentMethod().name().equals("CARD") && 
            (request.getCardNumber() == null || request.getCardNumber().isBlank())) {
            throw new BadRequestException("Card number is required for card payment");
        }
    }

    /**
     * Tính tổng tiền (không tính tax)
     */
    private BigDecimal calculateSubtotal(Showtime showtime, List<Seat> seats) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (Seat seat : seats) {
            BigDecimal seatPrice = seat.getTier() != null ? seat.getTier().getPrice() : showtime.getBasePrice();
            subtotal = subtotal.add(seatPrice);
        }
        return subtotal;
    }

    /**
     * Lấy hoặc tạo user cho khách hàng
     */
    private User getOrCreateCustomer(POSCheckoutRequest request) {
        // Nếu có customer ID, lấy user theo ID
        if (request.getCustomerId() != null) {
            return userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        }

        // Nếu là khách vãng lai, không cần user nhưng vẫn có thể lưu thông tin
        // Trong trường hợp này, có thể tạo một user tạm thời hoặc lưu thông tin vào order notes
        return null;
    }

    /**
     * Tạo Booking
     */
    private Booking createBooking(Showtime showtime, User customer, BigDecimal totalPrice) {
        Booking booking = new Booking();
        booking.setShowtime(showtime);
        booking.setUser(customer);
        booking.setStatus(BookingStatus.PENDING); // Sẽ update thành CONFIRMED sau khi thanh toán
        booking.setTotalPrice(totalPrice);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setCreatedBy(STAFF_ACTOR);
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setUpdatedBy(STAFF_ACTOR);

        return bookingRepository.save(booking);
    }

    /**
     * Tạo Tickets cho mỗi ghế
     */
    private List<Ticket> createTickets(Booking booking, Showtime showtime, List<Seat> seats, BigDecimal basePrice) {
        List<Ticket> tickets = new ArrayList<>();

        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setBooking(booking);
            ticket.setShowtime(showtime);
            ticket.setSeat(seat);
            ticket.setPrice(seat.getTier() != null ? seat.getTier().getPrice() : basePrice);
            ticket.setStatus(TicketStatus.PAID); // Sẽ update thành PAID sau khi thanh toán
            ticket.setCreatedAt(LocalDateTime.now());
            ticket.setCreatedBy(STAFF_ACTOR);
            ticket.setUpdatedAt(LocalDateTime.now());
            ticket.setUpdatedBy(STAFF_ACTOR);

            tickets.add(ticketRepository.save(ticket));
        }

        return tickets;
    }

    /**
     * Tạo Order
     */
    private Order createOrder(User customer, Booking booking, BigDecimal totalPrice) {
        Order order = new Order();
        order.setUser(customer);
        order.setBooking(booking);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalPrice(totalPrice);
        order.setCreatedAt(LocalDateTime.now());
        order.setCreatedBy(STAFF_ACTOR);
        order.setUpdatedAt(LocalDateTime.now());
        order.setUpdatedBy(STAFF_ACTOR);

        return orderRepository.save(order);
    }

    /**
     * Xử lý thanh toán
     */
    private Payment processPayment(POSCheckoutRequest request, Booking booking, Order order, BigDecimal totalPrice) {
        // Validate payment (có thể gọi tới payment gateway ở đây)
        // Tạm thời - giả sử thanh toán luôn thành công
        boolean paymentSuccess = validatePaymentMethod(request);

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setOrder(order);
        payment.setAmount(totalPrice);
        payment.setMethod(request.getPaymentMethod());
        payment.setStatus(paymentSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setPaidAt(paymentSuccess ? LocalDateTime.now() : null);

        Payment savedPayment = paymentRepository.save(payment);

        // Nếu thanh toán thành công, update booking & tickets status
        if (paymentSuccess) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());
            booking.setUpdatedBy(STAFF_ACTOR);
            bookingRepository.save(booking);

            order.setStatus(OrderStatus.COMPLETED);
            order.setUpdatedAt(LocalDateTime.now());
            order.setUpdatedBy(STAFF_ACTOR);
            orderRepository.save(order);

            // Update tickets status
            List<Ticket> tickets = ticketRepository.findAll((root, query, cb) ->
                    cb.equal(root.get("booking").get("id"), booking.getId()));
            for (Ticket ticket : tickets) {
                ticket.setStatus(TicketStatus.PAID);
                ticket.setUpdatedAt(LocalDateTime.now());
                ticket.setUpdatedBy(STAFF_ACTOR);
                ticketRepository.save(ticket);
            }
        }

        return savedPayment;
    }

    /**
     * Validate payment method
     */
    private boolean validatePaymentMethod(POSCheckoutRequest request) {
        // Validate CASH - always success
        if (request.getPaymentMethod().name().equals("CASH")) {
            return true;
        }

        // Validate CARD - check card number format
        if (request.getPaymentMethod().name().equals("CARD")) {
            String cardNumber = request.getCardNumber();
            return cardNumber != null && cardNumber.matches("^[0-9]{13,19}$");
        }

        return false;
    }

    /**
     * Tạo QR code cho vé
     */
    private String generateTicketQRCode(Booking booking) {
        // Format: BOOKING-{bookingId}-{UUID}
        return "BOOKING-" + booking.getId() + "-" + UUID.randomUUID().toString();
    }

    /**
     * ST-203: Gửi lệnh in vé tới printer
     */
    private String triggerPrinting(Booking booking, Showtime showtime, List<Seat> seats, String qrCode) {
        try {
            // Gọi PrinterService để gửi lệnh in
            return printerService.printTickets(booking, showtime, seats, qrCode);
        } catch (Exception e) {
            // Nếu in thất bại, vẫn trả về success vì booking đã hoàn tất
            // Log error lại cho admin check
            System.err.println("Printing failed: " + e.getMessage());
            return "PRINT_FAILED_" + booking.getId();
        }
    }

    /**
     * Build response cho checkout
     */
    private POSCheckoutResponse buildCheckoutResponse(
            Booking booking,
            Order order,
            Payment payment,
            Showtime showtime,
            List<Seat> seats,
            BigDecimal subtotal,
            BigDecimal tax,
            String ticketQrCode,
            String printJobId) {

        POSCheckoutResponse response = new POSCheckoutResponse();
        response.setBookingId(booking.getId());
        response.setOrderId(order.getId());
        response.setPaymentId(payment.getId());
        response.setMovieTitle(showtime.getMovie().getTitle());
        response.setRoomName(showtime.getRoom().getName());
        response.setShowtimeStart(showtime.getStartTime());
        response.setShowtimeEnd(showtime.getEndTime());
        response.setSelectedSeats(seats.stream()
                .map(s -> s.getRowLabel() + s.getSeatNumber())
                .collect(Collectors.toList()));
        response.setSubtotal(subtotal);
        response.setTax(tax);
        response.setTotalPrice(payment.getAmount());
        response.setPaymentMethod(payment.getMethod().name());
        response.setPaymentStatus(payment.getStatus().name());
        response.setPaidAt(payment.getPaidAt());
        response.setTicketQrCode(ticketQrCode);
        response.setPrintJobId(printJobId);

        return response;
    }
}
