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

        // Find order by payment_code
        const orderResult = await db.query(
            'SELECT id, status, session_id FROM orders WHERE payment_code = $1',
            [String(orderCode)]
        );

        if (orderResult.rows.length === 0) {
            console.warn('Order not found for orderCode:', orderCode);
            return res.status(200).json({ success: true, message: 'Order not found (ignored)' });
        }

        const order = orderResult.rows[0];
        console.log('📦 Order found:', order.id, 'current status:', order.status);

        // Idempotent check - only skip if already in terminal success state
        if (['paid', 'won', 'lost'].includes(order.status)) {
            console.log('✅ Order already paid/processed:', order.id);
            return res.json({ success: true, message: 'Already processed' });
        }

        // Payment successful
        if (code === '00') {
            // If order was auto-expired, we need to re-add sold_amount
            const wasExpired = order.status === 'expired';

            await db.query(
                `UPDATE orders SET status = 'paid', paid_at = NOW() WHERE id = $1`,
                [order.id]
            );

            if (wasExpired) {
                // Re-add sold_amount that was rolled back during expiration
                const itemsResult = await db.query(
                    `SELECT animal_order, subtotal FROM order_items WHERE order_id = $1`,
                    [order.id]
                );
                for (const item of itemsResult.rows) {
                    await db.query(
                        `UPDATE session_animals 
                         SET sold_amount = sold_amount + $1
                         WHERE session_id = $2 AND animal_order = $3`,
                        [item.subtotal, order.session_id, item.animal_order]
                    );
                }
                console.log('🔄 Order was expired, re-added sold_amount:', order.id);
            }

            console.log('💰 Order paid via webhook:', order.id);

            // Push SSE event to listening clients
            const { pushOrderStatus } = require('../services/orderSse');
            pushOrderStatus(order.id, 'paid');
        } else {
            // Payment failed/cancelled - only process if still pending
            if (order.status === 'pending') {
                await db.query(
                    `UPDATE orders SET status = 'cancelled' WHERE id = $1`,
                    [order.id]
                );
                console.log('Order cancelled:', order.id, desc);

                // Rollback sold_amount
                await rollbackOrderLimits(order.id);

                // Push SSE event to listening clients
                const { pushOrderStatus } = require('../services/orderSse');
                pushOrderStatus(order.id, 'cancelled');
            }
        }

        res.json({ success: true });
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
