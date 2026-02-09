/**
 * Database Service - PostgreSQL Connection
 * Theo SPECS.md Section 3
 */

require('dotenv').config();
const { Pool, types } = require('pg');

// Override DATE type parser (OID 1082) to return raw string 'YYYY-MM-DD'
// instead of JS Date object which causes timezone shift in JSON serialization
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL only for external production (Heroku, etc), not for Docker internal network
    ssl: false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('✅ Database connected');
});

pool.on('error', (err) => {
    console.error('❌ Database error:', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(),
    pool
};
