import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import Loading from '../../ui/CenterLoading'

const OTP_EXPIRY_KEY = 'otp_expiry_timestamp'
const OTP_DURATION = 180 // 3 minutes in seconds

function OTPVerificationForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const email = location.state?.email || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [error, setError] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const inputRefs = useRef([])

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

  // On mount: restore timer from sessionStorage or start fresh
  useEffect(() => {
    const stored = sessionStorage.getItem(OTP_EXPIRY_KEY)

    if (stored) {
      const expiryTime = parseInt(stored, 10)
      const remaining = Math.round((expiryTime - Date.now()) / 1000)

      if (remaining > 0) {
        setTimer(remaining)
        setCanResend(false)
      } else {
        setTimer(0)
        setCanResend(true)
        sessionStorage.removeItem(OTP_EXPIRY_KEY)
      }
    } else {
      const expiryTime = Date.now() + OTP_DURATION * 1000
      sessionStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString())
      setTimer(OTP_DURATION)
      setCanResend(false)
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          sessionStorage.removeItem(OTP_EXPIRY_KEY)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearErrors = () => {
    if (error) setError('')
    if (otpError) setOtpError(false)
  }

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    clearErrors()

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      clearErrors()
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    clearErrors()

    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')

    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits.')
      setOtpError(true)
      return
    }

    setIsVerifying(true)
    setError('')
    setOtpError(false)

    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const [res] = await Promise.all([
        fetch('http://localhost:3001/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: otpValue })
        }),
        minLoadingTime
      ])

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Incorrect OTP code. Please try again.')
        setOtpError(true)
        setOtp(['', '', '', '', '', ''])
        setTimeout(() => inputRefs.current[0]?.focus(), 0)
        return
      }

      // Auto log the user in using global context
      login({
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      })

      // Success — show flash screen then redirect to user home
      sessionStorage.removeItem(OTP_EXPIRY_KEY)
      setIsVerified(true)
      setTimeout(() => navigate('/user/home'), 3000)
    } catch {
      setError('Cannot connect to server. Please try again later.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsResending(true)
    setError('')
    setOtpError(false)
    setSuccessMsg('')

    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const [res] = await Promise.all([
        fetch('http://localhost:3001/api/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }),
        minLoadingTime
      ])

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP. Please sign up again.')
        if (data.error?.toLowerCase().includes('session')) {
          setTimeout(() => navigate('/signup'), 2500)
        }
        return
      }

      const expiryTime = Date.now() + OTP_DURATION * 1000
      sessionStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString())
      setTimer(OTP_DURATION)
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

  // Success flash screen
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Verified!</h2>
            <p className="text-gray-500 text-sm mb-1">Your email has been verified successfully.</p>
            <p className="text-green-600 font-medium text-sm">Redirecting to homepage...</p>
            {/* Progress bar that shrinks over 3 seconds */}
            <div className="mt-6 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 bg-green-500 rounded-full"
                style={{ animation: 'shrink 3s linear forwards' }}
              />
            </div>
          </div>
        </div>
        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      {(isVerifying || isResending) && (
        <Loading message={isVerifying ? 'Verifying...' : 'Sending OTP...'} />
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">

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
              <div className="flex justify-center gap-2 mb-3">
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
                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition ${otpError
                      ? 'border-red-500 focus:ring-red-400 bg-red-50 text-red-600'
                      : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
                      }`}
                  />
                ))}
              </div>

              {/* Error / Success Messages */}
              {error && (
                <p className="text-sm text-red-600 text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3 mb-4">
                  {error}
                </p>
              )}
              {successMsg && !error && (
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
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Verify Email
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn&apos;t receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || isResending}
                    className={`font-medium ${canResend && !isResending
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
    </>
  )
}

export default OTPVerificationForm