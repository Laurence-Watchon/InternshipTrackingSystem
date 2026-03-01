import { MapPin, User } from 'lucide-react';

function CompanyCard({ company }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{company.name}</h4>
          <p className="text-sm text-gray-600 truncate mt-1">
            <MapPin className="w-4 h-4 inline-block mr-1 text-gray-700" />
            {company.address}
          </p>
        </div>
        <span className="ml-3 flex-shrink-0 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {company.studentsCount} {company.studentsCount === 1 ? 'student' : 'students'}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-700">
        <User className="w-4 h-4 inline-block mr-1 text-gray-700" />
        <span className="font-medium">Supervisor:</span>
        <span className="ml-2">{company.supervisor}</span>
      </div>
    </div>
  )
}

export default CompanyCard