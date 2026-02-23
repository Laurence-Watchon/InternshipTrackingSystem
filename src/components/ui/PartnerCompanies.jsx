import CompanyCard from './CompanyCard'

function PartnerCompanies() {
  // Mock data - 8 companies
  const companies = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      address: 'Makati City, Metro Manila',
      supervisor: 'John Smith',
      studentsCount: 5
    },
    {
      id: 2,
      name: 'Data Analytics Corp.',
      address: 'BGC, Taguig City',
      supervisor: 'Jane Doe',
      studentsCount: 3
    },
    {
      id: 3,
      name: 'Business Solutions Ltd.',
      address: 'Ortigas Center, Pasig City',
      supervisor: 'Robert Johnson',
      studentsCount: 4
    },
    {
      id: 4,
      name: 'Software Innovations',
      address: 'Alabang, Muntinlupa City',
      supervisor: 'Emily Brown',
      studentsCount: 6
    },
    {
      id: 5,
      name: 'AI Research Labs',
      address: 'Quezon City',
      supervisor: 'Michael Davis',
      studentsCount: 2
    },
    {
      id: 6,
      name: 'Cloud Computing Inc.',
      address: 'Mandaluyong City',
      supervisor: 'Sarah Wilson',
      studentsCount: 7
    },
    {
      id: 7,
      name: 'Machine Learning Studio',
      address: 'Bonifacio Global City',
      supervisor: 'David Martinez',
      studentsCount: 3
    },
    {
      id: 8,
      name: 'Digital Innovations Hub',
      address: 'Pasay City',
      supervisor: 'Lisa Anderson',
      studentsCount: 4
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Partner Companies</h3>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium focus:outline-none">
            View All
          </button>
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PartnerCompanies