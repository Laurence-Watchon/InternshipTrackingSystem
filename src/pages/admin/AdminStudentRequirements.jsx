import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import StudentRequirementsTable from '../../components/ui/StudentRequirementsTable'
import Pagination from '../../components/ui/Pagination'
import { useAuth } from '../../context/AuthContext'

function AdminStudentRequirements() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsData, setStudentsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const itemsPerPage = 20

  useEffect(() => {
    if (user?.college) {
      fetchMonitoringData()
    }
  }, [user])

  const coursesByCollege = {
    'COLLEGE OF ARTS AND SCIENCES': [
      { value: 'BAComm', label: 'BA Communication' },
      { value: 'BA-Psych', label: 'BA Psychology' },
      { value: 'BS-Psych', label: 'BS Psychology' }
    ],
    'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY': [
      { value: 'BSA', label: 'BS Accountancy' },
      { value: 'BSAIS', label: 'BS Accounting Information System' },
      { value: 'BSEntrep', label: 'BS Entrepreneurship' },
      { value: 'BSTM', label: 'BS Tourism Management' }
    ],
    'COLLEGE OF COMPUTING STUDIES': [
      { value: 'BSCS-DS', label: 'BS Computer Science - Data Science' },
      { value: 'BSIT-BA', label: 'BS Information Technology - Business Analytics' },
      { value: 'BSIT-SD', label: 'BS Information Technology - Software Development' }
    ],
    'COLLEGE OF ENGINEERING': [
      { value: 'BSME', label: 'BS Mechanical Engineering' }
    ],
    'COLLEGE OF EDUCATION': [
      { value: 'BEED', label: 'Bachelor of Elementary Education' },
      { value: 'BPEd', label: 'Bachelor of Physical Education' },
      { value: 'BSED-English', label: 'BS Education (Major in English)' },
      { value: 'BSED-Math', label: 'BS Education (Major in Mathematics)' },
      { value: 'BSED-Science', label: 'BS Education (Major in Science)' }
    ]
  }

  const collegeMapping = {
    'CAS': 'COLLEGE OF ARTS AND SCIENCES',
    'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
    'CCS': 'COLLEGE OF COMPUTING STUDIES',
    'COE': 'COLLEGE OF ENGINEERING',
    'COED': 'COLLEGE OF EDUCATION'
  }

  const getFullCollegeName = (name) => {
    if (!name) return 'COLLEGE OF COMPUTING STUDIES'
    const upper = name.toUpperCase()
    if (collegeMapping[upper]) return collegeMapping[upper]
    return upper
  }

  const resolvedCollegeName = getFullCollegeName(user?.college)
  const currentCollegeCourses = coursesByCollege[resolvedCollegeName] || []

  useEffect(() => {
    if (currentCollegeCourses.length > 0 && !activeTab) {
      setActiveTab(currentCollegeCourses[0].value.toLowerCase())
    }
  }, [currentCollegeCourses, activeTab])

  const fetchMonitoringData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/admin/students-monitoring?college=${encodeURIComponent(user.college)}`)
      const data = await response.json()
      if (response.ok) {
        setStudentsData(data)
      }
    } catch (err) {
      console.error('Error fetching monitoring data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Courses with dynamic counts from data
  const courses = currentCollegeCourses.map(course => ({
    id: course.value.toLowerCase(),
    name: course.value,
    count: studentsData.filter(s => s.course === course.value).length
  }))

  const filteredByCourse = studentsData.filter(student => {
    return student.course.toLowerCase() === activeTab.toLowerCase()
  })

  // Filter by search query
  const filteredStudents = filteredByCourse.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-900">{resolvedCollegeName}</h1>
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
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <StudentRequirementsTable
          students={currentStudents}
          onRowClick={handleRowClick}
        />
      )}

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