-- Migration Script: Update users table for Supabase Auth compatibility
-- Run this in your Supabase SQL Editor to fix the users table schema

-- Option 1: Make password_hash nullable (Recommended)
-- This allows existing records to work and maintains the field for any future use
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Option 2: Remove password_hash column completely (Alternative)
-- Uncomment the line below if you prefer to remove the field entirely
-- ALTER TABLE users DROP COLUMN password_hash;

-- Add the user profile that's missing for your existing user
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  '1b53e88e-7aaf-4068-9e54-2420e41c9ebc',
  'raneedanielongeng@gmail.com',
  'Ranee Daniel Ong Eng',
  'customer',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify the user was inserted
SELECT * FROM users WHERE id = '1b53e88e-7aaf-4068-9e54-2420e41c9ebc';