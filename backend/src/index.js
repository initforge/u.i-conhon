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

    // Auto-migration: Add soft delete columns to users table
    const db = require('./services/database');
    db.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
    `).then(() => {
        console.log('✅ Database migration: is_deleted columns ready');
    }).catch((migrationError) => {
        console.error('Migration error (non-fatal):', migrationError.message);
    });

    // ================================================
    // Expired Order Cleanup (runs every 60 seconds)
    // Finds pending orders past payment_expires, sets to 'expired',
    // rolls back sold_amount for each order item.
    // ================================================
    const { cache } = require('./services/redis');
    const { cancelPaymentLink } = require('./services/payos');

    setInterval(async () => {
        try {
            const db = require('./services/database');
            const expiredOrders = await db.query(
                `SELECT id, session_id, payment_code FROM orders 
                 WHERE status = 'pending' AND payment_expires < NOW()`
            );

            if (expiredOrders.rows.length === 0) return;

            console.log(`🧹 Cleaning up ${expiredOrders.rows.length} expired orders`);

            for (const order of expiredOrders.rows) {
                const client = await db.getClient();
                try {
                    await client.query('BEGIN');

                    // Lock order row — if webhook already processed it, skip
                    const locked = await client.query(
                        `SELECT id, status, session_id FROM orders WHERE id = $1 FOR UPDATE`,
                        [order.id]
                    );
                    if (locked.rows.length === 0 || locked.rows[0].status !== 'pending') {
                        await client.query('ROLLBACK');
                        continue; // Webhook hoặc user cancel đã xử lý rồi
                    }

                    // Cancel PayOS link (external, non-fatal)
                    if (order.payment_code) {
                        try { await cancelPaymentLink(order.payment_code); } catch (e) {
                            console.warn('Cancel PayOS expired link failed:', e.message);
                        }
                    }

                    await client.query(
                        `UPDATE orders SET status = 'expired' WHERE id = $1`,
                        [order.id]
                    );

                    // Rollback sold_amount within same transaction
                    const itemsResult = await client.query(
                        `SELECT animal_order, subtotal FROM order_items WHERE order_id = $1`,
                        [order.id]
                    );
                    const sessionId = locked.rows[0].session_id;
                    for (const item of itemsResult.rows) {
                        await client.query(
                            `UPDATE session_animals 
                             SET sold_amount = GREATEST(sold_amount - $1, 0)
                             WHERE session_id = $2 AND animal_order = $3`,
                            [item.subtotal, sessionId, item.animal_order]
                        );
                    }

                    await client.query('COMMIT');

                    // Invalidate cache after commit
                    if (sessionId) {
                        await cache.del(`session_animals:${sessionId}`);
                    }
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error('Expire order error:', order.id, err.message);
                } finally {
                    client.release();
                }
            }

            console.log(`✅ Expired ${expiredOrders.rows.length} orders processed`);
        } catch (error) {
            console.error('Expired order cleanup error:', error);
        }
    }, 60 * 1000); // Every 60 seconds
});

module.exports = app;
