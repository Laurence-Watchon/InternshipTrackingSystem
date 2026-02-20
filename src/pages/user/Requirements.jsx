import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import ClickableCard from '../../components/ui/ClickableCard'

const REQUIREMENTS = [
  {
    id: 1,
    title: 'Copy of Registration Form',
    description: 'Your official registration form from the registrar.',
    acceptedTypes: ['pdf', 'docx'],
    inputType: 'file',
  },
  {
    id: 2,
    title: 'Attendance / Copy Evaluation of Pre-Deployment Orientation',
    description: 'Attendance sheet or evaluation copy from orientation.',
    acceptedTypes: ['png', 'jpg', 'jpeg'],
    inputType: 'file',
  },
  {
    id: 3,
    title: 'Scanned Copy of Application Letter',
    description: 'Scanned or photo copy of your application letter.',
    acceptedTypes: ['pdf', 'docx', 'png', 'jpg', 'jpeg'],
    inputType: 'file',
  },
  {
    id: 4,
    title: 'Curriculum Vitae (LU Format)',
    description: 'Your CV following the LU-prescribed format.',
    acceptedTypes: ['pdf', 'docx'],
    inputType: 'file',
  },
  {
    id: 5,
    title: 'AVP Self Introduction',
    description: 'Google Drive link to your self-introduction video.',
    acceptedTypes: [],
    inputType: 'link',
  },
  {
    id: 6,
    title: 'Notarized Student Internship Consent Form (LU Format)',
    description: 'Notarized consent form using the LU format.',
    acceptedTypes: ['pdf', 'docx', 'png', 'jpg', 'jpeg'],
    inputType: 'file',
  },
  {
    id: 7,
    title: 'Medical Clearance',
    description: 'Your medical clearance document.',
    acceptedTypes: ['pdf', 'docx', 'png', 'jpg', 'jpeg'],
    inputType: 'file',
  },
  {
    id: 8,
    title: 'Scanned Copy of MOA',
    description: 'Scanned copy of the Memorandum of Agreement.',
    acceptedTypes: ['pdf', 'docx'],
    inputType: 'file',
  },
  {
    id: 9,
    title: 'Company Profile',
    description: 'Company profile of your internship host organization.',
    acceptedTypes: ['pdf', 'docx'],
    inputType: 'file',
  },
]

const noOutlineStyle = `
  button:focus, input[type="file"]:focus, .no-outline:focus { outline: none !important; box-shadow: none !important; }
`

function UserRequirements() {
  const [states, setStates] = useState(() =>
    Object.fromEntries(
      REQUIREMENTS.map(r => [r.id, { status: 'pending', fileName: '', linkValue: '' }])
    )
  )

  const [openId, setOpenId] = useState(null)

  function handleToggle(id) {
    setOpenId(prev => (prev === id ? null : id))
  }

  function handleChange(id, newState) {
    setStates(prev => ({ ...prev, [id]: newState }))
  }

  const submitted = Object.values(states).filter(s => s.status === 'submitted').length
  const rejected  = Object.values(states).filter(s => s.status === 'rejected').length
  const pending   = Object.values(states).filter(s => s.status === 'pending').length
  const total     = REQUIREMENTS.length

  return (
    <AppLayout>
      <style>{noOutlineStyle}</style>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">College of Computing Studies- BSCS-DS</h1>
        <p className="text-gray-600 mt-1">Upload all required documents to complete your internship application.</p>
      </div>

      {/* Summary cards — stat-card style matching UserHome */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>

        {/* Submitted */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Submitted</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{submitted}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-400 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-2xl font-bold text-orange-500 mt-1">{pending}</p>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Rejected</h3>
          <p className="text-2xl font-bold text-red-500 mt-1">{rejected}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Overall Progress</p>
          <p className="text-sm text-gray-500">{submitted} / {total} submitted</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(submitted / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements list — 1 per row */}
      <div className="flex flex-col gap-3">
        {REQUIREMENTS.map(req => (
          <ClickableCard
            key={req.id}
            req={req}
            state={states[req.id]}
            isOpen={openId === req.id}
            onToggle={() => handleToggle(req.id)}
            onChange={(newState) => handleChange(req.id, newState)}
          />
        ))}
      </div>
    </AppLayout>
  )
}

export default UserRequirements