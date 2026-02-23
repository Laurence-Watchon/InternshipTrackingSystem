import { useEffect, useState } from 'react'

/**
 * RejectRegistrationDialog
 *
 * Props:
 *   isOpen    – boolean
 *   onClose   – () => void
 *   onConfirm – (reason: string) => void
 *   student   – { firstName, lastName, studentNumber } | null
 */

const REASONS = [
  { value: 'not_in_masterlist',    label: 'Student number does not exist in the masterlist' },
  { value: 'invalid_info',         label: 'Student information does not match records'       },
  { value: 'duplicate',            label: 'Duplicate registration detected'                  },
  { value: 'not_enrolled',         label: 'Student is not currently enrolled'                },
  { value: 'incomplete_documents', label: 'Incomplete or invalid documents submitted'        },
  { value: 'other',                label: 'Other reason'                                     },
]

export default function RejectRegistrationDialog({ isOpen, onClose, onConfirm, student }) {
  const [selected, setSelected]   = useState('')
  const [otherText, setOtherText] = useState('')
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleConfirm() {
    if (!selected) {
      setError('Please select a reason for rejection.')
      return
    }
    if (selected === 'other' && !otherText.trim()) {
      setError('Please specify the reason.')
      return
    }
    setError('')
    const reason = selected === 'other' ? otherText.trim() : REASONS.find(r => r.value === selected)?.label
    onConfirm(reason)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Reject Registration</h2>
              {student && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {student.lastName}, {student.firstName} · {student.studentNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4">
            Select the reason for rejecting this student's registration. The student will be notified.
          </p>

          <div className="space-y-2.5">
            {REASONS.map(reason => (
              <label
                key={reason.value}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                  ${selected === reason.value
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="rejection_reason"
                  value={reason.value}
                  checked={selected === reason.value}
                  onChange={() => { setSelected(reason.value); setError('') }}
                  className="mt-0.5 accent-red-500 flex-shrink-0"
                />
                <span className="text-sm text-gray-700 font-medium">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* Other text input */}
          {selected === 'other' && (
            <textarea
              rows={2}
              placeholder="Please specify the reason..."
              value={otherText}
              onChange={e => { setOtherText(e.target.value); setError('') }}
              className="mt-3 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 transition bg-gray-50 resize-none"
            />
          )}

          {/* Validation error */}
          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-600">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-lg focus:outline-none"
          >
            Reject Registration
          </button>
        </div>
      </div>
    </div>
  )
}