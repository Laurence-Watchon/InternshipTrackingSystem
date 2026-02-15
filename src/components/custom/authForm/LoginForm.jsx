import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'
import GoogleLogo from '../../../assets/google.png'

function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    }
    
    let isValid = true
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
      isValid = false
    } else if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Invalid email address'
      isValid = false
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    // Handle login logic here
    console.log('Login data:', formData)
    navigate('/user/home')
  }

  return (
    <div className="p-6 md:p-8 flex flex-col justify-center h-full">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-6">
        <img 
          src={SchoolLogo} 
          alt="Laguna University Logo" 
          className="w-12 h-12 mb-3"
        />
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-center mt-1 text-sm">
          Login to your account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Input */}
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
            autoComplete="email"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
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
            autoComplete="current-password"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.password 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
        >
          Login
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login Button */}
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

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
            Sign up here
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-3">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginForm