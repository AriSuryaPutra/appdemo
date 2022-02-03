import useJwt from './jwt/useJwt'

export const isUserLoggedIn = () => {
  return localStorage.getItem('account') && localStorage.getItem(useJwt.jwtConfig.storageAccessTokenKeyName)
}

export const getAccessToken = () => {
  return localStorage.getItem(useJwt.jwtConfig.storageAccessTokenKeyName)
}

export const getRefreshToken = () => {
  return localStorage.getItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
}

export const getAccountData = () => JSON.parse(localStorage.getItem('account'))

export const redirectAfterLogin = role => {
  if (role === 'ADMIN') return '/dashboard/admin'
  return '/login'
}
