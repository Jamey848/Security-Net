# Security Audit Tracker - Getting Started

## 🚀 Quick Start Guide

This guide will help you get the Security Audit Tracker running locally in **less than 10 minutes**.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v24 or higher ([download](https://nodejs.org/))
- **PostgreSQL** v15 or higher ([download](https://www.postgresql.org/download/))
- **Git** ([download](https://git-scm.com/))

Verify installations:
```bash
node --version    # Should be v24+
npm --version     # Should be 10+
psql --version    # Should be 15+
```

---

## Step 1: Get the Code

```bash
# Clone the repository (or unzip if provided as archive)
git clone <repository-url>
cd examen-2025

# OR if you have a zip file:
unzip security-audit-tracker.zip
cd security-audit-tracker
```

---

## Step 2: Set Up the Database

### Option A: Using Command Line

```bash
# Create the database
createdb security_audit_db

# Run migrations (create tables)
psql -U postgres -d security_audit_db -f database/migrations/001_create_tables.sql

# Load sample data
psql -U postgres -d security_audit_db -f database/seeds/seed_data.sql
```

### Option B: Using psql Interactive

```bash
# Connect to PostgreSQL
psql -U postgres

# In the psql prompt:
CREATE DATABASE security_audit_db;
\c security_audit_db
\i database/migrations/001_create_tables.sql
\i database/seeds/seed_data.sql
\q
```

### Verify Database Setup

```bash
psql -U postgres -d security_audit_db -c "SELECT COUNT(*) FROM audits;"
# Should return: 8

psql -U postgres -d security_audit_db -c "SELECT COUNT(*) FROM findings;"
# Should return: 22
```

---

## Step 3: Configure Environment Variables

### Backend Configuration

```bash
cd backend
cp .env.dist .env
```

Edit `backend/.env` with your database credentials:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=security_audit_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

### Frontend Configuration

```bash
cd ../frontend
cp .env.dist .env
```

The default values in `frontend/.env` should work:

```env
PORT=8080
NODE_ENV=development
```

---

## Step 4: Install Dependencies

### Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- express (API framework)
- pg (PostgreSQL client)
- cors (CORS support)
- dotenv (environment variables)
- morgan (logging)
- jest, supertest (testing)

### Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs:
- express (static file server)

---

## Step 5: Run Tests (Optional but Recommended)

```bash
cd backend
npm test
```

Expected output:
```
PASS tests/api.test.js
  API Endpoints
    Health Checks
      ✓ GET /api/health should return healthy status
      ✓ GET /api/ready should return ready when database is connected
    ...

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

---

## Step 6: Start the Application

You'll need **three terminal windows**.

### Terminal 1: Database
Already running from Step 2 ✅

### Terminal 2: Backend API

```bash
cd backend
npm start
```

Expected output:
```
Backend API server running on port 3000
Environment: development
Database: localhost:5432
Database connection established
```

### Terminal 3: Frontend

```bash
cd frontend
npm start
```

Expected output:
```
Frontend server running on port 8080
Environment: development
```

---

## Step 7: Access the Application

Open your browser and navigate to:

**http://localhost:8080**

You should see:
- 📊 Dashboard with statistics (8 audits, findings counts, etc.)
- 📋 Table of recent audits
- 🔴 Critical security findings
- ✅ Green "API Status: Healthy" in footer

---

## Step 8: Test Functionality

### View Existing Data

- The dashboard should show **8 audits**
- You should see audits like "Production API Gateway", "Customer Database", etc.
- Critical findings section should display security issues

### Create a New Audit

1. Click **"+ New Audit"** button
2. Fill in the form:
   - **System Name:** "Test System"
   - **Audit Type:** Select "Penetration Test"
   - **Auditor:** "Your Name"
3. Click **"Create Audit"**
4. The new audit should appear in the table
5. Statistics should update

### Delete an Audit

1. Find an audit in the table
2. Click the **"Delete"** button
3. Confirm deletion
4. Audit should disappear from table

---

## Troubleshooting

### Problem: Database connection error

**Error:** `Connection refused` or `password authentication failed`

**Solutions:**
```bash
# Check if PostgreSQL is running
pg_isready

# On macOS with Homebrew:
brew services list
brew services start postgresql@15

# On Linux:
sudo systemctl status postgresql
sudo systemctl start postgresql

# Check credentials in backend/.env match your PostgreSQL setup
```

### Problem: Port already in use

**Error:** `EADDRINUSE` or `Port 3000/8080 already in use`

**Solutions:**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change the port in .env files
```

### Problem: npm install fails

**Error:** Various dependency errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Make sure you're using Node v24+
node --version
```

### Problem: Frontend can't reach backend

**Error:** API calls fail, "API Status: Unavailable"

**Solutions:**
1. Verify backend is running: `curl http://localhost:3000/api/health`
2. Check backend logs for errors
3. Ensure no CORS issues (should be configured)
4. Check browser console for errors (F12)

### Problem: Database is empty

**Issue:** No audits showing, stats show 0

**Solutions:**
```bash
# Reload seed data
psql -U postgres -d security_audit_db -f database/seeds/seed_data.sql

# Verify data loaded
psql -U postgres -d security_audit_db -c "SELECT COUNT(*) FROM audits;"
```

---

## Verify Everything Works

Run this quick verification checklist:

```bash
# 1. Backend health check
curl http://localhost:3000/api/health
# Should return: {"status":"healthy",...}

# 2. Backend readiness check
curl http://localhost:3000/api/ready
# Should return: {"status":"ready","database":"connected",...}

# 3. Get audits
curl http://localhost:3000/api/audits
# Should return: JSON array with 8+ audits

# 4. Get critical findings
curl http://localhost:3000/api/findings?severity=critical
# Should return: JSON array with critical findings

# 5. Get statistics
curl http://localhost:3000/api/stats
# Should return: {"totalAudits":8,"criticalFindings":...}

# 6. Frontend
# Open http://localhost:8080 in browser
# Should show working dashboard
```

---

## Next Steps

Now that you have the application running:

### For Students:

1. **Read EXAM_INSTRUCTIONS.md** - Understand what you need to do
2. **Start with Git** - Create your repository and configure branch protection
3. **Create Dockerfiles** - Containerize each service
4. **Build docker-compose.yml** - Get all services running together
5. **Create Kubernetes manifests** - Deploy to K8s
6. **Set up CI/CD** - Automate testing and building
7. **Complete documentation** - Fill in all TODO sections

---

## Application Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Frontend  │────────▶│   Backend   │
│             │         │   :8080     │         │   :3000     │
└─────────────┘         └─────────────┘         └──────┬──────┘
                                                        │
                                                        ▼
                                                ┌─────────────┐
                                                │  PostgreSQL │
                                                │    :5432    │
                                                └─────────────┘
```

---

## Useful Commands

### Development

```bash
# Start backend in development mode (with auto-reload)
cd backend
npm run dev

# Run tests in watch mode
npm run test:watch

# Check code formatting (if linter added)
npm run lint
```

### Database

```bash
# Connect to database
psql -U postgres -d security_audit_db

# View all audits
psql -U postgres -d security_audit_db -c "SELECT * FROM audits;"

# View all findings
psql -U postgres -d security_audit_db -c "SELECT * FROM findings;"

# Reset database (WARNING: deletes all data)
dropdb security_audit_db
createdb security_audit_db
psql -U postgres -d security_audit_db -f database/migrations/001_create_tables.sql
psql -U postgres -d security_audit_db -f database/seeds/seed_data.sql
```

### Logs

```bash
# Backend logs are in the terminal where you ran npm start
# Frontend logs are in the terminal where you ran npm start
# Database logs: varies by PostgreSQL installation
```

---

## API Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/ready` | GET | Readiness check |
| `/api/audits` | GET | List all audits |
| `/api/audits` | POST | Create new audit |
| `/api/audits/:id` | GET | Get specific audit |
| `/api/audits/:id` | PUT | Update audit |
| `/api/audits/:id` | DELETE | Delete audit |
| `/api/findings` | GET | List findings |
| `/api/findings?severity=critical` | GET | Filter by severity |
| `/api/stats` | GET | Get statistics |

See [docs/API.md](docs/API.md) for complete documentation.

---

## Support

- **Exam Instructions:** [EXAM_INSTRUCTIONS.md](EXAM_INSTRUCTIONS.md)
- **API Documentation:** [docs/API.md](docs/API.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## What's Next?

Once you have the application running locally, you're ready to:

1. Understand the application architecture
2. Verify all features work
3. Start containerizing with Docker
4. Create docker-compose.yml
5. Deploy to Kubernetes
6. Set up CI/CD pipeline
7. Complete documentation

**Good luck!** 🚀

---

**Version:** 1.0
**Last Updated:** November 2025
