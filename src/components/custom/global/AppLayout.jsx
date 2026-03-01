import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppSidebar from './AppSideBar'
import AppTopbar from './AppTopbar'

function AppLayout({ children, role = 'user' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        role={role}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Topbar */}
        <AppTopbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout