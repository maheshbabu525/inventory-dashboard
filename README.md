# 🔋 Industrial Battery Inventory Management Dashboard

A full-stack portfolio project showcasing **Angular + Spring Boot + Python** with role-based access control, deployed live on Railway.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **App (open this one)** | https://inventory-dashboard-production-7667.up.railway.app |
| Backend API | https://lovely-possibility-production-5ecf.up.railway.app |
| Python Microservice | https://responsible-light-production-6ee4.up.railway.app |

**Test Accounts:**

| Role | Username | Password |
|------|----------|----------|
| Cashier | `cashier1` or `cashier2` | `cashier123` |
| Regional Manager | `regional_manager1` | `rm123` |
| Warehouse Analytics | `warehouse1` | `wh123` |

Fully responsive — works on desktop, tablet, and mobile.

## 🎯 Features

- **3 User Roles**: Cashier (POS), Regional Manager (Search), Warehouse Analytics (Dashboard)
- **Shared "View Stock" page**: visible to every role, showing live inventory across all regions
- **Real-Time Stock Updates**: atomic transactions tied to the authenticated user's actual region — no race conditions, no cross-region corruption
- **JWT Authentication**: stateless, token-based login, verified server-side on every request via a custom Spring Security filter
- **Role-Based Access Control (RBAC)**: enforced server-side with `@PreAuthorize`, not just hidden in the UI
- **Python Integration**: the Angular frontend calls the Python microservice directly for live low-stock alerts on the View Stock page
- **Live Deployment**: 3 independent services + PostgreSQL, all running on Railway

## 🏗️ Architecture

```
Angular Frontend ──► Spring Boot Backend ──► PostgreSQL
        │                                        ▲
        └───────► Python Microservice ───────────┘
              (called directly for stock alerts)
```

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17 (standalone components), Tailwind CSS, TypeScript |
| Backend | Spring Boot 3.2, Spring Security 6, JWT (JJWT 0.12) |
| Logic | Python 3.10, Flask, Flask-CORS |
| Database | PostgreSQL |
| Deployment | Docker, Railway (3 independent services) |

## 🚀 Local Development

### Prerequisites
- Node.js 18+ (Frontend)
- Java 17+ (Backend)
- Python 3.10+ (Logic)
- PostgreSQL (Database)
- Docker (optional, for containerized runs)

### 1. Clone & Setup

```bash
git clone https://github.com/maheshbabu525/inventory-dashboard.git
cd inventory-dashboard
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npx ng serve --open
# Opens http://localhost:4200
```

### 3. Backend Setup

```bash
cd ../backend
mvn clean install
mvn spring-boot:run
# API runs on http://localhost:8080
```

### 4. Python Service Setup

```bash
cd ../python-logic
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Service runs on http://localhost:5000
```

### 5. Database Setup

Tables and seed data load automatically on backend startup
(`spring.sql.init.mode=always` + Hibernate `ddl-auto=update`) — no manual
SQL required once `DB_URL`/`DB_USER`/`DB_PASSWORD` point at a running
PostgreSQL instance.

## 🐳 Docker Deployment

```bash
docker-compose up --build

# Frontend:        http://localhost:80
# Backend API:      http://localhost:8080
# Python Service:   http://localhost:5000
# Database:         localhost:5432
```

## ☁️ Live Deployment (Railway)

Each of the 3 services (`backend`, `frontend`, `python-logic`) is deployed as
its **own independent Railway service** from this same repo, each with its
own `Root Directory` setting and its own `railway.json` forcing a Docker
build. A separate PostgreSQL service supplies `DB_URL`/`DB_USER`/`DB_PASSWORD`
to the backend via Railway variable references.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step guide.

## 📚 API Documentation

### Authentication
```bash
POST /api/auth/login
{ "username": "cashier1", "password": "cashier123" }
→ { "token": "jwt...", "role": "CASHIER", "region": "East" }
```

### Inventory Operations
```bash
# Sell batteries (Cashier only - region resolved server-side from the token)
POST /api/inventory/sale
{ "batteryId": 1, "quantity": 2 }

# Search inventory by SKU (any authenticated role)
GET /api/inventory/search?sku=BA-001

# View all regions (any authenticated role)
GET /api/inventory/all

# Analytics (Warehouse Analytics only)
GET /api/inventory/analytics
```

### Python Microservice
```bash
# Called directly by the Angular frontend on the View Stock page
POST /api/python/stock-alert
{ "region": "East", "threshold": 20 }
→ [{ "battery_id": 3, "quantity": 12, "alert": "WARNING" }]

GET /health
→ { "status": "healthy" }
```

## 🎓 Interview Demo Script

1. Open the live URL on your phone and on desktop → "Responsive, deployed live on Railway"
2. Log in as `cashier1` → JWT issued, role-based nav appears
3. Sell a battery → stock decreases immediately, tied to `cashier1`'s actual region (East)
4. Open **View Stock** → shared page any role can see, with live ⚠️ alerts computed by the Python microservice
5. Log out, log in as `regional_manager1` → different nav, search by SKU across all 3 regions
6. Log in as `warehouse1` → analytics dashboard with totals and low-stock counts
7. Open DevTools → show the `Authorization: Bearer <jwt>` header on requests, and the token in `localStorage`

## 📊 Project Structure

```
inventory-dashboard/
├── frontend/                 # Angular application
│   ├── src/app/
│   │   ├── roles/            # login, cashier, regional-manager, warehouse-analytics, view-stock
│   │   ├── shared/            # auth.service, inventory.service, models
│   │   └── environments/      # dev vs prod config (API + Python URLs)
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Spring Boot API
│   ├── src/main/java/com/battery/
│   │   ├── config/            # SecurityConfig, JwtAuthenticationFilter, JwtTokenProvider
│   │   ├── controller/        # REST endpoints
│   │   ├── service/           # business logic
│   │   ├── entity/            # JPA entities
│   │   └── repository/        # data access
│   ├── src/main/resources/    # application.properties, schema.sql, data.sql
│   ├── pom.xml
│   └── Dockerfile
├── python-logic/             # Flask microservice
│   ├── app.py                 # stock-alert, forecast, process-sale, health
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml         # local multi-service development
└── README.md
```

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt, one distinct hash per user
- ✅ JWT tokens with 24-hour expiration, verified on every request by a
  custom `OncePerRequestFilter`
- ✅ Server-side authorization via `@PreAuthorize` — not just hidden UI elements
- ✅ Atomic, per-region stock updates resolved from the authenticated
  user's own account (no hardcoded user/region)
- ✅ CORS restricted to the deployed frontend origin, on both the Spring
  Boot backend and the Python microservice
- ✅ All secrets and URLs supplied via environment variables, no
  hardcoded credentials

## 🤝 Contributing

This is a portfolio project. Feedback welcome!

## 📄 License

MIT License — feel free to use for portfolio or learning.

---

**Live, tested, and interview-ready.** 🚀
