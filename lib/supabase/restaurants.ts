import { createClient } from './client'
import type { Database } from '@/types/database'

/**
 * Set the restaurant for a group
 */
export async function setGroupRestaurant(groupId: string, restaurantId: string, restaurantName: string) {
  const supabase = createClient()
  
  type GroupUpdate = Database['public']['Tables']['groups']['Update']
  const updateData: GroupUpdate = {
    restaurant_id: restaurantId,
    restaurant_name: restaurantName,
  }
  
  const { error } = await (supabase
    .from('groups') as any)
    .update(updateData)
    .eq('id', groupId)
  
  if (error) {
    throw new Error(`Failed to set restaurant: ${error.message}`)
  }
}

/**
 * Get the selected restaurant for a group
 */
export async function getGroupRestaurant(groupId: string) {
  const supabase = createClient()
  
  type GroupRow = Database['public']['Tables']['groups']['Row']
  
  const { data, error } = await supabase
    .from('groups')
    .select('restaurant_id, restaurant_name')
    .eq('id', groupId)
    .single()
  
  if (error) {
    throw new Error(`Failed to get restaurant: ${error.message}`)
  }
  
  const typedData = data as Pick<GroupRow, 'restaurant_id' | 'restaurant_name'> | null
  
  return {
    restaurantId: typedData?.restaurant_id || null,
    restaurantName: typedData?.restaurant_name || null,
  }
}
