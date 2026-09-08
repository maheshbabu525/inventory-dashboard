import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./roles/login/login.component').then(m => m.LoginComponent) },
  { path: 'cashier', loadComponent: () => import('./roles/cashier/cashier.component').then(m => m.CashierComponent) },
  { path: 'regional-manager', loadComponent: () => import('./roles/regional-manager/regional-manager.component').then(m => m.RegionalManagerComponent) },
  { path: 'analytics', loadComponent: () => import('./roles/warehouse-analytics/analytics.component').then(m => m.AnalyticsComponent) }
];
