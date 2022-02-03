import { lazy } from 'react'

const DashboardRoutes = [
  {
    path: '/dashboard/admin',
    component: lazy(() => import('../../views/dashboard/admin'))
  }
]

export default DashboardRoutes
