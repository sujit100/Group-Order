'use client'

import { useState } from 'react'

interface MenuItemProps {
  item: {
    id: string
    name: string
    description: string
    price: number
    category: string
  }
  onAddToCart: (itemId: string, quantity: number, specialInstructions?: string) => void
  addedBy?: string
}

export default function MenuItem({ item, onAddToCart, addedBy }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAdd = () => {
    onAddToCart(item.id, quantity, specialInstructions.trim() || undefined)
    setQuantity(1)
    setSpecialInstructions('')
    setShowAddForm(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        </div>
        <div className="text-lg font-bold text-gray-900 ml-4">
          ${item.price.toFixed(2)}
        </div>
      </div>

      {addedBy && (
        <div className="text-sm text-indigo-600 mb-2">
          Added by {addedBy}
        </div>
      )}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Add to Cart
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                -
              </button>
              <span className="px-4 py-1 border border-gray-300 rounded min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions (optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., no onions, extra sauce..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Add {quantity} to Cart
            </button>
            <button
              onClick={() => {
                setShowAddForm(false)
                setQuantity(1)
                setSpecialInstructions('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
