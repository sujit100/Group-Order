import { createClient } from './client'
import { getCartItems } from './cart'
import { clearCart } from './cart'
import { calculateOrder } from '@/lib/calculations'
import type { Database } from '@/types/database'

export interface CheckoutParams {
  groupId: string
  taxRate: number // e.g., 0.08 for 8%
  tipRate: number // e.g., 0.18 for 18%
}

export interface CheckoutResult {
  orderId: string
  userSummaries: Array<{
    userEmail: string
    userName: string
    subtotal: number
    taxAmount: number
    tipAmount: number
    totalAmount: number
  }>
}

/**
 * Complete checkout and create order
 */
export async function completeCheckout({
  groupId,
  taxRate,
  tipRate,
}: CheckoutParams): Promise<CheckoutResult> {
  const supabase = createClient()

  // Get all cart items
  const cartItems = await getCartItems(groupId)

  if (cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Calculate user subtotals
  const userSubtotals: Record<string, { name: string; amount: number }> = {}
  
  cartItems.forEach((item) => {
    const userEmail = item.added_by_email
    const userName = item.added_by_name
    const itemTotal = item.price * item.quantity

    if (!userSubtotals[userEmail]) {
      userSubtotals[userEmail] = {
        name: userName,
        amount: 0,
      }
    }
    userSubtotals[userEmail].amount += itemTotal
  })

  // Calculate order totals and per-user breakdowns
  const calculation = calculateOrder(userSubtotals, taxRate, tipRate)

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      group_id: groupId,
      status: 'placed',
      subtotal: calculation.subtotal,
      tax_rate: taxRate,
      tax_amount: calculation.taxAmount,
      tip_rate: tipRate,
      tip_amount: calculation.tipAmount,
      total_amount: calculation.totalAmount,
      invoices_sent: false,
    })
    .select()
    .single()

  if (orderError || !order) {
    throw new Error(`Failed to create order: ${orderError?.message}`)
  }

  // Create order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    added_by_email: item.added_by_email,
    added_by_name: item.added_by_name,
    item_name: item.item_name,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`)
  }

  // Create user order summaries for invoices
  const summaries = calculation.userSummaries.map((summary) => ({
    order_id: order.id,
    user_email: summary.userEmail,
    user_name: summary.userName,
    subtotal: summary.subtotal,
    tax_amount: summary.taxAmount,
    tip_amount: summary.tipAmount,
    total_amount: summary.totalAmount,
    invoice_sent: false,
  }))

  const { error: summariesError } = await supabase
    .from('user_order_summary')
    .insert(summaries)

  if (summariesError) {
    throw new Error(`Failed to create user summaries: ${summariesError.message}`)
  }

  // Update group status
  const { error: groupError } = await supabase
    .from('groups')
    .update({
      status: 'ordered',
      order_total: calculation.totalAmount,
    })
    .eq('id', groupId)

  if (groupError) {
    console.error('Failed to update group status:', groupError)
    // Don't throw - order is already created
  }

  // Clear cart
  await clearCart(groupId)

  return {
    orderId: order.id,
    userSummaries: calculation.userSummaries,
  }
}
