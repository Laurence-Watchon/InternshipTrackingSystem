import { Link } from 'react-router-dom'

function ImportanceSection() {
  const benefits = [
    {
      title: "Centralized Management",
      description: "All internship-related documents, requirements, and progress are stored in one accessible platform, reducing confusion and paperwork.",
      icon: "📁"
    },
    {
      title: "Real-Time Tracking",
      description: "Students and coordinators can monitor internship hours and progress in real-time, ensuring timely completion of requirements.",
      icon: "⚡"
    },
    {
      title: "Improved Communication",
      description: "Facilitates seamless communication between students, coordinators, and universities regarding internship status and requirements.",
      icon: "💬"
    },
    {
      title: "Efficient Approval Process",
      description: "Streamlines the endorsement and approval workflow, reducing processing time and administrative burden.",
      icon: "✅"
    },
    {
      title: "Data-Driven Insights",
      description: "Provides analytics and reports that help institutions improve their internship programs and student outcomes.",
      icon: "📈"
    },
    {
      title: "Compliance Assurance",
      description: "Ensures all students meet required internship hours and documentation standards before graduation.",
      icon: "🎓"
    }
  ];

  return (
    <section id="importance" className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
          Why This System Matters
        </h2>
        <p className="text-center text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
          The Internship Tracking System addresses critical challenges in managing student 
          internships, providing benefits for all stakeholders involved.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-green-600 text-white rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Internship Management?
            </h3>
            <p className="text-green-100 text-lg mb-8">
              Join hundreds of students and coordinators who have streamlined their internship process.
            </p>
            <Link to="/signup">
              <button className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-700">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImportanceSection;