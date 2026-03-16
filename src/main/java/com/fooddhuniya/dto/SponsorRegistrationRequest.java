package com.fooddhuniya.dto;

import com.fooddhuniya.model.SponsorCategory;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SponsorRegistrationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "Contact person is required")
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotNull(message = "Category is required")
    private SponsorCategory category;

    private String logoUrl;
    
    private String bannerUrl;

    private String description;
}
