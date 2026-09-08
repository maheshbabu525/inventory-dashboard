package com.battery.controller;

import com.battery.dto.SaleRequest;
import com.battery.dto.SaleResponse;
import com.battery.entity.Battery;
import com.battery.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/batteries")
    public ResponseEntity<List<Battery>> getBatteries() {
        return ResponseEntity.ok(inventoryService.getAllBatteries());
    }

    @GetMapping("/inventory/search")
    public ResponseEntity<Map<String, Object>> searchInventory(@RequestParam String sku) {
        return ResponseEntity.ok(inventoryService.searchBattery(sku));
    }

    @GetMapping("/inventory/all")
    @PreAuthorize("hasAnyRole('CASHIER', 'REGIONAL_MANAGER', 'WAREHOUSE_ANALYTICS')")
    public ResponseEntity<Map<String, Object>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @PostMapping("/inventory/sale")
    @PreAuthorize("hasRole('CASHIER')")
    public ResponseEntity<SaleResponse> sellBattery(@RequestBody SaleRequest request, Authentication auth) {
        // auth.getName() is the username set by JwtAuthenticationFilter from the validated token
        return ResponseEntity.ok(inventoryService.sellBattery(request.getBatteryId(), request.getQuantity(), auth.getName()));
    }

    @GetMapping("/inventory/analytics")
    @PreAuthorize("hasRole('WAREHOUSE_ANALYTICS')")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(inventoryService.getAnalytics());
    }
}
