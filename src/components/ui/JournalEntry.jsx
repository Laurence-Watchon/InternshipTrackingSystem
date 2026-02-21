/**
 * JournalEntry
 *
 * Props:
 *   entry      – { id, date, hours, mood, tasksDone, learnings, challenges }
 *   isOpen     – boolean
 *   onToggle   – () => void
 */

const MOOD_CONFIG = {
  great:     { emoji: '😄', label: 'Great',     color: 'bg-green-100 text-green-700'  },
  good:      { emoji: '🙂', label: 'Good',      color: 'bg-blue-100 text-blue-700'   },
  okay:      { emoji: '😐', label: 'Okay',      color: 'bg-yellow-100 text-yellow-700'},
  difficult: { emoji: '😓', label: 'Difficult', color: 'bg-orange-100 text-orange-700'},
  tough:     { emoji: '😔', label: 'Tough',     color: 'bg-red-100 text-red-700'     },
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export default function JournalEntry({ entry, isOpen, onToggle }) {
  const mood = MOOD_CONFIG[entry.mood] || MOOD_CONFIG.okay

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200
      ${isOpen ? 'border-green-300 shadow-md' : 'border-gray-200 shadow-sm hover:border-green-200'}`}>

      {/* Header — always visible, click to toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white text-left focus:outline-none"
      >
        <div className="flex items-center gap-4">
          {/* Date block */}
          <div className="flex-shrink-0 text-center w-12">
            <p className="text-xl font-bold text-blue-600 leading-none">
              {new Date(entry.date + 'T00:00:00').getDate()}
            </p>
            <p className="text-xs text-gray-400 font-medium uppercase mt-0.5">
              {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
            </p>
          </div>

          <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

          {/* Title row */}
          <div>
            <p className="text-sm font-semibold text-gray-900">{fmtDate(entry.date)}</p>
            <div className="flex items-center gap-3 mt-1">
              {/* Hours */}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {entry.hours} hrs
              </span>
              {/* Mood badge */}
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mood.color}`}>
                {mood.emoji} {mood.label}
              </span>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="px-5 pb-5 bg-white border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

            {/* Tasks Done */}
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-500 text-white p-1.5 rounded-lg">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-green-800 uppercase tracking-wide">Tasks Done</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{entry.tasksDone}</p>
            </div>

            {/* Learnings */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500 text-white p-1.5 rounded-lg">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Learnings</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{entry.learnings}</p>
            </div>

            {/* Challenges */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-500 text-white p-1.5 rounded-lg">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-orange-800 uppercase tracking-wide">Challenges</h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{entry.challenges}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}