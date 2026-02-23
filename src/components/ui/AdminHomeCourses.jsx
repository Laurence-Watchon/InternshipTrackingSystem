function AdminHomeCourses({ courses, activeTab, onTabChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Scrollable horizontal tabs */}
      <div className="overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => onTabChange(course.id)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap focus:outline-none ${
                activeTab === course.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {course.name}
              {course.count !== undefined && (
                <span className={`ml-2 ${
                  activeTab === course.id ? 'text-white' : 'text-gray-500'
                }`}>
                  ({course.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminHomeCourses