'use client'

import { useState } from 'react'
import { updateCartItemQuantity, deleteCartItem } from '@/lib/supabase/cart'

interface CartItemProps {
  item: {
    id: string
    added_by_name: string
    item_name: string
    item_description: string | null
    quantity: number
    price: number
    special_instructions: string | null
  }
  currentUserEmail: string | null
  addedByEmail: string
  onUpdate?: () => void
}

export default function CartItem({ item, currentUserEmail, addedByEmail, onUpdate }: CartItemProps) {
  const [updating, setUpdating] = useState(false)
  const isOwner = currentUserEmail === addedByEmail

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setUpdating(true)
    try {
      await updateCartItemQuantity(item.id, newQuantity)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Remove this item from cart?')) return

    setUpdating(true)
    try {
      await deleteCartItem(item.id)
      onUpdate?.()
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to remove item. Please try again.')
    } finally {
      setUpdating(false)
    }
  }

  const subtotal = item.price * item.quantity

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{item.item_name}</h3>
            {item.special_instructions && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Note
              </span>
            )}
          </div>
          {item.item_description && (
            <p className="text-gray-600 text-sm mb-2">{item.item_description}</p>
          )}
          {item.special_instructions && (
            <p className="text-sm text-gray-700 italic mb-2">
              "{item.special_instructions}"
            </p>
          )}
          <p className="text-sm text-indigo-600">
            Added by {item.added_by_name}
          </p>
        </div>
        <div className="text-lg font-bold text-gray-900 ml-4">
          ${subtotal.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Quantity:</span>
          {isOwner ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={updating || item.quantity <= 1}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded"
              >
                -
              </button>
              <span className="px-4 py-1 border border-gray-300 rounded min-w-[3rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={updating}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <span className="font-semibold">{item.quantity}</span>
          )}
          <span className="text-sm text-gray-500">@ ${item.price.toFixed(2)} each</span>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={updating}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
