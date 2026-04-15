package com.freelance.projectservice.controller;

import com.freelance.projectservice.entity.Rating;
import com.freelance.projectservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> addRating(@RequestBody Rating rating) {
        return ResponseEntity.ok(ratingService.addRating(rating));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Rating>> getRatingsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ratingService.getRatingsByFreelancer(freelancerId));
    }

    @GetMapping("/freelancer/{freelancerId}/average")
    public ResponseEntity<Double> getAverageScore(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(ratingService.getAverageScoreForFreelancer(freelancerId));
    }
}
