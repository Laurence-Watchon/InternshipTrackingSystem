import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import PageTitle from '../../ui/PageTitle'
import Dialog from '../../ui/Dialog'

function AppTopbar({ onMenuClick }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogoutClick = () => {
        setShowLogoutDialog(true)
        setShowProfileMenu(false)
    }

    const confirmLogout = () => {
        logout()
        navigate('/login')
    }

    const getInitials = () => {
        if (!user) return '??'
        const firstInitial = user.firstName ? user.firstName[0] : ''
        const lastInitial = user.lastName ? user.lastName[0] : ''
        return (firstInitial + lastInitial).toUpperCase() || 'U'
    }

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-30">
                <div className="h-full px-4 flex items-center justify-between">
                    {/* Left side - Menu button for mobile */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none flex-shrink-0 p-2"
                            aria-label="Open menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="min-w-0 flex-1">
                            <PageTitle />
                        </div>
                    </div>

                    {/* Right side - Notifications, Profile */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <>
                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(!showProfileMenu)
                                        }}
                                        className="bg-white flex items-center space-x-2 sm:space-x-3 focus:outline-none p-2 rounded-lg hover:bg-green-50"
                                        aria-label="User menu"
                                    >
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {getInitials()}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">{user ? user.role : ''}</p>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {showProfileMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowProfileMenu(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                                <div className="px-4 py-2 border-b border-gray-200">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">{user ? user.email : ''}</p>
                                                </div>
                                                <Link
                                                    to={user?.role === 'admin' ? '/admin/home' : '/user/profile'}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setShowProfileMenu(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>My Profile</span>
                                                </Link>
                                                <Link
                                                    to={user?.role === 'admin' ? '/admin/requirements' : '/user/requirements'}
                                                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    onClick={() => setShowProfileMenu(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>Requirements</span>
                                                </Link>
                                                <hr className="my-2 border-gray-200" />
                                                <button
                                                    onClick={handleLogoutClick}
                                                    className="bg-white flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left focus:outline-none"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                        </>
                    </div>
                </div>
            </header>

            {/* Logout Confirmation Dialog */}
            <Dialog
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                confirmLabel="Logout"
                cancelLabel="Cancel"
            />
        </>
    )
}

export default AppTopbar