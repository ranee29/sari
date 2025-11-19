-- Insert Script for User Profiles
-- Run this after running the migration to populate users table
-- Make sure to run the migrate-users-table.sql first!

-- Insert the customer user (from your previous curl response)
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '1b53e88e-7aaf-4068-9e54-2420e41c9ebc',
  'raneedanielongeng@gmail.com',
  'Ranee Daniel Ong Eng',
  NULL,
  'customer',
  '2025-11-18 00:42:26.581267Z',
  '2025-11-18 00:42:26.581267Z'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Insert the admin user (from your curl response)
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  'b119ecf9-cea0-4940-8ea8-47799501f817',
  'admin@gmail.com',
  'Admin User',  -- Using generic name since full_name is not in metadata
  NULL,
  'admin',
  '2025-11-18 03:15:40.541716Z',
  '2025-11-18T03:16:42.21747Z'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Verify the users were inserted correctly
SELECT
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM users
WHERE id IN ('1b53e88e-7aaf-4068-9e54-2420e41c9ebc', 'b119ecf9-cea0-4940-8ea8-47799501f817');