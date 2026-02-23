import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import Dialog from '../../components/ui/Dialog'
import RejectRegistrationDialog from '../../components/custom/dialog/RejectRegistrationDialog'

const INITIAL_STUDENTS = [
  { id: 1,  lastName: 'Dela Cruz',  firstName: 'Juan',      studentNumber: '221-1234', email: 'juan.delacruz@gmail.com',   course: 'BSCS-DS' },
  { id: 2,  lastName: 'Reyes',      firstName: 'Maria',     studentNumber: '221-1235', email: 'maria.reyes@gmail.com',     course: 'BSIT-SD' },
  { id: 3,  lastName: 'Santos',     firstName: 'Carlos',    studentNumber: '221-1236', email: 'carlos.santos@gmail.com',   course: 'BSIT-BA' },
  { id: 4,  lastName: 'Garcia',     firstName: 'Ana',       studentNumber: '221-1237', email: 'ana.garcia@gmail.com',      course: 'BSCS-DS' },
  { id: 5,  lastName: 'Mendoza',    firstName: 'Jose',      studentNumber: '221-1238', email: 'jose.mendoza@gmail.com',    course: 'BSIT-SD' },
  { id: 6,  lastName: 'Torres',     firstName: 'Luz',       studentNumber: '221-1239', email: 'luz.torres@gmail.com',      course: 'BSIT-BA' },
  { id: 7,  lastName: 'Flores',     firstName: 'Miguel',    studentNumber: '221-1240', email: 'miguel.flores@gmail.com',   course: 'BSCS-DS' },
  { id: 8,  lastName: 'Ramos',      firstName: 'Elena',     studentNumber: '221-1241', email: 'elena.ramos@gmail.com',     course: 'BSIT-SD' },
]

const COURSE_COLORS = {
  'BSCS-DS': 'bg-blue-100 text-blue-700',
  'BSIT-SD': 'bg-green-100 text-green-700',
  'BSIT-BA': 'bg-purple-100 text-purple-700',
}

export default function AdminPendingApprovals() {
  const [students, setStudents]           = useState(INITIAL_STUDENTS)
  const [filterCourse, setFilterCourse]   = useState('All')
  const [search, setSearch]               = useState('')

  // Approve dialog state
  const [approveTarget, setApproveTarget] = useState(null)

  // Reject dialog state
  const [rejectTarget, setRejectTarget]   = useState(null)

  const courses = ['All', ...Array.from(new Set(INITIAL_STUDENTS.map(s => s.course)))]

  const filtered = students.filter(s => {
    const matchesCourse = filterCourse === 'All' || s.course === filterCourse
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      s.lastName.toLowerCase().includes(q) ||
      s.firstName.toLowerCase().includes(q) ||
      s.studentNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    return matchesCourse && matchesSearch
  })

  function handleApproveConfirm() {
    setStudents(prev => prev.filter(s => s.id !== approveTarget.id))
    setApproveTarget(null)
  }

  function handleRejectConfirm(reason) {
    console.log(`Rejected ${rejectTarget.studentNumber}: ${reason}`)
    setStudents(prev => prev.filter(s => s.id !== rejectTarget.id))
    setRejectTarget(null)
  }

  function getInitials(s) {
    return `${s.firstName.charAt(0)}${s.lastName.charAt(0)}`
  }

  const AVATAR_COLORS = [
    'bg-green-500', 'bg-blue-500', 'bg-purple-500',
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
  ]

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">COLLEGE OF COMPUTING STUDIES</h1>
        <p className="text-gray-600 mt-1">Review and manage student registration requests for your college.</p>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Table header / filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Pending Registrations</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {filtered.length} student{filtered.length !== 1 ? 's' : ''} awaiting approval
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 bg-gray-50 w-48"
              />
            </div>

            {/* Course filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {courses.map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCourse(c)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition focus:outline-none
                    ${filterCourse === c
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {c} {c !== 'All' ? `(${students.filter(s => s.course === c).length})` : `(${students.length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-14 h-14 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base font-semibold text-gray-500">
              {students.length === 0 ? 'All caught up!' : 'No results found'}
            </p>
            <p className="text-sm mt-1">
              {students.length === 0
                ? 'There are no pending student registrations at this time.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student No.</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Email Address</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">

                    {/* Student name + avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                          ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                          {getInitials(student)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{student.lastName}, {student.firstName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Student number */}
                    <td className="px-5 py-3.5 text-gray-600 font-medium whitespace-nowrap">
                      {student.studentNumber}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                      {student.email}
                    </td>

                    {/* Course badge */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${COURSE_COLORS[student.course] || 'bg-gray-100 text-gray-600'}`}>
                        {student.course}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setApproveTarget(student)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-100 rounded-lg focus:outline-none hover:bg-green-200 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectTarget(student)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-lg focus:outline-none hover:bg-red-200 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {filtered.length} of {students.length} pending registration{students.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Approve confirmation — uses existing Dialog from ui */}
      <Dialog
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={handleApproveConfirm}
        title="Approve Registration"
        message={approveTarget
          ? `Are you sure you want to approve the registration of ${approveTarget.firstName} ${approveTarget.lastName} (${approveTarget.studentNumber})?`
          : ''}
        confirmLabel="Approve"
        cancelLabel="Cancel"
      />

      {/* Reject dialog — custom new component */}
      <RejectRegistrationDialog
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleRejectConfirm}
        student={rejectTarget}
      />
    </AppLayout>
  )
}