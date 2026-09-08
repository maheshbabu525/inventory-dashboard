import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-blue-600 text-white p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">Battery Inventory Dashboard</h1>
          <div *ngIf="currentUser$ | async as user" class="flex gap-4 items-center">
            <span>{{ user.role }}</span>
            <button (click)="logout()" class="bg-red-600 px-4 py-2 rounded">Logout</button>
          </div>
        </div>
      </nav>
      <router-outlet></router-outlet>
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
