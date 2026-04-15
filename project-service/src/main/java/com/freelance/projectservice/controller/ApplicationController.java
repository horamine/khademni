package com.freelance.projectservice.controller;

import com.freelance.projectservice.entity.Application;
import com.freelance.projectservice.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Application> applyToProject(@RequestBody Application application) {
        return ResponseEntity.ok(applicationService.applyToProject(application));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Application>> getApplicationsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(applicationService.getApplicationsByProject(projectId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Application>> getApplicationsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(applicationService.getApplicationsByFreelancer(freelancerId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }
}
