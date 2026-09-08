import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./roles/login/login.component').then(m => m.LoginComponent) },
  { path: 'view-stock', loadComponent: () => import('./roles/view-stock/view-stock.component').then(m => m.ViewStockComponent) },
  { path: 'cashier', loadComponent: () => import('./roles/cashier/cashier.component').then(m => m.CashierComponent) },
  { path: 'regional-manager', loadComponent: () => import('./roles/regional-manager/regional-manager.component').then(m => m.RegionalManagerComponent) },
  { path: 'analytics', loadComponent: () => import('./roles/warehouse-analytics/analytics.component').then(m => m.AnalyticsComponent) },
  { path: 'architecture', loadComponent: () => import('./roles/architecture/architecture.component').then(m => m.ArchitectureComponent) },
  { path: '**', redirectTo: '/login' }
];
