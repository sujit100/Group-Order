'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCartItems } from '@/lib/supabase/cart'
import type { Database } from '@/types/database'

type CartItem = Database['public']['Tables']['cart_items']['Row']

export function useRealtimeCart(groupId: string) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Initial load
    loadCartItems()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`cart:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          // Reload cart items on any change
          loadCartItems()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [groupId])

  const loadCartItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await getCartItems(groupId)
      setCartItems(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  return { cartItems, loading, error, refetch: loadCartItems }
}
