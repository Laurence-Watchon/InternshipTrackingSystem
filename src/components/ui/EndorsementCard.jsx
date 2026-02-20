/**
 * EndorsementCard
 *
 * Props:
 *   status          – 'unavailable' | 'in_process' | 'ready'
 *   dateRequested   – string | null  (ISO date)
 *   dateApproved    – string | null  (ISO date)
 *   downloadUrl     – string | null
 *   allApproved     – boolean        (all requirements approved)
 *   onRequest       – () => void
 *   onDownload      – () => void
 */
export default function EndorsementCard({
  status = 'unavailable',
  dateRequested = null,
  dateApproved = null,
  //downloadUrl = null,
  allApproved = false,
  onRequest,
  onDownload,
}) {

  /* ── Status config ── */
  const config = {
    unavailable: {
      icon: (
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      badge: 'bg-gray-100 text-gray-600',
      title: 'Not Available',
      description: 'You have not yet completed all the required documents. Please submit and get all requirements approved before you can request your endorsement letter.',
    },
    in_process: {
      icon: (
        <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: 'bg-yellow-100 text-yellow-700',
      title: 'In Process',
      description: 'Your request has been received. The coordinator is currently reviewing and preparing your endorsement letter. This usually takes 3–5 business days.',
    },
    ready: {
      icon: (
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: 'bg-green-100 text-green-700',
      title: 'Ready for Download',
      description: 'Your endorsement letter has been approved and is ready to download. Present this letter to your internship company on or before your first day.',
    },
  }

  const current = config[status] || config.unavailable
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

      {/* Icon + Title */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">{current.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{current.title}</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">{current.description}</p>
      </div>

      {/* Status badge */}
      <div className="flex justify-center mb-6">
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${current.badge}`}>
          {current.title}
        </span>
      </div>

      {/* ── Actions per status ── */}

      {/* UNAVAILABLE */}
      {status === 'unavailable' && (
        <button
          onClick={allApproved ? onRequest : undefined}
          disabled={!allApproved}
          className={`w-full py-3 rounded-lg font-semibold transition focus:outline-none ${
            allApproved
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {allApproved ? 'Request Endorsement Letter' : 'Complete All Requirements First'}
        </button>
      )}

      {/* IN PROCESS */}
      {status === 'in_process' && (
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-yellow-600">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-semibold">Processing your request...</span>
          </div>
          {dateRequested && (
            <p className="text-sm text-gray-500">Requested on {fmt(dateRequested)}</p>
          )}
        </div>
      )}

      {/* READY */}
      {status === 'ready' && (
        <div className="space-y-3">
          <button
            onClick={onDownload}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Endorsement Letter
          </button>
          {dateApproved && (
            <p className="text-center text-sm text-gray-500">Approved on {fmt(dateApproved)}</p>
          )}
        </div>
      )}

      {/* ── Important Information box ── */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li>• All requirements must be approved before requesting</li>
              <li>• Processing typically takes 3-5 business days</li>
              <li>• Endorsement letter is valid for the current academic year</li>
              <li>• Present this letter to your internship company</li>
              <li className="text-blue-600 text-xs pt-1">
                ⚠ The endorsement letter is valid for the current academic year only.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}