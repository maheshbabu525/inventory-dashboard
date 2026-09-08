import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-regional-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 class="text-2xl sm:text-3xl font-bold mb-6 text-slate-800">🔍 Regional Manager &mdash; Inventory Search</h2>

      <div class="bg-white rounded-xl shadow p-5 sm:p-6 mb-6">
        <label class="block text-sm font-medium mb-2 text-slate-700">Battery SKU</label>
        <input type="text" [(ngModel)]="searchSku" placeholder="e.g., BA-001"
               class="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-light">
        <button (click)="search()"
                class="w-full bg-brand hover:bg-brand-light transition-colors text-white py-2.5 rounded-lg font-bold">
          Search
        </button>
      </div>

      <div *ngIf="searchResults" class="bg-white rounded-xl shadow overflow-hidden">
        <div class="p-4 sm:p-5 border-b border-slate-100">
          <p class="font-bold text-lg text-slate-800">{{ searchResults.battery }}</p>
          <p class="text-slate-400 text-sm">{{ searchResults.sku }}</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="p-3 sm:p-4 text-left text-slate-600">East</th>
                <th class="p-3 sm:p-4 text-left text-slate-600">West</th>
                <th class="p-3 sm:p-4 text-left text-slate-600">Central</th>
                <th class="p-3 sm:p-4 text-left text-slate-600 font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-slate-100">
                <td class="p-3 sm:p-4">{{ searchResults.regions?.East || 0 }}</td>
                <td class="p-3 sm:p-4">{{ searchResults.regions?.West || 0 }}</td>
                <td class="p-3 sm:p-4">{{ searchResults.regions?.Central || 0 }}</td>
                <td class="p-3 sm:p-4 font-bold text-brand">{{ getTotal() }}</td>
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
export class RegionalManagerComponent implements OnInit {
  searchSku: string = '';
  searchResults: any = null;
  error: string = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {}

  search(): void {
    if (!this.searchSku) {
      this.error = 'Please enter a SKU';
      return;
    }

    this.inventoryService.searchInventory(this.searchSku).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.error = '';
      },
      error: (err) => this.error = 'Battery not found'
    });
  }

  getTotal(): number {
    if (!this.searchResults?.regions) return 0;
    return (this.searchResults.regions.East || 0) +
           (this.searchResults.regions.West || 0) +
           (this.searchResults.regions.Central || 0);
  }
}
