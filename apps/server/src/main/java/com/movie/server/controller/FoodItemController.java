package com.movie.server.controller;

import com.movie.server.dto.request.FoodItemRequest;
import com.movie.server.dto.response.ApiResponse;
import com.movie.server.dto.response.FoodItemResponse;
import com.movie.server.service.FoodItemService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/food-items")
public class FoodItemController {
    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodItemResponse>>> findAll() {
        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(), HttpStatus.OK.value(), "Food items fetched", foodItemService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodItemResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(), HttpStatus.OK.value(), "Food item fetched", foodItemService.findById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FoodItemResponse>> create(
            @ModelAttribute FoodItemRequest request, @RequestPart("image") MultipartFile image) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                LocalDateTime.now(),
                HttpStatus.CREATED.value(),
                "Food item created",
                foodItemService.create(request, image)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodItemResponse>> update(@PathVariable Long id, @RequestBody FoodItemRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(
                LocalDateTime.now(), HttpStatus.OK.value(), "Food item updated", foodItemService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        foodItemService.softDelete(id);
        return ResponseEntity.ok(
                new ApiResponse<>(LocalDateTime.now(), HttpStatus.OK.value(), "Food item deleted", null));
    }
}
