import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import SchoolLogo from '../../../assets/Schoollogo.png'
import { House, NotebookText, CircleCheckBig, Clock, BookOpen, User, Users, File, UserRoundPlus } from 'lucide-react';

function AppSidebar({ isOpen, onClose, role = 'user' }) {
  const location = useLocation()
  const { user } = useAuth()
  const [pendingCount, setPendingCount] = useState(0)

  // Fetch strictly for Admin whenever route changes
  useEffect(() => {
    if (role === 'admin' && user?.college) {
      const fetchAdminPendingCount = async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/admin/pending?college=${user.college}`)
          if (res.ok) {
            const data = await res.json()
            setPendingCount(data.length)
          }
        } catch (err) {
          console.error("Failed to fetch pending count", err)
        }
      }
      fetchAdminPendingCount()

      window.addEventListener('pendingCountUpdated', fetchAdminPendingCount)
      return () => window.removeEventListener('pendingCountUpdated', fetchAdminPendingCount)
    }

    // Handle Student Pending Requirements Count
    if (role === 'user' && user?.id) {
      const fetchUserPendingCount = async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/student/pending-requirements-count?studentId=${user.id}&college=${user.college}&course=${user.course || ''}`)
          if (res.ok) {
            const data = await res.json()
            setPendingCount(data.count)
          }
        } catch (err) {
          console.error("Failed to fetch user pending count", err)
        }
      }
      fetchUserPendingCount()

      window.addEventListener('userRequirementsUpdated', fetchUserPendingCount)
      return () => window.removeEventListener('userRequirementsUpdated', fetchUserPendingCount)
    }
  }, [role, location.pathname, user])

  const menuItems = {
    user: [
      {
        title: 'Dashboard',
        path: '/user/home',
        icon: (
          <House size={20} />
        )
      },
      {
        title: 'Requirements',
        path: '/user/requirements',
        icon: (
          <NotebookText size={20} />
        )
      },
      {
        title: 'Endorsement Letter',
        path: '/user/endorsement',
        icon: (
          <CircleCheckBig size={20} />
        )
      },
      {
        title: 'Time Tracking',
        path: '/user/time-tracking',
        icon: (
          <Clock size={20} />
        )
      },
      {
        title: 'Daily Journal',
        path: '/user/journal',
        icon: (
          <BookOpen size={20} />
        )
      },
      {
        title: 'Profile',
        path: '/user/profile',
        icon: (
          <User size={20} />
        )
      },
    ],
    admin: [
      {
        title: 'Dashboard',
        path: '/admin/home',
        icon: (
          <House size={20} />
        )
      },
      {
        title: 'Student Management',
        path: '/admin/students',
        icon: (
          <Users size={20} />
        )
      },
      {
        title: 'Requirements',
        path: '/admin/requirements',
        icon: (
          <NotebookText size={20} />
        )
      },
      {
        title: 'Student Requirements',
        path: '/admin/students-requirements',
        icon: (
          <File size={20} />
        )
      },
      {
        title: 'Endorsements Letter',
        path: '/admin/endorsements',
        icon: (
          <CircleCheckBig size={20} />
        )
      },
      {
        title: 'Pending Approvals',
        path: '/admin/approvals',
        icon: (
          <UserRoundPlus size={20} />
        )
      }
    ]
  }

  const currentMenuItems = menuItems[role] || menuItems.user

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={SchoolLogo}
              alt="Laguna University"
              className="w-8 h-8"
            />
            <span className="font-bold text-sm sm:text-base text-gray-900">LU Internship</span>
          </div>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none p-1"
            aria-label="Close sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 h-[calc(100vh-4rem)]">
          <ul className="space-y-1 px-3">
            {currentMenuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition-colors group
                      ${isActive(item.path)
                        ? 'bg-green-50 text-green-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                      }
                    `}
                    onClick={(e) => {
                      const currentPath = location.pathname
                      const targetPath = item.path

                      // If already inside students-requirements details, prevent navigation
                      if (
                        targetPath === '/admin/students-requirements' &&
                        currentPath.startsWith('/admin/students-requirements/')
                      ) {
                        e.preventDefault()
                        return
                      }

                      // Close sidebar on mobile
                      if (window.innerWidth < 1024) onClose()
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="text-sm">{item.title}</span>
                    </div>

                    {/* Pending Approvals / User Requirements Badge */}
                    {((role === 'admin' && item.title === 'Pending Approvals') || 
                      (role === 'user' && item.title === 'Requirements')) && pendingCount > 0 && (
                      <div className="ml-auto flex items-center">
                        <span className="flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full shadow-sm">
                          {pendingCount}
                        </span>
                      </div>
                    )}

                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default AppSidebar