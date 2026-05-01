import { apiFetch } from '../../config/api.js';
import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import Dialog from '../../components/ui/Dialog'
import AdminRequirementsModal from '../../components/custom/dialog/AdminRequirementsModal'
import RequiredHoursCard from '../../components/ui/RequiredHoursCard'
import Skeleton from '../../components/ui/Skeleton'
import Toast from '../../components/ui/Toast'
import { useAuth } from '../../context/AuthContext'

function RequirementsManagement() {
  const { user } = useAuth()
  const [requirements, setRequirements] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const collegeMapping = {
    'CAS': 'COLLEGE OF ARTS AND SCIENCES',
    'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
    'CCS': 'COLLEGE OF COMPUTING STUDIES',
    'COE': 'COLLEGE OF ENGINEERING',
    'COED': 'COLLEGE OF EDUCATION'
  }

  const coursesByCollege = {
    'COLLEGE OF ARTS AND SCIENCES': [
      { value: 'BAComm', label: 'BA Communication' },
      { value: 'BA-Psych', label: 'BA Psychology' },
      { value: 'BS-Psych', label: 'BS Psychology' }
    ],
    'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY': [
      { value: 'BSA', label: 'BS Accountancy' },
      { value: 'BSAIS', label: 'BS Accounting Information System' },
      { value: 'BSEntrep', label: 'BS Entrepreneurship' },
      { value: 'BSTM', label: 'BS Tourism Management' }
    ],
    'COLLEGE OF COMPUTING STUDIES': [
      { value: 'BSCS-DS', label: 'BS Computer Science - Data Science' },
      { value: 'BSIT-BA', label: 'BS Information Technology - Business Analytics' },
      { value: 'BSIT-SD', label: 'BS Information Technology - Software Development' }
    ],
    'COLLEGE OF ENGINEERING': [
      { value: 'BSME', label: 'BS Mechanical Engineering' }
    ],
    'COLLEGE OF EDUCATION': [
      { value: 'BEED', label: 'Bachelor of Elementary Education' },
      { value: 'BPEd', label: 'Bachelor of Physical Education' },
      { value: 'BSED-English', label: 'BS Education (Major in English)' },
      { value: 'BSED-Math', label: 'BS Education (Major in Mathematics)' },
      { value: 'BSED-Science', label: 'BS Education (Major in Science)' }
    ]
  }

  const getFullCollegeName = (name) => {
    if (!name) return 'COLLEGE OF COMPUTING STUDIES'
    const upper = name.toUpperCase()
    if (collegeMapping[upper]) return collegeMapping[upper]
    return upper
  }

  const resolvedCollegeName = getFullCollegeName(user?.college)


  const fetchCollegeSettings = async () => {
    try {
      const response = await apiFetch(`/api/admin/college-settings?college=${encodeURIComponent(user.college)}`)
      const data = await response.json()
      if (response.ok && data.requiredHours) {
        const defaultHours = {}
        const collegeCourses = coursesByCollege[resolvedCollegeName] || []
        collegeCourses.forEach(c => {
          defaultHours[c.value] = data.requiredHours[c.value] || ''
        })
        setRequiredHours(defaultHours)
      }
    } catch (err) {
      console.error('Error fetching college settings:', err)
      throw err
    }
  }

  const fetchRequirements = async () => {
    try {
      const response = await apiFetch(`/api/admin/requirements?college=${encodeURIComponent(user.college)}`)
      const data = await response.json()
      if (response.ok) {
        setRequirements(data)
      }
    } catch (err) {
      console.error('Error fetching requirements:', err)
      throw err
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    // Guarantee minimum loading time for smooth transition
    const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))

    try {
      await Promise.all([
        fetchRequirements(),
        fetchCollegeSettings(),
        minLoadingTime
      ])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.college) {
      // Re-initialize courses for the specific college
      const initial = {}
      const collegeCourses = coursesByCollege[resolvedCollegeName] || []
      collegeCourses.forEach(c => {
        initial[c.value] = ''
      })
      setRequiredHours(initial)

      fetchData()
    }
  }, [user?.college, resolvedCollegeName])

  const [requiredHours, setRequiredHours] = useState(() => {
    const initial = {}
    const collegeCourses = coursesByCollege[resolvedCollegeName] || []
    collegeCourses.forEach(c => {
      initial[c.value] = ''
    })
    return initial
  })

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [currentRequirement, setCurrentRequirement] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showHoursConfirmDialog, setShowHoursConfirmDialog] = useState(false)
  const [isSavingHours, setIsSavingHours] = useState(false)
  const [isSavingModal, setIsSavingModal] = useState(false) // New state for modal saving
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [hoursCardKey, setHoursCardKey] = useState(0)
  const [pendingHours, setPendingHours] = useState(null)

  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF', color: 'bg-red-100 text-red-700' },
    { value: 'docx', label: 'DOCX', color: 'bg-blue-100 text-blue-700' },
    { value: 'doc', label: 'DOC', color: 'bg-blue-100 text-blue-700' },
    { value: 'jpg', label: 'JPG', color: 'bg-green-100 text-green-700' },
    { value: 'jpeg', label: 'JPEG', color: 'bg-green-100 text-green-700' },
    { value: 'png', label: 'PNG', color: 'bg-green-100 text-green-700' },
    { value: 'xlsx', label: 'XLSX', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'url', label: 'URL/Link', color: 'bg-purple-100 text-purple-700' }
  ]

  const handleOpenAdd = () => {
    setModalMode('add')
    setCurrentRequirement(null)
    setShowModal(true)
  }

  const handleOpenEdit = (requirement) => {
    setModalMode('edit')
    setCurrentRequirement(requirement)
    setShowModal(true)
  }

  const handleOpenDelete = (requirement) => {
    setCurrentRequirement(requirement)
    setShowDeleteDialog(true)
  }

  const handleSave = async (formData) => {
    setIsSavingModal(true)
    const minDelay = new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const url = modalMode === 'add'
        ? `${import.meta.env.VITE_API_URL}/api/admin/requirements`
        : `http://localhost:3001/api/admin/requirements/${currentRequirement._id}`

      const method = modalMode === 'add' ? 'POST' : 'PUT'

      const body = {
        ...formData,
        college: user.college,
        adminId: user.id
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      await minDelay

      if (response.ok) {
        fetchRequirements()
        setShowModal(false)
        setCurrentRequirement(null)
        setToastMessage(`Requirement ${modalMode === 'add' ? 'added' : 'updated'} successfully!`)
        setShowToast(true)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to save requirement')
      }
    } catch (err) {
      console.error('Error saving requirement:', err)
      await minDelay
      alert('An error occurred while saving the requirement.')
    } finally {
      setIsSavingModal(false)
    }
  }

  const handleDelete = async () => {
    setIsSavingModal(true) // Reuse for delete as well
    const minDelay = new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const response = await apiFetch(`/api/admin/requirements/${currentRequirement._id}`, {
        method: 'DELETE'
      })

      await minDelay

      if (response.ok) {
        fetchRequirements()
        setShowDeleteDialog(false)
        setToastMessage("Requirement deleted successfully!")
        setShowToast(true)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete requirement')
      }
    } catch (err) {
      console.error('Error deleting requirement:', err)
      await minDelay
      alert('An error occurred while deleting the requirement.')
    } finally {
      setIsSavingModal(false)
    }
  }

  const handleHoursSave = (hours) => {
    setPendingHours(hours)
    setShowHoursConfirmDialog(true)
  }

  const handleHoursConfirm = async () => {
    setIsSavingHours(true)
    const minDelay = new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const response = await apiFetch(`/api/admin/college-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college: user.college,
          requiredHours: pendingHours
        })
      })

      await minDelay

      if (response.ok) {
        setRequiredHours(pendingHours)
        setShowHoursConfirmDialog(false)
        setToastMessage("Required hours updated successfully!")
        setShowToast(true)
        window.dispatchEvent(new CustomEvent('collegeSettingsUpdated'))
        // Reset/Collapse the card by changing its key
        setHoursCardKey(prev => prev + 1)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update settings')
      }
    } catch (err) {
      console.error('Error updating settings:', err)
      await minDelay
      alert('An error occurred while updating settings.')
    } finally {
      setIsSavingHours(false)
    }
  }

  const getFileTypeBadge = (type) => {
    const option = fileTypeOptions.find(opt => opt.value === type)
    return option ? { label: option.label, color: option.color } : { label: type.toUpperCase(), color: 'bg-gray-100 text-gray-700' }
  }

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">{resolvedCollegeName}</h1>
            <p className="text-gray-600 mt-1">
              Add, edit, and manage internship requirements for students
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium flex items-center space-x-2 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Requirement</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        {isLoading ? (
          <Skeleton variant="rectangular" height={80} className="rounded-lg shadow-sm" />
        ) : (
          <RequiredHoursCard
            key={hoursCardKey}
            initialHours={requiredHours}
            onSave={handleHoursSave}
          />
        )}
      </div>

      {/* Requirements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isLoading ? (
              <>
                <Skeleton variant="text" width={150} height={28} />
                <Skeleton variant="text" width={100} height={20} />
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900">All Requirements</h3>
                <span className="text-sm text-gray-500">{requirements.length} requirements</span>
              </>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200 min-h-[200px] relative">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : requirements.length === 0 ? (
            <button
              onClick={handleOpenAdd}
              className="w-full flex flex-col items-center justify-center py-20 text-gray-400 hover:bg-gray-50 transition-all duration-200 group focus:outline-none"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-8 h-8 text-gray-300 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-500 uppercase tracking-wide group-hover:text-green-600 transition-colors">
                No requirements set yet.
              </p>
              <p className="text-sm mt-1 group-hover:text-gray-600 transition-colors">
                Click "Add Requirement" to get started.
              </p>
            </button>
          ) : (
            requirements.map((req, index) => (
              <div key={req._id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between space-x-4">
                  {/* Left Side - Order Number and Content */}
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    {/* Order Number */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                      <span className="font-bold text-green-600">
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {req.title}
                        </h4>
                        <p className="text-sm mt-1 text-gray-600">
                          {req.description}
                        </p>
                      </div>

                      {/* File Types */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500">Accepted files:</span>
                        {req.acceptedFileTypes.map(type => {
                          const badge = getFileTypeBadge(type)
                          return (
                            <span key={type} className={`text-xs px-2 py-1 rounded font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(req)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition focus:outline-none"
                      title="Edit this requirement"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleOpenDelete(req)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition focus:outline-none"
                      title="Delete this requirement"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AdminRequirementsModal
        key={modalMode === 'edit' ? currentRequirement?._id : 'add'}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        requirement={currentRequirement}
        mode={modalMode}
        isLoading={isSavingModal}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Requirement"
        isLoading={isSavingModal}
        loadingLabel="Deleting..."
        message={`Are you sure you want to delete "${currentRequirement?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* Hours Confirmation Dialog */}
      <Dialog
        isOpen={showHoursConfirmDialog}
        onClose={() => setShowHoursConfirmDialog(false)}
        onConfirm={handleHoursConfirm}
        title="Confirm Required Hours"
        isLoading={isSavingHours}
        loadingLabel="Confirming..."
        message={
          `Are you sure you want to set the required hours as:\n\n` +
          Object.entries(pendingHours || {}).map(([course, hours]) => `${course}: ${hours} hours`).join('\n')
        }
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </AppLayout>
  )
}

export default RequirementsManagement