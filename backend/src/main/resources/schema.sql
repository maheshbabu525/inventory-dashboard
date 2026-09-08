-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('CASHIER', 'REGIONAL_MANAGER', 'WAREHOUSE_ANALYTICS')),
  region VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Batteries table
CREATE TABLE IF NOT EXISTS batteries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table (stock by region)
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  battery_id INTEGER NOT NULL REFERENCES batteries(id),
  region VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(battery_id, region)
);

-- Transactions table (audit trail)
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  battery_id INTEGER NOT NULL REFERENCES batteries(id),
  quantity_sold INTEGER NOT NULL CHECK (quantity_sold > 0),
  region VARCHAR(50) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('SALE', 'RESTOCK')),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_batteries_sku ON batteries(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_battery ON inventory(battery_id);
CREATE INDEX IF NOT EXISTS idx_inventory_region ON inventory(region);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_battery ON transactions(battery_id);
