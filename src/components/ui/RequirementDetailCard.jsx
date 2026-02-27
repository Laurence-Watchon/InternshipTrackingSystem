function RequirementDetailCard({ requirement, index, onFileClick }) {
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

  return (
    <div className={`p-6 border-l-4 border-b border-b-gray-200 transition ${
      isSubmitted 
        ? 'border-l-green-500 bg-white hover:bg-green-50' 
        : 'border-l-red-500 bg-white hover:bg-red-50'
    }`}>
      <div className="flex items-start space-x-4">
        {/* Order Number */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isSubmitted ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <span className={`font-bold ${isSubmitted ? 'text-green-600' : 'text-red-600'}`}>
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
              isSubmitted
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {isSubmitted ? 'Submitted' : 'Pending'}
            </span>
          </div>

          {/* File Card - Only show if submitted */}
          {isSubmitted && requirement.fileUrl && (
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
          )}

          {/* Pending Message - Only show if pending */}
          {!isSubmitted && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Not yet submitted</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequirementDetailCard