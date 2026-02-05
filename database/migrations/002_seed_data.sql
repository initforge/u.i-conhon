-- ================================================
-- CỔ NHƠN - SEED DATA
-- Theo SPECS.md Section 6.9: Settings defaults
-- ================================================

-- ================================================
-- Admin user mặc định (SPECS 6.0)
-- Password: admin123 (bcrypt hash)
-- ================================================
INSERT INTO users (phone, password_hash, name, role) VALUES
('admin', '$2a$10$rKN7/Zr.FY.O6.QlJ1HXl.qYYHvX3w8Vf7.ZG6K4kFZ4L7pCHXcLK', 'Administrator', 'admin');

-- ================================================
-- Settings defaults (SPECS 6.9)
-- ================================================
INSERT INTO settings (key, value) VALUES
-- Master Switch
('master_switch', 'true'),
('maintenance_message', '"Hệ thống Cổ Nhơn đang trong mùa nghỉ. Hẹn gặp lại vào Tết năm sau!"'),

-- Thai toggles
('thai_an_nhon_enabled', 'true'),
('thai_nhon_phong_enabled', 'true'),
('thai_hoai_nhon_enabled', 'true'),

-- Chế độ Tết
('tet_mode', 'false'),

-- Schedules (start_time, close_time) - SPECS 6.9
('schedule_an_nhon', '{
  "slot1": {"start_time": "07:00", "close_time": "10:30"},
  "slot2": {"start_time": "12:00", "close_time": "16:30"},
  "slot3": {"start_time": "18:00", "close_time": "20:30"}
}'),
('schedule_nhon_phong', '{
  "slot1": {"start_time": "07:00", "close_time": "10:30"},
  "slot2": {"start_time": "12:00", "close_time": "16:30"}
}'),
('schedule_hoai_nhon', '{
  "slot1": {"start_time": "09:00", "close_time": "12:30"},
  "slot2": {"start_time": "14:00", "close_time": "18:30"}
}');

-- ================================================
-- Sample community posts
-- ================================================
INSERT INTO community_posts (thai_id, youtube_id, title, content, is_pinned) VALUES
('an-nhon', 'dQw4w9WgXcQ', 'Video hướng dẫn chơi Cổ Nhơn', 'Hướng dẫn cơ bản cách chơi trò Cổ Nhơn truyền thống Bình Định', true),
('nhon-phong', 'dQw4w9WgXcQ', 'Lịch sử Cổ Nhơn Nhơn Phong', 'Tìm hiểu về nguồn gốc và lịch sử lâu đời của trò chơi', false),
('hoai-nhon', 'dQw4w9WgXcQ', 'Mùa Tết 2026 - Hoài Nhơn', 'Không khí Tết 2026 tại Hoài Nhơn', false);
