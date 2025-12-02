import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Group Ordering
          </h1>
          <p className="text-gray-600">
            Order meals together with friends and family
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/create-group"
            className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Create New Group
          </Link>
          
          <Link
            href="/join-group"
            className="block w-full bg-gray-200 text-gray-900 text-center py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Join Existing Group
          </Link>
        </div>
      </div>
    </div>
  );
}
