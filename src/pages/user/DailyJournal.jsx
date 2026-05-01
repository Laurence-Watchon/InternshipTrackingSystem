import { apiFetch } from '../../config/api.js';
import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import JournalEntry from '../../components/ui/JournalEntry'
import Dialog from '../../components/ui/Dialog'
import Toast from '../../components/ui/Toast'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'

const todayStr = new Date().toISOString().split('T')[0]

const MOODS = [
  { value: 'great', emoji: '🤩', label: 'Great' },
  { value: 'good', emoji: '😊', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'difficult', emoji: '😰', label: 'Difficult' },
  { value: 'tough', emoji: '😫', label: 'Tough' },
]

const collegeMapping = {
  'CAS': 'COLLEGE OF ARTS AND SCIENCES',
  'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
  'CCS': 'COLLEGE OF COMPUTING STUDIES',
  'COE': 'COLLEGE OF ENGINEERING',
  'COED': 'COLLEGE OF EDUCATION'
}


const emptyForm = {
  date: todayStr,
  hours: '',
  mood: '',
  tasksDone: '',
  learnings: '',
  challenges: '',
}

const scrollbarStyle = `
  .journal-scroll::-webkit-scrollbar { width: 4px; }
  .journal-scroll::-webkit-scrollbar-track { background: transparent; }
  .journal-scroll::-webkit-scrollbar-thumb { background-color: #d8b4fe; border-radius: 999px; }
  .journal-scroll::-webkit-scrollbar-thumb:hover { background-color: #a855f7; }
  .journal-scroll { scrollbar-width: thin; scrollbar-color: #d8b4fe transparent; }
`

export default function UserJournal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('list')
  const [openEntryId, setOpenEntryId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const fetchJournals = async () => {
      if (!user?.id) return
      try {
        const [response] = await Promise.all([
          apiFetch(`/api/student/journals?studentId=${user.id}`),
          new Promise(resolve => setTimeout(resolve, 800)) // Min loading time
        ])
        if (response.ok) {
          const data = await response.json()
          setEntries(data.map(e => ({ ...e, id: e._id })))
        }
      } catch (error) {
        console.error("Error fetching journals:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJournals()
  }, [user])

  // Accordion: close if same, else open new and scroll to it
  function handleToggle(id) {
    const opening = openEntryId !== id
    setOpenEntryId(opening ? id : null)
    if (opening) {
      setTimeout(() => {
        document.getElementById(`entry-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.date) e.date = 'Please select a date.'

    // Check for duplicate date (only if NOT editing or if date changed)
    const isDuplicate = entries.some(entry =>
      entry.date === form.date && (!editingEntry || entry.id !== editingEntry.id)
    )
    if (isDuplicate) {
      e.date = 'A journal entry for this date already exists.'
    }

    if (!form.hours || isNaN(form.hours) || parseFloat(form.hours) <= 0)
      e.hours = 'Please enter valid hours.'
    if (parseFloat(form.hours) > 12) e.hours = 'Hours cannot exceed 12.'
    if (!form.mood) e.mood = 'Please select your mood.'
    if (!form.tasksDone.trim()) e.tasksDone = 'Please describe tasks done.'
    if (!form.learnings.trim()) e.learnings = 'Please describe your learnings.'
    if (!form.challenges.trim()) e.challenges = 'Please describe your challenges.'
    return e
  }

  function handleSubmitClick() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    // Dirty check for Edit Mode
    if (editingEntry) {
      const hasChanges =
        form.date !== editingEntry.date ||
        parseFloat(form.hours) !== editingEntry.hours ||
        form.mood !== editingEntry.mood ||
        form.tasksDone.trim() !== editingEntry.tasksDone ||
        form.learnings.trim() !== editingEntry.learnings ||
        form.challenges.trim() !== editingEntry.challenges

      if (!hasChanges) {
        setToast({ message: "No changes were made to this journal entry.", type: 'info' })
        return
      }
    }

    setErrors({})
    setConfirmOpen(true)
  }

  async function handleFinalConfirm() {
    setConfirmOpen(false) // Close modal immediately
    setIsSubmitting(true)

    const minDelay = new Promise(resolve => setTimeout(resolve, 1000))

    const entryData = {
      studentId: user.id,
      date: form.date,
      hours: parseFloat(form.hours),
      mood: form.mood,
      tasksDone: form.tasksDone.trim(),
      learnings: form.learnings.trim(),
      challenges: form.challenges.trim(),
    }

    try {
      if (editingEntry) {
        // EDIT MODE
        const [response] = await Promise.all([
          apiFetch(`/api/student/journals/${editingEntry.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entryData)
          }),
          minDelay
        ])

        if (response.ok) {
          const updated = { ...entryData, id: editingEntry.id }
          setEntries(prev => prev.map(e => e.id === updated.id ? updated : e).sort((a, b) => b.date.localeCompare(a.date)))
          setForm(emptyForm)
          setEditingEntry(null)
          setActiveTab('list')
          setToast({ message: 'Journal entry updated successfully!', type: 'success' })
        } else {
          setToast({ message: 'Failed to update journal entry.', type: 'error' })
        }
      } else {
        // ADD MODE
        const [response] = await Promise.all([
          apiFetch(`/api/student/journals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entryData)
          }),
          minDelay
        ])

        if (response.ok) {
          const savedEntry = await response.json()
          setEntries(prev => [{ ...savedEntry, id: savedEntry._id }, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
          setForm(emptyForm)
          setActiveTab('list')
          setOpenEntryId(savedEntry._id)
          setToast({ message: 'Journal entry submitted successfully!', type: 'success' })
        } else {
          setToast({ message: 'Failed to submit journal entry.', type: 'error' })
        }
      }
    } catch (error) {
      console.error("Error saving journal:", error)
      setToast({ message: 'An error occurred during submission.', type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Action handlers ──
  function handleEdit(entry) {
    setEditingEntry(entry)
    setForm({
      date: entry.date,
      hours: entry.hours.toString(),
      mood: entry.mood,
      tasksDone: entry.tasksDone,
      learnings: entry.learnings,
      challenges: entry.challenges,
    })
    setErrors({})
    setActiveTab('new')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDeleteClick(id) {
    setDeletingId(id)
    setDeleteConfirmOpen(true)
  }

  async function handleFinalDelete() {
    setIsDeleting(true)
    const minDelay = new Promise(resolve => setTimeout(resolve, 1000))

    try {
      const [response] = await Promise.all([
        apiFetch(`/api/student/journals/${deletingId}`, { method: 'DELETE' }),
        minDelay
      ])

      if (response.ok) {
        setEntries(prev => prev.filter(e => e.id !== deletingId))
        setToast({ message: 'Journal entry deleted successfully!', type: 'success' })
      } else {
        setToast({ message: 'Failed to delete journal entry.', type: 'error' })
      }
    } catch (error) {
      console.error("Error deleting journal:", error)
      setToast({ message: 'An error occurred while deleting.', type: 'error' })
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setDeletingId(null)
    }
  }


  return (
    <AppLayout>
      <style>{scrollbarStyle}</style>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {collegeMapping[user?.college] || user?.college || 'College'}
        </h1>
        <p className="text-gray-600 mt-1">Document your internship journey day by day.</p>
      </div>

      {/* Tab panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* Tab bar */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition focus:outline-none
              ${activeTab === 'list'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Journal Entries
            <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {entries.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('new'); setForm(emptyForm); setErrors({}); setEditingEntry(null) }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition focus:outline-none
              ${activeTab === 'new'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {editingEntry ? 'Edit Entry' : 'New Entry'}
          </button>
        </div>

        {/* ── Journal Entries tab ── */}
        {activeTab === 'list' && (
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton variant="circular" width={48} height={48} />
                      <div className="flex-1">
                        <Skeleton variant="text" width="40%" height={24} className="mb-1" />
                        <Skeleton variant="text" width="20%" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton variant="text" width="90%" />
                      <Skeleton variant="text" width="85%" />
                    </div>
                  </div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm font-medium">No journal entries yet</p>
                <p className="text-xs mt-1">Click "New Entry" to write your first journal.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map(entry => (
                  <div key={entry.id} id={`entry-${entry.id}`}>
                    <JournalEntry
                      entry={entry}
                      isOpen={openEntryId === entry.id}
                      onToggle={() => handleToggle(entry.id)}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── New Entry tab ── */}
        {activeTab === 'new' && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto space-y-5">

              {/* Date + Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    max={todayStr}
                    value={form.date}
                    onChange={e => setField('date', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                      ${errors.date ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Hours Rendered <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.5"
                    placeholder="e.g. 8"
                    value={form.hours}
                    onChange={e => setField('hours', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                      ${errors.hours ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.hours && <p className="text-xs text-red-500 mt-1">{errors.hours}</p>}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Mood <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map(m => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setField('mood', m.value)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition focus:outline-none
                        ${form.mood === m.value
                          ? 'border-green-400 bg-green-50 text-green-700'
                          : errors.mood
                            ? 'border-red-300 bg-red-50 text-gray-500'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-green-300'}`}
                    >
                      <span className="text-base">{m.emoji}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
                {errors.mood && <p className="text-xs text-red-500 mt-1">{errors.mood}</p>}
              </div>

              {/* Tasks Done */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Tasks Done <span className="text-red-400">*</span>
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="What tasks did you accomplish today?"
                  value={form.tasksDone}
                  onChange={e => setField('tasksDone', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50 resize-none
                    ${errors.tasksDone ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.tasksDone && <p className="text-xs text-red-500 mt-1">{errors.tasksDone}</p>}
              </div>

              {/* Learnings */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    Learnings <span className="text-red-400">*</span>
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="What did you learn today?"
                  value={form.learnings}
                  onChange={e => setField('learnings', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50 resize-none
                    ${errors.learnings ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.learnings && <p className="text-xs text-red-500 mt-1">{errors.learnings}</p>}
              </div>

              {/* Challenges */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    Challenges <span className="text-red-400">*</span>
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="What challenges did you face today?"
                  value={form.challenges}
                  onChange={e => setField('challenges', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50 resize-none
                    ${errors.challenges ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.challenges && <p className="text-xs text-red-500 mt-1">{errors.challenges}</p>}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSubmitClick}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-lg focus:outline-none transition-all
                    ${isSubmitting ? 'opacity-80 cursor-not-allowed min-w-[160px]' : 'hover:bg-green-600'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>{editingEntry ? 'Updating...' : 'Submitting...'}</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {editingEntry ? 'Update Journal' : 'Submit Journal'}
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      <Dialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleFinalConfirm}
        isLoading={isSubmitting}
        title={editingEntry ? "Update Journal Entry" : "Submit Journal Entry"}
        message={editingEntry ? "Are you sure you want to update this journal entry?" : "Are you sure you want to submit this journal entry?"}
        confirmLabel={editingEntry ? "Yes, Update" : "Yes, Submit"}
        cancelLabel="Cancel"
      />

      {/* Delete Confirmation dialog */}
      <Dialog
        isOpen={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setDeletingId(null); }}
        onConfirm={handleFinalDelete}
        isLoading={isDeleting}
        loadingLabel="Deleting..."
        variant="danger"
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
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