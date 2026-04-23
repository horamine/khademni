package com.freelance.projectservice.service;

import com.freelance.projectservice.dto.MatchScoreDto;
import com.freelance.projectservice.dto.RecommendedFreelancerDto;
import com.freelance.projectservice.dto.RecommendedProjectDto;
import com.freelance.projectservice.entity.Project;
import com.freelance.projectservice.entity.ProjectStatus;
import com.freelance.projectservice.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchScoreService {

    private final WebClient.Builder webClientBuilder;
    private final ProjectRepository projectRepository;

    @SuppressWarnings("unchecked")
    public MatchScoreDto computeScore(Long freelancerId, Long projectId, String authHeader) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable."));

        Map<String, Object> freelancer = fetchFreelancer(freelancerId, authHeader);
        if (freelancer == null) {
            throw new RuntimeException("Freelancer introuvable.");
        }

        List<String> skills = getList(freelancer, "skills");
        int experienceYears = getInt(freelancer, "experienceYears");
        int availability = getInt(freelancer, "availability");

        double skillMatch = computeSkillMatch(project.getRequiredSkills(), skills);
        double experienceFactor = computeExperienceFactor(experienceYears);
        double availabilityFactor = computeAvailabilityFactor(availability);

        double score = 0.60 * skillMatch + 0.25 * experienceFactor + 0.15 * availabilityFactor;
        score = Math.round(score * 10.0) / 10.0;

        MatchScoreDto dto = new MatchScoreDto();
        dto.setScore(score);
        dto.setSkillMatch(Math.round(skillMatch * 10.0) / 10.0);
        dto.setExperienceFactor(Math.round(experienceFactor * 10.0) / 10.0);
        dto.setAvailabilityFactor(Math.round(availabilityFactor * 10.0) / 10.0);
        dto.setFreelancerId(freelancerId);
        dto.setProjectId(projectId);
        return dto;
    }

    @SuppressWarnings("unchecked")
    public List<RecommendedProjectDto> recommendProjectsForFreelancer(Long freelancerId, int limit, String authHeader) {
        Map<String, Object> freelancer = fetchFreelancer(freelancerId, authHeader);
        if (freelancer == null) return new ArrayList<>();

        List<String> skills = getList(freelancer, "skills");
        int experienceYears = getInt(freelancer, "experienceYears");
        int availability = getInt(freelancer, "availability");

        List<Project> openProjects = projectRepository.findByStatus(ProjectStatus.OPEN);

        return openProjects.stream()
                .map(project -> {
                    double skillMatch = computeSkillMatch(project.getRequiredSkills(), skills);
                    double experienceFactor = computeExperienceFactor(experienceYears);
                    double availabilityFactor = computeAvailabilityFactor(availability);
                    double score = 0.60 * skillMatch + 0.25 * experienceFactor + 0.15 * availabilityFactor;
                    score = Math.round(score * 10.0) / 10.0;

                    RecommendedProjectDto dto = new RecommendedProjectDto();
                    dto.setProjectId(project.getId());
                    dto.setTitle(project.getTitle());
                    dto.setBudget(project.getBudget());
                    dto.setRequiredSkills(project.getRequiredSkills());
                    dto.setMatchScore(score);
                    dto.setSkillMatch(Math.round(skillMatch * 10.0) / 10.0);
                    dto.setExperienceFactor(Math.round(experienceFactor * 10.0) / 10.0);
                    dto.setAvailabilityFactor(Math.round(availabilityFactor * 10.0) / 10.0);
                    return dto;
                })
                .sorted(Comparator.comparingDouble(RecommendedProjectDto::getMatchScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    public List<RecommendedFreelancerDto> recommendFreelancersForProject(Long projectId, int limit, String authHeader) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Projet introuvable."));

        List<Map<String, Object>> freelancers = fetchAllFreelancers(authHeader);

        return freelancers.stream()
                .map(freelancer -> {
                    Object idObj = freelancer.get("id");
                    Long fId = idObj instanceof Integer ? ((Integer) idObj).longValue() : (Long) idObj;
                    List<String> skills = getList(freelancer, "skills");
                    int experienceYears = getInt(freelancer, "experienceYears");
                    int availability = getInt(freelancer, "availability");

                    double skillMatch = computeSkillMatch(project.getRequiredSkills(), skills);
                    double experienceFactor = computeExperienceFactor(experienceYears);
                    double availabilityFactor = computeAvailabilityFactor(availability);
                    double score = 0.60 * skillMatch + 0.25 * experienceFactor + 0.15 * availabilityFactor;
                    score = Math.round(score * 10.0) / 10.0;

                    RecommendedFreelancerDto dto = new RecommendedFreelancerDto();
                    dto.setFreelancerId(fId);
                    dto.setName((String) freelancer.get("name"));
                    dto.setSkills(skills);
                    dto.setExperienceYears(experienceYears);
                    dto.setAvailability(availability);
                    dto.setMatchScore(score);
                    dto.setSkillMatch(Math.round(skillMatch * 10.0) / 10.0);
                    dto.setExperienceFactor(Math.round(experienceFactor * 10.0) / 10.0);
                    dto.setAvailabilityFactor(Math.round(availabilityFactor * 10.0) / 10.0);
                    return dto;
                })
                .sorted(Comparator.comparingDouble(RecommendedFreelancerDto::getMatchScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private double computeSkillMatch(List<String> requiredSkills, List<String> freelancerSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) return 50.0;
        if (freelancerSkills == null || freelancerSkills.isEmpty()) return 0.0;
        List<String> lowerRequired = requiredSkills.stream()
                .map(s -> s.toLowerCase(Locale.ROOT)).collect(Collectors.toList());
        List<String> lowerFreelancer = freelancerSkills.stream()
                .map(s -> s.toLowerCase(Locale.ROOT)).collect(Collectors.toList());
        long intersect = lowerRequired.stream().filter(lowerFreelancer::contains).count();
        return (double) intersect / lowerRequired.size() * 100.0;
    }

    private double computeExperienceFactor(int experienceYears) {
        return Math.min(experienceYears, 10) / 10.0 * 100.0;
    }

    private double computeAvailabilityFactor(int availability) {
        int normalized = availability <= 10 ? availability * 10 : availability;
        return Math.max(0, Math.min(100, normalized));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchFreelancer(Long freelancerId, String authHeader) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri("/api/freelancers/" + freelancerId)
                    .header("Authorization", authHeader)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> fetchAllFreelancers(String authHeader) {
        try {
            List list = webClientBuilder.build()
                    .get()
                    .uri("/api/freelancers")
                    .header("Authorization", authHeader)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();
            return list != null ? list : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> getList(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val instanceof List) return (List<String>) val;
        return new ArrayList<>();
    }

    private int getInt(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof Number) return ((Number) val).intValue();
        return 0;
    }
}
