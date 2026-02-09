/**
 * Session Routes - Get sessions and animals
 * Theo SPECS.md Section 5.1
 */

const express = require('express');
const db = require('../services/database');
const { authenticate } = require('../middleware/auth');
const { cache } = require('../services/redis');

const router = express.Router();

// Session type mapping: slot index -> session_type value in DB
const SLOT_SESSION_TYPES = ['morning', 'afternoon', 'evening'];

// Default time slots (fallback if DB has no thai_configs)
const DEFAULT_TIME_SLOTS = {
    'thai-an-nhon': {
        timeSlots: [
            { startTime: '07:00', endTime: '10:30' },
            { startTime: '12:00', endTime: '16:30' },
        ],
        tetTimeSlot: { startTime: '18:00', endTime: '20:30' },
    },
    'thai-nhon-phong': {
        timeSlots: [
            { startTime: '07:00', endTime: '10:30' },
            { startTime: '12:00', endTime: '16:30' },
        ],
    },
    'thai-hoai-nhon': {
        timeSlots: [
            { startTime: '09:00', endTime: '12:30' },
            { startTime: '14:00', endTime: '18:30' },
        ],
    },
};

/**
 * Determine which session_type matches the current time for a Thai.
 * Reads timeSlots from DB (admin-configurable), falls back to defaults.
 * Returns the session_type string ('morning', 'afternoon', 'evening') or null.
 */
async function getCurrentSessionType(thaiId) {
    // Get current time in Vietnam timezone (UTC+7)
    const now = new Date();
    const vnTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const currentTime = `${vnTime.getHours().toString().padStart(2, '0')}:${vnTime.getMinutes().toString().padStart(2, '0')}`;

    // Try to read ThaiConfig from DB (synced with admin UI)
    let thaiConfig = null;
    try {
        const configResult = await db.query(
            "SELECT value FROM settings WHERE key = 'thai_configs'"
        );
        if (configResult.rows.length > 0) {
            const thais = configResult.rows[0].value;
            thaiConfig = thais.find(t => t.id === thaiId);
        }
    } catch (err) {
        console.warn('Could not read thai_configs from DB, using defaults:', err.message);
    }

    // Build effective time slots
    const defaults = DEFAULT_TIME_SLOTS[thaiId] || DEFAULT_TIME_SLOTS['thai-an-nhon'];
    const timeSlots = thaiConfig?.timeSlots || defaults.timeSlots;
    const isTetMode = thaiConfig?.isTetMode || false;
    const tetTimeSlot = thaiConfig?.tetTimeSlot || defaults.tetTimeSlot;

    // First 2 slots (Sáng + Chiều) are always active
    const effectiveSlots = timeSlots.slice(0, 2);

    // Slot 3 (Tối) only active during Tết mode
    if (isTetMode && tetTimeSlot) {
        effectiveSlots.push(tetTimeSlot);
    }

    // Check which slot the current time falls into
    for (let i = 0; i < effectiveSlots.length; i++) {
        const slot = effectiveSlots[i];
        if (currentTime >= slot.startTime && currentTime < slot.endTime) {
            return SLOT_SESSION_TYPES[i]; // 'morning', 'afternoon', or 'evening'
        }
    }

    return null; // Not in any buying window
}

/**
 * GET /sessions/current - Get current open session for a Thai (SPECS 5.1)
 * Auto-creates session if none exists for current time slot.
 */
