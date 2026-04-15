package com.freelance.projectservice.repository;

import com.freelance.projectservice.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByFreelancerId(Long freelancerId);
    List<Contract> findByClientId(Long clientId);
    List<Contract> findByProjectId(Long projectId);
}
