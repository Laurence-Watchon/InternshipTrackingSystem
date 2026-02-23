function CompanyCard({ company }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{company.name}</h4>
          <p className="text-sm text-gray-600 truncate mt-1">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {company.address}
          </p>
        </div>
        <span className="ml-3 flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {company.studentsCount} {company.studentsCount === 1 ? 'student' : 'students'}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-700">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="font-medium">Supervisor:</span>
        <span className="ml-2">{company.supervisor}</span>
      </div>
    </div>
  )
}

export default CompanyCard