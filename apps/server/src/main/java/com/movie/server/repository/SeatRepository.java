package com.movie.server.repository;

import com.movie.server.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    /**
     * ST-202: Lấy tất cả ghế của một phòng (not deleted)
     */
    @Query("""
            SELECT s FROM Seat s
            WHERE s.deletedAt IS NULL
              AND s.room.id = :roomId
            ORDER BY s.rowLabel, s.seatNumber ASC
            """)
    List<Seat> findByRoomIdOrderByRowAndSeat(@Param("roomId") Long roomId);

    /**
     * Lấy ghế theo row và seat number
     */
    @Query("""
            SELECT s FROM Seat s
            WHERE s.deletedAt IS NULL
              AND s.room.id = :roomId
              AND s.rowLabel = :rowLabel
              AND s.seatNumber = :seatNumber
            """)
    Optional<Seat> findByRoomAndRowAndSeat(
            @Param("roomId") Long roomId,
            @Param("rowLabel") String rowLabel,
            @Param("seatNumber") Integer seatNumber);

    /**
     * Lấy ghế theo id (not deleted)
     */
    Optional<Seat> findByIdAndDeletedAtIsNull(Long id);

    /**
     * Đếm ghế theo tier trong một phòng
     */
    @Query("""
            SELECT COUNT(s) FROM Seat s
            WHERE s.deletedAt IS NULL
              AND s.room.id = :roomId
              AND s.tier.id = :tierId
            """)
    Long countByRoomAndTier(@Param("roomId") Long roomId, @Param("tierId") Long tierId);
}
