'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { getOrderByGroup } from '@/lib/supabase/orders'
import { getOrderItems, getUserOrderSummaries } from '@/lib/supabase/orders'
import { getGroup } from '@/lib/supabase/groups'

export default function OrderStatusPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string

  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [userSummaries, setUserSummaries] = useState<any[]>([])
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<{ email: string; firstName: string } | null>(null)

  const loadOrderData = useCallback(async () => {
    try {
      const [orderData, groupData] = await Promise.all([
        getOrderByGroup(groupId),
        getGroup(groupId),
      ])

      if (!orderData) {
        router.push(`/group/${groupId}`)
        return
      }

      const ord = orderData as any

      setOrder(orderData)
      setGroup(groupData)

      const [items, summaries] = await Promise.all([
        getOrderItems(ord.id),
        getUserOrderSummaries(ord.id),
      ])

      setOrderItems(items)
      setUserSummaries(summaries)
    } catch (error) {
      console.error('Failed to load order data:', error)
    } finally {
      setLoading(false)
    }
  }, [groupId, router])

  useEffect(() => {
    const stored = localStorage.getItem(`group_${groupId}_user`)
    if (stored) {
      setUserInfo(JSON.parse(stored))
    } else {
      router.push(`/join-group`)
      return
    }

    loadOrderData()
  }, [groupId, router, loadOrderData])

  if (loading || !userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No order found</p>
          <Link
            href={`/group/${groupId}`}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Back to Group
          </Link>
        </div>
      </div>
    )
  }

  const groupedByUser = orderItems.reduce((acc, item) => {
    if (!acc[item.added_by_email]) {
      acc[item.added_by_email] = {
        name: item.added_by_name,
        items: [],
      }
    }
    acc[item.added_by_email].items.push(item)
    return acc
  }, {} as Record<string, { name: string; items: typeof orderItems }>)

  const statusLabels: Record<string, string> = {
    placed: 'Order Placed',
    preparing: 'Preparing',
    in_transit: 'On the Way',
    delivered: 'Delivered',
  }

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

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Status</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold">
              {statusLabels[order.status] || order.status}
            </div>
            {group?.delivery_eta && (
              <div className="text-gray-600">
                ETA: {new Date(group.delivery_eta).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-6">
            {Object.entries(groupedByUser).map(([email, { name, items }]: [string, any]) => (
              <div key={email}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{name}&apos;s Items</h3>
                <div className="space-y-2">
                  {items.map((item) => {
                    const itemTotal = item.price * item.quantity
                    return (
                      <div key={item.id} className="flex justify-between text-sm pl-4">
                        <span className="text-gray-600">
                          {item.quantity}x {item.item_name}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
          <div className="space-y-4">
            {userSummaries.map((summary) => (
              <div key={summary.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{summary.user_name}</h3>
                  <span className="text-xl font-bold text-gray-900">
                    ${summary.total_amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 pl-4">
                  <div>Subtotal: ${summary.subtotal.toFixed(2)}</div>
                  <div>Tax: ${summary.tax_amount.toFixed(2)}</div>
                  <div>Tip: ${summary.tip_amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {group?.venmo_handle && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <p className="text-gray-600 mb-4">
              Please send your payment to: <span className="font-semibold">{group.venmo_handle}</span>
            </p>
            <Link
              href={`/group/${groupId}/payment`}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Payment Details
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
