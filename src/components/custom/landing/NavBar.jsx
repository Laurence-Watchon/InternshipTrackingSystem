import { useState } from 'react'
import { Link } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and University Name */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img 
                src={SchoolLogo} 
                alt="Laguna University Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <span className="font-bold text-sm sm:text-base lg:text-lg">LAGUNA UNIVERSITY</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#home" className="text-gray-700 hover:text-green-600 font-medium">
              Home
            </a>
            <a href="#objectives" className="text-gray-700 hover:text-green-600 font-medium">
              Objectives
            </a>
            <a href="#importance" className="text-gray-700 hover:text-green-600 font-medium">
              Importance
            </a>
            <a href="#footer" className="text-gray-700 hover:text-green-600 font-medium">
              Footer
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/signup">
              <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-700">
                Register
              </button>
            </Link>
            <Link to="/login">
              <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-green-700">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <a
              href="#home"
              className="block py-2 text-gray-700 hover:text-green-600 font-medium"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="#objectives"
              className="block py-2 text-gray-700 hover:text-green-600 font-medium"
              onClick={toggleMenu}
            >
              Objectives
            </a>
            <a
              href="#importance"
              className="block py-2 text-gray-700 hover:text-green-600 font-medium"
              onClick={toggleMenu}
            >
              Importance
            </a>
            <a
              href="#footer"
              className="block py-2 text-gray-700 hover:text-green-600 font-medium"
              onClick={toggleMenu}
            >
              Footer
            </a>

            <div className="pt-3 space-y-2 border-t border-gray-200">
              <Link to="/signup" className="block" onClick={toggleMenu}>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-700">
                  Register
                </button>
              </Link>
              <Link to="/login" className="block" onClick={toggleMenu}>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-green-700">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;