# Battery Inventory Dashboard - Setup Guide

## ✅ Project Structure Complete

Your full-stack project is ready with:
- ✅ Angular 17 frontend (3 role-based components)
- ✅ Spring Boot 3.2 backend with JWT auth
- ✅ Python Flask microservice
- ✅ PostgreSQL database schemas
- ✅ Docker Compose for local development
- ✅ Git repository initialized

---

## 🚀 Next Steps: Push to GitHub

### Option 1: Using GitHub Desktop (Recommended)

1. **Open GitHub Desktop**
   - Click "File" → "Add Local Repository"
   - Navigate to: `C:\Users\Meetm\OneDrive\Desktop\Inventory_dashboard\project`
   - Click "Add Repository"

2. **Publish to GitHub**
   - Click "Publish repository" (top-right button)
   - Name: `inventory-dashboard`
   - Description: "Full-stack battery inventory management system - Angular, Spring Boot, Python"
   - Choose: Public or Private (recommend Private for interview portfolio)
   - Click "Publish Repository"

3. **Copy Your Repository URL**
   - GitHub Desktop will show your repo URL
   - Copy it (e.g., `https://github.com/YOUR_USERNAME/inventory-dashboard.git`)

### Option 2: Using Command Line

```bash
cd C:\Users\Meetm\OneDrive\Desktop\Inventory_dashboard\project
git remote add origin https://github.com/YOUR_USERNAME/inventory-dashboard.git
git branch -M main
git push -u origin main
```

---

## 🛠️ Local Development Setup (Before Deployment)

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
# No npm needed - uses Maven
```

**Python:**
```bash
cd ../python-logic
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

### 2. Set Up PostgreSQL Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE battery_inventory;"

# Import schema
psql -U postgres -d battery_inventory -f backend/src/main/resources/schema.sql

# Seed test data
psql -U postgres -d battery_inventory -f backend/src/main/resources/data.sql
```

### 3. Run Services Locally

**Terminal 1: Spring Boot Backend**
```bash
cd backend
mvn spring-boot:run
# Available at: http://localhost:8080
```

**Terminal 2: Python Service**
```bash
cd python-logic
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
# Available at: http://localhost:5000
```

**Terminal 3: Angular Frontend**
```bash
cd frontend
ng serve --open
# Opens: http://localhost:4200
```

### 4. Test Login

Visit http://localhost:4200 and log in with:
- **Cashier**: `cashier1` / `cashier123`
- **Regional Manager**: `regional_manager1` / `rm123`
- **Warehouse Analytics**: `warehouse1` / `wh123`

---

## 🐳 Docker Deployment (Local)

```bash
cd project
docker-compose up --build

# Services:
# Frontend: http://localhost:80
# Backend API: http://localhost:8080
# Python Service: http://localhost:5000
# PostgreSQL: localhost:5432
```

---

## ☁️ Deploy to Railway (Next Phase)

Once you're happy with local setup:

1. **Ensure .gitignore is working**
   ```bash
   git status
   # Should NOT show: node_modules, target, venv, .env
   ```

2. **Push latest to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

3. **Follow deployment guide** (`../deployment-guide-railway-live.md`)
   - Create Railway account ($5 free credit)
   - Connect GitHub repo
   - Set environment variables
   - Deploy 4 services (PostgreSQL, Backend, Python, Frontend)

---

## 📋 Environment Variables Template

**For Local Development (.env file - DO NOT COMMIT)**

```
# Database
DB_URL=jdbc:postgresql://localhost:5432/battery_inventory
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=battery-dashboard-secret-key-min-32-chars-long

# Ports
SERVER_PORT=8080

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:4200

# Python
PYTHON_SERVICE_URL=http://localhost:5000
```

**For Production (Set in Railway Dashboard)**
```
DB_URL=postgresql://user:pass@host:5432/battery_inventory
JWT_SECRET=your-production-secret-key
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
PYTHON_SERVICE_URL=https://your-backend.railway.app
```

---

## 🎯 Development Checklist

- [ ] Git repository initialized and pushed to GitHub
- [ ] PostgreSQL database created and seeded
- [ ] Spring Boot backend runs locally (port 8080)
- [ ] Python service runs locally (port 5000)
- [ ] Angular frontend runs locally (port 4200)
- [ ] Can login with test users
- [ ] Cashier can sell batteries (stock updates)
- [ ] Regional Manager can search inventory
- [ ] Warehouse Analytics can view dashboard
- [ ] No console errors in browser
- [ ] API responds with correct status codes

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "Port 8080 already in use" | Kill process: `lsof -i :8080` then `kill -9 <PID>` |
| "Cannot connect to database" | Check PostgreSQL is running: `pg_isready` |
| "Angular compilation error" | Delete `node_modules`, run `npm install` again |
| "JWT validation failed" | Ensure `JWT_SECRET` matches in Spring Boot config |
| "CORS error" | Check `CORS_ALLOWED_ORIGINS` in `application.properties` |

---

## 📚 Project References

- **Implementation Plan**: `../inventory-dashboard-implementation-plan.md`
- **Deployment Guide**: `../deployment-guide-railway-live.md`
- **Tech Stack**: Angular 17, Spring Boot 3.2, Python 3.10, PostgreSQL 15

---

## 🎓 Interview Demo Flow

1. "This is a full-stack project I built showing Angular, Spring Boot, and Python"
2. Show live URL or local instance
3. "Let me log in as a Cashier and show the POS interface"
4. "Sell 2 batteries - watch the stock update in real-time"
5. "Login as Regional Manager - different UI based on role"
6. "Search for a battery across all regions"
7. "Warehouse Analytics can see forecasts and alerts"
8. Open DevTools: "Show API calls, JWT tokens, database queries"

---

**Ready to deploy?** Follow the Railway deployment guide after confirming local setup works!
