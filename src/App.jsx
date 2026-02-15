import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/global/LandingPage'
import LoginPage from './pages/global/LoginPage'
import SignupPage from './pages/global/SignupPage'
import VerificationPage from './pages/global/VerificationPage'
import UserHome from './pages/user/Home'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verification" element={<VerificationPage />} />

        {/* User Dashboard Routes */}
        <Route path="/user/home" element={<UserHome />} />
      </Routes>
    </Router>
  )
}

export default App