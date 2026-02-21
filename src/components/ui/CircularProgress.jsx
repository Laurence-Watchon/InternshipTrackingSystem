/**
 * CircularProgress
 *
 * Props:
 *   completed – number (approved hours)
 *   required  – number (default 500)
 */
export default function CircularProgress({ completed = 0, required = 500 }) {
  const percentage   = Math.min(100, Math.round((completed / required) * 100))
  const remaining    = Math.max(0, required - completed)
  const r            = 56
  const circumference = 2 * Math.PI * r
  const offset       = circumference * (1 - percentage / 100)

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>

      {/* Circle */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background ring */}
            <circle
              cx="64" cy="64" r={r}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress ring */}
            <circle
              cx="64" cy="64" r={r}
              stroke="white"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="opacity-90">Completed:</span>
          <span className="font-semibold">{completed}h</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Remaining:</span>
          <span className="font-semibold">{remaining}h</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-90">Target:</span>
          <span className="font-semibold">{required}h</span>
        </div>
      </div>
    </div>
  )
}