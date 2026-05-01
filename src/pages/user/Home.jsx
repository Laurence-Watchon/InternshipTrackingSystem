import { apiFetch } from '../../config/api.js';
import { useState, useEffect } from 'react'
import AppLayout from '../../components/custom/global/AppLayout'
import WeeklyHours from '../../components/ui/WeeklyHours'
import CircularProgress from '../../components/ui/CircularProgress'
import Skeleton from '../../components/ui/Skeleton'
import { 
  NotebookText, 
  CircleCheckBig, 
  Hourglass, 
  BookOpen, 
  Clock, 
  FileText, 
  Mail, 
  PenTool, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  FileCheck, 
  FileX,
  Trophy,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PendingApprovalDialog from '../../components/custom/dialog/PendingApprovalDialog'
import { useNavigate } from 'react-router-dom'

const scrollbarStyle = `
  .custom-scroll::-webkit-scrollbar { width: 4px; }
  .custom-scroll::-webkit-scrollbar-track { background: transparent; }
  .custom-scroll::-webkit-scrollbar-thumb { background-color: #86efac; border-radius: 999px; }
  .custom-scroll::-webkit-scrollbar-thumb:hover { background-color: #4ade80; }
  .custom-scroll { scrollbar-width: thin; scrollbar-color: #86efac transparent; }
`

function UserHome() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState([])
  const [studentStats, setStudentStats] = useState({
    requirements: '0 / 0',
    requirementsPercent: '0%',
    hours: '0 / 0',
    hoursPercent: '0%',
    requiredHours: 0,
    approvedHours: 0,
    endorsementStatus: 'Pending',
    journalEntries: '0'
  })
  const [activities, setActivities] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const studentId = user?.id || user?._id
      if (!studentId) return

      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));

      try {
        // Fetch all needed data in parallel
        const [reqRes, subRes, settingsRes, logsRes, journalsRes, endRes, activitiesRes] = await Promise.all([
          apiFetch(`/api/student/requirements?college=${encodeURIComponent(user.college)}`),
          apiFetch(`/api/student/my-submissions?studentId=${studentId}`),
          apiFetch(`/api/student/college-settings?college=${encodeURIComponent(user.college)}`),
          apiFetch(`/api/student/time-logs?studentId=${studentId}`),
          apiFetch(`/api/student/journals?studentId=${studentId}`),
          apiFetch(`/api/student/endorsement-status?studentId=${studentId}`),
          apiFetch(`/api/student/activities?studentId=${studentId}`)
        ])

        const [reqs, subs, settings, logs, journals, endData, activitiesData] = await Promise.all([
          reqRes.json(),
          subRes.json(),
          settingsRes.json(),
          logsRes.json(),
          journalsRes.json(),
          endRes.json(),
          activitiesRes.json()
        ])

        if (reqRes.ok && subRes.ok && settingsRes.ok) {
          // Calculate Requirements progress
          const submittedCount = subs.filter(s => s.status === 'submitted' || s.status === 'verified').length
          const totalReqs = reqs.length
          const reqPercent = totalReqs > 0 ? (submittedCount / totalReqs) * 100 : 0

          // Get required hours for this student's course
          const reqHours = (settings.requiredHours && settings.requiredHours[user.course]) || 0

          // Calculate total hours from time logs
          const appHours = logsRes.ok ? logs
            .reduce((sum, log) => sum + (log.hours || 0), 0) : 0
          
          const hoursPercent = reqHours > 0 ? (appHours / reqHours) * 100 : 0

          // Calculate Weekly Stats
          if (logsRes.ok && logs.length > 0) {
            const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
            const startDate = new Date(sortedLogs[0].date);
            const weeklyHoursMap = {};
            
            sortedLogs.forEach(log => {
              const logDate = new Date(log.date);
              const diffDays = Math.floor((logDate - startDate) / (1000 * 60 * 60 * 24));
              const weekNum = Math.floor(diffDays / 7) + 1;
              weeklyHoursMap[weekNum] = (weeklyHoursMap[weekNum] || 0) + (log.hours || 0);
            });

            const maxWeek = Math.max(...Object.keys(weeklyHoursMap).map(Number), 1);
            const weeklyDataArr = [];
            for (let i = 1; i <= maxWeek; i++) {
              weeklyDataArr.push({
                week: `Week ${i}`,
                hours: weeklyHoursMap[i] || 0
              });
            }
            setWeeklyStats(weeklyDataArr);
          } else {
            // Default to Week 1 with 0 hours if no logs yet
            setWeeklyStats([{ week: 'Week 1', hours: 0 }]);
          }

          // Endorsement status from endorsement_requests collection
          let endStatus = 'Pending'
          if (endRes.ok && endData) {
            // Check for explicit status or if a scanned file exists
            if (endData.status === 'ready' || endData.status === 'completed' || endData.scannedFileUrl) {
              endStatus = 'Deployed'
            } else if (endData.status === 'in_process' || endData.status === 'pending') {
              endStatus = 'In Process'
            }
          }

          setStudentStats({
            requirements: `${submittedCount} / ${totalReqs}`,
            requirementsPercent: `${reqPercent}%`,
            hours: `${appHours} / ${reqHours}`,
            hoursPercent: `${hoursPercent}%`,
            requiredHours: reqHours,
            approvedHours: appHours,
            endorsementStatus: endStatus,
            journalEntries: journalsRes.ok ? journals.length.toString() : '0'
          })

          // Set Activities
          if (activitiesRes.ok) {
            setActivities(activitiesData)
          }

          // Generate Upcoming Tasks
          const tasks = []
          
          // 1. Pending Requirements
          reqs.forEach(req => {
            const sub = subs.find(s => s.requirementId === req._id || s.requirementId?.toString() === req._id?.toString())
            if (!sub) {
              tasks.push({
                task: `Upload ${req.title}`,
                deadline: 'Pending submission',
                priority: 'high'
              })
            } else if (sub.status === 'rejected') {
              tasks.push({
                task: `Re-upload ${req.title}`,
                deadline: 'Submission rejected',
                priority: 'high'
              })
            }
          })

          // 2. Missing Journal for today
          const today = new Date().toISOString().split('T')[0]
          const journalToday = journals.find(j => j.date === today)
          if (!journalToday) {
            tasks.push({
              task: 'Submit daily journal',
              deadline: 'Today',
              priority: 'high'
            })
          }

          // 3. Hours Milestone
          if (appHours < reqHours) {
            const remaining = reqHours - appHours
            tasks.push({
              task: `Complete ${remaining} more hours`,
              deadline: 'Internship goal',
              priority: 'medium'
            })
          }

          setUpcomingTasks(tasks)
        }

        await minLoadingTime;
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const stats = [
    {
      title: 'Requirements',
      value: studentStats.requirements,
      icon: <NotebookText />,
      color: 'bg-green-500',
      percentage: studentStats.requirementsPercent,
    },
    {
      title: 'Endorsement Letter',
      value: studentStats.endorsementStatus,
      icon: <CircleCheckBig />,
      color: studentStats.endorsementStatus === 'Deployed' ? 'bg-green-500' : 'bg-yellow-500',
    },
    {
      title: 'Total Hours',
      value: studentStats.hours,
      icon: <Hourglass />,
      color: 'bg-green-500',
      percentage: studentStats.hoursPercent,
    },
    {
      title: 'Journal Entries',
      value: studentStats.journalEntries,
      icon: <BookOpen />,
      color: 'bg-purple-500',
    },
  ]

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 172800) return 'yesterday'
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'requirement_upload': return <FileText size={18} />
      case 'endorsement_request': return <Mail size={18} />
      case 'time_log': return <Clock size={18} />
      case 'journal_submission': return <PenTool size={18} />
      case 'account_verified': return <UserCheck size={18} />
      case 'document_approved': return <CheckCircle size={18} />
      case 'document_rejected': return <XCircle size={18} />
      case 'endorsement_ready': return <FileCheck size={18} />
      case 'endorsement_rejected': return <FileX size={18} />
      case 'milestone': return <Trophy size={18} />
      case 'comment': return <MessageSquare size={18} />
      default: return <BookOpen size={18} />
    }
  }

  return (
    <>
      {/* Block unverified students from accessing the homepage */}
      <PendingApprovalDialog
        isOpen={user && user.isVerified === false}
        onClose={() => { logout(); navigate('/login') }}
      />

      <AppLayout isLoading={isLoading}>
        <style>{scrollbarStyle}</style>

        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName} {user?.lastName}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your internship today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <Skeleton variant="rectangular" height={48} width={48} className="mb-4" />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" height={32} width="40%" />
                <Skeleton variant="rectangular" height={8} className="mt-2" />
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
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
            ))
          )}
        </div>

        {/* Recent Activities + Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              {isLoading ? (
                <Skeleton variant="text" width={150} height={24} />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              )}
            </div>
            <div className="p-6 overflow-y-auto custom-scroll" style={{ maxHeight: '340px' }}>
              <div className="space-y-4">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <Skeleton variant="circular" height={40} width={40} />
                      <div className="flex-1">
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="20%" />
                      </div>
                    </div>
                  ))
                ) : activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`${activity.color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <p className="text-sm italic">No activities yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow flex flex-col">
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              {isLoading ? (
                <Skeleton variant="text" width={150} height={24} />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              )}
            </div>
            <div className="p-6 overflow-y-auto custom-scroll" style={{ maxHeight: '340px' }}>
              <div className="space-y-4">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="border-l-4 border-gray-200 pl-4 py-2">
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="30%" />
                    </div>
                  ))
                ) : upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task, index) => (
                    <div key={index} className={`border-l-4 ${task.priority === 'high' ? 'border-red-500' : 'border-green-500'} pl-4 py-2`}>
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
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <p className="text-sm italic">All caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Hours (2/3) + Overall Progress (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-6 h-[300px]">
                <Skeleton variant="rectangular" height="100%" />
              </div>
            ) : (
              <WeeklyHours weeklyData={weeklyStats} target={40} />
            )}
          </div>
          <div className="lg:col-span-1">
            {isLoading ? (
              <div className="bg-white rounded-lg shadow p-6 h-[300px] flex items-center justify-center">
                <Skeleton variant="circular" height={200} width={200} />
              </div>
            ) : (
              <CircularProgress completed={studentStats.approvedHours} required={studentStats.requiredHours} />
            )}
          </div>
        </div>
      </AppLayout>
    </>
  )
}

export default UserHome