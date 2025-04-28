-- COMPLETE DATABASE RESET & SETUP
-- Run this in the Supabase SQL editor to completely reset your order_placed table

-- First, drop the existing table if it exists (CAUTION: this deletes ALL data)
DROP TABLE IF EXISTS public.order_placed;

-- Create the table with all required fields
CREATE TABLE public.order_placed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  shipping_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a comment to the table for documentation
COMMENT ON TABLE public.order_placed IS 'Table to store customer orders';

-- DISABLE Row Level Security completely for this demo application
ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY;

-- Insert a test record to verify the table works
INSERT INTO public.order_placed (
  user_id, 
  user_name,
  email,
  product,
  price,
  size,
  quantity,
  shipping_address,
  status
) VALUES (
  'test_user',
  'Test User',
  'test@example.com',
  'TEST_PRODUCT',
  9.99,
  'M',
  1,
  '123 Test Street, Test City',
  'pending'
);

-- Verify the record was inserted
SELECT * FROM public.order_placed;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Order_placed table has been reset and set up successfully!';
  RAISE NOTICE 'Row Level Security (RLS) has been DISABLED for simpler testing.';
END $$; 