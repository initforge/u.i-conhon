/**
 * Admin Routes - Dashboard, Orders, Sessions, Settings
 * Theo SPECS.md Section 6
 */

const express = require('express');
const db = require('../services/database');
const { authenticate, requireAdmin, invalidateUserCache } = require('../middleware/auth');

const router = express.Router();

// Helper: Normalize session_type from Vietnamese to English (DB format)
// Frontend may send 'sang'/'chieu'/'toi' but DB stores 'morning'/'afternoon'/'evening'
const normalizeSessionType = (type) => {
    const map = { 'sang': 'morning', 'chieu': 'afternoon', 'toi': 'evening' };
    return map[type] || type;
};

// Helper: Convert English session_type to Vietnamese key (for profit-loss response)
const sessionTypeToVietnamese = (type) => {
    const map = { 'morning': 'sang', 'afternoon': 'chieu', 'evening': 'toi' };
    return map[type] || type;
};

// All admin routes require admin role
router.use(authenticate, requireAdmin);

// ================================================
// 6.1 Dashboard Stats
// ================================================

/**
 * GET /admin/stats - Dashboard statistics (SPECS 6.1)
 * Now properly filters by thai_id, session_type, date
 */
router.get('/stats', async (req, res) => {
    try {
        const { thai_id, session_type, date } = req.query;

        // Build dynamic filter for session-based queries
        const sessionFilters = [];
        const sessionParams = [];
        let pIdx = 1;

        if (thai_id) {
            // Support both 'an-nhon' (slug) and 'thai-an-nhon' (id) formats
            const normalizedId = thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`;
            sessionFilters.push(`s.thai_id = $${pIdx}`);
            sessionParams.push(normalizedId);
            pIdx++;
        }
        if (session_type && session_type !== 'all') {
            sessionFilters.push(`s.session_type = $${pIdx}`);
            sessionParams.push(normalizeSessionType(session_type));
            pIdx++;
        }
        if (date) {
            sessionFilters.push(`s.session_date = $${pIdx}`);
            sessionParams.push(date);
            pIdx++;
        }

        const sessionWhereClause = sessionFilters.length > 0
            ? 'AND ' + sessionFilters.join(' AND ')
            : '';

        // Revenue today (filtered by thai/session if specified)
        const revenueResult = await db.query(
            `SELECT COALESCE(SUM(o.total), 0) as revenue
             FROM orders o
             JOIN sessions s ON o.session_id = s.id
             WHERE o.paid_at::date = CURRENT_DATE
               AND o.status IN ('paid', 'won', 'lost')
               ${sessionWhereClause}`,
            sessionParams
        );

        // Total orders all time (filtered)
        const totalOrdersResult = await db.query(
            `SELECT COUNT(*) as total
             FROM orders o
             JOIN sessions s ON o.session_id = s.id
             WHERE o.status IN ('paid', 'won', 'lost')
               ${sessionWhereClause}`,
            sessionParams
        );

        // Orders today (filtered) - only successful orders
        const todayOrdersResult = await db.query(
            `SELECT COUNT(*) as total
             FROM orders o
             JOIN sessions s ON o.session_id = s.id
             WHERE o.created_at::date = CURRENT_DATE
               AND o.status IN ('paid', 'won', 'lost')
               ${sessionWhereClause}`,
            sessionParams
        );

        // Top 5 animals (most bought by amount, filtered)
        const topAnimalsResult = await db.query(
            `SELECT oi.animal_order, SUM(oi.quantity)::int as total_qty, SUM(oi.subtotal)::int as total_amount
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN sessions s ON o.session_id = s.id
             WHERE o.status IN ('paid', 'won', 'lost')
               ${sessionWhereClause}
             GROUP BY oi.animal_order ORDER BY total_amount DESC LIMIT 5`,
            sessionParams
        );

        // Bottom 5 animals (least bought by amount, filtered)
        const bottomAnimalsResult = await db.query(
            `SELECT oi.animal_order, SUM(oi.quantity)::int as total_qty, SUM(oi.subtotal)::int as total_amount
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN sessions s ON o.session_id = s.id
             WHERE o.status IN ('paid', 'won', 'lost')
               ${sessionWhereClause}
             GROUP BY oi.animal_order ORDER BY total_amount ASC LIMIT 5`,
            sessionParams
        );

        res.json({
            revenue_today: parseInt(revenueResult.rows[0].revenue),
            total_orders: parseInt(totalOrdersResult.rows[0].total),
            orders_today: parseInt(todayOrdersResult.rows[0].total),
            top_animals: topAnimalsResult.rows,
            bottom_animals: bottomAnimalsResult.rows
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Không thể lấy thống kê' });
    }
});

/**
 * GET /admin/stats/animals-all - All animals purchase data for BaoCao grid
 * Returns ALL animals (not just top/bottom 5)
 */
router.get('/stats/animals-all', async (req, res) => {
    try {
        const { thai_id, session_type, date } = req.query;

        // Build dynamic filter
        const filters = [];
        const params = [];
        let pIdx = 1;

        if (thai_id) {
            const normalizedId = thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`;
            filters.push(`s.thai_id = $${pIdx}`);
            params.push(normalizedId);
            pIdx++;
        }
        if (session_type && session_type !== 'all') {
            filters.push(`s.session_type = $${pIdx}`);
            params.push(normalizeSessionType(session_type));
            pIdx++;
        }
        if (date) {
            filters.push(`s.session_date = $${pIdx}`);
            params.push(date);
            pIdx++;
        }

        const whereClause = filters.length > 0
            ? 'AND ' + filters.join(' AND ')
            : '';

        const result = await db.query(
            `SELECT oi.animal_order,
                    SUM(oi.quantity)::int as total_qty,
                    SUM(oi.subtotal)::int as total_amount
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN sessions s ON o.session_id = s.id
             WHERE o.status IN ('paid', 'won', 'lost')
               ${whereClause}
             GROUP BY oi.animal_order
             ORDER BY oi.animal_order ASC`,
            params
        );

        res.json({
            animals: result.rows
        });
    } catch (error) {
        console.error('Admin stats animals-all error:', error);
        res.status(500).json({ error: 'Không thể lấy thống kê con vật' });
    }
});

/**
 * GET /admin/stats/animal-orders - Orders for a specific animal (Phase 5)
 * Query: animal_order (required), thai_id, session_type, date
 */
