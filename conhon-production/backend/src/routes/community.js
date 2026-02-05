/**
 * Community Routes - Posts, likes, comments
 * Theo SPECS.md Section 5.5
 */

const express = require('express');
const db = require('../services/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /community/posts - Get posts for a Thai with pagination (SPECS 5.5)
 */
router.get('/posts', async (req, res) => {
    try {
        const { thai_id, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let baseWhere = 'WHERE is_approved = true';
        const params = [];
        let paramIndex = 1;

        if (thai_id) {
            baseWhere += ` AND thai_id = $${paramIndex}`;
            params.push(thai_id);
            paramIndex++;
        }

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM community_posts ${baseWhere}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated data
        const dataParams = [...params, parseInt(limit), offset];
        const result = await db.query(
            `SELECT id, thai_id, youtube_id, title, content, like_count, is_pinned, created_at
             FROM community_posts
             ${baseWhere}
             ORDER BY is_pinned DESC, created_at DESC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            dataParams
        );

        // Enrich posts with comments
        const posts = await Promise.all(result.rows.map(async (post) => {
            const commentsResult = await db.query(
                `SELECT id, user_name, content, created_at
                 FROM community_comments 
                 WHERE post_id = $1 AND is_banned = false
                 ORDER BY created_at ASC
                 LIMIT 50`,
                [post.id]
            );
            return {
                ...post,
                comments: commentsResult.rows
            };
        }));

        res.json({
            posts,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            hasMore: offset + result.rows.length < total
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách bài viết' });
    }
});


/**
 * GET /community/posts/:id - Get post with comments
 */
router.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const postResult = await db.query(
            `SELECT id, thai_id, youtube_id, title, content, like_count, is_pinned, created_at
       FROM community_posts WHERE id = $1`,
            [id]
        );

        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        const commentsResult = await db.query(
            `SELECT id, user_name, content, created_at
       FROM community_comments 
       WHERE post_id = $1 AND is_banned = false
       ORDER BY created_at DESC
       LIMIT 50`,
            [id]
        );

        res.json({
            post: postResult.rows[0],
            comments: commentsResult.rows
        });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Không thể lấy bài viết' });
    }
});

/**
 * POST /community/posts/:id/like - Toggle like (SPECS 5.5)
 */
router.post('/posts/:id/like', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if already liked
        const existingLike = await db.query(
            'SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2',
            [id, userId]
        );

        if (existingLike.rows.length > 0) {
            // Unlike
            await db.query(
                'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
                [id, userId]
            );
            await db.query(
                'UPDATE community_posts SET like_count = like_count - 1 WHERE id = $1',
                [id]
            );
            res.json({ liked: false, message: 'Đã bỏ thích' });
        } else {
            // Like
            await db.query(
                'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
                [id, userId]
            );
            await db.query(
                'UPDATE community_posts SET like_count = like_count + 1 WHERE id = $1',
                [id]
            );
            res.json({ liked: true, message: 'Đã thích' });
        }
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Không thể thực hiện' });
    }
});

/**
 * POST /community/posts/:id/comments - Add comment (SPECS 5.5)
 * Max 3 comments per user per post
 */
router.post('/posts/:id/comments', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const user = req.user;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Nội dung không được trống' });
        }

        if (content.length > 500) {
            return res.status(400).json({ error: 'Bình luận tối đa 500 ký tự' });
        }

        // Check comment limit (SPECS: max 3 comments/user/post)
        const countResult = await db.query(
            'SELECT COUNT(*) FROM community_comments WHERE post_id = $1 AND user_id = $2',
            [id, user.id]
        );

        if (parseInt(countResult.rows[0].count) >= 3) {
            return res.status(400).json({
                error: 'Bạn đã đạt giới hạn 3 bình luận cho video này'
            });
        }

        // Get user info for denormalization
        const userResult = await db.query(
            'SELECT name, phone FROM users WHERE id = $1',
            [user.id]
        );

        // Insert comment
        const result = await db.query(
            `INSERT INTO community_comments (post_id, user_id, user_name, user_phone, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_name, content, created_at`,
            [id, user.id, userResult.rows[0].name, userResult.rows[0].phone, content.trim()]
        );

        res.status(201).json({
            comment: result.rows[0],
            message: 'Bình luận đã được gửi'
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Không thể gửi bình luận' });
    }
});

module.exports = router;
