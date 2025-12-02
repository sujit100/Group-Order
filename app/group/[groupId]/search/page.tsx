'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchRestaurants } from '@/lib/mock-restaurants'
import { setGroupRestaurant } from '@/lib/supabase/restaurants'

export default function SearchRestaurantsPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  
  const [query, setQuery] = useState('')
  const [restaurants, setRestaurants] = useState(searchRestaurants(''))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setRestaurants(searchRestaurants(query))
  }, [query])

  const handleSelectRestaurant = async (restaurantId: string, restaurantName: string) => {
    setLoading(true)
    try {
      await setGroupRestaurant(groupId, restaurantId, restaurantName)
      router.push(`/group/${groupId}/menu/${restaurantId}`)
    } catch (error) {
      console.error('Failed to select restaurant:', error)
      alert('Failed to select restaurant. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/group/${groupId}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Group
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Restaurants</h1>

        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or cuisine..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => !loading && handleSelectRestaurant(restaurant.id, restaurant.name)}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⭐ {restaurant.rating}</span>
                  <span>🕐 {restaurant.deliveryTime}</span>
                  <span>${restaurant.deliveryFee} delivery</span>
                </div>
                <button
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectRestaurant(restaurant.id, restaurant.name)
                  }}
                >
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No restaurants found. Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