router.get('/stats/animal-orders', async (req, res) => {
    try {
        const { animal_order, thai_id, session_type, date } = req.query;

        if (!animal_order) {
            return res.status(400).json({ error: 'animal_order is required' });
        }

        const filters = [];
        const params = [parseInt(animal_order)];
        let pIdx = 2;

        if (thai_id) {
            const normalizedId = thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`;
            filters.push(`s.thai_id = $${pIdx}`);
            params.push(normalizedId);
            pIdx++;
        }
        if (session_type && session_type !== 'all') {
            filters.push(`s.session_type = $${pIdx}`);
            params.push(normalizeSessionType(session_type));
            pIdx++;
        }
        if (date) {
            filters.push(`s.session_date = $${pIdx}`);
            params.push(date);
            pIdx++;
        }

        const whereClause = filters.length > 0
            ? 'AND ' + filters.join(' AND ')
            : '';

        const result = await db.query(
            `SELECT o.id as order_id,
                    u.name as user_name,
                    u.phone as user_phone,
                    oi.quantity,
                    oi.unit_price,
                    oi.subtotal,
                    o.status,
                    s.session_type,
                    s.session_date,
                    o.created_at
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN sessions s ON o.session_id = s.id
             JOIN users u ON o.user_id = u.id
             WHERE oi.animal_order = $1
               AND o.status IN ('paid', 'won', 'lost')
               ${whereClause}
             ORDER BY o.created_at DESC
             LIMIT 50`,
            params
        );

        res.json({ orders: result.rows });
    } catch (error) {
        console.error('Admin animal orders error:', error);
        res.status(500).json({ error: 'Không thể lấy đơn hàng con vật' });
    }
});


// ================================================
// 6.2 Session Animals Management
// ================================================

/**
 * GET /admin/sessions - List sessions with filters
 */
router.get('/sessions', async (req, res) => {
    try {
        const { thai_id, date, status, limit = 20 } = req.query;
        const params = [];
        let whereClause = 'WHERE 1=1';
        let paramIndex = 1;

        if (thai_id) {
            whereClause += ` AND thai_id = $${paramIndex}`;
            params.push(thai_id);
            paramIndex++;
        }

        if (date) {
            whereClause += ` AND session_date = $${paramIndex}`;
            params.push(date);
            paramIndex++;
        }

        if (status) {
            whereClause += ` AND status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        params.push(parseInt(limit));
        const result = await db.query(
            `SELECT id, thai_id, session_type, session_date, status, 
                    winning_animal, created_at
             FROM sessions 
             ${whereClause}
             ORDER BY session_date DESC, created_at DESC
             LIMIT $${paramIndex}`,
            params
        );

        res.json({ sessions: result.rows });
    } catch (error) {
        console.error('Get admin sessions error:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách phiên' });
    }
});

/**
 * GET /admin/sessions/current/:thai_id - Current session for Thai (SPECS 6.2)
 * Accepts ?khung=0|1|2 to specify which session_type (morning/afternoon/evening).
 * Auto-creates session if none exists. Admin can access at any time.
 */
