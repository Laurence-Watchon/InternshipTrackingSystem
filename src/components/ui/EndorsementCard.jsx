import { apiFetch } from '../../config/api.js';
import { useState, useEffect, useRef } from 'react'
import { FileText, Clock, CheckCircle, Building2, Send, Loader2, AlertCircle, Info, FileQuestion, UploadCloud, ExternalLink, X, Paperclip, Image as ImageIcon } from 'lucide-react'
import Loading from './Loading'

/**
 * EndorsementCard
 *
 * Props:
 *   status          – 'unavailable' | 'in_process' | 'ready' | 'rejected' | 'completed'
 *   scannedFileName – string | null
 *   scannedFileUrl  – string | null
 *   onUploadScanned – (fileData: { fileName, fileUrl }) => Promise<void>
 */
export default function EndorsementCard({
  status = 'unavailable',
  dateRequested = null,
  dateApproved = null,
  rejectionReason = null,
  allSubmitted = false,
  onRequest,
  isSubmitting = false,
  scannedFileName = null,
  scannedFileUrl = null,
  onUploadScanned,
}) {
  const [form, setForm] = useState({ companyName: '', address: '', supervisorName: '' })
  const [errors, setErrors] = useState({})
  const [isResubmitting, setIsResubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [localFile, setLocalFile] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Reset resubmitting state when status changes (e.g. to in_process)
    setIsResubmitting(false)
  }, [status])

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await apiFetch(`/api/student/upload`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setLocalFile({
          name: data.fileName,
          url: data.secure_url
        })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to upload file.')
      }
    } catch (err) {
      console.error('Error uploading file:', err)
      alert('An error occurred during upload.')
    } finally {
      setIsUploading(false)
    }
  }

  async function handleUpload() {
    if (!localFile) return
    await onUploadScanned(localFile)
    setLocalFile(null)
  }

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.companyName.trim()) e.companyName = 'Company name is required.'
    if (!form.address.trim()) e.address = 'Company address is required.'
    if (!form.supervisorName.trim()) e.supervisorName = 'Supervisor full name is required.'
    return e
  }

  async function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    await onRequest({ ...form })
  }

  // Show form when all requirements submitted but letter not yet requested
  // OR when the user clicks 'Request New' after a rejection
  const showForm = (allSubmitted && status === 'unavailable') || isResubmitting

  const config = {
    unavailable: {
      icon: <FileQuestion className="w-16 h-16 text-gray-400" />,
      badge: 'bg-gray-100 text-gray-600',
      title: 'Not Available',
      description: 'You have not yet submitted all the required documents. Please submit all requirements before you can request your endorsement letter.',
    },
    in_process: {
      icon: <Clock className="w-16 h-16 text-yellow-500" />,
      badge: 'bg-yellow-100 text-yellow-700',
      title: 'In Process',
      description: 'Your request has been received. The coordinator is currently reviewing and preparing your endorsement letter. This usually takes 3–5 business days.',
    },
    ready: {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      badge: 'bg-green-100 text-green-700',
      title: 'Ready for Pickup',
    },
    rejected: {
      icon: <AlertCircle className="w-16 h-16 text-red-500" />,
      badge: 'bg-red-100 text-red-700',
      title: 'Rejected',
    },
    completed: {
      icon: <CheckCircle className="w-16 h-16 text-green-500" />,
      badge: 'bg-green-100 text-green-700',
      title: 'Claimed',
    },
  }

  const current = config[status] || config.unavailable

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

      {/* Icon + Title */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          {showForm ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : current.icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {showForm ? 'Ready to Request' : current.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
          {showForm
            ? 'All your requirements have been submitted! Fill in your company details below to request your endorsement letter.'
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
          Submit All Requirements First
        </button>
      )}

      {/* ── FORM (all submitted, not yet requested) ── */}
      {showForm && (
        <div className="border-t border-gray-100 pt-5 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-green-500" />
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
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-semibold bg-green-500 text-white flex items-center justify-center gap-2 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
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
            <Loader2 className="animate-spin h-5 w-5" />
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
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
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
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-800">
                <span className="font-semibold">Note:</span> The physical document must be presented to your internship company. Digital copies are not accepted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── COMPLETED (Claimed) — Upload Scanned Copy ── */}
      {status === 'completed' && (
        <div className="space-y-5">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-blue-900 mb-2">
                  Endorsement Letter Claimed
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  You have successfully picked up your physical endorsement letter. As the final step, please <span className="font-semibold">upload a scanned copy</span> of the signed document below for documentation.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="max-w-md mx-auto">
            {scannedFileUrl ? (
              /* Already Uploaded */
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Your Scanned Document</div>
                <a
                  href={scannedFileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-gray-50 border-2 border-green-200 rounded-xl px-4 py-4 group hover:bg-green-50 transition"
                  title="Click to view your scanned endorsement letter"
                >
                  <FileText className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate group-hover:underline">{scannedFileName || 'Scanned_Endorsement_Letter.pdf'}</p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">Verified Submission · View File</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </a>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Document Locked</p>
              </div>
            ) : localFile ? (
              /* Ready to Submit */
              <div className="space-y-4">
                <div className="bg-white border-2 border-blue-400 rounded-xl px-4 py-4 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate">{localFile.name}</p>
                    <p className="text-xs text-blue-500 font-medium">Ready to submit</p>
                  </div>
                  <button
                    onClick={() => setLocalFile(null)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? (
                     <>
                       <Loader2 className="animate-spin h-5 w-5" />
                       Submitting...
                     </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Scanned Copy
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Upload Dropzone */
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`cursor-pointer border-3 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all p-8
                  ${isUploading ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-blue-200 bg-blue-50/30 hover:bg-blue-50 hover:border-blue-400'}`}
              >
                {isUploading ? (
                  <Loading size="lg" label="Uploading..." color="text-blue-500" />
                ) : (
                  <>
                    <div className="p-4 bg-blue-100 rounded-full">
                      <UploadCloud className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold text-gray-700">Upload Scanned Document</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG preferred</p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── REJECTED ── */}
      {status === 'rejected' && !showForm && (
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-base font-bold text-red-900 mb-2">
                  Request Rejected
                </h4>
                <div className="bg-white/60 rounded border border-red-100 p-3 mb-4">
                  <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Reason for Rejection:</p>
                  <p className="text-sm text-red-800 leading-relaxed italic">
                    "{rejectionReason || 'No specific reason provided.'}"
                  </p>
                </div>
                <p className="text-sm text-red-700 leading-relaxed">
                  Please review the reason above and make the necessary corrections before requesting again.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsResubmitting(true)}
            className="w-full py-3 rounded-lg font-semibold bg-red-600 text-white flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-sm"
          >
            Request Another Endorsement Letter
          </button>
        </div>
      )}

      {/* ── Important Information ── */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1.5">
              <li><span className="font-semibold">Step 1:</span> Submit all required documents under the Requirements page.</li>
              <li><span className="font-semibold">Step 2:</span> Once all documents are submitted, fill in your company details and submit the endorsement request.</li>
              <li><span className="font-semibold">Step 3:</span> Processing takes <span className="font-semibold">3–5 business days</span>.</li>
              <li><span className="font-semibold">Step 4:</span> Once ready, visit the OJT Coordinator's office to pick up your endorsement letter with wet signature.</li>
              <li className="text-blue-600 text-xs pt-1">⚠ The endorsement letter is valid for the current academic year only.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}