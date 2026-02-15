import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'
import GoogleLogo from '../../../assets/google.png'
import ComboBox from '../../ui/ComboBox'
import TermsAndConditions from '../dialog/TermsAndConditions'
import PrivacyPolicy from '../dialog/PrivacyPolicy'

function SignupForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentNumber: '',
    phoneNumber: '',
    email: '',
    college: '',
    course: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  })

  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  // College options
  const collegeOptions = [
    { value: 'CAS', label: 'CAS - College of Arts and Sciences' },
    { value: 'CBAA', label: 'CBAA - College of Business Administration and Accountancy' },
    { value: 'CCS', label: 'CCS - College of Computer Studies' },
    { value: 'COE', label: 'COE - College of Engineering' },
    { value: 'COED', label: 'COED - College of Education' }
  ]

  // Course options by college
  const coursesByCollege = {
    CAS: [
      { value: 'BAComm', label: 'BA Communication' },
      { value: 'BA-Psych', label: 'BA Psychology' },
      { value: 'BS-Psych', label: 'BS Psychology' }
    ],
    CBAA: [
      { value: 'BSA', label: 'BS Accountancy' },
      { value: 'BSAIS', label: 'BS Accounting Information System' },
      { value: 'BSEntrep', label: 'BS Entrepreneurship' },
      { value: 'BSTM', label: 'BS Tourism Management' }
    ],
    CCS: [
      { value: 'BSCS-DS', label: 'BS Computer Science - Data Science' },
      { value: 'BSIT-BA', label: 'BS Information Technology - Business Analytics' },
      { value: 'BSIT-SD', label: 'BS Information Technology - Software Development' }
    ],
    COE: [
      { value: 'BSME', label: 'BS Mechanical Engineering' }
    ],
    COED: [
      { value: 'BEED', label: 'Bachelor of Elementary Education' },
      { value: 'BPEd', label: 'Bachelor of Physical Education' },
      { value: 'BSED-English', label: 'BS Education (Major in English)' },
      { value: 'BSED-Math', label: 'BS Education (Major in Mathematics)' },
      { value: 'BSED-Science', label: 'BS Education (Major in Science)' }
    ]
  }

  const courseOptions = formData.college ? coursesByCollege[formData.college] : []

  // Capitalize first letter of each word
  const capitalizeName = (name) => {
    return name
      .trim()
      .replace(/\s+/g, ' ') // Remove double spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength === 0) return ''
    if (strength <= 2) return 'Weak'
    if (strength === 3) return 'Medium'
    return 'Strong'
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    let processedValue = value

    // Name validation - only letters and spaces
    if (name === 'firstName' || name === 'lastName') {
      // Remove numbers and special characters
      processedValue = value.replace(/[^a-zA-Z\s]/g, '')
      // Remove double spaces
      processedValue = processedValue.replace(/\s{2,}/g, ' ')
    }

    // Student number - only numbers and dash
    if (name === 'studentNumber') {
      processedValue = value.replace(/[^0-9-]/g, '')
    }

    // Phone number - only numbers, max 11 digits
    if (name === 'phoneNumber') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 11)
    }

    // Email - no spaces
    if (name === 'email') {
      processedValue = value.replace(/\s/g, '')
    }
    
    // Update password strength when password changes
    if (name === 'password') {
      if (processedValue) {
        setPasswordStrength(calculatePasswordStrength(processedValue))
      } else {
        setPasswordStrength('')
      }
    }
    
    if (name === 'college') {
      setFormData(prev => ({
        ...prev,
        college: processedValue,
        course: ''
      }))
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }))
    }
    
    // Live password match validation
    if (name === 'confirmPassword') {
      if (processedValue && formData.password !== processedValue) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.confirmPassword
          return newErrors
        })
      }
    } else if (name === 'password') {
      // Check if confirm password needs to be revalidated
      if (formData.confirmPassword) {
        if (processedValue !== formData.confirmPassword) {
          setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
        } else {
          setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.confirmPassword
            return newErrors
          })
        }
      }
    }
    
    // Clear error when user types (except for live password validation)
    if (errors[name] && name !== 'confirmPassword') {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // First Name validation
    const capitalizedFirstName = capitalizeName(formData.firstName)
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters'
    }

    // Last Name validation
    const capitalizedLastName = capitalizeName(formData.lastName)
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters'
    }

    // Student Number validation
    if (!formData.studentNumber.trim()) {
      newErrors.studentNumber = 'Student number is required'
    } else if (!/^\d{3}-\d{4}$/.test(formData.studentNumber)) {
      newErrors.studentNumber = 'Invalid student number'
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (formData.phoneNumber.length !== 11) {
      newErrors.phoneNumber = 'Phone number must be 11 digits'
    } else if (!formData.phoneNumber.startsWith('09')) {
      newErrors.phoneNumber = 'Phone number must start with 09'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Email must end with @gmail.com'
    } else if (/\s/.test(formData.email)) {
      newErrors.email = 'Email cannot contain spaces'
    }

    // College validation
    if (!formData.college) {
      newErrors.college = 'College is required'
    }

    // Course validation
    if (!formData.course) {
      newErrors.course = 'Course is required'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter'
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 number'
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 special character'
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms validation
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the Terms and Conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Capitalize names before sending
    const finalData = {
      ...formData,
      firstName: capitalizeName(formData.firstName),
      lastName: capitalizeName(formData.lastName)
    }
    
    console.log('Signup data:', finalData)
    
    // Navigate to verification page with email
    navigate('/verification', { 
      state: { email: finalData.email } 
    })
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak': return 'text-red-600'
      case 'Medium': return 'text-yellow-600'
      case 'Strong': return 'text-green-600'
      default: return ''
    }
  }

  const getStrengthBarColor = () => {
    switch (passwordStrength) {
      case 'Weak': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Strong': return 'bg-green-500'
      default: return 'bg-gray-300'
    }
  }

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'Weak': return '33%'
      case 'Medium': return '66%'
      case 'Strong': return '100%'
      default: return '0%'
    }
  }

  return (
    <>
      <div className="p-6 md:p-8 overflow-y-auto signup-form-scroll">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src={SchoolLogo} 
            alt="Laguna University Logo" 
            className="w-12 h-12 mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Create Account
          </h2>
          <p className="text-gray-600 text-center mt-1 text-sm">
            Sign up to get started
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name - First and Last Name in one row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.firstName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.lastName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                }`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Student Number */}
          <div>
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Student Number
            </label>
            <input
              id="studentNumber"
              name="studentNumber"
              type="text"
              value={formData.studentNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.studentNumber 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              placeholder="Enter your student number"
            />
            {errors.studentNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.studentNumber}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.phoneNumber 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              placeholder="09XXXXXXXXX"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              placeholder="your.email@gmail.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* College */}
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
              College
            </label>
            <div className={errors.college ? 'border-2 border-red-500 rounded-lg' : ''}>
              <ComboBox
                name="college"
                value={formData.college}
                onChange={handleChange}
                options={collegeOptions}
                placeholder="Select College"
              />
            </div>
            {errors.college && (
              <p className="mt-1 text-sm text-red-600">{errors.college}</p>
            )}
          </div>

          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <div className={errors.course ? 'border-2 border-red-500 rounded-lg' : ''}>
              <ComboBox
                name="course"
                value={formData.course}
                onChange={handleChange}
                options={courseOptions}
                placeholder={formData.college ? "Select Course" : "Select College First"}
                disabled={!formData.college}
              />
            </div>
            {errors.course && (
              <p className="mt-1 text-sm text-red-600">{errors.course}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              placeholder="Create a password"
            />
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password Strength:</span>
                  <span className={`text-xs font-medium ${getStrengthColor()}`}>
                    {passwordStrength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all ${getStrengthBarColor()}`}
                    style={{ width: getStrengthWidth() }}
                  ></div>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Must be 8+ characters with uppercase, number & special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start">
              <input
                id="terms"
                name="agreedToTerms"
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <span
                  onClick={() => setShowTerms(true)}
                  className="text-green-600 hover:text-green-700 font-medium underline cursor-pointer transition-colors"
                >
                  Terms and Conditions
                </span>{' '}
                and{' '}
                <span
                  onClick={() => setShowPrivacy(true)}
                  className="text-green-600 hover:text-green-700 font-medium underline cursor-pointer transition-colors"
                >
                  Privacy Policy
                </span>
              </label>
            </div>
            {errors.agreedToTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.agreedToTerms}</p>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup Button - Google Only */}
          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center justify-center px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[280px]"
            >
              <img 
                src={GoogleLogo} 
                alt="Google" 
                className="w-5 h-5 object-contain"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Continue with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Login here
            </Link>
          </p>
        </form>

        <style jsx>{`
          .signup-form-scroll {
            max-height: 100vh;
          }
          
          .signup-form-scroll::-webkit-scrollbar {
            width: 8px;
          }
          
          .signup-form-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .signup-form-scroll::-webkit-scrollbar-thumb {
            background: #22c55e;
            border-radius: 10px;
          }
          
          .signup-form-scroll::-webkit-scrollbar-thumb:hover {
            background: #16a34a;
          }
        `}</style>
      </div>

      {/* Dialogs */}
      <TermsAndConditions isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  )
}

export default SignupForm