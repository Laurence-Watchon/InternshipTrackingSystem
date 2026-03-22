import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/custom/global/AppLayout'
import RequirementDetailCard from '../../components/ui/RequirementDetailCard'
import { useAuth } from '../../context/AuthContext'

function AdminStudentRequirementsDetail() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [studentData, setStudentData] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (studentId && user?.college) {
      fetchData()
    }
  }, [studentId, user])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Get all monitoring data for this college to find this specific student
      const response = await fetch(`http://localhost:3001/api/admin/students-monitoring?college=${encodeURIComponent(user.college)}`)
      const data = await response.json()
      
      if (response.ok) {
        const student = data.find(s => s.studentId === studentId)
        if (student) {
          setStudentData({
            fullName: `${student.firstName} ${student.lastName}`,
            studentNumber: student.studentNumber,
            email: student.email || 'N/A',
            course: student.course,
            college: user.college,
            requirementsCompleted: student.submissions.filter(s => s.status === 'verified').length,
            totalRequirements: student.submissions.length
          })

          // Transform submissions to the format needed by the card
          const transformedReqs = student.submissions.map(sub => ({
            id: sub.requirementId,
            submissionId: sub.submissionId,
            title: sub.requirementTitle,
            description: sub.requirementDescription || 'No description provided.',
            status: sub.status,
            submittedDate: sub.submittedAt,
            fileUrl: sub.fileUrl,
            fileName: sub.fileName,
            fileType: sub.fileName?.includes('http') || sub.fileUrl?.includes('http') ? (sub.fileName?.endsWith('.pdf') ? 'pdf' : 'url') : 'file',
            feedback: sub.feedback
          }))
          setRequirements(transformedReqs)
        }
      }
    } catch (err) {
      console.error('Error fetching student details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (submissionId) => {
    if (!submissionId) return
    updateSubmissionStatus(submissionId, 'verified')
  }

  const handleReject = async (submissionId, feedback) => {
    if (!submissionId) return
    updateSubmissionStatus(submissionId, 'rejected', feedback)
  }

  const updateSubmissionStatus = async (submissionId, status, feedback = '') => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback })
      })

      if (response.ok) {
        // Refresh data
        fetchData()
      } else {
        alert('Failed to update submission status')
      }
    } catch (err) {
      console.error('Error updating status:', err)
      alert('An error occurred.')
    }
  }

  const handleFileClick = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    }
  }

  if (isLoading) {
    return (
      <AppLayout role="admin">
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AppLayout>
    )
  }

  if (!studentData) {
    return (
      <AppLayout role="admin">
        <div className="p-12 text-center text-gray-500">
          Student not found or no requirements matching.
          <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-green-600 hover:underline">
            Go Back
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout role="admin">
      {/* Back Button and Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{studentData.fullName}</h1>
        <p className="text-gray-600 mt-1">
          {studentData.studentNumber} • {studentData.course}
        </p>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
            <p className="text-sm font-medium text-gray-900">{studentData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">College</label>
            <p className="text-sm font-medium text-gray-900">{studentData.college}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Requirements Progress</label>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                studentData.requirementsCompleted === studentData.totalRequirements
                  ? 'text-green-600'
                  : 'text-gray-900'
              }`}>
                {studentData.requirementsCompleted}/{studentData.totalRequirements}
              </span>
              {studentData.requirementsCompleted === studentData.totalRequirements && (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track student's progress on all required documents
          </p>
        </div>

        <div className="space-y-0">
          {requirements.map((req, index) => (
            <RequirementDetailCard
              key={req.id}
              requirement={req}
              index={index + 1}
              onFileClick={handleFileClick}
              onVerify={handleVerify}
              onReject={handleReject}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default AdminStudentRequirementsDetail