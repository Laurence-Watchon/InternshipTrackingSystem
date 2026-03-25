import { useRef, useState } from 'react'
import { FileText, Image, Paperclip, FileStack, ExternalLink, X, UploadCloud, CheckCircle, Clock } from 'lucide-react'
import Dialog from './Dialog'
import Loading from './Loading'

const MIME_MAP = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
}

function getAcceptString(types) {
  return types.map(t => MIME_MAP[t] || `.${t}`).join(',')
}

function getFileIcon(fileName) {
  const ext = fileName?.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return { icon: <FileText className="w-8 h-8 text-red-500" />, label: 'PDF' }
  if (ext === 'docx') return { icon: <FileText className="w-8 h-8 text-blue-500" />, label: 'DOCX' }
  if (['png', 'jpg', 'jpeg'].includes(ext)) return { icon: <Image className="w-8 h-8 text-purple-500" />, label: ext?.toUpperCase() }
  return { icon: <Paperclip className="w-8 h-8 text-gray-500" />, label: ext?.toUpperCase() }
}

function getViewerUrl(url, fileName) {
  if (!url) return '#'
  const ext = fileName?.split('.').pop()?.toLowerCase()
  if (['pdf', 'docx'].includes(ext)) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
  }
  return url
}

function statusStyles(status) {
  if (status === 'submitted') return {
    border: 'border-green-500',
    badge: 'bg-green-100 text-green-700',
    number: 'bg-green-500 text-white',
  }
  if (status === 'rejected') return {
    border: 'border-red-400',
    badge: 'bg-red-100 text-red-600',
    number: 'bg-red-400 text-white',
  }
  return {
    border: 'border-orange-400',
    badge: 'bg-orange-100 text-orange-600',
    number: 'bg-orange-100 text-orange-600',
  }
}

