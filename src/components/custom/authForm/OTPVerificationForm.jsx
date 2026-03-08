import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'

function OTPVerificationForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(180) // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef([])

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

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
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

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

    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  // Handle verify — calls backend to check OTP and save user to DB
  const handleVerify = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits.')
      return
    }

    setIsVerifying(true)
    setError('')
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed. Please try again.')
        return
      }

      // Success — user saved to MongoDB
      setSuccessMsg('Email verified! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Cannot connect to server. Please try again later.')
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle resend OTP
  const handleResend = async () => {
    if (!canResend) return

    setIsResending(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await fetch('http://localhost:3001/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP. Please sign up again.')
        if (data.error?.toLowerCase().includes('session')) {
          setTimeout(() => navigate('/signup'), 2500)
        }
        return
      }

      setTimer(180)
      setCanResend(false)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setSuccessMsg('A new OTP has been sent to your email!')
    } catch {
      setError('Cannot connect to server. Please try again later.')
    } finally {
      setIsResending(false)
    }
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
              We&apos;ve sent a verification code to
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

            {/* Error / Success Messages */}
            {error && (
              <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
                {error}
              </p>
            )}
            {successMsg && (
              <p className="text-sm text-green-700 text-center bg-green-50 border border-green-200 rounded-lg py-2 px-3 mb-4">
                {successMsg}
              </p>
            )}

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
              disabled={isVerifying}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 mb-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isResending}
                  className={`font-medium ${
                    canResend && !isResending
                      ? 'text-green-600 hover:text-green-700 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
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