# Security Audit Tracker - API Documentation

## Base URL

- **Local Development:** `http://localhost:3000/api`
- **Docker:** `http://backend:3000/api` (internal network)
- **Kubernetes:** `http://<service-url>/api` (depends on your Service configuration)

## Authentication

Currently, the API does not implement authentication (v1.0). All endpoints are publicly accessible.

> **Note for Students:** In a production environment, you would implement JWT-based authentication or OAuth2.

## Response Format

All API responses are in JSON format.

### Success Response Format:

```json
{
  "id": 1,
  "system_name": "Production API",
  "status": "completed"
}
```

### Error Response Format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side error |
| 503 | Service Unavailable - Service not ready (e.g., database disconnected) |

---

## Health & Readiness Endpoints

### GET /api/health

Health check endpoint for Kubernetes liveness probes.

**Response:** `200 OK`

```json
{
  "status": "healthy",
  "service": "backend-api",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

---

### GET /api/ready

Readiness check endpoint for Kubernetes readiness probes. Checks database connectivity.

**Response:** `200 OK` (if ready) or `503 Service Unavailable` (if not ready)

**Success:**
```json
{
  "status": "ready",
  "service": "backend-api",
  "database": "connected",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Failure:**
```json
{
  "status": "not ready",
  "service": "backend-api",
  "database": "disconnected",
  "error": "Connection timeout"
}
```

---

## Audit Endpoints

### GET /api/audits

Retrieve all security audits with aggregated findings count and severity level.

**Query Parameters:** None

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "system_name": "Production API Gateway",
    "audit_type": "penetration_test",
    "auditor": "Alice Johnson",
    "audit_date": "2025-01-13T10:00:00.000Z",
    "status": "completed",
    "findings_count": "5",
    "severity_level": "critical",
    "created_at": "2025-01-13T10:00:00.000Z",
    "updated_at": "2025-01-13T10:00:00.000Z"
  }
]
```

**Audit Types:**
- `penetration_test`
- `vulnerability_scan`
- `compliance_check`
- `code_review`
- `access_review`

**Status Values:**
- `pending`
- `in_progress`
- `completed`

---

### GET /api/audits/:id

Retrieve a specific audit by ID.

**Path Parameters:**
- `id` (integer) - Audit ID

**Response:** `200 OK` or `404 Not Found`

```json
{
  "id": 1,
  "system_name": "Production API Gateway",
  "audit_type": "penetration_test",
  "auditor": "Alice Johnson",
  "audit_date": "2025-01-13T10:00:00.000Z",
  "status": "completed",
  "created_at": "2025-01-13T10:00:00.000Z",
  "updated_at": "2025-01-13T10:00:00.000Z"
}
```

---

### POST /api/audits

Create a new security audit.

**Request Body:**

```json
{
  "system_name": "Customer Database",
  "audit_type": "vulnerability_scan",
  "auditor": "Bob Smith"
}
```

**Required Fields:**
- `system_name` (string)
- `audit_type` (string) - Must be one of: penetration_test, vulnerability_scan, compliance_check, code_review, access_review
- `auditor` (string)

**Response:** `201 Created` or `400 Bad Request`

```json
{
  "id": 2,
  "system_name": "Customer Database",
  "audit_type": "vulnerability_scan",
  "auditor": "Bob Smith",
  "audit_date": "2025-01-15T10:30:00.000Z",
  "status": "in_progress",
  "created_at": "2025-01-15T10:30:00.000Z",
  "updated_at": "2025-01-15T10:30:00.000Z"
}
```

---

### PUT /api/audits/:id

Update an existing audit's status.

**Path Parameters:**
- `id` (integer) - Audit ID

**Request Body:**

```json
{
  "status": "completed"
}
```

**Required Fields:**
- `status` (string) - Must be one of: pending, in_progress, completed

**Response:** `200 OK`, `400 Bad Request`, or `404 Not Found`

```json
{
  "id": 1,
  "system_name": "Production API Gateway",
  "audit_type": "penetration_test",
  "auditor": "Alice Johnson",
  "audit_date": "2025-01-13T10:00:00.000Z",
  "status": "completed",
  "created_at": "2025-01-13T10:00:00.000Z",
  "updated_at": "2025-01-15T10:30:00.000Z"
}
```

---

### DELETE /api/audits/:id

Delete an audit and all associated findings.

**Path Parameters:**
- `id` (integer) - Audit ID

**Response:** `200 OK` or `404 Not Found`

```json
{
  "message": "Audit deleted successfully"
}
```

---

## Finding Endpoints

### GET /api/findings

Retrieve security findings, optionally filtered by severity.

**Query Parameters:**
- `severity` (optional) - Filter by severity level (critical, high, medium, low)

**Examples:**
- `/api/findings` - All findings
- `/api/findings?severity=critical` - Only critical findings

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "audit_id": 1,
    "title": "SQL Injection Vulnerability in Search Endpoint",
    "description": "The /api/search endpoint does not properly sanitize user input...",
    "severity": "critical",
    "status": "resolved",
    "discovered_date": "2025-01-13T10:00:00.000Z",
    "resolved_date": "2025-01-14T15:00:00.000Z",
    "created_at": "2025-01-13T10:00:00.000Z",
    "updated_at": "2025-01-14T15:00:00.000Z",
    "system_name": "Production API Gateway",
    "auditor": "Alice Johnson"
  }
]
```

