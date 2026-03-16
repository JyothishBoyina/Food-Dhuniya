package com.fooddhuniya.dto;

import com.fooddhuniya.model.Ticket;
import com.fooddhuniya.model.TicketStatus;
import com.fooddhuniya.model.TicketType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TicketResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private TicketType ticketType;
    private Integer quantity;
    private BigDecimal totalAmount;
    private String qrCode;
    private String paymentStatus;
    private TicketStatus status;
    private boolean used;
    private LocalDateTime createdAt;

    public static TicketResponse fromEntity(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setUserId(ticket.getUser().getId());
        response.setName(ticket.getName());
        response.setEmail(ticket.getEmail());
        response.setPhone(ticket.getPhone());
        response.setTicketType(ticket.getTicketType());
        response.setQuantity(ticket.getQuantity());
        response.setTotalAmount(ticket.getTotalAmount());
        response.setQrCode(ticket.getQrCode());
        response.setPaymentStatus(ticket.getPaymentStatus());
        response.setStatus(ticket.getStatus());
        response.setUsed(ticket.isUsed());
        response.setCreatedAt(ticket.getCreatedAt());
        return response;
    }
}