router.get('/sessions/current/:thai_id', async (req, res) => {
    try {
        const { thai_id } = req.params;
        const { khung } = req.query;

        // Map khung index to session_type
        const SLOT_SESSION_TYPES = ['morning', 'afternoon', 'evening'];
        let sessionType;
        let sessionDate;

        // Always use getCurrentSessionType for cross-day awareness
        const { getCurrentSessionType } = require('./session');

        if (khung !== undefined && khung !== null) {
            const khungIdx = parseInt(khung);
            sessionType = SLOT_SESSION_TYPES[khungIdx] || 'morning';

            // Use getCurrentSessionType to get correct date (handles cross-day slots)
            // e.g. morning slot 17:30→10:30: at 00:24 on Feb 11, session belongs to Feb 10
            const sessionInfo = await getCurrentSessionType(thai_id);
            if (sessionInfo && sessionInfo.sessionType === sessionType) {
                // Current time is in the requested slot → use its date (may be yesterday for cross-day)
                sessionDate = sessionInfo.sessionDate;
            } else {
                // Admin picked a slot that is NOT the current active one → use today
                const now = new Date();
                const vnTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
                sessionDate = `${vnTime.getFullYear()}-${String(vnTime.getMonth() + 1).padStart(2, '0')}-${String(vnTime.getDate()).padStart(2, '0')}`;
            }
        } else {
            // Fallback: auto-detect from current time
            const sessionInfo = await getCurrentSessionType(thai_id);
            if (!sessionInfo) {
                sessionType = 'morning';
                const now = new Date();
                const vnTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
                sessionDate = `${vnTime.getFullYear()}-${String(vnTime.getMonth() + 1).padStart(2, '0')}-${String(vnTime.getDate()).padStart(2, '0')}`;
            } else {
                sessionType = sessionInfo.sessionType;
                sessionDate = sessionInfo.sessionDate;
            }
        }

        // Query for existing session of this type on sessionDate (ANY status - admin can access anytime)
        // FIX: Use sa.sold_amount directly (same source as order.js limit check)
        // This ensures admin panel shows the SAME remaining quota as what customers see
        let result = await db.query(
            `SELECT s.*, 
              json_agg(json_build_object(
                'animal_order', sa.animal_order,
                'limit_amount', sa.limit_amount,
                'sold_amount', sa.sold_amount,
                'is_banned', sa.is_banned,
                'ban_reason', sa.ban_reason
              ) ORDER BY sa.animal_order) as animals
       FROM sessions s
       LEFT JOIN session_animals sa ON s.id = sa.session_id
       WHERE s.thai_id = $1
         AND s.session_date = $3 AND s.session_type = $2
       GROUP BY s.id
       LIMIT 1`,
            [thai_id, sessionType, sessionDate]
        );

        // Auto-create session if none exists
        if (result.rows.length === 0) {
            console.log(`🔄 Admin: Auto-creating session: ${thai_id} / ${sessionType} / ${sessionDate}`);
            const animalCount = thai_id === 'thai-hoai-nhon' ? 36 : 40;

            const client = await db.getClient();
            try {
                await client.query('BEGIN');
                const insertResult = await client.query(
                    `INSERT INTO sessions (id, thai_id, session_type, session_date, status, created_at)
                     VALUES (gen_random_uuid(), $1, $2, $3, 'open', NOW())
                     ON CONFLICT (thai_id, session_date, session_type) DO NOTHING
                     RETURNING id`,
                    [thai_id, sessionType, sessionDate]
                );

                if (insertResult.rows.length > 0) {
                    const newSessionId = insertResult.rows[0].id;
                    await client.query(
                        `INSERT INTO session_animals (session_id, animal_order)
                         SELECT $1, generate_series(1, $2)`,
                        [newSessionId, animalCount]
                    );
                    console.log(`✅ Admin session auto-created: ${newSessionId} (${animalCount} animals)`);
                }
                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                console.error('Admin auto-create session error:', err);
            } finally {
                client.release();
            }

            // Re-query
            result = await db.query(
                `SELECT s.*, 
                  json_agg(json_build_object(
                    'animal_order', sa.animal_order,
                    'limit_amount', sa.limit_amount,
                    'sold_amount', 0,
                    'is_banned', sa.is_banned,
                    'ban_reason', sa.ban_reason
                  ) ORDER BY sa.animal_order) as animals
               FROM sessions s
               LEFT JOIN session_animals sa ON s.id = sa.session_id
               WHERE s.thai_id = $1
                 AND s.session_date = $3 AND s.session_type = $2
               GROUP BY s.id
               LIMIT 1`,
                [thai_id, sessionType, sessionDate]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không thể tạo phiên' });
        }

        res.json({ session: result.rows[0] });
    } catch (error) {
        console.error('Get current session error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});


/**
 * PATCH /admin/session-animals - Update animal limits/ban (SPECS 6.2)
 */
router.patch('/session-animals', async (req, res) => {
    try {
        const { session_id, animal_order, limit_amount, is_banned, ban_reason } = req.body;

        await db.query(
            `UPDATE session_animals 
       SET limit_amount = COALESCE($1, limit_amount),
           is_banned = COALESCE($2, is_banned),
           ban_reason = COALESCE($3, ban_reason)
       WHERE session_id = $4 AND animal_order = $5`,
            [limit_amount, is_banned, ban_reason, session_id, animal_order]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update animal error:', error);
        res.status(500).json({ error: 'Không thể cập nhật' });
    }
});

// ================================================
// 6.3 Orders Management  
// ================================================

/**
 * GET /admin/orders - List orders with filters (SPECS 6.3)
 */
router.get('/orders', async (req, res) => {
    try {
        const { date, thai_id, session_type, status, page = 1, limit = 50 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let baseWhere = 'WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (date) {
            baseWhere += ` AND s.session_date = $${paramIndex}`;
            params.push(date);
            paramIndex++;
        }

        if (thai_id) {
            baseWhere += ` AND s.thai_id = $${paramIndex}`;
            params.push(thai_id);
            paramIndex++;
        }

        if (session_type) {
            baseWhere += ` AND s.session_type = $${paramIndex}`;
            params.push(normalizeSessionType(session_type));
            paramIndex++;
        }

        if (status) {
            baseWhere += ` AND o.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM orders o
             JOIN sessions s ON o.session_id = s.id
             ${baseWhere}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data
        const dataParams = [...params, parseInt(limit), offset];
        const result = await db.query(
            `SELECT o.id, o.total, o.status, o.created_at, o.paid_at,
                    u.name as user_name, u.phone as user_phone,
                    s.thai_id, s.session_type, s.session_date
             FROM orders o
             JOIN users u ON o.user_id = u.id
             JOIN sessions s ON o.session_id = s.id
             ${baseWhere}
             ORDER BY o.created_at DESC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            dataParams
        );

        res.json({
            orders: result.rows,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: offset + result.rows.length < total
        });
    } catch (error) {
        console.error('Admin orders error:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách' });
    }
});


/**
 * GET /admin/orders/:id - Order details (SPECS 6.3)
 */
router.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const orderResult = await db.query(
            `SELECT o.*, 
              u.name as user_name, u.phone as user_phone, u.zalo,
              u.bank_code, u.bank_account, u.bank_holder,
              s.thai_id, s.session_type, s.session_date
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN sessions s ON o.session_id = s.id
       WHERE o.id = $1`,
            [id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
        }

        const itemsResult = await db.query(
            'SELECT * FROM order_items WHERE order_id = $1',
            [id]
        );

        res.json({
            order: orderResult.rows[0],
            items: itemsResult.rows
        });
    } catch (error) {
        console.error('Admin order detail error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

/**
 * PATCH /admin/orders/:id - Update order status
 */
router.patch('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            [status, id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ error: 'Không thể cập nhật' });
    }
});

// ================================================
// 6.4 Results Management
// ================================================

/**
 * GET /admin/sessions/results - Get lottery results history
 */
router.get('/sessions/results', async (req, res) => {
    try {
        const { thai_id, year, limit = 100 } = req.query;
        const params = [];
        let whereClause = "WHERE status = 'resulted'";
        let paramIndex = 1;

        if (thai_id) {
            whereClause += ` AND thai_id = $${paramIndex}`;
            params.push(thai_id);
            paramIndex++;
        }

        if (year) {
            whereClause += ` AND EXTRACT(YEAR FROM session_date) = $${paramIndex}`;
            params.push(parseInt(year));
            paramIndex++;
        }

        params.push(parseInt(limit));
        const result = await db.query(
            `SELECT id, thai_id, session_type, session_date, 
                    winning_animal, status
             FROM sessions 
             ${whereClause}
             ORDER BY session_date DESC, created_at DESC
             LIMIT $${paramIndex}`,
            params
        );

        res.json({ results: result.rows });
    } catch (error) {
        console.error('Get results history error:', error);
        res.status(500).json({ error: 'Không thể lấy lịch sử kết quả' });
    }
});

/**
 * DELETE /admin/sessions/:id/result - Delete session completely from DB
 * ⚠️ SAFE: Refuses to delete if there are paid/won/lost orders (prevents data loss)
 */
router.delete('/sessions/:id/result', async (req, res) => {
    const client = await db.getClient();
    try {
        const { id } = req.params;

        // Check if session has paid/won/lost orders
        const paidOrdersCheck = await client.query(
            `SELECT COUNT(*) as count FROM orders WHERE session_id = $1 AND status IN ('paid', 'won', 'lost')`,
            [id]
        );
        const hasPaidOrders = parseInt(paidOrdersCheck.rows[0].count) > 0;

        await client.query('BEGIN');

        if (hasPaidOrders) {
            // SOFT DELETE: Session has paid orders → only clear result, keep everything else
            // 1. Clear winning_animal and revert status to 'closed' (allows re-entering result)
            await client.query(
                `UPDATE sessions SET status = 'closed', winning_animal = NULL WHERE id = $1`,
                [id]
            );

            // 2. Revert 'won'/'lost' orders back to 'paid' (they were set by result submission)
            await client.query(
                `UPDATE orders SET status = 'paid' WHERE session_id = $1 AND status IN ('won', 'lost')`,
                [id]
            );

            // 3. Clean up only pending/expired orders (safe)
            await client.query(
                `DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE session_id = $1 AND status IN ('pending', 'expired'))`,
                [id]
            );
            await client.query(
                `DELETE FROM orders WHERE session_id = $1 AND status IN ('pending', 'expired')`,
                [id]
            );

            await client.query('COMMIT');
            console.log(`✅ Soft-deleted result for session ${id} (${paidOrdersCheck.rows[0].count} paid orders preserved)`);
            res.json({ success: true, soft_delete: true, message: 'Đã xóa kết quả (giữ nguyên đơn hàng đã thanh toán). Có thể nhập lại kết quả.' });
        } else {
            // HARD DELETE: No paid orders → delete everything completely
            await client.query(
                `DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE session_id = $1)`,
                [id]
            );
            await client.query(
                `DELETE FROM orders WHERE session_id = $1`,
                [id]
            );
            await client.query(`DELETE FROM session_animals WHERE session_id = $1`, [id]);
            await client.query(`DELETE FROM sessions WHERE id = $1`, [id]);

            await client.query('COMMIT');
            console.log(`✅ Hard-deleted session ${id} (no paid orders)`);
            res.json({ success: true, soft_delete: false, message: 'Đã xóa toàn bộ session.' });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete result error:', error);
        res.status(500).json({ error: 'Không thể xóa kết quả' });
    } finally {
        client.release();
    }
});

/**
 * POST /admin/sessions/:id/result - Set winning result (SPECS 6.4)
 */
router.post('/sessions/:id/result', async (req, res) => {
    const client = await db.getClient();

    try {
        const { id } = req.params;
        const { winning_animal, is_holiday } = req.body;

        await client.query('BEGIN');

        // Get session info for draw_time calculation
        const sessionInfo = await client.query(
            `SELECT thai_id, session_type, session_date FROM sessions WHERE id = $1`, [id]
        );
        let drawTime = null;
        if (sessionInfo.rows.length > 0) {
            const { thai_id: sid, session_type: stype, session_date: sdate } = sessionInfo.rows[0];
            const DRAW_TIMES = {
                'thai-an-nhon': { morning: '11:00', afternoon: '17:00', evening: '21:00' },
                'thai-nhon-phong': { morning: '11:00', afternoon: '17:00' },
                'thai-hoai-nhon': { morning: '13:00', afternoon: '19:00' },
            };
            const dtStr = DRAW_TIMES[sid]?.[stype] || '23:59';
            const dateStr = typeof sdate === 'string' ? sdate.split('T')[0] : sdate.toISOString().split('T')[0];
            drawTime = `${dateStr} ${dtStr}:00`;
        }

        if (is_holiday) {
            // Holiday - no lottery, explicitly clear winning_animal
            await client.query(
                `UPDATE sessions SET status = 'resulted', winning_animal = NULL, draw_time = $1 WHERE id = $2`,
                [drawTime, id]
            );
        } else {
            // Set winning animal
            await client.query(
                `UPDATE sessions 
         SET status = 'resulted', winning_animal = $1, draw_time = $2
         WHERE id = $3`,
                [winning_animal, drawTime, id]
            );

            // Update order statuses (won/lost)
            await client.query(
                `UPDATE orders SET status = 'won'
         WHERE session_id = $1 AND status = 'paid'
           AND id IN (
             SELECT order_id FROM order_items WHERE animal_order = $2
           )`,
                [id, winning_animal]
            );

            await client.query(
                `UPDATE orders SET status = 'lost'
         WHERE session_id = $1 AND status = 'paid'
           AND id NOT IN (
             SELECT order_id FROM order_items WHERE animal_order = $2
           )`,
                [id, winning_animal]
            );
        }

        // Auto-close other open sessions for this Thai
        if (sessionInfo.rows.length > 0) {
            const { thai_id } = sessionInfo.rows[0];
            await client.query(
                `UPDATE sessions SET status = 'closed'
                 WHERE thai_id = $1 AND status = 'open' AND id != $2`,
                [thai_id, id]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Set result error:', error);
        res.status(500).json({ error: 'Không thể cập nhật kết quả' });
    } finally {
        client.release();
    }
});

/**
 * GET /admin/day-slots - Get slot statuses for a specific thai + date
 * Returns all time slots with their current session data (if any)
 */
router.get('/day-slots', async (req, res) => {
    try {
        const { thai_id, date } = req.query;
        if (!thai_id || !date) {
            return res.status(400).json({ error: 'Thiếu thai_id hoặc date' });
        }

        // Define slots per Thai (from SPECS §1.2)
        const SLOT_DEFS = {
            'thai-an-nhon': [
                { session_type: 'morning', label: 'Sáng', draw_time: '11:00' },
                { session_type: 'afternoon', label: 'Chiều', draw_time: '17:00' },
                { session_type: 'evening', label: 'Tối', draw_time: '21:00' },
            ],
            'thai-nhon-phong': [
                { session_type: 'morning', label: 'Sáng', draw_time: '11:00' },
                { session_type: 'afternoon', label: 'Chiều', draw_time: '17:00' },
            ],
            'thai-hoai-nhon': [
                { session_type: 'morning', label: 'Sáng', draw_time: '13:00' },
                { session_type: 'afternoon', label: 'Chiều', draw_time: '19:00' },
            ],
        };

        const slotDefs = SLOT_DEFS[thai_id] || [];

        // Fetch existing sessions for this thai + date
        const sessionsResult = await db.query(
            `SELECT id, session_type, status, winning_animal
             FROM sessions
             WHERE thai_id = $1 AND session_date = $2
             ORDER BY created_at`,
            [thai_id, date]
        );
        const sessionsMap = {};
        sessionsResult.rows.forEach(s => {
            sessionsMap[s.session_type] = s;
        });

        // Build slot responses
        const slots = slotDefs.map(def => {
            const session = sessionsMap[def.session_type];
            return {
                session_type: def.session_type,
                label: def.label,
                draw_time: def.draw_time,
                session_id: session?.id || null,
                status: session?.status || null,
                winning_animal: session?.winning_animal ?? null,
            };
        });

        res.json({ slots });
    } catch (error) {
        console.error('Get day slots error:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin khung giờ' });
    }
});

/**
 * POST /admin/results - Submit lottery result by thai_id + date + slot_label
 * This API finds or creates the session automatically
 * Slot labels: "Sáng", "Chiều", "Tối" → mapped to session_type "morning", "afternoon", "evening"
 */
router.post('/results', async (req, res) => {
    const client = await db.getClient();

    try {
        const { thai_id, date, slot_label, winning_animal, is_holiday } = req.body;
        console.log('📝 POST /admin/results received:', { thai_id, date, slot_label, winning_animal, is_holiday });

        // Validate required fields
        if (!thai_id || !date || !slot_label) {
            return res.status(400).json({ error: 'Thiếu thai_id, date hoặc slot_label' });
        }

        // Map slot_label to session_type
        const slotMap = {
            'Sáng': 'morning',
            'Chiều': 'afternoon',
            'Tối': 'evening',
            'Tối (Tết)': 'evening'
        };
        const session_type = slotMap[slot_label];
        if (!session_type) {
            return res.status(400).json({ error: `Slot label không hợp lệ: ${slot_label}` });
        }

        await client.query('BEGIN');

        // Find existing session or create new one
        let sessionResult = await client.query(
            `SELECT id FROM sessions 
             WHERE thai_id = $1 AND session_date = $2 AND session_type = $3`,
            [thai_id, date, session_type]
        );

        let sessionId;
        if (sessionResult.rows.length === 0) {
            // Create new session
            const newSession = await client.query(
                `INSERT INTO sessions (id, thai_id, session_type, session_date, status, created_at)
                 VALUES (gen_random_uuid(), $1, $2, $3, 'scheduled', NOW())
                 RETURNING id`,
                [thai_id, session_type, date]
            );
            sessionId = newSession.rows[0].id;

            // Auto-populate session_animals for the new session
            const animalCount = thai_id === 'thai-hoai-nhon' ? 36 : 40;
            await client.query(
                `INSERT INTO session_animals (session_id, animal_order)
                 SELECT $1, generate_series(1, $2)`,
                [sessionId, animalCount]
            );
        } else {
            sessionId = sessionResult.rows[0].id;
        }

        // Calculate draw_time from SPECS: fixed draw times per Thai + session_type
        const DRAW_TIMES = {
            'thai-an-nhon': { morning: '11:00', afternoon: '17:00', evening: '21:00' },
            'thai-nhon-phong': { morning: '11:00', afternoon: '17:00' },
            'thai-hoai-nhon': { morning: '13:00', afternoon: '19:00' },
        };
        const drawTimeStr = DRAW_TIMES[thai_id]?.[session_type] || '23:59';
        const drawTime = `${date} ${drawTimeStr}:00`; // e.g. '2026-02-07 17:00:00'

        // Update the session with result
        if (is_holiday) {
            await client.query(
                `UPDATE sessions SET status = 'resulted', winning_animal = NULL, draw_time = $1 WHERE id = $2`,
                [drawTime, sessionId]
            );
        } else {
            await client.query(
                `UPDATE sessions 
                 SET status = 'resulted', winning_animal = $1, draw_time = $2
                 WHERE id = $3`,
                [winning_animal, drawTime, sessionId]
            );

            // Update order statuses (won/lost)
            await client.query(
                `UPDATE orders SET status = 'won'
                 WHERE session_id = $1 AND status = 'paid'
                   AND id IN (
                     SELECT order_id FROM order_items WHERE animal_order = $2
                   )`,
                [sessionId, winning_animal]
            );

            await client.query(
                `UPDATE orders SET status = 'lost'
                 WHERE session_id = $1 AND status = 'paid'
                   AND id NOT IN (
                     SELECT order_id FROM order_items WHERE animal_order = $2
                   )`,
                [sessionId, winning_animal]
            );
        }

        // Auto-close other open sessions for this Thai
        await client.query(
            `UPDATE sessions SET status = 'closed'
             WHERE thai_id = $1 AND status = 'open' AND id != $2`,
            [thai_id, sessionId]
        );

        await client.query('COMMIT');
        res.json({ success: true, session_id: sessionId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Submit result error:', error);
        res.status(500).json({ error: 'Không thể lưu kết quả' });
    } finally {
        client.release();
    }
});

// ================================================
// 6.9 Settings
// ================================================

/**
 * GET /admin/settings - Get all settings (SPECS 6.9)
 */
router.get('/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT key, value FROM settings');

        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });

        res.json({ settings });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Không thể lấy cài đặt' });
    }
});

/**
 * PATCH /admin/settings/:key - Update setting (SPECS 6.9)
 */
router.patch('/settings/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        await db.query(
            `INSERT INTO settings (key, value, updated_at) 
       VALUES ($1, $2, NOW())
       ON CONFLICT (key) 
       DO UPDATE SET value = $2, updated_at = NOW()`,
            [key, JSON.stringify(value)]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({ error: 'Không thể cập nhật' });
    }
});

// ================================================
// Users Management (SPECS 6.7)
// ================================================

/**
 * GET /admin/users - List users with pagination
 */
router.get('/users', async (req, res) => {
    try {
        const { search, page = 1, limit = 50 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let baseWhere = "WHERE role = 'user' AND (is_deleted = false OR is_deleted IS NULL)";
        const params = [];
        let paramIndex = 1;

        if (search) {
            baseWhere += ` AND (phone LIKE $${paramIndex} OR name ILIKE $${paramIndex} OR zalo ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM users ${baseWhere}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data with order count (subquery avoids N+1)
        const dataParams = [...params, parseInt(limit), offset];
        const result = await db.query(
            `SELECT id, phone, name, zalo, role, created_at,
                    bank_code, bank_account, bank_holder,
                    (SELECT COUNT(*) FROM orders WHERE user_id = users.id AND status IN ('paid', 'won', 'lost'))::int as order_count,
                    COALESCE((SELECT SUM(total) FROM orders WHERE user_id = users.id AND status IN ('paid', 'won', 'lost')), 0)::bigint as total_spent
             FROM users
             ${baseWhere}
             ORDER BY created_at DESC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            dataParams
        );

        // Aggregate stats for stat cards (global, not page-specific)
        const aggregateResult = await db.query(
            `SELECT
                (SELECT COUNT(*) FROM users WHERE role = 'user' AND (is_deleted = false OR is_deleted IS NULL))::int as total_users,
                (SELECT COUNT(DISTINCT user_id) FROM orders WHERE status IN ('paid', 'won', 'lost'))::int as users_with_orders,
                (SELECT COUNT(*) FROM orders WHERE status IN ('paid', 'won', 'lost'))::int as total_orders`
        );

        res.json({
            users: result.rows,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: offset + result.rows.length < total,
            aggregate: aggregateResult.rows[0]
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});


/**
 * PATCH /admin/users/:id - Update user (SPECS 6.7)
 */
router.patch('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, zalo, bank_code, bank_account, bank_holder, password } = req.body;

        // Build update query
        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramIndex}`);
            params.push(name);
            paramIndex++;
        }
        if (phone !== undefined) {
            updates.push(`phone = $${paramIndex}`);
            params.push(phone);
            paramIndex++;
        }
        if (zalo !== undefined) {
            updates.push(`zalo = $${paramIndex}`);
            params.push(zalo);
            paramIndex++;
        }
        if (bank_code !== undefined) {
            updates.push(`bank_code = $${paramIndex}`);
            params.push(bank_code);
            paramIndex++;
        }
        if (bank_account !== undefined) {
            updates.push(`bank_account = $${paramIndex}`);
            params.push(bank_account);
            paramIndex++;
        }
        if (bank_holder !== undefined) {
            updates.push(`bank_holder = $${paramIndex}`);
            params.push(bank_holder);
            paramIndex++;
        }
        if (password) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push(`password_hash = $${paramIndex}`);
            params.push(hashedPassword);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'Không có thông tin cần cập nhật' });
        }

        params.push(id);
        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
            params
        );

        await invalidateUserCache(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Không thể cập nhật thông tin' });
    }
});

/**
 * DELETE /admin/users/:id - Delete user (SPECS 6.7)
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verify user exists and is a regular user (not admin)
        const userCheck = await db.query(
            'SELECT id, role, is_deleted FROM users WHERE id = $1',
            [id]
        );
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        if (userCheck.rows[0].role !== 'user') {
            return res.status(403).json({ error: 'Không thể xóa tài khoản admin' });
        }
        if (userCheck.rows[0].is_deleted) {
            return res.status(400).json({ error: 'Người dùng đã bị xóa trước đó' });
        }

        // Soft delete: mark as deleted instead of removing from DB
        // Preserves order history and stats
        await db.query(
            'UPDATE users SET is_deleted = true, deleted_at = NOW() WHERE id = $1',
            [id]
        );

        await invalidateUserCache(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Không thể xóa người dùng' });
    }
});

// ================================================
// Community Management (SPECS 6.8)
// ================================================

// NOTE: GET /community/posts endpoint moved to line 1058 (consolidated with comments)

/**
 * POST /admin/community/posts - Create post
 */
router.post('/community/posts', async (req, res) => {
    try {
        const { thai_id, youtube_url, title, content, is_pinned } = req.body;

        // Extract YouTube ID
        const youtube_id = extractYoutubeId(youtube_url);

        const result = await db.query(
            `INSERT INTO community_posts (thai_id, youtube_id, title, content, is_pinned)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [thai_id, youtube_id, title, content, is_pinned || false]
        );

        res.status(201).json({ post: result.rows[0] });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Không thể tạo bài viết' });
    }
});

/**
 * DELETE /admin/community/posts/:id - Delete post
 */
router.delete('/community/posts/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM community_posts WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Không thể xóa' });
    }
});

