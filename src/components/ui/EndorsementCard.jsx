import { useState } from 'react'

/**
 * EndorsementCard
 *
 * Props:
 *   status          – 'unavailable' | 'in_process' | 'ready'
 *   dateRequested   – string | null  (ISO date)
 *   dateApproved    – string | null  (ISO date)
 *   allApproved     – boolean
 *   onRequest       – (companyInfo: { companyName, address, supervisorName }) => Promise<void>
 *   onDownload      – () => void
 */
export default function EndorsementCard({
  status = 'unavailable',
  dateRequested = null,
  dateApproved = null,
  allApproved = false,
  onRequest,
}) {
  const [form, setForm]       = useState({ companyName: '', address: '', supervisorName: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.companyName.trim())    e.companyName    = 'Company name is required.'
    if (!form.address.trim())        e.address        = 'Company address is required.'
    if (!form.supervisorName.trim()) e.supervisorName = 'Supervisor full name is required.'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setLoading(true)
    await onRequest({ ...form })
    setLoading(false)
  }

  // Show form when all requirements done but letter not yet requested
  const showForm = allApproved && status === 'unavailable'

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
      title: 'Ready for Pickup',
    },
  }

  const current = config[status] || config.unavailable

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

      {/* Icon + Title */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {showForm ? (
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          ) : current.icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {showForm ? 'Ready to Request' : current.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
          {showForm
            ? 'All your requirements have been approved! Fill in your company details below to request your endorsement letter.'
            : current.description}
        </p>
      </div>

      {/* Status badge */}
      <div className="flex justify-center mb-6">
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold
          ${showForm ? 'bg-green-100 text-green-700' : current.badge}`}>
          {showForm ? 'Requirements Complete' : current.title}
        </span>
      </div>

      {/* ── NOT AVAILABLE (requirements incomplete) ── */}
      {status === 'unavailable' && !showForm && (
        <button
          disabled
          className="w-full py-3 rounded-lg font-semibold bg-gray-200 text-gray-400 cursor-not-allowed focus:outline-none"
        >
          Complete All Requirements First
        </button>
      )}

      {/* ── FORM (all approved, not yet requested) ── */}
      {showForm && (
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Internship Company Details
          </h3>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tech Solutions Inc."
              value={form.companyName}
              onChange={e => setField('companyName', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                ${errors.companyName ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Company Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Makati City, Metro Manila"
              value={form.address}
              onChange={e => setField('address', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* Supervisor */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Supervisor Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Smith"
              value={form.supervisorName}
              onChange={e => setField('supervisorName', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                ${errors.supervisorName ? 'border-red-400' : 'border-gray-200'}`}
            />
            {errors.supervisorName && <p className="text-xs text-red-500 mt-1">{errors.supervisorName}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white flex items-center justify-center gap-2 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending Request...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Request Endorsement Letter
              </>
            )}
          </button>
        </div>
      )}

      {/* ── IN PROCESS ── */}
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

      {/* ── READY ── */}
      {status === 'ready' && (
        <div className="space-y-4">
          {/* Main Message Box */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="text-base font-bold text-green-900 mb-2">
                  Endorsement Letter Ready for Pickup
                </h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  Your endorsement letter is now ready! Please visit your <span className="font-semibold">OJT Coordinator</span> to claim the file with the official wet signature. Remember to bring a valid ID when claiming your document.
                </p>
              </div>
            </div>
          </div>

          {/* Date Approved */}
          {dateApproved && (
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ready Since</p>
              <p className="text-sm font-semibold text-gray-700">{fmt(dateApproved)}</p>
            </div>
          )}

          {/* Important Reminder */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-yellow-800">
                <span className="font-semibold">Note:</span> The physical document must be presented to your internship company. Digital copies are not accepted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Important Information ── */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li><span className="font-semibold">Step 1:</span> Submit all 9 required documents under the Requirements page.</li>
              <li><span className="font-semibold">Step 2:</span> Wait for the coordinator to review and approve each document. This may take a few days.</li>
              <li><span className="font-semibold">Step 3:</span> Once all approved, fill in your company details and submit the request.</li>
              <li><span className="font-semibold">Step 4:</span> Processing takes <span className="font-semibold">3–5 business days</span>.</li>
              <li><span className="font-semibold">Step 5:</span> Once ready, visit the OJT Coordinator's office to pick up your endorsement letter with wet signature.</li>
              <li className="text-blue-600 text-xs pt-1">⚠ The endorsement letter is valid for the current academic year only.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}