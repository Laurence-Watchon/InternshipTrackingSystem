import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/user/home':         'Dashboard',
  '/user/requirements': 'Requirements',
  '/user/journal':      'Journal',
  '/user/time-tracking':'Time Tracking',
  '/user/endorsement':  'Endorsement Letter',
  '/user/profile':      'Profile',
}

export default function PageTitle() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Dashboard'

  return (
    <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
      {title}
    </h1>
  )
}