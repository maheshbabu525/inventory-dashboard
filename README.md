# Industrial Battery Inventory Management Dashboard

A full-stack portfolio project showcasing **Angular + Spring Boot + Python** with role-based access control.

## 🎯 Features

- **3 User Roles**: Cashier (POS), Regional Manager (Search), Warehouse Analytics (Dashboard)
- **Real-Time Stock Updates**: Atomic transactions, no race conditions
- **JWT Authentication**: Secure token-based login
- **Role-Based Access Control (RBAC)**: Server-side enforcement
- **Python Integration**: Stock alerts, demand forecasting
- **Live Deployment**: Ready for Railway/Vercel deployment

## 🏗️ Architecture

```
Angular Frontend → Spring Boot Backend ↔ Python Service
        ↓
    PostgreSQL Database
```

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17+, TailwindCSS, TypeScript |
| Backend | Spring Boot 3.2+, Spring Security, JWT |
| Logic | Python 3.10+, Flask |
| Database | PostgreSQL 15+ |
| Deployment | Docker, Railway/Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Frontend)
- Java 17+ (Backend)
- Python 3.10+ (Logic)
- PostgreSQL 15+ (Database)
- Docker (Optional, for containerization)

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/inventory-dashboard.git
cd inventory-dashboard
```

### 2. Frontend Setup

```bash
cd frontend
npm install
ng serve --open
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

```bash
psql -U postgres
CREATE DATABASE battery_inventory;
\c battery_inventory
\i backend/src/main/resources/schema.sql
\i backend/src/main/resources/data.sql
```

## 🧪 Test Users

| Role | Username | Password |
|------|----------|----------|
| Cashier | cashier1 | cashier123 |
| Regional Manager | regional_manager1 | rm123 |
| Warehouse Analytics | warehouse1 | wh123 |

## 📝 Implementation Phases

### Phase 1: Static Frontend ✅
- 3 role-based Angular components with mock data

### Phase 2: Backend & Auth ✅
- Spring Boot REST API with PostgreSQL
- JWT authentication + role-based access control

### Phase 3: Python Logic ✅
- Stock alerts, demand forecasting
- Atomic transaction processing

### Phase 4: Testing & Deployment ✅
- End-to-end test scenarios
- Docker containerization
- Railway/Vercel deployment

## 🐳 Docker Deployment

```bash
# Build all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:80
# Backend API: http://localhost:8080
# Python Service: http://localhost:5000
# Database: localhost:5432
```

## ☁️ Live Deployment (Railway)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

**Quick Deploy:**
```bash
# 1. Push to GitHub
git push origin main

# 2. On Railway.app:
#    - Connect GitHub repo
#    - Set environment variables
#    - Deploy

# Frontend: https://your-domain.vercel.app
# Backend: https://your-backend.railway.app
```

## 📚 API Documentation

### Authentication
```bash
POST /api/auth/login
{
  "username": "cashier1",
  "password": "cashier123"
}
→ { "token": "jwt...", "role": "CASHIER" }
```

### Inventory Operations
```bash
# Sell batteries (Cashier only)
POST /api/inventory/sale
{ "batteryId": 1, "quantity": 2 }

# Search inventory
GET /api/inventory/search?sku=BA-001

# View all regions (Regional Manager/Analytics only)
GET /api/inventory/all

# Analytics (Warehouse Analytics only)
GET /api/inventory/analytics
```

## 🎓 Interview Showcase

**Demo Script:**
1. Open live URL → "Fully deployed on Railway"
2. Login as Cashier → "JWT authentication, role-based UI"
3. Sell batteries → "Real-time database updates via Spring Boot"
4. Switch to Regional Manager → "Different permissions, UI hidden based on role"
5. Show Python integration → "Forecasting & alerts in background"
6. Open DevTools → "Show network requests, token in localStorage"

## 📊 Project Structure

```
inventory-dashboard/
├── frontend/                 # Angular application
│   ├── src/app/
│   │   ├── roles/           # Cashier, RegionalManager, Analytics components
│   │   ├── shared/          # Auth service, inventory service
│   │   └── environments/    # dev vs prod configs
│   ├── package.json
│   ├── angular.json
│   └── Dockerfile
├── backend/                  # Spring Boot API
│   ├── src/main/
│   │   ├── java/com/battery/
│   │   │   ├── config/      # Security, JWT config
│   │   │   ├── controller/  # REST endpoints
│   │   │   ├── service/     # Business logic
│   │   │   ├── entity/      # JPA entities
│   │   │   └── repository/  # Data access
│   │   └── resources/       # application.properties, schema.sql
│   ├── pom.xml
│   └── Dockerfile
├── python-logic/            # Flask service
│   ├── app.py
│   ├── services/           # Stock alerts, forecasting
│   ├── models/             # SQLAlchemy models
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml       # Local development
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with 24-hour expiration
- ✅ Server-side authorization enforcement
- ✅ Atomic database transactions (no race conditions)
- ✅ CORS configured for frontend domain
- ✅ Environment variables for secrets (no hardcoded credentials)

## 📈 Performance & Scalability

- Atomic stock updates prevent inventory corruption
- Connection pooling on database
- Stateless JWT authentication
- Python service separates heavy computation
- Dockerized for easy horizontal scaling

## 🤝 Contributing

This is a portfolio project. Feedback welcome!

## 📄 License

MIT License - Feel free to use for portfolio or learning

## 📧 Questions?

See implementation plan or deployment guide in project root.

---

**Ready for interviews!** 🚀
