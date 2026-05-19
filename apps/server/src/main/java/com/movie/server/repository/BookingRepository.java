package com.movie.server.repository;

import com.movie.server.entity.Booking;
import com.movie.server.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * ST-203: Lấy booking theo id (not deleted)
     */
    Optional<Booking> findByIdAndDeletedAtIsNull(Long id);

    /**
     * Lấy tất cả bookings của user (not deleted)
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.deletedAt IS NULL
              AND b.user.id = :userId
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * Lấy bookings theo status
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.deletedAt IS NULL
              AND b.status = :status
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByStatusOrderByCreatedAtDesc(@Param("status") BookingStatus status);

    /**
     * Kiểm tra xem showtime có booking nào không
     */
    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.deletedAt IS NULL
              AND b.showtime.id = :showtimeId
              AND b.status != 'CANCELLED'
            """)
    Long countActiveBookingsByShowtime(@Param("showtimeId") Long showtimeId);
}
