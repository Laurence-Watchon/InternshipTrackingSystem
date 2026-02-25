import { useState } from 'react'

function RequiredHoursCard({ initialHours, onSave }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hours, setHours] = useState(initialHours || {
    'BSCS-DS': '',
    'BSIT-BA': '',
    'BSIT-SD': ''
  })

  const hasAllHours = Object.values(hours).every(h => h !== '' && parseInt(h) > 0)

  const handleChange = (course, value) => {
    // Only allow numbers
    const numValue = value.replace(/[^0-9]/g, '')
    setHours(prev => ({
      ...prev,
      [course]: numValue
    }))
  }

  const handleConfirm = () => {
    if (!hasAllHours) {
      alert('Please fill in all required hours')
      return
    }
    onSave(hours)
    // Collapse the card after confirming
    setIsExpanded(false)
  }

  return (
    <div className={`rounded-lg border-2 transition-all ${
      hasAllHours ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            hasAllHours ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {hasAllHours ? (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${hasAllHours ? 'text-green-900' : 'text-red-900'}`}>
              Required Hours per Course
            </h3>
            <p className={`text-sm ${hasAllHours ? 'text-green-700' : 'text-red-700'}`}>
              {hasAllHours 
                ? 'All course hours have been set' 
                : 'Please set required hours for all courses'}
            </p>
          </div>
        </div>
        <svg 
          className={`w-5 h-5 ${hasAllHours ? 'text-green-600' : 'text-red-600'} transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
          <div className="pt-4 space-y-4">
            {/* BSCS-DS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BSCS-DS Required Hours
              </label>
              <input
                type="text"
                value={hours['BSCS-DS']}
                onChange={(e) => handleChange('BSCS-DS', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter hours (e.g., 500)"
              />
            </div>

            {/* BSIT-BA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BSIT-BA Required Hours
              </label>
              <input
                type="text"
                value={hours['BSIT-BA']}
                onChange={(e) => handleChange('BSIT-BA', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter hours (e.g., 500)"
              />
            </div>

            {/* BSIT-SD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BSIT-SD Required Hours
              </label>
              <input
                type="text"
                value={hours['BSIT-SD']}
                onChange={(e) => handleChange('BSIT-SD', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter hours (e.g., 500)"
              />
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none"
            >
              Confirm Required Hours
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequiredHoursCard