package com.freelance.projectservice.service;

import com.freelance.projectservice.dto.ContractDto;
import com.freelance.projectservice.dto.CreateContractRequest;
import com.freelance.projectservice.entity.Application;
import com.freelance.projectservice.entity.Contract;
import com.freelance.projectservice.entity.ContractStatus;
import com.freelance.projectservice.entity.Project;
import com.freelance.projectservice.entity.ProjectStatus;
import com.freelance.projectservice.repository.ApplicationRepository;
import com.freelance.projectservice.repository.ContractRepository;
import com.freelance.projectservice.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;

    public ContractDto createContract(CreateContractRequest req, Long clientId) {
        Application application = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Candidature introuvable."));

        if (!"ACCEPTED".equals(application.getStatus())) {
            throw new RuntimeException("La candidature doit être acceptée avant de créer un contrat.");
        }

        Project project = projectRepository.findById(application.getProjectId())
                .orElseThrow(() -> new RuntimeException("Projet introuvable."));

        // Verify the client owns the project (clientId stored as email, so compare by contract clientId)
        // We use the numeric clientId from the JWT

        Contract contract = new Contract();
        contract.setApplicationId(req.getApplicationId());
        contract.setProjectId(application.getProjectId());
        contract.setClientId(clientId);
        contract.setFreelancerId(application.getFreelancerId());
        contract.setStartDate(req.getStartDate());
        contract.setEndDate(req.getEndDate());
        contract.setPayment(req.getPayment() != null ? req.getPayment() : project.getBudget());
        contract.setStatus(ContractStatus.PENDING);

        // Set project to IN_PROGRESS if currently OPEN
        if (project.getStatus() == ProjectStatus.OPEN) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
            projectRepository.save(project);
        }

        Contract saved = contractRepository.save(contract);
        return toDto(saved, project.getTitle(), null, null);
    }

    public ContractDto acceptContract(Long id, Long freelancerId) {
        Contract contract = getContractEntityById(id);
        if (!contract.getFreelancerId().equals(freelancerId)) {
            throw new RuntimeException("Accès refusé.");
        }
        if (contract.getStatus() != ContractStatus.PENDING) {
            throw new RuntimeException("Le contrat n'est pas en attente.");
        }
        contract.setStatus(ContractStatus.ACTIVE);
        contract.setUpdatedAt(LocalDateTime.now());
        return toDto(contractRepository.save(contract), null, null, null);
    }

    public ContractDto rejectContract(Long id, Long freelancerId) {
        Contract contract = getContractEntityById(id);
        if (!contract.getFreelancerId().equals(freelancerId)) {
            throw new RuntimeException("Accès refusé.");
        }
        if (contract.getStatus() != ContractStatus.PENDING) {
            throw new RuntimeException("Le contrat n'est pas en attente.");
        }
        contract.setStatus(ContractStatus.REJECTED);
        contract.setUpdatedAt(LocalDateTime.now());
        return toDto(contractRepository.save(contract), null, null, null);
    }

    public ContractDto completeContract(Long id, Long clientId) {
        Contract contract = getContractEntityById(id);
        if (!contract.getClientId().equals(clientId)) {
            throw new RuntimeException("Accès refusé.");
        }
        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException("Le contrat doit être actif pour être complété.");
        }
        contract.setStatus(ContractStatus.COMPLETED);
        contract.setUpdatedAt(LocalDateTime.now());

        // Set project to COMPLETED
        projectRepository.findById(contract.getProjectId()).ifPresent(project -> {
            project.setStatus(ProjectStatus.COMPLETED);
            projectRepository.save(project);
        });

        return toDto(contractRepository.save(contract), null, null, null);
    }

    public ContractDto cancelContract(Long id, Long userId) {
        Contract contract = getContractEntityById(id);
        if (!contract.getClientId().equals(userId) && !contract.getFreelancerId().equals(userId)) {
            throw new RuntimeException("Accès refusé.");
        }
        if (contract.getStatus() != ContractStatus.PENDING && contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException("Seuls les contrats en attente ou actifs peuvent être annulés.");
        }
        contract.setStatus(ContractStatus.CANCELLED);
        contract.setUpdatedAt(LocalDateTime.now());
        return toDto(contractRepository.save(contract), null, null, null);
    }

    public List<ContractDto> getContractsForClient(Long clientId) {
        return contractRepository.findByClientId(clientId).stream()
                .map(c -> toDto(c, getProjectTitle(c.getProjectId()), null, null))
                .collect(Collectors.toList());
    }

    public List<ContractDto> getContractsForFreelancer(Long freelancerId) {
        return contractRepository.findByFreelancerId(freelancerId).stream()
                .map(c -> toDto(c, getProjectTitle(c.getProjectId()), null, null))
                .collect(Collectors.toList());
    }

    public List<ContractDto> getAllContracts() {
        return contractRepository.findAll().stream()
                .map(c -> toDto(c, getProjectTitle(c.getProjectId()), null, null))
                .collect(Collectors.toList());
    }

    public ContractDto getContract(Long id) {
        Contract contract = getContractEntityById(id);
        return toDto(contract, getProjectTitle(contract.getProjectId()), null, null);
    }

    // Legacy methods kept for backward compatibility
    public Contract createContract(Contract contract) {
        return contractRepository.save(contract);
    }

    public List<Contract> getContractsByFreelancer(Long freelancerId) {
        return contractRepository.findByFreelancerId(freelancerId);
    }

    public List<Contract> getContractsByClient(Long clientId) {
        return contractRepository.findByClientId(clientId);
    }

    public Contract getContractById(Long id) {
        return getContractEntityById(id);
    }

    public Contract updateContractStatus(Long id, String status) {
        Contract contract = getContractEntityById(id);
        contract.setStatus(ContractStatus.valueOf(status.toUpperCase()));
        return contractRepository.save(contract);
    }

    private Contract getContractEntityById(Long id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat introuvable."));
    }

    private String getProjectTitle(Long projectId) {
        if (projectId == null) return null;
        return projectRepository.findById(projectId)
                .map(Project::getTitle)
                .orElse(null);
    }

    private ContractDto toDto(Contract c, String projectTitle, String clientName, String freelancerName) {
        ContractDto dto = new ContractDto();
        dto.setId(c.getId());
        dto.setProjectId(c.getProjectId());
        dto.setApplicationId(c.getApplicationId());
        dto.setClientId(c.getClientId());
        dto.setFreelancerId(c.getFreelancerId());
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());
        dto.setStatus(c.getStatus());
        dto.setPayment(c.getPayment());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setProjectTitle(projectTitle);
        dto.setClientName(clientName);
        dto.setFreelancerName(freelancerName);
        return dto;
    }
}
