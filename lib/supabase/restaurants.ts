import { createClient } from './client'

/**
 * Set the restaurant for a group
 */
export async function setGroupRestaurant(groupId: string, restaurantId: string, restaurantName: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('groups')
    .update({
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
    })
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
  
  const { data, error } = await supabase
    .from('groups')
    .select('restaurant_id, restaurant_name')
    .eq('id', groupId)
    .single()
  
  if (error) {
    throw new Error(`Failed to get restaurant: ${error.message}`)
  }
  
  return {
    restaurantId: data?.restaurant_id,
    restaurantName: data?.restaurant_name,
  }
}
