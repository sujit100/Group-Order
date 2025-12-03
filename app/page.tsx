'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim() || !email.trim()) {
      return
    }
    
    // Store user info temporarily
    localStorage.setItem('temp_user', JSON.stringify({
      firstName: username.trim(),
      email: email.trim()
    }))
    
    // Navigate to create group page
    router.push('/create-group')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-50 to-white relative overflow-hidden">
      {/* Food Emojis - Scattered around */}
      <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
        🍕
      </div>
      <div className="absolute top-40 left-20 text-5xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
        🍜
      </div>
      <div className="absolute bottom-32 left-16 text-6xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
        🍱
      </div>
      <div className="absolute top-24 right-16 text-6xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
        🍔
      </div>
      <div className="absolute top-60 right-24 text-5xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>
        🍝
      </div>
      <div className="absolute bottom-40 right-20 text-6xl animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3s' }}>
        🍗🌮
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Title and Slogan */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold text-orange-600 mb-4">
            OrderTogether
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Group ordering made simple
          </p>
        </div>

        {/* Get Started Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md relative overflow-hidden">
          {/* Decorative Fork in Background */}
          <div className="absolute top-0 right-0 text-gray-100 text-9xl -mr-8 -mt-8 opacity-30 transform rotate-12">
            🍴
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Get Started
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Join the easiest way to order food together
            </p>

            <form onSubmit={handleGetStarted} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? 'Loading...' : 'Get Started'}
              </button>
            </form>

            {/* Alternative: Join Existing Group */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have a group code?{' '}
                <Link href="/join-group" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Join existing group
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}