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
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white rounded shadow p-8 w-full max-w-md">
        <h2 class="text-3xl font-bold mb-6 text-center">Battery Inventory Dashboard</h2>
        
        <form (ngSubmit)="login()">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Username</label>
            <input type="text" [(ngModel)]="username" name="username" 
                   class="w-full border rounded px-3 py-2" placeholder="e.g., cashier1">
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Password</label>
            <input type="password" [(ngModel)]="password" name="password" 
                   class="w-full border rounded px-3 py-2" placeholder="password">
          </div>

          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-bold mb-4">
            Login
          </button>
        </form>

        <div *ngIf="error" class="p-4 bg-red-100 text-red-800 rounded mb-4">
          {{ error }}
        </div>

        <div class="bg-gray-50 p-4 rounded text-sm">
          <p class="font-bold mb-2">Test Accounts:</p>
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
        this.authService.setToken(response.token, response.role);
        
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
