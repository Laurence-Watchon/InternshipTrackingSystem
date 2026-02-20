import { useEffect } from 'react'

/**
 * Dialog — reusable confirmation modal
 *
 * Props:
 *   isOpen       – boolean
 *   onClose      – () => void   (No / Cancel)
 *   onConfirm    – () => void   (Yes / Confirm)
 *   title        – string
 *   message      – string       (default: 'Are you sure you want to submit this?')
 *   confirmLabel – string       (default: 'Yes')
 *   cancelLabel  – string       (default: 'No')
 */
export default function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure you want to submit this?',
  confirmLabel = 'Yes',
  cancelLabel = 'No',
}) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>

        {/* Footer buttons */}
        <div className="px-6 pb-6 pt-3 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg focus:outline-none"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-green-500 rounded-lg focus:outline-none"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}