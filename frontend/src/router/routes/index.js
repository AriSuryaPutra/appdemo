// ** Routes Imports
import themeConfig from '@configs/themeConfig'
import AuthRoute from './AuthRoute'
import DashboardRoute from './DashboardRoute'
import AccountRoute from './AccountRoute'
import ProgressRoute from './ProgressRoute'
import PageRoute from './PageRoute'

// ** Document title
const TemplateTitle = `%s - ${themeConfig.app.appName}`

// ** Default Route
const DefaultRoute = '/dashboard/admin'

// ** Merge Routes
const Routes = [...AuthRoute, ...DashboardRoute, ...AccountRoute, ...ProgressRoute, ...PageRoute]

export { DefaultRoute, TemplateTitle, Routes }
