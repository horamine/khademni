package com.freelance.projectservice.repository;

import com.freelance.projectservice.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByProjectId(Long projectId);
    List<Application> findByFreelancerId(Long freelancerId);
    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);
}
