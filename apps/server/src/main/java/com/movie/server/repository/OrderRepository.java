package com.movie.server.repository;

import com.movie.server.entity.Order;
import com.movie.server.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * ST-203: Lấy order theo id (not deleted)
     */
    Optional<Order> findByIdAndDeletedAtIsNull(Long id);

    /**
     * Lấy orders của user
     */
    @Query("""
            SELECT o FROM Order o
            WHERE o.deletedAt IS NULL
              AND o.user.id = :userId
            ORDER BY o.createdAt DESC
            """)
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    /**
     * Lấy orders theo status
     */
    @Query("""
            SELECT o FROM Order o
            WHERE o.deletedAt IS NULL
              AND o.status = :status
            ORDER BY o.createdAt DESC
            """)
    List<Order> findByStatusOrderByCreatedAtDesc(@Param("status") OrderStatus status);
}