router.get('/current', async (req, res) => {
    try {
        let { thai_id } = req.query;

        if (!thai_id) {
            return res.status(400).json({ error: 'thai_id là bắt buộc' });
        }

        // Normalize: 'an-nhon' -> 'thai-an-nhon'
        thai_id = thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`;

        // Determine which session_type matches current time
        const currentSessionType = await getCurrentSessionType(thai_id);

        if (!currentSessionType) {
            return res.status(404).json({
                error: 'Không có phiên nào đang mở',
                message: 'Hiện không trong khung giờ mua hàng'
            });
        }

        let result = await db.query(
            `SELECT id, thai_id, session_type, session_date,
              status, created_at
       FROM sessions 
       WHERE thai_id = $1 AND status IN ('open', 'scheduled')
         AND session_date = CURRENT_DATE
         AND session_type = $2
       LIMIT 1`,
            [thai_id, currentSessionType]
        );

        // Auto-create session if none exists (lazy creation)
        if (result.rows.length === 0) {
            console.log(`🔄 Auto-creating session: ${thai_id} / ${currentSessionType} / today`);
            const animalCount = thai_id === 'thai-hoai-nhon' ? 36 : 40;

            const client = await db.getClient();
            try {
                await client.query('BEGIN');

                // Insert session (ON CONFLICT DO NOTHING for race condition safety)
                const insertResult = await client.query(
                    `INSERT INTO sessions (id, thai_id, session_type, session_date, status, created_at)
                     VALUES (gen_random_uuid(), $1, $2, CURRENT_DATE, 'open', NOW())
                     ON CONFLICT (thai_id, session_date, session_type) DO NOTHING
                     RETURNING id`,
                    [thai_id, currentSessionType]
                );

                if (insertResult.rows.length > 0) {
                    const newSessionId = insertResult.rows[0].id;
                    // Auto-populate session_animals with default limits
                    await client.query(
                        `INSERT INTO session_animals (session_id, animal_order)
                         SELECT $1, generate_series(1, $2)`,
                        [newSessionId, animalCount]
                    );
                    console.log(`✅ Session auto-created: ${newSessionId} (${animalCount} animals)`);
                }

                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                console.error('Auto-create session error:', err);
            } finally {
                client.release();
            }

            // Re-query to get the session (either just created or created by another request)
            result = await db.query(
                `SELECT id, thai_id, session_type, session_date,
                  status, created_at
           FROM sessions 
           WHERE thai_id = $1 AND status IN ('open', 'scheduled')
             AND session_date = CURRENT_DATE
             AND session_type = $2
           LIMIT 1`,
                [thai_id, currentSessionType]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Không có phiên nào đang mở',
                message: 'Không thể tạo phiên. Vui lòng thử lại.'
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
 * Query params: thai_id (optional), date (optional), year (optional), limit (default 10)
 * IMPORTANT: Only returns results where draw_time has passed (hide early results)
 */
router.get('/results', async (req, res) => {
    try {
        const { thai_id, date, year, limit = 10 } = req.query;
        const params = [];
        // Include all resulted sessions; pending ones get winning_animal masked
        let whereClause = "WHERE status = 'resulted'";

        if (thai_id) {
            // Normalize thai_id: 'an-nhon' -> 'thai-an-nhon'
            const normalizedThaiId = thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`;
            params.push(normalizedThaiId);
            whereClause += ` AND thai_id = $${params.length}`;
        }

        if (date) {
            params.push(date);
            whereClause += ` AND session_date = $${params.length}`;
        }

        if (year) {
            params.push(parseInt(year));
            whereClause += ` AND EXTRACT(YEAR FROM session_date) = $${params.length}`;
        }

        params.push(parseInt(limit) || 10);

        const result = await db.query(
            `SELECT id, thai_id, session_type, session_date,
               CASE WHEN draw_time IS NULL OR draw_time <= (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')
                    THEN winning_animal ELSE NULL END as winning_animal,
               CASE WHEN draw_time IS NOT NULL AND draw_time > (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')
                    THEN true ELSE false END as pending,
               draw_time, cau_thai, created_at
             FROM sessions 
             ${whereClause}
             ORDER BY session_date DESC, created_at DESC
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
            `SELECT id, thai_id, session_type, session_date,
              status, winning_animal, cau_thai, created_at
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
module.exports.getCurrentSessionType = getCurrentSessionType;
