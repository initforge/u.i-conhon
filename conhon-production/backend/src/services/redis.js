/**
 * Redis Service
 * Cung cấp caching và rate limiting cho hệ thống
 */

const Redis = require('ioredis');

// Redis client singleton
let client = null;
let isConnected = false;

/**
 * Khởi tạo kết nối Redis
 */
function initRedis() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
        client = new Redis(redisUrl, {
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            // Timeout settings
            connectTimeout: 10000,
            commandTimeout: 5000,
        });

        client.on('connect', () => {
            isConnected = true;
            console.log('✅ Redis connected successfully');
        });

        client.on('error', (err) => {
            isConnected = false;
            console.error('❌ Redis connection error:', err.message);
        });

        client.on('close', () => {
            isConnected = false;
            console.log('⚠️ Redis connection closed');
        });

        // Attempt connection
        client.connect().catch(err => {
            console.error('Redis initial connection failed:', err.message);
        });

        return client;
    } catch (error) {
        console.error('Failed to initialize Redis:', error);
        return null;
    }
}

/**
 * Lấy Redis client
 */
function getClient() {
    if (!client) {
        initRedis();
    }
    return client;
}

/**
 * Kiểm tra trạng thái kết nối
 */
function isReady() {
    return isConnected && client?.status === 'ready';
}

/**
 * Cache helpers
 */
const cache = {
    /**
     * Lấy dữ liệu từ cache
     * @param {string} key 
     * @returns {Promise<any|null>}
     */
    async get(key) {
        if (!isReady()) return null;
        try {
            const data = await client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    /**
     * Lưu dữ liệu vào cache
     * @param {string} key 
     * @param {any} value 
     * @param {number} ttlSeconds - Thời gian sống (giây)
     */
    async set(key, value, ttlSeconds = 300) {
        if (!isReady()) return false;
        try {
            await client.setex(key, ttlSeconds, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    },

    /**
     * Xóa cache theo key
     * @param {string} key 
     */
    async del(key) {
        if (!isReady()) return false;
        try {
            await client.del(key);
            return true;
        } catch (error) {
            console.error('Cache delete error:', error);
            return false;
        }
    },

    /**
     * Xóa cache theo pattern
     * @param {string} pattern - VD: "session:*"
     */
    async delPattern(pattern) {
        if (!isReady()) return false;
        try {
            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(...keys);
            }
            return true;
        } catch (error) {
            console.error('Cache delete pattern error:', error);
            return false;
        }
    }
};

/**
 * Session cache - Cache dữ liệu phiên xổ
 */
const sessionCache = {
    /**
     * Cache session snapshot
     * @param {string} sessionId 
     * @param {object} data 
     */
    async cacheSession(sessionId, data) {
        return cache.set(`session:${sessionId}`, data, 60); // 1 phút
    },

    /**
     * Lấy session từ cache
     * @param {string} sessionId 
     */
    async getSession(sessionId) {
        return cache.get(`session:${sessionId}`);
    },

    /**
     * Invalidate session cache
     * @param {string} sessionId 
     */
    async invalidate(sessionId) {
        return cache.del(`session:${sessionId}`);
    },

    /**
     * Invalidate tất cả session cache
     */
    async invalidateAll() {
        return cache.delPattern('session:*');
    }
};

/**
 * Rate limiting helpers
 */
const rateLimiter = {
    /**
     * Kiểm tra và tăng counter
     * @param {string} key - VD: "rate:ip:192.168.1.1"
     * @param {number} limit - Số request tối đa
     * @param {number} windowSeconds - Cửa sổ thời gian (giây)
     * @returns {Promise<{allowed: boolean, remaining: number}>}
     */
    async check(key, limit, windowSeconds) {
        if (!isReady()) {
            return { allowed: true, remaining: limit }; // Cho phép nếu Redis down
        }

        try {
            const current = await client.incr(key);

            if (current === 1) {
                await client.expire(key, windowSeconds);
            }

            return {
                allowed: current <= limit,
                remaining: Math.max(0, limit - current)
            };
        } catch (error) {
            console.error('Rate limiter error:', error);
            return { allowed: true, remaining: limit };
        }
    }
};

module.exports = {
    initRedis,
    getClient,
    isReady,
    cache,
    sessionCache,
    rateLimiter
};
