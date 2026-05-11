/**
 * Security Audit Tracker - Backend API Server
 * DevOps Exam 2025
 *
 * This is the main entry point for the backend API.
 * Students should NOT need to modify this file - they only need to containerize it.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(morgan('combined')); // HTTP request logging

// Health check endpoint (important for Kubernetes probes)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'backend-api',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Readiness probe endpoint (checks database connection)
app.get('/api/ready', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({
            status: 'ready',
            service: 'backend-api',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'not ready',
            service: 'backend-api',
            database: 'disconnected',
            error: error.message
        });
    }
});

// ============================================================================
// API ENDPOINTS - Security Audits
// ============================================================================

/**
 * GET /api/audits
 * Retrieve all security audits
 */
app.get('/api/audits', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                a.*,
                COUNT(f.id) as findings_count,
                MAX(f.severity) as severity_level
            FROM audits a
            LEFT JOIN findings f ON a.id = f.audit_id
            GROUP BY a.id
            ORDER BY a.audit_date DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching audits:', error);
        res.status(500).json({ error: 'Failed to fetch audits' });
    }
});

/**
 * GET /api/audits/:id
 * Retrieve a specific audit by ID
 */
app.get('/api/audits/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM audits WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching audit:', error);
        res.status(500).json({ error: 'Failed to fetch audit' });
    }
});

/**
 * POST /api/audits
 * Create a new security audit
 */
app.post('/api/audits', async (req, res) => {
    try {
        const { system_name, audit_type, auditor } = req.body;

        // Validation
        if (!system_name || !audit_type || !auditor) {
            return res.status(400).json({
                error: 'Missing required fields: system_name, audit_type, auditor'
            });
        }

        const result = await db.query(
            `INSERT INTO audits (system_name, audit_type, auditor, audit_date, status)
             VALUES ($1, $2, $3, NOW(), 'in_progress')
             RETURNING *`,
            [system_name, audit_type, auditor]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating audit:', error);
        res.status(500).json({ error: 'Failed to create audit' });
    }
});

/**
 * PUT /api/audits/:id
 * Update an existing audit
 */
app.put('/api/audits/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const result = await db.query(
            'UPDATE audits SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating audit:', error);
        res.status(500).json({ error: 'Failed to update audit' });
    }
});

/**
 * DELETE /api/audits/:id
 * Delete an audit
 */
app.delete('/api/audits/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // First delete associated findings
        await db.query('DELETE FROM findings WHERE audit_id = $1', [id]);

        // Then delete the audit
        const result = await db.query('DELETE FROM audits WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Audit not found' });
        }

        res.json({ message: 'Audit deleted successfully' });
    } catch (error) {
        console.error('Error deleting audit:', error);
        res.status(500).json({ error: 'Failed to delete audit' });
    }
});

// ============================================================================
// API ENDPOINTS - Security Findings
// ============================================================================

/**
 * GET /api/findings
 * Retrieve security findings (optionally filtered by severity)
 */
app.get('/api/findings', async (req, res) => {
    try {
        const { severity } = req.query;

        let query = `
            SELECT
                f.*,
                a.system_name,
                a.auditor
            FROM findings f
            JOIN audits a ON f.audit_id = a.id
        `;

        const params = [];

        if (severity) {
            query += ' WHERE f.severity = $1';
            params.push(severity);
        }

        query += ' ORDER BY f.discovered_date DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching findings:', error);
        res.status(500).json({ error: 'Failed to fetch findings' });
    }
});

/**
 * GET /api/findings/:id
 * Retrieve a specific finding by ID
 */
app.get('/api/findings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM findings WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Finding not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching finding:', error);
        res.status(500).json({ error: 'Failed to fetch finding' });
    }
});

/**
 * POST /api/findings
 * Create a new security finding
 */
app.post('/api/findings', async (req, res) => {
    try {
        const { audit_id, title, description, severity, status } = req.body;

        // Validation
        if (!audit_id || !title || !description || !severity) {
            return res.status(400).json({
                error: 'Missing required fields: audit_id, title, description, severity'
            });
        }

        const result = await db.query(
            `INSERT INTO findings (audit_id, title, description, severity, status, discovered_date)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING *`,
            [audit_id, title, description, severity, status || 'open']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating finding:', error);
        res.status(500).json({ error: 'Failed to create finding' });
    }
});

/**
 * PUT /api/findings/:id
 * Update a finding's status
 */
app.put('/api/findings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const result = await db.query(
            'UPDATE findings SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Finding not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating finding:', error);
        res.status(500).json({ error: 'Failed to update finding' });
    }
});

// ============================================================================
// API ENDPOINTS - Statistics
// ============================================================================

/**
 * GET /api/stats
 * Retrieve dashboard statistics
 */
app.get('/api/stats', async (req, res) => {
    try {
        // Total audits
        const auditsResult = await db.query('SELECT COUNT(*) as count FROM audits');
        const totalAudits = parseInt(auditsResult.rows[0].count);

        // Critical findings
        const criticalResult = await db.query(
            "SELECT COUNT(*) as count FROM findings WHERE severity = 'critical' AND status != 'resolved'"
        );
        const criticalFindings = parseInt(criticalResult.rows[0].count);

        // Pending actions (in_progress audits)
        const pendingResult = await db.query(
            "SELECT COUNT(*) as count FROM audits WHERE status = 'in_progress'"
        );
        const pendingActions = parseInt(pendingResult.rows[0].count);

        // Resolved issues
        const resolvedResult = await db.query(
            "SELECT COUNT(*) as count FROM findings WHERE status = 'resolved'"
        );
        const resolvedIssues = parseInt(resolvedResult.rows[0].count);

        res.json({
            totalAudits,
            criticalFindings,
            pendingActions,
            resolvedIssues
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================================================
// Server Startup
// ============================================================================

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        await db.query('SELECT NOW()');
        console.log('Database connection established');

        // Start listening
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Backend API server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await db.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await db.end();
    process.exit(0);
});

// Start the server
if (require.main === module) {
    startServer();
}

// Export for testing
module.exports = app;