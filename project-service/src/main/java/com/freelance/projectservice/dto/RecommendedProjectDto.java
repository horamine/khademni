package com.freelance.projectservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecommendedProjectDto {
    private Long projectId;
    private String title;
    private Double budget;
    private List<String> requiredSkills;
    private Double matchScore;
    private Double skillMatch;
    private Double experienceFactor;
    private Double availabilityFactor;
}
