import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import StudentRequirementsTable from '../../components/ui/StudentRequirementsTable'
import Pagination from '../../components/ui/Pagination'

function AdminStudentRequirements() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bscs-ds')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 20

  // Courses without "All"
  const courses = [
    { id: 'bscs-ds', name: 'BSCS-DS', count: 45 },
    { id: 'bsit-ba', name: 'BSIT-BA', count: 58 },
    { id: 'bsit-sd', name: 'BSIT-SD', count: 53 }
  ]

  // Mock student data - sorted alphabetically by last name
  const allStudents = [
    {
      id: 1,
      fullName: 'Cruz, Juan Dela',
      studentNumber: '221-1234',
      email: 'juan.delacruz@gmail.com',
      course: 'BSIT-SD',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 2,
      fullName: 'Fernandez, Lucas',
      studentNumber: '221-1235',
      email: 'lucas.fernandez@gmail.com',
      course: 'BSIT-BA',
      requirementsCompleted: 5,
      totalRequirements: 7
    },
    {
      id: 3,
      fullName: 'Garcia, Anna',
      studentNumber: '221-4567',
      email: 'anna.garcia@gmail.com',
      course: 'BSIT-SD',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 4,
      fullName: 'Gonzales, Emma',
      studentNumber: '221-2346',
      email: 'emma.gonzales@gmail.com',
      course: 'BSIT-SD',
      requirementsCompleted: 6,
      totalRequirements: 7
    },
    {
      id: 5,
      fullName: 'Hernandez, Sophia',
      studentNumber: '221-0123',
      email: 'sophia.hernandez@gmail.com',
      course: 'BSCS-DS',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 6,
      fullName: 'Mendoza, Carlos',
      studentNumber: '221-5678',
      email: 'carlos.mendoza@gmail.com',
      course: 'BSCS-DS',
      requirementsCompleted: 5,
      totalRequirements: 7
    },
    {
      id: 7,
      fullName: 'Pascual, Olivia',
      studentNumber: '221-4568',
      email: 'olivia.pascual@gmail.com',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 8,
      fullName: 'Ramos, Gabriel',
      studentNumber: '221-9012',
      email: 'gabriel.ramos@gmail.com',
      course: 'BSIT-SD',
      requirementsCompleted: 4,
      totalRequirements: 7
    },
    {
      id: 9,
      fullName: 'Reyes, Pedro',
      studentNumber: '221-3456',
      email: 'pedro.reyes@gmail.com',
      course: 'BSIT-BA',
      requirementsCompleted: 4,
      totalRequirements: 7
    },
    {
      id: 10,
      fullName: 'Rivera, Daniel',
      studentNumber: '221-3457',
      email: 'daniel.rivera@gmail.com',
      course: 'BSCS-DS',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 11,
      fullName: 'Rodriguez, Sofia',
      studentNumber: '221-6789',
      email: 'sofia.rodriguez@gmail.com',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 12,
      fullName: 'Santos, Maria',
      studentNumber: '221-2345',
      email: 'maria.santos@gmail.com',
      course: 'BSCS-DS',
      requirementsCompleted: 7,
      totalRequirements: 7
    },
    {
      id: 13,
      fullName: 'Torres, Miguel',
      studentNumber: '221-7890',
      email: 'miguel.torres@gmail.com',
      course: 'BSCS-DS',
      requirementsCompleted: 7,
      totalRequirements: 7
    }
  ]

  // Filter by course
  const filteredByCourse = allStudents.filter(student => {
    const courseMap = {
      'bscs-ds': 'BSCS-DS',
      'bsit-ba': 'BSIT-BA',
      'bsit-sd': 'BSIT-SD'
    }
    return student.course === courseMap[activeTab]
  })

  // Filter by search query
  const filteredStudents = filteredByCourse.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStudents = filteredStudents.slice(startIndex, endIndex)

  // Reset to page 1 when filter or search changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleRowClick = (studentId) => {
    navigate(`/admin/students-requirements/${studentId}`)
  }

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">COLLEGE OF COMPUTING STUDIES</h1>
        <p className="text-gray-600 mt-1">
          View and manage all student requirement submissions
        </p>
      </div>

      {/* Course Tabs (without All) */}
      <div className="mb-6">
        <AdminHomeCourses
          courses={courses}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search by name, student number, or email..."
          />
        </div>
      </div>

      {/* Students Table */}
      <StudentRequirementsTable
        students={currentStudents}
        onRowClick={handleRowClick}
      />

      {/* Pagination Info and Controls */}
      {filteredStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
              <span className="font-medium">{filteredStudents.length}</span> students
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default AdminStudentRequirements