'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRealtimeCart } from '@/hooks/useRealtimeCart'
import { completeCheckout } from '@/lib/supabase/checkout'
import TaxTipInput from '@/components/TaxTipInput'
import type { Database } from '@/types/database'

type CartItemType = Database['public']['Tables']['cart_items']['Row']

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string

  const { cartItems, loading: cartLoading } = useRealtimeCart(groupId)
  const [userInfo, setUserInfo] = useState<{ email: string; firstName: string } | null>(null)
  const [taxRate, setTaxRate] = useState(0.08) // 8% default
  const [tipRate, setTipRate] = useState(0.18) // 18% default
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  const taxAmount = subtotal * taxRate
  const tipAmount = subtotal * tipRate
  const totalAmount = subtotal + taxAmount + tipAmount

  const groupedByUser = cartItems.reduce((acc, item) => {
    if (!acc[item.added_by_email]) {
      acc[item.added_by_email] = {
        name: item.added_by_name,
        items: [] as CartItemType[],
      }
    }
    acc[item.added_by_email].items.push(item)
    return acc
  }, {} as Record<string, { name: string; items: CartItemType[] }>)

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const result = await completeCheckout({
        groupId,
        taxRate,
        tipRate,
      })

      // Trigger invoice generation via API
      try {
        await fetch('/api/invoices/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: result.orderId,
            groupId,
          }),
        })
      } catch (invoiceError) {
        console.error('Failed to send invoices:', invoiceError)
        // Don't block checkout if invoice fails
      }

      router.push(`/group/${groupId}/order-status`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete checkout')
      setProcessing(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              href={`/group/${groupId}/cart`}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/group/${groupId}/cart`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              {Object.entries(groupedByUser).map(([email, { name, items }]) => (
                <div key={email} className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{name}&apos;s Items</h3>
                  <div className="space-y-2">
                    {items.map((item: CartItemType) => {
                      const itemTotal = item.price * item.quantity
                      return (
                        <div key={item.id} className="flex justify-between text-sm">
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax & Tip</h2>
              <div className="space-y-4">
                <TaxTipInput
                  label="Tax Rate"
                  value={taxRate}
                  onChange={setTaxRate}
                  placeholder="8.00"
                />
                <TaxTipInput
                  label="Tip Rate"
                  value={tipRate}
                  onChange={setTipRate}
                  placeholder="18.00"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Total</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({(taxRate * 100).toFixed(1)}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tip ({(tipRate * 100).toFixed(1)}%)</span>
                  <span>${tipAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                One person will complete payment. Others will receive an invoice via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
