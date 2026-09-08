import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Battery } from '../models/battery.model';
import { InventoryItem } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getBatteries(): Observable<Battery[]> {
    return this.http.get<Battery[]>(`${this.apiUrl}/batteries`);
  }

  searchInventory(sku: string): Observable<any> {
    let params = new HttpParams().set('sku', sku);
    return this.http.get<any>(`${this.apiUrl}/inventory/search`, { params });
  }

  getAllInventory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/inventory/all`);
  }

  sellBattery(batteryId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventory/sale`, { batteryId, quantity });
  }

  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory/analytics`);
  }
}