// Helper: Extract YouTube ID (SPECS 5.5)
function extractYoutubeId(input) {
    if (!input) return null;
    if (input.includes('youtu.be/'))
        return input.split('youtu.be/')[1].split('?')[0];
    if (input.includes('v='))
        return input.split('v=')[1].split('&')[0];
    return input; // Assume it's already an ID
}

// ================================================
// Admin CMS - Comments Management
// ================================================

// NOTE: GET /community/posts consolidated endpoint is at line ~1035

/**
 * PATCH /admin/community/comments/:id/ban - Ban the USER who made this comment
 */
router.patch('/community/comments/:id/ban', async (req, res) => {
    try {
        const { id } = req.params;

        // Get user_id from comment
        const commentResult = await db.query(
            'SELECT user_id FROM community_comments WHERE id = $1',
            [id]
        );

        if (commentResult.rows.length === 0) {
            return res.status(404).json({ error: 'Bình luận không tồn tại' });
        }

        const userId = commentResult.rows[0].user_id;
        if (!userId) {
            return res.status(400).json({ error: 'Không tìm thấy user của bình luận này' });
        }

        // Toggle user's comment ban status
        const result = await db.query(
            'UPDATE users SET is_comment_banned = NOT is_comment_banned WHERE id = $1 RETURNING is_comment_banned, name, phone',
            [userId]
        );
        await invalidateUserCache(userId);

        // If user is now banned, delete all their comments
        let deletedCount = 0;
        if (result.rows[0].is_comment_banned) {
            const deleteResult = await db.query(
                'DELETE FROM community_comments WHERE user_id = $1',
                [userId]
            );
            deletedCount = deleteResult.rowCount;
        }

        res.json({
            is_banned: result.rows[0].is_comment_banned,
            user_name: result.rows[0].name,
            user_phone: result.rows[0].phone,
            deleted_comments: deletedCount,
            message: result.rows[0].is_comment_banned
                ? `Đã cấm user ${result.rows[0].phone} và xóa ${deletedCount} bình luận`
                : `Đã bỏ cấm user ${result.rows[0].phone}`
        });
    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({ error: 'Không thể thực hiện' });
    }
});

/**
 * DELETE /admin/community/comments/:id - Delete comment
 */
router.delete('/community/comments/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM community_comments WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: 'Không thể xóa' });
    }
});

/**
 * DELETE /admin/community/comments/bulk - Delete multiple comments at once
 */
router.delete('/community/comments/bulk', async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Danh sách ID không hợp lệ' });
        }

        const result = await db.query(
            'DELETE FROM community_comments WHERE id = ANY($1)',
            [ids]
        );

        res.json({
            success: true,
            deleted: result.rowCount
        });
    } catch (error) {
        console.error('Bulk delete comments error:', error);
        res.status(500).json({ error: 'Không thể xóa hàng loạt' });
    }
});

/**
 * PATCH /admin/community/comments/bulk-ban - Ban multiple users at once
 */
router.patch('/community/comments/bulk-ban', async (req, res) => {
    try {
        const { commentIds } = req.body;

        if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
            return res.status(400).json({ error: 'Danh sách comment ID không hợp lệ' });
        }

        // Get unique user IDs from comments
        const usersResult = await db.query(
            'SELECT DISTINCT user_id FROM community_comments WHERE id = ANY($1) AND user_id IS NOT NULL',
            [commentIds]
        );

        if (usersResult.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy user nào' });
        }

        const userIds = usersResult.rows.map(row => row.user_id);

        // Ban all users
        await db.query(
            'UPDATE users SET is_comment_banned = true WHERE id = ANY($1)',
            [userIds]
        );

        // Invalidate cache for all affected users
        await Promise.all(userIds.map(id => invalidateUserCache(id)));

        res.json({
            success: true,
            bannedUsers: userIds.length,
            userIds
        });
    } catch (error) {
        console.error('Bulk ban users error:', error);
        res.status(500).json({ error: 'Không thể cấm hàng loạt' });
    }
});


// Get list of banned users (users who are banned from commenting)
router.get('/community/banned-users', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT phone, name, created_at as banned_at
            FROM users
            WHERE is_comment_banned = true
            ORDER BY created_at DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching banned users:', error);
        res.status(500).json({ error: 'Failed to fetch banned users' });
    }
});

// Unban a specific user (allow them to comment again)
router.patch('/community/users/:phone/unban', async (req, res) => {
    const { phone } = req.params;
    try {
        const result = await db.query('UPDATE users SET is_comment_banned = false WHERE phone = $1 RETURNING id', [phone]);
        if (result.rows[0]) await invalidateUserCache(result.rows[0].id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error unbanning user:', error);
        res.status(500).json({ error: 'Failed to unban user' });
    }
});

// ================================================
// Admin CMS - Stats
// ================================================

/**
 * GET /admin/community/stats - CMS stats (videos, comments, likes)
 */
router.get('/community/stats', async (req, res) => {
    try {
        const { thai_id } = req.query;
        let whereClause = '';
        const params = [];

        if (thai_id) {
            whereClause = 'WHERE thai_id = $1';
            params.push(thai_id);
        }

        // Video count
        const videoResult = await db.query(
            `SELECT COUNT(*) FROM community_posts ${whereClause}`,
            params
        );

        // Total likes
        const likesResult = await db.query(
            `SELECT COALESCE(SUM(like_count), 0) as total FROM community_posts ${whereClause}`,
            params
        );

        // Comments count - need to join with posts for thai_id filter
        let commentQuery = `
            SELECT COUNT(*) as total
            FROM community_comments c
            JOIN community_posts p ON c.post_id = p.id
        `;
        if (thai_id) {
            commentQuery += ' WHERE p.thai_id = $1';
        }
        const commentsResult = await db.query(commentQuery, params);

        // Banned users count
        const bannedUsersResult = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE is_comment_banned = true'
        );

        res.json({
            videos: parseInt(videoResult.rows[0].count),
            likes: parseInt(likesResult.rows[0].total),
            comments: parseInt(commentsResult.rows[0].total),
            bannedComments: parseInt(bannedUsersResult.rows[0].count)  // Changed from bannedUsers
        });
    } catch (error) {
        console.error('CMS stats error:', error);
        res.status(500).json({ error: 'Không thể lấy thống kê' });
    }
});

// ================================================
// 6.5 Profit/Loss Stats per Session
// ================================================

/**
 * GET /admin/profit-loss - Revenue vs Payout by session (for Kết quả xổ page)
 * Payout ratios: 1:30 standard, 1:70 for Trùn (animal_order=5)
 */
