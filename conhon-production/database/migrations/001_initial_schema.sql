-- ================================================
-- CỔ NHƠN DATABASE SCHEMA - Initial Migration
-- Theo SPECS.md Section 3: Kiến trúc dữ liệu
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- Bảng `users` (SPECS 3.2)
-- ================================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone           VARCHAR(15) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(100),
  zalo            VARCHAR(100),
  bank_code       VARCHAR(20),
  bank_account    VARCHAR(30),
  bank_holder     VARCHAR(100),
  role            VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  completed_tasks TEXT[] DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Index for login
CREATE INDEX idx_users_phone ON users(phone);

-- ================================================
-- Bảng `sessions` ⭐ Core (SPECS 3.2)
-- ================================================
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thai_id         VARCHAR(20) NOT NULL,
  session_type    VARCHAR(20) NOT NULL CHECK (session_type IN ('morning', 'afternoon', 'evening')),
  session_date    DATE NOT NULL,
  lunar_label     VARCHAR(50),
  
  -- Lifecycle
  status          VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'open', 'closed', 'resulted')),
  opens_at        TIMESTAMP,
  closes_at       TIMESTAMP,
  result_at       TIMESTAMP,
  
  -- Kết quả (sau xổ)
  winning_animal  INT,
  cau_thai        TEXT,
  cau_thai_image  VARCHAR(255),
  result_image    VARCHAR(255),
  
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(thai_id, session_date, session_type)
);

-- Index for live sessions
CREATE INDEX idx_sessions_live ON sessions(thai_id, status) 
  WHERE status IN ('open', 'scheduled');
CREATE INDEX idx_sessions_date ON sessions(session_date);

-- ================================================
-- Bảng `session_animals` - Hạn mức live (SPECS 3.2)
-- ================================================
CREATE TABLE session_animals (
  session_id      UUID REFERENCES sessions(id) ON DELETE CASCADE,
  animal_order    INT NOT NULL CHECK (animal_order >= 1 AND animal_order <= 40),
  limit_amount    BIGINT DEFAULT 5000000,
  sold_amount     BIGINT DEFAULT 0,
  is_banned       BOOLEAN DEFAULT false,
  ban_reason      VARCHAR(200),
  PRIMARY KEY (session_id, animal_order)
);

-- ================================================
-- Bảng `orders` (SPECS 3.2)
-- ================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id      UUID REFERENCES sessions(id),
  user_id         UUID REFERENCES users(id),
  total           BIGINT NOT NULL,
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'won', 'lost', 'cancelled', 'expired')),
  payment_code    VARCHAR(50),
  payment_url     VARCHAR(500),
  payment_expires TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  paid_at         TIMESTAMP
);

-- Indexes
CREATE INDEX idx_orders_session ON orders(session_id);
CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

-- ================================================
-- Bảng `order_items` (SPECS 3.2)
-- ================================================
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
  animal_order    INT NOT NULL,
  animal_name     VARCHAR(50),  -- Denormalized for easy display
  quantity        INT NOT NULL,
  unit_price      INT NOT NULL,
  subtotal        BIGINT NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ================================================
-- Bảng `community_posts` (SPECS 3.2)
-- ================================================
CREATE TABLE community_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thai_id         VARCHAR(20),
  youtube_id      VARCHAR(20),
  title           VARCHAR(200),
  content         TEXT,
  like_count      INT DEFAULT 0,
  is_pinned       BOOLEAN DEFAULT false,
  is_approved     BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_community_posts_thai ON community_posts(thai_id);

-- ================================================
-- Bảng `community_comments` (SPECS 3.2)
-- ================================================
CREATE TABLE community_comments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id),
  user_name       VARCHAR(100),
  user_phone      VARCHAR(20),
  content         TEXT,
  is_approved     BOOLEAN DEFAULT false,
  is_banned       BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_community_comments_post ON community_comments(post_id);

-- ================================================
-- Bảng `cau_thai_images` (SPECS 6.5)
-- ================================================
CREATE TABLE cau_thai_images (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thai_id         VARCHAR(20) NOT NULL,
  year            INT NOT NULL,
  image_url       VARCHAR(500),
  title           VARCHAR(200),
  lunar_label     VARCHAR(100),
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cau_thai_thai_year ON cau_thai_images(thai_id, year);

-- ================================================
-- Bảng `settings` (SPECS 6.9)
-- ================================================
CREATE TABLE settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key             VARCHAR(100) UNIQUE NOT NULL,
  value           JSONB,
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- Bảng `post_likes` (Track user likes)
-- ================================================
CREATE TABLE post_likes (
  post_id         UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);
