import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../shared/services/inventory.service';

@Component({
  selector: 'app-regional-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-3xl font-bold mb-6">Regional Manager - Inventory Search</h2>
      
      <div class="bg-white rounded shadow p-6 mb-6">
        <input type="text" [(ngModel)]="searchSku" placeholder="Search by SKU..." 
               class="w-full border rounded px-3 py-2 mb-4">
        <button (click)="search()" class="w-full bg-blue-600 text-white py-2 rounded font-bold">
          Search
        </button>
      </div>

      <div *ngIf="searchResults" class="bg-white rounded shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-4 text-left">Battery Name</th>
              <th class="p-4 text-left">SKU</th>
              <th class="p-4 text-right">East</th>
              <th class="p-4 text-right">West</th>
              <th class="p-4 text-right">Central</th>
              <th class="p-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="p-4">{{ searchResults.battery }}</td>
              <td class="p-4">{{ searchResults.sku }}</td>
              <td class="p-4 text-right">{{ searchResults.regions?.East || 0 }}</td>
              <td class="p-4 text-right">{{ searchResults.regions?.West || 0 }}</td>
              <td class="p-4 text-right">{{ searchResults.regions?.Central || 0 }}</td>
              <td class="p-4 text-right font-bold">{{ getTotal() }}</td>
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
