function RecentStudents({ activeCourse }) {
  // Mock data - 7 students
  const allStudents = [
    {
      id: 1,
      name: 'Juan Dela Cruz',
      studentNumber: '221-1234',
      course: 'BSIT-SD',
      company: 'Tech Solutions Inc.',
      status: 'deployed',
      hours: 120,
      requiredHours: 500
    },
    {
      id: 2,
      name: 'Maria Santos',
      studentNumber: '221-2345',
      course: 'BSCS-DS',
      company: 'Data Analytics Corp.',
      status: 'deployed',
      hours: 250,
      requiredHours: 500
    },
    {
      id: 3,
      name: 'Pedro Reyes',
      studentNumber: '221-3456',
      course: 'BSIT-BA',
      company: 'Business Solutions Ltd.',
      status: 'pending',
      hours: 0,
      requiredHours: 500
    },
    {
      id: 4,
      name: 'Anna Garcia',
      studentNumber: '221-4567',
      course: 'BSIT-SD',
      company: 'Software Innovations',
      status: 'deployed',
      hours: 380,
      requiredHours: 500
    },
    {
      id: 5,
      name: 'Carlos Mendoza',
      studentNumber: '221-5678',
      course: 'BSCS-DS',
      company: 'AI Research Labs',
      status: 'deployed',
      hours: 450,
      requiredHours: 500
    },
    {
      id: 6,
      name: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      course: 'BSIT-BA',
      company: 'Cloud Computing Inc.',
      status: 'deployed',
      hours: 200,
      requiredHours: 500
    },
    {
      id: 7,
      name: 'Miguel Torres',
      studentNumber: '221-7890',
      course: 'BSCS-DS',
      company: 'Machine Learning Studio',
      status: 'deployed',
      hours: 150,
      requiredHours: 500
    }
  ]

  // Map activeCourse values to actual course codes
  const courseMap = {
    'bscs-ds': 'BSCS-DS',
    'bsit-ba': 'BSIT-BA',
    'bsit-sd': 'BSIT-SD'
  }

  // ✅ Derived data (NO useEffect needed)
  const filteredStudents =
    activeCourse === 'all'
      ? allStudents
      : allStudents.filter(
          student => student.course === courseMap[activeCourse]
        )

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Students
          </h3>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium focus:outline-none">
            View All
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {student.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {student.studentNumber} • {student.course}
                    </p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {student.company}
                    </p>

                    <div className="mt-2 flex items-center space-x-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status === 'deployed'
                          ? 'Deployed'
                          : 'Pending'}
                      </span>

                      {student.status === 'deployed' && (
                        <span className="text-xs text-gray-600">
                          {student.hours}/{student.requiredHours} hrs
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-gray-500 text-sm">
              No students found for this course
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentStudents