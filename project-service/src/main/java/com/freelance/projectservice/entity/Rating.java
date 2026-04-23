package com.freelance.projectservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Data
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long contractId;

    @Column(nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private Long freelancerId;

    @Min(1)
    @Max(5)
    private Integer score; // 1-5

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
