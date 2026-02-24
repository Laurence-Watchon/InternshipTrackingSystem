import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import EndorsementCard from '../../components/ui/EndorsementCard'
import RequirementsChecklist from '../../components/ui/RequirementsChecklist'
import EndorsementHelp from '../../components/custom/dialog/EndorsementHelp'
import AlertDialog from '../../components/ui/AlertDialog'

function UserEndorsement() {
  const [helpOpen, setHelpOpen]       = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  // Replace with real API data
  const [endorsement, setEndorsement] = useState({
    status: 'unavailable',   // 'unavailable' | 'in_process' | 'ready'
    dateRequested: null,
    dateApproved: null,
    downloadUrl: null,
  })

  // Replace with real API data — all 9 requirements
  const requirements = [
    { name: 'Copy of Registration Form',                             status: 'approved' },
    { name: 'Attendance / Pre-Deployment Orientation',               status: 'approved' },
    { name: 'Scanned Copy of Application Letter',                    status: 'approved' },
    { name: 'Curriculum Vitae (LU Format)',                          status: 'approved' },
    { name: 'AVP Self Introduction',                                 status: 'approved' },
    { name: 'Notarized Student Internship Consent Form (LU Format)', status: 'approved' },
    { name: 'Medical Clearance',                                     status: 'approved' },
    { name: 'Scanned Copy of MOA',                                   status: 'approved' },
    { name: 'Company Profile',                                       status: 'approved' },
  ]

  const allApproved = requirements.every(r => r.status === 'approved')

  // Called by EndorsementCard with company details — 1.5s simulated API delay
  async function handleRequest(companyInfo) {
    // TODO: replace with real API call e.g. await api.post('/endorsement/request', companyInfo)
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
    <AppLayout role="user">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">College of Computing Studies- BSCS-DS</h1>
        <p className="text-gray-600 mt-1">Request and download your internship endorsement letter.</p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Endorsement Card (2/3) */}
        <div className="lg:col-span-2">
          <EndorsementCard
            status={endorsement.status}
            dateRequested={endorsement.dateRequested}
            dateApproved={endorsement.dateApproved}
            downloadUrl={endorsement.downloadUrl}
            allApproved={allApproved}
            onRequest={handleRequest}
            onDownload={handleDownload}
          />
        </div>

        {/* Right — Requirements Checklist (1/3) */}
        <div className="lg:col-span-1">
          <RequirementsChecklist
            requirements={requirements}
            onHelpClick={() => setHelpOpen(true)}
          />
        </div>
      </div>

      {/* Help dialog */}
      <EndorsementHelp
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* Success AlertDialog — shown after request is submitted */}
      <AlertDialog
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        type="success"
        title="Request Submitted!"
        description="Your endorsement letter request has been sent to the coordinator. Please wait 3–5 business days for processing. You will be notified once your letter is ready."
      />
    </AppLayout>
  )
}

export default UserEndorsement