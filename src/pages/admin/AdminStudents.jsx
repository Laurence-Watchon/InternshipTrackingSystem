import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import AdminStudentsTable from '../../components/ui/AdminStudentsTable'
import StudentDetailsModal from '../../components/custom/dialog/StudentDetailsModal'
import Pagination from '../../components/ui/Pagination'

function StudentManagement() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data for courses
  const courses = [
    { id: 'all', name: 'All', count: 156 },
    { id: 'bscs-ds', name: 'BSCS-DS', count: 45 },
    { id: 'bsit-ba', name: 'BSIT-BA', count: 58 },
    { id: 'bsit-sd', name: 'BSIT-SD', count: 53 }
  ]

  // Mock student data
  const allStudents = [
    {
      id: 1,
      fullName: 'Juan Dela Cruz',
      studentNumber: '221-1234',
      phoneNumber: '09123456789',
      email: 'juan.delacruz@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-SD',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Tech Solutions Inc.',
      companyAddress: 'Makati City, Metro Manila',
      supervisor: 'John Smith'
    },
    {
      id: 2,
      fullName: 'Maria Santos',
      studentNumber: '221-2345',
      phoneNumber: '09234567890',
      email: 'maria.santos@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSCS-DS',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Data Analytics Corp.',
      companyAddress: 'BGC, Taguig City',
      supervisor: 'Jane Doe'
    },
    {
      id: 3,
      fullName: 'Pedro Reyes',
      studentNumber: '221-3456',
      phoneNumber: '09345678901',
      email: 'pedro.reyes@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 4,
      totalRequirements: 7,
      isDeployed: false,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae'
      ],
      companyName: '',
      companyAddress: '',
      supervisor: ''
    },
    {
      id: 4,
      fullName: 'Anna Garcia',
      studentNumber: '221-4567',
      phoneNumber: '09456789012',
      email: 'anna.garcia@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-SD',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Software Innovations',
      companyAddress: 'Alabang, Muntinlupa City',
      supervisor: 'Emily Brown'
    },
    {
      id: 5,
      fullName: 'Carlos Mendoza',
      studentNumber: '221-5678',
      phoneNumber: '09567890123',
      email: 'carlos.mendoza@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSCS-DS',
      requirementsCompleted: 5,
      totalRequirements: 7,
      isDeployed: false,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction'
      ],
      companyName: '',
      companyAddress: '',
      supervisor: ''
    },
    {
      id: 6,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    },
    {
      id: 7,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    },
    {
      id: 8,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    },
    {
      id: 9,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    },
    {
      id: 10,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    },
    {
      id: 11,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    },
    {
      id: 12,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      phoneNumber: '09678901234',
      email: 'sofia.rodriguez@gmail.com',
      college: 'College of Computer Studies',
      course: 'BSIT-BA',
      requirementsCompleted: 7,
      totalRequirements: 7,
      isDeployed: true,
      completedRequirements: [
        'Copy of Registration Form',
        'Attendance / Copy Evaluation',
        'Application Letter',
        'Curriculum Vitae',
        'AVP Self Introduction',
        'Notarized Consent Form',
        'Medical Clearance'
      ],
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson'
    }
  ]

  // Filter students by course
  const filteredByCourse = activeTab === 'all' 
    ? allStudents 
    : allStudents.filter(student => {
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setShowModal(true)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // Show "no students available" message when there are no students at all
  const hasNoStudents = filteredByCourse.length === 0 && searchQuery === ''

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">COLLEGE OF COMPUTING STUDIES</h1>
        <p className="text-gray-600 mt-1">
          View and manage all students in your college
        </p>
      </div>

      {/* Course Tabs */}
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search by name, student number, or email..."
          />
        </div>
      </div>

      {/* No Students Available Message */}
      {hasNoStudents ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center">
            <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 text-xl font-semibold mb-2">No Students Available</p>
            <p className="text-gray-400 text-sm">There are no students in this course at the moment.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Students Table */}
          <AdminStudentsTable 
            students={paginatedStudents}
            onViewDetails={handleViewDetails}
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
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        student={selectedStudent}
      />
    </AppLayout>
  )
}

export default StudentManagement