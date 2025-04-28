import { useState } from 'react';
import { supabase, Order } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-react';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();

  // Create a new order
  const createOrder = async (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'status'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: userId,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      return data?.[0];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get order';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get orders for current user
  const getUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get orders';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createOrder,
    getOrderById,
    getUserOrders
  };
}; 