function StatusBadge({ status }) {
  const labels = { pending: 'Pending', submitted: 'Submitted', rejected: 'Rejected' }
  const { badge } = statusStyles(status)
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${badge}`}>
      {labels[status] || 'Pending'}
    </span>
  )
}

/**
 * ClickableCard
 *
 * Props:
 *   req       – { id, title, description, acceptedTypes: string[], inputType: 'file' | 'link' }
 *   state     – { status: 'pending'|'submitted'|'rejected', fileName: string, linkValue: string, fileUrl: string }
 *   isOpen    – boolean
 *   onToggle  – () => void
 *   onChange  – (newState) => void
 *
 * Flow for file input:
 *   1. User picks file → uploading spinner shown
 *   2. File "uploaded" → preview row appears (clickable, opens file in new tab)
 *   3. User clicks Submit → Dialog confirms
 *   4. Confirmed → marked as submitted
 */
export default function ClickableCard({ req, state, isOpen, onToggle, onChange }) {
  const fileRef = useRef()
  const { status, fileName, linkValue, fileUrl } = state
  const styles = statusStyles(status)

  // uploading  = file picked, simulating upload to DB
  // uploaded   = upload done, preview ready, awaiting submit
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)   // { name, url, size, ext }
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:3001/api/student/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedFile({
          name: data.fileName,
          url: data.secure_url,
          // size can be added if backend returns it, but for now we'll keep the local one or skip
          size: file.size,
          ext: data.fileName.split('.').pop()?.toLowerCase(),
        })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to upload file.')
      }
    } catch (err) {
      console.error('Error uploading file:', err)
      alert('An error occurred during upload.')
    } finally {
      setUploading(false)
    }
  }

  function handleSubmitClick() {
    setDialogOpen(true)
  }

  async function handleConfirm() {
    setIsSubmitting(true)
    setDialogOpen(false)

    // Wait for at least 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (req.inputType === 'link') {
      await onChange({ status: 'submitted', fileName: '', fileUrl: '', linkValue })
    } else {
      await onChange({
        status: 'submitted',
        fileName: uploadedFile.name,
        fileUrl: uploadedFile.url,
        linkValue: '',
      })
      setUploadedFile(null)
    }
    setIsSubmitting(false)
  }

  function handleDialogCancel() {
    setDialogOpen(false)
  }

  function handleClearUploaded() {
    setUploadedFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleLink(e) {
    const val = e.target.value
    // Just update the value — submission happens via the Submit button + Dialog
    onChange({ ...state, linkValue: val, status: 'pending' })
  }

  const fileInfo = uploadedFile ? getFileIcon(uploadedFile.name) : null

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm border-l-4 ${styles.border} transition-all duration-300 ${isOpen ? 'bg-green-100' : ''}`}
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
      >
        {/* ── Header row ── */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors rounded-xl focus:outline-none hover:bg-green-50 active:bg-white ${isOpen ? 'bg-green-100' : ''}`}
        >
          <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${styles.number}`}>
            {req.id}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug">{req.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{req.description}</p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <StatusBadge status={status} />
            <Clock className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* ── Accordion panel ── */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-5 pb-6 pt-2 border-t border-gray-100">

            {/* Accepted formats */}
            {req.acceptedTypes.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mb-4 mt-2">
                <span className="text-xs text-gray-400 mr-1">Accepted:</span>
                {req.acceptedTypes.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono uppercase">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {req.inputType === 'file' ? (
              <>
                {/* ── 1. UPLOADING — spinner ── */}
                {uploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 mx-auto" style={{ maxWidth: '340px' }}>
                    <Loading size="lg" label="Uploading your file..." color="text-green-500" />
                    <p className="text-xs text-gray-400">Please wait while your file is being uploaded.</p>
                  </div>

                  /* ── 2. SUBMITTED — show clickable file, offer to remove ── */
                ) : fileName ? (
                  <div className="mx-auto" style={{ maxWidth: '340px' }}>
                    <a
                      href={getViewerUrl(fileUrl, fileName)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 group"
                      title="Click to view your submitted file"
                    >
                      <FileText className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-green-700 font-semibold truncate group-hover:underline">{fileName}</p>
                        <p className="text-xs text-green-500 mt-0.5">Submitted · Click to view</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-green-400 flex-shrink-0" />
                    </a>
                  </div>

                  /* ── 3. UPLOADED (not yet submitted) — preview + Submit button ── */
                ) : uploadedFile ? (
                  <div className="flex flex-col gap-3 mx-auto" style={{ maxWidth: '340px' }}>
                    {/* Clickable file preview */}
                    <a
                      href={getViewerUrl(uploadedFile.url, uploadedFile.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 group"
                      title="Click to preview your file"
                    >
                      {fileInfo?.icon}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:underline">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {fileInfo?.label} &nbsp;·&nbsp; {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </a>
                    <p className="text-xs text-gray-400 text-center">Click the file to preview it before submitting.</p>
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearUploaded}
                        className="flex-1 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg focus:outline-none"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleSubmitClick}
                        disabled={isSubmitting}
                        className={`flex-1 py-2 text-sm font-semibold text-white rounded-lg focus:outline-none transition-all
                          ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : 'Submit'}
                      </button>
                    </div>
                  </div>

                  /* ── 4. EMPTY — drop zone ── */
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition mx-auto
                      ${status === 'rejected' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
                    style={{ height: '150px', maxWidth: '340px' }}
                  >
                    <UploadCloud
                      className={`w-8 h-8 ${status === 'rejected' ? 'text-red-400' : 'text-green-400'}`}
                    />
                    <p className="text-sm font-medium text-gray-600">
                      {status === 'rejected' ? 'Re-upload your file' : 'Click to upload'}
                    </p>
                    <p className="text-xs text-gray-400">File will upload instantly for preview</p>
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      accept={getAcceptString(req.acceptedTypes)}
                      onChange={handleFile}
                    />
                  </div>
                )}
              </>
            ) : (
              /* ── Google Drive link input ── */
              <div className="flex flex-col gap-3 mx-auto" style={{ maxWidth: '340px' }}>

                {/* Submitted state — show link as clickable, offer to remove */}
                {status === 'submitted' && linkValue ? (
                  <div className="flex flex-col gap-2">
                    <a
                      href={linkValue}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 group"
                      title="Click to open your Google Drive link"
                    >
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-green-700 font-semibold truncate group-hover:underline">{linkValue}</p>
                        <p className="text-xs text-green-500 mt-0.5">Submitted · Click to open</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-green-400 flex-shrink-0" />
                    </a>
                  </div>
                ) : (
                  /* Input + Submit flow */
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className={`w-4 h-4 ${linkValue ? 'text-green-500' : 'text-gray-400'}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        value={linkValue}
                        onChange={handleLink}
                        placeholder="https://drive.google.com/..."
                        className={`w-full pl-10 pr-11 py-2.5 text-sm border rounded-lg outline-none transition
                          ${linkValue
                            ? 'border-green-400 bg-green-50 text-green-800'
                            : 'border-gray-200 bg-gray-50 text-gray-700 focus:border-green-400'}`}
                      />
                      {/* Plain X button — no background/border, just a simple icon */}
                      {linkValue && (
                        <button
                          onClick={() => onChange({ status: 'pending', fileName: '', fileUrl: '', linkValue: '' })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none p-1"
                          title="Clear link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {/* Submit button — only show when there's a value */}
                    {linkValue && (
                      <button
                        onClick={handleSubmitClick}
                        disabled={isSubmitting}
                        className={`w-full py-2 text-sm font-semibold text-white rounded-lg focus:outline-none transition-all
                          ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : 'Submit'}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Rejection note */}
            {status === 'rejected' && !uploading && (
              <p className="mt-3 text-xs text-red-500 flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your submission was rejected. Please re-upload the correct file.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Confirmation Dialog ── */}
      <Dialog
        isOpen={dialogOpen}
        onClose={handleDialogCancel}
        onConfirm={handleConfirm}
        title={req.title}
        message="Are you sure you want to submit this?"
        confirmLabel="Yes"
        cancelLabel="No"
      />
    </>
  )
}