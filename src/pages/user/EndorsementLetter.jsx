import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import EndorsementCard from '../../components/ui/EndorsementCard'
import RequirementsChecklist from '../../components/ui/RequirementsChecklist'
import EndorsementHelp from '../../components/custom/dialog/EndorsementHelp'

function UserEndorsement() {
  const [helpOpen, setHelpOpen] = useState(false)

  // Replace with real API data
  const endorsement = {
    status: 'unavailable',       // 'unavailable' | 'in_process' | 'ready'
    dateRequested: null,
    dateApproved: null,
    downloadUrl: null,
  }

  // Replace with real API data — these are all 9 requirements
  const requirements = [
    { name: 'Copy of Registration Form',                              status: 'approved' },
    { name: 'Attendance / Pre-Deployment Orientation',                status: 'approved' },
    { name: 'Scanned Copy of Application Letter',                     status: 'rejected' },
    { name: 'Curriculum Vitae (LU Format)',                           status: 'approved' },
    { name: 'AVP Self Introduction',                                  status: 'pending'  },
    { name: 'Notarized Student Internship Consent Form (LU Format)',  status: 'pending'  },
    { name: 'Medical Clearance',                                      status: 'approved' },
    { name: 'Scanned Copy of MOA',                                    status: 'pending'  },
    { name: 'Company Profile',                                        status: 'pending'  },
  ]

  const allApproved = requirements.every(r => r.status === 'approved')

  function handleRequest() {
    // TODO: API call to request endorsement letter
    alert('Request sent to coordinator!')
  }

  function handleDownload() {
    // TODO: trigger actual file download
    alert('Downloading endorsement letter...')
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
        {/* Left — Endorsement Card */}
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

        {/* Right — Requirements Checklist */}
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
    </AppLayout>
  )
}

export default UserEndorsement