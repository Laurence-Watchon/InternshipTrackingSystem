import SchoolLogo from '../../../assets/Schoollogo.png'

function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src={SchoolLogo} 
                  alt="Mock University Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-bold">MOCK UNIVERSITY</span>
            </div>
            <p className="text-gray-400 text-sm">
              Streamlining internship management for students, coordinators, and institutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#objectives" className="text-gray-400 hover:text-white transition">
                  Objectives
                </a>
              </li>
              <li>
                <a href="#importance" className="text-gray-400 hover:text-white transition">
                  Importance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📧 support@mockuni.edu</li>
              <li>📞 +63 000 000 0000</li>
              <li>📍 Digital World</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;