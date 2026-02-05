/**
 * SSE Service - Server-Sent Events for real-time updates
 * Push switch changes to all connected clients
 */

// Store all connected clients
const clients = new Set();

/**
 * Add a new SSE client connection
 * @param {Object} res - Express response object
 */
function addClient(res) {
    clients.add(res);
    console.log(`SSE client connected. Total: ${clients.size}`);
}

/**
 * Remove a client connection
 * @param {Object} res - Express response object
 */
function removeClient(res) {
    clients.delete(res);
    console.log(`SSE client disconnected. Total: ${clients.size}`);
}

/**
 * Broadcast event to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
function broadcast(event, data) {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

    clients.forEach(client => {
        try {
            client.write(message);
        } catch (err) {
            console.error('SSE write error:', err);
            removeClient(client);
        }
    });

    console.log(`SSE broadcast [${event}] to ${clients.size} clients`);
}

/**
 * Get current connection count
 */
function getConnectionCount() {
    return clients.size;
}

module.exports = {
    addClient,
    removeClient,
    broadcast,
    getConnectionCount
};
