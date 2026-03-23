import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import EndorsementCard from '../../components/ui/EndorsementCard'
import RequirementsChecklist from '../../components/ui/RequirementsChecklist'
import EndorsementHelp from '../../components/custom/dialog/EndorsementHelp'
import AlertDialog from '../../components/ui/AlertDialog'
import Skeleton from '../../components/ui/Skeleton'
import PendingApprovalDialog from '../../components/custom/dialog/PendingApprovalDialog'
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
  const [successOpen, setSuccessOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Replace with real API data
  const [endorsement, setEndorsement] = useState({
    status: 'unavailable',   // 'unavailable' | 'in_process' | 'ready'
    dateRequested: null,
    dateApproved: null,
    downloadUrl: null,
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
    if (user?.college) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setIsLoading(true)
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))
    try {
      // TODO: Replace with real API fetch for endorsement status and requirement submissions
      // const res = await fetch(`http://localhost:3001/api/student/endorsement-status?studentId=${user.id}`)
      // const data = await res.json()
      // setEndorsement(data.endorsement)
      // setRequirements(data.requirements)
    } catch (err) {
      console.error('Error fetching endorsement data:', err)
    } finally {
      await minLoadingTime
      setIsLoading(false)
    }
  }

  const allSubmitted = requirements.every(r => r.status === 'submitted')

  // Called by EndorsementCard with company details — 1.5s simulated API delay
  async function handleRequest(companyInfo) {
    // TODO: replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Endorsement request submitted:', companyInfo)
    setEndorsement(prev => ({
      ...prev,
      status: 'in_process',
      dateRequested: new Date().toISOString().split('T')[0],
    }))
    setSuccessOpen(true)
  }

  function handleDownload() {
    // TODO: trigger actual file download
    console.log('Downloading endorsement letter...')
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
                allSubmitted={allSubmitted}
                onRequest={handleRequest}
                onDownload={handleDownload}
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

        {/* Success AlertDialog */}
        <AlertDialog
          isOpen={successOpen}
          onClose={() => setSuccessOpen(false)}
          type="success"
          title="Request Submitted!"
          description="Your endorsement letter request has been sent to the coordinator. Please wait 3–5 business days for processing. You will be notified once your letter is ready."
        />
      </AppLayout>
    </>
  )
}

export default UserEndorsement