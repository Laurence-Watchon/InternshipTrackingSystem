function Loading({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-green-100 border-t-green-500 animate-spin" />
        {/* Label */}
        <p className="text-sm font-medium text-gray-500 tracking-wide">
          {message}
        </p>
      </div>
    </div>
  )
}

export default Loading