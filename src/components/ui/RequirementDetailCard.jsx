import { useState } from 'react'

function RequirementDetailCard({ requirement, index, onFileClick, onVerify, onReject }) {
  const [feedback, setFeedback] = useState(requirement.feedback || '')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    } else if (fileType === 'url') {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
    return (
      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const isSubmitted = requirement.status === 'submitted'
  const isVerified = requirement.status === 'verified'
  const isRejected = requirement.status === 'rejected'
  const isPending = requirement.status === 'pending'

  const borderClass = isVerified ? 'border-l-green-500' : isRejected ? 'border-l-red-500' : isSubmitted ? 'border-l-blue-500' : 'border-l-gray-300'
  const bgClass = isVerified ? 'bg-green-50' : isRejected ? 'bg-red-50' : 'bg-white'

  return (
    <div className={`p-6 border-l-4 border-b border-b-gray-200 transition ${borderClass} ${bgClass} hover:bg-opacity-70`}>
      <div className="flex items-start space-x-4">
        {/* Order Number */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isVerified ? 'bg-green-100' : isRejected ? 'bg-red-100' : isSubmitted ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <span className={`font-bold ${isVerified ? 'text-green-600' : isRejected ? 'text-red-600' : isSubmitted ? 'text-blue-600' : 'text-gray-400'}`}>
            {index}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{requirement.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
            </div>
            <span className={`ml-4 flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${
              isVerified ? 'bg-green-100 text-green-700' : 
              isRejected ? 'bg-red-100 text-red-700' : 
              isSubmitted ? 'bg-blue-100 text-blue-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
            </span>
          </div>

          {/* File Card - Show if any submission exists */}
          {(isSubmitted || isVerified || isRejected) && requirement.fileUrl && (
            <div className="space-y-3">
              <button
                onClick={() => onFileClick(requirement.fileUrl)}
                className="mt-3 flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200 focus:outline-none w-full text-left"
              >
                {getFileIcon(requirement.fileType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{requirement.fileName}</p>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(requirement.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              {/* Admin Actions */}
              {isSubmitted && (
                <div className="flex flex-col space-y-2">
                  {!showRejectInput ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onVerify(requirement.submissionId)}
                        className="flex-1 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => setShowRejectInput(true)}
                        className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        rows={2}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            onReject(requirement.submissionId, feedback)
                            setShowRejectInput(false)
                          }}
                          disabled={!feedback.trim()}
                          className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => setShowRejectInput(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Verified/Rejected Status Note */}
              {isVerified && (
                <p className="text-xs text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified by Admin
                </p>
              )}
              {isRejected && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-bold mb-1 uppercase tracking-wider">Rejected</p>
                  <p className="text-sm text-red-700 italic">"{requirement.feedback || 'No feedback provided'}"</p>
                </div>
              )}
            </div>
          )}

          {/* Pending Message */}
          {isPending && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Awaiting student submission</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequirementDetailCard