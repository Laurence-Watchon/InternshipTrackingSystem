import { useState, useEffect, useRef } from 'react'
import { KeyRound, Mail, Lock, ShieldCheck, ArrowRight, Loader2, X, AlertCircle, Clock } from 'lucide-react'

export default function ForgotPasswordDialog({ isOpen, onClose, showGlobalToast }) {
  const [step, setStep] = useState('email') // email, otp, password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('') // General errors (server)
  const [fieldErrors, setFieldErrors] = useState({}) // Specific field errors

  // Timer state
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
  const timerRef = useRef(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    if (!isOpen) {
      setStep('email')
      setEmail('')
      setOtp(['', '', '', '', '', ''])
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      setFieldErrors({})
      clearInterval(timerRef.current)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Timer logic for OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeLeft(180)
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [step])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!email) errors.email = 'Email address is required'
    else if (!email.endsWith('@gmail.com')) errors.email = 'Please enter a valid Gmail address'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setFieldErrors({ email: 'Email address not found' })
          return
        }
        throw new Error(data.error || 'Something went wrong')
      }

      showGlobalToast('Successfully sent! Check your email.', 'success')
      setStep('otp')

      // Note: In a real app, you might want to move the step to 'otp' 
      // but if the user requested the dialog to close, we follow that.
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    // Prevent spaces and non-digits
    const cleanValue = value.replace(/\s/g, '').replace(/\D/g, '')
    if (cleanValue.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = cleanValue
    setOtp(newOtp)

    // Clear otp error if any
    if (fieldErrors.otp) {
      setFieldErrors({ ...fieldErrors, otp: '' })
    }

    // Auto-focus next input
    if (cleanValue && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length < 6) {
      setFieldErrors({ otp: 'Please enter the 6-digit code' })
      return
    }

    if (timeLeft === 0) {
      setFieldErrors({ otp: 'Code has expired. Please resend.' })
      return
    }

    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      })

      const data = await res.json()

      if (!res.ok) {
        setFieldErrors({ otp: data.error || 'Invalid reset code' })
        return
      }

      setStep('password')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Check password requirements
  const getPasswordRequirements = (pass) => ({
    length: pass.length >= 8,
    uppercase: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[^A-Za-z0-9]/.test(pass)
  })

  const passwordReqs = getPasswordRequirements(newPassword)
  const isPasswordValid = Object.values(passwordReqs).every(Boolean)

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!isPasswordValid) return setError('Please meet all password requirements')

    if (newPassword !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'password mismatch' })
      return
    }

    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      // Close dialog first before showing toast as requested
      onClose()
      showGlobalToast('Password reset successful!', 'success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimalist Header */}
        <div className="p-8 text-center bg-green-50/50 border-b border-green-100/50 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-green-100 mb-4 animate-bounce-subtle">
            <KeyRound className="w-8 h-8 text-green-500" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800">Forgot Password</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-[280px] mx-auto">
            {step === 'email' && "Enter your email to receive a reset code."}
            {step === 'otp' && "Enter the 6-digit code sent to your email."}
            {step === 'password' && "Create a new strong password for your account."}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${fieldErrors.email ? 'text-red-400' : 'text-gray-300 group-focus-within:text-green-500'}`} />
                  <input
                    type="text"
                    placeholder="example@gmail.com"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl transition-all outline-none text-gray-900 ${fieldErrors.email
                      ? 'border-red-400 focus:ring-2 focus:ring-red-500/10'
                      : 'border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                      }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.replace(/\s/g, ''))
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' })
                    }}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 ml-1 text-xs font-medium text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 hover:shadow-green-500/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Code <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} noValidate className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className={`w-full aspect-square text-center text-3xl font-bold bg-gray-50/50 border-2 rounded-2xl outline-none transition-all text-gray-900 ${fieldErrors.otp
                        ? 'border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10'
                        }`}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && idx > 0) {
                          document.getElementById(`otp-${idx - 1}`).focus()
                        }
                      }}
                    />
                  ))}
                </div>

                {fieldErrors.otp && (
                  <p className="text-center text-xs font-medium text-red-500 flex items-center justify-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.otp}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-sm">
                  <Clock className={`w-4 h-4 ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                  <span className={`font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-gray-500'}`}>
                    Code expires in: {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading || timeLeft === 0}
                  className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 hover:shadow-green-500/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                </button>
                <div className="text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                  Didn't receive the code?
                  <button
                    type="button"
                    onClick={handleEmailSubmit}
                    disabled={timeLeft > 0}
                    className={`font-bold transition-all focus:outline-none ${timeLeft > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-green-500 hover:text-green-600 underline-offset-4 hover:underline'}`}
                  >
                    Resend {timeLeft > 0 ? `(${formatTime(timeLeft)})` : ''}
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} noValidate className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">New Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${fieldErrors.newPassword ? 'text-red-400' : 'text-gray-300 group-focus-within:text-green-500'}`} />
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl transition-all outline-none text-gray-900 ${fieldErrors.newPassword
                        ? 'border-red-400 focus:ring-2 focus:ring-red-500/10'
                        : 'border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                        }`}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value.replace(/\s/g, ''))
                        if (fieldErrors.newPassword) setFieldErrors({ ...fieldErrors, newPassword: '' })
                      }}
                    />
                  </div>

                  {/* Requirements Checklist */}
                  <div className="mt-4 grid grid-cols-1 gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <RequirementItem met={passwordReqs.length} text="At least 8 characters long" />
                    <RequirementItem met={passwordReqs.uppercase} text="At least 1 uppercase letter" />
                    <RequirementItem met={passwordReqs.special} text="At least 1 special character" />
                    <RequirementItem met={passwordReqs.number} text="At least 1 number" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-300 group-focus-within:text-green-500'}`} />
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border rounded-2xl transition-all outline-none text-gray-900 ${fieldErrors.confirmPassword
                        ? 'border-red-400 focus:ring-2 focus:ring-red-500/10'
                        : 'border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                        }`}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value.replace(/\s/g, ''))
                        if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' })
                      }}
                    />
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-2 ml-1 text-xs font-medium text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 hover:shadow-green-500/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

function RequirementItem({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${met ? 'text-green-500' : 'text-red-500'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-green-500 ring-4 ring-green-500/10' : 'bg-red-500 ring-4 ring-red-500/10'}`} />
      {text}
    </div>
  )
}
