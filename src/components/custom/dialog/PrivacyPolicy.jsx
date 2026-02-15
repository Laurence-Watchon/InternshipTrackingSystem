function PrivacyPolicy({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
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
              Effective Date: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h3>
              <p>
                Laguna University ("we," "our," or "us") is committed to protecting your privacy. This 
                Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you use our Internship Tracking System ("the System").
              </p>
              <p className="mt-2">
                Please read this Privacy Policy carefully. By using the System, you agree to the collection 
                and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h3>
              
              <h4 className="font-semibold text-gray-900 mt-3 mb-1">2.1 Personal Information</h4>
              <p className="mb-2">We collect the following personal information when you register:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Full name (First name and Last name)</li>
                <li>Email address</li>
                <li>Student number</li>
                <li>Phone number</li>
                <li>College and course information</li>
                <li>Password (encrypted)</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">2.2 Academic and Internship Information</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Internship requirements and documents (resume, MOA, medical certificates, etc.)</li>
                <li>Time logs (date, time in, time out)</li>
                <li>Daily journals</li>
                <li>Internship progress and statistics</li>
                <li>Endorsement letter status</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">2.3 Automatically Collected Information</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Login timestamps</li>
                <li>System usage data</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h3>
              <p className="mb-2">We use your information for the following purposes:</p>
              
              <h4 className="font-semibold text-gray-900 mt-3 mb-1">3.1 System Functionality</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Creating and managing your account</li>
                <li>Verifying your identity and email address</li>
                <li>Processing and tracking internship requirements</li>
                <li>Recording and calculating internship hours</li>
                <li>Generating endorsement letters</li>
                <li>Storing and organizing daily journals</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">3.2 Communication</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Sending email verification links</li>
                <li>Notifying you of account status changes</li>
                <li>Providing updates on requirements and deadlines</li>
                <li>Sending system notifications and announcements</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">3.3 Administrative Purposes</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Reviewing and approving student registrations</li>
                <li>Monitoring internship progress and compliance</li>
                <li>Generating reports and statistics</li>
                <li>Ensuring academic integrity</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">3.4 System Improvement</h4>
              <ul className="list-disc ml-6 space-y-1">
                <li>Analyzing system usage patterns</li>
                <li>Identifying and fixing technical issues</li>
                <li>Improving user experience</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">4. Information Sharing and Disclosure</h3>
              
              <h4 className="font-semibold text-gray-900 mt-3 mb-1">4.1 Within the University</h4>
              <p>Your information may be shared with:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>University administrators and coordinators</li>
                <li>Faculty members responsible for internship programs</li>
                <li>Authorized university staff for academic purposes</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">4.2 External Parties</h4>
              <p>
                We may share information with external parties only in the following circumstances:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>With your explicit consent</li>
                <li>With host companies/organizations for endorsement purposes</li>
                <li>When required by law or legal process</li>
                <li>To protect the rights, property, or safety of the university, students, or others</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">4.3 What We Don't Share</h4>
              <p>We will NEVER:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Sell your personal information to third parties</li>
                <li>Share your information for marketing purposes</li>
                <li>Disclose your information to unauthorized parties</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h3>
              <p className="mb-2">We implement security measures to protect your information:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Password encryption using industry-standard algorithms</li>
                <li>Secure data transmission using SSL/TLS encryption</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security audits and updates</li>
                <li>Secure file storage for uploaded documents</li>
              </ul>
              <p className="mt-2">
                However, no method of transmission over the internet is 100% secure. While we strive to 
                protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">6. Data Retention</h3>
              <p>We retain your information for the following periods:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Active student data: Duration of enrollment + 5 years</li>
                <li>Internship records: 10 years for academic records compliance</li>
                <li>Rejected documents: Immediately deleted upon rejection</li>
                <li>Account data after graduation: Archived according to university policy</li>
              </ul>
              <p className="mt-2">
                Data may be retained longer if required by law or for legitimate university purposes.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">7. Your Rights</h3>
              <p className="mb-2">You have the following rights regarding your personal information:</p>
              
              <h4 className="font-semibold text-gray-900 mt-3 mb-1">7.1 Access</h4>
              <p>You can access and view your personal information within the System.</p>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">7.2 Correction</h4>
              <p>You can request correction of inaccurate information by contacting university administrators.</p>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">7.3 Data Portability</h4>
              <p>You can request a copy of your data in a commonly used format.</p>

              <h4 className="font-semibold text-gray-900 mt-3 mb-1">7.4 Deletion</h4>
              <p>
                You may request deletion of your account, subject to university record-keeping requirements 
                and legal obligations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">8. Cookies and Tracking</h3>
              <p>
                The System uses cookies and similar technologies to maintain your session and improve user 
                experience. These cookies:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Keep you logged in during your session</li>
                <li>Remember your preferences</li>
                <li>Analyze system usage (anonymized data)</li>
              </ul>
              <p className="mt-2">
                You can disable cookies in your browser settings, but this may limit System functionality.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">9. Third-Party Services</h3>
              <p>The System may integrate with third-party services such as:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Google Sign-In for authentication</li>
                <li>Email service providers for notifications</li>
              </ul>
              <p className="mt-2">
                These services have their own privacy policies. We recommend reviewing them.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">10. Children's Privacy</h3>
              <p>
                The System is intended for university students aged 18 and above. We do not knowingly 
                collect information from individuals under 18. If we discover such information has been 
                collected, we will delete it immediately.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">11. Data Breach Notification</h3>
              <p>
                In the event of a data breach that may compromise your personal information, we will:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Notify affected users within 72 hours</li>
                <li>Inform relevant authorities as required by law</li>
                <li>Take immediate action to secure the System</li>
                <li>Provide guidance on protective measures you can take</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">12. Changes to This Privacy Policy</h3>
              <p>
                We may update this Privacy Policy periodically. Changes will be posted on this page with 
                an updated "Effective Date." Continued use of the System after changes constitutes acceptance 
                of the updated policy. We will notify users of significant changes via email or System notifications.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">13. Contact Information</h3>
              <p className="mb-2">
                For questions, concerns, or requests regarding this Privacy Policy or your personal information, 
                please contact:
              </p>
              <div className="mt-2 pl-4">
                <p><strong>Data Protection Officer</strong></p>
                <p>Laguna University</p>
                <p>Email: privacy@lagunauni.edu</p>
                <p>Phone: +63 123 456 7890</p>
                <p>Address: Laguna, Philippines</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">14. Compliance</h3>
              <p>
                This Privacy Policy complies with the Data Privacy Act of 2012 (Republic Act No. 10173) 
                of the Philippines and its implementing rules and regulations.
              </p>
            </section>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-700">
                By using the Internship Tracking System, you acknowledge that you have read and understood 
                this Privacy Policy and agree to the collection, use, and disclosure of your information as 
                described herein.
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

export default PrivacyPolicy