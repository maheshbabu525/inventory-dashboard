export interface InventoryItem {
  batteryId: number;
  region: string;
  quantity: number;
  lastUpdated?: string;
}

export interface Transaction {
  id: number;
  batteryId: number;
  quantity: number;
  region: string;
  timestamp: string;
  type: 'SALE' | 'RESTOCK';
}
