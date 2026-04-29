import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import AdminEndorsementTable from '../../components/ui/AdminEndorsementTable'
import Pagination from '../../components/ui/Pagination'
import Dialog from '../../components/ui/Dialog'
import Toast from '../../components/ui/Toast'
import RejectEndorsementModal from '../../components/custom/dialog/RejectEndorsementModal'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'

function AdminEndorsements() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [endorsementRequests, setEndorsementRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  
  // Toast State
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const itemsPerPage = 10

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

  const fetchEndorsements = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/admin/endorsements?college=${encodeURIComponent(user?.college || 'CCS')}`)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))
      
      const [res] = await Promise.all([response, minLoadingTime])
      
      if (res.ok) {
        const data = await res.json()
        setEndorsementRequests(data)
      }
    } catch (err) {
      console.error('Error fetching endorsements:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.college) {
      fetchEndorsements()
    }
  }, [user])

  // Mock data for courses
  const courses = [
    { id: 'all', name: 'All', count: endorsementRequests.length },
    ...(coursesByCollege[resolvedCollegeName] || []).map(c => ({
      id: c.value.toLowerCase(),
      name: c.value,
      count: endorsementRequests.filter(req => req.course === c.value).length
    }))
  ]

  // Filter by course
  const filteredByCourse = activeTab === 'all'
    ? endorsementRequests
    : endorsementRequests.filter(student => {
        return student.course.toLowerCase() === activeTab.toLowerCase()
      })

  // Sort by status: ready first, then pending, then rejected, then completed
  const sortedStudents = [...filteredByCourse].sort((a, b) => {
    const statusOrder = { ready: 1, pending: 2, rejected: 3, completed: 4 }
    const orderA = statusOrder[a.status] || 99
    const orderB = statusOrder[b.status] || 99
    return orderA - orderB
  })

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentStudents = sortedStudents.slice(startIndex, endIndex)

  // Reset to page 1 when filter changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleViewEndorsement = (student) => {
    setSelectedStudent(student)
    setShowConfirmDialog(true)
  }

  const handleConfirmEndorsement = async () => {
    setIsApproving(true)
    const minWait = new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/endorsements/${selectedStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' })
      })
      
      await minWait
      
      if (response.ok) {
        setShowConfirmDialog(false)
        setToastMessage('Endorsement letter successfully generated and sent to the student.')
        setToastType('success')
        setShowToast(true)
        fetchEndorsements()
        window.dispatchEvent(new Event('endorsementCountUpdated'))
      }
    } catch (err) {
      console.error('Error approving endorsement:', err)
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectClick = (student) => {
    setSelectedStudent(student)
    setShowRejectDialog(true)
  }

  const handleConfirmReject = async (reason) => {
    setIsRejecting(true)
    const minWait = new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await fetch(`http://localhost:3001/api/admin/endorsements/${selectedStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
      })

      await minWait

      if (response.ok) {
        setShowRejectDialog(false)
        setToastMessage('The endorsement request has been rejected.')
        setToastType('error')
        setShowToast(true)
        fetchEndorsements()
        window.dispatchEvent(new Event('endorsementCountUpdated'))
      }
    } catch (err) {
      console.error('Error rejecting endorsement:', err)
    } finally {
      setIsRejecting(false)
    }
  }

  const handleCompleteClick = (student) => {
    setSelectedStudent(student)
    setShowCompleteDialog(true)
  }

  const handleConfirmComplete = async () => {
    setIsCompleting(true)
    const minWait = new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await fetch(`http://localhost:3001/api/admin/endorsements/${selectedStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      })

      await minWait

      if (response.ok) {
        setShowCompleteDialog(false)
        setToastMessage('The endorsement has been marked as completed successfully.')
        setToastType('success')
        setShowToast(true)
        fetchEndorsements()
        window.dispatchEvent(new Event('endorsementCountUpdated'))
      }
    } catch (err) {
      console.error('Error completing endorsement:', err)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">{resolvedCollegeName}</h1>
        <p className="text-gray-600 mt-1">
          Review and approve student endorsement requests
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

      {/* Endorsement Table */}
      <AdminEndorsementTable
        students={currentStudents}
        onReject={handleRejectClick}
        onEndorse={handleViewEndorsement}
        onComplete={handleCompleteClick}
        isLoading={isLoading}
      />

      {/* Pagination Info and Controls */}
      {(sortedStudents.length > 0 || isLoading) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="px-6 py-4 flex items-center justify-between">
            {isLoading ? (
              <Skeleton variant="text" width={250} height={20} />
            ) : (
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, sortedStudents.length)}</span> of{' '}
                <span className="font-medium">{sortedStudents.length}</span> students
              </div>
            )}
            {isLoading ? (
              <div className="flex gap-2">
                <Skeleton variant="rectangular" width={32} height={32} className="rounded" />
                <Skeleton variant="rectangular" width={32} height={32} className="rounded" />
                <Skeleton variant="rectangular" width={32} height={32} className="rounded" />
              </div>
            ) : (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      )}

      {/* Confirm Endorsement Dialog */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmEndorsement}
        title="Confirm Endorsement"
        message={`Are you sure the endorsement letter information for ${selectedStudent?.fullName} is correct?`}
        confirmLabel="Yes"
        cancelLabel="No"
        isLoading={isApproving}
        loadingLabel="Processing..."
      />

      {/* Reject Endorsement Dialog */}
      <RejectEndorsementModal
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleConfirmReject}
        studentName={selectedStudent?.fullName}
        isLoading={isRejecting}
      />

      {/* Complete Confirmation Dialog */}
      <Dialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onConfirm={handleConfirmComplete}
        title="Confirm Completion"
        message={`Are you sure ${selectedStudent?.fullName} has picked up the endorsement letter from the faculty?`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        isLoading={isCompleting}
        loadingLabel="Completing..."
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </AppLayout>
  )
}

export default AdminEndorsements