package com.movie.server.service;

import com.movie.server.entity.Booking;
import com.movie.server.entity.Seat;
import com.movie.server.entity.Showtime;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * PrinterService - Dịch vụ in vé
 * Đây là lớp trung gian giữa backend và hệ thống in vé vật lý
 */
@Service
public class PrinterService {

    /**
     * ST-203: Gửi lệnh in vé tới hệ thống in vé vật lý
     * @param booking - Thông tin booking
     * @param showtime - Thông tin showtime
     * @param seats - Danh sách ghế được đặt
     * @param qrCode - QR code vé
     * @return ID của lệnh in
     */
    public String printTickets(Booking booking, Showtime showtime, List<Seat> seats, String qrCode) {
        // Tạo print job ID
        String printJobId = "PRINT-" + UUID.randomUUID().toString();

        try {
            // Chuẩn bị dữ liệu in
            String printData = buildPrintData(booking, showtime, seats, qrCode);

            // Gửi tới printer queue hoặc print service
            // Ví dụ: gọi API tới print server
            sendToPrinter(printJobId, printData);

            return printJobId;
        } catch (Exception e) {
            throw new RuntimeException("Failed to print tickets: " + e.getMessage(), e);
        }
    }

    /**
     * Chuẩn bị dữ liệu để in
     */
    private String buildPrintData(Booking booking, Showtime showtime, List<Seat> seats, String qrCode) {
        StringBuilder sb = new StringBuilder();

        sb.append("=== MOVIE TICKET ===\n");
        sb.append("Booking ID: ").append(booking.getId()).append("\n");
        sb.append("Movie: ").append(showtime.getMovie().getTitle()).append("\n");
        sb.append("Room: ").append(showtime.getRoom().getName()).append("\n");
        sb.append("Date/Time: ").append(showtime.getStartTime()).append("\n");
        sb.append("Seats: ");

        for (Seat seat : seats) {
            sb.append(seat.getRowLabel()).append(seat.getSeatNumber()).append(" ");
        }

        sb.append("\n");
        sb.append("Total Price: ").append(booking.getTotalPrice()).append("\n");
        sb.append("QR Code: ").append(qrCode).append("\n");
        sb.append("====================\n");

        return sb.toString();
    }

    /**
     * Gửi dữ liệu tới printer
     * Trong thực tế, đây có thể là:
     * - Gửi HTTP request tới print server
     * - Ghi vào queue system
     * - Gửi tới ESC/POS printer
     */
    private void sendToPrinter(String printJobId, String printData) {
        // TODO: Integrate with actual printer system
        // Ví dụ:
        // 1. HTTP call: POST /print-server/print
        // 2. Message queue: Send to RabbitMQ/Kafka
        // 3. Direct printer: Use java.awt.print or similar

        System.out.println("[PRINT JOB: " + printJobId + "]");
        System.out.println(printData);
    }

    /**
     * Kiểm tra status của print job
     */
    public String getPrintStatus(String printJobId) {
        // TODO: Query print server for job status
        return "COMPLETED"; // Hoặc PENDING, FAILED, etc.
    }

    /**
     * Hủy print job
     */
    public void cancelPrintJob(String printJobId) {
        // TODO: Send cancel command to print server
        System.out.println("[PRINT JOB CANCELLED: " + printJobId + "]");
    }
}
