import { lazy } from 'react'

const PageRoute = [
  {
    path: '/page/coming-soon',
    component: lazy(() => import('../../views/page/ComingSoon')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/page/not-authorized',
    component: lazy(() => import('../../views/page/NotAuthorized')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/page/maintenance',
    component: lazy(() => import('../../views/page/Maintenance')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/page/error',
    component: lazy(() => import('../../views/page/Error')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  }
]

export default PageRoute
