import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../shared/services/inventory.service';
import { Battery } from '../../shared/models/battery.model';

@Component({
  selector: 'app-cashier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-4 sm:p-6">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">💳 Cashier &mdash; Point of Sale</h2>

      <div class="bg-white rounded-xl shadow p-5 sm:p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-slate-700">Select Battery</label>
          <select [(ngModel)]="selectedBatteryId" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light">
            <option value="">-- Select Battery --</option>
            <option *ngFor="let battery of batteries" [value]="battery.id">
              {{ battery.name }} (\${{ battery.price }}) - SKU: {{ battery.sku }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 text-slate-700">Quantity to Sell</label>
          <input type="number" [(ngModel)]="quantity" min="1" max="100"
                 class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light">
        </div>

        <div class="mb-6 p-4 bg-slate-50 rounded-lg">
          <p class="text-lg text-slate-700">Total Price: <strong class="text-brand">\${{ totalPrice }}</strong></p>
        </div>

        <button (click)="sellBattery()"
                class="w-full bg-green-600 hover:bg-green-700 transition-colors text-white py-3 rounded-lg font-bold">
          Confirm Sale
        </button>

        <div *ngIf="message" class="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
          {{ message }}
        </div>
      </div>
    </div>
  `
})
export class CashierComponent implements OnInit {
  batteries: Battery[] = [];
  selectedBatteryId: any;
  quantity: number = 1;
  message: string = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getBatteries().subscribe({
      next: (data) => this.batteries = data,
      error: (err) => console.error('Error loading batteries:', err)
    });
  }

  get totalPrice(): number {
    if (!this.selectedBatteryId) return 0;
    const battery = this.batteries.find(b => b.id === +this.selectedBatteryId);
    return battery ? battery.price * this.quantity : 0;
  }

  sellBattery(): void {
    if (!this.selectedBatteryId || this.quantity < 1) {
      this.message = 'Please select a battery and quantity';
      return;
    }

    this.inventoryService.sellBattery(+this.selectedBatteryId, this.quantity).subscribe({
      next: (response) => {
        this.message = `✅ Sale successful! New stock: ${response.newStock}`;
        this.selectedBatteryId = '';
        this.quantity = 1;
      },
      error: (err) => this.message = `❌ Error: ${err.error?.message || 'Sale failed'}`
    });
  }
}
