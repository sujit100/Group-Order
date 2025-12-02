'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getRestaurantById } from '@/lib/mock-restaurants'
import MenuItem from '@/components/MenuItem'
import { addToCart } from '@/lib/supabase/cart'

export default function MenuPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  const restaurantId = params.restaurantId as string

  const [restaurant, setRestaurant] = useState(getRestaurantById(restaurantId))
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{ email: string; firstName: string } | null>(null)

  useEffect(() => {
    // Get user info from localStorage
    const stored = localStorage.getItem(`group_${groupId}_user`)
    if (stored) {
      setUserInfo(JSON.parse(stored))
    } else {
      router.push(`/join-group`)
    }
  }, [groupId, router])

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h1>
          <Link
            href={`/group/${groupId}/search`}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Search
          </Link>
        </div>
      </div>
    )
  }

  if (!userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  const groupedMenu = restaurant.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof restaurant.menu>)

  const handleAddToCart = async (itemId: string, quantity: number, specialInstructions?: string) => {
    setLoading(true)
    try {
      const menuItem = restaurant.menu.find((item) => item.id === itemId)
      if (!menuItem) {
        throw new Error('Menu item not found')
      }

      await addToCart({
        groupId,
        addedByEmail: userInfo.email,
        addedByName: userInfo.firstName,
        itemName: menuItem.name,
        itemDescription: menuItem.description,
        quantity,
        price: menuItem.price,
        specialInstructions,
      })

      // Show success feedback
      alert(`Added ${quantity}x ${menuItem.name} to cart!`)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add item to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/group/${groupId}/search`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Search
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>⭐ {restaurant.rating}</span>
            <span>🕐 {restaurant.deliveryTime}</span>
            <span>${restaurant.deliveryFee} delivery fee</span>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
          <Link
            href={`/group/${groupId}/cart`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Cart
          </Link>
        </div>

        {loading && (
          <div className="text-center py-4 text-gray-600">Adding to cart...</div>
        )}

        <div className="space-y-8">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
