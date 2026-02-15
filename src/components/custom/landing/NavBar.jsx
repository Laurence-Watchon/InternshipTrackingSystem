import { Link } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and University Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={SchoolLogo} 
                alt="Laguna University Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="font-bold text-lg">LAGUNA UNIVERSITY</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Buttons */}
          <div className="flex items-center space-x-3">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;