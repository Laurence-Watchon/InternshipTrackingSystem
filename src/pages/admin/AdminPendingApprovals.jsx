import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import Dialog from '../../components/ui/Dialog'
import RejectRegistrationDialog from '../../components/custom/dialog/RejectRegistrationDialog'

const COURSE_COLORS = {
  // CAS
  'BAComm': 'bg-emerald-100 text-emerald-700',
  'BA-Psych': 'bg-lime-100 text-lime-700',
  'BS-Psych': 'bg-teal-100 text-teal-700',

  // CBAA
  'BSA': 'bg-yellow-100 text-yellow-700',
  'BSAIS': 'bg-amber-100 text-amber-700',
  'BSEntrep': 'bg-orange-100 text-orange-700',
  'BSTM': 'bg-cyan-100 text-cyan-700',

  // CCS
  'BSCS-DS': 'bg-blue-100 text-blue-700',
  'BSIT-BA': 'bg-purple-100 text-purple-700',
  'BSIT-SD': 'bg-green-100 text-green-700',

  // COE
  'BSME': 'bg-rose-100 text-rose-700',

  // COED
  'BEED': 'bg-indigo-100 text-indigo-700',
  'BPEd': 'bg-pink-100 text-pink-700',
  'BSED-English': 'bg-violet-100 text-violet-700',
  'BSED-Math': 'bg-fuchsia-100 text-fuchsia-700',
  'BSED-Science': 'bg-sky-100 text-sky-700'
}

export default function AdminPendingApprovals() {
  const [students, setStudents] = useState([])
  const [filterCourse, setFilterCourse] = useState('All')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Approve dialog state
  const [approveTarget, setApproveTarget] = useState(null)

  // Reject dialog state
  const [rejectTarget, setRejectTarget] = useState(null)

  useEffect(() => {
    fetchPendingStudents()
  }, [])

  const fetchPendingStudents = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("http://localhost:3001/api/admin/pending")
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      } else {
        console.error("Failed to fetch pending students")
      }
    } catch (err) {
      console.error("Error fetching students:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const courses = ['All', ...Array.from(new Set(students.map(s => s.course)))]

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

  async function handleApproveConfirm() {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/approve/${approveTarget._id}`, {
        method: 'PUT'
      })
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== approveTarget._id))
        setApproveTarget(null)
      } else {
        const errData = await res.json()
        console.error("Failed to approve:", errData.error)
      }
    } catch (err) {
      console.error("Error approving student:", err)
    }
  }

  async function handleRejectConfirm(reason) {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/reject/${rejectTarget._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })
      if (res.ok) {
        console.log(`Softly Rejected ${rejectTarget.studentNumber}: ${reason}`)
        setStudents(prev => prev.filter(s => s._id !== rejectTarget._id))
        setRejectTarget(null)
      } else {
        const errData = await res.json()
        console.error("Failed to reject:", errData.error)
      }
    } catch (err) {
      console.error("Error rejecting student:", err)
    }
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-10 h-10 mb-4 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-base font-semibold text-gray-500">Loading pending registrations...</p>
          </div>
        ) : filtered.length === 0 ? (
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
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">

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
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap
                        ${COURSE_COLORS[student.course] || 'bg-gray-100 text-gray-700'}`}>
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