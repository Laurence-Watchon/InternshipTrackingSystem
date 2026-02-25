function AdminEndorsementTable({ students, onReject, onEndorse, onComplete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                        <div className="text-xs text-gray-500">{student.course}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{student.studentNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{student.companyName}</div>
                    <div className="text-xs text-gray-500">{student.companyAddress}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{student.supervisor}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'ready' 
                        ? 'bg-blue-100 text-blue-800' 
                        : student.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {student.status === 'ready' ? 'Ready' : student.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    {student.status === 'pending' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onReject(student)}
                          className="text-red-600 hover:text-red-900 font-medium focus:outline-none"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onEndorse(student)}
                          className="text-green-600 hover:text-green-900 font-medium focus:outline-none"
                        >
                          Endorse
                        </button>
                      </div>
                    ) : student.status === 'ready' ? (
                      <button
                        onClick={() => onComplete(student)}
                        className="text-blue-600 hover:text-blue-900 font-medium focus:outline-none"
                      >
                        Complete
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs"></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Endorsement Requests</h3>
            <p className="text-gray-500">There are no students requesting endorsement at this time.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminEndorsementTable