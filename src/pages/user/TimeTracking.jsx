import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import Card from '../../components/ui/Card'
import TimeTable from '../../components/ui/TimeTable'
import Toast from '../../components/ui/Toast'
import LogTimeDialog from '../../components/custom/dialog/LogTimeDialog'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'

const DEFAULT_REQUIRED_HOURS = 500

const collegeMapping = {
  'CAS': 'COLLEGE OF ARTS AND SCIENCES',
  'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
  'CCS': 'COLLEGE OF COMPUTING STUDIES',
  'COE': 'COLLEGE OF ENGINEERING',
  'COED': 'COLLEGE OF EDUCATION'
}

function sortLogs(logs) {
  return [...logs].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date)
    if (a.shift === 'morning' && b.shift === 'afternoon') return 1
    if (a.shift === 'afternoon' && b.shift === 'morning') return -1
    return 0
  })
}

export default function UserTimeTracking() {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editLog, setEditLog] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [requiredHours, setRequiredHours] = useState(DEFAULT_REQUIRED_HOURS)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        const [logsRes, settingsRes] = await Promise.all([
          fetch(`http://localhost:3001/api/student/time-logs?studentId=${user.id}`),
          fetch(`http://localhost:3001/api/student/college-settings?college=${encodeURIComponent(user.college)}`),
          new Promise(resolve => setTimeout(resolve, 800)) // Min loading time for smoother transition
        ])

        if (logsRes.ok) {
          const fetchedLogs = await logsRes.json()
          // Map _id to id for component compatibility
          setLogs(sortLogs(fetchedLogs.map(l => ({ ...l, id: l._id }))))
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          const courseHours = (settings.requiredHours && settings.requiredHours[user.course]) || DEFAULT_REQUIRED_HOURS
          setRequiredHours(courseHours)
        }
      } catch (error) {
        console.error("Error fetching time tracking data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const totalLoggedHours = logs.reduce((s, l) => s + (l.hours || 0), 0)
  const remaining = Math.max(0, requiredHours - totalLoggedHours)

  const daysOnDuty = new Set(
    logs.map(l => l.date)
  ).size

  // ── Add new log
  async function handleAddLog(entry) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/time-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, studentId: user.id })
      })

      if (response.ok) {
        const newLog = await response.json()
        setLogs(prev => sortLogs([{ ...newLog, id: newLog._id }, ...prev]))
        setCurrentPage(1)
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding log:", error)
      return false
    }
  }

  // ── Save edited log
  async function handleSaveEdit(updatedEntry) {
    try {
      const response = await fetch(`http://localhost:3001/api/student/time-logs/${updatedEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
      })

      if (response.ok) {
        setLogs(prev => sortLogs(prev.map(l => l.id === updatedEntry.id ? updatedEntry : l)))
        return true
      }
      return false
    } catch (error) {
      console.error("Error updating log:", error)
      return false
    }
  }

  // ── Delete log
  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:3001/api/student/time-logs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setLogs(prev => prev.filter(l => l.id !== id))
        setToast({ message: 'Time log successfully deleted!', type: 'success' })
      } else {
        setToast({ message: 'Failed to delete time log. Please try again.', type: 'error' })
      }
    } catch (error) {
      console.error("Error deleting log:", error)
      setToast({ message: 'An error occurred while deleting the log.', type: 'error' })
    }
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
  async function handleConfirm(entry) {
    if (editLog) {
      return await handleSaveEdit(entry)
    } else {
      return await handleAddLog(entry)
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {collegeMapping[user?.college] || user?.college || 'College'}
        </h1>
        <p className="text-gray-600 mt-1">Log and monitor your internship hours.</p>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-32 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1">
                  <Skeleton variant="text" width="60%" className="mb-2" />
                  <Skeleton variant="text" width="40%" height={32} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <Card
              title="Total Hours Completed"
              value={`${totalLoggedHours} hrs`}
              sub={`Progress towards ${requiredHours} required hours`}
              color="bg-green-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <Card
              title="Hours Left"
              value={`${remaining} hrs`}
              sub={`out of ${requiredHours} required hours`}
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
              sub="total logged duty days"
              color="bg-purple-500"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-2">
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="text" width={250} />
              </div>
              <Skeleton variant="rectangular" width={120} height={40} className="rounded-lg" />
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton variant="rectangular" width="100%" height={40} className="rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Add / Edit dialog */}
      <LogTimeDialog
        isOpen={dialogOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        editLog={editLog}
        existingLogs={logs}
        onSuccessAction={(msg) => setToast({ message: msg, type: 'success' })}
      />

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