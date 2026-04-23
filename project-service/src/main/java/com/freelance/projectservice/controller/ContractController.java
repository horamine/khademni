package com.freelance.projectservice.controller;

import com.freelance.projectservice.dto.ContractDto;
import com.freelance.projectservice.dto.CreateContractRequest;
import com.freelance.projectservice.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ContractDto> createContract(@RequestBody CreateContractRequest req,
                                                       Authentication authentication) {
        Long clientId = getUserId(authentication);
        return ResponseEntity.ok(contractService.createContract(req, clientId));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<ContractDto>> getMyContracts(Authentication authentication) {
        Long userId = getUserId(authentication);
        String role = getRole(authentication);
        if ("CLIENT".equals(role)) {
            return ResponseEntity.ok(contractService.getContractsForClient(userId));
        } else {
            return ResponseEntity.ok(contractService.getContractsForFreelancer(userId));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractDto> getContractById(@PathVariable Long id,
                                                        Authentication authentication) {
        ContractDto contract = contractService.getContract(id);
        Long userId = getUserId(authentication);
        String role = getRole(authentication);
        if (!"ADMIN".equals(role) && !userId.equals(contract.getClientId()) && !userId.equals(contract.getFreelancerId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(contract);
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ContractDto> acceptContract(@PathVariable Long id,
                                                       Authentication authentication) {
        Long freelancerId = getUserId(authentication);
        return ResponseEntity.ok(contractService.acceptContract(id, freelancerId));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<ContractDto> rejectContract(@PathVariable Long id,
                                                       Authentication authentication) {
        Long freelancerId = getUserId(authentication);
        return ResponseEntity.ok(contractService.rejectContract(id, freelancerId));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ContractDto> completeContract(@PathVariable Long id,
                                                         Authentication authentication) {
        Long clientId = getUserId(authentication);
        return ResponseEntity.ok(contractService.completeContract(id, clientId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ContractDto> cancelContract(@PathVariable Long id,
                                                       Authentication authentication) {
        Long userId = getUserId(authentication);
        return ResponseEntity.ok(contractService.cancelContract(id, userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContractDto>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<ContractDto>> getContractsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(contractService.getContractsForFreelancer(freelancerId));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<ContractDto>> getContractsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(contractService.getContractsForClient(clientId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            contractService.updateContractStatus(id, status);
            return ResponseEntity.ok(contractService.getContract(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private Long getUserId(Authentication authentication) {
        if (authentication != null && authentication.getDetails() instanceof Map) {
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            Object userId = details.get("userId");
            if (userId instanceof Long) return (Long) userId;
            if (userId instanceof Integer) return ((Integer) userId).longValue();
        }
        throw new org.springframework.security.access.AccessDeniedException("Utilisateur non authentifié.");
    }

    @SuppressWarnings("unchecked")
    private String getRole(Authentication authentication) {
        if (authentication != null && authentication.getDetails() instanceof Map) {
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (String) details.get("role");
        }
        return "";
    }
}
