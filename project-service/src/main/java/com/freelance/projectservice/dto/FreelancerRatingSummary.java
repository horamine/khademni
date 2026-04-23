package com.freelance.projectservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerRatingSummary {
    private Long freelancerId;
    private Double averageScore;
    private Integer totalRatings;
}
