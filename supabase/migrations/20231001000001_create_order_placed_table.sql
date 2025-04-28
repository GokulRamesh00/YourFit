-- Create order_placed table with extended fields
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

-- Set up RLS (Row Level Security) - but more permissive for this demo
ALTER TABLE public.order_placed ENABLE ROW LEVEL SECURITY;

-- Create a completely permissive policy for this demo
CREATE POLICY "Allow all access to order_placed" 
ON public.order_placed 
USING (true) 
WITH CHECK (true);

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS order_placed_user_id_idx ON public.order_placed (user_id);
CREATE INDEX IF NOT EXISTS order_placed_email_idx ON public.order_placed (email); 