export interface User {
  id: number;
  username: string;
  role: 'CASHIER' | 'REGIONAL_MANAGER' | 'WAREHOUSE_ANALYTICS';
  region?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  region?: string;
}
