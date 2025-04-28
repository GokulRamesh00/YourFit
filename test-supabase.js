// Simple script to test Supabase connection directly

// Supabase configuration 
const supabaseUrl = 'https://qjocmhjdvthpnphkstja.supabase.co';
// Use service role key to bypass RLS entirely (only for testing)
const supabaseKey = 'KEY_HERE';

// Database connection strings (for reference)
const databaseUrl = "KEY_HERE";
const directUrl = "KEY_HERE";

/* 
 * IMPORTANT: You need to add your Supabase API key above
 * The database URLs you provided are for server-side connections only.
 * For browser/client access, you need the API key.
 * 
 * 1. Go to https://app.supabase.com/project/qjocmhjdvthpnphkstja/settings/api
 * 2. Copy your "anon" public key (NOT your service_role key)
 * 3. Paste it as the value for supabaseKey above
 */

async function testSupabase() {
  try {
    console.log('Starting Supabase test...');
    console.log('URL:', supabaseUrl);
    
    // We'll use fetch API directly to avoid any client-side libraries
    const headers = {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'return=representation'
    };
    
    // Test 1: Try to select from table - fixed query to avoid parsing error
    console.log('\nTest 1: SELECT query');
    const selectUrl = `${supabaseUrl}/rest/v1/order_placed?select=id&limit=1`;
    console.log('Requesting:', selectUrl);
    
    const selectResponse = await fetch(selectUrl, {
      method: 'GET',
      headers
    });
    
    console.log('Response status:', selectResponse.status);
    if (selectResponse.ok) {
      const data = await selectResponse.json();
      console.log('SELECT success:', data);
    } else {
      console.error('SELECT error:', await selectResponse.text());
    }
    
    // Test 2: Try to insert a test record
    console.log('\nTest 2: INSERT query');
    const insertUrl = `${supabaseUrl}/rest/v1/order_placed`;
    console.log('Requesting:', insertUrl);
    
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
    
    const insertResponse = await fetch(insertUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(testRecord)
    });
    
    console.log('Response status:', insertResponse.status);
    if (insertResponse.ok) {
      const data = await insertResponse.json();
      console.log('INSERT success:', data);
    } else {
      console.error('INSERT error:', await insertResponse.text());
    }
    
    console.log('\nTests completed');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testSupabase(); 