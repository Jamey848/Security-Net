# Security Audit Tracker - Architecture Documentation

## Overview

The Security Audit Tracker is a three-tier web application designed to manage security audits and findings across an organization's infrastructure.

**TODO: Student - Add your architecture diagram here**

## System Components

### 1. Frontend Service

**Technology:** HTML, CSS, JavaScript (Vanilla), Express.js
**Port:** 8080 (default)
**Purpose:** User interface for interacting with the security audit system

#### Key Features:
- Dashboard with real-time statistics
- Audit management (create, view, delete)
- Security findings visualization
- Severity-based filtering
- Responsive design

#### Files:
- `frontend/public/index.html` - Main UI
- `frontend/public/styles.css` - Styling
- `frontend/public/app.js` - Client-side logic
- `frontend/server.js` - Express server for serving static files

**TODO: Student - Add information about your Docker container configuration**

### 2. Backend API Service

**Technology:** Node.js, Express.js, PostgreSQL client
**Port:** 3000 (default)
**Purpose:** RESTful API for data management and business logic

#### Key Features:
- RESTful API endpoints
- Database connection management
- Health check endpoints for Kubernetes
- CORS enabled for frontend communication
- Request logging with Morgan
- Error handling middleware

#### API Endpoints:

**Health & Readiness:**
- `GET /api/health` - Service health check
- `GET /api/ready` - Readiness check (includes DB connection test)

**Audits:**
- `GET /api/audits` - List all audits
- `GET /api/audits/:id` - Get specific audit
- `POST /api/audits` - Create new audit
- `PUT /api/audits/:id` - Update audit
- `DELETE /api/audits/:id` - Delete audit

**Findings:**
- `GET /api/findings` - List findings (with optional severity filter)
- `GET /api/findings/:id` - Get specific finding
- `POST /api/findings` - Create new finding
- `PUT /api/findings/:id` - Update finding

**Statistics:**
- `GET /api/stats` - Dashboard statistics

#### Files:
- `backend/src/server.js` - Main application server
- `backend/src/database.js` - Database connection pool
- `backend/tests/api.test.js` - API tests

**TODO: Student - Add information about your Docker container configuration**

### 3. Database Service

**Technology:** PostgreSQL 15
**Port:** 5432 (default)
**Purpose:** Persistent data storage

#### Database Schema:

**Tables:**

1. **audits**
   - `id` (SERIAL PRIMARY KEY)
   - `system_name` (VARCHAR)
   - `audit_type` (VARCHAR) - penetration_test, vulnerability_scan, compliance_check, code_review, access_review
   - `auditor` (VARCHAR)
   - `audit_date` (TIMESTAMP)
   - `status` (VARCHAR) - pending, in_progress, completed
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **findings**
   - `id` (SERIAL PRIMARY KEY)
   - `audit_id` (INTEGER FOREIGN KEY)
   - `title` (VARCHAR)
   - `description` (TEXT)
   - `severity` (VARCHAR) - critical, high, medium, low
   - `status` (VARCHAR) - open, in_progress, resolved, false_positive
   - `discovered_date` (TIMESTAMP)
   - `resolved_date` (TIMESTAMP)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

#### Initialization:
- `database/migrations/001_create_tables.sql` - Schema creation
- `database/seeds/seed_data.sql` - Sample data
- `database/init.sh` - Initialization script

**TODO: Student - Add information about your database container, volume mounts, and persistence**

## Communication Flow

**TODO: Student - Describe how the services communicate**

### User Request Flow:

1. User accesses frontend via browser
2. Frontend makes API calls to backend
3. Backend queries PostgreSQL database
4. Database returns data
5. Backend formats response
6. Frontend renders data to user

### Network Communication:

**Local Development:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Database: localhost:5432

**TODO: Student - Document your Docker network configuration**
**TODO: Student - Document your Kubernetes service configuration**

## Containerization Strategy

**TODO: Student - Complete this section**

### Docker Images:

**TODO: Describe your Dockerfile approach for each service**

1. **Frontend Container:**
   - Base image: TODO
   - Build approach: TODO
   - Environment variables: TODO
   - Exposed port: TODO

2. **Backend Container:**
   - Base image: TODO
   - Build approach: TODO
   - Environment variables: TODO
   - Exposed port: TODO

