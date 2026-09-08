import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-brand p-4">
      <div class="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <div class="flex flex-col items-center mb-6">
          <span class="text-5xl mb-2">🔋</span>
          <h1 class="text-xl sm:text-2xl font-bold text-slate-800 text-center tracking-wide">INDUSTRIAL BATTERIES</h1>
          <p class="text-slate-500 text-sm mt-1">Inventory Management Dashboard</p>
        </div>

        <form (ngSubmit)="login()">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1 text-slate-700">Username</label>
            <input type="text" [(ngModel)]="username" name="username" autocomplete="username"
                   class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
                   placeholder="e.g., cashier1">
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium mb-1 text-slate-700">Password</label>
            <input type="password" [(ngModel)]="password" name="password" autocomplete="current-password"
                   class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-light"
                   placeholder="password">
          </div>

          <button type="submit"
                  class="w-full bg-brand hover:bg-brand-light transition-colors text-white py-2.5 rounded-lg font-bold mb-4">
            Log In
          </button>
        </form>

        <div *ngIf="error" class="p-3 bg-red-100 text-red-800 rounded-lg mb-4 text-sm">
          {{ error }}
        </div>

        <div class="bg-slate-50 p-4 rounded-lg text-xs sm:text-sm text-slate-600 space-y-1">
          <p class="font-bold text-slate-700 mb-1">Test Accounts</p>
          <p><strong>Cashier:</strong> cashier1 / cashier123</p>
          <p><strong>Regional Manager:</strong> regional_manager1 / rm123</p>
          <p><strong>Warehouse Analytics:</strong> warehouse1 / wh123</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setSession(this.username, response.token, response.role, response.region);

        switch (response.role) {
          case 'CASHIER':
            this.router.navigate(['/cashier']);
            break;
          case 'REGIONAL_MANAGER':
            this.router.navigate(['/regional-manager']);
            break;
          case 'WAREHOUSE_ANALYTICS':
            this.router.navigate(['/analytics']);
            break;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
      }
    });
  }
}
