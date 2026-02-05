/**
 * Session Routes - Get sessions and animals
 * Theo SPECS.md Section 5.1
 */

const express = require('express');
const db = require('../services/database');
const { authenticate } = require('../middleware/auth');
const { cache } = require('../services/redis');

const router = express.Router();

/**
 * GET /sessions/current - Get current open session for a Thai (SPECS 5.1)
 */
router.get('/current', async (req, res) => {
    try {
        const { thai_id } = req.query;

        if (!thai_id) {
            return res.status(400).json({ error: 'thai_id là bắt buộc' });
        }

        const result = await db.query(
            `SELECT id, thai_id, session_type, session_date, lunar_label,
              status, opens_at, closes_at, result_at
       FROM sessions 
       WHERE thai_id = $1 AND status IN ('open', 'scheduled')
       ORDER BY closes_at ASC
       LIMIT 1`,
            [thai_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Không có phiên nào đang mở',
                message: 'Chưa đến giờ được mua hàng'
            });
        }

        res.json({ session: result.rows[0] });
    } catch (error) {
        console.error('Get current session error:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin phiên' });
    }
});

/**
 * GET /sessions/results - Get lottery results (SPECS 5.x)
 * Query params: thai_id (optional), date (optional), limit (default 10)
 */
router.get('/results', async (req, res) => {
    try {
        const { thai_id, date, limit = 10 } = req.query;
        const params = [];
        let whereClause = "WHERE status = 'completed' AND winning_animal IS NOT NULL";

        if (thai_id) {
            params.push(thai_id);
            whereClause += ` AND thai_id = $${params.length}`;
        }

        if (date) {
            params.push(date);
            whereClause += ` AND session_date = $${params.length}`;
        }

        params.push(parseInt(limit) || 10);

        const result = await db.query(
            `SELECT id, thai_id, session_type, session_date, lunar_label,
               winning_animal, cau_thai, result_at, result_image
             FROM sessions 
             ${whereClause}
             ORDER BY result_at DESC
             LIMIT $${params.length}`,
            params
        );

        res.json({
            results: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ error: 'Không thể lấy kết quả xổ số' });
    }
});

/**
 * GET /sessions/:id/animals - Get animals with limits (SPECS 5.1)
 * Cached with Redis TTL 30s for performance
 */
router.get('/:id/animals', async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `session_animals:${id}`;

        // Try cache first
        const cached = await cache.get(cacheKey);
        if (cached) {
            return res.json({ animals: cached, cached: true });
        }

        const result = await db.query(
            `SELECT animal_order, limit_amount, sold_amount, is_banned, ban_reason,
              (limit_amount - sold_amount) as remaining
       FROM session_animals 
       WHERE session_id = $1
       ORDER BY animal_order ASC`,
            [id]
        );

        // Cache for 30 seconds
        await cache.set(cacheKey, result.rows, 30);

        res.json({ animals: result.rows });
    } catch (error) {
        console.error('Get session animals error:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin con vật' });
    }
});

/**
 * GET /sessions/switches - PUBLIC: Get Thai enabled/disabled status
 * No auth required - used by frontend to check if Thai is open
 * NOTE: This route MUST be defined BEFORE /:id to avoid conflict
 */
router.get('/switches', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT key, value FROM settings 
             WHERE key IN ('master_switch', 'thai_an_nhon_enabled', 'thai_nhon_phong_enabled', 'thai_hoai_nhon_enabled')`
        );

        const switches = {
            master: true,
            'an-nhon': true,
            'nhon-phong': true,
            'hoai-nhon': true
        };

        result.rows.forEach(row => {
            const val = row.value === 'true' || row.value === true;
            if (row.key === 'master_switch') switches.master = val;
            else if (row.key === 'thai_an_nhon_enabled') switches['an-nhon'] = val;
            else if (row.key === 'thai_nhon_phong_enabled') switches['nhon-phong'] = val;
            else if (row.key === 'thai_hoai_nhon_enabled') switches['hoai-nhon'] = val;
        });

        res.json(switches);
    } catch (error) {
        console.error('Get switches error:', error);
        // Return defaults on error (all enabled)
        res.json({
            master: true,
            'an-nhon': true,
            'nhon-phong': true,
            'hoai-nhon': true
        });
    }
});

/**
 * PUT /sessions/switches - ADMIN: Update switches and broadcast to all clients
 * Requires admin auth
 * 
 * IMPORTANT: Each request updates ONLY the switches provided in body.
 * Other switches remain unchanged.
 */
const { broadcast } = require('../services/sse');

router.put('/switches', authenticate, async (req, res) => {
    try {
        // Only admin can update switches
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Chỉ admin mới có quyền thay đổi' });
        }

        const body = req.body;
        console.log('🔧 PUT /switches received body:', JSON.stringify(body));

        // Map API keys to database keys
        const keyMap = {
            'master': 'master_switch',
            'an-nhon': 'thai_an_nhon_enabled',
            'nhon-phong': 'thai_nhon_phong_enabled',
            'hoai-nhon': 'thai_hoai_nhon_enabled'
        };

        // Update ONLY the switches that were provided in the request
        for (const [apiKey, dbKey] of Object.entries(keyMap)) {
            if (body[apiKey] !== undefined) {
                console.log(`🔧 Updating ${dbKey} to ${body[apiKey]}`);
                await db.query(
                    `INSERT INTO settings (key, value) VALUES ($1, $2)
                     ON CONFLICT (key) DO UPDATE SET value = $2`,
                    [dbKey, String(body[apiKey])]
                );
            }
        }

        // Read back ALL current values from database
        const result = await db.query(
            `SELECT key, value FROM settings 
             WHERE key IN ('master_switch', 'thai_an_nhon_enabled', 'thai_nhon_phong_enabled', 'thai_hoai_nhon_enabled')`
        );

        // Build response with actual database values
        const switches = {
            master: true,
            'an-nhon': true,
            'nhon-phong': true,
            'hoai-nhon': true
        };

        result.rows.forEach(row => {
            const val = row.value === 'true' || row.value === true;
            if (row.key === 'master_switch') switches.master = val;
            else if (row.key === 'thai_an_nhon_enabled') switches['an-nhon'] = val;
            else if (row.key === 'thai_nhon_phong_enabled') switches['nhon-phong'] = val;
            else if (row.key === 'thai_hoai_nhon_enabled') switches['hoai-nhon'] = val;
        });

        console.log('🔧 Final switches from DB:', JSON.stringify(switches));

        // 🔥 BROADCAST to all connected clients via SSE
        broadcast('switch_update', switches);

        res.json({ success: true, switches });
    } catch (error) {
        console.error('Update switches error:', error);
        res.status(500).json({ error: 'Không thể cập nhật switches' });
    }
});

/**
 * GET /sessions/:id - Get session details
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT id, thai_id, session_type, session_date, lunar_label,
              status, opens_at, closes_at, result_at,
              winning_animal, cau_thai, cau_thai_image, result_image
       FROM sessions WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Session không tồn tại' });
        }

        res.json({ session: result.rows[0] });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin phiên' });
    }
});

module.exports = router;
