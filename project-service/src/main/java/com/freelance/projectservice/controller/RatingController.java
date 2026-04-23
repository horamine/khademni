package com.freelance.projectservice.controller;

import com.freelance.projectservice.dto.CreateRatingRequest;
import com.freelance.projectservice.dto.FreelancerRatingSummary;
import com.freelance.projectservice.dto.RatingDto;
import com.freelance.projectservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<RatingDto> createRating(@RequestBody CreateRatingRequest req,
                                                    Authentication authentication) {
        Long clientId = getUserId(authentication);
        return ResponseEntity.ok(ratingService.createRating(req, clientId));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<RatingDto>> getRatingsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ratingService.getRatingsForFreelancer(freelancerId));
    }

    @GetMapping("/freelancer/{freelancerId}/average")
    public ResponseEntity<FreelancerRatingSummary> getAverageScore(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ratingService.getAverageForFreelancer(freelancerId));
    }

    @SuppressWarnings("unchecked")
    private Long getUserId(Authentication authentication) {
        if (authentication != null && authentication.getDetails() instanceof Map) {
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            Object userId = details.get("userId");
            if (userId instanceof Long) return (Long) userId;
            if (userId instanceof Integer) return ((Integer) userId).longValue();
        }
        return 0L;
    }
}
