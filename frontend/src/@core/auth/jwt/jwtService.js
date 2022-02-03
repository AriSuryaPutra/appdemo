import api from '@configs/api'
import jwtDefaultConfig from './jwtDefaultConfig'
import { toast } from 'react-toastify'
import { BodyToast } from '@utils'
import { Bell, Check, X, AlertTriangle, Info } from 'react-feather'

// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

// const MySwal = withReactContent(Swal)

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    api.interceptors.request.use(
      config => {
        // ** Get token from localStorage

        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    api.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // ** if (status === 401) {
        if (response && response.status === 401 && response.data.response_code === 'auth_expired') {
          this.refreshToken().then(r => {
            // ** Update accessToken in localStorage
            this.setToken(r.data.accessToken)
            this.setRefreshToken(r.data.refreshToken)

            this.onAccessTokenFetched(r.data.accessToken)
          })

          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header

              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(api(originalRequest))
            })
          })
          return retryOriginalRequest
        } else if (response && response.status === 401) {
          localStorage.removeItem('account')
          localStorage.removeItem(this.jwtConfig.storageAccessTokenKeyName)
          localStorage.removeItem(this.jwtConfig.storageRefreshTokenKeyName)
        } else if (response && response.status === 500) {
          //console.log(response.data.message)

          toast.error(<BodyToast title="Gagal !" message={response.data.message} color="danger" icon={<X size={12} />} />, { icon: false, hideProgressBar: true, position: toast.POSITION.BOTTOM_RIGHT })

          // return MySwal.fire({
          //   icon: 'error',
          //   title: 'Gagal !',
          //   text: response.data.message,
          //   customClass: {
          //     confirmButton: 'btn btn-danger'
          //   }
          // })
        }

        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageAccessTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageAccessTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return api.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return api.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken()

    return api.post(this.jwtConfig.refreshEndpoint, {
      refreshToken
    })
  }
}
