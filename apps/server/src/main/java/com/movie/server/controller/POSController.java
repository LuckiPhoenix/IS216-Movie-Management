package com.movie.server.controller;

import com.movie.server.dto.request.GetSeatMapRequest;
import com.movie.server.dto.request.POSCheckoutRequest;
import com.movie.server.dto.request.QuickShowtimeSelectorRequest;
import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.POSCheckoutResponse;
import com.movie.server.dto.response.POSSeatMapResponse;
import com.movie.server.dto.response.QuickShowtimeResponse;
import com.movie.server.service.POSCheckoutService;
import com.movie.server.service.POSSeatService;
import com.movie.server.service.POSShowtimeService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pos")
public class POSController {

    private final POSShowtimeService posShowtimeService;
    private final POSSeatService posSeatService;
    private final POSCheckoutService posCheckoutService;

    public POSController(
            POSShowtimeService posShowtimeService,
            POSSeatService posSeatService,
            POSCheckoutService posCheckoutService) {
        this.posShowtimeService = posShowtimeService;
        this.posSeatService = posSeatService;
        this.posCheckoutService = posCheckoutService;
    }

    /**
     * ST-201: Get quick showtime selector - lưới danh sách phim và lịch chiếu
     * GET /api/pos/showtimes?date=2024-01-15&roomId=1 (roomId optional)
     */
    @GetMapping("/showtimes")
    public ResponseEntity<ApiResponse<List<QuickShowtimeResponse>>> getShowtimes(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long roomId) {

        List<QuickShowtimeResponse> showtimes = posShowtimeService.getQuickShowtimesByDate(date, roomId);

        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Showtimes fetched successfully",
                showtimes));
    }

    /**
     * ST-201: Get showtime detail
     * GET /api/pos/showtimes/{showtimeId}
     */
    @GetMapping("/showtimes/{showtimeId}")
    public ResponseEntity<ApiResponse<QuickShowtimeResponse>> getShowtimeDetail(
            @PathVariable Long showtimeId) {

        QuickShowtimeResponse showtime = posShowtimeService.getShowtimeDetail(showtimeId);

        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Showtime detail fetched successfully",
                showtime));
    }

    /**
     * ST-202: Get POS seat map - sơ đồ ghế tương tác
     * GET /api/pos/seatmap/{showtimeId}
     */
    @GetMapping("/seatmap/{showtimeId}")
    public ResponseEntity<ApiResponse<POSSeatMapResponse>> getSeatMap(
            @PathVariable Long showtimeId) {

        POSSeatMapResponse seatMap = posSeatService.getSeatMap(showtimeId);

        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Seat map fetched successfully",
                seatMap));
    }

    /**
     * ST-202: Validate seats before checkout - kiểm tra xung đột ghế
     * POST /api/pos/validate-seats
     * Body: { showtimeId: 1, selectedSeatIds: [1, 2, 3] }
     */
    @PostMapping("/validate-seats")
    public ResponseEntity<ApiResponse<Object>> validateSeats(
            @RequestBody GetSeatMapRequest request) {

        // Validate - nếu exception được throw, controller advice sẽ xử lý
        posSeatService.validateSeatsAvailable(request.getShowtimeId(), null);

        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.OK.value(),
                "Seats are available",
                null));
    }

    /**
     * ST-203: POS Checkout - xử lý thanh toán, tạo booking và in vé
     * POST /api/pos/checkout
     * Body:
     * {
     *   "showtimeId": 1,
     *   "selectedSeatIds": [1, 2, 3],
     *   "customerId": 100,  (optional - nếu không có là khách vãng lai)
     *   "customerName": "John Doe",
     *   "customerPhone": "0123456789",
     *   "paymentMethod": "CASH",  (CASH hoặc CARD)
     *   "cardNumber": "1234567890123456",  (nếu CARD)
     *   "notes": "Ghi chú thêm"
     * }
     */
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<POSCheckoutResponse>> checkout(
            @RequestBody POSCheckoutRequest request) {

        POSCheckoutResponse response = posCheckoutService.checkout(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                "Checkout completed successfully. Printing ticket...",
                response));
    }
}
