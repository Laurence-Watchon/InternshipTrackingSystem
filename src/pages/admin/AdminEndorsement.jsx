import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import AdminEndorsementTable from '../../components/ui/AdminEndorsementTable'
import Pagination from '../../components/ui/Pagination'
import AlertDialog from '../../components/ui/AlertDialog'
import Dialog from '../../components/ui/Dialog'
import RejectEndorsementModal from '../../components/custom/dialog/RejectEndorsementModal'

function AdminEndorsements() {
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showRejectedDialog, setShowRejectedDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showCompletedDialog, setShowCompletedDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const itemsPerPage = 10

  // Mock data for courses
  const courses = [
    { id: 'all', name: 'All', count: 25 },
    { id: 'bscs-ds', name: 'BSCS-DS', count: 8 },
    { id: 'bsit-ba', name: 'BSIT-BA', count: 10 },
    { id: 'bsit-sd', name: 'BSIT-SD', count: 7 }
  ]

  // Mock data - students requesting endorsement
  const allStudents = [
    {
      id: 1,
      fullName: 'Juan Dela Cruz',
      studentNumber: '221-1234',
      course: 'BSIT-SD',
      companyName: 'Tech Solutions Inc.',
      companyAddress: 'Makati City, Metro Manila',
      supervisor: 'John Smith',
      status: 'ready'
    },
    {
      id: 2,
      fullName: 'Maria Santos',
      studentNumber: '221-2345',
      course: 'BSCS-DS',
      companyName: 'Data Analytics Corp.',
      companyAddress: 'BGC, Taguig City',
      supervisor: 'Jane Doe',
      status: 'pending'
    },
    {
      id: 3,
      fullName: 'Anna Garcia',
      studentNumber: '221-4567',
      course: 'BSIT-SD',
      companyName: 'Software Innovations',
      companyAddress: 'Alabang, Muntinlupa City',
      supervisor: 'Emily Brown',
      status: 'completed'
    },
    {
      id: 4,
      fullName: 'Sofia Rodriguez',
      studentNumber: '221-6789',
      course: 'BSIT-BA',
      companyName: 'Cloud Computing Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Sarah Wilson',
      status: 'ready'
    },
    {
      id: 5,
      fullName: 'Miguel Torres',
      studentNumber: '221-7890',
      course: 'BSCS-DS',
      companyName: 'Machine Learning Studio',
      companyAddress: 'Quezon City',
      supervisor: 'David Martinez',
      status: 'pending'
    },
    {
      id: 6,
      fullName: 'Isabella Cruz',
      studentNumber: '221-8901',
      course: 'BSIT-BA',
      companyName: 'Digital Marketing Hub',
      companyAddress: 'Pasig City',
      supervisor: 'Robert Lee',
      status: 'completed'
    },
    {
      id: 7,
      fullName: 'Gabriel Ramos',
      studentNumber: '221-9012',
      course: 'BSIT-SD',
      companyName: 'Web Development Co.',
      companyAddress: 'Taguig City',
      supervisor: 'Linda Chen',
      status: 'ready'
    },
    {
      id: 8,
      fullName: 'Sophia Hernandez',
      studentNumber: '221-0123',
      course: 'BSCS-DS',
      companyName: 'AI Research Institute',
      companyAddress: 'BGC, Taguig City',
      supervisor: 'Thomas Anderson',
      status: 'pending'
    },
    {
      id: 9,
      fullName: 'Lucas Fernandez',
      studentNumber: '221-1235',
      course: 'BSIT-BA',
      companyName: 'Business Analytics Ltd.',
      companyAddress: 'Makati City',
      supervisor: 'Patricia Moore',
      status: 'completed'
    },
    {
      id: 10,
      fullName: 'Emma Gonzales',
      studentNumber: '221-2346',
      course: 'BSIT-SD',
      companyName: 'Software Engineering Corp.',
      companyAddress: 'Ortigas Center',
      supervisor: 'Mark Johnson',
      status: 'ready'
    },
    {
      id: 11,
      fullName: 'Daniel Rivera',
      studentNumber: '221-3457',
      course: 'BSCS-DS',
      companyName: 'Data Science Solutions',
      companyAddress: 'Quezon City',
      supervisor: 'Jessica Taylor',
      status: 'pending'
    },
    {
      id: 12,
      fullName: 'Olivia Pascual',
      studentNumber: '221-4568',
      course: 'BSIT-BA',
      companyName: 'Business Intelligence Inc.',
      companyAddress: 'Mandaluyong City',
      supervisor: 'Christopher White',
      status: 'completed'
    }
  ]

  // Filter by course
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

  // Sort by status: ready first, then pending, then completed
  const sortedStudents = [...filteredByCourse].sort((a, b) => {
    const statusOrder = { ready: 1, pending: 2, completed: 3 }
    return statusOrder[a.status] - statusOrder[b.status]
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

  const handleConfirmEndorsement = () => {
    // TODO: API call to approve endorsement
    console.log('Endorsement approved for:', selectedStudent)
    setShowConfirmDialog(false)
    setShowSuccessDialog(true)
  }

  const handleRejectClick = (student) => {
    setSelectedStudent(student)
    setShowRejectDialog(true)
  }

  const handleConfirmReject = (reason) => {
    // TODO: API call to reject endorsement with reason
    console.log('Endorsement rejected for:', selectedStudent, 'Reason:', reason)
    setShowRejectedDialog(true)
  }

  const handleCompleteClick = (student) => {
    setSelectedStudent(student)
    setShowCompleteDialog(true)
  }

  const handleConfirmComplete = () => {
    // TODO: API call to mark as completed
    console.log('Endorsement completed for:', selectedStudent)
    setShowCompleteDialog(false)
    setShowCompletedDialog(true)
  }

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">COLLEGE OF COMPUTING STUDIES</h1>
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
      />

      {/* Pagination Info and Controls */}
      {sortedStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, sortedStudents.length)}</span> of{' '}
              <span className="font-medium">{sortedStudents.length}</span> students
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* Confirm Endorsement Dialog */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmEndorsement}
        title="Confirm Endorsement"
        description={`Are you sure the endorsement letter information for ${selectedStudent?.fullName} is correct?`}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Reject Endorsement Dialog */}
      <RejectEndorsementModal
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleConfirmReject}
        studentName={selectedStudent?.fullName}
      />

      {/* Success Dialog */}
      <AlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        type="success"
        title="Endorsement Complete"
        description="The endorsement letter has been successfully generated and sent to the student."
      />

      {/* Rejected Dialog */}
      <AlertDialog
        isOpen={showRejectedDialog}
        onClose={() => setShowRejectedDialog(false)}
        type="error"
        title="Endorsement Rejected"
        description="The endorsement request has been rejected. The student will be notified with the reason."
      />

      {/* Complete Confirmation Dialog */}
      <Dialog
        isOpen={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        onConfirm={handleConfirmComplete}
        title="Confirm Completion"
        description={`Are you sure ${selectedStudent?.fullName} has picked up the endorsement letter from the faculty?`}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Completed Success Dialog */}
      <AlertDialog
        isOpen={showCompletedDialog}
        onClose={() => setShowCompletedDialog(false)}
        type="success"
        title="Endorsement Completed"
        description="The endorsement has been marked as completed successfully."
      />
    </AppLayout>
  )
}

export default AdminEndorsements