/**
 * Order Routes - Create order with race condition handling
 * Theo SPECS.md Section 5.1, 5.2, 5.4, 7.1
 */

const express = require('express');
const db = require('../services/database');
const { authenticate, requireMXHCompleted } = require('../middleware/auth');
const payosService = require('../services/payos');
const { cache } = require('../services/redis');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /orders - Create order with atomic limit check (SPECS 7.1)
 * ⚠️ RACE CONDITION HANDLING: Row-level lock + transaction
 */
router.post('/', requireMXHCompleted, async (req, res) => {
    const client = await db.getClient();

    try {
        const { session_id, items } = req.body;
        // items: [{ animal_order: 1, quantity: 2, unit_price: 10000 }, ...]

        if (!session_id || !items || items.length === 0) {
            return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
        }

        await client.query('BEGIN');

        // 1. Check session is still open
        const sessionResult = await client.query(
            `SELECT id, status FROM sessions 
       WHERE id = $1 FOR UPDATE`,
            [session_id]
        );

        if (sessionResult.rows.length === 0) {
            throw new Error('Phiên không tồn tại');
        }

        const session = sessionResult.rows[0];
        if (session.status !== 'open') {
            throw new Error('Phiên đã đóng. Vui lòng chờ phiên tiếp theo.');
        }

        // 2. Check limits for each animal (SPECS 7.1 - atomic lock)
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const animalResult = await client.query(
                `SELECT animal_order, limit_amount, sold_amount, is_banned
         FROM session_animals 
         WHERE session_id = $1 AND animal_order = $2
         FOR UPDATE`,
                [session_id, item.animal_order]
            );

            if (animalResult.rows.length === 0) {
                throw new Error(`Con vật ${item.animal_order} không tồn tại`);
            }

            const animal = animalResult.rows[0];

            if (animal.is_banned) {
                throw new Error(`Con ${item.animal_order} đã bị cấm`);
            }

            const subtotal = item.quantity * item.unit_price;
            const newSold = animal.sold_amount + subtotal;

            if (newSold > animal.limit_amount) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: `Con ${item.animal_order} đã hết hạn mức`,
                    animal_order: item.animal_order,
                    remaining: animal.limit_amount - animal.sold_amount
                });
            }

            total += subtotal;
            orderItems.push({
                ...item,
                subtotal,
                animal_name: getAnimalName(item.animal_order) // Denormalize
            });
        }

        // 3. Create order
        const orderResult = await client.query(
            `INSERT INTO orders (session_id, user_id, total, status, payment_expires)
       VALUES ($1, $2, $3, 'pending', NOW() + INTERVAL '15 minutes')
       RETURNING id`,
            [session_id, req.user.id, total]
        );

        const orderId = orderResult.rows[0].id;

        // 4. Create order items
        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items (order_id, animal_order, animal_name, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [orderId, item.animal_order, item.animal_name, item.quantity, item.unit_price, item.subtotal]
            );

            // 5. Update sold_amount (atomic)
            await client.query(
                `UPDATE session_animals 
         SET sold_amount = sold_amount + $1
         WHERE session_id = $2 AND animal_order = $3`,
                [item.subtotal, session_id, item.animal_order]
            );
        }

        // 6. Create PayOS payment link
        const paymentLink = await payosService.createPaymentLink({
            orderId,
            amount: total,
            description: `Đơn hàng Cổ Nhơn #${orderId.slice(0, 8)}`
        });

        // 7. Update order with payment info
        await client.query(
            `UPDATE orders SET payment_code = $1, payment_url = $2 WHERE id = $3`,
            [paymentLink.orderCode, paymentLink.checkoutUrl, orderId]
        );

        await client.query('COMMIT');

        // Invalidate session animals cache (sold_amount changed)
        await cache.del(`session_animals:${session_id}`);

        res.status(201).json({
            order: {
                id: orderId,
                total,
                status: 'pending',
                payment_url: paymentLink.checkoutUrl,
                payment_code: paymentLink.orderCode
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create order error:', error);
        res.status(400).json({ error: error.message || 'Không thể tạo đơn hàng' });
    } finally {
        client.release();
    }
});

/**
 * GET /orders/me - Get user's orders with pagination (SPECS 5.4)
 */
router.get('/me', async (req, res) => {
    try {
        const { thai_id, status, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let baseWhere = `WHERE o.user_id = $1 AND o.status IN ('pending', 'paid', 'won', 'lost', 'expired')`;
        const params = [req.user.id];
        let paramIndex = 2;

        if (thai_id) {
            // Frontend gửi 'an-nhon', DB lưu 'thai-an-nhon' → tự thêm prefix
            const normalizedThaiId = thai_id.startsWith('thai-') ? thai_id : `thai-${thai_id}`;
            baseWhere += ` AND s.thai_id = $${paramIndex}`;
            params.push(normalizedThaiId);
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

        // Get paginated data with items included
        const dataParams = [...params, parseInt(limit), offset];
        const result = await db.query(
            `SELECT o.id, o.total, o.status, o.created_at, o.paid_at,
                    o.payment_url,
                    s.thai_id, s.session_type, s.session_date, s.lunar_label,
                    COALESCE(
                      (SELECT json_agg(json_build_object(
                        'animal_order', oi.animal_order,
                        'animal_name', oi.animal_name,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'amount', oi.subtotal
                      ) ORDER BY oi.animal_order)
                      FROM order_items oi WHERE oi.order_id = o.id),
                      '[]'::json
                    ) as items
             FROM orders o
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
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng' });
    }
});


/**
 * GET /orders/:id - Get order details
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const orderResult = await db.query(
            `SELECT o.*, s.thai_id, s.session_type, s.session_date, s.lunar_label
       FROM orders o
       JOIN sessions s ON o.session_id = s.id
       WHERE o.id = $1 AND o.user_id = $2`,
            [id, req.user.id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
        }

        const itemsResult = await db.query(
            `SELECT animal_order, animal_name, quantity, unit_price, subtotal
       FROM order_items WHERE order_id = $1`,
            [id]
        );

        res.json({
            order: orderResult.rows[0],
            items: itemsResult.rows
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Không thể lấy thông tin đơn hàng' });
    }
});

// Helper: Get animal name from hardcoded list
function getAnimalName(order) {
    const animals = [
        'Cá Trắng', 'Ốc', 'Ngỗng', 'Công', 'Trùn', 'Cọp', 'Heo', 'Thỏ', 'Trâu', 'Rồng Bay',
        'Chó', 'Ngựa', 'Voi', 'Mèo', 'Chuột', 'Ong', 'Hạc', 'Kỳ Lân', 'Bướm', 'Hòn Núi',
        'Én', 'Bồ Câu', 'Khỉ', 'Ếch', 'Quạ', 'Rồng Nằm', 'Rùa', 'Gà', 'Lươn', 'Cá Đỏ',
        'Tôm', 'Rắn', 'Nhện', 'Nai', 'Dê', 'Bà Vãi', 'Ông Trời', 'Ông Địa', 'Thần Tài', 'Ông Táo'
    ];
    return animals[order - 1] || `Con ${order}`;
}

module.exports = router;
