package com.example.userservice.controller;

import com.example.userservice.entity.Freelancer;
import com.example.userservice.service.FreelancerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/freelancers")
@RequiredArgsConstructor
public class FreelancerController {

    private final FreelancerService freelancerService;

    @GetMapping
    public ResponseEntity<List<Freelancer>> getAllFreelancers() {
        return ResponseEntity.ok(freelancerService.getAllFreelancers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Freelancer> getFreelancerById(@PathVariable Long id) {
        return ResponseEntity.ok(freelancerService.getFreelancerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Freelancer> updateFreelancer(@PathVariable Long id, @RequestBody Freelancer freelancer) {
        return ResponseEntity.ok(freelancerService.updateFreelancer(id, freelancer));
    }

    @GetMapping("/{id}/profile-complete")
    public ResponseEntity<Boolean> isProfileComplete(@PathVariable Long id) {
        return ResponseEntity.ok(freelancerService.isProfileComplete(id));
    }
}
