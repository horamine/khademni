package com.freelance.projectservice.service;

import com.freelance.projectservice.dto.CreateRatingRequest;
import com.freelance.projectservice.dto.FreelancerRatingSummary;
import com.freelance.projectservice.dto.RatingDto;
import com.freelance.projectservice.entity.Contract;
import com.freelance.projectservice.entity.ContractStatus;
import com.freelance.projectservice.entity.Rating;
import com.freelance.projectservice.repository.ContractRepository;
import com.freelance.projectservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final ContractRepository contractRepository;

    public RatingDto createRating(CreateRatingRequest req, Long clientId) {
        Contract contract = contractRepository.findById(req.getContractId())
                .orElseThrow(() -> new RuntimeException("Contrat introuvable."));

        if (contract.getStatus() != ContractStatus.COMPLETED) {
            throw new RuntimeException("Le contrat doit être complété pour soumettre une évaluation.");
        }
        if (!contract.getClientId().equals(clientId)) {
            throw new RuntimeException("Seul le client du contrat peut évaluer.");
        }
        if (ratingRepository.findByContractId(req.getContractId()).isPresent()) {
            throw new RuntimeException("Une évaluation existe déjà pour ce contrat.");
        }
        if (req.getScore() == null || req.getScore() < 1 || req.getScore() > 5) {
            throw new RuntimeException("Le score doit être entre 1 et 5.");
        }

        Rating rating = new Rating();
        rating.setContractId(req.getContractId());
        rating.setClientId(clientId);
        rating.setFreelancerId(contract.getFreelancerId());
        rating.setScore(req.getScore());
        rating.setComment(req.getComment());

        return toDto(ratingRepository.save(rating));
    }

    public List<RatingDto> getRatingsForFreelancer(Long freelancerId) {
        return ratingRepository.findAllByFreelancerId(freelancerId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public FreelancerRatingSummary getAverageForFreelancer(Long freelancerId) {
        List<Rating> ratings = ratingRepository.findAllByFreelancerId(freelancerId);
        if (ratings.isEmpty()) {
            return new FreelancerRatingSummary(freelancerId, 0.0, 0);
        }
        double avg = ratings.stream().mapToInt(Rating::getScore).average().orElse(0.0);
        double rounded = Math.round(avg * 10.0) / 10.0;
        return new FreelancerRatingSummary(freelancerId, rounded, ratings.size());
    }

    // Legacy methods
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

    private RatingDto toDto(Rating r) {
        RatingDto dto = new RatingDto();
        dto.setId(r.getId());
        dto.setContractId(r.getContractId());
        dto.setClientId(r.getClientId());
        dto.setFreelancerId(r.getFreelancerId());
        dto.setScore(r.getScore());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
