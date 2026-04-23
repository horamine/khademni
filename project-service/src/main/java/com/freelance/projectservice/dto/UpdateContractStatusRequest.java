package com.freelance.projectservice.dto;

import com.freelance.projectservice.entity.ContractStatus;
import lombok.Data;

@Data
public class UpdateContractStatusRequest {
    private ContractStatus status;
}
