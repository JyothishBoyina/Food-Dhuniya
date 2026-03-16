package com.fooddhuniya.controller;

import com.fooddhuniya.dto.DashboardStatsResponse;
import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.dto.TicketStatsResponse;
import com.fooddhuniya.model.*;
import com.fooddhuniya.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.LocalDate;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

        @Autowired
        private TicketRepository ticketRepository;

        @Autowired
        private VendorRepository vendorRepository;

        @Autowired
        private PaymentRepository paymentRepository;

        @Autowired
        private EventScheduleRepository eventScheduleRepository;

        @Autowired
        private SponsorRepository sponsorRepository;

        @Autowired
        private UserRepository userRepository;

        @GetMapping("/stats")
        @PreAuthorize("hasRole('ADMIN') or hasRole('VENDOR_MANAGER') or hasRole('TICKET_MANAGER')")
        public ResponseEntity<DashboardStatsResponse> getStats() {
                long totalTickets = ticketRepository.count();
                long totalVendors = vendorRepository.count();
                long totalEvents = eventScheduleRepository.count();
                long totalSponsors = sponsorRepository.count();
                
                long totalVisitors = 1250; 

                long approvedVendors = vendorRepository.findAll().stream()
                                .filter(v -> v.getStatus() == VendorStatus.APPROVED).count();

                BigDecimal revenue = paymentRepository.findAll().stream()
                                .filter(p -> p.getPaymentStatus() == PaymentStatus.COMPLETED)
                                .map(p -> p.getAmount())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                DashboardStatsResponse stats = new DashboardStatsResponse(
                                totalTickets, 
                                totalVendors, 
                                approvedVendors, 
                                revenue,
                                totalEvents,
                                totalSponsors,
                                totalVisitors
                );

                return ResponseEntity.ok(stats);
        }

        @GetMapping("/tickets/stats")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<TicketStatsResponse> getTicketStats() {
                List<Ticket> allTickets = ticketRepository.findAll();
                
                long totalSold = allTickets.stream()
                        .filter(t -> t.getStatus() != TicketStatus.CANCELLED).count();
                
                Map<TicketType, Long> byType = allTickets.stream()
                        .filter(t -> t.getStatus() != TicketStatus.CANCELLED)
                        .collect(Collectors.groupingBy(Ticket::getTicketType, Collectors.counting()));
                
                long refundRequests = allTickets.stream()
                        .filter(t -> t.getStatus() == TicketStatus.REFUND_REQUESTED).count();

                LocalDateTime now = LocalDateTime.now();
                List<TicketStatsResponse.DailySales> history = new ArrayList<>();
                for (int i = 6; i >= 0; i--) {
                        LocalDate date = now.minusDays(i).toLocalDate();
                        long count = allTickets.stream()
                                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().toLocalDate().equals(date))
                                .count();
                        history.add(new TicketStatsResponse.DailySales(date.toString(), count));
                }

                return ResponseEntity.ok(new TicketStatsResponse(totalSold, totalSold * 500, byType, refundRequests, history));
        }

        @GetMapping("/users")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<User>> getAllUsers() {
                return ResponseEntity.ok(userRepository.findAll());
        }

        @PutMapping("/users/{id}/role")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Role role) {
                return userRepository.findById(id)
                        .map(user -> {
                                user.setRole(role);
                                userRepository.save(user);
                                return ResponseEntity.ok(new MessageResponse("Role updated successfully"));
                        })
                        .orElse(ResponseEntity.notFound().build());
        }
}
