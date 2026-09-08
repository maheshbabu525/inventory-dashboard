import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-3xl font-bold mb-6">Warehouse Analytics Dashboard</h2>
      
      <div class="grid grid-cols-3 gap-6 mb-6" *ngIf="analytics">
        <div class="bg-white rounded shadow p-6">
          <h3 class="text-gray-600 text-sm font-medium">Total Stock</h3>
          <p class="text-4xl font-bold text-blue-600">{{ analytics.totalStock }}</p>
        </div>
        <div class="bg-white rounded shadow p-6">
          <h3 class="text-gray-600 text-sm font-medium">Low Stock Alerts</h3>
          <p class="text-4xl font-bold text-red-600">{{ analytics.lowStockAlerts }}</p>
        </div>
        <div class="bg-white rounded shadow p-6">
          <h3 class="text-gray-600 text-sm font-medium">Battery Types</h3>
          <p class="text-4xl font-bold text-green-600">{{ analytics.batteryCount }}</p>
        </div>
      </div>

      <div class="bg-white rounded shadow p-6" *ngIf="analytics">
        <h3 class="text-xl font-bold mb-4">Stock by Battery</h3>
        <table class="w-full">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-4 text-left">Battery</th>
              <th class="p-4 text-right">Quantity</th>
              <th class="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of analytics.byBattery" class="border-t">
              <td class="p-4">{{ item.name }}</td>
              <td class="p-4 text-right">{{ item.quantity }}</td>
              <td class="p-4 text-right" [ngClass]="item.quantity < 20 ? 'text-red-600 font-bold' : 'text-green-600'">
                {{ item.quantity < 20 ? '⚠️ LOW STOCK' : '✅ OK' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-800 rounded">
        {{ error }}
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  analytics: any = null;
  error: string = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getAnalytics().subscribe({
      next: (data) => this.analytics = data,
      error: (err) => this.error = 'Failed to load analytics'
    });
  }
}
