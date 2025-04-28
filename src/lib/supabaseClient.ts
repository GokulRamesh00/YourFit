import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Type definitions for database tables
 */

// Order type for database
export interface OrderRecord {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  product: string;
  price: number;
  size: string;
  quantity: number;
  shipping_address: string;
  status: string;
  created_at: string;
}

// Product review type
export interface ProductReview {
  id?: string;
  product_id: number;
  user_id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at?: string;
}

// Product view history for recommendations
export interface ProductView {
  id?: string;
  user_id: string;
  product_id: number;
  viewed_at: string;
}

// Wishlist item
export interface WishlistItem {
  id?: string;
  user_id: string;
  product_id: number;
  added_at: string;
}

// User measurements from size quiz
export interface UserMeasurement {
  id?: string;
  user_id: string;
  measurements: string; // JSON string of SizeRecommendationResult
  updated_at: string;
}

/**
 * Database schema creation helpers
 * These would be run once during initial setup, not in client code
 */

// SQL for creating the product_reviews table
// This is for reference only - should be executed in Supabase SQL editor
export const createProductReviewsTableSQL = `
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id integer NOT NULL,
  user_id text NOT NULL,
  user_name text NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS product_reviews_product_id_idx ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS product_reviews_user_id_idx ON public.product_reviews (user_id);
`;

// SQL for creating the product_views table for recommendation engine
export const createProductViewsTableSQL = `
CREATE TABLE IF NOT EXISTS public.product_views (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id text NOT NULL,
  product_id integer NOT NULL,
  viewed_at timestamp with time zone DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS product_views_user_id_idx ON public.product_views (user_id);
CREATE INDEX IF NOT EXISTS product_views_product_id_idx ON public.product_views (product_id);
`;

// SQL for creating the wishlists table
export const createWishlistsTableSQL = `
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id text NOT NULL,
  product_id integer NOT NULL,
  added_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON public.wishlists (user_id);
`;

// SQL for creating the user_measurements table to store size quiz results
export const createUserMeasurementsTableSQL = `
CREATE TABLE IF NOT EXISTS public.user_measurements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id text NOT NULL UNIQUE,
  measurements jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Add index
CREATE INDEX IF NOT EXISTS user_measurements_user_id_idx ON public.user_measurements (user_id);
`; 