'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { joinGroup } from '@/lib/supabase/groups'

export default function JoinGroupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Pre-fill code from query parameter
    const codeParam = searchParams.get('code')
    if (codeParam) {
      setCode(codeParam.toUpperCase())
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!code.trim() || !email.trim() || !firstName.trim()) {
        throw new Error('Please fill in all fields')
      }

      const { group } = await joinGroup({
        code: code.trim().toUpperCase(),
        email: email.trim(),
        firstName: firstName.trim(),
      })

      // Store user info in localStorage for session
      localStorage.setItem(`group_${group.id}_user`, JSON.stringify({
        email: email.trim(),
        firstName: firstName.trim(),
      }))

      router.push(`/group/${group.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Join Group
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Group Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl font-bold tracking-widest"
              placeholder="ABC123"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="John"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Joining...' : 'Join Group'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
