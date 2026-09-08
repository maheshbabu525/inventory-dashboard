import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';

interface TechItem {
  keyword: string;
  explanation: string;
}

interface TechGroup {
  header: string;
  items: TechItem[];
}

interface RoleArch {
  key: string;
  label: string;
  icon: string;
  flow: string[];
  groups: TechGroup[];
}

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto p-4 sm:p-6">
      <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-slate-800">🏗️ Architecture &amp; Tech Stack</h2>
      <p class="text-slate-500 text-sm mb-6">What actually powers each screen &mdash; every keyword below is a real class, annotation, or library used in this codebase.</p>

      <div class="flex overflow-x-auto gap-2 mb-6 pb-1">
        <button *ngFor="let a of archs" (click)="active = a.key"
                class="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors"
                [ngClass]="active === a.key ? 'bg-brand text-white' : 'bg-white text-slate-600 hover:bg-slate-100'">
          {{ a.icon }} {{ a.label }}
        </button>
      </div>

      <ng-container *ngFor="let a of archs">
        <div *ngIf="active === a.key">

          <!-- Flow diagram -->
          <div class="bg-white rounded-xl shadow p-4 sm:p-6 mb-6 overflow-x-auto">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Request Flow</h3>
            <svg [attr.viewBox]="'0 0 ' + (a.flow.length * 190 - 30) + ' 90'" class="w-full" style="min-width: 600px; height: 110px;">
              <defs>
                <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 Z" fill="#1e3a8a" />
                </marker>
              </defs>
              <ng-container *ngFor="let step of a.flow; let i = index">
                <rect [attr.x]="i * 190" y="15" width="160" height="60" rx="10"
                      fill="#eff6ff" stroke="#1e3a8a" stroke-width="1.5"></rect>
                <foreignObject [attr.x]="i * 190" y="15" width="160" height="60">
                  <div xmlns="http://www.w3.org/1999/xhtml"
                       style="display:flex;align-items:center;justify-content:center;height:60px;text-align:center;font-size:11px;font-weight:600;color:#1e3a8a;padding:4px;line-height:1.3;white-space:pre-line;">
                    {{ step }}
                  </div>
                </foreignObject>
                <line *ngIf="i < a.flow.length - 1"
                      [attr.x1]="i * 190 + 160" y1="45"
                      [attr.x2]="i * 190 + 190" y2="45"
                      stroke="#1e3a8a" stroke-width="2" marker-end="url(#arrow)"></line>
              </ng-container>
            </svg>
          </div>

          <!-- Tech vocab -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div *ngFor="let group of a.groups" class="bg-white rounded-xl shadow p-4 sm:p-5">
              <h3 class="text-sm font-bold text-brand uppercase tracking-wide mb-3">{{ group.header }}</h3>
              <ul class="space-y-3">
                <li *ngFor="let item of group.items">
                  <code class="text-xs font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">{{ item.keyword }}</code>
                  <p class="text-sm text-slate-600 mt-1">{{ item.explanation }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class ArchitectureComponent implements OnInit {
  active: string = 'CASHIER';

  archs: RoleArch[] = [
    {
      key: 'CASHIER',
      label: 'Cashier',
      icon: '💳',
      flow: ['Angular\nCashierComponent', 'JWT HTTP\nInterceptor', 'Spring Boot\nController', '@Transactional\nService', 'Spring Data JPA\nRepositories', 'PostgreSQL'],
      groups: [
        {
          header: 'Angular Frontend',
          items: [
            { keyword: 'Standalone Component', explanation: 'CashierComponent has no NgModule - it declares its own imports, kept small and self-contained.' },
            { keyword: '[(ngModel)] + FormsModule', explanation: 'Two-way binds the selected battery and quantity fields straight to component properties.' },
            { keyword: 'HttpInterceptorFn', explanation: 'A functional interceptor (main.ts) reads the token from AuthService and attaches "Authorization: Bearer ..." to every outgoing request automatically.' },
          ]
        },
        {
          header: 'Spring Boot Backend',
          items: [
            { keyword: '@PreAuthorize("hasRole(\'CASHIER\')")', explanation: 'Blocks any non-cashier at the method level - enforced on the server, not just hidden in the UI.' },
            { keyword: 'Authentication auth', explanation: "Spring injects the principal that JwtAuthenticationFilter set from the token, so the controller knows who's really calling." },
            { keyword: '@Transactional', explanation: 'Wraps the stock decrement and the transaction-log insert in one atomic commit, so a crash mid-sale can never leave stock half-updated.' },
            { keyword: 'InventoryRepository.findByBatteryIdAndRegion', explanation: "A Spring Data JPA method name that Hibernate turns into SQL automatically - no query written by hand, and it resolves the cashier's own region server-side." },
          ]
        },
        {
          header: 'Security',
          items: [
            { keyword: 'JwtAuthenticationFilter', explanation: 'A custom OncePerRequestFilter that runs before every request, validates the JWT, and populates SecurityContextHolder so @PreAuthorize has something to check.' },
            { keyword: 'JJWT (io.jsonwebtoken)', explanation: 'Signs and verifies the token with HMAC-SHA using a secret key, and carries the role as a custom claim.' },
          ]
        },
        {
          header: 'Database',
          items: [
            { keyword: 'UNIQUE(battery_id, region)', explanation: 'A PostgreSQL constraint that guarantees exactly one stock row per battery per region, preventing duplicate/conflicting rows.' },
          ]
        }
      ]
    },
    {
      key: 'REGIONAL_MANAGER',
      label: 'Regional Manager',
      icon: '🔍',
      flow: ['Angular\nRegionalManagerComponent', 'JWT HTTP\nInterceptor', 'Spring Boot\nController', 'Service Layer', 'Spring Data JPA\nRepositories', 'PostgreSQL'],
      groups: [
        {
          header: 'Angular Frontend',
          items: [
            { keyword: 'HttpParams', explanation: 'Builds the "?sku=BA-001" query string safely (handles encoding) instead of manual string concatenation.' },
            { keyword: '*ngIf / interpolation', explanation: 'The results table only renders once a search actually returns data, using the safe-navigation operator (?.) for missing regions.' },
          ]
        },
        {
          header: 'Spring Boot Backend',
          items: [
            { keyword: '@RequestParam String sku', explanation: 'Binds the query string parameter directly to a method argument - no manual parsing.' },
            { keyword: 'No @PreAuthorize role check', explanation: 'Any authenticated role can search stock (still requires a valid JWT via the filter chain - just not restricted to one specific role).' },
            { keyword: 'Java Streams (forEach)', explanation: 'InventoryService.searchBattery() aggregates the per-region rows into a single {region: quantity} map on the fly.' },
          ]
        },
        {
          header: 'Data Access',
          items: [
            { keyword: 'BatteryRepository.findBySku', explanation: 'A derived JPA query method - Spring generates the "WHERE sku = ?" SQL from the method name alone.' },
            { keyword: 'InventoryRepository.findByBatteryId', explanation: 'Fetches every region row for that battery in one call, which the service then groups by region.' },
          ]
        }
      ]
    },
    {
      key: 'WAREHOUSE_ANALYTICS',
      label: 'Warehouse Analytics',
      icon: '📊',
      flow: ['Angular\nAnalyticsComponent', 'JWT HTTP\nInterceptor', 'Spring Boot\nController', 'Java Streams\nAggregation', 'Spring Data JPA', 'PostgreSQL'],
      groups: [
        {
          header: 'Angular Frontend',
          items: [
            { keyword: '*ngFor + ngClass', explanation: 'Renders the per-battery stock table and conditionally colors rows red when quantity < 20, purely from data - no hardcoded HTML per row.' },
          ]
        },
        {
          header: 'Spring Boot Backend',
          items: [
            { keyword: '@PreAuthorize("hasRole(\'WAREHOUSE_ANALYTICS\')")', explanation: 'Only this role can call the analytics endpoint - enforced server-side, same pattern as the cashier endpoint.' },
            { keyword: 'stream().mapToInt().sum()', explanation: 'Computes total stock across every region and battery in-memory from the entities JPA already loaded - no extra SQL query needed.' },
            { keyword: 'stream().filter().count()', explanation: 'Counts how many inventory rows are below the low-stock threshold (20 units) to produce the "Low Stock Alerts" tile.' },
          ]
        },
        {
          header: 'Data Access',
          items: [
            { keyword: 'batteryRepository.findAll() / inventoryRepository.findAll()', explanation: 'Simple JPA repository methods - Hibernate maps the result set straight back into Battery and Inventory entity objects.' },
          ]
        }
      ]
    },
    {
      key: 'VIEW_STOCK',
      label: 'View Stock (Python)',
      icon: '📦',
      flow: ['Angular\nViewStockComponent', 'Spring Boot\n(/inventory/all)', 'Flask\n(/stock-alert)', 'SQLAlchemy ORM', 'Same PostgreSQL DB'],
      groups: [
        {
          header: 'Angular Frontend',
          items: [
            { keyword: 'forkJoin (RxJS)', explanation: 'Fires the low-stock check for all 3 regions to the Python service in parallel and waits for every response before rendering alerts.' },
            { keyword: 'Two backend URLs in one service', explanation: 'InventoryService calls environment.apiUrl (Spring Boot) for the stock table and environment.pythonApiUrl (Flask) for alerts - two independently deployed services, one Angular service class.' },
          ]
        },
        {
          header: 'Python Microservice (Flask)',
          items: [
            { keyword: '@app.route(..., methods=[\'POST\'])', explanation: 'Flask\'s routing decorator exposes /api/python/stock-alert as its own independent endpoint, deployed as a separate Docker container from the Java backend.' },
            { keyword: 'Flask-SQLAlchemy models', explanation: 'A lightweight Python ORM (Inventory, Transaction, Battery) pointed at the exact same PostgreSQL tables the Java JPA entities use - two different languages, one shared database.' },
            { keyword: 'Flask-CORS', explanation: 'Explicitly allow-lists the frontend origin, since the browser is calling this service directly rather than through the Spring Boot backend.' },
            { keyword: 'Gunicorn', explanation: 'The production WSGI server that actually runs the Flask app inside the Docker container on Railway (Flask\'s own dev server is not used in production).' },
          ]
        }
      ]
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    if (role && this.archs.some(a => a.key === role)) {
      this.active = role;
    }
  }
}
