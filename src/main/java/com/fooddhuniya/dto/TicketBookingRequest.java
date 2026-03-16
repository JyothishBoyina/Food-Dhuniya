package com.fooddhuniya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketBookingRequest {
    @NotNull
    private Long userId;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String phone;

    @Min(0)
    private Integer generalQuantity = 0;

    @Min(0)
    private Integer vipQuantity = 0;
}
