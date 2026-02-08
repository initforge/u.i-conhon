-- Migration: Add UNIQUE constraint to prevent duplicate sessions
-- Run on VPS: docker compose exec db psql -U conhon -d conhon -f /tmp/migration.sql

-- Add UNIQUE constraint for session identity (thai_id + date + session_type)
ALTER TABLE sessions 
ADD CONSTRAINT sessions_unique_thai_date_type 
UNIQUE (thai_id, session_date, session_type);
