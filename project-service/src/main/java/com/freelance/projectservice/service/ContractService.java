package com.freelance.projectservice.service;

import com.freelance.projectservice.entity.Contract;
import com.freelance.projectservice.repository.ContractRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;

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
        return contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrat non trouvé !"));
    }

    public Contract updateContractStatus(Long id, String status) {
        Contract contract = getContractById(id);
        contract.setStatus(status);
        return contractRepository.save(contract);
    }
}
