/**
 * Webhook Routes - PayOS payment callbacks
 * Theo SPECS.md Section 7.3
 */

const express = require('express');
const db = require('../services/database');
const payosService = require('../services/payos');

const router = express.Router();

/**
 * GET /webhook/payos - PayOS URL verification
 * PayOS sends GET to verify webhook URL is active
 */
router.get('/payos', (req, res) => {
    res.json({ success: true, message: 'Webhook is active' });
});

/**
 * POST /webhook/payos - PayOS payment webhook (SPECS 7.3)
 * Idempotent: Chỉ xử lý nếu status = 'pending'
 */
router.post('/payos', async (req, res) => {
    try {
        const { data, signature } = req.body;
        console.log('📩 PayOS webhook received, orderCode:', data?.orderCode, 'code:', data?.code);

        // Verify signature
        if (!payosService.verifyWebhookSignature(data, signature)) {
            console.warn('❌ Invalid PayOS webhook signature for orderCode:', data?.orderCode);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const { orderCode, code, desc } = data;

        // Handle PayOS test webhook (orderCode: 123)
        if (String(orderCode) === '123') {
            console.log('PayOS test webhook received');
            return res.json({ success: true, message: 'Test webhook received' });
        }

        // Use transaction + FOR UPDATE to prevent race with cron/cancel
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            // Lock order row — ensures only one of webhook/cron/cancel processes this order
            const orderResult = await client.query(
                'SELECT id, status, session_id FROM orders WHERE payment_code = $1 FOR UPDATE',
                [String(orderCode)]
            );

            if (orderResult.rows.length === 0) {
                await client.query('ROLLBACK');
                console.warn('Order not found for orderCode:', orderCode);
                return res.status(200).json({ success: true, message: 'Order not found (ignored)' });
            }

            const order = orderResult.rows[0];
            console.log('📦 Order found:', order.id, 'current status:', order.status);

            // Idempotent check — already in terminal success state
            if (['paid', 'won', 'lost'].includes(order.status)) {
                await client.query('ROLLBACK');
                console.log('✅ Order already paid/processed:', order.id);
                return res.json({ success: true, message: 'Already processed' });
            }

            // Payment successful
            if (code === '00') {
                // Now wasExpired is read INSIDE the lock, so it's always correct
                const wasExpired = order.status === 'expired';

                await client.query(
                    `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = $1`,
                    [order.id]
                );

                if (wasExpired) {
                    // Re-add sold_amount that was rolled back during expiration
                    const itemsResult = await client.query(
                        `SELECT animal_order, subtotal FROM order_items WHERE order_id = $1`,
                        [order.id]
                    );
                    for (const item of itemsResult.rows) {
                        await client.query(
                            `UPDATE session_animals 
                             SET sold_amount = sold_amount + $1
                             WHERE session_id = $2 AND animal_order = $3`,
                            [item.subtotal, order.session_id, item.animal_order]
                        );
                    }
                    console.log('🔄 Order was expired, re-added sold_amount:', order.id);
                }

                await client.query('COMMIT');

                console.log('💰 Order paid via webhook:', order.id);

                // Cache + SSE (after commit, outside transaction)
                const { cache } = require('../services/redis');
                await cache.del(`session_animals:${order.session_id}`);

                const { pushOrderStatus } = require('../services/orderSse');
                pushOrderStatus(order.id, 'paid');
            } else {
                // Payment failed/cancelled — only process if still pending
                if (order.status === 'pending') {
                    await client.query(
                        `UPDATE orders SET status = 'cancelled' WHERE id = $1`,
                        [order.id]
                    );

                    // Rollback sold_amount within same transaction
                    const itemsResult = await client.query(
                        `SELECT animal_order, subtotal FROM order_items WHERE order_id = $1`,
                        [order.id]
                    );
                    for (const item of itemsResult.rows) {
                        await client.query(
                            `UPDATE session_animals 
                             SET sold_amount = GREATEST(sold_amount - $1, 0)
                             WHERE session_id = $2 AND animal_order = $3`,
                            [item.subtotal, order.session_id, item.animal_order]
                        );
                    }

                    await client.query('COMMIT');

                    console.log('Order cancelled:', order.id, desc);

                    // Cache + SSE (after commit)
                    const { cache } = require('../services/redis');
                    await cache.del(`session_animals:${order.session_id}`);

                    const { pushOrderStatus } = require('../services/orderSse');
                    pushOrderStatus(order.id, 'cancelled');
                } else {
                    await client.query('ROLLBACK');
                }
            }

            res.json({ success: true });
        } catch (innerError) {
            await client.query('ROLLBACK');
            throw innerError;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('PayOS webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

/**
 * Rollback sold_amount when order cancelled/expired
 */
async function rollbackOrderLimits(orderId) {
    try {
        // Get order items
        const itemsResult = await db.query(
            `SELECT oi.animal_order, oi.subtotal, o.session_id
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE oi.order_id = $1`,
            [orderId]
        );

        if (itemsResult.rows.length === 0) return;

        const sessionId = itemsResult.rows[0].session_id;

        // Rollback each item
        for (const item of itemsResult.rows) {
            await db.query(
                `UPDATE session_animals 
         SET sold_amount = GREATEST(sold_amount - $1, 0)
         WHERE session_id = $2 AND animal_order = $3`,
                [item.subtotal, sessionId, item.animal_order]
            );
        }

        console.log('Rolled back limits for order:', orderId);
    } catch (error) {
        console.error('Rollback limits error:', error);
    }
}

module.exports = router;
module.exports.rollbackOrderLimits = rollbackOrderLimits;
