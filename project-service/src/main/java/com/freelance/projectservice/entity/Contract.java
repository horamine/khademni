package com.freelance.projectservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
@Data
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;
    private Long freelancerId;
    private Long clientId;
    private Long projectId;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status; // ACTIVE, COMPLETED, CANCELLED

    private Double payment;

    @PrePersist
    public void prePersist() {
        if (status == null) status = "ACTIVE";
    }
}
