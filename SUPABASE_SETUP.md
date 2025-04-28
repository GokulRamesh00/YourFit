# Supabase Integration Guide

This application uses Supabase for storing order information. The following guide explains how to set up and configure Supabase for this project.

## Database Setup

### 1. Create a Supabase Project

If you haven't already:
1. Go to [Supabase](https://app.supabase.io/)
2. Sign up or log in
3. Create a new project

### 2. Set Up Database Tables

Run the SQL script located in `supabase/migrations/20231001000000_create_orders_table.sql` in your Supabase SQL editor.

This script will:
- Create the `orders` table with the necessary fields
- Set up Row Level Security (RLS) policies
- Create appropriate indexes

### 3. Get API Keys

From your Supabase dashboard:
1. Go to Project Settings > API
2. Copy the URL and anon key
3. Update `src/lib/supabase.ts` with these values

## Database Schema

### Orders Table

| Column            | Type                     | Description                      |
|-------------------|--------------------------|----------------------------------|
| id                | UUID                     | Primary key, auto-generated      |
| user_id           | TEXT                     | ID of the user from Clerk Auth   |
| user_name         | TEXT                     | Customer's name                  |
| email             | TEXT                     | Customer's email                 |
| product           | TEXT                     | Product name/description         |
| price             | DECIMAL(10,2)            | Product price                    |
| shipping_address  | TEXT                     | Delivery address                 |
| status            | TEXT                     | Order status (default: 'pending')|
| created_at        | TIMESTAMP WITH TIME ZONE | Creation timestamp               |
| updated_at        | TIMESTAMP WITH TIME ZONE | Last update timestamp            |

## Security

- Row Level Security (RLS) is enabled on the `orders` table
- Users can only see, create, and update their own orders
- Authentication is handled via Clerk, and user IDs are stored with each order

## Environment Variables

The project uses the following database connection details:

```
# Connect to Supabase via connection pooling.
DATABASE_URL="postgresql://postgres.qjocmhjdvthpnphkstja:gjUSuB8d2T6mhhOJ@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://postgres.qjocmhjdvthpnphkstja:gjUSuB8d2T6mhhOJ@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

For the Supabase JS client, you need to configure:
- `supabaseUrl` - The URL of your Supabase project
- `supabaseKey` - The anon key of your Supabase project

## Integration with Clerk Authentication

This application uses Clerk for authentication. The Clerk user ID is stored in the `user_id` field of the `orders` table, which allows for connecting orders to specific authenticated users. 