'use client'

interface TaxTipInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
}

export default function TaxTipInput({ label, value, onChange, placeholder }: TaxTipInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      onChange(0)
      return
    }
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue)
    }
  }

  const handlePercentageChange = (percent: number) => {
    onChange(percent / 100)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          min="0"
          value={value > 0 ? (value * 100).toFixed(2) : ''}
          onChange={handleInputChange}
          placeholder={placeholder || '0.00'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <span className="px-3 py-2 text-gray-600">%</span>
      </div>
      <div className="flex gap-2 mt-2">
        {[10, 15, 18, 20, 25].map((percent) => (
          <button
            key={percent}
            type="button"
            onClick={() => handlePercentageChange(percent)}
            className={`px-3 py-1 text-sm rounded ${
              Math.abs(value * 100 - percent) < 0.01
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {percent}%
          </button>
        ))}
      </div>
    </div>
  )
}
