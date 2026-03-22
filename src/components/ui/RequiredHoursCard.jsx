import { useState, useEffect } from 'react'
import { AlertTriangle, Check, ChevronDown } from 'lucide-react'

function RequiredHoursCard({ initialHours = {}, onSave }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hours, setHours] = useState(initialHours)
  const [errors, setErrors] = useState({})

  // Update hours state when initialHours changes (e.g., after fetching from API)
  useEffect(() => {
    if (Object.keys(initialHours).length > 0) {
      setHours(initialHours)
    }
  }, [initialHours])

  const courseKeys = Object.keys(initialHours)
  const hasAllHours = courseKeys.length > 0 && courseKeys.every(h => hours[h] !== '' && parseInt(hours[h]) > 0)

  const handleChange = (course, value) => {
    const numValue = value.replace(/[^0-9]/g, '')
    setHours(prev => ({
      ...prev,
      [course]: numValue
    }))
    if (errors[course]) {
      setErrors(prev => ({
        ...prev,
        [course]: ''
      }))
    }
  }

  const handleConfirm = () => {
    const newErrors = {}
    let hasError = false

    courseKeys.forEach(course => {
      if (!hours[course] || parseInt(hours[course]) <= 0) {
        newErrors[course] = `${course} Required Hours is required`
        hasError = true
      }
    })

    if (hasError) {
      setErrors(newErrors)
      return
    }

    onSave(hours)
  }

  if (courseKeys.length === 0) return null

  return (
    <div className={`rounded-xl border-4 transition-all ${hasAllHours ? 'bg-green-50 border-green-200' : 'bg-white border-red-300'
      }`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasAllHours ? 'bg-green-100' : ''
            }`}>
            {hasAllHours ? (
              <Check className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
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
        <ChevronDown
          className={`w-5 h-5 ${hasAllHours ? 'text-green-600' : 'text-red-600'} transition-transform ${isExpanded ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-200">
          <div className="pt-4 space-y-4">
            {courseKeys.map(course => (
              <div key={course}>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase">
                  {course} Required Hours
                </label>
                <input
                  type="text"
                  value={hours[course] || ''}
                  onChange={(e) => handleChange(course, e.target.value)}
                  className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 ${errors[course]
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                    }`}
                  placeholder="Enter hours (e.g., 500)"
                />
                {errors[course] && (
                  <p className="text-red-500 text-sm mt-1">{errors[course]}</p>
                )}
              </div>
            ))}

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