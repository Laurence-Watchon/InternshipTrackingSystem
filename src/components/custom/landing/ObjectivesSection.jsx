function ObjectivesSection() {
  const objectives = [
    {
      icon: "🤝",
      title: "Support Students",
      description: "Provide students with a clear view of internship requirements and monitor their internship progress."
    },
    {
      icon: "📋",
      title: "Manage Endorsement",
      description: "Streamline the approval process for internship documents and endorsement letters."
    },
    {
      icon: "⏰",
      title: "Track Hours",
      description: "Accurately record and monitor daily internship hours and remaining required hours."
    },
    {
      icon: "📊",
      title: "Monitor Progress",
      description: "Enable coordinators to easily track student compliance and internship completion status."
    }
  ];

  return (
    <section id="objectives" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          System Objectives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {objectives.map((objective, index) => (
            <div 
              key={index} 
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 text-center">
                {objective.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">
                {objective.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {objective.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ObjectivesSection;