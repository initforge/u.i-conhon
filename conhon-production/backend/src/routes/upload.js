/**
 * File Upload Routes
 * Handle image uploads for Cau Thai and other assets
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/app/uploads';
const CAU_THAI_DIR = path.join(UPLOAD_DIR, 'cau-thai');

// Create directories if they don't exist
[UPLOAD_DIR, CAU_THAI_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, CAU_THAI_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

/**
 * POST /upload/cau-thai - Upload cau thai image
 * Requires admin authentication
 */
router.post('/cau-thai', authenticate, requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không có file được upload' });
        }

        // Return the public URL path
        const imageUrl = `/uploads/cau-thai/${req.file.filename}`;

        res.json({
            success: true,
            imageUrl,
            filename: req.file.filename,
            size: req.file.size
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload thất bại' });
    }
});

/**
 * DELETE /upload/cau-thai/:filename - Delete uploaded file
 */
router.delete('/cau-thai/:filename', authenticate, requireAdmin, (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(CAU_THAI_DIR, filename);

        // Security: ensure file is in the correct directory
        if (!filePath.startsWith(CAU_THAI_DIR)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'File không tồn tại' });
        }
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: 'Xóa file thất bại' });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File quá lớn (tối đa 5MB)' });
        }
        return res.status(400).json({ error: error.message });
    }
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
});

module.exports = router;
