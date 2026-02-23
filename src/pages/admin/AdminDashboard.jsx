import { useState } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import AdminHomeCourses from '../../components/ui/AdminHomeCourses'
import Card from '../../components/ui/Card'
import RecentStudents from '../../components/ui/RecentStudents'
import PartnerCompanies from '../../components/ui/PartnerCompanies'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('all')

  // Mock data - replace with actual API data
  const collegeData = {
    name: 'COLLEGE OF COMPUTING STUDIES',
    code: 'CCS'
  }

  const courses = [
    { id: 'all', name: 'All', count: 156 },
    { id: 'bscs-ds', name: 'BSCS-DS', count: 45 },
    { id: 'bsit-ba', name: 'BSIT-BA', count: 58 },
    { id: 'bsit-sd', name: 'BSIT-SD', count: 53 }
  ]

  // Mock stats data
  const statsData = {
    all: {
      totalStudents: 156,
      deployed: 134,
      requirements: 89,
      pendingEndorsement: 12
    },
    'bscs-ds': {
      totalStudents: 45,
      deployed: 40,
      requirements: 32,
      pendingEndorsement: 3,
      requiredHours: 500
    },
    'bsit-ba': {
      totalStudents: 58,
      deployed: 51,
      requirements: 41,
      pendingEndorsement: 5,
      requiredHours: 500
    },
    'bsit-sd': {
      totalStudents: 53,
      deployed: 43,
      requirements: 16,
      pendingEndorsement: 4,
      requiredHours: 500
    }
  }

  const currentStats = statsData[activeTab]
  const isSpecificCourse = activeTab !== 'all'

  return (
    <AppLayout role="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{collegeData.name}</h1>
        <p className="text-gray-600 mt-1">
          Manage students, requirements, and endorsements for your college
        </p>
      </div>

      {/* Course Selection Tabs */}
      <div className="mb-6">
        <AdminHomeCourses
          courses={courses}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${isSpecificCourse ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6 mb-6`}>
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
      </div>

      {/* Two Column Layout - Same Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students List */}
        <RecentStudents activeCourse={activeTab} />

        {/* Companies List */}
        <PartnerCompanies />
      </div>
    </AppLayout>
  )
}

export default AdminDashboard