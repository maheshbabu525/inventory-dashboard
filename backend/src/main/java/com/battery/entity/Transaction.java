package com.battery.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "battery_id", nullable = false)
    private Battery battery;

    @Column(name = "quantity_sold", nullable = false)
    private Integer quantitySold;

    @Column(nullable = false)
    private String region;

    @Column(name = "transaction_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum TransactionType {
        SALE, RESTOCK
    }
}
