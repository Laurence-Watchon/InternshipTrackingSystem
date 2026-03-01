import { Link, useLocation } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'
import { House, NotebookText, CircleCheckBig, Clock, BookOpen, User, Users, File, UserRoundPlus } from 'lucide-react';

function AppSidebar({ isOpen, onClose, role = 'user' }) {
  const location = useLocation()

  const menuItems = {
    user: [
      {
        title: 'Dashboard',
        path: '/user/home',
        icon: ( 
          <House size={20}/>
        )
      },
      {
        title: 'Requirements',
        path: '/user/requirements',
        icon: (
          <NotebookText size={20}/>
        )
      },
      {
        title: 'Endorsement Letter',
        path: '/user/endorsement',
        icon: (
          <CircleCheckBig size={20}/>
        )
      },
      {
        title: 'Time Tracking',
        path: '/user/time-tracking',
        icon: (
          <Clock size={20}/>
        )
      },
      {
        title: 'Daily Journal',
        path: '/user/journal',
        icon: (
          <BookOpen size={20}/>
        )
      },
      {
        title: 'Profile',
        path: '/user/profile',
        icon: (
          <User size={20}/>
        )
      },
    ],
    admin: [
      {
        title: 'Dashboard',
        path: '/admin/home',
        icon: (
          <House size={20}/>
        )
      },
      {
        title: 'Student Management',
        path: '/admin/students',
        icon: (
          <Users size={20}/>
        )
      },
      {
        title: 'Requirements',
        path: '/admin/requirements',
        icon: (
          <NotebookText size={20}/>
        )
      },
      {
        title: 'Student Requirements',
        path: '/admin/students-requirements',
        icon: (
          <File size={20}/>
        )
      },
      {
        title: 'Endorsements Letter',
        path: '/admin/endorsements',
        icon: (
          <CircleCheckBig size={20}/>
        )
      },
      {
        title: 'Pending Approvals',
        path: '/admin/approvals',
        icon: (
          <UserRoundPlus size={20}/>
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
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
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
                  {item.icon}
                  <span className="text-sm">{item.title}</span>
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