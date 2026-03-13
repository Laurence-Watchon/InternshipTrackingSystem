import { useLocation } from 'react-router-dom'
import Skeleton from './Skeleton'

const PAGE_TITLES = {
  '/user/home':         'Dashboard',
  '/user/requirements': 'Requirements',
  '/user/journal':      'Daily Journal',
  '/user/time-tracking':'Time Tracking',
  '/user/endorsement':  'Endorsement Letter',
  '/user/profile':      'Profile',
  '/admin/home':       'Admin Dashboard',
  '/admin/approvals':  'Pending Approvals',
  '/admin/requirements':  'Requirements Management',
  '/admin/students':  'Student Management',
  '/admin/endorsements': 'Endorsement Management',
  '/admin/students-requirements': 'Student Requirements',
}

export default function PageTitle({ isLoading = false }) {
  const { pathname } = useLocation()
  let title = PAGE_TITLES[pathname]

  if (!title && pathname.startsWith('/admin/students-requirements/')) {
    title = 'Student Requirement Details'
  }

  if (isLoading) {
    return <Skeleton variant="text" width={150} height={28} className="hidden sm:block" />
  }

  return (
    <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
      {title}
    </h1>
  )
}