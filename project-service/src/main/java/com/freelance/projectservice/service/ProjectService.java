package com.freelance.projectservice.service;

import com.freelance.projectservice.entity.Project;
import com.freelance.projectservice.entity.ProjectStatus;
import com.freelance.projectservice.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(Project project, String clientEmail) {
        project.setClientId(clientEmail);
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getOpenProjects() {
        return projectRepository.findByStatus(ProjectStatus.OPEN);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé !"));
    }

    public List<Project> getProjectsByClientEmail(String clientEmail) {
        return projectRepository.findByClientId(clientEmail);
    }

    public Project updateProject(Long id, Project updated, String clientEmail) {
        Project existing = getProjectById(id);
        // TODO: enforce owner-only
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setRequiredSkills(updated.getRequiredSkills());
        existing.setBudget(updated.getBudget());
        return projectRepository.save(existing);
    }

    public void deleteProject(Long id, String clientEmail) {
        // TODO: enforce owner-only
        projectRepository.deleteById(id);
    }

    public Project updateProjectStatus(Long id, String status) {
        Project project = getProjectById(id);
        project.setStatus(ProjectStatus.valueOf(status.toUpperCase()));
        return projectRepository.save(project);
    }
}