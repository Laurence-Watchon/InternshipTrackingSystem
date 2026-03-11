import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import NotFound from './components/ui/NotFound'
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
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPendingApprovals from './pages/admin/AdminPendingApprovals'
import RequirementsManagement from './pages/admin/AdminRequirements'
import StudentManagement from './pages/admin/AdminStudents'
import AdminEndorsements from './pages/admin/AdminEndorsement'
import AdminStudentRequirements from './pages/admin/AdminStudentRequirements'
import AdminStudentRequirementsDetail from './pages/admin/AdminStudentRequirementsDetails'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verification" element={<VerificationPage />} />

          {/* User Dashboard Routes */}
          <Route path="/user/*" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Routes>
                <Route path="home" element={<UserHome />} />
                <Route path="requirements" element={<UserRequirements />} />
                <Route path="endorsement" element={<UserEndorsement />} />
                <Route path="time-tracking" element={<UserTimeTracking />} />
                <Route path="journal" element={<UserJournal />} />
                <Route path="profile" element={<Profile />} />
                {/* User Nested Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Admin Dashboard Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="home" element={<AdminDashboard />} />
                <Route path="approvals" element={<AdminPendingApprovals />} />
                <Route path="requirements" element={<RequirementsManagement />} />
                <Route path="students" element={<StudentManagement />} />
                <Route path="endorsements" element={<AdminEndorsements />} />
                <Route path="students-requirements" element={<AdminStudentRequirements />} />
                <Route path="students-requirements/:studentId" element={<AdminStudentRequirementsDetail />} />
                {/* Admin Nested Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Global Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App