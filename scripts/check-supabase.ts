/**
 * Supabase Connection Check Script
 * Run with: npx tsx scripts/check-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  console.error('❌ .env.local file not found!')
  console.log('\n📝 Please create .env.local from env.local.example:')
  console.log('   cp env.local.example .env.local')
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Checking Supabase Connection...\n')

// Check environment variables
console.log('1️⃣ Checking Environment Variables:')
if (!supabaseUrl) {
  console.error('   ❌ NEXT_PUBLIC_SUPABASE_URL is missing')
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`)
}

if (!supabaseAnonKey) {
  console.error('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
} else {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`)
}

if (!supabaseServiceKey) {
  console.error('   ❌ SUPABASE_SERVICE_ROLE_KEY is missing')
} else {
  console.log(`   ✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 20)}...`)
}

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('\n❌ Missing required environment variables!')
  process.exit(1)
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey)
const serviceClient = createClient(supabaseUrl, supabaseServiceKey)

// Check connection
console.log('\n2️⃣ Testing Connection:')
try {
  const { data, error } = await anonClient.from('groups').select('count').limit(0)
  if (error) {
    console.error(`   ❌ Connection failed: ${error.message}`)
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      console.error('   💡 Tables might not be created yet. Run supabase-schema.sql in Supabase SQL Editor.')
    }
  } else {
    console.log('   ✅ Successfully connected to Supabase!')
  }
} catch (err) {
  console.error(`   ❌ Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`)
  process.exit(1)
}

// Check required tables
console.log('\n3️⃣ Checking Database Tables:')
const requiredTables = [
  'groups',
  'group_members',
  'cart_items',
  'orders',
  'order_items',
  'user_order_summary',
]

let allTablesExist = true
for (const table of requiredTables) {
  try {
    const { error } = await serviceClient.from(table).select('*').limit(1)
    if (error) {
      console.error(`   ❌ Table "${table}" is missing or inaccessible`)
      console.error(`      Error: ${error.message}`)
      allTablesExist = false
    } else {
      console.log(`   ✅ Table "${table}" exists`)
    }
  } catch (err) {
    console.error(`   ❌ Error checking table "${table}": ${err instanceof Error ? err.message : 'Unknown error'}`)
    allTablesExist = false
  }
}

// Check RLS policies
console.log('\n4️⃣ Checking Row Level Security (RLS):')
try {
  // Try to query as anon client - if RLS is too restrictive, this might fail
  const { error } = await anonClient.from('groups').select('id').limit(1)
  if (error && error.message.includes('permission denied')) {
    console.warn('   ⚠️  RLS might be blocking access. Check your policies.')
  } else {
    console.log('   ✅ RLS policies allow access')
  }
} catch (err) {
  console.warn(`   ⚠️  Could not verify RLS: ${err instanceof Error ? err.message : 'Unknown error'}`)
}

// Check Realtime
console.log('\n5️⃣ Checking Realtime Subscription:')
try {
  const channel = anonClient.channel('test-channel')
  const status = await channel.subscribe()
  if (status === 'SUBSCRIBED') {
    console.log('   ✅ Realtime is enabled and working')
    await channel.unsubscribe()
  } else {
    console.warn(`   ⚠️  Realtime subscription status: ${status}`)
  }
} catch (err) {
  console.warn(`   ⚠️  Could not test Realtime: ${err instanceof Error ? err.message : 'Unknown error'}`)
}

// Test basic operations
console.log('\n6️⃣ Testing Basic Operations:')
try {
  // Test insert (will be rolled back)
  const testCode = `TEST${Date.now()}`
  const { data: insertData, error: insertError } = await serviceClient
    .from('groups')
    .insert({ code: testCode, status: 'browsing' })
    .select()
    .single()

  if (insertError) {
    console.error(`   ❌ Insert test failed: ${insertError.message}`)
  } else {
    console.log('   ✅ Insert operation works')
    
    // Test delete
    const { error: deleteError } = await serviceClient
      .from('groups')
      .delete()
      .eq('id', insertData.id)

    if (deleteError) {
      console.error(`   ❌ Delete test failed: ${deleteError.message}`)
    } else {
      console.log('   ✅ Delete operation works')
    }
  }
} catch (err) {
  console.error(`   ❌ Operation test failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
}

console.log('\n' + '='.repeat(50))
if (allTablesExist) {
  console.log('✅ Supabase connection check completed successfully!')
  console.log('\n📝 Next steps:')
  console.log('   - Your Supabase connection is working')
  console.log('   - You can now run: npm run dev')
} else {
  console.log('⚠️  Some issues found. Please check the errors above.')
  console.log('\n💡 Common fixes:')
  console.log('   1. Run supabase-schema.sql in Supabase SQL Editor')
  console.log('   2. Check that your Supabase project is active')
  console.log('   3. Verify your API keys are correct')
}
console.log('='.repeat(50) + '\n')
