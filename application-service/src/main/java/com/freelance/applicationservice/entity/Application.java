package com.freelance.applicationservice.entity;

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

    private Long freelancerId;

    private String status; // PENDING, ACCEPTED, REJECTED

    private String message;

    private LocalDateTime appliedAt = LocalDateTime.now();
}
