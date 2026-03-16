package com.fooddhuniya.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalTicketsSold;
    private long totalVendorsRegistered;
    private long totalApprovedVendors;
    private BigDecimal totalRevenue;
    private long totalScheduledEvents;
    private long totalSponsors;
    private long totalVisitors;
}
