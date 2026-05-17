package com.movie.server.controller;

import com.movie.server.dto.request.ForgotPasswordRequest;
import com.movie.server.dto.request.LoginRequest;
import com.movie.server.dto.request.RegisterRequest;
import com.movie.server.dto.request.ResetPasswordRequest;
import com.movie.server.dto.request.VerifyOtpRequest;
import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.AuthResponse;
import com.movie.server.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        AuthResponse data = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(LocalDateTime.now(), HttpStatus.CREATED.value(), "Đăng ký thành công", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        AuthResponse data = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Đăng nhập thành công", data));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<AuthResponse>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        AuthResponse data = authService.forgotPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), data.getMessage(), data));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        AuthResponse data = authService.verifyOtp(request);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), data.getMessage(), data));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<AuthResponse>> resetPassword(@RequestBody ResetPasswordRequest request) {
        AuthResponse data = authService.resetPassword(request);
        return ResponseEntity.ok(new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), data.getMessage(), data));
    }
}
