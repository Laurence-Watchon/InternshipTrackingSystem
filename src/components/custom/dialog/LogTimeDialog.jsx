import { useState, useEffect } from 'react'
import Dialog from '../../ui/Dialog'

const todayStr = new Date().toISOString().split('T')[0]

const emptyForm = {
  date: '',
  timeIn: '',
  timeOut: '',
  description: '',
}

function to12Display(timeStr) {
  if (!timeStr) return ''
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr)
  const m = mStr
  const period = h >= 12 ? 'PM' : 'AM'
  if (h === 0) h = 12
  else if (h > 12) h -= 12
  return `${String(h).padStart(2, '0')}:${m} ${period}`
}

// Converts "08:30 AM" / "01:00 PM" back to "HH:MM" 24h for the input
function to24Input(displayStr) {
  if (!displayStr) return ''
  const match = displayStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return displayStr // already HH:MM
  let h = parseInt(match[1])
  const m = match[2]
  const period = match[3].toUpperCase()
  if (period === 'AM' && h === 12) h = 0
  if (period === 'PM' && h !== 12) h += 12
  return `${String(h).padStart(2, '0')}:${m}`
}

function calcHours(timeIn, timeOut) {
  if (!timeIn || !timeOut) return 0
  const [h1, m1] = timeIn.split(':').map(Number)
  const [h2, m2] = timeOut.split(':').map(Number)
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1)
  return diff > 0 ? parseFloat((diff / 60).toFixed(2)) : 0
}

function detectShift(timeIn) {
  if (!timeIn) return 'morning'
  const h = parseInt(timeIn.split(':')[0])
  return h < 12 ? 'morning' : 'afternoon'
}

/**
 * LogTimeDialog
 *
 * Props:
 *   isOpen    – boolean
 *   onClose   – () => void
 *   onConfirm – (logEntry) => void
 *   editLog   – log object | null  — when provided, dialog is in edit mode
 */
export default function LogTimeDialog({ isOpen, onClose, onConfirm, editLog = null }) {
  const [form, setForm]               = useState(emptyForm)
  const [errors, setErrors]           = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isEditMode = !!editLog

  useEffect(() => {
    if (isOpen) {
      if (editLog) {
        // Pre-fill form with existing log values
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          date:        editLog.date,
          timeIn:      to24Input(editLog.timeIn),
          timeOut:     to24Input(editLog.timeOut),
          description: editLog.description === '—' ? '' : editLog.description,
        })
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(emptyForm)
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrors({})
    }
  }, [isOpen, editLog])

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.date)               e.date        = 'Please select a date.'
    if (!form.timeIn)             e.timeIn      = 'Please select a time in.'
    if (!form.timeOut)            e.timeOut     = 'Please select a time out.'
    if (!form.description.trim()) e.description = 'Short description is required.'
    const hours = calcHours(form.timeIn, form.timeOut)
    if (form.timeIn && form.timeOut && hours <= 0) e.timeOut = 'Time Out must be after Time In.'
    if (form.timeIn && form.timeOut && hours > 12) e.timeOut = 'Cannot log more than 12 hours per entry.'
    return e
  }

  function handleConfirmClick() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setConfirmOpen(true)
  }

  function handleFinalConfirm() {
    const hours = calcHours(form.timeIn, form.timeOut)
    const shift = detectShift(form.timeIn)
    onConfirm({
      // Keep original id if editing, generate new one if adding
      id:          isEditMode ? editLog.id : Date.now(),
      date:        form.date,
      timeIn:      to12Display(form.timeIn),
      timeOut:     to12Display(form.timeOut),
      hours,
      shift,
      description: form.description.trim(),
      status:      isEditMode ? editLog.status : 'pending',
    })
    setConfirmOpen(false)
    setForm(emptyForm)
    setErrors({})
    onClose()
  }

  const previewHours = calcHours(form.timeIn, form.timeOut)

  if (!isOpen) return null

  return (
    <>
      {/* ── Main form — fades when confirmation dialog is open ── */}
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ backgroundColor: confirmOpen ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.4)' }}
        onClick={confirmOpen ? undefined : onClose}
      >
        <div
          className={`bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden transition-opacity duration-200
            ${confirmOpen ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isEditMode ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {isEditMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {isEditMode ? 'Edit Time Log' : 'Log Time'}
                </h2>
                <p className="text-xs text-gray-500">
                  {isEditMode ? 'Update your time entry details' : 'Fill in your time entry details'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 focus:outline-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Date */}
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

            {/* Time In & Time Out side by side */}
            <div className="grid grid-cols-2 gap-4">

              {/* Time In */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Time In <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={form.timeIn}
                  onChange={e => setField('timeIn', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                    ${errors.timeIn ? 'border-red-400' : 'border-gray-200'}`}
                />
                {form.timeIn && (
                  <p className="text-xs text-green-600 font-semibold mt-1">{to12Display(form.timeIn)}</p>
                )}
                {errors.timeIn && <p className="text-xs text-red-500 mt-1">{errors.timeIn}</p>}
              </div>

              {/* Time Out */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Time Out <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={form.timeOut}
                  onChange={e => setField('timeOut', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                    ${errors.timeOut ? 'border-red-400' : 'border-gray-200'}`}
                />
                {form.timeOut && (
                  <p className="text-xs text-green-600 font-semibold mt-1">{to12Display(form.timeOut)}</p>
                )}
                {errors.timeOut && <p className="text-xs text-red-500 mt-1">{errors.timeOut}</p>}
              </div>
            </div>

            {/* Computed hours preview */}
            {previewHours > 0 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700 font-semibold">
                  {previewHours} hour{previewHours !== 1 ? 's' : ''} computed
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Short Description <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="What did you work on?"
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
                  ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.description}
                </p>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmClick}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-lg focus:outline-none
                ${isEditMode ? 'bg-blue-500' : 'bg-green-500'}`}
            >
              {isEditMode ? 'Save Changes' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirmation dialog ── */}
      <Dialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleFinalConfirm}
        title={isEditMode ? 'Save Changes' : 'Submit Time Log'}
        message={isEditMode ? 'Are you sure you want to save these changes?' : 'Are you sure you want to submit this time entry?'}
        confirmLabel={isEditMode ? 'Yes, Save' : 'Yes, Submit'}
        cancelLabel="Cancel"
      />
    </>
  )
}