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
      { id: 'BAComm', name: 'BA Communication' },
      { id: 'BA-Psych', name: 'BA Psychology' },
      { id: 'BS-Psych', name: 'BS Psychology' }
    ],
    'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY': [
      { id: 'BSA', name: 'BS Accountancy' },
      { id: 'BSAIS', name: 'BS Accounting Information System' },
      { id: 'BSEntrep', name: 'BS Entrepreneurship' },
      { id: 'BSTM', name: 'BS Tourism Management' }
    ],
    'COLLEGE OF COMPUTING STUDIES': [
      { id: 'bscs-ds', name: 'BS Computer Science - Data Science' },
      { id: 'bsit-ba', name: 'BS Information Technology - Business Analytics' },
      { id: 'bsit-sd', name: 'BS Information Technology - Software Development' }
    ],
    'COLLEGE OF ENGINEERING': [
      { id: 'BSME', name: 'BS Mechanical Engineering' }
    ],
    'COLLEGE OF EDUCATION': [
      { id: 'BEED', name: 'Bachelor of Elementary Education' },
      { id: 'BPEd', name: 'Bachelor of Physical Education' },
      { id: 'BSED-English', name: 'BS Education (Major in English)' },
      { id: 'BSED-Math', name: 'BS Education (Major in Mathematics)' },
      { id: 'BSED-Science', name: 'BS Education (Major in Science)' }
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
      setActiveTab(currentCollegeCourses[0].id.toLowerCase())
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
    id: course.id.toLowerCase(),
    name: course.id,
    count: studentsData.filter(s => s.course === course.id).length
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