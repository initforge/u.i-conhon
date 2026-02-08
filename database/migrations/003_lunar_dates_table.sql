-- Migration: Create lunar_dates table
-- Stores lunar label per date globally (all Thais, all khung giờ)

CREATE TABLE IF NOT EXISTS lunar_dates (
    date DATE PRIMARY KEY,
    lunar_label TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Backfill from existing sessions that have lunar_label
INSERT INTO lunar_dates (date, lunar_label)
SELECT DISTINCT session_date, lunar_label
FROM sessions
WHERE lunar_label IS NOT NULL AND lunar_label != ''
ON CONFLICT (date) DO NOTHING;
