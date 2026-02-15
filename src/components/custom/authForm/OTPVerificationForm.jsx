import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'

function OTPVerificationForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || 'user@example.com' // Email from signup
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(180) // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setCanResend(true)
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take last character
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  // Handle verify
  const handleVerify = (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      alert('Please enter all 6 digits')
      return
    }

    // TODO: Add actual OTP verification API call
    console.log('Verifying OTP:', otpValue)
    
    // For now, just navigate to login
    alert('Email verified successfully!')
    navigate('/login')
  }

  // Handle resend OTP
  const handleResend = () => {
    if (!canResend) return

    // TODO: Add actual resend OTP API call
    console.log('Resending OTP to:', email)
    
    // Reset timer and OTP
    setTimer(180)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    alert('OTP sent to your email!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={SchoolLogo} 
              alt="Laguna University Logo" 
              className="w-16 h-16"
            />
          </div>

          {/* Avatar Circle */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Title and Email */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              We've sent a verification code to
            </p>
            <p className="text-green-600 font-medium">
              {email}
            </p>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerify}>
            {/* OTP Boxes */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              {timer > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in{' '}
                  <span className="font-bold text-green-600">{formatTime(timer)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">
                  Code expired
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 mb-4"
            >
              Verify Email
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`font-medium ${
                    canResend
                      ? 'text-green-600 hover:text-green-700 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OTPVerificationForm