/**
 * Database connection module
 * Uses PostgreSQL with the pg library
 *
 * Configuration is loaded from environment variables (set in .env or container environment)
 */

const { Pool } = require('pg');

// Create a connection pool
// Students will configure these via environment variables in their containers
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'security_audit_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Log pool errors
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

// Export query method for easier use
module.exports = {
    query: (text, params) => pool.query(text, params),
    end: () => pool.end()
};
