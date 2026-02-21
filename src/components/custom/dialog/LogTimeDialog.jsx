import { useState, useEffect } from 'react'
import Dialog from '../../ui/Dialog'

const todayStr = new Date().toISOString().split('T')[0]

const MINUTES = ['00', '15', '30', '45']

// Shift hour ranges (24h, inclusive)
const SHIFT_HOURS = {
  morning:   [7, 8, 9, 10, 11, 12],          // 7 AM – 12 PM
  afternoon: [12, 13, 14, 15, 16, 17, 18, 19], // 12 PM – 7 PM
}

const emptyForm = {
  date: '',
  shift: '',
  inH: '', inM: '00',
  outH: '', outM: '00',
  description: '',
}

// Display a 24h hour as 12h label e.g. 13 → "1 PM"
function hourLabel(h24) {
  const h = parseInt(h24)
  const period = h >= 12 ? 'PM' : 'AM'
  let display = h % 12
  if (display === 0) display = 12
  return `${display}:00 ${period}`
}

// Build "HH:MM" 24h string from parts
function buildTime(h, m) {
  if (h === '' || m === '') return ''
  return `${String(parseInt(h)).padStart(2, '0')}:${m}`
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

function to24Parts(displayStr) {
  if (!displayStr) return { h: '', m: '00' }
  const match = displayStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) {
    // already HH:MM
    const [hh, mm] = displayStr.split(':')
    return { h: parseInt(hh).toString(), m: mm || '00' }
  }
  let h = parseInt(match[1])
  const m = match[2]
  const period = match[3].toUpperCase()
  if (period === 'AM' && h === 12) h = 0
  if (period === 'PM' && h !== 12) h += 12
  return { h: h.toString(), m }
}

function calcHours(timeIn, timeOut) {
  if (!timeIn || !timeOut) return 0
  const [h1, m1] = timeIn.split(':').map(Number)
  const [h2, m2] = timeOut.split(':').map(Number)
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1)
  return diff > 0 ? parseFloat((diff / 60).toFixed(2)) : 0
}

// Reusable time picker row: hour dropdown + colon + minute dropdown
function TimePicker({ label, hour, minute, onHourChange, onMinuteChange, hours, error, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex items-center gap-1">
        {/* Hour */}
        <select
          value={hour}
          onChange={e => onHourChange(e.target.value)}
          className={`flex-1 border rounded-lg px-2 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
            ${error ? 'border-red-400' : 'border-gray-200'}`}
        >
          <option value="">HH</option>
          {hours.map(h => (
            <option key={h} value={h}>{hourLabel(h)}</option>
          ))}
        </select>

        <span className="text-gray-400 font-bold text-sm">:</span>

        {/* Minute */}
        <select
          value={minute}
          onChange={e => onMinuteChange(e.target.value)}
          className={`w-20 border rounded-lg px-2 py-2 text-sm outline-none focus:border-green-400 transition bg-gray-50
            ${error ? 'border-red-400' : 'border-gray-200'}`}
        >
          {MINUTES.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* 12h preview */}
      {hour !== '' && (
        <p className="text-xs text-green-600 font-semibold mt-1">
          {to12Display(buildTime(hour, minute))}
        </p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function LogTimeDialog({ isOpen, onClose, onConfirm, editLog = null }) {
  const [form, setForm]               = useState(emptyForm)
  const [errors, setErrors]           = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isEditMode = !!editLog

  useEffect(() => {
    if (isOpen) {
      if (editLog) {
        const inParts  = to24Parts(editLog.timeIn)
        const outParts = to24Parts(editLog.timeOut)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          date:        editLog.date,
          shift:       editLog.shift || '',
          inH:         inParts.h,
          inM:         inParts.m,
          outH:        outParts.h,
          outM:        outParts.m,
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

  function handleShiftChange(shift) {
    // Reset times when shift changes
    setForm(prev => ({ ...prev, shift, inH: '', inM: '00', outH: '', outM: '00' }))
    setErrors(prev => ({ ...prev, shift: '', timeIn: '', timeOut: '' }))
  }

  function validate() {
    const e = {}
    if (!form.date)               e.date        = 'Please select a date.'
    if (!form.shift)              e.shift       = 'Please select a shift.'
    if (form.inH === '')          e.timeIn      = 'Please select a time in.'
    if (form.outH === '')         e.timeOut     = 'Please select a time out.'
    if (!form.description.trim()) e.description = 'Short description is required.'
    const timeIn  = buildTime(form.inH, form.inM)
    const timeOut = buildTime(form.outH, form.outM)
    const hours   = calcHours(timeIn, timeOut)
    if (form.inH !== '' && form.outH !== '' && hours <= 0)
      e.timeOut = 'Time Out must be after Time In.'
    return e
  }

  function handleConfirmClick() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setConfirmOpen(true)
  }

  function handleFinalConfirm() {
    const timeIn  = buildTime(form.inH, form.inM)
    const timeOut = buildTime(form.outH, form.outM)
    const hours   = calcHours(timeIn, timeOut)
    onConfirm({
      id:          isEditMode ? editLog.id : Date.now(),
      date:        form.date,
      shift:       form.shift,
      timeIn:      to12Display(timeIn),
      timeOut:     to12Display(timeOut),
      hours,
      description: form.description.trim(),
      status:      isEditMode ? editLog.status : 'pending',
    })
    setConfirmOpen(false)
    setForm(emptyForm)
    setErrors({})
    onClose()
  }

  const shiftHours   = form.shift ? SHIFT_HOURS[form.shift] : []
  const previewHours = calcHours(buildTime(form.inH, form.inM), buildTime(form.outH, form.outM))

  if (!isOpen) return null

  return (
    <>
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

            {/* Shift */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                Shift <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleShiftChange('morning')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition focus:outline-none
                    ${form.shift === 'morning'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                      : errors.shift ? 'border-red-300 bg-red-50 text-gray-500'
                      : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                  </svg>
                  <div className="text-left">
                    <p className="leading-none">Morning</p>
                    <p className="text-xs font-normal opacity-70 mt-0.5">7:00 AM – 12:00 PM</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftChange('afternoon')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition focus:outline-none
                    ${form.shift === 'afternoon'
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : errors.shift ? 'border-red-300 bg-red-50 text-gray-500'
                      : 'border-gray-200 bg-gray-50 text-gray-500'}`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <div className="text-left">
                    <p className="leading-none">Afternoon</p>
                    <p className="text-xs font-normal opacity-70 mt-0.5">12:00 PM – 7:00 PM</p>
                  </div>
                </button>
              </div>
              {errors.shift && <p className="text-xs text-red-500 mt-1">{errors.shift}</p>}
            </div>

            {/* Time In & Time Out — dropdowns */}
            {form.shift ? (
              <div className="grid grid-cols-2 gap-4">
                <TimePicker
                  label="Time In"
                  required
                  hour={form.inH}
                  minute={form.inM}
                  hours={shiftHours}
                  onHourChange={v => setField('inH', v)}
                  onMinuteChange={v => setField('inM', v)}
                  error={errors.timeIn}
                />
                <TimePicker
                  label="Time Out"
                  required
                  hour={form.outH}
                  minute={form.outM}
                  hours={shiftHours}
                  onHourChange={v => setField('outH', v)}
                  onMinuteChange={v => setField('outM', v)}
                  error={errors.timeOut}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-2">
                Select a shift above to set your time in and time out.
              </p>
            )}

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

      {/* Confirmation dialog */}
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