import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import Card from '../../components/ui/Card'
import RecentStudents from '../../components/ui/RecentStudents'
import PartnerCompanies from '../../components/ui/PartnerCompanies'
import Skeleton from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const [monitoringData, setMonitoringData] = useState([])
  const [collegeSettings, setCollegeSettings] = useState(null)
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const loadData = async () => {
      if (!user?.college) return
      
      setIsLoading(true)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800))

      try {
        const [monitoringRes, settingsRes, companiesRes] = await Promise.all([
          fetch(`http://localhost:3001/api/admin/students-monitoring?college=${encodeURIComponent(user.college)}`),
          fetch(`http://localhost:3001/api/admin/college-settings?college=${encodeURIComponent(user.college)}`),
          fetch(`http://localhost:3001/api/admin/partner-companies?college=${encodeURIComponent(user.college)}`)
        ])
        
        const [monitoring, settings, companiesData] = await Promise.all([
          monitoringRes.json(),
          settingsRes.json(),
          companiesRes.json()
        ])
        
        if (monitoringRes.ok) {
          setMonitoringData(monitoring)
        }
        if (settingsRes.ok) {
          setCollegeSettings(settings)
        }
        if (companiesRes.ok) {
          setCompanies(companiesData)
        }
        await minLoadingTime
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user?.college])

  const coursesByCollege = {
    'COLLEGE OF ARTS AND SCIENCES': [
      { value: 'BAComm', label: 'BA Communication' },
      { value: 'BA-Psych', label: 'BA Psychology' },
      { value: 'BS-Psych', label: 'BS Psychology' }
    ],
    'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY': [
      { value: 'BSA', label: 'BS Accountancy' },
      { value: 'BSAIS', label: 'BS Accounting Information System' },
      { value: 'BSEntrep', label: 'BS Entrepreneurship' },
      { value: 'BSTM', label: 'BS Tourism Management' }
    ],
    'COLLEGE OF COMPUTING STUDIES': [
      { value: 'BSCS-DS', label: 'BS Computer Science - Data Science' },
      { value: 'BSIT-BA', label: 'BS Information Technology - Business Analytics' },
      { value: 'BSIT-SD', label: 'BS Information Technology - Software Development' }
    ],
    'COLLEGE OF ENGINEERING': [
      { value: 'BSME', label: 'BS Mechanical Engineering' }
    ],
    'COLLEGE OF EDUCATION': [
      { value: 'BEED', label: 'Bachelor of Elementary Education' },
      { value: 'BPEd', label: 'Bachelor of Physical Education' },
      { value: 'BSED-English', label: 'BS Education (Major in English)' },
      { value: 'BSED-Math', label: 'BS Education (Major in Mathematics)' },
      { value: 'BSED-Science', label: 'BS Education (Major in Science)' }
    ]
  }

  const collegeMapping = {
    'CAS': 'COLLEGE OF ARTS AND SCIENCES',
    'CBAA': 'COLLEGE OF BUSINESS ADMINISTRATION AND ACCOUNTANCY',
    'CCS': 'COLLEGE OF COMPUTING STUDIES',
    'COE': 'COLLEGE OF ENGINEERING',
    'COED': 'COLLEGE OF EDUCATION'
  }

  const getFullCollegeName = (name) => {
    if (!name) return 'COLLEGE OF COMPUTING STUDIES'
    const upper = name.toUpperCase()
    if (collegeMapping[upper]) return collegeMapping[upper]
    return upper
  }

  const resolvedCollegeName = getFullCollegeName(user?.college)

  const getCourseStats = (courseId) => {
    const students = courseId === 'all' 
      ? monitoringData 
      : monitoringData.filter(s => s.course.toLowerCase() === courseId.toLowerCase())

    const totalStudents = students.length
    
    // Get required hours for this specific tab/course
    let reqHours = 0
    if (courseId === 'all') {
      // For "All", maybe average or just a default? 
      // User says "based on database", so if they are all same, it's easy.
      // We'll just show N/A or a primary course hour for "All".
      reqHours = '---'
    } else {
      // Find course value from the activeTab (which is lowercase in the tab id)
      const courses = coursesByCollege[resolvedCollegeName] || []
      const courseMatch = courses.find(c => c.value.toLowerCase() === courseId.toLowerCase())
      if (courseMatch && collegeSettings?.requiredHours) {
        reqHours = collegeSettings.requiredHours[courseMatch.value] || 0
      }
    }

    if (totalStudents === 0) return {
      totalStudents: 0,
      deployed: 0,
      requirements: 0,
      pendingEndorsement: 0,
      requiredHours: reqHours || 0
    }

    // Logic for "deployed": if they have at least one submission that is "approved" 
    // or specifically an endorsement requirement (this might need refinement based on exact req titles)
    const deployed = students.filter(s => 
      s.submissions.some(sub => sub.status === 'approved' && sub.requirementTitle.toLowerCase().includes('endorsement'))
    ).length

    // Logic for "requirements": average completion or students who completed all
    const requirements = students.filter(s => 
      s.submissions.length > 0 && s.submissions.every(sub => sub.status === 'approved')
    ).length

    // Pending endorsements
    const pendingEndorsement = students.filter(s => 
      s.submissions.some(sub => sub.status === 'pending' && sub.requirementTitle.toLowerCase().includes('endorsement'))
    ).length

    return {
      totalStudents,
      deployed,
      requirements,
      pendingEndorsement,
      requiredHours: reqHours
    }
  }

  const currentStats = getCourseStats(activeTab)
  
  const courses = [
    { id: 'all', name: 'All', count: monitoringData.length },
    ...(coursesByCollege[resolvedCollegeName] || []).map(c => ({
      id: c.value.toLowerCase(),
      name: c.value,
      count: monitoringData.filter(s => s.course === c.value).length
    }))
  ]
  const isSpecificCourse = activeTab !== 'all'

  return (
    <AppLayout role="admin" isLoading={isLoading}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">{resolvedCollegeName}</h1>
        <p className="text-gray-600 mt-1">
          Manage students, requirements, and endorsements for your college
        </p>
      </div>

      {/* Course Selection Tabs */}
      <div className="mb-6">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-2 flex space-x-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={40} width={100} className="rounded-md" />
            ))}
          </div>
        ) : (
          <AdminHomeCourses
            courses={courses}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isSpecificCourse ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6 mb-6`}>
        {isLoading ? (
          [...Array(isSpecificCourse ? 5 : 4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <Skeleton variant="rectangular" height={48} width={48} className="mb-4" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" height={32} width="40%" />
            </div>
          ))
        ) : (
          <>
            {/* Total Students */}
            <Card
              title="Total Students"
              value={currentStats.totalStudents}
              color="bg-blue-500"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />

            {/* Deployed */}
            <Card
              title="Deployed"
              value={currentStats.deployed}
              color="bg-green-500"
              sub={`${((currentStats.deployed / currentStats.totalStudents) * 100).toFixed(0)}% of total`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Requirements */}
            <Card
              title="Requirements"
              value={currentStats.requirements}
              color="bg-purple-500"
              sub="Completed"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />

            {/* Pending Endorsement */}
            <Card
              title="Pending Endorsement"
              value={currentStats.pendingEndorsement}
              color="bg-orange-500"
              sub="Awaiting approval"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* Required Hours - Only for specific course */}
            {isSpecificCourse && (
              <Card
                title="Required Hours"
                value={currentStats.requiredHours}
                color="bg-yellow-500"
                sub="Per student"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            )}
          </>
        )}
      </div>

      {/* Two Column Layout - Same Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="bg-white rounded-lg shadow p-6 h-[400px]">
              <Skeleton variant="rectangular" height="100%" />
            </div>
            <div className="bg-white rounded-lg shadow p-6 h-[400px]">
              <Skeleton variant="rectangular" height="100%" />
            </div>
          </>
        ) : (
          <>
            {/* Students List */}
            <RecentStudents 
          students={monitoringData}
          activeCourse={activeTab} 
        />

            {/* Companies List */}
            <PartnerCompanies companies={companies} />
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default AdminDashboard