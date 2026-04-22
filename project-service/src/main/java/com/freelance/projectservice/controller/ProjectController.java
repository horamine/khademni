package com.freelance.projectservice.controller;

import com.freelance.projectservice.entity.Project;
import com.freelance.projectservice.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(projectService.createProject(project, email));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/open")
    public ResponseEntity<List<Project>> getOpenProjects() {
        return ResponseEntity.ok(projectService.getOpenProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Project>> getMyProjects(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(projectService.getProjectsByClientEmail(email));
    }

    @GetMapping("/client/{clientEmail}")
    public ResponseEntity<List<Project>> getProjectsByClient(@PathVariable String clientEmail) {
        return ResponseEntity.ok(projectService.getProjectsByClientEmail(clientEmail));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Project> updateProject(@PathVariable Long id,
                                                  @RequestBody Project project,
                                                  Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(projectService.updateProject(id, project, email));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        projectService.deleteProject(id, email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateProjectStatus(@PathVariable Long id,
                                                  @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body("Missing 'status' field in request body.");
        }
        try {
            return ResponseEntity.ok(projectService.updateProjectStatus(id, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value: " + status +
                    ". Allowed values: OPEN, IN_PROGRESS, COMPLETED, CANCELLED, CLOSED");
        }
    }
}