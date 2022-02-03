import { lazy } from 'react'

const AccountRoute = [
  {
    path: '/account/list',
    exact: true,
    appLayout: true,
    className: 'account',
    component: lazy(() => import('../../views/account'))
  }
  // {
  //   path: '/account/list/trash',
  //   exact: true,
  //   appLayout: true,
  //   className: 'account',
  //   component: lazy(() => import('../../views/account'))
  // }
]

export default AccountRoute
