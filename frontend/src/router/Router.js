// ** React Imports
import { Suspense, useContext, lazy, Fragment } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Utils
import { isUserLoggedIn } from '@auth/utils'
import { useLayout } from '@hooks/useLayout'
// import { AbilityContext } from '@src/utility/context/Can'
import { useRouterTransition } from '@hooks/useRouterTransition'

// ** Custom Components
import LayoutWrapper from '@layouts/components/layout-wrapper'

// ** Router Components
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom'

// ** Routes & Default Routes
import { DefaultRoute, Routes } from './routes'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'

const Router = () => {
  // ** Hooks
  const { layout, setLayout, setLastLayout } = useLayout()
  const { transition, setTransition } = useRouterTransition()

  // ** ACL Ability Context
  // const ability = useContext(AbilityContext)

  // ** Default Layout
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }

  // ** Current Active Item
  const currentActiveItem = null

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = []
    const LayoutPaths = []

    if (Routes) {
      Routes.filter(route => {
        // ** Checks if Route layout or Default layout matches current layout
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route)
          LayoutPaths.push(route.path)
        }
      })
    }

    return { LayoutRoutes, LayoutPaths }
  }

  const NotAuthorized = lazy(() => import('@src/views/page/NotAuthorized'))

  // ** Init Error Component
  const Error = lazy(() => import('@src/views/page/Error'))

  const FinalRoute = props => {
    const route = props.route

    let action, resource

    if (route.meta) {
      action = route.meta.action ? route.meta.action : null
      resource = route.meta.resource ? route.meta.resource : null
    }

    if ((!isUserLoggedIn() && route.meta === undefined) || (!isUserLoggedIn() && route.meta && !route.meta.authRoute && !route.meta.publicRoute)) {
      return <Redirect to="/auth/login" />
    } else if (route.meta && route.meta.authRoute && isUserLoggedIn()) {
      // ** If route has meta and authRole and user is Logged in then redirect user to home page (DefaultRoute)
      return <Redirect to="/" />
      // } else if (!isUserLoggedIn()) {
      //   // ** If user is Logged in and doesn't have ability to visit the page redirect the user to Not Authorized
      //   return <Redirect to="/misc/not-authorized" />
    } else {
      // ** If none of the above render component
      return <route.component {...props} />
    }
  }

  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal

      const LayoutTag = Layouts[layout]

      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout)

      const routerProps = {}

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag layout={layout} setLayout={setLayout} transition={transition} routerProps={routerProps} setLastLayout={setLastLayout} setTransition={setTransition} currentActiveItem={currentActiveItem}>
            <Switch>
              {LayoutRoutes.map(route => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={props => {
                      // ** Assign props to routerProps
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta
                      })

                      return (
                        <Fragment>
                          <PerfectScrollbar className="app-master-content" options={{ wheelPropagation: false }}>
                            {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

                            {route.layout === 'BlankLayout' ? (
                              <Fragment>
                                <FinalRoute route={route} {...props} />
                              </Fragment>
                            ) : (
                              <LayoutWrapper
                                layout={DefaultLayout}
                                transition={transition}
                                setTransition={setTransition}
                                /* Conditional props */
                                /*eslint-disable */
                                {...(route.appLayout
                                  ? {
                                      appLayout: route.appLayout
                                    }
                                  : {})}
                                {...(route.meta
                                  ? {
                                      routeMeta: route.meta
                                    }
                                  : {})}
                                {...(route.className
                                  ? {
                                      wrapperClass: route.className
                                    }
                                  : {})}
                                /*eslint-enable */
                              >
                                <Suspense fallback={null}>
                                  <FinalRoute route={route} {...props} />
                                </Suspense>
                              </LayoutWrapper>
                            )}
                          </PerfectScrollbar>
                        </Fragment>
                      )
                    }}
                  />
                )
              })}
            </Switch>
          </LayoutTag>
        </Route>
      )
    })
  }

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}

        <Route
          exact
          path="/"
          render={() => {
            return isUserLoggedIn() ? <Redirect to={DefaultRoute} /> : <Redirect to="/auth/login" />
          }}
        />

        {/* Not Auth Route */}
        <Route
          exact
          path="/misc/not-authorized"
          render={() => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />

        {ResolveRoutes()}

        {/* NotFound Error page */}
        <Route path="*" component={Error} />
      </Switch>
    </AppRouter>
  )
}

export default Router
