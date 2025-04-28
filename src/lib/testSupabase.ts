import { createClient } from '@supabase/supabase-js';

// Use same credentials to match the approach in supabase.ts
const supabaseUrl = 'https://qjocmhjdvthpnphkstja.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb2NtaGpkdnRocG5waGtzdGphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQxNDI2NiwiZXhwIjoyMDU5OTkwMjY2fQ.VP94J_r96DClq72QIwXZXXI5bwwbgf08tybf8X8q4-0';

/**
 * Test Supabase connectivity and table access
 * Run this from the console to check if your Supabase setup is working
 */
export async function testSupabaseConnection() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials.');
    return false;
  }

  try {
    // Create a Supabase client
    console.log('Creating Supabase client with URL:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created successfully');
    
    // Test the SELECT operation
    console.log('Testing READ access to order_placed table...');
    const { data: selectData, error: selectError } = await supabase.from('order_placed').select('*').limit(1);
    
    if (selectError) {
      console.error('Error reading from Supabase:', selectError.message);
      console.error('Error code:', selectError.code);
      console.error('Error details:', selectError.details);
    } else {
      console.log('Successfully read from table. Records found:', selectData ? selectData.length : 0);
    }
    
    // Test the INSERT operation
    console.log('Testing WRITE access to order_placed table...');
    const testRecord = {
      user_id: 'test_user',
      user_name: 'Test User',
      email: 'test@example.com',
      product: 'TEST_PRODUCT',
      price: 0.01,
      size: 'TEST',
      quantity: 1,
      shipping_address: 'TEST ADDRESS'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('order_placed')
      .insert(testRecord)
      .select();
      
    if (insertError) {
      console.error('Error inserting to Supabase:', insertError.message);
      console.error('Error code:', insertError.code);
      console.error('Error details:', insertError.details);
      
      // Check if the error is related to RLS (Row Level Security)
      if (insertError.message.includes('permission denied') || insertError.code === '42501') {
        console.error('Row Level Security (RLS) is preventing INSERT operations.');
        console.error('Run this in SQL Editor: ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY;');
        return false;
      }
    } else {
      console.log('Successfully inserted test record:', insertData);
      
      // Clean up by deleting the test record
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('order_placed')
          .delete()
          .eq('id', insertData[0].id);
          
        if (deleteError) {
          console.warn('Could not delete test record:', deleteError.message);
        } else {
          console.log('Successfully deleted test record');
        }
      }
    }
    
    // If we got here and there wasn't a write error, we're good
    if (!insertError) {
      console.log('Successfully connected to Supabase with read/write permissions!');
      return true;
    }
    
    // If select worked but insert failed, we have a permissions issue
    if (!selectError && insertError) {
      console.error('READ permissions OK, but WRITE permissions FAILED. Check Row Level Security settings.');
      return false;
    }
    
    // If both failed, we have a more fundamental connection issue
    if (selectError && insertError) {
      console.error('Both READ and WRITE operations failed. Check database connection and table existence.');
      return false;
    }
    
    return !selectError && !insertError;
  } catch (error) {
    console.error('Unexpected error testing Supabase connection:', error);
    return false;
  }
}

// Export a simple function that can be called from the DevTools console or code
export async function checkSupabase() {
  try {
    const success = await testSupabaseConnection();
    console.log("Supabase test complete. Success:", success);
    return success;
  } catch (error) {
    console.error("Error during Supabase test:", error);
    return false;
  }
}

// Make it accessible from the global window object for easy testing
if (typeof window !== 'undefined') {
  (window as any).testSupabase = async () => {
    const result = await checkSupabase();
    return result;
  };
}

// Debug function to check if the order_placed table exists and its schema
export async function checkOrderPlacedTable() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials.');
    return false;
  }

  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if the table exists by attempting to query its structure
    console.log('Checking if order_placed table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_name', 'order_placed')
      .limit(1);
    
    if (tableError) {
      console.error('Error checking table existence:', tableError.message);
      console.log('Trying alternative method to check table...');
      
      // Try direct query as fallback
      const { data, error } = await supabase.from('order_placed').select('count(*)').limit(1);
      
      if (error) {
        console.error('Error accessing order_placed table:', error.message);
        
        if (error.message.includes('does not exist') || error.code === '42P01') {
          console.error('The order_placed table does not exist. You need to create it using the following SQL:');
          console.log(`
CREATE TABLE public.order_placed (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_email TEXT NOT NULL,
  product TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  shipping_address TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  tracking_number TEXT DEFAULT NULL
);

-- Enable Row Level Security
ALTER TABLE public.order_placed ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert
CREATE POLICY "Allow anonymous insert" ON public.order_placed 
  FOR INSERT WITH CHECK (true);

-- Optionally, create a policy for reading (if you want users to see their orders)
CREATE POLICY "Allow anonymous select" ON public.order_placed 
  FOR SELECT USING (true);
          `);
          return false;
        }
        
        if (error.message.includes('permission denied') || error.code === '42501') {
          console.error('Row Level Security (RLS) is preventing access to the table.');
          console.error('You need to disable RLS or create a policy with the following SQL:');
          console.log(`
-- Enable Row Level Security (if not already enabled)
ALTER TABLE public.order_placed ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert
CREATE POLICY "Allow anonymous insert" ON public.order_placed 
  FOR INSERT WITH CHECK (true);

-- Create a policy for reading (if you want users to see their orders)
CREATE POLICY "Allow anonymous select" ON public.order_placed 
  FOR SELECT USING (true);

-- Alternative: Disable RLS completely (less secure but easier for testing)
-- ALTER TABLE public.order_placed DISABLE ROW LEVEL SECURITY;
          `);
          return false;
        }
        
        return false;
      }
      
      console.log('Table exists but could not query schema. Count result:', data);
    } else {
      if (!tableInfo || tableInfo.length === 0) {
        console.error('The order_placed table does not exist in the database schema.');
        console.error('You need to create it. See above SQL instructions.');
        return false;
      }
      
      console.log('Table exists in schema:', tableInfo);
    }
    
    // Test inserting a record to verify permissions
    console.log('Testing insert permission with a test record...');
    const testRecord = {
      user_email: 'test@example.com',
      product: 'DEBUG_TEST_PRODUCT',
      size: 'TEST',
      quantity: 1,
      shipping_address: '123 Test St, Test City, 12345',
      status: 'test'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('order_placed')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.error('Error inserting test record:', insertError.message);
      
      if (insertError.message.includes('permission denied') || insertError.code === '42501') {
        console.error('Row Level Security (RLS) is preventing inserts. See above SQL to fix.');
        return false;
      }
      
      return false;
    }
    
    console.log('Successfully inserted test record:', insertData);
    
    // Clean up the test record
    if (insertData && insertData.length > 0) {
      const { error: deleteError } = await supabase
        .from('order_placed')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.warn('Could not delete test record:', deleteError.message);
        console.warn('You may want to manually delete the test record with ID:', insertData[0].id);
      } else {
        console.log('Successfully cleaned up test record');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error checking order_placed table:', error);
    return false;
  }
}

// Export for use in the browser console
if (typeof window !== 'undefined') {
  (window as any).checkOrderPlacedTable = checkOrderPlacedTable;
} 