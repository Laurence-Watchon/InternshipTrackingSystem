import { useParams } from 'react-router-dom'
import AppLayout from '../../components/custom/global/AppLayout'
import RequirementDetailCard from '../../components/ui/RequirementDetailCard'

function AdminStudentRequirementsDetail() {
  const { studentId } = useParams()

  // Mock student data - replace with API call
  const studentData = {
    id: studentId,
    fullName: 'Santos, Maria',
    studentNumber: '221-2345',
    email: 'maria.santos@gmail.com',
    course: 'BSCS-DS',
    college: 'College of Computer Studies',
    requirementsCompleted: 7,
    totalRequirements: 9
  }

  // Mock requirements with submissions (status: 'submitted' or 'pending')
  const requirements = [
    {
      id: 1,
      title: 'Copy of Registration Form',
      description: 'Your official registration form from the registrar.',
      status: 'submitted',
      submittedDate: '2026-01-15',
      fileUrl: 'https://example.com/files/registration-form.pdf',
      fileName: 'registration-form.pdf',
      fileType: 'pdf'
    },
    {
      id: 2,
      title: 'Attendance / Copy Evaluation of Pre-Deployment Orientation',
      description: 'Attendance sheet or evaluation copy from orientation.',
      status: 'submitted',
      submittedDate: '2026-01-18',
      fileUrl: 'https://example.com/files/attendance.pdf',
      fileName: 'attendance.pdf',
      fileType: 'pdf'
    },
    {
      id: 3,
      title: 'Scanned Copy of Application Letter',
      description: 'Scanned or photo copy of your application letter.',
      status: 'submitted',
      submittedDate: '2026-01-20',
      fileUrl: 'https://example.com/files/application-letter.pdf',
      fileName: 'application-letter.pdf',
      fileType: 'pdf'
    },
    {
      id: 4,
      title: 'Curriculum Vitae (LU Format)',
      description: 'Your CV following the LU-prescribed format.',
      status: 'submitted',
      submittedDate: '2026-01-22',
      fileUrl: 'https://example.com/files/cv.pdf',
      fileName: 'cv.pdf',
      fileType: 'pdf'
    },
    {
      id: 5,
      title: 'AVP Self Introduction',
      description: 'Google Drive link to your self-introduction video.',
      status: 'submitted',
      submittedDate: '2026-01-24',
      fileUrl: 'https://drive.google.com/file/d/example',
      fileName: 'Video Link',
      fileType: 'url'
    },
    {
      id: 6,
      title: 'Notarized Student Internship Consent Form (LU Format)',
      description: 'Notarized consent form using the LU format.',
      status: 'submitted',
      submittedDate: '2026-01-26',
      fileUrl: 'https://example.com/files/consent-form.pdf',
      fileName: 'consent-form.pdf',
      fileType: 'pdf'
    },
    {
      id: 7,
      title: 'Medical Clearance',
      description: 'Medical clearance certificate.',
      status: 'submitted',
      submittedDate: '2026-01-28',
      fileUrl: 'https://example.com/files/medical-clearance.pdf',
      fileName: 'medical-clearance.pdf',
      fileType: 'pdf'
    },
    {
      id: 8,
      title: 'Scanned Copy of MOA',
      description: 'Memorandum of Agreement from your company.',
      status: 'pending',
      submittedDate: null,
      fileUrl: null,
      fileName: null,
      fileType: null
    },
    {
      id: 9,
      title: 'Company Profile',
      description: 'Company profile or information sheet.',
      status: 'pending',
      submittedDate: null,
      fileUrl: null,
      fileName: null,
      fileType: null
    }
  ]

  const handleFileClick = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    }
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
            />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

export default AdminStudentRequirementsDetail