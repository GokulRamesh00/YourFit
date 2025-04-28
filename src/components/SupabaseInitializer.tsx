import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/lib/supabase';

/**
 * This component handles testing the Supabase connection when the app loads
 * With our direct API key approach, we don't need to sync auth tokens anymore
 */
export function SupabaseInitializer() {
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    // Function to test Supabase connection
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection...");
        
        // Simple SELECT query to check connection - fixed to avoid count(*) parsing error
        const { data, error } = await supabase
          .from('order_placed')
          .select('id') // Use simple 'id' column instead of count(*)
          .limit(1);
          
        if (error) {
          console.error("Supabase connection test failed:", error);
          console.log("Try running the SQL in supabase_policies.sql to fix permissions");
        } else {
          console.log("Supabase connection test succeeded:", data);
          
          // If user is signed in, log that information for debugging
          if (isSignedIn) {
            console.log("User is signed in with ID:", userId);
          } else {
            console.log("No user is signed in");
          }
        }
      } catch (error) {
        console.error('Error testing Supabase connection:', error);
      }
    };

    // Run the test
    testConnection();
    
    // We only need to run this once when the component mounts
  }, []); // Empty dependency array means it only runs once

  // This component doesn't render anything
  return null;
}

export default SupabaseInitializer; 