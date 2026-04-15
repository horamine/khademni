package com.freelance.projectservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_required_skills",
            joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill")
    private List<String> requiredSkills;

    private Double budget;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private String clientId; // référence au client dans user-service

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) status = ProjectStatus.OPEN;
    }
}