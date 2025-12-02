'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getGroup } from '@/lib/supabase/groups'
import { getGroupRestaurant } from '@/lib/supabase/restaurants'

export default function GroupDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string

  const [group, setGroup] = useState<any>(null)
  const [restaurant, setRestaurant] = useState<{ restaurantId: string | null; restaurantName: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<{ email: string; firstName: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(`group_${groupId}_user`)
    if (stored) {
      setUserInfo(JSON.parse(stored))
    } else {
      router.push(`/join-group`)
      return
    }

    loadGroupData()
  }, [groupId, router])

  const loadGroupData = async () => {
    try {
      const [groupData, restaurantData] = await Promise.all([
        getGroup(groupId),
        getGroupRestaurant(groupId),
      ])
      setGroup(groupData)
      setRestaurant(restaurantData)
    } catch (error) {
      console.error('Failed to load group data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !userInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Group not found</h1>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/join-group?code=${group.code}` : ''
  const groupUrl = typeof window !== 'undefined' ? `${window.location.origin}/group/${groupId}` : ''
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  const handleShare = async () => {
    if (canShare && shareUrl) {
      try {
        await navigator.share({
          title: 'Join my group order!',
          text: `Join my group order with code: ${group.code}`,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    }
  }

  const copyToClipboard = (url: string, type: string) => {
    if (url) {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Order</h1>
              <p className="text-gray-600">Group Code: <span className="font-bold text-2xl tracking-widest">{group.code}</span></p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-4">
              {canShare ? (
                <button
                  onClick={handleShare}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Share Group
                </button>
              ) : null}
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {showShareOptions ? 'Hide' : 'Show'} Share Options
              </button>
            </div>

            {showShareOptions && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Link (Share this with others to let them join):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={() => copyToClipboard(shareUrl, 'join')}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Recipients will enter their email and name, then join the group
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {group.status === 'browsing' && (
          <div className="space-y-4">
            {!restaurant?.restaurantId ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started</h2>
                <p className="text-gray-600 mb-6">Search for a restaurant and start adding items to your group order.</p>
                <Link
                  href={`/group/${groupId}/search`}
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Search Restaurants
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Selected Restaurant</h2>
                <p className="text-gray-600 mb-4">{restaurant.restaurantName}</p>
                <div className="flex gap-4">
                  <Link
                    href={`/group/${groupId}/menu/${restaurant.restaurantId}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    View Menu
                  </Link>
                  <Link
                    href={`/group/${groupId}/cart`}
                    className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {group.status === 'ordered' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Placed!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed. Check your email for your invoice.</p>
            <Link
              href={`/group/${groupId}/order-status`}
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Order Status
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
