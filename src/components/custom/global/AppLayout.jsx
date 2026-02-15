import { useState } from 'react'
import AppSidebar from './AppSidebar'
import AppTopbar from './AppTopbar'

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Topbar */}
        <AppTopbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout