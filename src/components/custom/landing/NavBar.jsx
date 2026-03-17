import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import SchoolLogo from '../../../assets/Schoollogo.png'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const location = useLocation()
  const isScrollingProgrammatically = useRef(false)
  const scrollTimeout = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 64 // Height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      isScrollingProgrammatically.current = true
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Update URL
      const path = id === 'home' ? '/' : `/${id}`
      setActiveSection(id)
      
      if (location.pathname !== path) {
        navigate(path, { replace: true })
      }
      
      setIsMenuOpen(false)

      // Delay resetting the programmatic scroll flag until smooth scroll is likely finished
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 1000)
    }
  }

  const activeSectionRef = useRef(activeSection)
  const pathnameRef = useRef(location.pathname)
  const lastNavigatedPath = useRef(location.pathname)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    const sections = ['home', 'objectives', 'importance', 'footer']
    
    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const bodyHeight = document.body.offsetHeight
      const navbarHeight = 64

      // 1. Priority: Bottom of page (Footer)
      if (scrollPosition + windowHeight >= bodyHeight - 20) {
        updateActiveState('footer')
        return
      }

      // 2. Priority: Top of page (Home)
      if (scrollPosition < 50) {
        updateActiveState('home')
        return
      }

      // 3. Find the section that occupies the most of the upper-middle part of the viewport
      let currentSection = activeSectionRef.current
      let minDistance = Infinity

      sections.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          // A section is active if its top is above the upper-middle of the screen 
          // AND its bottom is below the navbar. 
          if (rect.top < windowHeight * 0.4 && rect.bottom > navbarHeight + 100) {
            currentSection = id
          }
        }
      })

      updateActiveState(currentSection)
    }

    const updateActiveState = (id) => {
      if (activeSectionRef.current !== id) {
        setActiveSection(id)
        
        // Instant URL update for scroll sync
        const landingPaths = ['/', '/home', '/objectives', '/importance', '/footer']
        if (landingPaths.includes(pathnameRef.current)) {
          const path = id === 'home' ? '/' : `/${id}`
          
          if (lastNavigatedPath.current !== path) {
            lastNavigatedPath.current = path
            window.history.replaceState(null, '', path)
          }
        }
      }
    }

    // Handle initial scroll on mount based on URL
    const initialPath = window.location.pathname.replace('/', '')
    const initialSection = initialPath || 'home'
    
    // Give elements a moment to render
    const initialTimer = setTimeout(() => {
      if (initialSection !== 'home') {
        scrollToSection(initialSection)
      } else {
        window.scrollTo(0, 0)
      }
    }, 100)

    // Use requestAnimationFrame for smooth performance
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      clearTimeout(initialTimer)
    }
  }, [navigate])

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'importance', label: 'Importance' },
    { id: 'footer', label: 'Footer' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 transition-all duration-300">
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
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-all duration-300 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-0 outline-none ${
                  activeSection === link.id 
                    ? 'text-green-600 bg-green-50 scale-105' 
                    : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/signup">
              <button className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition focus:outline-none focus:ring-0 outline-none">
                Register
              </button>
            </Link>
            <Link to="/login">
              <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-0 outline-none">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0 outline-none"
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
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left py-2 px-4 font-bold transition-all duration-200 rounded-lg focus:outline-none focus:ring-0 outline-none ${
                  activeSection === link.id 
                    ? 'text-green-600 bg-green-50 translate-x-1' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 space-y-2 border-t border-gray-200">
              <Link to="/signup" className="block" onClick={toggleMenu}>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition focus:outline-none focus:ring-0 outline-none">
                  Register
                </button>
              </Link>
              <Link to="/login" className="block" onClick={toggleMenu}>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-0 outline-none">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

