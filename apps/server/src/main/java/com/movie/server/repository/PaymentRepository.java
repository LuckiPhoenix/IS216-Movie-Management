package com.movie.server.repository;

import com.movie.server.entity.Payment;
import com.movie.server.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * ST-203: Lấy payment theo booking id
     */
    Optional<Payment> findByBookingId(Long bookingId);

    /**
     * Lấy payment theo order id
     */
    Optional<Payment> findByOrderId(Long orderId);

    /**
     * Lấy payments theo status
     */
    @Query("""
            SELECT p FROM Payment p
            WHERE p.status = :status
            ORDER BY p.paidAt DESC
            """)
    List<Payment> findByStatusOrderByPaidAtDesc(@Param("status") PaymentStatus status);

    /**
     * Lấy payments trong khoảng thời gian
     */
    @Query("""
            SELECT p FROM Payment p
            WHERE p.status = 'COMPLETED'
              AND p.paidAt >= :from
              AND p.paidAt <= :to
            ORDER BY p.paidAt DESC
            """)
    List<Payment> findCompletedPaymentsBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
