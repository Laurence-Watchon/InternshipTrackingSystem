import { useState } from 'react'
import AlertDialog from '../../ui/AlertDialog'
import Dialog from '../../ui/Dialog'

function AdminRequirementsModal({ isOpen, onClose, onSave, requirement, mode }) {
  // Initialize form data based on mode and requirement
  const getInitialFormData = () => {
    if (mode === 'edit' && requirement) {
      return {
        title: requirement.title,
        description: requirement.description,
        acceptedFileTypes: [...requirement.acceptedFileTypes]
      }
    }
    return {
      title: '',
      description: '',
      acceptedFileTypes: []
    }
  }

  const [formData, setFormData] = useState(getInitialFormData())
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    fileTypes: ''
  })
  const [showNoChangesDialog, setShowNoChangesDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Store original data for comparison in edit mode
  const originalData = mode === 'edit' && requirement ? {
    title: requirement.title,
    description: requirement.description,
    acceptedFileTypes: [...requirement.acceptedFileTypes]
  } : null

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileTypeToggle = (fileType) => {
    setFormData(prev => ({
      ...prev,
      acceptedFileTypes: prev.acceptedFileTypes.includes(fileType)
        ? prev.acceptedFileTypes.filter(t => t !== fileType)
        : [...prev.acceptedFileTypes, fileType]
    }))
    // Clear file types error when user selects a type
    if (errors.fileTypes) {
      setErrors(prev => ({ ...prev, fileTypes: '' }))
    }
  }

  const hasChanges = () => {
    if (mode === 'add') return true
    
    if (!originalData) return true

    // Compare arrays by sorting them first
    const originalFileTypes = [...originalData.acceptedFileTypes].sort()
    const currentFileTypes = [...formData.acceptedFileTypes].sort()

    return (
      formData.title.trim() !== originalData.title ||
      formData.description.trim() !== originalData.description ||
      JSON.stringify(currentFileTypes) !== JSON.stringify(originalFileTypes)
    )
  }

  const handleSubmit = () => {
    // Reset errors
    const newErrors = {
      title: '',
      description: '',
      fileTypes: ''
    }

    // Validate title - trim whitespace
    const trimmedTitle = formData.title.trim()
    if (!trimmedTitle) {
      newErrors.title = 'Requirement title is required'
    }

    // Validate description - trim whitespace
    const trimmedDescription = formData.description.trim()
    if (!trimmedDescription) {
      newErrors.description = 'Description is required'
    }

    // Validate file types
    if (formData.acceptedFileTypes.length === 0) {
      newErrors.fileTypes = 'Please choose at least one accepted file type'
    }

    // Set errors if any
    if (newErrors.title || newErrors.description || newErrors.fileTypes) {
      setErrors(newErrors)
      return
    }

    // Check for changes in edit mode
    if (mode === 'edit' && !hasChanges()) {
      setShowNoChangesDialog(true)
      return
    }

    // Show confirmation dialog
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = () => {
    const trimmedTitle = formData.title.trim()
    const trimmedDescription = formData.description.trim()

    // Save with trimmed values
    onSave({
      ...formData,
      title: trimmedTitle,
      description: trimmedDescription
    })

    // Close confirmation dialog
    setShowConfirmDialog(false)
  }

  const handleClose = () => {
    setErrors({ title: '', description: '', fileTypes: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'add' ? 'Add New Requirement' : 'Edit Requirement'}
            </h3>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirement Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="e.g., Copy of Registration Form"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="Brief description of the requirement"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* File Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accepted File Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fileTypeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleFileTypeToggle(option.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition font-medium focus:outline-none ${
                      formData.acceptedFileTypes.includes(option.value)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : errors.fileTypes
                        ? 'border-red-300 bg-white text-gray-700 hover:border-red-400'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.fileTypes && (
                <p className="text-red-500 text-sm mt-2">{errors.fileTypes}</p>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none"
            >
              {mode === 'add' ? 'Add Requirement' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* No Changes Dialog */}
      <AlertDialog
        isOpen={showNoChangesDialog}
        onClose={() => setShowNoChangesDialog(false)}
        type="warning"
        title="No Changes Made"
        description="You haven't made any changes to this requirement."
      />

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        title={mode === 'add' ? 'Add Requirement' : 'Save Changes'}
        description={
          mode === 'add' 
            ? 'Are you sure you want to add this requirement?' 
            : 'Are you sure you want to save these changes?'
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  )
}

export default AdminRequirementsModal