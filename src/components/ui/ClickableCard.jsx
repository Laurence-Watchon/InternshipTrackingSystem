import { useRef, useState } from 'react'
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
  if (ext === 'pdf') return { icon: '📄', label: 'PDF', color: 'text-red-500' }
  if (ext === 'docx') return { icon: '📝', label: 'DOCX', color: 'text-blue-500' }
  if (['png', 'jpg', 'jpeg'].includes(ext)) return { icon: '🖼️', label: ext?.toUpperCase(), color: 'text-purple-500' }
  return { icon: '📎', label: ext?.toUpperCase(), color: 'text-gray-500' }
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
  const [uploading, setUploading]   = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)   // { name, url, size, ext }
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    // --- Replace this block with your real API upload call ---
    // e.g. const formData = new FormData(); formData.append('file', file)
    //      const res = await fetch('/api/upload', { method: 'POST', body: formData })
    //      const { url } = await res.json()
    // ---------------------------------------------------------
    const mockUrl = URL.createObjectURL(file)   // temporary local preview URL
    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        size: file.size,
        url: mockUrl,             // replace with real URL from your backend
        ext: file.name.split('.').pop()?.toLowerCase(),
      })
      setUploading(false)
    }, 1800)  // simulated upload delay — remove when using real API
  }

  function handleSubmitClick() {
    setDialogOpen(true)
  }

  function handleConfirm() {
    if (req.inputType === 'link') {
      onChange({ status: 'submitted', fileName: '', fileUrl: '', linkValue })
    } else {
      onChange({
        status: 'submitted',
        fileName: uploadedFile.name,
        fileUrl: uploadedFile.url,
        linkValue: '',
      })
      setUploadedFile(null)
    }
    setDialogOpen(false)
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
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
                      href={fileUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 group"
                      title="Click to view your submitted file"
                    >
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-green-700 font-semibold truncate group-hover:underline">{fileName}</p>
                        <p className="text-xs text-green-500 mt-0.5">Submitted · Click to view</p>
                      </div>
                      {/* External link icon */}
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                /* ── 3. UPLOADED (not yet submitted) — preview + Submit button ── */
                ) : uploadedFile ? (
                  <div className="flex flex-col gap-3 mx-auto" style={{ maxWidth: '340px' }}>
                    {/* Clickable file preview */}
                    <a
                      href={uploadedFile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 group"
                      title="Click to preview your file"
                    >
                      <span className="text-2xl">{fileInfo?.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:underline">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {fileInfo?.label} &nbsp;·&nbsp; {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      {/* External link icon */}
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
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
                        className="flex-1 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg focus:outline-none"
                      >
                        Submit
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
                    <svg
                      className={`w-8 h-8 ${status === 'rejected' ? 'text-red-400' : 'text-green-400'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
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
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
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
                        className={`w-full pl-9 pr-8 py-2.5 text-sm border rounded-lg outline-none transition
                          ${linkValue
                            ? 'border-green-400 bg-green-50 text-green-800'
                            : 'border-gray-200 bg-gray-50 text-gray-700 focus:border-green-400'}`}
                      />
                      {/* X button — positioned inside but not overlapping text */}
                      {linkValue && (
                        <button
                          onClick={() => onChange({ status: 'pending', fileName: '', fileUrl: '', linkValue: '' })}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-400 focus:outline-none"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {/* Submit button — only show when there's a value */}
                    {linkValue && (
                      <button
                        onClick={handleSubmitClick}
                        className="w-full py-2 text-sm font-semibold text-white bg-green-500 rounded-lg focus:outline-none"
                      >
                        Submit
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