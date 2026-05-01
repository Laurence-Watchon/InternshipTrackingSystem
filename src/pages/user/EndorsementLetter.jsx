import { apiFetch } from '../../config/api.js';
import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import EndorsementCard from '../../components/ui/EndorsementCard'
import RequirementsChecklist from '../../components/ui/RequirementsChecklist'
import EndorsementHelp from '../../components/custom/dialog/EndorsementHelp'
import Skeleton from '../../components/ui/Skeleton'
import PendingApprovalDialog from '../../components/custom/dialog/PendingApprovalDialog'
import Dialog from '../../components/ui/Dialog'
import Toast from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const collegeMapping = {
  'CAS': 'COLLEGE OF ARTS AND SCIENCES',
  'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
  'CCS': 'COLLEGE OF COMPUTING STUDIES',
  'COE': 'COLLEGE OF ENGINEERING',
  'COED': 'COLLEGE OF EDUCATION'
}

function UserEndorsement() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [helpOpen, setHelpOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Request Confirmation UI States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tempCompanyInfo, setTempCompanyInfo] = useState(null)

  // Toast States
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  // Replace with real API data
  const [endorsement, setEndorsement] = useState({
    status: 'unavailable',   // 'unavailable' | 'in_process' | 'ready' | 'rejected'
    dateRequested: null,
    dateApproved: null,
    downloadUrl: null,
    rejectionReason: null,
    scannedFileName: null,
    scannedFileUrl: null,
  })

  // Mock requirements status - in a real app, you'd fetch this from the API
  const [requirements, setRequirements] = useState([
    { name: 'Copy of Registration Form', status: 'submitted' },
    { name: 'Attendance / Pre-Deployment Orientation', status: 'submitted' },
    { name: 'Scanned Copy of Application Letter', status: 'submitted' },
    { name: 'Curriculum Vitae (LU Format)', status: 'submitted' },
    { name: 'AVP Self Introduction', status: 'submitted' },
    { name: 'Notarized Student Internship Consent Form (LU Format)', status: 'submitted' },
    { name: 'Medical Clearance', status: 'submitted' },
    { name: 'Scanned Copy of MOA', status: 'submitted' },
    { name: 'Company Profile', status: 'submitted' },
  ])

  useEffect(() => {
    if (user?.college && (user?._id || user?.id)) {
      fetchData()
      
      // Auto-poll for status updates every 5 seconds
      const pollInterval = setInterval(() => fetchData(true), 5000)

      // BroadcastChannel for cross-tab synchronization
      const bc = new BroadcastChannel('endorsement_updates')
      bc.onmessage = () => fetchData(true)

      return () => {
        clearInterval(pollInterval)
        bc.close()
      }
    }
  }, [user])

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true)
    const minLoadingTime = isSilent ? Promise.resolve() : new Promise(resolve => setTimeout(resolve, 800))
    try {
      // 1. Fetch all requirements for the student's college and course
      const reqResponse = await apiFetch(`/api/student/requirements?college=${encodeURIComponent(user.college)}${user.course ? `&course=${encodeURIComponent(user.course)}` : ''}`)
      const requirementsData = await reqResponse.json()

      // 2. Fetch the student's submissions
      const subResponse = await apiFetch(`/api/student/my-submissions?studentId=${user._id || user.id}`)
      const submissionsData = await subResponse.json()

      // 3. Fetch endorsement status
      const endResponse = await apiFetch(`/api/student/endorsement-status?studentId=${user._id || user.id}`)
      const endData = await endResponse.json()

      if (reqResponse.ok && subResponse.ok && endResponse.ok) {
        // 4. Merge data: check status for each requirement
        const mergedReqs = requirementsData.map(req => {
          const submission = submissionsData.find(sub => sub.requirementId === req._id)
          return {
            name: req.title,
            status: submission ? submission.status : 'pending'
          }
        })
        setRequirements(mergedReqs)

        if (endData && endData.status !== 'unavailable') {
          setEndorsement({
            status: endData.status,
            dateRequested: endData.dateRequested,
            dateApproved: endData.dateApproved,
            downloadUrl: endData.downloadUrl,
            rejectionReason: endData.rejectionReason,
            scannedFileName: endData.scannedFileName,
            scannedFileUrl: endData.scannedFileUrl,
          })
        }
      }
    } catch (err) {
      console.error('Error fetching endorsement data:', err)
    } finally {
      await minLoadingTime
      setIsLoading(false)
    }
  }

  const allSubmitted = requirements.length > 0 && requirements.every(r => r.status === 'verified' || r.status === 'submitted')

  // Called by EndorsementCard when the user clicks 'Request'
  function handleRequest(companyInfo) {
    setTempCompanyInfo(companyInfo)
    setIsConfirmOpen(true)
  }

  // Called after the user confirms in the Dialog
  async function confirmRequest() {
    setIsConfirmOpen(false)
    setIsSubmitting(true)

    // Ensure at least 1 second of loading state as requested
    const minWait = new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await apiFetch(`/api/student/endorsement-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user._id || user.id,
          companyName: tempCompanyInfo.companyName,
          companyAddress: tempCompanyInfo.address,
          supervisorFullName: tempCompanyInfo.supervisorName,
        }),
      })

      // Wait for at least 1 second total
      await minWait

      if (response.ok) {
        setEndorsement(prev => ({
          ...prev,
          status: 'in_process',
          dateRequested: new Date().toISOString(),
          rejectionReason: null, // Clear rejection reason on new request
        }))
        setToastMessage('Successfully requested endorsement letter')
        setToastType('success')
        setShowToast(true)
        window.dispatchEvent(new Event('endorsementStatusUpdated'))
        window.dispatchEvent(new Event('endorsementCountUpdated'))
        new BroadcastChannel('endorsement_updates').postMessage('refresh')
      } else {
        const errorData = await response.json()
        setToastMessage(errorData.error || 'Failed to submit request.')
        setToastType('error')
        setShowToast(true)
      }
    } catch (err) {
      console.error('Error submitting endorsement request:', err)
      setToastMessage('An error occurred. Please try again.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadScanned = async (fileData) => {
    setIsSubmitting(true)
    const minWait = new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const response = await apiFetch(`/api/student/endorsement-scanned`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user._id || user.id,
          fileName: fileData.name,
          fileUrl: fileData.url
        })
      })

      await minWait

      if (response.ok) {
        setToastMessage('Scanned endorsement letter uploaded successfully!')
        setToastType('success')
        setShowToast(true)
        fetchData(true)
        new BroadcastChannel('endorsement_updates').postMessage('refresh')
      } else {
        const errorData = await response.json()
        setToastMessage(errorData.error || 'Failed to upload scanned copy')
        setToastType('error')
        setShowToast(true)
      }
    } catch (err) {
      console.error('Error uploading scanned letter:', err)
      setToastMessage('An error occurred during upload.')
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDownload() {
    // TODO: trigger actual file download
  }

  return (
    <>
      <PendingApprovalDialog
        isOpen={user && user.isVerified === false}
        onClose={() => { logout(); navigate('/login') }}
      />

      <AppLayout role="user">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {collegeMapping[user?.college] || user?.college}
          </h1>
          <p className="text-gray-600 mt-1">Request and download your internship endorsement letter.</p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Endorsement Card (2/3) */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 h-[500px] flex flex-col items-center justify-center">
                <Skeleton variant="circular" width={64} height={64} className="mb-6" />
                <Skeleton variant="text" width={200} height={32} className="mb-4" />
                <Skeleton variant="text" width="60%" className="mb-8" />
                <Skeleton variant="rectangular" height={48} width="100%" className="rounded-full mb-8" />
                <div className="w-full space-y-4 pt-8 border-t border-gray-100">
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="rectangular" height={40} width="100%" />
                  <Skeleton variant="rectangular" height={40} width="100%" />
                </div>
              </div>
            ) : (
              <EndorsementCard
                status={endorsement.status}
                dateRequested={endorsement.dateRequested}
                dateApproved={endorsement.dateApproved}
                downloadUrl={endorsement.downloadUrl}
                rejectionReason={endorsement.rejectionReason}
                scannedFileName={endorsement.scannedFileName}
                scannedFileUrl={endorsement.scannedFileUrl}
                onUploadScanned={handleUploadScanned}
                allSubmitted={allSubmitted}
                onRequest={handleRequest}
                onDownload={handleDownload}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Right — Requirements Checklist (1/3) */}
          <div className="lg:col-span-1">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[520px] flex flex-col">
                <Skeleton variant="text" width="70%" height={28} className="mb-2" />
                <Skeleton variant="text" width="90%" className="mb-6" />
                <div className="flex-1 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width="80%" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between mb-2">
                    <Skeleton variant="text" width={60} />
                    <Skeleton variant="text" width={80} />
                  </div>
                  <Skeleton variant="rectangular" height={8} className="rounded-full" />
                </div>
              </div>
            ) : (
              <RequirementsChecklist
                requirements={requirements}
                onHelpClick={() => setHelpOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Help dialog */}
        <EndorsementHelp
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
        />

        {/* Confirmation Dialog */}
        <Dialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmRequest}
          title="Confirm Request"
          message={`Are you sure you want to request your endorsement letter for ${tempCompanyInfo?.companyName}? Please ensure all details are correct.`}
          confirmLabel="Yes, Request"
          cancelLabel="No, Cancel"
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
    </>
  )
}

export default UserEndorsement
