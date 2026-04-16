package com.freelance.applicationservice.controller;

import com.freelance.applicationservice.entity.Application;
import com.freelance.applicationservice.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Application> apply(@RequestBody Application application) {
        return ResponseEntity.ok(applicationService.applyToProject(application));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Application>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(applicationService.getApplicationsByProject(projectId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Application>> getByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(applicationService.getApplicationsByFreelancer(freelancerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }
}
