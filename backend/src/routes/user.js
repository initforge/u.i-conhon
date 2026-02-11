/**
 * User Routes - Profile management
 * Theo SPECS.md Section 5.6
 */

const express = require('express');
const db = require('../services/database');
const { authenticate, invalidateUserCache } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * PATCH /users/me - Update profile (SPECS 5.6)
 */
router.patch('/me', async (req, res) => {
    try {
        const { name, zalo, bank_code, bank_account, bank_holder } = req.body;

        const result = await db.query(
            `UPDATE users 
       SET name = COALESCE($1, name),
           zalo = COALESCE($2, zalo),
           bank_code = COALESCE($3, bank_code),
           bank_account = COALESCE($4, bank_account),
           bank_holder = COALESCE($5, bank_holder)
       WHERE id = $6
       RETURNING id, phone, name, zalo, bank_code, bank_account, bank_holder`,
            [name, zalo, bank_code, bank_account, bank_holder, req.user.id]
        );

        await invalidateUserCache(req.user.id);
        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Không thể cập nhật thông tin' });
    }
});

/**
 * POST /users/complete-task - Complete MXH task (SPECS 4.4)
 */
router.post('/complete-task', async (req, res) => {
    try {
        const { taskId } = req.body;
        // Frontend uses task-1 through task-6 (see SOCIAL_TASKS in types/index.ts)
        const validTasks = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6'];

        if (!validTasks.includes(taskId)) {
            return res.status(400).json({ error: 'Task không hợp lệ' });
        }

        // Add task to completed_tasks array if not exists
        const result = await db.query(
            `UPDATE users 
       SET completed_tasks = array_append(
         CASE WHEN $1 = ANY(completed_tasks) THEN completed_tasks 
              ELSE completed_tasks END,
         CASE WHEN $1 = ANY(completed_tasks) THEN NULL ELSE $1 END
       )
       WHERE id = $2
       RETURNING completed_tasks`,
            [taskId, req.user.id]
        );

        // Simpler approach: just add if not exists
        await db.query(
            `UPDATE users 
       SET completed_tasks = CASE 
         WHEN $1 = ANY(completed_tasks) THEN completed_tasks
         ELSE array_append(completed_tasks, $1)
       END
       WHERE id = $2`,
            [taskId, req.user.id]
        );

        const updated = await db.query(
            'SELECT completed_tasks FROM users WHERE id = $1',
            [req.user.id]
        );

        await invalidateUserCache(req.user.id);

        res.json({
            completed_tasks: updated.rows[0].completed_tasks,
            message: `Đã hoàn thành nhiệm vụ: ${taskId}`
        });
    } catch (error) {
        console.error('Complete task error:', error);
        res.status(500).json({ error: 'Không thể hoàn thành nhiệm vụ' });
    }
});

module.exports = router;
