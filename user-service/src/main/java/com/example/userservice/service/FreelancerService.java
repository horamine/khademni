package com.example.userservice.service;

import com.example.userservice.entity.Freelancer;
import com.example.userservice.repository.FreelancerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FreelancerService {

    private final FreelancerRepository freelancerRepository;

    public List<Freelancer> getAllFreelancers() {
        return freelancerRepository.findAll();
    }

    public Freelancer getFreelancerById(Long id) {
        return freelancerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Freelancer non trouvé !"));
    }

    public Freelancer updateFreelancer(Long id, Freelancer updated) {
        Freelancer freelancer = getFreelancerById(id);
        freelancer.setName(updated.getName());
        freelancer.setEmail(updated.getEmail());
        freelancer.setSkills(updated.getSkills());
        freelancer.setExperienceYears(updated.getExperienceYears());
        freelancer.setAvailability(updated.getAvailability());
        freelancer.setProfileComplete(updated.isProfileComplete());
        return freelancerRepository.save(freelancer);
    }

    public boolean isProfileComplete(Long id) {
        Freelancer freelancer = getFreelancerById(id);
        return freelancer.isProfileComplete();
    }
}
