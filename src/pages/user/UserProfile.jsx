import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import Dialog from '../../components/ui/Dialog'
import AlertDialog from '../../components/ui/AlertDialog'

function Profile() {
  const [originalData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: '221-2543',
    phoneNumber: '09123456789',
    email: 'john.doe@gmail.com',
    college: 'CCS',
    collegeName: 'College of Computer Studies',
    course: 'BSIT-SD',
    courseName: 'BS Information Technology - Software Development',
    company: 'Tech Solutions Inc.',
    supervisor: 'Jane Smith',
    startDate: '2026-01-15'
  })

  const [formData, setFormData]                       = useState({ ...originalData })
  const [errors, setErrors]                           = useState({})
  const [showConfirmDialog, setShowConfirmDialog]     = useState(false)
  const [showNoChangesDialog, setShowNoChangesDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog]     = useState(false)

  const capitalizeName = (name) =>
    name.trim().replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    if (name === 'firstName' || name === 'lastName') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ')
    }
    if (name === 'phoneNumber') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 11)
    }
    if (name === 'email') {
      processedValue = value.replace(/\s/g, '')
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required'
    else if (formData.firstName.trim().length < 2)
      newErrors.firstName = 'First name must be at least 2 characters'

    if (!formData.lastName.trim())
      newErrors.lastName = 'Last name is required'
    else if (formData.lastName.trim().length < 2)
      newErrors.lastName = 'Last name must be at least 2 characters'

    if (!formData.phoneNumber)
      newErrors.phoneNumber = 'Phone number is required'
    else if (formData.phoneNumber.length !== 11)
      newErrors.phoneNumber = 'Phone number must be 11 digits'
    else if (!formData.phoneNumber.startsWith('09'))
      newErrors.phoneNumber = 'Phone number must start with 09'

    if (!formData.email.trim())
      newErrors.email = 'Email address is required'
    else if (!formData.email.endsWith('@gmail.com'))
      newErrors.email = 'Email must end with @gmail.com'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const hasChanges = () => JSON.stringify(formData) !== JSON.stringify(originalData)

  const handleSaveClick = () => {
    if (!validateForm()) return
    if (!hasChanges()) { setShowNoChangesDialog(true); return }
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = () => {
    const updatedData = {
      ...formData,
      firstName: capitalizeName(formData.firstName),
      lastName:  capitalizeName(formData.lastName),
    }
    console.log('Saving profile:', updatedData)
    setShowConfirmDialog(false)
    setShowSuccessDialog(true)
  }

  return (
    <AppLayout role="user">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-gray-900">
          Update your personal information and internship details
        </h1>
      </div>

      {/* Profile Form */}
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">

          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-sm text-gray-500">{formData.studentNumber}</p>
                <p className="text-sm text-green-600 font-medium">Student</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-8">

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition
                      ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition
                      ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition
                      ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition
                      ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Academic Information — read only */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
                  <input type="text" value={formData.studentNumber} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <input type="text" value={formData.collegeName} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input type="text" value={formData.courseName} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* Internship Information — read only */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Internship Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" value={formData.company} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
                  <input type="text" value={formData.supervisor} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={formData.startDate} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSaveClick}
              className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm Save — uses shared Dialog from ui ── */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        title="Confirm Changes"
        message="Are you sure you want to save these changes to your profile?"
        confirmLabel="Save"
        cancelLabel="Cancel"
      />

      {/* ── No Changes — unchanged AlertDialog ── */}
      <AlertDialog
        isOpen={showNoChangesDialog}
        onClose={() => setShowNoChangesDialog(false)}
        type="info"
        title="No Changes"
        description="No information was changed. Make some changes before saving."
      />

      {/* ── Success — unchanged AlertDialog ── */}
      <AlertDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        type="success"
        title="Profile Updated"
        description="Your profile has been updated successfully!"
      />
    </AppLayout>
  )
}

export default Profile