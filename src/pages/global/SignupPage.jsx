import SignupForm from '../../components/custom/authForm/SignupForm'
import signupIllustration from '../../assets/signupformillustration.jpg'

function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Illustration (Full Size, No Padding) */}
            <div className="hidden md:block relative">
              <img 
                src={signupIllustration} 
                alt="Signup Illustration" 
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>

            {/* Right Side - Signup Form */}
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage