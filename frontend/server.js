/**
 * Simple Express server to serve static frontend files
 * This approach keeps the frontend simple while providing production-ready serving
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for Kubernetes readiness/liveness probes
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'frontend',
        timestamp: new Date().toISOString()
    });
});

// Readiness probe endpoint
app.get('/ready', (req, res) => {
    res.status(200).json({
        status: 'ready',
        service: 'frontend',
        timestamp: new Date().toISOString()
    });
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});
