function TermsAndConditions({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">Terms and Conditions</h2>
          <div
            onClick={onClose}
            className="text-white hover:text-green-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-4 text-gray-700">
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using the Laguna University Internship Tracking System ("the System"), 
                you accept and agree to be bound by the terms and provision of this agreement. If you do 
                not agree to abide by these terms, please do not use this System.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. User Registration and Accounts</h3>
              <p className="mb-2">
                To access the System, you must:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Be a currently enrolled student at Laguna University</li>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain the security of your password and account</li>
                <li>Verify your email address before accessing full System features</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="mt-2">
                You are responsible for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Account Approval</h3>
              <p>
                Student accounts require approval from university administrators. Registration does not 
                guarantee account activation. The university reserves the right to reject any registration 
                without providing a reason.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Internship Requirements</h3>
              <p className="mb-2">Students agree to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Submit all required documents as specified by the university</li>
                <li>Upload accurate and authentic documents</li>
                <li>Complete the required internship hours as mandated by their college/course</li>
                <li>Accurately log time entries (Time In/Time Out)</li>
                <li>Submit daily journals in the required format</li>
                <li>Comply with all university policies regarding internships</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">5. Document Submission</h3>
              <p className="mb-2">
                When uploading documents, you acknowledge that:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>All documents submitted are authentic and accurate</li>
                <li>You have the right to upload these documents</li>
                <li>Submitted documents may be reviewed and verified by university staff</li>
                <li>Rejected documents will be automatically deleted from the System</li>
                <li>Approved documents cannot be modified or replaced</li>
                <li>False or fraudulent documents may result in disciplinary action</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">6. Time Tracking</h3>
              <p>
                The time tracking feature is designed to accurately record internship hours. You agree to:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Log time entries honestly and accurately</li>
                <li>Not manipulate or falsify time records</li>
                <li>Report any technical issues with time tracking immediately</li>
                <li>Accept that time records may be audited by university administrators</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">7. Endorsement Letters</h3>
              <p>
                Endorsement letters are official university documents. The university reserves the right to:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Generate endorsement letters only for approved students</li>
                <li>Require completion of specific requirements before issuance</li>
                <li>Revoke endorsement letters if violations are discovered</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">8. Prohibited Activities</h3>
              <p className="mb-2">You may not:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Share your account credentials with others</li>
                <li>Upload false, fraudulent, or misleading information</li>
                <li>Attempt to access other users' accounts or data</li>
                <li>Interfere with or disrupt the System's operation</li>
                <li>Use the System for any illegal purposes</li>
                <li>Bypass any security measures or restrictions</li>
                <li>Upload malicious files or code</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">9. Intellectual Property</h3>
              <p>
                All content, features, and functionality of the System are owned by Laguna University and 
                are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">10. System Availability</h3>
              <p>
                While we strive to maintain continuous System availability, we do not guarantee uninterrupted 
                access. The System may be unavailable due to maintenance, updates, or unforeseen technical issues. 
                We are not liable for any consequences resulting from System downtime.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">11. Disciplinary Actions</h3>
              <p className="mb-2">
                Violation of these terms may result in:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Account suspension or termination</li>
                <li>Removal from the internship program</li>
                <li>University disciplinary proceedings</li>
                <li>Legal action if applicable</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">12. Modifications to Terms</h3>
              <p>
                Laguna University reserves the right to modify these Terms and Conditions at any time. 
                Continued use of the System after changes constitutes acceptance of the modified terms. 
                Users will be notified of significant changes via email or System notifications.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">13. Termination</h3>
              <p>
                We reserve the right to terminate or suspend your account at any time, without prior notice, 
                for conduct that we believe violates these Terms and Conditions or is harmful to other users, 
                the university, or third parties.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">14. Limitation of Liability</h3>
              <p>
                Laguna University shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use or inability to use the System.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">15. Contact Information</h3>
              <p>
                For questions regarding these Terms and Conditions, please contact:
              </p>
              <div className="mt-2 pl-4">
                <p>Laguna University</p>
                <p>Email: support@lagunauni.edu</p>
                <p>Phone: +63 123 456 7890</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">16. Governing Law</h3>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws 
                of the Republic of the Philippines.
              </p>
            </section>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                By clicking "I agree" during registration, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  )
}

export default TermsAndConditions