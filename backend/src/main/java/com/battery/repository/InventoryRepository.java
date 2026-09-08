package com.battery.repository;

import com.battery.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByBatteryIdAndRegion(Long batteryId, String region);
    List<Inventory> findByBatteryId(Long batteryId);
    List<Inventory> findByRegion(String region);
}
