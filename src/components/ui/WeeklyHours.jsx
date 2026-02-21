/**
 * WeeklyHours
 *
 * Props:
 *   weeklyData – array of { week: string, hours: number }
 *   target     – number (default 40)
 */

const DEFAULT_DATA = [
  { week: 'Week 1',  hours: 0 },
  { week: 'Week 2',  hours: 0 },
  { week: 'Week 3',  hours: 0 },
  { week: 'Week 4',  hours: 0 },
  { week: 'Week 5',  hours: 0 },
]

export default function WeeklyHours({ weeklyData = DEFAULT_DATA, target = 40 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Hours</h3>
      </div>

      {/* Horizontal bar rows */}
      <div className="space-y-4">
        {weeklyData.map((week, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{week.week}</span>
              <span className="text-sm font-bold text-gray-900">{week.hours}h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((week.hours / target) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-gray-600">Logged Hours</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-200 rounded border border-gray-300" />
            <span className="text-gray-600">Target: {target}h/week</span>
          </div>
        </div>
      </div>
    </div>
  )
}