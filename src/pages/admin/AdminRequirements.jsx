import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AlertDialog from '../../components/ui/AlertDialog'
import Dialog from '../../components/ui/Dialog'
import AdminRequirementsModal from '../../components/custom/dialog/AdminRequirementsModal'
import RequiredHoursCard from '../../components/ui/RequiredHoursCard'

function RequirementsManagement() {
  const [requirements, setRequirements] = useState([
    {
      id: 1,
      title: 'Copy of Registration Form',
      description: 'Your official registration form from the registrar.',
      order: 1,
      acceptedFileTypes: ['pdf', 'jpg', 'png'],
      isActive: true
    },
    {
      id: 2,
      title: 'Attendance / Copy Evaluation of Pre-Deployment Orientation',
      description: 'Attendance sheet or evaluation copy from orientation.',
      order: 2,
      acceptedFileTypes: ['pdf', 'jpg', 'png'],
      isActive: true
    },
    {
      id: 3,
      title: 'Scanned Copy of Application Letter',
      description: 'Scanned or photo copy of your application letter.',
      order: 3,
      acceptedFileTypes: ['pdf', 'jpg', 'png'],
      isActive: true
    },
    {
      id: 4,
      title: 'Curriculum Vitae (LU Format)',
      description: 'Your CV following the LU-prescribed format.',
      order: 4,
      acceptedFileTypes: ['pdf', 'docx'],
      isActive: true
    },
    {
      id: 5,
      title: 'AVP Self Introduction',
      description: 'Google Drive link to your self-introduction video.',
      order: 5,
      acceptedFileTypes: ['url'],
      isActive: true
    },
    {
      id: 6,
      title: 'Notarized Student Internship Consent Form (LU Format)',
      description: 'Notarized consent form using the LU format.',
      order: 6,
      acceptedFileTypes: ['pdf'],
      isActive: true
    },
    {
      id: 7,
      title: 'Medical Clearance',
      description: 'Medical clearance certificate.',
      order: 7,
      acceptedFileTypes: ['pdf', 'jpg', 'png'],
      isActive: true
    }
  ])

  const [requiredHours, setRequiredHours] = useState({
    'BSCS-DS': '',
    'BSIT-BA': '',
    'BSIT-SD': ''
  })

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [currentRequirement, setCurrentRequirement] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false)
  const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false)
  const [showHoursConfirmDialog, setShowHoursConfirmDialog] = useState(false)
  const [showHoursSuccessDialog, setShowHoursSuccessDialog] = useState(false)
  const [pendingHours, setPendingHours] = useState(null)
  const [successMessage, setSuccessMessage] = useState({ title: '', description: '' })

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

  const handleSave = (formData) => {
    if (modalMode === 'add') {
      const newRequirement = {
        id: requirements.length + 1,
        title: formData.title,
        description: formData.description,
        order: requirements.length + 1,
        acceptedFileTypes: formData.acceptedFileTypes,
        isActive: true
      }
      setRequirements([...requirements, newRequirement])
      setSuccessMessage({
        title: 'Added Successfully',
        description: 'The requirement has been added successfully.'
      })
    } else {
      setRequirements(requirements.map(req =>
        req.id === currentRequirement.id
          ? { ...req, title: formData.title, description: formData.description, acceptedFileTypes: formData.acceptedFileTypes }
          : req
      ))
      setSuccessMessage({
        title: 'Updated Successfully',
        description: 'The requirement has been updated successfully.'
      })
    }
    setShowModal(false)
    setCurrentRequirement(null)
    setShowSaveSuccessDialog(true)
  }

  const handleDelete = () => {
    setRequirements(requirements.filter(req => req.id !== currentRequirement.id))
    setShowDeleteDialog(false)
    setShowDeleteSuccessDialog(true)
  }

  const handleHoursSave = (hours) => {
    setPendingHours(hours)
    setShowHoursConfirmDialog(true)
  }

  const handleHoursConfirm = () => {
    setRequiredHours(pendingHours)
    setShowHoursConfirmDialog(false)
    setShowHoursSuccessDialog(true)
    // TODO: API call to save required hours
    console.log('Saving required hours:', pendingHours)
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
            <h1 className="text-2xl font-bold text-gray-900">COLLEGE OF COMPUTING STUDIES</h1>
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

      {/* Required Hours Card */}
      <div className="mb-6">
        <RequiredHoursCard
          initialHours={requiredHours}
          onSave={handleHoursSave}
        />
      </div>

      {/* Requirements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Requirements</h3>
            <span className="text-sm text-gray-500">{requirements.length} requirements</span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {requirements.map((req, index) => (
            <div key={req.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between space-x-4">
                {/* Left Side - Order Number and Content */}
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Order Number */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-orange-100">
                    <span className="font-bold text-orange-600">
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
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AdminRequirementsModal
        key={modalMode === 'edit' ? currentRequirement?.id : 'add'}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        requirement={currentRequirement}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Requirement"
        message={`Are you sure you want to delete "${currentRequirement?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* Delete Success Dialog */}
      <AlertDialog
        isOpen={showDeleteSuccessDialog}
        onClose={() => setShowDeleteSuccessDialog(false)}
        type="success"
        title="Deleted Successfully"
        description="The requirement has been deleted successfully."
      />

      {/* Save Success Dialog */}
      <AlertDialog
        isOpen={showSaveSuccessDialog}
        onClose={() => setShowSaveSuccessDialog(false)}
        type="success"
        title={successMessage.title}
        description={successMessage.description}
      />

      {/* Hours Confirmation Dialog */}
      <Dialog
        isOpen={showHoursConfirmDialog}
        onClose={() => setShowHoursConfirmDialog(false)}
        onConfirm={handleHoursConfirm}
        title="Confirm Required Hours"
        message={`Are you sure you want to set the required hours as:\n\nBSCS-DS: ${pendingHours?.['BSCS-DS']} hours\nBSIT-BA: ${pendingHours?.['BSIT-BA']} hours\nBSIT-SD: ${pendingHours?.['BSIT-SD']} hours`}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />

      {/* Hours Success Dialog */}
      <AlertDialog
        isOpen={showHoursSuccessDialog}
        onClose={() => setShowHoursSuccessDialog(false)}
        type="success"
        title="Hours Saved Successfully"
        description="The required hours for all courses have been updated successfully."
      />
    </AppLayout>
  )
}

export default RequirementsManagement