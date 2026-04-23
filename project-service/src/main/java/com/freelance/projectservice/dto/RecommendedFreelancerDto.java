package com.freelance.projectservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecommendedFreelancerDto {
    private Long freelancerId;
    private String name;
    private List<String> skills;
    private Integer experienceYears;
    private Integer availability;
    private Double matchScore;
    private Double skillMatch;
    private Double experienceFactor;
    private Double availabilityFactor;
}
