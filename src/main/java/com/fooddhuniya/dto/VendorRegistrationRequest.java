package com.fooddhuniya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VendorRegistrationRequest {

    private Long userId;

    @NotBlank
    private String businessName;

    @NotBlank
    private String contactPerson;

    @NotBlank
    private String phone;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String cuisineType;

    private String menuItems;
    private String fssaiLicense;
    private String stallType;
    private String logoUrl;
}
