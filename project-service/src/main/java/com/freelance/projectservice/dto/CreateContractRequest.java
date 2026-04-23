package com.freelance.projectservice.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateContractRequest {
    private Long applicationId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double payment;
}
