import { useState } from 'react'
import Pagination from './Pagination'
import Dialog from './Dialog'

/**
 * TimeTable
 *
 * Props:
 *   logs         – array of log objects (already sorted latest→oldest)
 *   pageSize     – number (default 10)
 *   currentPage  – number
 *   onPageChange – (page) => void
 *   onEdit       – (log) => void   called when Edit is clicked
 *   onDelete     – (id) => void    called when Delete is confirmed
 */

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TimeTable({ logs = [], pageSize = 10, currentPage = 1, onPageChange, onEdit, onDelete }) {
  const totalPages = Math.ceil(logs.length / pageSize)
  const paginated  = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const [deleteTarget, setDeleteTarget] = useState(null) // log object to delete

  function handleDeleteConfirm() {
    if (deleteTarget) {
      onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Shift</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time In</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Out</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Hours</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Description</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium">No available logs</p>
                      <p className="text-xs mt-1">Click "+ Log Time" to add your first entry.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map(log => {
                  const isAM = log.shift === 'morning'
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      {/* Date */}
                      <td className="px-5 py-3.5 text-gray-800 font-medium whitespace-nowrap">
                        {fmtDate(log.date)}
                      </td>

                      {/* Shift */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                          ${isAM ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                          {isAM ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          )}
                          {isAM ? 'Morning' : 'Afternoon'}
                        </span>
                      </td>

                      {/* Time In */}
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{log.timeIn}</td>

                      {/* Time Out */}
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{log.timeOut}</td>

                      {/* Hours */}
                      <td className="px-5 py-3.5 font-semibold text-gray-900 whitespace-nowrap">{log.hours} hrs</td>

                      {/* Description */}
                      <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell max-w-xs truncate">
                        {log.description || '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => onEdit(log)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg focus:outline-none"
                            title="Edit this log"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(log)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg focus:outline-none"
                            title="Delete this log"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            {logs.length === 0
              ? 'No entries'
              : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, logs.length)} of ${logs.length} entr${logs.length === 1 ? 'y' : 'ies'}`}
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Time Log"
        message={`Are you sure you want to delete the log for ${deleteTarget ? fmtDate(deleteTarget.date) : ''}? This cannot be undone.`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
    </>
  )
}