**Severity Levels:**
- `critical` - Immediate action required
- `high` - Fix as soon as possible
- `medium` - Fix in next sprint
- `low` - Fix when time permits

**Status Values:**
- `open` - Not yet addressed
- `in_progress` - Being worked on
- `resolved` - Fixed and verified
- `false_positive` - Not an actual issue

---

### GET /api/findings/:id

Retrieve a specific finding by ID.

**Path Parameters:**
- `id` (integer) - Finding ID

**Response:** `200 OK` or `404 Not Found`

```json
{
  "id": 1,
  "audit_id": 1,
  "title": "SQL Injection Vulnerability in Search Endpoint",
  "description": "The /api/search endpoint does not properly sanitize user input...",
  "severity": "critical",
  "status": "resolved",
  "discovered_date": "2025-01-13T10:00:00.000Z",
  "resolved_date": "2025-01-14T15:00:00.000Z",
  "created_at": "2025-01-13T10:00:00.000Z",
  "updated_at": "2025-01-14T15:00:00.000Z"
}
```

---

### POST /api/findings

Create a new security finding.

**Request Body:**

```json
{
  "audit_id": 1,
  "title": "Weak Password Policy",
  "description": "Password requirements are insufficient. Minimum length is only 6 characters.",
  "severity": "medium",
  "status": "open"
}
```

**Required Fields:**
- `audit_id` (integer) - Must reference an existing audit
- `title` (string)
- `description` (string)
- `severity` (string) - Must be one of: critical, high, medium, low

**Optional Fields:**
- `status` (string) - Defaults to "open" if not provided

**Response:** `201 Created` or `400 Bad Request`

```json
{
  "id": 10,
  "audit_id": 1,
  "title": "Weak Password Policy",
  "description": "Password requirements are insufficient. Minimum length is only 6 characters.",
  "severity": "medium",
  "status": "open",
  "discovered_date": "2025-01-15T10:30:00.000Z",
  "resolved_date": null,
  "created_at": "2025-01-15T10:30:00.000Z",
  "updated_at": "2025-01-15T10:30:00.000Z"
}
```

---

### PUT /api/findings/:id

Update a finding's status.

**Path Parameters:**
- `id` (integer) - Finding ID

**Request Body:**

```json
{
  "status": "resolved"
}
```

**Required Fields:**
- `status` (string) - Must be one of: open, in_progress, resolved, false_positive

**Response:** `200 OK`, `400 Bad Request`, or `404 Not Found`

```json
{
  "id": 1,
  "audit_id": 1,
  "title": "SQL Injection Vulnerability in Search Endpoint",
  "description": "The /api/search endpoint does not properly sanitize user input...",
  "severity": "critical",
  "status": "resolved",
  "discovered_date": "2025-01-13T10:00:00.000Z",
  "resolved_date": null,
  "created_at": "2025-01-13T10:00:00.000Z",
  "updated_at": "2025-01-15T10:30:00.000Z"
}
```

---

## Statistics Endpoint

### GET /api/stats

Retrieve dashboard statistics.

**Response:** `200 OK`

```json
{
  "totalAudits": 10,
  "criticalFindings": 3,
  "pendingActions": 5,
  "resolvedIssues": 15
}
```

**Fields:**
- `totalAudits` - Total number of audits in the system
- `criticalFindings` - Number of unresolved critical findings
- `pendingActions` - Number of audits with status "in_progress"
- `resolvedIssues` - Number of findings with status "resolved"

---

## Error Examples

### 400 Bad Request - Missing Required Fields

```json
{
  "error": "Missing required fields: system_name, audit_type, auditor"
}
```

### 404 Not Found

```json
{
  "error": "Audit not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to fetch audits"
}
```

### 503 Service Unavailable

```json
{
  "status": "not ready",
  "service": "backend-api",
  "database": "disconnected",
  "error": "Connection failed"
}
```

---

## Testing the API

### Using cURL:

**Get all audits:**
```bash
curl http://localhost:3000/api/audits
```

**Create a new audit:**
```bash
curl -X POST http://localhost:3000/api/audits \
  -H "Content-Type: application/json" \
  -d '{"system_name":"Test System","audit_type":"vulnerability_scan","auditor":"Test User"}'
```

**Get critical findings:**
```bash
curl http://localhost:3000/api/findings?severity=critical
```

### Using the Frontend:

The frontend application provides a user-friendly interface to interact with all these API endpoints.

Access it at: `http://localhost:8080` (or your configured port)

---

## Database Schema Reference

For understanding data relationships, see the database schema:

- **Primary Keys:** All tables have auto-incrementing `id` fields
- **Foreign Keys:** `findings.audit_id` references `audits.id`
- **Cascading Deletes:** Deleting an audit automatically deletes its findings
- **Constraints:** Status and severity values are validated at the database level

---

**API Version:** 1.0
**Last Updated:** January 2025
