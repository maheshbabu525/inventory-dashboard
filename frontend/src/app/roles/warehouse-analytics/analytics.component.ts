import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">📊 Warehouse Analytics Dashboard</h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6" *ngIf="analytics">
        <div class="bg-white rounded-xl shadow p-5 sm:p-6">
          <h3 class="text-slate-500 text-sm font-medium">Total Stock</h3>
          <p class="text-3xl sm:text-4xl font-bold text-brand">{{ analytics.totalStock }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-5 sm:p-6">
          <h3 class="text-slate-500 text-sm font-medium">Low Stock Alerts</h3>
          <p class="text-3xl sm:text-4xl font-bold text-red-600">{{ analytics.lowStockAlerts }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-5 sm:p-6">
          <h3 class="text-slate-500 text-sm font-medium">Battery Types</h3>
          <p class="text-3xl sm:text-4xl font-bold text-green-600">{{ analytics.batteryCount }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow p-4 sm:p-6" *ngIf="analytics">
        <h3 class="text-lg sm:text-xl font-bold mb-4 text-slate-800">Stock by Battery</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="p-3 sm:p-4 text-left text-slate-600">Battery</th>
                <th class="p-3 sm:p-4 text-right text-slate-600">Quantity</th>
                <th class="p-3 sm:p-4 text-right text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of analytics.byBattery" class="border-t border-slate-100">
                <td class="p-3 sm:p-4">{{ item.name }}</td>
                <td class="p-3 sm:p-4 text-right">{{ item.quantity }}</td>
                <td class="p-3 sm:p-4 text-right font-medium" [ngClass]="item.quantity < 20 ? 'text-red-600' : 'text-green-600'">
                  {{ item.quantity < 20 ? '⚠️ LOW STOCK' : '✅ OK' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-sm">
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
