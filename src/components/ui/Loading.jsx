/**
 * Loading — reusable loading spinner
 *
 * Props:
 *   size    – 'sm' | 'md' | 'lg'  (default: 'md')
 *   label   – string               (optional text beside spinner)
 *   color   – tailwind text color  (default: 'text-green-500')
 */
export default function Loading({
  size = 'md',
  label = 'Uploading...',
  color = 'text-green-500',
}) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  return (
    <div className="flex items-center gap-2">
      <svg
        className={`animate-spin ${sizeMap[size]} ${color}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {label && (
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      )}
    </div>
  )
}