import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import JournalEntry from '../../components/ui/JournalEntry'
import Dialog from '../../components/ui/Dialog'

const todayStr = new Date().toISOString().split('T')[0]

const MOODS = [
  { value: 'great',     emoji: '😄', label: 'Great'     },
  { value: 'good',      emoji: '🙂', label: 'Good'      },
  { value: 'okay',      emoji: '😐', label: 'Okay'      },
  { value: 'difficult', emoji: '😓', label: 'Difficult' },
  { value: 'tough',     emoji: '😔', label: 'Tough'     },
]

const INITIAL_ENTRIES = [
  {
    id: 1,
    date: '2026-02-19',
    hours: 8,
    mood: 'great',
    tasksDone:  'Completed the login API integration\nFixed UI bugs on the dashboard\nAttended sprint planning meeting',
    learnings:  'Learned how to use JWT tokens for authentication\nBetter understanding of REST API design patterns',
    challenges: 'Debugging CORS issues took longer than expected\nHad difficulty understanding the legacy codebase',
  },
  {
    id: 2,
    date: '2026-02-18',
    hours: 7.5,
    mood: 'good',
    tasksDone:  'Built the requirements upload component\nReviewed pull requests from teammates',
    learnings:  'Practiced React hooks more deeply\nLearned about file upload best practices',
    challenges: 'Managing state for file previews was tricky',
  },
  {
    id: 3,
    date: '2026-02-17',
    hours: 6,
    mood: 'okay',
    tasksDone:  'Set up project folder structure\nInstalled and configured dependencies',
    learnings:  'Learned Tailwind CSS utility classes\nUnderstood the project architecture',
    challenges: 'Initial setup took most of the day\nHad version conflicts with some packages',
  },
  {
    id: 4,
    date: '2026-02-14',
    hours: 8,
    mood: 'difficult',
    tasksDone:  'Worked on the time tracking feature\nWrote unit tests for the form validation',
    learnings:  'Deepened knowledge of form validation patterns\nLearned about test-driven development',
    challenges: 'Writing tests was new to me and took a lot of time\nSome edge cases were hard to anticipate',
  },
]

const emptyForm = {
  date:       todayStr,
  hours:      '',
  mood:       '',
  tasksDone:  '',
  learnings:  '',
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
  const [entries, setEntries]         = useState(INITIAL_ENTRIES)
  const [activeTab, setActiveTab]     = useState('list')
  const [openEntryId, setOpenEntryId] = useState(null)
  const [form, setForm]               = useState(emptyForm)
  const [errors, setErrors]           = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)

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
    if (!form.date)                                          e.date       = 'Please select a date.'
    if (!form.hours || isNaN(form.hours) || parseFloat(form.hours) <= 0)
                                                             e.hours      = 'Please enter valid hours.'
    if (parseFloat(form.hours) > 12)                        e.hours      = 'Hours cannot exceed 12.'
    if (!form.mood)                                          e.mood       = 'Please select your mood.'
    if (!form.tasksDone.trim())                              e.tasksDone  = 'Please describe tasks done.'
    if (!form.learnings.trim())                              e.learnings  = 'Please describe your learnings.'
    if (!form.challenges.trim())                             e.challenges = 'Please describe your challenges.'
    return e
  }

  function handleSubmitClick() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setConfirmOpen(true)
  }

  function handleFinalConfirm() {
    const newEntry = {
      id:         Date.now(),
      date:       form.date,
      hours:      parseFloat(form.hours),
      mood:       form.mood,
      tasksDone:  form.tasksDone.trim(),
      learnings:  form.learnings.trim(),
      challenges: form.challenges.trim(),
    }
    setEntries(prev => [newEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
    setForm(emptyForm)
    setErrors({})
    setConfirmOpen(false)
    setActiveTab('list')
    setOpenEntryId(newEntry.id)
  }


  return (
    <AppLayout>
      <style>{scrollbarStyle}</style>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">College of Computing Studies- BSCS-DS</h1>
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
            onClick={() => { setActiveTab('new'); setForm(emptyForm); setErrors({}) }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition focus:outline-none
              ${activeTab === 'new'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Entry
          </button>
        </div>

        {/* ── Journal Entries tab ── */}
        {activeTab === 'list' && (
          <div className="p-6">
            {entries.length === 0 ? (
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
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-lg focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Submit Journal
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
        title="Submit Journal Entry"
        message="Are you sure you want to submit this journal entry?"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </AppLayout>
  )
}