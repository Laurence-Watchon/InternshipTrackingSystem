import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import ClickableCard from '../../components/ui/ClickableCard'
import { useAuth } from '../../context/AuthContext'

function UserRequirements() {
  const { user } = useAuth()
  const [requirements, setRequirements] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [states, setStates] = useState({})
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    if (user?.college) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch requirements for the college
      const reqRes = await fetch(`http://localhost:3001/api/student/requirements?college=${encodeURIComponent(user.college)}&course=${encodeURIComponent(user.course)}`)
      const reqData = await reqRes.json()
      
      // 2. Fetch student's submissions
      const subRes = await fetch(`http://localhost:3001/api/student/my-submissions?studentId=${user.id}`)
      const subData = await subRes.json()

      if (reqRes.ok && subRes.ok) {
        setRequirements(reqData)
        setSubmissions(subData)
        
        // Initialize states based on requirements and submissions
        const newStates = {}
        reqData.forEach(r => {
          const sub = subData.find(s => s.requirementId === r._id)
          newStates[r._id] = {
            status: sub ? sub.status : 'pending',
            fileName: sub ? sub.fileName : '',
            fileUrl: sub ? sub.fileUrl : '',
            linkValue: (r.acceptedFileTypes.includes('url') && sub) ? sub.fileUrl : ''
          }
        })
        setStates(newStates)
      }
    } catch (err) {
      console.error('Error fetching student requirements:', err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleToggle(id) {
    setOpenId(prev => (prev === id ? null : id))
  }

  const handleStatusChange = async (id, newState) => {
    // If status is 'submitted', we need to send to backend
    if (newState.status === 'submitted') {
      try {
        const requirement = requirements.find(r => r._id === id)
        const body = {
          requirementId: id,
          studentId: user.id,
          college: user.college,
          course: user.course,
          fileName: newState.fileName || 'Link',
          fileUrl: newState.fileUrl || newState.linkValue
        }

        const response = await fetch('http://localhost:3001/api/student/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })

        if (response.ok) {
          setStates(prev => ({ ...prev, [id]: newState }))
          // Refresh data to be sure
          fetchData()
        } else {
          const errorData = await response.json()
          alert(errorData.error || 'Failed to submit document')
        }
      } catch (err) {
        console.error('Error submitting document:', err)
        alert('An error occurred during submission.')
      }
    } else {
      setStates(prev => ({ ...prev, [id]: newState }))
    }
  }

  const submitted = Object.values(states).filter(s => s.status === 'submitted' || s.status === 'verified').length
  const rejected  = Object.values(states).filter(s => s.status === 'rejected').length
  const pending   = Object.values(states).filter(s => s.status === 'pending').length
  const total     = requirements.length

  return (
    <AppLayout>
      <style>{noOutlineStyle}</style>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{user?.college} - {user?.course}</h1>
        <p className="text-gray-600 mt-1">Upload all required documents to complete your internship application.</p>
      </div>

      {/* Summary cards — stat-card style matching UserHome */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
        </div>

        {/* Submitted */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Submitted</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{submitted}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-400 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-2xl font-bold text-orange-500 mt-1">{pending}</p>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Rejected</h3>
          <p className="text-2xl font-bold text-red-500 mt-1">{rejected}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Overall Progress</p>
          <p className="text-sm text-gray-500">{submitted} / {total} submitted</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(submitted / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements list — 1 per row */}
      <div className="flex flex-col gap-3 min-h-[200px] relative">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : requirements.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
            No requirements have been set for your college yet.
          </div>
        ) : (
          requirements.map((req, index) => (
            <ClickableCard
              key={req._id}
              req={{
                ...req,
                id: index + 1, // display number
                acceptedTypes: req.acceptedFileTypes,
                inputType: req.acceptedFileTypes.includes('url') ? 'link' : 'file'
              }}
              state={states[req._id] || { status: 'pending', fileName: '', fileUrl: '', linkValue: '' }}
              isOpen={openId === req._id}
              onToggle={() => handleToggle(req._id)}
              onChange={(newState) => handleStatusChange(req._id, newState)}
            />
          ))
        )}
      </div>
    </AppLayout>
  )
}

export default UserRequirements