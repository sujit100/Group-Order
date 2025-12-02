'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRealtimeCart } from '@/hooks/useRealtimeCart'
import CartItem from '@/components/CartItem'

export default function CartPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string

  const { cartItems, loading } = useRealtimeCart(groupId)
  const [userInfo, setUserInfo] = useState<{ email: string; firstName: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`group_${groupId}_user`)
    if (stored) {
      setUserInfo(JSON.parse(stored))
    } else {
      router.push(`/join-group`)
    }
  }, [groupId, router])

  if (!userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const groupedByUser = cartItems.reduce((acc, item) => {
    if (!acc[item.added_by_email]) {
      acc[item.added_by_email] = {
        name: item.added_by_name,
        items: [],
      }
    }
    acc[item.added_by_email].items.push(item)
    return acc
  }, {} as Record<string, { name: string; items: typeof cartItems }>)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/group/${groupId}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Group
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cart</h1>

        {loading && cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading cart...</div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              href={`/group/${groupId}/search`}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {Object.entries(groupedByUser).map(([email, { name, items }]: [string, any]) => (
                <div key={email}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {name}&apos;s Items
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        currentUserEmail={userInfo.email}
                        addedByEmail={email}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sticky bottom-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Subtotal:</span>
                <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <Link
                href={`/group/${groupId}/checkout`}
                className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
