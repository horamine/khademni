package com.freelance.projectservice.dto;

import lombok.Data;

@Data
public class CreateRatingRequest {
    private Long contractId;
    private Integer score;
    private String comment;
}
