/**
 * Order SSE Service - Per-order Server-Sent Events
 * Allows clients to subscribe to status updates for a specific order.
 * When webhook confirms payment, we push the update to the subscriber.
 */

// Map of orderId -> Set of SSE response objects
const orderClients = new Map();

/**
 * Subscribe a client to order status updates
 * @param {string} orderId
 * @param {Object} res - Express response object (SSE stream)
 */
function subscribe(orderId, res) {
    if (!orderClients.has(orderId)) {
        orderClients.set(orderId, new Set());
    }
    orderClients.get(orderId).add(res);
    console.log(`[OrderSSE] Client subscribed to order ${orderId}. Active: ${orderClients.get(orderId).size}`);
}

/**
 * Unsubscribe a client from order status updates
 * @param {string} orderId
 * @param {Object} res
 */
function unsubscribe(orderId, res) {
    const clients = orderClients.get(orderId);
    if (clients) {
        clients.delete(res);
        if (clients.size === 0) {
            orderClients.delete(orderId);
        }
        console.log(`[OrderSSE] Client unsubscribed from order ${orderId}. Remaining: ${clients?.size || 0}`);
    }
}

/**
 * Push a status update to all subscribers of an order
 * @param {string} orderId
 * @param {string} status - new order status (paid, cancelled, expired)
 * @param {Object} extra - optional extra data
 */
function pushOrderStatus(orderId, status, extra = {}) {
    const clients = orderClients.get(orderId);
    if (!clients || clients.size === 0) {
        console.log(`[OrderSSE] No subscribers for order ${orderId}`);
        return;
    }

    const message = `event: order_status\ndata: ${JSON.stringify({ orderId, status, ...extra })}\n\n`;

    clients.forEach(client => {
        try {
            client.write(message);
        } catch (err) {
            console.error('[OrderSSE] Write error:', err);
            unsubscribe(orderId, client);
        }
    });

    console.log(`[OrderSSE] Pushed status=${status} for order ${orderId} to ${clients.size} clients`);

    // Auto-cleanup after terminal status (paid/cancelled/expired)
    if (['paid', 'cancelled', 'expired'].includes(status)) {
        setTimeout(() => {
            const remaining = orderClients.get(orderId);
            if (remaining) {
                remaining.forEach(client => {
                    try { client.end(); } catch { }
                });
                orderClients.delete(orderId);
            }
        }, 5000); // Give client 5s to process before closing
    }
}

module.exports = {
    subscribe,
    unsubscribe,
    pushOrderStatus,
};
