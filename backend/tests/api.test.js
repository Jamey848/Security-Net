/**
 * API Tests for Security Audit Tracker
 * These tests can be run in CI/CD pipeline
 *
 * Students should integrate these into their GitHub Actions workflow
 */

const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../src/database', () => ({
    query: jest.fn(),
    end: jest.fn()
}));

const db = require('../src/database');

// Delay app import until after mocking
const app = require('../src/server');

describe('API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Health Checks', () => {
        test('GET /api/health should return healthy status', async () => {
            const response = await request(app).get('/api/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('healthy');
            expect(response.body.service).toBe('backend-api');
        });

        test('GET /api/ready should return ready when database is connected', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ "?column?": 1 }] });

            const response = await request(app).get('/api/ready');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ready');
            expect(response.body.database).toBe('connected');
        });

        test('GET /api/ready should return not ready when database is disconnected', async () => {
            db.query.mockRejectedValueOnce(new Error('Connection failed'));

            const response = await request(app).get('/api/ready');

            expect(response.status).toBe(503);
            expect(response.body.status).toBe('not ready');
            expect(response.body.database).toBe('disconnected');
        });
    });

    describe('Audits Endpoints', () => {
        test('GET /api/audits should return all audits', async () => {
            const mockAudits = [
                {
                    id: 1,
                    system_name: 'Production API',
                    audit_type: 'penetration_test',
                    auditor: 'John Doe',
                    findings_count: '5',
                    severity_level: 'high'
                }
            ];

            db.query.mockResolvedValueOnce({ rows: mockAudits });

            const response = await request(app).get('/api/audits');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAudits);
        });

        test('GET /api/audits/:id should return a specific audit', async () => {
            const mockAudit = {
                id: 1,
                system_name: 'Production API',
                audit_type: 'penetration_test',
                auditor: 'John Doe'
            };

            db.query.mockResolvedValueOnce({ rows: [mockAudit] });

            const response = await request(app).get('/api/audits/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAudit);
        });

        test('GET /api/audits/:id should return 404 if audit not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app).get('/api/audits/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Audit not found');
        });

        test('POST /api/audits should create a new audit', async () => {
            const newAudit = {
                system_name: 'New System',
                audit_type: 'vulnerability_scan',
                auditor: 'Jane Smith'
            };

            const createdAudit = {
                id: 2,
                ...newAudit,
                status: 'in_progress',
                audit_date: new Date().toISOString()
            };

            db.query.mockResolvedValueOnce({ rows: [createdAudit] });

            const response = await request(app)
                .post('/api/audits')
                .send(newAudit);

            expect(response.status).toBe(201);
            expect(response.body.system_name).toBe(newAudit.system_name);
        });

        test('POST /api/audits should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/audits')
                .send({ system_name: 'Test' }); // Missing audit_type and auditor

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Missing required fields');
        });
    });

    describe('Findings Endpoints', () => {
        test('GET /api/findings should return all findings', async () => {
            const mockFindings = [
                {
                    id: 1,
                    title: 'SQL Injection Vulnerability',
                    severity: 'critical',
                    system_name: 'Production API',
                    auditor: 'John Doe'
                }
            ];

            db.query.mockResolvedValueOnce({ rows: mockFindings });

            const response = await request(app).get('/api/findings');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockFindings);
        });

        test('GET /api/findings should filter by severity', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            const response = await request(app).get('/api/findings?severity=critical');

            expect(response.status).toBe(200);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('WHERE f.severity = $1'),
                ['critical']
            );
        });
    });

    describe('Statistics Endpoint', () => {
        test('GET /api/stats should return dashboard statistics', async () => {
            // Mock multiple database queries
            db.query
                .mockResolvedValueOnce({ rows: [{ count: '10' }] }) // totalAudits
                .mockResolvedValueOnce({ rows: [{ count: '3' }] })  // criticalFindings
                .mockResolvedValueOnce({ rows: [{ count: '5' }] })  // pendingActions
                .mockResolvedValueOnce({ rows: [{ count: '15' }] }); // resolvedIssues

            const response = await request(app).get('/api/stats');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                totalAudits: 10,
                criticalFindings: 3,
                pendingActions: 5,
                resolvedIssues: 15
            });
        });
    });

    describe('Error Handling', () => {
        test('Should return 404 for unknown endpoints', async () => {
            const response = await request(app).get('/api/unknown');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Endpoint not found');
        });
    });
});
