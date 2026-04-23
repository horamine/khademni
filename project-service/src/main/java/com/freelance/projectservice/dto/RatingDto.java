package com.freelance.projectservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RatingDto {
    private Long id;
    private Long contractId;
    private Long clientId;
    private Long freelancerId;
    private Integer score;
    private String comment;
    private LocalDateTime createdAt;
}
