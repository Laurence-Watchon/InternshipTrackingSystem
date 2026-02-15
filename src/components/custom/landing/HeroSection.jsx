import { Link } from 'react-router-dom'
import landingIllustration from '../../../assets/landingillustration.png'

function HeroSection() {
  return (
    <section id="home" className="pt-16 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-20 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Internship<br />Tracking System
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              A centralized platform that helps students, coordinators, and universities 
              manage internship requirements, endorsements, and progress efficiently.
            </p>
            <Link to="/signup">
              <button className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-700">
                Get Started
              </button>
            </Link>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={landingIllustration} 
                alt="Internship Tracking System Illustration" 
                className="w-full h-auto max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;