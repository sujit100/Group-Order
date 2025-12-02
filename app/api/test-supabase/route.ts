import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const checks: Array<{ name: string; status: 'pass' | 'fail' | 'warning'; message: string }> = []

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || supabaseUrl.includes('your_supabase') || supabaseUrl.includes('placeholder')) {
    checks.push({
      name: 'Environment Variables',
      status: 'fail',
      message: 'NEXT_PUBLIC_SUPABASE_URL is missing or contains placeholder',
    })
    return NextResponse.json({ checks, allPassed: false })
  }

  if (!supabaseAnonKey || supabaseAnonKey.includes('your_supabase') || supabaseAnonKey.includes('placeholder')) {
    checks.push({
      name: 'Environment Variables',
      status: 'fail',
      message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or contains placeholder',
    })
    return NextResponse.json({ checks, allPassed: false })
  }

  if (!supabaseServiceKey || supabaseServiceKey.includes('your_supabase') || supabaseServiceKey.includes('placeholder')) {
    checks.push({
      name: 'Environment Variables',
      status: 'fail',
      message: 'SUPABASE_SERVICE_ROLE_KEY is missing or contains placeholder',
    })
    return NextResponse.json({ checks, allPassed: false })
  }

  checks.push({
    name: 'Environment Variables',
    status: 'pass',
    message: 'All environment variables are set',
  })

  // Test connection
  try {
    const anonClient = createClient(supabaseUrl!, supabaseAnonKey!)
    
    const { error: connectionError } = await anonClient.from('groups').select('count').limit(0)
    
    if (connectionError) {
      if (connectionError.message.includes('relation') || connectionError.message.includes('does not exist')) {
        checks.push({
          name: 'Database Connection',
          status: 'fail',
          message: 'Cannot connect - tables may not exist. Run supabase-schema.sql in Supabase SQL Editor.',
        })
      } else if (connectionError.message.includes('JWT') || connectionError.message.includes('Invalid')) {
        checks.push({
          name: 'Database Connection',
          status: 'fail',
          message: 'Invalid API keys. Check your Supabase credentials.',
        })
      } else {
        checks.push({
          name: 'Database Connection',
          status: 'fail',
          message: `Connection error: ${connectionError.message}`,
        })
      }
      return NextResponse.json({ checks, allPassed: false })
    }

    checks.push({
      name: 'Database Connection',
      status: 'pass',
      message: 'Successfully connected to Supabase',
    })
  } catch (error) {
    checks.push({
      name: 'Database Connection',
      status: 'fail',
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
    return NextResponse.json({ checks, allPassed: false })
  }

  // Check tables
  const serviceClient = createClient(supabaseUrl!, supabaseServiceKey!)
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
      const { error: tableError } = await serviceClient.from(table).select('*').limit(1)
      if (tableError) {
        if (tableError.message.includes('relation') || tableError.message.includes('does not exist')) {
          checks.push({
            name: `Table: ${table}`,
            status: 'fail',
            message: 'Table does not exist',
          })
          allTablesExist = false
        } else {
          checks.push({
            name: `Table: ${table}`,
            status: 'warning',
            message: tableError.message,
          })
        }
      } else {
        checks.push({
          name: `Table: ${table}`,
          status: 'pass',
          message: 'Exists and accessible',
        })
      }
    } catch (error) {
      checks.push({
        name: `Table: ${table}`,
        status: 'fail',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
      allTablesExist = false
    }
  }

  // Test basic operations
  try {
    const testCode = `TEST${Date.now()}`
    const { data: insertData, error: insertError } = await serviceClient
      .from('groups')
      .insert({ code: testCode, status: 'browsing' })
      .select()
      .single()

    if (insertError) {
      checks.push({
        name: 'Database Operations',
        status: 'fail',
        message: `Insert failed: ${insertError.message}`,
      })
    } else {
      // Clean up
      await serviceClient.from('groups').delete().eq('id', insertData.id)
      checks.push({
        name: 'Database Operations',
        status: 'pass',
        message: 'Insert and delete operations work correctly',
      })
    }
  } catch (error) {
    checks.push({
      name: 'Database Operations',
      status: 'warning',
      message: `Operation test error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    })
  }

  const allPassed = checks.filter((c) => c.status === 'fail').length === 0

  return NextResponse.json({
    checks,
    allPassed,
    summary: {
      total: checks.length,
      passed: checks.filter((c) => c.status === 'pass').length,
      failed: checks.filter((c) => c.status === 'fail').length,
      warnings: checks.filter((c) => c.status === 'warning').length,
    },
  })
}
