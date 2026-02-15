import LoginForm from '../../components/custom/authForm/LoginForm'

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Single Column - Login Form Only */}
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage