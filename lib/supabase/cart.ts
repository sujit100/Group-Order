import { createClient } from './client'
import type { Database } from '@/types/database'

export interface AddToCartParams {
  groupId: string
  addedByEmail: string
  addedByName: string
  itemName: string
  itemDescription?: string
  quantity: number
  price: number
  specialInstructions?: string
}

/**
 * Add item to cart
 */
export async function addToCart(params: AddToCartParams) {
  const supabase = createClient()
  
  type CartItemInsert = Database['public']['Tables']['cart_items']['Insert']
  
  const insertData: CartItemInsert = {
    group_id: params.groupId,
    added_by_email: params.addedByEmail,
    added_by_name: params.addedByName,
    item_name: params.itemName,
    item_description: params.itemDescription || null,
    quantity: params.quantity,
    price: params.price,
    special_instructions: params.specialInstructions || null,
  }
  
  const { error } = await (supabase
    .from('cart_items') as any)
    .insert(insertData)
  
  if (error) {
    throw new Error(`Failed to add to cart: ${error.message}`)
  }
}

/**
 * Get all cart items for a group
 */
export async function getCartItems(groupId: string) {
  const supabase = createClient()
  
  type CartItemRow = Database['public']['Tables']['cart_items']['Row']
  
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get cart items: ${error.message}`)
  }
  
  return (data || []) as CartItemRow[]
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const supabase = createClient()
  
  if (quantity <= 0) {
    return deleteCartItem(itemId)
  }
  
  const { error } = await (supabase
    .from('cart_items') as any)
    .update({ quantity })
    .eq('id', itemId)
  
  if (error) {
    throw new Error(`Failed to update cart item: ${error.message}`)
  }
}

/**
 * Delete cart item
 */
export async function deleteCartItem(itemId: string) {
  const supabase = createClient()
  
  const { error } = await (supabase
    .from('cart_items') as any)
    .delete()
    .eq('id', itemId)
  
  if (error) {
    throw new Error(`Failed to delete cart item: ${error.message}`)
  }
}

/**
 * Clear all cart items for a group
 */
export async function clearCart(groupId: string) {
  const supabase = createClient()
  
  const { error } = await (supabase
    .from('cart_items') as any)
    .delete()
    .eq('group_id', groupId)
  
  if (error) {
    throw new Error(`Failed to clear cart: ${error.message}`)
  }
}
