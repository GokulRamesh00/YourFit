-- Run this SQL in your Supabase SQL Editor to fix permissions issues

-- First check if the table exists, and if not, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_placed') THEN
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
        RAISE NOTICE 'Created table order_placed';
    ELSE
        RAISE NOTICE 'Table order_placed already exists';
    END IF;
END
$$;

-- First, temporarily disable RLS to ensure we can modify everything
ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY;

-- Make sure we have the latest constraints and triggers for UUID generation
ALTER TABLE public.order_placed 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Create a policy that allows all operations for both authenticated and anonymous users
DROP POLICY IF EXISTS "Universal access policy" ON public.order_placed;
CREATE POLICY "Universal access policy" 
  ON public.order_placed 
  USING (true) 
  WITH CHECK (true);

-- Create policies for specific operations
DROP POLICY IF EXISTS "Allow inserts" ON public.order_placed;
CREATE POLICY "Allow inserts" 
  ON public.order_placed 
  FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow selects" ON public.order_placed;
CREATE POLICY "Allow selects" 
  ON public.order_placed 
  FOR SELECT 
  USING (true);

-- Create a policy for UPDATE operations
DROP POLICY IF EXISTS "Allow updates" ON public.order_placed;
CREATE POLICY "Allow updates" 
  ON public.order_placed 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Create a policy for DELETE operations
DROP POLICY IF EXISTS "Allow deletes" ON public.order_placed;
CREATE POLICY "Allow deletes" 
  ON public.order_placed 
  FOR DELETE 
  USING (true);

-- If issues still persist, you can temporarily disable RLS completely
-- Uncomment the line below if needed:
ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY; 

-- We're intentionally keeping RLS disabled for testing
-- If you want to re-enable RLS with the permissive policies above, uncomment this line:
-- ALTER TABLE public.order_placed ENABLE ROW LEVEL SECURITY; 