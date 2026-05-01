import { apiFetch } from '../../config/api.js';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/custom/global/AppLayout'
import Dialog from '../../components/ui/Dialog'
import { useAuth } from '../../context/AuthContext'
import { AlertCircle } from 'lucide-react'
import Toast from '../../components/ui/Toast'

function Profile() {
  const { user: authUser } = useAuth()
  const navigate = useNavigate()
  const [originalData, setOriginalData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.id) {
        setFetchError('User ID not found. Please log in again.')
        setIsLoading(false)
        return
      }

      try {
        const [profileRes, endorsementRes] = await Promise.all([
          apiFetch(`/api/auth/profile/${authUser.id}`),
          apiFetch(`/api/student/endorsement-status?studentId=${authUser.id}`)
        ])

        if (!profileRes.ok) {
          throw new Error('Failed to fetch profile data')
        }
        
        const data = await profileRes.json()
        const endorsementData = endorsementRes.ok ? await endorsementRes.json() : null

        // Map database fields to profile fields if necessary
        const profileData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          studentNumber: data.studentNumber || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          college: data.college || '',
          collegeName: data.college || 'Not specified',
          course: data.course || '',
          courseName: data.course || 'Not specified',
          company: endorsementData?.companyName || 'Not specified',
          companyAddress: endorsementData?.companyAddress || 'Not specified',
          supervisor: endorsementData?.supervisorFullName || 'Not specified'
        }

        setOriginalData(profileData)
        setFormData(profileData)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setFetchError('Could not load profile data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [authUser?.id])

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const hasChanges = () => JSON.stringify(formData) !== JSON.stringify(originalData)

  const handleSaveClick = () => {
    if (!validateForm()) return
    if (!hasChanges()) {
      setToast({ show: true, message: 'No information was changed.', type: 'info' })
      return
    }
    handleConfirmSave()
  }

  const handleConfirmSave = async () => {
    setIsSaving(true)
    const minSavingTime = new Promise((resolve) => setTimeout(resolve, 2000))

    const updatedData = {
      firstName: capitalizeName(formData.firstName),
      lastName: capitalizeName(formData.lastName),
      phoneNumber: formData.phoneNumber
    }

    try {
      const [response] = await Promise.all([
        apiFetch(`/api/auth/profile/${authUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }),
        minSavingTime
      ])

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setToast({ show: true, message: 'Profile updated successfully!', type: 'success' })
      setOriginalData(updatedData)
      
      // Redirect to home after a brief delay so they can see the success message
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      console.error('Error updating profile:', err)
      setToast({ show: true, message: 'Failed to update profile. Please try again.', type: 'error' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout role="user">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your profile...</p>
        </div>
      </AppLayout>
    )
  }

  if (fetchError || !formData) {
    return (
      <AppLayout role="user">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 animate-shake">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {fetchError || "We couldn't load your profile information. Please try refreshing the page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none"
          >
            Retry Loading
          </button>
        </div>
      </AppLayout>
    )
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
                {originalData.firstName.charAt(0)}{originalData.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {originalData.firstName} {originalData.lastName}
                </h2>
                <p className="text-sm text-gray-500">{originalData.studentNumber}</p>
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
                    type="email" name="email" value={formData.email} readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-400">Email address cannot be changed.</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                  <input type="text" value={formData.companyAddress} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor Name</label>
                  <input type="text" value={formData.supervisor} disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSaveClick}
              disabled={isSaving}
              className={`px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium focus:outline-none flex items-center
                ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
          duration={3000}
        />
      )}
    </AppLayout>
  )
}

export default Profile