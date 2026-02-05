/**
 * Admin Routes - Dashboard, Orders, Sessions, Settings
 * Theo SPECS.md Section 6
 */

const express = require('express');
const db = require('../services/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(authenticate, requireAdmin);

// ================================================
// 6.1 Dashboard Stats
// ================================================

/**
 * GET /admin/stats - Dashboard statistics (SPECS 6.1)
 */
router.get('/stats', async (req, res) => {
    try {
        const { thai_id, session_type, date } = req.query;

        // Revenue today
        const revenueResult = await db.query(
            `SELECT COALESCE(SUM(total), 0) as revenue
       FROM orders 
       WHERE paid_at::date = CURRENT_DATE 
         AND status IN ('paid', 'won', 'lost')`
        );

        // Total orders all time
        const totalOrdersResult = await db.query(
            `SELECT COUNT(*) as total FROM orders WHERE status IN ('paid', 'won', 'lost')`
        );

        // Orders today
        const todayOrdersResult = await db.query(
            `SELECT COUNT(*) as total FROM orders WHERE created_at::date = CURRENT_DATE`
        );

        // Top 5 animals (most bought)
        let topQuery = `
      SELECT oi.animal_order, SUM(oi.quantity) as total_qty, SUM(oi.subtotal) as total_amount
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status IN ('paid', 'won', 'lost')
    `;
        const topParams = [];

        if (thai_id) {
            topQuery += ` AND o.session_id IN (SELECT id FROM sessions WHERE thai_id = $${topParams.length + 1})`;
            topParams.push(thai_id);
        }

        topQuery += ' GROUP BY oi.animal_order ORDER BY total_qty DESC LIMIT 5';
        const topAnimalsResult = await db.query(topQuery, topParams);

        // Bottom 5 animals
        let bottomQuery = topQuery.replace('DESC', 'ASC');
        const bottomAnimalsResult = await db.query(bottomQuery, topParams);

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
                    winning_animal, lunar_label, opens_at, closes_at, created_at
             FROM sessions 
             ${whereClause}
             ORDER BY session_date DESC, closes_at DESC
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
 */
router.get('/sessions/current/:thai_id', async (req, res) => {
    try {
        const { thai_id } = req.params;

        const result = await db.query(
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
       WHERE s.thai_id = $1 AND s.status IN ('open', 'scheduled')
       GROUP BY s.id
       ORDER BY s.closes_at ASC
       LIMIT 1`,
            [thai_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không có phiên nào' });
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
            params.push(session_type);
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
              s.thai_id, s.session_type, s.session_date, s.lunar_label
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
 * POST /admin/sessions/:id/result - Set winning result (SPECS 6.4)
 */
router.post('/sessions/:id/result', async (req, res) => {
    const client = await db.getClient();

    try {
        const { id } = req.params;
        const { winning_animal, lunar_label, is_holiday } = req.body;

        await client.query('BEGIN');

        if (is_holiday) {
            // Holiday - no lottery
            await client.query(
                `UPDATE sessions SET status = 'resulted', lunar_label = $1 WHERE id = $2`,
                [lunar_label, id]
            );
        } else {
            // Set winning animal
            await client.query(
                `UPDATE sessions 
         SET status = 'resulted', winning_animal = $1, lunar_label = $2
         WHERE id = $3`,
                [winning_animal, lunar_label, id]
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

        let baseWhere = "WHERE role = 'user'";
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
                    (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count
             FROM users
             ${baseWhere}
             ORDER BY created_at DESC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            dataParams
        );

        res.json({
            users: result.rows,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: offset + result.rows.length < total
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

        // Check if user has orders
        const ordersCheck = await db.query(
            'SELECT COUNT(*) as count FROM orders WHERE user_id = $1',
            [id]
        );

        if (parseInt(ordersCheck.rows[0].count) > 0) {
            // Soft delete - just mark as deleted or deactivate
            // For now, we still delete but could add is_deleted flag later
        }

        await db.query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'user']);
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
 * PATCH /admin/community/comments/:id/ban - Toggle ban comment
 */
router.patch('/community/comments/:id/ban', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'UPDATE community_comments SET is_banned = NOT is_banned WHERE id = $1 RETURNING is_banned',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bình luận không tồn tại' });
        }

        res.json({
            is_banned: result.rows[0].is_banned,
            message: result.rows[0].is_banned ? 'Đã cấm bình luận' : 'Đã bỏ cấm bình luận'
        });
    } catch (error) {
        console.error('Ban comment error:', error);
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

        // Comments count
        let commentQuery = `
            SELECT COUNT(*) as total, 
                   COUNT(*) FILTER (WHERE is_banned = true) as banned
            FROM community_comments c
            JOIN community_posts p ON c.post_id = p.id
        `;
        if (thai_id) {
            commentQuery += ' WHERE p.thai_id = $1';
        }
        const commentsResult = await db.query(commentQuery, params);

        res.json({
            videos: parseInt(videoResult.rows[0].count),
            likes: parseInt(likesResult.rows[0].total),
            comments: parseInt(commentsResult.rows[0].total),
            bannedComments: parseInt(commentsResult.rows[0].banned)
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
 */
router.get('/profit-loss', async (req, res) => {
    try {
        const { thai_id, date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        // Get sessions for the date
        const sessionsResult = await db.query(
            `SELECT id, session_type, winning_animal
             FROM sessions 
             WHERE thai_id = $1 AND session_date = $2
             ORDER BY session_type`,
            [thai_id || 'an-nhon', targetDate]
        );

        const profitLoss = {};

        for (const session of sessionsResult.rows) {
            // Revenue = total từ orders paid/won/lost
            const revenueResult = await db.query(
                `SELECT COALESCE(SUM(total), 0) as revenue
                 FROM orders 
                 WHERE session_id = $1 AND status IN ('paid', 'won', 'lost')`,
                [session.id]
            );

            // Payout = total trả thưởng cho orders won
            const payoutResult = await db.query(
                `SELECT COALESCE(SUM(oi.subtotal * 9), 0) as payout
                 FROM order_items oi
                 JOIN orders o ON oi.order_id = o.id
                 WHERE o.session_id = $1 AND o.status = 'won' AND oi.animal_order = $2`,
                [session.id, session.winning_animal]
            );

            const sessionTypeKey = session.session_type; // 'sang', 'chieu', 'toi', etc.
            profitLoss[sessionTypeKey] = {
                revenue: parseInt(revenueResult.rows[0].revenue),
                payout: parseInt(payoutResult.rows[0].payout),
                winningAnimal: session.winning_animal
            };
        }

        res.json({
            date: targetDate,
            thai_id: thai_id || 'an-nhon',
            profitLoss
        });
    } catch (error) {
        console.error('Profit/Loss stats error:', error);
        res.status(500).json({ error: 'Không thể lấy thống kê' });
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
            `SELECT id, thai_id, youtube_id, title, content, like_count, is_pinned, 
                    is_approved, created_at
             FROM community_posts
             ${where}
             ORDER BY is_pinned DESC, created_at DESC`,
            params
        );

        // Get comments for each post - JOIN with users to get user info
        const postsWithComments = await Promise.all(
            result.rows.map(async (post) => {
                const commentsResult = await db.query(
                    `SELECT c.id, c.content, c.is_banned, c.created_at,
                            u.name as user_name, u.phone as user_phone
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

        // Comments count - need to join with posts for thai_id filter
        let commentsQuery = `SELECT COUNT(*) as count FROM community_comments`;
        let bannedQuery = `SELECT COUNT(*) as count FROM community_comments WHERE is_banned = true`;

        if (thai_id) {
            commentsQuery = `SELECT COUNT(*) as count FROM community_comments c 
                             JOIN community_posts p ON c.post_id = p.id 
                             WHERE p.thai_id = $1`;
            bannedQuery = `SELECT COUNT(*) as count FROM community_comments c 
                           JOIN community_posts p ON c.post_id = p.id 
                           WHERE p.thai_id = $1 AND c.is_banned = true`;
        }

        const commentsResult = await db.query(commentsQuery, params);
        const bannedResult = await db.query(bannedQuery, params);

        res.json({
            videos: parseInt(videosResult.rows[0]?.count || 0),
            likes: parseInt(likesResult.rows[0]?.count || 0),
            comments: parseInt(commentsResult.rows[0]?.count || 0),
            bannedComments: parseInt(bannedResult.rows[0]?.count || 0)
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
            `INSERT INTO community_posts (thai_id, youtube_id, title, content, is_pinned, is_approved)
             VALUES ($1, $2, $3, $4, $5, true)
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

/**
 * PATCH /admin/community/comments/:id/ban - Toggle ban status
 */
router.patch('/community/comments/:id/ban', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `UPDATE community_comments 
             SET is_banned = NOT is_banned 
             WHERE id = $1 
             RETURNING is_banned`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy bình luận' });
        }

        res.json({
            is_banned: result.rows[0].is_banned,
            message: result.rows[0].is_banned ? 'Đã cấm bình luận' : 'Đã bỏ cấm'
        });
    } catch (error) {
        console.error('Ban comment error:', error);
        res.status(500).json({ error: 'Không thể thực hiện' });
    }
});

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

        const result = await db.query(
            `INSERT INTO cau_thai_images (thai_id, image_url, description, khung_id, is_active)
             VALUES ($1, $2, $3, $4, false)
             RETURNING *`,
            [thai_id, image_url, description || '', khung_id || 'khung-1']
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

