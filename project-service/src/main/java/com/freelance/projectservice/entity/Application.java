package com.freelance.projectservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long projectId;
    private Long freelancerId; // référence au freelancer dans user-service

    private LocalDateTime appliedAt;
    private String status; // PENDING, ACCEPTED, REJECTED

    @PrePersist
    public void prePersist() {
        appliedAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}