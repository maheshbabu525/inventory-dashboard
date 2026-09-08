import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../shared/services/inventory.service';
import { forkJoin } from 'rxjs';

interface RegionCard {
  region: string;
  items: { battery: string; sku: string; quantity: number }[];
  alertSkus: Set<string>;
}

@Component({
  selector: 'app-view-stock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-800">📦 Stock Overview</h2>
          <p class="text-slate-500 text-sm">Live inventory across all regions &mdash; visible to every role</p>
        </div>
        <span *ngIf="pythonAvailable" class="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium w-fit">
          🐍 Live alerts via Python service
        </span>
      </div>

      <div *ngIf="loading" class="text-slate-500">Loading stock&hellip;</div>
      <div *ngIf="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-4">{{ error }}</div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div *ngFor="let card of regionCards" class="bg-white rounded-xl shadow p-4 sm:p-5">
          <h3 class="text-lg font-bold text-brand mb-3 flex items-center gap-2">
            📍 {{ card.region }}
          </h3>
          <ul class="space-y-2">
            <li *ngFor="let item of card.items" class="flex items-center justify-between text-sm border-b border-slate-100 pb-2">
              <div>
                <p class="font-medium text-slate-700">{{ item.battery }}</p>
                <p class="text-slate-400 text-xs">{{ item.sku }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold" [ngClass]="item.quantity < 20 ? 'text-red-600' : 'text-slate-700'">
                  {{ item.quantity }}
                </span>
                <span *ngIf="card.alertSkus.has(item.sku)" title="Flagged low-stock by Python service" class="text-xs">⚠️</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ViewStockComponent implements OnInit {
  regionCards: RegionCard[] = [];
  loading = true;
  error = '';
  pythonAvailable = false;

  private readonly regions = ['East', 'West', 'Central'];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getAllInventory().subscribe({
      next: (data) => {
        this.regionCards = this.regions
          .filter(region => data[region])
          .map(region => ({
            region,
            items: data[region],
            alertSkus: new Set<string>()
          }));
        this.loading = false;
        this.loadPythonAlerts();
      },
      error: () => {
        this.error = 'Failed to load stock overview';
        this.loading = false;
      }
    });
  }

  private loadPythonAlerts(): void {
    if (this.regionCards.length === 0) return;

    const calls = this.regionCards.map(card => this.inventoryService.getStockAlerts(card.region, 20));
    forkJoin(calls).subscribe({
      next: (results) => {
        // Each result is a list of {battery_id, quantity, alert}; we only have SKU on the
        // frontend side, so we flag any item whose quantity matches an alerted low-stock row.
        results.forEach((alerts: any[], index: number) => {
          const card = this.regionCards[index];
          alerts.forEach(a => {
            const match = card.items.find(i => i.quantity === a.quantity);
            if (match) {
              card.alertSkus.add(match.sku);
            }
          });
        });
        this.pythonAvailable = true;
      },
      error: () => {
        // Python service unreachable - stock overview still works, alerts just don't show
        this.pythonAvailable = false;
      }
    });
  }
}
