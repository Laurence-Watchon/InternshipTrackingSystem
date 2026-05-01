import { apiFetch } from '../../config/api.js';
import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import AdminStudentsTable from '../../components/ui/AdminStudentsTable'
import StudentDetailsModal from '../../components/custom/dialog/StudentDetailsModal'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { AlertCircle } from 'lucide-react'

function StudentManagement() {
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [allStudents, setAllStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchStudents = async () => {
      // Enforce a minimum loading time of 1 second for better UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000))

      if (!authUser?.college) {
        // If no college, stop loading after the minimum time
        await minLoadingTime
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const fetchData = apiFetch(`/api/admin/students?college=${encodeURIComponent(authUser.college)}`)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch students')
            return res.json()
          })

        const [data] = await Promise.all([fetchData, minLoadingTime])

        // Map database fields to mock fields if needed
        const mappedData = data.map(student => ({
          ...student,
          fullName: `${student.lastName}, ${student.firstName}`,
          id: student.id || student._id,
          requirementsCompleted: student.requirementsCompleted,
          totalRequirements: student.totalRequirements,
          isDeployed: student.isDeployed || false,
          completedRequirements: student.completedRequirements || []
        })).sort((a, b) => {
          // Helper to get status priority
          const getStatusPriority = (s) => {
            if (s.requirementsCompleted !== s.totalRequirements || s.totalRequirements === 0) return 1; // Pending
            if (s.endorsementStatus === 'completed') return 3; // Completed
            return 2; // Reviewing
          };

          const priorityA = getStatusPriority(a);
          const priorityB = getStatusPriority(b);

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // If same status, sort by date (oldest first)
          return new Date(a.createdAt) - new Date(b.createdAt);
        })

        setAllStudents(mappedData)
      } catch (err) {
        console.error('Error fetching students:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [authUser?.college])

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

  const resolvedCollegeName = getFullCollegeName(authUser?.college)

  // Derive courses counts dynamically based on admin's college
  const currentCollegeCourses = coursesByCollege[resolvedCollegeName] || []
  const courses = [
    { id: 'all', name: 'All', count: allStudents.length },
    ...currentCollegeCourses.map(c => ({
      id: c.value.toLowerCase(),
      name: c.value,
      count: allStudents.filter(s => s.course === c.value).length
    }))
  ]


  // Filter students by course
  const filteredByCourse = activeTab === 'all'
    ? allStudents
    : allStudents.filter(student => {
      return student.course.toLowerCase() === activeTab.toLowerCase()
    })

  // Filter by search query
  const filteredStudents = filteredByCourse.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.companyName && student.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.companyAddress && student.companyAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.supervisor && student.supervisor.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <h1 className="text-2xl font-bold text-gray-900 uppercase">{resolvedCollegeName}</h1>
        <p className="text-gray-600 mt-1">
          View and manage all students in your college
        </p>
      </div>

      {/* Course Tabs */}
      <div className="mb-6">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={40} width={100} className="rounded-md" />
            ))}
          </div>
        ) : (
          <AdminHomeCourses
            courses={courses}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        {isLoading ? (
          <Skeleton variant="rectangular" height={50} className="w-full rounded-lg" />
        ) : (
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
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="text" width="60%" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="px-6 py-6 border-b border-gray-200">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-1 flex items-center">
                    <Skeleton variant="circular" width={40} height={40} className="mr-3" />
                    <Skeleton variant="text" width="80%" />
                  </div>
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} variant="text" width="70%" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl mb-4 mx-auto animate-shake">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-gray-800 font-bold text-xl mb-2">Failed to Load Students</p>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none"
          >
            Retry
          </button>
        </div>
      ) : hasNoStudents ? (
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