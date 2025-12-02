/**
 * Quick Environment Variable Checker
 * Run with: node scripts/verify-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔍 Checking Environment Variables...\n');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('\n📝 Create it by running:');
  console.log('   cp env.local.example .env.local');
  console.log('\nThen add your Supabase credentials from:');
  console.log('   https://supabase.com/dashboard/project/_/settings/api');
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');

const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': false,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': false,
  'SUPABASE_SERVICE_ROLE_KEY': false,
  'RESEND_API_KEY': false,
  'EMAIL_FROM_ADDRESS': false,
};

let allSet = true;
let hasPlaceholders = false;

lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key] = trimmed.split('=');
    const keyName = key?.trim();
    if (keyName && requiredVars.hasOwnProperty(keyName)) {
      const value = trimmed.substring(keyName.length + 1).trim().replace(/^["']|["']$/g, '');
      requiredVars[keyName] = true;
      
      if (value.includes('your_') || value.includes('placeholder') || value === '') {
        console.error(`❌ ${keyName}: Contains placeholder or is empty`);
        hasPlaceholders = true;
        allSet = false;
      } else {
        const preview = value.substring(0, 30) + (value.length > 30 ? '...' : '');
        console.log(`✅ ${keyName}: ${preview}`);
      }
    }
  }
});

console.log('\n' + '='.repeat(50));

Object.keys(requiredVars).forEach(key => {
  if (!requiredVars[key]) {
    console.error(`❌ ${key}: Not found in .env.local`);
    allSet = false;
  }
});

if (!allSet) {
  console.log('\n❌ Some environment variables are missing or contain placeholders');
  console.log('\n📝 To fix:');
  console.log('   1. Open .env.local in your editor');
  console.log('   2. Replace placeholder values with your actual credentials');
  console.log('   3. Get Supabase keys from: https://supabase.com/dashboard');
  console.log('   4. Get Resend key from: https://resend.com/api-keys');
} else {
  console.log('\n✅ All environment variables are set!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make sure database schema is set up in Supabase');
  console.log('   2. Run: npm run dev');
  console.log('   3. Visit: http://localhost:3000/api/test-supabase');
}

console.log('='.repeat(50) + '\n');
