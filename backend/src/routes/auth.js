/**
 * Auth Routes - Login & Register
 * Theo SPECS.md Section 4.2, 4.3
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../services/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '7d';

/**
 * POST /auth/register - Đăng ký (SPECS 4.3)
 */
router.post('/register', async (req, res) => {
    try {
        const { phone, password, name, zalo, bank_code, bank_account, bank_holder } = req.body;

        // Validation
        if (!phone || !password || !name || !zalo) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        if (!/^[0-9]{10,11}$/.test(phone)) {
            return res.status(400).json({ error: 'Số điện thoại không hợp lệ' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        // Check if phone exists (only non-deleted users)
        const existing = await db.query(
            'SELECT id FROM users WHERE phone = $1 AND (is_deleted = false OR is_deleted IS NULL)',
            [phone]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Số điện thoại đã được sử dụng' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user (with optional bank info)
        const result = await db.query(
            `INSERT INTO users (phone, password_hash, name, zalo, bank_code, bank_account, bank_holder) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, phone, name, role, completed_tasks, bank_code, bank_account, bank_holder`,
            [phone, password_hash, name, zalo, bank_code || null, bank_account || null, bank_holder || null]
        );

        const user = result.rows[0];

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: user.role,
                bank_code: user.bank_code,
                bank_account: user.bank_account,
                bank_holder: user.bank_holder,
                completed_tasks: user.completed_tasks
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    }
});

/**
 * POST /auth/login - Đăng nhập (SPECS 4.2)
 */
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({ error: 'Vui lòng nhập SĐT và mật khẩu' });
        }

        // Find user (exclude soft-deleted)
        const result = await db.query(
            `SELECT id, phone, password_hash, name, role, completed_tasks, 
              bank_code, bank_account, bank_holder, zalo
       FROM users WHERE phone = $1 AND (is_deleted = false OR is_deleted IS NULL)`,
            [phone]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'SĐT hoặc mật khẩu không đúng' });
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'SĐT hoặc mật khẩu không đúng' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                role: user.role,
                zalo: user.zalo,
                bank_code: user.bank_code,
                bank_account: user.bank_account,
                bank_holder: user.bank_holder,
                completed_tasks: user.completed_tasks
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    }
});

/**
 * GET /auth/me - Get current user
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, phone, name, role, zalo, 
              bank_code, bank_account, bank_holder, completed_tasks
       FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});

module.exports = router;