3. **Database Container:**
   - Base image: TODO
   - Initialization: TODO
   - Volume mounts: TODO
   - Exposed port: TODO

### Docker Compose Setup:

**TODO: Describe your docker-compose.yml structure**

- Services defined: TODO
- Networks: TODO
- Volumes: TODO
- Dependencies: TODO

## Kubernetes Architecture

**TODO: Student - Complete this section**

### Kubernetes Resources:

**TODO: List and describe all Kubernetes manifests you created**

1. **Deployments:**
   - TODO

2. **Services:**
   - TODO

3. **ConfigMaps:**
   - TODO

4. **Secrets:**
   - TODO

5. **PersistentVolumeClaims:**
   - TODO

6. **Ingress (if applicable):**
   - TODO

### Resource Allocation:

**TODO: Document resource limits and requests**

### High Availability:

**TODO: Describe replica configuration and scaling strategy**

## Environment Configuration

### Environment Variables:

| Variable | Service | Purpose | Example |
|----------|---------|---------|---------|
| NODE_ENV | Backend, Frontend | Environment mode | development, production |
| PORT | Backend, Frontend | Service port | 3000, 8080 |
| DB_HOST | Backend | Database hostname | localhost, database |
| DB_PORT | Backend | Database port | 5432 |
| DB_NAME | Backend | Database name | security_audit_db |
| DB_USER | Backend | Database user | postgres |
| DB_PASSWORD | Backend | Database password | (secret) |

**TODO: Student - Add any additional environment variables you configured**

## Security Considerations

### Implemented Security Measures:

1. **No Hardcoded Secrets:** All sensitive data via environment variables
2. **CORS Configuration:** Controlled cross-origin access
3. **Input Validation:** API validates all inputs
4. **SQL Injection Prevention:** Parameterized queries
5. **Database Constraints:** Type and status validation at DB level

**TODO: Student - Add security measures you implemented in your DevOps setup**

### Security Best Practices for Deployment:

**TODO: Document security practices in your containers and Kubernetes deployment**

- [ ] Secrets managed via Kubernetes Secrets
- [ ] Non-root containers
- [ ] Read-only root filesystem (where applicable)
- [ ] Resource limits to prevent DoS
- [ ] Network policies
- [ ] TLS/HTTPS configuration

## Monitoring & Observability

### Health Checks:

All services implement health check endpoints for Kubernetes liveness and readiness probes:

- **Backend:** `/api/health`, `/api/ready`
- **Frontend:** `/health`, `/ready`

**TODO: Student - Document how you configured these in Kubernetes**

### Logging:

- **Backend:** Morgan HTTP request logging
- **Frontend:** Console logging
- **Database:** PostgreSQL logs

**TODO: Student - Document logging strategy in containers**

## Scalability Considerations

**TODO: Student - Describe scalability approach**

### Horizontal Scaling:

- Which services can be scaled horizontally?
- How did you configure this in Kubernetes?

### State Management:

- How is database state managed?
- Are there any stateful components?

## CI/CD Pipeline

**TODO: Student - Document your CI/CD architecture**

### Pipeline Stages:

1. **TODO:** Source control trigger
2. **TODO:** Automated testing
3. **TODO:** Docker image building
4. **TODO:** Image registry push
5. **TODO:** Deployment (if automated)

### Tools Used:

- **TODO:** GitHub Actions
- **TODO:** Other tools

## Disaster Recovery

**TODO: Student - Document backup and recovery strategy**

### Database Backups:

- How are database backups handled?
- Where are they stored?
- Recovery process?

### Application Recovery:

- How quickly can the application be restored?
- What's the RTO (Recovery Time Objective)?

## Performance Optimization

**TODO: Student - Document performance optimizations**

### Docker Image Optimization:

- Multi-stage builds
- Layer caching
- Minimal base images
- Image size comparisons

### Database Optimization:

- Indexes on frequently queried columns
- Connection pooling
- Query optimization

## Future Improvements

**TODO: Student - Suggest improvements you would make**

Potential enhancements:
- Redis caching layer
- Message queue for async processing
- Advanced monitoring (Prometheus, Grafana)
- Automatic scaling based on metrics
- Multi-region deployment

---

**Document Version:** 1.0
**Last Updated:** [TODO: Add date]
**Updated By:** [TODO: Add your name]