router.get('/profit-loss', async (req, res) => {
    try {
        const { thai_id, date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        const normalizedThaiId = thai_id
            ? (thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`)
            : 'thai-an-nhon';

        // Single efficient query: get sessions + revenue + payout in 2 queries (not N+1)
        const sessionsResult = await db.query(
            `SELECT id, session_type, winning_animal
             FROM sessions 
             WHERE thai_id = $1 AND session_date = $2
             ORDER BY session_type`,
            [normalizedThaiId, targetDate]
        );

        if (sessionsResult.rows.length === 0) {
            return res.json({
                date: targetDate,
                thai_id: normalizedThaiId,
                profitLoss: {}
            });
        }

        const sessionIds = sessionsResult.rows.map(s => s.id);

        // Revenue per session (single query)
        const revenueResult = await db.query(
            `SELECT session_id, COALESCE(SUM(total), 0)::int as revenue
             FROM orders 
             WHERE session_id = ANY($1) AND status IN ('paid', 'won', 'lost')
             GROUP BY session_id`,
            [sessionIds]
        );
        const revenueMap = {};
        revenueResult.rows.forEach(r => { revenueMap[r.session_id] = r.revenue; });

        // Payout per session (single query, with correct multiplier)
        // Standard: subtotal * 30 (1 ăn 30)
        // Trùn (animal_order=5): subtotal * 70 (1 ăn 70)
        const payoutResult = await db.query(
            `SELECT o.session_id,
                    COALESCE(SUM(
                        CASE WHEN oi.animal_order = 5 
                             THEN oi.subtotal * 70 
                             ELSE oi.subtotal * 30 
                        END
                    ), 0)::int as payout
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN sessions s ON o.session_id = s.id
             WHERE o.session_id = ANY($1) 
               AND o.status = 'won' 
               AND oi.animal_order = s.winning_animal
             GROUP BY o.session_id`,
            [sessionIds]
        );
        const payoutMap = {};
        payoutResult.rows.forEach(r => { payoutMap[r.session_id] = r.payout; });

        // Build response
        const profitLoss = {};
        for (const session of sessionsResult.rows) {
            profitLoss[sessionTypeToVietnamese(session.session_type)] = {
                revenue: revenueMap[session.id] || 0,
                payout: payoutMap[session.id] || 0,
                winningAnimal: session.winning_animal
            };
        }

        res.json({
            date: targetDate,
            thai_id: normalizedThaiId,
            profitLoss
        });
    } catch (error) {
        console.error('Profit/Loss stats error:', error);
        res.status(500).json({ error: 'Không thể lấy thống kê' });
    }
});

/**
 * GET /admin/profit-loss/yearly - Yearly profit/loss aggregation
 * Returns revenue + payout grouped by session_type for the entire year
 */
router.get('/profit-loss/yearly', async (req, res) => {
    try {
        const { thai_id, year } = req.query;
        const targetYear = year || new Date().getFullYear();
        const normalizedThaiId = thai_id
            ? (thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`)
            : 'thai-an-nhon';

        // Revenue per session_type for the year
        const revenueResult = await db.query(
            `SELECT s.session_type, COALESCE(SUM(o.total), 0)::int as revenue
             FROM orders o
             JOIN sessions s ON o.session_id = s.id
             WHERE s.thai_id = $1
               AND EXTRACT(YEAR FROM s.session_date) = $2
               AND o.status IN ('paid', 'won', 'lost')
             GROUP BY s.session_type
             ORDER BY s.session_type`,
            [normalizedThaiId, targetYear]
        );

        // Payout per session_type for the year (correct multipliers)
        const payoutResult = await db.query(
            `SELECT s.session_type,
                    COALESCE(SUM(
                        CASE WHEN oi.animal_order = 5 
                             THEN oi.subtotal * 70 
                             ELSE oi.subtotal * 30 
                        END
                    ), 0)::int as payout
             FROM order_items oi
             JOIN orders o ON oi.order_id = o.id
             JOIN sessions s ON o.session_id = s.id
             WHERE s.thai_id = $1
               AND EXTRACT(YEAR FROM s.session_date) = $2
               AND o.status = 'won'
               AND oi.animal_order = s.winning_animal
             GROUP BY s.session_type
             ORDER BY s.session_type`,
            [normalizedThaiId, targetYear]
        );

        // Merge into unified response
        const profitLoss = {};
        const revenueMap = {};
        revenueResult.rows.forEach(r => { revenueMap[r.session_type] = r.revenue; });
        const payoutMap = {};
        payoutResult.rows.forEach(r => { payoutMap[r.session_type] = r.payout; });

        // Include all session types that have any data
        const allSessionTypes = new Set([
            ...revenueResult.rows.map(r => r.session_type),
            ...payoutResult.rows.map(r => r.session_type)
        ]);

        for (const st of allSessionTypes) {
            profitLoss[sessionTypeToVietnamese(st)] = {
                revenue: revenueMap[st] || 0,
                payout: payoutMap[st] || 0
            };
        }

        res.json({
            year: parseInt(targetYear),
            thai_id: normalizedThaiId,
            profitLoss
        });
    } catch (error) {
        console.error('Yearly Profit/Loss error:', error);
        res.status(500).json({ error: 'Không thể lấy thống kê năm' });
    }
});

// ================================================
// Thai Limits - Hạn mức tổng cho mỗi Thai
// ================================================

/**
 * GET /admin/thai-limits - Lấy hạn mức tổng của tất cả Thai
 */
router.get('/thai-limits', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT value FROM settings WHERE key = 'thai_limits'`
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0].value);
        } else {
            // Default limits
            res.json({
                'an-nhon': 300000,
                'nhon-phong': 500000,
                'hoai-nhon': 200000
            });
        }
    } catch (error) {
        console.error('Get thai limits error:', error);
        // Return defaults on error
        res.json({
            'an-nhon': 300000,
            'nhon-phong': 500000,
            'hoai-nhon': 200000
        });
    }
});

/**
 * PUT /admin/thai-limits - Lưu hạn mức tổng của tất cả Thai
 */
router.put('/thai-limits', async (req, res) => {
    try {
        const limits = req.body;

        // Validate input
        if (!limits || typeof limits !== 'object') {
            return res.status(400).json({ error: 'Invalid limits data' });
        }

        // Upsert vào settings table
        // NOTE: value is jsonb column, pass object directly (pg driver handles conversion)
        await db.query(
            `INSERT INTO settings (key, value, updated_at)
             VALUES ('thai_limits', $1::jsonb, NOW())
             ON CONFLICT (key) DO UPDATE SET value = $1::jsonb, updated_at = NOW()`,
            [limits]
        );

        // SYNC: Update session_animals.limit_amount for all scheduled/open sessions
        // This ensures order validation uses the correct limits
        for (const [thaiId, newLimit] of Object.entries(limits)) {
            if (typeof newLimit === 'number' && newLimit > 0) {
                await db.query(`
                    UPDATE session_animals sa
                    SET limit_amount = $1
                    FROM sessions s
                    WHERE sa.session_id = s.id
                    AND s.thai_id = $2
                    AND s.status IN ('scheduled', 'open')
                `, [newLimit, thaiId]);
            }
        }

        res.json({ success: true, limits });
    } catch (error) {
        console.error('Save thai limits error:', error);
        res.status(500).json({ error: 'Không thể lưu hạn mức' });
    }
});

// ================================================
// Thai Switches - Bật/tắt từng Thai
// ================================================

/**
 * GET /admin/thai-switches - Lấy trạng thái bật/tắt của tất cả Thai
 */
router.get('/thai-switches', async (req, res) => {
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
        console.error('Get thai switches error:', error);
        res.json({
            master: true,
            'an-nhon': true,
            'nhon-phong': true,
            'hoai-nhon': true
        });
    }
});

/**
 * PUT /admin/thai-switches - Lưu trạng thái bật/tắt của tất cả Thai
 */
router.put('/thai-switches', async (req, res) => {
    try {
        const switches = req.body;

        if (!switches || typeof switches !== 'object') {
            return res.status(400).json({ error: 'Invalid switches data' });
        }

        // Upsert từng switch
        const updates = [];

        if (switches.master !== undefined) {
            updates.push(db.query(
                `INSERT INTO settings (key, value, updated_at)
                 VALUES ('master_switch', $1, NOW())
                 ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
                [String(switches.master)]
            ));
        }

        if (switches['an-nhon'] !== undefined) {
            updates.push(db.query(
                `INSERT INTO settings (key, value, updated_at)
                 VALUES ('thai_an_nhon_enabled', $1, NOW())
                 ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
                [String(switches['an-nhon'])]
            ));
        }

        if (switches['nhon-phong'] !== undefined) {
            updates.push(db.query(
                `INSERT INTO settings (key, value, updated_at)
                 VALUES ('thai_nhon_phong_enabled', $1, NOW())
                 ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
                [String(switches['nhon-phong'])]
            ));
        }

        if (switches['hoai-nhon'] !== undefined) {
            updates.push(db.query(
                `INSERT INTO settings (key, value, updated_at)
                 VALUES ('thai_hoai_nhon_enabled', $1, NOW())
                 ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
                [String(switches['hoai-nhon'])]
            ));
        }

        await Promise.all(updates);

        // Read back all switches from DB to return full state
        const result = await db.query(
            `SELECT key, value FROM settings 
             WHERE key IN ('master_switch', 'thai_an_nhon_enabled', 'thai_nhon_phong_enabled', 'thai_hoai_nhon_enabled')`
        );

        const fullSwitches = {
            master: true,
            'an-nhon': true,
            'nhon-phong': true,
            'hoai-nhon': true
        };

        result.rows.forEach(row => {
            const val = row.value === 'true' || row.value === true;
            if (row.key === 'master_switch') fullSwitches.master = val;
            else if (row.key === 'thai_an_nhon_enabled') fullSwitches['an-nhon'] = val;
            else if (row.key === 'thai_nhon_phong_enabled') fullSwitches['nhon-phong'] = val;
            else if (row.key === 'thai_hoai_nhon_enabled') fullSwitches['hoai-nhon'] = val;
        });

        res.json({ success: true, switches: fullSwitches });
    } catch (error) {
        console.error('Save thai switches error:', error);
        res.status(500).json({ error: 'Không thể lưu trạng thái' });
    }
});

// ================================================
// Admin Community Management (CMS)
// ================================================

/**
 * GET /admin/community/posts - Get all posts for admin with comments
 */
router.get('/community/posts', async (req, res) => {
    try {
        const { thai_id } = req.query;

        let where = '';
        const params = [];

        if (thai_id) {
            where = 'WHERE thai_id = $1';
            params.push(thai_id);
        }

        const result = await db.query(
            `SELECT id, thai_id, youtube_id, title, content, like_count, is_pinned, created_at
             FROM community_posts
             ${where}
             ORDER BY is_pinned DESC, created_at DESC`,
            params
        );

        // Get comments for each post - JOIN with users to get user info
        const postsWithComments = await Promise.all(
            result.rows.map(async (post) => {
                const commentsResult = await db.query(
                    `SELECT c.id, c.content, c.created_at, c.user_id,
                            u.name as user_name, u.phone as user_phone, u.is_comment_banned as is_banned
                     FROM community_comments c
                     LEFT JOIN users u ON c.user_id = u.id
                     WHERE c.post_id = $1
                     ORDER BY c.created_at DESC`,
                    [post.id]
                );
                return { ...post, comments: commentsResult.rows };
            })
        );

        res.json({ posts: postsWithComments });
    } catch (error) {
        console.error('Get admin posts error:', error);
        res.json({ posts: [] }); // Return empty array on error to prevent crash
    }
});

/**
 * GET /admin/community/stats - Get CMS statistics
 */
router.get('/community/stats', async (req, res) => {
    try {
        const { thai_id } = req.query;

        let where = '';
        const params = [];

        if (thai_id) {
            where = 'WHERE thai_id = $1';
            params.push(thai_id);
        }

        const videosResult = await db.query(
            `SELECT COUNT(*) as count FROM community_posts ${where} ${where ? '' : ''}`,
            params
        );

        const likesResult = await db.query(
            `SELECT COALESCE(SUM(like_count), 0) as count FROM community_posts ${where}`,
            params
        );

        const commentsQuery = `SELECT COUNT(*) as count FROM community_comments c 
                               JOIN community_posts p ON c.post_id = p.id 
                               ${thai_id ? 'WHERE p.thai_id = $1' : ''}`;
        const commentsResult = await db.query(commentsQuery, params);

        // Banned users count
        const bannedResult = await db.query(
            'SELECT COUNT(*) as count FROM users WHERE is_comment_banned = true'
        );

        res.json({
            videos: parseInt(videosResult.rows[0]?.count || 0),
            likes: parseInt(likesResult.rows[0]?.count || 0),
            comments: parseInt(commentsResult.rows[0]?.count || 0),
            bannedUsers: parseInt(bannedResult.rows[0]?.count || 0)
        });
    } catch (error) {
        console.error('Get CMS stats error:', error);
        res.json({ videos: 0, likes: 0, comments: 0, bannedComments: 0 });
    }
});

/**
 * POST /admin/community/posts - Create new post/video
 */
router.post('/community/posts', async (req, res) => {
    try {
        const { thai_id, youtube_url, title, content, is_pinned = false } = req.body;

        if (!thai_id || !youtube_url || !title) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
        }

        // Extract YouTube ID from URL
        const youtubeMatch = youtube_url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
        const youtube_id = youtubeMatch ? youtubeMatch[1] : youtube_url;

        const result = await db.query(
            `INSERT INTO community_posts (thai_id, youtube_id, title, content, is_pinned)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [thai_id, youtube_id, title, content || '', is_pinned]
        );

        res.status(201).json({ post: { ...result.rows[0], comments: [] } });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Không thể tạo bài viết' });
    }
});

