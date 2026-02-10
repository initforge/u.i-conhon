/**
 * SSE Routes - Server-Sent Events endpoint
 * Real-time push updates for switch changes
 */

const express = require('express');
const { addClient, removeClient } = require('../services/sse');

const router = express.Router();

/**
 * GET /sse/switches - SSE endpoint for switch updates
 * Clients connect here to receive real-time updates
 */
router.get('/switches', (req, res) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Send initial connection message
    res.write('event: connected\n');
    res.write(`data: ${JSON.stringify({ message: 'SSE connected', timestamp: Date.now() })}\n\n`);

    // Flush headers immediately so client receives the connection
    res.flushHeaders();

    // Register client
    addClient(res);

    // Keep connection alive with heartbeat every 30s
    const heartbeat = setInterval(() => {
        try {
            res.write('event: heartbeat\n');
            res.write(`data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
        } catch (err) {
            clearInterval(heartbeat);
        }
    }, 30000);

    // Clean up on disconnect
    req.on('close', () => {
        clearInterval(heartbeat);
        removeClient(res);
    });
});

module.exports = router;
