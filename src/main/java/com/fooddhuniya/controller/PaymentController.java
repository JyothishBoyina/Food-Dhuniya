package com.fooddhuniya.controller;

import com.fooddhuniya.dto.PaymentOrderRequest;
import com.fooddhuniya.dto.PaymentVerifyRequest;
import com.fooddhuniya.model.Payment;
import com.fooddhuniya.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('VISITOR') or hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> createPaymentOrder(@Valid @RequestBody PaymentOrderRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentOrder(request));
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('VISITOR') or hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Payment> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }
}
