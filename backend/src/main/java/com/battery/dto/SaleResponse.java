package com.battery.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SaleResponse {
    private Boolean success;
    private Integer newStock;
    private Long transactionId;
}
