import { useState, useEffect, useRef } from 'react'
import { FileText, ExternalLink, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import Dialog from './Dialog'

function RequirementDetailCard({ requirement, index, onFileClick, onVerify, onReject, isExpanded, onToggle }) {
  const [feedback, setFeedback] = useState(requirement.feedback || '')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [isExpanded])

  // Helper to get Lucide icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      case 'url': return <ExternalLink className="w-6 h-6 text-blue-500" />;
      default: return <FileText className="w-6 h-6 text-green-500" />;
    }
  }

  const acceptedTypes = ['PDF', 'JPEG', 'DOCX', 'XLSX', 'DOC', 'JPG', 'PNG']

  const getViewerUrl = (url, fileName) => {
    if (!url) return '#'
    const ext = fileName?.split('.').pop()?.toLowerCase()
    if (['pdf', 'docx'].includes(ext)) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }

  const isSubmitted = requirement.status === 'submitted'
  const isVerified = requirement.status === 'verified'
  const isRejected = requirement.status === 'rejected'
  const isPending = requirement.status === 'pending'

  // 'submitted' and 'verified' are now treated as the same positive state (green)
  const isDone = isSubmitted || isVerified
  const borderClass = isDone ? 'border-l-green-500' : isRejected ? 'border-l-red-500' : 'border-l-gray-300'
  const bgClass = isDone ? 'bg-green-50' : isRejected ? 'bg-red-50' : 'bg-white'

  return (
    <div
      ref={cardRef}
      style={{ scrollMarginTop: '5rem' }}
      className={`border-l-4 rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${borderClass} ${bgClass}`}
    >
      <div
        className="p-4 sm:p-6 cursor-pointer hover:bg-black/5 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          {/* Order Number Circle */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isDone ? 'bg-green-500 shadow-sm' : isRejected ? 'bg-red-500 shadow-sm' : 'bg-gray-100'
            }`}>
            <span className={`text-sm font-bold ${isDone || isRejected ? 'text-white' : 'text-gray-400'}`}>
              {index}
            </span>
          </div>

          {/* Content Header */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">{requirement.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 italic">{requirement.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${isDone ? 'text-green-600 bg-green-100/50' :
                  isRejected ? 'text-red-600 bg-red-100/50' :
                    'text-gray-400'
                  }`}>
                  {requirement.status === 'submitted' ? 'Submitted' : requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-white/50 animate-in fade-in slide-in-from-top-1">
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-sm text-gray-600">{requirement.description}</p>

            {/* Accepted File Types Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-medium text-gray-400">Accepted:</span>
              {acceptedTypes.map(type => (
                <span key={type} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase">
                  {type}
                </span>
              ))}
            </div>

            {/* File Card - Redesigned to match the screenshot and 'perfect' behavior */}
            {(isSubmitted || isVerified || isRejected) && requirement.fileUrl && (
              <div className="mt-8">
                <a
                  href={getViewerUrl(requirement.fileUrl, requirement.fileName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-md mx-auto flex items-center space-x-4 p-4 bg-green-50/50 border border-green-200 rounded-2xl cursor-pointer hover:bg-green-100/50 transition-all group shadow-sm hover:shadow-md no-underline"
                >
                  <div className="p-2 bg-white rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                    {getFileIcon(requirement.fileType || 'file')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {requirement.fileName || 'Requirement Document'}
                    </p>
                    <div className="flex items-center text-xs text-green-600 font-medium">
                      <span>Submitted • Click to view</span>
                    </div>
                  </div>
                  <div className="p-2 text-green-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </a>

                {/* Admin Actions */}
                {isSubmitted && (
                  <div className="flex flex-col space-y-3 pt-2">
                    {!showRejectInput ? (
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => {
                            setFeedback('')
                            setShowRejectInput(true)
                          }}
                          className="px-6 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition shadow-sm hover:shadow-md"
                        >
                          Reject Submission
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3 p-4 bg-red-50/50 rounded-xl border border-red-100">
                        <h5 className="text-xs font-bold text-red-800 uppercase tracking-wider">Reject Submission</h5>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Please provide a reason for rejection..."
                          className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none min-h-[100px]"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={!feedback.trim() || isRejecting}
                            className="flex-1 py-2.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                          >
                            {isRejecting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Rejecting...</span>
                              </>
                            ) : (
                              'Confirm Reject'
                            )}
                          </button>
                          <button
                            onClick={() => setShowRejectInput(false)}
                            className="px-6 py-2.5 bg-white text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition border border-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isRejected && (
                  <div className="mt-8 bg-red-50 border border-red-100 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-extrabold text-red-800 uppercase tracking-widest">Rejection Details</span>
                    </div>
                    <p className="text-sm text-red-700 leading-relaxed font-medium pl-6">
                      {requirement.feedback || 'No feedback provided'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Message */}
            {isPending && (
              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-400 bg-gray-50 p-4 rounded-lg border border-gray-100 border-dashed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium italic">Requirement is pending submission from the student.</span>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Rejection Confirmation Dialog */}
      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          onReject(requirement.submissionId, feedback)
          setIsConfirmOpen(false)
          setIsRejecting(true)
        }}
        title="Confirm Rejection"
        message={`Are you sure you want to reject the submission with the reason of "${feedback}"?`}
        confirmLabel="Yes, Reject"
        cancelLabel="No, Cancel"
      />
    </div>
  )
}

export default RequirementDetailCard