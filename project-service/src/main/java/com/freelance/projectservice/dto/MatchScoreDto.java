package com.freelance.projectservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchScoreDto {
    private Double score;
    private Double skillMatch;
    private Double experienceFactor;
    private Double availabilityFactor;
    private Long freelancerId;
    private Long projectId;
}
