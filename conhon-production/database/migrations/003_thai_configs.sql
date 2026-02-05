-- ================================================
-- CỔ NHƠN - Thai Configs Migration
-- Store Thai time slots configuration in settings table
-- ================================================

-- Insert default Thai configs (matching current hardcoded THAIS in frontend)
INSERT INTO settings (key, value) VALUES (
    'thai_configs',
    '[
        {
            "id": "thai-an-nhon",
            "name": "Thai An Nhơn",
            "slug": "an-nhon",
            "times": ["11:00", "17:00", "21:00"],
            "timeSlots": [
                {"startTime": "07:00", "endTime": "10:30"},
                {"startTime": "12:00", "endTime": "16:30"},
                {"startTime": "18:00", "endTime": "20:30"}
            ],
            "isTetMode": false,
            "description": "Khu vực An Nhơn - Bình Định",
            "isOpen": true
        },
        {
            "id": "thai-nhon-phong",
            "name": "Thai Nhơn Phong",
            "slug": "nhon-phong",
            "times": ["11:00", "17:00"],
            "timeSlots": [
                {"startTime": "07:00", "endTime": "10:30"},
                {"startTime": "12:00", "endTime": "16:30"}
            ],
            "isTetMode": false,
            "description": "Khu vực Nhơn Phong",
            "isOpen": true
        },
        {
            "id": "thai-hoai-nhon",
            "name": "Thai Hoài Nhơn",
            "slug": "hoai-nhon",
            "times": ["13:00", "19:00"],
            "timeSlots": [
                {"startTime": "09:00", "endTime": "12:30"},
                {"startTime": "14:00", "endTime": "18:30"}
            ],
            "isTetMode": false,
            "description": "Khu vực Hoài Nhơn",
            "isOpen": true
        }
    ]'::jsonb
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
