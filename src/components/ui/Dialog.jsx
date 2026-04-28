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
  isLoading = false,
  loadingLabel = 'Processing...',
  variant = 'primary' // 'primary' (green) or 'danger' (red)
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || isLoading) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose, isLoading])

  if (!isOpen) return null

  const confirmBtnClasses = variant === 'danger'
    ? (isLoading ? 'bg-red-600 opacity-80 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600')
    : (isLoading ? 'bg-green-600 opacity-80 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600')

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', pointerEvents: isLoading ? 'none' : 'auto' }}
      onClick={isLoading ? undefined : onClose}
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
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-medium rounded-lg focus:outline-none transition-colors ${isLoading
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            disabled={isLoading}
            className={`px-5 py-2 text-sm font-medium text-white rounded-lg focus:outline-none transition-all flex items-center justify-center min-w-[100px] ${confirmBtnClasses}`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{loadingLabel}</span>
              </div>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}