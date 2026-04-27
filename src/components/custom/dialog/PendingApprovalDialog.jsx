import { useEffect } from 'react'
import { Clock } from 'lucide-react'

const styles = `
  @keyframes pendingBackdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pendingCardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)     scale(1);    }
  }
  @keyframes pendingClockSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pendingPulseRing {
    0%, 100% { box-shadow: 0 0 0 0 rgba(234,179,8,0.4); }
    50%       { box-shadow: 0 0 0 10px rgba(234,179,8,0); }
  }
  .pending-backdrop {
    animation: pendingBackdropIn 0.25s ease both;
  }
  .pending-card {
    animation: pendingCardIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .pending-icon-ring {
    animation: pendingPulseRing 2s ease-in-out infinite;
  }
  .pending-clock {
    animation: pendingClockSpin 6s linear infinite;
  }
`

export default function PendingApprovalDialog({ isOpen, onClose }) {
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

  // Suppress keyboard Escape key so the dialog cannot be closed that way
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <style>{styles}</style>

      <div
        className="pending-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pending-card bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 text-center">
            {/* Animated icon */}
            <div className="pending-icon-ring mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-5">
              <Clock
                className="pending-clock h-8 w-8 text-yellow-500"
                strokeWidth={2}
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pending Approval
            </h3>

            <p className="text-sm text-gray-600 mb-4 px-2 leading-relaxed">
              Your account is currently awaiting verification from the admin. You will be able to access the system once your registration has been approved.
            </p>

            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
              <p className="text-sm font-medium text-yellow-700">
                Please check back later or contact your college OJT coordinator for assistance.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
