import { createClient } from './client'

/**
 * Get order details
 */
export async function getOrder(orderId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  
  if (error) {
    throw new Error(`Failed to get order: ${error.message}`)
  }
  
  return data
}

/**
 * Get order by group ID
 */
export async function getOrderByGroup(groupId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('group_id', groupId)
    .order('ordered_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // No order found
    }
    throw new Error(`Failed to get order: ${error.message}`)
  }
  
  return data
}

/**
 * Get order items
 */
export async function getOrderItems(orderId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('item_name', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get order items: ${error.message}`)
  }
  
  return data || []
}

/**
 * Get user order summaries
 */
export async function getUserOrderSummaries(orderId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_order_summary')
    .select('*')
    .eq('order_id', orderId)
    .order('user_name', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get user summaries: ${error.message}`)
  }
  
  return data || []
}
