/**
 * CỔ NHƠN BACKEND - Main Entry Point
 * Theo SPECS.md Section 4-7
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Services
const { initRedis } = require('./services/redis');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const sessionRoutes = require('./routes/session');
const orderRoutes = require('./routes/order');
const communityRoutes = require('./routes/community');
const cauThaiRoutes = require('./routes/cau-thai');
const adminRoutes = require('./routes/admin');
const webhookRoutes = require('./routes/webhook');
const thaiRoutes = require('./routes/thais');
const sseRoutes = require('./routes/sse');
const uploadRoutes = require('./routes/upload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy for rate limiting behind nginx
app.set('trust proxy', 1);

// ================================================
// Middleware
// ================================================

// Security
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (SPECS 2.3)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: { error: 'Quá nhiều request. Vui lòng thử lại sau.' }
});
app.use('/api', limiter);

// ================================================
// Health Check
// ================================================
const { isReady: isRedisReady } = require('./services/redis');

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
            redis: isRedisReady() ? 'connected' : 'disconnected'
        }
    });
});

// ================================================
// API Routes (SPECS Section 4-6)
// ================================================

// Auth (SPECS 4.2, 4.3)
app.use('/api/auth', authRoutes);

// User APIs (SPECS 5.1-5.6)
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/cau-thai', cauThaiRoutes);
app.use('/api/thais', thaiRoutes);

// Admin APIs (SPECS 6.1-6.9)
app.use('/api/admin', adminRoutes);

// PayOS Webhook (SPECS 7.3)
app.use('/api/webhook', webhookRoutes);

// SSE - Server-Sent Events for real-time updates
app.use('/api/sse', sseRoutes);

// File Upload (Admin only)
app.use('/api/upload', uploadRoutes);

// Static files - serve uploaded images
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
app.use('/uploads', express.static(UPLOAD_DIR));

// System status (public - for maintenance check)
app.get('/api/system-status', async (req, res) => {
    try {
        const db = require('./services/database');
        const result = await db.query(
            "SELECT value FROM settings WHERE key = 'master_switch'"
        );
        const masterSwitch = result.rows[0]?.value === 'true';

        let maintenanceMessage = null;
        if (!masterSwitch) {
            const msgResult = await db.query(
                "SELECT value FROM settings WHERE key = 'maintenance_message'"
            );
            maintenanceMessage = msgResult.rows[0]?.value?.replace(/"/g, '') || 'Hệ thống đang bảo trì';
        }

        res.json({
            master_switch: masterSwitch,
            maintenance_message: maintenanceMessage
        });
    } catch (error) {
        console.error('System status error:', error);
        res.json({ master_switch: true }); // Default: allow if error
    }
});

// ================================================
// Error Handling
// ================================================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// ================================================
// Start Server
// ================================================
app.listen(PORT, () => {
    console.log(`🚀 Cổ Nhơn Backend running on port ${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);

    // Initialize Redis
    initRedis();
});

module.exports = app;
