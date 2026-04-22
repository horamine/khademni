package com.freelance.projectservice.repository;

import com.freelance.projectservice.entity.Project;
import com.freelance.projectservice.entity.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientId(String clientId);
    List<Project> findByStatus(ProjectStatus status);
}