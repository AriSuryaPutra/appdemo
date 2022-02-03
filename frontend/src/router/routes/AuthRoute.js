import { lazy } from "react"
import { Redirect } from "react-router-dom"

const AuthRoute = [
  {
    path: "/auth/login",
    component: lazy(() => import("../../views/auth/login")),
    layout: "BlankLayout",
    meta: {
      authRoute: true
    }
  }
]

export default AuthRoute
