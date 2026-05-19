package com.movie.server.service;

import com.movie.server.dto.response.POSSeatMapResponse;
import com.movie.server.dto.response.SeatStatusResponse;
import com.movie.server.entity.Seat;
import com.movie.server.entity.Showtime;
import com.movie.server.entity.SeatTier;
import com.movie.server.entity.Ticket;
import com.movie.server.entity.TheaterRoom;
import com.movie.server.exception.BadRequestException;
import com.movie.server.exception.ResourceNotFoundException;
import com.movie.server.repository.SeatRepository;
import com.movie.server.repository.ShowtimeRepository;
import com.movie.server.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class POSSeatService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    public POSSeatService(
            ShowtimeRepository showtimeRepository,
            SeatRepository seatRepository,
            TicketRepository ticketRepository) {
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.ticketRepository = ticketRepository;
    }

    /**
     * ST-202: Lấy sơ đồ ghế của một showtime
     */
    public POSSeatMapResponse getSeatMap(Long showtimeId) {
        Showtime showtime = showtimeRepository.findByIdAndDeletedAtIsNull(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + showtimeId));

        TheaterRoom room = showtime.getRoom();
        List<Seat> allSeats = seatRepository.findByRoomIdOrderByRowAndSeat(room.getId());

        // Lấy tất cả ghế đã đặt cho showtime này
        Set<Long> bookedSeatIds = getBookedSeatIds(showtimeId);

        // Chuyển sang response
        List<SeatStatusResponse> seatResponses = allSeats.stream()
                .map(seat -> toSeatStatusResponse(seat, bookedSeatIds))
                .collect(Collectors.toList());

        return new POSSeatMapResponse(
                showtimeId,
                room.getId(),
                room.getName(),
                room.getTotalRows(),
                room.getSeatsPerRow(),
                seatResponses);
    }

    /**
     * ST-202: Kiểm tra các ghế có sẵn hay không (conflict check)
     * Throw exception nếu bất kỳ ghế nào đã được đặt
     */
    @Transactional
    public void validateSeatsAvailable(Long showtimeId, List<Long> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new BadRequestException("At least one seat must be selected");
        }

        // Lấy các ghế đã đặt cho showtime này
        Set<Long> bookedSeatIds = getBookedSeatIds(showtimeId);

        // Kiểm tra conflict
        for (Long seatId : seatIds) {
            if (bookedSeatIds.contains(seatId)) {
                Seat seat = seatRepository.findByIdAndDeletedAtIsNull(seatId)
                        .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));
                throw new BadRequestException(
                        "Seat " + seat.getRowLabel() + seat.getSeatNumber() + " is already booked");
            }
        }
    }

    /**
     * Lấy tập hợp ID các ghế đã được đặt cho một showtime
     */
    private Set<Long> getBookedSeatIds(Long showtimeId) {
        // Query tất cả tickets cho showtime này có status = PAID
        List<Ticket> bookedTickets = ticketRepository.findByShowtimeIdAndStatus(showtimeId, TicketStatus.PAID);

        return bookedTickets.stream()
                .map(ticket -> ticket.getSeat().getId())
                .collect(Collectors.toSet());
    }

    /**
     * Chuyển từ Seat entity sang SeatStatusResponse
     */
    private SeatStatusResponse toSeatStatusResponse(Seat seat, Set<Long> bookedSeatIds) {
        String status = bookedSeatIds.contains(seat.getId()) ? "BOOKED" : "AVAILABLE";

        SeatTier tier = seat.getTier();
        String hexColor = tier != null ? tier.getHexColor() : "#FF0080";
        String tierType = tier != null ? tier.getType() : "Regular";

        return new SeatStatusResponse(
                seat.getId(),
                seat.getRowLabel(),
                seat.getSeatNumber(),
                tierType,
                tier != null ? tier.getPrice() : null,
                status,
                hexColor);
    }

    /**
     * Lấy chi tiết ghế
     */
    public Seat getSeatById(Long seatId) {
        return seatRepository.findByIdAndDeletedAtIsNull(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));
    }

    /**
     * Lấy tất cả ghế của một phòng
     */
    public List<Seat> getSeatsByRoom(Long roomId) {
        return seatRepository.findByRoomIdOrderByRowAndSeat(roomId);
    }

    /**
     * Kiểm tra xem ghế có valid không
     */
    public boolean isValidSeat(Long roomId, Long seatId) {
        Seat seat = seatRepository.findByIdAndDeletedAtIsNull(seatId).orElse(null);
        return seat != null && seat.getRoom().getId().equals(roomId);
    }
}
