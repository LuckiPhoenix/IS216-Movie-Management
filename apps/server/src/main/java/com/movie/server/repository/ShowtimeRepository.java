package com.movie.server.repository;

import com.movie.server.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    /**
     * ST-201: Tìm tất cả showtimes trong một ngày (not deleted)
     */
    @Query("""
            SELECT s FROM Showtime s
            WHERE s.deletedAt IS NULL
              AND DATE(s.startTime) = :date
            ORDER BY s.startTime ASC
            """)
    List<Showtime> findByDateOrderByStartTime(@Param("date") LocalDate date);

    /**
     * Tìm showtimes theo room trong một ngày
     */
    @Query("""
            SELECT s FROM Showtime s
            WHERE s.deletedAt IS NULL
              AND s.room.id = :roomId
              AND DATE(s.startTime) = :date
            ORDER BY s.startTime ASC
            """)
    List<Showtime> findByRoomAndDateOrderByStartTime(@Param("roomId") Long roomId, @Param("date") LocalDate date);

    /**
     * Tìm showtime theo id (not deleted)
     */
    Optional<Showtime> findByIdAndDeletedAtIsNull(Long id);

    /**
     * Kiểm tra xung đột showtimes - 2 showtimes không được có thời gian overlap cùng room
     */
    @Query("""
            SELECT s FROM Showtime s
            WHERE s.deletedAt IS NULL
              AND s.id != :showtimeId
              AND s.room.id = :roomId
              AND s.startTime < :endTime
              AND s.endTime > :startTime
            """)
    List<Showtime> findOverlappingShowtimes(
            @Param("showtimeId") Long showtimeId,
            @Param("roomId") Long roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
