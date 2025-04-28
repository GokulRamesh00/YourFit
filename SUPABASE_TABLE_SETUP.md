# Setting Up Supabase Tables

Follow these steps to set up the required database tables in your Supabase project:

## 1. Access the SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query" to create a new SQL query

## 2. Run the SQL Migration Script for order_placed Table

Copy and paste the following SQL code into the editor:

```sql
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

-- Set up RLS (Row Level Security) - but permissive for this demo
ALTER TABLE public.order_placed ENABLE ROW LEVEL SECURITY;

-- Create a completely permissive policy for this demo
CREATE POLICY "Allow all access to order_placed" 
ON public.order_placed 
USING (true) 
WITH CHECK (true);

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS order_placed_user_id_idx ON public.order_placed (user_id);
CREATE INDEX IF NOT EXISTS order_placed_email_idx ON public.order_placed (email);
```

3. Click "Run" to execute the SQL query

## 3. Important: Enable Row Level Security (RLS) but with Open Policies

1. Go to "Authentication" > "Policies" in the left sidebar
2. Find the "order_placed" table
3. Make sure Row Level Security (RLS) is enabled
4. Verify that the policy "Allow all access to order_placed" is present
5. This open policy allows any operation on the table, which is simpler for testing purposes

If these policies are not present, you may need to run the SQL script again or add them manually.

## 4. Verify Table Creation

1. Go to "Table Editor" in the left sidebar
2. You should see the "order_placed" table listed
3. Check the table structure to ensure all columns are created properly

## 5. Troubleshooting

If you're experiencing issues with orders not being stored in the database:

1. Check the browser console for any error messages
2. Try typing `!test supabase` in the chat to run diagnostic tests
3. Verify that the Supabase URL and anon key in `src/lib/supabase.ts` are correct
4. Try running this SQL command in the Supabase SQL editor to temporarily disable RLS for testing:
   ```sql
   ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY;
   ```
5. Try creating a test record manually through the Supabase Table Editor to verify database permissions

## 6. Database Schema

### order_placed Table

| Column            | Type                     | Description                      |
|-------------------|--------------------------|----------------------------------|
| id                | UUID                     | Primary key, auto-generated      |
| user_id           | TEXT                     | ID of the user (set to 'guest')  |
| user_name         | TEXT                     | Customer's name                  |
| email             | TEXT                     | Customer's email                 |
| product           | TEXT                     | Product name/description         |
| price             | DECIMAL(10,2)            | Product price (per unit)         |
| size              | TEXT                     | Product size (XS, S, M, etc.)    |
| quantity          | INTEGER                  | Number of items ordered          |
| shipping_address  | TEXT                     | Delivery address                 |
| status            | TEXT                     | Order status (default: 'pending')|
| email_sent        | BOOLEAN                  | Whether confirmation was sent    |
| created_at        | TIMESTAMP WITH TIME ZONE | Creation timestamp               |
| updated_at        | TIMESTAMP WITH TIME ZONE | Last update timestamp            |

## 7. Available Products

The chatbot is configured to only allow orders for these specific products:

1. TrainTech Performance Tee
2. FlexFit training shorts
3. Aeroflow sports bra
4. StrideFlex Running shoe

If customers request other products, the chatbot will inform them that those items are out of stock.

## 8. Email Confirmations

The system is configured to send order confirmation emails from yourfit2025@gmail.com. A confirmation email will be sent to the customer's provided email address after an order is successfully placed. 