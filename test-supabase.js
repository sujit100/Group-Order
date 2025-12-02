/**
 * Standalone Supabase Connection Test
 * Run with: node test-supabase.js
 */

const fs = require('fs');
const path = require('path');

// Simple env file parser
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  const env = {};
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.log('\n📝 Create it from env.local.example and add your Supabase credentials');
    process.exit(1);
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim();
        let value = trimmed.substring(equalIndex + 1).trim();
        // Remove quotes if present
        value = value.replace(/^["']|["']$/g, '');
        env[key] = value;
      }
    }
  });
  
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Running Supabase Connection Test...\n');
console.log('='.repeat(60));

// Check environment variables
console.log('\n1️⃣ Checking Environment Variables:');
console.log('-'.repeat(60));

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  process.exit(1);
} else if (supabaseUrl.includes('your_supabase') || supabaseUrl.includes('placeholder')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL contains placeholder value');
  process.exit(1);
} else {
  console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 40)}...`);
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  process.exit(1);
} else if (supabaseAnonKey.includes('your_supabase') || supabaseAnonKey.includes('placeholder')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY contains placeholder value');
  process.exit(1);
} else {
  console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 30)}...`);
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing');
  process.exit(1);
} else if (supabaseServiceKey.includes('your_supabase') || supabaseServiceKey.includes('placeholder')) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY contains placeholder value');
  process.exit(1);
} else {
  console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 30)}...`);
}

// Check if @supabase/supabase-js is available
let createClient;
try {
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
} catch (error) {
  console.error('\n❌ @supabase/supabase-js not found!');
  console.log('\n💡 Install dependencies: npm install');
  process.exit(1);
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

async function runTests() {
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
  };

  // Test connection
  console.log('\n2️⃣ Testing Database Connection:');
  console.log('-'.repeat(60));
  
  try {
    const { data, error } = await anonClient.from('groups').select('count').limit(0);
    
    if (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('\n💡 Tables might not exist. Run supabase-schema.sql in Supabase SQL Editor.');
      } else if (error.message.includes('JWT') || error.message.includes('Invalid')) {
        console.error('\n💡 Invalid API keys. Check your Supabase credentials in .env.local');
      }
      results.failed++;
      return results;
    } else {
      console.log('✅ Successfully connected to Supabase!');
      results.passed++;
    }
  } catch (error) {
    console.error(`❌ Connection error: ${error.message}`);
    results.failed++;
    return results;
  }

  // Check tables
  console.log('\n3️⃣ Checking Database Tables:');
  console.log('-'.repeat(60));
  
  const requiredTables = [
    'groups',
    'group_members',
    'cart_items',
    'orders',
    'order_items',
    'user_order_summary',
  ];

  for (const table of requiredTables) {
    try {
      const { error: tableError } = await serviceClient.from(table).select('*').limit(1);
      
      if (tableError) {
        if (tableError.message.includes('relation') || tableError.message.includes('does not exist')) {
          console.error(`❌ Table "${table}": Does not exist`);
          results.failed++;
        } else {
          console.warn(`⚠️  Table "${table}": ${tableError.message}`);
          results.warnings++;
        }
      } else {
        console.log(`✅ Table "${table}": Exists and accessible`);
        results.passed++;
      }
    } catch (error) {
      console.error(`❌ Table "${table}": ${error.message}`);
      results.failed++;
    }
  }

  // Test operations
  console.log('\n4️⃣ Testing Database Operations:');
  console.log('-'.repeat(60));
  
  try {
    const testCode = `TEST${Date.now()}`;
    const { data: insertData, error: insertError } = await serviceClient
      .from('groups')
      .insert({ code: testCode, status: 'browsing' })
      .select()
      .single();

    if (insertError) {
      console.error(`❌ Insert operation failed: ${insertError.message}`);
      results.failed++;
    } else {
      console.log('✅ Insert operation: Success');
      results.passed++;
      
      // Test delete
      const { error: deleteError } = await serviceClient
        .from('groups')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.error(`❌ Delete operation failed: ${deleteError.message}`);
        results.failed++;
      } else {
        console.log('✅ Delete operation: Success');
        results.passed++;
      }
    }
  } catch (error) {
    console.error(`❌ Operation test error: ${error.message}`);
    results.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:');
  console.log('-'.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  console.log('-'.repeat(60));

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Your Supabase connection is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('   - Start the dev server: npm run dev');
    console.log('   - Visit: http://localhost:3000');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    console.log('\n💡 Common fixes:');
    console.log('   - Missing tables: Run supabase-schema.sql in Supabase SQL Editor');
    console.log('   - Invalid keys: Check your .env.local file');
    console.log('   - Connection issues: Verify your Supabase project is active');
  }

  console.log('\n' + '='.repeat(60) + '\n');

  return results;
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Test execution failed:', error.message);
  console.error('\n💡 Make sure:');
  console.error('   - .env.local file exists with your Supabase credentials');
  console.error('   - All dependencies are installed: npm install');
  process.exit(1);
});