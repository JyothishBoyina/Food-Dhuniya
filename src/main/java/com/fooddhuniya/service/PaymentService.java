package com.fooddhuniya.service;

import com.fooddhuniya.dto.PaymentOrderRequest;
import com.fooddhuniya.dto.PaymentVerifyRequest;
import com.fooddhuniya.model.Payment;
import com.fooddhuniya.model.PaymentStatus;
import com.fooddhuniya.model.Ticket;
import com.fooddhuniya.model.User;
import com.fooddhuniya.repository.PaymentRepository;
import com.fooddhuniya.repository.TicketRepository;
import com.fooddhuniya.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public Map<String, String> createPaymentOrder(PaymentOrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = null;
        if (request.getTicketId() != null) {
            ticket = ticketRepository.findById(request.getTicketId())
                    .orElseThrow(() -> new RuntimeException("Ticket not found"));
        }

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setTicket(ticket);
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentMethod("RAZORPAY");

        // Mock Razorpay Order ID Generation for prototype
        String mockOrderId = "order_" + UUID.randomUUID().toString().substring(0, 10);
        payment.setTransactionId(mockOrderId);

        paymentRepository.save(payment);

        Map<String, String> response = new HashMap<>();
        response.put("razorpayOrderId", mockOrderId);
        response.put("amount", request.getAmount().toString());
        response.put("currency", "INR");
        return response;
    }

    public Payment verifyPayment(PaymentVerifyRequest request) {
        // In reality, you'd use Razorpay's Utils.verifyPaymentSignature here
        // We will simulate a successful verification for the prototype

        Payment payment = paymentRepository.findByTransactionId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment Order not found"));

        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        // Replace order ID with actual payment ID for record keeping
        payment.setTransactionId(request.getRazorpayPaymentId());

        return paymentRepository.save(payment);
    }
}
