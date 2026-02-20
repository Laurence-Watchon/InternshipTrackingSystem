import { useEffect } from 'react'

/**
 * EndorsementHelp
 *
 * Props:
 *   isOpen   – boolean
 *   onClose  – () => void
 */
export default function EndorsementHelp({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const steps = [
    {
      number: 1,
      title: 'Submit All Required Documents',
      color: 'bg-green-500',
      details: [
        'Go to the Requirements page from the sidebar.',
        'Upload each of the 9 required documents (Registration Form, CV, Medical Clearance, MOA, etc.).',
        'Make sure every file is in the correct format (PDF, DOCX, JPG, etc.) as specified.',
        'For the AVP Self Introduction, paste your Google Drive video link.',
      ],
    },
    {
      number: 2,
      title: 'Wait for Document Approval',
      color: 'bg-green-500',
      details: [
        'After submitting, your documents will be reviewed by the coordinator.',
        'Each document will be marked as Approved, Pending, or Rejected.',
        'If a document is Rejected, re-upload the corrected version immediately.',
        'You can track each document\'s status on the Requirements page.',
      ],
    },
    {
      number: 3,
      title: 'Request Your Endorsement Letter',
      color: 'bg-green-500',
      details: [
        'Once ALL documents are marked Approved, the Request button on this page will become active.',
        'Click "Request Endorsement Letter" to send your request to the coordinator.',
        'You will see your request date displayed after submitting.',
      ],
    },
    {
      number: 4,
      title: 'Wait for Processing',
      color: 'bg-green-500',
      details: [
        'Processing typically takes 3–5 business days.',
        'The status will change to "In Process" while the coordinator prepares your letter.',
        'You do not need to do anything during this time — just wait.',
      ],
    },
    {
      number: 5,
      title: 'Download Your Endorsement Letter',
      color: 'bg-green-500',
      details: [
        'Once the letter is ready, the status will change to "Ready for Download".',
        'Click the Download button to save your endorsement letter.',
        'Present the letter to your internship company on or before your first day.',
        'Note: The letter is valid for the current academic year only.',
      ],
    },
  ]

  const faqs = [
    {
      q: 'What if my document gets rejected?',
      a: 'Go to the Requirements page, open the rejected document, and re-upload the correct file. The coordinator will review it again.',
    },
    {
      q: 'How long does approval of documents take?',
      a: 'Document review usually takes 1–3 business days per submission, depending on the coordinator\'s schedule.',
    },
    {
      q: 'Can I request the letter before all documents are approved?',
      a: 'No. The Request button will only become available once every requirement has been approved.',
    },
    {
      q: 'What if I don\'t receive my letter after 5 business days?',
      a: 'Contact your coordinator directly or visit the department office for follow-up.',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">How to Get Your Endorsement Letter</h2>
              <p className="text-xs text-gray-500">Follow these steps carefully</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 bg-white focus:outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div
          className="overflow-y-auto px-6 py-5 space-y-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#86efac transparent' }}
        >
          <style>{`
            .help-scroll::-webkit-scrollbar { width: 4px; }
            .help-scroll::-webkit-scrollbar-track { background: transparent; }
            .help-scroll::-webkit-scrollbar-thumb { background-color: #86efac; border-radius: 999px; }
          `}</style>

          {/* Steps */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Step-by-Step Guide</p>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  {/* Number */}
                  <div className={`flex-shrink-0 w-8 h-8 ${step.color} text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 mb-1">{step.title}</p>
                    <ul className="space-y-1">
                      {step.details.map((d, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                          <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Frequently Asked Questions</p>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-1">{faq.q}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact note */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-green-800 mb-1">Still need help?</p>
            <p className="text-xs text-green-700">
              Visit the department office or contact your OJT coordinator directly. Make sure to bring your student ID and a copy of your requirements checklist.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-white bg-green-500 rounded-lg focus:outline-none"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  )
}