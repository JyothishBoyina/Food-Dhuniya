package com.fooddhuniya.service;

import com.fooddhuniya.dto.TicketBookingRequest;
import com.fooddhuniya.dto.TicketResponse;
import com.fooddhuniya.model.Ticket;
import com.fooddhuniya.model.TicketStatus;
import com.fooddhuniya.model.TicketType;
import com.fooddhuniya.model.User;
import com.fooddhuniya.repository.TicketRepository;
import com.fooddhuniya.repository.UserRepository;
import com.fooddhuniya.utils.QrCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    // Hardcoded prices for demonstration
    private static final BigDecimal GENERAL_PRICE = new BigDecimal("299.00");
    private static final BigDecimal VIP_PRICE = new BigDecimal("799.00");

    private Ticket createTicketEntity(User user, TicketBookingRequest request, TicketType type, int quantity, BigDecimal unitPrice) {
        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setName(request.getName());
        ticket.setEmail(request.getEmail());
        ticket.setPhone(request.getPhone());
        ticket.setTicketType(type);
        ticket.setQuantity(quantity);
        ticket.setTotalAmount(unitPrice.multiply(BigDecimal.valueOf(quantity)));
        ticket.setStatus(TicketStatus.VALID);
        ticket.setPaymentStatus("COMPLETED");
        ticket.setUsed(false);

        // QR Code will be set after saving so it can contain the database ID
        return ticket;
    }

    public List<TicketResponse> bookTicket(TicketBookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Ticket> ticketsToSave = new ArrayList<>();

        if (request.getGeneralQuantity() != null && request.getGeneralQuantity() > 0) {
            ticketsToSave.add(createTicketEntity(user, request, TicketType.GENERAL, request.getGeneralQuantity(), GENERAL_PRICE));
        }

        if (request.getVipQuantity() != null && request.getVipQuantity() > 0) {
            ticketsToSave.add(createTicketEntity(user, request, TicketType.VIP, request.getVipQuantity(), VIP_PRICE));
        }

        if (ticketsToSave.isEmpty()) {
            throw new RuntimeException("Must book at least one ticket.");
        }

        List<Ticket> savedTickets = ticketRepository.saveAll(ticketsToSave);

        // Generate QR Code containing the ticket ID
        for (Ticket t : savedTickets) {
            t.setQrCode(t.getId().toString()); // Contains the exactly ticket ID
        }
        
        ticketRepository.saveAll(savedTickets);

        // Trigger Async Confirmation Emails
        for (Ticket t : savedTickets) {
            System.out.println("Triggering email confirmation for ticket: " + t.getId());
            emailService.sendTicketConfirmation(t.getEmail(), t.getName(), t);
        }

        return savedTickets.stream().map(TicketResponse::fromEntity).collect(Collectors.toList());
    }

    public Page<TicketResponse> getUserTickets(Long userId, Pageable pageable) {
        Page<Ticket> tickets = ticketRepository.findByUserId(userId, pageable);
        List<TicketResponse> dtoList = tickets.getContent().stream()
                .map(TicketResponse::fromEntity)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, tickets.getTotalElements());
    }

    public Ticket getTicketByQr(String qrCode) {
        return ticketRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new RuntimeException("Invalid QR Code: Ticket not found"));
    }

    public TicketResponse validateTicketEntry(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Invalid Ticket: Ticket does not exist."));

        if (ticket.isUsed()) {
            throw new RuntimeException("Ticket Already Used");
        }
        
        if (ticket.getStatus() == TicketStatus.CANCELLED) {
            throw new RuntimeException("Ticket is cancelled and invalid.");
        }

        // Mark as used
        ticket.setUsed(true);
        ticket.setStatus(TicketStatus.USED);
        return TicketResponse.fromEntity(ticketRepository.save(ticket));
    }
}
