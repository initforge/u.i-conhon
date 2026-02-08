/**
 * CauThai Routes - Câu thai images API
 * GET /cau-thai - Public, lấy danh sách câu thai
 */

const express = require('express');
const db = require('../services/database');
const router = express.Router();

/**
 * GET /cau-thai - Get câu thai images
 * Query params: thai_id (optional), year (optional), limit (default 10)
 */
router.get('/', async (req, res) => {
    try {
        const { thai_id, year, limit = 10 } = req.query;
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

        params.push(parseInt(limit) || 10);

        const result = await db.query(
            `SELECT id, thai_id, image_url, description, created_at, is_active, khung_id
             FROM cau_thai_images 
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT $${params.length}`,
            params
        );

        res.json({
            cauThais: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Get cau thai error:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách câu thai' });
    }
});

/**
 * GET /cau-thai/today - Get today's câu thai for each thai
 */
router.get('/today', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT DISTINCT ON (thai_id) 
               id, thai_id, image_url, description, created_at, is_active
             FROM cau_thai_images 
             WHERE is_active = true
             ORDER BY thai_id, created_at DESC`
        );

        res.json({
            cauThais: result.rows
        });
    } catch (error) {
        console.error('Get today cau thai error:', error);
        res.status(500).json({ error: 'Không thể lấy câu thai hôm nay' });
    }
});

module.exports = router;
