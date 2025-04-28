-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    product TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read only their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid()::text = user_id);

-- Create policy for users to insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Create policy for users to update their own orders
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid()::text = user_id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id); 