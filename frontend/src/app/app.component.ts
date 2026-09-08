import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col">
      <header class="bg-brand text-white shadow-md" *ngIf="currentUser$ | async as user">
        <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-3xl leading-none">🔋</span>
            <div>
              <h1 class="text-lg sm:text-xl font-bold tracking-wide leading-tight">INDUSTRIAL BATTERIES</h1>
              <p class="text-xs text-blue-200 leading-tight">Inventory Management Dashboard</p>
            </div>
          </div>
          <div class="flex items-center justify-between sm:justify-end gap-3 text-sm">
            <span class="text-blue-100">
              Welcome, <span class="font-semibold text-white">{{ user.username }}</span>
              <span class="hidden sm:inline text-blue-300"> ({{ roleLabel(user.role) }})</span>
            </span>
            <button (click)="logout()"
                    class="bg-red-600 hover:bg-red-700 transition-colors px-3 py-1.5 rounded-lg font-semibold text-xs sm:text-sm">
              Logout
            </button>
          </div>
        </div>

        <nav class="bg-brand-dark">
          <div class="max-w-7xl mx-auto px-2 flex overflow-x-auto">
            <a routerLink="/view-stock" routerLinkActive="bg-brand-light" class="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-brand-light/60 whitespace-nowrap transition-colors">
              📦 View Stock
            </a>
            <a *ngIf="user.role === 'CASHIER'" routerLink="/cashier" routerLinkActive="bg-brand-light"
               class="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-brand-light/60 whitespace-nowrap transition-colors">
              💳 Sell Battery
            </a>
            <a *ngIf="user.role === 'REGIONAL_MANAGER'" routerLink="/regional-manager" routerLinkActive="bg-brand-light"
               class="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-brand-light/60 whitespace-nowrap transition-colors">
              🔍 Search Inventory
            </a>
            <a *ngIf="user.role === 'WAREHOUSE_ANALYTICS'" routerLink="/analytics" routerLinkActive="bg-brand-light"
               class="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-brand-light/60 whitespace-nowrap transition-colors">
              📊 Analytics
            </a>
            <a routerLink="/architecture" routerLinkActive="bg-brand-light"
               class="px-4 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-brand-light/60 whitespace-nowrap transition-colors">
              🏗️ Architecture
            </a>
          </div>
        </nav>
      </header>

      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="text-center text-xs text-slate-400 py-4" *ngIf="currentUser$ | async">
        Industrial Batteries Inventory Dashboard &mdash; Angular · Spring Boot · Python · PostgreSQL
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  roleLabel(role: string): string {
    switch (role) {
      case 'CASHIER': return 'Cashier';
      case 'REGIONAL_MANAGER': return 'Regional Manager';
      case 'WAREHOUSE_ANALYTICS': return 'Warehouse Analytics';
      default: return role;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
