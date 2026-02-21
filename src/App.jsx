import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/global/LandingPage'
import LoginPage from './pages/global/LoginPage'
import SignupPage from './pages/global/SignupPage'
import VerificationPage from './pages/global/VerificationPage'
import UserHome from './pages/user/Home'
import UserRequirements from './pages/user/Requirements'
import UserEndorsement from './pages/user/EndorsementLetter'
import UserTimeTracking from './pages/user/TimeTracking'
import UserJournal from './pages/user/DailyJournal'
import Profile from './pages/user/UserProfile'
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
        <Route path="/user/requirements" element={<UserRequirements />} />
        <Route path="/user/endorsement" element={<UserEndorsement />} />
        <Route path="/user/time-tracking" element={<UserTimeTracking />} />
        <Route path="/user/journal" element={<UserJournal />} />
        <Route path="/user/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App