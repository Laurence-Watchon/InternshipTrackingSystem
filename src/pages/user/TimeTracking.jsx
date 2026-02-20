import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import Card from '../../components/ui/Card'
import TimeTable from '../../components/ui/TimeTable'
import LogTimeDialog from '../../components/custom/dialog/LogTimeDialog'

const REQUIRED_HOURS = 500

const INITIAL_LOGS = [
  { id: 1,  date: '2026-02-20', timeIn: '8:00 AM',  timeOut: '12:00 PM', hours: 4,   shift: 'morning',   description: 'Frontend development',       status: 'approved' },
  { id: 2,  date: '2026-02-20', timeIn: '1:00 PM',  timeOut: '5:00 PM',  hours: 4,   shift: 'afternoon', description: 'API integration testing',     status: 'approved' },
  { id: 3,  date: '2026-02-19', timeIn: '8:30 AM',  timeOut: '12:00 PM', hours: 3.5, shift: 'morning',   description: 'Stand-up and code review',    status: 'approved' },
  { id: 4,  date: '2026-02-19', timeIn: '1:00 PM',  timeOut: '5:30 PM',  hours: 4.5, shift: 'afternoon', description: 'Backend API development',      status: 'pending'  },
  { id: 5,  date: '2026-02-18', timeIn: '8:00 AM',  timeOut: '12:00 PM', hours: 4,   shift: 'morning',   description: 'UI/UX design review',         status: 'approved' },
  { id: 6,  date: '2026-02-18', timeIn: '1:00 PM',  timeOut: '5:00 PM',  hours: 4,   shift: 'afternoon', description: 'Database schema planning',     status: 'approved' },
  { id: 7,  date: '2026-02-17', timeIn: '8:00 AM',  timeOut: '12:00 PM', hours: 4,   shift: 'morning',   description: 'Team sprint planning',        status: 'rejected' },
  { id: 8,  date: '2026-02-14', timeIn: '1:00 PM',  timeOut: '5:00 PM',  hours: 4,   shift: 'afternoon', description: 'Feature implementation',       status: 'approved' },
  { id: 9,  date: '2026-02-13', timeIn: '8:00 AM',  timeOut: '12:00 PM', hours: 4,   shift: 'morning',   description: 'Bug fixing and QA',           status: 'approved' },
  { id: 10, date: '2026-02-13', timeIn: '1:00 PM',  timeOut: '5:00 PM',  hours: 4,   shift: 'afternoon', description: 'Documentation update',         status: 'approved' },
  { id: 11, date: '2026-02-12', timeIn: '8:00 AM',  timeOut: '12:00 PM', hours: 4,   shift: 'morning',   description: 'Code refactoring',            status: 'approved' },
  { id: 12, date: '2026-02-11', timeIn: '1:00 PM',  timeOut: '5:00 PM',  hours: 4,   shift: 'afternoon', description: 'User testing session',         status: 'approved' },
]

function sortLogs(logs) {
  return [...logs].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    if (a.shift === 'morning' && b.shift === 'afternoon') return 1
    if (a.shift === 'afternoon' && b.shift === 'morning') return -1
    return 0
  })
}

export default function UserTimeTracking() {
  const [logs, setLogs]               = useState(sortLogs(INITIAL_LOGS))
  const [dialogOpen, setDialogOpen]   = useState(false)
  const [editLog, setEditLog]         = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const approvedHours = logs
    .filter(l => l.status === 'approved')
    .reduce((s, l) => s + l.hours, 0)

  const remaining = Math.max(0, REQUIRED_HOURS - approvedHours)

  const daysOnDuty = new Set(
    logs.filter(l => l.status === 'approved').map(l => l.date)
  ).size

  // ── Add new log
  function handleAddLog(entry) {
    setLogs(prev => sortLogs([entry, ...prev]))
    setCurrentPage(1)
  }

  // ── Save edited log
  function handleSaveEdit(updatedEntry) {
    setLogs(prev => sortLogs(prev.map(l => l.id === updatedEntry.id ? updatedEntry : l)))
  }

  // ── Delete log
  function handleDelete(id) {
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  // ── Open edit dialog
  function handleEdit(log) {
    setEditLog(log)
    setDialogOpen(true)
  }

  // ── Close dialog (add or edit)
  function handleClose() {
    setDialogOpen(false)
    setEditLog(null)
  }

  // ── Confirm (add or edit)
  function handleConfirm(entry) {
    if (editLog) {
      handleSaveEdit(entry)
    } else {
      handleAddLog(entry)
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">College of Computing Studies- BSCS-DS</h1>
        <p className="text-gray-600 mt-1">Log and monitor your internship hours.</p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card
          title="Total Hours Completed"
          value={`${approvedHours} hrs`}
          sub={`out of ${REQUIRED_HOURS} required hours`}
          color="bg-green-500"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <Card
          title="Remaining Hours"
          value={`${remaining} hrs`}
          sub="hours still needed"
          color="bg-blue-500"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <Card
          title="Total Days on Duty"
          value={`${daysOnDuty} days`}
          sub="unique approved duty days"
          color="bg-purple-500"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Time Logs</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your submitted time entries, latest to oldest</p>
          </div>
          <button
            onClick={() => { setEditLog(null); setDialogOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg focus:outline-none self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Log Time
          </button>
        </div>

        <TimeTable
          logs={logs}
          pageSize={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add / Edit dialog */}
      <LogTimeDialog
        isOpen={dialogOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        editLog={editLog}
      />
    </AppLayout>
  )
}