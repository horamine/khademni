package com.freelance.projectservice.controller;

import com.freelance.projectservice.dto.MatchScoreDto;
import com.freelance.projectservice.dto.RecommendedFreelancerDto;
import com.freelance.projectservice.dto.RecommendedProjectDto;
import com.freelance.projectservice.service.MatchScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {

    private final MatchScoreService matchScoreService;

    @GetMapping("/score")
    public ResponseEntity<MatchScoreDto> getScore(@RequestParam Long freelancerId,
                                                   @RequestParam Long projectId,
                                                   HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        return ResponseEntity.ok(matchScoreService.computeScore(freelancerId, projectId, authHeader));
    }

    @GetMapping("/freelancers/{freelancerId}/recommended-projects")
    public ResponseEntity<List<RecommendedProjectDto>> getRecommendedProjects(
            @PathVariable Long freelancerId,
            @RequestParam(defaultValue = "5") int limit,
            HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        return ResponseEntity.ok(matchScoreService.recommendProjectsForFreelancer(freelancerId, limit, authHeader));
    }

    @GetMapping("/projects/{projectId}/recommended-freelancers")
    public ResponseEntity<List<RecommendedFreelancerDto>> getRecommendedFreelancers(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "5") int limit,
            HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        return ResponseEntity.ok(matchScoreService.recommendFreelancersForProject(projectId, limit, authHeader));
    }
}
