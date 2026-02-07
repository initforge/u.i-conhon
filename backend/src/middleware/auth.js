/**
 * Auth Middleware - JWT Verification
 * Theo SPECS.md Section 4
 */

const jwt = require('jsonwebtoken');
const db = require('../services/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token không hợp lệ' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from database
        const result = await db.query(
            'SELECT id, phone, name, role, completed_tasks FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'User không tồn tại' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token đã hết hạn' });
        }
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

/**
 * Check if user is admin
 */
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
    next();
};

/**
 * Check if user completed MXH tasks (SPECS 4.4)
 */
const requireMXHCompleted = (req, res, next) => {
    const requiredTasks = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6'];
    const completedTasks = req.user?.completed_tasks || [];

    const allCompleted = requiredTasks.every(task => completedTasks.includes(task));

    if (!allCompleted) {
        return res.status(403).json({
            error: 'Vui lòng hoàn thành nhiệm vụ MXH trước khi mua hàng',
            completed: completedTasks,
            required: requiredTasks
        });
    }
    next();
};

module.exports = {
    authenticate,
    requireAdmin,
    requireMXHCompleted
};
