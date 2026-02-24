function StudentDetailsModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          {/* Modal Header - Fixed */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Student Information</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-gray-900">{student.fullName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Student Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">{student.studentNumber}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <p className="text-sm font-medium text-gray-900">{student.phoneNumber}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-gray-900 break-all">{student.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    College
                  </label>
                  <p className="text-sm font-medium text-gray-900">{student.college}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Course
                  </label>
                  <p className="text-sm font-medium text-gray-900">{student.course}</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Requirements{' '}
                <span className="text-base font-semibold text-gray-600">
                  ({student.requirementsCompleted}/{student.totalRequirements})
                </span>
              </h4>
              <div className="space-y-2">
                {student.completedRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Internship Information - Only if requirements completed */}
            {student.requirementsCompleted === student.totalRequirements && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Internship Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Company Name
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {student.companyName || 'Not assigned'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Company Address
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {student.companyAddress || 'Not assigned'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Supervisor
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {student.supervisor || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Not Completed Message */}
            {student.requirementsCompleted !== student.totalRequirements && (
              <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h5 className="text-sm font-bold text-yellow-900 mb-1">
                      Requirements Not Completed
                    </h5>
                    <p className="text-sm text-yellow-800">
                      Student must complete all requirements before internship information can be added.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer - Fixed */}
          <div className="p-6 border-t border-gray-200 flex justify-end flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentDetailsModal