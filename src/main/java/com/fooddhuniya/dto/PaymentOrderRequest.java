package com.fooddhuniya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentOrderRequest {
    @NotNull
    private Long userId;

    private Long ticketId; // Optional if paying for something else later

    @NotNull
    private BigDecimal amount;
}
