# Quick Setup: Supabase Table Creation

Follow these simple steps to create the required table in Supabase:

## Step 1: Log into Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Sign in to your account
3. Select your project

## Step 2: Open SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click the "+" button to create a new query

## Step 3: Create the order_placed Table

Copy and paste this exact SQL code:

```sql
-- Create order_placed table
CREATE TABLE IF NOT EXISTS public.order_placed (
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

-- Make it accessible to the application
ALTER TABLE public.order_placed ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy (allows all operations)
CREATE POLICY "allow_all" 
ON public.order_placed 
USING (true) 
WITH CHECK (true);
```

4. Click the "Run" button (green play button)

## Step 4: Verify the Table Was Created

1. Go to "Table Editor" in the left sidebar
2. You should see "order_placed" in the list of tables
3. Click on it to view its structure

## Step 5: Disable RLS If You Still Have Issues

If you encounter errors, try temporarily disabling Row Level Security for testing:

```sql
-- Run this in SQL Editor if you have issues
ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY;
```

## Step 6: Test in Chat

Type "!test supabase" in the chat to verify the connection works. 