package com.example.userservice.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "FREELANCER", "CLIENT", "ADMIN"

    // champs Freelancer (optionnels)
    private List<String> skills;
    private Integer experienceYears;
    private Integer availability;

    // champs Client (optionnels)
    private String company;
    private String budgetRange;
}