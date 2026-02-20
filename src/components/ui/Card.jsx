/**
 * Card — reusable stat card matching the system design
 *
 * Props:
 *   title  – string
 *   value  – string | number
 *   icon   – ReactNode (SVG)
 *   color  – tailwind bg color class e.g. 'bg-green-500'
 *   sub    – string (optional subtitle below value)
 */
export default function Card({ title, value, icon, color = 'bg-green-500', sub }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}