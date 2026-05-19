package com.movie.server.service;

import com.movie.server.dto.response.QuickShowtimeResponse;
import com.movie.server.entity.Showtime;
import com.movie.server.entity.Ticket;
import com.movie.server.exception.ResourceNotFoundException;
import com.movie.server.repository.ShowtimeRepository;
import com.movie.server.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class POSShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final TicketRepository ticketRepository;

    public POSShowtimeService(ShowtimeRepository showtimeRepository, TicketRepository ticketRepository) {
        this.showtimeRepository = showtimeRepository;
        this.ticketRepository = ticketRepository;
    }

    /**
     * ST-201: Lấy danh sách showtimes trong ngày
     * @param date - ngày cần lấy (nếu null = hôm nay)
     * @param roomId - optional, nếu có thì lọc theo phòng
     */
    public List<QuickShowtimeResponse> getQuickShowtimesByDate(LocalDate date, Long roomId) {
        if (date == null) {
            date = LocalDate.now();
        }

        List<Showtime> showtimes;
        if (roomId != null) {
            showtimes = showtimeRepository.findByRoomAndDateOrderByStartTime(roomId, date);
        } else {
            showtimes = showtimeRepository.findByDateOrderByStartTime(date);
        }

        return showtimes.stream()
                .map(this::toQuickResponse)
                .collect(Collectors.toList());
    }

    /**
     * ST-201: Lấy chi tiết showtime cụ thể
     */
    public QuickShowtimeResponse getShowtimeDetail(Long showtimeId) {
        Showtime showtime = showtimeRepository.findByIdAndDeletedAtIsNull(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + showtimeId));

        return toQuickResponse(showtime);
    }

    /**
     * Chuyển từ entity sang response
     */
    private QuickShowtimeResponse toQuickResponse(Showtime showtime) {
        // Tính số ghế đã đặt từ tickets
        long bookedSeats = getBookedSeatsCount(showtime.getId());

        // Tổng số ghế = totalRows * seatsPerRow
        long totalSeats = (long) showtime.getRoom().getTotalRows() * showtime.getRoom().getSeatsPerRow();

        return new QuickShowtimeResponse(
                showtime.getId(),
                showtime.getMovie().getId(),
                showtime.getMovie().getTitle(),
                showtime.getMovie().getDurationMinutes(),
                showtime.getMovie().getGenre(),
                showtime.getRoom().getId(),
                showtime.getRoom().getName(),
                showtime.getStartTime(),
                showtime.getEndTime(),
                showtime.getBasePrice(),
                totalSeats,
                bookedSeats);
    }

    /**
     * Đếm số ghế đã đặt cho một showtime
     */
    private long getBookedSeatsCount(Long showtimeId) {
        // Query tất cả tickets cho showtime này có status = PAID
        List<Ticket> bookedTickets = ticketRepository.findByShowtimeIdAndStatus(showtimeId, TicketStatus.PAID);
        return bookedTickets.size();
    }
}
