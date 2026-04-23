package com.freelance.projectservice.repository;

import com.freelance.projectservice.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByFreelancerId(Long freelancerId);
    List<Rating> findByClientId(Long clientId);
    Optional<Rating> findByContractId(Long contractId);
    List<Rating> findAllByFreelancerId(Long freelancerId);
}
