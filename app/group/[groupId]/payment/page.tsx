'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getGroup } from '@/lib/supabase/groups'
import { getUserOrderSummaries } from '@/lib/supabase/orders'
import { getOrderByGroup } from '@/lib/supabase/orders'
import { generateVenmoQRCode, formatVenmoHandle } from '@/lib/venmo'
import { createClient } from '@/lib/supabase/client'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string

  const [group, setGroup] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)
  const [userSummaries, setUserSummaries] = useState<any[]>([])
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<{ email: string; firstName: string } | null>(null)
  const [venmoHandle, setVenmoHandle] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`group_${groupId}_user`)
    if (stored) {
      setUserInfo(JSON.parse(stored))
    } else {
      router.push(`/join-group`)
      return
    }

    loadPaymentData()
  }, [groupId, router])

  const loadPaymentData = async () => {
    try {
      const [groupData, orderData] = await Promise.all([
        getGroup(groupId),
        getOrderByGroup(groupId),
      ])

      setGroup(groupData)
      setOrder(orderData)

      if (groupData?.venmo_handle) {
        setVenmoHandle(groupData.venmo_handle)
        try {
          const qr = await generateVenmoQRCode(groupData.venmo_handle)
          setQrCode(qr)
        } catch (error) {
          console.error('Failed to generate QR code:', error)
        }
      }

      if (orderData) {
        const summaries = await getUserOrderSummaries(orderData.id)
        setUserSummaries(summaries)
      }
    } catch (error) {
      console.error('Failed to load payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveVenmo = async () => {
    if (!venmoHandle.trim()) {
      alert('Please enter a Venmo handle')
      return
    }

    setSaving(true)
    try {
      const formattedHandle = formatVenmoHandle(venmoHandle)
      const supabase = createClient()

      const { error } = await supabase
        .from('groups')
        .update({
          venmo_handle: formattedHandle,
          checkout_user_email: userInfo?.email,
        })
        .eq('id', groupId)

      if (error) {
        throw new Error(`Failed to save Venmo handle: ${error.message}`)
      }

      // Generate QR code
      const qr = await generateVenmoQRCode(formattedHandle)

      // Save QR code to database
      await supabase
        .from('groups')
        .update({ venmo_qr_code: qr })
        .eq('id', groupId)

      setGroup({ ...group, venmo_handle: formattedHandle })
      setQrCode(qr)
    } catch (error) {
      console.error('Failed to save Venmo handle:', error)
      alert('Failed to save Venmo handle. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const currentUserSummary = userSummaries.find(
    (summary) => summary.user_email === userInfo?.email
  )

  if (loading || !userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!group || !order) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/group/${groupId}/order-status`}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Order Status
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Information</h1>

        {currentUserSummary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Total</h2>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              ${currentUserSummary.total_amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Subtotal: ${currentUserSummary.subtotal.toFixed(2)}</div>
              <div>Tax: ${currentUserSummary.tax_amount.toFixed(2)}</div>
              <div>Tip: ${currentUserSummary.tip_amount.toFixed(2)}</div>
            </div>
          </div>
        )}

        {!group.venmo_handle && userInfo?.email === group.checkout_user_email && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Your Venmo Handle</h2>
            <p className="text-gray-600 mb-4">
              Share your Venmo handle so others can send you payment for their portion of the order.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                value={venmoHandle}
                onChange={(e) => setVenmoHandle(e.target.value)}
                placeholder="@yourusername"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleSaveVenmo}
                disabled={saving || !venmoHandle.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {group.venmo_handle && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Payment Via Venmo</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {qrCode && (
                <div className="text-center">
                  <img src={qrCode} alt="Venmo QR Code" className="w-64 h-64 mx-auto mb-4" />
                  <p className="text-sm text-gray-600">Scan with Venmo app</p>
                </div>
              )}
              <div className="flex-1">
                <p className="text-gray-600 mb-4">
                  Send your payment to:
                </p>
                <div className="text-2xl font-bold text-indigo-600 mb-4">
                  {group.venmo_handle}
                </div>
                <p className="text-sm text-gray-500">
                  Open the Venmo app and search for this username, or scan the QR code above.
                </p>
              </div>
            </div>
          </div>
        )}

        {group.venmo_handle && userSummaries.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-3">
              {userSummaries.map((summary) => (
                <div key={summary.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{summary.user_name}</span>
                  <span className="font-semibold text-gray-900">
                    ${summary.total_amount.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
