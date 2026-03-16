package com.fooddhuniya.dto;

import com.fooddhuniya.model.TicketType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketStatsResponse {
    private long totalTicketsSold;
    private long totalRevenue;
    private Map<TicketType, Long> ticketsByType;
    private long refundRequests;
    private List<DailySales> salesHistory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySales {
        private String date;
        private Long count;
    }
}
