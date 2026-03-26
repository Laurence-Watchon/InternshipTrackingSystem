/**
 * RequirementsChecklist
 *
 * Props:
 *   requirements – [{ name: string, status: 'submitted' | 'pending' }]
 *   onHelpClick  – () => void
 */
export default function RequirementsChecklist({ requirements = [], onHelpClick }) {
  const completed = requirements.filter(r => r.status === 'verified' || r.status === 'submitted').length
  const total = requirements.length
  const percentage = total > 0 ? (completed / total) * 100 : 0

  const getStatusStyles = (status) => {
    switch (status) {
      case 'submitted':
        return {
          dot: 'bg-green-500',
          badge: 'bg-green-100 text-green-700',
          label: 'Submitted',
          text: 'text-gray-900 font-medium'
        }
      case 'rejected':
        return {
          dot: 'bg-red-500',
          badge: 'bg-red-100 text-red-700',
          label: 'Rejected',
          text: 'text-red-600 font-medium'
        }
      default:
        return {
          dot: 'bg-orange-400',
          badge: 'bg-gray-100 text-gray-600',
          label: 'Pending',
          text: 'text-gray-500'
        }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col" style={{ maxHeight: '520px' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Requirements Checklist</h3>
      <p className="text-xs text-gray-500 mb-4">All requirements must be submitted before requesting your endorsement letter.</p>

      {/* Scrollable list */}
      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#86efac transparent',
        }}
      >
        <style>{`
          .req-scroll::-webkit-scrollbar { width: 4px; }
          .req-scroll::-webkit-scrollbar-track { background: transparent; }
          .req-scroll::-webkit-scrollbar-thumb { background-color: #86efac; border-radius: 999px; }
        `}</style>

        <div className="req-scroll space-y-2">
          {requirements.map((req, index) => {
            const styles = getStatusStyles(req.status)
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status dot */}
                  <div className={`w-5 h-5 ${styles.dot} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {(req.status === 'verified' || req.status === 'submitted') && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {req.status === 'rejected' && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {(!req.status || req.status === 'pending') && (
                      <span className="text-white text-xs font-bold leading-none">!</span>
                    )}
                  </div>
                  <span className={`text-sm truncate ${styles.text}`}>
                    {req.name}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 font-medium ${styles.badge}`}>
                  {styles.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-green-600">{completed} / {total} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Help link */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onHelpClick}
          className="text-sm text-green-600 font-medium flex items-center gap-2 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Need help?
        </button>
      </div>
    </div>
  )
}