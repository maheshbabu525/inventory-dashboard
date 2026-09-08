package com.battery.repository;

import com.battery.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBatteryIdOrderByTimestampDesc(Long batteryId);
    List<Transaction> findByRegion(String region);
}
