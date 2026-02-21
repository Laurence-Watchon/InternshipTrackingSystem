import AppLayout from '../../components/custom/global/AppLayout'
import WeeklyHours from '../../components/ui/WeeklyHours'
import CircularProgress from '../../components/ui/CircularProgress'

const scrollbarStyle = `
  .custom-scroll::-webkit-scrollbar { width: 4px; }
  .custom-scroll::-webkit-scrollbar-track { background: transparent; }
  .custom-scroll::-webkit-scrollbar-thumb { background-color: #86efac; border-radius: 999px; }
  .custom-scroll::-webkit-scrollbar-thumb:hover { background-color: #4ade80; }
  .custom-scroll { scrollbar-width: thin; scrollbar-color: #86efac transparent; }
`

// Replace with real API data
const WEEKLY_DATA = [
  { week: 'Week 1',  hours: 20 },
  { week: 'Week 2',  hours: 25 },
  { week: 'Week 3',  hours: 28 },
  { week: 'Week 4',  hours: 22 },
  { week: 'Week 5',  hours: 25 },
]

const APPROVED_HOURS = 120
const REQUIRED_HOURS = 500

function UserHome() {
  const stats = [
    {
      title: 'Requirements',
      value: '3 / 8',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-green-500',
      percentage: '38%',
    },
    {
      title: 'Endorsement Letter',
      value: 'In Process',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Hours',
      value: '120 / 500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
      percentage: '24%',
    },
    {
      title: 'Journal Entries',
      value: '15',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
  ]

  const recentActivities = [
    { title: 'Time logged',          description: 'You logged 8 hours today',                       time: '2 hours ago',  icon: '⏰', color: 'bg-blue-100 text-blue-600'    },
    { title: 'Document approved',    description: 'Your resume has been approved',                  time: '5 hours ago',  icon: '✅', color: 'bg-green-100 text-green-600'  },
    { title: 'Journal submitted',    description: 'Daily journal for Feb 15 submitted',             time: '1 day ago',    icon: '📝', color: 'bg-purple-100 text-purple-600' },
    { title: 'Requirement uploaded', description: 'Medical certificate submitted for review',       time: '2 days ago',   icon: '📄', color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Hours milestone',      description: 'You reached 100 hours!',                        time: '3 days ago',   icon: '🏆', color: 'bg-orange-100 text-orange-600' },
    { title: 'Supervisor comment',   description: 'Your supervisor left a comment on your journal', time: '4 days ago',   icon: '💬', color: 'bg-blue-100 text-blue-600'    },
    { title: 'Document rejected',    description: 'Please re-upload your barangay clearance',      time: '4 days ago',   icon: '❌', color: 'bg-red-100 text-red-600'      },
    { title: 'Journal submitted',    description: 'Daily journal for Feb 12 submitted',             time: '5 days ago',   icon: '📝', color: 'bg-purple-100 text-purple-600' },
    { title: 'Time logged',          description: 'You logged 7.5 hours',                          time: '5 days ago',   icon: '⏰', color: 'bg-blue-100 text-blue-600'    },
    { title: 'Account verified',     description: 'Your student account has been verified',         time: '6 days ago',   icon: '🎉', color: 'bg-green-100 text-green-600'  },
  ]

  const upcomingTasks = [
    { task: 'Submit Medical Certificate', deadline: 'Feb 20, 2026', priority: 'high'   },
    { task: 'Complete 40 more hours',     deadline: 'Mar 15, 2026', priority: 'medium' },
    { task: 'Upload daily journal',       deadline: 'Today',        priority: 'high'   },
    { task: 'Get supervisor signature',   deadline: 'Feb 25, 2026', priority: 'high'   },
    { task: 'Submit weekly report',       deadline: 'Feb 22, 2026', priority: 'medium' },
    { task: 'Update endorsement letter',  deadline: 'Mar 1, 2026',  priority: 'medium' },
  ]

  return (
    <AppLayout>
      <style>{scrollbarStyle}</style>

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John! 👋</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your internship today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            {stat.percentage && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${stat.color} h-2 rounded-full`} style={{ width: stat.percentage }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activities + Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6 overflow-y-auto custom-scroll" style={{ maxHeight: '340px' }}>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${activity.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow flex flex-col">
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="p-6 overflow-y-auto custom-scroll" style={{ maxHeight: '340px' }}>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.deadline}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0
                      ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Hours (2/3) + Overall Progress (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyHours weeklyData={WEEKLY_DATA} target={40} />
        </div>
        <div className="lg:col-span-1">
          <CircularProgress completed={APPROVED_HOURS} required={REQUIRED_HOURS} />
        </div>
      </div>

    </AppLayout>
  )
}

export default UserHome