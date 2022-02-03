import { lazy } from 'react'

const ProgressRoute = [
  {
    path: '/progress/index',
    component: lazy(() => import('../../views/progress'))
  }
]

export default ProgressRoute
