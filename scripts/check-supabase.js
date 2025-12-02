/**
 * Supabase Connection Check Script
 * Run with: node scripts/check-supabase.js
 */

const fs = require('fs');
const path = require('path');

// Simple env parser
function parseEnvFile(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
  return env;
}

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('\n📝 Please create .env.local from env.local.example:');
  console.log('   cp env.local.example .env.local');
  console.log('\nThen add your Supabase credentials from:');
  console.log('   https://supabase.com/dashboard/project/_/settings/api');
  process.exit(1);
}

const env = parseEnvFile(envPath);
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking Supabase Connection...\n');

// Check environment variables
console.log('1️⃣ Checking Environment Variables:');
if (!supabaseUrl) {
  console.error('   ❌ NEXT_PUBLIC_SUPABASE_URL is missing');
} else if (supabaseUrl.includes('your_supabase') || supabaseUrl.includes('placeholder')) {
  console.error('   ❌ NEXT_PUBLIC_SUPABASE_URL appears to be a placeholder');
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 40)}...`);
}

if (!supabaseAnonKey) {
  console.error('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
} else if (supabaseAnonKey.includes('your_supabase') || supabaseAnonKey.includes('placeholder')) {
  console.error('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be a placeholder');
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 30)}...`);
}

if (!supabaseServiceKey) {
  console.error('   ❌ SUPABASE_SERVICE_ROLE_KEY is missing');
} else if (supabaseServiceKey.includes('your_supabase') || supabaseServiceKey.includes('placeholder')) {
  console.error('   ❌ SUPABASE_SERVICE_ROLE_KEY appears to be a placeholder');
} else {
  console.log(`   ✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 30)}...`);
}

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('\n❌ Missing required environment variables!');
  console.log('\n💡 To fix this:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project → Settings → API');
  console.log('   3. Copy the values to .env.local');
  process.exit(1);
}

// Check if values are placeholders
if (
  supabaseUrl.includes('your_supabase') ||
  supabaseAnonKey.includes('your_supabase') ||
  supabaseServiceKey.includes('your_supabase')
) {
  console.error('\n❌ Please replace placeholder values in .env.local with your actual Supabase credentials!');
  process.exit(1);
}

// Try to import and test Supabase connection
console.log('\n2️⃣ Testing Supabase Connection:');
console.log('   ⏳ Attempting to connect...');

// Use dynamic import for ESM module
import('@supabase/supabase-js').then(({ createClient }) => {
  const anonClient = createClient(supabaseUrl, supabaseAnonKey);
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

  // Test connection by checking tables
  async function checkConnection() {
    try {
      // Test with anon client
      const { data, error } = await anonClient.from('groups').select('count').limit(0);
      
      if (error) {
        console.error(`   ❌ Connection failed: ${error.message}`);
        
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.error('\n   💡 Tables might not be created yet.');
          console.log('   📝 Solution: Run supabase-schema.sql in Supabase SQL Editor');
          console.log('      1. Go to https://supabase.com/dashboard');
          console.log('      2. Select your project → SQL Editor');
          console.log('      3. Open supabase-schema.sql from this project');
          console.log('      4. Copy all contents and run it');
        } else if (error.message.includes('JWT') || error.message.includes('Invalid API key')) {
          console.error('\n   💡 Invalid API keys detected.');
          console.log('   📝 Solution: Verify your API keys in Supabase dashboard');
        }
        process.exit(1);
      } else {
        console.log('   ✅ Successfully connected to Supabase!');
      }

      // Check required tables
      console.log('\n3️⃣ Checking Database Tables:');
      const requiredTables = [
        'groups',
        'group_members',
        'cart_items',
        'orders',
        'order_items',
        'user_order_summary',
      ];

      let allTablesExist = true;
      for (const table of requiredTables) {
        try {
          const { error: tableError } = await serviceClient.from(table).select('*').limit(1);
          if (tableError) {
            if (tableError.message.includes('relation') || tableError.message.includes('does not exist')) {
              console.error(`   ❌ Table "${table}" does not exist`);
            } else {
              console.error(`   ❌ Table "${table}" error: ${tableError.message}`);
            }
            allTablesExist = false;
          } else {
            console.log(`   ✅ Table "${table}" exists and is accessible`);
          }
        } catch (err) {
          console.error(`   ❌ Error checking table "${table}": ${err.message}`);
          allTablesExist = false;
        }
      }

      // Test basic operations
      console.log('\n4️⃣ Testing Basic Operations:');
      try {
        const testCode = `TEST${Date.now()}`;
        const { data: insertData, error: insertError } = await serviceClient
          .from('groups')
          .insert({ code: testCode, status: 'browsing' })
          .select()
          .single();

        if (insertError) {
          console.error(`   ❌ Insert test failed: ${insertError.message}`);
        } else {
          console.log('   ✅ Insert operation works');
          
          // Clean up test data
          await serviceClient.from('groups').delete().eq('id', insertData.id);
          console.log('   ✅ Delete operation works');
        }
      } catch (err) {
        console.error(`   ❌ Operation test failed: ${err.message}`);
      }

      console.log('\n' + '='.repeat(50));
      if (allTablesExist) {
        console.log('✅ Supabase connection check completed successfully!');
        console.log('\n📝 Your Supabase is properly configured.');
        console.log('   You can now run: npm run dev');
      } else {
        console.log('⚠️  Some tables are missing.');
        console.log('\n💡 To fix: Run supabase-schema.sql in Supabase SQL Editor');
      }
      console.log('='.repeat(50) + '\n');
    } catch (err) {
      console.error(`\n❌ Error: ${err.message}`);
      process.exit(1);
    }
  }

  checkConnection();
}).catch(err => {
  console.error(`\n❌ Failed to load Supabase client: ${err.message}`);
  console.log('\n💡 Try installing dependencies: npm install');
  process.exit(1);
});
