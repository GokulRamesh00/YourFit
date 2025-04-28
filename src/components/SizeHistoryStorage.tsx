import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabaseClient';
import { SizeRecommendationResult } from './SizeRecommendationQuiz';

interface SizeHistoryStorageProps {
  onLoad?: (savedMeasurements: SizeRecommendationResult | null) => void;
  onSave?: () => void;
}

// LocalStorage key for storing measurements
const LOCAL_STORAGE_KEY = 'fit_fusion_user_measurements';

/**
 * This component doesn't render anything visible but handles
 * saving and loading user's size measurements to localStorage
 * and to Supabase for logged-in users.
 */
const SizeHistoryStorage = ({ onLoad, onSave }: SizeHistoryStorageProps) => {
  const { userId, isSignedIn } = useAuth();
  
  // Load measurements from localStorage or Supabase on component mount
  useEffect(() => {
    const loadMeasurements = async () => {
      let measurements: SizeRecommendationResult | null = null;
      
      // For logged-in users, try to load from Supabase first
      if (isSignedIn && userId) {
        try {
          const { data, error } = await supabase
            .from('user_measurements')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" error
            console.error('Error loading measurements from Supabase:', error);
          }
          
          // If we have data from Supabase, use it
          if (data) {
            measurements = JSON.parse(data.measurements);
            
            // Also update localStorage with the latest from Supabase
            localStorage.setItem(LOCAL_STORAGE_KEY, data.measurements);
          }
        } catch (error) {
          console.error('Error fetching user measurements:', error);
        }
      }
      
      // If not found in Supabase or not logged in, try localStorage
      if (!measurements) {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          try {
            measurements = JSON.parse(storedData);
          } catch (error) {
            console.error('Error parsing stored measurements:', error);
          }
        }
      }
      
      // Call the callback if provided
      if (onLoad && measurements) {
        onLoad(measurements);
      }
    };
    
    loadMeasurements();
  }, [userId, isSignedIn, onLoad]);
  
  /**
   * Saves the user's measurements to localStorage and Supabase (if logged in)
   * @param measurements The user's size measurements to save
   */
  const saveMeasurements = async (measurements: SizeRecommendationResult) => {
    // Save to localStorage for all users
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(measurements));
    
    // If user is logged in, also save to Supabase
    if (isSignedIn && userId) {
      try {
        const { error } = await supabase
          .from('user_measurements')
          .upsert({
            user_id: userId,
            measurements: JSON.stringify(measurements),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error saving measurements to Supabase:', error);
      }
    }
    
    // Call the callback if provided
    if (onSave) {
      onSave();
    }
  };
  
  /**
   * Get the currently saved measurements
   * @returns The user's saved measurements or null if none found
   */
  const getSavedMeasurements = (): SizeRecommendationResult | null => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing stored measurements:', error);
      }
    }
    return null;
  };
  
  /**
   * Clear all saved measurement data from localStorage and Supabase
   */
  const clearMeasurements = async () => {
    // Clear from localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    // If logged in, also clear from Supabase
    if (isSignedIn && userId) {
      try {
        const { error } = await supabase
          .from('user_measurements')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error clearing measurements from Supabase:', error);
      }
    }
  };
  
  // Export methods to be used by parent components
  if (typeof window !== 'undefined') {
    // Attach methods to window for access from other components
    (window as any).fitFusionSizeHistory = {
      saveMeasurements,
      getSavedMeasurements,
      clearMeasurements
    };
  }
  
  // This component doesn't render anything visible
  return null;
};

// SQL for creating the user_measurements table in Supabase
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

export default SizeHistoryStorage; 