/**
 * DELETE /admin/community/posts/:id - Delete a post
 */
router.delete('/community/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete comments first
        await db.query('DELETE FROM community_comments WHERE post_id = $1', [id]);
        await db.query('DELETE FROM post_likes WHERE post_id = $1', [id]);
        await db.query('DELETE FROM community_posts WHERE id = $1', [id]);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Không thể xóa bài viết' });
    }
});

// NOTE: Ban endpoint moved to line ~640 (consolidated)

/**
 * DELETE /admin/community/comments/:id - Delete a comment
 */
router.delete('/community/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM community_comments WHERE id = $1', [id]);

        res.json({ success: true });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: 'Không thể xóa bình luận' });
    }
});

// ================================================
// Cau Thai Management
// ================================================

/**
 * GET /admin/cau-thai - List all cau thai images for admin
 */
router.get('/cau-thai', async (req, res) => {
    try {
        const { thai_id, year, limit = 50 } = req.query;
        const params = [];
        let whereClause = 'WHERE 1=1';

        if (thai_id) {
            params.push(thai_id);
            whereClause += ` AND thai_id = $${params.length}`;
        }

        if (year) {
            params.push(parseInt(year));
            whereClause += ` AND EXTRACT(YEAR FROM created_at) = $${params.length}`;
        }

        params.push(parseInt(limit));
        const result = await db.query(
            `SELECT * FROM cau_thai_images 
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT $${params.length}`,
            params
        );

        res.json({ cauThaiImages: result.rows });
    } catch (error) {
        console.error('Get admin cau thai error:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách câu thai' });
    }
});

/**
 * POST /admin/cau-thai - Add new cau thai image
 */
router.post('/cau-thai', async (req, res) => {
    try {
        const { thai_id, image_url, description, khung_id } = req.body;

        if (!thai_id || !image_url) {
            return res.status(400).json({ error: 'Thiếu thông tin thai_id hoặc image_url' });
        }

        const year = new Date().getFullYear();

        const result = await db.query(
            `INSERT INTO cau_thai_images (thai_id, image_url, description, khung_id, year, is_active)
             VALUES ($1, $2, $3, $4, $5, false)
             RETURNING *`,
            [thai_id, image_url, description || '', khung_id || 'khung-1', year]
        );

        res.status(201).json({ cauThai: result.rows[0] });
    } catch (error) {
        console.error('Create cau thai error:', error);
        res.status(500).json({ error: 'Không thể tạo câu thai' });
    }
});

/**
 * PATCH /admin/cau-thai/:id - Update cau thai (toggle active, update description)
 */
router.patch('/cau-thai/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, description } = req.body;

        // If setting is_active to true, deactivate others in same thai + khung
        if (is_active === true) {
            const currentResult = await db.query(
                'SELECT thai_id, khung_id FROM cau_thai_images WHERE id = $1',
                [id]
            );

            if (currentResult.rows.length > 0) {
                const { thai_id, khung_id } = currentResult.rows[0];
                // Deactivate all others in same thai + khung
                await db.query(
                    'UPDATE cau_thai_images SET is_active = false WHERE thai_id = $1 AND khung_id = $2',
                    [thai_id, khung_id || 'khung-1']
                );
            }
        }

        const updates = [];
        const params = [];
        let paramIndex = 1;

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramIndex}`);
            params.push(is_active);
            paramIndex++;
        }
        if (description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            params.push(description);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'Không có gì để cập nhật' });
        }

        params.push(id);
        const result = await db.query(
            `UPDATE cau_thai_images SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy câu thai' });
        }

        res.json({ cauThai: result.rows[0] });
    } catch (error) {
        console.error('Update cau thai error:', error);
        res.status(500).json({ error: 'Không thể cập nhật câu thai' });
    }
});

/**
 * DELETE /admin/cau-thai/:id - Delete cau thai image
 */
router.delete('/cau-thai/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM cau_thai_images WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete cau thai error:', error);
        res.status(500).json({ error: 'Không thể xóa câu thai' });
    }
});

module.exports = router;

