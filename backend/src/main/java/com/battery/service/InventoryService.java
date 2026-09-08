package com.battery.service;

import com.battery.dto.SaleResponse;
import com.battery.entity.*;
import com.battery.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Slf4j
@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final BatteryRepository batteryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public InventoryService(InventoryRepository inventoryRepository, BatteryRepository batteryRepository,
                           TransactionRepository transactionRepository, UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.batteryRepository = batteryRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public List<Battery> getAllBatteries() {
        return batteryRepository.findAll();
    }

    public Map<String, Object> searchBattery(String sku) {
        Battery battery = batteryRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Battery not found"));

        Map<String, Integer> regionStock = new HashMap<>();
        List<Inventory> inventories = inventoryRepository.findByBatteryId(battery.getId());
        inventories.forEach(inv -> regionStock.put(inv.getRegion(), inv.getQuantity()));

        Map<String, Object> result = new HashMap<>();
        result.put("battery", battery.getName());
        result.put("sku", battery.getSku());
        result.put("price", battery.getPrice());
        result.put("regions", regionStock);
        return result;
    }

    @Transactional
    public SaleResponse sellBattery(Long batteryId, Integer quantity, String region, Long userId) {
        Battery battery = batteryRepository.findById(batteryId)
                .orElseThrow(() -> new RuntimeException("Battery not found"));

        Inventory inventory = inventoryRepository.findByBatteryIdAndRegion(batteryId, region)
                .orElseThrow(() -> new RuntimeException("Inventory not found for region"));

        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        // Atomic update
        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);

        // Record transaction
        User user = userRepository.findById(userId).orElse(null);
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBattery(battery);
        transaction.setQuantitySold(quantity);
        transaction.setRegion(region);
        transaction.setTransactionType(Transaction.TransactionType.SALE);
        Transaction saved = transactionRepository.save(transaction);

        return new SaleResponse(true, inventory.getQuantity(), saved.getId());
    }

    public Map<String, Object> getAllInventory() {
        Map<String, Object> result = new HashMap<>();
        List<Inventory> inventories = inventoryRepository.findAll();
        
        inventories.forEach(inv -> {
            String region = inv.getRegion();
            if (!result.containsKey(region)) {
                result.put(region, new ArrayList<Map<String, Object>>());
            }
            Map<String, Object> item = new HashMap<>();
            item.put("battery", inv.getBattery().getName());
            item.put("sku", inv.getBattery().getSku());
            item.put("quantity", inv.getQuantity());
            ((List<Map<String, Object>>) result.get(region)).add(item);
        });

        return result;
    }

    public Map<String, Object> getAnalytics() {
        List<Battery> batteries = batteryRepository.findAll();
        List<Inventory> inventories = inventoryRepository.findAll();

        int totalStock = inventories.stream().mapToInt(Inventory::getQuantity).sum();
        long lowStockAlerts = inventories.stream().filter(i -> i.getQuantity() < 20).count();

        List<Map<String, Object>> byBattery = new ArrayList<>();
        batteries.forEach(battery -> {
            int qty = inventories.stream()
                    .filter(i -> i.getBattery().getId().equals(battery.getId()))
                    .mapToInt(Inventory::getQuantity)
                    .sum();
            Map<String, Object> item = new HashMap<>();
            item.put("id", battery.getId());
            item.put("name", battery.getName());
            item.put("quantity", qty);
            byBattery.add(item);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("totalStock", totalStock);
        result.put("lowStockAlerts", lowStockAlerts);
        result.put("batteryCount", batteries.size());
        result.put("byBattery", byBattery);
        return result;
    }
}
