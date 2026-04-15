package com.freelance.projectservice.repository;

import com.freelance.projectservice.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByFreelancerId(Long freelancerId);
    List<Rating> findByClientId(Long clientId);
}
