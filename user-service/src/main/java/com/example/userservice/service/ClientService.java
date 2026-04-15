package com.example.userservice.service;

import com.example.userservice.entity.Client;
import com.example.userservice.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé !"));
    }

    public Client updateClient(Long id, Client updated) {
        Client client = getClientById(id);
        client.setName(updated.getName());
        client.setEmail(updated.getEmail());
        client.setCompany(updated.getCompany());
        client.setBudgetRange(updated.getBudgetRange());
        return clientRepository.save(client);
    }
}
