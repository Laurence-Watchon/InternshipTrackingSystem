import { useLocation } from 'react-router-dom'

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

export default function PageTitle() {
  const { pathname } = useLocation()
  let title = PAGE_TITLES[pathname]

  if (!title && pathname.startsWith('/admin/students-requirements/')) {
    title = 'Student Requirement Details'
  }

  return (
    <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
      {title}
    </h1>
  )
}