package com.movie.server.controller;

import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.DashboardResponse;
import com.movie.server.service.DashboardService;
import java.time.LocalDateTime;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        DashboardResponse dashboard = dashboardService.getDashboard(startDate, endDate);
        return ResponseEntity.ok(
                new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Dashboard fetched", dashboard));
    }
}
