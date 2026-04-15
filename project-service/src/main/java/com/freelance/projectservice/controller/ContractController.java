package com.freelance.projectservice.controller;

import com.freelance.projectservice.entity.Contract;
import com.freelance.projectservice.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        return ResponseEntity.ok(contractService.createContract(contract));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Contract>> getContractsByFreelancer(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(contractService.getContractsByFreelancer(freelancerId));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Contract>> getContractsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(contractService.getContractsByClient(clientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.getContractById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Contract> updateStatus(@PathVariable Long id,
                                                  @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(contractService.updateContractStatus(id, status));
    }
}
