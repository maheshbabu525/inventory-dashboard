-- Insert test users (passwords would be hashed in production)
INSERT INTO users (username, password_hash, role, region) VALUES
('cashier1', '$2a\$10\$V0fVz3oLGaIdPq9XdqQT4eWE7E4VH0pYCy00B0T/m1CRxm9d4.Qly', 'CASHIER', 'East'),
('cashier2', '$2a\$10\$V0fVz3oLGaIdPq9XdqQT4eWE7E4VH0pYCy00B0T/m1CRxm9d4.Qly', 'CASHIER', 'West'),
('regional_manager1', '$2a\$10\$V0fVz3oLGaIdPq9XdqQT4eWE7E4VH0pYCy00B0T/m1CRxm9d4.Qly', 'REGIONAL_MANAGER', NULL),
('warehouse1', '$2a\$10\$V0fVz3oLGaIdPq9XdqQT4eWE7E4VH0pYCy00B0T/m1CRxm9d4.Qly', 'WAREHOUSE_ANALYTICS', NULL)
ON CONFLICT DO NOTHING;

-- Insert batteries
INSERT INTO batteries (name, sku, price) VALUES
('12V Lead-Acid', 'BA-001', 89.99),
('24V Lithium', 'BA-002', 299.99),
('48V Industrial', 'BA-003', 599.99)
ON CONFLICT DO NOTHING;

-- Insert inventory (stock by region)
INSERT INTO inventory (battery_id, region, quantity) VALUES
(1, 'East', 50),
(1, 'West', 30),
(1, 'Central', 45),
(2, 'East', 35),
(2, 'West', 20),
(2, 'Central', 25),
(3, 'East', 12),
(3, 'West', 8),
(3, 'Central', 15)
ON CONFLICT DO NOTHING;
