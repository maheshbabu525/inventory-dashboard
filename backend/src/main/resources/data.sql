-- Insert test users (bcrypt hashes, one per real password)
-- cashier1/cashier2 -> cashier123, regional_manager1 -> rm123, warehouse1 -> wh123
INSERT INTO users (username, password_hash, role, region) VALUES
('cashier1', '$2b$10$Gk8IRXe9M8CPeq4TyYoTKePU5bYn7CMbk0VDaDFDrpzTgh3Hh8g52', 'CASHIER', 'East'),
('cashier2', '$2b$10$Gk8IRXe9M8CPeq4TyYoTKePU5bYn7CMbk0VDaDFDrpzTgh3Hh8g52', 'CASHIER', 'West'),
('regional_manager1', '$2b$10$705/.DW.Xtksb5k.ZiWQ7uproCpvJme.jpavk9jsofrCKjo3sN1ly', 'REGIONAL_MANAGER', NULL),
('warehouse1', '$2b$10$aEUOSgzkmmGzni9GPorOm.Mb.Z/jtVnYDhWBtnLXw7dIwhtK4q5oK', 'WAREHOUSE_ANALYTICS', NULL)
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
