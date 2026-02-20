/**
 * RequirementsChecklist
 *
 * Props:
 *   requirements – [{ name: string, status: 'approved' | 'pending' | 'rejected' }]
 *   onHelpClick  – () => void
 */
export default function RequirementsChecklist({ requirements = [], onHelpClick }) {
  const approved = requirements.filter(r => r.status === 'approved').length
  const total = requirements.length
  const percentage = total > 0 ? (approved / total) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col" style={{ maxHeight: '520px' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Requirements Checklist</h3>
      <p className="text-xs text-gray-500 mb-4">All requirements must be approved before requesting your endorsement letter.</p>

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
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                {/* Status dot */}
                {req.status === 'approved' ? (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : req.status === 'rejected' ? (
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex-shrink-0" />
                )}
                <span className={`text-sm truncate ${req.status === 'approved' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {req.name}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 font-medium ${
                req.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : req.status === 'rejected'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-green-600">{approved} / {total} approved</span>
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