package com.movie.server.controller;

import com.movie.server.dto.request.SeatRequest;
import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.SeatResponse;
import com.movie.server.service.SeatService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SeatResponse>>> findAll(@RequestParam(required = false) Long roomId) {
        List<SeatResponse> seats = seatService.findAll(roomId);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Seats fetched", seats));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SeatResponse>> findById(@PathVariable Long id) {
        SeatResponse seat = seatService.findById(id);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Seat fetched", seat));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SeatResponse>> create(@RequestBody SeatRequest request) {
        SeatResponse seat = seatService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(LocalDateTime.now(), HttpStatus.CREATED.value(), "Seat created", seat));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SeatResponse>> update(
            @PathVariable Long id, @RequestBody SeatRequest request) {
        SeatResponse seat = seatService.update(id, request);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Seat updated", seat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        seatService.softDelete(id);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Seat deleted", null));
    }
}
