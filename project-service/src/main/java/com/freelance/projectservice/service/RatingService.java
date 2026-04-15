package com.freelance.projectservice.service;

import com.freelance.projectservice.entity.Rating;
import com.freelance.projectservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    public Rating addRating(Rating rating) {
        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsByFreelancer(Long freelancerId) {
        return ratingRepository.findByFreelancerId(freelancerId);
    }

    public double getAverageScoreForFreelancer(Long freelancerId) {
        List<Rating> ratings = ratingRepository.findByFreelancerId(freelancerId);
        if (ratings.isEmpty()) return 0.0;
        return ratings.stream()
                .mapToInt(Rating::getScore)
                .average()
                .orElse(0.0);
    }
}
