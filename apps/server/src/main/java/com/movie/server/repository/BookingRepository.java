package com.movie.server.repository;

import com.movie.server.entity.Booking;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByIdAndDeletedAtIsNull(Long id);
}
