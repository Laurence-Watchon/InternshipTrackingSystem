import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'

export default function RejectedDialog({ isOpen, onClose, reason, college }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-5 relative">
            <TriangleAlert
              className="h-12 w-12 text-red-600 animate-bounce absolute"
              strokeWidth={2}
            />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Rejected</h3>

          <p className="text-sm text-gray-600 mb-4 px-2 leading-relaxed">
            Sorry, but the admin from <span className="font-semibold text-gray-800">{college}</span> rejected your registration with the reason of:
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-6">
            <p className="text-sm font-medium text-red-600">"{reason}"</p>
          </div>

          <button
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  )
}
