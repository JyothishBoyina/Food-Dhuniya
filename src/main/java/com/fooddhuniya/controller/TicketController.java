package com.fooddhuniya.controller;

import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.dto.TicketBookingRequest;
import com.fooddhuniya.dto.TicketResponse;
import com.fooddhuniya.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    @PreAuthorize("hasRole('VISITOR') or hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> bookTicket(@Valid @RequestBody TicketBookingRequest request) {
        List<TicketResponse> bookedTickets = ticketService.bookTicket(request);
        return ResponseEntity.ok(bookedTickets);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('VISITOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<TicketResponse>> getUserTickets(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ticketService.getUserTickets(userId, PageRequest.of(page, size)));
    }

    @GetMapping("/validate/{ticketId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validateTicketEntry(@PathVariable Long ticketId) {
        try {
            TicketResponse validatedTicket = ticketService.validateTicketEntry(ticketId);
            return ResponseEntity.ok(validatedTicket);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
