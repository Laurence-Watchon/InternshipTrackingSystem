import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/custom/global/AppLayout'
import RequirementDetailCard from '../../components/ui/RequirementDetailCard'
import Skeleton from '../../components/ui/Skeleton'
import Toast from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'

function AdminStudentRequirementsDetail() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [studentData, setStudentData] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const collegeMapping = {
    'CAS': 'COLLEGE OF ARTS AND SCIENCES',
    'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
    'CCS': 'COLLEGE OF COMPUTING STUDIES',
    'COE': 'COLLEGE OF ENGINEERING',
    'COED': 'COLLEGE OF EDUCATION'
  }

  const getFullCollegeName = (name) => {
    if (!name) return 'N/A'
    const upper = name.toUpperCase()
    return collegeMapping[upper] || upper
  }

  const getViewerUrl = (url, fileName) => {
    if (!url) return '#'
    const ext = fileName?.split('.').pop()?.toLowerCase()
    if (['pdf', 'docx'].includes(ext)) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }

  useEffect(() => {
    if (studentId && user?.college) {
      fetchData()
    }
  }, [studentId, user])

  const fetchData = async () => {
    setIsLoading(true)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))
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
            college: getFullCollegeName(user.college),
            requirementsCompleted: student.submissions.filter(s => s.status === 'verified' || s.status === 'submitted').length,
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
      await minLoadingTime
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
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000))
    try {
      const fetchData = fetch(`http://localhost:3001/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedback })
      })

      const [response] = await Promise.all([fetchData, minLoadingTime])

      if (response.ok) {
        // Update local state instead of full-page refresh to avoid shimmer
        setRequirements(prev => prev.map(req =>
          req.submissionId === submissionId
            ? { ...req, status, feedback }
            : req
        ))

        // Update requirements completed count locally
        if (status === 'verified' || status === 'submitted') {
          setStudentData(prev => ({
            ...prev,
            requirementsCompleted: prev.requirementsCompleted + 1
          }))
        } else if (status === 'rejected') {
          setStudentData(prev => ({
            ...prev,
            requirementsCompleted: Math.max(0, prev.requirementsCompleted - (requirements.find(r => r.submissionId === submissionId)?.status === 'submitted' || requirements.find(r => r.submissionId === submissionId)?.status === 'verified' ? 1 : 0))
          }))
        }

        // Show toast
        setToast({
          message: status === 'rejected' ? 'deleting successfully' : 'Updated successfully',
          type: 'success'
        })

        setExpandedId(null)
      } else {
        setToast({ message: 'Failed to update submission status', type: 'error' })
      }
    } catch (err) {
      console.error('Error updating status:', err)
      setToast({ message: 'An error occurred while updating status', type: 'error' })
    }
  }

  const handleFileClick = (fileUrl, fileName) => {
    if (fileUrl) {
      const viewerUrl = getViewerUrl(fileUrl, fileName)
      window.open(viewerUrl, '_blank')
    }
  }

  if (isLoading) {
    return (
      <AppLayout role="admin">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton variant="text" width={240} height={32} className="mb-2" />
          <Skeleton variant="text" width={180} height={20} />
        </div>

        {/* Info Card Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton variant="text" width={100} height={16} className="mb-2" />
                <Skeleton variant="text" width={150} height={24} />
              </div>
            ))}
          </div>
        </div>

        {/* List Header Skeleton */}
        <div className="mb-6">
          <Skeleton variant="text" width={140} height={28} className="mb-2" />
          <Skeleton variant="text" width={280} height={18} />
        </div>

        {/* Requirements List Skeleton */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={40} height={40} className="flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton variant="text" width="40%" height={24} className="mb-1" />
                  <Skeleton variant="text" width="60%" height={16} />
                </div>
                <Skeleton variant="rectangular" width={80} height={28} className="rounded-full flex-shrink-0" />
              </div>
            </div>
          ))}
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
              <span className={`text-sm font-medium ${studentData.requirementsCompleted === studentData.totalRequirements
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
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
        <p className="text-sm text-gray-600 mt-1">
          Track student's progress on all required documents
        </p>
      </div>

      <div className="space-y-4">
        {requirements.map((req, index) => (
          <RequirementDetailCard
            key={req.id}
            requirement={req}
            index={index + 1}
            onFileClick={(url) => handleFileClick(url, req.fileName)}
            onVerify={handleVerify}
            onReject={handleReject}
            isExpanded={expandedId === req.id}
            onToggle={() => setExpandedId(expandedId === req.id ? null : req.id)}
          />
        ))}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppLayout>
  )
}

export default AdminStudentRequirementsDetail