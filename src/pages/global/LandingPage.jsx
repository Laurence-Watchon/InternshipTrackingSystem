import Navbar from '../../components/custom/landing/NavBar.jsx'
import HeroSection from '../../components/custom/landing/HeroSection'
import ObjectivesSection from '../../components/custom/landing/ObjectivesSection'
import ImportanceSection from '../../components/custom/landing/ImportanceSection'
import Footer from '../../components/custom/landing/Footer'
import '../../App.css'

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Fixed Navbar - stays at top */}
      <Navbar />

      {/* Scrollable Content */}
      <main>
        <HeroSection />
        <ObjectivesSection />
        <ImportanceSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default LandingPage