package com.freelance.projectservice.dto;

import com.freelance.projectservice.entity.ContractStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ContractDto {
    private Long id;
    private Long projectId;
    private Long applicationId;
    private Long clientId;
    private Long freelancerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private ContractStatus status;
    private Double payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String projectTitle;
    private String clientName;
    private String freelancerName;
}
