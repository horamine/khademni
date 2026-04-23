package com.freelance.projectservice.service;

import com.freelance.projectservice.entity.Application;
import com.freelance.projectservice.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public Application applyToProject(Application application) {
        if (applicationRepository.existsByProjectIdAndFreelancerId(
                application.getProjectId(), application.getFreelancerId())) {
            throw new RuntimeException("Vous avez déjà postulé à ce projet !");
        }
        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByProject(Long projectId) {
        return applicationRepository.findByProjectId(projectId);
    }

    public List<Application> getApplicationsByFreelancer(Long freelancerId) {
        return applicationRepository.findByFreelancerId(freelancerId);
    }

    public Application updateApplicationStatus(Long id, String status) {
        Application application = getApplicationById(id);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application non trouvée !"));
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
