package com.example.userservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Entity
@Table(name = "freelancers")
@Data
@EqualsAndHashCode(callSuper = true)
@PrimaryKeyJoinColumn(name = "id")
public class Freelancer extends User {

    @ElementCollection
    @CollectionTable(
            name = "freelancer_skills",
            joinColumns = @JoinColumn(name = "freelancer_id")
    )
    @Column(name = "skill")
    private List<String> skills;

    private int experienceYears;
    private int availability;
    private boolean profileComplete;
}