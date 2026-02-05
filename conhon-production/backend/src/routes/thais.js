/**
 * Thai Config Routes - Dynamic Thai configuration management
 * Allows admin to update timeSlots and sync across all pages
 */

const express = require('express');
const db = require('../services/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { broadcast } = require('../services/sse');

const router = express.Router();

// ================================================
// PUBLIC: Get Thai configs (for all users)
// ================================================

/**
 * GET /api/thais - Get all Thai configurations
 * Public endpoint - no auth required
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT value FROM settings WHERE key = 'thai_configs'"
        );

        if (result.rows.length === 0) {
            // Return default configs if not in DB yet
            return res.json({
                thais: [
                    {
                        id: 'thai-an-nhon',
                        name: 'Thai An Nhơn',
                        slug: 'an-nhon',
                        times: ['11:00', '17:00', '21:00'],
                        timeSlots: [
                            { startTime: '07:00', endTime: '10:30' },
                            { startTime: '12:00', endTime: '16:30' }
                        ],
                        tetTimeSlot: { startTime: '18:00', endTime: '20:30' },
                        isTetMode: false,
                        description: 'Khu vực An Nhơn - Bình Định',
                        isOpen: true
                    },
                    {
                        id: 'thai-nhon-phong',
                        name: 'Thai Nhơn Phong',
                        slug: 'nhon-phong',
                        times: ['11:00', '17:00'],
                        timeSlots: [
                            { startTime: '07:00', endTime: '10:30' },
                            { startTime: '12:00', endTime: '16:30' }
                        ],
                        isTetMode: false,
                        description: 'Khu vực Nhơn Phong',
                        isOpen: true
                    },
                    {
                        id: 'thai-hoai-nhon',
                        name: 'Thai Hoài Nhơn',
                        slug: 'hoai-nhon',
                        times: ['13:00', '19:00'],
                        timeSlots: [
                            { startTime: '09:00', endTime: '12:30' },
                            { startTime: '14:00', endTime: '18:30' }
                        ],
                        isTetMode: false,
                        description: 'Khu vực Hoài Nhơn',
                        isOpen: true
                    }
                ]
            });
        }

        res.json({ thais: result.rows[0].value });
    } catch (error) {
        console.error('Get thai configs error:', error);
        res.status(500).json({ error: 'Không thể lấy cấu hình Thai' });
    }
});

// ================================================
// ADMIN: Update Thai configs
// ================================================

/**
 * PUT /api/thais/:id - Update a specific Thai's config
 * Admin only - updates timeSlots, isTetMode, isOpen, etc.
 */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Get current configs
        const result = await db.query(
            "SELECT value FROM settings WHERE key = 'thai_configs'"
        );

        let thais = result.rows[0]?.value || [];

        // Find and update the specific Thai
        const thaiIndex = thais.findIndex(t => t.id === id);
        if (thaiIndex === -1) {
            return res.status(404).json({ error: 'Thai không tồn tại' });
        }

        // Merge updates
        thais[thaiIndex] = { ...thais[thaiIndex], ...updates };

        // Save back to DB
        await db.query(
            `INSERT INTO settings (key, value, updated_at) 
             VALUES ('thai_configs', $1::jsonb, NOW())
             ON CONFLICT (key) DO UPDATE SET value = $1::jsonb, updated_at = NOW()`,
            [JSON.stringify(thais)]
        );

        res.json({
            success: true,
            thai: thais[thaiIndex],
            thais: thais
        });

        // 🔥 BROADCAST to all connected clients via SSE
        broadcast('thai_config_update', { thais });
    } catch (error) {
        console.error('Update thai config error:', error);
        res.status(500).json({ error: 'Không thể cập nhật cấu hình' });
    }
});

/**
 * PUT /api/thais - Update all Thai configs at once
 * Admin only
 */
router.put('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { thais } = req.body;

        if (!Array.isArray(thais)) {
            return res.status(400).json({ error: 'Invalid thais format' });
        }

        // Save to DB
        await db.query(
            `INSERT INTO settings (key, value, updated_at) 
             VALUES ('thai_configs', $1::jsonb, NOW())
             ON CONFLICT (key) DO UPDATE SET value = $1::jsonb, updated_at = NOW()`,
            [JSON.stringify(thais)]
        );

        res.json({ success: true, thais });

        // 🔥 BROADCAST to all connected clients via SSE
        broadcast('thai_config_update', { thais });
    } catch (error) {
        console.error('Update all thai configs error:', error);
        res.status(500).json({ error: 'Không thể cập nhật cấu hình' });
    }
});

module.exports = router;
